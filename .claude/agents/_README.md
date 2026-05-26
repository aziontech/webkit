# `.claude/agents/` — isolated sub-agent prompts

Each file here defines the prompt for one isolated sub-agent. The orchestrator (`/component-create`) invokes them via the `Task` tool, one phase at a time. **A sub-agent sees only the prompt the orchestrator hands it** — no conversation history, no other sub-agent's output, no chat memory. This is the structural guarantee that "the agent never invents."

## Universal prompt envelope

Every sub-agent is spawned with this envelope (filled in by the orchestrator):

```
=== SPEC (verbatim, do not modify) ===
<full content of .specs/<name>.md>

=== CONSTRAINTS (binding) ===
<verbatim copy of the spec's "Constraints — DO NOT" block>

=== RULES ===
<verbatim concatenation of the .claude/rules/*.md files this sub-agent needs>

=== SKILL ===
<verbatim content of .claude/skills/<skill>/SKILL.md>

=== TASK ===
<one paragraph from the orchestrator: precise, narrow, files-named>

=== OUTPUTS ===
Return JSON: { "files_written": [...], "decisions": {...}, "blocks": [] }.
If anything is ambiguous, emit a `BLOCKED: <reason>` line and write no files.
```

## Catalog

| Sub-agent | Skill it executes | Reads (rules) | Writes |
|---|---|---|---|
| `spec-author.md` | `spec-create` | tokens, naming, dependencies, migration, storybook | `.specs/<name>.md` (draft) |
| `spec-validator.md` | `spec-validate` | tokens, naming | spec frontmatter only (status, checksum, last_updated) |
| `figma-extractor.md` | `figma-discover` | migration | stdout JSON only |
| `token-mapper.md` | `token-map` | tokens | stdout Markdown only |
| `reuse-auditor.md` | `reuse-audit` | dependencies | stdout JSON only |
| `structure-decider.md` | `structure-decide` | naming | stdout 2 lines only |
| `scaffolder.md` | `component-scaffold` | **no-invention, naming, bem-testid, tokens, accessibility, dependencies, migration** | `<name>.vue`, sub-components, `injection-key.ts`, local `package.json`, root `package.json#exports` |
| `storybook-writer.md` | `storybook-write` | naming, tokens, **storybook**, no-invention | `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js` |
| `code-connect-writer.md` | `code-connect-write` | naming, migration | `<name>.figma.ts` |
| `echo-reporter.md` | `echo-report` | naming, tokens, storybook | stdout report only |

## Rules catalog ([.claude/rules/](../rules/))

| File | Purpose |
|---|---|
| `no-invention.md` | The hard prohibitions; the spec is the contract |
| `dependencies.md` | **No external positioning/animation libs.** CSS + Vue primitives only |
| `migration.md` | **Never inherit artifacts as-is.** Rewrite to our conventions |
| `styling.md` | **Classes inline on the root.** No JS class presets, no `<style>` block, variants via `data-*` |

## Source-of-truth docs ([.claude/docs/](../docs/))

| File | Purpose |
|---|---|
| `DESIGN.md` | Tokens (typography, spacing, container, shape, shadow, colors), animation catalog, forbidden list |
| `COMPONENT_REQUIREMENTS.md` | Component pattern: TypeScript, naming, slots, BEM data-testid, ARIA, Composition Pattern, Storybook discipline, Styling discipline |
| `PRIMEVUE_ABSTRACTION.md` | PrimeVue wrapping under `core/primevue/*` |

## Rules every agent file inherits

- The body of `.md` defines the **role description and rules** that go after the envelope as a `=== AGENT ROLE ===` block. Keep it under ~30 lines.
- Never reference "the conversation" or "we discussed" — there is no conversation.
- If an output requirement is unclear, the agent emits `BLOCKED: <reason>` and exits. **Never guess.**
- Output JSON must be parseable; one trailing newline; no Markdown wrapper.
