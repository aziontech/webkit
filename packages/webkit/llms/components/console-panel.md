# Console Panel

> A full-width framed panel that presents a product scene (a console mock or a diagram) under a section title, on a texture, with optional tabs that each play one beat of the scene. The scene is a slot: the page passes a `ProductWidget` or a diagram and reads the selected tab from the slot scope. In `console` kind the scene keeps a 1.9:1 aspect and can be cropped and faded at the bottom. From the design sample's site `ConsolePanel`.

- Import: `import ConsolePanel from '@aziontech/webkit/console-panel'`
- Category: sections · Surface: site · Structure: monolithic
- API as JSON: [console-panel.json](https://github.com/aziontech/webkit/blob/main/.specs/console-panel.json)

## When to use

- Use ConsolePanel for a marketing band that plays a product scene under a section title.
- Showing the product itself on a landing page.
- A tour of three or four views of one screen.

## Do

- Two to four tabs, each a different view, labelled with one word.
- Crop the scene only to remove empty space at its bottom (0.1–0.3).

## Don’t

- For a screenshot with copy beside it — use `MediaSplitBand`.
- For code — use `MediaSplitBand` with `codeTabs`, or `CliTerminal`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- ProductWidget` — the console scenes it frames.
- ToggleGroup` — the tab control.
- TextureMaterial`, `FrameBox`, `SectionTitle`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'console' \| 'diagram'` | `'console'` | false | What the panel frames: `console` crops and fades a console mock at a fixed aspect, `diagram` lets a scene keep its own height. |
| `titleKind` | `SectionTitleKind` | `'centered'` | false | Layout of the headline block. |
| `titlePadding` | `SectionTitlePadding` | `'medium'` | false | Vertical padding of the headline block. |
| `size` | `SectionTitleSize` | `'medium'` | false | Step of the headline on the heading scale. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `eyebrow` | `string` | `''` | false | Overline above the title. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2`. |
| `description` | `string` | `''` | false | One or two sentences under the headline. |
| `texture` | `TextureMaterialKind` | `'pixelate'` | false | Texture the panel is grounded with. |
| `textureFade` | `TextureMaterialFade` | `'top'` | false | Axis the texture fades out along. |
| `tabs` | `ConsolePanelTab[]` | `[]` | false | Tabs over the frame, each `{ value, title }`; each plays its own beat of the scene. |
| `tabsAriaLabel` | `string` | `''` | false | Accessible name of the tab control; empty uses the built-in "Console views". |
| `crop` | `number` | `0` | false | Share of the scene height clipped off its bottom, from 0 to 0.5, from the medium breakpoint up. |
| `primaryAction` | `ConsolePanelAction` | `undefined` | false | First button under the headline, `secondary`; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `ConsolePanelAction` | `undefined` | false | Second button under the headline, `outlined`; same shape. Shown only with a label and a link. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `scene` | { tab: string | undefined }` \| The scene the band presents; `tab` is the selected tab value (undefined without tabs). |

## States

- `data-kind` mirrors `kind`.
- The first tab is selected on render.
- `--mockup-fade-start` / `--mockup-fade-end` are set for a `ProductWidget` scene when cropped.

## Accessibility

- A `section` named by its title.
- Tabs are a `ToggleGroup` (radio group) named by `tabsAriaLabel` or "Console views"; arrow keys move between them.
- The scene supplies its own accessible content (a mock is usually `aria-hidden` with a description in the copy).

## Right-to-left

- Layout: logical utilities only (`ps-*`, `border-e`, `ms-*`).
- Icons: none mirrored.
- Keyboard: unchanged.

## Internationalization

| Key                  | English source  | Override prop   |
| -------------------- | --------------- | --------------- |
| `consolePanel.views` | `Console views` | `tabsAriaLabel` |

- Every other string is marketing copy passed through props.

## Responsive

- Below medium the console scene is square and uncropped; from medium it is 1.9:1 with the crop applied.
- No horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import ConsolePanel from '@aziontech/webkit/console-panel'
  import ProductWidget from '@aziontech/webkit/product-widget'

  const tabs = [
    { value: 'workloads-list', title: 'Workloads' },
    { value: 'workload-deployments', title: 'Deployments' },
    { value: 'workload-deploy-logs', title: 'Logs' }
  ]
</script>

<template>
  <ConsolePanel
    eyebrow="Console"
    title="One console for every workload"
    description="Deploy, observe and secure from the same place."
    :tabs="tabs"
    :crop="0.2"
  >
    <template #scene="{ tab }">
      <ProductWidget :name="tab ?? 'workloads-list'" />
    </template>
  </ConsolePanel>
</template>
```

### Diagram

```vue
<script setup>
  import ConsolePanel from '@aziontech/webkit/console-panel'
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <ConsolePanel
    kind="diagram"
    title="Requests take the shortest path"
    :primary-action="{ label: 'See the network', href: '/network', trailing: true }"
  >
    <template #scene>
      <Illustration
        name="global-network"
        aria-label="Requests routed to the nearest location"
        class="max-w-(--container-lg)"
      />
    </template>
  </ConsolePanel>
</template>
```
