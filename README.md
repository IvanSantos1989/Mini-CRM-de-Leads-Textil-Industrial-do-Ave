# Mini CRM de Leads - Têxtil Industrial do Ave

## Autores

- Catarina Marques
- Ivanildo Silva

## Descrição

Aplicação web desenvolvida em HTML, CSS e JavaScript para gerir Leads da empresa Têxtil Industrial do Ave.
A aplicação permite criar, visualizar, editar, eliminar, pesquisar, filtrar e acompanhar Leads durante o processo comercial.
Inclui também indicadores de desempenho comercial, como total de Leads, valor potencial ativo, Leads ganhos, taxa de conversão e ciclo médio de venda.
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

Um Lead só pode avançar de Levantamento de necessidades para Prova de Conceito quando estiverem preenchidos:

- Número de colaboradores
- Tipo de atividade
- Produto / Tipo de fardamento
- Tamanhos
- Cores
- Personalização / Bordado
- Requisitos de segurança

Caso algum dado esteja em falta, o estado não é alterado e a aplicação informa o utilizador sobre os campos que precisam de ser preenchidos.

## Prioridade

A prioridade é calculada automaticamente através do orçamento estimado.

- Quente: orçamento igual ou superior a 10 000 €
- Morno: orçamento igual ou superior a 5 000 € e inferior a 10 000 €
- Frio: orçamento inferior a 5 000 €

A prioridade não é escolhida manualmente pelo utilizador.

## KPI

A aplicação calcula automaticamente vários indicadores:

- Total de Leads
- Valor potencial ativo
- Leads ganhos
- Taxa de conversão
- Ciclo médio de venda

### Valor potencial ativo

Corresponde à soma dos orçamentos dos Leads que ainda estão ativos.
Não são incluídos Leads com estado Ganho ou Perdido.

### Taxa de conversão

É calculada através da fórmula:
Leads ganhos / Total de Leads × 100

### Ciclo médio de venda

Para cada Lead ganho é calculada a diferença entre a Data de Conclusão e a Data de Entrada.
Depois é calculada a média da duração de todos os Leads ganhos que possuem data de entrada e data de conclusão.

## Persistência

Os Leads são armazenados no localStorage do navegador.
JSON.stringify() transforma o array em texto para ser guardado.
JSON.parse() transforma o texto novamente num array quando a aplicação é carregada.

## Como executar

1. Abrir a pasta do projeto no Visual Studio Code.
2. Abrir o ficheiro index.html através do Live Server.
3. Utilizar a aplicação no navegador.

## Cenários de teste

### Cenário 1 - Fluxo normal

Criar um Lead com todos os dados preenchidos.
Avançar o Lead pelas diferentes fases até Ganho.
Resultado esperado:
O estado é alterado corretamente, a data de conclusão é registada e os indicadores são atualizados.

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
Depois de editar o Lead e preencher os dados em falta, a passagem para Prova de Conceito passa a ser permitida.

### Cenário 4 - Lead perdido

Criar um Lead e marcar o Lead como Perdido.
Resultado esperado:
O estado passa para Perdido, é registada a data de conclusão e deixa de ser possível avançar o Lead.

### Cenário 5 - Pesquisa e filtro

Pesquisar pelo nome da empresa ou contacto e aplicar um filtro por estado.
Resultado esperado:
A lista apresenta apenas os Leads que correspondem aos critérios selecionados.

### Cenário 6 - Editar Lead

Abrir um Lead existente e alterar os seus dados.
Resultado esperado:
As alterações são guardadas e apresentadas na lista e nos detalhes do Lead.

### Cenário 7 - Eliminar Lead

Selecionar um Lead e confirmar a eliminação.
Resultado esperado:
O Lead é removido da aplicação e os indicadores são atualizados.

### Cenário 8 - Persistência

Criar ou editar um Lead e atualizar a página do navegador.
Resultado esperado:
Os dados continuam disponíveis porque foram guardados no localStorage.

## Conceitos utilizados

- Variáveis
- Objetos
- Arrays
- Funções
- Condições if / else
- Ciclos for
- Eventos
- addEventListener
- DOM
- getElementById
- value
- textContent
- innerHTML
- classList
- localStorage
- JSON
- JSON.stringify()
- JSON.parse()
- Number()
- trim()
- toLowerCase()
- includes()
- push()
- splice()