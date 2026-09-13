let leads = []; // array onde ficam armazenados os leads

let idLeadSelecionado = null; // lead atualmente aberto ou editado
let idLeadEliminar = null; // lead selecionado para eliminar


// ==========================
// FUNÇÕES PRINCIPAIS
// ==========================

// Cria e devolve um objeto Lead com todos os dados do formulário
function criarLead(
  id,
  origem,
  empresa,
  nomeContacto,
  email,
  telefone,
  setor,
  numeroColaboradores,
  tipoAtividade,
  produto,
  tamanhos,
  cores,
  personalizacao,
  requisitosSeguranca,
  orcamento,
  comercialResponsavel,
  observacoes,
) {
  return {
    id: id,
    origem: origem,
    empresa: empresa,
    nomeContacto: nomeContacto,
    email: email,
    telefone: telefone,
    setor: setor,
    numeroColaboradores: numeroColaboradores,
    tipoAtividade: tipoAtividade,
    produto: produto,
    tamanhos: tamanhos,
    cores: cores,
    personalizacao: personalizacao,
    requisitosSeguranca: requisitosSeguranca,
    orcamento: orcamento,
    comercialResponsavel: comercialResponsavel,
    observacoes: observacoes,
    dataEntrada: obterDataAtual(),
    dataConclusao: "",
    estado: "Novo",
  };
}


// Calcula automaticamente a prioridade do Lead através do orçamento.
// >= 10 000 € = Quente | >= 5 000 € = Morno | < 5 000 € = Frio
function qualificar(lead) {
  if (lead.orcamento >= 10000) {
    return "Quente";
  }

  if (lead.orcamento >= 5000) {
    return "Morno";
  }

  return "Frio";
}


// Prepara a prioridade para ser apresentada com a cor definida no CSS
function mostrarPrioridade(lead) {
  let prioridade = qualificar(lead);

  // Transforma, por exemplo, "Morno" em "morno" para usar como classe CSS
  let classePrioridade = prioridade.toLowerCase();

  return "<span class='prioridade prioridade-" + classePrioridade + "'><span class='prioridade-ponto'></span>" + prioridade + "</span>";
}


// Procura o maior ID existente e devolve o número seguinte
function gerarId() {
  let maiorId = 0;

  for (let i = 0; i < leads.length; i++) {
    if (leads[i].id > maiorId) {
      maiorId = leads[i].id;
    }
  }

  return maiorId + 1;
}


// Formata o número do ID para o formato LD-001
function formatarId(id) {
  return "LD-" + String(id).padStart(3, "0");
}


// Obtém a data atual no formato AAAA-MM-DD
function obterDataAtual() {
  let hoje = new Date();

  return hoje.toISOString().slice(0, 10);
}


// ==========================
// LOCAL STORAGE
// ==========================

// Guarda o array no localStorage.
// JSON.stringify transforma o array em texto, porque o localStorage guarda strings.
function guardarLeads() {
  localStorage.setItem("leads", JSON.stringify(leads));
}


// Recupera os Leads guardados.
// JSON.parse transforma o texto novamente num array JavaScript.
function carregarLeads() {
  let dados = localStorage.getItem("leads");

  if (dados !== null) {
    leads = JSON.parse(dados);
  }
}


// ==========================
// PROCURAR LEAD
// ==========================

// Percorre o array até encontrar o Lead com o ID indicado
function encontrarLead(id) {
  for (let i = 0; i < leads.length; i++) {
    if (leads[i].id === id) {
      return leads[i];
    }
  }

  return null;
}


// ==========================
// REGRA DE NEGÓCIO
// ==========================

// Confirma se os campos necessários estão preenchidos antes de avançar
// de "Levantamento de necessidades" para "Prova de Conceito".
function validarLevantamento(lead) {
  let camposEmFalta = [];

  if (lead.numeroColaboradores === "" || Number(lead.numeroColaboradores) <= 0) {
    camposEmFalta.push("Número de colaboradores");
  }

  if (lead.tipoAtividade === "") {
    camposEmFalta.push("Tipo de atividade");
  }

  if (lead.produto === "") {
    camposEmFalta.push("Produto / Tipo de fardamento");
  }

  if ((lead.tamanhos || "").trim() === "") {
    camposEmFalta.push("Tamanhos");
  }

  if ((lead.cores || "").trim() === "") {
    camposEmFalta.push("Cores");
  }

  if (lead.personalizacao === "") {
    camposEmFalta.push("Personalização / Bordado");
  }

  if (lead.requisitosSeguranca === "") {
    camposEmFalta.push("Requisitos de segurança");
  }

  return camposEmFalta;
}


