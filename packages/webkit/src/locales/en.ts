export const alert = {
  close: 'Close message'
} as const

export const appLayout = {
  navigation: 'Navigation',
  tools: 'Help',
  closeTools: 'Close help',
  splitPanel: 'Details',
  closeSplitPanel: 'Close panel',
  resizeSplitPanel: 'Resize panel',
  showAtSide: 'Show beside the content',
  showAtBottom: 'Show under the content'
} as const

export const articleBodySection = {
  linkCopied: 'Link copied',
  copiedFeed: 'Feed link copied',
  copiedPage: 'Page copied as markdown',
  copyFailed: 'Could not copy',
  copyFailedHint: 'Your browser blocked clipboard access.',
  assistantPrompt: 'Read {url} so I can ask questions about it.'
} as const

export const articleIndexSection = {
  search: 'Search',
  searchFacet: 'Search {facet}',
  noMatch: 'No results found.',
  results: {
    one: '{count} result',
    other: '{count} results'
  }
} as const

export const attributeEditor = {
  add: 'Add new item',
  remove: 'Remove item',
  rowAction: '{label} {index}',
  addGroup: 'Add OR group',
  emptyTitle: 'No items yet.',
  remaining: {
    one: 'You can add {count} more item.',
    other: 'You can add {count} more items.'
  },
  limitReached: 'You have reached the limit of {limit} items.',
  added: 'Item {index} added.',
  removed: 'Item {index} removed.',
  group: 'Group {index}',
  and: 'and',
  or: 'or',
  reorder: 'Reorder item {index}',
  reorderHint: 'Drag, or press Arrow Up or Arrow Down to move.',
  moveUp: 'Move item {index} up',
  moveDown: 'Move item {index} down',
  moved: 'Item {from} moved to position {to}.',
  reorderGroup: 'Reorder group {index}',
  moveGroupUp: 'Move group {index} up',
  moveGroupDown: 'Move group {index} down',
  groupMoved: 'Group {from} moved to position {to}.'
} as const

export const avatar = {
  fallbackLabel: 'User avatar',
  imageAlt: 'Avatar'
} as const

export const avatarGroup = {
  people: {
    one: '{count} person',
    other: '{count} people'
  },
  more: {
    one: '{count} more person',
    other: '{count} more people'
  }
} as const

export const barList = {
  emptyTitle: 'No data available',
  errorTitle: 'Could not load the data'
} as const

export const dashboardGrid = {
  label: 'Dashboard',
  item: 'Item {position}',
  moved: '{label} moved to position {position} of {total}.',
  resized: '{label} resized to {span} of {columns} columns.',
  resizedWithHeight: '{label} resized to {span} of {columns} columns, {height} pixels tall.'
} as const

export const breadcrumb = {
  label: 'Breadcrumb',
  showHidden: 'Show pages in between'
} as const

export const browserFrame = {
  preview: 'Preview',
  copyAddress: 'Copy address',
  resizeWidth: 'Resize preview width',
  resizeHeight: 'Resize preview height',
  widthValue: '{value} pixels wide',
  heightValue: '{value} pixels tall'
} as const

export const buttonGroup = {
  moreActions: 'More actions',
  pressed: 'On'
} as const

export const integrationCard = {
  byVendor: 'by {vendor}',
  installed: 'Installed'
} as const

export const cardList = {
  label: 'Items',
  selectAll: 'Select all items',
  emptyTitle: 'No items yet',
  emptyDescription: 'Items you create show here.'
} as const

export const carousel = {
  next: 'Next slide',
  previous: 'Previous slide',
  roleDescription: 'carousel'
} as const

export const chart = {
  emptyTitle: 'No data available',
  noData: 'no data',
  label: 'Label',
  roleDescription: 'chart',
  summary: '{series} series over {points} points{range}.',
  summaryRange: ', from {from} to {to}',
  otherSeries: 'Other',
  rangeDraft: 'Selecting from {from} to {to}',
  rangeSelected: 'Selected from {from} to {to}',
  total: 'Total',
  reference: 'Reference',
  referenceLine: '{label} at {value}.',
  referenceBand: '{label} from {from} to {to}.'
} as const

export const chartCard = {
  resize: 'Resize card',
  move: 'Move card',
  moveVerb: 'Move',
  moveHint: 'Use the arrow keys to move the card.',
  moved: 'Moved to position {position} of {total}',
  columns: '{span} of {max} columns',
  columnsAndHeight: '{columns}, {height} pixels tall'
} as const

export const chip = {
  remove: 'Remove',
  removeNamed: 'Remove {label}'
} as const

export const codeBlock = {
  copy: 'Copy code',
  output: 'Output',
  added: 'Added',
  removed: 'Removed',
  original: 'Original',
  modified: 'Modified'
} as const

export const codeEditor = {
  label: 'Code editor',
  original: 'Original',
  modified: 'Modified',
  problems: 'Problems',
  problemCount: {
    zero: 'No problems',
    one: '{count} problem',
    other: '{count} problems'
  },
  line: 'Line {line}',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  loading: 'Loading the full editor…',
  loadFailed: 'The full editor could not load. You can keep editing here.',
  tabHint: 'Press Escape, then Tab, to leave the editor.'
} as const

export const collectionPreferences = {
  trigger: 'Preferences',
  title: 'Preferences',
  confirm: 'Confirm',
  cancel: 'Cancel',
  pageSize: 'Page size',
  pageSizeOption: {
    one: '{count} item',
    other: '{count} items'
  },
  columns: 'Columns',
  columnsDescription: 'Choose which columns show, and their order.',
  alwaysShown: 'Always shown',
  moveUp: 'Move {column} up',
  moveDown: 'Move {column} down',
  display: 'Display',
  wrapLines: 'Wrap lines',
  wrapLinesDescription: 'Show the whole text of every cell.',
  striped: 'Striped rows',
  stripedDescription: 'Shade every other row.',
  density: 'Density',
  comfortable: 'Comfortable',
  compact: 'Compact'
} as const

