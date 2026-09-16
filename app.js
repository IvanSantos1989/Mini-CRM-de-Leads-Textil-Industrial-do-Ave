let leads = []; // Lista onde ficam guardados todos os Leads.

let idLeadSelecionado = null; // Guarda o ID do Lead que esta aberto ou a ser editado.
let idLeadEliminar = null; // Guarda o ID do Lead escolhido para eliminar.


// FUNCOES PRINCIPAIS


// Cria um novo Lead com todos os dados recebidos do formulario.
function criarLead(id, origem, empresa, nomeContacto, email, codigoPais, telefone, setor, numeroColaboradores, tipoAtividade,
  produto, tamanhos, cores, personalizacao, requisitosSeguranca, orcamento, comercialResponsavel, observacoes,) {
  return {
    id: id,
    origem: origem,
    empresa: empresa,
    nomeContacto: nomeContacto,
    email: email,
    codigoPais: codigoPais,
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
    dataEntrada: obterDataAtual(), // Guarda automaticamente a data em que o Lead foi criado.
    dataConclusao: "", // Fica vazia enquanto o Lead ainda nao estiver concluido.
    estado: "Novo", // Todos os Leads comecam no estado Novo.
  };
}


// Define automaticamente se o Lead e Quente, Morno ou Frio atraves do orcamento.
function qualificar(lead) {
  if (lead.orcamento >= 10000) {
    return "Quente";
  }

  if (lead.orcamento >= 5000) {
    return "Morno";
  }

  return "Frio";
}


// Prepara a prioridade para aparecer visualmente com a classe CSS correspondente.
function criarPrioridade(lead) {
  let prioridade = qualificar(lead);

  // Transforma, por exemplo, "Morno" em "morno" para usar como classe CSS.
  let classePrioridade = prioridade.toLowerCase();

  // Cria o elemento que vai mostrar a prioridade.
  let spanPrioridade = document.createElement("span");
  spanPrioridade.className = "prioridade prioridade-" + classePrioridade;

  // Cria o ponto colorido da prioridade.
  let ponto = document.createElement("span");
  ponto.className = "prioridade-ponto";

  spanPrioridade.appendChild(ponto);
  spanPrioridade.appendChild(document.createTextNode(prioridade));

  return spanPrioridade;
}


// Cria um campo da lista com o titulo e respetivo valor.
function criarCampoLista(titulo, valor) {
  let campo = document.createElement("p");

  let tituloCampo = document.createElement("strong");
  tituloCampo.textContent = titulo;

  campo.appendChild(tituloCampo);
  campo.appendChild(document.createTextNode(valor));

  return campo;
}


// Procura o maior ID existente e devolve o numero seguinte.
function gerarId() {
  let maiorId = 0;

  // Percorre todos os Leads, um a um. O i representa a posicao atual no array.
  for (let i = 0; i < leads.length; i++) {

    // Se o ID do Lead atual for maior, passa a ser o maior ID encontrado.
    if (leads[i].id > maiorId) {
      maiorId = leads[i].id;
    }
  }

  // O novo Lead recebe o numero seguinte ao maior ID encontrado.
  return maiorId + 1;
}


// Transforma o ID numerico num formato visual como LD-001.
function formatarId(id) {
  return "LD-" + String(id).padStart(3, "0");
}


// Obtem a data atual no formato AAAA-MM-DD.
function obterDataAtual() {
  let hoje = new Date();

  return hoje.toISOString().slice(0, 10);
}


// Guarda a lista de Leads no navegador.
function guardarLeads() {

  // JSON.stringify transforma os dados em texto para o localStorage os conseguir guardar.
  localStorage.setItem("leads", JSON.stringify(leads));
}


