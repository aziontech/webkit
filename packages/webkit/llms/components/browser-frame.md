# Browser Frame

> A browser window that renders live webkit components inside a viewport of its own, so a page or story can show a real screen at a real device size — desktop, tablet or mobile — and resize it by hand. The default slot is teleported into an internal `iframe`, which gives the content a true width × height viewport: CSS breakpoints fire against the frame's simulated width, viewport units resolve against its simulated height, and content taller than the viewport scrolls inside it like a page. When the simulated width is wider than the space available, the frame scales the whole viewport down to fit instead of clamping it. The chrome's window dots, address and size readout are decoration; its one control is a copy button inside the address bar, and the frame's other controls are the resize handles on its right edge, bottom edge and bottom-right corner.

- Import: `import BrowserFrame from '@aziontech/webkit/browser-frame'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [browser-frame.json](https://github.com/aziontech/webkit/blob/main/.specs/browser-frame.json)

## When to use

- Showing a real screen — a site band, a console page, a template — built from webkit components, at a device size you choose.
- Letting a reader drag a layout from desktop to tablet to mobile to see how it responds, on a documentation page.
- Pinning a composed example to a device size (`v-model:width` + `v-model:height`) so a story or page always shows the tablet or mobile layout.
- Showing that a result lives at a URL — a deployed site, a preview link — by setting `address`.

## Do

- Compose the default slot exactly as the screen would be composed in an app — the frame mirrors the page's stylesheets and theme into its viewport, so no extra wiring or classes are needed.
- Pin the device the example is about with `v-model:width` and `v-model:height` (`375 × 812` mobile, `768 × 1024` tablet, `1280 × 800` desktop); leave `width` unset to fill the container.
- Give the frame an `ariaLabel` that names what is shown (`Pricing page at tablet size`); it becomes the viewport's accessible name.
- Viewport-height units (`h-screen`, `min-h-dvh`) in slot content resolve against the simulated height, so a full-height shell renders as it would on the device.
- Do not add controls to the chrome — the address's copy button and the resize handles are the frame's only controls. Interactive content belongs in the default slot.

## Don’t

- For a static screenshot or clip in documentation → use `doc-frame`.
- For third-party content loaded from another origin → use `embed`.
- For a mock of the Azion console's own shell on a marketing band → use the console shell mockup the page composes; it draws the console chrome and staggers its parts.
- For content whose layout depends on an overlay (`dialog`, `drawer`, a dropdown panel) or a JS breakpoint composable — those still read the outer page (see States), so the frame cannot show them at the simulated size.
- For a framed page section or grid cell → use `frame-box`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [doc-frame](doc-frame.md) — the documentation figure frame for stills and clips; no live viewport.
- [embed](embed.md) — a titled `iframe` for another origin's document; `browser-frame` renders our own components.
- [frame-box](frame-box.md) — the page's registration frame (hairlines + corner marks), not a window.
- [copy-button](copy-button.md) — the clipboard control the address bar composes; reach for it directly to copy any other value.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `address` | `string` | `''` | false | Read-only URL shown in the chrome's address bar; the address bar is not rendered when empty. |
| `minWidth` | `number` | `320` | false | Smallest viewport width the resize handles can reach, in pixels. |
| `maxWidth` | `number` | `1920` | false | Largest viewport width the resize handles can reach, in pixels; widths wider than the container are scaled down to fit. |
| `minHeight` | `number` | `320` | false | Smallest viewport height the resize handles can reach, in pixels. |
| `maxHeight` | `number` | `1440` | false | Largest viewport height the resize handles can reach, in pixels. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the viewport; when empty it falls back to `address`, then to `Preview`. |
| `copyAriaLabel` | `string` | `''` | false | Accessible name of the address bar's copy button. Empty uses the locale catalog (`Copy address`). |
| `widthHandleAriaLabel` | `string` | `''` | false | Accessible name of the right-edge width handle. Empty uses the locale catalog (`Resize preview width`). |
| `heightHandleAriaLabel` | `string` | `''` | false | Accessible name of the bottom-edge height handle. Empty uses the locale catalog (`Resize preview height`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The live content, teleported into the frame's viewport `iframe` once it is ready. Renders client-side only. |

## v-model

| Model            | Type     | Default     | Emits           | Notes                                                                                                                                                                                                                                |
| ---------------- | -------- | ----------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model:width`  | `number` | `undefined` | `update:width`  | Simulated viewport width in pixels via `defineModel('width')`. Undefined fills the container; the width and corner handles write a number, clamped to `minWidth`…`maxWidth`, on every resize step. Works controlled or uncontrolled. |
| `v-model:height` | `number` | `800`       | `update:height` | Simulated viewport height in pixels via `defineModel('height', { default: 800 })`. The height and corner handles write a number, clamped to `minHeight`…`maxHeight`, on every resize step. Works controlled or uncontrolled.         |

