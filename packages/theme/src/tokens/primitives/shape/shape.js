import { radius } from './radius.js';
import { borderWidths } from '../border-widths.js';

export const shape = {
  'shape-flat': radius['rounded-none'],
  'shape-card': radius['rounded'],
  'shape-button': radius['rounded'],
  'shape-elements': radius['rounded'],
  'border-width-default': borderWidths[1],
};

export default { shape };
