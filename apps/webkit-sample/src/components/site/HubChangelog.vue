<script setup>
  // The Hub's CHANGELOG view — what changed in the console sample, written for
  // whoever receives the layout.
  //
  // It is a HIDDEN page: it carries no entry in HubSidebar and nothing in the Hub
  // links to it, so it is reachable only by its own URL (/site/hub/changelog).
  // That is the point — it is a link you hand to someone, not a section of the
  // library docs. It still renders inside the Hub shell (same rail, same framed
  // column) so a reader who arrives by link can walk into the rest of the Hub.
  //
  // Every entry pairs the DECISION with a live route: the sample is deployed, so
  // the honest way to document a layout decision is to point at the screen where
  // it is applied instead of describing it twice. Links open in a new tab and are
  // RELATIVE, so the page works the same on the deploy and on localhost.
  //
  // Long-form source of the same content: apps/webkit-sample/REPORT-ATUALIZACOES.md.
  // The numbering here mirrors that file so the two can be read side by side.
  import Link from '@aziontech/webkit/link'
  import Tag from '@aziontech/webkit/tag'

  import BannerContainer from './foundations/components/layout/BannerContainer.vue'
  import PageHeader from './foundations/components/layout/PageHeader.vue'
  import SectionContainer from './foundations/components/layout/SectionContainer.vue'
  import SectionModule from './foundations/components/layout/SectionModule.vue'

  // When this list was last revised. Deliberately NOT the deploy prefix: that
  // rotates on every publish, so a prefix printed here is stale the moment the
  // page ships — including on the very deploy that ships it.
  const UPDATED_AT = '31/07/2026'

  // One entry per update. `points` is the substance — `term` is the decision, `text`
  // is why it went that way; `table` is used only where the decision IS a mapping
  // (a measure per layout, a failure per surface); `links` are the screens.
  const entries = [
    {
      id: 'containers',
      title: '1. Padrão de containers',
      summary:
        'Espaçamento e largura deixaram de ser decisão de cada tela e viraram tokens de layout, com três decisões declaradas uma única vez — e derivadas das escalas fluidas do theme, sem uma única media query.',
      points: [
        {
          term: 'Boundary',
          text: 'distância do conteúdo até o chrome da app. O topo é um passo maior que as laterais, porque a borda do header lê como aresta dura e o olho pede mais respiro ali.'
        },
        {
          term: 'Rhythm',
          text: 'distância entre seções (passo xl) e dentro de uma banda (passo md). O gap pertence sempre ao pai, nunca ao filho, então mover um não arrasta o outro.'
        },
        {
          term: 'Measure',
          text: 'até onde a coluna de leitura pode crescer — e isso varia por contexto: uma tabela de dados quer largura, um formulário não.'
        },
        {
          term: 'Manutenção em massa',
          text: 'mudar o respiro de todas as páginas de settings, ou a largura de todas as listagens, é um token — não uma varredura por dezenas de telas. O conjunto foi escrito com nome semântico e zero valor cru para poder ser promovido ao @aziontech/theme como semantic/layouts e valer para qualquer app consumidora.'
        }
      ],
      table: {
        head: ['Tipo de layout', 'Measure'],
        rows: [
          ['Listagem (dados, tabela larga)', '1620px'],
          ['Create (fluxo de criação)', '1024px'],
          ['Configurações / Settings', '876px'],
          ['Focado (home, creation center)', '1024px']
        ]
      },
      links: [
        { label: 'Listagem', path: '/applications' },
        { label: 'Create', path: '/applications/new' },
        { label: 'Listagem 2º nível', path: '/applications/1784552864?tab=main-settings' },
        { label: 'Settings', path: '/account?tab=account-settings' }
      ]
    },
    {
      id: 'switch',
      title: '2. Switch — cor e shape',
      summary:
        'Atualizado no pacote @aziontech/webkit e refletido em toda a sample.',
      points: [
        {
          term: 'Track ligado',
          text: 'passou de --success-contrast para --accent: mais contraste, e alinhado ao resto dos controles ativos.'
        },
        {
          term: 'Raio concêntrico',
          text: 'track em --shape-elements (6px) e handle em --radius (4px). 6px menos o inset de 2px dá exatamente o raio interno, então o handle acompanha a curva do track em vez de ser um pill dentro de outro pill.'
        },
        {
          term: 'Handle estável entre temas',
          text: 'knob branco fixo com o ícone de lock preto fixo. Sobre o track --accent esses dois não podem inverter com light/dark, senão o estado ligado perde legibilidade em um dos temas.'
        },
        {
          term: 'Baselines',
          text: '34 baselines visuais regeradas (Switch, FieldSwitch, FieldSwitchBlock, FieldTextSwitch).'
        }
      ],
      links: [
        { label: 'Item group', path: '/forms/itemgroup' },
        { label: 'Account Settings', path: '/account?tab=account-settings' },
        { label: 'In-page form', path: '/forms/in-page' }
      ]
    },
    {
      id: 'command-menu',
      title: '3. Command Menu (busca global)',
      summary:
        'O campo de busca no topo da sidebar virou a afordância do ⌘K: um campo read-only que abre a paleta, em vez de filtrar a nav no lugar.',
      points: [
        {
          term: 'O que a paleta carrega',
          text: 'a navegação inteira (mesmos grupos e labels do rail) mais os comandos de app, com os valores namespaced para o handler distinguir navegar de executar.'
        },
        {
          term: 'Funciona com o rail recolhido',
          text: 'a paleta teleporta para o body, então não depende da sidebar estar presente.'
        },
        {
          term: 'Um único dono do atalho',
          text: 'a cópia da sidebar dentro do drawer mobile recebe o atalho vazio, para o ⌘K nunca abrir duas paletas ao mesmo tempo.'
        }
      ],
      links: [{ label: 'Abra e tecle ⌘K', path: '/home' }]
    },
    {
      id: 'tenancy',
      title: '4. Cadeia Organization / Account / Workspace',
      summary:
        'O header global passou a carregar a cadeia de identidade inteira — Azion / Organization / Account / Workspace — separada da localização por um filete, e só então o breadcrumb.',
      points: [
        {
          term: 'Identidade ≠ localização',
          text: 'a cadeia responde “por quem estou atuando”; o breadcrumb responde “onde estou”. Por isso identidade saiu do rail e subiu para o header: ela é global e não pode desaparecer quando o rail recolhe.'
        },
        {
          term: 'Três níveis, três perguntas',
          text: 'a organização é a quem você pertence, a account é a infraestrutura que você opera, o workspace é a fatia dela que você está olhando.'
        },
        {
          term: 'Degradação definida',
          text: 'abaixo de md o workspace é o primeiro elo a sair (três marcas mais o hamburger e as ações não caberiam); abaixo de lg o breadcrumb dá lugar, porque a página repete o último crumb e a cadeia não se repete em lugar nenhum.'
        },
        {
          term: 'Accent por organização',
          text: 'é o único lugar em que um tenant se colore, e existe para o operador que vive em três organizações distingui-las antes de ler um caractere.'
        }
      ],
      links: [{ label: 'Cadeia no header', path: '/home' }]
    },
    {
      id: 'onboarding',
      title: '5. Onboarding — a organização nasce no signup',
      summary:
        'O /signup/personalize deixou de existir e virou /signup/onboarding: uma tela única, onde a primeira organização passa a existir. Ela nasce aqui porque um usuário não pode estar em lugar nenhum — se não fosse criada com a conta, o console abriria num empty state cuja única ação é o que o signup deveria ter feito.',
      points: [
        {
          term: 'Três decisões',
          text: 'o nome do usuário, o nome da organização — pergunta separada, porque uma empresa não se chama como o seu primeiro usuário, e ecoar um no outro lê como bug na primeira vez que divergem — e a marca (accent). Mais additional data, opcional.'
        },
        {
          term: 'O que não é perguntado',
          text: 'o primeiro workspace (nasce como “My Workspace” e é renomeado depois, mas aparece no wire, porque o console realmente abre escopado nele), o owner e o status. São consequência: quem cria é owner e primeiro Organization User, e a org nasce ativa.'
        },
        {
          term: 'Dois caminhos, um fim',
          text: 'o signup por e-mail cai aqui pelo link de verificação; um provedor social — que autentica e atesta o endereço — vem direto, pulando a verificação. O lock é a união das duas flags: só o controle pressionado mostra loading, e nenhum segundo caminho começa enquanto um está em voo.'
        },
        {
          term: 'O wire',
          text: 'ao lado do formulário, o console desenhado como wireframe, com as partes que o formulário decide renderizadas de verdade e todo o resto em cinza. “Organization name” é abstrato; “Azion / Acme Inc.” num header não é. E o wire nunca pode parecer uma tela usável, senão o usuário lê como produto carregando e espera.'
        }
      ],
      links: [
        { label: 'Onboarding', path: '/signup/onboarding' },
        { label: 'Sign up (caminho social)', path: '/signup' }
      ]
    },
    {
      id: 'create-organization',
      title: '6. Criar organização de dentro do console',
      summary:
        'Organizações seguintes são criadas deliberadamente, em /organizations/new, pela entrada New organization do switcher do header. As demais chegam por convite — é isso que faz o Switch Account existir.',
      points: [
        {
          term: 'Página, não modal',
          text: 'pelo mesmo motivo de todo create de módulo: tem começo e fim, e a URL precisa ser linkável e segura no botão voltar. Shell de criação focada, sem sidebar.'
        },
        {
          term: 'Uma forma só',
          text: 'roda o mesmo createOrganization do onboarding, então uma organização tem a mesma forma por qualquer porta que tenha entrado: owner, status ativo, um workspace.'
        },
        {
          term: 'Criar também entra',
          text: 'o fluxo termina na home, não de volta onde começou — o escopo mudou, e voltar para uma página ainda mostrando as linhas da organização anterior seria mentira.'
        },
        {
          term: 'Required ≠ conflito',
          text: 'vazio revela o required âmbar; um nome que colide com organização da qual o usuário já participa é o invalid vermelho, porque conflito não é omissão.'
        },
        {
          term: 'Seletor de marca compartilhado',
          text: 'os dois fluxos usam o mesmo picker, com swatches em vez de previews da arte gerada: a marca é gerada a partir do nome, então opções pintadas com o nome vivo repintariam a cada tecla. A cor é a escolha; a arte é assunto do nome.'
        }
      ],
      links: [{ label: 'Create Organization', path: '/organizations/new' }]
    },
    {
      id: 'filters',
      title: '7. Filtro unificado nas listagens',
      summary:
        'Todas as listagens passaram a narrar do mesmo jeito, com duas decisões.',
      points: [
        {
          term: 'Seletor por coluna, nunca construtor',
          text: 'são as colunas que decidem os campos: cada coluna enumerável ganha um Select múltiplo, a coluna de data ganha um date picker de intervalo, e as colunas de texto livre ficam com a busca em vez de um campo cada.'
        },
        {
          term: 'Tudo atrás de um popover',
          text: 'um IconButton com badge de contagem, à esquerda da busca. Antes eram quatro selects sempre visíveis competindo com a busca e com as ações numa banda de 40px: a busca — o controle que as pessoas de fato usam — era a primeira a perder largura, e uma quinta coluna não tinha para onde ir.'
        },
        {
          term: 'Aplica ao escolher',
          text: 'não há draft nem Apply: cada seletor é independentemente significativo, então adiar a aplicação só somaria um passo e uma segunda cópia do estado. O rodapé carrega o que o painel realmente deve — desfazer tudo de uma vez, e a saída.'
        },
        {
          term: 'O badge é o que salva',
          text: 'um filtro que você não vê é um filtro que você esquece que ligou — a contagem no gatilho é o que impede um filtro recolhido de virar um filtro esquecido.'
        }
      ],
      links: [
        { label: 'Applications', path: '/applications' },
        { label: 'Workloads', path: '/workloads' },
        { label: 'Deployments', path: '/deployments' },
        { label: 'Edge DNS', path: '/edge-dns' },
        { label: 'Variables', path: '/variables' }
      ]
    },
    {
      id: 'field-error',
      title: '8. Retorno de erro em campos',
      summary:
        'Cenário: referência obsoleta na criação. Dois usuários no mesmo módulo; o segundo deleta o Edge Connector que o primeiro acabou de selecionar. O navegador do primeiro nunca é avisado, e o erro só aparece no submit.',
      table: {
        head: ['Falha', 'Onde é reportada'],
        rows: [
          ['Input vazio ou malformado (client-side)', 'no próprio campo — required âmbar / invalid vermelho'],
          ['Request falhou, sem vínculo com campo (5xx)', 'toast de erro com Retry'],
          ['Request rejeitado, escopado a um campo', 'Message dentro da seção que o contém']
        ]
      },
      points: [
        {
          term: 'Por que não toast no terceiro caso',
          text: 'o toast se dispensa e não aponta para lugar nenhum, enquanto a recuperação está em um Select, seis seções abaixo.'
        },
        {
          term: 'Âncora posicional',
          text: 'o formulário é longo de propósito para a recuperação ser real: quando a rejeição chega, a seção com erro é rolada até o topo, respeitando prefers-reduced-motion. O Message entra animando altura, então nada abaixo salta.'
        },
        {
          term: 'Invalid, não required',
          text: 'o valor está preenchido, só não é mais válido — então o campo assume o vermelho, nunca o prompt âmbar.'
        }
      ],
      links: [{ label: 'Error validation', path: '/forms/error-validation' }]
    },
    {
      id: 'async-action',
      title: '9. Ação assíncrona com erro e sucesso',
      summary:
        'O cenário oposto: uma ação que sobrevive à tela (um deploy de ~30s), e como a falha encontra um usuário que já saiu dali.',
      table: {
        head: ['A falha chega…', 'Reportar em…'],
        rows: [
          ['com o usuário no formulário, escopada a um campo', 'Message na seção + invalid no campo'],
          ['depois que ele saiu, de um job em background', 'toast — a única superfície global']
        ]
      },
      points: [
        {
          term: 'A execução não vive no componente',
          text: 'timer, estado e toast ficam em escopo de módulo, então navegar para outra tela não cancela o deploy: o unmount da página não é um evento que o deploy escuta.'
        },
        {
          term: 'O progresso é um toast de loading',
          text: 'spinner, sem auto-dismiss — a única coisa que viaja com o usuário pelo console inteiro.'
        },
        {
          term: 'O erro é permanente e closable',
          text: 'uma falha que o usuário não presenciou não pode expirar sem ser vista; e o que não expira precisa poder ser fechado à mão. A anatomia carrega as duas saídas (Redeploy e um atalho para Deployments), porque uma vez dispensado o toast era a única referência à falha na tela.'
        },
        {
          term: 'O card é uma vista, não o dono',
          text: 'ele lê o ponto atual da execução, então quem volta no meio do deploy pega os logs onde eles realmente estão em vez de vê-los rebobinar.'
        }
      ],
      links: [
        { label: 'Sucesso', path: '/forms/async-deployment?outcome=success' },
        { label: 'Erro', path: '/forms/async-deployment?outcome=error' }
      ]
    },
    {
      id: 'buttons',
      title: '10. Posição e tamanho de botões, por tipo de página',
      summary:
        'A regra passou a ser derivada de como a página é nomeada, não do módulo. Onde as Tabs existem, os botões são relativos a elas; na listagem, o PageHeading sai e sobra o botão de criar no nível da tabela com filtros.',
      points: [
        {
          term: 'Listagem primária sem tabs',
          text: 'sem PageHeading — o nome do módulo já é o crumb do header, e um h1 repetindo-o só empurra a tabela e come a primeira linha acima da dobra. A página abre com o que o usuário veio fazer: narrowing à esquerda (onde o olho começa), ações à direita, tabela abaixo, as duas como uma banda. Os controles ficam fora do toolbar da tabela porque pertencem à página: o botão de criar age sobre o módulo, não sobre a tabela.'
        },
        {
          term: 'Listagem primária com tabs',
          text: 'as tabs são a nav de 2º nível e carregam as ações no próprio slot, à direita. Cada tab traz o seu conjunto de controles, porque tabs diferentes narram sujeitos diferentes e criam coisas diferentes. A tab ativa mora na URL, então é recarregável e linkável. A linha é centralizada, não alinhada pela base: um botão de 32px centraliza contra itens de 30px — alinhar as bases faz o botão pender 2px e obriga um empurrão manual.'
        },
        {
          term: 'Páginas internas',
          text: 'detalhe não tem PageHeading: as tabs são a borda inferior do header e a ação principal acompanha a barra. A ação pode ser da tab e não da página (o Deploy vive na tab Build), declarada junto dela e sabendo o próprio estado pendente.'
        },
        {
          term: 'Escala do título, quando existe',
          text: 'amarrada à profundidade de nav, não ao módulo: medium na listagem de 1º nível, small de detalhe para baixo (o breadcrumb já carrega o contexto), large reservado à página cujo título é o conteúdo. Um TabView sob uma barra de nav de 2º nível mantém seu título: a barra é navegação, não heading.'
        }
      ],
      table: {
        head: ['Contexto', 'Heading', 'Onde ficam os botões'],
        rows: [
          ['Listagem 1º nível, sem tabs', 'nenhum (o crumb nomeia)', 'no nível da tabela, junto do filtro e da busca'],
          ['Listagem 1º nível, com tabs', 'nenhum', 'na barra de tabs; cada tab tem as suas'],
          ['Página interna (detalhe)', 'nenhum (tabs full-bleed)', 'na barra de tabs; a ação pode ser da tab'],
          ['Settings / formulário', 'PageHeading small', 'no rodapé do formulário'],
          ['Página cujo título é o conteúdo', 'PageHeading large', 'junto do conteúdo']
        ]
      },
      links: [
        { label: 'Sem tabs', path: '/applications' },
        { label: 'Com tabs', path: '/deployments' },
        { label: 'Interna com tabs', path: '/applications/1784552864?tab=build' },
        { label: 'Settings', path: '/account?tab=account-settings' }
      ]
    },
    {
      id: 'sidebar-drag',
      title: '11. Sidebar — recolher agora é um gesto de drag',
      summary:
        'O rail deixou de ter apenas um toggle: a borda direita é um handle focável, e o arraste é o gesto. Zero biblioteca — pointer events nativos.',
      points: [
        {
          term: 'Redimensionar',
          text: 'arraste entre 256px e 408px. Os limites vêm de tokens lidos em runtime, não de números mágicos.'
        },
        {
          term: 'Recolher',
          text: 'puxe 56px além do mínimo e o rail sai do layout em vez de travar no mínimo — o puxão é o collapse, e a largura que ele tinha é guardada para quando voltar.'
        },
        {
          term: 'Reabrir',
          text: 'puxe a borda de volta: enquanto o ponteiro está pressionado o rail espia, crescendo sob o cursor com a borda exatamente sob o dedo, e commita ao passar do snap. Abrir parece pegar o rail na aresta e trazê-lo, não apertar um botão que revela um painel.'
        },
        {
          term: 'Teclado e persistência',
          text: 'setas nudge de 16px, esquerda além do snap recolhe, direita restaura, duplo clique recolhe. Largura e estado sobrevivem à navegação e ao reload. A linha do handle só aparece em hover, foco ou arraste, para o rail ler como aresta lisa em repouso.'
        }
      ],
      links: [{ label: 'Arraste a borda do rail', path: '/home' }]
    },
    {
      id: 'variables',
      title: '12. Variables — drawer de criação com import de .env',
      summary:
        'A listagem carregava o formulário de criação dentro do próprio arquivo. O formulário saiu para um drawer dedicado e a página ficou só com o que uma lista possui: os registros, o narrowing, e anexar o que o drawer criou.',
      points: [
        {
          term: 'Formulário plano',
          text: 'um trio Key / Value / Note repetido acima de um divider full-bleed, e abaixo dele as três configurações. Com um grupo repetido e três settings não há o que um título de seção desambiguar — o divider já lê como a fronteira entre o que as variáveis são e como são guardadas.'
        },
        {
          term: 'Variável raramente vem sozinha',
          text: 'o trio é um repeater: Add Another acrescenta um vazio e foca o Key, cada linha além da primeira pode ser removida, e a lista faz morph nas duas ações, cronometrada pelos tokens de animação.'
        },
        {
          term: 'Duas entradas em massa, um parser',
          text: 'o Import do rodapé lê um .env escolhido, e colar o conteúdo de um arquivo em qualquer input de Key expande em uma linha por par — em vez de despejar o arquivo inteiro numa única key, que é exatamente o que a dica do rodapé promete.'
        },
        {
          term: 'Tolerante, mas honesto',
          text: 'lê o que um .env real tem (prefixo export, aspas, comentários) e pula o que não consegue ler como par, para uma linha perdida nunca virar variável batizada com meia frase. Sem expansão de variável e sem valores multi-linha: o formulário não faz round-trip de nenhum dos dois, e suportar pela metade em silêncio seria pior que pular.'
        },
        {
          term: 'Sem Cancel',
          text: 'o X do painel, o overlay e o Escape já fecham; um segundo descarte no rodapé só competiria com o Save pelo olhar.'
        }
      ],
      links: [{ label: 'Variables → Create Variable', path: '/variables' }]
    }
  ]