export const combobox = {
  noMatch: 'No matches',
  loading: 'Loading options',
  useValue: 'Use "{value}"',
  clear: 'Clear',
  suggestions: 'Suggestions',
  count: {
    one: '{count} option',
    other: '{count} options'
  }
} as const

export const command = {
  back: 'Back from {page}',
  noMatch: 'No results found.',
  placeholder: 'Search everything',
  title: 'Command menu'
} as const

export const planComparisonSection = {
  about: 'About {label}',
  search: 'Search',
  searchPicker: 'Search {picker}',
  noMatch: 'No results found.',
  included: 'Included',
  excluded: 'Not included'
} as const

export const competitorComparisonSection = {
  about: 'About {capability}'
} as const

export const confirmDialog = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  typeToConfirm: 'Type {phrase} to confirm.'
} as const

export const copyButton = {
  fallbackTitle: 'Copy manually',
  fallbackField: 'Value to copy',
  fallbackHint: 'Press {keys} to copy.'
} as const

export const copyText = {
  copy: 'Copy {value}'
} as const

export const responseBranches = {
  label: 'Response versions',
  previous: 'Previous version',
  next: 'Next version',
  position: '{current}/{total}',
  positionLabel: 'Version {current} of {total}'
} as const

export const feedbackReasonDialog = {
  title: 'What went wrong?',
  description: 'Your answer helps improve future responses.',
  reason: 'Reason',
  details: 'Details (optional)',
  detailsPlaceholder: 'What did you expect instead?',
  required: 'Choose a reason.',
  cancel: 'Cancel',
  send: 'Send feedback',
  inaccurate: 'Inaccurate or made up',
  notHelpful: 'Not helpful',
  ignoredRequest: 'Did not follow my request',
  unsafe: 'Unsafe or harmful',
  other: 'Other'
} as const

export const conversationHistory = {
  label: 'Conversation history',
  today: 'Today',
  yesterday: 'Yesterday',
  previous7: 'Previous 7 days',
  previous30: 'Previous 30 days',
  older: 'Older',
  emptyTitle: 'No conversations yet.',
  emptyDescription: 'Your chats with the assistant appear here after you ask it something.',
  delete: 'Delete {title}',
  newChat: 'New chat',
  search: 'Search conversations',
  noMatch: 'No conversations match “{query}”.'
} as const

export const qrCode = {
  label: 'QR code'
} as const

export const datePicker = {
  placeholder: 'Select a date',
  clear: 'Clear selection',
  open: 'Open calendar',
  chooseDate: 'Choose date',
  apply: 'Apply',
  cancel: 'Cancel',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  month: 'Month',
  year: 'Year',
  start: 'Start',
  end: 'End',
  date: 'Date',
  time: 'Time',
  startTime: 'Start time',
  endTime: 'End time',
  timezone: 'Timezone',
  localTimezone: 'Local',
  example: 'e.g. {value}',
  timePlaceholder: 'hh:mm'
} as const

export const dateRangePicker = {
  label: 'Time range',
  placeholder: 'Select a time range',
  dialog: 'Choose a time range',
  rangeType: 'Range type',
  relative: 'Relative',
  absolute: 'Absolute',
  quickRanges: 'Quick ranges',
  custom: 'Custom range',
  showQuickRanges: 'Back to quick ranges',
  amount: 'Duration',
  unit: 'Unit',
  second: {
    one: 'Last second',
    other: 'Last {count} seconds'
  },
  minute: {
    one: 'Last minute',
    other: 'Last {count} minutes'
  },
  hour: {
    one: 'Last hour',
    other: 'Last {count} hours'
  },
  day: {
    one: 'Last day',
    other: 'Last {count} days'
  },
  week: {
    one: 'Last week',
    other: 'Last {count} weeks'
  },
  month: {
    one: 'Last month',
    other: 'Last {count} months'
  },
  year: {
    one: 'Last year',
    other: 'Last {count} years'
  },
  unitSecond: 'Seconds',
  unitMinute: 'Minutes',
  unitHour: 'Hours',
  unitDay: 'Days',
  unitWeek: 'Weeks',
  unitMonth: 'Months',
  unitYear: 'Years',
  today: 'Today',
  thisWeek: 'This week',
  thisMonth: 'This month',
  thisYear: 'This year',
  now: 'now',
  untilNow: 'End at now',
  enterDates: 'Enter dates',
  showCalendar: 'Show calendar',
  refreshEvery: 'Refresh every',
  refreshOff: 'Off',
  refreshSecond: {
    one: 'refreshes every second',
    other: 'refreshes every {count} seconds'
  },
  refreshMinute: {
    one: 'refreshes every minute',
    other: 'refreshes every {count} minutes'
  },
  refreshHour: {
    one: 'refreshes every hour',
    other: 'refreshes every {count} hours'
  },
  apply: 'Apply',
  cancel: 'Cancel',
  previous: 'Previous range',
  next: 'Next range',
  incomplete: 'Choose a start and an end.',
  order: 'The end must be after the start.',
  outOfBounds: 'Choose a range inside the allowed dates.',
  tooLong: 'Choose a range of {duration} or less.',
  invalidAmount: 'Enter a whole number greater than 0.'
} as const

export const dialog = {
  close: 'Close'
} as const

export const docFrame = {
  zoom: 'View image full screen',
  zoomNamed: 'View full screen: {alt}',
  pauseNamed: 'Pause animation: {alt}',
  playNamed: 'Play animation: {alt}',
  fullScreen: 'Full screen',
  zoomedImage: 'Image, full screen',
  closeFullScreen: 'Close full screen',
  close: 'Close'
} as const

export const docTableOfContents = {
  title: 'On this page'
} as const

export const docPageHeader = {
  lastUpdated: 'Last updated'
} as const

export const docPreviousNext = {
  label: 'Page navigation',
  previous: 'Previous',
  next: 'Next'
} as const

