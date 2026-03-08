const campoNomeRede = document.getElementById("campoNomeRede");
const campoUrlRpc = document.getElementById("campoUrlRpc");
const campoIdRede = document.getElementById("campoIdRede");
const campoEnderecoContrato = document.getElementById("campoEnderecoContrato");
const campoAbiContrato = document.getElementById("campoAbiContrato");

const botaoSalvarConfiguracoes = document.getElementById("botaoSalvarConfiguracoes");
const botaoLimparConfiguracoes = document.getElementById("botaoLimparConfiguracoes");
const botaoConectarCarteira = document.getElementById("botaoConectarCarteira");
const botaoDesconectarCarteira = document.getElementById("botaoDesconectarCarteira");
const botaoRegistrarProduto = document.getElementById("botaoRegistrarProduto");
const botaoLerProduto = document.getElementById("botaoLerProduto");
const botaoFecharModal = document.getElementById("botaoFecharModal");

const campoNomeProduto = document.getElementById("campoNomeProduto");

const textoEnderecoCarteira = document.getElementById("textoEnderecoCarteira");
const textoStatusAplicacao = document.getElementById("textoStatusAplicacao");
const textoProdutoRegistrado = document.getElementById("textoProdutoRegistrado");
const textoRedeConfigurada = document.getElementById("textoRedeConfigurada");
const textoHashTransacao = document.getElementById("textoHashTransacao");

const modalStatus = document.getElementById("modalStatus");
const modalCabecalho = document.getElementById("modalCabecalho");
const modalTitulo = document.getElementById("modalTitulo");
const modalMensagem = document.getElementById("modalMensagem");

const CHAVE_ARMAZENAMENTO = "configuracoes_registro_produto_web3";

let provedor = null;
let assinante = null;
let contrato = null;
let contaAtual = null;
let hashUltimaTransacao = "";

function abrirModal(titulo, mensagem, tipo = "info") {
  modalTitulo.textContent = titulo;
  modalMensagem.textContent = mensagem;

  modalCabecalho.className = "modal-cabecalho";

  if (tipo === "sucesso") {
    modalCabecalho.classList.add("modal-sucesso");
  } else if (tipo === "erro") {
    modalCabecalho.classList.add("modal-erro");
  } else if (tipo === "aviso") {
    modalCabecalho.classList.add("modal-aviso");
  } else {
    modalCabecalho.classList.add("modal-info");
  }

  modalStatus.classList.remove("oculto");
}

function fecharModal() {
  modalStatus.classList.add("oculto");
}

function atualizarStatus(mensagem) {
  textoStatusAplicacao.textContent = mensagem;
}

function limparEstadoDaConexao() {
  provedor = null;
  assinante = null;
  contrato = null;
  contaAtual = null;

  textoEnderecoCarteira.textContent = "Nenhuma carteira conectada";
}

function obterConfiguracoesAtuais() {
  return {
    nomeRede: campoNomeRede.value.trim(),
    urlRpc: campoUrlRpc.value.trim(),
    idRede: campoIdRede.value.trim(),
    enderecoContrato: campoEnderecoContrato.value.trim(),
    abiContratoTexto: campoAbiContrato.value.trim()
  };
}

function preencherCamposComConfiguracoes(configuracoes) {
  campoNomeRede.value = configuracoes.nomeRede || "";
  campoUrlRpc.value = configuracoes.urlRpc || "";
  campoIdRede.value = configuracoes.idRede || "";
  campoEnderecoContrato.value = configuracoes.enderecoContrato || "";
  campoAbiContrato.value = configuracoes.abiContratoTexto || "";

  textoRedeConfigurada.textContent =
    `${configuracoes.nomeRede || "Rede não definida"} | Chain ID: ${configuracoes.idRede || "não informado"}`;
}

