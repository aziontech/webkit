import type { Messages } from '../types'

export const ptBR: Messages = {
  actionConfirmation: {
    approve: 'Aprovar',
    deny: 'Negar',
    approved: 'Aprovado',
    denied: 'Negado',
    expired: 'Pedido expirado',
    confirmLabel: 'Digite {phrase} para confirmar'
  },
  aiLoading: {
    generating: 'Gerando uma resposta'
  },
  artifactCanvas: {
    close: 'Fechar {title}',
    copy: 'Copiar {title}',
    download: 'Baixar {title}',
    versions: 'Versões do artefato',
    content: 'Conteúdo de {title}',
    streaming: 'Gerando uma nova versão'
  },
  artifactPreview: {
    open: 'Abrir',
    openLabel: 'Abrir {title}',
    download: 'Baixar {title}',
    copy: 'Copiar {title}'
  },
  chatMessage: {
    user: 'Você',
    assistant: 'Assistente de IA',
    system: 'Sistema',
    labelWithTime: '{author} às {time}',
    actions: 'Ações da mensagem',
    error: 'Não foi possível gerar a resposta.',
    retry: 'Tentar novamente',
    helpful: 'Útil',
    notHelpful: 'Não foi útil',
    feedback: 'Avaliação da resposta',
    feedbackSubmitting: 'Enviando avaliação',
    feedbackSubmitted: 'Avaliação enviada'
  },
  citation: {
    label: 'Fonte {index}: {title}',
    labelUntitled: 'Fonte {index}'
  },
  conversation: {
    label: 'Conversa',
    scrollToLatest: 'Ir para a última mensagem',
    announcement: '{author}: {text}'
  },
  promptInput: {
    label: 'Prompt',
    placeholder: 'Faça uma pergunta',
    submit: 'Enviar',
    stop: 'Parar de gerar',
    count: '{count}/{max}',
    overLimit: '{count} caracteres acima do limite'
  },
  reasoning: {
    thinking: 'Pensando',
    thoughtBriefly: 'Pensou por alguns segundos',
    skip: 'Pular raciocínio',
    thought: {
      one: 'Pensou por {count} segundo',
      other: 'Pensou por {count} segundos'
    }
  },
  sources: {
    label: 'Fontes',
    count: {
      one: '{count} fonte',
      other: '{count} fontes'
    }
  },
  suggestionGroup: {
    label: 'Prompts sugeridos'
  },
  toolCall: {
    pending: 'Aguardando',
    running: 'Executando',
    success: 'Concluído',
    error: 'Falhou',
    denied: 'Negado',
    input: 'Entrada',
    output: 'Saída'
  },
  alert: {
    close: 'Fechar mensagem'
  },
  appLayout: {
    navigation: 'Navegação',
    tools: 'Ajuda',
    closeTools: 'Fechar ajuda',
    splitPanel: 'Detalhes',
    closeSplitPanel: 'Fechar painel',
    resizeSplitPanel: 'Redimensionar painel',
    showAtSide: 'Mostrar ao lado do conteúdo',
    showAtBottom: 'Mostrar abaixo do conteúdo'
  },
  articleIndex: {
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    empty: 'Nenhum resultado encontrado.'
  },
  attributeEditor: {
    add: 'Adicionar item',
    remove: 'Remover item',
    rowAction: '{label} {index}',
    addGroup: 'Adicionar grupo OU',
    empty: 'Nenhum item ainda.',
    remaining: {
      one: 'Você pode adicionar mais {count} item.',
      other: 'Você pode adicionar mais {count} itens.'
    },
    limitReached: 'Você atingiu o limite de {limit} itens.',
    added: 'Item {index} adicionado.',
    removed: 'Item {index} removido.',
    group: 'Grupo {index}',
    and: 'e',
    or: 'ou'
  },
  avatar: {
    fallbackLabel: 'Avatar do usuário',
    imageAlt: 'Avatar'
  },
  barList: {
    emptyTitle: 'Nenhum dado disponível'
  },
  board: {
    label: 'Painel',
    item: 'Item {position}',
    moved: '{label} movido para a posição {position} de {total}.',
    resized: '{label} redimensionado para {span} de {columns} colunas.',
    resizedWithHeight:
      '{label} redimensionado para {span} de {columns} colunas, {height} pixels de altura.'
  },
  breadcrumb: {
    label: 'Trilha de navegação',
    showHidden: 'Mostrar páginas intermediárias'
  },
  browserFrame: {
    preview: 'Pré-visualização',
    copyAddress: 'Copiar endereço',
    resizeWidth: 'Redimensionar largura da pré-visualização',
    resizeHeight: 'Redimensionar altura da pré-visualização',
    widthValue: '{value} pixels de largura',
    heightValue: '{value} pixels de altura'
  },
  buttonGroup: {
    moreActions: 'Mais ações',
    pressed: 'Ativado'
  },
  calendar: {
    placeholder: 'Selecione um período',
    period: 'Período',
    selectPeriod: 'Selecionar período',
    clear: 'Limpar seleção',
    open: 'Abrir calendário',
    chooseDate: 'Escolher data',
    apply: 'Aplicar período',
    presets: 'Atalhos',
    previousMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
    start: 'Início',
    end: 'Fim',
    date: 'Data',
    time: 'Hora',
    startTime: 'Hora de início',
    endTime: 'Hora de término',
    last3Days: 'Últimos 3 dias',
    lastWeek: 'Última semana',
    lastMonth: 'Último mês',
    lastQuarter: 'Último trimestre',
    lastYear: 'Último ano',
    relativeHints: 'Digite tempos relativos',
    fixedHints: 'Digite datas fixas',
    rangeSeparators: 'a|até',
    timezone: 'Fuso horário',
    localTimezone: 'Local'
  },
  card: {
    byVendor: 'por {vendor}',
    installed: 'Instalado'
  },
  cards: {
    label: 'Itens',
    selectAll: 'Selecionar todos os itens',
    emptyTitle: 'Nenhum item ainda',
    emptyDescription: 'Os itens que você criar aparecem aqui.'
  },
  carousel: {
    next: 'Próximo slide',
    previous: 'Slide anterior',
    roleDescription: 'carrossel'
  },
  chart: {
    emptyTitle: 'Nenhum dado disponível',
    noData: 'sem dados',
    label: 'Rótulo',
    roleDescription: 'gráfico',
    summary: '{series} séries em {points} pontos{range}.',
    summaryRange: ', de {from} a {to}',
    otherSeries: 'Outros',
    rangeDraft: 'Selecionando de {from} a {to}',
    rangeSelected: 'Selecionado de {from} a {to}'
  },
  chartCard: {
    resize: 'Redimensionar cartão',
    move: 'Mover cartão',
    columns: '{span} de {max} colunas',
    columnsAndHeight: '{columns}, {height} pixels de altura'
  },
  chip: {
    remove: 'Remover',
    removeNamed: 'Remover {label}'
  },
  codeBlock: {
    copy: 'Copiar código',
    output: 'Saída'
  },
  codeEditor: {
    label: 'Editor de código',
    original: 'Original',
    modified: 'Modificado',
    problems: 'Problemas',
    problemCount: {
      zero: 'Nenhum problema',
      one: '{count} problema',
      other: '{count} problemas'
    },
    line: 'Linha {line}',
    error: 'Erro',
    warning: 'Aviso',
    info: 'Informação',
    loading: 'Carregando o editor completo…',
    loadFailed: 'O editor completo não carregou. Você pode continuar editando aqui.',
    tabHint: 'Pressione Escape e depois Tab para sair do editor.'
  },
  collectionPreferences: {
    trigger: 'Preferências',
    title: 'Preferências',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    pageSize: 'Itens por página',
    pageSizeOption: {
      one: '{count} item',
      other: '{count} itens'
    },
    columns: 'Colunas',
    columnsDescription: 'Escolha quais colunas aparecem e em que ordem.',
    alwaysShown: 'Sempre visível',
    moveUp: 'Mover {column} para cima',
    moveDown: 'Mover {column} para baixo',
    display: 'Exibição',
    wrapLines: 'Quebrar linhas',
    wrapLinesDescription: 'Mostrar o texto completo de cada célula.',
    striped: 'Linhas alternadas',
    stripedDescription: 'Sombrear uma linha a cada duas.',
    density: 'Densidade',
    comfortable: 'Confortável',
    compact: 'Compacta'
  },
  combobox: {
    empty: 'Nenhum resultado',
    loading: 'Carregando opções',
    useValue: 'Usar "{value}"',
    clear: 'Limpar',
    suggestions: 'Sugestões',
    count: {
      one: '{count} opção',
      other: '{count} opções'
    }
  },
  command: {
    empty: 'Nenhum resultado encontrado.',
    placeholder: 'Buscar em tudo',
    title: 'Menu de comandos'
  },
  comparisonTable: {
    about: 'Sobre {capability}'
  },
  confirmDialog: {
    confirm: 'Confirmar',
    cancel: 'Cancelar'
  },
  consoleLayout: {
    navigation: 'Navegação principal',
    home: 'Página inicial da Azion',
    openNavigation: 'Abrir navegação',
    accountMenu: 'Menu da conta',
    searchPlaceholder: 'Buscar páginas e comandos',
    searchEmpty: 'Nenhuma página ou comando corresponde à busca.',
    pages: 'Páginas'
  },
  copyButton: {
    copy: 'Copiar',
    copied: 'Copiado'
  },
  responseBranches: {
    label: 'Versões da resposta',
    previous: 'Versão anterior',
    next: 'Próxima versão',
    position: '{current} de {total}'
  },
  feedbackReason: {
    title: 'O que deu errado?',
    description: 'Sua resposta ajuda a melhorar as próximas respostas.',
    reason: 'Motivo',
    details: 'Detalhes (opcional)',
    detailsPlaceholder: 'O que você esperava?',
    required: 'Escolha um motivo.',
    cancel: 'Cancelar',
    send: 'Enviar feedback',
    inaccurate: 'Incorreta ou inventada',
    notHelpful: 'Não ajudou',
    ignoredRequest: 'Não seguiu meu pedido',
    unsafe: 'Insegura ou nociva',
    other: 'Outro'
  },
  conversationHistory: {
    label: 'Histórico de conversas',
    today: 'Hoje',
    yesterday: 'Ontem',
    previous7: 'Últimos 7 dias',
    previous30: 'Últimos 30 dias',
    older: 'Mais antigas',
    empty: 'Nenhuma conversa ainda.',
    remove: 'Excluir {title}'
  },
  promptInputMenu: {
    results: {
      one: '{count} sugestão',
      other: '{count} sugestões'
    },
    noMatches: 'Nenhum resultado',
    references: 'Referências'
  },
  qrCode: {
    label: 'Código QR'
  },
  copyFallback: {
    title: 'Copie manualmente',
    field: 'Valor para copiar',
    hint: 'Pressione {keys} para copiar.'
  },
  dateRangePicker: {
    label: 'Intervalo de tempo',
    placeholder: 'Selecione um intervalo de tempo',
    dialog: 'Escolha um intervalo de tempo',
    rangeType: 'Tipo de intervalo',
    relative: 'Intervalo relativo',
    absolute: 'Intervalo absoluto',
    quickRanges: 'Intervalos rápidos',
    custom: 'Intervalo personalizado',
    amount: 'Duração',
    unit: 'Unidade',
    second: {
      one: 'Último segundo',
      other: 'Últimos {count} segundos'
    },
    minute: {
      one: 'Último minuto',
      other: 'Últimos {count} minutos'
    },
    hour: {
      one: 'Última hora',
      other: 'Últimas {count} horas'
    },
    day: {
      one: 'Último dia',
      other: 'Últimos {count} dias'
    },
    week: {
      one: 'Última semana',
      other: 'Últimas {count} semanas'
    },
    month: {
      one: 'Último mês',
      other: 'Últimos {count} meses'
    },
    year: {
      one: 'Último ano',
      other: 'Últimos {count} anos'
    },
    unitSecond: 'Segundos',
    unitMinute: 'Minutos',
    unitHour: 'Horas',
    unitDay: 'Dias',
    unitWeek: 'Semanas',
    unitMonth: 'Meses',
    unitYear: 'Anos',
    apply: 'Aplicar',
    cancel: 'Cancelar',
    previous: 'Intervalo anterior',
    next: 'Próximo intervalo',
    incomplete: 'Escolha um início e um fim.',
    order: 'O fim precisa ser depois do início.',
    outOfBounds: 'Escolha um intervalo dentro das datas permitidas.',
    invalidAmount: 'Informe um número inteiro maior que 0.'
  },
  dialog: {
    close: 'Fechar'
  },
  docFrame: {
    zoom: 'Ver imagem em tela cheia',
    zoomNamed: 'Ver em tela cheia: {alt}',
    fullScreen: 'Tela cheia',
    zoomedImage: 'Imagem em tela cheia',
    closeFullScreen: 'Fechar tela cheia',
    close: 'Fechar'
  },
  docLayout: {
    navigation: 'Documentação',
    sections: 'Seções da documentação',
    home: 'Página inicial da Azion Docs',
    badge: 'Docs',
    openNavigation: 'Abrir navegação da documentação',
    search: 'Buscar na documentação',
    searchEmpty: 'Nenhuma página corresponde à busca.',
    pages: 'Páginas',
    root: 'Docs'
  },
  docOnThisPage: {
    title: 'Nesta página'
  },
  docPageHeader: {
    lastUpdated: 'Atualizado em'
  },
  docPagination: {
    label: 'Navegação entre páginas',
    previous: 'Anterior',
    next: 'Próxima'
  },
  docPrompt: {
    showLess: 'Mostrar menos',
    showMore: 'Mostrar mais',
    copy: 'Copiar prompt',
    copied: 'Prompt copiado'
  },
  docProse: {
    copy: 'Copiar',
    copied: 'Copiado',
    copyManually: 'Pressione {shortcut} para copiar'
  },
  donutChart: {
    total: 'Total',
    emptyTitle: 'Nenhum dado disponível',
    summary: {
      one: '{count} fatia, {total} no total.',
      other: '{count} fatias, {total} no total.'
    },
    name: 'Nome',
    value: 'Valor',
    share: 'Participação',
    roleDescription: 'gráfico',
    otherSeries: 'Outros'
  },
  gaugeChart: {
    emptyTitle: 'Nenhum dado disponível',
    valueWithStatus: '{value}, {status}',
    range: 'Intervalo de {min} a {max}'
  },
  mapChart: {
    emptyTitle: 'Nenhum dado disponível',
    roleDescription: 'mapa',
    name: 'Nome',
    value: 'Valor',
    summary: {
      one: '{count} local no mapa, {total} no total.',
      other: '{count} locais no mapa, {total} no total.'
    },
    legend: 'De {min} a {max}'
  },
  drawer: {
    close: 'Fechar'
  },
  errorBoundary: {
    title: 'Não foi possível carregar esta seção',
    description:
      'Algo deu errado ao exibir esta parte da página. O restante da página continua funcionando.',
    retry: 'Tentar novamente'
  },
  field: {
    required: '(Obrigatório)'
  },
  fileDropzone: {
    title: 'Solte arquivos para enviar'
  },
  fileTokenGroup: {
    label: 'Arquivos',
    remove: 'Remover {name}',
    uploading: 'Enviando {name}',
    modified: 'Modificado em {date}',
    showMore: {
      one: 'Mostrar mais {count} arquivo',
      other: 'Mostrar mais {count} arquivos'
    },
    showFewer: 'Mostrar menos arquivos'
  },
  uploadProgress: {
    label: 'Transferências de arquivos',
    uploading: {
      one: 'Enviando {done} de {count} arquivo',
      other: 'Enviando {done} de {count} arquivos'
    },
    moving: {
      one: 'Movendo {done} de {count} arquivo',
      other: 'Movendo {done} de {count} arquivos'
    },
    deleting: {
      one: 'Excluindo {done} de {count} arquivo',
      other: 'Excluindo {done} de {count} arquivos'
    },
    uploaded: {
      one: '{count} arquivo enviado',
      other: '{count} arquivos enviados'
    },
    moved: {
      one: '{count} arquivo movido',
      other: '{count} arquivos movidos'
    },
    deleted: {
      one: '{count} arquivo excluído',
      other: '{count} arquivos excluídos'
    },
    failed: {
      one: '{count} falhou',
      other: '{count} falharam'
    },
    queued: 'Na fila',
    done: 'Concluído',
    canceled: 'Cancelado',
    cancelAll: 'Cancelar tudo',
    cancelItem: 'Cancelar {name}',
    retryItem: 'Tentar {name} de novo',
    retryFailed: 'Tentar os que falharam',
    close: 'Fechar',
    expand: 'Mostrar arquivos',
    collapse: 'Ocultar arquivos',
    itemProgress: 'Progresso de {name}'
  },
  footer: {
    label: 'Rodapé'
  },
  globalHeader: {
    label: 'Cabeçalho global'
  },
  helpPanel: {
    label: 'Ajuda',
    learnMore: 'Saiba mais',
    taskComplete: 'Concluída',
    taskCurrent: 'Tarefa atual',
    taskNotStarted: 'Não iniciada',
    tutorialCompleted: 'Concluído',
    tutorialProgress: '{complete} de {total} concluídas'
  },
  heroForm: {
    search: 'Buscar',
    empty: 'Nenhum resultado encontrado.'
  },
  hotspot: {
    label: 'Etapa do tutorial: {title}',
    stepOf: 'Etapa {current} de {total}',
    previous: 'Anterior',
    next: 'Próxima',
    finish: 'Concluir'
  },
  keyValuePairs: {
    notSet: 'Não definido'
  },
  kbd: {
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
    escape: 'Esc',
    enter: 'Enter',
    space: 'Espaço',
    tab: 'Tab',
    backspace: 'Backspace',
    delete: 'Del'
  },
  label: {
    required: '(Obrigatório)'
  },
  link: {
    label: 'Saiba mais'
  },
  logView: {
    searchPlaceholder: 'Buscar nos logs',
    search: 'Buscar logs',
    loading: 'Carregando…',
    lines: { one: '{count} linha', other: '{count} linhas' },
    warnings: 'Avisos',
    warningCount: { one: '{count} aviso', other: '{count} avisos' },
    gzip: 'gzip:',
    empty: 'Nenhuma linha de log corresponde aos filtros atuais.',
    copy: 'Copiar logs',
    copied: 'Logs copiados'
  },
  logoWall: {
    link: 'Ler história'
  },
  menu: {
    label: 'Menu',
    back: 'Voltar',
    backTo: 'Voltar para {label}',
    open: 'Abrir submenu',
    openNamed: 'Abrir menu {label}',
    collapse: 'Recolher',
    collapseNamed: 'Recolher {label}',
    expand: 'Expandir',
    expandNamed: 'Expandir {label}'
  },
  miniButton: {
    label: 'Saiba mais'
  },
  navigationMenu: {
    label: 'Principal'
  },
  numberInput: {
    increment: 'Aumentar',
    decrement: 'Diminuir'
  },
  outcomeMark: {
    success: 'Concluído',
    danger: 'Falhou',
    warning: 'Requer atenção',
    neutral: 'Não definido'
  },
  overflowCount: {
    noun: {
      one: 'item',
      other: 'itens'
    },
    summary: '{count} {noun}',
    paged: '{shown} de {count} {noun}',
    showAll: 'Ver lista completa: {count} {noun}',
    search: 'Buscar',
    noMatch: 'Nada corresponde a “{query}”',
    loadMore: 'Carregar mais {count}',
    newTab: '(abre em uma nova aba)'
  },
  pagination: {
    label: 'Paginação',
    info: 'Mostrando {start} a {end} de {total} registros',
    previous: 'Página anterior',
    next: 'Próxima página',
    pageSize: 'Linhas por página'
  },
  passwordInput: {
    hide: 'Ocultar senha',
    show: 'Mostrar senha'
  },
  passwordRequirements: {
    title: 'Deve conter:',
    length: '8 a 128 caracteres',
    uppercase: 'Letra maiúscula',
    special: 'Caractere especial',
    number: 'Número',
    lowercase: 'Letra minúscula',
    met: 'atendido',
    unmet: 'não atendido'
  },
  phoneInput: {
    dialCode: 'Código de discagem do país',
    search: 'Buscar país',
    empty: 'Nenhum país encontrado.'
  },
  pickList: {
    moveSelectedToTarget: 'Mover selecionados para o destino',
    moveAllToTarget: 'Mover todos para o destino',
    moveSelectedToSource: 'Mover selecionados para a origem',
    moveAllToSource: 'Mover todos para a origem'
  },
  popover: {
    close: 'Fechar'
  },
  progress: {
    label: 'Progresso'
  },
  propertyFilterQuery: {
    label: 'Consulta',
    placeholder: 'Digite uma consulta, por exemplo status = Active AND requests > 10',
    fields: 'Campos',
    all: 'Todas as condições valem',
    any: 'Qualquer condição vale',
    unknownField: 'Não há campo chamado “{field}”.',
    unknownOperator: '“{operator}” não se aplica a {field}.',
    missingOperator: 'Adicione um operador depois de {field}, por exemplo =.',
    missingValue: 'Adicione um valor depois de {operator}.',
    expectedConnective: 'Junte as condições com AND ou OR antes de “{word}”.',
    danglingConnective: 'Adicione uma condição depois de {connective}.',
    unclosedQuote: 'Feche as aspas abertas no caractere {position}.'
  },
  propertyFilter: {
    label: 'Filtrar',
    placeholder: 'Filtrar por propriedade ou texto',
    suggestions: 'Sugestões',
    useText: 'Usar: “{text}”',
    properties: 'Propriedades',
    operators: 'Operadores',
    values: 'Valores',
    tokens: 'Filtros aplicados',
    operation: 'Combinar filtros',
    matchAll: 'Todos',
    matchAny: 'Qualquer um',
    and: 'e',
    or: 'ou',
    clear: 'Limpar filtros',
    removeToken: 'Remover filtro {token}',
    matches: {
      one: '{count} resultado',
      other: '{count} resultados'
    },
    equals: 'Igual a',
    notEquals: 'Diferente de',
    contains: 'Contém',
    notContains: 'Não contém',
    startsWith: 'Começa com',
    notStartsWith: 'Não começa com',
    greater: 'Maior que',
    less: 'Menor que',
    greaterOrEqual: 'Maior ou igual a',
    lessOrEqual: 'Menor ou igual a'
  },
  resizable: {
    handle: 'Redimensionar painel'
  },
  schemaForm: {
    required: 'Este campo é obrigatório.',
    minLength: 'Use pelo menos {min} caracteres.',
    maxLength: 'Use no máximo {max} caracteres.',
    pattern: 'Este valor não segue o formato esperado.',
    minimum: 'Informe {min} ou mais.',
    maximum: 'Informe {max} ou menos.',
    number: 'Informe um número.',
    integer: 'Informe um número inteiro.',
    enum: 'Escolha uma das opções.',
    minItems: 'Adicione pelo menos {min} valores.',
    maxItems: 'Adicione no máximo {max} valores.',
    listItem: 'Linha {line}: {message}',
    json: 'Informe um JSON válido.',
    selectPlaceholder: 'Selecione uma opção',
    numberPlaceholder: 'Um número',
    numberFrom: 'A partir de {min}',
    listPlaceholder: 'Um valor por linha',
    jsonPlaceholder: 'Um valor JSON'
  },
  sectionHeader: {
    copyLink: 'Copiar link da seção {title}',
    linkCopied: 'Link copiado'
  },
  settingsSection: {
    copyLink: 'Copiar link da seção {title}',
    linkCopied: 'Link copiado'
  },
  severityTag: {
    critical: 'Crítica',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
    info: 'Informativa'
  },
  sidebar: {
    label: 'Barra lateral',
    collapse: 'Recolher barra lateral',
    expand: 'Expandir barra lateral',
    resize: 'Redimensionar barra lateral',
    expandByDragging: '{label} arrastando'
  },
  siteFooter: {
    label: 'Rodapé',
    home: 'Página inicial da Azion',
    language: 'Idioma',
    newTab: '(abre em uma nova aba)'
  },
  siteLayout: {
    searchPlaceholder: 'Buscar no site',
    searchEmpty: 'Nenhuma página corresponde à busca.',
    pages: 'Páginas'
  },
  siteNav: {
    open: 'Abrir navegação',
    home: 'Página inicial da Azion',
    search: 'Buscar',
    menu: 'Menu'
  },
  splitButton: {
    moreActions: 'Mais ações',
    moreActionsFor: 'Mais ações para {label}'
  },
  statTile: {
    noValue: 'Sem valor',
    noData: 'Sem dados',
    better: 'melhor',
    worse: 'pior',
    unchanged: 'sem alteração'
  },
  statusIndicator: {
    label: 'Status'
  },
  stepper: {
    label: 'Etapas',
    error: 'Requer atenção',
    loading: 'Em andamento',
    current: 'Etapa atual',
    complete: 'Concluída',
    upcoming: 'Não iniciada'
  },
  storyLibrary: {
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    empty: 'Nenhum resultado encontrado.'
  },
  table: {
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar linha',
    emptyTitle: 'Nenhum resultado ainda',
    emptyDescription: 'Comece criando seu primeiro recurso.'
  },
  tableAppliedFilters: {
    contains: 'contém',
    notContains: 'não contém',
    startsWith: 'começa com',
    endsWith: 'termina com',
    in: 'em',
    notIn: 'não está em',
    isEmpty: 'está vazio',
    isNotEmpty: 'não está vazio'
  },
  tableColumnSelector: {
    title: 'Colunas',
    empty: 'Nenhuma coluna pode ser ocultada.'
  },
  tableExport: {
    label: 'Exportar CSV'
  },
  tableFilter: {
    title: 'Filtros',
    field: 'Campo',
    operator: 'Operador',
    value: 'Valor',
    apply: 'Aplicar filtro',
    eq: 'é',
    neq: 'não é',
    contains: 'contém',
    notContains: 'não contém',
    startsWith: 'começa com',
    endsWith: 'termina com',
    gt: 'maior que',
    gte: 'no mínimo',
    lt: 'menor que',
    lte: 'no máximo',
    in: 'em',
    notIn: 'não está em',
    isEmpty: 'está vazio',
    isNotEmpty: 'não está vazio'
  },
  tableHeadCell: {
    resize: 'Redimensionar coluna'
  },
  tableRefreshButton: {
    label: 'Atualizar'
  },
  tableCellActions: {
    label: 'Ações da linha',
    labelFor: 'Ações de {name}'
  },
  tableCellId: {
    copy: 'Copiar ID',
    copyResource: 'Copiar ID de {resource}'
  },
  tableCellLink: {
    open: 'Abrir {label}',
    openIn: 'Abrir {label} em {destination}',
    newTab: 'Abrir {label} em uma nova aba',
    newTabHint: '(abre em uma nova aba)',
    copy: 'Copiar {label}'
  },
  tableCellTags: {
    noun: {
      one: 'tag',
      other: 'tags'
    }
  },
  tableCellTime: {
    justNow: 'agora mesmo'
  },
  tableReorder: {
    column: 'Ordem',
    handle: 'Reordenar {name}, posição {position} de {total}',
    hint: 'Arraste, ou pressione Seta para cima ou Seta para baixo para mover.',
    locked: 'Remova a ordenação para reordenar as linhas.',
    moved: '{name} movido para a posição {position} de {total}.',
    dropped: '{name} solto na posição {position} de {total}.',
    cancelled: 'Reordenação cancelada.'
  },
  tableSearch: {
    placeholder: 'Buscar'
  },
  tableSortButton: {
    ascending: 'Ordenado em ordem crescente',
    descending: 'Ordenado em ordem decrescente',
    unsorted: 'Ordenar coluna'
  },
  tabs: {
    close: 'Fechar aba',
    unsaved: 'Alterações não salvas'
  },
  tagEditor: {
    label: 'Tags',
    key: 'Chave',
    value: 'Valor',
    keyPlaceholder: 'Digite a chave',
    valuePlaceholder: 'Digite o valor',
    add: 'Adicionar tag',
    remove: 'Remover tag',
    undo: 'Desfazer',
    undoLabel: 'Desfazer a remoção da tag {index}',
    markedForRemoval: 'Esta tag será removida quando você salvar.',
    empty: 'Nenhuma tag associada ao recurso.',
    remaining: {
      one: 'Você pode adicionar mais {count} tag.',
      other: 'Você pode adicionar mais {count} tags.'
    },
    limitReached: 'Você atingiu o limite de {limit} tags.',
    keyRequired: 'Digite uma chave.',
    keyDuplicate: 'Esta chave já é usada por outra tag.',
    keyReserved: 'As chaves não podem começar com "{prefix}".',
    keyInvalid: 'Use apenas letras, números, espaços e + - = . _ : / @.',
    tooLong: 'Use até {max} caracteres.'
  },
  themeSwitcher: {
    label: 'Tema',
    system: 'Sistema',
    dark: 'Escuro',
    light: 'Claro'
  },
  toast: {
    close: 'Fechar notificação'
  },
  toggleGroup: {
    option: 'Opção {index}'
  },
  trace: {
    label: 'Rastreamento',
    search: 'Buscar spans',
    noMatch: 'Nenhum span corresponde a “{query}”.',
    clearSearch: 'Limpar busca',
    empty: 'Nenhum span neste rastreamento.',
    details: 'Detalhes de {name}',
    close: 'Fechar',
    copyName: 'Copiar nome do span',
    service: 'Serviço',
    startedAt: 'Início',
    duration: 'Duração',
    share: 'Parcela do rastreamento',
    percent: '{value}%',
    failed: 'Falhou',
    running: 'Em execução',
    attributes: 'Atributos',
    milliseconds: '{value} ms',
    seconds: '{value} s'
  },
  topologyDiagram: {
    label: 'Topologia de implantação',
    notBound: 'Não vinculado',
    bind: 'Vincular {kind}',
    change: 'Trocar {kind}',
    remove: 'Remover {kind}',
    create: 'Criar {kind}',
    existing: 'Existentes',
    noOptions: 'Nenhuma opção ainda.',
    copy: 'Copiar {field}',
    empty: 'Nada conectado ainda.',
    loading: 'Carregando a topologia'
  },
  tracker: {
    noData: 'Sem dados',
    roleDescription: 'histórico de status'
  },
  tree: {
    emptyTitle: 'Nenhum item'
  },
  unsavedChanges: {
    title: 'Alterações não salvas',
    description:
      'Esta página tem alterações que você não salvou. Se sair agora, elas serão descartadas.',
    descriptionSavable:
      'Esta página tem alterações que ainda não foram salvas. Salve-as antes de sair ou descarte-as e continue.',
    keepEditing: 'Continuar editando',
    discard: 'Descartar alterações',
    save: 'Salvar alterações'
  },
  tutorialPanel: {
    title: 'Tutoriais',
    description: 'Aprenda o produto fazendo uma tarefa real, uma etapa por vez.',
    listLabel: 'Tutoriais disponíveis',
    empty: 'Nenhum tutorial ainda.',
    start: 'Iniciar tutorial',
    restart: 'Reiniciar tutorial',
    exit: 'Sair do tutorial',
    back: 'Voltar aos tutoriais',
    completed: 'Concluído',
    completedTitle: 'Tutorial concluído',
    completedDescription: 'Você concluiu {title}.',
    taskCount: { one: '{count} tarefa', other: '{count} tarefas' },
    stepCount: { one: '{count} etapa', other: '{count} etapas' }
  },
  wizard: {
    stepOf: 'Etapa {step} de {total}',
    optional: 'Opcional',
    cancel: 'Cancelar',
    previous: 'Anterior',
    next: 'Próximo',
    submit: 'Criar'
  },
  paymentBrand: {
    unknown: 'Cartão'
  },
  otpInput: {
    label: 'Código de uso único'
  },
  consolePanel: {
    views: 'Visões do console'
  },
  customerSpotlight: {
    list: 'Histórias de clientes',
    story: 'Ler a história'
  },
  sectionCommand: {
    command: 'Comando',
    prompt: 'Prompt',
    copyCommand: 'Copiar comando',
    copyPrompt: 'Copiar prompt'
  },
  searchTrigger: {
    label: 'Buscar'
  },
  copyPromptButton: {
    label: 'Copiar prompt',
    copied: 'Copiado',
    worksWith: 'Funciona com {agents}'
  },
  docAgentCard: {
    title: 'Seu agente de IA, fluente em Azion',
    description:
      'Um prompt ensina a plataforma a qualquer agente de código: os nomes atuais dos produtos, a documentação ao vivo pelo servidor MCP da Azion e deploys reais com a CLI.',
    asideTitle: 'Prefere o caminho guiado?',
    action: 'Configurar agente'
  }
}
