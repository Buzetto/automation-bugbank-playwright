import { Locator, Page } from '@playwright/test';

export class ExtractPage {
    readonly page: Page

    readonly tituloExtrato: Locator;
    readonly valorDoExtrato: Locator;
    readonly saldoDisponivel: Locator;

constructor(page: Page) {
    this.page = page

    this.tituloExtrato = page.locator('#textDescription');
    this.valorDoExtrato = page.locator('#textTransferValue');
    this.saldoDisponivel = page.locator('#textBalanceAvailable')
}
}