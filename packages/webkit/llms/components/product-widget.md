# Product Widget

> Draws one of the **official console widgets**: a scaled, inert mock of an Azion Console screen or fragment, built from real webkit components inside a `shell-mockup` frame, that marketing bands use to show the product. `name` selects the widget from a closed registry of 70 drawings, loaded on demand, so a page can only render mocks that already exist and the same screen is the same drawing on every page that shows it. The remaining props pass through to the widget that declares them, and a widget that does not declare one keeps its own value.

- Import: `import ProductWidget from '@aziontech/webkit/product-widget'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [product-widget.json](https://github.com/aziontech/webkit/blob/main/.specs/product-widget.json)

## When to use

- A product band (hero, media split, feature tab, widget grid cell) needs to show a console screen or a fragment of one.
- The same console screen appears on more than one page and must be the same drawing on each.
- Several widgets share one slot (tabs), and only the one showing should play: drive `active` from the host.
- A grid cell plays its fragment's beat while the pointer is over it: drive `hover` from the host.

## Do

- Give the host a size (a height or an aspect ratio). A widget fills its host and scales its design width to fit.
- Host a framed widget (a full screen) in a wide panel, and a fragment in a grid cell with its own padding. Fragments are drawn bare and float on the cell's surface, so set `--mockup-fade-color` on the cell when it is not `--bg-canvas`. The cell clips on both axes (`overflow-clip`, as a media split's media cell does): a fragment's collaborator cursor and shadows float onto the cell's padding, and at a large root font size (200% zoom) its mock text outgrows the drawing; clipping them at the cell's border keeps the page from scrolling sideways. Never frame a fragment with `overflow-x-visible`.
- Leave `kind`, `chrome`, `width`, `tab` and `interval` unset unless the host needs a different value: unset keeps the widget's own.
- Never expect a fragment to become a console window. `kind`, `chrome`, `width` and `fade` re-plate only the workload screens listed under Props; a fragment is drawn bare at its own design width and ignores them, and the root warns in development when one is set on a widget that does not read it. For a framed console window pick a workload screen; for a fragment, give its host cell the padding and surface (a media split's inset media cell does).
- Turn `cursor` off when the widget stands for a screen the reader uses alone. Fragments act their beat with a named collaborator cursor; that is right in a feature grid that plays on hover, and a fake second person in a product band that reads as a screenshot.
- Keep the copy beside the widget saying what it shows. Every widget but `function-code` and the coding-agent switch of `functions-start` is hidden from assistive technology.

## Don’t

- The screen you need is not in the registry → compose it with `shell-mockup` and its parts, then add it to the registry. Do not approximate it at the call site.
- A live, working screen at a device size → use `browser-frame`.
- A static product concept drawing → use `illustration`.
- A screenshot or clip in documentation → use `doc-frame`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [shell-mockup](shell-mockup.md) — the frame every widget is drawn in; reach for it directly to compose a new screen.
- [illustration](illustration.md) — the same closed-registry pattern for static scenes.
- [texture-material](texture-material.md) — the texture a full-screen widget grounds itself with through `texture`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `'ai-inference-function' \| 'ai-inference-model' \| 'ai-inference-template' \| 'application-accelerator-cookie' \| 'application-accelerator-method' \| 'application-accelerator-query-string' \| 'application-cache' \| 'application-function' \| 'application-rule' \| 'application-version' \| 'applications-create-method' \| 'applications-device-group' \| 'applications-rule-phases' \| 'bot-manager-metrics' \| 'bot-manager-rule' \| 'bot-manager-traffic' \| 'cli-terminal-deploy' \| 'cli-terminal-start' \| 'data-stream-connector' \| 'data-stream-sampling' \| 'data-stream-source' \| 'ddos-firewall-modules' \| 'ddos-http-events' \| 'ddos-requests-metric' \| 'edge-dns-dnssec' \| 'edge-dns-nameserver' \| 'edge-dns-record' \| 'firewall-function' \| 'firewall-modules' \| 'firewall-rules-order' \| 'function-code' \| 'functions-start' \| 'image-processor-events' \| 'image-processor-module' \| 'image-processor-rule' \| 'kv-store-function' \| 'kv-store-key' \| 'kv-store-security-list' \| 'load-balancer-address' \| 'load-balancer-method' \| 'load-balancer-origins' \| 'network-shield-ip-list' \| 'network-shield-lists' \| 'network-shield-rule' \| 'object-storage-access' \| 'object-storage-browser' \| 'object-storage-buckets' \| 'real-time-events-filter' \| 'real-time-events-log' \| 'real-time-events-volume' \| 'real-time-metrics-dashboard' \| 'real-time-metrics-filter' \| 'real-time-metrics-panel' \| 'sql-database-query' \| 'sql-database-row' \| 'sql-database-table' \| 'waf-allowed-rule' \| 'waf-firewall-rule' \| 'waf-threat' \| 'workload-deploy' \| 'workload-deploy-logs' \| 'workload-deployments' \| 'workload-domain' \| 'workload-domains' \| 'workload-overview' \| 'workload-rollout-rows' \| 'workload-topology-chain' \| 'workload-topology' \| 'workload-topology-flow' \| 'workloads-list'` | `—` | true | Name of the console widget to draw. |
| `active` | `boolean` | `true` | false | Whether this widget is the one showing; it replays its entrance each time it becomes active. |
| `hover` | `boolean` | `false` | false | Whether the pointer is over the host; a fragment plays its beat while it is. |
| `kind` | `'window' \| 'bare'` | `undefined` | false | How a workload screen is plated (window or bare); fragments are always bare and ignore it, and unset keeps the widget's own plating. |
| `chrome` | `boolean` | `undefined` | false | Draws the console bar on a workload screen; fragments have no bar and ignore it, and unset keeps the widget's own bar. |
| `width` | `number` | `undefined` | false | Design width of a workload screen from md up; fragments keep their own width, and unset keeps the widget's own. |
| `fade` | `'none' \| 'bottom' \| 'top' \| 'left' \| 'right' \| 'y'` | `'none'` | false | Edge a workload screen, workload-overview or application-version fades out along; fragments keep their own fade. |
| `texture` | `'dots' \| 'grid' \| 'lines' \| 'dither' \| 'pixelate' \| 'none'` | `'none'` | false | Texture a full-screen widget is grounded with. |
| `tab` | `'agents' \| 'console' \| 'cli' \| 'overview' \| 'topology' \| 'deploy' \| 'main-settings' \| 'cache-settings' \| 'device-groups' \| 'functions' \| 'rules-engine'` | `undefined` | false | Tab a tabbed widget plays (`workload-overview`, `application-version`, `functions-start`); other widgets ignore it, and unset plays the first tab. |
| `cursor` | `boolean` | `true` | false | Draws the named collaborator cursor a fragment acts its beat with; turn it off for a still console picture. Widgets without a cursor ignore it. |
| `interval` | `number` | `undefined` | false | Milliseconds between revealed log lines in the deploy logs widget; unset keeps its own pace. |

## States

- Visual states: `default` only. A widget is decorative: no `hover`, `focus-visible`, `disabled` or `loading` state of its own. `hover` and `active` are triggers the host drives, not states the root renders.
- Every widget is drawn in an inert `shell-mockup`, except `function-code`, whose frame is `interactive` so the viewer can switch its file tabs and copy its code. `functions-start` draws `function-code` on its `console` tab, and on its `agents` tab a `toggle-group` above its inert frame that switches the coding agent.
- `cli-terminal-start` and `cli-terminal-deploy` play a recorded Azion CLI session (init to curl, or link and deploy); `workload-topology-flow` draws domains, a workload and its bindings joined by `flow` connectors, with the workload ringed in the primary glow.
- `data-name` mirrors `name` on the root.
- Loading: the widget's code is loaded on demand. The root keeps its size while it loads and draws nothing until the widget arrives. A `name` change clears the current widget at once, so the root never shows the earlier widget under the new `data-name`, whether the new load is still in flight or has failed.
- A `name` outside the registry (from untyped code), or a widget chunk that fails to load, warns in development only (`import.meta.env.DEV`) and leaves the root empty; it never throws.
- A plating prop the loaded widget does not read warns in development only, once per load, and changes nothing.
- `cursor` off: no collaborator cursor or name tag is drawn; the fragment's controls still open, highlight and settle on their beat.
- Each widget owns its entrance (a `shell-mockup` replay when `active` turns on) and, for fragments, its beat while `hover` is set or the device cannot hover. Under reduced motion every widget is drawn in its settled state.

## Accessibility

- Visible focus: none in an inert widget, where nothing takes focus. In `function-code` the code block's file tabs and copy button keep their own focus rings, and the coding-agent switch of `functions-start` keeps the segmented button's.
- Keyboard map: none in an inert widget. In `function-code`, `Tab` reaches the code block's file tabs and copy button, which keep their own keyboard behaviour. In `functions-start` on its `agents` tab, `Tab` reaches the coding-agent switch, which keeps the segmented button's arrow-key behaviour.
- ARIA: the root is a plain `div`; the widget inside is a `figure` with `aria-hidden="true"` and `inert` (except `function-code`), so assistive technology skips the picture. The coding-agent switch of `functions-start` sits outside that figure, named `Coding agent`. The band's own copy carries what it shows.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): widgets use the console's own text and surface pairs (`var(--text-default)` / `var(--text-muted)` on `var(--bg-canvas)` / `var(--bg-surface)`).
- Every motion class inside a widget pairs with `motion-reduce:transition-none`.
- Touch target: not applicable in an inert widget; `function-code` keeps the code block's own targets, and `functions-start` the segmented button's.
- Reflow: the workload-topology node header wraps (`flex-wrap`), so a status tag moves under the node name in a narrow frame instead of overflowing it.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: every chevron and angle inside the widget fragments mirrors (`rtl:-scale-x-100`), the pagination angles included.
- Keyboard: no horizontal arrow-key logic.
- User data: domains, IDs and code samples in the mock data keep their own direction.

## Internationalization

- No built-in strings in the root. Widget text is console UI copy drawn as part of the picture (hidden from assistive technology), and the collaborator names on the cursors are mock data.
- Formatting: none.

## Responsive

- Container queries: none; every widget scales its design width to fit its host (`shell-mockup`), with a narrower design width below `md`.
- Narrow: the host sets the size; the widget scales down with it.
- Touch: a fragment shows its finished beat on a device that cannot hover.
- Reflow: no horizontal scroll; the frame scales instead. A bare fragment's decorative overflow (cursor, mock text grown by a 200% root font) is clipped by its host cell, never by the page; the Library example's cells clip, and `src/test/reflow.test.ts` checks it on Chromium, Firefox and WebKit.

## Examples

### Default

```vue
<script setup>
  import ProductWidget from '@aziontech/webkit/product-widget'
</script>

<template>
  <div class="h-96 w-full">
    <ProductWidget name="workloads-list" />
  </div>
</template>
```

### Types

```vue
<script setup>
  import ProductWidget from '@aziontech/webkit/product-widget'
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-(--spacing-lg) md:grid-cols-2">
    <div class="h-80 w-full">
      <ProductWidget
        name="workload-topology"
        kind="window"
      />
    </div>
    <div class="h-80 w-full">
      <ProductWidget
        name="workload-topology"
        kind="bare"
      />
    </div>
  </div>
</template>
```

### Still fragment

```vue
<script setup>
  import ProductWidget from '@aziontech/webkit/product-widget'
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-(--spacing-lg) md:grid-cols-2">
    <div class="h-80 w-full p-(--spacing-xl)">
      <ProductWidget name="data-stream-source" />
    </div>
    <div class="h-80 w-full p-(--spacing-xl)">
      <ProductWidget
        name="data-stream-source"
        :cursor="false"
      />
    </div>
  </div>
</template>
```