// Recupera os Leads que estavam guardados no navegador.
function carregarLeads() {
  let dados = localStorage.getItem("leads");

  if (dados === null) { // Se nao existirem dados guardados, termina a função.
    return;
  }

  try {
    // Tenta transformar o texto guardado novamente num array JavaScript.
    let dadosConvertidos = JSON.parse(dados);

    // Confirma se os dados recuperados sao realmente um array.
    if (Array.isArray(dadosConvertidos)) {
      leads = dadosConvertidos;
    } else {
      leads = [];
    }

  } catch (erro) {
    // Se os dados estiverem invalidos, mantem a aplicacao funcional com uma lista vazia.
    leads = [];

    console.error("Erro ao carregar os Leads do localStorage:", erro);
    alert("Erro ao carregar as leads!")
  }
}


// Procura um Lead especifico atraves do seu ID.
function encontrarLead(id) {

  // Percorre todos os Leads, um a um, ate encontrar o ID procurado.
  for (let i = 0; i < leads.length; i++) {

    // Compara o ID do Lead atual com o ID que estamos a procurar.
    if (leads[i].id === id) {
      return leads[i];
    }
  }

  // Se percorrer todos os Leads e nao encontrar nenhum, devolve null.
  return null;
}

// REGRA DE NEGOCIO
// Valida o telefone quando este estiver preenchido.
function validarTelefone(telefone) {

  // O telefone e opcional, por isso vazio e considerado valido.
  if (telefone === "") {
    return true;
  }

  // Se estiver preenchido, deve conter exatamente 9 digitos.
  if (telefone.length !== 9 || isNaN(telefone)) {
    return false;
  }

  return true;
}


// Verifica se ja existe outro Lead com o mesmo email.
function emailJaExiste(email, idIgnorar) {

  // Percorre todos os Leads para comparar os emails.
  for (let i = 0; i < leads.length; i++) {

    // Ignora o proprio Lead durante a edicao.
    if (
      leads[i].email.toLowerCase() === email.toLowerCase() &&
      leads[i].id !== idIgnorar
    ) {
      return true;
    }
  }

  return false;
}


// Verifica se os campos necessarios estao preenchidos antes de o Lead avancar para Prova de Conceito.
function validarLevantamento(lead) {
  let camposEmFalta = [];

  // Se o numero de colaboradores estiver vazio ou for 0, adiciona este campo a lista de faltas.
  if (lead.numeroColaboradores === "" || Number(lead.numeroColaboradores) <= 0) {
    camposEmFalta.push("Numero de colaboradores");
  }

  if (lead.tipoAtividade === "") {
    camposEmFalta.push("Tipo de atividade");
  }

  if (lead.produto === "") {
    camposEmFalta.push("Produto / Tipo de fardamento");
  }

  // trim() remove espacos para evitar considerar um campo com apenas espacos como preenchido.
  if ((lead.tamanhos || "").trim() === "") {
    camposEmFalta.push("Tamanhos");
  }

  if ((lead.cores || "").trim() === "") {
    camposEmFalta.push("Cores");
  }

  if (lead.personalizacao === "") {
    camposEmFalta.push("Personalizacao / Bordado");
  }

  if (lead.requisitosSeguranca === "") {
    camposEmFalta.push("Requisitos de seguranca");
  }

  // Devolve a lista dos campos que ainda estao em falta.
  return camposEmFalta;
}


// ========================= CELEBRACAO LEAD GANHO =========================
// Mostra o GIF "WINNING" durante 3 segundos quando um Lead passa para Ganho.
// Esta funcao nao altera dados do Lead: controla apenas a celebracao visual.
function mostrarCelebracaoGanho() {
  let celebracao = document.getElementById("celebracaoGanho");

  // Se o elemento nao existir no HTML, termina sem provocar erro no CRM.
  if (celebracao === null) {
    return;
  }

  // Mostra a camada com o GIF por cima do CRM.
  celebracao.hidden = false;

  // Ao fim de 3 segundos, volta a esconder automaticamente a celebracao.
  setTimeout(function () {
    celebracao.hidden = true;
  }, 3000);
}


