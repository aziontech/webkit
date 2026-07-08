# Rules — index

The 23 construction standards, each a single `.md` in this folder. `scope: general` ships to
consuming projects; `scope: webkit` is internal to the design system. The **machine-readable
source of truth** for rule → enforcement is
[`../hooks/_lib/standards.mjs`](../hooks/_lib/standards.mjs), whose pairing with the rule
files is checked in CI by
[`packages/webkit/test/standards/invariant.test.mjs`](../../packages/webkit/test/standards/invariant.test.mjs).
This table is the human-readable summary of that registry — when in doubt, the registry wins.

## Foundational (11)

| Rule | Scope | Fixes | Blocks via |
|---|---|---|---|
| [no-invention](./no-invention.md) | webkit | Nothing beyond the spec | spec-compliance · references |
| [prop-vocabulary](./prop-vocabulary.md) | general | One name/type/default per concept | spec-compliance |
| [naming](./naming.md) | webkit | One kebab name across 6 surfaces | spec-compliance · story-source |
| [imports](./imports.md) | webkit | Flat public name; category in the folder only | references · lint |
| [compound-api](./compound-api.md) | webkit | `index.ts` compound + tree-shakeable `-root` | catalog-drift · review |
| [styling](./styling.md) | general | Inline classes on the root; variants via `data-*` | validate-tokens |
| [dependencies](./dependencies.md) | webkit | No external positioning/animation libs | references |
| [migration](./migration.md) | webkit | Rewrite inherited artifacts, never copy as-is | output checks · review |
| [storybook-source](./storybook-source.md) | webkit | "Show code" is a runnable SFC | story-source |
| [release-types](./release-types.md) | webkit | Commit type → bump identical across 4 sources | commitlint |
| [git-workflow](./git-workflow.md) | webkit | Branch/PR via command, based on `dev` | commitlint · branch-protection |

## Construction (12)

| Rule | Scope | Fixes | Blocks via |
|---|---|---|---|
| [component-structure](./component-structure.md) | general | Folder layout + `<script setup>` order | spec-compliance · review |
| [props](./props.md) | general | Typed `interface Props` + `withDefaults` + JSDoc | authoring · spec-compliance · tokens · ratchet |
| [v-model](./v-model.md) | general | Two-way via `defineModel` | authoring · ratchet · lint |
| [emits](./emits.md) | general | Typed `defineEmits`; activation emits `(event, item)` | authoring · spec-compliance · ratchet |
| [slots](./slots.md) | general | Typed `defineSlots`; fallback in the slot | authoring · spec-compliance · ratchet |
| [composables](./composables.md) | general | `readonly` out, `toValue` args, `onScopeDispose` | authoring · ratchet |
| [root-element](./root-element.md) | general | Own root; `href` polymorphism; `$attrs`+`cn`; minimal `defineExpose` | tokens · references · review |
| [component-states](./component-states.md) | general | Rendered state surface via `data-*` + DS components | spec-compliance · review |
| [accessibility](./accessibility.md) | general | Role, keyboard, focus, `motion-reduce` | vuejs-accessibility · review |
| [testid](./testid.md) | general | `data-testid` derived `<category>-<name>` | spec-compliance |
| [deprecation](./deprecation.md) | general | `@deprecated` → one major → remove | authoring · ratchet · lint |
| [bundle-budget](./bundle-budget.md) | webkit | `size-limit` per entry; tree-shaking | size-limit · review |

**Split:** 13 `general` (ship to projects — see [`packages/webkit/docs/GUIDELINES.md`](../../packages/webkit/docs/GUIDELINES.md)) · 10 `webkit` (internal). Nothing is advisory — every rule blocks the merge, automatically or by mandatory review.
