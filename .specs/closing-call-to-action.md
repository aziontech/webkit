---
name: closing-call-to-action
category: sections
structure: monolithic
status: implemented
spec_version: 5
created: 2026-11-05
last_updated: 2026-11-15
checksum: 21eba9a696740e93c593758708a793fd7967cb27b836dd75ab600bc796ce5786
template: 2
---

# ClosingCallToAction — Component Spec

## Purpose

The last ask at the end of a landing page, followed by a hatched closing frame with no rules of its own, because the site footer under it opens with one. It is a page section — the site places it from a `{ _id: 'closing-call-to-action', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `button`, `registration-frame` and `texture`. `variant` picks the layout only: `split` sets the headline and the primary action in a raised lead cell beside an aside cell carrying the description and the secondary action, over a tall closing frame; `panel` sets the copy and its actions on one surface, over a short closing frame; `primary` is the loud close, one centred ask on the canvas under a pixelated texture whose waves keep travelling, over a tall closing frame. All three take the same copy, the same two actions and an optional copyable shell `command` set before the actions. `frame` draws the closing frame alone, with no ask: the close of a page whose last band already carries its own action. `hatch` turns the closing frame off when another closing band stacks directly below and draws the shared one (`site-page` sets it for stacked closings). In `primary`, `audiences` turns the ask into a switch between ways in (a person or an agent): each audience swaps in its own copyable line and actions, and a typed line (`typedLead` + `typedWords`) loops under them; the switch block loads on demand, only when `audiences` is set.

## When to use

- Use ClosingCallToAction for the last band before the site footer that asks for one action, with links or a command.
- Rendering page JSON, or you need a whole band with no custom content → this section. Building an SFC by hand, needing slots, or nesting inside another band → the `call-to-action` primitive.
- In `primary` with `audiences`, to close a page whose reader may be a person or an agent, each with its own way in.
- To close a solution or product page on its one or two asks (`split`), or a page such as Careers on one action (`panel`), or a page that ends on its one loud ask (`primary`).

## When NOT to use

- For a newsletter sign-up close → use `newsletter-section`.
- For a close that lists deployable templates → use `template-gallery` with `closing`.
- For an ask in the middle of a page → compose `call-to-action` directly.

## Related

- `call-to-action` — the framed band this section renders.
- `newsletter-section` — the closing band whose ask is a subscribe form.
- `template-gallery` — with `closing`, the closing band that lists deployable templates.

## Best practices

- Place it last on the page, right above `site-footer`, after a hatched `section-gap`. It draws the hatched closing frame itself, so nothing follows it inside the page column: no trailing `SectionGap` and no closing `RegistrationFrame` + `Texture` (the `shell/site` close is for a page that ends on any other band). `webkit/no-gap-after-closing-section` flags the doubled close.
- Set `anchor: 'contact'` so the page's contact links scroll to the close.
- Use `variant: 'frame'` (no copy) to close a page that ends on a band with its own actions (a listing, a legal page); `site-page` draws no gap before it.
- Turn `hatch` off only on a closing band that another closing band follows directly; the last one keeps the frame.
- Give `command` a short shell line (`npm create azion@latest`); it is copied as written and reads as a command, with the `$` prompt.
- Give `audiences` two or more entries so the switch renders; set `audiencesAriaLabel` and `lineAriaLabel` so the switch and the copyable field are named. With `audiences` set, `description` is the closing sentence under the typed line, and `command` and the two actions are not drawn.
- Mark a command line with `copy.shell` so it draws the `$` prompt; leave a prompt meant for an agent bare.
- In `split`, keep `title` and `titleMuted` to one short line each; `panel` and `primary` do not draw `titleMuted`, and `primary` does not draw `eyebrow`.

## Usage

```vue
<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
</script>

<template>
  <ClosingCallToAction
    variant="split"
    anchor="contact"
    eyebrow="Build"
    title="Build once."
    title-muted="Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
  />
