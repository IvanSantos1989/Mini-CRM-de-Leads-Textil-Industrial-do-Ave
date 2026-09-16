# Mini CRM de Leads - Têxtil Industrial do Ave
 
## Autores
 
- Catarina Marques
- Ivanildo Silva
 
 
## 1. Empresa e contexto — C
 
A Têxtil Industrial do Ave é a empresa utilizada como contexto para o desenvolvimento deste Mini CRM.
 
- Trabalha com clientes empresariais
- Atua na área de fardamento e produtos têxteis
- Necessita acompanhar dados comerciais e necessidades dos clientes
- O objetivo foi centralizar esta informação e acompanhar cada potencial cliente ao longo do processo comercial
 
 
## 2. Mini CRM — I
 
Aplicação desenvolvida em HTML, CSS e JavaScript.
 
Permite:
 
- Criar Leads
- Visualizar detalhes
- Editar Leads
- Eliminar Leads
- Pesquisar
- Filtrar por estado
- Acompanhar o percurso comercial
- Marcar Leads como Ganhos ou Perdidos
- Calcular prioridade
- Apresentar indicadores comerciais
- Guardar dados no localStorage
 
 
## 3. Demonstração - Cenários de teste
 
 
### Cenário 1 - Fluxo normal — C
 
- Criar um Lead com todos os dados preenchidos
- Avançar pelas diferentes fases até Ganho
 
**Resultado esperado:**
 
- Estado atualizado
- Data de conclusão registada
- Indicadores atualizados
 
 
### Cenário 2 - Erro de preenchimento — C
 
- Tentar criar um Lead sem um campo obrigatório
 
**Resultado esperado:**
 
- Lead não é criado
- É apresentada uma mensagem de aviso
 
 
### Cenário 3 - Regra de negócio — C
 
- Criar um Lead sem tamanhos e cores
- Avançar de Novo para Levantamento de necessidades
- Tentar avançar para Prova de Conceito
 
**Resultado esperado:**
 
- O avanço é bloqueado
- São indicados os campos em falta
- Depois de preencher os dados, o avanço passa a ser permitido
 
 
### Cenário 4 - Lead perdido — C
 
- Marcar um Lead ativo como Perdido
 
**Resultado esperado:**
 
- Estado passa para Perdido
- Data de conclusão é registada
- O Lead deixa de poder avançar
 
 
### Cenário 5 - Pesquisa e filtro — I
 
- Pesquisar pelo nome da empresa ou contacto
- Aplicar um filtro por estado
 
**Resultado esperado:**
 
- São apresentados apenas os Leads correspondentes
 
 
### Cenário 6 - Editar Lead — I
 
- Abrir um Lead
- Alterar os seus dados
- Guardar
 
**Resultado esperado:**
 
- As alterações ficam guardadas e são apresentadas na aplicação
 
 
### Cenário 7 - Eliminar Lead — I
 
- Selecionar um Lead
- Confirmar a eliminação
 
**Resultado esperado:**
 
- Lead removido
- Indicadores atualizados
 
 
### Cenário 8 - Persistência — I
 
- Criar ou editar um Lead
- Atualizar a página
 
**Resultado esperado:**
 
- Os dados continuam disponíveis através do localStorage
 
 
## 4. Estrutura e explicação do código — C
 
A aplicação está organizada em três ficheiros principais:
 
- `index.html` — estrutura
- `style.css` — apresentação visual
- `app.js` — lógica
 
 
### 4.1 HTML — C
 
Abrir: `index.html`
 
- Define a estrutura da aplicação
- Contém formulários, campos, botões, indicadores e janelas
- Os IDs permitem ao JavaScript localizar os elementos
 
 
### 4.2 CSS — I
 
Abrir: `style.css`
 
- Define o aspeto visual
- Cores, tipografia, espaçamentos e dimensões
- Estilos dos botões, prioridades, estados e janelas
- Responsividade
 
 
### 4.3 JavaScript — I
 
Abrir: `app.js`
 
- Contém a lógica da aplicação
- Criação e alteração de Leads
- Validações
- Estados
- Pesquisa e filtros
- KPIs
- Persistência dos dados
 
 
### 4.4 Objeto Lead — C
 
P: "function criarLead"
 
- Representa um potencial cliente
- Agrupa toda a informação de um Lead
- Exemplos de propriedades:
  - ID
  - Empresa
  - Contacto
  - Email
  - Telefone
  - Orçamento
  - Estado
  - Datas
  - Necessidades do cliente
 
 
### 4.5 Função criarLead() — C
 
