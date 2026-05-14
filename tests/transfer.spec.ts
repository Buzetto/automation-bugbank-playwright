import { test, expect } from "@playwright/test";
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';
import dataMass from '../fixtures/users.json';

let registerPage: RegisterPage;
let loginPage: LoginPage;
let transferPage: TransferPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {

    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    transferPage = new TransferPage(page);
    homePage = new HomePage(page);

    await page.goto('/');
    await expect(page).toHaveTitle("BugBank | O banco com bugs e falhas do seu jeito");
});

test('TC 12 - Deve realizar a transfêrencia de uma conta com saldo para outra', async ({ page }) => {
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
});

test('TC 13 - Deve barrar a transferencia de um valor maior que o saldo disponível em conta', async ({ page }) => {
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
    await transferPage.realizarTransferencia(contaDestino.numero, contaDestino.digito, '60000');
    await transferPage.colocarDescricao('Enviando uma transferencia')
    await transferPage.enviarTransferencia();
    
    await expect(transferPage.modalTexto).toBeVisible()
    await expect(transferPage.modalTexto).toHaveText('Você não tem saldo suficiente para essa transação');
    await transferPage.fecharModal();
});

test('TC 14 - Deve barrar a transferencia de um valor negativo ou igual a zero que o saldo disponível em conta', async ({ page }) => {
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
    await transferPage.realizarTransferencia(contaDestino.numero, contaDestino.digito, '0');
    await transferPage.colocarDescricao('Enviando uma transferencia')
    await transferPage.enviarTransferencia();
    
    await expect(transferPage.modalTexto).toBeVisible()
    await expect(transferPage.modalTexto).toHaveText('Valor da transferência não pode ser 0 ou negativo');
    await transferPage.fecharModal();
});

test('TC 15 - Deve barrar a transferencia para uma conta inválida', async ({ page }) => {
    //Criando a conta com saldo
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
    await loginPage.realizarLogin(dataMass.createUserWithCash.email, dataMass.createUserWithCash.password);

    //Entrando no menu transferencia
    await homePage.acessarTransferencia()
    await expect(homePage.page).toHaveURL('https://bugbank.netlify.app/transfer');

    //Transferindo o dinheiro
    await transferPage.realizarTransferencia('123', '4', '100')
    await transferPage.colocarDescricao('Teste de envio para conta inválida')
    await transferPage.enviarTransferencia()

    await expect(transferPage.modalTexto).toBeVisible()
    await expect(transferPage.modalTexto).toHaveText('Conta inválida ou inexistente');
});

test('TC 15a - Deve barrar a transferencia sem digitar um numero de conta', async ({ page }) => {

    test.fail();
    //Criando a conta com saldo
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
    await loginPage.realizarLogin(dataMass.createUserWithCash.email, dataMass.createUserWithCash.password);

    //Entrando no menu transferencia
    await homePage.acessarTransferencia()
    await expect(homePage.page).toHaveURL('https://bugbank.netlify.app/transfer');

    //Transferindo o dinheiro
    await transferPage.realizarTransferencia('', '4', '100')
    await transferPage.colocarDescricao('Teste de envio para conta inválida')
    await transferPage.enviarTransferencia()

    await expect(transferPage.modalTexto).toBeVisible()
    await expect(transferPage.modalTexto).toHaveText('Numero da conta é obrigatório');
});

test('TC 16 - Verificar se o campo de descrição na transferência é obrigatório', async ({ page }) => {
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
    await transferPage.enviarTransferencia();
    await expect(transferPage.modalTexto).toBeVisible()
    await expect(transferPage.modalTexto).toHaveText('Transferencia realizada com sucesso');
    await transferPage.fecharModal()

    //Voltar para a pagina inicial
    await transferPage.voltarHomePage();
    await expect(homePage.textoSaldo).toBeVisible();
    await expect(homePage.textoSaldo).toContainText('Saldo em conta R$ 900,00');
});