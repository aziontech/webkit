## @aziontech/webkit design system

This project uses the Azion design system. Its guidance is organized in four layers — know which
layer you're in, because only one of them is optional:

1. **Invariants (always-on, below)** — the non-negotiables. Follow them in every UI change.
2. **Enforcement (the machine — non-optional)** — ESLint blocks the mechanical invariants at lint/CI;
   the `webkit` MCP grounds every component choice; the `webkit-ui-verifier` agent checks the rest at
   runtime (axe, both themes, states). If lint or the verifier fails, the change is not done.
3. **Skills (on-demand guidance)** — invoke `/webkit-*` skills for how to do a task well.
4. **Reference (depth)** — `.claude/rules/webkit-*.md` carry the full standards behind the invariants.

### Invariants — always follow

- **Components first.** Reach for an `@aziontech/webkit` component before writing custom UI. Find one
  via the `webkit` MCP (`suggest_component`) or `node_modules/@aziontech/webkit/catalog.json`.
- **Flat imports.** `import Button from '@aziontech/webkit/button'` (PascalCase binding = the subpath).
  Never category-prefixed, `/src/`, deep-internal, or a bare-package barrel.
- **Tokens only.** Color, typography, shape, spacing come from `@aziontech/theme`
  (`var(--primary)`, `var(--spacing-md)`, `text-button-lg`) — never hex, `rgb`, `hsl`, or Tailwind palette.
- **Never restyle a webkit component.** No `class`/`:class`/`style` on its tag — compose inside its
  slots or use its props.
- **Styles + theme.** Load `src/webkit.css` once at the app entry — it `@import`s the theme's
  Tailwind v4 stylesheet (tokens + `@import "tailwindcss"` + fonts) and `@source`s webkit so its
  component classes compile. Import `webkit.css`, not `@aziontech/theme` bare (the `@source` is what
  compiles webkit's classes). Light is the default; for dark set `<html data-theme="dark">`.
- **Accessible & keyboard-operable.** Label every field, keep a visible focus ring, mirror state in
  ARIA, no click handler without a key handler.
- **Small bundles.** Prefer the `<name>-root` path (or specific sub-components), import icons
  individually, lazy-load heavy overlays.

### Enforced by lint (blocks — nothing here is a suggestion)

ESLint (`@aziontech/webkit/eslint-plugin` + `vuejs-accessibility`, wired by `webkit init`) fails the
build on: category-prefixed / deep-internal / barrel imports · hardcoded color · restyling a webkit
component · a custom element where a webkit component exists · a hand-rolled `modelValue`+`update`
instead of `defineModel` · a deprecated component · a whole-icon-set import · missing the
tree-shakeable root · and the static a11y set (alt-text, aria-props, aria-role, click-without-key,
label-has-for, no-autofocus). The rest — states, motion-reduce, contrast/behavioral a11y, both
themes, microcopy — is verified at runtime by `/webkit-ui-verify` (the `webkit-ui-verifier` agent
runs axe + screenshots), and taste is a review concern.

### Skills — invoke for how to build UI well

Start with `/webkit-ui-craft` (the umbrella that routes the rest). Get structure and states right
before any polish:

- **Structure:** `/webkit-ux-heuristics` (right component per moment) · `/webkit-ui-states` (state surface + async behavior) · `/webkit-form` · `/webkit-tables` (data-driven `<Table>` + cell recipes) · `/webkit-navigation`
- **Foundation:** `/webkit-baseline-ui` (tokens, hierarchy, containers, responsive widths)
- **Cross-cutting quality:** `/webkit-theming-dark-mode` · `/webkit-data-viz`
- **Polish:** `/webkit-motion-polish` · `/webkit-impeccable-polish` (finish + earned delight)
- **Verify + migrate:** `/webkit-ui-verify` (runtime axe + both themes + states) · `/webkit-ds-adoption`

Mechanics of consuming the package (imports, tokens, tree-shaking) live in `/webkit-usage`.

### Agents — delegate a whole task

`webkit-expert` (which component + how) · `webkit-adopter` (the init/adoption flow) · `webkit-reviewer`
(review a diff for correct/performant usage) · `webkit-ui-verifier` (drive the screen: both themes,
widths, console, axe, states) · `webkit-adoption-auditor` (coverage scorecard: custom → webkit).

Full standards behind the invariants: `.claude/rules/webkit-*.md`.