- Cria e devolve um novo objeto Lead
- Recebe os dados através dos parâmetros
- Organiza os dados nas propriedades do objeto
- Recebe o ID gerado por `gerarId()`
- Define automaticamente:
  - Data de entrada
  - Data de conclusão vazia
  - Estado inicial Novo
 
 
### 4.6 Geração automática do ID — I
 
P: "function gerarId"
 
- Percorre todos os Leads com um ciclo `for`
- `i` representa a posição atual no array
- Procura o maior ID existente
- Devolve:
 
`maiorId + 1`
 
 
### 4.7 Prioridade — C
 
P: "function qualificar"
 
Prioridade calculada através do orçamento:
 
- Quente: ≥ 10 000 €
- Morno: ≥ 5 000 € e < 10 000 €
- Frio: < 5 000 €
 
- Utiliza condições `if`
- A prioridade é automática
 
 
### 4.8 Lead Perdido — I
 
P: "function marcarPerdido"
 
- Procura o Lead através do ID
- Verifica se já está num estado final
- Ganho ou Perdido não podem voltar a avançar
- Ao marcar como Perdido:
  - Atualiza o estado
  - Regista a data de conclusão
 
 
### 4.9 Regra que bloqueia a Prova de Conceito — C
 
P: "function validarLevantamento"
 
- Verifica os campos necessários do levantamento
- Campos em falta são adicionados a `camposEmFalta`
- `.push()` adiciona cada campo à lista
- `camposEmFalta.length > 0` verifica se existem campos em falta
- `return` impede o avanço para Prova de Conceito
 
 
### 4.10 Percurso dos estados — C
 
P: "function avancarEstado"
 
Novo  
→ Levantamento de necessidades  
→ Prova de Conceito  
→ Proposta  
→ Negociação  
→ Ganho
 
- `if / else if` verifica o estado atual
- Define o estado seguinte
- Valida o levantamento antes da Prova de Conceito
- Ao chegar a Ganho regista a data de conclusão
 
 
### 4.11 Indicadores e KPIs — C
 
P: "function atualizarIndicadores"
 
A função percorre os Leads e calcula os indicadores apresentados no topo da aplicação.
 
 
#### Total de Leads — C
 
- `leads.length`
- Quantidade total de Leads existentes
 
 
#### Valor potencial ativo — I
 
- Soma dos orçamentos dos Leads ativos
- Exclui Ganho e Perdido
 
 
#### Leads ganhos — C
 
- `ganhos++`
- Soma 1 por cada Lead com estado Ganho
 
 
#### Taxa de conversão — C
 
- Fórmula:
 
Leads ganhos / Total de Leads × 100
 
 
#### Ciclo médio de venda — I
 
- Média dos dias entre entrada e conclusão dos Leads ganhos
- Utiliza `calcularDias()`
 
 
##### Cálculo dos dias — I
 
P: "function calcularDias"
 
- Calcula a diferença entre Data de Entrada e Data de Conclusão
- Converte as datas para objetos `Date`
- Converte a diferença de milissegundos para dias
- O resultado é utilizado no cálculo do ciclo médio
 
 
### 4.12 Guardar os dados — C
 
P: "function guardarLeads"
 
- Utiliza `localStorage`
- `JSON.stringify()` transforma o array em texto
- Os dados permanecem disponíveis após atualizar a página
 
 
### 4.13 Recuperar os dados — I
 
P: "function carregarLeads"
 
- `localStorage.getItem()` recupera os dados
- `JSON.parse()` transforma o texto novamente num array JavaScript
 
 
## 5. Conceitos utilizados — C
 
- Variáveis
- Objetos
- Arrays
- Funções
- `if / else`
- Ciclos `for`
- Eventos
- `addEventListener`
- DOM
- `getElementById`
- `value`
- `textContent`
- `innerHTML`
- `classList`
- `localStorage`
- JSON
- `JSON.stringify()`
- `JSON.parse()`
- `Number()`
- `trim()`
- `toLowerCase()`
- `includes()`
- `push()`
- `splice()`
 
 
## 6. Conclusão — I
 
O Mini CRM permite:
 
- Registar e gerir Leads
- Centralizar informação comercial
- Acompanhar o percurso de cada Lead
- Aplicar regras de negócio
- Calcular prioridades
- Calcular indicadores
- Guardar e recuperar dados
 
O projeto permitiu aplicar de forma prática conceitos fundamentais de HTML, CSS e JavaScript.
 
 
## 7. Como executar
 
1. Abrir a pasta do projeto no Visual Studio Code
2. Abrir o ficheiro `index.html` através do Live Server
3. Utilizar a aplicação no navegador