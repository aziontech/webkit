# Rule: comments — rare, objective, never prose

The code is the document; a comment is the exception. A comment exists only to state what the code **cannot** show — a constraint, a non-obvious why, a measured value the classes were fitted to. Everything else (what the next line does, how the code arrived here, why a change is correct, design essays) is noise that rots the moment the code moves.

## The rule

> Default to **no comment**. When one is needed, it is **objective** and fits in at most **5 lines** per block. A file is never more than **20% prose comments**. Long rationale lives in the spec, a `.claude/rules` doc, or `.claude/docs/` — never in the source.

- **Public surface JSDoc stays** — one line per prop/event/slot/exported type (mandated by [`props.md`](./props.md)); it is excluded from the prose count.
- **Directives** (`eslint-*`, `@ts-*`, `prettier-ignore`, `@vite-ignore`) are not prose.
- **A constraint note is welcome** — one or two lines stating the invariant (`// consumer-supplied data-testid wins`, `// blank lines don't break a block, so spacing can't evade the limit`).
- Blank lines neither extend nor break a comment block — splitting an essay with spacing does not make it compliant.

## Hard prohibitions

- Do not write a comment block longer than 5 lines.
- Do not narrate the code (`// loop over items`), restate a name, or address the reviewer (`// this is correct because…`).
- Do not leave commented-out code — delete it; git remembers.
- Do not paste design rationale, migration history, or process notes into a source file — that content belongs in the spec or a rules/docs file.
- Do not spell out utility classes inside comments (the token checks scan raw text — describe them in prose).
- Do not use angle brackets in `<script>` comments (breaks downstream SFC parsing — see [`styling.md`](./styling.md)).

## Enforcement

- **`verbose-comment-block`** and **`comment-heavy-file`** in the shared authoring-checks engine ([`authoring-checks.js`](../../packages/webkit/src/eslint-plugin/authoring-checks.js)) — enforced write-time by [`validate-authoring.mjs`](../hooks/validate-authoring.mjs), in CI by the [`check-authoring.mjs`](../../packages/webkit/scripts/check-authoring.mjs) ratchet, and for consumers by the `webkit/authoring-standards` ESLint rule. One definition, three surfaces.
- Semantic prolixity below the thresholds (a 4-line comment that says nothing) is held by review.

## Why this rule exists

The tree accumulated 6.7k comment lines (10% of the source) — including 200+-line design essays inside components. Verbose comments drown the one-line constraints that matter, drift from the code they describe, and teach every next author (human or agent) that essays belong in source files. Fixing the ceiling mechanically keeps commentary at the level the repo actually reads: the constraint, stated once, objectively.
