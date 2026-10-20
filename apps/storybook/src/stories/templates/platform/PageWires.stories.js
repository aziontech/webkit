import CardBox from '@aziontech/webkit/card-box'
import Item from '@aziontech/webkit/item'
import Skeleton from '@aziontech/webkit/skeleton'

import { each } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const text = (value) => `'${value.replaceAll("'", "\\'")}'`

const literal = (value) => {
  if (Array.isArray(value)) return `[${value.map(literal).join(', ')}]`
  if (typeof value === 'string') return text(value)
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(([key, entry]) => `${key}: ${literal(entry)}`)
    return `{ ${entries.join(', ')} }`
  }
  return String(value)
}

const declare = (name, items) =>
  items.every((item) => typeof item !== 'object')
    ? `const ${name} = ${literal(items)}`
    : `const ${name} = [\n${items.map((item) => `  ${literal(item)}`).join(',\n')}\n]`

const components = {
  CardBox,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  Skeleton
}

const CARD_IMPORT = "import CardBox from '@aziontech/webkit/card-box'"
const ITEM_IMPORT = "import Item from '@aziontech/webkit/item'"
const SKELETON_IMPORT = "import Skeleton from '@aziontech/webkit/skeleton'"

const PANELS = [
  { marked: true, wide: false },
  { marked: false, wide: false },
  { marked: false, wide: false },
  { marked: true, wide: true }
]

const panel = (entry) => `<div
  class="flex min-w-0 flex-col gap-(--spacing-xs)${entry.wide ? ' sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''}"
>
  <div class="flex min-h-(--size-6) items-center gap-(--spacing-xs) px-(--spacing-md)">
    <Skeleton width="5rem" height="0.875rem" />
  </div>
  <Item.List>
    <Item v-for="row in 3" :key="row" role="listitem" size="small">
      <Item.Content>
        <div class="flex min-h-5 items-center${entry.marked ? ' pl-(--spacing-lg)' : ''}">
          <Skeleton :width="row % 2 ? '55%' : '42%'" height="0.875rem" />
        </div>
      </Item.Content>
    </Item>
  </Item.List>
</div>`

const OVERVIEW_TEMPLATE = `<main class="layout-column layout-boundary flex min-h-screen flex-col">
  <div class="flex flex-col gap-(--layout-boundary-start)" aria-hidden="true">
    <div class="flex items-center">
      <Skeleton width="12rem" height="1.5rem" />
    </div>

    <div
      class="flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
    >
      <div class="grid min-w-0 xl:flex-1">
        <CardBox :padded="false">
          <template #content>
            <div class="grid grow grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <div
                v-for="metric in 4"
                :key="metric"
                class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) border-(--border-default) p-(--spacing-md) max-sm:nth-[n+2]:border-t sm:max-xl:[&:nth-child(n+3)]:border-t sm:[&:nth-child(even)]:border-l xl:[&:nth-child(n+2)]:border-l"
              >
                <Skeleton width="60%" height="0.875rem" />
                <div class="flex items-center justify-between gap-(--spacing-sm)">
                  <Skeleton width="40%" height="1.75rem" />
                  <Skeleton width="3.25rem" height="1.25rem" />
                </div>
              </div>
            </div>
          </template>
        </CardBox>
      </div>

      <div class="grid w-full shrink-0 xl:w-1/3 xl:max-w-(--container-xs)">
        <CardBox :padded="false">
          <template #content>
            <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
              <div class="flex items-center [&>*+*]:-ml-2">
                <Skeleton v-for="mark in 4" :key="mark" width="2rem" height="2rem" />
              </div>
              <div class="flex flex-col gap-(--spacing-xxs)">
                <Skeleton width="70%" height="1.125rem" />
                <Skeleton height="1.0625rem" />
                <Skeleton width="55%" height="1.0625rem" />
              </div>
            </div>
          </template>
        </CardBox>
      </div>
    </div>

    <div
      class="grid grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-(--layout-section-gap)"
    >
${each(PANELS, panel, 3)}
    </div>
  </div>
</main>`

const FIRST_ACCESS_TEMPLATE = `<main class="layout-column layout-boundary flex min-h-screen flex-col">
  <div
    class="flex flex-1 flex-col justify-center gap-(--layout-section-gap) py-(--spacing-xl)"
    aria-hidden="true"
  >
    <div class="flex flex-col items-center gap-(--spacing-lg)">
      <Skeleton width="19rem" height="2.375rem" />
      <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
        <Skeleton height="2.5rem" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3">
      <CardBox v-for="door in 3" :key="door" :padded="false">
        <template #content>
          <div class="flex h-full flex-col p-(--spacing-sm)">
            <div
              class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <Skeleton width="10.625rem" height="8rem" />
            </div>
            <div class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)">
              <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                <Skeleton width="55%" height="1.25rem" />
                <Skeleton height="1.25rem" />
                <Skeleton width="70%" height="1.25rem" />
              </div>
              <div class="flex items-center">
                <Skeleton width="8rem" height="2.5rem" />
              </div>
            </div>
          </div>
        </template>
      </CardBox>
    </div>
  </div>
</main>`