// ALTERAR ESTADO
// Avanca o Lead para a etapa seguinte do processo comercial.
function avancarEstado(id) {

  // Procura o Lead que corresponde ao ID recebido.
  let lead = encontrarLead(id);

  // Se o Lead nao existir, termina a funcao.
  if (lead === null) {
    return;
  }

  // Se estiver em Novo, passa para Levantamento de necessidades.
  if (lead.estado === "Novo") {
    lead.estado = "Levantamento de necessidades";

  } else if (lead.estado === "Levantamento de necessidades") {

    // Antes de avancar, verifica se os campos obrigatorios estao preenchidos.
    let camposEmFalta = validarLevantamento(lead);

    // Se houver campos em falta, mostra um aviso e nao deixa avancar.
    if (camposEmFalta.length > 0) {
      alert("Não é possível avançar para Prova de Conceito.\n\n" +
        "Preencha os seguintes campos:\n" + camposEmFalta.join("\n"));
      return;
    }

    lead.estado = "Prova de Conceito";

  } else if (lead.estado === "Prova de Conceito") {
    lead.estado = "Proposta";

  } else if (lead.estado === "Proposta") {
    lead.estado = "Negociação";

  } else if (lead.estado === "Negociação") {
    lead.estado = "Ganho";

    // Quando o Lead fica Ganho, guarda automaticamente a data de conclusao.
    lead.dataConclusao = obterDataAtual();

    // CELEBRACAO: mostra o GIF "WINNING" apenas quando o Lead acaba de ser ganho.
    mostrarCelebracaoGanho();

  } else {

    // Se ja estiver num estado final, nao deixa continuar a avancar.
    alert("Este Lead já se encontra num estado final.");
    return;
  }

  // Guarda o novo estado e atualiza a lista.
  guardarLeads();
  mostrarLeads();

  // Se a janela Ver Lead estiver aberta, atualiza os dados apresentados.
  if (!modalVer.hidden) {
    verLead(id);
  }
}


// Marca um Lead como Perdido e termina o processo comercial desse Lead.
function marcarPerdido(id) {

  // Procura o Lead que corresponde ao ID recebido.
  let lead = encontrarLead(id);

  // Se nao encontrar o Lead, termina a funcao.
  if (lead === null) {
    return;
  }

  // Ganho e Perdido sao estados finais, por isso nao permite voltar a alterar.
  if (lead.estado === "Ganho" || lead.estado === "Perdido") {
    alert("Este Lead já se encontra num estado final.");
    return;
  }

  // Pede confirmacao antes de marcar o Lead como Perdido.
  if (!confirm("Tem a certeza que pretende marcar este Lead como Perdido?")) {
    return;
  }

  // Altera o estado e guarda a data em que o processo terminou.
  lead.estado = "Perdido";
  lead.dataConclusao = obterDataAtual();

  // Guarda as alteracoes e atualiza o ecra.
  guardarLeads();
  mostrarLeads();
  verLead(id);
}

// INDICADORES / KPI
// Calcula quantos dias passaram entre a entrada e a conclusao do Lead.
function calcularDias(dataEntrada, dataConclusao) {
  let inicio = new Date(dataEntrada);
  let fim = new Date(dataConclusao);

  // Se alguma data nao for valida, nao faz o calculo.
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    return null;
  }

  // Calcula a diferenca entre as duas datas.
  let diferenca = fim - inicio;

  // Converte a diferenca de milissegundos para dias.
  return Math.round(diferenca / (1000 * 60 * 60 * 24));
}


