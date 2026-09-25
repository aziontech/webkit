#!/usr/bin/env node
/**
 * Build design tokens into self-contained stylesheets and Tailwind configs.
 *
 * Usage:
 *   node build-tokens.mjs                 # emit both v3 and v4
 *   node build-tokens.mjs --target=v3     # emit dist/v3/ only
 *   node build-tokens.mjs --target=v4     # emit dist/v4/ only
 *
 * v3 output (legacy preset model):
 *   - dist/v3/globals.css         @tailwind directives + @layer + responsive vars
 *   - dist/v3/globals.scss        identical bytes, .scss extension
 *   - dist/v3/tailwind.config.js  full CJS config (content + theme.extend)
 *   - dist/v3/tailwind-preset.js  ESM preset (theme.extend only)
 *
 * v4 output (CSS-first):
 *   - dist/v4/globals.css         @import "tailwindcss" + @theme + :root @media
 *   - dist/v4/globals.scss        identical bytes
 *
 * Shared schema: primitives come from `tokens/primitives/**` (already
 * declarative). Semantic responsive tokens come from
 * `tokens/semantic/{containers,spacings,texts}.data.js`.
 *
 * No external deps — node:fs/promises, node:path, node:url only.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { breakpoints } from '../tokens/primitives/breakpoints.js';
import { buildTrees, flatten } from './compile-primitives.js';
import { compileThemeCss } from './compile-theme.js';
import { containersData } from '../tokens/semantic/containers.data.js';
import { spacingsData } from '../tokens/semantic/spacings.data.js';
import { textsData } from '../tokens/semantic/texts.data.js';
import { semanticColors } from '../tokens/semantic/colors.js';
import { createCssVars } from './css-vars.js';

const BREAKPOINT_ORDER = ['sm', 'md', 'lg', 'xl', '2xl'];
const V3_SELECTOR = ':root, [data-theme=light], .azion.azion-light';

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

const SEMANTIC_PREFIXES = ['--text-', '--background-', '--border-'];
const isSemanticVar = (key) => SEMANTIC_PREFIXES.some((p) => key.startsWith(p));
const pickSemantic = (vars) =>
  Object.fromEntries(Object.entries(vars).filter(([k]) => isSemanticVar(k)));

const buildSemanticColorVars = () => {
  const { light, dark } = createCssVars();
  return { light: pickSemantic(light), dark: pickSemantic(dark) };
};

const buildFlatModel = () => ({
  primitives: flattenPrimitives(),
  containers: flattenSingleValue(containersData, (k) => `--container-${k}`),
  spacings: flattenSingleValue(spacingsData, (k) => `--${k}`),
  texts: flattenBundle(textsData),
  semanticColors: buildSemanticColorVars(),
});

// ─── 3. Shared formatting helpers ──────────────────────────────────────────
const formatVars = (vars, indent) =>
  Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n');

/** Component classes (.text-*, .gap-*, .px-container) — identical in v3/v4. */
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

  return lines.join('\n');
};

// ─── 4. v3 emission (@tailwind directives + @layer) ────────────────────────
const emitMediaBlockV3 = (bp, vars) =>
  [
    `  @media (min-width: ${breakpoints[bp]}) {`,
    `    ${V3_SELECTOR} {`,
    formatVars(vars, '      '),
    `    }`,
    `  }`,
  ].join('\n');

const V3_DARK_SELECTOR = '[data-theme=dark], .dark, .azion.azion-dark';

const emitCssV3 = () => {
  const m = buildFlatModel();

  const sections = [
    { title: 'Primitives', vars: m.primitives },
    { title: 'Containers', vars: m.containers._ || {} },
    { title: 'Spacings', vars: m.spacings._ || {} },
    { title: 'Texts', vars: m.texts._ || {} },
    { title: 'Semantic colors', vars: m.semanticColors.light },
  ];

  const baseBody = sections
    .filter((s) => Object.keys(s.vars).length > 0)
    .map((s) => `    /* ── ${s.title} ── */\n${formatVars(s.vars, '    ')}`)
    .join('\n\n');

  const mediaBlocks = [];
  for (const bp of BREAKPOINT_ORDER) {
    const merged = {
      ...(m.containers[bp] || {}),
      ...(m.spacings[bp] || {}),
      ...(m.texts[bp] || {}),
    };
    if (Object.keys(merged).length > 0) mediaBlocks.push(emitMediaBlockV3(bp, merged));
  }

  return [
    '/* generated by build-tokens.mjs — target: v3 — do not edit */',
    '',
    '@tailwind components;',
    '@tailwind utilities;',
    '',
    `${V3_SELECTOR} {`,
    baseBody,
    '}',
    '',
    mediaBlocks.join('\n\n'),
    '',
    `${V3_DARK_SELECTOR} {`,
    `  /* ── Semantic colors (dark) ── */`,
    formatVars(m.semanticColors.dark, '  '),
    '}',
    '',
    '/* ── Theme semantics (primary, secondary, surfaces, feedback, …) ── */',
    compileThemeCss(),
    '',
    '@layer components {',
    emitComponentClasses(),
    '}',
    '',
  ].join('\n');
};

const treeToVars = (tree, prefix) => {
  const out = {};
  for (const [key, val] of Object.entries(tree)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      out[key] = treeToVars(val, `${prefix}-${key}`);
    } else {
      out[key] = `var(${prefix}-${key})`;
    }
  }
  return out;
};

