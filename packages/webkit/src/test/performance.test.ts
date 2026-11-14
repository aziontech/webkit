// Runtime budgets (M1.7): mount and update time of the components that receive the biggest inputs.
// Budgets live in ../../perf-budgets.json, in milliseconds, set at 3–5× the median measured on a
// developer machine so CI stays stable. A component over budget fails here; fix the component
// (window long lists, render collapsed children lazily), do not raise the number.
import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { server } from 'vitest/browser'
import { type Component, defineComponent, h, nextTick, ref } from 'vue'

import budgets from '../../perf-budgets.json'
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
import Cards from '../components/data/cards/cards.vue'
import FilterMenu from '../components/data/filter-menu/filter-menu.vue'
import PickList, { PickListSource, PickListTarget } from '../components/data/pick-list'
import PropertyFilter from '../components/data/property-filter/property-filter.vue'
import Table from '../components/data/table/table.vue'
import TableCellLink from '../components/data/table/table-cell-link/table-cell-link.vue'
import TableCellTags from '../components/data/table/table-cell-tags/table-cell-tags.vue'
import Tree from '../components/data/tree/tree.vue'
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
          lineNumbers: true
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

const typeInto = async (selector: string, value: string) => {
  const input = document.body.querySelector<HTMLInputElement>(selector)
  if (!input) return
  input.focus()
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
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
  it('Table with 1k rows under useCollection: mount and sort', async () => {
    check('table-1k', await measure(() => tableCase(1000, false, 'sort')))
  })
  it('Table with 10k virtual rows under useCollection: mount and sort', async () => {
    check('table-10k-virtual', await measure(() => tableCase(10_000, true, 'sort')))
  })
  it('Table with 10k virtual rows under useCollection: filter', async () => {
    check('table-10k-virtual-filter', await measure(() => tableCase(10_000, true, 'filter')))
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
