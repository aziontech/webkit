# Error Boundary

> Guards one region of a page. When a component inside the region throws while it renders, sets up or runs a lifecycle hook, the boundary catches the error, reports it through its `error` event, and puts a recoverable message in the region's place: a danger `Alert` that says the section failed and offers **Try again**, which mounts the region again. The rest of the page keeps working. A `fallback` slot replaces the built-in message when the region needs a different shape (a card-sized `EmptyState`, for example).

- Import: `import ErrorBoundary from '@aziontech/webkit/error-boundary'`
- Category: feedback · Surface: product · Structure: monolithic
- API as JSON: [error-boundary.json](https://github.com/aziontech/webkit/blob/main/.specs/error-boundary.json)

## When to use

- A dashboard card, a side panel, a tab body or any region whose failure should not take the whole page down.
- A region that renders data you do not control (a third-party widget, a chart fed by a remote response, a plugin).
- Around each route's content inside the app shell, so a failing page leaves the navigation usable (pass the route path as `resetKey`).
- When the app reports render errors to a monitoring service: the `error` event carries the error and where it was thrown.

## Do

- Wrap regions, not the whole app. One boundary per card, panel or route body keeps the blast radius small.
- Report every error: listen to `error` and send it to your monitoring service. The boundary stops the error from reaching the app error handler unless `propagate` is set.
- Make Retry mean something. Listen to `retry` and reset the state that broke the region (refetch, clear the bad value) before it mounts again; a retry that renders the same bad data fails again.
- Pass `resetKey` when the region shows different content for different keys (route path, record id), so moving on from a failed record clears the fallback.
- Keep the fallback the size of the region. In a card, use a small `EmptyState`; in a page body, the built-in `Alert` is right.

## Don’t

- A request that failed (a fetch, a mutation): that is data state, not a render error. Show it in the region with an `alert` and a Retry, as `platform/states/form-error` and `skills/webkit-ui-states` describe.
- A whole page that cannot be shown (missing route, no access, server failure) → use the `platform/states/not-found` block.
- A field that failed validation → use `field` with its error message.
- Errors thrown in click or submit handlers you can catch yourself: catch them where you call the action and show the outcome with `toast` or `alert`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [alert](alert.md) — the built-in fallback; also what a failed request shows inside a region that rendered fine.
- [empty-state](empty-state.md) — a common custom fallback for a card-sized region.
- [skeleton](skeleton.md) — what the region shows while it loads; the boundary only covers the failed case.
- [toast](toast.md) — reports the outcome of an action; never use it for a region that failed to render.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Heading of the built-in fallback. Empty uses the locale catalog (`This section failed to load`). |
| `description` | `string` | `''` | false | Sentence under the heading of the built-in fallback. Empty uses the locale catalog. |
| `retryLabel` | `string` | `''` | false | Label of the built-in Retry action. Empty uses the locale catalog (`Try again`). |
| `resetKey` | `string \| number` | `undefined` | false | When this value changes while the fallback shows, the region is mounted again (pass the route path or the record id). |
| `propagate` | `boolean` | `false` | false | When true, the error keeps travelling to the parent boundaries and the app error handler after this boundary handles it. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `error` | `ErrorBoundaryErrorEvent` | Fires once per failure with `{ error, info }`: what was thrown and Vue's description of where. Report it from here. |
| `retry` | `void` | Fires when the region is mounted again (Retry, the slot's `retry`, or a `resetKey` change). Reset the broken state here. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The region the boundary guards. Mounted again, from scratch, on every retry. |
| `fallback` | { error: unknown, retry: () => void } | Replaces the built-in `Alert` while the region is failed. Call `retry` to mount it again. |

## States

- Visual states: `default` (the region renders), `error` (the fallback renders in its place)
- `data-error` on the root is present while the fallback shows
- A second error captured while the fallback already shows (a failing custom fallback) is not handled again: it travels to the parent, so a broken fallback can never loop.
- What the boundary catches is what Vue's `onErrorCaptured` catches from descendant components: errors in render, setup, watchers, lifecycle hooks and component event handlers. Errors thrown directly in the slot's own markup belong to the component that owns the markup, and errors in native DOM listeners or promises outside Vue are not caught.

## Accessibility

- Visible focus: the root is focusable only by script (`tabindex="-1"`, `outline-none`) and never in the tab order; the Retry button carries the `Button` focus ring.
- Keyboard map: `Tab` reaches the Retry action in the fallback; `Enter` / `Space` runs it. No key handling of its own.
- Focus: when the region fails while focus was inside it (or had fallen to the document body), focus moves to the fallback `Alert`, which is announced. After a retry from inside the boundary, focus moves to the boundary's root so it is not lost to the body.
- ARIA: the built-in fallback is an `Alert` with `role="alert"` (danger), so the failure is announced once when it appears. A custom fallback is responsible for its own announcement (`EmptyState` is `role="status"`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): inherited from the `alert` danger tokens.
- No motion.
- Touch target ≥40×40 px: the Retry action is a `Button`.

## Right-to-left

- Layout: the boundary adds no layout; the `Alert` uses logical utilities and puts the action at the inline end.
- Icons: the danger glyph is not mirrored.
- Keyboard: no arrow-key navigation.
- User data: the error message is never rendered by the built-in fallback; none.

## Internationalization

| Key                         | English source                                                                              | Override prop |
| --------------------------- | ------------------------------------------------------------------------------------------- | ------------- |
| `errorBoundary.title`       | This section failed to load                                                                 | `title`       |
| `errorBoundary.description` | Something went wrong while showing this part of the page. The rest of the page still works. | `description` |
| `errorBoundary.retry`       | Try again                                                                                   | `retryLabel`  |

- Formatting: none.

## Responsive

- Container queries: none of its own; the `Alert` is `@container/alert` and moves its action under the copy in a narrow region.
- Narrow (≤ 640 px or a narrow container): the action wraps under the text (from `alert`).
- Touch: the Retry button is 40 px; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ErrorBoundary from '@aziontech/webkit/error-boundary'
  import { ref } from 'vue'

  const items = [
    { id: 'web-app-prod', name: 'web-app-prod', value: 11420000 },
    { id: 'payments-api', name: 'payments-api', value: 6240000 },
    { id: 'storefront-checkout', name: 'storefront-checkout', value: 4910000 }
  ]

  const broken = ref(false)
  const reported = ref('')

  const format = (value) =>
    new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

  const failingFormat = () => {
    throw new Error('The response held a value the list could not read.')
  }

  const report = ({ error }) => {
    reported.value = error instanceof Error ? error.message : String(error)
  }

  const recover = () => {
    broken.value = false
    reported.value = ''
  }
</script>

<template>
  <div class="flex w-full max-w-[512px] flex-col gap-(--spacing-sm)">
    <Card title="Top services">
      <template #content>
        <ErrorBoundary
          @error="report"
          @retry="recover"
        >
          <BarList
            :items="items"
            :format-value="broken ? failingFormat : format"
            aria-label="Top services by requests"
          />
        </ErrorBoundary>
      </template>
    </Card>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Button
        label="Simulate a failure"
        kind="outlined"
        size="medium"
        :disabled="broken"
        @click="broken = true"
      />
      <p
        v-if="reported"
        class="m-0 text-body-sm text-(--text-muted)"
      >
        Reported: {{ reported }}
      </p>
    </div>
  </div>
</template>
```

### Custom fallback

```vue
<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import ErrorBoundary from '@aziontech/webkit/error-boundary'
  import { ref } from 'vue'

  const items = [
    { id: 'south-america', name: 'South America', value: 9820000 },
    { id: 'north-america', name: 'North America', value: 7410000 },
    { id: 'europe', name: 'Europe', value: 4960000 }
  ]

  const broken = ref(false)

  const format = (value) =>
    new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

  const failingFormat = () => {
    throw new Error('Unreadable value.')
  }
</script>

<template>
  <div class="flex w-full max-w-[512px] flex-col gap-(--spacing-sm)">
    <Card title="Requests by region">
      <template #content>
        <ErrorBoundary @retry="broken = false">
          <BarList
            :items="items"
            :format-value="broken ? failingFormat : format"
            aria-label="Requests by region"
          />
          <template #fallback="{ retry }">
            <EmptyState
              title="This chart failed to load"
              description="The rest of the dashboard still works."
              icon="pi pi-exclamation-triangle"
              size="small"
            >
              <template #actions>
                <Button
                  label="Try again"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-refresh"
                  @click="retry"
                />
              </template>
            </EmptyState>
          </template>
        </ErrorBoundary>
      </template>
    </Card>
    <Button
      label="Simulate a failure"
      kind="outlined"
      size="medium"
      class="self-start"
      :disabled="broken"
      @click="broken = true"
    />
  </div>
</template>
```
