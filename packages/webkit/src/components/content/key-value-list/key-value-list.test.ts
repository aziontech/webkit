import '../../../test/reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import Split from '../../../../examples/key-value-list/split.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { useKeyValueListContext } from './composables/use-key-value-list-context'
import KeyValueList, {
  type KeyValueListColumns,
  KeyValueListGroup,
  KeyValueListItem
} from './index'

const Facts = defineComponent({
  components: { KeyValueList, KeyValueListItem },
  props: {
    columns: { type: Number, default: 1 },
    loading: { type: Boolean, default: false }
  },
  template: `
    <KeyValueList :columns="columns" :loading="loading" aria-label="Workload details">
      <KeyValueListItem label="Workload ID">1752167890</KeyValueListItem>
      <KeyValueListItem label="Region">
        <template #info><button type="button" aria-label="About region">i</button></template>
        South America
      </KeyValueListItem>
      <KeyValueListItem label="Certificate" />
      <KeyValueListItem label="Domain"><template v-if="false">never</template></KeyValueListItem>
    </KeyValueList>
  `
})

const Grouped = defineComponent({
  components: { KeyValueList, KeyValueListGroup, KeyValueListItem },
  template: `
    <KeyValueList :columns="2" aria-label="Workload details">
      <KeyValueListGroup label="General">
        <KeyValueListItem label="Status">Active</KeyValueListItem>
      </KeyValueListGroup>
      <KeyValueListGroup label="Networking" data-testid="networking">
        <KeyValueListItem label="Domain">shop.example.com</KeyValueListItem>
      </KeyValueListGroup>
    </KeyValueList>
  `
})

const itemsOf = (view: ReturnType<typeof render>) => view.getAllByTestId('key-value-list-item')