export const docPrompt = {
  showLess: 'Show less',
  showMore: 'Show more',
  copy: 'Copy prompt',
  copied: 'Prompt copied'
} as const

export const docProse = {
  copyManually: 'Press {shortcut} to copy'
} as const

export const donutChart = {
  total: 'Total',
  emptyTitle: 'No data available',
  summary: { one: '{count} slice, {total} in total.', other: '{count} slices, {total} in total.' },
  name: 'Name',
  value: 'Value',
  share: 'Share',
  roleDescription: 'chart',
  otherSeries: 'Other'
} as const

export const gaugeChart = {
  emptyTitle: 'No data available',
  valueWithStatus: '{value}, {status}',
  range: 'Range {min} to {max}'
} as const

export const mapChart = {
  emptyTitle: 'No data available',
  roleDescription: 'map',
  name: 'Name',
  value: 'Value',
  summary: {
    one: '{count} place on the map, {total} in total.',
    other: '{count} places on the map, {total} in total.'
  },
  legend: 'From {min} to {max}'
} as const

export const drawer = {
  close: 'Close'
} as const

export const errorBoundary = {
  title: 'This section failed to load',
  description:
    'Something went wrong while showing this part of the page. The rest of the page still works.',
  retry: 'Try again'
} as const

export const field = {
  required: 'Required'
} as const

export const fileDropzone = {
  title: 'Drop files to upload',
  touchTitle: 'Choose files to upload'
} as const

export const audioPlayer = {
  label: 'Audio player',
  play: 'Play',
  pause: 'Pause',
  seek: 'Seek',
  position: '{current} of {total}',
  mute: 'Mute',
  unmute: 'Unmute',
  volume: 'Volume',
  rate: '{rate}×',
  speed: 'Playback speed {rate}',
  download: 'Download audio',
  downloadTitle: 'Download {title}',
  loading: 'Loading audio',
  error: 'The audio could not play.',
  transcript: 'Transcript'
} as const

export const filePreview = {
  download: 'Download',
  loading: 'Loading preview',
  contents: 'Contents of {name}',
  noPreview: 'No preview for this file type',
  noPreviewDetail: 'Download the file to open it.',
  error: 'The preview could not load',
  empty: 'This file is empty.',
  document: 'Preview of {name}',
  truncated: 'Showing the first {shown} characters. Download the file to see all of it.'
} as const

export const imageGallery = {
  label: 'Images',
  image: 'Image {position} of {total}',
  position: '{position} of {total}',
  previous: 'Previous image',
  next: 'Next image',
  download: 'Download',
  loading: 'Generating images',
  ready: 'Images ready',
  error: 'The images could not load',
  broken: 'This image could not load',
  empty: 'No images'
} as const

export const fileTokenGroup = {
  label: 'Files',
  remove: 'Remove {name}',
  uploading: 'Uploading {name}',
  modified: 'Modified {date}',
  showMore: {
    one: 'Show {count} more file',
    other: 'Show {count} more files'
  },
  showLess: 'Show fewer files'
} as const

export const filterMenu = {
  label: 'Filter',
  triggerCount: {
    one: '{label}, {count} applied',
    other: '{label}, {count} applied'
  },
  searchFields: 'Filter by…',
  searchFieldsLabel: 'Search filter fields',
  searchValues: 'Filter {field}…',
  searchValuesLabel: 'Search {field} values',
  back: 'Back to all filters',
  backToPeriods: 'Back to date periods',
  noMatch: 'No match for “{query}”.',
  clear: 'Clear {field}',
  last24Hours: 'Last 24 hours',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  last3Months: 'Last 3 months',
  customRange: 'Custom range…',
  pickRange: 'Pick a range',
  rangeBetween: '{start} – {end}',
  rangeSince: 'Since {date}',
  rangeUntil: 'Until {date}',
  more: '+{count}',
  moreValues: {
    one: '{count} more value. Type to narrow the list.',
    other: '{count} more values. Type to narrow the list.'
  },
  applied: 'Applied filters'
} as const

export const uploadProgress = {
  label: 'File transfers',
  uploading: {
    one: 'Uploading {done} of {count} file',
    other: 'Uploading {done} of {count} files'
  },
  moving: {
    one: 'Moving {done} of {count} file',
    other: 'Moving {done} of {count} files'
  },
  deleting: {
    one: 'Deleting {done} of {count} file',
    other: 'Deleting {done} of {count} files'
  },
  uploaded: {
    one: '{count} file uploaded',
    other: '{count} files uploaded'
  },
  moved: {
    one: '{count} file moved',
    other: '{count} files moved'
  },
  deleted: {
    one: '{count} file deleted',
    other: '{count} files deleted'
  },
  failed: {
    one: '{count} failed',
    other: '{count} failed'
  },
  queued: 'Waiting',
  done: 'Done',
  canceled: 'Canceled',
  cancelAll: 'Cancel all',
  cancelItem: 'Cancel {name}',
  retryItem: 'Retry {name}',
  retryFailed: 'Retry failed',
  close: 'Close',
  expand: 'Show files',
  collapse: 'Hide files',
  itemProgress: '{name} progress'
} as const

export const footer = {
  label: 'Footer',
  home: 'Azion home'
} as const

export const appHeader = {
  label: 'Global header',
  home: 'Azion home',
  productHome: 'Azion {product} home',
  account: 'Account menu'
} as const

export const helpPanel = {
  label: 'Help',
  learnMore: 'Learn more'
} as const

export const hint = {
  label: 'More information'
} as const

export const heroSection = {
  carouselLabel: 'Proven on mission-critical workloads'
} as const

export const heroFormSection = {
  search: 'Search',
  noMatch: 'No results found.'
} as const

export const keyValueList = {
  notSet: 'Not set'
} as const

export const kbd = {
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  escape: 'Esc',
  enter: 'Enter',
  space: 'Space',
  tab: 'Tab',
  backspace: 'Backspace',
  delete: 'Del',
  return: '↵',
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→'
} as const

