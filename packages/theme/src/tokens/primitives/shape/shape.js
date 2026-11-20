import { borderWidth } from '../border-width.js'
import { radius } from './radius.js'

export const shape = {
  'shape-flat': radius.none,
  'shape-card': radius['lg'],
  'shape-button': radius['md'],
  'shape-control': radius['md'],
  'border-width-default': borderWidth[1]
}

export default { shape }
