// Runtime budgets (M1.7): mount and update time of the components that receive the biggest inputs.
// Budgets live in ../../perf-budgets.json, in milliseconds, set at 3–5× the median measured on a
// developer machine so CI stays stable. A component over budget fails here; fix the component
// (window long lists, render collapsed children lazily), do not raise the number.
import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { server } from 'vitest/browser'
import { type Component, defineComponent, h, nextTick, ref } from 'vue'

import budgets from '../../perf-budgets.json'
import ChatMessageRoot from '../components/ai/chat-message/chat-message.vue'
import Conversation from '../components/ai/conversation/conversation.vue'
import ConversationHistory from '../components/ai/conversation-history/conversation-history.vue'
import StreamingResponse from '../components/ai/streaming-response/streaming-response.vue'
import BarList from '../components/chart/bar-list/bar-list.vue'
import Chart from '../components/chart/chart'
import DonutChart from '../components/chart/donut-chart/donut-chart.vue'
import MapChart from '../components/chart/map-chart/map-chart.vue'
import { MAP_CHART_COUNTRIES } from '../components/chart/map-chart/map-chart-countries'
import Tracker from '../components/chart/tracker/tracker.vue'
import CodeBlock from '../components/code/code-block/code-block.vue'
import CodeEditor from '../components/code/code-editor/code-editor.vue'
import LogView from '../components/code/log-view/log-view.vue'
import LogViewContent from '../components/code/log-view/log-view-content.vue'
import LogViewHeader from '../components/code/log-view/log-view-header.vue'
import Trace from '../components/code/trace/trace.vue'
import Item from '../components/content/item/item.vue'
import ItemContent from '../components/content/item/item-content.vue'
import ItemList from '../components/content/item/item-list.vue'
import ItemTitle from '../components/content/item/item-title.vue'
import KeyValuePairs from '../components/content/key-value-pairs/key-value-pairs.vue'
import KeyValuePairsItem from '../components/content/key-value-pairs/key-value-pairs-item/key-value-pairs-item.vue'
import Cards from '../components/data/cards/cards.vue'
import FilterMenu from '../components/data/filter-menu/filter-menu.vue'
import PickList, { PickListSource, PickListTarget } from '../components/data/pick-list'
import PropertyFilter from '../components/data/property-filter/property-filter.vue'
import Table from '../components/data/table/table.vue'
import TableCellLink from '../components/data/table/table-cell-link/table-cell-link.vue'
import TableCellTags from '../components/data/table/table-cell-tags/table-cell-tags.vue'
import Tree from '../components/data/tree/tree.vue'
import DocLayout from '../components/documentation/doc-layout/doc-layout.vue'
import DocMarkdown from '../components/documentation/doc-markdown/doc-markdown.vue'
import UploadProgress, {
  type UploadProgressItem
} from '../components/feedback/upload-progress/upload-progress.vue'
import Combobox from '../components/inputs/combobox/combobox.vue'
import MultiSelect from '../components/inputs/multi-select'
import SchemaForm from '../components/inputs/schema-form/schema-form.vue'
import Select from '../components/inputs/select'
import DropdownMenu, {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/navigation/dropdown-menu'
import ListingBrowser from '../components/sections/listing-browser/listing-browser.vue'
import ListingTable from '../components/sections/listing-table/listing-table.vue'
import { useCollection, type UseCollectionReturn } from '../composables/use-collection'

type Scenario = keyof typeof budgets.scenarios
type Phase = 'mount' | 'update'

const RUNS = 5

const settle = async () => {
  await nextTick()
  await nextTick()
  void document.body.offsetHeight
}

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]

interface Case {
  mount: () => Component
  update: () => void | Promise<void>
}

async function measure(make: () => Case): Promise<Record<Phase, number>> {
  const mounts: number[] = []
  const updates: number[] = []
  for (let i = 0; i < RUNS; i++) {
    const c = make()
    const root = c.mount()
    let t0 = performance.now()
    render(root)
    await settle()
    mounts.push(performance.now() - t0)
    t0 = performance.now()
    await c.update()
    await settle()
    updates.push(performance.now() - t0)
    cleanup()
  }
  return { mount: median(mounts), update: median(updates) }
}

