describe("The Password Reset Page", () => {
  const email = "a@a.com";

  beforeEach(() => {
    cy.visit("/forgot-password"); // Change '/signup' to the actual URL of your signup page
  });

  it("checks that input validation is correct", () => {
    cy.get("input[name=email]").clear();
    cy.get("button").contains("Send Password Reset Email").click();
    cy.contains("Email is required.");

    cy.get("input[name=email]").type("a");
    cy.get("button").contains("Send Password Reset Email").click();
    cy.contains("Email is invalid.");

    cy.get("input[name=email]").clear();
    cy.contains("Email is required.");
  });

  it("providing a 'valid' email address", () => {
    cy.get("input[name=email]").type(email);
    cy.get("button").contains("Send Password Reset Email").click();
    cy.contains("Enter Token"); // should navigate to next step

    cy.get("button").contains("Back").click();
    cy.get("button").contains("Cancel").click();

    cy.contains("Enter Token"); // should stay on same page
    cy.get("button").contains("Back").click();
    cy.get("button").contains("Proceed").click();

    cy.contains("Forgot Password?"); // should navigate to next step

    cy.get("input[name=email]").type(email);
    cy.get("button").contains("Send Password Reset Email").click();

    cy.get("input[name=token]").type("123");

    cy.get("button").contains("Next").click();

    cy.contains("Enter Password"); // should navigate to next step
    cy.get("button").contains("Back").click();

    cy.contains("Enter Token"); // should stay on same page
    cy.get("input[name=token]").type("123");
    cy.get("button").contains("Next").click();

    cy.get("input[name=password]").type("123");
    cy.get("button").contains("Reset Password").click();

    cy.contains("Password must be at least 6 characters.");
    cy.get("input[name=password]").clear();
    cy.get("input[name=password]").type("123456");
    cy.get("button").contains("Reset Password").click();

    cy.contains("Invalid Token");
  });
});
