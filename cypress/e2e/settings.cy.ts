describe("UserDataContainer", () => {
  const username = "testUser";
  const email = `${Math.random().toString(36).substring(2, 15)}@test.com`; // random email
  const password = "testPassword";

  beforeEach(() => {
    cy.signup(username, email, password);
    cy.visit("/dashboard/settings");
  });

  afterEach(() => {
    cy.request({
      method: "POST",
      url: "/api/auth/login",
      body: JSON.stringify({ email, password }),
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200) {
        const userID = res.body.user.id;
        expect(userID).to.not.equal("");
        cy.request("DELETE", `/api/deleteUser`, { userID }).then((res) => {
          expect(res.status).to.equal(200);
        });
      }
    });
  });

  it("allows updating username", () => {
    const newUsername = "newUsername";

    // Type new username into the input field and submit the form
    cy.get('input[name="username"]').clear();
    cy.get('input[name="username"]').type(newUsername);
    cy.get("Button").contains("Update Details").click();

    // Ensure success message is displayed
    cy.get(".chakra-alert").should("contain.text", "Success");
  });

  it("allows changing password", () => {
    // Type current and new password into the input fields and submit the form
    cy.get('input[name="currentPassword"]').clear();
    cy.get('input[name="currentPassword"]').type(password);
    cy.get('input[name="newPassword"]').clear();
    cy.get('input[name="newPassword"]').type("abcdef");
    cy.get("Button").contains("Change Password").click();

    // Ensure success message is displayed
    cy.get(".chakra-alert").should("contain.text", "Success");
    // sign out and sign in with new password
    cy.get("button").contains("Sign Out").click({ force: true });
    cy.login(email, "abcdef");

    cy.visit("/dashboard/settings");
    cy.contains(username);
  });
});