const NAV_GROUPS = [
  { label: false, items: ['40%', '52%', '58%', '56%'] },
  { label: true, items: ['62%', '46%', '48%', '54%', '66%'] },
  { label: true, items: ['64%', '58%'] },
  { label: true, items: ['42%', '50%', '54%', '72%', '60%'] }
]

const TABLE_CELLS = ['18%', '15%', '9%', '17%', '11%', '8%']

const SESSION_IMPORTS = [
  CARD_IMPORT,
  SKELETON_IMPORT,
  '',
  declare('navGroups', NAV_GROUPS),
  '',
  declare('tableCells', TABLE_CELLS)
]

const SESSION_TEMPLATE = `<div
  role="status"
  aria-live="polite"
  aria-busy="true"
  class="animate-fade-in motion-reduce:animate-none flex h-screen flex-col overflow-hidden bg-(--bg-canvas)"
>
  <span class="sr-only">Session expired. Signing you out.</span>

  <div
    class="flex h-14 shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) px-(--spacing-md)"
  >
    <Skeleton width="1.25rem" height="1.25rem" />
    <Skeleton width="5rem" height="0.875rem" />
    <Skeleton width="4.5rem" height="0.875rem" />
    <span class="hidden md:block">
      <Skeleton width="6rem" height="0.875rem" />
    </span>
    <span class="hidden lg:block">
      <Skeleton width="8rem" height="0.875rem" />
    </span>
    <div class="ml-auto flex items-center gap-(--spacing-xs)">
      <Skeleton width="5.5rem" height="2rem" />
      <span class="hidden md:block">
        <Skeleton width="4.5rem" height="2rem" />
      </span>
      <Skeleton kind="circle" width="2rem" height="2rem" />
    </div>
  </div>

  <div class="flex min-h-0 flex-1">
    <div
      class="hidden w-(--container-3xs) shrink-0 flex-col gap-(--spacing-lg) overflow-hidden border-r-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm) md:flex"
    >
      <Skeleton height="2.5rem" />
      <div v-for="(group, index) in navGroups" :key="index" class="flex flex-col gap-(--spacing-md)">
        <Skeleton v-if="group.label" width="30%" height="0.5rem" />
        <Skeleton v-for="(item, position) in group.items" :key="position" :width="item" height="0.875rem" />
      </div>
      <div class="mt-auto flex items-center gap-(--spacing-xs)">
        <Skeleton width="1.5rem" height="1.5rem" />
        <Skeleton width="50%" height="0.75rem" />
      </div>
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="layout-boundary min-h-0 flex-1 overflow-hidden">
        <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
          <div class="flex items-center gap-(--spacing-sm)">
            <Skeleton width="2.5rem" height="2.5rem" />
            <div class="grow">
              <Skeleton height="2.5rem" />
            </div>
            <Skeleton width="10rem" height="2.5rem" />
          </div>

          <CardBox :padded="false">
            <template #content>
              <div
                class="flex items-center gap-(--spacing-md) border-b-(length:--border-width-default) border-(--border-default) px-(--spacing-md) py-(--spacing-md)"
              >
                <Skeleton v-for="(cell, index) in tableCells" :key="index" :width="cell" height="0.75rem" />
              </div>
              <div
                v-for="row in 8"
                :key="row"
                class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md)"
              >
                <Skeleton v-for="(cell, index) in tableCells" :key="index" :width="cell" height="0.875rem" />
              </div>
              <div
                class="flex items-center justify-between gap-(--spacing-md) border-t-(length:--border-width-default) border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <Skeleton width="11rem" height="0.75rem" />
                <div class="flex items-center gap-(--spacing-xs)">
                  <Skeleton v-for="index in 4" :key="index" width="2rem" height="2rem" />
                </div>
              </div>
            </template>
          </CardBox>
        </div>
      </div>
    </div>
  </div>
</div>`

const meta = {
  title: 'Templates/Platform/States/PageWires',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The skeleton wires the console paints while a page is still arriving: the Home overview, the first-access Home, and the whole shell while an expired session signs out. Each one is the real page’s grid drawn with Skeleton bands inside the same CardBox frames, so nothing shifts when the content lands. Built from Skeleton, CardBox and Item.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Overview = {
  render: () => ({ components, template: OVERVIEW_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Home dashboard wire: a heading band, the four-cell metrics strip beside the agent onboarding card, then the five-column panel grid with the recent panel spanning two.'
      },
      source: { code: toSfc([CARD_IMPORT, ITEM_IMPORT, SKELETON_IMPORT], OVERVIEW_TEMPLATE) }
    }
  }
}

export const FirstAccess = {
  render: () => ({ components, template: FIRST_ACCESS_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The first-access Home wire: the headline and prompt bands over three door cards, each holding its illustration stage, three text lines and an action.'
      },
      source: { code: toSfc([CARD_IMPORT, SKELETON_IMPORT], FIRST_ACCESS_TEMPLATE) }
    }
  }
}

export const Session = {
  render: () => ({
    components,
    setup: () => ({ navGroups: NAV_GROUPS, tableCells: TABLE_CELLS }),
    template: SESSION_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The whole console as a wire while a session expires: header bar, navigation rail with its grouped items, the list controls row and a table card with header, eight rows and pagination.'
      },
      source: { code: toSfc(SESSION_IMPORTS, SESSION_TEMPLATE) }
    }
  }
}
