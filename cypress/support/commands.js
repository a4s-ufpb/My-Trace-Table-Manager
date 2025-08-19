Cypress.Commands.add('getByData', (selector) => {
    return cy.get(`[data-testid="${selector}"]`);
});

Cypress.Commands.add('login', (email, password) => {
    cy.getByData('login-email-input').type(email);
    cy.getByData('login-password-input').type(password);
    cy.getByData('login-submit-button').click();
});

Cypress.Commands.add('loginAsAdmin', () => {
    cy.getByData('login-email-input').type('elk@gmail.com');
    cy.getByData('login-password-input').type('elk12345');
    cy.getByData('login-submit-button').click();
    cy.hash().should('eq', '#/');
});