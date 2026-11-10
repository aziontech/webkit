import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { useKeyValuePairsContext } from './composables/use-key-value-pairs-context'
import KeyValuePairs, { KeyValuePairsGroup, KeyValuePairsItem } from './index'

const Facts = defineComponent({
  components: { KeyValuePairs, KeyValuePairsItem },
  props: {
    columns: { type: Number, default: 1 },
    loading: { type: Boolean, default: false }
  },
  template: `
    <KeyValuePairs :columns="columns" :loading="loading" aria-label="Workload details">
      <KeyValuePairsItem label="Workload ID">1752167890</KeyValuePairsItem>
      <KeyValuePairsItem label="Region">
        <template #info><button type="button" aria-label="About region">i</button></template>
        South America
      </KeyValuePairsItem>
      <KeyValuePairsItem label="Certificate" />
      <KeyValuePairsItem label="Domain"><template v-if="false">never</template></KeyValuePairsItem>
    </KeyValuePairs>
  `
})

const Grouped = defineComponent({
  components: { KeyValuePairs, KeyValuePairsGroup, KeyValuePairsItem },
  template: `
    <KeyValuePairs :columns="2" aria-label="Workload details">
      <KeyValuePairsGroup title="General">
        <KeyValuePairsItem label="Status">Active</KeyValuePairsItem>
      </KeyValuePairsGroup>
      <KeyValuePairsGroup title="Networking" data-testid="networking">
        <KeyValuePairsItem label="Domain">shop.example.com</KeyValuePairsItem>
      </KeyValuePairsGroup>
    </KeyValuePairs>
  `
})

const itemsOf = (view: ReturnType<typeof render>) =>
  view.getAllByTestId('content-key-value-pairs-item')

describe('KeyValuePairs', () => {
  describe('compound API', () => {
    it('attaches Item and Group to the root for dot-notation', () => {
      expect(KeyValuePairs.Item).toBe(KeyValuePairsItem)
      expect(KeyValuePairs.Group).toBe(KeyValuePairsGroup)
    })
  })

  describe('rendering & testid', () => {
    it('renders a description list with the derived testid and accessible name', () => {
      const view = render(Facts)
      const root = view.getByTestId('content-key-value-pairs')

      expect(root.tagName).toBe('DL')
      expect(root.getAttribute('aria-label')).toBe('Workload details')
      expect(root.getAttribute('aria-busy')).toBeNull()
      expect(root.hasAttribute('data-loading')).toBe(false)
    })

    it('lets a consumer data-testid win on the root', () => {
      const view = render(KeyValuePairs, { attrs: { 'data-testid': 'facts' } })

      expect(view.getByTestId('facts')).toBeInTheDocument()
      expect(view.queryByTestId('content-key-value-pairs')).toBeNull()
    })

    it('derives the Item testid from a consumer root testid', () => {
      const Custom = defineComponent({
        components: { KeyValuePairs, KeyValuePairsItem },
        template: `
          <KeyValuePairs data-testid="facts">
            <KeyValuePairsItem label="ID">1</KeyValuePairsItem>
            <KeyValuePairsItem label="Name" data-testid="name-pair">Shop</KeyValuePairsItem>
          </KeyValuePairs>
        `
      })
      const view = render(Custom)

      expect(view.getByTestId('facts-item')).toBeInTheDocument()
      expect(view.getByTestId('name-pair')).toBeInTheDocument()
    })

    it('omits aria-label when none is set', () => {
      const view = render(KeyValuePairs)
      expect(view.getByTestId('content-key-value-pairs').hasAttribute('aria-label')).toBe(false)
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
      expect(view.getByTestId('content-key-value-pairs').getAttribute('data-columns')).toBe(
        String(columns)
      )
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
      const root = view.getByTestId('content-key-value-pairs')

      expect(root.getAttribute('aria-busy')).toBe('true')
      expect(root.hasAttribute('data-loading')).toBe(true)
      expect(view.getAllByTestId('feedback-skeleton')).toHaveLength(4)
      expect(view.queryByText('1752167890')).toBeNull()
      expect(view.getByText('Workload ID')).toBeInTheDocument()
      expect(view.getByText('Region')).toBeInTheDocument()
    })
  })

  describe('groups', () => {
    it('renders each Group as a dt title and a dd holding a nested dl of Items', () => {
      const view = render(Grouped)
      const groups = view.getAllByTestId('content-key-value-pairs-group')

      expect(groups).toHaveLength(1)
      const group = groups[0]
      expect(group.tagName).toBe('DIV')
      expect(group.parentElement?.tagName).toBe('DL')
      expect(Array.from(group.children).map((child) => child.tagName)).toEqual(['DT', 'DD'])
      expect(group.querySelector(':scope > dt')?.textContent).toBe('General')

      const nested = group.querySelector(':scope > dd > dl')
      expect(nested).not.toBeNull()
      const item = nested?.querySelector('[data-testid="content-key-value-pairs-item"]')
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
    it('throws when resolved outside a KeyValuePairs provider', () => {
      const Loose = defineComponent({
        setup() {
          useKeyValuePairsContext()
          return () => null
        }
      })

      expect(() => render(Loose)).toThrow(/must be used within a KeyValuePairs/)
    })

    it('throws when an Item renders outside the root', () => {
      expect(() => render(KeyValuePairsItem, { props: { label: 'Loose' } })).toThrow(
        /must be used within a KeyValuePairs/
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
  })
})
