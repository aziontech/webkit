---
name: figma-discover
description: Pull design tokens, regions, and states from a Figma frame via the Figma MCP. Pure read; emits a structured JSON blob the rest of the pipeline consumes.
status: active
last_updated: 2026-05-22
---

# Skill: figma-discover

## Purpose

Convert a Figma URL or `nodeId` into a structured JSON blob: colors, typography, spacing, radius, shadows, states (default/hover/active/focus/disabled), and identified regions (header/body/footer/actions). The downstream `token-map` skill consumes that JSON; this skill never decides anything beyond what Figma reports.

## When to invoke

- Step 2 (parallel discovery) of `/component-create`.
- During `/spec-create` when the user provided `--figma <url>`.

## Inputs

- A Figma frame URL or `nodeId`.

## Workflow

1. **Load prerequisite skill.** Invoke `figma:figma-use` before any MCP call (mandatory per Figma plugin instructions).
2. **Extract variables.** Call `mcp__plugin_figma_figma__get_variable_defs` on the target node. Capture every named Figma variable along with its resolved value.
3. **Extract design context.** Call `mcp__plugin_figma_figma__get_design_context` for the regions, states, and component anatomy.
4. **Normalize.** Emit a single JSON object:
   ```json
   {
     "figma_node": "<url>",
     "variables": [
       { "name": "color/surface", "value": "...", "kind": "color" },
       { "name": "text/heading-md", "value": "...", "kind": "typography" }
     ],
     "regions": ["header", "body", "footer", "actions"],
     "states": ["default", "hover", "active", "focus", "disabled"]
   }
   ```
5. **Print.** Emit only the JSON. No prose.

## Outputs

- A single JSON blob to stdout. Nothing else.

## Rules

- Do **not** decide anything (regions ≠ structure decision; that's `structure-decide`).
- Do **not** map Figma → Design.md; that's `token-map`.
- Do **not** echo the user's request — only emit structured data.
- Do **not** invoke `use_figma`, `create_new_file`, or any write-side Figma tool.

## Behavioral fidelity (the part that matters)

The discovery output drives the spec, which drives the `.vue`. The downstream consumers depend on you to capture Figma **behavior**, not just colors. Capture, when present in the frame:

- **All interactive states** the frame exposes — default, hover, active, focus, focus-visible, disabled, loading, selected. Each state goes into the `states` array.
- **Animation specs** the frame declares (timing, easing, named effect) — surface these in a `motion` sub-key so `token-map` can match them against [`semantic/animations.js`](../../../packages/theme/src/tokens/semantic/animations.js) (`animate-popup-scale-in`, `animate-fade-in`, etc.). If the Figma timing or easing does not match the catalog, surface it as a gap; **never** suggest inventing a new keyframe.
- **Layout intent** — fixed vs reorderable regions. This informs the monolithic vs composition decision later.
- **Component composition** — slots vs sub-components (header / body / footer / actions). Surface as `regions`.
- **Anchoring behavior** — for overlays/popovers, capture which side/align the frame implies (top/bottom/left/right), the offset, and whether it tracks the trigger. The scaffolder will implement this with CSS (`<Teleport>` + absolute positioning + CSS variables), **never** with `@floating-ui/*` or similar — see [`dependencies.md`](../../rules/dependencies.md).

Output the behavior structurally; do not paraphrase Figma's documentation into the spec.

## Migration fidelity

When the same Figma frame names a component differently from our convention (e.g. `HeaderNavigationMenuItem` or `Tabs/Variant=Primary`), keep the original name in `figma_node`/`variables` for traceability, but do **not** propose component names that bake the Figma name in. Our naming (`kind`, `size`, kebab-case files) takes precedence — see [`migration.md`](../../rules/migration.md).

## Fallbacks

- Figma MCP unreachable → emit `BLOCKED: figma MCP unreachable` and exit. The orchestrator may proceed without Figma if the user explicitly chose "ad-hoc, no Figma".
- Frame has no variables → emit `{ "variables": [], "regions": [...], "states": [...] }` and a comment line: `# no variables in frame`.
- Node ID invalid → emit `BLOCKED: invalid figma node`.

## Definition of Done

- [ ] JSON blob emitted with `figma_node`, `variables`, `regions`, `states`.
- [ ] No prose, no decisions, no Design.md mapping.
- [ ] All MCP calls used the read-only verbs (`get_*`).
