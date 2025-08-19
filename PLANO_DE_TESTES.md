# Plano de Testes E2E (End-to-End)

Este documento descreve os cenários de teste automatizados para a aplicação, executados com Cypress. O objetivo é garantir que os fluxos críticos do usuário funcionem como esperado.

---

## Plano de Teste: Autenticação

### Página de Login (`login.cy.js`)

| ID do Teste | Cenário de Teste | Passos Principais | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- | :--- |
| **LOGIN-001** | Login com sucesso | 1. Preencher email e senha válidos.<br>2. Clicar em "Entrar". | O usuário é redirecionado para a página Home (`/#/`). | Automatizado ✅ |
| **LOGIN-002** | Login com credenciais inválidas | 1. Preencher email válido e senha inválida.<br>2. Clicar em "Entrar". | Um popup de erro com a mensagem "Email ou senha inválidos" é exibido. O usuário permanece na página de login. | Automatizado ✅ |
| **LOGIN-003** | Visibilidade da senha | 1. Digitar no campo de senha.<br>2. Clicar no ícone de "olho".<br>3. Clicar novamente no ícone. | O tipo do campo de senha alterna entre `password` e `text`, mostrando e escondendo o texto. | Automatizado ✅ |
| **LOGIN-004** | Validação de campo de email vazio | 1. Deixar o campo de email vazio.<br>2. Preencher a senha.<br>3. Tentar submeter o formulário. | A submissão é bloqueada e o campo de email é marcado como inválido pelo navegador. | Automatizado ✅ |
| **LOGIN-005** | Validação de campo de senha vazio | 1. Preencher o email.<br>2. Deixar o campo de senha vazio.<br>3. Tentar submeter o formulário. | A submissão é bloqueada e o campo de senha é marcado como inválido pelo navegador. | Automatizado ✅ |

---

## Plano de Teste: Gerenciamento de Professores

### Página de Gerenciamento de Professores (`professor.cy.js`)

| ID do Teste | Cenário de Teste | Passos Principais | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- | :--- |
| **PROF-001** | Exibição da lista inicial | 1. Fazer login como admin.<br>2. Acessar a página de professores. | O formulário de cadastro e a lista inicial de professores (mockada) são exibidos corretamente. | Automatizado ✅ |
| **PROF-002** | Cadastro de novo professor | 1. Preencher todos os campos do formulário.<br>2. Clicar em "Cadastrar". | Um popup de sucesso é exibido, o novo professor aparece na lista e o formulário é limpo. | Automatizado ✅ |
| **PROF-003** | Edição de professor existente | 1. Clicar no ícone de editar de um professor.<br>2. Alterar o nome.<br>3. Clicar em "Salvar". | Um popup de sucesso é exibido e o nome do professor na lista é atualizado. | Automatizado ✅ |
| **PROF-004** | Deleção de professor | 1. Clicar no ícone de lixeira de um professor.<br>2. Clicar em "Sim" no popup de confirmação. | Um popup de sucesso é exibido e o professor é removido da lista. | Automatizado ✅ |
| **PROF-005** | Cancelamento da deleção | 1. Clicar no ícone de lixeira.<br>2. Clicar em "Cancelar" (ou "Não") no popup. | O popup de confirmação desaparece e o professor **não** é removido da lista. | Automatizado ✅ |
| **PROF-006** | Cancelamento da edição | 1. Clicar no ícone de editar.<br>2. Clicar em "Cancelar". | O formulário é limpo, o título volta para "Cadastrar" e o modo de edição é desativado. | Automatizado ✅ |
| **PROF-007** | Validação de campos obrigatórios | 1. Tentar cadastrar um professor sem preencher um campo `required` (ex: nome). | A submissão é bloqueada e o campo correspondente é marcado como inválido. | Automatizado ✅ |
| **PROF-008** | Tratamento de erro da API | 1. Tentar cadastrar um professor com dados que causem um erro na API (ex: email duplicado). | Um popup de erro com a mensagem da API é exibido e a lista de professores não é alterada. | Automatizado ✅ |
| **PROF-009** | Funcionalidade de paginação | 1. Clicar no botão "Próximo". | Uma nova chamada de API para a próxima página é feita e a lista é atualizada com os novos professores. | Automatizado ✅ |