</script>

<template>
  <BannerContainer max-width="7xl">
    <PageHeader
      size="page"
      eyebrow="Console sample"
      title="Changelog"
      margin-bottom=""
      description="O que mudou no sample do console — cada decisão com o link da tela onde ela está aplicada. Não é screenshot: os links abrem a app publicada, então o comportamento pode ser conferido no lugar onde vive."
    >
      <template #actions>
        <Tag
          :label="`Atualizado em ${UPDATED_AT}`"
          severity="info"
        />
      </template>
    </PageHeader>
  </BannerContainer>

  <SectionContainer max-width="7xl">
    <SectionModule
      v-for="entry in entries"
      :key="entry.id"
      :title="entry.title"
      :description="entry.summary"
    >
      <div class="flex flex-col gap-[var(--spacing-lg)] p-[var(--spacing-xl)]">
        <!-- The substance: the decision in bold, why it went that way after it. -->
        <ul class="flex flex-col gap-[var(--spacing-md)]">
          <li
            v-for="point in entry.points"
            :key="point.term"
            class="flex gap-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
          >
            <span
              class="mt-[0.55lh] size-[var(--spacing-xxs)] shrink-0 rotate-45 bg-[var(--accent)]"
              aria-hidden="true"
            />
            <p class="text-pretty">
              <strong class="font-medium text-[var(--text-default)]">{{ point.term }}</strong>
              — {{ point.text }}
            </p>
          </li>
        </ul>

        <!-- Only where the decision IS a mapping. Scrolls on its own so a narrow
             viewport never makes the page scroll sideways. -->
        <div
          v-if="entry.table"
          class="overflow-x-auto rounded-[var(--shape-card)] border border-[var(--border-default)]"
        >
          <table class="w-full border-collapse text-left text-body-sm">
            <thead>
              <tr class="border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
                <th
                  v-for="head in entry.table.head"
                  :key="head"
                  scope="col"
                  class="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-body-xs font-medium text-[var(--text-default)]"
                >
                  {{ head }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in entry.table.rows"
                :key="index"
                class="border-b border-[var(--border-muted)] last:border-b-0"
              >
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="cellIndex"
                  class="px-[var(--spacing-md)] py-[var(--spacing-sm)] align-top text-[var(--text-muted)] first:text-[var(--text-default)]"
                >
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- The screens. Relative paths, new tab: the reader keeps the changelog
             open while walking through what it describes. -->
        <div class="flex flex-wrap items-center gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-xs)]">
          <Link
            v-for="link in entry.links"
            :key="link.path"
            :label="link.label"
            :href="link.path"
            target="_blank"
            size="small"
          />
        </div>
      </div>
    </SectionModule>
  </SectionContainer>
</template>
