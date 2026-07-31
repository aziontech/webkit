# Webkit Sample — o que foi atualizado

**Ambiente de visualização:** https://mh2saqc1un.map.azionedge.net
**Branch:** `demo/vue-sample` · **Revisão:** 31/07/2026

Cada item abaixo tem o link direto da tela onde a decisão está aplicada, para quem
recebe o layout abrir e conferir o comportamento real (não é screenshot: é a app).

> **Versão navegável deste documento:**
> https://mh2saqc1un.map.azionedge.net/site/hub/changelog — página oculta do Webkit Hub
> (sem entrada na sidebar; existe só para quem recebe o link). Este `.md` é a forma longa;
> a página é a que se compartilha.

---

## 1. Padrão de containers — um sistema de layout, sistematizado por tipo de página

O espaçamento e a largura das páginas deixaram de ser decisão de cada tela e passaram
a ser **tokens de layout** (`src/styles/layout.css`), com três decisões declaradas uma
única vez:

| Decisão | Token | O que resolve |
|---|---|---|
| **Boundary** | `--layout-boundary-*` | distância do conteúdo até o chrome da app (topo um passo maior que as laterais, porque a borda do header lê como aresta dura) |
| **Rhythm** | `--layout-section-gap` / `--layout-group-gap` | distância entre seções (`xl`) e dentro de uma banda (`md`) — o gap pertence sempre ao pai, nunca ao filho |
| **Measure** | `--layout-measure*` | até onde a coluna de leitura pode crescer, **por contexto** |

Tudo derivado das escalas fluidas do `@aziontech/theme` (`--spacing-*`, `--container-*`),
sem uma única media query. O conjunto foi escrito com nome semântico e zero valor cru
justamente para poder ser **promovido para o theme como `semantic/layouts`** e passar a
valer para qualquer app consumidora.

**As quatro medidas, uma por tipo de layout:**

