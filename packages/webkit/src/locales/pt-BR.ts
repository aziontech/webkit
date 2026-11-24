import type { Messages } from '../i18n/types'

export const ptBR: Messages = {
  toolApproval: {
    approve: 'Aprovar',
    deny: 'Negar',
    approved: 'Aprovado',
    denied: 'Negado',
    expired: 'Pedido expirado',
    confirmLabel: 'Digite {phrase} para confirmar',
    arguments: 'Argumentos',
    invalidArguments: 'Estes argumentos não são válidos. Corrija-os para aprovar.',
    phraseMismatch: 'O texto não corresponde a {phrase}. Digite exatamente para confirmar.'
  },
  agentQuestion: {
    submit: 'Enviar',
    yes: 'Sim',
    no: 'Não',
    skip: 'Pular',
    answered: 'Respondida: {answer}',
    answeredWithoutValue: 'Respondida',
    skipped: 'Pulada',
    canceled: 'Pergunta cancelada',
    error: 'Não foi possível enviar a resposta. Tente de novo.'
  },
  responseLoading: {
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
  mcpAppFrame: {
    loading: 'Carregando {title}',
    errorTitle: 'Não é possível exibir {title}',
    errorDescription: 'O app foi bloqueado ou não pôde ser carregado aqui.'
  },
  chatMessage: {
    user: 'Você',
    assistant: 'Assistente de IA',
    system: 'Sistema',
    labelWithTime: '{author} às {time}',
    actions: 'Ações da mensagem',
    error: 'Não foi possível gerar a resposta.',
    retry: 'Tentar novamente',
    goodResponse: 'Boa resposta',
    badResponse: 'Resposta ruim',
    feedback: 'Avaliação da resposta',
    feedbackSubmitting: 'Enviando avaliação',
    feedbackThanks: 'Obrigado pela sua avaliação',
    readAloud: 'Ler em voz alta',
    stopReading: 'Parar a leitura',
    share: 'Compartilhar',
    more: 'Mais ações',
    branch: 'Ramificar em novo chat',
    edit: 'Editar mensagem',
    editField: 'Edite sua mensagem',
    cancel: 'Cancelar',
    send: 'Enviar'
  },
  citation: {
    label: 'Fonte {index}: {title}',
    labelUntitled: 'Fonte {index}',
    labelWithSite: 'Fonte {index}, {site}: {title}',
    labelMany: '{site} +{more}, fontes {indexes}',
    next: 'Próxima fonte',
    page: '{current}/{total}',
    previous: 'Fonte anterior'
  },
  conversation: {
    label: 'Conversa',
    scrollToLatest: 'Ir para a última mensagem',
    announcement: '{author}: {text}',
    loadMore: 'Carregar mensagens anteriores',
    loadingMore: 'Carregando mensagens anteriores',
    moreLoaded: 'Mensagens anteriores carregadas'
  },
  promptInput: {
    label: 'Prompt',
    placeholder: 'Faça uma pergunta',
    submit: 'Enviar',
    stop: 'Parar de gerar',
    count: '{count}/{max}',
    overLimit: '{count} caracteres acima do limite',
    menuResults: {
      one: '{count} sugestão',
      other: '{count} sugestões'
    },
    noMatch: 'Nenhum resultado',
    menuReferences: 'Referências',
    voice: 'Iniciar conversa por voz',
    attach: 'Anexar arquivos',
    drop: 'Solte os arquivos para anexar',
    rejectedAccept: {
      one: '{count} arquivo não adicionado: tipo não aceito',
      other: '{count} arquivos não adicionados: tipo não aceito'
    },
    rejectedSize: {
      one: '{count} arquivo não adicionado: maior que {size}',
      other: '{count} arquivos não adicionados: maiores que {size}'
    },
    rejectedCount: {
      one: '{count} arquivo não adicionado: até {max} arquivos',
      other: '{count} arquivos não adicionados: até {max} arquivos'
    },
    dictate: 'Ditar',
    dictateStop: 'Parar o ditado',
    listening: 'Ouvindo',
    dictationEnded: 'Ditado encerrado',
    dictationBlocked: 'O acesso ao microfone está bloqueado',
    dictationFailed: 'O ditado parou. Tente de novo',
    model: 'Modelo',
    mode: 'Modo',
    context: 'Escolher contexto',
    contextRemove: 'Remover contexto',
    tools: 'Ferramentas',
    toolsEnabled: 'Ferramentas ativadas',
    addMenu: 'Adicionar',
    camera: 'Câmera',
    photos: 'Fotos',
    files: 'Arquivos'
  },
  agentActivity: {
    label: 'Atividade do agente',
    steps: {
      one: '{count} etapa',
      other: '{count} etapas'
    },
    finished: {
      one: '{count} etapa concluída',
      other: '{count} etapas concluídas'
    },
    stopped: {
      one: 'Interrompida após {count} etapa',
      other: 'Interrompida após {count} etapas'
    },
    failed: 'Falhou: {title}',
    pending: 'Pendente',
    running: 'Em andamento',
    success: 'Concluída',
    error: 'Falhou',
    canceled: 'Cancelada',
    skipped: 'Ignorada'
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
    cited: 'Citações',
    more: 'Mais',
    count: {
      one: '{count} fonte',
      other: '{count} fontes'
    }
  },
  promptQueue: {
    label: 'Mensagens na fila',
    title: {
      one: '{count} mensagem na fila',
      other: '{count} mensagens na fila'
    },
    empty: 'Nenhuma mensagem na fila',
    remove: 'Remover da fila',
    attachments: {
      one: '{count} anexo',
      other: '{count} anexos'
    }
  },
  suggestionGroup: {
    label: 'Prompts sugeridos'
  },
  toolCall: {
    pending: 'Aguardando',
    streaming: 'Preparando',
    running: 'Executando',
    success: 'Concluído',
    error: 'Falhou',
    canceled: 'Cancelado',
    denied: 'Negado',
    input: 'Entrada',
    output: 'Saída'
  },
  subagentCard: {
    pending: 'Aguardando',
    running: 'Executando',
    success: 'Concluído',
    error: 'Falhou',
    canceled: 'Interrompido',
    stop: 'Parar',
    stopAgent: 'Parar {name}',
    input: 'Tarefa',
    activity: 'Atividade'
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
  articleBodySection: {
    linkCopied: 'Link copiado',
    copiedFeed: 'Link do feed copiado',
    copiedPage: 'Página copiada como markdown',
    copyFailed: 'Não foi possível copiar',
    copyFailedHint: 'Seu navegador bloqueou o acesso à área de transferência.',
    assistantPrompt: 'Leia {url} para que eu possa fazer perguntas sobre ele.'
  },
  articleIndexSection: {
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    noMatch: 'Nenhum resultado encontrado.',
    results: {
      one: '{count} resultado',
      other: '{count} resultados'
    }
  },
  attributeEditor: {
    add: 'Adicionar item',
    remove: 'Remover item',
    rowAction: '{label} {index}',
    addGroup: 'Adicionar grupo OU',
    emptyTitle: 'Nenhum item ainda.',
    remaining: {
      one: 'Você pode adicionar mais {count} item.',
      other: 'Você pode adicionar mais {count} itens.'
    },
    limitReached: 'Você atingiu o limite de {limit} itens.',
    added: 'Item {index} adicionado.',
    removed: 'Item {index} removido.',
    group: 'Grupo {index}',
    and: 'e',
    or: 'ou',
    reorder: 'Reordenar item {index}',
    reorderHint: 'Arraste ou pressione Seta para cima ou Seta para baixo para mover.',
    moveUp: 'Mover item {index} para cima',
    moveDown: 'Mover item {index} para baixo',
    moved: 'Item {from} movido para a posição {to}.',
    reorderGroup: 'Reordenar grupo {index}',
    moveGroupUp: 'Mover grupo {index} para cima',
    moveGroupDown: 'Mover grupo {index} para baixo',
    groupMoved: 'Grupo {from} movido para a posição {to}.'
  },
  avatar: {
    fallbackLabel: 'Avatar do usuário',
    imageAlt: 'Avatar',
    presenceOnline: 'online',
    presenceAway: 'ausente',
    presenceBusy: 'ocupado',
    presenceOffline: 'offline',
    withPresence: '{name}, {presence}'
  },
  avatarGroup: {
    people: {
      one: '{count} pessoa',
      other: '{count} pessoas'
    },
    more: {
      one: 'mais {count} pessoa',
      other: 'mais {count} pessoas'
    }
  },
  barList: {
    emptyTitle: 'Nenhum dado disponível',
    errorTitle: 'Não foi possível carregar os dados'
  },
  dashboardGrid: {
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
  integrationCard: {
    byVendor: 'por {vendor}',
    installed: 'Instalado'
  },
  cardList: {
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
    rangeSelected: 'Selecionado de {from} a {to}',
    total: 'Total',
    reference: 'Referência',
    referenceLine: '{label} em {value}.',
    referenceBand: '{label} de {from} a {to}.'
  },
  chartCard: {
    resize: 'Redimensionar cartão',
    move: 'Mover cartão',
    moveVerb: 'Mover',
    moveHint: 'Use as setas para mover o cartão.',
    moved: 'Movido para a posição {position} de {total}',
    columns: '{span} de {max} colunas',
    columnsAndHeight: '{columns}, {height} pixels de altura'
  },
  chip: {
    remove: 'Remover',
    removeNamed: 'Remover {label}'
  },
  codeBlock: {
    copy: 'Copiar código',
    output: 'Saída',
    added: 'Adicionada',
    removed: 'Removida',
    original: 'Original',
    modified: 'Modificado'
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
    noMatch: 'Nenhum resultado',
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
    back: 'Voltar de {page}',
    noMatch: 'Nenhum resultado encontrado.',
    placeholder: 'Buscar em tudo',
    title: 'Menu de comandos'
  },
  planComparisonSection: {
    about: 'Sobre {label}',
    search: 'Buscar',
    searchPicker: 'Buscar {picker}',
    noMatch: 'Nenhum resultado encontrado.',
    included: 'Incluído',
    excluded: 'Não incluído'
  },
  competitorComparisonSection: {
    about: 'Sobre {capability}'
  },
  confirmDialog: {
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    typeToConfirm: 'Digite {phrase} para confirmar.'
  },
  consoleLayout: {
    navigation: 'Navegação principal',
    home: 'Página inicial da Azion',
    openNavigation: 'Abrir navegação',
    accountMenu: 'Menu da conta',
    accountMenuFor: '{initials}, {name}, menu da conta',
    searchPlaceholder: 'Buscar páginas e comandos',
    noMatch: 'Nenhuma página ou comando corresponde à busca.',
    pages: 'Páginas',
    searchShortcut: 'Buscar páginas e comandos'
  },
  copyButton: {
    fallbackTitle: 'Copie manualmente',
    fallbackField: 'Valor para copiar',
    fallbackHint: 'Pressione {keys} para copiar.'
  },
  copyText: {
    copy: 'Copiar {value}'
  },
  responseBranches: {
    label: 'Versões da resposta',
    previous: 'Versão anterior',
    next: 'Próxima versão',
    position: '{current}/{total}',
    positionLabel: 'Versão {current} de {total}'
  },
  feedbackReasonDialog: {
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
    emptyTitle: 'Nenhuma conversa ainda.',
    delete: 'Excluir {title}',
    newChat: 'Novo chat',
    search: 'Buscar conversas',
    noMatch: 'Nenhuma conversa corresponde a “{query}”.'
  },
  qrCode: {
    label: 'Código QR'
  },
  datePicker: {
    placeholder: 'Selecione uma data',
    clear: 'Limpar seleção',
    open: 'Abrir calendário',
    chooseDate: 'Escolher data',
    apply: 'Aplicar',
    cancel: 'Cancelar',
    previousMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
    month: 'Mês',
    year: 'Ano',
    start: 'Início',
    end: 'Fim',
    date: 'Data',
    time: 'Hora',
    startTime: 'Hora de início',
    endTime: 'Hora de término',
    timezone: 'Fuso horário',
    localTimezone: 'Local',
    example: 'ex.: {value}',
    timePlaceholder: 'hh:mm'
  },
  dateRangePicker: {
    label: 'Intervalo de tempo',
    placeholder: 'Selecione um intervalo de tempo',
    dialog: 'Escolha um intervalo de tempo',
    rangeType: 'Tipo de intervalo',
    relative: 'Relativo',
    absolute: 'Absoluto',
    quickRanges: 'Intervalos rápidos',
    custom: 'Intervalo personalizado',
    showQuickRanges: 'Voltar aos intervalos rápidos',
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
    today: 'Hoje',
    thisWeek: 'Esta semana',
    thisMonth: 'Este mês',
    thisYear: 'Este ano',
    now: 'agora',
    untilNow: 'Terminar agora',
    enterDates: 'Digitar datas',
    showCalendar: 'Mostrar calendário',
    refreshEvery: 'Atualizar a cada',
    refreshOff: 'Desligado',
    refreshSecond: {
      one: 'atualiza a cada segundo',
      other: 'atualiza a cada {count} segundos'
    },
    refreshMinute: {
      one: 'atualiza a cada minuto',
      other: 'atualiza a cada {count} minutos'
    },
    refreshHour: {
      one: 'atualiza a cada hora',
      other: 'atualiza a cada {count} horas'
    },
    apply: 'Aplicar',
    cancel: 'Cancelar',
    previous: 'Intervalo anterior',
    next: 'Próximo intervalo',
    incomplete: 'Escolha um início e um fim.',
    order: 'O fim precisa ser depois do início.',
    outOfBounds: 'Escolha um intervalo dentro das datas permitidas.',
    tooLong: 'Escolha um intervalo de até {duration}.',
    invalidAmount: 'Informe um número inteiro maior que 0.'
  },
  dialog: {
    close: 'Fechar'
  },
  docFrame: {
    zoom: 'Ver imagem em tela cheia',
    zoomNamed: 'Ver em tela cheia: {alt}',
    pauseNamed: 'Pausar animação: {alt}',
    playNamed: 'Reproduzir animação: {alt}',
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
    noMatch: 'Nenhuma página corresponde à busca.',
    pages: 'Páginas',
    root: 'Docs',
    collapseNavigation: 'Recolher navegação',
    expandNavigation: 'Expandir navegação',
    resizeNavigation: 'Redimensionar navegação'
  },
  docTableOfContents: {
    title: 'Nesta página'
  },
  docPageHeader: {
    lastUpdated: 'Atualizado em'
  },
  docPreviousNext: {
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
    required: 'Obrigatório'
  },
  fileDropzone: {
    title: 'Solte arquivos para enviar',
    touchTitle: 'Escolha arquivos para enviar'
  },
  audioPlayer: {
    label: 'Player de áudio',
    play: 'Reproduzir',
    pause: 'Pausar',
    seek: 'Buscar posição',
    position: '{current} de {total}',
    mute: 'Silenciar',
    unmute: 'Ativar som',
    volume: 'Volume',
    rate: '{rate}×',
    speed: 'Velocidade de reprodução {rate}',
    download: 'Baixar áudio',
    downloadTitle: 'Baixar {title}',
    loading: 'Carregando áudio',
    error: 'Não foi possível reproduzir o áudio.',
    transcript: 'Transcrição'
  },
  filePreview: {
    download: 'Baixar',
    loading: 'Carregando pré-visualização',
    contents: 'Conteúdo de {name}',
    noPreview: 'Sem pré-visualização para este tipo de arquivo',
    noPreviewDetail: 'Baixe o arquivo para abri-lo.',
    error: 'Não foi possível carregar a pré-visualização',
    empty: 'Este arquivo está vazio.',
    document: 'Pré-visualização de {name}',
    truncated: 'Mostrando os primeiros {shown} caracteres. Baixe o arquivo para ver tudo.'
  },
  imageGallery: {
    label: 'Imagens',
    image: 'Imagem {position} de {total}',
    position: '{position} de {total}',
    previous: 'Imagem anterior',
    next: 'Próxima imagem',
    download: 'Baixar',
    loading: 'Gerando imagens',
    ready: 'Imagens prontas',
    error: 'Não foi possível carregar as imagens',
    broken: 'Não foi possível carregar esta imagem',
    empty: 'Nenhuma imagem'
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
    showLess: 'Mostrar menos arquivos'
  },
  filterMenu: {
    label: 'Filtrar',
    triggerCount: { one: '{label}, {count} aplicado', other: '{label}, {count} aplicados' },
    searchFields: 'Filtrar por…',
    searchFieldsLabel: 'Buscar campos de filtro',
    searchValues: 'Filtrar {field}…',
    searchValuesLabel: 'Buscar valores de {field}',
    back: 'Voltar para todos os filtros',
    backToPeriods: 'Voltar para os períodos',
    noMatch: 'Nenhum resultado para “{query}”.',
    clear: 'Limpar {field}',
    last24Hours: 'Últimas 24 horas',
    last7Days: 'Últimos 7 dias',
    last30Days: 'Últimos 30 dias',
    last3Months: 'Últimos 3 meses',
    customRange: 'Período personalizado…',
    pickRange: 'Escolha um período',
    rangeBetween: '{start} – {end}',
    rangeSince: 'Desde {date}',
    rangeUntil: 'Até {date}',
    more: '+{count}',
    moreValues: {
      one: 'Mais {count} valor. Digite para filtrar a lista.',
      other: 'Mais {count} valores. Digite para filtrar a lista.'
    },
    applied: 'Filtros aplicados'
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
    label: 'Rodapé',
    home: 'Página inicial da Azion'
  },
  appHeader: {
    label: 'Cabeçalho global',
    home: 'Página inicial da Azion',
    productHome: 'Página inicial da Azion {product}',
    account: 'Menu da conta'
  },
  helpPanel: {
    label: 'Ajuda',
    learnMore: 'Saiba mais'
  },
  heroSection: {
    carouselLabel: 'Comprovada em cargas de trabalho críticas'
  },
  heroFormSection: {
    search: 'Buscar',
    noMatch: 'Nenhum resultado encontrado.'
  },
  keyValueList: {
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
    delete: 'Del',
    return: '↵',
    arrowUp: '↑',
    arrowDown: '↓',
    arrowLeft: '←',
    arrowRight: '→'
  },
  languageSelect: {
    label: 'Idioma',
    search: 'Buscar idioma',
    noMatch: 'Nenhum idioma encontrado.'
  },
  link: {
    label: 'Saiba mais'
  },
  listingIndexSection: {
    filters: 'Filtros',
    filtersApplied: '{label} ({count})',
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    noMatch: 'Nenhum resultado encontrado.'
  },
  logViewer: {
    searchPlaceholder: 'Buscar nos logs',
    search: 'Buscar logs',
    loading: 'Carregando…',
    lines: { one: '{count} linha', other: '{count} linhas' },
    gzip: 'gzip:',
    empty: 'Nenhuma linha de log corresponde aos filtros atuais.',
    noLines: 'Ainda não há linhas de log.',
    noMatch: 'Nenhuma linha corresponde a “{query}”.',
    clearSearch: 'Limpar busca',
    copy: 'Copiar logs',
    copied: 'Logs copiados',
    levels: 'Níveis de log',
    levelCount: { one: '{level}, {count} linha', other: '{level}, {count} linhas' },
    stepsView: 'Visualização do log',
    stepsPhased: 'Por fases',
    stepsComplete: 'Completo',
    stepsProgress: 'Progresso da execução',
    stepsWaiting: 'Aguardando para iniciar…',
    stepsNeverRan: 'Não foi executado.',
    stepDone: 'Concluído',
    stepFailed: 'Falhou',
    stepSkipped: 'Ignorado',
    stepRunning: 'Em execução',
    stepPending: 'Não iniciado'
  },
  logoWall: {
    link: 'Ler história'
  },
  sidebarMenu: {
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
  multiSelect: {
    noMatch: 'Nenhum resultado',
    loading: 'Carregando opções',
    add: 'Adicionar "{value}"',
    more: '+{count} mais',
    count: {
      one: '{count} opção',
      other: '{count} opções'
    }
  },
  navigationMenu: {
    label: 'Principal'
  },
  numberInput: {
    increment: 'Aumentar',
    decrement: 'Diminuir'
  },
  outcomeIcon: {
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
    loadMore: 'Carregar mais {count}'
  },
  pagination: {
    label: 'Paginação',
    info: 'Mostrando {start} a {end} de {total} registros',
    previous: 'Página anterior',
    next: 'Próxima página',
    page: 'Página {page}',
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
    unmet: 'não atendido',
    progress: '{met} de {total} requisitos atendidos'
  },
  phoneInput: {
    dialCode: 'Código de discagem do país',
    search: 'Buscar país',
    noMatch: 'Nenhum país encontrado.',
    results: {
      one: '{count} país',
      other: '{count} países'
    }
  },
  transferList: {
    moveSelectedToTarget: 'Mover selecionados para o destino',
    moveAllToTarget: 'Mover todos para o destino',
    moveSelectedToSource: 'Mover selecionados para a origem',
    moveAllToSource: 'Mover todos para a origem',
    emptyTitle: 'Nenhum item'
  },
  popover: {
    close: 'Fechar'
  },
  progress: {
    label: 'Progresso'
  },
  propertyFilter: {
    label: 'Filtrar',
    focusShortcut: 'Focar na busca',
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
    lessOrEqual: 'Menor ou igual a',
    equality: 'Igualdade',
    comparison: 'Comparação',
    textMatch: 'Texto',
    addGroup: 'Adicionar grupo',
    newGroup: 'Novo grupo',
    group: 'Grupo de filtros {index}',
    groupOperation: 'Combinar filtros do grupo {index}',
    loadingValues: 'Carregando valores',
    valuesError: 'Não foi possível carregar os valores',
    valueEditor: 'Valor de {property}',
    queryLabel: 'Consulta',
    queryPlaceholder: 'Digite uma consulta, por exemplo status = Active AND requests > 10',
    queryFields: 'Campos',
    queryAll: 'Todas as condições valem',
    queryAny: 'Qualquer condição vale',
    unknownField: 'Não há campo chamado “{field}”.',
    unknownOperator: '“{operator}” não se aplica a {field}.',
    missingOperator: 'Adicione um operador depois de {field}, por exemplo =.',
    missingValue: 'Adicione um valor depois de {operator}.',
    expectedConnective: 'Junte as condições com AND ou OR antes de “{word}”.',
    danglingConnective: 'Adicione uma condição depois de {connective}.',
    unclosedQuote: 'Feche as aspas abertas no caractere {position}.'
  },
  resizable: {
    handle: 'Redimensionar painel'
  },
  schemaForm: {
    required: 'Este campo é obrigatório.',
    minLength: 'Use pelo menos {min} caracteres.',
    maxLength: 'Use no máximo {max} caracteres.',
    pattern: 'Este valor não segue o formato esperado.',
    patternRule: 'Confira o formato: {rule}',
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
    jsonPlaceholder: 'Um valor JSON',
    email: 'Informe um e-mail válido.',
    uri: 'Informe uma URL completa, como https://example.com.',
    date: 'Informe uma data no formato AAAA-MM-DD.',
    datePlaceholder: 'AAAA-MM-DD',
    searchPlaceholder: 'Buscar',
    optionsError: 'Não foi possível carregar as opções.',
    writeOnlyPlaceholder: 'Deixe vazio para manter o valor atual',
    item: 'Item {index}',
    advanced: 'Configurações avançadas',
    mapKey: 'Chave',
    mapValue: 'Valor',
    duplicateKey: 'Cada chave deve ser única.'
  },
  subheader: {
    copyLink: 'Copiar link da seção {title}',
    linkCopied: 'Link copiado'
  },
  settingsGroup: {
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
  siteFooterSection: {
    label: 'Rodapé',
    home: 'Página inicial da Azion',
    language: 'Idioma'
  },
  siteLayout: {
    searchPlaceholder: 'Buscar no site',
    noMatch: 'Nenhuma página corresponde à busca.',
    pages: 'Páginas'
  },
  skipLink: {
    label: 'Pular para o conteúdo'
  },
  siteHeaderSection: {
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
    loadError: 'Não foi possível carregar',
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
  storyIndexSection: {
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    noMatch: 'Nenhum resultado encontrado.',
    filters: 'Filtros',
    filtersApplied: '{label} ({count})'
  },
  dataGrid: {
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar a linha {row}',
    resize: 'Redimensionar {column}',
    invalidNumber: 'Digite um número',
    emptyTitle: 'Nenhuma linha ainda',
    emptyDescription: 'Adicione uma linha para começar a editar.',
    pasted: { one: '{count} célula colada', other: '{count} células coladas' },
    pastedSkipped: {
      one: '{count} célula colada, {skipped} ignoradas',
      other: '{count} células coladas, {skipped} ignoradas'
    },
    pasteReadonly: 'Somente leitura, nada foi colado',
    true: 'Sim',
    false: 'Não'
  },
  table: {
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar a linha {row}',
    emptyTitle: 'Nenhum resultado ainda',
    emptyDescription: 'Comece criando seu primeiro recurso.',
    errorTitle: 'Não foi possível carregar os dados'
  },
  tableExportButton: {
    label: 'Exportar CSV'
  },
  tableHeadCell: {
    sortBy: 'Ordenar por'
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
    openInNewTab: 'Abrir {label} em uma nova aba',
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
  tableLiveButton: {
    label: 'Ao vivo'
  },
  tableSearch: {
    placeholder: 'Buscar',
    label: 'Buscar na tabela',
    focusShortcut: 'Focar na busca'
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
    emptyTitle: 'Nenhuma tag associada ao recurso.',
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
  timeline: {
    label: 'Atividade',
    loading: 'Carregando atividade'
  },

  countdown: {
    label: '{label}:',
    dueIn: 'Vence em {duration}',
    due: 'Vence {relative}',
    overdue: 'Atrasado há {duration}',
    duration: '{major} {minor}',
    expiresIn: 'Expira em {duration}',
    expires: 'Expira {relative}',
    expired: 'Expirou {relative}',
    paused: 'Pausado'
  },
  timestamp: {
    title: 'Detalhes do horário',
    utc: 'UTC',
    local: 'Local',
    browser: 'Seu navegador',
    relative: 'Relativo',
    raw: 'Valor bruto',
    copy: 'Copiar {label}',
    justNow: 'agora mesmo'
  },
  toast: {
    close: 'Fechar notificação',
    region: 'Notificações ({hotkey})'
  },
  toggleGroup: {
    option: 'Opção {index}'
  },
  trace: {
    label: 'Rastreamento',
    search: 'Buscar spans',
    noMatch: 'Nenhum span corresponde a “{query}”.',
    clearSearch: 'Limpar busca',
    emptyTitle: 'Nenhum span neste rastreamento.',
    loading: 'Carregando spans',
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
    seconds: '{value} s',
    zoom: 'Zoom',
    resetZoom: 'Redefinir zoom',
    zoomStart: 'Início do zoom',
    zoomEnd: 'Fim do zoom',
    slowest: 'Mais lento',
    criticalPath: 'Caminho crítico',
    view: 'Visualização',
    waterfall: 'Cascata',
    timeline: 'Linha do tempo',
    tree: 'Árvore',
    span: 'Span',
    onCriticalPath: 'No caminho crítico',
    selfTime: 'Tempo próprio',
    events: 'Eventos',
    eventCount: {
      one: '{count} evento',
      other: '{count} eventos'
    }
  },
  flowDiagram: {
    label: 'Diagrama',
    notBound: 'Não vinculado',
    bind: 'Vincular {kind}',
    change: 'Trocar {kind}',
    remove: 'Remover {kind}',
    create: 'Criar {kind}',
    apply: 'Aplicar {kind}',
    cancel: 'Cancelar',
    pending: 'Pendente',
    existing: 'Existentes',
    noOptions: 'Nenhuma opção ainda.',
    copy: 'Copiar {field}',
    details: 'Detalhes',
    connections: 'Conexões',
    connection: '{from} para {to}',
    emptyTitle: 'Nada conectado ainda.',
    loading: 'Carregando o diagrama'
  },
  tracker: {
    noData: 'Sem dados',
    summary: { one: '{count} período', other: '{count} períodos' },
    summaryWorst: {
      one: '{count} período. Pior: {label}',
      other: '{count} períodos. Pior: {label}'
    },
    roleDescription: 'histórico de status'
  },
  tree: {
    label: 'Árvore',
    emptyTitle: 'Nenhum item',
    loadingChildren: 'Carregando',
    renameLabel: 'Renomear {label}'
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
    emptyTitle: 'Nenhum tutorial ainda.',
    start: 'Iniciar tutorial',
    restart: 'Reiniciar tutorial',
    exit: 'Sair do tutorial',
    back: 'Voltar aos tutoriais',
    completed: 'Concluído',
    completedTitle: 'Tutorial concluído',
    completedDescription: 'Você concluiu {title}.',
    taskCount: { one: '{count} tarefa', other: '{count} tarefas' },
    stepCount: { one: '{count} etapa', other: '{count} etapas' },
    taskComplete: 'Concluída',
    taskCurrent: 'Tarefa atual',
    taskNotStarted: 'Não iniciada',
    progress: '{complete} de {total} concluídas',
    hotspotLabel: 'Etapa do tutorial: {title}',
    hotspotStepOf: 'Etapa {current} de {total}',
    hotspotPrevious: 'Anterior',
    hotspotNext: 'Próxima',
    hotspotFinish: 'Concluir'
  },
  videoPlayer: {
    label: 'Vídeo',
    play: 'Reproduzir',
    pause: 'Pausar',
    seek: 'Avançar ou voltar',
    seekValue: '{current} de {duration}',
    mute: 'Silenciar',
    volume: 'Volume',
    captions: 'Legendas (CC)',
    captionsShort: 'CC',
    enterFullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
    pending: 'Aguardando para gerar',
    running: 'Gerando vídeo',
    error: 'Não foi possível carregar o vídeo'
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
  consoleShowcaseSection: {
    views: 'Visões do console'
  },
  runtimeApiCloud: {
    label: 'Globais disponíveis no Azion Runtime'
  },
  clientStoryColumnsSection: {
    list: 'Histórias de clientes',
    story: 'Ler a história'
  },
  copyCommandSection: {
    command: 'Comando',
    prompt: 'Prompt',
    copyCommandSection: 'Copiar comando',
    copyPrompt: 'Copiar prompt'
  },
  searchTrigger: {
    label: 'Buscar'
  },
  saveBar: {
    saveShortcut: 'Salvar alterações'
  },
  shortcutsDialog: {
    title: 'Atalhos de teclado',
    show: 'Mostrar atalhos de teclado',
    general: 'Geral',
    emptyTitle: 'Nenhum atalho de teclado aqui'
  },
  copyPromptButton: {
    label: 'Copiar prompt',
    copied: 'Copiado',
    worksWith: 'Funciona com {agents}',
    tooltip: 'Copia um prompt de configuração para sua ferramenta de IA',
    dismiss: 'Dispensar'
  },
  docAgentCard: {
    title: 'Seu agente de IA, fluente em Azion',
    description:
      'Um prompt ensina a plataforma a qualquer agente de código: os nomes atuais dos produtos, a documentação ao vivo pelo servidor MCP da Azion e deploys reais com a CLI.',
    asideTitle: 'Prefere o caminho guiado?',
    action: 'Configurar agente'
  },
  common: {
    pauseRotation: 'Pausar rotação',
    resumeRotation: 'Retomar rotação',
    pauseScrolling: 'Pausar rolagem',
    resumeScrolling: 'Retomar rolagem',
    pauseAnimation: 'Pausar animação',
    playAnimation: 'Reproduzir animação',
    copy: 'Copiar',
    copied: 'Copiado',
    newTab: '(abre em uma nova aba)'
  },
  newsletterSection: {
    email: 'Endereço de e-mail'
  },
  dataTable: {
    loadingMore: 'Carregando mais linhas',
    loadMore: 'Carregar mais',
    noMoreRows: 'Não há mais linhas',
    reorderColumn: 'Ordem',
    reorderHandle: 'Reordenar {name}, posição {position} de {total}',
    reorderHint: 'Arraste, ou pressione Seta para cima ou Seta para baixo para mover.',
    reorderLocked: 'Remova a ordenação para reordenar as linhas.',
    reorderMoved: '{name} movido para a posição {position} de {total}.',
    reorderDropped: '{name} solto na posição {position} de {total}.',
    reorderCancelled: 'Reordenação cancelada.'
  }
}
