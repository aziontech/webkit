# Rule: deprecation — mark, keep one major cycle, then remove

Removing or renaming a public part (a component, a prop, an event, a slot) is a **breaking change**. This rule fixes the lifecycle between "we want this gone" and "it is gone", so a consumer always has a migration window and a machine-readable warning — never a silent removal.

## The rule

> A public part slated for removal is first **marked `@deprecated`** (with the replacement named in the tag), ships **at least one major version** in the deprecated state, and is only then **removed in a subsequent major**. Marking is a `patch`/`minor`; removal is a `major` (`BREAKING CHANGE:`). See [`release-types.md`](./release-types.md) for the bump mapping.

```ts
interface Props {
  /**
   * @deprecated since 4.2 — use `kind` instead. Removed in 5.0.
   */
  variant?: string
  /** Visual variant. */
  kind?: ButtonKind
}
```

For a whole component:

```vue
<script setup lang="ts">
  /** @deprecated since 4.2 — use `EmptyState` instead. Removed in 5.0. */
  defineOptions({ name: 'EmptyResultsBlock' })
</script>
```

## 6.0 is the clean break

WebKit 6.0 is the one **clean-break major**: every name marked `@deprecated` before it, and every rename made for it, is removed outright in 6.0 — no alias, no "Removed in 7.0". Apps migrate once, with [`MIGRATION-v6.md`](../../packages/webkit/MIGRATION-v6.md) and `npx @aziontech/webkit migrate v6` (maps in `packages/webkit/src/cli/migrations/v6*.json`). **From 6.0 on**, the lifecycle above applies to every public part: mark → at least one major → remove. The only names 6.0 still resolves are **data aliases** read from external content (a site page's old section `_id`, an old `Illustration` scene name, a Markdown `<CardGroup cols>`), kept so stored page data keeps rendering; they carry no `@deprecated` tag and no removal version.

## Tag details

- The `@deprecated` tag **names the replacement** and the **removal version** — a deprecation with no exit is just a warning that never ends.
- The deprecated part **keeps working** for its cycle; do not change its behaviour, only annotate it.
- **`catalog.json`** carries the deprecation (surfaced by the MCP) so AI-written consumer code is steered off the deprecated part before removal.
- Removal is a **`major`** commit, marked `BREAKING CHANGE:`, updating the spec, the story, and the exports map in the same change (see [`migration.md`](./migration.md) and [`event-payloads.md`](./event-payloads.md) for the same "reshape = breaking" discipline).

## Hard prohibitions

- Do not remove or rename a public part without a deprecation cycle first (except while a component is still on the legacy whitelist and unreleased, and except the 6.0 clean break, which removed old names outright).
- Do not add a compatibility alias for a code-level name (prop, event, slot, type, export) in 6.x; only data aliases for stored external content are kept.
- Do not write `@deprecated` without naming the replacement and the removal version.
- Do not change a deprecated part's behaviour during its cycle — annotate, don't mutate.
- Do not ship a removal as anything other than a `major` (`BREAKING CHANGE:`).

## Enforcement

- **`webkit/no-deprecated-component`** (ESLint, `error` in `recommended`) flags a consumer importing a component marked deprecated in the catalog.
- **release-please** maps the bump; a `BREAKING CHANGE:` footer / `!` produces the `major` (see [`release-types.md`](./release-types.md)).
- **`catalog.json`** records `deprecated` per part; `build-catalog.mjs` stamps it and the MCP surfaces it.

## Why this rule exists

Breaking changes were happening (the branch renamed `variant`→`kind`, `closeable`→`closable`, removed `empty-results-block`), each correctly marked breaking — but there was no written lifecycle, so whether a part got a deprecation window or was removed outright depended on the PR. A fixed cycle (mark → one major → remove) plus a machine-readable `@deprecated` in the catalog gives every consumer the same, predictable migration path, and lets `no-deprecated-component` warn them inside the window. 6.0 resets the slate once: it removes every old name in one major, with one migration guide and one codemod, so the cycle starts from a catalog that carries no deprecated names.