// Calcula os indicadores apresentados no topo do CRM.
function atualizarIndicadores() {
  let valorAtivo = 0;
  let ganhos = 0;
  let somaDias = 0;
  let ganhosComData = 0;

  // Percorre todos os Leads para calcular os indicadores.
  for (let i = 0; i < leads.length; i++) {

    // Soma os orcamentos dos Leads que ainda estao em aberto.
    if (leads[i].estado !== "Ganho" && leads[i].estado !== "Perdido") {
      valorAtivo += Number(leads[i].orcamento);
    }

    // Conta quantos Leads terminaram como Ganho.
    if (leads[i].estado === "Ganho") {
      ganhos++;

      // So calcula o ciclo se existirem data de entrada e de conclusao.
      if (leads[i].dataEntrada && leads[i].dataConclusao) {
        let dias = calcularDias(leads[i].dataEntrada, leads[i].dataConclusao);

        if (dias !== null) {
          somaDias += dias;
          ganhosComData++;
        }
      }
    }
  }

  let taxaConversao = 0;
  let cicloMedio = 0;

  // Calcula a percentagem de Leads ganhos em relacao ao total.
  if (leads.length > 0) {
    taxaConversao = Math.round((ganhos / leads.length) * 100);
  }

  // Calcula a media de dias dos Leads ganhos.
  if (ganhosComData > 0) {
    cicloMedio = Math.round(somaDias / ganhosComData);
  }

  // Mostra os resultados nos indicadores do HTML.
  document.getElementById("totalLeads").textContent = leads.length;
  document.getElementById("valorPotencial").textContent = valorAtivo.toLocaleString("pt-PT") + " €";
  document.getElementById("leadsGanhos").textContent = ganhos;
  document.getElementById("taxaConversao").textContent = taxaConversao + "%";

    // So mostra o ciclo medio quando existir pelo menos um Lead ganho com datas validas.
  if (ganhosComData > 0) {
    document.getElementById("cicloMedio").textContent = cicloMedio + " dias";
  } else {
    document.getElementById("cicloMedio").textContent = "—";
  }
}

// Mostra os Leads na lista e aplica pesquisa e filtro por estado.
function mostrarLeads() {
  let listaLeads = document.getElementById("listaLeads");
  let pesquisa = document.getElementById("pesquisa").value.toLowerCase().trim();
  let filtroEstado = document.getElementById("filtroEstado").value;

  // Limpa a lista antes de a voltar a construir.
  listaLeads.textContent = "";

  let encontrados = 0;

  // Percorre todos os Leads.
  for (let i = 0; i < leads.length; i++) {
    let lead = leads[i];

    // Verifica se a empresa ou o contacto contem o texto pesquisado.
    let correspondePesquisa =
      lead.empresa.toLowerCase().includes(pesquisa) ||
      lead.nomeContacto.toLowerCase().includes(pesquisa);

    // Sem filtro mostra todos. Com filtro, compara o estado.
    let correspondeEstado =
      filtroEstado === "" || lead.estado === filtroEstado;

    // So mostra o Lead se cumprir a pesquisa e o filtro.
    if (correspondePesquisa && correspondeEstado) {
      encontrados++;

      // Cria um bloco HTML para este Lead.
      let divLead = document.createElement("div");
      divLead.className = "lead";


      // Cria o campo Empresa / Contacto.
      let campoEmpresa = document.createElement("p");

      let tituloEmpresa = document.createElement("strong");
      tituloEmpresa.textContent = "Empresa / Contacto";

      campoEmpresa.appendChild(tituloEmpresa);
      campoEmpresa.appendChild(document.createTextNode(lead.empresa));
      campoEmpresa.appendChild(document.createElement("br"));
      campoEmpresa.appendChild(document.createTextNode(lead.nomeContacto));

      divLead.appendChild(campoEmpresa);


      // Cria os restantes campos apresentados na lista.
      divLead.appendChild(criarCampoLista("Setor", lead.setor));

      divLead.appendChild(
        criarCampoLista(
          "Valor",
          Number(lead.orcamento).toLocaleString("pt-PT") + " €"
        )
      );


      // Cria o campo da prioridade.
      let campoPrioridade = document.createElement("p");

      let tituloPrioridade = document.createElement("strong");
      tituloPrioridade.textContent = "Prioridade";

      campoPrioridade.appendChild(tituloPrioridade);
      campoPrioridade.appendChild(criarPrioridade(lead));

      divLead.appendChild(campoPrioridade);
      divLead.appendChild(criarCampoLista("Estado", lead.estado));


      // Cria a area dos botoes.
      let acoes = document.createElement("div");
      acoes.className = "acoes-lead";


      // Cria o botao Ver e associa o respetivo evento.
      let btnVer = document.createElement("button");
      btnVer.className = "btn-ver";
      btnVer.textContent = "Ver";

      btnVer.addEventListener("click", function () {
        verLead(lead.id);
      });


      // Cria o botao Editar e associa o respetivo evento.
      let btnEditar = document.createElement("button");
      btnEditar.className = "btn-editar";
      btnEditar.textContent = "Editar";

      btnEditar.addEventListener("click", function () {
        editarLead(lead.id);
      });


      // Cria o botao Apagar e associa o respetivo evento.
      let btnApagar = document.createElement("button");
      btnApagar.className = "btn-apagar";
      btnApagar.textContent = "Apagar";

      btnApagar.addEventListener("click", function () {
        eliminarLead(lead.id);
      });


      acoes.appendChild(btnVer);
      acoes.appendChild(btnEditar);
      acoes.appendChild(btnApagar);

      divLead.appendChild(acoes);

      // Adiciona o bloco deste Lead a lista.
      listaLeads.appendChild(divLead);
    }
  }


  // Se nenhum Lead corresponder, mostra uma mensagem.
  if (encontrados === 0) {
    let mensagem = document.createElement("p");
    mensagem.textContent = "Nenhum Lead encontrado.";

    listaLeads.appendChild(mensagem);
  }


  // Atualiza tambem os indicadores.
  atualizarIndicadores();
}

