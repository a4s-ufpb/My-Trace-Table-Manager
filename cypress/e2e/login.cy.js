describe('Página de Login', () => {

  beforeEach(() => {
    cy.visit('/#/login')
  })

  it('deve permitir o login com credenciais válidas e redirecionar para a home', () => {
    cy.login('teste@gmail.com', 'teste123');

    cy.hash().should('eq', '#/');
    cy.getByData('home-new-exercise-button').should('be.visible');
  })

  it('deve exibir um popup de erro com credenciais inválidas', () => {
    cy.login('teste@gmail.com', 'senha-errada-123');

    cy.contains('[data-testid="message-popup"]', 'Email ou senha inválidos');
    cy.hash().should('eq', '#/login');
  });

  it('deve alternar a visibilidade da senha ao clicar no ícone', () => {
    cy.getByData('login-password-input').type('senha-secreta');
    cy.getByData('login-password-input').should('have.attr', 'type', 'password');

    cy.getByData('login-password-toggle').click();
    cy.getByData('login-password-input').should('have.attr', 'type', 'text');

    cy.getByData('login-password-toggle').click();
    cy.getByData('login-password-input').should('have.attr', 'type', 'password');
  });

  it('não deve permitir o envio do formulário se o email estiver vazio', () => {
    cy.getByData('login-password-input').type('qualquer-senha');
    cy.getByData('login-form').submit();

    cy.getByData('login-email-input')
      .invoke('prop', 'validity')
      .its('valid')
      .should('be.false');

    cy.hash().should('eq', '#/login');
  });

  it('não deve permitir o envio do formulário se a senha estiver vazia', () => {
    cy.getByData('login-email-input').type('teste@teste.com');
    cy.getByData('login-form').submit();

    cy.getByData('login-password-input')
      .invoke('prop', 'validity')
      .its('valid')
      .should('be.false');

    cy.hash().should('eq', '#/login');
  });
})