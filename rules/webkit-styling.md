# Rule: styles live on the root element's class — never as JS presets or local CSS

When authoring your own components alongside @aziontech/webkit, styles go on the
**template root element's `class` attribute** — not in JavaScript variables, not in
`<style>` blocks, not in component-local CSS files. Variants are driven by `data-*`
attributes on the same root, consumed by Tailwind's `data-[attr=value]:` variants.
Hardcoded colors are blocked mechanically by the `webkit/no-hardcoded-color` ESLint rule
and the shipped stylelint config; the inline-class + `data-*` shape itself is convention,
enforced in code review.

## Do

- Put **all** utilities inline on the root's single `class` attribute.
- Mirror props as `data-*` attributes (`data-variant`, `data-size`, `data-disabled`,
  `data-state`) and let Tailwind variants do the switching:
  `data-[variant=primary]:bg-(--primary)` is one utility, not a JS branch.
- Use `v-bind="$attrs"` so a caller-passed `class` merges onto the root (Vue merges
  class strings automatically). When caller classes must **win** over internal ones, use
  `cn` from `@aziontech/webkit/utils/cn` (clsx + tailwind-merge) — the only acceptable
  class-composition helper, and even then pass it a flat literal string.
- Use design tokens for every value: `var(--primary)`, `var(--bg-surface)`,
  `var(--spacing-xs|sm|md|lg)`, `var(--shape-button)` — never raw hex or pixel guesses.
- For conditional styling, set a `data-*` attribute and style it with a variant
  (`:data-loading="loading || null"` + `data-[loading]:opacity-80`). The decision lives
  in HTML, not in JS.
- Reserve `computed` for derived state (`isAnchor`, `testId`) — never for classes.

## Do not

- No class-preset objects in the script: `const variantClasses = {...}`,
  `const sizeClasses = {...}`, `const sharedClasses = [...]`, or a
  `const rootClasses = computed(...)` that only composes classes.
- No `<style>` blocks (scoped or not), no `.css`/`.scss` files next to a component,
  no CSS-in-JS, no `styled()` helpers, no tagged css template literals.
- No `:class="loading ? 'opacity-80' : ''"` ternaries and no `:class="[a, b, c]"`
  arrays when a flat string + `data-*` variant would do.
- No backtick multiline template literals inside `:class` in the template — the Vue SFC
  parser runs before JavaScript and fails with a misleading "Element is missing end tag"
  error. Use a plain multiline `class` attribute, or a single-quoted constant in
  `<script setup>` passed to `cn`.
- No hardcoded colors (`#0a0a0a`, `bg-blue-600`) — lint blocks them; use tokens.

## Never double a line

Adjacent bordered surfaces share **exactly one hairline**. The outer frame belongs to the
container; the parts inside it draw only the dividers between themselves. Two borders never
sit flush side by side or 1px apart: no 2px seam where two parts meet, no frame drawn again
just inside a container's frame.

- Let the WebKit container draw the edge: an unpadded `Module` body takes its top
  from the header's rule and its sides from `Container`, and a `DocCardGroup` or
  `RegistrationFrame` placed in it drops its own top and side rules. The module after a
  band that closes on a rule (`Spacer`, a framed grid) passes `:divided="false"`.
- Inside a `Card`, a pane or an accordion, give a framed part `:bordered="false"`
  (`CodeEditor`, `LogViewer`); inside an `InputGroup`, use `InputGroup.Input` (an `Input`
  placed there loses its border too).
- In your own lists, rule the seams between items (`not-last:border-b`), never under the
  last item of a framed box; do not add `border-t` to the first child of a box whose header
  already draws a bottom rule.
- When two parts must both keep a rule, lay one exactly on the other (a `-mb-px` /
  `-me-px` flush, a `ring-1` painted into the frame's pixel): the same pixel reads as one
  line, touching pixels read as two.

## An inline chip is never taller than its line

Inline code and any other inline chip (a background plus an outline on text that wraps)
must fit inside the line box of the text around it, or the chips on two wrapped lines
overlap. Put WebKit documentation text inside `DocProse` (or `DocCallout`, `DocItem`),
which already draws the chip this way. When you style your own:

- No vertical padding (`py-*`) on an inline element; inline padding only
  (`px-(--spacing-2xs)`).
- Draw the outline inside the box (`inset-ring inset-ring-(--border-default)`), not with
  `border`, which adds 2px to the height; keep `forced-colors:border` so the chip stays
  visible in Windows high-contrast mode.
- Add `wrap-anywhere box-decoration-clone` so a long chip wraps and each line keeps its
  outline and padding.
- Scope the chip to inline code: `[&_code:not(pre_*)]`, never a bare `[&_code]`. A code block
  (`pre > code`) is not a chip; with `box-decoration-clone` a bare selector draws one pill per
  line of the block.

## Token value syntax — the canonical `prop-(--token)` form

Write a token value with Tailwind v4's **paren shorthand**, not the bracket form. This is the single canonical spelling the toolkit standardizes on — it matches what upstream v4 canonicalizes to, so your editor stops flagging every styled line.

- **Whole-value var:** `bg-(--primary)`, `text-(--text-default)`, `rounded-(--shape-card)` — **not** `bg-[var(--primary)]`. Variants compose: `data-[disabled]:bg-(--bg-disabled)`.
- **Typed value:** `text-(length:--text-body-md)`, `border-(color:--border-default)`, `font-(family-name:--font-sans)`.
- **Numeric arbitrary:** `z-1`, not `z-[1]`.

Two cases **stay in brackets** — the paren form silently emits no CSS for them:

- **Custom-property declarations:** `[--row-bg:var(--bg-surface)]` (there is no paren shorthand for declaring a property). On a webkit tag the only custom properties you may declare are the chart palette variables (`webkit-style-override.md`).
- **Expression values:** anything more than a lone var — `w-[calc(var(--a)*2)]`, gradients, box-shadows, or a **var with a fallback** (`bg-[var(--x,var(--y))]`). Leave these bracketed; converting them drops the style with no error.

## Correct

```vue
<template>
  <button
    v-bind="$attrs"
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled || null"
    :disabled="disabled"
    class="
      inline-flex items-center justify-center rounded-(--shape-button)
      transition-colors duration-150 ease-out motion-reduce:transition-none
      data-[variant=primary]:bg-(--primary) data-[variant=primary]:text-(--primary-foreground)
      data-[variant=outline]:border data-[variant=outline]:border-(--border-default) data-[variant=outline]:bg-transparent
      data-[size=small]:h-7 data-[size=small]:px-(--spacing-xs)
      data-[size=large]:h-10 data-[size=large]:px-(--spacing-md)
      data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled)
    "
  >
    <slot />
  </button>
</template>
```

## Wrong

```vue
<script setup>
  const variantClasses = {
    primary: 'bg-(--primary) text-(--primary-foreground)',
    outlined: 'border border-(--border-default) bg-transparent'
  }
  const sizeClasses = { small: 'h-7 px-(--spacing-xs)', large: 'h-10 px-(--spacing-md)' }
  const rootClasses = computed(() => [variantClasses[props.variant], sizeClasses[props.size]])
</script>

<template>
  <button :class="rootClasses" />
</template>

<style scoped>
  .button--primary { /* never */ }
</style>
```