// PERCURSO DO LEAD
// Atualiza visualmente as etapas do processo comercial.
function atualizarPercursoLead(estadoAtual) {
  let estados = ["Novo", "Levantamento de necessidades", "Prova de Conceito", "Proposta", "Negociação", "Ganho"];

  // Procura a posicao do estado atual dentro da lista de estados.
  let indiceAtual = estados.indexOf(estadoAtual);

  // Vai buscar todos os passos do percurso no HTML.
  let passos = document.querySelectorAll("#percursoLead .percurso-passo");

  // Percorre todos os passos do percurso.
  for (let i = 0; i < passos.length; i++) {
    passos[i].classList.remove("concluido");
    passos[i].classList.remove("atual");

    // Os passos anteriores ao atual ficam como concluidos.
    if (indiceAtual >= 0 && i < indiceAtual) {
      passos[i].classList.add("concluido");
    }

    // O passo correspondente ao estado atual fica destacado.
    if (indiceAtual >= 0 && i === indiceAtual) {
      passos[i].classList.add("atual");
    }
  }
}


// VER LEAD
function verLead(id) {
  let lead = encontrarLead(id);

  // Se o Lead nao existir, termina.
  if (lead === null) {
    return;
  }

  // Guarda o ID do Lead que esta aberto.
  idLeadSelecionado = id;

  // Define valores alternativos caso alguns campos estejam vazios.
  let telefone = "—";
  if (lead.telefone) { // Junta o codigo do pais ao telefone quando este estiver preenchido.
    telefone = (lead.codigoPais || "+351") + " " + lead.telefone;
  }

  let colaboradores = lead.numeroColaboradores || "—";
  let conclusao = lead.dataConclusao || "Ainda não concluído";

  let prioridade = qualificar(lead);
  let classePrioridade = prioridade.toLowerCase();

  // Preenche o topo da janela Ver Lead.
  document.getElementById("verIdLead").textContent = "LEAD · " + formatarId(lead.id);
  document.getElementById("verEmpresaTitulo").textContent = lead.empresa;
  document.getElementById("verSubtitulo").textContent = lead.nomeContacto + " · " + lead.setor;

  // Mostra a prioridade.
  let badgePrioridade = document.getElementById("verBadgePrioridade");
  badgePrioridade.textContent = prioridade;
  badgePrioridade.className = "badge-prioridade " + classePrioridade;

  // Mostra o estado.
  let badgeEstado = document.getElementById("verBadgeEstado");
  badgeEstado.textContent = lead.estado;
  badgeEstado.className = "badge-estado";

  // Se estiver Perdido, adiciona a classe visual correspondente.
  if (lead.estado === "Perdido") {
    badgeEstado.classList.add("perdido");
  }

  // Preenche os dados do cliente.
  document.getElementById("verEmpresa").textContent = lead.empresa;
  document.getElementById("verTelefone").textContent = telefone;
  document.getElementById("verContacto").textContent = lead.nomeContacto;
  document.getElementById("verOrigem").textContent = lead.origem;
  document.getElementById("verEmail").textContent = lead.email;
  document.getElementById("verResponsavel").textContent = lead.comercialResponsavel;

  // Preenche as necessidades do cliente.
  document.getElementById("verColaboradores").textContent = colaboradores;
  document.getElementById("verCores").textContent = lead.cores || "—";
  document.getElementById("verAtividade").textContent = lead.tipoAtividade || "—";
  document.getElementById("verPersonalizacao").textContent = lead.personalizacao || "—";
  document.getElementById("verProduto").textContent = lead.produto || "—";
  document.getElementById("verSeguranca").textContent = lead.requisitosSeguranca || "—";
  document.getElementById("verTamanhos").textContent = lead.tamanhos || "—";
  document.getElementById("verObservacoes").textContent = lead.observacoes || "—";

  // Preenche os dados comerciais.
  document.getElementById("verOrcamento").textContent = Number(lead.orcamento).toLocaleString("pt-PT") + " €";
  document.getElementById("verConclusao").textContent = conclusao;
  document.getElementById("verEntrada").textContent = lead.dataEntrada;
  document.getElementById("verPrioridade").textContent = prioridade;

  // Atualiza o percurso visual.
  atualizarPercursoLead(lead.estado);

  // Ganho e Perdido sao estados finais.
  let estadoFinal = lead.estado === "Ganho" || lead.estado === "Perdido";

  // Esconde os botoes de avancar quando o Lead ja terminou.
  btnAvancarVer.hidden = estadoFinal;
  btnPerdidoVer.hidden = estadoFinal;

  // Na etapa Negociacao, o botao passa a indicar que vai marcar como Ganho.
  if (lead.estado === "Negociação") {
    btnAvancarVer.textContent = "Marcar como ganho";
  } else {
    btnAvancarVer.textContent = "Avançar estado";
  }

  // Abre a janela Ver Lead.
  modalVer.hidden = false;
}

