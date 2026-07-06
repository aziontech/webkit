#!/usr/bin/env node
/**
 * Build design tokens into a Tailwind v4 stylesheet.
 *
 * Usage:
 *   node build-tokens.mjs
 *
 * Output:
 *   - dist/v4/globals.css  @import "tailwindcss" + @theme + :root @media + @keyframes
 *   - dist/v4/globals.scss identical bytes, .scss extension
 *
 * Inputs:
 *   - `tokens/primitives/**`    declarative primitives (colors, spacings,
 *                               typography, breakpoints, animations, …)
 *   - `tokens/semantic/{containers,spacings,texts}.data.js`
 *                               responsive-shaped semantic tokens
 *   - `tokens/primitives/animations/{animate,keyframes}.js`
 *                               animation utilities (`--animate-*`) + `@keyframes`
 *                               definitions + extra CSS (transform-origin) for
 *                               popup-scale-*.
 *
 * No external deps — node:fs/promises, node:path, node:url only.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { animate } from '../tokens/primitives/animations/animate.js';
import { animateExtras, keyframes } from '../tokens/primitives/animations/keyframes.js';
import { breakpoints } from '../tokens/primitives/breakpoints.js';
import { buildTrees, flatten } from './compile-primitives.js';
import { compileThemeCss } from './compile-theme.js';
import { containersData } from '../tokens/semantic/containers.data.js';
import { spacingsData } from '../tokens/semantic/spacings.data.js';
import { textsData } from '../tokens/semantic/texts.data.js';

const BREAKPOINT_ORDER = ['sm', 'md', 'lg', 'xl', '2xl'];

const kebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

// ─── 1. Primitives ──────────────────────────────────────────────────────────
const flattenPrimitives = () => {
  const { refsTree, varsTree } = buildTrees();
  return flatten(varsTree, refsTree);
};

// ─── 2. Semantic flattening ─────────────────────────────────────────────────
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
  texts: flattenBundle(textsData),
});

// ─── 3. Formatting helpers ─────────────────────────────────────────────────
const formatVars = (vars, indent) =>
  Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n');

/** Component classes (.text-*, .gap-*, .px-container). */
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
  lines.push(`${indent}/* ── Texts ── */`);
  for (const [key, bundle] of Object.entries(textsData)) {
    const baseProps = Object.keys(bundle).filter((prop) => prop !== 'states');
    const decls = baseProps
      .map((prop) => `${kebab(prop)}: var(--${key}-${kebab(prop)});`)
      .join(' ');
    lines.push(`${indent}.${key} { ${decls} }`);

    if (bundle.states) {
      for (const [pseudo, rules] of Object.entries(bundle.states)) {
        const pseudoSuffix = pseudoClassName(pseudo);
        lines.push(`${indent}.${key}:${pseudoSuffix} { ${formatStateDecls(rules)}; }`);
      }
    }

    if (bundle.transition) {
      lines.push(`${indent}@media (prefers-reduced-motion: reduce) {`);
      lines.push(`${indent}  .${key} { transition: none; }`);
      lines.push(`${indent}}`);
    }
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

/** Emit `@keyframes` blocks at the top level of the stylesheet. */
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

// ─── 4. v4 emission (@import "tailwindcss" + @theme) ───────────────────────
/**
 * v4 puts color primitives, breakpoints, and animation shorthands under
 * `@theme` so Tailwind auto-generates `bg-gray-50`, `text-violet-500`,
 * `sm:` screens, and `animate-*` utilities. Semantic tokens stay in plain
 * `:root` (with `@media` overrides) so we keep full control of the
 * component classes.
 *
 * Notes:
 *   - `@theme { --color-* }`      → color utilities.
 *   - `@theme { --breakpoint-* }` → screens (`sm:`, `md:`, …).
 *   - `@theme { --animate-* }`    → `animate-*` utilities (the shorthand
 *                                    references a `@keyframes` emitted
 *                                    later in the file).
 *   - Semantic shape/typography tokens are NOT in @theme — we own their
 *     class definitions in @layer components and they swap responsively
 *     via `:root @media` overrides.
 */
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

  const semanticBase = {
    ...rootPrimitiveVars,
    ...(m.containers._ || {}),
    ...(m.spacings._ || {}),
    ...(m.texts._ || {}),
  };

  const mediaBlocks = [];
  for (const bp of BREAKPOINT_ORDER) {
    const merged = {
      ...(m.containers[bp] || {}),
      ...(m.spacings[bp] || {}),
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
    ' * `@aziontech/webkit` components use arbitrary values (`bg-[var(--x)]`) that',
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
  ].join('\n');
};

// ─── 5. Write to disk ──────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const distRoot = resolve(__dirname, '../../dist');

const fontsCss = await readFile(
  resolve(__dirname, '../tokens/primitives/fonts.css'),
  'utf8',
);

const dir = resolve(distRoot, 'v4');
await mkdir(dir, { recursive: true });
// `@import` must precede every other at-rule (CSS spec); `@font-face` before
// `@import "tailwindcss"` would silently invalidate the import and skip
// Tailwind's layer setup / utility generation. Splice fonts in AFTER the
// import line by looking for the marker in the emitted CSS.
const rawCss = emitCssV4();
const IMPORT_LINE = '@import "tailwindcss";';
const importIdx = rawCss.indexOf(IMPORT_LINE);
if (importIdx === -1) throw new Error('emitCssV4 output is missing the tailwind import line');
const afterImport = importIdx + IMPORT_LINE.length;
const css = `${rawCss.slice(0, afterImport)}\n\n${fontsCss}${rawCss.slice(afterImport)}`;
await writeFile(resolve(dir, 'globals.css'), css, 'utf8');
await writeFile(resolve(dir, 'globals.scss'), css, 'utf8');
console.log(`✓ v4 → ${dir}`);