const typeInto = async (selector: string, value: string) => {
  const input = document.body.querySelector<HTMLInputElement>(selector)
  if (!input) return
  input.focus()
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

function check(name: Scenario, result: Record<Phase, number>) {
  const budget = budgets.scenarios[name]
  console.warn(
    `[perf] ${name}: mount ${result.mount.toFixed(1)} ms (budget ${budget.mount}), update ${result.update.toFixed(1)} ms (budget ${budget.update})`
  )
  if (server.browser !== 'chromium') return
  expect(result.mount, `${name} mount`).toBeLessThanOrEqual(budget.mount)
  expect(result.update, `${name} update`).toBeLessThanOrEqual(budget.update)
}

const series = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => Math.round(1000 + 500 * Math.sin(i / 40 + seed) + (i % 17)))

function chartCase(): Case {
  const n = 10_000
  const labels = Array.from({ length: n }, (_, i) => `t${i}`)
  const data = ref([
    { id: 'allowed', name: 'Allowed', color: 'success', values: series(n, 0) },
    { id: 'blocked', name: 'Blocked', color: 'danger', values: series(n, 1) }
  ])
  return {
    mount: () => ({
      render: () =>
        h('div', { style: 'width:800px' }, [
          h(
            Chart,
            { series: data.value, labels, ariaLabel: 'Requests' },
            {
              default: () => [
                h(Chart.Grid),
                h(Chart.Axis, { kind: 'y' }),
                h(Chart.Axis, { kind: 'x' }),
                h(Chart.Area, { ids: ['allowed'] }),
                h(Chart.Line, { ids: ['blocked'] }),
                h(Chart.Crosshair),
                h(Chart.Tooltip),
                h(Chart.Legend, { totals: true })
              ]
            }
          )
        ])
    }),
    update: () => {
      data.value = data.value.map((s, i) => ({ ...s, values: series(n, i + 2) }))
    }
  }
}

function treeCase(): Case {
  const items = Array.from({ length: 50 }, (_, f) => ({
    id: `f${f}`,
    label: `folder-${f}`,
    icon: 'pi pi-folder',
    children: Array.from({ length: 99 }, (_, c) => ({
      id: `f${f}/c${c}`,
      label: `file-${c}.txt`,
      icon: 'pi pi-file',
      description: `${c} KB`
    }))
  }))
  const expanded = ref<string[]>([])
  return {
    mount: () => ({
      render: () =>
        h(Tree, {
          items,
          expanded: expanded.value,
          'onUpdate:expanded': (v: string[]) => (expanded.value = v),
          ariaLabel: 'Objects'
        })
    }),
    update: () => {
      expanded.value = ['f0', 'f1']
    }
  }
}

function selectCase(multiple: boolean): Case {
  const options = Array.from({ length: 1000 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }))
  const open = ref(false)
  const search = ref('')
  const filtered = () => {
    const q = search.value.toLowerCase()
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options
  }
  const Root = (multiple ? MultiSelect : Select) as typeof Select
  const Content = (multiple ? MultiSelect.Content : Select.Content) as typeof Select.Content
  const Trigger = (multiple ? MultiSelect.Trigger : Select.Trigger) as typeof Select.Trigger
  const Option = (multiple ? MultiSelect.Option : Select.Option) as typeof Select.Option
  return {
    mount: () => ({
      render: () =>
        h(
          Root,
          {
            modelValue: multiple ? [] : '',
            open: open.value,
            'onUpdate:open': (v: boolean) => (open.value = v)
          },
          {
            default: () => [
              h(Trigger),
              h(Content, null, {
                default: () =>
                  filtered().map((o) => h(Option, { key: o.value, value: o.value }, () => o.label))
              })
            ]
          }
        )
    }),
    update: async () => {
      open.value = true
      await settle()
      search.value = '1'
    }
  }
}

function donutCase(): Case {
  const make = (seed: number) =>
    Array.from({ length: 500 }, (_, i) => ({
      id: `c${i}`,
      name: `Country ${i}`,
      values: [1000 + ((i * 37 + seed) % 900)]
    }))
  const data = ref(make(0))
  return {
    mount: () => ({ render: () => h(DonutChart, { series: data.value, ariaLabel: 'Countries' }) }),
    update: () => {
      data.value = make(1)
    }
  }
}

function barListCase(): Case {
  const make = (seed: number) =>
    Array.from({ length: 1000 }, (_, i) => ({ name: `/path/${i}`, value: (i * 53 + seed) % 5000 }))
  const items = ref(make(0))
  return {
    mount: () => ({ render: () => h(BarList, { items: items.value, ariaLabel: 'Paths' }) }),
    update: () => {
      items.value = make(7)
    }
  }
}