## States

The frame is static apart from its resize handles.

- **Viewport.** The root renders an `iframe` (blank document). Once it loads, the frame mirrors the host page's stylesheets (every `style` and stylesheet `link` in `head`, kept in sync as they change so HMR still applies) and the theme attributes of the host's root element (`data-theme`, `class`) into it, then teleports the default slot into its `body`. The content is the same Vue app — props, reactivity, provide/inject and events behave as if it were rendered in place.
- **Breakpoints.** CSS media queries and viewport units in the content resolve against the viewport's width and height. JS breakpoint reads (`matchMedia` in a composable) and overlays that teleport to the document `body` still resolve against the host page — a documented limit, not a bug.
- **Size.** The viewport renders at the effective width (`width` when set, otherwise the container's width) and at `height`. Content taller or wider than the viewport scrolls inside the `iframe`'s own document, exactly as a page scrolls in a browser.
- **Scale.** When the effective width exceeds the container, the viewport is scaled down by `container / effective` on both axes, and the frame's on-page height is `height × scale`. A frame narrower than its container is centered in it.
- **Resizing.** Three handles resize the viewport:
  - the **width handle** on the right edge writes `width`;
  - the **height handle** on the bottom edge writes `height`;
  - the **corner handle** at the bottom-right writes both at once.
    Pointer drags use pointer capture. A width drag moves the right edge under the pointer (the frame is centered, so the width changes by twice the pointer's travel) and is clamped to `minWidth` and the container width; a height drag follows the pointer's travel divided by the current scale and is clamped to `minHeight`…`maxHeight`. The keyboard reaches up to `maxWidth` / `maxHeight`. While any handle is dragged the root sets `data-resizing` and the content ignores the pointer.
- **Size readout.** While any handle is dragged or focused, the chrome shows the viewport size (`768 × 1024`) at its trailing end; it is hidden otherwise.
- **Scaled.** The root sets `data-scaled` while the viewport is scaled below 1.
- **Address.** Rendered only when `address` is non-empty, centered in the chrome as a compact, fully rounded pill up to `--container-xs` wide and exactly as tall as the small copy button (28px), which sits flush at its trailing end, never overlapping the window dots or the readout. The pill is filled with the skeleton placeholder fill (static — no sweep) and edged with a muted hairline. Its text is set in the monospace code label and centered in the space left of the copy button; long addresses truncate in the middle: a leading part ellipsizes and the last 12 characters always stay visible.
- **Copy.** The address bar's trailing end composes the package's `CopyButton` (`kind="transparent"`, `size="small"`) with `value` = the full `address`; its copied feedback is the `CopyButton`'s own.
- **Test ids.** Root fallback `content-browser-frame` (consumer override wins); `${testId}__address`, `${testId}__viewport` (the `iframe`), `${testId}__copy`, `${testId}__width-handle`, `${testId}__height-handle`, `${testId}__corner-handle`.
- **Composable.** The document mirroring and teleport target live in a co-located lifecycle composable, `composables/use-frame-document.ts`, that disconnects every observer on scope dispose.

## Accessibility

- Visible focus: the width and height handles show `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; focusable content inside the viewport keeps its own ring.
- Keyboard map:
  - width handle — `ArrowLeft` / `ArrowRight` change the width by 10px, `Shift` + arrow by 100px, `Home` jumps to `minWidth`, `End` to `maxWidth`;
  - height handle — `ArrowUp` / `ArrowDown` change the height by 10px, `Shift` + arrow by 100px, `Home` jumps to `minHeight`, `End` to `maxHeight`;
  - the corner handle is pointer-only and not focusable — both of its axes are already reachable through the two keyboard handles;
  - the copy button is a normal tab stop before the handles and keeps `CopyButton`'s own keyboard behavior (`Enter` / `Space` copy);
  - the viewport's content is reached with `Tab` as part of the page's normal order.
- ARIA:
  - width handle — focusable `role="separator"`, `aria-orientation="vertical"`, `aria-valuenow` (effective width), `aria-valuemin` (`minWidth`), `aria-valuemax` (`maxWidth`), `aria-valuetext` (`768 pixels wide`), `aria-controls` (the viewport id, from `useId()`), `aria-label` from `widthHandleAriaLabel`;
  - height handle — focusable `role="separator"`, `aria-orientation="horizontal"`, `aria-valuenow` (`height`), `aria-valuemin` (`minHeight`), `aria-valuemax` (`maxHeight`), `aria-valuetext` (`1024 pixels tall`), `aria-controls` (the viewport id), `aria-label` from `heightHandleAriaLabel`;
  - the corner handle, the window dots, the address text and the size readout are `aria-hidden="true"`; the chrome bar itself is not hidden, so the copy button stays reachable, named by `copyAriaLabel`;
  - the `iframe` carries `title` from `ariaLabel` → `address` → `Preview`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): `var(--text-muted)` on `var(--bg-placeholder)` over `var(--bg-surface)` for the address and on `var(--bg-surface)` for the readout; the handle grips at rest `var(--border-strong)` meet 3:1 against `var(--bg-canvas)` as non-text controls.
- `motion-reduce:transition-none` on the handles' color transition; nothing else moves.
- Touch target: the edge handles' hit areas are 24px deep and run the frame's full width or height, and the corner handle is 24×24 — a justified deviation from 40×40: a deeper strip would cover more of the content's edge, and 24px meets WCAG 2.5.8.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: the width handle grows with `ArrowRight` and shrinks with `ArrowLeft` in reading order, swapped under `dir="rtl"` (`logicalArrowKey`).
- Pointer: the width drag delta is inverted under `rtl`.
- User data: the address bar renders `dir="ltr"`: a URL always reads left to right.

## Examples

### Default

```vue
<script setup>
  import BrowserFrame from '@aziontech/webkit/browser-frame'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <BrowserFrame
    address="https://www.azion.com"
    aria-label="Azion platform page"
  >
    <SectionContainer max-width="site">
      <SectionGap
        size="small"
        hatch
      />
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <template #header>
          <SectionTitle
            kind="horizontal"
            eyebrow="Platform"
            title="Build, secure and deliver from one platform"
            description="Run your applications, protect them and cache their responses on the same distributed network."
          >
            <template #actions>
              <Button
                kind="outlined"
                label="See all products"
              />
            </template>
          </SectionTitle>
        </template>
        <FrameBox
          flush
          borders="y"
          marks="all"
        >
          <CardGrid
            flush
            kind="frame"
            :columns="3"
            :mobile-columns="1"
          >
            <CardGrid.Cell kind="canvas">
              <Topic
                :heading-level="3"
                icon="ai ai-edge-application"
                title="Applications"
                description="Deploy web apps and APIs close to every user, with no servers to provision."
              />
            </CardGrid.Cell>
            <CardGrid.Cell kind="canvas">
              <Topic
                :heading-level="3"
                icon="ai ai-edge-firewall"
                title="Firewall"
                description="Stop DDoS, bots and injection attacks before a request reaches your origin."
              />
            </CardGrid.Cell>
            <CardGrid.Cell kind="canvas">
              <Topic
                :heading-level="3"
                icon="ai ai-tiered-cache"
                title="Tiered Cache"
                description="Answer repeat requests from the nearest location and offload your origin."
              />
            </CardGrid.Cell>
          </CardGrid>
        </FrameBox>
      </SectionModule>
      <SectionGap
        size="small"
        hatch
      />
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <CallToAction
          framed
          kind="split"
          eyebrow="Get started"
          title="Deploy your first application."
          title-muted="Run it everywhere."
          description="Start on the free plan and move to production when you are ready. No credit card required."
        >
          <template #actions>
            <Button
              kind="secondary"
              label="Start for free"
            />
          </template>
          <template #aside>
            <Button
              kind="outlined"
              label="Talk to a specialist"
            />
          </template>
        </CallToAction>
      </SectionModule>
      <SectionGap
        size="small"
        hatch
      />
    </SectionContainer>
  </BrowserFrame>
</template>
```

### LongAddress

```vue
<script setup>
  import BrowserFrame from '@aziontech/webkit/browser-frame'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <div class="mx-auto w-full max-w-(--container-md)">
    <BrowserFrame
      address="https://www.azion.com/en/documentation/products/build/applications/cache-settings/tiered-cache-configuration/"
      aria-label="Cache settings documentation in a narrow column"
    >
      <SectionContainer max-width="site">
        <SectionGap
          size="small"
          hatch
        />
        <SectionModule
          :divided="false"
          :padded="false"
        >
          <template #header>
            <SectionTitle
              kind="horizontal"
              eyebrow="Platform"
              title="Build, secure and deliver from one platform"
              description="Run your applications, protect them and cache their responses on the same distributed network."
            >
              <template #actions>
                <Button
                  kind="outlined"
                  label="See all products"
                />
              </template>
            </SectionTitle>
          </template>
          <FrameBox
            flush
            borders="y"
            marks="all"
          >
            <CardGrid
              flush
              kind="frame"
              :columns="3"
              :mobile-columns="1"
            >
              <CardGrid.Cell kind="canvas">
                <Topic
                  :heading-level="3"
                  icon="ai ai-edge-application"
                  title="Applications"
                  description="Deploy web apps and APIs close to every user, with no servers to provision."
                />
              </CardGrid.Cell>
              <CardGrid.Cell kind="canvas">
                <Topic
                  :heading-level="3"
                  icon="ai ai-edge-firewall"
                  title="Firewall"
                  description="Stop DDoS, bots and injection attacks before a request reaches your origin."
                />
              </CardGrid.Cell>
              <CardGrid.Cell kind="canvas">
                <Topic
                  :heading-level="3"
                  icon="ai ai-tiered-cache"
                  title="Tiered Cache"
                  description="Answer repeat requests from the nearest location and offload your origin."
                />
              </CardGrid.Cell>
            </CardGrid>
          </FrameBox>
        </SectionModule>
        <SectionGap
          size="small"
          hatch
        />
        <SectionModule
          :divided="false"
          :padded="false"
        >
          <CallToAction
            framed
            kind="split"
            eyebrow="Get started"
            title="Deploy your first application."
            title-muted="Run it everywhere."
            description="Start on the free plan and move to production when you are ready. No credit card required."
          >
            <template #actions>
              <Button
                kind="secondary"
                label="Start for free"
              />
            </template>
            <template #aside>
              <Button
                kind="outlined"
                label="Talk to a specialist"
              />
            </template>
          </CallToAction>
        </SectionModule>
        <SectionGap
          size="small"
          hatch
        />
      </SectionContainer>
    </BrowserFrame>
  </div>
</template>
```
