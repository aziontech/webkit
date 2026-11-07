import CardBox from '@aziontech/webkit/card-box'
import Item from '@aziontech/webkit/item'
import Skeleton from '@aziontech/webkit/skeleton'

import { indent } from '../../_shared/markup'
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

const panelsLine = 'const panels = [1, 2, 3, 4]'

const HOME_WIRE = `<div class="flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1" aria-hidden="true">
  <div class="flex items-center">
    <Skeleton width="12rem" height="1.5rem" />
  </div>

  <div
    class="flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
  >
    <CardBox :padded="false" class="min-w-0 xl:flex-1">
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

    <div class="w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)">
      <CardBox :padded="false">
        <template #content>
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
            <div class="flex items-center [&>*+*]:-ml-2">
              <Skeleton v-for="mark in 4" :key="mark" kind="shape" width="2rem" height="2rem" />
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
    class="grid grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:grow xl:grid-cols-5 xl:gap-(--layout-section-gap)"
  >
    <div
      v-for="panel in panels"
      :key="panel"
      class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
      :class="panel === 4 ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
    >
      <div class="flex min-h-(--size-6) items-center gap-(--spacing-xs) px-[calc(var(--spacing-md)+1px)]">
        <span v-if="panel === 1 || panel === 4" class="shrink-0" />
        <Skeleton width="5rem" height="0.875rem" />
      </div>

      <div class="xl:min-h-0 xl:flex-1 xl:overflow-hidden">
        <Item.List>
          <Item v-for="row in 3" :key="row" role="listitem" size="small">
            <Item.Content
              class="h-(--size-5) justify-center"
              :class="panel === 1 || panel === 4 ? 'pl-[calc(var(--size-4)+var(--spacing-xs))]' : ''"
            >
              <Skeleton :width="row % 2 ? '55%' : '42%'" height="0.875rem" />
            </Item.Content>
          </Item>
        </Item.List>
      </div>
    </div>
  </div>
</div>`

const OVERVIEW_TEMPLATE = `<div
  class="layout-column layout-boundary relative flex min-h-full flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start"
>
${indent(HOME_WIRE)}
</div>`

const FIRST_ACCESS_TEMPLATE = `<main class="layout-column layout-boundary relative flex min-h-full flex-col">
  <div
    class="flex min-h-full flex-col justify-center gap-(--layout-section-gap) py-(--spacing-xl)"
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
              <Skeleton width="170px" height="128px" />
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
  { id: 'top', labelled: false, items: ['40%', '52%', '58%', '56%'] },
  { id: 'build', labelled: true, items: ['62%', '46%', '48%', '54%', '66%'] },
  { id: 'store', labelled: true, items: ['64%', '58%'] },
  { id: 'secure', labelled: true, items: ['42%', '50%', '54%', '72%', '60%'] }
]

const TABLE_CELLS = ['18%', '15%', '9%', '17%', '11%', '8%']
const FORM_ROWS = ['58%', '44%', '66%']
const DETAIL_TABS = ['6rem', '3rem', '7.5rem', '8rem', '9rem', '6.5rem']

const LIST_BODY = `<div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
  <div class="flex items-center gap-(--spacing-sm)">
    <Skeleton width="2.5rem" height="2.5rem" />
    <Skeleton class="grow" height="2.5rem" />
    <Skeleton width="10rem" height="2.5rem" />
  </div>

  <CardBox :padded="false">
    <template #content>
      <div
        class="flex items-center gap-(--spacing-md) border-b-(length:--border-width-default) border-(--border-default) px-(--spacing-md) py-(--spacing-md)"
      >
        <Skeleton v-for="(cell, index) in tableCells" :key="index" :width="cell" height="0.75rem" />
      </div>
      <div v-for="row in 8" :key="row" class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md)">
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
</div>`

const sectionsBody = (column) => `<div class="${column} flex min-w-0 flex-col">
  <div class="flex flex-col gap-(--spacing-xs)">
    <Skeleton width="14rem" height="1.5rem" />
    <Skeleton width="26rem" height="0.875rem" />
  </div>

  <div class="layout-section-start flex flex-col gap-(--layout-section-gap)">
    <div v-for="section in 2" :key="section" class="flex flex-col gap-(--layout-group-gap)">
      <Skeleton width="7rem" height="1rem" />
      <CardBox :padded="false">
        <template #content>
          <div
            v-for="(field, index) in formRows"
            :key="index"
            class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md)"
            :class="index > 0 ? 'border-t-(length:--border-width-default) border-(--border-default)' : ''"
          >
            <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
              <Skeleton width="6rem" height="0.875rem" />
              <Skeleton :width="field" height="0.75rem" />
            </div>
            <div class="layout-field-control">
              <Skeleton height="2.5rem" />
            </div>
          </div>
        </template>
      </CardBox>
    </div>
  </div>
</div>`

const HOME_BODY = `<div class="layout-column flex min-h-full min-w-0 flex-col justify-center">
${indent(HOME_WIRE)}
</div>`

const DETAIL_STRIP = `<div
  class="layout-boundary-inline flex h-14 shrink-0 items-center gap-(--spacing-lg) border-b-(length:--border-width-default) border-(--border-muted)"
>
  <Skeleton v-for="(tab, index) in detailTabs" :key="index" :width="tab" height="0.875rem" />
</div>`

const FORM_FOOTER = `<div
  class="layout-boundary-inline flex shrink-0 items-center justify-end gap-(--spacing-sm) border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) py-(--spacing-sm)"
>
  <Skeleton width="5.5rem" height="2.5rem" />
  <Skeleton width="7rem" height="2.5rem" />