function logViewCase(): Case {
  const kinds = ['text', 'success', 'warning', 'text'] as const
  const lines = Array.from({ length: 10_000 }, (_, i) => ({
    id: String(i),
    time: '13:47:33',
    type: kinds[i % kinds.length],
    message: `Line ${i}: request handled in ${i % 97} ms`
  }))
  const search = ref('')
  return {
    mount: () => ({
      render: () =>
        h(
          LogView,
          {
            lines,
            search: search.value,
            'onUpdate:search': (v: string) => (search.value = v),
            style: 'height:640px'
          },
          { default: () => [h(LogViewHeader), h(LogViewContent)] }
        )
    }),
    update: () => {
      search.value = 'Line 99'
    }
  }
}

function codeBlockCase(): Case {
  const code = Array.from(
    { length: 5000 },
    (_, i) => `export const value${i} = await fetch('/api/${i}').then((r) => r.json()) // ${i}`
  ).join('\n')
  const active = ref('js')
  const tabs = [
    { label: 'JavaScript', value: 'js', language: 'javascript', code },
    {
      label: 'TypeScript',
      value: 'ts',
      language: 'typescript',
      code: code.replace(/const/g, 'let')
    }
  ]
  return {
    mount: () => ({
      render: () =>
        h(CodeBlock, {
          tabs,
          modelValue: active.value,
          'onUpdate:modelValue': (v: string) => (active.value = v),
          lineNumbers: true
        })
    }),
    update: () => {
      active.value = 'ts'
    }
  }
}

function tableCase(n: number, virtual: boolean, change: 'sort' | 'filter' | 'select-all'): Case {
  const statuses = ['Live', 'Inactive', 'Pending']
  const items = Array.from({ length: n }, (_, i) => ({
    id: String(i),
    name: `resource-${String(i).padStart(5, '0')}`,
    domain: `resource-${i}.example.com`,
    status: statuses[i % 3],
    owner: `owner-${i % 40}`,
    requests: (i * 7919) % 100_000
  }))
  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'domain', header: 'Domain' },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'owner', header: 'Owner' },
    { accessorKey: 'requests', header: 'Requests', enableSorting: true, align: 'end' as const }
  ]
  let collection: UseCollectionReturn<(typeof items)[number], (typeof columns)[number]> | null =
    null
  const Host = defineComponent({
    setup() {
      const current = useCollection({ items, columns, selection: {} })
      collection = current
      return () =>
        h('div', { style: 'width:1024px' }, [
          h(Table, {
            ...current.tableProps.value,
            virtual,
            maxHeight: virtual ? '640px' : '',
            stackable: false
          })
        ])
    }
  })
  return {
    mount: () => Host,
    update: () => {
      if (change === 'sort') collection?.setSorting([{ id: 'requests', desc: true }])
      else if (change === 'select-all') collection?.selectAllMatching()
      else collection?.setFilteringText('resource-0001')
    }
  }
}

function dropdownMenuCase(): Case {
  const n = 1000
  const Host = defineComponent({
    setup() {
      return () =>
        h(
          'div',
          null,
          Array.from({ length: n }, (_, i) =>
            h(DropdownMenu, { key: i }, () => [
              h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, `Row ${i}`)),
              h(DropdownMenuGroup, null, () => [
                h(DropdownMenuItem, { value: 'edit', label: 'Edit' }),
                h(DropdownMenuItem, { value: 'delete', label: 'Delete' })
              ])
            ])
          )
        )
    }
  })
  return {
    mount: () => Host,
    update: () => {
      for (let i = 0; i < 20; i++) {
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', metaKey: true }))
      }
    }
  }
}

function conversationHistoryCase(): Case {
  const base = Date.parse('2026-11-11T14:00:00')
  const items = Array.from({ length: 5000 }, (_, i) => ({
    id: `c${i}`,
    title: `Conversation ${i}`,
    updatedAt: base - i * 3_600_000
  }))
  const selected = ref<string | null>(null)
  return {
    mount: () =>
      defineComponent({
        setup: () => () =>
          h(ConversationHistory, {
            items,
            now: '2026-11-11T15:00:00',
            modelValue: selected.value,
            'onUpdate:modelValue': (value: string | null) => (selected.value = value)
          })
      }),
    update: () => {
      selected.value = 'c2500'
    }
  }
}

