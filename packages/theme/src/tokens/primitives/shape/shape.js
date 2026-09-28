import { borderWidths } from '../border-widths.js'
import { radius } from './radius.js'

export const shape = {
  'shape-flat': radius.none,
  'shape-card': radius['lg'],
  'shape-button': radius['md'],
  'shape-elements': radius['md'],
  'border-width-default': borderWidths[1]
}

export default { shape }
