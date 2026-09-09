let leads = []; // array onde ficam armazenados os leads

let idLeadSelecionado = null; // lead atualmente aberto ou editado
let idLeadEliminar = null; // lead selecionado para eliminar


// ==========================
// FUNÇÕES PRINCIPAIS
// ==========================

function criarLead(id, origem, empresa, nomeContacto, email, telefone, setor,
    numeroColaboradores, tipoAtividade, produto, tamanhos, cores,
    personalizacao, requisitosSeguranca, orcamento,
    comercialResponsavel, observacoes) {

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
        estado: "Novo"
    };
}


function qualificar(lead) {

    if (lead.orcamento >= 10000) {
        return "Quente";
    }

    if (lead.orcamento >= 5000) {
        return "Morno";
    }

    return "Frio";
}


function gerarId() {

    let maiorId = 0;

    for (let i = 0; i < leads.length; i++) {

        if (leads[i].id > maiorId) {
            maiorId = leads[i].id;
        }
    }

    return maiorId + 1;
}


function formatarId(id) {

    return "LD-" + String(id).padStart(3, "0");
}


function obterDataAtual() {

    let hoje = new Date();

    return hoje.toISOString().slice(0, 10);
}


// ==========================
// LOCAL STORAGE
// ==========================

function guardarLeads() {

    localStorage.setItem("leads", JSON.stringify(leads));
}


function carregarLeads() {

    let dados = localStorage.getItem("leads");

    if (dados !== null) {
        leads = JSON.parse(dados);
    }
}


// ==========================
// PROCURAR LEAD
// ==========================

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

function avancarEstado(id) {

    let lead = encontrarLead(id);

    if (lead === null) {
        return;
    }

    if (lead.estado === "Novo") {

        lead.estado = "Levantamento de necessidades";
    }

    else if (lead.estado === "Levantamento de necessidades") {

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
    }

    else if (lead.estado === "Prova de Conceito") {

        lead.estado = "Proposta";
    }

    else if (lead.estado === "Proposta") {

        lead.estado = "Negociação";
    }

    else if (lead.estado === "Negociação") {

        lead.estado = "Ganho";
        lead.dataConclusao = obterDataAtual();
    }

    else {

        alert("Este Lead já se encontra num estado final.");
        return;
    }

    guardarLeads();
    mostrarLeads();

    if (!modalVer.hidden) {
        verLead(id);
    }
}


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

function calcularDias(dataEntrada, dataConclusao) {

    let inicio = new Date(dataEntrada);
    let fim = new Date(dataConclusao);

    let diferenca = fim - inicio;

    return Math.round(diferenca / (1000 * 60 * 60 * 24));
}


function atualizarIndicadores() {

    let valorAtivo = 0;
    let ganhos = 0;
    let somaDias = 0;
    let ganhosComData = 0;

    for (let i = 0; i < leads.length; i++) {

        if (leads[i].estado !== "Ganho" && leads[i].estado !== "Perdido") {
            valorAtivo += Number(leads[i].orcamento);
        }

        if (leads[i].estado === "Ganho") {

            ganhos++;

            if (leads[i].dataEntrada !== "" && leads[i].dataConclusao !== "") {

                somaDias += calcularDias(
                    leads[i].dataEntrada,
                    leads[i].dataConclusao
                );

                ganhosComData++;
            }
        }
    }

    let taxaConversao = 0;
    let cicloMedio = 0;

    if (leads.length > 0) {
        taxaConversao = Math.round((ganhos / leads.length) * 100);
    }

    if (ganhosComData > 0) {
        cicloMedio = Math.round(somaDias / ganhosComData);
    }

    document.getElementById("totalLeads").textContent = leads.length;

    document.getElementById("valorPotencial").textContent =
        valorAtivo.toLocaleString("pt-PT") + " €";

    document.getElementById("leadsGanhos").textContent = ganhos;

    document.getElementById("taxaConversao").textContent =
        taxaConversao + "%";

    document.getElementById("cicloMedio").textContent =
        cicloMedio + " dias";
}


// ==========================
// MOSTRAR LEADS
// ==========================

