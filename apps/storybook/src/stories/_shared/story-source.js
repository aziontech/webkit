// Shared "Show code" source helpers for Storybook docs.
//
// Storybook's dynamic Vue snippet has two defects that make the Docs
// "Show code" panel non-copyable:
//   1. it lowercases / kebab-cases the component tag (`<skeleton>` instead of
//      `<Skeleton>`), so a paste fails to resolve the component;
//   2. it wraps the markup in a `<template>` that, when wrapped again by a
//      naive transform, produces a nested `<template><template>…`.
//
// Every story routes its `docs.source` through the helpers below so the snippet
// is always a single, runnable single-file component (SFC) whose tags match the
// import exactly. This is the ONLY sanctioned way to emit "Show code" — see
// `.claude/rules/storybook-source.md`.

/** PascalCase component name → the kebab-case tag Storybook emits. */
const toKebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * Wrap a `<template>` body in a runnable SFC so "Show code" shows exactly what a
 * consumer would paste. Use this for composite stories that pass an explicit
 * `source.code`.
 *
 * @param {string | string[]} imports - one import line, or several.
 * @param {string} body - the inner `<template>` markup, using PascalCase tags.
 * @returns {string}
 */
export const toSfc = (imports, body) => {
  const importLines = Array.isArray(imports) ? imports : [imports]
  const indented = body
    .trim()
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')
  return ['<script setup>', ...importLines, '</script>', '', '<template>', indented, '</template>'].join('\n')
}

/**
 * Build a `docs.source.transform` that normalizes Storybook's dynamic snippet
 * into a runnable SFC:
 *   1. pass a value that is already a full SFC straight through (a composite
 *      story's own `source.code`);
 *   2. unwrap the extra `<template>` Storybook adds;
 *   3. restore PascalCase tags for each declared component;
 *   4. wrap the markup in `<script setup>` + `<template>`.
 *
 * @param {object} opts
 * @param {string | string[]} opts.imports - import line(s) for the SFC.
 * @param {string[]} opts.components - PascalCase component names in the markup.
 * @returns {(code: string) => string}
 */
export const sfcTransform =
  ({ imports, components }) =>
  (code) => {
    let src = String(code).trim()
    if (/<script[\s>]/i.test(src)) return src
    const wrapped = src.match(/^<template>\s*([\s\S]*?)\s*<\/template>$/)
    if (wrapped) src = wrapped[1].trim()
    for (const name of components) {
      for (const tag of new Set([name.toLowerCase(), toKebab(name)])) {
        src = src.replace(new RegExp(`(<\\/?)${tag}(?=[\\s/>])`, 'g'), `$1${name}`)
      }
    }
    return toSfc(imports, src)
  }

/**
 * The canonical `parameters.docs` block. Spread it into a story's meta so the
 * "Show code" panel is always shown and always runnable.
 *
 * @param {object} opts
 * @param {string} [opts.component] - prose lead for the autodocs page.
 * @param {string | string[]} opts.imports - import line(s) for the SFC.
 * @param {string[]} opts.components - PascalCase component names in the markup.
 * @returns {object}
 */
export const runnableDocs = ({ component, imports, components }) => ({
  ...(component ? { description: { component } } : {}),
  source: {
    type: 'dynamic',
    excludeDecorators: true,
    transform: sfcTransform({ imports, components })
  },
  canvas: { sourceState: 'shown' }
})
