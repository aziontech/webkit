import { CONTENT_TERMS } from './content-terms.js'
import { DATA_TERMS } from './data-terms.js'
import { INPUT_TERMS } from './input-terms.js'
import { SUPPORT_TERMS } from './support-terms.js'
import { TIME_TERMS } from './time-terms.js'

export const RENDERS_THROUGH = {
  'data-table': ['table']
}

export const COMPONENT_TERMS = {
  ...SUPPORT_TERMS,
  ...TIME_TERMS,
  ...INPUT_TERMS,
  ...CONTENT_TERMS,
  ...DATA_TERMS
}