// EDITAR LEAD
function editarLead(id) {
  let lead = encontrarLead(id);

  // Se o Lead nao existir, termina.
  if (lead === null) {
    return;
  }

  // Guarda o ID do Lead que esta a ser editado.
  idLeadSelecionado = id;

  // Preenche o formulario de edicao com os dados atuais do Lead.
  document.getElementById("editEmpresa").value = lead.empresa;
  document.getElementById("editNomeContacto").value = lead.nomeContacto;
  document.getElementById("editEmail").value = lead.email;
  document.getElementById("editCodigoPais").value = lead.codigoPais || "+351";
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

  // Fecha a janela Ver e abre a janela Editar.
  modalVer.hidden = true;
  modalEditar.hidden = false;
}


// ELIMINAR LEAD
function eliminarLead(id) {
  let lead = encontrarLead(id);

  // Se o Lead nao existir, termina.
  if (lead === null) {
    return;
  }

  // Guarda o ID do Lead que podera ser eliminado.
  idLeadEliminar = id;

  // Mostra uma mensagem de confirmacao com o ID e a empresa.
  textoEliminar.textContent = "Pretende eliminar o Lead " + formatarId(lead.id) + " - " + lead.empresa + "?";

  // Fecha Ver e abre a janela de eliminacao.
  modalVer.hidden = true;
  modalEliminar.hidden = false;
}

