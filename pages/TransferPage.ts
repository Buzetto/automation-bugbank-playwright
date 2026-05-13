import {Page, Locator} from '@playwright/test';

export class TransferPage {
    readonly page: Page; 
    readonly inputAccountNumber: Locator;
    readonly inputAccountDigit: Locator;
    readonly inputTransferValue: Locator;
    readonly inputDescription: Locator;
    readonly btnSubmitTransfer: Locator;
    readonly modalTexto: Locator;
    readonly btnFecharModal: Locator;
    readonly btnVoltar: Locator;


constructor(page: Page) {
    this.page = page;

    this.inputAccountNumber = page.getByPlaceholder('Informe o número da conta');
    this.inputAccountDigit = page.getByPlaceholder('Informe o dígito da conta');
    this.inputTransferValue = page.getByPlaceholder('Informe o valor da transferência');
    this.inputDescription = page.getByPlaceholder('Informe uma descrição');

    this.btnSubmitTransfer = page.getByText('Transferir agora');

    this.modalTexto = page.locator('#modalText');
    this.btnFecharModal = page.locator('#btnCloseModal');

    this.btnVoltar = page.locator('#btnBack');
}

    async realizarTransferencia (conta: string, digito: string, valor: string) {
        await this.inputAccountNumber.fill(conta);
        await this.inputAccountDigit.fill(digito);
        await this.inputTransferValue.fill(valor);
    }

    async colocarDescricao (descricao: string) {
        await this.inputDescription.fill(descricao);
    }

    async enviarTransferencia () {
        await this.btnSubmitTransfer.click()
    }

    async fecharModal () {
        await this.btnFecharModal.click()
    }

    async voltarHomePage () {
        await this.btnVoltar.click()
    }
}
