import type { Messages } from '../i18n/types'

export const es: Messages = {
  toolApproval: {
    approve: 'Aprobar',
    deny: 'Denegar',
    approved: 'Aprobado',
    denied: 'Denegado',
    expired: 'Solicitud vencida',
    confirmLabel: 'Escribe {phrase} para confirmar',
    arguments: 'Argumentos',
    invalidArguments: 'Estos argumentos no son válidos. Corrígelos para aprobar.',
    phraseMismatch: 'El texto no coincide con {phrase}. Escríbelo exactamente para confirmar.'
  },
  agentQuestion: {
    submit: 'Enviar',
    yes: 'Sí',
    no: 'No',
    skip: 'Omitir',
    answered: 'Respondida: {answer}',
    answeredWithoutValue: 'Respondida',
    skipped: 'Omitida',
    canceled: 'Pregunta cancelada',
    error: 'No se pudo enviar la respuesta. Inténtalo de nuevo.'
  },
  responseLoading: {
    generating: 'Generando una respuesta'
  },
  artifactCanvas: {
    close: 'Cerrar {title}',
    copy: 'Copiar {title}',
    download: 'Descargar {title}',
    versions: 'Versiones del artefacto',
    content: 'Contenido de {title}',
    streaming: 'Generando una nueva versión'
  },
  artifactPreview: {
    open: 'Abrir',
    openLabel: 'Abrir {title}',
    download: 'Descargar {title}',
    copy: 'Copiar {title}'
  },
  mcpAppFrame: {
    loading: 'Cargando {title}',
    errorTitle: 'No se puede mostrar {title}',
    errorDescription: 'La app se bloqueó o no se pudo cargar aquí.'
  },
  chatMessage: {
    user: 'Tú',
    assistant: 'Asistente de IA',
    system: 'Sistema',
    labelWithTime: '{author} a las {time}',
    actions: 'Acciones del mensaje',
    error: 'No se pudo generar la respuesta.',
    retry: 'Intentar de nuevo',
    goodResponse: 'Buena respuesta',
    badResponse: 'Mala respuesta',
    feedback: 'Valoración de la respuesta',
    feedbackSubmitting: 'Enviando valoración',
    feedbackThanks: 'Gracias por tu valoración',
    readAloud: 'Leer en voz alta',
    stopReading: 'Detener la lectura',
    share: 'Compartir',
    more: 'Más acciones',
    branch: 'Ramificar en un chat nuevo',
    edit: 'Editar mensaje',
    editField: 'Edita tu mensaje',
    cancel: 'Cancelar',
    send: 'Enviar'
  },
  citation: {
    label: 'Fuente {index}: {title}',
    labelUntitled: 'Fuente {index}',
    labelWithSite: 'Fuente {index}, {site}: {title}',
    labelMany: '{site} +{more}, fuentes {indexes}',
    next: 'Fuente siguiente',
    page: '{current}/{total}',
    previous: 'Fuente anterior'
  },
  conversation: {
    label: 'Conversación',
    scrollToLatest: 'Ir al último mensaje',
    announcement: '{author}: {text}',
    loadMore: 'Cargar mensajes anteriores',
    loadingMore: 'Cargando mensajes anteriores',
    moreLoaded: 'Mensajes anteriores cargados'
  },
  promptInput: {
    label: 'Prompt',
    placeholder: 'Haz una pregunta',
    submit: 'Enviar',
    stop: 'Detener la generación',
    count: '{count}/{max}',
    overLimit: '{count} caracteres por encima del límite',
    menuResults: {
      one: '{count} sugerencia',
      other: '{count} sugerencias'
    },
    noMatch: 'Sin resultados',
    menuReferences: 'Referencias',
    voice: 'Iniciar conversación por voz',
    attach: 'Adjuntar archivos',
    drop: 'Suelta los archivos para adjuntarlos',
    rejectedAccept: {
      one: '{count} archivo no añadido: tipo no aceptado',
      other: '{count} archivos no añadidos: tipo no aceptado'
    },
    rejectedSize: {
      one: '{count} archivo no añadido: mayor que {size}',
      other: '{count} archivos no añadidos: mayores que {size}'
    },
    rejectedCount: {
      one: '{count} archivo no añadido: hasta {max} archivos',
      other: '{count} archivos no añadidos: hasta {max} archivos'
    },
    dictate: 'Dictar',
    dictateStop: 'Detener el dictado',
    listening: 'Escuchando',
    dictationEnded: 'Dictado detenido',
    dictationBlocked: 'El acceso al micrófono está bloqueado',
    dictationFailed: 'El dictado se detuvo. Inténtalo de nuevo',
    model: 'Modelo',
    mode: 'Modo',
    context: 'Elegir contexto',
    contextRemove: 'Quitar contexto',
    tools: 'Herramientas',
    toolsEnabled: 'Herramientas activadas',
    addMenu: 'Añadir',
    camera: 'Cámara',
    photos: 'Fotos',
    files: 'Archivos'
  },
  agentActivity: {
    label: 'Actividad del agente',
    steps: {
      one: '{count} paso',
      other: '{count} pasos'
    },
    finished: {
      one: '{count} paso completado',
      other: '{count} pasos completados'
    },
    stopped: {
      one: 'Detenido tras {count} paso',
      other: 'Detenido tras {count} pasos'
    },
    failed: 'Falló: {title}',
    pending: 'Pendiente',
    running: 'En curso',
    success: 'Hecho',
    error: 'Falló',
    canceled: 'Cancelado',
    skipped: 'Omitido'
  },
  reasoning: {
    thinking: 'Pensando',
    thoughtBriefly: 'Pensó durante unos segundos',
    skip: 'Omitir razonamiento',
    thought: {
      one: 'Pensó durante {count} segundo',
      other: 'Pensó durante {count} segundos'
    }
  },
  sources: {
    label: 'Fuentes',
    cited: 'Citas',
    more: 'Más',
    count: {
      one: '{count} fuente',
      other: '{count} fuentes'
    }
  },
  promptQueue: {
    label: 'Mensajes en cola',
    title: {
      one: '{count} mensaje en cola',
      other: '{count} mensajes en cola'
    },
    empty: 'No hay mensajes en cola',
    remove: 'Quitar de la cola',
    attachments: {
      one: '{count} adjunto',
      other: '{count} adjuntos'
    }
  },
  suggestionGroup: {
    label: 'Prompts sugeridos'
  },
  toolCall: {
    pending: 'En espera',
    streaming: 'Preparando',
    running: 'En ejecución',
    success: 'Completado',
    error: 'Falló',
    canceled: 'Cancelado',
    denied: 'Denegado',
    input: 'Entrada',
    output: 'Salida'
  },
  subagentCard: {
    pending: 'En espera',
    running: 'En ejecución',
    success: 'Completado',
    error: 'Falló',
    canceled: 'Detenido',
    stop: 'Detener',
    stopAgent: 'Detener {name}',
    input: 'Tarea',
    activity: 'Actividad'
  },
  alert: {
    close: 'Cerrar mensaje'
  },
  appLayout: {
    navigation: 'Navegación',
    tools: 'Ayuda',
    closeTools: 'Cerrar ayuda',
    splitPanel: 'Detalles',
    closeSplitPanel: 'Cerrar panel',
    resizeSplitPanel: 'Redimensionar panel',
    showAtSide: 'Mostrar junto al contenido',
    showAtBottom: 'Mostrar debajo del contenido'
  },
  articleBodySection: {
    linkCopied: 'Enlace copiado',
    copiedFeed: 'Enlace del feed copiado',
    copiedPage: 'Página copiada como markdown',
    copyFailed: 'No se pudo copiar',
    copyFailedHint: 'Tu navegador bloqueó el acceso al portapapeles.',
    assistantPrompt: 'Lee {url} para que pueda hacerte preguntas sobre él.'
  },
  articleIndexSection: {
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    noMatch: 'No se encontraron resultados.',
    results: {
      one: '{count} resultado',
      other: '{count} resultados'
    }
  },
  attributeEditor: {
    add: 'Agregar elemento',
    remove: 'Quitar elemento',
    rowAction: '{label} {index}',
    addGroup: 'Agregar grupo O',
    emptyTitle: 'Todavía no hay elementos.',
    remaining: {
      one: 'Puedes agregar {count} elemento más.',
      other: 'Puedes agregar {count} elementos más.'
    },
    limitReached: 'Alcanzaste el límite de {limit} elementos.',
    added: 'Elemento {index} agregado.',
    removed: 'Elemento {index} quitado.',
    group: 'Grupo {index}',
    and: 'y',
    or: 'o',
    reorder: 'Reordenar elemento {index}',
    reorderHint: 'Arrastra o presiona Flecha arriba o Flecha abajo para mover.',
    moveUp: 'Mover elemento {index} hacia arriba',
    moveDown: 'Mover elemento {index} hacia abajo',
    moved: 'Elemento {from} movido a la posición {to}.',
    reorderGroup: 'Reordenar grupo {index}',
    moveGroupUp: 'Mover grupo {index} hacia arriba',
    moveGroupDown: 'Mover grupo {index} hacia abajo',
    groupMoved: 'Grupo {from} movido a la posición {to}.'
  },
  avatar: {
    fallbackLabel: 'Avatar del usuario',
    imageAlt: 'Avatar',
    presenceOnline: 'en línea',
    presenceAway: 'ausente',
    presenceBusy: 'ocupado',
    presenceOffline: 'desconectado',
    withPresence: '{name}, {presence}'
  },
  avatarGroup: {
    people: {
      one: '{count} persona',
      other: '{count} personas'
    },
    more: {
      one: '{count} persona más',
      other: '{count} personas más'
    }
  },
  barList: {
    emptyTitle: 'No hay datos disponibles',
    errorTitle: 'No se pudieron cargar los datos'
  },
  dashboardGrid: {
    label: 'Panel',
    item: 'Elemento {position}',
    moved: '{label} movido a la posición {position} de {total}.',
    resized: '{label} redimensionado a {span} de {columns} columnas.',
    resizedWithHeight:
      '{label} redimensionado a {span} de {columns} columnas, {height} píxeles de alto.'
  },
  breadcrumb: {
    label: 'Ruta de navegación',
    showHidden: 'Mostrar páginas intermedias'
  },
  browserFrame: {
    preview: 'Vista previa',
    copyAddress: 'Copiar dirección',
    resizeWidth: 'Cambiar el ancho de la vista previa',
    resizeHeight: 'Cambiar el alto de la vista previa',
    widthValue: '{value} píxeles de ancho',
    heightValue: '{value} píxeles de alto'
  },
  buttonGroup: {
    moreActions: 'Más acciones',
    pressed: 'Activado'
  },
  integrationCard: {
    byVendor: 'por {vendor}',
    installed: 'Instalado'
  },
  cardList: {
    label: 'Elementos',
    selectAll: 'Seleccionar todos los elementos',
    emptyTitle: 'Aún no hay elementos',
    emptyDescription: 'Los elementos que crees aparecen aquí.'
  },
  carousel: {
    next: 'Diapositiva siguiente',
    previous: 'Diapositiva anterior',
    roleDescription: 'carrusel'
  },
  chart: {
    emptyTitle: 'No hay datos disponibles',
    noData: 'sin datos',
    label: 'Etiqueta',
    roleDescription: 'gráfico',
    summary: '{series} series en {points} puntos{range}.',
    summaryRange: ', de {from} a {to}',
    otherSeries: 'Otros',
    rangeDraft: 'Seleccionando de {from} a {to}',
    rangeSelected: 'Seleccionado de {from} a {to}',
    total: 'Total',
    reference: 'Referencia',
    referenceLine: '{label} en {value}.',
    referenceBand: '{label} de {from} a {to}.'
  },
  chartCard: {
    resize: 'Redimensionar tarjeta',
    move: 'Mover tarjeta',
    moveVerb: 'Mover',
    moveHint: 'Usa las flechas para mover la tarjeta.',
    moved: 'Movida a la posición {position} de {total}',
    columns: '{span} de {max} columnas',
    columnsAndHeight: '{columns}, {height} píxeles de alto'
  },
  chip: {
    remove: 'Quitar',
    removeNamed: 'Quitar {label}'
  },
  codeBlock: {
    copy: 'Copiar código',
    output: 'Salida',
    added: 'Añadida',
    removed: 'Eliminada',
    original: 'Original',
    modified: 'Modificado'
  },
  codeEditor: {
    label: 'Editor de código',
    original: 'Original',
    modified: 'Modificado',
    problems: 'Problemas',
    problemCount: {
      zero: 'Ningún problema',
      one: '{count} problema',
      other: '{count} problemas'
    },
    line: 'Línea {line}',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información',
    loading: 'Cargando el editor completo…',
    loadFailed: 'El editor completo no se pudo cargar. Puedes seguir editando aquí.',
    tabHint: 'Pulsa Escape y luego Tab para salir del editor.'
  },
  collectionPreferences: {
    trigger: 'Preferencias',
    title: 'Preferencias',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    pageSize: 'Elementos por página',
    pageSizeOption: {
      one: '{count} elemento',
      other: '{count} elementos'
    },
    columns: 'Columnas',
    columnsDescription: 'Elige qué columnas se muestran y en qué orden.',
    alwaysShown: 'Siempre visible',
    moveUp: 'Mover {column} hacia arriba',
    moveDown: 'Mover {column} hacia abajo',
    display: 'Visualización',
    wrapLines: 'Ajustar líneas',
    wrapLinesDescription: 'Mostrar el texto completo de cada celda.',
    striped: 'Filas alternas',
    stripedDescription: 'Sombrear una de cada dos filas.',
    density: 'Densidad',
    comfortable: 'Cómoda',
    compact: 'Compacta'
  },
  combobox: {
    noMatch: 'Sin resultados',
    loading: 'Cargando opciones',
    useValue: 'Usar "{value}"',
    clear: 'Borrar',
    suggestions: 'Sugerencias',
    count: {
      one: '{count} opción',
      other: '{count} opciones'
    }
  },
  command: {
    back: 'Volver de {page}',
    noMatch: 'No se encontraron resultados.',
    placeholder: 'Buscar en todo',
    title: 'Menú de comandos'
  },
  planComparisonSection: {
    about: 'Acerca de {label}',
    search: 'Buscar',
    searchPicker: 'Buscar {picker}',
    noMatch: 'No se encontraron resultados.',
    included: 'Incluido',
    excluded: 'No incluido'
  },
  competitorComparisonSection: {
    about: 'Acerca de {capability}'
  },
  confirmDialog: {
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    typeToConfirm: 'Escribe {phrase} para confirmar.'
  },
  consoleLayout: {
    navigation: 'Navegación principal',
    home: 'Inicio de Azion',
    openNavigation: 'Abrir navegación',
    accountMenu: 'Menú de la cuenta',
    accountMenuFor: '{initials}, {name}, menú de la cuenta',
    searchPlaceholder: 'Buscar páginas y comandos',
    noMatch: 'Ninguna página o comando coincide con la búsqueda.',
    pages: 'Páginas',
    searchShortcut: 'Buscar páginas y comandos'
  },
  copyButton: {
    fallbackTitle: 'Copia manualmente',
    fallbackField: 'Valor para copiar',
    fallbackHint: 'Pulsa {keys} para copiar.'
  },
  copyText: {
    copy: 'Copiar {value}'
  },
  responseBranches: {
    label: 'Versiones de la respuesta',
    previous: 'Versión anterior',
    next: 'Versión siguiente',
    position: '{current}/{total}',
    positionLabel: 'Versión {current} de {total}'
  },
  feedbackReasonDialog: {
    title: '¿Qué salió mal?',
    description: 'Tu respuesta ayuda a mejorar las próximas respuestas.',
    reason: 'Motivo',
    details: 'Detalles (opcional)',
    detailsPlaceholder: '¿Qué esperabas?',
    required: 'Elige un motivo.',
    cancel: 'Cancelar',
    send: 'Enviar comentarios',
    inaccurate: 'Incorrecta o inventada',
    notHelpful: 'No fue útil',
    ignoredRequest: 'No siguió mi solicitud',
    unsafe: 'Insegura o dañina',
    other: 'Otro'
  },
  conversationHistory: {
    label: 'Historial de conversaciones',
    today: 'Hoy',
    yesterday: 'Ayer',
    previous7: 'Últimos 7 días',
    previous30: 'Últimos 30 días',
    older: 'Más antiguas',
    emptyTitle: 'Aún no hay conversaciones.',
    delete: 'Eliminar {title}',
    newChat: 'Nuevo chat',
    search: 'Buscar conversaciones',
    noMatch: 'Ninguna conversación coincide con «{query}».'
  },
  qrCode: {
    label: 'Código QR'
  },
  datePicker: {
    placeholder: 'Selecciona una fecha',
    clear: 'Borrar selección',
    open: 'Abrir calendario',
    chooseDate: 'Elegir fecha',
    apply: 'Aplicar',
    cancel: 'Cancelar',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    month: 'Mes',
    year: 'Año',
    start: 'Inicio',
    end: 'Fin',
    date: 'Fecha',
    time: 'Hora',
    startTime: 'Hora de inicio',
    endTime: 'Hora de fin',
    timezone: 'Zona horaria',
    localTimezone: 'Local',
    example: 'p. ej.: {value}',
    timePlaceholder: 'hh:mm'
  },
  dateRangePicker: {
    label: 'Intervalo de tiempo',
    placeholder: 'Selecciona un intervalo de tiempo',
    dialog: 'Elige un intervalo de tiempo',
    rangeType: 'Tipo de intervalo',
    relative: 'Relativo',
    absolute: 'Absoluto',
    quickRanges: 'Intervalos rápidos',
    custom: 'Intervalo personalizado',
    showQuickRanges: 'Volver a los intervalos rápidos',
    amount: 'Duración',
    unit: 'Unidad',
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
      one: 'Último día',
      other: 'Últimos {count} días'
    },
    week: {
      one: 'Última semana',
      other: 'Últimas {count} semanas'
    },
    month: {
      one: 'Último mes',
      other: 'Últimos {count} meses'
    },
    year: {
      one: 'Último año',
      other: 'Últimos {count} años'
    },
    unitSecond: 'Segundos',
    unitMinute: 'Minutos',
    unitHour: 'Horas',
    unitDay: 'Días',
    unitWeek: 'Semanas',
    unitMonth: 'Meses',
    unitYear: 'Años',
    today: 'Hoy',
    thisWeek: 'Esta semana',
    thisMonth: 'Este mes',
    thisYear: 'Este año',
    now: 'ahora',
    untilNow: 'Terminar ahora',
    enterDates: 'Escribir fechas',
    showCalendar: 'Mostrar calendario',
    refreshEvery: 'Actualizar cada',
    refreshOff: 'Desactivado',
    refreshSecond: {
      one: 'se actualiza cada segundo',
      other: 'se actualiza cada {count} segundos'
    },
    refreshMinute: {
      one: 'se actualiza cada minuto',
      other: 'se actualiza cada {count} minutos'
    },
    refreshHour: {
      one: 'se actualiza cada hora',
      other: 'se actualiza cada {count} horas'
    },
    apply: 'Aplicar',
    cancel: 'Cancelar',
    previous: 'Intervalo anterior',
    next: 'Intervalo siguiente',
    incomplete: 'Elige un inicio y un fin.',
    order: 'El fin debe ser posterior al inicio.',
    outOfBounds: 'Elige un intervalo dentro de las fechas permitidas.',
    tooLong: 'Elige un intervalo de {duration} como máximo.',
    invalidAmount: 'Introduce un número entero mayor que 0.'
  },
  dialog: {
    close: 'Cerrar'
  },
  docFrame: {
    zoom: 'Ver imagen en pantalla completa',
    zoomNamed: 'Ver en pantalla completa: {alt}',
    pauseNamed: 'Pausar animación: {alt}',
    playNamed: 'Reproducir animación: {alt}',
    fullScreen: 'Pantalla completa',
    zoomedImage: 'Imagen en pantalla completa',
    closeFullScreen: 'Cerrar pantalla completa',
    close: 'Cerrar'
  },
  docLayout: {
    navigation: 'Documentación',
    sections: 'Secciones de la documentación',
    home: 'Inicio de Azion Docs',
    badge: 'Docs',
    openNavigation: 'Abrir navegación de la documentación',
    search: 'Buscar en la documentación',
    noMatch: 'Ninguna página coincide con la búsqueda.',
    pages: 'Páginas',
    root: 'Docs',
    collapseNavigation: 'Contraer navegación',
    expandNavigation: 'Expandir navegación',
    resizeNavigation: 'Cambiar el tamaño de la navegación'
  },
  docTableOfContents: {
    title: 'En esta página'
  },
  docPageHeader: {
    lastUpdated: 'Actualizado el'
  },
  docPreviousNext: {
    label: 'Navegación entre páginas',
    previous: 'Anterior',
    next: 'Siguiente'
  },
  docPrompt: {
    showLess: 'Mostrar menos',
    showMore: 'Mostrar más',
    copy: 'Copiar prompt',
    copied: 'Prompt copiado'
  },
  docProse: {
    copyManually: 'Pulsa {shortcut} para copiar'
  },
  donutChart: {
    total: 'Total',
    emptyTitle: 'No hay datos disponibles',
    summary: {
      one: '{count} porción, {total} en total.',
      other: '{count} porciones, {total} en total.'
    },
    name: 'Nombre',
    value: 'Valor',
    share: 'Proporción',
    roleDescription: 'gráfico',
    otherSeries: 'Otros'
  },
  gaugeChart: {
    emptyTitle: 'No hay datos disponibles',
    valueWithStatus: '{value}, {status}',
    range: 'Rango de {min} a {max}'
  },
  mapChart: {
    emptyTitle: 'No hay datos disponibles',
    roleDescription: 'mapa',
    name: 'Nombre',
    value: 'Valor',
    summary: {
      one: '{count} lugar en el mapa, {total} en total.',
      other: '{count} lugares en el mapa, {total} en total.'
    },
    legend: 'De {min} a {max}'
  },
  drawer: {
    close: 'Cerrar'
  },
  errorBoundary: {
    title: 'No se pudo cargar esta sección',
    description:
      'Algo salió mal al mostrar esta parte de la página. El resto de la página sigue funcionando.',
    retry: 'Reintentar'
  },
  field: {
    required: 'Obligatorio'
  },
  fileDropzone: {
    title: 'Suelta archivos para subirlos',
    touchTitle: 'Elige archivos para subirlos'
  },
  audioPlayer: {
    label: 'Reproductor de audio',
    play: 'Reproducir',
    pause: 'Pausar',
    seek: 'Buscar posición',
    position: '{current} de {total}',
    mute: 'Silenciar',
    unmute: 'Activar sonido',
    volume: 'Volumen',
    rate: '{rate}×',
    speed: 'Velocidad de reproducción {rate}',
    download: 'Descargar audio',
    downloadTitle: 'Descargar {title}',
    loading: 'Cargando audio',
    error: 'No se pudo reproducir el audio.',
    transcript: 'Transcripción'
  },
  filePreview: {
    download: 'Descargar',
    loading: 'Cargando vista previa',
    contents: 'Contenido de {name}',
    noPreview: 'No hay vista previa para este tipo de archivo',
    noPreviewDetail: 'Descarga el archivo para abrirlo.',
    error: 'No se pudo cargar la vista previa',
    empty: 'Este archivo está vacío.',
    document: 'Vista previa de {name}',
    truncated: 'Mostrando los primeros {shown} caracteres. Descarga el archivo para verlo completo.'
  },
  imageGallery: {
    label: 'Imágenes',
    image: 'Imagen {position} de {total}',
    position: '{position} de {total}',
    previous: 'Imagen anterior',
    next: 'Imagen siguiente',
    download: 'Descargar',
    loading: 'Generando imágenes',
    ready: 'Imágenes listas',
    error: 'No se pudieron cargar las imágenes',
    broken: 'No se pudo cargar esta imagen',
    empty: 'No hay imágenes'
  },
  fileTokenGroup: {
    label: 'Archivos',
    remove: 'Quitar {name}',
    uploading: 'Subiendo {name}',
    modified: 'Modificado el {date}',
    showMore: {
      one: 'Mostrar {count} archivo más',
      other: 'Mostrar {count} archivos más'
    },
    showLess: 'Mostrar menos archivos'
  },
  filterMenu: {
    label: 'Filtrar',
    triggerCount: { one: '{label}, {count} aplicado', other: '{label}, {count} aplicados' },
    searchFields: 'Filtrar por…',
    searchFieldsLabel: 'Buscar campos de filtro',
    searchValues: 'Filtrar {field}…',
    searchValuesLabel: 'Buscar valores de {field}',
    back: 'Volver a todos los filtros',
    backToPeriods: 'Volver a los períodos',
    noMatch: 'Sin resultados para “{query}”.',
    clear: 'Borrar {field}',
    last24Hours: 'Últimas 24 horas',
    last7Days: 'Últimos 7 días',
    last30Days: 'Últimos 30 días',
    last3Months: 'Últimos 3 meses',
    customRange: 'Rango personalizado…',
    pickRange: 'Elige un rango',
    rangeBetween: '{start} – {end}',
    rangeSince: 'Desde {date}',
    rangeUntil: 'Hasta {date}',
    more: '+{count}',
    moreValues: {
      one: '{count} valor más. Escribe para acotar la lista.',
      other: '{count} valores más. Escribe para acotar la lista.'
    },
    applied: 'Filtros aplicados'
  },
  uploadProgress: {
    label: 'Transferencias de archivos',
    uploading: {
      one: 'Subiendo {done} de {count} archivo',
      other: 'Subiendo {done} de {count} archivos'
    },
    moving: {
      one: 'Moviendo {done} de {count} archivo',
      other: 'Moviendo {done} de {count} archivos'
    },
    deleting: {
      one: 'Eliminando {done} de {count} archivo',
      other: 'Eliminando {done} de {count} archivos'
    },
    uploaded: {
      one: '{count} archivo subido',
      other: '{count} archivos subidos'
    },
    moved: {
      one: '{count} archivo movido',
      other: '{count} archivos movidos'
    },
    deleted: {
      one: '{count} archivo eliminado',
      other: '{count} archivos eliminados'
    },
    failed: {
      one: '{count} falló',
      other: '{count} fallaron'
    },
    queued: 'En espera',
    done: 'Listo',
    canceled: 'Cancelado',
    cancelAll: 'Cancelar todo',
    cancelItem: 'Cancelar {name}',
    retryItem: 'Reintentar {name}',
    retryFailed: 'Reintentar los fallidos',
    close: 'Cerrar',
    expand: 'Mostrar archivos',
    collapse: 'Ocultar archivos',
    itemProgress: 'Progreso de {name}'
  },
  footer: {
    label: 'Pie de página',
    home: 'Inicio de Azion'
  },
  appHeader: {
    label: 'Encabezado global',
    home: 'Inicio de Azion',
    productHome: 'Inicio de Azion {product}',
    account: 'Menú de la cuenta'
  },
  helpPanel: {
    label: 'Ayuda',
    learnMore: 'Más información'
  },
  heroSection: {
    carouselLabel: 'Probada en cargas de trabajo críticas'
  },
  heroFormSection: {
    search: 'Buscar',
    noMatch: 'No se encontraron resultados.'
  },
  keyValueList: {
    notSet: 'Sin definir'
  },
  kbd: {
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Mayús',
    escape: 'Esc',
    enter: 'Intro',
    space: 'Espacio',
    tab: 'Tab',
    backspace: 'Retroceso',
    delete: 'Supr',
    return: '↵',
    arrowUp: '↑',
    arrowDown: '↓',
    arrowLeft: '←',
    arrowRight: '→'
  },
  languageSelect: {
    label: 'Idioma',
    search: 'Buscar idioma',
    noMatch: 'No se encontró ningún idioma.'
  },
  link: {
    label: 'Más información'
  },
  listingIndexSection: {
    filters: 'Filtros',
    filtersApplied: '{label} ({count})',
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    noMatch: 'No se encontraron resultados.'
  },
  logViewer: {
    searchPlaceholder: 'Buscar en los registros',
    search: 'Buscar registros',
    loading: 'Cargando…',
    lines: { one: '{count} línea', other: '{count} líneas' },
    gzip: 'gzip:',
    empty: 'Ninguna línea de registro coincide con los filtros actuales.',
    noLines: 'Todavía no hay líneas de log.',
    noMatch: 'Ninguna línea coincide con “{query}”.',
    clearSearch: 'Borrar búsqueda',
    copy: 'Copiar registros',
    copied: 'Registros copiados',
    levels: 'Niveles de registro',
    levelCount: { one: '{level}, {count} línea', other: '{level}, {count} líneas' },
    stepsView: 'Vista del registro',
    stepsPhased: 'Por fases',
    stepsComplete: 'Completo',
    stepsProgress: 'Progreso de la ejecución',
    stepsWaiting: 'Esperando para comenzar…',
    stepsNeverRan: 'No se ejecutó.',
    stepDone: 'Hecho',
    stepFailed: 'Falló',
    stepSkipped: 'Omitido',
    stepRunning: 'En curso',
    stepPending: 'Sin iniciar'
  },
  logoWall: {
    link: 'Leer historia'
  },
  sidebarMenu: {
    label: 'Menú',
    back: 'Volver',
    backTo: 'Volver a {label}',
    open: 'Abrir submenú',
    openNamed: 'Abrir menú {label}',
    collapse: 'Contraer',
    collapseNamed: 'Contraer {label}',
    expand: 'Expandir',
    expandNamed: 'Expandir {label}'
  },
  multiSelect: {
    noMatch: 'Sin resultados',
    loading: 'Cargando opciones',
    add: 'Añadir "{value}"',
    more: '+{count} más',
    count: {
      one: '{count} opción',
      other: '{count} opciones'
    }
  },
  navigationMenu: {
    label: 'Principal'
  },
  numberInput: {
    increment: 'Aumentar',
    decrement: 'Disminuir'
  },
  outcomeIcon: {
    success: 'Completado',
    danger: 'Falló',
    warning: 'Requiere atención',
    neutral: 'Sin definir'
  },
  overflowCount: {
    noun: {
      one: 'elemento',
      other: 'elementos'
    },
    summary: '{count} {noun}',
    paged: '{shown} de {count} {noun}',
    showAll: 'Ver lista completa: {count} {noun}',
    search: 'Buscar',
    noMatch: 'Nada coincide con “{query}”',
    loadMore: 'Cargar {count} más'
  },
  pagination: {
    label: 'Paginación',
    info: 'Mostrando {start} a {end} de {total} registros',
    previous: 'Página anterior',
    next: 'Página siguiente',
    page: 'Página {page}',
    pageSize: 'Filas por página'
  },
  passwordInput: {
    hide: 'Ocultar contraseña',
    show: 'Mostrar contraseña'
  },
  passwordRequirements: {
    title: 'Debe contener:',
    length: 'De 8 a 128 caracteres',
    uppercase: 'Letra mayúscula',
    special: 'Carácter especial',
    number: 'Número',
    lowercase: 'Letra minúscula',
    met: 'cumplido',
    unmet: 'no cumplido',
    progress: '{met} de {total} requisitos cumplidos'
  },
  phoneInput: {
    dialCode: 'Código de marcación del país',
    search: 'Buscar país',
    noMatch: 'No se encontró ningún país.',
    results: {
      one: '{count} país',
      other: '{count} países'
    }
  },
  transferList: {
    moveSelectedToTarget: 'Mover seleccionados al destino',
    moveAllToTarget: 'Mover todos al destino',
    moveSelectedToSource: 'Mover seleccionados al origen',
    moveAllToSource: 'Mover todos al origen',
    emptyTitle: 'Sin elementos'
  },
  popover: {
    close: 'Cerrar'
  },
  priorityTag: {
    prefix: 'Prioridad:',
    urgent: 'Urgente',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    none: 'Sin prioridad'
  },
  progress: {
    label: 'Progreso'
  },
  propertyFilter: {
    label: 'Filtrar',
    focusShortcut: 'Ir a la búsqueda',
    placeholder: 'Filtrar por propiedad o texto',
    suggestions: 'Sugerencias',
    useText: 'Usar: “{text}”',
    properties: 'Propiedades',
    operators: 'Operadores',
    values: 'Valores',
    tokens: 'Filtros aplicados',
    operation: 'Combinar filtros',
    matchAll: 'Todos',
    matchAny: 'Cualquiera',
    and: 'y',
    or: 'o',
    clear: 'Borrar filtros',
    removeToken: 'Quitar filtro {token}',
    matches: {
      one: '{count} resultado',
      other: '{count} resultados'
    },
    equals: 'Igual a',
    notEquals: 'Distinto de',
    contains: 'Contiene',
    notContains: 'No contiene',
    startsWith: 'Empieza por',
    notStartsWith: 'No empieza por',
    greater: 'Mayor que',
    less: 'Menor que',
    greaterOrEqual: 'Mayor o igual que',
    lessOrEqual: 'Menor o igual que',
    equality: 'Igualdad',
    comparison: 'Comparación',
    textMatch: 'Texto',
    addGroup: 'Añadir grupo',
    newGroup: 'Nuevo grupo',
    group: 'Grupo de filtros {index}',
    groupOperation: 'Combinar filtros del grupo {index}',
    loadingValues: 'Cargando valores',
    valuesError: 'No se pudieron cargar los valores',
    valueEditor: 'Valor de {property}',
    queryLabel: 'Consulta',
    queryPlaceholder: 'Escribe una consulta, por ejemplo status = Active AND requests > 10',
    queryFields: 'Campos',
    queryAll: 'Se cumplen todas las condiciones',
    queryAny: 'Se cumple cualquier condición',
    unknownField: 'No hay ningún campo llamado “{field}”.',
    unknownOperator: '“{operator}” no se aplica a {field}.',
    missingOperator: 'Añade un operador después de {field}, por ejemplo =.',
    missingValue: 'Añade un valor después de {operator}.',
    expectedConnective: 'Une las condiciones con AND u OR antes de “{word}”.',
    danglingConnective: 'Añade una condición después de {connective}.',
    unclosedQuote: 'Cierra las comillas abiertas en el carácter {position}.'
  },
  rating: {
    star: {
      one: '{count} estrella',
      other: '{count} estrellas'
    },
    value: 'Valorado con {value} de {max}',
    empty: 'Sin valoración',
    clear: 'Borrar valoración'
  },
  resizable: {
    handle: 'Redimensionar panel'
  },
  schemaForm: {
    required: 'Este campo es obligatorio.',
    minLength: 'Usa al menos {min} caracteres.',
    maxLength: 'Usa como máximo {max} caracteres.',
    pattern: 'Este valor no sigue el formato esperado.',
    patternRule: 'Revisa el formato: {rule}',
    minimum: 'Ingresa {min} o más.',
    maximum: 'Ingresa {max} o menos.',
    number: 'Ingresa un número.',
    integer: 'Ingresa un número entero.',
    enum: 'Elige una de las opciones.',
    minItems: 'Agrega al menos {min} valores.',
    maxItems: 'Agrega como máximo {max} valores.',
    listItem: 'Línea {line}: {message}',
    json: 'Ingresa un JSON válido.',
    selectPlaceholder: 'Selecciona una opción',
    numberPlaceholder: 'Un número',
    numberFrom: 'Desde {min}',
    listPlaceholder: 'Un valor por línea',
    jsonPlaceholder: 'Un valor JSON',
    email: 'Ingresa un correo electrónico válido.',
    uri: 'Ingresa una URL completa, como https://example.com.',
    date: 'Ingresa una fecha con el formato AAAA-MM-DD.',
    datePlaceholder: 'AAAA-MM-DD',
    searchPlaceholder: 'Buscar',
    optionsError: 'No se pudieron cargar las opciones.',
    writeOnlyPlaceholder: 'Déjalo vacío para conservar el valor actual',
    item: 'Elemento {index}',
    advanced: 'Configuración avanzada',
    mapKey: 'Clave',
    mapValue: 'Valor',
    duplicateKey: 'Cada clave debe ser única.'
  },
  subheader: {
    copyLink: 'Copiar enlace a la sección {title}',
    linkCopied: 'Enlace copiado'
  },
  settingsGroup: {
    copyLink: 'Copiar enlace a la sección {title}',
    linkCopied: 'Enlace copiado'
  },
  severityTag: {
    critical: 'Crítica',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    info: 'Informativa'
  },
  sidebar: {
    label: 'Barra lateral',
    collapse: 'Contraer barra lateral',
    expand: 'Expandir barra lateral',
    resize: 'Redimensionar barra lateral',
    expandByDragging: '{label} arrastrando'
  },
  siteFooterSection: {
    label: 'Pie de página',
    home: 'Página de inicio de Azion',
    language: 'Idioma'
  },
  siteLayout: {
    searchPlaceholder: 'Buscar en el sitio',
    noMatch: 'Ninguna página coincide con la búsqueda.',
    pages: 'Páginas'
  },
  skipLink: {
    label: 'Saltar al contenido'
  },
  siteHeaderSection: {
    open: 'Abrir navegación',
    home: 'Página de inicio de Azion',
    search: 'Buscar',
    menu: 'Menú'
  },
  splitButton: {
    moreActions: 'Más acciones',
    moreActionsFor: 'Más acciones para {label}'
  },
  statTile: {
    noValue: 'Sin valor',
    noData: 'Sin datos',
    loadError: 'No se pudo cargar',
    better: 'mejor',
    worse: 'peor',
    unchanged: 'sin cambios'
  },
  statusIndicator: {
    label: 'Estado'
  },
  stepper: {
    label: 'Pasos',
    error: 'Requiere atención',
    loading: 'En curso',
    current: 'Paso actual',
    complete: 'Completado',
    upcoming: 'Sin iniciar'
  },
  storyIndexSection: {
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    noMatch: 'No se encontraron resultados.',
    filters: 'Filtros',
    filtersApplied: '{label} ({count})'
  },
  dataGrid: {
    selectAll: 'Seleccionar todas las filas',
    selectRow: 'Seleccionar la fila {row}',
    resize: 'Cambiar el ancho de {column}',
    invalidNumber: 'Escribe un número',
    emptyTitle: 'Todavía no hay filas',
    emptyDescription: 'Agrega una fila para empezar a editar.',
    pasted: { one: 'Se pegó {count} celda', other: 'Se pegaron {count} celdas' },
    pastedSkipped: {
      one: 'Se pegó {count} celda, {skipped} omitidas',
      other: 'Se pegaron {count} celdas, {skipped} omitidas'
    },
    pasteReadonly: 'Solo lectura, no se pegó nada',
    true: 'Sí',
    false: 'No'
  },
  table: {
    selectAll: 'Seleccionar todas las filas',
    selectRow: 'Seleccionar la fila {row}',
    emptyTitle: 'Aún no hay resultados',
    emptyDescription: 'Empieza creando tu primer recurso.',
    errorTitle: 'No se pudieron cargar los datos'
  },
  tableExportButton: {
    label: 'Exportar CSV'
  },
  tableHeadCell: {
    sortBy: 'Ordenar por'
  },
  tableRefreshButton: {
    label: 'Actualizar'
  },
  tableCellActions: {
    label: 'Acciones de la fila',
    labelFor: 'Acciones de {name}'
  },
  tableCellId: {
    copy: 'Copiar ID',
    copyResource: 'Copiar ID de {resource}'
  },
  tableCellLink: {
    open: 'Abrir {label}',
    openIn: 'Abrir {label} en {destination}',
    openInNewTab: 'Abrir {label} en una pestaña nueva',
    copy: 'Copiar {label}'
  },
  tableCellTags: {
    noun: {
      one: 'etiqueta',
      other: 'etiquetas'
    }
  },
  tableCellTime: {
    justNow: 'justo ahora'
  },
  tableLiveButton: {
    label: 'En vivo'
  },
  tableSearch: {
    placeholder: 'Buscar',
    label: 'Buscar en la tabla',
    focusShortcut: 'Ir a la búsqueda'
  },
  tableSortButton: {
    ascending: 'Orden ascendente',
    descending: 'Orden descendente',
    unsorted: 'Ordenar columna'
  },
  tabs: {
    close: 'Cerrar pestaña',
    unsaved: 'Cambios sin guardar'
  },
  tagEditor: {
    label: 'Etiquetas',
    key: 'Clave',
    value: 'Valor',
    keyPlaceholder: 'Ingresa la clave',
    valuePlaceholder: 'Ingresa el valor',
    add: 'Agregar etiqueta',
    remove: 'Quitar etiqueta',
    undo: 'Deshacer',
    undoLabel: 'Deshacer la eliminación de la etiqueta {index}',
    markedForRemoval: 'Esta etiqueta se eliminará cuando guardes.',
    emptyTitle: 'No hay etiquetas asociadas al recurso.',
    remaining: {
      one: 'Puedes agregar {count} etiqueta más.',
      other: 'Puedes agregar {count} etiquetas más.'
    },
    limitReached: 'Alcanzaste el límite de {limit} etiquetas.',
    keyRequired: 'Ingresa una clave.',
    keyDuplicate: 'Otra etiqueta ya usa esta clave.',
    keyReserved: 'Las claves no pueden empezar con "{prefix}".',
    keyInvalid: 'Usa solo letras, números, espacios y + - = . _ : / @.',
    tooLong: 'Usa {max} caracteres o menos.'
  },
  themeSwitcher: {
    label: 'Tema',
    system: 'Sistema',
    dark: 'Oscuro',
    light: 'Claro'
  },
  timeline: {
    label: 'Actividad',
    loading: 'Cargando actividad'
  },

  countdown: {
    label: '{label}:',
    dueIn: 'Vence en {duration}',
    due: 'Vence {relative}',
    overdue: 'Vencido hace {duration}',
    duration: '{major} {minor}',
    expiresIn: 'Caduca en {duration}',
    expires: 'Caduca {relative}',
    expired: 'Caducó {relative}',
    paused: 'En pausa'
  },
  timestamp: {
    title: 'Detalles de la marca de tiempo',
    utc: 'UTC',
    local: 'Local',
    browser: 'Tu navegador',
    relative: 'Relativo',
    raw: 'Valor sin procesar',
    copy: 'Copiar {label}',
    justNow: 'justo ahora'
  },
  toast: {
    close: 'Cerrar notificación',
    region: 'Notificaciones ({hotkey})'
  },
  toggleGroup: {
    option: 'Opción {index}'
  },
  trace: {
    label: 'Traza',
    search: 'Buscar spans',
    noMatch: 'Ningún span coincide con “{query}”.',
    clearSearch: 'Borrar búsqueda',
    emptyTitle: 'No hay spans en esta traza.',
    loading: 'Cargando spans',
    details: 'Detalles de {name}',
    close: 'Cerrar',
    copyName: 'Copiar nombre del span',
    service: 'Servicio',
    startedAt: 'Inicio',
    duration: 'Duración',
    share: 'Parte de la traza',
    percent: '{value} %',
    failed: 'Falló',
    running: 'En ejecución',
    attributes: 'Atributos',
    milliseconds: '{value} ms',
    seconds: '{value} s',
    zoom: 'Zoom',
    resetZoom: 'Restablecer zoom',
    zoomStart: 'Inicio del zoom',
    zoomEnd: 'Fin del zoom',
    slowest: 'Más lento',
    criticalPath: 'Ruta crítica',
    view: 'Vista',
    waterfall: 'Cascada',
    timeline: 'Línea de tiempo',
    tree: 'Árbol',
    span: 'Span',
    onCriticalPath: 'En la ruta crítica',
    selfTime: 'Tiempo propio',
    events: 'Eventos',
    eventCount: {
      one: '{count} evento',
      other: '{count} eventos'
    }
  },
  flowDiagram: {
    label: 'Diagrama',
    notBound: 'Sin vincular',
    bind: 'Vincular {kind}',
    change: 'Cambiar {kind}',
    remove: 'Quitar {kind}',
    create: 'Crear {kind}',
    apply: 'Aplicar {kind}',
    cancel: 'Cancelar',
    pending: 'Pendiente',
    existing: 'Existentes',
    noOptions: 'Aún no hay opciones.',
    copy: 'Copiar {field}',
    details: 'Detalles',
    connections: 'Conexiones',
    connection: '{from} a {to}',
    emptyTitle: 'Aún no hay nada conectado.',
    loading: 'Cargando el diagrama'
  },
  tracker: {
    noData: 'Sin datos',
    summary: { one: '{count} periodo', other: '{count} periodos' },
    summaryWorst: {
      one: '{count} periodo. Peor: {label}',
      other: '{count} periodos. Peor: {label}'
    },
    roleDescription: 'historial de estado'
  },
  tree: {
    label: 'Árbol',
    emptyTitle: 'No hay elementos',
    loadingChildren: 'Cargando',
    renameLabel: 'Cambiar el nombre de {label}'
  },
  unsavedChanges: {
    title: 'Cambios sin guardar',
    description: 'Esta página tiene cambios que no guardaste. Si sales ahora, se descartarán.',
    descriptionSavable:
      'Esta página tiene cambios que aún no se guardaron. Guárdalos antes de salir o descártalos y continúa.',
    keepEditing: 'Seguir editando',
    discard: 'Descartar cambios',
    save: 'Guardar cambios'
  },
  tutorialPanel: {
    title: 'Tutoriales',
    description: 'Aprende el producto haciendo una tarea real, paso a paso.',
    listLabel: 'Tutoriales disponibles',
    emptyTitle: 'Aún no hay tutoriales.',
    start: 'Iniciar tutorial',
    restart: 'Reiniciar tutorial',
    exit: 'Salir del tutorial',
    back: 'Volver a los tutoriales',
    completed: 'Completado',
    completedTitle: 'Tutorial completado',
    completedDescription: 'Terminaste {title}.',
    taskCount: { one: '{count} tarea', other: '{count} tareas' },
    stepCount: { one: '{count} paso', other: '{count} pasos' },
    taskComplete: 'Completada',
    taskCurrent: 'Tarea actual',
    taskNotStarted: 'Sin iniciar',
    progress: '{complete} de {total} completadas',
    hotspotLabel: 'Paso del tutorial: {title}',
    hotspotStepOf: 'Paso {current} de {total}',
    hotspotPrevious: 'Anterior',
    hotspotNext: 'Siguiente',
    hotspotFinish: 'Finalizar'
  },
  videoPlayer: {
    label: 'Video',
    play: 'Reproducir',
    pause: 'Pausar',
    seek: 'Buscar',
    seekValue: '{current} de {duration}',
    mute: 'Silenciar',
    volume: 'Volumen',
    captions: 'Subtítulos (CC)',
    captionsShort: 'CC',
    enterFullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    pending: 'Esperando para generar',
    running: 'Generando video',
    error: 'No se pudo cargar el video'
  },
  wizard: {
    stepOf: 'Paso {step} de {total}',
    optional: 'Opcional',
    cancel: 'Cancelar',
    previous: 'Anterior',
    next: 'Siguiente',
    submit: 'Crear'
  },
  paymentBrand: {
    unknown: 'Tarjeta'
  },
  otpInput: {
    label: 'Código de un solo uso'
  },
  consoleShowcaseSection: {
    views: 'Vistas de la consola'
  },
  runtimeApiCloud: {
    label: 'Globales disponibles en Azion Runtime'
  },
  clientStoryColumnsSection: {
    list: 'Historias de clientes',
    story: 'Leer la historia'
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
    saveShortcut: 'Guardar cambios'
  },
  shortcutsDialog: {
    title: 'Atajos de teclado',
    show: 'Mostrar atajos de teclado',
    general: 'General',
    emptyTitle: 'No hay atajos de teclado aquí'
  },
  copyPromptButton: {
    label: 'Copiar prompt',
    copied: 'Copiado',
    worksWith: 'Funciona con {agents}',
    tooltip: 'Copia un prompt de configuración para tu herramienta de IA',
    dismiss: 'Descartar'
  },
  docAgentCard: {
    title: 'Tu agente de IA, fluido en Azion',
    description:
      'Un prompt le enseña la plataforma a cualquier agente de código: los nombres actuales de ' +
      'los productos, la documentación en vivo a través del servidor MCP de Azion y ' +
      'despliegues reales con la CLI.',
    asideTitle: '¿Prefieres la ruta guiada?',
    action: 'Configurar agente'
  },
  common: {
    pauseRotation: 'Pausar rotación',
    resumeRotation: 'Reanudar rotación',
    pauseScrolling: 'Pausar desplazamiento',
    resumeScrolling: 'Reanudar desplazamiento',
    pauseAnimation: 'Pausar animación',
    playAnimation: 'Reproducir animación',
    copy: 'Copiar',
    copied: 'Copiado',
    newTab: '(se abre en una pestaña nueva)'
  },
  newsletterSection: {
    email: 'Correo electrónico'
  },
  dataTable: {
    loadingMore: 'Cargando más filas',
    loadMore: 'Cargar más',
    noMoreRows: 'No hay más filas',
    reorderColumn: 'Orden',
    reorderHandle: 'Reordenar {name}, posición {position} de {total}',
    reorderHint: 'Arrastra, o pulsa Flecha arriba o Flecha abajo para mover.',
    reorderLocked: 'Quita el orden para reordenar las filas.',
    reorderMoved: '{name} movido a la posición {position} de {total}.',
    reorderDropped: '{name} soltado en la posición {position} de {total}.',
    reorderCancelled: 'Reordenación cancelada.'
  }
}
