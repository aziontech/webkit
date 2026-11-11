---
name: qr-code
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 49cb7c9e625b35efecc243d33fb8b817580d0d17d5595fae9a827dfaba4fee26
created: 2026-11-11
last_updated: 2026-11-11
---

# QrCode — Component Spec

## Purpose

A QR code drawn as SVG from a string, with no image request and no dependency: WebKit's own encoder (byte mode, UTF-8, versions 1–40, error correction L/M/Q/H) turns the value into modules, and the component draws them as one path. It is for setup flows that hand a URI to a phone, first the `otpauth://` URI of an authenticator app in `auth#MfaSetup`, where it replaces the image the API returned and the framed placeholder of the demo. The code is always dark on a light plate (the plate pins the light theme), because several authenticator scanners do not read an inverted code.

## When to use

- A phone has to pick up a value the screen shows: an authenticator `otpauth://` URI, a pairing link, a short download URL.
- Next to a typed alternative: the same value (or its secret) as text with a `CopyButton`, for people who cannot scan.

## When NOT to use

- The value is only for reading or copying on the same device → show it as text with `CopyButton`.
- A brand or partner logo → use `Brand` or the partner's asset.
- A long payload (over a few hundred characters) → link to it; a dense code is hard to scan from a screen.

## Related

- `copy-button` — the typed alternative beside the code.
- `otp-input` — the 6-digit code the app shows after the scan.

## Best practices

- Always give the code a typed alternative next to it: the setup key or the link as text.
- Name the code after what it does (`QR code to add ana@example.com to an authenticator app`), not `QR code`.
- Keep the default `M` error correction; raise it only when the code is printed or shown small.

## Usage

```vue
<script setup>
  import QrCode from '@aziontech/webkit/qr-code'
</script>

<template>
  <QrCode
    value="otpauth://totp/Azion:ana@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Azion"
    label="QR code to add ana@example.com to an authenticator app"
  />
</template>
```

## Props

| Prop              | Type                             | Default     | Required | JSDoc                                                                                                                                  |
| ----------------- | -------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `value`           | `string`                         | —           | true     | The text the code carries (a URI, a key), encoded as UTF-8 bytes.                                                                      |
| `label`           | `string`                         | `undefined` | false    | Accessible name of the image. Empty uses the catalog's `QR code`; name it after what the scan does.                                    |
| `errorCorrection` | `'L' \| 'M' \| 'Q' \| 'H'`       | `'M'`       | false    | Error-correction level: `L` 7 %, `M` 15 %, `Q` 25 %, `H` 30 % of the code can be lost and still read. Higher levels make denser codes. |
| `size`            | `'small' \| 'medium' \| 'large'` | `'medium'`  | false    | Rendered width: `small` 128 px, `medium` 160 px, `large` 224 px, quiet zone included.                                                  |

## Events

_none_

## Slots

_none_

## States

- `data-size`: `small` | `medium` | `large`.
- `data-version` on the root: the QR version the encoder picked (1–40); `data-modules`: the module count per side.
- An empty value draws no code: the plate keeps its size and `data-version` is absent. A value too long for version 40 at the chosen level draws no code either and logs one warning.

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
| ------- | ---------------------- | ----- | ----------------------- |
| —       | none (static image)    | —     | —                       |

## Tokens

| Region       | Token                                            |
| ------------ | ------------------------------------------------ |
| plate        | `var(--bg-surface)` under `data-theme="light"`   |
| plate border | `var(--border-default)`                          |
| modules      | `var(--text-default)` under `data-theme="light"` |
| plate radius | `var(--shape-elements)`                          |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is `role="img"` named by `label` (catalog `QR code` when empty); the SVG inside is `aria-hidden` and not focusable; the code takes no focus.
- The code is never the only way: the page puts the value or its secret beside it as text.
- Contrast: dark modules on a light plate in both themes (the plate sets `data-theme="light"`); `forced-color-adjust: none` keeps the code dark on light in forced colors, so a scanner still reads it.

## Internationalization

| Key            | English source | Override prop |
| -------------- | -------------- | ------------- |
| `qrCode.label` | `QR code`      | `label`       |

- The value is encoded as UTF-8 bytes, so non-Latin text works; most authenticator URIs are ASCII.

## Right-to-left

- Layout: the code is never mirrored (`dir="ltr"` on the SVG); the plate is symmetric.
- Icons: none.
- Keyboard: none.
- User data: the value is not shown as text by the component.

## Responsive

- Container queries: none.
- Narrow: fixed size; `shrink-0`; `max-w-full` so it never overflows a 320 px column.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 4.39 KB gzip for `./qr-code` in `.size-limit.json` (the encoder with its block tables).
- Runtime budget: one encode per value change (a version-5 code takes well under 5 ms); one SVG path.
- Heavy parts: none; the encoder is plain arithmetic, no canvas.

## Examples

- Default — an authenticator URI with its label.
- Sizes — `small`, `medium`, `large`.

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
