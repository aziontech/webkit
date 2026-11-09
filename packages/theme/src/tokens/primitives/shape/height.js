import { tokenRef } from '../../../scripts/refs.js'
import { size } from './size.js'

export const height = Object.fromEntries(
  Object.keys(size).map((step) => [step, tokenRef(`shape.size.${step}`)])
)

export default { height }
