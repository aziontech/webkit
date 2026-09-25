import { radius } from './radius.js';
import { borderWidths } from '../border-widths.js';

export const shape = {
  'shape-flat': radius.none,
  'shape-card': radius.DEFAULT,
  'shape-button': radius.DEFAULT,
  'shape-elements': radius.DEFAULT,
  'border-width-default': borderWidths[1],
};

export default { shape };