function mostrarLeads() {

    let listaLeads = document.getElementById("listaLeads");

    let pesquisa = document.getElementById("pesquisa").value
        .toLowerCase()
        .trim();

    let filtroEstado = document.getElementById("filtroEstado").value;

    listaLeads.innerHTML = "";

    let encontrados = 0;

    for (let i = 0; i < leads.length; i++) {

        let lead = leads[i];

        let correspondePesquisa =
            lead.empresa.toLowerCase().includes(pesquisa) ||
            lead.nomeContacto.toLowerCase().includes(pesquisa);

        let correspondeEstado =
            filtroEstado === "" ||
            lead.estado === filtroEstado;

        if (correspondePesquisa && correspondeEstado) {

            encontrados++;

            let divLead = document.createElement("div");

            divLead.className = "lead";

            divLead.innerHTML =
                "<p><strong>Empresa / Contacto</strong>" +
                lead.empresa + "<br>" + lead.nomeContacto + "</p>" +

                "<p><strong>Setor</strong>" +
                lead.setor + "</p>" +

                "<p><strong>Valor</strong>" +
                Number(lead.orcamento).toLocaleString("pt-PT") + " €</p>" +

                "<p><strong>Prioridade</strong>" +
                qualificar(lead) + "</p>" +

                "<p><strong>Estado</strong>" +
                lead.estado + "</p>" +

                "<div class='acoes-lead'>" +

                "<button class='btn-ver' onclick='verLead(" +
                lead.id + ")'>Ver</button>" +

                "<button class='btn-editar' onclick='editarLead(" +
                lead.id + ")'>Editar</button>" +

                "<button class='btn-apagar' onclick='eliminarLead(" +
                lead.id + ")'>Apagar</button>" +

                "</div>";

            listaLeads.appendChild(divLead);
        }
    }

    if (encontrados === 0) {
        listaLeads.innerHTML = "<p>Nenhum Lead encontrado.</p>";
    }

    atualizarIndicadores();
}


// ==========================
// MODAL VER
// ==========================