export const languageSelect = {
  label: 'Language',
  search: 'Search language',
  noMatch: 'No language found.'
} as const

export const link = {
  label: 'Learn more'
} as const

export const listingIndexSection = {
  filters: 'Filters',
  filtersApplied: '{label} ({count})',
  search: 'Search',
  searchFacet: 'Search {facet}',
  noMatch: 'No results found.'
} as const

export const logViewer = {
  searchPlaceholder: 'Find in logs',
  search: 'Search logs',
  loading: 'Loading…',
  lines: { one: '{count} line', other: '{count} lines' },
  gzip: 'gzip:',
  empty: 'No log lines match the current filters.',
  noLines: 'No log lines yet.',
  noMatch: 'No line matches “{query}”.',
  clearSearch: 'Clear search',
  copy: 'Copy logs',
  copied: 'Copied logs',
  levels: 'Log levels',
  levelCount: { one: '{level}, {count} line', other: '{level}, {count} lines' },
  stepsView: 'Log view',
  stepsPhased: 'Phased',
  stepsComplete: 'Complete',
  stepsProgress: 'Run progress',
  stepsWaiting: 'Waiting to start…',
  stepsNeverRan: 'Never ran.',
  stepDone: 'Done',
  stepFailed: 'Failed',
  stepSkipped: 'Skipped',
  stepRunning: 'Running',
  stepPending: 'Not started'
} as const

export const logoWall = {
  link: 'Read story'
} as const

export const sidebarMenu = {
  label: 'Menu',
  back: 'Back',
  backTo: 'Back to {label}',
  open: 'Open submenu',
  openNamed: 'Open {label} menu',
  collapse: 'Collapse',
  collapseNamed: 'Collapse {label}',
  expand: 'Expand',
  expandNamed: 'Expand {label}'
} as const

export const multiSelect = {
  noMatch: 'No matches',
  loading: 'Loading options',
  add: 'Add "{value}"',
  more: '+{count} more',
  count: {
    one: '{count} option',
    other: '{count} options'
  }
} as const

export const navigationMenu = {
  label: 'Main'
} as const

export const numberInput = {
  increment: 'Increment',
  decrement: 'Decrement'
} as const

export const outcomeIcon = {
  success: 'Succeeded',
  danger: 'Failed',
  warning: 'Needs attention',
  neutral: 'Not set'
} as const

export const overflowCount = {
  noun: {
    one: 'item',
    other: 'items'
  },
  summary: '{count} {noun}',
  paged: '{shown} of {count} {noun}',
  showAll: 'Show all {count} {noun}',
  search: 'Search',
  noMatch: 'Nothing matches “{query}”',
  loadMore: 'Load {count} more'
} as const

export const pagination = {
  label: 'Pagination',
  info: 'Showing {start} to {end} of {total} entries',
  previous: 'Previous page',
  next: 'Next page',
  page: 'Page {page}',
  pageSize: 'Rows per page'
} as const

export const passwordInput = {
  hide: 'Hide password',
  show: 'Show password'
} as const

export const passwordRequirements = {
  title: 'Must contain:',
  length: '8-128 characters',
  uppercase: 'Uppercase letter',
  special: 'Special character',
  number: 'Number',
  lowercase: 'Lowercase letter',
  met: 'met',
  unmet: 'not met',
  progress: '{met} of {total} requirements met'
} as const

export const phoneInput = {
  dialCode: 'Country dial code',
  search: 'Search country',
  noMatch: 'No country found.',
  results: {
    one: '{count} country',
    other: '{count} countries'
  }
} as const

export const transferList = {
  moveSelectedToTarget: 'Move selected to target',
  moveAllToTarget: 'Move all to target',
  moveSelectedToSource: 'Move selected to source',
  moveAllToSource: 'Move all to source',
  emptyTitle: 'No items'
} as const

export const popover = {
  close: 'Close'
} as const

export const progress = {
  label: 'Progress'
} as const

export const propertyFilter = {
  label: 'Filter',
  focusShortcut: 'Focus search',
  placeholder: 'Filter by property or text',
  suggestions: 'Suggestions',
  useText: 'Use: “{text}”',
  properties: 'Properties',
  operators: 'Operators',
  values: 'Values',
  tokens: 'Applied filters',
  operation: 'Combine filters',
  matchAll: 'Match all',
  matchAny: 'Match any',
  and: 'and',
  or: 'or',
  clear: 'Clear filters',
  removeToken: 'Remove filter {token}',
  matches: {
    one: '{count} match',
    other: '{count} matches'
  },
  equals: 'Equals',
  notEquals: 'Does not equal',
  contains: 'Contains',
  notContains: 'Does not contain',
  startsWith: 'Starts with',
  notStartsWith: 'Does not start with',
  greater: 'Greater than',
  less: 'Less than',
  greaterOrEqual: 'Greater than or equal to',
  lessOrEqual: 'Less than or equal to',
  equality: 'Equality',
  comparison: 'Comparison',
  textMatch: 'Text match',
  addGroup: 'Add group',
  newGroup: 'New group',
  group: 'Filter group {index}',
  groupOperation: 'Combine filters in group {index}',
  loadingValues: 'Loading values',
  valuesError: 'Could not load values',
  valueEditor: 'Value of {property}',
  queryLabel: 'Query',
  queryPlaceholder: 'Type a query, for example status = Active AND requests > 10',
  queryFields: 'Fields',
  queryAll: 'Every condition matches',
  queryAny: 'Any condition matches',
  unknownField: 'There is no field named “{field}”.',
  unknownOperator: '“{operator}” does not apply to {field}.',
  missingOperator: 'Add an operator after {field}, for example =.',
  missingValue: 'Add a value after {operator}.',
  expectedConnective: 'Join conditions with AND or OR before “{word}”.',
  danglingConnective: 'Add a condition after {connective}.',
  unclosedQuote: 'Close the quote that opens at character {position}.'
} as const

export const resizable = {
  handle: 'Resize panel'
} as const

