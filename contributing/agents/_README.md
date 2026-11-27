# `contributing/agents/` — isolated sub-agent prompts

Each file here defines the prompt for one isolated sub-agent. The orchestrators (`/component-new`, `/block-new`, `/component-create`) invoke them through the `Agent` tool, one phase at a time. **A sub-agent sees only the prompt the orchestrator hands it** — no conversation history, no other sub-agent's output, no chat memory. This is the structural guarantee that "the agent never invents."

## Universal prompt envelope

Every sub-agent is spawned with this envelope (filled in by the orchestrator):

```
=== SPEC (verbatim, do not modify) ===
<full content of .specs/<name>.md>

=== CONSTRAINTS (binding) ===
<verbatim copy of the spec's "Constraints — DO NOT" block>

=== RULES ===
<verbatim concatenation of the contributing/rules/*.md files this sub-agent needs>

=== SKILL ===
<verbatim content of contributing/skills/<skill>/SKILL.md>

=== TASK ===
<one paragraph from the orchestrator: precise, narrow, files-named>

=== OUTPUTS ===
Return JSON: { "files_written": [...], "decisions": {...}, "blocks": [] }.
If anything is ambiguous, emit a `BLOCKED: <reason>` line and write no files.
```

## Catalog

"TOKENS.md" and "COMPONENT_REQUIREMENTS.md" in the Reads column are the source-of-truth docs below, not rules. There is no `tokens` or `examples` rule: tokens live in TOKENS.md, the examples discipline in COMPONENT_REQUIREMENTS.md and [`naming.md`](../rules/naming.md) § 4, sample data in [`example-data.md`](../rules/example-data.md).

| Sub-agent                 | Skill it executes    | Reads (rules + docs)                                                                                                                                                                                                                                                                         | Writes                                                                                                              |
| ------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `spec-creator.md`         | `spec-create`        | TOKENS.md, naming, prop-vocabulary, dependencies, migration, example-data, COMPONENT_REQUIREMENTS.md                                                                                                                                                                                         | `.specs/<name>.md` (draft)                                                                                          |
| `spec-validator.md`       | `spec-validate`      | TOKENS.md, naming                                                                                                                                                                                                                                                                            | spec frontmatter only (status, checksum, last_updated)                                                              |
| `spec-reviewer.md`        | — (fixed checklist)  | naming, prop-vocabulary, component-states, accessibility, TOKENS.md, dependencies, bundle-budget                                                                                                                                                                                             | stdout JSON verdict only (`/component-new` step 4)                                                                  |
| `figma-extractor.md`      | `figma-extract`      | migration                                                                                                                                                                                                                                                                                    | stdout JSON only                                                                                                    |
| `token-mapper.md`         | `token-map`          | TOKENS.md                                                                                                                                                                                                                                                                                    | stdout Markdown only                                                                                                |
| `reuse-auditor.md`        | `reuse-audit`        | dependencies                                                                                                                                                                                                                                                                                 | stdout JSON only                                                                                                    |
| `structure-decider.md`    | `structure-decide`   | naming, compound-api                                                                                                                                                                                                                                                                         | stdout 2 lines only                                                                                                 |
| `component-scaffolder.md` | `component-scaffold` | **no-invention, naming, imports, compound-api, component-structure, props, prop-vocabulary, v-model, emits, event-payloads, slots, composables, root-element, component-states, styling, accessibility, testid, comments, testing, dependencies, migration**, TOKENS.md, CODE_QUALITY.md § 3 | `<name>.vue`, sub-components, `injection-key.ts`, `index.ts`, starter `<name>.test.ts`, root `package.json#exports` |
| `code-connect-writer.md`  | `code-connect-write` | naming, migration                                                                                                                                                                                                                                                                            | `<name>.figma.ts`                                                                                                   |
| `echo-reporter.md`        | `echo-report`        | naming, TOKENS.md, COMPONENT_REQUIREMENTS.md                                                                                                                                                                                                                                                 | stdout report only                                                                                                  |

