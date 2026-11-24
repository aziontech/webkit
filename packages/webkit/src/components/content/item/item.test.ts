import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/item/default.vue'
import Groups from '../../../../examples/item/groups.vue'
import Inline from '../../../../examples/item/inline.vue'
import Muted from '../../../../examples/item/muted.vue'
import Option from '../../../../examples/item/option.vue'
import Outline from '../../../../examples/item/outline.vue'
import Small from '../../../../examples/item/small.vue'
import WithIconMedia from '../../../../examples/item/with-icon-media.vue'
import WithList from '../../../../examples/item/with-list.vue'
import WithListLinks from '../../../../examples/item/with-list-links.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Item from './index'

describe('Item', () => {
  describe('composition', () => {
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
      it('renders a <div data-slot="item"> carrying the default testid and data-variant/data-size', () => {
        const { getByTestId } = render(Item, {
          slots: { default: '<span data-testid="child">x</span>' }
        })
        const root = getByTestId('item')
        expect(root.tagName).toBe('DIV')
        expect(root.getAttribute('data-slot')).toBe('item')
        expect(root.getAttribute('data-variant')).toBe('default')
        expect(root.getAttribute('data-size')).toBe('medium')
      })

      it('reflects variant and size props on the root data-* attributes', () => {
        const { getByTestId } = render(Item, {
          props: { variant: 'outline', size: 'small' },
          slots: { default: '<span>y</span>' }
        })
        const root = getByTestId('item')
        expect(root.getAttribute('data-variant')).toBe('outline')
        expect(root.getAttribute('data-size')).toBe('small')
      })

      it('renders default slot content inside the root wrapper', () => {
        const { getByTestId } = render(Item, {
          slots: { default: '<span data-testid="inner">hello</span>' }
        })
        const root = getByTestId('item')
        const inner = getByTestId('inner')
        expect(root.contains(inner)).toBe(true)
        expect(inner.textContent).toBe('hello')
      })
    })

    describe('test ids of the parts', () => {
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

        expect(getByTestId('item-media').getAttribute('data-slot')).toBe('item-media')
        expect(getByTestId('item-content').getAttribute('data-slot')).toBe('item-content')
        expect(getByTestId('item-header').getAttribute('data-slot')).toBe('item-header')
        expect(getByTestId('item-title').getAttribute('data-slot')).toBe('item-title')
        expect(getByTestId('item-description').getAttribute('data-slot')).toBe('item-description')
        expect(getByTestId('item-footer').getAttribute('data-slot')).toBe('item-footer')
        expect(getByTestId('item-actions').getAttribute('data-slot')).toBe('item-actions')
        expect(getByTestId('item-separator').getAttribute('data-slot')).toBe('item-separator')
      })

      it('keeps every part on its own test id under a consumer root testId', () => {
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
        expect(getByTestId('item-content')).toBeTruthy()
        expect(getByTestId('item-title')).toBeTruthy()
        expect(getByTestId('item-description')).toBeTruthy()
        expect(getByTestId('item-separator')).toBeTruthy()
        expect(queryByTestId('item')).toBeNull()
      })

      it('keeps its own test id when a sub-component is used with no root context', () => {
        const { getByTestId } = render(Item.Separator)
        expect(getByTestId('item-separator').getAttribute('role')).toBe('separator')
      })
    })

    describe('sub-component anatomy (roles / tags / props grounded in each .vue)', () => {
      it('ItemGroup renders role="list"', () => {
        const { getByRole, getByTestId } = render(Item.Group, {
          slots: { default: '<span>row</span>' }
        })
        expect(getByRole('list')).toBe(getByTestId('item-group'))
      })

      it('ItemSeparator renders role="separator"', () => {
        const { getByRole } = render(Item.Separator)
        expect(getByRole('separator')).toBeTruthy()
      })

      it('ItemDescription renders a <p> element', () => {
        const { getByTestId } = render(Item.Description, {
          slots: { default: 'A description' }
        })
        const el = getByTestId('item-description')
        expect(el.tagName).toBe('P')
        expect(el.textContent).toBe('A description')
      })

      it('ItemMedia defaults data-type to "default"', () => {
        const { getByTestId } = render(Item.Media, {
          slots: { default: '<span>m</span>' }
        })
        expect(getByTestId('item-media').getAttribute('data-type')).toBe('default')
      })

      it.each([['icon'], ['image']] as const)(
        'ItemMedia reflects type="%s" on data-type',
        (variant) => {
          const { getByTestId } = render(Item.Media, {
            props: { type: variant },
            slots: { default: '<span>m</span>' }
          })
          expect(getByTestId('item-media').getAttribute('data-type')).toBe(variant)
        }
      )
    })

    describe('href and clickable — the row renders its own interactive root', () => {
      it('renders an anchor root carrying href, data-slot, data-variant and data-size', () => {
        const { getByTestId } = render(Item, {
          props: { href: 'https://example.com/docs', variant: 'outline', size: 'small' },
          slots: { default: 'Docs' }
        })
        const root = getByTestId('item')
        expect(root.tagName).toBe('A')
        expect(root.getAttribute('href')).toBe('https://example.com/docs')
        expect(root.getAttribute('data-slot')).toBe('item')
        expect(root.getAttribute('data-variant')).toBe('outline')
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
        const root = getByTestId('item')
        expect(root.tagName).toBe('BUTTON')
        expect(root.getAttribute('type')).toBe('button')
        expect(root.hasAttribute('href')).toBe(false)
        await fireEvent.click(root)
        expect(clicks).toBe(1)
      })

      it('forwards aria-pressed to the button root of a clickable row of any variant', () => {
        const { getByRole } = render(Item, {
          props: { clickable: true, size: 'small' },
          attrs: { 'aria-pressed': 'true' },
          slots: { default: 'Chosen' }
        })
        const root = getByRole('button', { name: 'Chosen', pressed: true })
        expect(root.getAttribute('data-variant')).toBe('default')
        expect(root.hasAttribute('data-selected')).toBe(false)
      })

      it('reads as a checked radio and fills like a pressed row when role is radio', () => {
        const { getByRole } = render(Item, {
          props: { clickable: true, size: 'small' },
          attrs: { role: 'radio', 'aria-checked': 'true' },
          slots: { default: 'Chosen' }
        })
        const root = getByRole('radio', { name: 'Chosen', checked: true })
        expect(root.classList.contains('aria-checked:bg-(--bg-selected)')).toBe(true)
      })

      it('prefers the anchor when both href and clickable are set', () => {
        const { getByTestId } = render(Item, {
          props: { href: '#one', clickable: true },
          slots: { default: 'One' }
        })
        expect(getByTestId('item').tagName).toBe('A')
      })

      it('renders a div root by default', () => {
        const { getByTestId } = render(Item, { slots: { default: 'Row' } })
        const root = getByTestId('item')
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
        expect(getByTestId('item').getAttribute('data-slot')).toBe('item')
        expect(getByTestId('item-content')).toBeTruthy()
        expect(getByTestId('item-title').textContent?.trim()).toBe('storefront-prod')
        expect(getByTestId('item-actions')).toBeTruthy()
        expect(getByText('Deployed from main')).toBeTruthy()
      })

      it('gives every row of the list examples its own title', () => {
        for (const Story of [WithList, WithListLinks]) {
          const { getAllByTestId, unmount } = render(Story)
          const titles = getAllByTestId('item-title').map((title) => title.textContent?.trim())
          expect(new Set(titles).size).toBe(titles.length)
          expect(titles).not.toContain('Basic Item')
          unmount()
        }
      })

      it('writes the inline and icon titles in sentence case', () => {
        for (const Story of [Inline, WithIconMedia]) {
          const { getAllByTestId, unmount } = render(Story)
          for (const title of getAllByTestId('item-title')) {
            const words = title.textContent?.trim().split(/\s+/) ?? []
            expect(words.slice(1).every((word) => word === word.toLowerCase())).toBe(true)
          }
          unmount()
        }
      })

      it.each([
        ['Outline', Outline, 'outline', 'medium'],
        ['Muted', Muted, 'muted', 'medium'],
        ['Small', Small, 'outline', 'small']
      ])('%s story sets the root variant/size from its args', (_name, Story, variant, size) => {
        const { getByTestId } = render(Story)
        const root = getByTestId('item')
        expect(root.getAttribute('data-variant')).toBe(variant)
        expect(root.getAttribute('data-size')).toBe(size)
      })

      it('Groups story wraps rows in a role="list" and renders separators from context', () => {
        const { getByRole, getAllByText } = render(Groups)
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
          <Item variant="outline">
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

      it('Groups example has no violations', async () => {
        const { container } = render(Groups)
        await expectNoA11yViolations(container)
      })
    })

    describe('variant="option" — chooser rows', () => {
      it('marks each row as an option row on its button and follows the pressed choice', async () => {
        const { getByRole, getAllByRole, container } = render(Option)
        const rows = getAllByRole('button')
        expect(rows).toHaveLength(4)
        for (const row of rows) expect(row.getAttribute('data-variant')).toBe('option')
        expect(getByRole('button', { name: 'workload_02' }).getAttribute('aria-pressed')).toBe(
          'true'
        )

        await fireEvent.click(getByRole('button', { name: 'workload_04' }))
        expect(getByRole('button', { name: 'workload_04' }).getAttribute('aria-pressed')).toBe(
          'true'
        )
        expect(getByRole('button', { name: 'workload_02' }).getAttribute('aria-pressed')).toBe(
          'false'
        )
        await expectNoA11yViolations(container)
      })

      it('narrows the rows from the search field', async () => {
        const { getByRole, getAllByRole } = render(Option)
        await fireEvent.update(getByRole('textbox', { name: 'Find workload' }), '03')
        expect(getAllByRole('button').map((row) => row.textContent?.trim())).toEqual([
          'workload_03'
        ])
      })
    })

    describe('list structure (Item.List and Item.Group own the listitem role)', () => {
      it('exposes Item.Group rows as listitems and hides its separators from the list', () => {
        const { getByRole } = render(Groups)
        const list = getByRole('list')
        Array.from(list.children).forEach((child) => {
          const expected =
            child.getAttribute('data-slot') === 'item-separator' ? 'none' : 'listitem'
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
        expect(getByTestId('item').hasAttribute('role')).toBe(false)
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
})
