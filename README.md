# Gestão à Vista – RH / Payroll – Igarapé Digital
Quadro branco digital para controle visual de entregas críticas de RH, DP, folha, benefícios e projetos.

Este projeto é um mini-aplicativo 100% front-end (HTML, CSS e JS) que roda direto no navegador, sem back-end, usando `localStorage` para salvar os dados.

---

## 1. Objetivo

Oferecer um quadro Kanban simples e robusto para:

- Organizar as atividades de RH/DP por blocos de datas (ou sprints);
- Visualizar rapidamente o que está pendente, em andamento e concluído;
- Ter um espelho digital do quadro branco físico, porém com:
  - Edição de cards;
  - Edição de cabeçalhos de coluna;
  - Persistência automática no navegador.

---

## 2. Estrutura de arquivos

O projeto é composto por três arquivos principais:

1. `index.html`  
   - Estrutura da página.  
   - Define:
     - Formulário para criação de tarefas;
     - Filtros de status e categoria;
     - Quadro com as 4 colunas;
     - Modal de edição de tarefas;
     - Rodapé “Igarapé Digital”.

2. `style.css`  
   - Estilos visuais:
     - Layout em colunas (board Kanban);
     - Tipografia (fonte Segoe UI / sistema);
     - Aparência dos cards, botões e modal;
     - Destaque de títulos e subtítulos dos quadrantes.

3. `script.js`  
   - Lógica da aplicação:
     - Criação, edição e remoção de tarefas;
     - Arrastar e soltar (drag & drop) entre colunas;
     - Filtros por status e categoria;
     - Salvamento em `localStorage`:
       - Tarefas;
       - Títulos das colunas;
       - Subtítulos das colunas.

---

## 3. Como usar

1. Crie uma pasta em seu computador (por exemplo, `quadro_rh`).
2. Salve nela os três arquivos com esses nomes exatos:
   - `index.html`
   - `style.css`
   - `script.js`
3. Abra o arquivo `index.html` em um navegador moderno (Chrome, Edge, Firefox).
4. O quadro será carregado com tarefas padrão de exemplo (rescisões, 13º, encargos etc.).

A partir daí, tudo é feito direto na interface:

- Para **criar uma nova tarefa**:
  - Preencha “Atividade”, “Prazo”, “Responsável” (opcional) e escolha categoria/coluna;
  - Clique em “Adicionar”.

- Para **mover uma tarefa entre quadrantes**:
  - Clique, segure o card e arraste até a coluna desejada.

- Para **editar uma tarefa**:
  - Clique em “Editar” dentro do card;
  - Ajuste campos no modal;
  - Clique em “Salvar”.

- Para **excluir uma tarefa**:
  - Clique no “x” vermelho no canto do card.

- Para **limpar todo o quadro**:
  - Clique em “Limpar quadro”;
  - Confirme a ação (todos os cards serão removidos).

---

## 4. Funcionalidades principais

### 4.1. Colunas / Quadrantes

Por padrão, existem 4 quadrantes:

- Coluna 1: Até 12/12  
- Coluna 2: 13 a 15/12  
- Coluna 3: 16 a 19/12  
- Coluna 4: Até 20/12 / Pendências  

Cada coluna possui:

- Um **título** (linha principal);  
- Um **subtítulo** (descrição curta do tipo de atividade).

Ambos são **editáveis diretamente na tela** e ficam salvos no navegador.

### 4.2. Tarefas (cards)

Cada tarefa possui:

- `título` (campo obrigatório);
- `prazo` (data opcional);
- `responsável`;
- `categoria` (Folha, Encargos, Benefícios, Projeto, Jurídico, Outro);
- `colunaId` (em qual quadrante está);
- `status`:
  - Não iniciado;
  - Em andamento;
  - Concluído.

O status é alternado ao clicar no “pill” de status dentro do card.

### 4.3. Filtros

Na barra de filtros é possível:

- Filtrar por **Status**:
  - Todos;
  - Não iniciado;
  - Em andamento;
  - Concluído.
- Filtrar por **Categoria**:
  - Todas;
  - Folha, Encargos, Benefícios, Projeto, Jurídico, Outro.

Os filtros atuam apenas na visualização (não apagam tarefas).

### 4.4. Persistência dos dados (localStorage)

O projeto não usa banco de dados externo.  
Tudo é salvo no próprio navegador por meio de três chaves:

- `igarape_quadro_rh`  
  Lista de tarefas.

- `igarape_quadro_titulos`  
  Títulos das colunas (texto editado em cada quadrante).

- `igarape_quadro_subtitulos`  
  Subtítulos das colunas (frases abaixo do título).

Ao fechar e reabrir o navegador, o quadro volta exatamente ao estado salvo.

---

## 5. Personalização rápida

Algumas formas simples de customizar:

1. **Renomear quadrantes**  
   - Clique em cima do título de cada coluna;
   - Digite o novo título (ex.: “Sprint 01”, “Folha Mensal”, “Projetos CCT”);
   - A alteração é salva automaticamente.

2. **Editar a descrição dos quadrantes**  
   - Clique no subtítulo (frase abaixo do título);
   - Digite sua própria descrição (ex.: “Somente atividades que vencem nesta semana”).

3. **Iniciar com outra lista padrão de tarefas**  
   - Edite a função `getDefaultTasks()` em `script.js`;
   - Ajuste os objetos para refletir as rotinas do seu ciclo atual.

4. **Tema visual personalizado**  
   - Ajuste cores em `style.css`:
     - Cor dos botões (classes `.primary-button`, `.secondary-button`);
     - Cor de fundo das colunas (`.board-column`);
     - Cores dos status (`.status-nao-iniciado`, `.status-andamento`, `.status-concluido`).

---

## 6. Limitações e cuidados

- Os dados são salvos apenas no **navegador atual**:
  - Se limpar o cache ou usar outro navegador/máquina, o quadro inicia do zero.
- Não há controle de usuários ou login:
  - É uma ferramenta local, focada em gestão à vista individual ou de time próximo.
- Não há back-end ou sincronização em nuvem:
  - Para uso corporativo em escala, seria necessário evoluir para uma API ou back-end.

---

## 7. Ideias de evolução

Alguns caminhos naturais para versões futuras:

1. **Exportar quadro**:
   - Exportar as tarefas para CSV/Excel;
   - Exportar estado completo (tarefas, títulos, subtítulos) em JSON.

2. **Indicadores de desempenho**:
   - Contador de tarefas por status, categoria e coluna;
   - Percentual concluído por quadrante;
   - Tempo médio de conclusão.

3. **Tema Sonova / Branding**:
   - Aplicar cores oficiais (azul, cinza, tipografia padrão);
   - Colocar logotipo nas áreas de cabeçalho e rodapé.

4. **Modo “Semana Atual”**:
   - Gerar automaticamente blocos por semana (Semana 1, Semana 2, etc.);
   - Girar a estrutura conforme o calendário (gestão tática contínua).

5. **Integração com outros sistemas**:
   - Integração futura com APIs de folha/benefícios para gerar tarefas automaticamente;
   - Integração com ferramentas de comunicação para envio de alertas.

---

## 8. Créditos

Projeto idealizado no contexto do **Igarapé Digital**, com foco em:

- Automação de rotinas de RH/DP;
- Gestão visual de demandas;
- Organização de entregas críticas de folha, encargos, benefícios e projetos.

Este quadro é uma base simples, extensível e adaptável para qualquer ambiente de RH que precise de gestão à vista clara, objetiva e orientada a prazos.
