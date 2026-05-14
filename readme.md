# 🐞 BugBank - Automação de Testes E2E com Playwright

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=Playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## 💻 Sobre o Projeto
Este repositório contém uma suíte completa de testes automatizados End-to-End (E2E) para a aplicação [BugBank](https://bugbank.netlify.app/), um banco digital fictício criado especificamente com falhas propositais para o treinamento e prática de Quality Assurance.

O objetivo deste projeto é garantir a qualidade dos fluxos principais do usuário, validando regras de negócio e mapeando os bugs intencionais do sistema, aplicando as melhores práticas de mercado para automação de testes.

## 🏗️ Arquitetura e Padrões
O projeto foi desenvolvido utilizando o padrão **Page Object Model (POM)**, garantindo:
* **Manutenibilidade:** Separação clara entre a estrutura das páginas (Localizadores/Métodos) e a lógica dos testes.
* **Reusabilidade:** Métodos reaproveitáveis em diferentes cenários de teste.
* **Legibilidade:** Testes limpos e fáceis de ler, focados na regra de negócio.

Os testes cobrem os seguintes fluxos:
- [x] Cadastro de Usuário (Com e sem saldo)
- [x] Autenticação (Login válido e inválido)
- [x] Transferências Bancárias
- [x] Validação de Extrato
- [x] Mapeamento de Bugs Conhecidos (utilizando a anotação `test.fail()`)

## 🛠️ Tecnologias Utilizadas
* **[Playwright](https://playwright.dev/):** Framework principal para a automação web.
* **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para maior segurança no desenvolvimento.
* **[Node.js](https://nodejs.org/):** Ambiente de execução.
* **[GitHub Actions](https://github.com/features/actions):** Esteira de CI/CD para execução contínua dos testes na nuvem.

## ⚙️ Como executar o projeto localmente

**1. Pré-requisitos:**
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

**2. Clone o repositório:**
```bash
git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
```

**3. Instale as dependências:**
```bash
npm install
```

**4. Instale os navegadores do Playwright:**
```bash
npx playwright install
```

**5. Execute os testes:**
Para rodar os testes em modo *headless* (sem abrir o navegador):
```bash
npx playwright test
```

Para rodar os testes abrindo a interface gráfica do Playwright (UI Mode):
```bash
npx playwright test --ui
```

## 🚀 Integração Contínua (CI/CD)
Este projeto possui uma pipeline configurada no GitHub Actions. Toda vez que um novo código é enviado para a branch `main`, a esteira é acionada automaticamente, executando toda a suíte de testes em um ambiente virtual e gerando um relatório HTML com os resultados.

---
Desenvolvido por **Victor Augusto Buzetto**. 
Sinta-se à vontade para se conectar comigo no [LinkedIn](https://www.linkedin.com/in/victoraugustobuzetto/)