export const schemaForm = {
  required: 'This field is required.',
  minLength: 'Use at least {min} characters.',
  maxLength: 'Use at most {max} characters.',
  pattern: "This value doesn't match the expected format.",
  patternRule: 'Check the format: {rule}',
  minimum: 'Enter {min} or more.',
  maximum: 'Enter {max} or less.',
  number: 'Enter a number.',
  integer: 'Enter a whole number.',
  enum: 'Choose one of the options.',
  minItems: 'Add at least {min} values.',
  maxItems: 'Add at most {max} values.',
  listItem: 'Line {line}: {message}',
  json: 'Enter valid JSON.',
  selectPlaceholder: 'Select an option',
  numberPlaceholder: 'A number',
  numberFrom: 'From {min}',
  listPlaceholder: 'One value per line',
  jsonPlaceholder: 'A JSON value',
  email: 'Enter a valid email address.',
  uri: 'Enter a full URL, such as https://example.com.',
  date: 'Enter a date as YYYY-MM-DD.',
  datePlaceholder: 'YYYY-MM-DD',
  searchPlaceholder: 'Search',
  optionsError: "Couldn't load the options.",
  writeOnlyPlaceholder: 'Leave empty to keep the current value',
  item: 'Item {index}',
  advanced: 'Advanced settings',
  mapKey: 'Key',
  mapValue: 'Value',
  duplicateKey: 'Each key must be unique.'
} as const

export const subheader = {
  copyLink: 'Copy link to the {title} section',
  linkCopied: 'Link copied'
} as const

export const settingsGroup = {
  copyLink: 'Copy link to the {title} section',
  linkCopied: 'Link copied'
} as const

export const severityTag = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info'
} as const

export const sidebar = {
  label: 'Sidebar',
  collapse: 'Collapse sidebar',
  expand: 'Expand sidebar',
  resize: 'Resize sidebar',
  expandByDragging: '{label} by dragging'
} as const

export const siteFooterSection = {
  label: 'Footer',
  home: 'Azion home',
  language: 'Language'
} as const

export const siteHeaderSection = {
  open: 'Open navigation',
  home: 'Azion home',
  search: 'Search',
  menu: 'Menu'
} as const

export const splitButton = {
  moreActions: 'More actions',
  moreActionsFor: 'More actions for {label}'
} as const

export const statTile = {
  noValue: 'No value',
  noData: 'No data',
  loadError: "Couldn't load",
  better: 'better',
  worse: 'worse',
  unchanged: 'unchanged'
} as const

export const statusIndicator = {
  label: 'Status'
} as const

export const stepper = {
  label: 'Steps',
  error: 'Needs attention',
  loading: 'In progress',
  current: 'Current step',
  complete: 'Completed',
  upcoming: 'Not started'
} as const

export const storyIndexSection = {
  search: 'Search',
  searchFacet: 'Search {facet}',
  noMatch: 'No results found.',
  filters: 'Filters',
  filtersApplied: '{label} ({count})'
} as const

export const dataGrid = {
  selectAll: 'Select all rows',
  selectRow: 'Select row {row}',
  resize: 'Resize {column}',
  invalidNumber: 'Enter a number',
  emptyTitle: 'No rows yet',
  emptyDescription: 'Add a row to start editing.',
  pasted: { one: 'Pasted {count} cell', other: 'Pasted {count} cells' },
  pastedSkipped: {
    one: 'Pasted {count} cell, {skipped} skipped',
    other: 'Pasted {count} cells, {skipped} skipped'
  },
  pasteReadonly: 'Read-only, nothing pasted',
  true: 'Yes',
  false: 'No'
} as const

export const table = {
  selectAll: 'Select all rows',
  selectRow: 'Select row {row}',
  emptyTitle: 'No data yet',
  emptyDescription: 'Rows appear here once there is data to show.',
  errorTitle: 'Could not load the data'
} as const

export const tableExportButton = {
  label: 'Export CSV'
} as const

export const tableHeadCell = {
  sortBy: 'Sort by'
} as const

export const tableRefreshButton = {
  label: 'Refresh'
} as const

export const tableCellActions = {
  label: 'Row actions',
  labelFor: 'Actions for {name}'
} as const

export const tableCellId = {
  copy: 'Copy ID',
  copyResource: 'Copy {resource} ID'
} as const

export const tableCellLink = {
  open: 'Open {label}',
  openIn: 'Open {label} in {destination}',
  openInNewTab: 'Open {label} in a new tab',
  copy: 'Copy {label}'
} as const

export const tableCellTags = {
  noun: {
    one: 'tag',
    other: 'tags'
  }
} as const

export const tableCellTime = {
  justNow: 'just now'
} as const

export const tableLiveButton = {
  label: 'Live'
} as const

export const tableSearch = {
  placeholder: 'Search',
  label: 'Search the table',
  focusShortcut: 'Focus search'
} as const

export const tableSortButton = {
  ascending: 'Sorted ascending',
  descending: 'Sorted descending',
  unsorted: 'Sort column'
} as const

export const tabs = {
  close: 'Close tab',
  unsaved: 'Unsaved changes'
} as const

export const tagEditor = {
  label: 'Tags',
  key: 'Key',
  value: 'Value',
  keyPlaceholder: 'Enter key',
  valuePlaceholder: 'Enter value',
  add: 'Add new tag',
  remove: 'Remove tag',
  undo: 'Undo',
  undoLabel: 'Undo removal of tag {index}',
  markedForRemoval: 'This tag will be removed when you save.',
  emptyTitle: 'No tags associated with the resource.',
  remaining: {
    one: 'You can add {count} more tag.',
    other: 'You can add {count} more tags.'
  },
  limitReached: 'You have reached the limit of {limit} tags.',
  keyRequired: 'Enter a key.',
  keyDuplicate: 'This key is already used by another tag.',
  keyReserved: 'Keys cannot start with "{prefix}".',
  keyInvalid: 'Use letters, numbers, spaces and + - = . _ : / @ only.',
  tooLong: 'Use {max} characters or fewer.'
} as const