// ==========================
// ALTERAR ESTADO
// ==========================

// Avança o Lead para o estado seguinte do processo comercial
function avancarEstado(id) {
  let lead = encontrarLead(id);

  if (lead === null) {
    return;
  }

  if (lead.estado === "Novo") {
    lead.estado = "Levantamento de necessidades";

  } else if (lead.estado === "Levantamento de necessidades") {
    let camposEmFalta = validarLevantamento(lead);

    if (camposEmFalta.length > 0) {
      alert(
        "Não é possível avançar para Prova de Conceito.\n\n" +
        "Preencha os seguintes campos:\n" +
        camposEmFalta.join("\n")
      );

      return;
    }

    lead.estado = "Prova de Conceito";

  } else if (lead.estado === "Prova de Conceito") {
    lead.estado = "Proposta";

  } else if (lead.estado === "Proposta") {
    lead.estado = "Negociação";

  } else if (lead.estado === "Negociação") {
    lead.estado = "Ganho";
    lead.dataConclusao = obterDataAtual();

  } else {
    alert("Este Lead já se encontra num estado final.");
    return;
  }

  guardarLeads();
  mostrarLeads();

  if (!modalVer.hidden) {
    verLead(id);
  }
}


// Marca o Lead como Perdido e regista a data de conclusão
function marcarPerdido(id) {
  let lead = encontrarLead(id);

  if (lead === null) {
    return;
  }

  if (lead.estado === "Ganho" || lead.estado === "Perdido") {
    alert("Este Lead já se encontra num estado final.");
    return;
  }

  if (!confirm("Tem a certeza que pretende marcar este Lead como Perdido?")) {
    return;
  }

  lead.estado = "Perdido";
  lead.dataConclusao = obterDataAtual();

  guardarLeads();
  mostrarLeads();
  verLead(id);
}


// ==========================
// INDICADORES / KPI
// ==========================

// Calcula a duração do ciclo de venda em dias
function calcularDias(dataEntrada, dataConclusao) {
  let inicio = new Date(dataEntrada);
  let fim = new Date(dataConclusao);

  // A subtração de duas datas devolve a diferença em milissegundos
  let diferenca = fim - inicio;

  // 1000 ms × 60 s × 60 min × 24 h = número de milissegundos num dia
  return Math.round(diferenca / (1000 * 60 * 60 * 24));
}


// Calcula os KPI apresentados no topo da aplicação
function atualizarIndicadores() {
  let valorAtivo = 0;
  let ganhos = 0;
  let somaDias = 0;
  let ganhosComData = 0;

  for (let i = 0; i < leads.length; i++) {

    // Valor potencial ativo = soma dos orçamentos dos Leads ainda abertos
    if (leads[i].estado !== "Ganho" && leads[i].estado !== "Perdido") {
      valorAtivo += Number(leads[i].orcamento);
    }

    if (leads[i].estado === "Ganho") {
      ganhos++;

      if (leads[i].dataEntrada !== "" && leads[i].dataConclusao !== "") {
        somaDias += calcularDias(leads[i].dataEntrada, leads[i].dataConclusao);
        ganhosComData++;
      }
    }
  }

  let taxaConversao = 0;
  let cicloMedio = 0;

  // Taxa de conversão = Leads ganhos / total de Leads × 100
  if (leads.length > 0) {
    taxaConversao = Math.round((ganhos / leads.length) * 100);
  }

  // Ciclo médio = soma dos dias dos Leads ganhos / número de Leads ganhos com data
  if (ganhosComData > 0) {
    cicloMedio = Math.round(somaDias / ganhosComData);
  }

  document.getElementById("totalLeads").textContent = leads.length;
  document.getElementById("valorPotencial").textContent = valorAtivo.toLocaleString("pt-PT") + " €";
  document.getElementById("leadsGanhos").textContent = ganhos;
  document.getElementById("taxaConversao").textContent = taxaConversao + "%";
  document.getElementById("cicloMedio").textContent = cicloMedio + " dias";
}

// ==========================
// MOSTRAR LEADS
// ==========================

