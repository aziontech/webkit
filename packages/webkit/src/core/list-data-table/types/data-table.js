/**
 * @typedef {Object} ColumnDefinition
 * @property {string} field
 * @property {string} header
 * @property {string} [sortField]
 * @property {boolean} [sortable]
 * @property {boolean} [frozen]
 * @property {boolean} [hiddenByDefault]
 * @property {*} [component]
 * @property {string} [filterField]
 * @property {string} [type]
 */

/**
 * @typedef {Object} FilterDefinition
 * @property {string} field
 * @property {string} label
 * @property {*} value
 * @property {string} [matchMode]
 */

/**
 * @typedef {Object} ActionDefinition
 * @property {string} label
 * @property {string} [icon]
 * @property {(rowData: any) => void} [command]
 * @property {boolean | ((rowData: any) => boolean)} [disabled]
 * @property {boolean | ((rowData: any) => boolean)} [visible]
 * @property {boolean} [separator]
 * @property {string} [severity]
 */

/**
 * @typedef {Object} EmptyBlockConfig
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [createButtonLabel]
 * @property {string} [createPagePath]
 * @property {() => void} [onClickCreate]
 * @property {string} [documentationService]
 */

/**
 * @typedef {Object} PageEvent
 * @property {number} first
 * @property {number} rows
 * @property {number} page
 * @property {number} pageCount
 */

/**
 * @typedef {Object} SortEvent
 * @property {string} sortField
 * @property {number} sortOrder
 */

/**
 * @typedef {Object} RowEditEvent
 * @property {*} data
 * @property {*} newData
 * @property {string} [field]
 * @property {number} index
 * @property {Event} [originalEvent]
 */

/**
 * @typedef {Object} BatchAction
 * @property {string} label
 * @property {string} [icon]
 * @property {() => void} command
 * @property {string} [severity]
 */

/**
 * @typedef {Object} BreadcrumbSegment
 * @property {string} label
 * @property {string} path
 */

/**
 * @typedef {Object} ViewMode
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {Object} PositionLimits
 * @property {number} min
 * @property {number} max
 */

/**
 * @typedef {Object} RowOrderingResult
 * @property {number} from
 * @property {number} to
 * @property {any[]} reorderedData
 */

export {}
