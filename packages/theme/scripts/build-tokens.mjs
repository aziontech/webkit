#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { animate, curve, duration } from '../src/tokens/primitives/animations/animate.js';
import { animateExtras, keyframes } from '../src/tokens/primitives/animations/keyframes.js';
import { breakpoints } from '../src/tokens/primitives/breakpoints.js';
import { compilePrimitivesVars } from './lib/primitives.mjs';
import {
  compileThemeCss,
  compileThemeVars,
  LIGHT_PIN,
  LIGHT_SELECTOR,
  SYSTEM_SELECTOR,
  UNPINNED_ROOT,
} from '../src/tokens/theme-colors.js';
import { code } from '../src/tokens/semantic/code.js';
import { layout, layoutUtilities } from '../src/tokens/semantic/layout.js';
import { spacing } from '../src/tokens/semantic/spacing.js';
import { typography } from '../src/tokens/semantic/typography.js';
import { zIndex } from '../src/tokens/semantic/z-index.js';
import { assertNoZeroWithUnit } from './lib/zero-unit.mjs';

const BREAKPOINT_ORDER = ['sm', 'md', 'lg', 'xl', '2xl'];

const kebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const flattenPrimitives = () => compilePrimitivesVars();

const splitResponsive = (value) => {
  if (value === null || typeof value !== 'object') return { _: String(value) };
  const out = {};
  for (const [bp, v] of Object.entries(value)) out[bp] = String(v);
  return out;
};

const flattenSingleValue = (data, varNameOf) => {
  const byBp = {};
  for (const [key, val] of Object.entries(data)) {
    for (const [bp, v] of Object.entries(splitResponsive(val))) {
      (byBp[bp] ||= {})[varNameOf(key)] = v;
    }
  }
  return byBp;
};

const flattenBundle = (data) => {
  const byBp = {};
  for (const [key, bundle] of Object.entries(data)) {
    for (const [prop, val] of Object.entries(bundle)) {
      if (prop === 'states') continue;
      const varName = `--${key}-${kebab(prop)}`;
      for (const [bp, v] of Object.entries(splitResponsive(val))) {
        (byBp[bp] ||= {})[varName] = v;
      }
    }
  }
  return byBp;
};

const pseudoClassName = (key) => {
  if (key === 'focusVisible') return 'focus-visible';
  return key;
};

const formatStateDecls = (rules) =>
  Object.entries(rules)
    .map(([prop, val]) => `${kebab(prop)}: ${val}`)
    .join('; ');

const buildFlatModel = () => ({
  primitives: flattenPrimitives(),
  spacings: flattenSingleValue(spacing, (k) => `--${k}`),
  zIndices: flattenSingleValue(zIndex, (k) => `--${k}`),
  layouts: flattenSingleValue(layout, (k) => `--${k}`),
  code: flattenSingleValue(code, (k) => `--${k}`),
  texts: flattenBundle(typography),
});

const formatVars = (vars, indent) =>
  Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n');

const emitComponentClasses = (indent = '  ') => {
  const lines = [];

  lines.push(`${indent}/* ── Spacings ── */`);
  for (const key of Object.keys(spacing)) {
    lines.push(`${indent}.gap-${key} { gap: var(--${key}); }`);
    lines.push(`${indent}.p-${key} { padding: var(--${key}); }`);
  }

  lines.push('');
  lines.push(`${indent}/* ── Animation extras (properties beyond the animation shorthand) ── */`);
  for (const [selector, decls] of Object.entries(animateExtras)) {
    const body = Object.entries(decls)
      .map(([prop, val]) => `${prop}: ${val};`)
      .join(' ');
    lines.push(`${indent}.${selector} { ${body} }`);
  }

  return lines.join('\n');
};

const emitTextUtilities = () => {
  const blocks = [];
  for (const [key, bundle] of Object.entries(typography)) {
    const baseProps = Object.keys(bundle).filter((prop) => prop !== 'states');
    const declLines = baseProps.map(
      (prop) => `  ${kebab(prop)}: var(--${key}-${kebab(prop)});`,
    );
    const nested = [];
    if (bundle.states) {
      for (const [pseudo, rules] of Object.entries(bundle.states)) {
        const pseudoSuffix = pseudoClassName(pseudo);
        nested.push(`  &:${pseudoSuffix} { ${formatStateDecls(rules)}; }`);
      }
    }
    blocks.push(`@utility ${key} {\n${[...declLines, ...nested].join('\n')}\n}`);

    if (bundle.transition) {
      blocks.push(
        `@media (prefers-reduced-motion: reduce) {\n  .${key} { transition: none; }\n}`,
      );
    }
  }
  return blocks.join('\n\n');
};