export const themeSwitcher = {
  label: 'Theme',
  system: 'System',
  dark: 'Dark',
  light: 'Light'
} as const

export const timestamp = {
  title: 'Timestamp details',
  utc: 'UTC',
  local: 'Local',
  browser: 'Your browser',
  relative: 'Relative',
  raw: 'Raw value',
  copy: 'Copy {label}',
  justNow: 'just now'
} as const

export const toast = {
  close: 'Close notification',
  region: 'Notifications ({hotkey})'
} as const

export const toggleGroup = {
  option: 'Option {index}'
} as const

export const trace = {
  label: 'Trace',
  search: 'Search spans',
  noMatch: 'No span matches “{query}”.',
  clearSearch: 'Clear search',
  emptyTitle: 'No spans in this trace.',
  loading: 'Loading spans',
  details: 'Details of {name}',
  close: 'Close',
  copyName: 'Copy span name',
  service: 'Service',
  startedAt: 'Started at',
  duration: 'Duration',
  share: 'Share of trace',
  percent: '{value}%',
  failed: 'Failed',
  running: 'Running',
  attributes: 'Attributes',
  milliseconds: '{value} ms',
  seconds: '{value} s',
  zoom: 'Zoom',
  resetZoom: 'Reset zoom',
  zoomStart: 'Zoom start',
  zoomEnd: 'Zoom end',
  slowest: 'Slowest',
  criticalPath: 'Critical path',
  view: 'View',
  waterfall: 'Waterfall',
  timeline: 'Timeline',
  tree: 'Tree',
  span: 'Span',
  onCriticalPath: 'On critical path',
  selfTime: 'Self time',
  events: 'Events',
  eventCount: {
    one: '{count} event',
    other: '{count} events'
  }
} as const

export const tracker = {
  noData: 'No data',
  summary: { one: '{count} period', other: '{count} periods' },
  summaryWorst: { one: '{count} period. Worst: {label}', other: '{count} periods. Worst: {label}' },
  roleDescription: 'status history'
} as const

export const flowDiagram = {
  label: 'Diagram',
  notBound: 'Not bound',
  bind: 'Bind {kind}',
  change: 'Change {kind}',
  remove: 'Remove {kind}',
  create: 'Create {kind}',
  apply: 'Apply {kind}',
  cancel: 'Cancel',
  pending: 'Pending',
  existing: 'Existing',
  noOptions: 'No options yet.',
  copy: 'Copy {field}',
  details: 'Details',
  connections: 'Connections',
  connection: '{from} to {to}',
  emptyTitle: 'Nothing is connected yet.',
  loading: 'Loading the diagram'
} as const

export const tree = {
  label: 'Tree',
  emptyTitle: 'No items',
  loadingChildren: 'Loading',
  renameLabel: 'Rename {label}'
} as const

export const unsavedChanges = {
  title: 'Unsaved changes',
  description: "This page has changes you haven't saved. If you leave now, they're discarded.",
  descriptionSavable:
    "This page has changes that haven't been saved yet. Save them before you leave, or discard them and continue.",
  keepEditing: 'Keep editing',
  discard: 'Discard changes',
  save: 'Save changes'
} as const

export const tutorialPanel = {
  title: 'Tutorials',
  description: 'Learn the product by doing a real task, one step at a time.',
  listLabel: 'Available tutorials',
  emptyTitle: 'No tutorials yet.',
  start: 'Start tutorial',
  restart: 'Restart tutorial',
  exit: 'Exit tutorial',
  back: 'Back to tutorials',
  completed: 'Completed',
  completedTitle: 'Tutorial complete',
  completedDescription: 'You finished {title}.',
  taskCount: { one: '{count} task', other: '{count} tasks' },
  stepCount: { one: '{count} step', other: '{count} steps' },
  taskComplete: 'Complete',
  taskCurrent: 'Current task',
  taskNotStarted: 'Not started',
  progress: '{complete} of {total} complete',
  hotspotLabel: 'Tutorial step: {title}',
  hotspotStepOf: 'Step {current} of {total}',
  hotspotPrevious: 'Previous',
  hotspotNext: 'Next',
  hotspotFinish: 'Finish'
} as const

export const videoPlayer = {
  label: 'Video',
  play: 'Play',
  pause: 'Pause',
  seek: 'Seek',
  seekValue: '{current} of {duration}',
  mute: 'Mute',
  volume: 'Volume',
  captions: 'Captions (CC)',
  captionsShort: 'CC',
  enterFullscreen: 'Enter full screen',
  exitFullscreen: 'Exit full screen',
  pending: 'Waiting to generate',
  running: 'Generating video',
  error: 'The video could not load'
} as const

export const wizard = {
  stepOf: 'Step {step} of {total}',
  optional: 'Optional',
  cancel: 'Cancel',
  previous: 'Previous',
  next: 'Next',
  submit: 'Create'
} as const

export const toolApproval = {
  approve: 'Approve',
  deny: 'Deny',
  approved: 'Approved',
  denied: 'Denied',
  expired: 'Request expired',
  confirmLabel: 'Type {phrase} to confirm',
  arguments: 'Arguments',
  invalidArguments: 'These arguments are not valid. Correct them to approve.',
  phraseMismatch: 'This does not match {phrase}. Type it exactly to confirm.'
} as const

export const agentQuestion = {
  submit: 'Submit',
  yes: 'Yes',
  no: 'No',
  skip: 'Skip',
  answered: 'Answered: {answer}',
  answeredWithoutValue: 'Answered',
  skipped: 'Skipped',
  canceled: 'Question canceled',
  error: 'The answer could not be sent. Try again.'
} as const

export const responseLoading = {
  generating: 'Generating a response'
} as const

export const artifactCanvas = {
  close: 'Close {title}',
  copy: 'Copy {title}',
  download: 'Download {title}',
  versions: 'Artifact versions',
  content: '{title} content',
  streaming: 'Generating a new version'
} as const