## Rules catalog ([contributing/rules/](../rules/))

All 27 rules; [`README.md`](../rules/README.md) is the index and [`standards.mjs`](../hooks/lib/standards.mjs) pairs each one with its gates.

| File                     | Purpose                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `no-invention.md`        | The hard prohibitions; the spec is the contract                                                           |
| `prop-vocabulary.md`     | One canonical name/type/value set per concept (`variant`, `size`, `disabled`…)                            |
| `naming.md`              | One naming standard for every surface; retired names never come back                                      |
| `imports.md`             | Flat public export name; the category lives in the folder only                                            |
| `compound-api.md`        | Composition: `index.ts` compound + tree-shakeable `-root`; companion parts stay unattached                |
| `styling.md`             | Classes on the root (or one `ROOT_CLASS`), variants via `data-*`; no JS class presets, no `<style>` block |
| `dependencies.md`        | **No external positioning/animation libs.** CSS + Vue primitives only                                     |
| `migration.md`           | **Never inherit artifacts as-is.** Rewrite to our conventions                                             |
| `release-types.md`       | Commit type → release effect, identical across four sources                                               |
| `git-workflow.md`        | Branches and PRs through `/branch-create` and `/pr-open`                                                  |
| `component-structure.md` | Fixed folder layout + `<script setup>` section order                                                      |
| `props.md`               | Exported `interface <Component>Props` + `withDefaults` + JSDoc; exported variant unions                   |
| `v-model.md`             | Two-way values via `defineModel` — controlled + uncontrolled, one macro                                   |
| `emits.md`               | Typed `defineEmits`, kebab names, model vs. activation                                                    |
| `event-payloads.md`      | Activation events emit `(event, item)` — DOM event first                                                  |
| `slots.md`               | Typed `defineSlots`, kebab names, fallback inside the slot                                                |
| `composables.md`         | `readonly` outward, `toValue` args, `onScopeDispose` cleanup; context composable                          |
| `root-element.md`        | Own the root: polymorphism via `href`, `$attrs` forwarding, minimal `defineExpose`                        |
| `component-states.md`    | Declared, rendered state surface (loading/empty/error via DS components)                                  |
| `accessibility.md`       | Role, keyboard, focus, `motion-reduce`, contrast — owned by the component                                 |
| `testid.md`              | `data-testid` is the component's own name (`button`, `dialog-header`); inner parts `${testId}__<part>`    |
| `deprecation.md`         | 6.0 clean break; from then `@deprecated` → one major → remove                                             |
| `bundle-budget.md`       | A `.size-limit.json` budget per entry, gated by `check-size.mjs` (`size` gate); budgets only ratchet down |
| `testing.md`             | One `<name>.test.ts` per root component (Vitest browser mode + axe)                                       |
| `comments.md`            | No prose comments; API JSDoc and tool directives only                                                     |
| `example-data.md`        | `example.com` domains, Acme, fictional US data, no national formats                                       |
| `authoring-docs.md`      | Skill and agent frontmatter; no source file named as an example                                           |

## Source-of-truth docs ([contributing/docs/](../docs/))

| File                        | Purpose                                                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `TOKENS.md`                 | Tokens (typography, spacing, container, shape, shadow, colors), animation catalog, forbidden list                                               |
| `COMPONENT_REQUIREMENTS.md` | Component pattern: TypeScript, naming, slots, `data-testid`, ARIA, Composition Pattern, examples discipline, Styling discipline                 |
| `CODE_QUALITY.md`           | Size and complexity limits, split by feature, nothing written twice, extension points, list state contract, announcer, `disabledReason`, blocks |

## Rules every agent file inherits

- The body of `.md` defines the **role description and rules** that go after the envelope as a `=== AGENT ROLE ===` block. Keep it under ~30 lines.
- Never reference "the conversation" or "we discussed" — there is no conversation.
- If an output requirement is unclear, the agent emits `BLOCKED: <reason>` and exits. **Never guess.**
- Output JSON must be parseable; one trailing newline; no Markdown wrapper.
