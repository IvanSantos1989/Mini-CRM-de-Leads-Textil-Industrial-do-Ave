let leads = []; // array de leads

function criarLead(nome, empresa, contacto, orcamento) {
    return {
        nome: nome,
        empresa: empresa,
        contacto: contacto,
        orcamento: orcamento,
        estado: "Novo" // estado inicial do lead
    };
}

function qualificar(lead) {
    if (lead.orcamento >= 10000) return "Quente";
    if (lead.orcamento >= 5000) return "Morno";
    return "Frio";
}