</template>
```

## Props

| Prop                 | Type                            | Default     | Required | JSDoc                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | ------------------------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`            | `ClosingCallToActionVariant`    | `'split'`   | false    | Layout of the band: `split` is a raised lead cell beside an aside cell over a tall closing frame, `panel` one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame, `frame` the tall closing frame alone.                                                                     |
| `anchor`             | `string`                        | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                                                                                                                                           |
| `eyebrow`            | `string`                        | `''`        | false    | Short overline above the headline; not drawn in `primary`.                                                                                                                                                                                                                                                                               |
| `title`              | `string`                        | `''`        | false    | Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty.                                                                                                                                                                                                                                   |
| `titleMuted`         | `string`                        | `''`        | false    | Second line of the headline in muted ink; drawn in `split` only.                                                                                                                                                                                                                                                                         |
| `description`        | `string`                        | `''`        | false    | Supporting sentence: in the aside cell in `split`, under the headline in `panel`.                                                                                                                                                                                                                                                        |
| `primaryAction`      | `SectionTitleAction`            | `undefined` | false    | The white button of the band, under the headline in `split`; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent.                                                                                                                                                                                        |
| `secondaryAction`    | `SectionTitleAction`            | `undefined` | false    | The outlined button of the band, in the aside cell in `split` and beside the primary one in `panel` and `primary`; `{ label, href, trailing? }`. Omitted when absent.                                                                                                                                                                    |
| `command`            | `string`                        | `''`        | false    | Shell command on a copyable line before the actions, copied as written; drawn in `split`, `panel` and `primary`.                                                                                                                                                                                                                         |
| `hatch`              | `boolean`                       | `true`      | false    | Draws the hatched closing frame under the band; turn it off when another closing band stacks directly below and draws the shared frame.                                                                                                                                                                                                  |
| `audiences`          | `ClosingCallToActionAudience[]` | `[]`        | false    | The ways in of the `primary` close, in switch order; each is `{ value, label, copy?, actions? }` (`copy` is `{ label, text, shell? }`, `shell` drawing the `$` prompt; an action is `{ label, href, variant?, trailing? }`) and the first one opens. Replaces the command and the two actions; the switch renders only with two or more. |
| `typedLead`          | `string`                        | `''`        | false    | Fixed opening of the typed line under the audiences, before the typed word.                                                                                                                                                                                                                                                              |
| `typedWords`         | `string[]`                      | `[]`        | false    | Words typed, held, erased and typed again in order after `typedLead`; the typed line renders only with `audiences` and words.                                                                                                                                                                                                            |
| `audiencesAriaLabel` | `string`                        | `''`        | false    | Accessible name of the audience switch.                                                                                                                                                                                                                                                                                                  |
| `lineAriaLabel`      | `string`                        | `''`        | false    | Accessible name of the read-only field that shows an audience's copyable line.                                                                                                                                                                                                                                                           |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop and drives the call-to-action layout and the closing frame height
- `primary`: the call to action takes its `primary` register with a pixelated `texture` in its `background` slot; its waves stop under reduced motion (owned by `texture`)
- `frame`: only the tall closing frame renders, whatever the copy; `hatch` does not apply
- `hatch` off: the band renders without its closing frame
- Empty: when `title` is empty the band renders nothing but its root (except in `frame`)
- Each action and the command line render only when given
- `audiences` (in `primary`): picking an audience swaps the copyable line and the actions; the swapped row sits in a polite live region and fades in. After mount the typed words are typed (90 ms a character), held (1.8 s), erased (45 ms a character) and the next one typed (after 270 ms), in a loop; the timer is cleared on scope dispose. Under reduced motion every word shows at once, joined by commas, and the cursor is hidden

## Motion & Animations

| Trigger                       | Animation / Transition                                                         | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                              |
| ----------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------- |
| audience switch (swapped row) | `animate-fade-in`                                                              | semantic                                          | `motion-reduce:animate-none`                                         |
| each typed character enters   | `transition-[translate,opacity] duration-moderate-01 ease-productive-entrance` | semantic                                          | `motion-reduce:transition-none`                                      |
| typed-line cursor             | `animate-blink`                                                                | semantic                                          | `motion-reduce:hidden` (and the word list is shown whole, not typed) |

## Tokens

| Region               | Token (DESIGN.md)    |
| -------------------- | -------------------- |
| closing frame height | `var(--spacing-2xl)` |
| anchor scroll offset | `var(--spacing-2xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed buttons.
- Keyboard map: `Tab` reaches the command line and its copy button, then the primary and the secondary action; `Enter` follows an action. With `audiences`, `Tab` reaches the switch (arrow keys move it, owned by `toggle-group`), the copy button and each action.
- With `audiences`: the switch is a `radiogroup` named by `audiencesAriaLabel`; the swapped row is `aria-live="polite"`; the read-only field is named by `lineAriaLabel` and the copy button by the audience's `copy.label`. The typed line reads its whole sentence from a visually hidden copy while the animated letters are `aria-hidden`.
- ARIA: the `call-to-action` renders the band's `<section>` named by its title; the root is a plain `div` so the band has one landmark. The closing frame is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `call-to-action` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — see the Motion table; under reduced motion nothing types or blinks, and the texture and the buttons carry their own fallback.
- Touch target ≥40×40 px — the actions are large buttons.

## Internationalization

No built-in strings of its own: every visible text is a prop from the page JSON, including the switch, field and copy-button names of `audiences` (`audiencesAriaLabel`, `lineAriaLabel`, `copy.label`). The command line's field and copy button names come from `copy-command` (`copyCommand.command`, `copyCommand.copyCommand`).

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`ms-px` on the typed-line cursor); the split cells mirror as `call-to-action` lays them out.
- Icons: the trailing chevron on an action mirrors with `button`; the texture is not mirrored.
- Keyboard: the audience switch's arrow keys follow the direction (owned by `toggle-group`); nothing else handles arrows.
- User data: the command line renders `dir="ltr"` (owned by `copy-command`).

## Responsive

- Container queries: none of its own; `call-to-action` stacks the split cells below `lg`.
- Narrow (below `lg`): the lead and aside cells stack; the command line takes the full width above the actions.
- Touch: the actions are large buttons and the copy button is large; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; a long command scrolls inside its field.

## Performance

- Bundle budget: 6.15 KB gzip, the `.size-limit.json` entry `closing-call-to-action` (entry chunk only: `copy-command` loads on demand, only when `command` is set, and the audience switch only when `audiences` is set).
- Runtime budget: one timer for the typed word with `audiences` and `typedWords`, cleared on scope dispose; none under reduced motion. The `primary` texture animates on the compositor and stops under reduced motion.
- Heavy parts: none.

## Examples

- Default
- Types — composite story rendering the three `variant` values stacked.
- Command — justification: the `command` line is a part no other example shows (the `primary` close with a copyable install command before its actions).
- Audiences — justification: `audiences` is the one part that swaps content on input (a person or an agent), with the typed line under it; no other example reaches it.
- Stacked — justification: `hatch` and `frame` change how bands close a page; a `panel` close with `hatch` off over a `primary` close, then a page ending on the bare `frame`.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