const buildPresetData = () => {
  const { refsTree } = buildTrees();
  const colors = treeToVars(refsTree.color, '--color');
  const fontWeight = refsTree.typography?.['font-weight']
    ? treeToVars(refsTree.typography['font-weight'], '--font-weight')
    : {};
  const dropShadow = refsTree.effects?.['drop-shadow']
    ? treeToVars(refsTree.effects['drop-shadow'], '--drop-shadow')
    : {};
  const lineHeight = refsTree.typography?.leading
    ? treeToVars(refsTree.typography.leading, '--leading')
    : {};
  const letterSpacing = refsTree.typography?.tracking
    ? treeToVars(refsTree.typography.tracking, '--tracking')
    : {};

  const fontSize = {};
  for (const [key, bundle] of Object.entries(textsData)) {
    if (!('fontSize' in bundle)) continue;
    if (bundle.fontSize === 'inherit') continue;
    const meta = {};
    if ('lineHeight' in bundle) meta.lineHeight = `var(--${key}-line-height)`;
    if ('letterSpacing' in bundle) meta.letterSpacing = `var(--${key}-letter-spacing)`;
    if ('fontWeight' in bundle) meta.fontWeight = `var(--${key}-font-weight)`;
    fontSize[key.replace(/^text-/, '')] = [`var(--${key}-font-size)`, meta];
  }

  return {
    theme: {
      extend: {
        colors,
        fontSize,
        fontWeight,
        dropShadow,
        lineHeight,
        letterSpacing,
        textColor: semanticColors.text,
        backgroundColor: semanticColors.background,
        borderColor: semanticColors.border,
      },
    },
  };
};

const emitPresetV3 = () => {
  const data = buildPresetData();
  return [
    '/* generated by build-tokens.mjs — target: v3 — do not edit */',
    `const preset = ${JSON.stringify(data, null, 2)};`,
    'export default preset;',
    '',
  ].join('\n');
};

const emitTailwindConfigV3 = () => {
  const data = buildPresetData();
  const config = {
    content: ['./src/tests/**/*.html'],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: data.theme,
    plugins: [],
  };
  return [
    '/* generated by build-tokens.mjs — target: v3 — do not edit */',
    `/** @type {import('tailwindcss').Config} */`,
    `module.exports = ${JSON.stringify(config, null, 2)};`,
    '',
  ].join('\n');
};

// ─── 5. v4 emission (@import "tailwindcss" + @theme) ───────────────────────
/**
 * v4 puts color primitives under `@theme` so Tailwind auto-generates
 * `bg-gray-50`, `text-violet-500`, etc. Semantic tokens stay in plain `:root`
 * (with `@media` overrides) so we keep full control of the component classes.
 *
 * Notes on v4 conventions used:
 *   - `@theme { --color-* }` → color utilities.
 *   - `@theme { --breakpoint-* }` → screens.
 *   - Semantic shape/typography tokens are NOT in @theme — we own their
 *     class definitions in @layer components and they swap responsively
 *     via `:root @media` overrides.
 */
const emitCssV4 = () => {
  const m = buildFlatModel();
  const primitivesEntries = Object.entries(m.primitives);

  // Split primitives: color/breakpoint go in @theme; everything else (shape,
  // typography, effects, border, ring-offset) stays in :root.
  const themeVars = {};
  const rootPrimitiveVars = {};
  for (const [k, v] of primitivesEntries) {
    if (k.startsWith('--color-') || k.startsWith('--breakpoint-')) themeVars[k] = v;
    else rootPrimitiveVars[k] = v;
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
    '/* generated by build-tokens.mjs — target: v4 — do not edit */',
    '',
    '@import "tailwindcss";',
    '',
    '@theme {',
    formatVars(themeVars, '  '),
    '}',
    '',
    ':root, [data-theme=light], .azion.azion-light {',
    formatVars(semanticBase, '  '),
    '',
    mediaBlocks.join('\n\n'),
    '}',
    '',
    '@layer components {',
    emitComponentClasses(),
    '}',
    '',
  ].join('\n');
};

// ─── 6. Write to disk ──────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const distRoot = resolve(__dirname, '../../dist');

const writeV3 = async () => {
  const dir = resolve(distRoot, 'v3');
  await mkdir(dir, { recursive: true });
  const css = emitCssV3();
  await writeFile(resolve(dir, 'globals.css'), css, 'utf8');
  await writeFile(resolve(dir, 'globals.scss'), css, 'utf8');
  await writeFile(resolve(dir, 'tailwind-preset.js'), emitPresetV3(), 'utf8');
  await writeFile(resolve(dir, 'tailwind.config.js'), emitTailwindConfigV3(), 'utf8');
  console.log(`✓ v3 → ${dir}`);
};

const writeV4 = async () => {
  const dir = resolve(distRoot, 'v4');
  await mkdir(dir, { recursive: true });
  const css = emitCssV4();
  await writeFile(resolve(dir, 'globals.css'), css, 'utf8');
  await writeFile(resolve(dir, 'globals.scss'), css, 'utf8');
  console.log(`✓ v4 → ${dir}`);
};

// ─── 7. CLI ────────────────────────────────────────────────────────────────
const parseTarget = () => {
  const arg = process.argv.find((a) => a.startsWith('--target='));
  if (!arg) return 'all';
  const value = arg.slice('--target='.length).toLowerCase();
  if (!['v3', 'v4', 'all'].includes(value)) {
    console.error(`Unknown --target=${value}. Use v3, v4, or all.`);
    process.exit(1);
  }
  return value;
};

const target = parseTarget();
if (target === 'v3' || target === 'all') await writeV3();
if (target === 'v4' || target === 'all') await writeV4();
