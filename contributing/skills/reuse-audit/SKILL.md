---
name: reuse-audit
description: Scan composables, utility components, and same-category siblings for logic that should be reused instead of duplicated. Emits a structured suggestion list.
status: active
last_updated: 2026-11-23
scope: webkit
enforced_by: [no-invention, imports, composables]
---

# Skill: reuse-audit

## Purpose

Before scaffolding, prove whatever logic the new component needs does not already exist somewhere. Duplicating `useToast`, `Spinner`, or `CurrencyAmount` causes drift; this skill catches that.

## When to invoke

- Step 2 (research and reuse) of `/component-new` and `/block-new`, and step 2 (parallel discovery) of `/component-create`.

## Inputs

- The full text of `.specs/<name>.md` (to know what props/events/states the component needs).
- Read-only access to:
  - `packages/webkit/src/composables/` (shared composables: `use-announcer`, `use-button-root`, `use-controllable`, `use-focus-trap`, …)
  - `packages/webkit/src/components/<category>/` (siblings of the new component)
  - `packages/webkit/package.json#exports` and `packages/webkit/catalog.json` (export names, `aliases`) — through the webkit MCP (`search_components`, `suggest_component`, `get_component`) first
  - `packages/theme/src/` (animations, transitions)

## Workflow

1. **Index existing reusables.** List every directory under `composables/` and every same-category sibling. Components ship no `package.json` of their own: take the export name from the flat key in `packages/webkit/package.json#exports` (or the MCP) and the `.vue`'s `defineOptions.name`.
2. **Match by intent.** For each props/events/state in the spec, search for keywords:
   - `loading` / `spinner` → `@aziontech/webkit/spinner`
   - `toast` / `notification` → `@aziontech/webkit/toast`
   - dialog open/close from a trigger → `use-dialog-trigger`
   - screen-reader announcements → `use-announcer` (`CODE_QUALITY.md` § 3.8)
   - option lists and listbox keyboard → `use-listbox-content`, `use-listbox-trigger`, `use-select-root`; take the list as an `options` / `items` prop, never by reading slot vnodes (§ 3.6)
   - `currency-amount` / `price` → `@aziontech/webkit/currency-amount`
   - `tag` → `@aziontech/webkit/tag`
   - and so on.
3. **Look-alikes.** A new component that does the job of an existing one fails `check:look-alikes` (35 % similarity with neither importing the other, `CODE_QUALITY.md` § 3.3). When a sibling renders the same root, spinner or inert state, the suggestion is to compose it or share its private part.
4. **Emit suggestions** as a JSON array:
   ```json
   [
     {
       "spec_needs": "loading state",
       "reuse": "@aziontech/webkit/spinner",
       "rationale": "Existing utility that Button and PricingCard already render"
     }
   ]
   ```
5. **Empty array** is a valid output (nothing to reuse).

## Outputs

- A JSON array (possibly empty). Nothing else.

## Rules

- **Do not** suggest a path that does not exist. If a composable folder or export key is not in the filesystem, do not name it.
- **Do not** invent new utility locations. If a need cannot be satisfied by what exists, omit the row — the component-scaffolder will write the logic inline, and a follow-up PR can extract it.
- **Do not** edit any file. This is read-only.

## Fallbacks

- A target directory does not exist → silently skip it (do not emit an error).

## Definition of Done

- [ ] JSON array emitted (possibly empty).
- [ ] Every `reuse` path resolves to a real file under `packages/webkit/`.
- [ ] No prose, no decisions, no edits.