// ELEMENTOS DO HTML
// Guarda referencias para elementos que vao ser usados varias vezes no JavaScript.
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


// EVENTOS NOVO LEAD
// Ao clicar em Novo Lead, abre o formulario.
btnNovoLead.addEventListener("click", function () {
  novoLeadform.hidden = false;
});


// Ao cancelar, fecha e limpa o formulario.
btnCancelar.addEventListener("click", function () {
  novoLeadform.hidden = true;
  formLead.reset();
});


// Ao enviar o formulario, valida os dados e cria um novo Lead.
formLead.addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o formulario de recarregar a pagina.

  // Le os valores preenchidos no formulario.
  let empresa = document.getElementById("empresa").value.trim();
  let nomeContacto = document.getElementById("nomeContacto").value.trim();
  let email = document.getElementById("email").value.trim();
  let codigoPais = document.getElementById("codigoPais").value;
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


  // VALIDACAO
  // Confirma se os campos obrigatorios estao corretamente preenchidos.
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


  // CAMPOS NUMERICOS
  let colaboradoresFinal = "";

  // Se existir numero de colaboradores, converte para numero.
  if (numeroColaboradores !== "") {
    colaboradoresFinal = Number(numeroColaboradores);
  }

     // Confirma se o telefone tem exatamente 9 digitos quando estiver preenchido.
  if (!validarTelefone(telefone)) {
    alert("O telefone deve conter exatamente 9 números.");
    return;
  }


  // Impede que o email seja igual ao de outro Lead.
  if (emailJaExiste(email, null)) {
    alert("Já existe outro Lead registado com este email.");
    return;
  }


  // CRIACAO DO LEAD
  // Junta os dados recolhidos e cria o novo Lead com um ID automatico.
  let novoLead = criarLead(gerarId(), origem, empresa, nomeContacto, email, codigoPais, telefone, setor, colaboradoresFinal,
    tipoAtividade, produto, tamanhos, cores, personalizacao, requisitosSeguranca, Number(orcamento), comercial, observacoes);

  // Adiciona o novo Lead a lista.
  leads.push(novoLead);

  // Guarda e atualiza o ecra.
  guardarLeads();
  mostrarLeads();

  // Limpa e fecha o formulario.
  formLead.reset();
  novoLeadform.hidden = true;

  alert("Lead criado com sucesso!");
});

// EVENTOS JANELA VER

// Fecha a janela Ver Lead.
document.getElementById("btnFecharVer").addEventListener("click", function () {
  modalVer.hidden = true;
});


// Abre a edicao do Lead atualmente selecionado.
document.getElementById("btnEditarVer").addEventListener("click", function () {
  editarLead(idLeadSelecionado);
});


// Avanca o Lead selecionado para o estado seguinte.
btnAvancarVer.addEventListener("click", function () {
  avancarEstado(idLeadSelecionado);
});


// Marca o Lead selecionado como Perdido.
btnPerdidoVer.addEventListener("click", function () {
  marcarPerdido(idLeadSelecionado);
});


// Abre a confirmacao para eliminar o Lead selecionado.
document.getElementById("btnEliminarVer").addEventListener("click", function () {
  eliminarLead(idLeadSelecionado);
});


// EVENTOS EDITAR

// Fecha a janela de edicao.
document.getElementById("btnFecharEditar").addEventListener("click", function () {
  modalEditar.hidden = true;
});


// Cancela a edicao.
document.getElementById("btnCancelarEditar").addEventListener("click", function () {
  modalEditar.hidden = true;
});