function verLead(id) {

    let lead = encontrarLead(id);

    if (lead === null) {
        return;
    }

    idLeadSelecionado = id;

    let telefone = lead.telefone || "—";
    let colaboradores = lead.numeroColaboradores || "—";
    let conclusao = lead.dataConclusao || "Ainda não concluído";

    detalhesLead.innerHTML =
        "<h3>" + formatarId(lead.id) + " - " + lead.empresa + "</h3>" +

        "<p><strong>Estado:</strong> " + lead.estado + "</p>" +
        "<p><strong>Prioridade:</strong> " + qualificar(lead) + "</p>" +

        "<div class='modal-grid'>" +

        "<div class='modal-bloco'>" +
        "<h3>Dados do Cliente</h3>" +
        "<p><strong>Empresa:</strong> " + lead.empresa + "</p>" +
        "<p><strong>Contacto:</strong> " + lead.nomeContacto + "</p>" +
        "<p><strong>Email:</strong> " + lead.email + "</p>" +
        "<p><strong>Telefone:</strong> " + telefone + "</p>" +
        "<p><strong>Origem:</strong> " + lead.origem + "</p>" +
        "<p><strong>Setor:</strong> " + lead.setor + "</p>" +
        "</div>" +

        "<div class='modal-bloco'>" +
        "<h3>Necessidades do Cliente</h3>" +
        "<p><strong>Colaboradores:</strong> " + colaboradores + "</p>" +
        "<p><strong>Atividade:</strong> " + (lead.tipoAtividade || "—") + "</p>" +
        "<p><strong>Produto:</strong> " + (lead.produto || "—") + "</p>" +
        "<p><strong>Tamanhos:</strong> " + (lead.tamanhos || "—") + "</p>" +
        "<p><strong>Cores:</strong> " + (lead.cores || "—") + "</p>" +
        "<p><strong>Personalização:</strong> " + (lead.personalizacao || "—") + "</p>" +
        "<p><strong>Segurança:</strong> " + (lead.requisitosSeguranca || "—") + "</p>" +
        "</div>" +

        "<div class='modal-bloco'>" +
        "<h3>Informação Comercial</h3>" +
        "<p><strong>Orçamento:</strong> " +
        Number(lead.orcamento).toLocaleString("pt-PT") + " €</p>" +
        "<p><strong>Data de entrada:</strong> " + lead.dataEntrada + "</p>" +
        "<p><strong>Data de conclusão:</strong> " + conclusao + "</p>" +
        "<p><strong>Comercial:</strong> " + lead.comercialResponsavel + "</p>" +
        "<p><strong>Observações:</strong> " + (lead.observacoes || "—") + "</p>" +
        "</div>" +

        "</div>";

    let estadoFinal =
        lead.estado === "Ganho" ||
        lead.estado === "Perdido";

    btnAvancarVer.hidden = estadoFinal;
    btnPerdidoVer.hidden = estadoFinal;

    if (lead.estado === "Negociação") {
        btnAvancarVer.textContent = "Marcar como ganho";
    }
    else {
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

    idLeadSelecionado = id;

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

    idLeadEliminar = id;

    textoEliminar.textContent =
        "Pretende eliminar o Lead " +
        formatarId(lead.id) +
        " - " +
        lead.empresa +
        "?";

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

const detalhesLead = document.getElementById("detalhesLead");
const textoEliminar = document.getElementById("textoEliminar");

const btnAvancarVer = document.getElementById("btnAvancarVer");
const btnPerdidoVer = document.getElementById("btnPerdidoVer");


// ==========================
// EVENTOS NOVO LEAD
// ==========================

btnNovoLead.addEventListener("click", function() {

    novoLeadform.hidden = false;
});


btnCancelar.addEventListener("click", function() {

    novoLeadform.hidden = true;
    formLead.reset();
});


// Criar novo Lead
formLead.addEventListener("submit", function(event) {

    event.preventDefault();

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

    // Validação dos campos obrigatórios
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

    let telefoneFinal = "";
    let colaboradoresFinal = "";

    if (telefone !== "") {
        telefoneFinal = Number(telefone);
    }

    if (numeroColaboradores !== "") {
        colaboradoresFinal = Number(numeroColaboradores);
    }

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

    leads.push(novoLead);

    guardarLeads();
    mostrarLeads();

    formLead.reset();
    novoLeadform.hidden = true;

    alert("Lead criado com sucesso!");
});


// ==========================
// EVENTOS MODAL VER
// ==========================

document.getElementById("btnFecharVer").addEventListener("click", function() {

    modalVer.hidden = true;
});


document.getElementById("btnEditarVer").addEventListener("click", function() {

    editarLead(idLeadSelecionado);
});


btnAvancarVer.addEventListener("click", function() {

    avancarEstado(idLeadSelecionado);
});


btnPerdidoVer.addEventListener("click", function() {

    marcarPerdido(idLeadSelecionado);
});


document.getElementById("btnEliminarVer").addEventListener("click", function() {

    eliminarLead(idLeadSelecionado);
});


// ==========================
// EVENTOS EDITAR
// ==========================

document.getElementById("btnFecharEditar").addEventListener("click", function() {

    modalEditar.hidden = true;
});


document.getElementById("btnCancelarEditar").addEventListener("click", function() {

    modalEditar.hidden = true;
});


// Guardar alterações do Lead
formEditarLead.addEventListener("submit", function(event) {

    event.preventDefault();

    let lead = encontrarLead(idLeadSelecionado);

    if (lead === null) {
        return;
    }

    let empresa = document.getElementById("editEmpresa").value.trim();
    let nomeContacto = document.getElementById("editNomeContacto").value.trim();
    let email = document.getElementById("editEmail").value.trim();
    let origem = document.getElementById("editOrigem").value;
    let setor = document.getElementById("editSetor").value;
    let orcamento = document.getElementById("editOrcamento").value;
    let comercial = document.getElementById("editComercialResponsavel").value;

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

    lead.empresa = empresa;
    lead.nomeContacto = nomeContacto;
    lead.email = email;
    lead.origem = origem;
    lead.setor = setor;
    lead.orcamento = Number(orcamento);
    lead.comercialResponsavel = comercial;

    lead.telefone =
        document.getElementById("editTelefone").value;

    lead.numeroColaboradores =
        document.getElementById("editNumeroColaboradores").value;

    lead.tipoAtividade =
        document.getElementById("editTipoAtividade").value;

    lead.produto =
        document.getElementById("editProduto").value;

    lead.tamanhos =
        document.getElementById("editTamanhos").value.trim();

    lead.cores =
        document.getElementById("editCores").value.trim();

    lead.personalizacao =
        document.getElementById("editPersonalizacao").value;

    lead.requisitosSeguranca =
        document.getElementById("editRequisitosSeguranca").value;

    lead.observacoes =
        document.getElementById("editObservacoes").value.trim();

    guardarLeads();
    mostrarLeads();

    modalEditar.hidden = true;

    alert("Alterações guardadas com sucesso!");
});


// ==========================
// EVENTOS ELIMINAR
// ==========================

document.getElementById("btnCancelarEliminar").addEventListener("click", function() {

    modalEliminar.hidden = true;
    idLeadEliminar = null;
});


document.getElementById("btnConfirmarEliminar").addEventListener("click", function() {

    for (let i = 0; i < leads.length; i++) {

        if (leads[i].id === idLeadEliminar) {

            leads.splice(i, 1);
            break;
        }
    }

    guardarLeads();
    mostrarLeads();

    modalEliminar.hidden = true;
    idLeadEliminar = null;

    alert("Lead eliminado com sucesso!");
});


// ==========================
// PESQUISA E FILTRO
// ==========================

document.getElementById("pesquisa").addEventListener("input", function() {

    mostrarLeads();
});


document.getElementById("filtroEstado").addEventListener("change", function() {

    mostrarLeads();
});


// ==========================
// INÍCIO DA APLICAÇÃO
// ==========================

carregarLeads();
mostrarLeads();