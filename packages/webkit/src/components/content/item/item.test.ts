import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/item/default.vue'
import Muted from '../../../../examples/item/muted.vue'
import Option from '../../../../examples/item/option.vue'
import Outline from '../../../../examples/item/outline.vue'
import Small from '../../../../examples/item/small.vue'
import WithGroup from '../../../../examples/item/with-group.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Item from './index'

describe('Item (composition)', () => {
  describe('compound dot-notation resolves (index.ts Object.assign)', () => {
    it.each([
      ['Group', 'ItemGroup'],
      ['Separator', 'ItemSeparator'],
      ['Media', 'ItemMedia'],
      ['Content', 'ItemContent'],
      ['Title', 'ItemTitle'],
      ['Description', 'ItemDescription'],
      ['Actions', 'ItemActions'],
      ['Header', 'ItemHeader'],
      ['Footer', 'ItemFooter']
    ])('Item.%s is the %s component', (key, name) => {
      const sub = (Item as unknown as Record<string, { name?: string }>)[key]
      expect(sub).toBeTruthy()
      expect(sub.name).toBe(name)
    })
  })

  describe('root rendering (grounded in item.vue template)', () => {
    it('renders a <div data-slot="item"> carrying the default testid and data-kind/data-size', () => {
      const { getByTestId } = render(Item, {
        slots: { default: '<span data-testid="child">x</span>' }
      })
      const root = getByTestId('content-item')
      expect(root.tagName).toBe('DIV')
      expect(root.getAttribute('data-slot')).toBe('item')
      expect(root.getAttribute('data-kind')).toBe('default')
      expect(root.getAttribute('data-size')).toBe('medium')
    })

    it('reflects kind and size props on the root data-* attributes', () => {
      const { getByTestId } = render(Item, {
        props: { kind: 'outlined', size: 'small' },
        slots: { default: '<span>y</span>' }
      })
      const root = getByTestId('content-item')
      expect(root.getAttribute('data-kind')).toBe('outlined')
      expect(root.getAttribute('data-size')).toBe('small')
    })

    it('renders default slot content inside the root wrapper', () => {
      const { getByTestId } = render(Item, {
        slots: { default: '<span data-testid="inner">hello</span>' }
      })
      const root = getByTestId('content-item')
      const inner = getByTestId('inner')
      expect(root.contains(inner)).toBe(true)
      expect(inner.textContent).toBe('hello')
    })
  })

  describe('provide/inject — the injected testId flows to sub-components', () => {
    it('derives every sub-component testid from the root context testId (default)', () => {
      const Tree = {
        components: {
          Item,
          IContent: Item.Content,
          ITitle: Item.Title,
          IDescription: Item.Description,
          IActions: Item.Actions,
          IMedia: Item.Media,
          ISeparator: Item.Separator,
          IHeader: Item.Header,
          IFooter: Item.Footer
        },
        template: `
          <Item>
            <IMedia><span>M</span></IMedia>
            <IContent>
              <IHeader><span>H</span></IHeader>
              <ITitle>Title</ITitle>
              <IDescription>Desc</IDescription>
              <IFooter><span>F</span></IFooter>
            </IContent>
            <IActions><button>Go</button></IActions>
            <ISeparator />
          </Item>
        `
      }
      const { getByTestId } = render(Tree)

      expect(getByTestId('content-item__media').getAttribute('data-slot')).toBe('item-media')
      expect(getByTestId('content-item__content').getAttribute('data-slot')).toBe('item-content')
      expect(getByTestId('content-item__header').getAttribute('data-slot')).toBe('item-header')
      expect(getByTestId('content-item__title').getAttribute('data-slot')).toBe('item-title')
      expect(getByTestId('content-item__description').getAttribute('data-slot')).toBe(
        'item-description'
      )
      expect(getByTestId('content-item__footer').getAttribute('data-slot')).toBe('item-footer')
      expect(getByTestId('content-item__actions').getAttribute('data-slot')).toBe('item-actions')
      expect(getByTestId('content-item__separator').getAttribute('data-slot')).toBe(
        'item-separator'
      )
    })

    it('propagates a consumer-overridden root testId into every sub-component testid', () => {
      const Tree = {
        components: {
          Item,
          IContent: Item.Content,
          ITitle: Item.Title,
          IDescription: Item.Description,
          ISeparator: Item.Separator
        },
        template: `
          <Item data-testid="row-1">
            <IContent>
              <ITitle>T</ITitle>
              <IDescription>D</IDescription>
            </IContent>
            <ISeparator />
          </Item>
        `
      }
      const { getByTestId, queryByTestId } = render(Tree)

      expect(getByTestId('row-1').getAttribute('data-slot')).toBe('item')
      expect(getByTestId('row-1__content')).toBeTruthy()
      expect(getByTestId('row-1__title')).toBeTruthy()
      expect(getByTestId('row-1__description')).toBeTruthy()
      expect(getByTestId('row-1__separator')).toBeTruthy()
      expect(queryByTestId('content-item')).toBeNull()
      expect(queryByTestId('content-item__separator')).toBeNull()
    })

    it('falls back to content-item base when a sub-component is used with no root context', () => {
      const { getByTestId } = render(Item.Separator)
      expect(getByTestId('content-item__separator').getAttribute('role')).toBe('separator')
    })
  })

  describe('sub-component anatomy (roles / tags / props grounded in each .vue)', () => {
    it('ItemGroup renders role="list"', () => {
      const { getByRole, getByTestId } = render(Item.Group, {
        slots: { default: '<span>row</span>' }
      })
      expect(getByRole('list')).toBe(getByTestId('content-item-group'))
    })

    it('ItemSeparator renders role="separator"', () => {
      const { getByRole } = render(Item.Separator)
      expect(getByRole('separator')).toBeTruthy()
    })

    it('ItemDescription renders a <p> element', () => {
      const { getByTestId } = render(Item.Description, {
        slots: { default: 'A description' }
      })
      const el = getByTestId('content-item__description')
      expect(el.tagName).toBe('P')
      expect(el.textContent).toBe('A description')
    })

    it('ItemMedia defaults data-kind to "default"', () => {
      const { getByTestId } = render(Item.Media, {
        slots: { default: '<span>m</span>' }
      })
      expect(getByTestId('content-item__media').getAttribute('data-kind')).toBe('default')
    })

    it.each([['icon'], ['image']])('ItemMedia reflects kind="%s" on data-kind', (kind) => {
      const { getByTestId } = render(Item.Media, {
        props: { kind },
        slots: { default: '<span>m</span>' }
      })
      expect(getByTestId('content-item__media').getAttribute('data-kind')).toBe(kind)
    })
  })

  describe('href and clickable — the row renders its own interactive root', () => {
    it('renders an anchor root carrying href, data-slot, data-kind and data-size', () => {
      const { getByTestId } = render(Item, {
        props: { href: 'https://example.com/docs', kind: 'outlined', size: 'small' },
        slots: { default: 'Docs' }
      })
      const root = getByTestId('content-item')
      expect(root.tagName).toBe('A')
      expect(root.getAttribute('href')).toBe('https://example.com/docs')
      expect(root.getAttribute('data-slot')).toBe('item')
      expect(root.getAttribute('data-kind')).toBe('outlined')
      expect(root.getAttribute('data-size')).toBe('small')
      expect(root.hasAttribute('type')).toBe(false)
    })

    it('renders a button root with type=button when clickable and fires the bound click', async () => {
      let clicks = 0
      const { getByTestId } = render(Item, {
        props: { clickable: true },
        attrs: { onClick: () => (clicks += 1) },
        slots: { default: 'Pick' }
      })
      const root = getByTestId('content-item')
      expect(root.tagName).toBe('BUTTON')
      expect(root.getAttribute('type')).toBe('button')
      expect(root.hasAttribute('href')).toBe(false)
      await fireEvent.click(root)
      expect(clicks).toBe(1)
    })

    it('forwards aria-pressed to the button root of a clickable row of any kind', () => {
      const { getByRole } = render(Item, {
        props: { clickable: true, size: 'small' },
        attrs: { 'aria-pressed': 'true' },
        slots: { default: 'Chosen' }
      })
      const root = getByRole('button', { name: 'Chosen', pressed: true })
      expect(root.getAttribute('data-kind')).toBe('default')
      expect(root.hasAttribute('data-selected')).toBe(false)
    })

    it('prefers the anchor when both href and clickable are set', () => {
      const { getByTestId } = render(Item, {
        props: { href: '#one', clickable: true },
        slots: { default: 'One' }
      })
      expect(getByTestId('content-item').tagName).toBe('A')
    })

    it('renders a div root by default', () => {
      const { getByTestId } = render(Item, { slots: { default: 'Row' } })
      const root = getByTestId('content-item')
      expect(root.tagName).toBe('DIV')
      expect(root.hasAttribute('href')).toBe(false)
    })

    it('has no a11y violations as a link row and as a button row', async () => {
      const link = render(Item, { props: { href: '#one' }, slots: { default: 'One' } })
      await expectNoA11yViolations(link.container)
      const button = render(Item, { props: { clickable: true }, slots: { default: 'Two' } })
      await expectNoA11yViolations(button.container)
    })
  })

  describe('documented example (the real fixtures run in-test)', () => {
    it('Default story renders a titled row with a trailing action through the sub-components', () => {
      const { getByTestId, getByText } = render(Default)
      expect(getByTestId('content-item').getAttribute('data-slot')).toBe('item')
      expect(getByTestId('content-item__content')).toBeTruthy()
      expect(getByTestId('content-item__title').textContent?.trim()).toBe('Basic Item')
      expect(getByTestId('content-item__actions')).toBeTruthy()
      expect(getByText(/simple item with title/i)).toBeTruthy()
    })

    it.each([
      ['Outline', Outline, 'outlined', 'medium'],
      ['Muted', Muted, 'muted', 'medium'],
      ['Small', Small, 'outlined', 'small']
    ])('%s story sets the root kind/size from its args', (_name, Story, kind, size) => {
      const { getByTestId } = render(Story)
      const root = getByTestId('content-item')
      expect(root.getAttribute('data-kind')).toBe(kind)
      expect(root.getAttribute('data-size')).toBe(size)
    })

    it('WithGroup story wraps rows in a role="list" and renders separators from context', () => {
      const { getByRole, getAllByText } = render(WithGroup)
      expect(getByRole('list')).toBeTruthy()
      expect(getAllByText(/@example\.com/).length).toBe(3)
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('a composed item row has no violations', async () => {
      const Tree = {
        components: {
          Item,
          IContent: Item.Content,
          ITitle: Item.Title,
          IDescription: Item.Description,
          IActions: Item.Actions
        },
        template: `
          <Item kind="outlined">
            <IContent>
              <ITitle>Accessible Item</ITitle>
              <IDescription>A row with a title, description and an action.</IDescription>
            </IContent>
            <IActions><button type="button">Open</button></IActions>
          </Item>
        `
      }
      const { container } = render(Tree)
      await expectNoA11yViolations(container)
    })

    it('WithGroup example has no violations', async () => {
      const { container } = render(WithGroup)
      await expectNoA11yViolations(container)
    })
  })

  describe('kind="option" — chooser rows', () => {
    it('marks each row as an option row on its button and follows the pressed choice', async () => {
      const { getByRole, getAllByRole, container } = render(Option)
      const rows = getAllByRole('button')
      expect(rows).toHaveLength(4)
      for (const row of rows) expect(row.getAttribute('data-kind')).toBe('option')
      expect(getByRole('button', { name: 'workload_02' }).getAttribute('aria-pressed')).toBe('true')

      await fireEvent.click(getByRole('button', { name: 'workload_04' }))
      expect(getByRole('button', { name: 'workload_04' }).getAttribute('aria-pressed')).toBe('true')
      expect(getByRole('button', { name: 'workload_02' }).getAttribute('aria-pressed')).toBe(
        'false'
      )
      await expectNoA11yViolations(container)
    })

    it('narrows the rows from the search field', async () => {
      const { getByRole, getAllByRole } = render(Option)
      await fireEvent.update(getByRole('textbox', { name: 'Find workload' }), '03')
      expect(getAllByRole('button').map((row) => row.textContent?.trim())).toEqual(['workload_03'])
    })
  })

  describe('list structure (Item.List and Item.Group own the listitem role)', () => {
    it('exposes Item.Group rows as listitems and hides its separators from the list', () => {
      const { getByRole } = render(WithGroup)
      const list = getByRole('list')
      Array.from(list.children).forEach((child) => {
        const expected = child.getAttribute('data-slot') === 'item-separator' ? 'none' : 'listitem'
        expect(child.getAttribute('role')).toBe(expected)
      })
    })

    it('wraps a link row of Item.List in a listitem and keeps the link a link', () => {
      const Tree = {
        components: { Item, ItemList: Item.List },
        template: `
          <ItemList>
            <Item href="#one">One</Item>
            <Item href="#two">Two</Item>
          </ItemList>
        `
      }
      const { getByRole } = render(Tree)
      const rows = Array.from(getByRole('list').children)
      expect(rows.length).toBe(2)
      rows.forEach((row) => {
        expect(row.getAttribute('role')).toBe('listitem')
        expect(row.firstElementChild?.tagName).toBe('A')
        expect(row.firstElementChild?.hasAttribute('role')).toBe(false)
      })
    })

    it('gives an Item outside a list no listitem role', () => {
      const { getByTestId } = render(Item, { slots: { default: '<span>row</span>' } })
      expect(getByTestId('content-item').hasAttribute('role')).toBe(false)
    })

    it('gives an Item nested inside a list row no listitem role', () => {
      const Nested = {
        components: { Item, ItemList: Item.List },
        template: `
          <ItemList>
            <Item data-testid="outer"><Item data-testid="inner">Nested</Item></Item>
          </ItemList>
        `
      }
      const { getByTestId } = render(Nested)
      expect(getByTestId('outer').getAttribute('role')).toBe('listitem')
      expect(getByTestId('inner').hasAttribute('role')).toBe(false)
    })

    it('keeps role="separator" on a separator outside a list', () => {
      const { getByRole } = render(Item.Separator)
      expect(getByRole('separator')).toBeTruthy()
    })
  })
})
