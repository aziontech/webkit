---
name: media-split-section
category: sections
structure: monolithic
status: implemented
spec_version: 8
template: 2
created: 2026-11-05
last_updated: 2026-11-15
checksum: bae08cb4e3a4f6448e74375451a836f52882981f765d847a5416066d61298dd2
---

# MediaSplitSection — Component Spec

## Purpose

One claim beside its picture, on its own frame: the copy cell with its overline, headline and sentence on one side, and the media on a raised, pixel-textured surface on the other. It is a page section — the site places it from a `{ _id: 'media-split-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, a framed `media-split`, `button`, `code-block`, `illustration`, `console-mockup`, `diagram` and the webkit scene assets. The media is a scene, a code sample (one file or a tab strip of files), a product console widget, a request-flow diagram, an image (cover or framed) or an illustration; with one action the whole band links to it (unless `linked` is off), with two the band stays unlinked. The media sits beside the copy, or under it when `orientation` is `vertical`.

## When to use

- Rendering page JSON, or you need a whole band with no custom content → the section (`media-split-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`media-split`).
- Use MediaSplitSection for one marketing claim beside its picture, scene or code.
- To make one point beside one picture and move on (a values statement, a single product claim).
- To set a claim beside the code that delivers it (`codeTabs`), with the files in a tab strip.

## When NOT to use

- For several claims stacked one after the other → use `media-split-stack-section`.
- For a full-width terminal session with no copy column → use `cli-terminal`.
- For copy beside one piece of media in a hand-built SFC that needs the `media` slot → use `media-split`.

## Related

- `media-split` — the band primitive the section is rendered with.
- `media-split-stack-section` — the stacked sibling for a run of claims.

## Best practices

- Give the band exactly one media: `scene`, `codeTabs`, `widget` (a `ConsoleMockup` name), `diagram` (a `Diagram` name), `image` or `illustration`; when several are set the first of that order wins.
- A code sample holds controls of its own (tabs, copy), so the band never links to its lone action while it shows code; give it a `variant: 'ghost'` action for a quiet "Learn more".
- On a product page prefer `widget` or `diagram`: they show the product itself. Do not drop to `media-split` and its `media` slot to place one.
- Set `image.framed` for a picture that is an object rather than a scene (a badge, a logo, a screenshot): it sits whole on a rounded, bordered plate inset in the cell instead of covering it.
- Use `size="large"` for a band that carries only its headline and description.
- Use `orientation="vertical"` for a wide scene that needs the full width of the frame under the copy.
- Turn `linked` off when the media holds controls of its own, so a click in it is not taken as a click on the band.
- Set `anchor` when another part of the page links to the band.
- Give an `image` its `width` and `height` so the page reserves its box before it loads.

## Usage

```vue
<script setup>
  import MediaSplitSection from '@aziontech/webkit/media-split-section'
</script>

<template>
  <MediaSplitSection
    eyebrow="Our values"
    title="Four values shape every role at Azion"
    description="Quality, Drive, Accountability, and Innovation."
    size="large"
    :scene="{ component: 'BrandGlobeScene' }"
  />
</template>
```

## Props

