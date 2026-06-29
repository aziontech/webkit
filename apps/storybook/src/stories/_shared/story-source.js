// Shared "Show code" source helper for Storybook docs.
//
// Storybook's *dynamic* Vue source is unreliable for our components: it emits
// the tag from the .vue file name (`<skeleton>`, `<chips>`) instead of the
// PascalCase import binding, double-wraps `<template>`, and — when `docs` is not
// a plain object literal — silently falls back to printing the raw CSF story
// object. So we DO NOT rely on it. Every story declares an explicit
// `parameters.docs.source.code`, built from `toSfc`, so "Show code" always shows
// a single, runnable, copy-paste-ready SFC that matches the canvas exactly.
//
// See `.claude/rules/storybook-source.md`.

/**
 * Wrap a `<template>` body in a runnable single-file component.
 *
 * @param {string | string[]} imports - one import line, or several.
 * @param {string} body - the inner `<template>` markup, using PascalCase tags
 *   that match the import binding(s). Must NOT contain its own `<template>`.
 * @returns {string} a complete `<script setup>` + `<template>` SFC.
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
