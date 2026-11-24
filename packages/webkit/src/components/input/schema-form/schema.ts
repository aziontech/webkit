/** JSON Schema types SchemaForm reads. */
export type SchemaFormType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'

/** The draft-07 subset SchemaForm renders and validates. Other keywords are ignored. */
export interface SchemaFormSchema {
  type?: SchemaFormType
  title?: string
  description?: string
  default?: unknown
  enum?: Array<string | number>
  minLength?: number
  maxLength?: number
  pattern?: string
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  items?: SchemaFormSchema
  minItems?: number
  maxItems?: number
  properties?: Record<string, SchemaFormSchema>
  required?: string[]
  readOnly?: boolean
  writeOnly?: boolean
  format?: string
  const?: unknown
  oneOf?: SchemaFormSchema[]
  discriminator?: { propertyName: string; mapping?: Record<string, string> }
  additionalProperties?: boolean | SchemaFormSchema
  'x-multiline'?: boolean
  [keyword: string]: unknown
}

/** The control a field renders. */
export type SchemaFormWidget =
  | 'input'
  | 'textarea'
  | 'select'
  | 'number'
  | 'switch'
  | 'list'
  | 'json'
  | 'password'
  | 'combobox'
  | 'multiselect'
  | 'repeat'
  | 'map'
  | 'fieldset'
  | 'section'

/** One option a `ui[path].options` loader returns. */
export interface SchemaFormOption {
  /** The value written to the form. */
  value: string | number
  /** Text shown instead of the value. */
  label?: string
  /** Muted text at the end of the row. */
  description?: string
}

/** Loads the options of a field for the typed text (empty on first load); the form calls it, the app fetches. */
export type SchemaFormOptionsLoader = (query: string) => Promise<SchemaFormOption[]>

/** Shows the field while it returns true; receives the whole value and the object that holds the field. */
export type SchemaFormWhen = (
  value: Record<string, unknown>,
  parent: Record<string, unknown>
) => boolean

/** A group of an object's keys, shown under a legend or folded under a disclosure. */
export interface SchemaFormSection {
  /** Legend or disclosure title. Empty uses the locale catalog (Advanced settings). */
  title?: string
  /** Helper text under the legend. */
  description?: string
  /** The keys of the object the section holds, in this order. */
  keys: string[]
  /** Folds the section under a closed disclosure. */
  collapsed?: boolean
}

/** Per-path presentation overrides: `''` addresses the root object, `*` stands for a repeat item index. */
export interface SchemaFormUi {
  /** Control to render instead of the one the schema implies. */
  widget?: Exclude<SchemaFormWidget, 'fieldset' | 'section' | 'combobox' | 'multiselect'>
  /** Placeholder of the control. */
  placeholder?: string
  /** Leaves the field out of the form (its value is kept). */
  hidden?: boolean
  /** For an object: the keys to ask first, in this order; the rest follow in schema order. */
  order?: string[]
  /** Shows the field only while it returns true; a hidden field is not validated and its key is removed. */
  when?: SchemaFormWhen
  /** Loads the choices from the app: a searchable single choice, or several for an array. */
  options?: SchemaFormOptionsLoader
  /** For an object: groups of its keys; ungrouped keys come first. */
  sections?: SchemaFormSection[]
}

/** One choice of a `oneOf` with a discriminator, and the fields it adds. */
export interface SchemaFormVariant {
  value: string | number
  label: string
  children: SchemaFormNode[]
}

/** One rendered field, fieldset or section. */
export interface SchemaFormNode {
  key: string
  path: string
  uiPath: string
  schema: SchemaFormSchema
  type: SchemaFormType | undefined
  widget: SchemaFormWidget
  label: string
  description: string
  required: boolean
  readOnly: boolean
  writeOnly: boolean
  format: string
  placeholder: string
  options: Array<string | number>
  optionLabels: Record<string, string>
  itemType: 'string' | 'number' | 'integer'
  children: SchemaFormNode[]
  variants: SchemaFormVariant[]
  entries: SchemaFormNode[][]
  collapsed: boolean
  when?: SchemaFormWhen
  load?: SchemaFormOptionsLoader
}

/** A validation failure: the catalog message key under `schemaForm` and its parameters. */
export interface SchemaFormIssue {
  key:
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'minimum'
    | 'maximum'
    | 'number'
    | 'integer'
    | 'enum'
    | 'minItems'
    | 'maxItems'
    | 'json'
    | 'email'
    | 'uri'
    | 'date'
  params?: Record<string, string | number>
  line?: number
}

/** The fields on screen for a value: `when` applied, the chosen variants and one entry per repeat item. */
export interface SchemaFormTree {
  nodes: SchemaFormNode[]
  hidden: string[]
}

export { buildNodes } from './lib/schema-nodes'
export { getAt, setAt } from './lib/schema-paths'
export { expand, leavesOf, seedDefaults } from './lib/schema-tree'
export { listLines, parseNumber, validateNode } from './lib/schema-validate'