function salvarConfiguracoesNoNavegador() {
  const configuracoes = obterConfiguracoesAtuais();

  if (!configuracoes.nomeRede) {
    atualizarStatus("Informe o nome da rede.");
    abrirModal("Atenção", "Informe o nome da rede.", "aviso");
    return;
  }

  if (!configuracoes.urlRpc) {
    atualizarStatus("Informe a URL RPC da rede.");
    abrirModal("Atenção", "Informe a URL RPC da rede.", "aviso");
    return;
  }

  if (!configuracoes.idRede) {
    atualizarStatus("Informe o Chain ID da rede.");
    abrirModal("Atenção", "Informe o Chain ID da rede.", "aviso");
    return;
  }

  if (!configuracoes.enderecoContrato) {
    atualizarStatus("Informe o endereço do contrato.");
    abrirModal("Atenção", "Informe o endereço do contrato.", "aviso");
    return;
  }

  if (!configuracoes.abiContratoTexto) {
    atualizarStatus("Cole a ABI do contrato.");
    abrirModal("Atenção", "Cole a ABI do contrato.", "aviso");
    return;
  }

  try {
    JSON.parse(configuracoes.abiContratoTexto);
  } catch {
    atualizarStatus("ABI inválida.");
    abrirModal("Erro", "A ABI informada não está em formato JSON válido.", "erro");
    return;
  }

  localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(configuracoes));
  preencherCamposComConfiguracoes(configuracoes);

  atualizarStatus("Configurações salvas.");
  abrirModal("Sucesso", "Configurações salvas no armazenamento local do navegador.", "sucesso");
}

function carregarConfiguracoesDoNavegador() {
  const configuracoesSalvas = localStorage.getItem(CHAVE_ARMAZENAMENTO);

  if (!configuracoesSalvas) {
    atualizarStatus("Nenhuma configuração salva.");
    textoRedeConfigurada.textContent = "Não definida";
    return;
  }

  try {
    const configuracoes = JSON.parse(configuracoesSalvas);
    preencherCamposComConfiguracoes(configuracoes);
    atualizarStatus("Configurações carregadas.");
  } catch (erro) {
    console.error(erro);
    atualizarStatus("Erro ao carregar configurações.");
    abrirModal("Erro", "Não foi possível carregar as configurações salvas.", "erro");
  }
}

function limparConfiguracoesDoNavegador() {
  localStorage.removeItem(CHAVE_ARMAZENAMENTO);

  campoNomeRede.value = "";
  campoUrlRpc.value = "";
  campoIdRede.value = "";
  campoEnderecoContrato.value = "";
  campoAbiContrato.value = "";
  campoNomeProduto.value = "";

  textoRedeConfigurada.textContent = "Não definida";
  textoProdutoRegistrado.textContent = "Nenhum dado foi lido ainda.";
  textoHashTransacao.textContent = "Nenhum hash disponível ainda.";

  hashUltimaTransacao = "";

  limparEstadoDaConexao();

  atualizarStatus("Armazenamento local limpo.");
  abrirModal("Sucesso", "Armazenamento local limpo com sucesso.", "sucesso");
}

function obterAbiConvertida() {
  const abiTexto = campoAbiContrato.value.trim();

  if (!abiTexto) {
    throw new Error("ABI_VAZIA");
  }

  try {
    return JSON.parse(abiTexto);
  } catch {
    throw new Error("ABI_INVALIDA");
  }
}

function obterEnderecoContrato() {
  const endereco = campoEnderecoContrato.value.trim();

  if (!endereco) {
    throw new Error("ENDERECO_VAZIO");
  }

  return endereco;
}

async function verificarCarteirasJaConectadas() {
  if (!window.ethereum) {
    return;
  }

  try {
    const contas = await window.ethereum.request({
      method: "eth_accounts"
    });

    if (!contas || contas.length === 0) {
      return;
    }

    await inicializarConexaoComContaExistente(contas[0]);
  } catch (erro) {
    console.error("Erro ao verificar contas já conectadas:", erro);
  }
}

async function inicializarConexaoComContaExistente(enderecoConta) {
  const enderecoContrato = obterEnderecoContrato();
  const abiConvertida = obterAbiConvertida();

  provedor = new ethers.BrowserProvider(window.ethereum);
  assinante = await provedor.getSigner();
  contrato = new ethers.Contract(enderecoContrato, abiConvertida, assinante);

  contaAtual = enderecoConta;
  textoEnderecoCarteira.textContent = enderecoConta;
  atualizarStatus("Carteira conectada.");
}

