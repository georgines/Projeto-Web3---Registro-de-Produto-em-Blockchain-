const campoNomeRede = document.getElementById("campoNomeRede")
const campoUrlRpc = document.getElementById("campoUrlRpc")
const campoIdRede = document.getElementById("campoIdRede")
const campoEnderecoContrato = document.getElementById("campoEnderecoContrato")
const campoAbiContrato = document.getElementById("campoAbiContrato")

const textoEnderecoCarteira = document.getElementById("textoEnderecoCarteira")
const textoStatusAplicacao = document.getElementById("textoStatusAplicacao")
const textoRedeConfigurada = document.getElementById("textoRedeConfigurada")
const textoProdutoRegistrado = document.getElementById("textoProdutoRegistrado")

const campoNomeProduto = document.getElementById("campoNomeProduto")

let provedor
let assinante
let contrato

const chaveLocal = "configBlockchainProduto"

function salvarConfiguracoes(){

const config={
nomeRede:campoNomeRede.value,
rpc:campoUrlRpc.value,
chainId:campoIdRede.value,
endereco:campoEnderecoContrato.value,
abi:campoAbiContrato.value
}

localStorage.setItem(chaveLocal,JSON.stringify(config))

textoStatusAplicacao.textContent="Configurações salvas no navegador"
textoRedeConfigurada.textContent=config.nomeRede
}

function carregarConfiguracoes(){

const dados=localStorage.getItem(chaveLocal)

if(!dados)return

const config=JSON.parse(dados)

campoNomeRede.value=config.nomeRede||""
campoUrlRpc.value=config.rpc||""
campoIdRede.value=config.chainId||""
campoEnderecoContrato.value=config.endereco||""
campoAbiContrato.value=config.abi||""

textoRedeConfigurada.textContent=config.nomeRede||"Não definida"
}

function limparConfiguracoes(){

localStorage.removeItem(chaveLocal)

campoNomeRede.value=""
campoUrlRpc.value=""
campoIdRede.value=""
campoEnderecoContrato.value=""
campoAbiContrato.value=""

textoStatusAplicacao.textContent="Armazenamento limpo"
}

async function conectarCarteira(){

if(!window.ethereum){
textoStatusAplicacao.textContent="MetaMask não encontrada"
return
}

provedor=new ethers.BrowserProvider(window.ethereum)
await provedor.send("eth_requestAccounts",[])

assinante=await provedor.getSigner()

const endereco=await assinante.getAddress()

textoEnderecoCarteira.textContent=endereco

const abi=JSON.parse(campoAbiContrato.value)

contrato=new ethers.Contract(campoEnderecoContrato.value,abi,assinante)

textoStatusAplicacao.textContent="Carteira conectada"
}

async function registrarProduto(){

if(!contrato){
textoStatusAplicacao.textContent="Conecte a carteira primeiro"
return
}

const nome=campoNomeProduto.value

if(!nome){
textoStatusAplicacao.textContent="Digite um produto"
return
}

textoStatusAplicacao.textContent="Enviando transação..."

const tx=await contrato.registrarProduto(nome)

await tx.wait()

textoProdutoRegistrado.textContent=nome

textoStatusAplicacao.textContent="Produto registrado na blockchain"
}

async function lerProduto(){

if(!contrato){
textoStatusAplicacao.textContent="Conecte a carteira primeiro"
return
}

const produto=await contrato.lerProdutoRegistrado()

textoProdutoRegistrado.textContent=produto||"Nenhum produto registrado"
}

document.getElementById("botaoSalvarConfiguracoes").onclick=salvarConfiguracoes
document.getElementById("botaoLimparConfiguracoes").onclick=limparConfiguracoes
document.getElementById("botaoConectarCarteira").onclick=conectarCarteira
document.getElementById("botaoRegistrarProduto").onclick=registrarProduto
document.getElementById("botaoLerProduto").onclick=lerProduto

carregarConfiguracoes()
