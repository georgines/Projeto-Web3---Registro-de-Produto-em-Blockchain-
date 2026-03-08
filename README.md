# Projeto Web3 - Registro de Produto em Blockchain

## 1. Descrição do projeto

Este projeto demonstra, de forma simples, a integração entre uma
aplicação web, uma carteira digital e um contrato inteligente em
blockchain. A aplicação permite registrar o nome de um produto em uma
blockchain local e posteriormente consultar o dado armazenado.

O sistema utiliza:

-   HTML para a estrutura da página
-   CSS para a interface visual
-   JavaScript para a lógica da aplicação
-   Solidity para o contrato inteligente
-   Ganache como blockchain local
-   MetaMask como carteira digital
-   Remix IDE para compilar e implantar o contrato
-   Live Server (VS Code) para executar o servidor local

A comunicação entre a página web e o contrato inteligente é realizada
por meio da biblioteca Ethers.js.

------------------------------------------------------------------------

# 2. Requisitos para executar o projeto

Para testar o projeto em qualquer computador, é necessário instalar os
seguintes softwares:

1.  Visual Studio Code
2.  Extensão Live Server para VS Code
3.  Ganache
4.  MetaMask (extensão do navegador)


------------------------------------------------------------------------

# 3. Estrutura do projeto

projeto/

├── index.html\
├── style.css\
├── app.js\
├── contrato.sol\
└── README.md

Descrição dos arquivos:

-   index.html → interface da aplicação\
-   style.css → estilo visual da página\
-   app.js → lógica da aplicação e integração com blockchain\
-   contrato.sol → contrato inteligente responsável pelo registro do
    produto

------------------------------------------------------------------------

# 4. Iniciando a blockchain local

1.  Abra o Ganache.
2.  Clique em **Quickstart** ou **Start new workspace**.
3.  Aguarde a inicialização da rede.

Normalmente o Ganache cria uma rede com os seguintes parâmetros:

RPC URL: http://127.0.0.1:7545\
Chain ID: 1337

Essas informações serão usadas na aplicação web.

------------------------------------------------------------------------

# 5. Importando uma conta do Ganache para o MetaMask

1.  Abra o Ganache.
2.  Copie a **Private Key** de uma das contas.
3.  Abra a **MetaMask**.
4.  Clique em **Import Account**.
5.  Cole a **Private Key** copiada do Ganache.

Isso permitirá que a MetaMask utilize a mesma conta da blockchain local.

------------------------------------------------------------------------

# 6. Compilando e implantando o contrato inteligente

1.  Acesse o site do Remix IDE:

https://remix.ethereum.org

2.  Crie um novo arquivo chamado:

contrato.sol

3.  Cole o conteúdo do arquivo `contrato.sol`.

4.  Vá até a aba **Solidity Compiler**.

5.  Selecione a versão: 0.8.31

6. Clique em **Advanced Configurations**

7. Mude **EVM Version** para **paris**

8.  Clique em **Compile contrato.sol**.

------------------------------------------------------------------------

# 7. Fazendo o deploy do contrato

1.  Abra a aba **Deploy & Run Transactions**.
2.  Em **Environment**, selecione:

Injected Provider - MetaMask

3.  Confirme a conexão com a MetaMask.
4.  Clique em **Deploy**.
5.  Confirme a transação na MetaMask.

Após o deploy, o Remix exibirá:

-   Endereço do contrato

Essas duas informações serão utilizadas pela aplicação web.

------------------------------------------------------------------------

# 8. Configurando a aplicação web

1.  Abra a pasta do projeto no VS Code.
2.  Clique com o botão direito no arquivo **index.html**.
3.  Selecione **Open with Live Server**.

O navegador abrirá automaticamente a aplicação.

------------------------------------------------------------------------

# 9. Preenchendo as configurações da aplicação

Na página aberta, preencha os seguintes campos:

Nome da rede\
Ganache Local

URL RPC\
http://127.0.0.1:7545

Chain ID\
1337

Endereço do contrato\
Cole o endereço gerado no Remix.

ABI do contrato\
Copie a ABI completa localizada em **Compilation Details** na aba **Solidity compiler** do Remix e cole no campo.

------------------------------------------------------------------------

# 10. Salvando as configurações

Clique no botão **Salvar configurações**.

As informações serão armazenadas no **localStorage do navegador** e
carregadas automaticamente nas próximas execuções.

------------------------------------------------------------------------

# 11. Conectando a carteira

Clique no botão **Conectar carteira**.

A MetaMask solicitará autorização para conectar a conta.

Após a confirmação: - o endereço da carteira será exibido na interface -
a aplicação estará pronta para interagir com o contrato

------------------------------------------------------------------------

# 12. Registrando um produto

1.  Digite o nome de um produto no campo **Nome do produto**.
2.  Clique em **Registrar produto na blockchain**.
3.  Confirme a transação na MetaMask.

Após a mineração da transação: - o produto será registrado na
blockchain - o hash da transação será exibido na aplicação

------------------------------------------------------------------------

# 13. Limpando as configurações salvas

Caso seja necessário redefinir a aplicação, utilize o botão **Limpar
armazenamento**.

Isso removerá: - configurações da rede - endereço do contrato - ABI -
dados armazenados no navegador

------------------------------------------------------------------------

# 14. Resultado esperado

Após executar todos os passos, o usuário será capaz de:

1.  Conectar a carteira MetaMask.
2.  Registrar um produto em uma blockchain local.
3.  Confirmar a transação na MetaMask.
4.  Visualizar o produto armazenado no contrato inteligente.
5.  Visualizar o hash da transação correspondente.