</div>`

const SESSION_FAMILIES = {
  list: { body: LIST_BODY, data: ['navGroups', 'tableCells'] },
  detail: {
    strip: DETAIL_STRIP,
    body: sectionsBody('layout-column'),
    data: ['navGroups', 'formRows', 'detailTabs']
  },
  form: {
    body: sectionsBody('layout-form-create'),
    footer: FORM_FOOTER,
    data: ['navGroups', 'formRows']
  },
  home: { body: HOME_BODY, data: ['navGroups', 'panels'] }
}

const SESSION_DATA = {
  navGroups: declare('navGroups', NAV_GROUPS),
  tableCells: declare('tableCells', TABLE_CELLS),
  formRows: declare('formRows', FORM_ROWS),
  detailTabs: declare('detailTabs', DETAIL_TABS),
  panels: panelsLine
}

const SESSION_STATE = {
  navGroups: NAV_GROUPS,
  tableCells: TABLE_CELLS,
  formRows: FORM_ROWS,
  detailTabs: DETAIL_TABS,
  panels: [1, 2, 3, 4]
}

const sessionTemplate = ({ strip = '', body, footer = '' }) => `<div
  role="status"
  aria-live="polite"
  aria-busy="true"
  class="flex h-screen flex-col overflow-hidden bg-(--bg-canvas) animate-fade-in motion-reduce:animate-none"
>
  <span class="sr-only">Session expired. Signing you out.</span>

  <div
    class="flex h-14 shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) px-(--spacing-md)"
  >
    <Skeleton width="1.25rem" height="1.25rem" />
    <Skeleton width="5rem" height="0.875rem" />
    <Skeleton width="4.5rem" height="0.875rem" />
    <Skeleton class="hidden md:block" width="6rem" height="0.875rem" />
    <Skeleton class="hidden lg:block" width="8rem" height="0.875rem" />

    <div class="ml-auto flex items-center gap-(--spacing-xs)">
      <Skeleton width="5.5rem" height="2rem" />
      <Skeleton class="hidden md:block" width="4.5rem" height="2rem" />
      <Skeleton kind="circle" width="2rem" height="2rem" />
    </div>
  </div>

  <div class="flex min-h-0 flex-1">
    <div
      class="hidden w-(--container-2xs) shrink-0 flex-col gap-(--spacing-lg) overflow-hidden border-r-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm) md:flex"
    >
      <Skeleton height="2.5rem" />

      <div v-for="group in navGroups" :key="group.id" class="flex flex-col gap-(--spacing-md)">
        <Skeleton v-if="group.labelled" width="30%" height="0.5rem" />
        <Skeleton v-for="(item, index) in group.items" :key="index" :width="item" height="0.875rem" />
      </div>

      <div class="mt-auto flex items-center gap-(--spacing-xs)">
        <Skeleton width="1.5rem" height="1.5rem" />
        <Skeleton width="50%" height="0.75rem" />
      </div>
    </div>

    <div class="flex min-w-0 flex-1 flex-col">${strip ? `\n${indent(strip, 3)}\n` : ''}
      <div class="layout-boundary min-h-0 flex-1 overflow-hidden">
${indent(body, 4)}
      </div>${footer ? `\n\n${indent(footer, 3)}` : ''}
    </div>
  </div>
</div>`

const sessionStory = (family, story) => {
  const entry = SESSION_FAMILIES[family]
  const template = sessionTemplate(entry)
  const imports = family === 'home' ? [CARD_IMPORT, ITEM_IMPORT, SKELETON_IMPORT] : [CARD_IMPORT, SKELETON_IMPORT]
  const lines = entry.data.flatMap((key) => ['', SESSION_DATA[key]])
  return {
    render: () => ({
      components,
      setup: () => Object.fromEntries(entry.data.map((key) => [key, SESSION_STATE[key]])),
      template
    }),
    parameters: {
      docs: {
        description: { story },
        source: { code: toSfc([...imports, ...lines], template) }
      }
    }
  }
}

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
          'The skeleton wires the console paints while a page is still arriving: the Home overview (HomeWire), the first-access Home (HomeFirstUseWire), and the whole shell while an expired session signs out (SessionWire), which draws one of four bodies by the family of the page it covers: list, detail, create form or Home. Each one is the real page’s grid drawn with Skeleton bands inside the same CardBox frames, so nothing shifts when the content lands. In the console the session wire is a fixed full-viewport layer sized to the measured header and rail; here it fills the canvas at the header’s 56px and the rail’s `--container-2xs`. Built from Skeleton, CardBox and Item.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Overview = {
  render: () => ({ components, setup: () => ({ panels: [1, 2, 3, 4] }), template: OVERVIEW_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Home dashboard wire: a greeting band, the four-cell metrics strip beside the agent onboarding card, then the five-column panel grid, the Applications and Recents panels indented for their row glyph and Recents spanning two columns.'
      },
      source: {
        code: toSfc([CARD_IMPORT, ITEM_IMPORT, SKELETON_IMPORT, '', panelsLine], OVERVIEW_TEMPLATE)
      }
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

export const Session = sessionStory(
  'list',
  'The whole console as a wire while a session expires over a list page: header bar, navigation rail with its grouped items, the list controls row and a table card with header, eight rows and pagination.'
)

export const SessionDetail = sessionStory(
  'detail',
  'The same wire over a detail page: a strip of tab bands under the header, then a heading and two banded cards of field rows in the data column.'
)

export const SessionForm = sessionStory(
  'form',
  'The same wire over a create page: the heading and two banded cards of field rows in the create column, with the save bar held at the foot.'
)

export const SessionHome = sessionStory(
  'home',
  'The same wire over Home: the Overview wire centred in the data column.'
)
