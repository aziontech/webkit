# Rule: direction — logical sides only, so every screen mirrors under `dir="rtl"`

UI built on `@aziontech/webkit` works in right-to-left languages (Arabic, Hebrew, Persian, Urdu)
without a second stylesheet. The page sets `dir="rtl"` (on `<html>` or the app root) and the
layout mirrors because nothing in it names a physical side. Text that is always left-to-right —
code, URLs, domains, IDs, keyboard shortcuts — stays left-to-right inside it.

## Do

- Use the **logical** utilities: `ms-*`/`me-*` (margin), `ps-*`/`pe-*` (padding), `start-*`/`end-*`
  (inset), `text-start`/`text-end`, `border-s`/`border-e`, `rounded-s`/`rounded-e` and the corners
  `rounded-ss`/`rounded-se`/`rounded-es`/`rounded-ee`, `float-start`/`float-end`,
  `scroll-ms-*`/`scroll-ps-*`.
- Center with `left-1/2 -translate-x-1/2`: the one physical pair allowed, because the result is the
  same in both directions.
- Mirror what points along the reading direction: arrows, chevrons, carets, "back"/"next", sign-in /
  sign-out. Webkit components already do it (`Button`/`IconButton`/`Link`/`Breadcrumb` `icon` props,
  and `@aziontech/webkit/styles` for any `pi pi-chevron-right`-style glyph); on your own glyph add
  `rtl:-scale-x-100`.
- Mirror horizontal motion with the `rtl:` variant: a panel that slides in with
  `-translate-x-full` also gets `rtl:translate-x-full`.
- Read the direction in script with `useDirection` (`@aziontech/webkit/use-direction`) whenever an
  arrow key or a pointer delta means "next" or "previous": under `rtl`, ArrowLeft moves forward.
  `logicalArrowKey(event.key, dir.value)` does the swap.
- Isolate user and system values printed inside sentences: `<bdi>{{ name }}</bdi>`, or
  `dir="ltr"` on values that are always left-to-right (code, URLs, domains, IDs, hashes, file
  paths). Webkit's `Input`, `Textarea`, `NumberInput` and `PasswordInput` already use
  `dir="auto"`; pass `dir` to override.
- Set `lang` with `dir` (`<html lang="ar" dir="rtl">`): the theme's sans stack falls back to Noto
  Sans Arabic and Arabic text gets a taller line height through `:lang(ar)`.

## Don't

- `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`, `border-l`,
  `border-r`, `rounded-l`, `rounded-tr`… in a class string. They stay put under `dir="rtl"` and the
  layout breaks: an icon gap on the wrong side, a drawer that opens from the wrong edge.
- Mirroring what does not point along the text: external-link arrows (`pi-arrow-up-right`,
  `pi-external-link`), play/pause and other media controls, logos, clocks, checkmarks, charts'
  value axes, code.
- Comparing `event.key === 'ArrowRight'` to mean "next" without the direction.
- Reading `scrollLeft` as a distance from the start: it is `0` or negative under `rtl`; use
  `Math.abs(el.scrollLeft)`.

## Example

```vue
<script setup lang="ts">
  import { logicalArrowKey, useDirection } from '@aziontech/webkit/use-direction'

  const dir = useDirection()
  const onKeydown = (event: KeyboardEvent) => {
    const key = logicalArrowKey(event.key, dir.value)
    if (key === 'ArrowRight') next()
    if (key === 'ArrowLeft') previous()
  }
</script>

<template>
  <div class="flex items-center gap-(--spacing-xs) ps-(--spacing-md)">
    <span class="truncate">{{ label }}</span>
    <span
      dir="ltr"
      class="ms-auto text-label-code-sm"
      >{{ domain }}</span
    >
    <i
      class="pi pi-chevron-right rtl:-scale-x-100"
      aria-hidden="true"
    />
  </div>
</template>
```

## Notes

- A `scope: general` standard: it applies to any component in an app that uses webkit, not only to
  webkit's own.
- Blocked by the `webkit/no-physical-direction` ESLint rule (error, autofix to the logical utility)
  in the consumer presets, and inside the package by `scripts/check-authoring.mjs` over
  `src/components`, `blocks` and `examples`.
- The rule reads class strings: static `class`, `:class`, `class`/`className` in JSX and Astro, and
  `cn`/`clsx`/`cva`/`tv` arguments. A class assembled from variables is a review concern.