// Mostra os Leads na lista, aplicando pesquisa e filtro por estado
function mostrarLeads() {
  let listaLeads = document.getElementById("listaLeads");

  let pesquisa = document.getElementById("pesquisa").value.toLowerCase().trim();
  let filtroEstado = document.getElementById("filtroEstado").value;

  // Limpa a lista antes de voltar a mostrar os Leads
  listaLeads.innerHTML = "";

  let encontrados = 0;

  for (let i = 0; i < leads.length; i++) {
    let lead = leads[i];

    // Verifica se a empresa ou o contacto contêm o texto pesquisado
    let correspondePesquisa =
      lead.empresa.toLowerCase().includes(pesquisa) ||
      lead.nomeContacto.toLowerCase().includes(pesquisa);

    // Se não houver filtro, mostra todos.
    // Se houver filtro, compara com o estado do Lead.
    let correspondeEstado = filtroEstado === "" || lead.estado === filtroEstado;

    if (correspondePesquisa && correspondeEstado) {
      encontrados++;

      // Cria uma div nova para representar este Lead
      let divLead = document.createElement("div");
      divLead.className = "lead";

      // Cria o conteúdo visual do Lead
      divLead.innerHTML =
        "<p><strong>Empresa / Contacto</strong>" + lead.empresa + "<br>" + lead.nomeContacto + "</p>" +
        "<p><strong>Setor</strong>" + lead.setor + "</p>" +
        "<p><strong>Valor</strong>" + Number(lead.orcamento).toLocaleString("pt-PT") + " €</p>" +
        "<p><strong>Prioridade</strong>" + mostrarPrioridade(lead) + "</p>" +
        "<p><strong>Estado</strong>" + lead.estado + "</p>" +
        "<div class='acoes-lead'>" +
          "<button class='btn-ver' onclick='verLead(" + lead.id + ")'>Ver</button>" +
          "<button class='btn-editar' onclick='editarLead(" + lead.id + ")'>Editar</button>" +
          "<button class='btn-apagar' onclick='eliminarLead(" + lead.id + ")'>Apagar</button>" +
        "</div>";

      // Adiciona a div criada à lista no HTML
      listaLeads.appendChild(divLead);
    }
  }

  // Se nenhum Lead corresponder à pesquisa/filtro
  if (encontrados === 0) {
    listaLeads.innerHTML = "<p>Nenhum Lead encontrado.</p>";
  }

  // Atualiza os KPI sempre que a lista é atualizada
  atualizarIndicadores();
}


// ==========================
// PERCURSO DO LEAD
// ==========================

// Atualiza visualmente o percurso de acordo com o estado atual
function atualizarPercursoLead(estadoAtual) {
  let estados = ["Novo", "Levantamento de necessidades", "Prova de Conceito", "Proposta", "Negociação", "Ganho"];
  let indiceAtual = estados.indexOf(estadoAtual);
  let passos = document.querySelectorAll("#percursoLead .percurso-passo");

  for (let i = 0; i < passos.length; i++) {
    passos[i].classList.remove("concluido");
    passos[i].classList.remove("atual");

    if (indiceAtual >= 0 && i < indiceAtual) {
      passos[i].classList.add("concluido");
    }

    if (indiceAtual >= 0 && i === indiceAtual) {
      passos[i].classList.add("atual");
    }
  }
}


// ==========================
// VER LEAD
// ==========================

