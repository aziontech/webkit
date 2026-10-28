#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { animate, curve, duration } from '../tokens/primitives/animations/animate.js';
import { animateExtras, keyframes } from '../tokens/primitives/animations/keyframes.js';
import { breakpoints } from '../tokens/primitives/breakpoints.js';
import { compilePrimitivesVars } from './compile-primitives.js';
import { compileThemeCss, compileThemeVars } from './compile-theme.js';
import { containersData } from '../tokens/semantic/containers.data.js';
import { layoutsData, layoutsUtilities } from '../tokens/semantic/layouts.data.js';
import { spacingsData } from '../tokens/semantic/spacings.data.js';
import { textsData } from '../tokens/semantic/texts.data.js';
import { zIndicesData } from '../tokens/semantic/z-indices.data.js';
import { assertNoZeroWithUnit } from './zero-unit.mjs';

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
  containers: flattenSingleValue(containersData, (k) => `--container-${k}`),
  spacings: flattenSingleValue(spacingsData, (k) => `--${k}`),
  zIndices: flattenSingleValue(zIndicesData, (k) => `--${k}`),
  layouts: flattenSingleValue(layoutsData, (k) => `--${k}`),
  texts: flattenBundle(textsData),
});

const formatVars = (vars, indent) =>
  Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n');

const emitComponentClasses = (indent = '  ') => {
  const lines = [];

  lines.push(`${indent}/* ── Containers ── */`);
  lines.push(`${indent}.px-container { padding-left: var(--container-px); padding-right: var(--container-px); }`);
  lines.push(`${indent}.py-container { padding-top: var(--container-py); padding-bottom: var(--container-py); }`);
  lines.push(`${indent}.max-container-width { max-width: var(--container-max-width); }`);

  lines.push('');
  lines.push(`${indent}/* ── Spacings ── */`);
  for (const key of Object.keys(spacingsData)) {
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
  for (const [key, bundle] of Object.entries(textsData)) {
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

const isCodeSintax = (key) => key.startsWith('code-sintax-');
const isIllustration = (key) => key.startsWith('illustration-');

const emitSemanticColorUtilities = () => {
  const { light } = compileThemeVars();
  const keys = Object.keys(light).map((k) => k.replace(/^--/, ''));
  const blocks = [];
  const emitted = new Set(Object.keys(textsData));

  for (const key of keys) {
    if (isCodeSintax(key) || isIllustration(key)) continue;
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

const emitLayoutUtilities = () => emitUtilities(layoutsUtilities);

const emitBaseLayer = () =>
  [
    '@layer base {',
    '  html {',
    '    -webkit-font-smoothing: antialiased;',
    '    -moz-osx-font-smoothing: grayscale;',
    '  }',
    '',
    '  button:not(:disabled),',
    '  [role="button"]:not([aria-disabled="true"]),',
    '  summary {',
    '    cursor: pointer;',
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

const V4_SELECTOR = ':root, [data-theme=light], .azion.azion-light';

const emitCssV4 = () => {
  const m = buildFlatModel();
  const primitivesEntries = Object.entries(m.primitives);

  const themeVars = {};
  const rootPrimitiveVars = {};
  for (const [k, v] of primitivesEntries) {
    if (k.startsWith('--color-') || k.startsWith('--breakpoint-')) themeVars[k] = v;
    else rootPrimitiveVars[k] = v;
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
    ...(m.containers._ || {}),
    ...(m.spacings._ || {}),
    ...(m.zIndices._ || {}),
    ...(m.layouts._ || {}),
    ...(m.texts._ || {}),
  };

  const mediaBlocks = [];
  for (const bp of BREAKPOINT_ORDER) {
    const merged = {
      ...(m.containers[bp] || {}),
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
    '/*',
    ' * `@aziontech/webkit` components use arbitrary values (`bg-(--x)`) that',
    ' * Tailwind v4 only picks up when the source files are inside the scan.',
    ' * Auto-detect scans the CWD only, so we point `@source` at the webkit',
    ' * package via a monorepo-relative path (this file is under',
    ' * `packages/theme/dist/v4/`; walking up three levels reaches `packages/`).',
    ' */',
    '@source "../../../webkit/src";',
    '',
    '@theme {',
    formatVars(themeVars, '  '),
    '}',
    '',
    `${V4_SELECTOR} {`,
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
  ].join('\n');
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const distRoot = resolve(__dirname, '../../dist');

const fontsCss = await readFile(
  resolve(__dirname, '../tokens/primitives/fonts.css'),
  'utf8',
);

const dir = resolve(distRoot, 'v4');
await mkdir(dir, { recursive: true });
const rawCss = emitCssV4();
const IMPORT_LINE = '@import "tailwindcss";';
const importIdx = rawCss.indexOf(IMPORT_LINE);
if (importIdx === -1) throw new Error('emitCssV4 output is missing the tailwind import line');
const afterImport = importIdx + IMPORT_LINE.length;
const css = `${rawCss.slice(0, afterImport)}\n\n${fontsCss}${rawCss.slice(afterImport)}`;
assertNoZeroWithUnit(css, 'globals.css');
await writeFile(resolve(dir, 'globals.css'), css, 'utf8');
await writeFile(resolve(dir, 'globals.scss'), css, 'utf8');
console.log(`✓ v4 → ${dir}`);