function conversationCase(): Case {
  const n = 500
  const last = ref('Streaming')
  const messages = Array.from({ length: n - 1 }, (_, i) => ({
    from: i % 2 ? 'assistant' : 'user',
    text: `Message ${i}: purge the cache of ${i} URLs and check the edge logs for errors.`
  }))
  const Host = defineComponent({
    setup: () => () =>
      h('div', { style: 'height:640px;display:flex;flex-direction:column' }, [
        h(Conversation, null, () => [
          ...messages.map((m, i) =>
            h(ChatMessageRoot, { key: i, from: m.from as 'user' | 'assistant' }, () =>
              m.from === 'user' ? m.text : h(StreamingResponse, { content: m.text })
            )
          ),
          h(ChatMessageRoot, { key: 'last' }, () =>
            h(StreamingResponse, { content: last.value, streaming: true })
          )
        ])
      ])
  })
  return {
    mount: () => Host,
    update: async () => {
      for (let i = 0; i < 20; i++) {
        last.value += ' token'
        await nextTick()
      }
    }
  }
}

function streamingResponseCase(): Case {
  const lines = Array.from({ length: 2000 }, (_, i) =>
    i % 50 === 0
      ? `\n### Section ${i / 50}\n`
      : i % 50 === 25
        ? '```js\nconst value = ' + i + '\n```'
        : `Line ${i} explains **cache keys** and \`ttl\` for the edge.`
  )
  const content = ref(lines.join('\n'))
  return {
    mount: () =>
      defineComponent({
        setup: () => () => h(StreamingResponse, { content: content.value, streaming: true })
      }),
    update: async () => {
      for (let i = 0; i < 20; i++) {
        content.value += ' more'
        await nextTick()
      }
    }
  }
}

function docMarkdownCase(): Case {
  const page = (suffix: string) =>
    [
      '---',
      'title: Reference',
      '---',
      ...Array.from({ length: 5000 }, (_, i) =>
        i % 40 === 0
          ? `\n## Heading ${i / 40}${suffix}\n`
          : `Line ${i} of the reference with \`code\` and a [link](/docs/${i}).`
      )
    ].join('\n')
  const source = ref(page(''))
  return {
    mount: () => defineComponent({ setup: () => () => h(DocMarkdown, { source: source.value }) }),
    update: () => {
      source.value = page(' updated')
    }
  }
}

function docLayoutCase(): Case {
  const navigation = Array.from({ length: 20 }, (_, g) => ({
    label: `Group ${g}`,
    items: Array.from({ length: 50 }, (_, i) => ({
      id: `g${g}-i${i}`,
      label: `Page ${g}.${i}`,
      href: `/docs/${g}/${i}`
    }))
  }))
  const searchOpen = ref(false)
  return {
    mount: () =>
      defineComponent({
        setup: () => () =>
          h(
            DocLayout,
            {
              navigation,
              activeId: 'g0-i0',
              searchOpen: searchOpen.value,
              'onUpdate:searchOpen': (value: boolean) => (searchOpen.value = value)
            },
            () => h('p', 'Article')
          )
      }),
    update: () => {
      searchOpen.value = true
    }
  }
}

function itemListCase(): Case {
  const rows = ref(Array.from({ length: 1000 }, (_, i) => `Resource ${i}`))
  return {
    mount: () =>
      defineComponent({
        setup: () => () =>
          h(ItemList, null, () =>
            rows.value.map((label) =>
              h(Item, { key: label }, () =>
                h(ItemContent, null, () => h(ItemTitle, null, () => label))
              )
            )
          )
      }),
    update: () => {
      rows.value = [...rows.value].reverse()
    }
  }
}

function keyValuePairsCase(): Case {
  const rows = ref(
    Array.from({ length: 1000 }, (_, i) => ({ label: `Key ${i}`, value: `Value ${i}` }))
  )
  return {
    mount: () =>
      defineComponent({
        setup: () => () =>
          h(KeyValuePairs, { 'aria-label': 'Details' }, () =>
            rows.value.map((row) =>
              h(KeyValuePairsItem, { key: row.label, label: row.label }, () => row.value)
            )
          )
      }),
    update: () => {
      rows.value = rows.value.map((row) => ({ ...row, value: `${row.value}!` }))
    }
  }
}

