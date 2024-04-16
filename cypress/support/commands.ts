Cypress.Commands.add("login", (username: string, password: string) => {
  cy.visit("/login");

  cy.get("input[name=email]").type(username);

  // {enter} causes the form to submit
  cy.get("input[name=password]").type(`${password}{enter}`, { log: false });
  // eslint-disable-next-line
  cy.wait(6000);

  // we should be redirected to /dashboard
  cy.reload();
  cy.url().should("contain", "/dashboard/overview");
});

Cypress.Commands.add("signup", (username: string, email: string, password: string) => {
  cy.visit("/signup");

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
