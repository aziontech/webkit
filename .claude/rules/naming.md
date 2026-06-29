# Rule: one name, everywhere

A component has **one** name. That name appears on six surfaces, and they must all agree. A component called singular in one place and plural in another (`import Chip from '@aziontech/webkit/chips'`) is a bug — and the kind of bug a guardrail must make impossible, not a thing reviewers chase by eye.

## The single source of truth

The **kebab-case name** is canonical. Everything else is derived from it:

| Surface | Form | Example (`chip`) |
|---|---|---|
| spec file + `name:` frontmatter | kebab | `.specs/chip.md`, `name: chip` |
| component folder + `.vue` file | kebab | `inputs/chip/chip.vue` |
| export subpath in `packages/webkit/package.json#exports` | kebab | `"./chip": ".../chip/chip.vue"` |
| `defineOptions({ name })` | **PascalCase** | `name: 'Chip'` |
| `data-testid` fallback | `input-<name>` (inputs) / `<category>-<name>` | `'input-chip'` |
| import binding + tag in a story | **PascalCase** of the export subpath | `import Chip from '@aziontech/webkit/chip'` → `<Chip>` |

PascalCase is the kebab name with each `-`-segment capitalized: `chip` → `Chip`, `empty-state` → `EmptyState`, `mini-button` → `MiniButton`. Plurality is part of the name — pick one (`chip`, singular, for a single token) and use it on every surface. A container for many is a *different* component (`chip-group`), not a plural spelling of the same one.

## What enforces it

- **Component internals** — [`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs) already blocks a `.vue` whose `defineOptions.name` ≠ `PascalCase(spec name)` or whose `data-testid` fallback ≠ `<category>-<name>` (`input-<name>` for inputs). So spec ↔ file ↔ `defineOptions` ↔ testid cannot drift.
- **Story imports** — [`validate-story-source.mjs`](../hooks/validate-story-source.mjs) blocks any `import <Binding> from '@aziontech/webkit/<subpath>'` whose `<Binding>` ≠ `PascalCase(last segment of <subpath>)`. This is the surface the spec-compliance hook doesn't see, and it is exactly where the `Chip`-from-`chips` mismatch slipped through.

Between the two, all six surfaces are locked together. To rename a component you change the canonical kebab name and propagate to every surface — the hooks reject any partial rename.

## When importing / migrating

Per [`migration.md`](./migration.md), a name inherited from another system is rewritten to ours, not carried over. The kebab name drives the rest; never introduce a binding that disagrees with the export path "to match the source."