function uploadProgressCase(): Case {
  const items = ref<UploadProgressItem[]>(
    Array.from({ length: 1000 }, (_, i) => ({
      id: `f${i}`,
      name: `asset-${i}.png`,
      size: 2048 + i,
      status: 'running',
      progress: i % 90
    }))
  )
  return {
    mount: () => ({
      render: () => h(UploadProgress, { items: items.value, floating: false })
    }),
    update: () => {
      items.value = items.value.map((item) => ({ ...item, progress: (item.progress ?? 0) + 1 }))
    }
  }
}

function listingTableCase(): Case {
  const columns = [
    { key: 'name', label: 'Name', grow: 2 as const },
    { key: 'region', label: 'Region' },
    { key: 'plan', label: 'Plan', align: 'end' as const }
  ]
  const make = (prefix: string) =>
    Array.from({ length: 1000 }, (_, i) => ({
      href: `/customers/${prefix}-${i}`,
      values: { name: `${prefix} ${i}`, region: `Region ${i % 12}`, plan: `Plan ${i % 4}` }
    }))
  const rows = ref(make('Acme'))
  const Host = defineComponent({
    setup: () => () => h(ListingTable, { title: 'Customers', columns, rows: rows.value })
  })
  return {
    mount: () => Host,
    update: () => {
      rows.value = make('Northwind')
    }
  }
}

function listingBrowserCase(): Case {
  const groups = Array.from({ length: 10 }, (_, i) => `Group ${i}`)
  const columns = [
    { key: 'name', label: 'Name', grow: 2 as const },
    { key: 'industry', label: 'Industry' }
  ]
  const rows = Array.from({ length: 1000 }, (_, i) => ({
    href: `/customers/acme-${i}`,
    group: groups[i % groups.length],
    values: { name: `Acme ${i}`, industry: `Industry ${i % 7}` },
    facets: { industry: [`industry-${i % 7}`] }
  }))
  const facets = [
    {
      key: 'industry',
      label: 'Industry',
      allLabel: 'All industries',
      options: Array.from({ length: 7 }, (_, i) => ({
        value: `industry-${i}`,
        label: `Industry ${i}`
      }))
    }
  ]
  const Host = defineComponent({
    setup: () => () =>
      h(ListingBrowser, {
        title: 'Customers',
        columns,
        rows,
        groups,
        facets,
        search: { placeholder: 'Search customers', label: 'Search customers' }
      })
  })
  return {
    mount: () => Host,
    update: async () => {
      const field = document.querySelector<HTMLInputElement>('input[type="text"]')
      if (!field) throw new Error('listing-browser search field not found')
      field.value = 'acme 12'
      field.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
}

function comboboxCase(): Case {
  const options = Array.from({ length: 1000 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }))
  return {
    mount: () => ({
      render: () => h(Combobox, { options, ariaLabel: 'Origin', allowCustom: false })
    }),
    update: async () => {
      const input = document.querySelector<HTMLInputElement>('[role="combobox"]')!
      await fireEvent.focus(input)
      await settle()
      await fireEvent.update(input, '1')
    }
  }
}

function schemaFormCase(): Case {
  const properties: Record<string, unknown> = {}
  for (let i = 0; i < 200; i++) {
    properties[`field${i}`] =
      i % 4 === 0
        ? {
            type: 'string',
            title: `Field ${i}`,
            enum: Array.from({ length: 50 }, (_, j) => `v${j}`)
          }
        : i % 4 === 1
          ? { type: 'integer', title: `Field ${i}`, minimum: 0, maximum: 1000 }
          : i % 4 === 2
            ? { type: 'boolean', title: `Field ${i}` }
            : { type: 'string', title: `Field ${i}`, maxLength: 80 }
  }
  const schema = { type: 'object', properties }
  const value = ref<Record<string, unknown>>({})
  return {
    mount: () => ({
      render: () =>
        h(SchemaForm, {
          schema,
          modelValue: value.value,
          'onUpdate:modelValue': (next: Record<string, unknown>) => (value.value = next)
        })
    }),
    update: () => {
      value.value = { ...value.value, field3: 'acme' }
    }
  }
}

function scatterCase(): Case {
  const n = 10_000
  const labels = Array.from({ length: n }, (_, i) => `t${i}`)
  const data = [{ id: 'latency', name: 'Latency', color: 1, values: series(n, 0) }]
  const active = ref<number | null>(null)
  return {
    mount: () => ({
      render: () =>
        h('div', { style: 'width:800px' }, [
          h(
            Chart,
            {
              series: data,
              labels,
              ariaLabel: 'Latency',
              activeIndex: active.value,
              'onUpdate:activeIndex': (v: number | null) => (active.value = v)
            },
            { default: () => [h(Chart.Axis, { kind: 'y' }), h(Chart.Scatter)] }
          )
        ])
    }),
    update: () => {
      active.value = 5000
    }
  }
}

function barCase(): Case {
  const n = 1000
  const labels = Array.from({ length: n }, (_, i) => `c${i}`)
  const data = ref(
    [0, 1, 2].map((slot) => ({
      id: `s${slot}`,
      name: `Series ${slot}`,
      color: slot + 1,
      values: series(n, slot)
    }))
  )
  return {
    mount: () => ({
      render: () =>
        h('div', { style: 'width:800px' }, [
          h(
            Chart,
            { series: data.value, labels, ariaLabel: 'Requests' },
            { default: () => [h(Chart.Axis, { kind: 'y' }), h(Chart.Bar)] }
          )
        ])
    }),
    update: () => {
      data.value = data.value.map((s, i) => ({ ...s, values: series(n, i + 4) }))
    }
  }
}

function mapChartCase(): Case {
  const regions = Object.keys(MAP_CHART_COUNTRIES).map((id, i) => ({ id, value: (i * 97) % 1000 }))
  const points = Array.from({ length: 1000 }, (_, i) => ({
    id: `p${i}`,
    name: `Point ${i}`,
    lat: ((i * 37) % 160) - 80,
    lon: ((i * 53) % 340) - 170,
    value: 100 + ((i * 31) % 900)
  }))
  const active = ref<string | null>(null)
  return {
    mount: () => ({
      render: () =>
        h('div', { style: 'width:800px' }, [
          h(MapChart, {
            regions,
            points,
            ariaLabel: 'Requests by location',
            activeId: active.value,
            'onUpdate:activeId': (v: string | null) => (active.value = v)
          })
        ])
    }),
    update: () => {
      active.value = 'p500'
    }
  }
}

function trackerCase(): Case {
  const statuses = ['success', 'success', 'warning', 'danger'] as const
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: `d${i}`,
    status: statuses[i % statuses.length],
    label: `Day ${i}`
  }))
  const active = ref<number | null>(null)
  return {
    mount: () => ({
      render: () =>
        h('div', { style: 'width:800px' }, [
          h(Tracker, {
            items,
            ariaLabel: 'Uptime',
            activeIndex: active.value,
            'onUpdate:activeIndex': (v: number | null) => (active.value = v)
          })
        ])
    }),
    update: () => {
      active.value = 500
    }
  }
}

