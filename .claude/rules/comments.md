# Rule: comments — API docs only, never prose

The code is the document. Names, types and structure carry the intent; when a block needs a comment to be understood, rename or restructure it instead. The only comments that survive in implementation code are the ones a tool or a consumer reads: the documented component API and tool directives.

## The rule

> Implementation code carries **no prose comments** — not in functions, composables, stores, computeds, watchers, handlers, template markup, config, build scripts or tooling. Two kinds of comment are allowed: **component API docs** and **tool directives**. Rationale lives in the spec, a `.claude/rules` doc, `.claude/docs/`, the commit message or the PR body — never in the source.

### Allowed

- **Component API docs** — a JSDoc `/** … */` on a member of a type the consumer reads: `interface Props` entries, `defineEmits<{…}>()` / `defineSlots<{…}>()` / `defineModel` declarations, `defineExpose({…})` members, and exported type / interface declarations (variant unions, column shapes, context types). Mandated by [`props.md`](./props.md).
- **Tool directives** — `eslint-*`, `@ts-*` (with the justification a lint rule requires), `prettier-ignore`, `@vite-ignore`, `@vue-ignore`, `#__PURE__`, `/*! license */`, coverage ignores, and `<!-- eslint-disable … -->` / `<!-- prettier-ignore -->` in templates.
- **`@deprecated`** JSDoc, which [`deprecation.md`](./deprecation.md) requires.
- **JSDoc type tags in `.js`** (`@type`, `@typedef`, `@param {T} name`, `@returns {T}`, `@property {T} name`, `@template`) — they are types, not prose. The description lines around them are prose and go.

### Not allowed

Everything else: a `//` or `/* */` explaining a line, a "why" note, a section banner, a JSDoc description on a function or constant, a `<!-- -->` narrating a layout decision, commented-out code, a note to the reviewer, a history of what the code used to do.

### Scope

Every non-test source file (`.vue`, `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`) under `packages/`. Tests (`*.test.*`, `*.spec.*`, `test/`, `__tests__/`, `fixtures/`) are out of scope.

## Hard prohibitions

- Do not add a prose comment to implementation code — not one line, not a constraint note.
- Do not write a JSDoc description on a function, composable, constant or handler; only API types carry JSDoc.
- Do not leave commented-out code — delete it; git remembers.
- Do not paste design rationale, measurements, migration history or process notes into a source file.
- Do not use angle brackets in `<script>` JSDoc (breaks downstream SFC parsing — see [`styling.md`](./styling.md)).
- When porting code from another repo, port the design, not its comments.

## Enforcement

- **`prose-comment`** in the shared authoring-checks engine ([`authoring-checks.js`](../../packages/webkit/src/eslint-plugin/authoring-checks.js), scanner in [`comment-scan.js`](../../packages/webkit/src/eslint-plugin/comment-scan.js)) — one key per comment, so the count can only fall. Enforced write-time by [`validate-authoring.mjs`](../hooks/validate-authoring.mjs) over all of `packages/`, in CI by the [`check-authoring.mjs`](../../packages/webkit/scripts/check-authoring.mjs) ratchet over all of `packages/`, and for consumers by the `webkit/authoring-standards` ESLint rule, which reports each comment at its line.

## Why this rule exists

A ceiling (blocks of at most 5 lines, files at most 20% prose) still let 2,300 comments accumulate across `packages/` — 200-line design essays in `webkit-docs`, measurement tables in theme tokens, and "why" notes in half the components. Comments drift from the code they describe and teach every next author that the source is where reasoning goes. Allowing only what a tool or a consumer reads makes the rule mechanical: there is nothing left to judge.
