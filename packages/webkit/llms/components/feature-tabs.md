# Feature Tabs

> The feature walkthrough band of a product page: a horizontal section title, with its button beside the headline, over up to three tabs on one side and the active tab's media on the other. A tab's media is its own code file (a `code-block` with line numbers whose lines rise in while the tab is open, on a pixelate texture in a taller stage), the band's live scene (handed the open tab's `value`), or the tab's illustration. It is a page section — the site places it from a `{ _id: 'feature-tabs', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `media-tabs`, `code-block`, `illustration`, `button`, `link` and the webkit scene assets. The tabs advance on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion; that state is owned by `media-tabs`.

- Import: `import FeatureTabs from '@aziontech/webkit/feature-tabs'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [feature-tabs.json](https://github.com/aziontech/webkit/blob/main/.specs/feature-tabs.json)

## When to use

- Use FeatureTabs for up to three tabs beside a media on a product page.
- To walk through the two or three features behind one claim, one picture at a time, like Functions' Observability.

## Do

- Keep to three tabs; tabs past the limit are not rendered.
- Give every tab an `illustrationLabel` saying what its picture shows.
- Use tab `code` when the feature is an API a developer reads; keep each file short enough to read in the stage. Set `copyAriaLabel` to say what the copy button copies.
- Use the band `scene` when one console widget plays a different beat per tab (`{ component: 'ProductWidget', props: { name: 'functions-start' } }` with tab `value`s naming its tabs); give every tab a `value` then.

## Don’t

- For architectures drawn as diagrams across the full width → use `architecture-tabs`.
- For a scroll-driven walkthrough of more features → use `feature-scroll`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-tabs](media-tabs.md) — the timed tabs this section renders through.
- [illustration](illustration.md) — the picture a tab shows when it has no code and the band has no scene.
- [code-block](code-block.md) — the code file a tab opens as its media.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `tabs` | `FeatureTabsTab[]` | `[]` | false | The features, in order, at most three; each is `{ title, description, value?, code?, illustration?, illustrationLabel? }` where `value` is the stable key handed to the band scene as its `tab`, `code` is the `{ label, value, code, language?, fileName?, fileIcon? }` file the tab opens as its media, `illustration` is a registry name drawn when the tab has no code and the band no scene, and `illustrationLabel` its accessible name. |
| `scene` | `FeatureTabsScene` | `undefined` | false | Live scene drawn as the media of every tab without code, `{ component, props? }` naming a webkit scene asset; it receives the tab's `value` as `tab` and whether the tab is open as `active`. Wins over the illustrations. |
| `autoplay` | `boolean` | `true` | false | Opens the next tab on a timer, with the composed tabs' visible pause control. |
| `autoplayInterval` | `number` | `5200` | false | Milliseconds each tab holds before the next one opens. |
| `copyAriaLabel` | `string` | `''` | false | Accessible name of the copy button on each tab's code file; empty keeps the code block's own. |
| `primaryAction` | `FeatureTabsAction` | `undefined` | false | Button in the section title, beside the headline (under the frame when the band has no title); `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.

## States

- Visual states: `default`; the active tab, its progress and the timer are owned by `media-tabs`
- Empty: when `tabs` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the action renders only when `primaryAction` is set — as a secondary `button` in the header, or as a `link` under the frame when there is no header
- Media per tab: its `code` wins, then the band `scene`, then its `illustration`; when any tab carries `code` the stage grows from 24rem to 30rem and draws the pixelate texture, and an open tab's code lines rise in (owned by `code-block`, never under reduced motion). A scene name that is not registered draws nothing.

## Accessibility

- Visible focus: owned by `media-tabs` (the tabs), `code-block` (the copy button), `button` and `link`.
- Keyboard map: `Tab` reaches the action, the tabs and the open file's copy button; the tabs' keys are owned by `media-tabs`.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; each illustration is named by its tab's `illustrationLabel`, or decorative when empty; a code file is real text a screen reader reads, with a named copy button.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-tabs`, `code-block`, `button` and `link`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the timer never runs under reduced motion (owned by `media-tabs`).
- Touch target ≥40×40 px: the tab rows and the large header button; the under-frame link is supplementary to them.

## Examples

### Default