function traceCase(): Case {
  const spans = Array.from({ length: 1000 }, (_, i) => ({
    id: `s${i}`,
    parentId: i === 0 ? undefined : `s${Math.floor((i - 1) / 4)}`,
    name: `span-${i}`,
    service: i % 3 ? 'Network' : 'Compute',
    start: i,
    duration: 10 + (i % 50)
  }))
  return {
    mount: () => ({ render: () => h(Trace, { spans, style: 'width:900px' }) }),
    update: () =>
      typeInto(
        '[data-testid="code-trace__search"] input, input[data-testid="code-trace__search"]',
        'span-99'
      )
  }
}

function codeEditorCase(): Case {
  const lines = Array.from({ length: 5000 }, (_, i) => `const value${i} = ${i} * 2`)
  const value = ref(lines.join('\n'))
  return {
    mount: () => ({
      render: () =>
        h(CodeEditor, {
          modelValue: value.value,
          'onUpdate:modelValue': (v: string) => (value.value = v),
          ariaLabel: 'Script'
        })
    }),
    update: () => {
      value.value = `${value.value}\nconst typed = true`
    }
  }
}

function propertyFilterCase(): Case {
  const properties = [
    {
      key: 'host',
      label: 'Host',
      options: Array.from({ length: 1000 }, (_, i) => ({ value: `host-${i}.example.com` }))
    }
  ]
  return {
    mount: () => ({ render: () => h(PropertyFilter, { properties }) }),
    update: async () => {
      const input = document.body.querySelector<HTMLInputElement>('[role="combobox"]')
      input?.focus()
      await settle()
      await typeInto('[role="combobox"]', 'example')
    }
  }
}

