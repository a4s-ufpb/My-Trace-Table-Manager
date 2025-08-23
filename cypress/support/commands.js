Cypress.Commands.add('getByData', (selector) => {
    return cy.get(`[data-testid="${selector}"]`);
});

Cypress.Commands.add('login', (email, password) => {
    cy.getByData('login-email-input').type(email);
    cy.getByData('login-password-input').type(password);
    cy.getByData('login-submit-button').click();
});

Cypress.Commands.add('loginAsAdmin', () => {
    cy.log('Efetuando login programático completo como Admin');
    cy.window().then((win) => {
        const adminUser = { id: 1, name: 'Admin de Teste', role: 'admin' };
        const expirationTime = Date.now() + 3600 * 1000;

        win.localStorage.setItem('token', 'fake-admin-token-para-testes');
        win.localStorage.setItem('userRole', 'admin');
        win.localStorage.setItem('userId', '1');
        win.localStorage.setItem('user', JSON.stringify(adminUser));
        win.localStorage.setItem('tokenExpiration', expirationTime);
    });
});