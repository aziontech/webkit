import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import InfiniteLoading from '../../../../examples/data-table/infinite-loading.vue'
import LiveTail from '../../../../examples/data-table/live-tail.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { hostable } from '../../../test/hostable'
import Table from '../table/index'
import TableLiveButton from '../table/table-live-button/table-live-button.vue'
import DataTableRoot from './data-table.vue'

const DataTable = hostable(DataTableRoot)

interface Item {
  id: string
  name: string
}

const columns = [{ accessorKey: 'name', header: 'Name' }]
const make = (from: number, count: number): Item[] =>
  Array.from({ length: count }, (_, i) => ({ id: String(from + i), name: `item-${from + i}` }))

function infiniteHost(initial: Item[], props: Record<string, unknown> = {}) {
  const data = ref<Item[]>(initial)
  const moreRows = ref(true)
  const loadingMore = ref(false)
  const calls = ref(0)
  const events: Event[] = []
  const Host = defineComponent({
    setup: () => () =>
      h(DataTable, {
        columns,
        data: data.value,
        moreRows: moreRows.value,
        loadingMore: loadingMore.value,
        ariaLabel: 'Items',
        onLoadMore: (event: Event) => {
          events.push(event)
          calls.value += 1
          loadingMore.value = true
        },
        ...props
      })
  })
  return { Host, data, moreRows, loadingMore, calls, events }
}

describe('DataTable', () => {
  describe('infinite loading', () => {
    it('asks for more rows when the end nears the viewport and holds while loading', async () => {
      const host = infiniteHost(make(0, 5))
      const { getByTestId, queryByTestId } = render(host.Host)

      await waitFor(() => expect(host.calls.value).toBe(1))
      expect(host.events[0]?.type).toBe('load-more')
      await nextTick()
      expect(getByTestId('data-table__more-loading')).toHaveTextContent('Loading more rows')
      expect(getByTestId('data-table__table')).toHaveAttribute('aria-busy', 'true')
      expect(queryByTestId('data-table__more-sentinel')).toBeNull()

      host.data.value = [...host.data.value, ...make(5, 5)]
      host.loadingMore.value = false
      await waitFor(() => expect(host.calls.value).toBe(2))
    })

    it('offers a Load more button and shows the end line once more rows were requested', async () => {
      const host = infiniteHost(make(0, 3))
      const { getByTestId, queryByTestId } = render(host.Host)
      await waitFor(() => expect(host.calls.value).toBe(1))

      host.loadingMore.value = false
      host.moreRows.value = false
      await nextTick()
      expect(queryByTestId('data-table__more-button')).toBeNull()
      expect(getByTestId('data-table__more-end')).toHaveTextContent('No more rows')
      expect(getByTestId('data-table__more').querySelector('[role="status"]')).not.toBeNull()

      host.moreRows.value = true
      await nextTick()
      await fireEvent.click(getByTestId('data-table__more-button'))
      expect(host.calls.value).toBeGreaterThanOrEqual(2)
      expect(host.events.some((event) => event instanceof MouseEvent)).toBe(true)
    })

    it('renders no load-more band without more rows and none while the table is loading', async () => {
      const plain = render(DataTable, { props: { columns, data: make(0, 3) } })
      expect(plain.queryByTestId('data-table__more')).toBeNull()
      plain.unmount()

      const loading = render(DataTable, {
        props: { columns, data: make(0, 3), moreRows: true, loading: true }
      })
      expect(loading.queryByTestId('data-table__more')).toBeNull()
    })

    it('works with virtual rows over 1,000 records: asks only once scrolled near the end', async () => {
      const scroller = document.createElement('div')
      scroller.style.height = '300px'
      scroller.style.overflow = 'auto'
      document.body.appendChild(scroller)
      const host = infiniteHost(make(0, 1000), { virtual: true, maxHeight: '300px' })
      const started = performance.now()
      const view = render(host.Host, { container: scroller })
      expect(performance.now() - started).toBeLessThan(1000)
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(host.calls.value).toBe(0)
      expect(view.getAllByRole('row').length).toBeLessThan(100)

      scroller.scrollTop = scroller.scrollHeight
      await waitFor(() => expect(host.calls.value).toBe(1))
      scroller.remove()
    })
  })

  describe('live tail', () => {
    function liveHost() {
      const data = ref<Item[]>(make(0, 5))
      const live = ref(false)
      const loading = ref(false)
      const Host = defineComponent({
        setup: () => () =>
          h(
            DataTable,
            {
              columns,
              data: data.value,
              loading: loading.value,
              live: live.value,
              'onUpdate:live': (value: boolean) => (live.value = value),
              maxHeight: '300px'
            },
            { toolbar: () => h(TableLiveButton) }
          )
      })
      return { Host, data, live, loading }
    }

    it('toggles live from Table.LiveButton and reflects it with aria-pressed', async () => {
      const user = userEvent.setup()
      const host = liveHost()
      const { getByTestId } = render(host.Host)

      const button = getByTestId('table-live-button')
      expect(button).toHaveAttribute('aria-pressed', 'false')
      expect(button).toHaveAccessibleName('Live')
      await user.click(button)
      expect(host.live.value).toBe(true)
      expect(button).toHaveAttribute('aria-pressed', 'true')
      expect(button).toHaveAttribute('data-live')
      await user.click(button)
      expect(host.live.value).toBe(false)
    })

    it('marks the first row older than the live start once newer rows arrive, and clears it off', async () => {
      const host = liveHost()
      const { container } = render(host.Host)
      const boundary = () => container.querySelector('[data-live-boundary]')

      host.live.value = true
      await nextTick()
      await nextTick()
      expect(boundary()).toBeNull()

      host.data.value = [...make(100, 2), ...host.data.value]
      await nextTick()
      expect(boundary()).toHaveTextContent('item-0')

      host.data.value = [...make(200, 1), ...host.data.value]
      await nextTick()
      expect(boundary()).toHaveTextContent('item-0')

      host.live.value = false
      await nextTick()
      expect(boundary()).toBeNull()
    })

    it('disables the live button while the table is loading and keeps a standalone test id', async () => {
      const host = liveHost()
      const { getByTestId } = render(host.Host)
      host.loading.value = true
      await nextTick()
      expect(getByTestId('table-live-button')).toBeDisabled()

      const alone = render(TableLiveButton)
      expect(alone.container.querySelector('[data-testid="table-live-button"]')).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    })

    it('is attached to the compound as Table.LiveButton', () => {
      expect(Table.LiveButton).toBe(TableLiveButton)
    })
  })

  describe('infinite loading and live tail examples', () => {
    it('have no axe violations', async () => {
      const infinite = render(InfiniteLoading)
      await expectNoA11yViolations(infinite.container)
      infinite.unmount()
      const live = render(LiveTail)
      await expectNoA11yViolations(live.container)
    })
  })
})
