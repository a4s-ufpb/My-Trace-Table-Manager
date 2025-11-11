describe('Fluxo de Criação de Exercício com Navegação para Temas', () => {

    beforeEach(() => {
        cy.intercept('GET', '**/v1/theme/user/*', {
            statusCode: 200,
            body: { content: [{ id: 1, name: 'Listas' }, { id: 2, name: 'Loops' }] }
        }).as('getInitialThemes');
        cy.intercept('GET', '**/v1/trace/user/*', {
            statusCode: 200,
            body: { content: [] }
        }).as('getInitialTraceTables');
        cy.loginAsAdmin();
    });

    it('deve manter o rascunho do exercício ao ir cadastrar um tema e voltar', () => {
        cy.visit('/#/new-exercise');
        cy.wait(['@getInitialThemes', '@getInitialTraceTables']);

        cy.getByData('exercise-name-input').type('Meu Exercício de Teste');
        cy.getByData('multi-select-input').click();
        cy.getByData('multi-select-item-1').click();

        cy.intercept('GET', '**/v1/theme/user/*?page=0&size=5', {
            statusCode: 200,
            body: { content: [{ id: 1, name: 'Listas' }, { id: 2, name: 'Loops' }] }
        }).as('getThemesOnThemePage');

        cy.getByData('new-theme-button').click();

        cy.wait('@getThemesOnThemePage');
        cy.hash().should('eq', '#/new-theme');

        const newThemeName = 'Funções';

        cy.intercept('POST', '**/v1/theme/*', {
            statusCode: 201,
            body: { id: 3, name: newThemeName }
        }).as('createTheme');
        cy.intercept('GET', '**/v1/theme/user/*?page=0&size=5', {
            statusCode: 200,
            body: { content: [{ id: 1, name: 'Listas' }, { id: 2, name: 'Loops' }, { id: 3, name: newThemeName }] }
        }).as('getThemesAfterCreate');

        cy.getByData('theme-name-input').type(newThemeName);
        cy.getByData('register-button').click();

        cy.wait(['@createTheme', '@getThemesAfterCreate']);
        cy.contains('button', 'Voltar').click();

        cy.hash().should('eq', '#/new-exercise');
        cy.getByData('exercise-name-input').should('have.value', 'Meu Exercício de Teste');
        cy.getByData('multi-select-selected-1').should('contain', 'Listas');
        cy.getByData('file-input').selectFile('cypress/fixtures/test-image.png');
        cy.getByData('proceed-button').click();
        cy.hash().should('eq', '#/shownTable');
        cy.log('BUG CORRIGIDO: Navegação ocorreu para a página correta!');
    });
});