// Ao enviar o formulario de edicao, guarda as alteracoes.
formEditarLead.addEventListener("submit", function (event) {
  event.preventDefault();

  // Procura o Lead que esta a ser editado.
  let lead = encontrarLead(idLeadSelecionado);

  if (lead === null) {
    return;
  }

  // Le os principais valores editados.
  let empresa = document.getElementById("editEmpresa").value.trim();
  let nomeContacto = document.getElementById("editNomeContacto").value.trim();
  let email = document.getElementById("editEmail").value.trim();
  let codigoPais = document.getElementById("editCodigoPais").value;
  let telefone = document.getElementById("editTelefone").value;
  let origem = document.getElementById("editOrigem").value;
  let setor = document.getElementById("editSetor").value;
  let orcamento = document.getElementById("editOrcamento").value;
  let comercial = document.getElementById("editComercialResponsavel").value;


  // VALIDACAO
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

  if (!validarTelefone(telefone)) {
    alert("O telefone deve conter exatamente 9 números.");
    return;
  }

  if (emailJaExiste(email, lead.id)) {
    alert("Já existe outro Lead registado com este email.");
    return;
  }


  // Atualiza os dados principais do Lead.
  lead.empresa = empresa;
  lead.nomeContacto = nomeContacto;
  lead.email = email;
  lead.origem = origem;
  lead.setor = setor;
  lead.orcamento = Number(orcamento);
  lead.comercialResponsavel = comercial;

  // Atualiza os restantes campos diretamente a partir do formulario.
  // lead.telefone = document.getElementById("editTelefone").value;
  lead.codigoPais = codigoPais;
  lead.telefone = telefone;
  lead.numeroColaboradores = document.getElementById("editNumeroColaboradores").value;
  lead.tipoAtividade = document.getElementById("editTipoAtividade").value;
  lead.produto = document.getElementById("editProduto").value;
  lead.tamanhos = document.getElementById("editTamanhos").value.trim();
  lead.cores = document.getElementById("editCores").value.trim();
  lead.personalizacao = document.getElementById("editPersonalizacao").value;
  lead.requisitosSeguranca = document.getElementById("editRequisitosSeguranca").value;
  lead.observacoes = document.getElementById("editObservacoes").value.trim();

  // Guarda e atualiza a lista.
  guardarLeads();
  mostrarLeads();

  // Fecha a janela de edicao.
  modalEditar.hidden = true;

  alert("Alterações guardadas com sucesso!");
});


// EVENTOS ELIMINAR

// Cancela a eliminacao e limpa o ID guardado.
document.getElementById("btnCancelarEliminar").addEventListener("click", function () {
  modalEliminar.hidden = true;
  idLeadEliminar = null;
});


// Confirma a eliminacao.
document.getElementById("btnConfirmarEliminar").addEventListener("click", function () {

  // Percorre os Leads ate encontrar o ID que queremos eliminar.
  for (let i = 0; i < leads.length; i++) {
    if (leads[i].id === idLeadEliminar) {

      // Remove um Lead da lista na posicao atual.
      leads.splice(i, 1);

      // Como ja encontrou e removeu o Lead, termina o ciclo.
      break;
    }
  }

  // Guarda a nova lista e atualiza o ecra.
  guardarLeads();
  mostrarLeads();

  // Fecha a janela e limpa o ID.
  modalEliminar.hidden = true;
  idLeadEliminar = null;

  alert("Lead eliminado com sucesso!");
});


// PESQUISA E FILTRO

// Atualiza a lista enquanto o utilizador escreve na pesquisa.
document.getElementById("pesquisa").addEventListener("input", function () {
  mostrarLeads();
});


// Atualiza a lista quando o filtro de estado muda.
document.getElementById("filtroEstado").addEventListener("change", function () {
  mostrarLeads();
});


// INICIO DA APLICACAO

// Recupera os Leads guardados anteriormente.
carregarLeads();

// Mostra os Leads no ecra e calcula os indicadores.
mostrarLeads();