const AXIS_BY_PREFIX = {
  'bg-': { utility: (k) => k, prop: 'background-color' },
  'text-': { utility: (k) => k, prop: 'color' },
  'border-': { utility: (k) => k, prop: 'border-color' },
  'ring-': { utility: (k) => k, prop: '--tw-ring-color' },
};

const isCodeSyntax = (key) => key.startsWith('code-syntax-');
const isIllustration = (key) => key.startsWith('illustration-');
const isChart = (key) => key.startsWith('chart-');
const isSeverity = (key) => key.startsWith('severity-');

const emitSemanticColorUtilities = () => {
  const { light } = compileThemeVars();
  const keys = Object.keys(light).map((k) => k.replace(/^--/, ''));
  const blocks = [];
  const emitted = new Set(Object.keys(typography));

  for (const key of keys) {
    if (isCodeSyntax(key) || isIllustration(key) || isChart(key) || isSeverity(key)) continue;
    const prefixEntry = Object.entries(AXIS_BY_PREFIX).find(([prefix]) =>
      key.startsWith(prefix),
    );
    if (prefixEntry) {
      const [, axis] = prefixEntry;
      const utility = axis.utility(key);
      if (emitted.has(utility)) continue;
      emitted.add(utility);
      blocks.push(`@utility ${utility} { ${axis.prop}: var(--${key}); }`);
      continue;
    }
    for (const [prefix, axis] of Object.entries(AXIS_BY_PREFIX)) {
      if (prefix === 'ring-') continue;
      const utility = `${prefix}${key}`;
      if (emitted.has(utility)) continue;
      emitted.add(utility);
      blocks.push(`@utility ${utility} { ${axis.prop}: var(--${key}); }`);
    }
  }
  return blocks.join('\n');
};

const emitUtilities = (utilities) =>
  Object.entries(utilities)
    .map(([name, decls]) => {
      const body = Object.entries(decls)
        .map(([prop, value]) =>
          typeof value === 'object'
            ? `  ${prop} { ${formatStateDecls(value)}; }`
            : `  ${prop}: ${value};`,
        )
        .join('\n');
      return `@utility ${name} {\n${body}\n}`;
    })
    .join('\n\n');

const emitLayoutUtilities = () => emitUtilities(layoutUtilities);

const emitBaseLayer = () =>
  [
    '@layer base {',
    '  html {',
    '    -webkit-font-smoothing: antialiased;',
    '    -moz-osx-font-smoothing: grayscale;',
    '  }',
    '',
    '  body {',
    '    background-color: var(--bg-canvas);',
    '    color: var(--text-default);',
    '  }',
    '',
    '  [dir=rtl] {',
    '    --direction-sign: -1;',
    '  }',
    '',
    '  [dir=ltr] {',
    '    --direction-sign: 1;',
    '  }',
    '',
    '  :where(:lang(ar), :lang(fa), :lang(ur)) {',
    '    line-height: 1.75;',
    '  }',
    '',
    '  button:not(:disabled),',
    '  [role="button"]:not([aria-disabled="true"]),',
    '  summary {',
    '    cursor: pointer;',
    '  }',
    '}',
  ].join('\n');

const FORCED_COLORS_SELECTED = [
  '[role="option"][aria-selected="true"]',
  '[role="tab"][aria-selected="true"]',
  '[role="row"][aria-selected="true"]',
  '[role="gridcell"][aria-selected="true"]',
  '[role="treeitem"][aria-selected="true"]',
  '[role="menuitemradio"][aria-checked="true"]',
  '[role="menuitemcheckbox"][aria-checked="true"]',
  '[aria-current]:not([aria-current="false"])',
  '[aria-pressed="true"]',
];

const emitAccessibilityMedia = () =>
  [
    '@media (forced-colors: active) {',
    '  :focus-visible {',
    '    outline: 2px solid Highlight !important;',
    '    outline-offset: 2px !important;',
    '  }',
    '',
    `  :is(${FORCED_COLORS_SELECTED.join(', ')}) {`,
    '    outline: 2px solid SelectedItem;',
    '    outline-offset: -2px;',
    '  }',
    '}',
    '',
    '@media (prefers-reduced-motion: reduce) {',
    '  *, *::before, *::after {',
    '    animation-duration: 0.01ms !important;',
    '    animation-iteration-count: 1 !important;',
    '    transition-duration: 0.01ms !important;',
    '    scroll-behavior: auto !important;',
    '  }',
    '}',
  ].join('\n');

