# Rule: deprecate a public part before removing it — mark, keep one major cycle, then delete

Removing or renaming a public part of a component this project authors — the component
itself, a prop, an event, a slot — is a **breaking change** for everyone who uses it. The
lifecycle is fixed: mark the part `@deprecated` (naming its replacement and its removal
version), ship it working for **at least one major version**, then remove it in a
subsequent major. The `azion-ui/require-authoring-standards` ESLint rule blocks a **bare
`@deprecated`** tag as an error; the cycle length and the version bumps are convention,
upheld in code review.

## Azion UI's own parts: 6.0 is the clean break

Azion UI 6.0 removed every old Azion UI name outright (no aliases, no "Removed in 7.0"). Migrate an
app once: read `MIGRATION_V6.md` in `@aziontech/ui` and run
`npx @aziontech/ui migrate v6`, then `npx @aziontech/ui doctor`. From 6.0 on, Azion UI
follows the same lifecycle this rule asks of you: a part is marked `@deprecated`, kept for at
least one major, then removed, and `azion-ui/no-deprecated-component` tells you before it goes.

An Azion UI component or block marked **preview** (a Preview tag on the docs page,
`stability: "preview"` from the MCP) is not frozen yet: its API may change in a minor release,
named in the changelog, with no deprecation cycle. Pin the Azion UI version, or expect to adapt,
when you build on one. The cycle above starts when it becomes GA.

## Do

- Write the tag as `@deprecated since <version> — use <replacement> instead. Removed in
<version>.` Both the replacement and the removal version are required — a deprecation
  with no exit is a warning that never ends.
- Ship the marking as a `patch`/`minor`; ship the removal as a **major** (`!` on the
  commit type or a `BREAKING CHANGE:` footer).
- Keep the deprecated part **fully working** during its cycle — annotate it, do not
  change its behavior.
- When `azion-ui/no-deprecated-component` flags an import of an Azion UI component marked
  deprecated in the catalog, migrate to the named replacement before the next major.

## Don't

- Never remove or rename a public part without a deprecation cycle first — no silent
  removals.
- Never write a bare `@deprecated` (no replacement, no removal version) — blocked by
  `azion-ui/require-authoring-standards`.
- Never change a deprecated part's behavior during its cycle — annotate, don't mutate.
- Never ship a removal as anything other than a major, breaking release.
- Never keep building on a deprecated Azion UI part once the replacement is named — the
  lint warning is the migration window, not noise to suppress.

## Example

### Do

```ts
import type { ButtonVariant } from '@aziontech/ui/button'

interface Props {
  /**
   * @deprecated since 4.2 — use `variant` instead. Removed in 5.0.
   */
  kind?: string
  /** Visual variant. */
  variant?: ButtonVariant
}
```

Deprecating a whole component:

```vue
<script setup lang="ts">
  /** @deprecated since 4.2 — use `EmptyState` instead. Removed in 5.0. */
  defineOptions({ name: 'EmptyResultsBlock' })
</script>
```

### Don't

```ts
interface Props {
  /** @deprecated */ // bare tag: no replacement, no removal version — blocked by lint
  variant?: string
}
```

```ts
// Renamed `kind` to `variant` outright in a minor release — a silent breaking
// change. Consumers get no migration window and no machine-readable warning.
interface Props {
  variant?: ButtonVariant
}
```
