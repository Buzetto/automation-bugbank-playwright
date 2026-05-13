import { test, expect } from "@playwright/test";
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import dataMass from '../fixtures/users.json';

let registerPage: RegisterPage;
let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);

    await page.goto('/');
    await expect(page).toHaveTitle("BugBank | O banco com bugs e falhas do seu jeito");
});

test('TC 07 - Deve realizar o login com o usuário cadastrado)', async ({ page }) => {
    //Criando a conta para armazenar na memória local do navegador do Playwright
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

    //Ralizando o login
    await loginPage.realizarLogin(dataMass.createUserWithCash.email,dataMass.validUser.password);
    await expect(page).toHaveURL('https://bugbank.netlify.app/home');
})

test('TC 08 - Deve barrar o login com um email não cadastrado no sistema', async ({ page }) => {
    await loginPage.realizarLogin('banana.teste@teste.com.br', dataMass.createUserWithCash.password)

    await expect(loginPage.modalTexto).toBeVisible();
    await expect(loginPage.modalTexto).toHaveText('Usuário ou senha inválido. Tente novamente ou verifique suas informações!');
    await loginPage.fecharModal()

})

test('TC 09 - Deve barrar o login com o email correto mas a senha incorreta', async ({ page }) => {
    await loginPage.realizarLogin(dataMass.createUserWithCash.email, '123')

    await expect(loginPage.modalTexto).toBeVisible();
    await expect(loginPage.modalTexto).toHaveText('Usuário ou senha inválido. Tente novamente ou verifique suas informações!');
    await loginPage.fecharModal()
})

test('TC 10 - Deve barrar o login e apresentar alguma falha quando tentar realizar o login com os campos em branco', async ({ page }) => {
    await loginPage.clicarAcessar()

    await expect(loginPage.msgErroObrigatorio).toBeVisible();
    await expect(loginPage.msgErroObrigatorio).toHaveText('É campo obrigatório');
})

test('TC 11 - Deve realizar o logout corretamente após o login com um usuário cadastrado', async ({ page }) => {
    //Criando a conta para armazenar na memória local do navegador do Playwright
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

    await loginPage.realizarLogin(dataMass.createUserWithCash.email, dataMass.createUserWithCash.password);

    await loginPage.realizarLogout();
    await expect(loginPage.page).toHaveURL('https://bugbank.netlify.app/')
})