describe('KeyValueList', () => {
  describe('compound API', () => {
    it('attaches Item and Group to the root for dot-notation', () => {
      expect(KeyValueList.Item).toBe(KeyValueListItem)
      expect(KeyValueList.Group).toBe(KeyValueListGroup)
    })
  })

  describe('rendering & testid', () => {
    it('renders a description list with the derived testid and accessible name', () => {
      const view = render(Facts)
      const root = view.getByTestId('key-value-list')

      expect(root.tagName).toBe('DL')
      expect(root.getAttribute('aria-label')).toBe('Workload details')
      expect(root.getAttribute('aria-busy')).toBeNull()
      expect(root.hasAttribute('data-loading')).toBe(false)
    })

    it('lets a consumer data-testid win on the root', () => {
      const view = render(KeyValueList, { attrs: { 'data-testid': 'facts' } })

      expect(view.getByTestId('facts')).toBeInTheDocument()
      expect(view.queryByTestId('key-value-list')).toBeNull()
    })

    it('keeps the Item on its own test id under a consumer root testid', () => {
      const Custom = defineComponent({
        components: { KeyValueList, KeyValueListItem },
        template: `
          <KeyValueList data-testid="facts">
            <KeyValueListItem label="ID">1</KeyValueListItem>
            <KeyValueListItem label="Name" data-testid="name-pair">Shop</KeyValueListItem>
          </KeyValueList>
        `
      })
      const view = render(Custom)

      expect(view.getByTestId('key-value-list-item')).toBeInTheDocument()
      expect(view.getByTestId('name-pair')).toBeInTheDocument()
    })

    it('omits aria-label when none is set', () => {
      const view = render(KeyValueList)
      expect(view.getByTestId('key-value-list').hasAttribute('aria-label')).toBe(false)
    })
  })

  describe('structure', () => {
    it('renders each Item as a div wrapping one dt and one dd', () => {
      const view = render(Facts)
      const items = itemsOf(view)

      expect(items).toHaveLength(4)
      for (const item of items) {
        expect(item.tagName).toBe('DIV')
        expect(item.parentElement?.tagName).toBe('DL')
        const children = Array.from(item.children).map((child) => child.tagName)
        expect(children).toEqual(['DT', 'DD'])
      }

      expect(items[0].querySelector('dt')?.textContent).toContain('Workload ID')
      expect(items[0].querySelector('dd')?.textContent).toContain('1752167890')
    })

    it('renders the info slot inside the term after the label', () => {
      const view = render(Facts)
      const info = view.getByRole('button', { name: 'About region' })
      const term = info.closest('dt')

      expect(term).not.toBeNull()
      expect(term?.textContent).toContain('Region')
    })
  })

  describe('columns', () => {
    it.each([1, 2, 3, 4])('mirrors columns=%i on data-columns', (columns) => {
      const view = render(Facts, { props: { columns } })
      expect(view.getByTestId('key-value-list').getAttribute('data-columns')).toBe(String(columns))
    })
  })

  describe('empty value', () => {
    it('shows the hidden em dash and an announced "Not set" when the value is omitted', () => {
      const view = render(Facts)
      const dd = itemsOf(view)[2].querySelector('dd') as globalThis.HTMLElement
      const dash = Array.from(dd.querySelectorAll('span')).find((span) => span.textContent === '—')

      expect(dash?.getAttribute('aria-hidden')).toBe('true')
      expect(dd.textContent).toContain('Not set')
    })

    it('shows the marker when the default slot renders nothing', () => {
      const view = render(Facts)
      const dd = itemsOf(view)[3].querySelector('dd') as globalThis.HTMLElement

      expect(dd.textContent).toContain('Not set')
      expect(dd.textContent).not.toContain('never')
    })

    it('does not show the marker when a value is present', () => {
      const view = render(Facts)
      const dd = itemsOf(view)[0].querySelector('dd') as globalThis.HTMLElement
      expect(dd.textContent).not.toContain('Not set')
    })
  })

  describe('loading', () => {
    it('replaces values with skeletons, keeps labels and sets aria-busy', () => {
      const view = render(Facts, { props: { loading: true } })
      const root = view.getByTestId('key-value-list')

      expect(root.getAttribute('aria-busy')).toBe('true')
      expect(root.hasAttribute('data-loading')).toBe(true)
      expect(view.getAllByTestId('skeleton')).toHaveLength(4)
      expect(view.queryByText('1752167890')).toBeNull()
      expect(view.getByText('Workload ID')).toBeInTheDocument()
      expect(view.getByText('Region')).toBeInTheDocument()
    })
  })

  describe('groups', () => {
    it('renders each Group as a dt title and a dd holding a nested dl of Items', () => {
      const view = render(Grouped)
      const groups = view.getAllByTestId('key-value-list-group')

      expect(groups).toHaveLength(1)
      const group = groups[0]
      expect(group.tagName).toBe('DIV')
      expect(group.parentElement?.tagName).toBe('DL')
      expect(Array.from(group.children).map((child) => child.tagName)).toEqual(['DT', 'DD'])
      expect(group.querySelector(':scope > dt')?.textContent).toBe('General')

      const nested = group.querySelector(':scope > dd > dl')
      expect(nested).not.toBeNull()
      const item = nested?.querySelector('[data-testid="key-value-list-item"]')
      expect(item?.parentElement).toBe(nested)
      expect(item?.textContent).toContain('Active')
    })

    it('lets a consumer data-testid win on a Group', () => {
      const view = render(Grouped)
      const networking = view.getByTestId('networking')
      expect(networking.querySelector(':scope > dt')?.textContent).toBe('Networking')
    })
  })

  describe('context', () => {
    it('throws when resolved outside a KeyValueList provider', () => {
      const Loose = defineComponent({
        setup() {
          useKeyValueListContext()
          return () => null
        }
      })

      expect(() => render(Loose)).toThrow(/must be used within a KeyValueList/)
    })

    it('throws when an Item renders outside the root', () => {
      expect(() => render(KeyValueListItem, { props: { label: 'Loose' } })).toThrow(
        /must be used within a KeyValueList/
      )
    })
  })

  describe('a11y', () => {
    it('has no axe violations with bare Items and an aria-label on the dl', async () => {
      const view = render(Facts)
      await expectNoA11yViolations(view.container)
    })

    it('has no axe violations with Groups', async () => {
      const view = render(Grouped)
      await expectNoA11yViolations(view.container)
    })

    it('has no axe violations while loading', async () => {
      const view = render(Facts, { props: { loading: true } })
      await expectNoA11yViolations(view.container)
    })

    it('defaults to the stacked variant on the root and on every Item', () => {
      const view = render(Facts)
      expect(view.getByTestId('key-value-list').getAttribute('data-variant')).toBe('stacked')
      for (const item of itemsOf(view)) expect(item.getAttribute('data-variant')).toBe('stacked')
    })

    it('passes variant split to every Item, inside Groups too', () => {
      const view = render({
        components: { KeyValueList, KeyValueListGroup, KeyValueListItem },
        template: `
          <KeyValueList variant="split" aria-label="Plan">
            <KeyValueListGroup label="Plan">
              <KeyValueListItem label="Plan Price">$0.00 / month</KeyValueListItem>
            </KeyValueListGroup>
          </KeyValueList>
        `
      })
      expect(view.getByTestId('key-value-list').getAttribute('data-variant')).toBe('split')
      expect(itemsOf(view)[0]?.getAttribute('data-variant')).toBe('split')
    })

    it('keeps the term and description pairs and the empty marker in the Split example', async () => {
      const view = render(Split)
      const items = itemsOf(view)
      expect(items.map((item) => item.querySelector('dt')?.textContent?.trim())).toEqual([
        'Plan Price',
        'Billing Period',
        'Next Invoice',
        'Payment Method'
      ])
      expect(items[0]?.querySelector('dd')?.textContent?.trim()).toBe('$0.00 / month')
      expect(items[3]?.querySelector('dd')?.textContent).toContain('Not set')
      await expectNoA11yViolations(view.container)
    })
  })

  const boxOf = (width: number) => {
    const host = document.createElement('div')
    host.style.width = `${width}px`
    document.body.appendChild(host)
    return host
  }

  describe('columns follow the box', () => {
    const columnsIn = (width: number, columns: KeyValueListColumns) => {
      const view = render(KeyValueList, {
        props: { columns },
        slots: {
          default: () =>
            ['Region', 'Status', 'Owner', 'Created'].map((label) =>
              h(KeyValueListItem, { label }, { default: () => 'value' })
            )
        },
        container: boxOf(width)
      })
      return getComputedStyle(view.getByTestId('key-value-list'))
        .gridTemplateColumns.split(' ')
        .filter(Boolean).length
    }

    it('lays out one column in a narrow box', () => {
      expect(columnsIn(320, 3)).toBe(1)
    })

    it('caps the columns at the requested count in a wide box', () => {
      expect(columnsIn(1200, 3)).toBe(3)
      expect(columnsIn(1200, 2)).toBe(2)
    })

    it('drops to fewer columns before a cell gets narrower than --container-3xs', () => {
      expect(columnsIn(700, 4)).toBe(2)
    })
  })
})
