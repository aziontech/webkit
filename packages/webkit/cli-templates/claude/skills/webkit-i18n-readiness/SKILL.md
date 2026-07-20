---
name: webkit-i18n-readiness
description: Build @aziontech/webkit screens so they localize cheaply later — Azion ships EN/PT-BR/ES on its other properties, so this UI will too. Use when building or reviewing any view with user-facing copy. Routes all strings through the app's i18n layer, sizes layouts for +30-50% text expansion, uses CSS logical properties for RTL, and formats dates/numbers via Intl — never hand-built strings.
status: active
last_updated: 2026-07-20
---

# Skill: webkit-i18n-readiness

## Purpose

Localization is cheap to design in and expensive to retrofit. A screen with hardcoded English strings,
pixel-fixed to the English word length, using `margin-left` and hand-formatted dates, has to be
reopened line by line the day it ships in another language. Azion already runs EN/PT-BR/ES across its
other properties, so this UI will too. This skill makes a view **translation-ready by construction** —
copy flows through the app's i18n layer, layouts survive longer languages, dates come from `Intl` — so
turning localization on later is a config change, not a rewrite.

## How to use

- `/webkit-i18n-readiness` — apply the readiness rules to any view you build in this conversation.
- `/webkit-i18n-readiness <file>` — review the file and report, per gap: the quoted line, what breaks
  when localized, and the concrete fix.

## Prioritize by the roadmap

The **value of this skill tracks the localization roadmap.** These patterns (i18n keys, logical
properties, `Intl`) are nearly free to write _now_ and costly to bolt on _later_, so default to them
even on an EN-only view. Reserve the deeper work — RTL mirroring passes, pseudo-locale expansion
testing — for surfaces actually slated to translate.

## Finding the components

Directional affordances (back buttons, chevrons, arrows) come from `@aziontech/webkit`. Don't guess an
import path: ask the **webkit MCP** (`suggest_component`, e.g. "icon button") or read
**`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real subpath. The
theme tokens (`var(--spacing-*)`, `var(--text-*)`) are **direction-agnostic** — no left/right bias — so
the bias lives in _your_ CSS, which this skill fixes.

## 1. No hardcoded user-facing strings

Every string a user reads goes through the app's i18n layer (`t('key')`). A literal in the template is
a string that can never be translated — that includes aria labels, placeholders, titles, and toasts.

```vue
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Button from '@aziontech/webkit/button'

  const { t } = useI18n()
  const selected = defineModel<string[]>({ default: () => [] })
</script>

<template>
  <!-- ✗ hardcoded — invisible to translation -->
  <h1>Workloads</h1>
  <Button label="Create workload" />

  <!-- ✓ routed through the i18n layer -->
  <h1>{{ t('workloads.title') }}</h1>
  <Button :label="t('workloads.create')" />

  <!-- interpolation stays WHOLE — one key + named slot; never split across elements -->
  <p>{{ t('workloads.deletedBy', { user: 'Ana' }) }}</p>
  <!-- ✗ never: <p>Deleted by <b>{{ user }}</b></p> — unreorderable per language -->

  <!-- pluralization via the i18n layer's plural rules, never string concatenation -->
  <span>{{ t('workloads.count', selected.length) }}</span>
  <!-- ✗ never: selected.length + ' items' -->
</template>
```

## 2. Layouts tolerate +30-50% text expansion

Translated strings run longer than English (German and PT-BR routinely +30-50%). A layout fixed to the
English word breaks the moment it holds a longer one.

- **Don't hard-`width` to the English string** — size buttons, labels, and chips to content
  (`min-width`, not fixed `width`); let containers wrap.
- **Don't truncate essential text.** Fine for a long user-supplied name in a dense table; not fine for
  a button label or validation message — the meaning must stay readable.
- **Test with a long pseudo-string** — swap a label for a long translation (or `"•••••••• ••••••••"`)
  and confirm nothing clips or overflows.

## 3. CSS logical properties, not physical left/right

RTL languages (Arabic, Hebrew) mirror the whole layout. Physical `left`/`right` don't flip; **logical**
properties do — write once, mirror for free. Reserve physical properties for physical intent (a shadow
offset), never for reading order.

| Physical (breaks RTL)        | Logical (mirrors)               | Tailwind                  |
| ---------------------------- | ------------------------------- | ------------------------- |
| `margin-left` / `-right`     | `margin-inline-start` / `-end`  | `ms-*` / `me-*`           |
| `padding-left` / `-right`    | `padding-inline-start` / `-end` | `ps-*` / `pe-*`           |
| `text-align: left` / `right` | `text-align: start` / `end`     | `text-start` / `text-end` |
| `left` / `right` offsets     | `inset-inline-start` / `-end`   | `start-*` / `end-*`       |

## 4. Directional icons mirror in RTL; decorative ones don't

An icon that encodes _direction_ — a back chevron, a "next" arrow, a breadcrumb separator — points the
wrong way in RTL unless it mirrors. A symbolic icon (gear, user, checkmark) must **not** flip. Mirror
only the directional set: `<i class="ai ai-chevron-left rtl:-scale-x-100" aria-hidden="true"></i>`.

## 5. Format dates, numbers, currency via `Intl` — never by hand

A hand-built date or a `,`-vs-`.` decimal is wrong in most locales. Format with `Intl` bound to the
**active locale**, sourced from the app's i18n state — not a per-call literal:

```vue
<script setup lang="ts">
  const locale = 'pt-BR' // the app's active locale, one source of truth per screen

  const when = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date())
  const size = new Intl.NumberFormat(locale, { style: 'unit', unit: 'megabyte' }).format(1.5)
  const cost = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(9.9)
</script>
```

## Hard rules

- No user-facing literal in a template — every string (labels, placeholders, aria, toasts) via `t()`.
- Keep an interpolated sentence in one key with named slots; never split it across elements.
- Pluralize via the i18n layer's plural rules, never string concatenation.
- Size layouts for +30-50% expansion; don't hard-`width` to English; don't truncate essential text.
- Use logical properties (`*-inline-*`, `text-align: start`) for reading order; physical left/right
  only for physical intent.
- Directional icons mirror in RTL; decorative icons never do.
- Dates/numbers/currency via `Intl` bound to the active locale — never hand-built strings.

## Paired enforcement — honest note

A lint rule catches the most common gap — a bare user-facing literal in a template (`vue-i18n`'s
`@intlify/no-raw-text` does exactly this) — and CI can run a pseudo-locale build to surface clipping.
Everything else here (logical properties, icon mirroring, `Intl` usage, whole interpolation) is caught
by **review, not a machine** — so the checklist below is the gate, not just the linter.

## Review output

For `/webkit-i18n-readiness <file>`, list gaps grouped by concern. Each:

```
✗ WorkloadsList.vue:14  <h1>Workloads</h1>
  i18n: hardcoded user-facing string — untranslatable.
  fix: {{ t('workloads.title') }} with the key in the locale file.
```

End with: `i18n-ready` or `N gaps — fix before localization`.

## Definition of Done

- [ ] No user-facing literal in any template — all copy, placeholders, and aria labels via `t()`.
- [ ] Interpolation whole (named slots); pluralization via the i18n layer, not concatenation.
- [ ] Layout holds a +30-50% pseudo-string without clipping or overflow; essential text not truncated.
- [ ] Reading-order spacing uses logical properties; directional icons mirror in RTL.
- [ ] Every date/number/currency goes through `Intl` bound to the active locale.