export const artifactPreview = {
  open: 'Open',
  openLabel: 'Open {title}',
  download: 'Download {title}',
  copy: 'Copy {title}'
} as const

export const mcpAppFrame = {
  loading: 'Loading {title}',
  errorTitle: "{title} can't be shown",
  errorDescription: "The app was blocked or couldn't be loaded here."
} as const

export const chatMessage = {
  user: 'You',
  assistant: 'AI assistant',
  system: 'System',
  labelWithTime: '{author} at {time}',
  actions: 'Message actions',
  error: 'The response could not be generated.',
  retry: 'Try again',
  goodResponse: 'Good response',
  badResponse: 'Bad response',
  feedback: 'Response feedback',
  feedbackSubmitting: 'Submitting feedback',
  feedbackThanks: 'Thanks for your feedback',
  readAloud: 'Read aloud',
  stopReading: 'Stop reading',
  share: 'Share',
  more: 'More actions',
  branch: 'Branch in new chat',
  edit: 'Edit message',
  editField: 'Edit your message',
  cancel: 'Cancel',
  send: 'Send'
} as const

export const citation = {
  label: 'Source {index}: {title}',
  labelMany: '{site} +{more}, sources {indexes}',
  labelUntitled: 'Source {index}',
  labelWithSite: 'Source {index}, {site}: {title}',
  next: 'Next source',
  page: '{current}/{total}',
  previous: 'Previous source'
} as const

export const conversation = {
  label: 'Conversation',
  scrollToLatest: 'Scroll to the latest message',
  announcement: '{author}: {text}',
  loadMore: 'Load earlier messages',
  loadingMore: 'Loading earlier messages',
  moreLoaded: 'Earlier messages loaded'
} as const

export const promptInput = {
  label: 'Prompt',
  placeholder: 'Ask a question',
  submit: 'Submit',
  stop: 'Stop generating',
  count: '{count}/{max}',
  overLimit: '{count} characters over the limit',
  menuResults: {
    one: '{count} suggestion',
    other: '{count} suggestions'
  },
  noMatch: 'No matches',
  menuReferences: 'References',
  voice: 'Start voice conversation',
  attach: 'Attach files',
  drop: 'Drop files to attach',
  rejectedAccept: {
    one: '{count} file not added: not an accepted type',
    other: '{count} files not added: not an accepted type'
  },
  rejectedSize: {
    one: '{count} file not added: larger than {size}',
    other: '{count} files not added: larger than {size}'
  },
  rejectedCount: {
    one: '{count} file not added: up to {max} files',
    other: '{count} files not added: up to {max} files'
  },
  dictate: 'Dictate',
  dictateStop: 'Stop dictation',
  listening: 'Listening',
  dictationEnded: 'Dictation stopped',
  dictationBlocked: 'Microphone access is blocked',
  dictationFailed: 'Dictation stopped. Try again',
  model: 'Model',
  mode: 'Mode',
  context: 'Choose context',
  contextRemove: 'Remove context',
  tools: 'Tools',
  toolsEnabled: 'Enabled tools',
  addMenu: 'Add',
  camera: 'Camera',
  photos: 'Photos',
  files: 'Files'
} as const

export const agentActivity = {
  label: 'Agent activity',
  steps: {
    one: '{count} step',
    other: '{count} steps'
  },
  finished: {
    one: 'Finished {count} step',
    other: 'Finished {count} steps'
  },
  stopped: {
    one: 'Stopped after {count} step',
    other: 'Stopped after {count} steps'
  },
  failed: 'Failed: {title}',
  pending: 'Pending',
  running: 'Running',
  success: 'Done',
  error: 'Failed',
  canceled: 'Canceled',
  skipped: 'Skipped'
} as const

export const reasoning = {
  thinking: 'Thinking',
  thoughtBriefly: 'Thought for a few seconds',
  skip: 'Skip thinking',
  thought: {
    one: 'Thought for {count} second',
    other: 'Thought for {count} seconds'
  }
} as const

export const sources = {
  label: 'Sources',
  cited: 'Citations',
  more: 'More',
  count: {
    one: '{count} source',
    other: '{count} sources'
  }
} as const

export const promptQueue = {
  label: 'Queued messages',
  title: {
    one: '{count} message queued',
    other: '{count} messages queued'
  },
  empty: 'No messages queued',
  remove: 'Remove from queue',
  showMore: 'Show more',
  showLess: 'Show less',
  attachments: {
    one: '{count} attachment',
    other: '{count} attachments'
  }
} as const

export const suggestionGroup = {
  label: 'Suggested prompts'
} as const

export const toolCall = {
  pending: 'Waiting',
  streaming: 'Preparing',
  running: 'Running',
  success: 'Completed',
  error: 'Failed',
  canceled: 'Canceled',
  denied: 'Denied',
  input: 'Input',
  output: 'Output'
} as const

export const subagentCard = {
  pending: 'Waiting',
  running: 'Running',
  success: 'Completed',
  error: 'Failed',
  canceled: 'Stopped',
  stop: 'Stop',
  stopAgent: 'Stop {name}',
  input: 'Task',
  activity: 'Activity'
} as const

export const paymentBrand = {
  unknown: 'Card'
} as const

export const otpInput = {
  label: 'One-time code'
} as const

export const consoleShowcaseSection = {
  views: 'Console views'
} as const

export const runtimeApiCloud = {
  label: 'Globals available in the Azion Runtime'
} as const

export const clientStoryColumnsSection = {
  list: 'Customer stories',
  story: 'Read story'
} as const

export const common = {
  pauseRotation: 'Pause rotation',
  resumeRotation: 'Resume rotation',
  pauseScrolling: 'Pause scrolling',
  resumeScrolling: 'Resume scrolling',
  pauseAnimation: 'Pause animation',
  playAnimation: 'Play animation',
  copy: 'Copy',
  copied: 'Copied',
  newTab: '(opens in a new tab)'
} as const

