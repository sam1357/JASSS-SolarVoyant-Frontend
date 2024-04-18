describe("Signup Page", () => {
  const username = "validuser";
  const email = `${Math.random().toString(36).substring(2, 15)}@test.com`;
  const password = "strongpassword";

  beforeEach(() => {
    // delete the user after the test
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
    cy.visit("/signup"); // Change '/signup' to the actual URL of your signup page
  });

  it("should display validation errors when submitting empty form", () => {
    cy.get("button[type=submit]").click();

    cy.get("input[name=username]").should("have.attr", "aria-invalid", "true");
    cy.get("input[name=email]").should("have.attr", "aria-invalid", "true");
    cy.get("input[name=password]").should("have.attr", "aria-invalid", "true");
    cy.get("input[name=confirmPassword]").should("have.attr", "aria-invalid", "true");
  });

  it("should display validation errors when submitting invalid data", () => {
    cy.get("input[name=username]").type("user!@#");
    cy.get("input[name=email]").type("invalidemail");
    cy.get("input[name=password]").type("short");
    cy.get("input[name=confirmPassword]").type("notmatching");

    cy.get("button[type=submit]").click();

    cy.contains("Username can only contain alphanumeric characters");
    cy.contains("Please provide a valid email.");
    cy.contains("Password must contain at least 6 characters.");
    cy.contains("Passwords must match.");
  });

  it("should succeed with full register, sign out, login flow", () => {
    cy.get("input[name=username]").type(username);
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[name=confirmPassword]").type(password);

    cy.get("button[type=submit]").click();

    // eslint-disable-next-line
    cy.wait(6000);
    cy.reload();
    cy.url().should("contain", "/dashboard/overview");
  });

  it("signup page link works", function () {
    cy.get('a[href*="/login"]').click();
    cy.url().should("contain", "/login");
  });
});
