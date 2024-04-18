describe("UserDataContainer", () => {
  const username = "testUser";
  const email = `${Math.random().toString(36).substring(2, 15)}@test.com`; // random email
  const password = "testPassword";

  beforeEach(() => {
    cy.signup(username, email, password);
    cy.visit("/dashboard/settings");
  });

  afterEach(() => {
    cy.get("[id=test-delete-account]").click();
    cy.get("button").contains("Delete").click();

    // url should no longer be /dashboard/settings
    cy.url().should("not.include", "/dashboard/settings");
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
