import {Page, Locator} from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly formulario: Locator;
    readonly inputEmailLogin: Locator;
    readonly inputPasswordlLogin: Locator;
    readonly btnAcessar: Locator;
    readonly msgErroObrigatorio: Locator;
    readonly modalTexto: Locator;
    readonly btnFecharModal: Locator;
    readonly logout: Locator;

constructor(page: Page) {
    this.page = page;

    this.formulario = page.locator('.card__login')

    this.inputEmailLogin = this.formulario.getByPlaceholder('Informe seu e-mail').first();
    this.inputPasswordlLogin = this.formulario.getByPlaceholder('Informe sua senha').first();
    this.btnAcessar = page.getByText('Acessar');

    this.msgErroObrigatorio = page.getByText('É campo obrigatório').first();
    this.modalTexto = page.locator('#modalText');
    this.btnFecharModal = page.locator('#btnCloseModal');

    this.logout = page.locator('#btnExit');
}

async realizarLogin(email: string, senha: string) {
        await this.inputEmailLogin.fill(email);
        await this.inputPasswordlLogin.fill(senha);
        await this.btnAcessar.click();
    }

    // Método para apenas clicar em acessar (útil para o seu TC 10 de campos em branco)
    async clicarAcessar() {
        await this.btnAcessar.click();
    }

    // Método para fechar modais de erro
    async fecharModal() {
        await this.btnFecharModal.click();
    }

    async realizarLogout() {
        await this.logout.click()
    }
}   