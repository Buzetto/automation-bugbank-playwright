import { test, expect } from "@playwright/test";
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';
import { ExtractPage } from '../pages/ExtractPage';
import dataMass from '../fixtures/users.json';

let registerPage: RegisterPage;
let loginPage: LoginPage;
let transferPage: TransferPage;
let homePage: HomePage;
let extractPage: ExtractPage;


test.beforeEach(async ({ page }) => {

    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    transferPage = new TransferPage(page);
    homePage = new HomePage(page);
    extractPage = new ExtractPage(page);


    await page.goto('/');
    await expect(page).toHaveTitle("BugBank | O banco com bugs e falhas do seu jeito");
});

test('TC 16 - Deve verificar o saldo positivo após o cadastro da conta com saldo', async ({ page }) => {
    //Criando a conta para quem recebe o saldo
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail(dataMass.createUserWithoutCash.email);
    await registerPage.preencherNome(dataMass.createUserWithoutCash.username);
    await registerPage.preencherSenha(dataMass.createUserWithoutCash.password);
    await registerPage.preencherConfirmacaoSenha(dataMass.createUserWithoutCash.password);
    await registerPage.cadastrarConta();

    //Guardando o numero da conta na variável
    const contaDestino = await registerPage.obterDadosDaContaCriada();

    //Verificando se a conta foi criada
    await expect(registerPage.modalText).toBeVisible();
    await registerPage.fecharModal();

    //Criando a conta de quem envia o dinheiro
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

    //Fazendo login
    await loginPage.realizarLogin(dataMass.createUserWithCash.email, dataMass.createUserWithCash.password)
    await expect(page).toHaveURL('https://bugbank.netlify.app/home');

    //Acessando Transferencia
    await homePage.acessarTransferencia()
    await expect(homePage.page).toHaveURL('https://bugbank.netlify.app/transfer');

    //Transferindo o dinheiro
    await transferPage.realizarTransferencia(contaDestino.numero, contaDestino.digito, '100');
    await transferPage.colocarDescricao('Enviando uma transferencia')
    await transferPage.enviarTransferencia();
    await expect(transferPage.modalTexto).toBeVisible()
    await expect(transferPage.modalTexto).toHaveText('Transferencia realizada com sucesso');
    await transferPage.fecharModal()

    //Voltar para a pagina inicial
    await transferPage.voltarHomePage();
    await expect(homePage.textoSaldo).toBeVisible();
    await expect(homePage.textoSaldo).toContainText('Saldo em conta R$ 900,00');

    await homePage.acessarExtrato();

    await expect(extractPage.tituloExtrato.first()).toBeVisible();
    await expect(extractPage.tituloExtrato.first()).toHaveText('Saldo adicionado ao abrir conta');

    await expect(extractPage.valorDoExtrato.first()).toBeVisible();
    await expect(extractPage.valorDoExtrato.first()).toHaveText('R$ 1.000,00');
})

