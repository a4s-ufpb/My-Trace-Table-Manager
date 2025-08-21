describe('Página de Gerenciamento de Temas', () => {

    context('quando a lista de temas já possui dados', () => {
        beforeEach(() => {
            cy.loginAsAdmin();
            cy.intercept('GET', '**/theme/user/*?page=0&size=5', {
                statusCode: 200,
                body: {
                    content: [{ id: 1, name: 'Listas' }, { id: 2, name: 'Condicionais' }],
                    totalPages: 2,
                    number: 0,
                    size: 5
                },
            }).as('getThemes');
            cy.visit('/#/new-theme');
            cy.wait('@getThemes');
        });

        it('deve exibir a lista inicial de temas corretamente', () => {
            cy.getByData('theme-form').should('be.visible');
            cy.getByData('items-list').should('be.visible');
            cy.getByData('list-item-1').should('contain', 'Listas');
            cy.getByData('list-item-2').should('contain', 'Condicionais');
        });

        it('deve editar um tema existente', () => {
            const updatedThemeName = 'Listas com For';
            cy.intercept('PUT', '**/theme/1/*', {
                statusCode: 200,
                body: { id: 1, name: updatedThemeName },
            }).as('updateTheme');
            cy.intercept('GET', '**/theme/user/*?page=0&size=5', {
                statusCode: 200,
                body: {
                    content: [{ id: 1, name: updatedThemeName }, { id: 2, name: 'Condicionais' }],
                    totalPages: 1,
                    number: 0,
                    size: 5
                },
            }).as('getThemesAfterUpdate');
            cy.getByData('edit-icon-1').click();
            cy.getByData('theme-name-input').clear().type(updatedThemeName);
            cy.getByData('save-edit-button').click();
            cy.wait(['@updateTheme', '@getThemesAfterUpdate']);
            cy.contains('[data-testid="message-popup"]', 'Tema editado com sucesso!');
            cy.getByData('list-item-1').should('contain', updatedThemeName);
        });

        it('deve deletar um tema e confirmar', () => {
            cy.intercept('DELETE', '**/theme/2/*', { statusCode: 204, body: {} }).as('deleteTheme');
            cy.intercept('GET', '**/theme/user/*?page=0&size=5', {
                statusCode: 200,
                body: {
                    content: [{ id: 1, name: 'Listas' }],
                    totalPages: 1,
                },
            }).as('getThemesAfterDelete');
            cy.getByData('delete-icon-2').click();
            cy.getByData('attention-popup').should('be.visible');
            cy.getByData('attention-confirm').click();
            cy.wait(['@deleteTheme', '@getThemesAfterDelete']);
            cy.contains('[data-testid="message-popup"]', 'Tema removido com sucesso!');
            cy.getByData('list-item-2').should('not.exist');
        });

        it('deve abrir e fechar o popup de ajuda', () => {
            cy.getByData('help-popup').should('not.exist');
            cy.getByData('help-icon').click();
            cy.getByData('help-popup').should('be.visible');
            cy.getByData('help-popup-close-button').click();
            cy.getByData('help-popup').should('not.exist');
        });

        it('deve limpar o formulário e voltar ao modo de cadastro ao cancelar uma edição', () => {
            cy.getByData('edit-icon-1').click();
            cy.contains('h2', 'Editar tema').should('be.visible');
            cy.getByData('theme-name-input').should('have.value', 'Listas');
            cy.getByData('cancel-edit-button').click();
            cy.contains('h2', 'Cadastrar novo tema').should('be.visible');
            cy.getByData('theme-name-input').should('have.value', '');
            cy.getByData('register-button').should('be.visible');
        });

        it('deve buscar e exibir os temas da segunda página ao clicar na paginação', () => {
            cy.intercept('GET', '**/theme/user/*?page=1&size=5', {
                statusCode: 200,
                body: {
                    content: [{ id: 3, name: 'Variáveis' }],
                    totalPages: 2,
                    number: 1,
                    size: 5
                },
            }).as('getThemesPage1');

            cy.getByData('next-page-button').click();

            cy.wait('@getThemesPage1');
            cy.getByData('list-item-3').should('contain', 'Variáveis');
            cy.getByData('list-item-1').should('not.exist');
        });

        it('não deve permitir o envio do formulário se o nome do tema estiver vazio', () => {
            cy.getByData('theme-form').submit();
            cy.getByData('theme-name-input')
                .invoke('prop', 'validity')
                .its('valid')
                .should('be.false');
            cy.hash().should('eq', '#/new-theme');
        });

        it('deve exibir um popup de erro se a API falhar ao cadastrar', () => {
            cy.intercept('POST', '**/theme/*', {
                statusCode: 400,
                body: { message: 'Este nome de tema já existe.' },
            }).as('createThemeError');

            cy.getByData('theme-name-input').type('Listas');
            cy.getByData('register-button').click();

            cy.wait('@createThemeError');
            cy.contains('[data-testid="message-popup"]', 'Este nome de tema já existe.');
        });

        it('deve navegar para a Página de Ajuda ao clicar em "Mais informações" no popup', () => {
            cy.getByData('help-icon').click();
            cy.getByData('help-popup').should('be.visible');

            cy.getByData('help-popup-more-info').click();

            cy.hash().should('eq', '#/help-page');

            cy.contains('h2', 'Tópicos de Ajuda').should('be.visible');
        });
    });

    context('quando a lista de temas está vazia', () => {
        beforeEach(() => {
            cy.loginAsAdmin();
            cy.intercept('GET', '**/theme/user/*?page=0&size=5', {
                statusCode: 200,
                body: {
                    content: [],
                    totalPages: 0,
                    number: 0,
                    size: 5
                }
            }).as('getEmptyThemes');
            cy.visit('/#/new-theme');
            cy.wait('@getEmptyThemes');
        });

        it('deve exibir a mensagem de "Não há temas!"', () => {
            cy.getByData('items-list').should('not.exist');
            cy.getByData('no-themes-message').should('be.visible').and('contain', 'Não há temas!');
        });

        it('deve ser capaz de cadastrar o primeiro tema com sucesso', () => {
            const firstTheme = 'Meu Primeiro Tema';
            cy.intercept('POST', '**/theme/*', {
                statusCode: 201,
                body: { id: 1, name: firstTheme },
            }).as('createFirstTheme');
            cy.intercept('GET', '**/theme/user/*?page=0&size=5', {
                statusCode: 200,
                body: {
                    content: [{ id: 1, name: firstTheme }],
                    totalPages: 1,
                },
            }).as('getThemesAfterFirstCreate');
            cy.getByData('theme-name-input').type(firstTheme);
            cy.getByData('register-button').click();
            cy.wait(['@createFirstTheme', '@getThemesAfterFirstCreate']);
            cy.getByData('no-themes-message').should('not.exist');
            cy.getByData('list-item-1').should('be.visible').and('contain', firstTheme);
        });
    });
});