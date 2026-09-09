# Mini CRM de Leads - Têxtil Industrial do Ave

## Autores
- Catarina Marques
- Ivan Silva

## Descrição

Aplicação web desenvolvida em HTML, CSS e JavaScript para gerir Leads
da empresa Têxtil Industrial do Ave.

A aplicação permite criar, visualizar, editar, eliminar, pesquisar,
filtrar e acompanhar Leads durante o processo comercial.

Os dados são guardados através do localStorage do navegador.

## Estados do Lead

O processo comercial segue o seguinte percurso:

Novo
→ Levantamento de necessidades
→ Prova de Conceito
→ Proposta
→ Negociação
→ Ganho

Um Lead ativo também pode ser marcado como Perdido.

Ganho e Perdido são estados finais.

## Regra de negócio

Um Lead só pode avançar de Levantamento de necessidades para
Prova de Conceito quando estiverem preenchidos:

- Número de colaboradores
- Tipo de atividade
- Produto / Tipo de fardamento
- Tamanhos
- Cores
- Personalização / Bordado
- Requisitos de segurança

Caso algum dado esteja em falta, o estado não é alterado e a
aplicação informa o utilizador sobre os campos que precisam de
ser preenchidos.

## Prioridade

A prioridade é calculada automaticamente através do orçamento
estimado.

- Quente: orçamento igual ou superior a 10 000 €
- Morno: orçamento igual ou superior a 5 000 €
- Frio: orçamento inferior a 5 000 €

A prioridade não é escolhida manualmente pelo utilizador.

## KPI

O KPI principal é o Tempo Médio do Ciclo de Venda.

Para cada Lead ganho é calculada a diferença entre a Data de
Conclusão e a Data de Entrada.

Depois é calculada a média da duração de todos os Leads ganhos.

## Persistência

Os Leads são armazenados no localStorage.

JSON.stringify() transforma o array em texto para ser guardado.

JSON.parse() transforma o texto novamente num array quando a
aplicação é carregada.

## Como executar

1. Abrir a pasta do projeto no Visual Studio Code.
2. Abrir o ficheiro index.html através do Live Server.
3. Utilizar a aplicação no navegador.

## Cenários de teste

### Cenário 1 - Fluxo normal

Criar um Lead com todos os dados preenchidos.

Avançar o Lead pelas diferentes fases até Ganho.

Resultado esperado:
O estado é alterado corretamente e os indicadores são atualizados.

### Cenário 2 - Erro de preenchimento

Tentar criar um Lead sem preencher um campo obrigatório.

Resultado esperado:
O Lead não é criado e é apresentada uma mensagem de aviso.

### Cenário 3 - Regra de negócio

Criar um Lead sem preencher, por exemplo, tamanhos e cores.

Avançar de Novo para Levantamento de necessidades.

Tentar avançar para Prova de Conceito.

Resultado esperado:
A aplicação bloqueia a alteração e indica os campos que estão em falta.

Depois de editar o Lead e preencher os dados em falta, a passagem
para Prova de Conceito passa a ser permitida.

## Conceitos utilizados

- Variáveis
- Objetos
- Arrays
- Funções
- Condições if / else
- Ciclos for
- Eventos
- DOM
- localStorage
- JSON