export const newsletterSection = {
  email: 'Email address'
} as const

export const copyCommandSection = {
  command: 'Command',
  prompt: 'Prompt',
  copyCommandSection: 'Copy command',
  copyPrompt: 'Copy prompt'
} as const

export const searchTrigger = {
  label: 'Search'
} as const

export const saveBar = {
  saveShortcut: 'Save changes'
} as const

export const shortcutsDialog = {
  title: 'Keyboard shortcuts',
  show: 'Show keyboard shortcuts',
  general: 'General',
  emptyTitle: 'No keyboard shortcuts here'
} as const

export const copyPromptButton = {
  label: 'Copy prompt',
  copied: 'Copied',
  worksWith: 'Works with {agents}',
  tooltip: 'Copies a setup prompt for your AI coding tool',
  dismiss: 'Dismiss'
} as const

export const docAgentCard = {
  title: 'Your AI agent, fluent in Azion',
  description:
    'One prompt teaches any coding agent the platform: current product names, live docs through the Azion MCP server, and real deploys with the CLI.',
  asideTitle: 'Prefer the guided route?',
  action: 'Agent setup'
} as const

export const consoleLayout = {
  navigation: 'Main navigation',
  home: 'Azion home',
  openNavigation: 'Open navigation',
  accountMenu: 'Account menu',
  accountMenuFor: '{initials}, {name}, account menu',
  searchPlaceholder: 'Search pages and commands',
  noMatch: 'No page or command matches your search.',
  pages: 'Pages',
  searchShortcut: 'Search pages and commands',
  info: 'Info'
} as const

export const docLayout = {
  navigation: 'Documentation',
  sections: 'Documentation sections',
  home: 'Azion Docs home',
  badge: 'Docs',
  openNavigation: 'Open documentation navigation',
  search: 'Search docs',
  noMatch: 'No page matches your search.',
  pages: 'Pages',
  root: 'Docs',
  collapseNavigation: 'Collapse navigation',
  expandNavigation: 'Expand navigation',
  resizeNavigation: 'Resize navigation'
} as const

export const siteLayout = {
  searchPlaceholder: 'Search the site',
  noMatch: 'No page matches your search.',
  pages: 'Pages'
} as const

export const skipLink = {
  label: 'Skip to content'
} as const

export const dataTable = {
  loadingMore: 'Loading more rows',
  loadMore: 'Load more',
  noMoreRows: 'No more rows',
  reorderColumn: 'Order',
  reorderHandle: 'Reorder {name}, position {position} of {total}',
  reorderHint: 'Drag, or press Arrow Up or Arrow Down to move.',
  reorderLocked: 'Clear the sort to reorder rows.',
  reorderMoved: 'Moved {name} to position {position} of {total}.',
  reorderDropped: 'Dropped {name} at position {position} of {total}.',
  reorderCancelled: 'Reorder cancelled.'
} as const

export const en = {
  toolApproval,
  agentQuestion,
  responseLoading,
  alert,
  appLayout,
  articleBodySection,
  articleIndexSection,
  artifactCanvas,
  artifactPreview,
  mcpAppFrame,
  attributeEditor,
  avatar,
  avatarGroup,
  barList,
  dashboardGrid,
  breadcrumb,
  browserFrame,
  buttonGroup,
  integrationCard,
  cardList,
  carousel,
  chart,
  chartCard,
  chatMessage,
  chip,
  citation,
  codeBlock,
  codeEditor,
  collectionPreferences,
  combobox,
  command,
  consoleLayout,
  planComparisonSection,
  competitorComparisonSection,
  confirmDialog,
  conversation,
  copyButton,
  copyText,
  qrCode,
  conversationHistory,
  feedbackReasonDialog,
  responseBranches,
  datePicker,
  dateRangePicker,
  dialog,
  docFrame,
  docLayout,
  docTableOfContents,
  docPageHeader,
  docPreviousNext,
  docPrompt,
  docProse,
  donutChart,
  drawer,
  errorBoundary,
  field,
  fileDropzone,
  audioPlayer,
  filePreview,
  imageGallery,
  fileTokenGroup,
  filterMenu,
  uploadProgress,
  videoPlayer,
  footer,
  gaugeChart,
  appHeader,
  helpPanel,
  hint,
  heroSection,
  heroFormSection,
  keyValueList,
  kbd,
  languageSelect,
  link,
  listingIndexSection,
  logoWall,
  logViewer,
  mapChart,
  sidebarMenu,
  multiSelect,
  navigationMenu,
  numberInput,
  outcomeIcon,
  overflowCount,
  pagination,
  passwordInput,
  passwordRequirements,
  phoneInput,
  transferList,
  popover,
  progress,
  promptInput,
  promptQueue,
  propertyFilter,
  agentActivity,
  reasoning,
  resizable,
  schemaForm,
  subheader,
  settingsGroup,
  severityTag,
  sidebar,
  siteFooterSection,
  siteLayout,
  skipLink,
  siteHeaderSection,
  sources,
  splitButton,
  statTile,
  statusIndicator,
  stepper,
  storyIndexSection,
  suggestionGroup,
  dataGrid,
  table,
  tableExportButton,
  tableHeadCell,
  tableRefreshButton,
  tableCellActions,
  tableCellId,
  tableCellLink,
  tableCellTags,
  tableCellTime,
  tableLiveButton,
  tableSearch,
  tableSortButton,
  tabs,
  tagEditor,
  themeSwitcher,
  timestamp,
  toast,
  toggleGroup,
  trace,
  toolCall,
  subagentCard,
  flowDiagram,
  tracker,
  tree,
  unsavedChanges,
  tutorialPanel,
  wizard,
  paymentBrand,
  otpInput,
  consoleShowcaseSection,
  runtimeApiCloud,
  clientStoryColumnsSection,
  copyCommandSection,
  searchTrigger,
  shortcutsDialog,
  saveBar,
  copyPromptButton,
  docAgentCard,
  common,
  newsletterSection,
  dataTable
}