async function conectarCarteira() {
  try {
    if (!window.ethereum) {
      atualizarStatus("MetaMask não encontrada.");
      abrirModal("Erro", "MetaMask não encontrada no navegador.", "erro");
      return;
    }

    const configuracoes = obterConfiguracoesAtuais();

    if (!configuracoes.enderecoContrato) {
      atualizarStatus("Informe o endereço do contrato.");
      abrirModal("Atenção", "Informe o endereço do contrato antes de conectar a carteira.", "aviso");
      return;
    }

    if (!configuracoes.abiContratoTexto) {
      atualizarStatus("Informe a ABI do contrato.");
      abrirModal("Atenção", "Informe a ABI do contrato antes de conectar a carteira.", "aviso");
      return;
    }

    let abiConvertida;

    try {
      abiConvertida = JSON.parse(configuracoes.abiContratoTexto);
    } catch {
      atualizarStatus("ABI inválida.");
      abrirModal("Erro", "A ABI informada não está em formato JSON válido.", "erro");
      return;
    }

    atualizarStatus("Solicitando conexão da carteira à MetaMask...");
    abrirModal("Processando", "Solicitando conexão da carteira à MetaMask...", "info");

    provedor = new ethers.BrowserProvider(window.ethereum);

    const contas = await provedor.send("eth_requestAccounts", []);

    if (!contas || contas.length === 0) {
      throw new Error("SEM_CONTA");
    }

    assinante = await provedor.getSigner();
    contaAtual = contas[0];

    contrato = new ethers.Contract(
      configuracoes.enderecoContrato,
      abiConvertida,
      assinante
    );

    textoEnderecoCarteira.textContent = contaAtual;
    textoRedeConfigurada.textContent =
      `${configuracoes.nomeRede || "Rede não definida"} | Chain ID: ${configuracoes.idRede || "não informado"}`;

    atualizarStatus("Carteira conectada.");
    abrirModal("Sucesso", "Carteira conectada com sucesso.", "sucesso");
  } catch (erro) {
    console.error(erro);
    limparEstadoDaConexao();
    atualizarStatus("Falha ao conectar a carteira.");
    abrirModal("Erro", "Não foi possível conectar a carteira.", "erro");
  }
}

function desconectarCarteira() {
  limparEstadoDaConexao();
  atualizarStatus("Carteira desconectada da aplicação.");
  abrirModal("Sucesso", "Carteira desconectada da aplicação. Agora você pode conectar novamente.", "sucesso");
}

async function registrarProdutoNaBlockchain() {
  try {
    if (!contrato) {
      atualizarStatus("Conecte a carteira primeiro.");
      abrirModal("Atenção", "Conecte a carteira antes de registrar um produto.", "aviso");
      return;
    }

    const nomeDoProduto = campoNomeProduto.value.trim();

    if (!nomeDoProduto) {
      atualizarStatus("Digite o nome do produto.");
      abrirModal("Atenção", "Digite o nome do produto para registrar.", "aviso");
      return;
    }

    atualizarStatus("Enviando transação para a blockchain...");
    abrirModal("Processando", "Enviando transação para registrar o produto...", "info");

    const transacao = await contrato.registrarProduto(nomeDoProduto);

    hashUltimaTransacao = transacao.hash;
    textoHashTransacao.textContent = hashUltimaTransacao;

    atualizarStatus(`Transação enviada: ${transacao.hash}`);
    abrirModal("Processando", `Transação enviada com hash: ${transacao.hash}`, "info");

    await transacao.wait();

    textoProdutoRegistrado.textContent = nomeDoProduto;
    campoNomeProduto.value = "";

    atualizarStatus("Produto registrado com sucesso.");
    abrirModal("Sucesso", "Produto registrado com sucesso na blockchain.", "sucesso");
  } catch (erro) {
    console.error(erro);
    atualizarStatus("Falha ao registrar o produto.");
    abrirModal("Erro", "O registro do produto falhou.", "erro");
  }
}

