describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
  });

  it("checks that the page contains the correct elements", () => {
    cy.visit("/");
    cy.contains("Home");
    cy.contains("Dashboard");
    cy.contains("Documentation");
    cy.contains("Login");
    cy.get("[aria-label='Colour mode toggle']").should("exist");
  });

  it("checks that the button links work", () => {
    cy.visit("/");
    cy.get('a[href*="dashboard/overview"]').click({ multiple: true });

    // not logged in
    cy.url().should("contain", "/login");
  });
});
