describe('Página de Gerenciamento de Professores', () => {

    beforeEach(() => {
        cy.visit('/#/login');
        cy.loginAsAdmin();

        cy.intercept('GET', '**/v1/user/all?page=0&size=5', {
            statusCode: 200,
            body: {
                content: [
                    { id: 1, name: 'Professor Dumbledore', email: 'dumbledore@hogwarts.com', role: 'admin' },
                    { id: 2, name: 'Professora Minerva', email: 'minerva@hogwarts.com', role: 'user' },
                ],
                totalPages: 2,
                number: 0,
                size: 5
            },
        }).as('getProfessorsPage0');

        cy.visit('/#/new-professor');
        cy.wait('@getProfessorsPage0');
    });

    it('deve exibir a lista inicial de professores corretamente', () => {
        cy.getByData('professor-form').should('be.visible');
        cy.getByData('items-list').should('be.visible');
        cy.getByData('list-item-1').should('contain', 'Professor Dumbledore');
        cy.getByData('list-item-2').should('contain', 'Professora Minerva');
    });

    it('deve cadastrar um novo professor com sucesso', () => {
        const newProfessor = { name: 'Professor Snape', email: 'snape@hogwarts.com', password: 'password123', role: 'user' };

        cy.intercept('POST', '**/v1/user/register', {
            statusCode: 201,
            body: { id: 3, name: newProfessor.name, email: newProfessor.email, role: newProfessor.role },
        }).as('createProfessor');

        cy.intercept('GET', '**/v1/user/all?page=0&size=5', {
            statusCode: 200,
            body: {
                content: [
                    { id: 1, name: 'Professor Dumbledore', email: 'dumbledore@hogwarts.com', role: 'admin' },
                    { id: 2, name: 'Professora Minerva', email: 'minerva@hogwarts.com', role: 'user' },
                    { id: 3, name: newProfessor.name, email: newProfessor.email, role: newProfessor.role },
                ],
                totalPages: 1,
                number: 0,
                size: 5
            },
        }).as('getProfessorsAfterCreate');

        cy.getByData('professor-name-input').type(newProfessor.name);
        cy.getByData('professor-email-input').type(newProfessor.email);
        cy.getByData('professor-password-input').type(newProfessor.password);
        cy.getByData('professor-role-select').select(newProfessor.role);
        cy.getByData('register-button').click();

        cy.wait(['@createProfessor', '@getProfessorsAfterCreate']);
        cy.contains('[data-testid="message-popup"]', 'Professor cadastrado com sucesso!');
        cy.getByData('list-item-3').should('contain', newProfessor.name);
        cy.getByData('professor-name-input').should('have.value', '');
    });

    it('deve editar um professor existente', () => {
        const updatedName = 'Albus Dumbledore';

        cy.intercept('PATCH', '**/v1/user/1', {
            statusCode: 200,
            body: { id: 1, name: updatedName, email: 'dumbledore@hogwarts.com', role: 'admin' },
        }).as('updateProfessor');

        cy.intercept('GET', '**/v1/user/all?page=0&size=5', {
            statusCode: 200,
            body: {
                content: [
                    { id: 1, name: updatedName, email: 'dumbledore@hogwarts.com', role: 'admin' },
                    { id: 2, name: 'Professora Minerva', email: 'minerva@hogwarts.com', role: 'user' },
                ],
                totalPages: 1,
                number: 0,
                size: 5
            },
        }).as('getProfessorsAfterUpdate');

        cy.getByData('edit-icon-1').click();
        cy.getByData('professor-name-input').clear().type(updatedName);
        cy.getByData('save-edit-button').click();

        cy.wait(['@updateProfessor', '@getProfessorsAfterUpdate']);
        cy.contains('[data-testid="message-popup"]', 'Professor atualizado com sucesso!');
        cy.getByData('list-item-1').should('contain', updatedName);
    });

    it('deve deletar um professor', () => {
        cy.intercept('DELETE', '**/v1/user/2', {
            statusCode: 204,
            body: {},
        }).as('deleteProfessor');

        cy.intercept('GET', '**/v1/user/all?page=0&size=5', {
            statusCode: 200,
            body: {
                content: [
                    { id: 1, name: 'Professor Dumbledore', email: 'dumbledore@hogwarts.com', role: 'admin' },
                ],
                totalPages: 1,
                number: 0,
                size: 5
            },
        }).as('getProfessorsAfterDelete');

        cy.getByData('delete-icon-2').click();

        cy.getByData('attention-popup').should('be.visible');
        cy.getByData('attention-confirm').click();

        cy.wait(['@deleteProfessor', '@getProfessorsAfterDelete']);
        cy.contains('[data-testid="message-popup"]', 'Professor removido com sucesso!');
        cy.getByData('list-item-2').should('not.exist');
    });

    it('deve fechar o popup de confirmação e não deletar o professor ao clicar em "Cancelar"', () => {
        cy.getByData('delete-icon-2').click();

        cy.getByData('attention-popup').should('be.visible');
        cy.getByData('attention-cancel').click();

        cy.getByData('attention-popup').should('not.exist');

        cy.getByData('list-item-2').should('be.visible').and('contain', 'Professora Minerva');
    });

    it('não deve permitir o envio do formulário se o nome estiver vazio', () => {
        cy.getByData('professor-email-input').type('novo.prof@escola.com');
        cy.getByData('professor-password-input').type('senhaforte123');
        cy.getByData('register-button').click();

        cy.getByData('professor-name-input')
            .invoke('prop', 'validity')
            .its('valid')
            .should('be.false');
    });

    it('não deve permitir o envio do formulário se o email estiver vazio', () => {
        cy.getByData('professor-name-input').type('Novo Professor');
        cy.getByData('professor-password-input').type('senhaforte123');

        cy.getByData('professor-form').submit();

        cy.getByData('professor-email-input')
            .invoke('prop', 'validity')
            .its('valid')
            .should('be.false');

        cy.hash().should('eq', '#/new-professor');
    });

    it('não deve permitir o envio do formulário se a senha estiver vazia', () => {
        cy.getByData('professor-name-input').type('Novo Professor');
        cy.getByData('professor-email-input').type('novo.prof@escola.com');

        cy.getByData('professor-form').submit();

        cy.getByData('professor-password-input')
            .invoke('prop', 'validity')
            .its('valid')
            .should('be.false');

        cy.hash().should('eq', '#/new-professor');
    });

    it('deve limpar o formulário e voltar ao modo de cadastro ao cancelar uma edição', () => {
        cy.getByData('edit-icon-1').click();

        cy.contains('h2', 'Editar professor').should('be.visible');
        cy.getByData('professor-name-input').should('have.value', 'Professor Dumbledore');

        cy.getByData('cancel-edit-button').click();

        cy.contains('h2', 'Cadastrar novo professor').should('be.visible');
        cy.getByData('professor-name-input').should('have.value', '');
        cy.getByData('register-button').should('be.visible');
    });

    it('deve buscar e exibir os professores da segunda página ao clicar na paginação', () => {
        cy.intercept('GET', '**/v1/user/all?page=1&size=5', {
            statusCode: 200,
            body: {
                content: [
                    { id: 3, name: 'Professor Lupin', email: 'lupin@hogwarts.com', role: 'user' },
                ],
                totalPages: 2,
                number: 1,
                size: 5
            },
        }).as('getProfessorsPage1');

        cy.getByData('next-page-button').click();

        cy.wait('@getProfessorsPage1');
        cy.getByData('list-item-3').should('contain', 'Professor Lupin');
        cy.getByData('list-item-1').should('not.exist');
    });
});