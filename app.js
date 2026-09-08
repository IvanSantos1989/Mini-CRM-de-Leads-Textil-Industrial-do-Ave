leads = []; // array de leads

function criarLead(nome, empresa, contacto, orcamento) {
    return {
        nome: nome,
        empresa: empresa,
        contacto: contacto,
        orcamento: orcamento,
        estado: "Novo" // estado inicial do lead
    };
}

qualificar()