| Prop                    | Type                           | Default        | Required | JSDoc                                                                                                                                                                                                                                               |
| ----------------------- | ------------------------------ | -------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`                | `string`                       | `''`           | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                                                      |
| `eyebrow`               | `string`                       | `''`           | false    | Short overline above the headline.                                                                                                                                                                                                                  |
| `title`                 | `string`                       | `''`           | false    | Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty.                                                                                                                           |
| `description`           | `string`                       | `''`           | false    | Paragraph under the headline.                                                                                                                                                                                                                       |
| `size`                  | `MediaSplitSectionSize`        | `'medium'`     | false    | Type scale of the copy; `large` sets the headline at heading-xl and centres the copy beside the media, `medium` aligns it to the top of the media.                                                                                                  |
| `orientation`           | `MediaSplitSectionOrientation` | `'horizontal'` | false    | Axis the band splits on; `vertical` stacks the media under the copy for a wide scene.                                                                                                                                                               |
| `texture`               | `TextureVariant`               | `'pixelate'`   | false    | Texture painted under the media: `dots`, `grid`, `lines`, `dither`, `pixelate` or `none`.                                                                                                                                                           |
| `linked`                | `boolean`                      | `true`         | false    | Links the whole band to a lone action; turn it off when the media holds controls of its own.                                                                                                                                                        |
| `scene`                 | `MediaSplitSectionScene`       | `undefined`    | false    | Scene drawn in the media cell, `{ component, props? }` naming a webkit scene asset and the props bound onto it; wins over every other media.                                                                                                        |
| `codeTabs`              | `MediaSplitSectionCodeTab[]`   | `[]`           | false    | Files of the code sample drawn in the media cell when no scene is set, in order; each is `{ label, value, code, language?, fileName?, fileIcon?, icon? }` where `icon` is a mark beside the tab label. A tab without `code` is skipped.             |
| `defaultFile`           | `string`                       | `''`           | false    | `value` of the code tab open first; empty, or a value no tab carries, opens the first tab.                                                                                                                                                          |
| `copyAriaLabel`         | `string`                       | `''`           | false    | Accessible name of the code sample's copy button; empty keeps the code block's own.                                                                                                                                                                 |
| `widget`                | `ConsoleMockupName`            | `undefined`    | false    | Name of the product console widget drawn in the media cell when neither a scene nor code is set.                                                                                                                                                    |
| `diagram`               | `DiagramName`                  | `undefined`    | false    | Name of the request-flow diagram drawn in the media cell when neither a scene nor a widget is set.                                                                                                                                                  |
| `image`                 | `MediaSplitSectionImage`       | `undefined`    | false    | Picture drawn in the media cell when no scene, widget or diagram is set; `{ src, alt?, width?, height?, framed? }`, where `framed` sets it whole on a rounded plate instead of covering the cell.                                                   |
| `illustration`          | `string`                       | `''`           | false    | Registry name of the illustration drawn in the media cell when no other media is set.                                                                                                                                                               |
| `illustrationAriaLabel` | `string`                       | `''`           | false    | Accessible name of the illustration; empty keeps it decorative.                                                                                                                                                                                     |
| `primaryAction`         | `MediaSplitSectionAction`      | `undefined`    | false    | First button under the copy; `{ label, href, trailing?, icon?, target?, variant? }`. When it is the only action it renders outlined with a trailing chevron, and the whole band links to it (not over code); `variant` overrides the drawn variant. |
| `secondaryAction`       | `MediaSplitSectionAction`      | `undefined`    | false    | Second, outlined button beside the first; `{ label, href, trailing?, icon?, target?, variant? }`. With two actions the band stays unlinked.                                                                                                         |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `size` is forwarded to the media split and drives its type scale and copy alignment
- Empty: when `title` is empty the band renders nothing but its root; with no media set the media cell is omitted
- With exactly one action the band is a link to that action's `href` (unless `linked` is `false`), and that lone action renders as an outlined button closed by the trailing chevron; with two the first is secondary, the second outlined, and the band is not a link
- `size="medium"` aligns the copy to the top of the media, `size="large"` centres it
- `orientation` and `texture` are forwarded to the media split
- Media precedence: `scene`, `codeTabs`, `widget`, `diagram`, `image`, `illustration`. Code, a widget, a diagram and a framed image are inset from the cell's edges (`media-split`'s `mediaPadded`); a scene, a plain image (which covers the cell) and an illustration run flush
- A widget plays its beat while the pointer is over the band, and shows its finished state on touch and under reduced motion (owned by `console-mockup`); it draws no collaborator cursor (`cursor` off), so the band reads as the product screen
- Scenes, code block, widget and diagram load on demand (`defineAsyncComponent`)
- Code: the sample opens on `defaultFile` (or the first tab), numbers its lines and types them in once; the band does not link to a lone action while it shows code
- An action's `variant` (`secondary`, `outline`, `ghost`) wins over the drawn default; an action's `icon` is drawn before the label when it has no trailing chevron

## Motion & Animations

_none_

## Tokens

| Region                | Token (DESIGN.md)                                                |
| --------------------- | ---------------------------------------------------------------- |
| media cell fill       | `var(--bg-surface)`                                              |
| frame rules and marks | `var(--border-default)`                                          |
| framed image plate    | `var(--bg-canvas)`, `var(--border-default)`, `var(--shape-card)` |
| framed image inset    | `var(--spacing-md)`                                              |
| anchor scroll offset  | `var(--spacing-2xl)`                                             |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button` and `media-split`.
- Keyboard map: `Tab` moves through the actions, and through the media link when the band links; over code it moves through the code block's tabs and copy button (owned by `code-block`).
- ARIA: the media split's `<section>` is the band's named region (`aria-label` from `title`), so the root is a plain `div`; the headline is its `h2`; an image is named by `alt`, an illustration by `illustrationAriaLabel`, and both are decorative when empty; a diagram is a `figure` named by the description its library entry carries; a widget is an inert, `aria-hidden` picture of the console, so the copy carries its meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the scenes stop under reduced motion on their own.
- Touch target ≥40×40 px — the medium buttons meet it.

## Internationalization

- No built-in strings: every visible string arrives through props in the page's language. Widget and diagram text is product UI copy owned by `console-mockup` and `diagram`.
- Formatting: none.

## Right-to-left

- Layout: logical utilities only (owned by `media-split`).
- Icons: a trailing chevron on an action mirrors (owned by `button`).
- Keyboard: unchanged.
- User data: none.

## Responsive

- Container queries: none; `media-split` stacks the media under the copy below `lg`.
- Narrow (≤ 640 px): one column; a widget, a diagram and a framed image scale down with the cell.
- Touch: a widget shows its finished state instead of the hover beat.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 6.95 KB gzip for `./media-split-section` (initial chunk only) in `.size-limit.json`; scenes, `code-block`, `console-mockup` and `diagram` are async chunks.
- Runtime budget: none: static apart from the widget beat while hovered.
- Heavy parts: the scenes, `code-block`, `console-mockup` and `diagram`, all lazy.

## Examples

- Default
- Product media — the band with a `ConsoleMockup`, then with a `Diagram` (justified: `widget` and `diagram` are render paths the default does not reach).
- Code — a claim beside a one-file code sample with a quiet `ghost` action (justified: the code media is a render path the other examples do not reach).
- Vertical — a wide scene stacked under the copy with `orientation="vertical"`, a lone outlined action and `linked` off (justified: the vertical split and the unlinked lone action are layouts the default does not reach).

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
