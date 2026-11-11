# PageWires (`platform/states/page-wires`)

> The skeleton wires an app paints while a page is still arriving: the Home overview (HomeWire), the first-access Home (HomeFirstUseWire), and the whole shell while an expired session signs out (SessionWire), which draws one of four bodies by the family of the page it covers: list, detail, create form or Home. Each one is the real page’s grid drawn with Skeleton bands inside the same Card frames, so nothing shifts when the content lands. In the app the session wire is a fixed full-viewport layer sized to the measured header and rail; here it fills the canvas at the header’s 56px and the rail’s `--container-2xs`. Built from Skeleton, Card and Item.

- Surface: product
- Source: `blocks/platform/states/page-wires/page-wires.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/states/page-wires")`
- Components: [Card](../../../components/card.md), [Item](../../../components/item.md), [Skeleton](../../../components/skeleton.md)
- Skills: `webkit-ui-states`

## Asked as

page skeleton; loading skeleton; skeleton screen; page loading state; wireframe loading; session expired; carregando; esqueleto de carregamento; tela de carregamento

The skeleton wires an app paints while a page is still arriving. The user's job does not change while they wait: they need to see the shape of the page they asked for, so the wire draws the real page's grid with `Skeleton` bands inside the same `Card` frames, and nothing shifts when the content lands. The set covers the Home overview, the first-access Home, and the whole shell while an expired session signs out, drawn over the family of page it covers (list, detail, create form or Home).

## When to use

- The first paint of a page whose data is still loading, when the layout is known.
- Home, before its metrics and recent activity arrive (Overview), or before the first project (Onboarding).
- Over the whole app while an expired session signs out (the Session wires), so the user sees the page dissolve into its frame instead of a blank screen.

## When not to use

- A single control or panel loading inside a ready page: use `Skeleton` or `Spinner` inside that panel only.
- A form whose options are loading: use the Loading state of `platform/states/form-validation`.
- A dashboard's own loading: use the Loading variant of that dashboard block (for example `platform/dashboard/analytics-dashboard`).
- A long upload or build: use `platform/states/project-intake` or `platform/states/async-submit`, which report progress.
- After the sign-out completes: `platform/auth` (SessionExpired).

## Building blocks

### A. Bands — `Skeleton` (required)

Every text line, number, chip and avatar is a band sized like the content it stands for: a heading band, label and value bands per metric, a delta chip, `kind="shape"` circles for avatar stacks. Vary the widths row to row so the wire reads as text, not a grid of bars.

### B. Frames — `Card` (required)

The same `Card` frames, with the same `:padded="false"` and inner padding as the real page, so the borders are already where the content will be. The metrics strip keeps its responsive dividers (one, two or four columns).

### C. Lists — `Item` (required)

Panels of rows use `Item.List` with `Item size="small"` and `Item.Content`, the same row height the real list renders, with a band per row.

## Do

- Draw the exact grid of the page that is coming: same columns, gaps and breakpoints.
- Use the real layout utilities (`layout-column`, `layout-boundary`, `--layout-section-gap`), not fixed sizes.
- Hide the bands from assistive technology and announce the wait once: `role="status"`, `aria-live="polite"`, `aria-busy="true"`, with a short screen-reader text on every wire.
- Size the session wire to the measured header and rail in the app, so the frame does not move when it appears.
- Fade the session wire in with `motion-reduce:animate-none`.

## Don't

- Don't show a wire for less than a perceptible moment; if the data arrives within about 300 ms, paint the page directly.
- Don't use a generic spinner for a page whose layout is known.
- Don't animate each band independently; a shimmer comes from `Skeleton`.
- Don't mix real content and bands in one card; the card swaps in whole.
- Don't let the wire collapse to a few lines on wide screens; it holds the page's full footprint.

## Copy

- **Bands:** no visible text. The wire has nothing to read.
- **Screen-reader status (session):** states what is happening, as a sentence: `Session expired. Signing you out.`
- **Screen-reader status (page):** names what is loading: `Loading the overview.` on the Overview wire, `Loading Home.` on the Onboarding wire.

## Accessibility