async function lerProdutoDaBlockchain() {
  try {
    if (!contrato) {
      atualizarStatus("Conecte a carteira primeiro.");
      abrirModal("Atenção", "Conecte a carteira antes de ler o produto.", "aviso");
      return;
    }

    atualizarStatus("Lendo produto salvo na blockchain...");
    abrirModal("Processando", "Lendo o produto salvo na blockchain...", "info");

    const produtoLido = await contrato.lerProdutoRegistrado();

    if (!produtoLido) {
      textoProdutoRegistrado.textContent = "Nenhum produto foi registrado ainda";
      textoHashTransacao.textContent = hashUltimaTransacao || "Nenhum hash disponível ainda.";
      atualizarStatus("Leitura concluída.");
      abrirModal("Aviso", "Nenhum produto foi registrado ainda.", "aviso");
      return;
    }

    textoProdutoRegistrado.textContent = produtoLido;
    textoHashTransacao.textContent = hashUltimaTransacao || "Nenhum hash disponível ainda.";
    atualizarStatus("Produto lido com sucesso.");
    abrirModal("Sucesso", "Produto lido com sucesso na blockchain.", "sucesso");
  } catch (erro) {
    console.error(erro);
    atualizarStatus("Falha ao ler o produto.");
    abrirModal("Erro", "Não foi possível ler o produto salvo.", "erro");
  }
}

function registrarEventosDaMetaMask() {
  if (!window.ethereum) {
    return;
  }

  window.ethereum.removeAllListeners?.("accountsChanged");
  window.ethereum.removeAllListeners?.("chainChanged");

  window.ethereum.on("accountsChanged", async function (contas) {
    if (!contas || contas.length === 0) {
      limparEstadoDaConexao();
      atualizarStatus("Nenhuma conta conectada.");
      abrirModal("Aviso", "A MetaMask ficou sem conta conectada para esta aplicação.", "aviso");
      return;
    }

    try {
      contaAtual = contas[0];
      textoEnderecoCarteira.textContent = contaAtual;

      if (campoEnderecoContrato.value.trim() && campoAbiContrato.value.trim()) {
        const abiConvertida = obterAbiConvertida();
        const enderecoContrato = obterEnderecoContrato();

        provedor = new ethers.BrowserProvider(window.ethereum);
        assinante = await provedor.getSigner();
        contrato = new ethers.Contract(enderecoContrato, abiConvertida, assinante);
      }

      atualizarStatus("Conta da MetaMask atualizada.");
      abrirModal("Sucesso", "A conta conectada foi atualizada na aplicação.", "sucesso");
    } catch (erro) {
      console.error(erro);
      limparEstadoDaConexao();
      atualizarStatus("Falha ao atualizar a conta.");
      abrirModal("Erro", "Não foi possível atualizar a conta conectada.", "erro");
    }
  });

  window.ethereum.on("chainChanged", function () {
    limparEstadoDaConexao();
    atualizarStatus("Rede alterada. Conecte novamente a carteira.");
    abrirModal("Aviso", "A rede da MetaMask foi alterada. Conecte novamente a carteira.", "aviso");
  });
}

botaoSalvarConfiguracoes.addEventListener("click", salvarConfiguracoesNoNavegador);
botaoLimparConfiguracoes.addEventListener("click", limparConfiguracoesDoNavegador);
botaoConectarCarteira.addEventListener("click", conectarCarteira);
botaoDesconectarCarteira.addEventListener("click", desconectarCarteira);
botaoRegistrarProduto.addEventListener("click", registrarProdutoNaBlockchain);
botaoLerProduto.addEventListener("click", lerProdutoDaBlockchain);
botaoFecharModal.addEventListener("click", fecharModal);

modalStatus.addEventListener("click", function (evento) {
  if (evento.target === modalStatus) {
    fecharModal();
  }
});

window.addEventListener("load", async function () {
  carregarConfiguracoesDoNavegador();
  registrarEventosDaMetaMask();
  await verificarCarteirasJaConectadas();
});