function verLead(id) {
  let lead = encontrarLead(id);

  if (lead === null) {
    return;
  }

  // Guarda o ID do Lead atualmente aberto
  idLeadSelecionado = id;

  let telefone = lead.telefone || "—";
  let colaboradores = lead.numeroColaboradores || "—";
  let conclusao = lead.dataConclusao || "Ainda não concluído";

  let prioridade = qualificar(lead);
  let classePrioridade = prioridade.toLowerCase();

  // Preenche o topo da janela
  document.getElementById("verIdLead").textContent = "LEAD · " + formatarId(lead.id);
  document.getElementById("verEmpresaTitulo").textContent = lead.empresa;
  document.getElementById("verSubtitulo").textContent = lead.nomeContacto + " · " + lead.setor;

  // Preenche a prioridade
  let badgePrioridade = document.getElementById("verBadgePrioridade");
  badgePrioridade.textContent = prioridade;
  badgePrioridade.className = "badge-prioridade " + classePrioridade;

  // Preenche o estado
  let badgeEstado = document.getElementById("verBadgeEstado");
  badgeEstado.textContent = lead.estado;
  badgeEstado.className = "badge-estado";

  if (lead.estado === "Perdido") {
    badgeEstado.classList.add("perdido");
  }

  // Preenche os dados do cliente
  document.getElementById("verEmpresa").textContent = lead.empresa;
  document.getElementById("verTelefone").textContent = telefone;
  document.getElementById("verContacto").textContent = lead.nomeContacto;
  document.getElementById("verOrigem").textContent = lead.origem;
  document.getElementById("verEmail").textContent = lead.email;
  document.getElementById("verResponsavel").textContent = lead.comercialResponsavel;

  // Preenche as necessidades do cliente
  document.getElementById("verColaboradores").textContent = colaboradores;
  document.getElementById("verCores").textContent = lead.cores || "—";
  document.getElementById("verAtividade").textContent = lead.tipoAtividade || "—";
  document.getElementById("verPersonalizacao").textContent = lead.personalizacao || "—";
  document.getElementById("verProduto").textContent = lead.produto || "—";
  document.getElementById("verSeguranca").textContent = lead.requisitosSeguranca || "—";
  document.getElementById("verTamanhos").textContent = lead.tamanhos || "—";

  // Preenche a informacao comercial
  document.getElementById("verOrcamento").textContent = Number(lead.orcamento).toLocaleString("pt-PT") + " €";
  document.getElementById("verConclusao").textContent = conclusao;
  document.getElementById("verEntrada").textContent = lead.dataEntrada;
  document.getElementById("verPrioridade").textContent = prioridade;

  // Atualiza o percurso visual
  atualizarPercursoLead(lead.estado);

  // Ganho e Perdido sao estados finais
  let estadoFinal = lead.estado === "Ganho" || lead.estado === "Perdido";

  // Esconde as acoes de avancar quando o Lead esta concluido
  btnAvancarVer.hidden = estadoFinal;
  btnPerdidoVer.hidden = estadoFinal;

  if (lead.estado === "Negociação") {
    btnAvancarVer.textContent = "Marcar como ganho";
  } else {
    btnAvancarVer.textContent = "Avançar estado";
  }

  modalVer.hidden = false;
}


// ==========================
// EDITAR LEAD
// ==========================

function editarLead(id) {
  let lead = encontrarLead(id);

  if (lead === null) {
    return;
  }

  // Guarda o Lead que está a ser editado
  idLeadSelecionado = id;

  // Preenche os campos do formulário com os dados atuais do Lead
  document.getElementById("editEmpresa").value = lead.empresa;
  document.getElementById("editNomeContacto").value = lead.nomeContacto;
  document.getElementById("editEmail").value = lead.email;
  document.getElementById("editTelefone").value = lead.telefone;
  document.getElementById("editOrigem").value = lead.origem;
  document.getElementById("editSetor").value = lead.setor;
  document.getElementById("editNumeroColaboradores").value = lead.numeroColaboradores;
  document.getElementById("editTipoAtividade").value = lead.tipoAtividade;
  document.getElementById("editProduto").value = lead.produto;
  document.getElementById("editTamanhos").value = lead.tamanhos;
  document.getElementById("editCores").value = lead.cores;
  document.getElementById("editPersonalizacao").value = lead.personalizacao;
  document.getElementById("editRequisitosSeguranca").value = lead.requisitosSeguranca;
  document.getElementById("editOrcamento").value = lead.orcamento;
  document.getElementById("editComercialResponsavel").value = lead.comercialResponsavel;
  document.getElementById("editObservacoes").value = lead.observacoes;

  // Fecha o Ver e abre o Editar
  modalVer.hidden = true;
  modalEditar.hidden = false;
}


// ==========================
// ELIMINAR LEAD
// ==========================

function eliminarLead(id) {
  let lead = encontrarLead(id);

  if (lead === null) {
    return;
  }

  // Guarda o ID do Lead que poderá ser eliminado
  idLeadEliminar = id;

  // Cria a mensagem de confirmação
  textoEliminar.textContent = "Pretende eliminar o Lead " + formatarId(lead.id) + " - " + lead.empresa + "?";

  // Fecha o modal Ver e abre o modal Eliminar
  modalVer.hidden = true;
  modalEliminar.hidden = false;
}

// ==========================
// ELEMENTOS DO HTML
// ==========================

