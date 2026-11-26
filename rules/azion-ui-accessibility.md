# Rule: accessibility — role, keyboard, focus, and motion are built in, never bolted on

Azion UI components are accessible by construction: drop in a `Dialog` or `Table` and its
role, keyboard model, focus management, and reduced-motion fallback come with it. Anything
you build around them — custom components, views, composed overlays — must hold the same
contract. In this project accessibility is **convention + code review**; two parts are
mechanically enforced: color — raw colors (including focus rings) are blocked by the
stylelint config and the `azion-ui/no-hardcoded-color` ESLint rule — and the accessible name of
an icon-only control, which `azion-ui/require-accessible-name` requires on every `IconButton`.

## Do

- Use the **native element** whose semantics match before reaching for `role`, through the
  Azion UI component that renders it: `Button` / `IconButton` for a `<button>`, `Link` for an
  `<a href>` (`Link inline` inside a sentence), `Input` and its family for an `<input>`. A raw
  one outside its owner is flagged by `azion-ui/no-unowned-element`. Add `role` only when no
  native element fits.
- Mirror ARIA state with the element's `data-*` state (`aria-expanded` with
  `data-state="open"`, `aria-disabled` with `data-disabled`, `aria-invalid` with
  `data-invalid`).
- Name an Azion UI control in the template with the **kebab attribute**: `aria-label="Delete domain"`
  (`:aria-label` when it changes, `aria-labelledby` when visible text already names it). Vue maps
  it onto the component's `ariaLabel` prop. An `IconButton` (or `ButtonGroup`) with no name is
  flagged by `azion-ui/require-accessible-name`.
- On your own components, name the accessible-name prop **`ariaLabel`** (prefixed
  `xAriaLabel` for sub-parts), make it **optional with a `''` default**, and bind it to the
  `aria-label` attribute internally (`ariaLabel || undefined`). vue-tsc does not camelize
  `aria-*` attributes onto props, so a required `ariaLabel` makes `aria-label="…"` fail to
  type-check in a fresh create-vue app; require the name with a lint rule or a test instead.
- Give every interactive piece a **keyboard map** and implement exactly that
  (dialog: `Esc` closes, `Tab` is trapped; menu: arrows move, `Enter` selects,
  `Esc` closes). Anything clickable must be reachable and operable by keyboard.
  The screen around the pieces follows one console-wide contract (focus on open, `Esc`,
  `⌘ S`, `/`, `?`, list keys): rule [`azion-ui-keyboard`](./azion-ui-keyboard.md).
- Put help beside a label in a **`Hint`** (the small info glyph that opens a short note on click),
  a short explanation in the field or section description, and a long one in a `HelpPanel`. A
  `Tooltip` only names a control in a few words. A typed `?`, an info icon inside a `Tooltip` or
  `Popover` trigger, a `Tooltip` over 80 characters and a `Hint` over 280 are flagged by
  `azion-ui/prefer-hint`.
- Generate ids with Vue's **`useId()`** for every `for` / `aria-labelledby` /
  `aria-describedby` association — stable across SSR.
- Style focus with a **`focus-visible`** ring using the ring token
  (`focus-visible:ring-(--ring-color)`).
- Make overlays **trap focus and restore it**: focus moves into the overlay on open,
  stays trapped while open, and returns to the trigger on close — use a focus-trap
  composable (e.g. VueUse), not a hand-written trap.
- Pair every motion-bearing class with **`motion-reduce:`**
  (`motion-reduce:transition-none` / `motion-reduce:animate-none`).
- Keep hit targets at **24px or more**, and at **40px or more** on touch layouts (the Azion UI
  floor: its controls draw at least 40px where they are tapped, and a button's invisible touch
  area reaches 44px on a coarse pointer), even when the visible glyph is smaller.
- Announce async results politely: inline validation and status updates go to an
  `aria-live="polite"` region (the Azion UI `Toast` and `Alert` already do this). Only an error
  interrupts: a `danger` toast is announced assertively by the `Toaster`, every other kind politely.
- Give in-page link targets a scroll offset (`scroll-mt-(--spacing-2xl)`) so a sticky header never
  covers the heading the link jumps to.
- Wrap brand names, product names and code tokens in `translate="no"` so browser translation does
  not rewrite them.

## Don't

- Never add `role`/ARIA to fake an interactive element when a native one fits.
- Never put `@click` on a non-interactive element without a matching key handler.
- Never hand-roll ids — use `useId()`.
- Never use a raw color for the focus ring — use the ring token; hardcoded colors are
  blocked by `azion-ui/no-hardcoded-color` and the stylelint config.
- Never open an overlay without trapping focus and restoring it to the trigger on close.
- Never ship a motion class without its `motion-reduce:` fallback.
- Never name the accessible-name prop `aria-label` — use `ariaLabel`.
- Never write the camelCase `ariaLabel="…"` attribute in a template — write `aria-label="…"`.
- Never add `vueCompilerOptions.htmlAttributes` to a tsconfig to make `aria-label` type-check;
  the Azion UI types already accept it.
- Never disable browser zoom (`user-scalable=no`, `maximum-scale=1`).
- Never rely on color alone for a status: pair it with a label or an icon with a name.
- Never pick a colour pair by eye. Every pair passes **both** WCAG 2.1 AA (4.5:1 text, 3:1 icons
  and marks) and APCA: Lc 75 body text, Lc 60 other text, Lc 45 icons, Lc 30 solid marks, Lc 15
  borders. Use the theme's token pairs (they pass); the few accepted exceptions are listed in
  `azion-ui-tokens.md` § "Contrast: APCA and WCAG 2".
- Never strip the underline from a link inside a sentence (`no-underline` on a `Link inline`): the link
  blue is only 1.1–1.3:1 against muted body text and 3:1 against default text, so color alone fails
  WCAG 1.4.1. `Link inline` renders the `text-link` style, which keeps a quiet underline at rest and
  strengthens it on hover. A standalone `Link` (not in a sentence) underlines on hover only.

## Example

### Do

```vue
<script setup>
import Button from '@aziontech/ui/button'
import Input from '@aziontech/ui/input'
import { ref, useId } from 'vue'
const open = ref(false)
const hintId = useId() // stable id for the ARIA association
</script>

<template>
  <!-- a native button with the token focus ring and the reduced-motion fallback built in;
       the ARIA state mirrors what the toggle shows -->
  <Button
    label="Show details"
    variant="secondary"
    :aria-expanded="open"
    @click="open = !open"
  />

  <Input
    type="email"
    aria-label="Email"
    :aria-describedby="hintId"
  />
  <p :id="hintId">We never share your email.</p>
</template>
```

### Don't

```html
<!-- clickable div: fake semantics, unreachable by keyboard -->
<div role="button" @click="open">Open settings</div>

<!-- hand-rolled id, raw-color focus ring, motion without a reduced-motion fallback -->
<label for="email-1">Email</label>
<input id="email-1" class="transition-all focus-visible:ring-[#f3652b]" />

<!-- overlay that neither traps focus nor restores it to the trigger on close -->
<div v-if="open" role="dialog">…</div>
```