const emitKeyframes = () => {
  const blocks = [];
  for (const [name, steps] of Object.entries(keyframes)) {
    const body = Object.entries(steps)
      .map(([step, decls]) => `  ${step} { ${decls}; }`)
      .join('\n');
    blocks.push(`@keyframes ${name} {\n${body}\n}`);
  }
  return blocks.join('\n\n');
};

const ROOT_SELECTOR = LIGHT_SELECTOR;

const DARK_VARIANT = [
  '@custom-variant dark {',
  '  &:where([data-theme=dark], [data-theme=dark] *, .dark, .dark *) {',
  '    @slot;',
  '  }',
  '  @media (prefers-color-scheme: dark) {',
  `    &:where(${SYSTEM_SELECTOR}, ${SYSTEM_SELECTOR} *) {`,
  '      @slot;',
  '    }',
  `    &:where(${UNPINNED_ROOT}, ${UNPINNED_ROOT} *):not(:where(${LIGHT_PIN}, ${LIGHT_PIN.split(', ').map((s) => `${s} *`).join(', ')})) {`,
  '      @slot;',
  '    }',
  '  }',
  '}',
].join('\n');

const emitGlobalsCss = () => {
  const m = buildFlatModel();
  const primitivesEntries = Object.entries(m.primitives);

  const themeVars = {};
  const rootPrimitiveVars = {};
  for (const [k, v] of primitivesEntries) {
    if (k.startsWith('--color-') || k.startsWith('--breakpoint-')) themeVars[k] = v;
    else rootPrimitiveVars[k] = v;
    if (k.startsWith('--container-')) themeVars[k] = v;
  }

  for (const [name, shorthand] of Object.entries(animate)) {
    themeVars[`--animate-${name}`] = shorthand;
  }

  for (const [name, value] of Object.entries(duration)) {
    themeVars[`--transition-duration-${name}`] = value;
  }
  for (const [name, value] of Object.entries(curve)) {
    themeVars[`--ease-${name}`] = value;
  }

  const semanticBase = {
    ...rootPrimitiveVars,
    ...(m.spacings._ || {}),
    ...(m.zIndices._ || {}),
    ...(m.layouts._ || {}),
    ...(m.code._ || {}),
    ...(m.texts._ || {}),
  };

  const mediaBlocks = [];
  for (const bp of BREAKPOINT_ORDER) {
    const merged = {
      ...(m.spacings[bp] || {}),
      ...(m.zIndices[bp] || {}),
      ...(m.layouts[bp] || {}),
      ...(m.texts[bp] || {}),
    };
    if (Object.keys(merged).length === 0) continue;
    mediaBlocks.push(
      [
        `  @media (min-width: ${breakpoints[bp]}) {`,
        formatVars(merged, '    '),
        `  }`,
      ].join('\n'),
    );
  }

  return [
    '/* generated by build-tokens.mjs — do not edit */',
    '',
    '@import "tailwindcss";',
    '',
    DARK_VARIANT,
    '',
    '@theme {',
    formatVars(themeVars, '  '),
    '}',
    '',
    `${ROOT_SELECTOR} {`,
    formatVars(semanticBase, '  '),
    '',
    mediaBlocks.join('\n\n'),
    '}',
    '',
    '/* ── Theme semantics (primary, secondary, surfaces, feedback, …) ── */',
    compileThemeCss(),
    '',
    emitKeyframes(),
    '',
    '@layer components {',
    emitComponentClasses(),
    '}',
    '',
    emitTextUtilities(),
    '',
    emitLayoutUtilities(),
    '',
    emitSemanticColorUtilities(),
    '',
    emitBaseLayer(),
    '',
    emitAccessibilityMedia(),
    '',
  ].join('\n');
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = resolve(__dirname, '../dist');

const fontsCss = await readFile(
  resolve(__dirname, '../src/tokens/primitives/fonts.css'),
  'utf8',
);

await mkdir(dir, { recursive: true });
const css = emitGlobalsCss();
assertNoZeroWithUnit(css, 'globals.css');
await writeFile(resolve(dir, 'globals.css'), css, 'utf8');
await writeFile(resolve(dir, 'globals.scss'), css, 'utf8');
await writeFile(resolve(dir, 'globals.d.ts'), 'export {};\n', 'utf8');
const fonts = `/* generated by build-tokens.mjs — do not edit */\n\n${fontsCss}`;
assertNoZeroWithUnit(fonts, 'fonts.css');
await writeFile(resolve(dir, 'fonts.css'), fonts, 'utf8');
await writeFile(resolve(dir, 'fonts.d.ts'), 'export {};\n', 'utf8');
console.log(`✓ theme → ${dir}`);
