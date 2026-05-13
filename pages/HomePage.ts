import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly btnTransferencia: Locator;
    readonly btnExtrato: Locator;
    readonly btnSair: Locator;
    readonly textoSaldo: Locator;

    constructor(page: Page) {
        this.page = page;
        
        
        this.btnTransferencia = page.locator('#btn-TRANSFERÊNCIA');
        this.btnExtrato = page.locator('#btn-EXTRATO');
        this.btnSair = page.locator('#btnExit');
        
        
        this.textoSaldo = page.locator('#textBalance');
    }

    async acessarTransferencia() {
        await this.btnTransferencia.click();
    }

    async acessarExtrato() {
        await this.btnExtrato.click();
    }

    async fazerLogout() {
        await this.btnSair.click();
    }
}