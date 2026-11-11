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

export const articleIndex = {
  search: 'Search',
  searchFacet: 'Search {facet}',
  empty: 'No results found.'
} as const

export const attributeEditor = {
  add: 'Add new item',
  remove: 'Remove item',
  rowAction: '{label} {index}',
  addGroup: 'Add OR group',
  empty: 'No items yet.',
  remaining: {
    one: 'You can add {count} more item.',
    other: 'You can add {count} more items.'
  },
  limitReached: 'You have reached the limit of {limit} items.',
  added: 'Item {index} added.',
  removed: 'Item {index} removed.',
  group: 'Group {index}',
  and: 'and',
  or: 'or'
} as const

export const avatar = {
  fallbackLabel: 'User avatar',
  imageAlt: 'Avatar'
} as const

export const barList = {
  emptyTitle: 'No data available'
} as const

export const board = {
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

export const calendar = {
  placeholder: 'Select a date range',
  period: 'Period',
  selectPeriod: 'Select period',
  clear: 'Clear selection',
  open: 'Open calendar',
  chooseDate: 'Choose date',
  apply: 'Apply range',
  presets: 'Presets',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  start: 'Start',
  end: 'End',
  date: 'Date',
  time: 'Time',
  startTime: 'Start time',
  endTime: 'End time',
  last3Days: 'Last 3 days',
  lastWeek: 'Last week',
  lastMonth: 'Last month',
  lastQuarter: 'Last quarter',
  lastYear: 'Last year',
  relativeHints: 'Type relative times',
  fixedHints: 'Type fixed times',
  rangeSeparators: 'to|through',
  timezone: 'Timezone',
  localTimezone: 'Local'
} as const

export const card = {
  byVendor: 'by {vendor}',
  installed: 'Installed'
} as const

export const cards = {
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
  rangeSelected: 'Selected from {from} to {to}'
} as const

export const chartCard = {
  resize: 'Resize card',
  move: 'Move card',
  columns: '{span} of {max} columns',
  columnsAndHeight: '{columns}, {height} pixels tall'
} as const

export const chip = {
  remove: 'Remove',
  removeNamed: 'Remove {label}'
} as const

export const codeBlock = {
  copy: 'Copy code'
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
  empty: 'No matches',
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
  empty: 'No results found.',
  placeholder: 'Search everything',
  title: 'Command menu'
} as const

export const comparisonTable = {
  about: 'About {capability}'
} as const

export const confirmDialog = {
  confirm: 'Confirm',
  cancel: 'Cancel'
} as const

export const copyButton = {
  copy: 'Copy',
  copied: 'Copied'
} as const

export const dateRangePicker = {
  label: 'Time range',
  placeholder: 'Select a time range',
  dialog: 'Choose a time range',
  rangeType: 'Range type',
  relative: 'Relative range',
  absolute: 'Absolute range',
  quickRanges: 'Quick ranges',
  custom: 'Custom range',
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
  apply: 'Apply',
  cancel: 'Cancel',
  previous: 'Previous range',
  next: 'Next range',
  incomplete: 'Choose a start and an end.',
  order: 'The end must be after the start.',
  outOfBounds: 'Choose a range inside the allowed dates.',
  invalidAmount: 'Enter a whole number greater than 0.'
} as const

export const dialog = {
  close: 'Close'
} as const

export const docFrame = {
  zoom: 'View image full screen',
  zoomNamed: 'View full screen: {alt}',
  fullScreen: 'Full screen',
  zoomedImage: 'Image, full screen',
  closeFullScreen: 'Close full screen',
  close: 'Close'
} as const

export const docOnThisPage = {
  title: 'On this page'
} as const

export const docPageHeader = {
  lastUpdated: 'Last updated'
} as const

export const docPagination = {
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
  copy: 'Copy',
  copied: 'Copied',
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
  required: '(Required)'
} as const

export const fileDropzone = {
  title: 'Drop files to upload'
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
  showFewer: 'Show fewer files'
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
  label: 'Footer'
} as const

export const globalHeader = {
  label: 'Global header'
} as const

export const helpPanel = {
  label: 'Help',
  learnMore: 'Learn more',
  taskComplete: 'Complete',
  taskCurrent: 'Current task',
  taskNotStarted: 'Not started',
  tutorialCompleted: 'Completed',
  tutorialProgress: '{complete} of {total} complete'
} as const

export const heroForm = {
  search: 'Search',
  empty: 'No results found.'
} as const

export const hotspot = {
  label: 'Tutorial step: {title}',
  stepOf: 'Step {current} of {total}',
  previous: 'Previous',
  next: 'Next',
  finish: 'Finish'
} as const

export const keyValuePairs = {
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
  delete: 'Del'
} as const

export const label = {
  required: '(Required)'
} as const

export const link = {
  label: 'Learn more'
} as const

export const logView = {
  searchPlaceholder: 'Find in logs',
  search: 'Search logs',
  loading: 'Loading…',
  lines: { one: '{count} line', other: '{count} lines' },
  warnings: 'Warnings',
  warningCount: { one: '{count} warning', other: '{count} warnings' },
  gzip: 'gzip:',
  empty: 'No log lines match the current filters.',
  copy: 'Copy logs',
  copied: 'Copied logs'
} as const

export const logoWall = {
  link: 'Read story'
} as const

export const menu = {
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

export const miniButton = {
  label: 'Learn more'
} as const

export const navigationMenu = {
  label: 'Main'
} as const

export const numberInput = {
  increment: 'Increment',
  decrement: 'Decrement'
} as const

export const outcomeMark = {
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
  loadMore: 'Load {count} more',
  newTab: '(opens in a new tab)'
} as const

export const pagination = {
  label: 'Pagination',
  info: 'Showing {start} to {end} of {total} entries',
  previous: 'Previous page',
  next: 'Next page',
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
  unmet: 'not met'
} as const

export const phoneInput = {
  dialCode: 'Country dial code',
  search: 'Search country',
  empty: 'No country found.'
} as const

export const pickList = {
  moveSelectedToTarget: 'Move selected to target',
  moveAllToTarget: 'Move all to target',
  moveSelectedToSource: 'Move selected to source',
  moveAllToSource: 'Move all to source'
} as const

export const popover = {
  close: 'Close'
} as const

export const progress = {
  label: 'Progress'
} as const

export const propertyFilter = {
  label: 'Filter',
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
  lessOrEqual: 'Less than or equal to'
} as const

export const propertyFilterQuery = {
  label: 'Query',
  placeholder: 'Type a query, for example status = Active AND requests > 10',
  fields: 'Fields',
  all: 'Every condition matches',
  any: 'Any condition matches',
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
  jsonPlaceholder: 'A JSON value'
} as const

export const sectionHeader = {
  copyLink: 'Copy link to the {title} section',
  linkCopied: 'Link copied'
} as const

export const settingsSection = {
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

export const siteFooter = {
  label: 'Footer',
  home: 'Azion home',
  language: 'Language'
} as const

export const siteNav = {
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

export const storyLibrary = {
  search: 'Search',
  searchFacet: 'Search {facet}',
  empty: 'No results found.'
} as const

export const table = {
  selectAll: 'Select all rows',
  selectRow: 'Select row',
  emptyTitle: 'No results yet',
  emptyDescription: 'Get started by creating your first resource.'
} as const

export const tableAppliedFilters = {
  contains: 'contains',
  notContains: 'not contains',
  startsWith: 'starts with',
  endsWith: 'ends with',
  in: 'in',
  notIn: 'not in',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty'
} as const

export const tableColumnSelector = {
  title: 'Columns',
  empty: 'No hideable columns.'
} as const

export const tableExport = {
  label: 'Export CSV'
} as const

export const tableFilter = {
  title: 'Filters',
  field: 'Field',
  operator: 'Operator',
  value: 'Value',
  apply: 'Apply filter',
  eq: 'is',
  neq: 'is not',
  contains: 'contains',
  notContains: 'does not contain',
  startsWith: 'starts with',
  endsWith: 'ends with',
  gt: 'greater than',
  gte: 'at least',
  lt: 'less than',
  lte: 'at most',
  in: 'in',
  notIn: 'not in',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty'
} as const

export const tableHeadCell = {
  resize: 'Resize column'
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
  newTab: 'Open {label} in a new tab',
  newTabHint: '(opens in a new tab)',
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

export const tableReorder = {
  column: 'Order',
  handle: 'Reorder {name}, position {position} of {total}',
  hint: 'Drag, or press Arrow Up or Arrow Down to move.',
  locked: 'Clear the sort to reorder rows.',
  moved: 'Moved {name} to position {position} of {total}.',
  dropped: 'Dropped {name} at position {position} of {total}.',
  cancelled: 'Reorder cancelled.'
} as const

export const tableSearch = {
  placeholder: 'Search'
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
  empty: 'No tags associated with the resource.',
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

export const toast = {
  close: 'Close notification'
} as const

export const toggleGroup = {
  option: 'Option {index}'
} as const

export const trace = {
  label: 'Trace',
  search: 'Search spans',
  noMatch: 'No span matches “{query}”.',
  clearSearch: 'Clear search',
  empty: 'No spans in this trace.',
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
  seconds: '{value} s'
} as const

export const tracker = {
  noData: 'No data',
  roleDescription: 'status history'
} as const

export const topologyDiagram = {
  label: 'Deployment topology',
  notBound: 'Not bound',
  bind: 'Bind {kind}',
  change: 'Change {kind}',
  remove: 'Remove {kind}',
  create: 'Create {kind}',
  existing: 'Existing',
  noOptions: 'No options yet.',
  copy: 'Copy {field}',
  empty: 'Nothing is connected yet.',
  loading: 'Loading the topology'
} as const

export const tree = {
  emptyTitle: 'No items'
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
  empty: 'No tutorials yet.',
  start: 'Start tutorial',
  restart: 'Restart tutorial',
  exit: 'Exit tutorial',
  back: 'Back to tutorials',
  completed: 'Completed',
  completedTitle: 'Tutorial complete',
  completedDescription: 'You finished {title}.',
  taskCount: { one: '{count} task', other: '{count} tasks' },
  stepCount: { one: '{count} step', other: '{count} steps' }
} as const

export const wizard = {
  stepOf: 'Step {step} of {total}',
  optional: 'Optional',
  cancel: 'Cancel',
  previous: 'Previous',
  next: 'Next',
  submit: 'Create'
} as const

export const actionConfirmation = {
  approve: 'Approve',
  deny: 'Deny',
  approved: 'Approved',
  denied: 'Denied',
  expired: 'Request expired',
  confirmLabel: 'Type {phrase} to confirm'
} as const

export const aiLoading = {
  generating: 'Generating a response'
} as const

export const artifactPreview = {
  open: 'Open',
  openLabel: 'Open {title}',
  download: 'Download {title}',
  copy: 'Copy {title}'
} as const

export const chatMessage = {
  user: 'You',
  assistant: 'AI assistant',
  system: 'System',
  labelWithTime: '{author} at {time}',
  actions: 'Message actions',
  error: 'The response could not be generated.',
  retry: 'Try again',
  helpful: 'Helpful',
  notHelpful: 'Not helpful',
  feedback: 'Response feedback',
  feedbackSubmitting: 'Submitting feedback',
  feedbackSubmitted: 'Feedback submitted'
} as const

export const citation = {
  label: 'Source {index}: {title}',
  labelUntitled: 'Source {index}'
} as const

export const conversation = {
  label: 'Conversation',
  scrollToLatest: 'Scroll to the latest message',
  announcement: '{author}: {text}'
} as const

export const promptInput = {
  label: 'Prompt',
  placeholder: 'Ask a question',
  submit: 'Submit',
  stop: 'Stop generating',
  count: '{count}/{max}',
  overLimit: '{count} characters over the limit'
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
  count: {
    one: '{count} source',
    other: '{count} sources'
  }
} as const

export const suggestionGroup = {
  label: 'Suggested prompts'
} as const

export const toolCall = {
  pending: 'Waiting',
  running: 'Running',
  success: 'Completed',
  error: 'Failed',
  denied: 'Denied',
  input: 'Input',
  output: 'Output'
} as const

export const consolePanel = {
  views: 'Console views'
} as const

export const customerSpotlight = {
  list: 'Customer stories',
  story: 'Read story'
} as const

export const sectionCommand = {
  command: 'Command',
  prompt: 'Prompt',
  copyCommand: 'Copy command',
  copyPrompt: 'Copy prompt'
} as const

export const en = {
  actionConfirmation,
  aiLoading,
  alert,
  appLayout,
  articleIndex,
  artifactPreview,
  attributeEditor,
  avatar,
  barList,
  board,
  breadcrumb,
  browserFrame,
  buttonGroup,
  calendar,
  card,
  cards,
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
  comparisonTable,
  confirmDialog,
  conversation,
  copyButton,
  dateRangePicker,
  dialog,
  docFrame,
  docOnThisPage,
  docPageHeader,
  docPagination,
  docPrompt,
  docProse,
  donutChart,
  drawer,
  errorBoundary,
  field,
  fileDropzone,
  fileTokenGroup,
  uploadProgress,
  footer,
  gaugeChart,
  globalHeader,
  helpPanel,
  heroForm,
  hotspot,
  keyValuePairs,
  kbd,
  label,
  link,
  logoWall,
  logView,
  mapChart,
  menu,
  miniButton,
  navigationMenu,
  numberInput,
  outcomeMark,
  overflowCount,
  pagination,
  passwordInput,
  passwordRequirements,
  phoneInput,
  pickList,
  popover,
  progress,
  promptInput,
  propertyFilter,
  propertyFilterQuery,
  reasoning,
  resizable,
  schemaForm,
  sectionHeader,
  settingsSection,
  severityTag,
  sidebar,
  siteFooter,
  siteNav,
  sources,
  splitButton,
  statTile,
  statusIndicator,
  stepper,
  storyLibrary,
  suggestionGroup,
  table,
  tableAppliedFilters,
  tableColumnSelector,
  tableExport,
  tableFilter,
  tableHeadCell,
  tableRefreshButton,
  tableCellActions,
  tableCellId,
  tableCellLink,
  tableCellTags,
  tableCellTime,
  tableReorder,
  tableSearch,
  tableSortButton,
  tabs,
  tagEditor,
  themeSwitcher,
  toast,
  toggleGroup,
  trace,
  toolCall,
  topologyDiagram,
  tracker,
  tree,
  unsavedChanges,
  tutorialPanel,
  wizard,
  consolePanel,
  customerSpotlight,
  sectionCommand
}
