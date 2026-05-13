import { test, expect } from "@playwright/test";
import { RegisterPage } from '../pages/RegisterPage';
import dataMass from '../fixtures/users.json';

let registerPage: RegisterPage;

test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);

    await page.goto('/');
    await expect(page).toHaveTitle("BugBank | O banco com bugs e falhas do seu jeito");
    
});

test('TC 01 - Deve registrar um novo usuário com sucesso com a opção "Criar conta com saldo" ativada)', async ({ page }) => {
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail(dataMass.createUserWithCash.email);
    await registerPage.preencherNome(dataMass.createUserWithCash.username);
    await registerPage.preencherSenha(dataMass.createUserWithCash.password);
    await registerPage.preencherConfirmacaoSenha(dataMass.createUserWithCash.password);
    await registerPage.criarContaComSaldo();
    await registerPage.cadastrarConta();

    //Verificando se a conta foi criada
    await expect(registerPage.modalText).toBeVisible();
    await registerPage.fecharModal();
});

test('TC 02 - Deve registrar um novo usuário com sucesso com a opção "Criar conta com saldo" desativada).', async ({ page }) => {
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail(dataMass.createUserWithCash.email);
    await registerPage.preencherNome(dataMass.createUserWithCash.username);
    await registerPage.preencherSenha(dataMass.createUserWithCash.password);
    await registerPage.preencherConfirmacaoSenha(dataMass.createUserWithCash.password);
    await registerPage.cadastrarConta();
    //Verificando se a conta foi criada
    await expect(registerPage.modalText).toBeVisible();
    await registerPage.fecharModal();
})

test('TC 03a - Deve exibir modal de erro ao deixar apenas o NOME vazio', async ({ page }) => {
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail(dataMass.createUserWithCash.email);
    await registerPage.preencherSenha(dataMass.createUserWithCash.password);
    await registerPage.preencherConfirmacaoSenha(dataMass.createUserWithCash.password);
    await registerPage.criarContaComSaldo();
    await registerPage.cadastrarConta();
    //Verificando se aparece alguma mensagem que nome não pode ser vazio
    await expect(registerPage.modalText).toBeVisible();
    await expect(registerPage.modalText).toContainText('Nome não pode ser vazio');
})

test('TC 03b - Deve exibir uma mensagem de erro ao deixar apenas o NOME preenchido', async ({ page }) => {
    //Formulário de Cadastro
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherNome(dataMass.createUserWithCash.username);
    await registerPage.cadastrarConta();

    //Verificando se aparece alguma mensagem que nome não pode ser vazio
    await expect(registerPage.inputWarning).toBeVisible();
    await expect(registerPage.inputWarning).toContainText('É campo obrigatório');
})

test('TC 04 - Deve barrar o registro de um novo usuário com as senhas divergentes', async ({ page }) => {
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail(dataMass.createUserWithCash.email);
    await registerPage.preencherNome(dataMass.createUserWithCash.username);
    await registerPage.preencherSenha(dataMass.createUserWithCash.password);
    await registerPage.preencherConfirmacaoSenha('dataMass.createUserWithCash.password');
    await registerPage.cadastrarConta();

    //Verificando se aparece alguma mensagem que as senhas não são iguais
    await expect(registerPage.modalText).toBeVisible();
    await expect(registerPage.modalText).toContainText('As senhas não são iguais.');
})

test('TC 05 - Deve barrar o cadastro inserindo um email inválido', async ({ page }) => {
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail('teste.com');
    await registerPage.preencherNome(dataMass.createUserWithoutCash.username)
    await registerPage.preencherSenha(dataMass.createUserWithoutCash.password)
    await registerPage.preencherConfirmacaoSenha(dataMass.createUserWithoutCash.password)
    await registerPage.cadastrarConta();

    //Verificando se aparece alguma mensagem que o email é inválido
    await expect(registerPage.inputWarning).toBeVisible();
    await expect(registerPage.inputWarning).toContainText('Formato inválido');
})

test('TC 06 - Deve barrar a criação de um usuário com um email ja cadastrado no sistema', async ({ page }) => {
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail(dataMass.createUserWithCash.email);
    await registerPage.preencherNome(dataMass.createUserWithCash.username);
    await registerPage.preencherSenha(dataMass.createUserWithCash.password);
    await registerPage.preencherConfirmacaoSenha(dataMass.createUserWithCash.password);
    await registerPage.criarContaComSaldo();
    await registerPage.cadastrarConta();

    //Verificando se a conta foi criada
    await expect(registerPage.modalText).toBeVisible();
    await registerPage.fecharModal();
})