function filterMenuCase(): Case {
  const fields = [
    {
      id: 'host',
      label: 'Host',
      options: Array.from({ length: 1000 }, (_, i) => ({
        value: `h${i}`,
        label: `host-${i}.example.com`
      }))
    }
  ]
  const open = ref(false)
  return {
    mount: () => ({
      render: () =>
        h(FilterMenu, {
          fields,
          open: open.value,
          'onUpdate:open': (v: boolean) => (open.value = v)
        })
    }),
    update: async () => {
      open.value = true
      await settle()
      document.body
        .querySelector<HTMLElement>('[data-testid="data-filter-menu__field-host"]')
        ?.click()
      await settle()
      await typeInto('[data-testid="data-filter-menu__panel"] input', '99')
      await settle()
    }
  }
}

function pickListCase(): Case {
  const make = (side: string) =>
    Array.from({ length: 1000 }, (_, i) => ({ id: `${side}${i}`, label: `${side} item ${i}` }))
  const model = ref<[unknown[], unknown[]]>([make('a'), make('b')])
  return {
    mount: () => ({
      render: () =>
        h(
          PickList,
          {
            modelValue: model.value,
            'onUpdate:modelValue': (v: [unknown[], unknown[]]) => (model.value = v),
            trackBy: 'id'
          },
          {
            default: () => [
              h(PickListSource, { title: 'Available' }),
              h(PickListTarget, { title: 'Selected' })
            ]
          }
        )
    }),
    update: () => {
      model.value = [[], [...model.value[0], ...model.value[1]]]
    }
  }
}

function cardsCase(): Case {
  const items = Array.from({ length: 1000 }, (_, i) => ({ id: `c${i}`, name: `Card ${i}` }))
  const selected = ref<string[]>([])
  return {
    mount: () => ({
      render: () =>
        h(
          Cards,
          {
            items,
            selectionMode: 'multi',
            selectedKeys: selected.value,
            'onUpdate:selectedKeys': (v: string[]) => (selected.value = v)
          },
          { header: ({ item }: { item: { name: string } }) => item.name }
        )
    }),
    update: () => {
      selected.value = items.map((item) => item.id)
    }
  }
}

function tablePresetsCase(): Case {
  const data = Array.from({ length: 1000 }, (_, i) => ({
    id: String(i),
    name: `resource-${i}`,
    tags: ['production', 'edge', `team-${i % 7}`, 'cache'],
    requests: (i * 7919) % 100_000
  }))
  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'tags', header: 'Tags' },
    { accessorKey: 'requests', header: 'Requests', enableSorting: true }
  ]
  const sorting = ref<{ id: string; desc: boolean }[]>([])
  return {
    mount: () => ({
      render: () =>
        h('div', { style: 'width:1024px' }, [
          h(
            Table,
            {
              data,
              columns,
              stackable: false,
              sorting: sorting.value,
              'onUpdate:sorting': (v: { id: string; desc: boolean }[]) => (sorting.value = v)
            },
            {
              'cell-name': ({ row }: { row: { name: string } }) =>
                h(TableCellLink, { label: row.name, href: 'https://app.example.com/' }),
              'cell-tags': ({ row }: { row: { tags: string[] } }) =>
                h(TableCellTags, { items: row.tags })
            }
          )
        ])
    }),
    update: () => {
      sorting.value = [{ id: 'requests', desc: true }]
    }
  }
}

