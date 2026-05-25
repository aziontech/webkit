---
name: reuse-audit
description: Scan composables, utility components, and same-category siblings for logic that should be reused instead of duplicated. Emits a structured suggestion list.
status: active
last_updated: 2026-05-22
---

# Skill: reuse-audit

## Purpose

Before scaffolding, prove whatever logic the new component needs does not already exist somewhere. Duplicating `useToast`, `Spinner`, or `Currency` causes drift; this skill catches that.

## When to invoke

- Step 2 (parallel discovery) of `/component-create`.

## Inputs

- The full text of `.specs/<name>.md` (to know what props/events/states the component needs).
- Read-only access to:
  - `packages/webkit/src/composables/`
  - `packages/webkit/src/components/webkit/utils/`
  - `packages/webkit/src/components/webkit/<category>/` (siblings of the new component)
  - `packages/theme/src/` (animations, transitions)

## Workflow

1. **Index existing reusables.** List every directory under `composables/`, every `utils/<name>/`, every same-category sibling. For each, read `package.json` to get the export name and the `.vue`'s `defineOptions.name`.
2. **Match by intent.** For each props/events/state in the spec, search for keywords:
   - `loading` / `spinner` → `webkit/utils/spinner`
   - `toast` / `notification` → `composables/use-toast`
   - `dialog` open/close → `composables/use-dialog`
   - `currency` / `price` → `webkit/content/currency`
   - `tag` → `webkit/content/tag`
   - and so on.
3. **Emit suggestions** as a JSON array:
   ```json
   [
     {
       "spec_needs": "loading state",
       "reuse": "@aziontech/webkit/utils/spinner",
       "rationale": "Existing utility used in button.vue and card-pricing.vue"
     }
   ]
   ```
4. **Empty array** is a valid output (nothing to reuse).

## Outputs

- A JSON array (possibly empty). Nothing else.

## Rules

- **Do not** suggest a path that does not exist. If `composables/use-toast` is not in the filesystem, do not name it.
- **Do not** invent new utility locations. If a need cannot be satisfied by what exists, omit the row — the scaffolder will write the logic inline, and a follow-up PR can extract it.
- **Do not** edit any file. This is read-only.

## Fallbacks

- A target directory does not exist → silently skip it (do not emit an error).

## Definition of Done

- [ ] JSON array emitted (possibly empty).
- [ ] Every `reuse` path resolves to a real file under `packages/webkit/`.
- [ ] No prose, no decisions, no edits.
