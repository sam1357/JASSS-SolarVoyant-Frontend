describe("The Login Page", () => {
  it("checks that input validation is correct", () => {
    cy.visit("/login");
    cy.get("button").contains("Login").click();
    cy.contains("Email is required.");
    cy.contains("Password is required.");

    cy.get("input[name=email]").type("a");
    cy.get("input[name=password]").type("a");
    cy.get("button").contains("Login").click();
    cy.contains("Please provide a valid email.");

    cy.get("input[name=email]").clear();
  });

  it("successfully redirects on success", function () {
    const email = "a@a.com";
    const password = "a";

    cy.login(email, password);
  });

  it("check that once logged in, home page should no longer have login button", function () {
    const email = "a@a.com";
    const password = "a";

    cy.login(email, password);
    cy.visit("/");
    cy.get("button[name=login]").should("not.exist");
  });

  it("check that incorrect credentials show error", function () {
    cy.visit("/login");

    cy.get("input[name=email]").type("weuofweiofjowejfowiej@weiofjoweij.com");
    cy.get("input[name=password]").type(`${"fwehfuiowejo"}{enter}`, { log: false });

    cy.contains("Authentication Error");
  });

  it("signup page link works", function () {
    cy.visit("/login");

    cy.get('a[href*="/signup"]').click();
    cy.url().should("contain", "/signup");
  });
});