describe('runtime budgets (perf-budgets.json)', () => {
  afterEach(() => cleanup())

  it('Chart with 10k points per series', async () => {
    check('chart-10k', await measure(chartCase))
  })
  it('Tree with 5k nodes', async () => {
    check('tree-5k', await measure(treeCase))
  })
  it('Select with 1k options: open and filter', async () => {
    check('select-1k', await measure(() => selectCase(false)))
  })
  it('MultiSelect with 1k options: open and filter', async () => {
    check('multi-select-1k', await measure(() => selectCase(true)))
  })
  it('DonutChart with 500 slices', async () => {
    check('donut-chart-500', await measure(donutCase))
  })
  it('BarList with 1k rows', async () => {
    check('bar-list-1k', await measure(barListCase))
  })
  it('LogView with 10k lines: mount and search', async () => {
    check('log-view-10k', await measure(logViewCase))
  })
  it('CodeBlock with a 5k-line file: mount and switch tab', async () => {
    check('code-block-5k-lines', await measure(codeBlockCase))
  })
  it('UploadProgress with 1k files: mount and one progress tick', async () => {
    check('upload-progress-1k', await measure(uploadProgressCase))
  })
  it('Table with 1k rows under useCollection: mount and sort', async () => {
    check('table-1k', await measure(() => tableCase(1000, false, 'sort')))
  })
  it('Table with 10k virtual rows under useCollection: mount and sort', async () => {
    check('table-10k-virtual', await measure(() => tableCase(10_000, true, 'sort')))
  })
  it('Table with 10k virtual rows under useCollection: filter', async () => {
    check('table-10k-virtual-filter', await measure(() => tableCase(10_000, true, 'filter')))
  })
  it('Table with 10k virtual rows under useCollection: select every matching row', async () => {
    check(
      'table-10k-virtual-select-all',
      await measure(() => tableCase(10_000, true, 'select-all'))
    )
  })
  it('DropdownMenu x1k closed instances: mount and global events', async () => {
    check('dropdown-menu-1k', await measure(dropdownMenuCase))
  })
  it('ConversationHistory with 5k items: mount and select', async () => {
    check('conversation-history-5k', await measure(conversationHistoryCase))
  })
  it('Conversation with 500 messages: mount and stream into the last one', async () => {
    check('conversation-500', await measure(conversationCase))
  })
  it('StreamingResponse streaming a 2k-line answer', async () => {
    check('streaming-response-2k-lines', await measure(streamingResponseCase))
  })
  it('DocMarkdown with a 5k-line page: mount and replace', async () => {
    check('doc-markdown-5k-lines', await measure(docMarkdownCase))
  })
  it('DocLayout with 1k navigation rows: mount and open search', async () => {
    check('doc-layout-1k', await measure(docLayoutCase))
  })
  it('Item.List with 1k items: mount and reorder', async () => {
    check('item-list-1k', await measure(itemListCase))
  })
  it('KeyValuePairs with 1k pairs: mount and update values', async () => {
    check('key-value-pairs-1k', await measure(keyValuePairsCase))
  })
  it('ListingTable with 1k rows: mount and replace', async () => {
    check('listing-table-1k', await measure(listingTableCase))
  })
  it('ListingBrowser with 1k rows: mount and search', async () => {
    check('listing-browser-1k', await measure(listingBrowserCase))
  })
  it('Select with 1k options and a preselected value: mount names it by label', async () => {
    check('select-1k-preselected', await measure(() => selectCase(false, true)))
  })
  it('MultiSelect with 1k options and 10 preselected values: mount names them by label', async () => {
    check('multi-select-1k-preselected', await measure(() => selectCase(true, true)))
  })
  it('Combobox with 1k options: open and type', async () => {
    check('combobox-1k', await measure(comboboxCase))
  })
  it('SchemaForm with 200 fields: mount and edit one value', async () => {
    check('schema-form-200-fields', await measure(schemaFormCase))
  })
  it('Chart scatter with 10k points: mount and move the active index', async () => {
    check('chart-scatter-10k', await measure(scatterCase))
  })
  it('Chart bar with 1k categories x 3 series', async () => {
    check('chart-bar-1k-x3', await measure(barCase))
  })
  it('MapChart with all countries + 1k points: mount and walk', async () => {
    check('map-chart-1k-points', await measure(mapChartCase))
  })
  it('Tracker with 1k items: mount and move', async () => {
    check('tracker-1k', await measure(trackerCase))
  })
  it('Trace with 1k spans: mount and search', async () => {
    check('trace-1k', await measure(traceCase))
  })
  it('CodeEditor with 5k lines: mount and type', async () => {
    check('code-editor-5k-lines', await measure(codeEditorCase))
  })
  it('PropertyFilter with 1k values: open and search', async () => {
    check('property-filter-1k', await measure(propertyFilterCase))
  })
  it('FilterMenu field with 1k options: open and search', async () => {
    check('filter-menu-1k', await measure(filterMenuCase))
  })
  it('PickList with 1k items per side: mount and move all', async () => {
    check('pick-list-1k', await measure(pickListCase))
  })
  it('Cards with 1k items: mount and select all', async () => {
    check('cards-1k', await measure(cardsCase))
  })
  it('Table with 1k rows of preset cells: mount and sort', async () => {
    check('table-1k-presets', await measure(tablePresetsCase))
  })
})