const btnNovoLead = document.getElementById("btnNovoLead");
const btnCancelar = document.getElementById("btnCancelar");

const novoLeadform = document.getElementById("novoLead");

const formLead = document.getElementById("formLead");
const formEditarLead = document.getElementById("formEditarLead");

const modalVer = document.getElementById("modalVer");
const modalEditar = document.getElementById("modalEditar");
const modalEliminar = document.getElementById("modalEliminar");

const textoEliminar = document.getElementById("textoEliminar");

const btnAvancarVer = document.getElementById("btnAvancarVer");
const btnPerdidoVer = document.getElementById("btnPerdidoVer");


// ==========================
// EVENTOS NOVO LEAD
// ==========================

// Abre o formulário de criação de um novo Lead
btnNovoLead.addEventListener("click", function () {
  novoLeadform.hidden = false;
});


// Fecha o formulário sem criar o Lead
btnCancelar.addEventListener("click", function () {
  novoLeadform.hidden = true;
  formLead.reset();
});


// Criar novo Lead
formLead.addEventListener("submit", function (event) {

  // Impede o envio tradicional do formulário
  // e evita que a página seja recarregada
  event.preventDefault();

  // Vai buscar os valores preenchidos no formulário
  let empresa = document.getElementById("empresa").value.trim();
  let nomeContacto = document.getElementById("nomeContacto").value.trim();
  let email = document.getElementById("email").value.trim();
  let telefone = document.getElementById("telefone").value;
  let origem = document.getElementById("origem").value;
  let setor = document.getElementById("setor").value;
  let numeroColaboradores = document.getElementById("numeroColaboradores").value;
  let tipoAtividade = document.getElementById("tipoAtividade").value;
  let produto = document.getElementById("produto").value;
  let tamanhos = document.getElementById("tamanhos").value.trim();
  let cores = document.getElementById("cores").value.trim();
  let personalizacao = document.getElementById("personalizacao").value;
  let requisitosSeguranca = document.getElementById("requisitosSeguranca").value;
  let orcamento = document.getElementById("orcamento").value;
  let comercial = document.getElementById("comercialResponsavel").value;
  let observacoes = document.getElementById("observacoes").value.trim();


  // ==========================
  // VALIDAÇÃO
  // ==========================

  // Verifica se os campos obrigatórios estão preenchidos
  if (
    empresa === "" ||
    nomeContacto === "" ||
    email === "" ||
    origem === "" ||
    setor === "" ||
    orcamento === "" ||
    Number(orcamento) <= 0 ||
    comercial === ""
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }


  // ==========================
  // CAMPOS NUMÉRICOS
  // ==========================

  let telefoneFinal = "";
  let colaboradoresFinal = "";

  // Se houver telefone, transforma em número
  if (telefone !== "") {
    telefoneFinal = Number(telefone);
  }

  // Se houver número de colaboradores, transforma em número
  if (numeroColaboradores !== "") {
    colaboradoresFinal = Number(numeroColaboradores);
  }


  // ==========================
  // CRIAÇÃO DO LEAD
  // ==========================

  // Cria o objeto Lead com os dados recolhidos
  let novoLead = criarLead(
    gerarId(),
    origem,
    empresa,
    nomeContacto,
    email,
    telefoneFinal,
    setor,
    colaboradoresFinal,
    tipoAtividade,
    produto,
    tamanhos,
    cores,
    personalizacao,
    requisitosSeguranca,
    Number(orcamento),
    comercial,
    observacoes
  );

  // Adiciona o novo Lead ao array
  leads.push(novoLead);

  // Guarda e atualiza o ecrã
  guardarLeads();
  mostrarLeads();

  // Limpa e fecha o formulário
  formLead.reset();
  novoLeadform.hidden = true;

  alert("Lead criado com sucesso!");
});


// ==========================
// EVENTOS MODAL VER
// ==========================

// Fecha o modal Ver
document.getElementById("btnFecharVer").addEventListener("click", function () {
  modalVer.hidden = true;
});


// Abre a edição do Lead selecionado
document.getElementById("btnEditarVer").addEventListener("click", function () {
  editarLead(idLeadSelecionado);
});


// Avança o Lead para o estado seguinte
btnAvancarVer.addEventListener("click", function () {
  avancarEstado(idLeadSelecionado);
});


