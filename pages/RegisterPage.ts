import {Page, Locator} from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly btnRegister: Locator;

    readonly formulario: Locator;
    readonly inputEmail: Locator
    readonly inputName: Locator;
    readonly inputPassword: Locator;
    readonly inputPasswordConfirmation: Locator;
    readonly toggleSaldo: Locator;
    readonly btnCadastrar: Locator;

    readonly modalText: Locator;
    readonly btnCloseModal: Locator;
    readonly inputWarning: Locator;

    //Criando o dicionário
    constructor(page: Page) {
        this.page = page;

        this.btnRegister = page.locator('button:has-text("Registrar")')

        //Isolando o formulário para facilitar a busca
        this.formulario = page.locator('.card__register')

        //Mapeando dentro do formulario
        this.inputEmail = this.formulario.getByPlaceholder('Informe seu e-mail')
        this.inputName = this.formulario.getByPlaceholder('Informe seu Nome')
        this.inputPassword = this.formulario.getByPlaceholder('Informe sua senha')
        this.inputPasswordConfirmation= this.formulario.getByPlaceholder('Informe a confirmação da senha')
        this.toggleSaldo = page.locator('#toggleAddBalance')
        this.btnCadastrar = this.formulario.getByText('Cadastrar')

        this.modalText = page.locator('#modalText')
        this.btnCloseModal = page.locator('#btnCloseModal')
        this.inputWarning = this.formulario.locator('.input__warging').first()
    }

    //Criando os métodos
    //Clicar no botão de cadastrar
    async acessarTelaDeCadastro() {
        await this.btnRegister.click()
    }

    //Preencher o Input Email
    async preencherEmail(email: string) {
        await this.inputEmail.fill(email)
    }

    //Preencher o Input Nome
    async preencherNome(nome: string) {
        await this.inputName.fill(nome)
    }

    //Preencher o Input Senha
    async preencherSenha(senha: string) {
        await this.inputPassword.fill(senha)
    }

    //Preencher o Input ConfirmarSenha
    async preencherConfirmacaoSenha(senhaConfirma: string) {
        await this.inputPasswordConfirmation.fill(senhaConfirma)
    }

    //Ativar a opção de conta com saldo ou não
    async criarContaComSaldo() {
        await this.toggleSaldo.click()
    }

    //Clicar no botão de cadastrar a conta
    async cadastrarConta() {
        await this.btnCadastrar.click()
    }
    //Fechar o modal de erro ou de sucesso
    async fecharModal() {
        await this.btnCloseModal.click()
    }

    //Pegar o numero das contas criadas para transferência
    async obterDadosDaContaCriada(): Promise<{ numero: string, digito: string }> {
        const textoModal = await this.modalText.textContent(); 
        const match = textoModal?.match(/(\d+)-(\d)/); 
        
        if (match) {
            return { numero: match[1], digito: match[2] };
        }
        throw new Error('Não foi possível encontrar o número da conta no modal.');
    }
}