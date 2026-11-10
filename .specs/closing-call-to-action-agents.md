---
name: closing-call-to-action-agents
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: a910824a35c212bb2a858d86af4681b514b000e0b83599f1c8cbe00bff839179
---
# ClosingCallToActionAgents — Component Spec

## Purpose

The close for a reader who may be a person or an agent: one centred ask in the loud `primary` register of the call to action, under a pixelated, waving texture, with a small segmented switch under the title that picks the way in. Each audience carries an optional copyable line and its actions; under them, a line types its words one after another behind a blinking cursor, then a closing sentence, both the same for every audience so the band keeps its height when the switch changes. The hatched closing frame follows. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-agents', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `segmented-button`, `input-group`, `copy-button`, `button`, `frame-box` and `texture-material`. The switch and the typed word are local state.

## When to use

- To close a developer page whose reader may be a person or the person's agent.

## When NOT to use

- For a close on one or two link actions → use `closing-call-to-action` (`primary` for the same loud register without the switch).
- For a newsletter sign-up → use `closing-call-to-action-newsletter`.

## Related

- `closing-call-to-action` — the same close without the audience switch.

## Best practices

- Keep two audiences; the first one opens.
- Keep each copyable line short enough to fit the field; the copy button copies exactly what it shows.
- Keep `typedWords` to a few short words; screen readers and reduced motion get the whole list at once.

## Usage

```vue
<script setup>
import ClosingCallToActionAgents from '@aziontech/webkit/closing-call-to-action-agents'
</script>

<template>
  <ClosingCallToActionAgents
    anchor="contact"
    title="Built by you, or your agents."
    typed-lead="Drive one platform from the"
    :typed-words="['Console', 'CLI', 'MCP server']"
    description="A person and an agent ship the same way."
    audiences-aria-label="Audience"
    line-aria-label="Prompt"
    :audiences="[
      {
        value: 'humans',
        label: 'For humans',
        actions: [
          { label: 'Start for free', href: '/signup', kind: 'secondary', trailing: true },
          { label: 'Talk to a specialist', href: '/site/contact', kind: 'outlined', trailing: true }
        ]
      },
      {
        value: 'agents',
        label: 'For agents',
        copy: { label: 'Copy prompt', text: 'Connect Azion MCP: https://mcp.azion.com' },
        actions: [{ label: 'Read the agent docs', href: '/site/docs/agent-setup', trailing: true }]
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. |
| `typedLead` | `string` | `''` | false | Fixed opening of the typed line, before the typed word. |
| `typedWords` | `string[]` | `[]` | false | Words typed, held, erased and typed again in order after `typedLead`; the typed line renders only when there are words. |
| `description` | `string` | `''` | false | Closing sentence under the typed line, the same for every audience. |
| `audiences` | `ClosingCallToActionAgentsAudience[]` | `[]` | false | The ways in, in switch order; each is `{ value, label, copy?, actions? }` and the first one opens. The switch renders only with two or more. |
| `audiencesAriaLabel` | `string` | `''` | false | Accessible name of the audience switch. |
| `lineAriaLabel` | `string` | `''` | false | Accessible name of the read-only field that shows an audience's copyable line. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Audience switch: picking an audience swaps the copyable line and the actions; the swapped row sits in a polite live region and fades in
- Typed word: after mount the words are typed (90 ms a character), held (1.8 s), erased (45 ms a character) and the next one typed (after 270 ms), in a loop; the timer is cleared on scope dispose
- Reduced motion: the typed word shows every word at once, joined by commas, and the cursor is hidden
- Empty: when `title` is empty the band renders nothing but its root; an audience without `copy` shows no field; without `typedWords` the typed line is omitted

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| audience switch (swapped row) | `animate-fade-in` | semantic | `motion-reduce:animate-none` |
| each typed character enters | `transition-[translate,opacity] duration-moderate-01 ease-productive-entrance` | semantic | `motion-reduce:transition-none` |
| typed-line cursor | `animate-blink` | semantic | `motion-reduce:hidden` (and the word list is shown whole, not typed) |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| copyable line | `.text-label-code-sm`, `var(--bg-surface)`, `var(--text-default)` |
| typed line | `.text-body-code-sm`, `var(--text-muted)`, `var(--text-default)`, `var(--accent)` |
| rhythm | `var(--spacing-xxl)`, `var(--spacing-md)`, `var(--spacing-sm)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `segmented-button`, `copy-button` and `button`.
- Keyboard map: `Tab` reaches the switch, the copy button and each action; the arrow keys move the switch (owned by `segmented-button`).
- ARIA: the root is a plain `div`; the call to action owns the band's named region. The switch is a `radiogroup` named by `audiencesAriaLabel`; the swapped row is `aria-live="polite"`; the read-only field is named by `lineAriaLabel` and the copy button by the audience's `copy.label`. The typed line reads its whole sentence from a visually hidden copy while the animated letters are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the typed line uses `var(--text-muted)` and `var(--text-default)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — see the Motion table; under reduced motion nothing types or blinks.
- Touch target ≥40×40 px — the switch, the copy button and the actions are large.

## Stories (Storybook)

- Default

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