| Tipo de layout | Classe | Measure | Link |
|---|---|---|---|
| **Listagem** (dados, tabela larga) | `.layout-column` | 1620px | [/applications](https://mh2saqc1un.map.azionedge.net/applications) |
| **Create** (fluxo de criação) | `.layout-form-create` | 1024px | [/applications/new](https://mh2saqc1un.map.azionedge.net/applications/new) |
| **Listagem de 2º nível** (Apps > app_name) | tabs full-bleed + coluna da tab | por tab | [/applications/1784552864](https://mh2saqc1un.map.azionedge.net/applications/1784552864?tab=main-settings) |
| **Configurações / Settings** | `.layout-column-form` | 876px | [/account](https://mh2saqc1un.map.azionedge.net/account?tab=account-settings) |
| *(bônus)* **Focado** (home, creation center) | `.layout-column-focused` | 1024px | [/home](https://mh2saqc1un.map.azionedge.net/home) |

O ganho é manutenção em massa: mudar o respiro de todas as páginas de settings, ou a
largura de todas as listagens, é **um token**, não uma varredura por dezenas de telas.

---

## 2. Switch — cor e shape

Atualizado no pacote (`@aziontech/webkit`, PR #799) e refletido em toda a sample:

- **Track ligado:** `--success-contrast` → **`--accent`** (mais contraste e alinhado ao
  resto dos controles ativos).
- **Shape concêntrico:** track `rounded-[var(--shape-elements)]` (6px) e handle
  `rounded-[var(--radius)]` (4px) — 6px menos o inset de 2px dá exatamente o raio interno,
  então o handle acompanha a curva do track em vez de ser um pill dentro de outro pill.
- **Handle estável entre temas:** knob branco fixo (`--color-base-white`) com o ícone de
  lock preto fixo (`--color-base-black`) — no track `--accent` esses dois **não podem**
  inverter com light/dark, senão o estado ligado perde legibilidade em um dos temas.
- 34 baselines visuais (Switch, FieldSwitch, FieldSwitchBlock, FieldTextSwitch) regeradas.

**Ver:** [/forms/itemgroup](https://mh2saqc1un.map.azionedge.net/forms/itemgroup) ·
[/account (Account Settings)](https://mh2saqc1un.map.azionedge.net/account?tab=account-settings) ·
[/forms/in-page](https://mh2saqc1un.map.azionedge.net/forms/in-page)

---

## 3. Command Menu (busca global) integrado

O campo de busca no topo da sidebar agora é a **afordância do ⌘K**: um campo read-only
que abre o `CommandMenu` (paleta) em vez de filtrar a nav no lugar.

- A paleta carrega **a navegação inteira** (mesmos grupos e labels do rail) **+ comandos
  de app** (tema, criar, etc.), com os valores namespaced (`nav:` / `cmd:`) para o handler
  distinguir navegar de executar.
- Funciona com a sidebar **recolhida** — a paleta teleporta para o `body`.
- O atalho tem **um único dono**: a cópia da sidebar dentro do drawer mobile recebe
  `shortcut=""`, para o ⌘K nunca abrir duas paletas ao mesmo tempo.
- Hint de teclado com o componente `Kbd`.

**Ver:** [/home](https://mh2saqc1un.map.azionedge.net/home) → **⌘K** (ou clique no campo
de busca da sidebar)

---

## 4. Cadeia de tenancy — Organization / Account / Workspace

O header global passou a carregar a **cadeia de identidade** inteira, separada da
localização: `Azion / Organization / Account / Workspace`, seguida por um filete e só
então o breadcrumb.

- **Segregação de responsabilidade:** a cadeia responde *“quem eu sou / por quem estou
  atuando”*; o breadcrumb responde *“onde eu estou”*. Por isso identidade saiu do rail e
  subiu para o header — ela é global e não pode desaparecer quando o rail recolhe.
- **Três níveis, três perguntas:** a organização é a quem você pertence, a account é a
  infraestrutura que você opera, o workspace é a fatia dela que você está olhando.
- **Degradação responsiva definida:** abaixo de `md` o **workspace** é o primeiro elo a
  sair (três marcas + hamburger + ações não caberiam); abaixo de `lg` o **breadcrumb** dá
  lugar (a página abaixo repete o último crumb, a cadeia não se repete em nenhum lugar).
- Cada organização carrega um **accent** (blue / orange / yellow) que pinta a marca
  gerada — é o único lugar em que um tenant se colore, e existe para o operador que vive
  em três organizações distingui-las **antes** de ler um caractere.

**Ver:** [/home](https://mh2saqc1un.map.azionedge.net/home) (cadeia no header; clique em
cada elo para os switchers)

### Onboarding — a organização nasce no signup, com wire do console ao lado

O `/signup/personalize` **deixou de existir** e virou `/signup/onboarding`: uma tela
única, onde a **primeira organização passa a existir**. O motivo de ela nascer aqui e
não no console: **um usuário não pode estar em lugar nenhum** — se a org não fosse criada
com a conta, o console abriria num empty state cuja única ação é exatamente o que o
signup deveria ter feito.

- **Três decisões, e só o que é decisão:** o **nome do usuário** (o console o saúda por
  ele, o rail o mostra), o **nome da organização** — pergunta *separada*, porque uma
  empresa não se chama como o seu primeiro usuário, e ecoar um no outro lê como bug na
  primeira vez que divergem — e a **marca** (accent). Mais o **additional data**
  (chave–valor, opcional).
- **O que NÃO é perguntado, porque é consequência:** o **primeiro workspace** (nasce como
  “My Workspace” e é renomeado depois no console — mas **aparece no wire**, porque o
  console realmente abre escopado nele e é assim que o usuário descobre que tem um), o
  **owner** e o **status** (`createOrganization` define os três). Antes esses fatos eram
  chips read-only na tela; foram removidos porque só ensinavam vocabulário sobre o qual o
  usuário não tem decisão a tomar, na única tela em que nada deve competir com as
  perguntas.
- **Chega pelos dois caminhos de signup:** o de e-mail cai aqui pelo link de verificação;
  um **provedor social** — que autentica **e** atesta o endereço — vem direto, pulando a
  verificação. O `SignUp` trava o escopo como a **união** das duas flags: só o controle
  pressionado mostra `:loading`, e nenhum segundo caminho começa enquanto um está em voo.
- **O wire:** ao lado do formulário, o console desenhado como wireframe, com as partes que
  o formulário decide renderizadas **de verdade** (marca + nome da org, marca + nome do
  workspace, saudação, linha do owner no rail) e **todo o resto em cinza**
  (`--bg-placeholder`, então segue light/dark). O motivo: “Organization name” é abstrato,
  `Azion / Acme Inc.` num header não é. E o wire **nunca** pode parecer uma tela usável,
  senão o usuário lê como produto carregando e espera — por isso é `aria-hidden` +
  `pointer-events-none`.

**Ver:** [/signup/onboarding](https://mh2saqc1un.map.azionedge.net/signup/onboarding) ·
[/signup](https://mh2saqc1un.map.azionedge.net/signup) (o caminho social pula a verificação)

### Criar organização de dentro do console

Organizações seguintes são criadas **deliberadamente**, em `/organizations/new`, pela
entrada *New organization* do switcher do header. As demais chegam por convite — é isso
que faz o *Switch Account* existir.

- É **página**, não modal, pelo mesmo motivo de todo create de módulo: tem começo e fim,
  e a URL precisa ser linkável e segura no botão voltar. Shell de criação focada (sem
  sidebar, só o `CreationHeader`).
- Roda **o mesmo `createOrganization`** do onboarding, então uma organização tem **uma
  forma só**, por qualquer porta que tenha entrado: owner, status `active`, um workspace.
- **Criar também entra:** o fluxo termina na home, não de volta onde começou — o escopo
  mudou, e voltar para uma página ainda mostrando as linhas da organização anterior seria
  mentira.
- Validação no submit: vazio revela o `required` âmbar; nome que **colide** com uma org da
  qual o usuário já participa é o `invalid` vermelho — conflito não é omissão.
- O seletor de accent é compartilhado pelos dois fluxos (`OrgMarkPicker`): **swatches**,
  não previews da arte gerada — a marca é gerada a partir do **nome**, então uma opção
  pintada com o nome vivo repintaria a cada tecla, sete figurinhas se agitando enquanto o
  usuário tenta ler o campo em que está digitando. A cor é a escolha; a arte é assunto do
  nome.

**Ver:** [/organizations/new](https://mh2saqc1un.map.azionedge.net/organizations/new)
(ou o switcher de organização no header → *New organization*)

---

## 5. Sistema de filtro unificado nas listagens

Todas as listagens passaram a narrar do mesmo jeito, com duas decisões:

1. **Seletor por coluna, nunca construtor field/operator/value.** São as **colunas** que
   decidem os campos: cada coluna enumerável ganha um `Select` múltiplo, a coluna de data
   ganha um date picker (`Calendar mode="range"`, sem presets), e as colunas de texto livre
   ficam com o campo de busca em vez de um campo cada.
2. **Tudo atrás de um `FilterPopover`** (um `IconButton` com `Badge` de contagem), à
   **esquerda** da busca. Antes eram quatro selects sempre visíveis competindo com a busca
   e com as ações da página numa banda de 40px: a busca — o controle que as pessoas de fato
   usam — era a primeira a perder largura, e uma quinta coluna não tinha para onde ir.

Detalhes que fecham o padrão: os filtros **aplicam ao escolher** (não há draft/Apply — cada
seletor é independentemente significativo); o rodapé do painel carrega *Clear all* + saída;
o badge de contagem é o que impede um filtro invisível de ser um filtro esquecido; e
`dismissible: false` é deliberado, porque `Select`/`Calendar` teleportam os próprios
overlays e o light-dismiss leria a escolha como clique fora.

**Ver:** [/applications](https://mh2saqc1un.map.azionedge.net/applications) ·
[/workloads](https://mh2saqc1un.map.azionedge.net/workloads) ·
[/deployments](https://mh2saqc1un.map.azionedge.net/deployments) ·
[/edge-dns](https://mh2saqc1un.map.azionedge.net/edge-dns) ·
[/variables](https://mh2saqc1un.map.azionedge.net/variables)

O mesmo bloco de controles (`DeploymentTableControls`) é reusado dentro do toolbar das
tabelas de nível interno — popover incluído — para o filtro não ser reinventado por nível:
[/workloads/1020482](https://mh2saqc1un.map.azionedge.net/workloads/1020482)

---

## 6. Documentação de retorno de erro em campos

Página-cenário dedicada: **referência obsoleta na criação** (dois usuários no mesmo módulo,
o segundo deleta o Edge Connector que o primeiro acabou de selecionar; o navegador do
primeiro nunca é avisado e o erro só aparece no submit).

O que ela documenta é **onde o erro vai**, em três casos distintos:

| Falha | Onde é reportada |
|---|---|
| input vazio / malformado (client-side) | no próprio campo (`required` âmbar / `invalid` vermelho) |
| request falhou, sem vínculo com campo (5xx) | `toast.error` + Retry |
| request **rejeitado**, escopado a **um campo** | `Message severity="danger"` **dentro da seção** que o contém |

O terceiro caso é o que a tela demonstra, e o toast é errado para ele: o toast se dispensa
e não aponta para lugar nenhum, enquanto a recuperação está em **um Select, seis seções
abaixo**. O formulário é longo de propósito para a recuperação ser real: quando a rejeição
chega, a seção com erro é **rolada até o topo** (âncora posicional, `scrollIntoView` suave e
respeitando `prefers-reduced-motion`), o `Message` entra no `bottom` slot do `SectionHeading`
animando altura (nada abaixo salta), e o campo assume `invalid` — nunca o `required` âmbar,
porque o valor **está** preenchido, só não é mais válido.

**Ver:** [/forms/error-validation](https://mh2saqc1un.map.azionedge.net/forms/error-validation)

---

## 7. Documentação de ação assíncrona com erro e sucesso

O cenário oposto ao de cima: uma ação que **sobrevive à tela** (deploy de ~30s), e como a
falha encontra um usuário que já saiu dali.

| A falha chega… | Reportar em… |
|---|---|
| com o usuário no formulário, escopada a um campo | `Message` na seção + `invalid` no campo |
| depois que ele saiu, de um job em background | **toast** — a única superfície global |

Três consequências, que são o cenário:

1. **A execução não vive no componente.** Timer, estado e toast ficam em escopo de módulo
   (`src/lib/deploy-runs.js`), então navegar para outra tela não cancela o deploy — o
   unmount da página não é um evento que o deploy escuta.
2. **O progresso é um toast de loading** (spinner, sem auto-dismiss) — a única coisa que
   viaja com o usuário pelo console inteiro.
3. **O toast de erro é permanente e closable.** Uma falha que o usuário não presenciou não
   pode expirar sem ser vista; e o que não expira precisa poder ser fechado à mão. A
   anatomia carrega as duas saídas — **Redeploy** e um atalho para Deployments — porque, uma
   vez dispensado, o toast era a única referência à falha na tela.

O card na página é uma **vista** da execução, nunca a dona dela: lê o `seek` para quem
volta no meio do deploy pegar os logs onde eles realmente estão, em vez de vê-los rebobinar.

**Ver:** [sucesso](https://mh2saqc1un.map.azionedge.net/forms/async-deployment?outcome=success) ·
[erro](https://mh2saqc1un.map.azionedge.net/forms/async-deployment?outcome=error)
(inicie o deploy e navegue para outra página para ver o toast acompanhar)

---

## 8. Posicionamento e tamanho de botões — por tipo de página

A regra passou a ser derivada de **como a página é nomeada**, não do módulo:

### a) Listagem primária **sem tabs** — o botão vive no nível da tabela
Sem `PageHeading`: o nome do módulo **já é** o crumb do header, então um `<h1>` repetindo-o
só empurra a tabela para baixo e come a primeira linha acima da dobra. O que a página abre
é o que o usuário veio fazer: um `ControlsHeader` — **narrowing à esquerda** (filtro + busca,
onde o olho começa), **ações da página à direita** (`Documentation` + `+ New …`) — e a tabela
logo abaixo, as duas como **uma banda** (`--layout-group-gap`).
Os controles ficam **fora** do `#toolbar` da tabela de propósito: eles pertencem à **página**
(o botão de criar age sobre o módulo, não sobre a tabela), e isso mantém o card como moldura
de dados.

**Ver:** [/applications](https://mh2saqc1un.map.azionedge.net/applications) ·
[/workloads](https://mh2saqc1un.map.azionedge.net/workloads)

### b) Listagem primária **com tabs** — o botão fica relativo às Tabs
As tabs formam a barra de nav de 2º nível e carregam as ações no próprio slot `actions`,
à direita. Cada tab traz **o seu** conjunto de controles, porque tabs diferentes narram
sujeitos diferentes e criam coisas diferentes. A tab ativa mora na URL (`?tab=`), então é
recarregável e linkável.
A linha é `items-center` (não `items-end`): um `Button size="medium"` de 32px centraliza
contra os itens de 30px da tab — alinhar pelas bases faz o botão pender 2px e obriga um
`mb-*` na mão.

**Ver:** [/deployments](https://mh2saqc1un.map.azionedge.net/deployments) (tabs *All
Deployments* / *Settings*, cada uma com sua própria ação e seu próprio filtro)

### c) Páginas internas (2º nível) — tabs full-bleed + ação na barra
Página de detalhe não tem `PageHeading`: as tabs são a borda inferior do header e a ação
principal da tab acompanha a barra (ex.: **Deploy** na tab *Build*). A ação pode ser
**da tab**, não da página — ela é declarada junto da tab e sabe o próprio estado pendente.

**Ver:** [/applications/1784552864](https://mh2saqc1un.map.azionedge.net/applications/1784552864?tab=build) ·
[/account](https://mh2saqc1un.map.azionedge.net/account?tab=account-settings)

### Escala do título, quando existe
`PageHeading` ganhou `size` amarrado à **profundidade de nav**, não ao módulo:
`medium` na listagem de 1º nível (o título nomeia a coleção), `small` de detalhe para
baixo (o breadcrumb já carrega o contexto e o título só rotula uma seção), `large`
reservado para a página cujo título **é** o conteúdo (creation center). Um `TabView` sob
uma barra de nav de 2º nível **mantém** seu título: a barra é navegação, não heading.

---

## 9. Sidebar — recolher agora é um gesto de drag

O rail deixou de ter apenas um toggle: a borda direita dele é um **handle** (`role="separator"`,
focável) e o **arraste é o gesto**.

- **Redimensionar:** arraste entre `--container-3xs` (256px) e `--container-sm` (408px) —
  os limites vêm de tokens lidos em runtime, não de números mágicos.
- **Recolher:** puxe **56px além do mínimo** e o rail sai do layout em vez de travar no
  mínimo — o puxão **é** o collapse, e a largura que ele tinha é guardada para quando voltar.
- **Reabrir:** puxe a borda de volta; enquanto o ponteiro está pressionado o rail
  **espia** (cresce e vai aparecendo sob o cursor, com a borda exatamente sob o dedo) e
  **commita** ao passar do snap — abrir parece pegar o rail na aresta e trazê-lo, não
  apertar um botão que revela um painel.
- **Teclado:** setas ← → nudge de 16px, esquerda além do snap recolhe, direita a partir do
  recolhido restaura. **Duplo clique** recolhe.
- A largura e o estado recolhido persistem em `localStorage` (sobrevivem à navegação e ao
  reload); a linha do handle só aparece em hover / focus / drag, para o rail ler como
  aresta lisa em repouso. Zero biblioteca — pointer events nativos.

**Ver:** [/home](https://mh2saqc1un.map.azionedge.net/home) → arraste a borda direita da
sidebar; puxe além do mínimo para recolher, e puxe a aresta para trazer de volta.

---

## 10. Variables — drawer de criação com import de `.env`

A listagem de Variables carregava o formulário de criação dentro do próprio arquivo.
O formulário saiu para um drawer dedicado e a página ficou só com o que uma **lista**
possui: os registros, o narrowing, e anexar o que o drawer criou.

- **Formulário plano, não seccionado em cards:** um trio **Key / Value / Note** repetido
  acima de um `Divider` full-bleed, e abaixo dele as três configurações (*Sensitive*,
  *Environments*, *Link to Projects*). Com um grupo repetido e três settings não há o que
  um título de seção desambiguar — o divider já lê como a fronteira entre **o que** as
  variáveis são e **como** elas são guardadas.
- **Variável raramente vem sozinha:** o trio é um **repeater** — *Add Another* acrescenta
  um vazio e foca o Key, cada linha além da primeira pode ser removida, e um
  `TransitionGroup` faz o morph da lista nas duas ações, cronometrado pelos tokens de
  animação (nunca valor cravado).
- **Duas entradas em massa, um único parser** (`src/lib/dotenv.js`): o *Import* do rodapé
  lê um `.env` escolhido, e **colar** o conteúdo de um arquivo em **qualquer** input de Key
  expande em uma linha por par — em vez de despejar o arquivo inteiro numa única key, que é
  exatamente o que a dica do rodapé promete.
- O parser é **tolerante com o que um `.env` real tem** (prefixo `export`, aspas,
  comentários, linhas vazias) e **pula** o que não consegue ler como par, para uma linha
  perdida nunca virar uma variável batizada com meia frase. Sem expansão de variável
  (`$OUTRA`) e sem valores multi-linha: o formulário não sabe fazer round-trip de nenhum
  dos dois, e suportar pela metade em silêncio seria pior que pular.
- Sem **Cancel** no rodapé: o X do painel, o overlay e o Escape já fecham, e um segundo
  descarte só competiria com o Save pelo olhar.

**Ver:** [/variables](https://mh2saqc1un.map.azionedge.net/variables) → **Create Variable**

---

## 11. Estado de submit — o que a tela diz enquanto espera

Um formulário travado por ~900ms de request tinha duas telas dizendo a coisa errada.
A regra passou a ser uma só: **durante a espera os campos ficam desabilitados, e nada
que descreva um campo que o usuário não pode operar continua na tela.**

- **Desabilitado sim, helper não.** No Sign Up os dois campos vão a `:disabled` com o
  escopo, mas as **linhas de helper são retiradas** enquanto trava. Uma frase de requisito
  (“mínimo 8 caracteres, com letra e número”) sob um campo que não aceita digitação não
  instrui nada, e o `:loading` do botão pressionado já é a mensagem de que a espera existe.
- **Trava transitória não é cadeado.** `FieldPassword` e `FieldSelect` colocam `disabled`
  no **topo** da própria cadeia de helper: com o campo desabilitado a linha ganha um
  **cadeado** e, no caso do password, **passa por cima do `invalid`** — um erro vermelho
  virava texto cinza com cadeado por 900ms. Cadeado diz *“travado para sempre”*; a espera
  de um request não é isso.
- **Por isso o password é composto.** O campo de senha do Sign Up passou a ser
  `InputPassword` + `HelperText` em vez de `FieldPassword`: pedir helper vazio ao
  `FieldPassword` faz ele **inventar** `"This field is locked."` no lugar. Composto por
  primitivas, quem decide o que descreve o campo é a tela.
- **Nada aponta para o que não existe.** O `aria-describedby` dos dois campos sai junto
  com a linha, então nenhum input referencia um elemento fora do DOM enquanto trava.
- **Sign In segue o mesmo divisor do Sign Up.** O filete desenhado à mão entre o e-mail e
  os provedores sociais virou o `Divider` do pacote com `label="or"`, posicionado **entre
  os dois caminhos** — antes o botão *Continue with Email* ficava do lado social do
  separador, então o “or” separava a coisa errada.
- **Create Organization — a coluna de texto encolheu.** As quatro bandas passaram de
  50/50 para **40/60** (guia à esquerda, campos à direita), com `minmax(0,…)` em cada
  trilha para um nome longo sem espaço não estourar a coluna.

**Ver:** [/login](https://mh2saqc1un.map.azionedge.net/login) ·
[/signup](https://mh2saqc1un.map.azionedge.net/signup) (pressione **Sign Up** com os
campos preenchidos e observe que nenhuma linha de helper sobra) ·
[/organizations/new](https://mh2saqc1un.map.azionedge.net/organizations/new)

---

## 12. Boundary e measure — o inset não sai da medida

**Deployments lia 1572px de conteúdo onde Workloads lia 1615px**, na mesma viewport: a
única listagem do console numa largura que nenhuma outra usava. A causa não era da
página — era a **ordem entre BOUNDARY e MEASURE**, e valia para todas as páginas que
aplicam o próprio boundary. Virou **uma regra no sistema de layout**, no lugar de 24
correções de página.

### O que estava errado

| Forma | Onde o inset é aplicado | Conteúdo resolvido (measure 1620px) |
|---|---|---|
| Página `padded` (listagens sem tabs) | pelo `AppLayout`, no scroll box — **fora** do bloco com o cap | **1615px** (a measure chega inteira) |
| Página `:padded="false"` (detalhe com tabs, Deployments, create flows, formulários) | pela própria página, **no mesmo bloco** da measure | **1572px** (o cap engole 24px de cada lado) |

Com `box-sizing: border-box`, `max-width: 1620px` + `padding-inline: 24px` dá **1572px de
conteúdo**. A measure passava a descrever outra coisa que não conteúdo — que é o único
trabalho dela (“até onde a coluna de leitura pode crescer”).

### A correção

- **Quando o boundary viaja no mesmo bloco, o cap cresce exatamente o inset que ele passou
  a conter.** Cada classe de coluna declara a sua medida em `--layout-column-measure`, e uma
  única regra em `src/styles/layout.css` soma o inset ao cap. As duas formas passam a
  resolver para a **mesma** coluna de conteúdo em qualquer viewport — abaixo da measure ambas
  são `100%` menos o mesmo inset, acima dela ambas são a measure, centradas no mesmo eixo.
  Uma página pode **ganhar ou perder o próprio boundary** (ganhar uma barra de tabs, virar
  `padded`) sem mudar de largura, e nenhuma página precisa saber em qual forma está.
- **A barra sticky entrou no sistema.** Os dez rodapés de ação escreviam
  `px-[var(--layout-boundary-inline)]` à mão: lia o token, mas ficava fora do sistema — nada
  amarrava o inset da barra ao da coluna que ela submete. Virou **`.layout-boundary-inline`**,
  uma classe que a regra da measure vê, então a barra alinha com o corpo **por construção**
  em vez de por coincidência.
- **Deployments manteve a marcação e mudou a geometria.** A barra de tabs segue full-bleed e
  o bloco segue com as duas classes, como toda página `:padded="false"`.

### Medido depois (a 1920px, e a 2560px entre parênteses)

| Contexto | Antes | Depois |
|---|---|---|
| Listagem sem tabs (`padded`) — referência | 281/1615 | **281/1615** (599/1620) — não mudou |
| [Deployments](https://mh2saqc1un.map.azionedge.net/deployments) (listagem com tabs) | 303/1572 | **281/1615** (599/1620) |
| Detalhe com tabs e views de tab | 303/1572 | **281/1615** (599/1620) |
| Settings e formulários | 976px | **1024px** |
| Create flows (corpo **e** barra sticky) | 1144px | **1192px**, os dois no mesmo `left`/`width` |

### E as duas telas de criar organização entraram na regra do item 11

Durante o request as linhas de guia saem e o `aria-describedby` sai com elas, nos dois
formulários. No **Onboarding** isso também apagou os quatro `"This field is locked."` — a
pendência registrada no item 11 — e **sem** compor o select por primitivas: basta **não**
passar `:disabled` aos `FieldSelect`, porque o `<fieldset :disabled>` que envolve o
formulário já bloqueia cada trigger (é um `button` nativo, então um fieldset desabilitado
acima cobre). O cadeado só aparecia porque o wrapper responde ao **próprio** prop `disabled`
com uma linha de bloqueio permanente — para uma espera de 900ms.

**Ver:** [/deployments](https://mh2saqc1un.map.azionedge.net/deployments) ·
[/workloads](https://mh2saqc1un.map.azionedge.net/workloads) (a referência: as duas leem a
mesma largura) ·
[/applications/1784552864](https://mh2saqc1un.map.azionedge.net/applications/1784552864) ·
[/organizations/new](https://mh2saqc1un.map.azionedge.net/organizations/new) e
[/signup/onboarding](https://mh2saqc1un.map.azionedge.net/signup/onboarding) (pressione o
botão com os campos preenchidos: nenhuma linha de helper sobra, nenhum cadeado aparece)

---

## Resumo das decisões de Tabs + botões

| Contexto | Heading | Onde ficam os botões |
|---|---|---|
| Listagem 1º nível, **sem tabs** | nenhum (o crumb nomeia) | `ControlsHeader`, à direita, **no nível da tabela**, junto do filtro/busca |
| Listagem 1º nível, **com tabs** | nenhum | na **barra de tabs**, à direita; cada tab tem as suas |
| Página interna (detalhe) | nenhum (tabs full-bleed) | na barra de tabs; a ação pode pertencer **à tab** |
| Settings / formulário | `PageHeading size="small"` | no rodapé do formulário / seção |
| Página cujo título é o conteúdo | `PageHeading size="large"` | junto do conteúdo |

---

## Pendências conhecidas

- `/forms/in-page` e telas irmãs ainda precisam do `z-10` no footer sticky (o mesmo fix já
  aplicado em `/forms/error-validation`), senão os inputs do card pintam sobre a barra
  Cancel/Save durante o scroll.
- ~~`/signup/onboarding` (Sign Up → criar organização) renderiza helper texts no submit.~~
  Os `FieldSelect` de *About your company* recebiam `:disabled` e, por isso, cada
  um inventava a própria linha `"This field is locked."` (com cadeado) enquanto o request
  estava em voo — a mesma causa descrita no item 11. **Resolvido no item 12**, e sem compor o
  select por primitivas: o `:disabled` saiu dos `FieldSelect` e quem tranca é só o
  `<fieldset :disabled>` acima deles (cada trigger é um `button` nativo, então o fieldset
  cobre). Sem o prop, o wrapper não inventa linha nenhuma.
- A causa raiz continua sendo do **pacote**, não da sample: `field-password` e
  `field-select` *documentam* esse comportamento no spec (“switches the helper to
  kind=disabled”), então qualquer app que passe `:disabled` a um desses campos durante um
  submit herda o cadeado. O contorno das telas daqui — deixar a trava para o `fieldset` e
  nunca passar o prop — funciona, mas depende de o controle ser um form control nativo.
  Corrigir de verdade é decisão de DS (rebaixar `disabled` na cadeia, ou abrir uma saída
  explícita) e mexe em spec + testes de componentes já publicados.
