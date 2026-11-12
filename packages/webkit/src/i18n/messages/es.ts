import type { Messages } from '../types'

export const es: Messages = {
  actionConfirmation: {
    approve: 'Aprobar',
    deny: 'Denegar',
    approved: 'Aprobado',
    denied: 'Denegado',
    expired: 'Solicitud vencida',
    confirmLabel: 'Escribe {phrase} para confirmar'
  },
  aiLoading: {
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
  chatMessage: {
    user: 'Tú',
    assistant: 'Asistente de IA',
    system: 'Sistema',
    labelWithTime: '{author} a las {time}',
    actions: 'Acciones del mensaje',
    error: 'No se pudo generar la respuesta.',
    retry: 'Intentar de nuevo',
    helpful: 'Útil',
    notHelpful: 'No fue útil',
    feedback: 'Valoración de la respuesta',
    feedbackSubmitting: 'Enviando valoración',
    feedbackSubmitted: 'Valoración enviada'
  },
  citation: {
    label: 'Fuente {index}: {title}',
    labelUntitled: 'Fuente {index}'
  },
  conversation: {
    label: 'Conversación',
    scrollToLatest: 'Ir al último mensaje',
    announcement: '{author}: {text}'
  },
  promptInput: {
    label: 'Prompt',
    placeholder: 'Haz una pregunta',
    submit: 'Enviar',
    stop: 'Detener la generación',
    count: '{count}/{max}',
    overLimit: '{count} caracteres por encima del límite'
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
    count: {
      one: '{count} fuente',
      other: '{count} fuentes'
    }
  },
  suggestionGroup: {
    label: 'Prompts sugeridos'
  },
  toolCall: {
    pending: 'En espera',
    running: 'En ejecución',
    success: 'Completado',
    error: 'Falló',
    denied: 'Denegado',
    input: 'Entrada',
    output: 'Salida'
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
  articleIndex: {
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    empty: 'No se encontraron resultados.'
  },
  attributeEditor: {
    add: 'Agregar elemento',
    remove: 'Quitar elemento',
    rowAction: '{label} {index}',
    addGroup: 'Agregar grupo O',
    empty: 'Todavía no hay elementos.',
    remaining: {
      one: 'Puedes agregar {count} elemento más.',
      other: 'Puedes agregar {count} elementos más.'
    },
    limitReached: 'Alcanzaste el límite de {limit} elementos.',
    added: 'Elemento {index} agregado.',
    removed: 'Elemento {index} quitado.',
    group: 'Grupo {index}',
    and: 'y',
    or: 'o'
  },
  avatar: {
    fallbackLabel: 'Avatar del usuario',
    imageAlt: 'Avatar'
  },
  barList: {
    emptyTitle: 'No hay datos disponibles'
  },
  board: {
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
  calendar: {
    placeholder: 'Selecciona un rango de fechas',
    period: 'Período',
    selectPeriod: 'Seleccionar período',
    clear: 'Borrar selección',
    open: 'Abrir calendario',
    chooseDate: 'Elegir fecha',
    apply: 'Aplicar rango',
    presets: 'Atajos',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    start: 'Inicio',
    end: 'Fin',
    date: 'Fecha',
    time: 'Hora',
    startTime: 'Hora de inicio',
    endTime: 'Hora de fin',
    last3Days: 'Últimos 3 días',
    lastWeek: 'Última semana',
    lastMonth: 'Último mes',
    lastQuarter: 'Último trimestre',
    lastYear: 'Último año',
    relativeHints: 'Escribe tiempos relativos',
    fixedHints: 'Escribe fechas fijas',
    rangeSeparators: 'a|hasta',
    timezone: 'Zona horaria',
    localTimezone: 'Local'
  },
  card: {
    byVendor: 'por {vendor}',
    installed: 'Instalado'
  },
  cards: {
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
    rangeSelected: 'Seleccionado de {from} a {to}'
  },
  chartCard: {
    resize: 'Redimensionar tarjeta',
    move: 'Mover tarjeta',
    columns: '{span} de {max} columnas',
    columnsAndHeight: '{columns}, {height} píxeles de alto'
  },
  chip: {
    remove: 'Quitar',
    removeNamed: 'Quitar {label}'
  },
  codeBlock: {
    copy: 'Copiar código'
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
    empty: 'Sin resultados',
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
    empty: 'No se encontraron resultados.',
    placeholder: 'Buscar en todo',
    title: 'Menú de comandos'
  },
  comparisonTable: {
    about: 'Acerca de {capability}'
  },
  confirmDialog: {
    confirm: 'Confirmar',
    cancel: 'Cancelar'
  },
  copyButton: {
    copy: 'Copiar',
    copied: 'Copiado'
  },
  responseBranches: {
    label: 'Versiones de la respuesta',
    previous: 'Versión anterior',
    next: 'Versión siguiente',
    position: '{current} de {total}'
  },
  feedbackReason: {
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
    empty: 'Aún no hay conversaciones.',
    remove: 'Eliminar {title}'
  },
  promptInputMenu: {
    results: {
      one: '{count} sugerencia',
      other: '{count} sugerencias'
    },
    noMatches: 'Sin resultados',
    references: 'Referencias'
  },
  qrCode: {
    label: 'Código QR'
  },
  copyFallback: {
    title: 'Copia manualmente',
    field: 'Valor para copiar',
    hint: 'Pulsa {keys} para copiar.'
  },
  dateRangePicker: {
    label: 'Intervalo de tiempo',
    placeholder: 'Selecciona un intervalo de tiempo',
    dialog: 'Elige un intervalo de tiempo',
    rangeType: 'Tipo de intervalo',
    relative: 'Intervalo relativo',
    absolute: 'Intervalo absoluto',
    quickRanges: 'Intervalos rápidos',
    custom: 'Intervalo personalizado',
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
    apply: 'Aplicar',
    cancel: 'Cancelar',
    previous: 'Intervalo anterior',
    next: 'Intervalo siguiente',
    incomplete: 'Elige un inicio y un fin.',
    order: 'El fin debe ser posterior al inicio.',
    outOfBounds: 'Elige un intervalo dentro de las fechas permitidas.',
    invalidAmount: 'Introduce un número entero mayor que 0.'
  },
  dialog: {
    close: 'Cerrar'
  },
  docFrame: {
    zoom: 'Ver imagen en pantalla completa',
    zoomNamed: 'Ver en pantalla completa: {alt}',
    fullScreen: 'Pantalla completa',
    zoomedImage: 'Imagen en pantalla completa',
    closeFullScreen: 'Cerrar pantalla completa',
    close: 'Cerrar'
  },
  docOnThisPage: {
    title: 'En esta página'
  },
  docPageHeader: {
    lastUpdated: 'Actualizado el'
  },
  docPagination: {
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
    copy: 'Copiar',
    copied: 'Copiado',
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
    required: '(Obligatorio)'
  },
  fileDropzone: {
    title: 'Suelta archivos para subirlos'
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
    showFewer: 'Mostrar menos archivos'
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
    label: 'Pie de página'
  },
  globalHeader: {
    label: 'Encabezado global'
  },
  helpPanel: {
    label: 'Ayuda',
    learnMore: 'Más información',
    taskComplete: 'Completada',
    taskCurrent: 'Tarea actual',
    taskNotStarted: 'Sin iniciar',
    tutorialCompleted: 'Completado',
    tutorialProgress: '{complete} de {total} completadas'
  },
  heroForm: {
    search: 'Buscar',
    empty: 'No se encontraron resultados.'
  },
  hotspot: {
    label: 'Paso del tutorial: {title}',
    stepOf: 'Paso {current} de {total}',
    previous: 'Anterior',
    next: 'Siguiente',
    finish: 'Finalizar'
  },
  keyValuePairs: {
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
    delete: 'Supr'
  },
  label: {
    required: '(Obligatorio)'
  },
  link: {
    label: 'Más información'
  },
  logView: {
    searchPlaceholder: 'Buscar en los registros',
    search: 'Buscar registros',
    loading: 'Cargando…',
    lines: { one: '{count} línea', other: '{count} líneas' },
    warnings: 'Advertencias',
    warningCount: { one: '{count} advertencia', other: '{count} advertencias' },
    gzip: 'gzip:',
    empty: 'Ninguna línea de registro coincide con los filtros actuales.',
    copy: 'Copiar registros',
    copied: 'Registros copiados'
  },
  logoWall: {
    link: 'Leer historia'
  },
  menu: {
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
  miniButton: {
    label: 'Más información'
  },
  navigationMenu: {
    label: 'Principal'
  },
  numberInput: {
    increment: 'Aumentar',
    decrement: 'Disminuir'
  },
  outcomeMark: {
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
    loadMore: 'Cargar {count} más',
    newTab: '(se abre en una pestaña nueva)'
  },
  pagination: {
    label: 'Paginación',
    info: 'Mostrando {start} a {end} de {total} registros',
    previous: 'Página anterior',
    next: 'Página siguiente',
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
    unmet: 'no cumplido'
  },
  phoneInput: {
    dialCode: 'Código de marcación del país',
    search: 'Buscar país',
    empty: 'No se encontró ningún país.'
  },
  pickList: {
    moveSelectedToTarget: 'Mover seleccionados al destino',
    moveAllToTarget: 'Mover todos al destino',
    moveSelectedToSource: 'Mover seleccionados al origen',
    moveAllToSource: 'Mover todos al origen'
  },
  popover: {
    close: 'Cerrar'
  },
  progress: {
    label: 'Progreso'
  },
  propertyFilterQuery: {
    label: 'Consulta',
    placeholder: 'Escribe una consulta, por ejemplo status = Active AND requests > 10',
    fields: 'Campos',
    all: 'Se cumplen todas las condiciones',
    any: 'Se cumple cualquier condición',
    unknownField: 'No hay ningún campo llamado “{field}”.',
    unknownOperator: '“{operator}” no se aplica a {field}.',
    missingOperator: 'Añade un operador después de {field}, por ejemplo =.',
    missingValue: 'Añade un valor después de {operator}.',
    expectedConnective: 'Une las condiciones con AND u OR antes de “{word}”.',
    danglingConnective: 'Añade una condición después de {connective}.',
    unclosedQuote: 'Cierra las comillas abiertas en el carácter {position}.'
  },
  propertyFilter: {
    label: 'Filtrar',
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
    lessOrEqual: 'Menor o igual que'
  },
  resizable: {
    handle: 'Redimensionar panel'
  },
  schemaForm: {
    required: 'Este campo es obligatorio.',
    minLength: 'Usa al menos {min} caracteres.',
    maxLength: 'Usa como máximo {max} caracteres.',
    pattern: 'Este valor no sigue el formato esperado.',
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
    jsonPlaceholder: 'Un valor JSON'
  },
  sectionHeader: {
    copyLink: 'Copiar enlace a la sección {title}',
    linkCopied: 'Enlace copiado'
  },
  settingsSection: {
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
  siteFooter: {
    label: 'Pie de página',
    home: 'Página de inicio de Azion',
    language: 'Idioma'
  },
  siteNav: {
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
  storyLibrary: {
    search: 'Buscar',
    searchFacet: 'Buscar {facet}',
    empty: 'No se encontraron resultados.'
  },
  table: {
    selectAll: 'Seleccionar todas las filas',
    selectRow: 'Seleccionar fila',
    emptyTitle: 'Aún no hay resultados',
    emptyDescription: 'Empieza creando tu primer recurso.'
  },
  tableAppliedFilters: {
    contains: 'contiene',
    notContains: 'no contiene',
    startsWith: 'empieza con',
    endsWith: 'termina con',
    in: 'en',
    notIn: 'no está en',
    isEmpty: 'está vacío',
    isNotEmpty: 'no está vacío'
  },
  tableColumnSelector: {
    title: 'Columnas',
    empty: 'No hay columnas que se puedan ocultar.'
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
    eq: 'es',
    neq: 'no es',
    contains: 'contiene',
    notContains: 'no contiene',
    startsWith: 'empieza con',
    endsWith: 'termina con',
    gt: 'mayor que',
    gte: 'al menos',
    lt: 'menor que',
    lte: 'como máximo',
    in: 'en',
    notIn: 'no está en',
    isEmpty: 'está vacío',
    isNotEmpty: 'no está vacío'
  },
  tableHeadCell: {
    resize: 'Redimensionar columna'
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
    newTab: 'Abrir {label} en una pestaña nueva',
    newTabHint: '(se abre en una pestaña nueva)',
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
  tableReorder: {
    column: 'Orden',
    handle: 'Reordenar {name}, posición {position} de {total}',
    hint: 'Arrastra, o pulsa Flecha arriba o Flecha abajo para mover.',
    locked: 'Quita el orden para reordenar las filas.',
    moved: '{name} movido a la posición {position} de {total}.',
    dropped: '{name} soltado en la posición {position} de {total}.',
    cancelled: 'Reordenación cancelada.'
  },
  tableSearch: {
    placeholder: 'Buscar'
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
    empty: 'No hay etiquetas asociadas al recurso.',
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
  toast: {
    close: 'Cerrar notificación'
  },
  toggleGroup: {
    option: 'Opción {index}'
  },
  trace: {
    label: 'Traza',
    search: 'Buscar spans',
    noMatch: 'Ningún span coincide con “{query}”.',
    clearSearch: 'Borrar búsqueda',
    empty: 'No hay spans en esta traza.',
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
    seconds: '{value} s'
  },
  topologyDiagram: {
    label: 'Topología de despliegue',
    notBound: 'Sin vincular',
    bind: 'Vincular {kind}',
    change: 'Cambiar {kind}',
    remove: 'Quitar {kind}',
    create: 'Crear {kind}',
    existing: 'Existentes',
    noOptions: 'Aún no hay opciones.',
    copy: 'Copiar {field}',
    empty: 'Aún no hay nada conectado.',
    loading: 'Cargando la topología'
  },
  tracker: {
    noData: 'Sin datos',
    roleDescription: 'historial de estado'
  },
  tree: {
    emptyTitle: 'No hay elementos'
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
    empty: 'Aún no hay tutoriales.',
    start: 'Iniciar tutorial',
    restart: 'Reiniciar tutorial',
    exit: 'Salir del tutorial',
    back: 'Volver a los tutoriales',
    completed: 'Completado',
    completedTitle: 'Tutorial completado',
    completedDescription: 'Terminaste {title}.',
    taskCount: { one: '{count} tarea', other: '{count} tareas' },
    stepCount: { one: '{count} paso', other: '{count} pasos' }
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
  consolePanel: {
    views: 'Vistas de la consola'
  },
  customerSpotlight: {
    list: 'Historias de clientes',
    story: 'Leer la historia'
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
    worksWith: 'Funciona con {agents}'
  },
  docAgentCard: {
    title: 'Tu agente de IA, fluido en Azion',
    description:
      'Un prompt le enseña la plataforma a cualquier agente de código: los nombres actuales de los productos, la documentación en vivo a través del servidor MCP de Azion y despliegues reales con la CLI.',
    asideTitle: '¿Prefieres la ruta guiada?',
    action: 'Configurar agente'
  }
}
