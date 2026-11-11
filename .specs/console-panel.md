---
name: console-panel
category: sections
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 9488af3773cc9406265901cd42e22a9236d36d161f4a8972bbd641d4e4759dcd
created: 2026-11-11
last_updated: 2026-11-11
---

# ConsolePanel — Component Spec

## Purpose

A full-width framed panel that presents a product scene (a console mock or a diagram) under a section title, on a texture, with optional tabs that each play one beat of the scene. The scene is a slot: the page passes a `ShellMockup`, `ProductWidget` or diagram and reads the selected tab from the slot scope. In `console` kind the scene keeps a 1.9:1 aspect and can be cropped and faded at the bottom. From the design sample's site `ConsolePanel`.

## When to use

- Showing the product itself on a landing page.
- A tour of three or four views of one screen.

## When NOT to use

- For a screenshot with copy beside it — use `MediaSplitBand`.
- For code — use `CodeSplit` or `CliTerminal`.

## Related

- `ShellMockup`, `ProductWidget` — scenes it frames.
- `ToggleGroup` — the tab control.
- `TextureMaterial`, `FrameBox`, `SectionTitle`.

## Best practices

- Two to four tabs, each a different view, labelled with one word.
- Crop the scene only to remove empty space at its bottom (0.1–0.3).

## Usage

```vue
<script setup>
  import ConsolePanel from '@aziontech/webkit/console-panel'
  import ShellMockup from '@aziontech/webkit/shell-mockup'
</script>

<template>
  <ConsolePanel
    title="One console for every workload"
    :tabs="[
      { value: 'apps', title: 'Applications' },
      { value: 'logs', title: 'Logs' }
    ]"
  >
    <template #scene="{ tab }">
      <ShellMockup :data-tab="tab" />
    </template>
  </ConsolePanel>
</template>
```

## Props

| Prop            | Type                   | Default      | Required    | JSDoc                                                                                                                                          |
| --------------- | ---------------------- | ------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`          | `'console' \\          | 'diagram'`   | `'console'` | false                                                                                                                                          | What the panel frames: `console` crops and fades a console mock at a fixed aspect, `diagram` lets a scene keep its own height. |
| `titleKind`     | `SectionTitleKind`     | `'centered'` | false       | Layout of the headline block.                                                                                                                  |
| `titlePadding`  | `SectionTitlePadding`  | `'medium'`   | false       | Vertical padding of the headline block.                                                                                                        |
| `size`          | `SectionTitleSize`     | `'medium'`   | false       | Step of the headline on the heading scale.                                                                                                     |
| `anchor`        | `string`               | `''`         | false       | In-page id set on the band so a hash link can target it.                                                                                       |
| `eyebrow`       | `string`               | `''`         | false       | Overline above the title.                                                                                                                      |
| `title`         | `string`               | `''`         | false       | Headline of the band, rendered as its `h2`.                                                                                                    |
| `description`   | `string`               | `''`         | false       | One or two sentences under the headline.                                                                                                       |
| `texture`       | `TextureMaterialKind`  | `'pixelate'` | false       | Texture the panel is grounded with.                                                                                                            |
| `textureFade`   | `TextureMaterialFade`  | `'top'`      | false       | Axis the texture fades out along.                                                                                                              |
| `tabs`          | `ConsolePanelTab[]`    | `[]`         | false       | Tabs over the frame, each `{ value, title }`; each plays its own beat of the scene.                                                            |
| `tabsAriaLabel` | `string`               | `''`         | false       | Accessible name of the tab control; empty uses the built-in "Console views".                                                                   |
| `crop`          | `number`               | `0`          | false       | Share of the scene height clipped off its bottom, from 0 to 0.5, from the medium breakpoint up.                                                |
| `actions`       | `ConsolePanelAction[]` | `[]`         | false       | Buttons under the headline; each is `{ label, href, trailing?, target?, kind? }`; without `kind` the first is secondary and the rest outlined. |

## Events

| _none_ | — | — |

## Slots

| Slot    | Scope             | Notes        |
| ------- | ----------------- | ------------ |
| `scene` | `{ tab: string \\ | undefined }` | The scene the band presents; `tab` is the selected tab value (undefined without tabs). |

## States

- `data-kind` mirrors `kind`.
- The first tab is selected on render.
- `--mockup-fade-start` / `--mockup-fade-end` are set for a `ShellMockup` scene when cropped.

## Motion & Animations

None of its own; `TextureMaterial` stops under reduced motion.

## Tokens

| Region         | Token (DESIGN.md)                        |
| -------------- | ---------------------------------------- |
| frame          | From `FrameBox`                          |
| texture        | From `TextureMaterial`                   |
| spacing        | `var(--spacing-xl)`, `var(--spacing-md)` |
| diagram height | `var(--size-96)`                         |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- A `section` named by its title.
- Tabs are a `ToggleGroup` (radio group) named by `tabsAriaLabel` or "Console views"; arrow keys move between them.
- The scene supplies its own accessible content (a mock is usually `aria-hidden` with a description in the copy).

## Internationalization

| Key                  | English source  | Override prop   |
| -------------------- | --------------- | --------------- |
| `consolePanel.views` | `Console views` | `tabsAriaLabel` |

- Every other string is marketing copy passed through props.

## Right-to-left

- Layout: logical utilities only (`ps-*`, `border-e`, `ms-*`).
- Icons: none mirrored.
- Keyboard: unchanged.

## Responsive

- Below medium the console scene is square and uncropped; from medium it is 1.9:1 with the crop applied.
- No horizontal scroll at 320 px.

## Performance

- Bundle budget: 21.25 KB for `./console-panel` gzip in `.size-limit.json` (measured + ~0.5 KB). the scene is the page's and is not counted.

## Stories (Storybook)

- Default — a console scene with two tabs.
- Diagram — `kind="diagram"` with a diagram at its own height.

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
