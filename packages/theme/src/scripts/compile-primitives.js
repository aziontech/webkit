/**
 * Compile all primitives into a single CSS variables stylesheet.
 *
 * Imports every primitive module (colors, shape, typography, effects,
 * breakpoints, border-widths, ring-offset), resolves `tokenRef(...)` aliases,
 * and produces a `:root { ... }` block. Mirrors the `injectCssVars` helper
 * but for primitives only — no semantic light/dark split.
 */

import { primitives as colorPrimitives } from '../tokens/primitives/colors/colors.js';
import { animate } from '../tokens/primitives/animations/animate.js';
import { ease } from '../tokens/primitives/animations/ease.js';
import { borderWidths } from '../tokens/primitives/border-widths.js';
import { breakpoints } from '../tokens/primitives/breakpoints.js';
import { blur } from '../tokens/primitives/effects/blur.js';
import { dropShadow } from '../tokens/primitives/effects/drop-shadow.js';
import { insetShadow } from '../tokens/primitives/effects/inset-shadow.js';
import { opacity } from '../tokens/primitives/effects/opacity.js';
import { perspective } from '../tokens/primitives/effects/perspective.js';
import { shadow } from '../tokens/primitives/effects/shadow.js';
import { ringOffset } from '../tokens/primitives/ring-offset.js';
import { aspectVideo } from '../tokens/primitives/shape/aspect-video.js';
import { container } from '../tokens/primitives/shape/container.js';
import { height } from '../tokens/primitives/shape/height.js';
import { radius } from '../tokens/primitives/shape/radius.js';
import { shape as shapeAliases } from '../tokens/primitives/shape/shape.js';
import { size } from '../tokens/primitives/shape/size.js';
import { spacing } from '../tokens/primitives/shape/spacing.js';
import { width } from '../tokens/primitives/shape/width.js';
import { fontFamily } from '../tokens/primitives/typography/font-family.js';
import { fontSize } from '../tokens/primitives/typography/font-size.js';
import { fontWeight } from '../tokens/primitives/typography/font-weight.js';
import { leading } from '../tokens/primitives/typography/leading.js';
import { lineHeight } from '../tokens/primitives/typography/line-height.js';
import { tracking } from '../tokens/primitives/typography/tracking.js';
import { isTokenRef } from './refs.js';

/**
 * Returns two trees:
 *   - `refsTree`: deep structure preserved so `tokenRef('shape.container.X')`
 *     keeps resolving via path lookup.
 *   - `varsTree`: same data with the `shape` / `typography` / `effects`
 *     wrappers removed, so emitted CSS vars are flat (no group prefix).
 */
export const buildTrees = () => {
  const { brand, ...restColors } = colorPrimitives;
  const color = {
    ...restColors,
    primary: brand.primary,
    accent: brand.accent,
    absolute: brand.absolute,
  };

  const shape = {
    container,
    height,
    radius,
    size,
    spacing,
    width,
    'aspect-video': aspectVideo,
    ...shapeAliases,
  };
  const typography = {
    font: fontFamily,
    text: fontSize,
    'font-weight': fontWeight,
    leading,
    'line-height': lineHeight,
    tracking,
  };
  const effects = {
    blur,
    'drop-shadow': dropShadow,
    shadow,
    'inset-shadow': insetShadow,
    opacity,
    perspective,
  };
  const animations = { ease, animate };

  const refsTree = {
    color,
    breakpoint: breakpoints,
    border: borderWidths,
    shape,
    typography,
    effects,
    animations,
    'ring-offset': ringOffset['ring-offset'],
  };

  const varsTree = {
    color,
    breakpoint: breakpoints,
    border: borderWidths,
    ...shape,
    ...typography,
    ...effects,
    ...animations,
    'ring-offset': ringOffset['ring-offset'],
  };

  return { refsTree, varsTree };
};

const getValueByPath = (obj, path) =>
  path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) return acc[key];
    return undefined;
  }, obj);

const resolveRef = (refPath, refsTree) => {
  const direct = getValueByPath(refsTree, refPath);
  if (typeof direct === 'string' || typeof direct === 'number') return String(direct);
  return null;
};

// A leaf key of `DEFAULT` collapses to the parent prefix (Tailwind convention),
// so `{ radius: { DEFAULT: '4px' } }` emits `--radius: 4px;`.
const varNameFor = (path) => {
  const segments = path[path.length - 1] === 'DEFAULT' ? path.slice(0, -1) : path;
  return `--${segments.join('-')}`;
};

export const flatten = (obj, refsTree, prefix = []) => {
  const result = {};
  Object.entries(obj).forEach(([key, value]) => {
    const nextPath = [...prefix, key];
    if (isTokenRef(value)) {
      const resolved = resolveRef(value.__ref, refsTree);
      result[varNameFor(nextPath)] = resolved ?? value.__ref;
      return;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, refsTree, nextPath));
      return;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      result[varNameFor(nextPath)] = String(value);
    }
  });
  return result;
};

export const compilePrimitivesVars = () => {
  const { refsTree, varsTree } = buildTrees();
  return flatten(varsTree, refsTree);
};

export const compilePrimitivesCss = () => {
  const vars = compilePrimitivesVars();
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `:root, [data-theme=light], .azion.azion-light {\n${body}\n}`;
};

export const injectPrimitivesCss = () => {
  const style = document.createElement('style');
  style.setAttribute('data-azion-primitives', 'true');
  style.textContent = compilePrimitivesCss();
  document.head.appendChild(style);
  return style;
};
