/// <reference types="cypress" />

// eslint-disable-next-line
declare namespace Cypress {
  // eslint-disable-next-line
  interface Chainable<Subject = any> {
    // eslint-disable-next-line
    login(username: string, login: string): Chainable<any>;
    // eslint-disable-next-line
    signup(username: string, email: string, password: string): Chainable<any>;
  }
}
