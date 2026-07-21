---
name: token-map
description: Map a Figma token JSON blob to DESIGN.md classes / `var(--*)` semantic tokens. Pure transformation; never edits the spec or component files.
status: active
last_updated: 2026-05-22
scope: webkit
enforced_by: [styling, migration]
---

# Skill: token-map

## Purpose

Transform the structured JSON from `figma-discover` into a deterministic mapping of `figma_variable → DESIGN.md token` rows. Flag any Figma variable that has no equivalent as a theme gap.

## When to invoke

- Step 2 of `/component-create`, immediately after `figma-discover`.
- Step 1 of `/spec-create` when populating the Tokens table of a draft spec.

## Inputs

- The JSON blob from `figma-discover`.
- The canonical catalog in [`.claude/docs/DESIGN.md`](../../docs/DESIGN.md) (mirror of DESIGN.md).
- The authoritative file [`.claude/docs/DESIGN.md`](../../../.claude/docs/DESIGN.md) — load read-only and use it to verify any class/var the mirror does not list.

## Workflow

1. **Parse input JSON.** Reject if `variables` is absent. An empty `variables` array is valid (emit an empty mapping with a comment).
2. **For each Figma variable**, classify by kind:
   - `color/...` → look for matching semantic var (`--primary`, `--bg-surface`, `--text-default`, …) in DESIGN.md's "Colors" catalog.
   - `text/...` → match a generated class (`.text-heading-md`, `.text-button-lg`, …).
   - `spacing/N` → match `var(--spacing-N)`.
   - `radius/...` → match `var(--shape-*)`.
   - `shadow/...` → match `var(--shadow-*)`.
   - `container/...` → match `var(--container-*)` or `var(--container-max-width)`.
3. **No fuzzy matching.** If the Figma name does not point at an exact DESIGN.md token, emit a row with `Theme gap: yes` and the closest primitive (`shadow-lg`, `gap-2`, …).
4. **Emit two artifacts** to stdout:
   ```markdown
   ### Token mapping

   | Figma variable | Resolved to | Source |
   |---|---|---|
  | color/surface | `var(--bg-surface)` | DESIGN.md |
  | text/heading-md | `.text-heading-md` | DESIGN.md |

   ### Theme gaps

   | Figma variable | Temporary primitive | Follow-up |
   |---|---|---|
   | color/overlay-shadow | `shadow-lg` | `TODO: tokenizar` |
   ```

## Outputs

- The two Markdown tables above. Nothing else.

## Rules

- **Do not** invent a DESIGN.md token that does not exist. If unsure, flag a theme gap.
- **Do not** edit DESIGN.md, the spec, or any component file.
- **Do not** restate the DESIGN.md catalog beyond the mapping — the mirror in [`tokens.md`](../../docs/DESIGN.md) is enough.
- **Do not** suggest a HEX/RGB/HSL/Tailwind palette fallback. Always use a `var(--*)` primitive or a generated class.

## Fallbacks

- Empty `variables` → emit `### Token mapping\n\n_(no Figma variables)_` and skip Theme gaps.
- DESIGN.md missing → emit `BLOCKED: DESIGN.md not found at .claude/docs/DESIGN.md` and exit.

## Definition of Done

- [ ] Mapping table produced (or empty-marker comment).
- [ ] Theme gaps table produced (or empty-marker comment).
- [ ] Every "Resolved to" cell is either a `.text-*` class or a `var(--*)` literal.
- [ ] No HEX / RGB / Tailwind / external color utility in the output.