- The bands are decorative (`aria-hidden="true"` on the wire's body).
- The region that stands in for the page is `role="status"` with `aria-live="polite"` and `aria-busy="true"`; clear `aria-busy` when the content lands.
- The wire takes no focus and traps none; the real page receives focus as it would on a normal load.
- Respect `prefers-reduced-motion` on the entrance and on the shimmer.

## States

- Overview: the Home overview wire: heading, the four-metric strip, the side card, and the five-column row of list panels.
- Onboarding: the first-access Home wire: headline and prompt bands over three door cards, each with its illustration stage, three text lines and an action.
- Session: the whole shell as a wire over a list page: header bar, navigation rail with grouped items, the list controls row and a table card with header, eight rows and pagination.
- SessionDetail: the same over a detail page: tab bands under the header, a heading and two cards of field rows in the data column.
- SessionForm: the same over a create page: a heading and two cards of field rows in the create column, with the save bar held at the foot.
- SessionHome: the same over Home: the Overview wire centred in the data column.

## Related

- `platform/dashboard/home-dashboard` — the Home page the Overview and Onboarding wires stand in for.
- `platform/view/table-view` — the list page the Session wire draws.
- `platform/detail/details-page` — the detail page the SessionDetail wire draws.
- `platform/create/single-page-create` — the create page the SessionForm wire draws.
- `platform/auth` — where the session wire lands once the sign-out completes.
- `shells/console` — the header and rail the session wires reproduce.

## Variants

- `Overview` — primary (the code below)
- `Onboarding` — The first-access Home wire: the headline and prompt bands over three door cards, each holding its illustration stage, three text lines and an action.
- `Session` — The whole app shell as a wire while a session expires over a list page: header bar, navigation rail with its grouped items, the list controls row and a table card with header, eight rows and pagination.
- `SessionDetail` — The same wire over a detail page: a strip of tab bands under the header, then a heading and two banded cards of field rows in the data column.
- `SessionForm` — The same wire over a create page: the heading and two banded cards of field rows in the create column, with the save bar held at the foot.
- `SessionHome` — The same wire over Home: the Overview wire centred in the data column.

Each variant is the same screen in another state: `get_pattern("platform/states/page-wires", { variant })`, or the file under `blocks/platform/states/page-wires/variants/`.

## Code (`Overview`)

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'

  const panels = [1, 2, 3, 4]
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    class="layout-column layout-boundary relative flex min-h-full flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start"
  >
    <span class="sr-only">Loading the overview.</span>
    <div
      class="flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
      aria-hidden="true"
    >
      <div class="flex items-center">
        <Skeleton
          width="12rem"
          height="1.5rem"
        />
      </div>

      <div
        class="flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
      >
        <div class="flex min-w-0 xl:flex-1">
          <Card
            :padded="false"
            class="w-full"
          >
            <template #content>
              <div class="grid grow grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <div
                  v-for="metric in 4"
                  :key="metric"
                  class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) border-(--border-default) p-(--spacing-md) max-sm:nth-[n+2]:border-t sm:max-xl:[&:nth-child(n+3)]:border-t sm:[&:nth-child(even)]:border-s xl:[&:nth-child(n+2)]:border-s"
                >
                  <Skeleton
                    width="60%"
                    height="0.875rem"
                  />
                  <div class="flex items-center justify-between gap-(--spacing-sm)">
                    <Skeleton
                      width="40%"
                      height="1.75rem"
                    />
                    <Skeleton
                      width="3.25rem"
                      height="1.25rem"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)">
          <Card :padded="false">
            <template #content>
              <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                <div class="flex items-center [&>*+*]:-ms-2">
                  <Skeleton
                    v-for="mark in 4"
                    :key="mark"
                    kind="shape"
                    width="2rem"
                    height="2rem"
                  />
                </div>
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <Skeleton
                    width="70%"
                    height="1.125rem"
                  />
                  <Skeleton height="1.0625rem" />
                  <Skeleton
                    width="55%"
                    height="1.0625rem"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div
        class="grid grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:grow xl:grid-cols-5 xl:gap-(--layout-section-gap)"
      >
        <div
          v-for="panel in panels"
          :key="panel"
          class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
          :class="panel === 4 ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
        >
          <div
            class="flex min-h-(--size-6) items-center gap-(--spacing-xs) px-[calc(var(--spacing-md)+1px)]"
          >
            <span
              v-if="panel === 1 || panel === 4"
              class="shrink-0"
            />
            <Skeleton
              width="5rem"
              height="0.875rem"
            />
          </div>

          <div class="xl:min-h-0 xl:flex-1 xl:overflow-hidden">
            <Item.List>
              <Item
                v-for="row in 3"
                :key="row"
                role="listitem"
                size="small"
              >
                <Item.Content>
                  <div
                    class="flex h-(--size-5) flex-col justify-center"
                    :class="
                      panel === 1 || panel === 4 ? 'ps-[calc(var(--size-4)+var(--spacing-xs))]' : ''
                    "
                  >
                    <Skeleton
                      :width="row % 2 ? '55%' : '42%'"
                      height="0.875rem"
                    />
                  </div>
                </Item.Content>
              </Item>
            </Item.List>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```