test('TC 17 - Deve verificar o saldo  após uma transferencia', async ({ page }) => {
    //Criando a conta para quem recebe o saldo
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail(dataMass.createUserWithoutCash.email);
    await registerPage.preencherNome(dataMass.createUserWithoutCash.username);
    await registerPage.preencherSenha(dataMass.createUserWithoutCash.password);
    await registerPage.preencherConfirmacaoSenha(dataMass.createUserWithoutCash.password);
    await registerPage.cadastrarConta();

    //Guardando o numero da conta na variável
    const contaDestino = await registerPage.obterDadosDaContaCriada();

    //Verificando se a conta foi criada
    await expect(registerPage.modalText).toBeVisible();
    await registerPage.fecharModal();

    //Criando a conta de quem envia o dinheiro
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

    //Fazendo login
    await loginPage.realizarLogin(dataMass.createUserWithCash.email, dataMass.createUserWithCash.password)
    await expect(page).toHaveURL('https://bugbank.netlify.app/home');

    //Acessando Transferencia
    await homePage.acessarTransferencia()
    await expect(homePage.page).toHaveURL('https://bugbank.netlify.app/transfer');

    //Transferindo o dinheiro
    await transferPage.realizarTransferencia(contaDestino.numero, contaDestino.digito, '100');
    await transferPage.colocarDescricao('Enviando uma transferencia')
    await transferPage.enviarTransferencia();
    await expect(transferPage.modalTexto).toBeVisible()
    await expect(transferPage.modalTexto).toHaveText('Transferencia realizada com sucesso');
    await transferPage.fecharModal()

    //Voltar para a pagina inicial
    await transferPage.voltarHomePage();
    await expect(homePage.textoSaldo).toBeVisible();
    await expect(homePage.textoSaldo).toContainText('Saldo em conta R$ 900,00');

    await homePage.acessarExtrato();

    await expect(extractPage.tituloExtrato.last()).toBeVisible();  
    await expect(extractPage.tituloExtrato.last()).toHaveText('Enviando uma transferencia ');

    await expect(extractPage.valorDoExtrato.last()).toBeVisible();
    await expect(extractPage.valorDoExtrato.last()).toHaveText('-R$ 100,00');
    await expect(extractPage.saldoDisponivel).toHaveText('R$ 900,00');
})

test('TC 18 - Deve verificar o saldo recebido através de uma transferencia de outro titular', async ({ page }) => {
    //Criando a conta para quem recebe o saldo
    await registerPage.acessarTelaDeCadastro();
    await registerPage.preencherEmail(dataMass.createUserWithoutCash.email);
    await registerPage.preencherNome(dataMass.createUserWithoutCash.username);
    await registerPage.preencherSenha(dataMass.createUserWithoutCash.password);
    await registerPage.preencherConfirmacaoSenha(dataMass.createUserWithoutCash.password);
    await registerPage.cadastrarConta();

    //Guardando o numero da conta na variável
    const contaDestino = await registerPage.obterDadosDaContaCriada();

    //Verificando se a conta foi criada
    await expect(registerPage.modalText).toBeVisible();
    await registerPage.fecharModal();

    //Criando a conta de quem envia o dinheiro
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

    //Fazendo login
    await loginPage.realizarLogin(dataMass.createUserWithCash.email, dataMass.createUserWithCash.password)
    await expect(page).toHaveURL('https://bugbank.netlify.app/home');

    //Acessando Transferencia
    await homePage.acessarTransferencia()
    await expect(homePage.page).toHaveURL('https://bugbank.netlify.app/transfer');

    //Transferindo o dinheiro
    await transferPage.realizarTransferencia(contaDestino.numero, contaDestino.digito, '100');
    await transferPage.colocarDescricao('Enviando uma transferencia')
    await transferPage.enviarTransferencia();
    await expect(transferPage.modalTexto).toBeVisible()
    await expect(transferPage.modalTexto).toHaveText('Transferencia realizada com sucesso');
    await transferPage.fecharModal()

    //Voltar para a pagina inicial
    await transferPage.voltarHomePage();
    await expect(homePage.textoSaldo).toBeVisible();
    await expect(homePage.textoSaldo).toContainText('Saldo em conta R$ 900,00');

    await homePage.fazerLogout();
    await loginPage.realizarLogin(dataMass.createUserWithoutCash.email, dataMass.createUserWithoutCash.password)
    await expect(page).toHaveURL('https://bugbank.netlify.app/home');

    await homePage.acessarExtrato();

    await expect(extractPage.tituloExtrato.last()).toBeVisible();  
    await expect(extractPage.tituloExtrato.last()).toHaveText('Enviando uma transferencia ');

    await expect(extractPage.valorDoExtrato.last()).toBeVisible();
    await expect(extractPage.valorDoExtrato.last()).toHaveText('R$ 100,00');
    await expect(extractPage.saldoDisponivel).toHaveText('R$ 100,00');
})