// Marca o Lead como Perdido
btnPerdidoVer.addEventListener("click", function () {
  marcarPerdido(idLeadSelecionado);
});


// Abre a confirmação para eliminar
document.getElementById("btnEliminarVer").addEventListener("click", function () {
  eliminarLead(idLeadSelecionado);
});


// ==========================
// EVENTOS EDITAR
// ==========================

// Fecha o modal de edição
document.getElementById("btnFecharEditar").addEventListener("click", function () {
  modalEditar.hidden = true;
});


// Cancela a edição
document.getElementById("btnCancelarEditar").addEventListener("click", function () {
  modalEditar.hidden = true;
});

// Guardar alterações do Lead
formEditarLead.addEventListener("submit", function (event) {

  // Impede o formulário de recarregar a página
  event.preventDefault();

  // Procura o Lead que está a ser editado
  let lead = encontrarLead(idLeadSelecionado);

  if (lead === null) {
    return;
  }


  // Vai buscar os valores editados
  let empresa = document.getElementById("editEmpresa").value.trim();
  let nomeContacto = document.getElementById("editNomeContacto").value.trim();
  let email = document.getElementById("editEmail").value.trim();
  let origem = document.getElementById("editOrigem").value;
  let setor = document.getElementById("editSetor").value;
  let orcamento = document.getElementById("editOrcamento").value;
  let comercial = document.getElementById("editComercialResponsavel").value;


  // ==========================
  // VALIDAÇÃO
  // ==========================

  if (
    empresa === "" ||
    nomeContacto === "" ||
    email === "" ||
    origem === "" ||
    setor === "" ||
    orcamento === "" ||
    Number(orcamento) <= 0 ||
    comercial === ""
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }


  // ==========================
  // ATUALIZAR O LEAD
  // ==========================

  lead.empresa = empresa;
  lead.nomeContacto = nomeContacto;
  lead.email = email;
  lead.origem = origem;
  lead.setor = setor;
  lead.orcamento = Number(orcamento);
  lead.comercialResponsavel = comercial;

  lead.telefone = document.getElementById("editTelefone").value;
  lead.numeroColaboradores = document.getElementById("editNumeroColaboradores").value;
  lead.tipoAtividade = document.getElementById("editTipoAtividade").value;
  lead.produto = document.getElementById("editProduto").value;
  lead.tamanhos = document.getElementById("editTamanhos").value.trim();
  lead.cores = document.getElementById("editCores").value.trim();
  lead.personalizacao = document.getElementById("editPersonalizacao").value;
  lead.requisitosSeguranca = document.getElementById("editRequisitosSeguranca").value;
  lead.observacoes = document.getElementById("editObservacoes").value.trim();


  // Guarda as alterações
  guardarLeads();
  mostrarLeads();

  // Fecha o modal
  modalEditar.hidden = true;

  alert("Alterações guardadas com sucesso!");
});


// ==========================
// EVENTOS ELIMINAR
// ==========================

// Cancela a eliminação
document.getElementById("btnCancelarEliminar").addEventListener("click", function () {
  modalEliminar.hidden = true;
  idLeadEliminar = null;
});


// Confirma a eliminação
document.getElementById("btnConfirmarEliminar").addEventListener("click", function () {

  // Percorre os Leads até encontrar o que queremos eliminar
  for (let i = 0; i < leads.length; i++) {

    if (leads[i].id === idLeadEliminar) {

      // Remove 1 elemento do array na posição i
      leads.splice(i, 1);

      // Como já encontrou o Lead, termina o ciclo
      break;
    }
  }

  // Guarda o novo array e atualiza a lista
  guardarLeads();
  mostrarLeads();

  // Fecha o modal e limpa o ID
  modalEliminar.hidden = true;
  idLeadEliminar = null;

  alert("Lead eliminado com sucesso!");
});


// ==========================
// PESQUISA E FILTRO
// ==========================

// Atualiza a lista à medida que o utilizador escreve
document.getElementById("pesquisa").addEventListener("input", function () {
  mostrarLeads();
});


// Atualiza a lista quando o estado selecionado muda
document.getElementById("filtroEstado").addEventListener("change", function () {
  mostrarLeads();
});


// ==========================
// INÍCIO DA APLICAÇÃO
// ==========================

// Recupera os Leads guardados no localStorage
carregarLeads();

// Mostra os Leads e calcula os indicadores
mostrarLeads();