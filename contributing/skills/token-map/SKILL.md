---
name: token-map
description: Map a Figma token JSON blob to TOKENS.md classes / `var(--*)` semantic tokens. Pure transformation; never edits the spec or component files.
status: active
last_updated: 2026-05-22
scope: webkit
enforced_by: [styling, migration]
---

# Skill: token-map

## Purpose

Transform the structured JSON from `figma-extract` into a deterministic mapping of `figma_variable → TOKENS.md token` rows. Flag any Figma variable that has no equivalent as a theme gap.

## When to invoke

- Step 2 of `/component-create`, immediately after `figma-extract`.
- Step 1 of `/spec-create` when populating the Tokens table of a draft spec.

## Inputs

- The JSON blob from `figma-extract`.
- The canonical catalog in [`contributing/docs/TOKENS.md`](../../docs/TOKENS.md) (mirror of TOKENS.md).
- The authoritative file [`contributing/docs/TOKENS.md`](../../../contributing/docs/TOKENS.md) — load read-only and use it to verify any class/var the mirror does not list.

## Workflow

1. **Parse input JSON.** Reject if `variables` is absent. An empty `variables` array is valid (emit an empty mapping with a comment).
2. **For each Figma variable**, classify by kind:
   - `color/...` → look for matching semantic var (`--primary`, `--bg-surface`, `--text-default`, …) in TOKENS.md's "Colors" catalog.
   - `text/...` → match a generated class (`.text-heading-md`, `.text-button-lg`, …).
   - `spacing/N` → match `var(--spacing-N)`.
   - `radius/...` → match `var(--shape-*)`.
   - `shadow/...` → match `var(--shadow-*)`.
   - `container/...` → match `var(--container-*)` or a `--layout-measure*` token.
3. **No fuzzy matching.** If the Figma name does not point at an exact TOKENS.md token, emit a row with `Theme gap: yes` and the closest primitive (`shadow-lg`, `gap-2`, …).
4. **Emit two artifacts** to stdout:
   ```markdown
   ### Token mapping

   | Figma variable | Resolved to | Source |
   |---|---|---|
  | color/surface | `var(--bg-surface)` | TOKENS.md |
  | text/heading-md | `.text-heading-md` | TOKENS.md |

   ### Theme gaps

   | Figma variable | Temporary primitive | Follow-up |
   |---|---|---|
   | color/overlay-shadow | `shadow-lg` | `TODO: tokenize` |
   ```

## Outputs

- The two Markdown tables above. Nothing else.

## Rules

- **Do not** invent a TOKENS.md token that does not exist. If unsure, flag a theme gap.
- **Do not** edit TOKENS.md, the spec, or any component file.
- **Do not** restate the TOKENS.md catalog beyond the mapping — the mirror in [`tokens.md`](../../docs/TOKENS.md) is enough.
- **Do not** suggest a HEX/RGB/HSL/Tailwind palette fallback. Always use a `var(--*)` primitive or a generated class.
- **Do not** carry a Figma zero over with its unit. A Figma value of `0px` / `0em` maps to `0` — a zero length takes no unit (see [`contributing/rules/styling.md`](../../rules/styling.md)). Units that mean something at zero (`0%`, `0s`, `0deg`) map as-is, and a zero that lands inside `calc()`/`min()`/`max()`/`clamp()` maps to `0rem` (CSS requires a unit there).

## Fallbacks

- Empty `variables` → emit `### Token mapping\n\n_(no Figma variables)_` and skip Theme gaps.
- TOKENS.md missing → emit `BLOCKED: TOKENS.md not found at contributing/docs/TOKENS.md` and exit.

## Definition of Done

- [ ] Mapping table produced (or empty-marker comment).
- [ ] Theme gaps table produced (or empty-marker comment).
- [ ] Every "Resolved to" cell is either a `.text-*` class or a `var(--*)` literal.
- [ ] No HEX / RGB / Tailwind / external color utility in the output.
- [ ] No zero carrying a length unit in the output — a zero resolves to `0` (`0rem` only inside a math function).
