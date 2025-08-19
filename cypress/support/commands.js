Cypress.Commands.add('getByData', (selector) => {
    return cy.get(`[data-testid="${selector}"]`);
});

Cypress.Commands.add('login', (email, password) => {
    cy.getByData('login-email-input').type(email);
    cy.getByData('login-password-input').type(password);
    cy.getByData('login-submit-button').click();
});