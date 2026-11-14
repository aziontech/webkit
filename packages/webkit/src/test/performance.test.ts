// Runtime budgets (M1.7): mount and update time of the components that receive the biggest inputs.
// Budgets live in ../../perf-budgets.json, in milliseconds, set at 3–5× the median measured on a
// developer machine so CI stays stable. A component over budget fails here; fix the component
// (window long lists, render collapsed children lazily), do not raise the number.
import { cleanup, render } from '@testing-library/vue'
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
import CodeBlock from '../components/code/code-block/code-block.vue'
import LogView from '../components/code/log-view/log-view.vue'
import LogViewContent from '../components/code/log-view/log-view-content.vue'
import LogViewHeader from '../components/code/log-view/log-view-header.vue'
import Item from '../components/content/item/item.vue'
import ItemContent from '../components/content/item/item-content.vue'
import ItemList from '../components/content/item/item-list.vue'
import ItemTitle from '../components/content/item/item-title.vue'
import KeyValuePairs from '../components/content/key-value-pairs/key-value-pairs.vue'
import KeyValuePairsItem from '../components/content/key-value-pairs/key-value-pairs-item/key-value-pairs-item.vue'
import Table from '../components/data/table/table.vue'
import Tree from '../components/data/tree/tree.vue'
import DocLayout from '../components/documentation/doc-layout/doc-layout.vue'
import DocMarkdown from '../components/documentation/doc-markdown/doc-markdown.vue'
import MultiSelect from '../components/inputs/multi-select'
import Select from '../components/inputs/select'
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
          showLineNumbers: true
        })
    }),
    update: () => {
      active.value = 'ts'
    }
  }
}

function tableCase(n: number, virtual: boolean, change: 'sort' | 'filter'): Case {
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
      else collection?.setFilteringText('resource-0001')
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
  it('Table with 1k rows under useCollection: mount and sort', async () => {
    check('table-1k', await measure(() => tableCase(1000, false, 'sort')))
  })
  it('Table with 10k virtual rows under useCollection: mount and sort', async () => {
    check('table-10k-virtual', await measure(() => tableCase(10_000, true, 'sort')))
  })
  it('Table with 10k virtual rows under useCollection: filter', async () => {
    check('table-10k-virtual-filter', await measure(() => tableCase(10_000, true, 'filter')))
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
})
