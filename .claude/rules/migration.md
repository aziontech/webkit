# Rule: migration policy — never inherit, always rewrite

When importing a component, pattern, or any artifact from **outside** this codebase (another design system, a Figma file, a Base UI / Reka UI / Radix / shadcn / PrimeVue example, a third-party library, a previous repo, a Stack Overflow answer, a CONTRACT.md file written before this pipeline existed), **you do not bring it as-is**. You rewrite it to our conventions before the spec is written, and you write the spec from scratch following [`.specs/_template.md`](../../.specs/_template.md).

## The rule

> **NEVER create anything outside the standard.** Every artifact you produce — spec, `.vue`, `package.json`, `.figma.ts`, `.stories.js`, rule update — must conform to our patterns. No exceptions, no "temporary" deviations, no "to make migration easier."

## What this means in practice

### When importing from another component library

| Source | Their convention | Our convention |
|---|---|---|
| Base UI / Reka UI / Radix | `as` prop for polymorphism, `data-state` everywhere, `Slot` helper for `asChild` | Our component renders its own root (`<a>`/`<button>` polymorphism via `href` prop, not `as`). `asChild` is pending — do not import a Slot helper that does not exist (`validate-references.mjs` blocks). `data-state` only on stateful roots (overlay open/closed, switch on/off). |
| Source | `kind` may be called `variant`, `intent`, `appearance` | Always `kind`. |
| Source | sizes may be `xs/sm/md/lg/xl` | Always `'small' \| 'medium' \| 'large'`. |
| Source | events may be camelCase (`onValueChange`) | Always kebab-case (`update:value`, `value-change`). |
| Source | boolean props may have `is`/`has` prefixes | No prefix (`disabled`, `loading`, `open`). |
| Source | `class` declared in `defineProps` | Never. Use `useAttrs()` + `rootClasses` merging `attrs.class`. |
| Source | Inline `@keyframes` or animation library | Only the semantic utilities catalogued in [`DESIGN.md`](../docs/DESIGN.md#animations--semanticanimationsjs). No animation lib (see [`dependencies.md`](./dependencies.md)). |
| Source | `@floating-ui/vue` for positioning | CSS only (anchor positioning, Popover API, `<Teleport>` + `position: fixed`). |
| Source | Their tokens (`#fff`, `--brand-50`, `text-blue-600`) | Our tokens (`var(--bg-canvas)`, `var(--primary)`, `text-button-lg`). Catalog: [`DESIGN.md`](../docs/DESIGN.md). |

### When migrating from Figma

The spec is **driven by Figma behavior**, not by Figma node names. The `figma-extractor` reports variables, regions, and states verbatim; **you** map them to our patterns:

- Figma "Primary / Secondary / Outlined / Text" → `kind: 'primary' | 'secondary' | 'outlined' | 'text'`.
- Figma "Size Large / Medium / Small" → `size: 'large' | 'medium' | 'small'`.
- Figma states (`hover`, `focus`, `active`, `disabled`) → CSS pseudo-classes (`hover:`, `focus-visible:`, `active:`, `data-disabled:`).
- Figma animation specs (`scale-in 150ms cubic-bezier(...)`) → match the existing semantic utility (`animate-popup-scale-in`); if no match exists, record a theme gap and use the closest primitive temporarily.
- Figma component names (`HeaderNavigationMenuItem`) → our naming (`navigation-menu-item.vue`, `NavigationMenuItem`).

When the Figma frame contradicts our conventions (e.g. uses a hex color not present in DESIGN.md), **the spec is the contract** — record the theme gap, ship the closest primitive, and propose the token addition in a follow-up PR. **Never** introduce a hex literal "to match the Figma exactly."

### When migrating a pre-existing `.vue` (e.g. legacy component on the whitelist)

If you are asked to bring a legacy component (whitelisted in `_lib/legacy-components.json`) under spec enforcement:

1. **Write the spec from scratch.** Do not paste the legacy file's docstring or any CONTRACT.md. Read the `.vue` and infer the contract; restate it in our format using `.specs/_template.md` as the only template.
2. **Rename props/events** to our conventions. If the legacy file has `variant`, the new spec has `kind`. Updating the legacy `.vue` to match the new spec is part of the same migration PR — the spec is the source of truth.
3. **Replace external positioning/animation libs.** If the legacy `.vue` imports `@floating-ui/vue` or similar, that import has to go. See [`dependencies.md`](./dependencies.md) for CSS-only alternatives.
4. **Remove the entry from `legacy-components.json`** only after `/component-verify <name>` passes end-to-end.

### When migrating from a CONTRACT.md, README, or any inherited doc

You **delete** the inherited doc. Specs live in `.specs/`, and only specs in our canonical format are accepted. Re-stating an inherited doc in our format is allowed; copy-paste with renames is not.

## Hard prohibitions

- Do not paste content from external sources into our specs, components, or stories without rewriting to our conventions.
- Do not inherit naming choices that conflict with ours.
- Do not inherit animation choices that conflict with our catalog.
- Do not inherit dependencies that conflict with [`dependencies.md`](./dependencies.md).
- Do not write a spec whose Constraints block diverges from `.specs/_template.md`. The block is verbatim by design.
- Do not write a `.vue` whose prop, event, slot, or animation set diverges from its spec. `validate-spec-compliance.mjs` blocks.

## When the rule and an external source conflict

The rule wins. If the spec is harder to write because the external source uses different patterns, **the difficulty is the cost of consistency**. Pay it once, here, instead of carrying drift forward through every future component.

## Enforcement

- `spec-validator` rejects specs whose Constraints block has been altered or shortened (see [`_lib/spec.mjs`](../hooks/_lib/spec.mjs) → `constraintsBlockHasCanonicalBullets`).
- `validate-tokens.mjs` rejects HEX/Tailwind palette inherited from another design system.
- `validate-references.mjs` rejects imports of any external positioning/animation lib (it's never installed).
- Sub-agent prompts inject [`no-invention.md`](./no-invention.md) and this file verbatim. Any deviation from our patterns surfaces as `BLOCKED:` and stops the run.