```vue
<script setup>
  import FeatureTabs from '@aziontech/webkit/feature-tabs'

  const tabs = [
    {
      title: 'Trace',
      description:
        'The run as a waterfall: each step placed against the invocation it belongs to, nested where it nested.',
      illustration: 'live-debugging',
      illustrationLabel: 'A trace waterfall of one invocation'
    },
    {
      title: 'Logs',
      description:
        'Structured output on the same clock as the trace, filtered by level, searchable in place.',
      illustration: 'traffic-and-cost-bar-chart',
      illustrationLabel: 'Structured logs filtered by level'
    },
    {
      title: 'Request path',
      description:
        'The workload, application, function and connector it travelled, each captioned with the time spent there.',
      illustration: 'distributed-apis',
      illustrationLabel: 'The path a request took through the platform'
    }
  ]

  const primaryAction = {
    label: 'Open an invocation',
    href: '/product-preview',
    trailing: true
  }
</script>

<template>
  <FeatureTabs
    eyebrow="Observability"
    title="Inspect every run end-to-end"
    description="Every invocation of a function is traced on the platform itself — spans, logs and the path the request took. Nothing to configure, no storage to attach. Pick a document to open it."
    :tabs="tabs"
    :primary-action="primaryAction"
  />
</template>
```

### Code

```vue
<script setup>
  import FeatureTabs from '@aziontech/webkit/feature-tabs'

  const file = (value, fileName, code) => ({
    label: fileName,
    value,
    language: 'javascript',
    code,
    fileName,
    fileIcon: 'ai-cor ai-js'
  })

  const tabs = [
    {
      value: 'config',
      title: 'Declare the workload in code',
      description:
        'The hostname, the build preset and the routing live in the repository, so shipping a change is a commit rather than a console session.',
      code: file(
        'config',
        'azion.config.js',
        `export default {
  build: { preset: 'vue' },
  rules: {
    request: [
      {
        name: 'Deliver Static Assets',
        match: '.(css|js|svg|png|webp|woff2)$',
        behavior: {
          setOrigin: { name: 'origin-storage-default' },
          deliver: true
        }
      }
    ]
  }
}`
      )
    },
    {
      value: 'handler',
      title: 'Answer the request yourself',
      description:
        'Return a response from the handler when a route needs logic — an auth check, a redirect, a shaped payload — instead of sending it to the origin.',
      code: file(
        'handler',
        'main.js',
        `export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/api/status') {
      return Response.json({ region: 'edge', ok: true })
    }

    return fetch(request)
  }
}`
      )
    },
    {
      value: 'storage',
      title: 'Serve objects from storage',
      description:
        'Bind a bucket to the workload and let it answer with the object directly, with no server in front of it and no egress charge behind it.',
      code: file(
        'storage',
        'assets.js',
        `export default {
  async fetch(request) {
    const url = new URL(request.url)
    const asset = await fetch(new URL(url.pathname, 'file://site-assets/'))

    return new Response(asset.body, {
      headers: { 'cache-control': 'public, max-age=86400' }
    })
  }
}`
      )
    }
  ]
</script>

<template>
  <FeatureTabs
    title="From a hostname to a full stack, on one platform"
    description="Storage, a database, a firewall and a cache policy all bind to the same workload. Each one is a binding, not another deployment to run."
    copy-aria-label="Copy the workload sample"
    :tabs="tabs"
    :primary-action="{ label: 'Docs', href: '/docs', trailing: true }"
  />
</template>
```

### Live scene

```vue
<script setup>
  import FeatureTabs from '@aziontech/webkit/feature-tabs'

  const tabs = [
    {
      value: 'agents',
      title: 'Ask your coding agent',
      description:
        'Describe the function and let the agent write it, run it locally and deploy it from the editor you already use.'
    },
    {
      value: 'console',
      title: 'Start from the console',
      description:
        'Pick a template, edit the code in the browser and publish it without installing anything.'
    },
    {
      value: 'cli',
      title: 'Ship from the terminal',
      description:
        'Link a project, build it on your machine and deploy it with one command that hands back the domain.'
    }
  ]
</script>

<template>
  <FeatureTabs
    eyebrow="Functions"
    title="Three ways to ship your first function"
    description="The same function, written and deployed from wherever you already work."
    :tabs="tabs"
    :scene="{ component: 'ProductWidget', props: { name: 'functions-start' } }"
    :autoplay-interval="6000"
  />
</template>
```
