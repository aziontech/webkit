import '../../../test/reflow.css'

import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import Tree, { type TreeItem } from './tree.vue'

const LOGO: TreeItem = { id: 'assets/img/logo.svg', label: 'logo.svg', description: '4.2 KB' }
const IMG: TreeItem = { id: 'assets/img', label: 'img', icon: 'pi pi-folder', children: [LOGO] }
const HERO: TreeItem = { id: 'assets/hero.webp', label: 'hero.webp', description: '182 KB' }
const ASSETS: TreeItem = {
  id: 'assets',
  label: 'assets',
  icon: 'pi pi-folder',
  children: [IMG, HERO]
}
const INDEX: TreeItem = { id: 'src/index.js', label: 'index.js' }
const SRC: TreeItem = { id: 'src', label: 'src', icon: 'pi pi-folder', children: [INDEX] }
const LOCKED: TreeItem = { id: 'locked.txt', label: 'locked.txt', disabled: true }
const CONFIG: TreeItem = { id: 'azion.config.js', label: 'azion.config.js', description: '612 B' }
const ITEMS: TreeItem[] = [ASSETS, SRC, LOCKED, CONFIG]

const mount = (props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) =>
  render(Tree, { props: { ariaLabel: 'Bucket objects', items: ITEMS, ...props }, ...options })

const node = (container: Element, id: string) => {
  const found = container.querySelector<HTMLElement>(`[role="treeitem"][data-item-id="${id}"]`)
  if (!found) throw new Error(`treeitem ${id} not rendered`)
  return found
}

const rowOf = (container: Element, id: string) =>
  node(container, id).firstElementChild as HTMLElement

const tabStops = (container: Element) =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="treeitem"][tabindex="0"]')).map(
    (el) => el.dataset['itemId']
  )

const Harness = defineComponent({
  props: { initialExpanded: { type: Array, default: () => [] } },
  setup(props) {
    const expanded = ref<string[]>([...(props.initialExpanded as string[])])
    const selected = ref('')
    return () => [
      h(Tree, {
        ariaLabel: 'Bucket objects',
        items: ITEMS,
        selectable: true,
        expanded: expanded.value,
        'onUpdate:expanded': (value: string[]) => (expanded.value = value),
        selected: selected.value,
        'onUpdate:selected': (value: string) => (selected.value = value)
      }),
      h('output', { 'data-testid': 'state' }, `${expanded.value.join(',')}|${selected.value}`),
      h('button', { type: 'button', onClick: () => (expanded.value = []) }, 'Collapse all')
    ]
  }
})

describe('Tree', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('data-tree')).toBeTruthy()
    expect(fallback.getAllByTestId('data-tree-item')).toHaveLength(ITEMS.length)
    expect(fallback.getAllByTestId('data-tree-toggle')).toHaveLength(2)
    fallback.unmount()
    const custom = mount({}, { attrs: { 'data-testid': 'objects' } })
    expect(custom.getByTestId('objects')).toBeTruthy()
    expect(custom.getAllByTestId('objects-item')).toHaveLength(ITEMS.length)
    expect(custom.queryByTestId('data-tree')).toBeNull()
  })

  it('follows the tree pattern with level, set size and position on each node', () => {
    const view = mount()
    const tree = view.getByRole('tree', { name: 'Bucket objects' })
    const items = view.getAllByRole('treeitem')
    expect(tree.tagName).toBe('UL')
    expect(items).toHaveLength(4)
    items.forEach((item, index) => {
      expect(item.getAttribute('aria-level')).toBe('1')
      expect(item.getAttribute('aria-setsize')).toBe('4')
      expect(item.getAttribute('aria-posinset')).toBe(String(index + 1))
      expect(item.hasAttribute('aria-selected')).toBe(false)
    })
    expect(node(view.container, 'assets').getAttribute('aria-expanded')).toBe('false')
    expect(node(view.container, 'locked.txt').hasAttribute('aria-expanded')).toBe(false)
    expect(node(view.container, 'locked.txt').getAttribute('aria-disabled')).toBe('true')
    expect(view.getByRole('treeitem', { name: /assets/ })).toBe(node(view.container, 'assets'))
    expect(view.queryByRole('group')).toBeNull()
  })

  it('renders nested groups at least two levels deep', () => {
    const view = mount({ expanded: ['assets', 'assets/img'] })
    expect(view.getAllByRole('group')).toHaveLength(2)
    const logo = node(view.container, LOGO.id)
    expect(logo.getAttribute('aria-level')).toBe('3')
    expect(logo.getAttribute('aria-setsize')).toBe('1')
    expect(logo.getAttribute('aria-posinset')).toBe('1')
    const hero = node(view.container, HERO.id)
    expect(hero.getAttribute('aria-level')).toBe('2')
    expect(hero.getAttribute('aria-posinset')).toBe('2')
    expect(node(view.container, 'assets').getAttribute('aria-expanded')).toBe('true')
    expect(node(view.container, 'assets').contains(logo)).toBe(true)
    expect(view.container.querySelector(`[data-item-id="${INDEX.id}"]`)).toBeNull()
  })

  it('draws the indent guide under the parent chevron and outside the nested rows', () => {
    const view = mount({ expanded: ['assets'] })
    const chevron = node(view.container, 'assets')
      .querySelector<HTMLElement>('[data-tree-toggle]')!
      .getBoundingClientRect()
    const group = view.getByRole('group').getBoundingClientRect()
    const guideCenter = group.left + 0.5
    expect(Math.abs(guideCenter - (chevron.left + chevron.width / 2))).toBeLessThanOrEqual(1)
    const nestedRow = rowOf(view.container, HERO.id).getBoundingClientRect()
    expect(group.left + 1).toBeLessThanOrEqual(nestedRow.left)
  })

  it('ignores unknown and leaf ids in expanded', () => {
    const view = mount({ expanded: ['nope', CONFIG.id] })
    expect(view.queryByRole('group')).toBeNull()
    expect(node(view.container, CONFIG.id).hasAttribute('aria-expanded')).toBe(false)
  })

  it('keeps exactly one tab stop, on the first node by default', () => {
    const view = mount()
    expect(tabStops(view.container)).toEqual(['assets'])
  })

  it('moves focus with the arrow keys, Home and End', async () => {
    const view = mount({ expanded: ['assets'] })
    node(view.container, 'assets').focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(node(view.container, IMG.id))
    expect(tabStops(view.container)).toEqual([IMG.id])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(node(view.container, HERO.id))
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(node(view.container, IMG.id))
    await userEvent.keyboard('{End}')
    expect(document.activeElement).toBe(node(view.container, CONFIG.id))
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(node(view.container, CONFIG.id))
    await userEvent.keyboard('{Home}')
    expect(document.activeElement).toBe(node(view.container, 'assets'))
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(node(view.container, 'assets'))
  })

  it('expands, enters, leaves and collapses with ArrowRight and ArrowLeft', async () => {
    const view = mount()
    node(view.container, 'src').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(view.emitted()['update:expanded']?.[0]).toEqual([['src']])
    expect(node(view.container, 'src').getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(node(view.container, 'src'))
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(node(view.container, INDEX.id))
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(node(view.container, INDEX.id))
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(node(view.container, 'src'))
    await userEvent.keyboard('{ArrowLeft}')
    expect(view.emitted()['update:expanded']?.[1]).toEqual([[]])
    expect(node(view.container, 'src').getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(node(view.container, 'src'))
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(node(view.container, 'src'))
    expect(view.emitted()['update:expanded']).toHaveLength(2)
  })

  it('activates the focused node with Enter and Space', async () => {
    const view = mount()
    node(view.container, CONFIG.id).focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    const clicks = view.emitted()['item-click'] ?? []
    expect(clicks).toHaveLength(2)
    expect(clicks[0]?.[0]).toBeInstanceOf(KeyboardEvent)
    expect(clicks[0]?.[1]).toEqual(CONFIG)
    expect(clicks[1]?.[0]).toBeInstanceOf(KeyboardEvent)
  })

  it('emits item-click with the event first and the node second on a row click', async () => {
    const view = mount()
    await userEvent.click(view.getByText('azion.config.js'))
    const clicks = view.emitted()['item-click'] ?? []
    expect(clicks).toHaveLength(1)
    expect(clicks[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(clicks[0]?.[1]).toEqual(CONFIG)
    expect(document.activeElement).toBe(node(view.container, CONFIG.id))
    expect(tabStops(view.container)).toEqual([CONFIG.id])
  })

  it('does not activate a disabled node, by click or by key', async () => {
    const view = mount({ selectable: true })
    await userEvent.click(view.getByText('locked.txt'))
    node(view.container, LOCKED.id).focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    expect(view.emitted()['item-click']).toBeUndefined()
    expect(view.emitted()['update:selected']).toBeUndefined()
    expect(node(view.container, LOCKED.id).getAttribute('aria-selected')).toBe('false')
  })

  it('toggles a parent from its chevron without emitting item-click', async () => {
    const view = mount()
    const toggle = rowOf(view.container, 'assets').querySelector<HTMLElement>('[data-tree-toggle]')
    expect(toggle?.getAttribute('aria-hidden')).toBe('true')
    expect(toggle?.getAttribute('tabindex')).toBe('-1')
    expect(toggle?.getAttribute('data-state')).toBe('closed')
    await userEvent.click(toggle as HTMLElement)
    expect(view.emitted()['update:expanded']?.[0]).toEqual([['assets']])
    expect(toggle?.getAttribute('data-state')).toBe('open')
    expect(node(view.container, IMG.id)).toBeTruthy()
    await userEvent.click(toggle as HTMLElement)
    expect(view.emitted()['update:expanded']?.[1]).toEqual([[]])
    expect(view.emitted()['item-click']).toBeUndefined()
  })

  it('selects on activation when selectable and marks the node aria-selected', async () => {
    const view = mount({ selectable: true })
    expect(node(view.container, 'src').getAttribute('aria-selected')).toBe('false')
    await userEvent.click(view.getByText('src'))
    expect(view.emitted()['update:selected']).toEqual([['src']])
    expect(node(view.container, 'src').getAttribute('aria-selected')).toBe('true')
    expect(rowOf(view.container, 'src').hasAttribute('data-selected')).toBe(true)
    expect(view.emitted()['item-click']).toHaveLength(1)
    await userEvent.click(view.getByText('src'))
    expect(view.emitted()['update:selected']).toHaveLength(1)
    expect(view.emitted()['item-click']).toHaveLength(2)
  })

  it('does not read or write the selection while not selectable', async () => {
    const view = mount({ selected: 'src' })
    expect(node(view.container, 'src').hasAttribute('aria-selected')).toBe(false)
    await userEvent.click(view.getByText(CONFIG.label))
    expect(view.emitted()['update:selected']).toBeUndefined()
  })

  it('round-trips v-model:expanded and v-model:selected', async () => {
    const view = render(Harness)
    const state = view.getByTestId('state')
    node(view.container, 'assets').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(state.textContent).toBe('assets|')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    expect(state.textContent).toBe(`assets|${IMG.id}`)
    expect(tabStops(view.container)).toEqual([IMG.id])
    await userEvent.click(view.getByRole('button', { name: 'Collapse all' }))
    expect(state.textContent).toBe(`|${IMG.id}`)
    expect(view.container.querySelector(`[data-item-id="${IMG.id}"]`)).toBeNull()
    expect(tabStops(view.container)).toEqual(['assets'])
  })

  it('moves the tab stop to the nearest visible ancestor when its node is collapsed away', async () => {
    const view = render(Harness, { props: { initialExpanded: ['assets', IMG.id] } })
    node(view.container, LOGO.id).focus()
    await nextTick()
    expect(tabStops(view.container)).toEqual([LOGO.id])
    await userEvent.click(view.getByRole('button', { name: 'Collapse all' }))
    expect(tabStops(view.container)).toEqual(['assets'])
  })

  it('passes the item scope and keeps actions clicks out of activation', async () => {
    const view = mount(
      { expanded: ['assets'] },
      {
        slots: {
          item: (scope: { item: TreeItem; level: number; expanded: boolean }) =>
            h(
              'span',
              { 'data-testid': 'custom-label' },
              `${scope.item.label}:${scope.level}:${scope.expanded}`
            ),
          actions: (scope: { item: TreeItem; level: number }) =>
            h('button', { type: 'button', 'aria-label': `More ${scope.item.label} ${scope.level}` })
        }
      }
    )
    const labels = view.getAllByTestId('custom-label').map((el) => el.textContent)
    expect(labels).toContain('assets:1:true')
    expect(labels).toContain('img:2:false')
    expect(labels).toContain('hero.webp:2:false')
    expect(labels).toContain('src:1:false')
    const more = view.getByRole('button', { name: 'More hero.webp 2' })
    node(view.container, 'assets').focus()
    await userEvent.click(more)
    expect(view.emitted()['item-click']).toBeUndefined()
    expect(tabStops(view.container)).toEqual(['assets'])
    more.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(more)
    expect(node(view.container, 'assets').getAttribute('aria-labelledby')).toBeTruthy()
    expect(view.getByRole('treeitem', { name: 'hero.webp:2:false' })).toBe(
      node(view.container, HERO.id)
    )
  })

  it('renders the default label fallback with glyph, label and description', () => {
    const view = mount()
    const row = rowOf(view.container, CONFIG.id)
    expect(row.textContent).toContain('azion.config.js')
    expect(row.textContent).toContain('612 B')
    expect(rowOf(view.container, 'assets').querySelector('i.pi-folder')).toBeTruthy()
    expect(view.container.querySelector('[data-tree-actions]')).toBeNull()
  })

  it('renders five skeleton rows and aria-busy while loading', () => {
    const view = mount({ loading: true })
    const root = view.getByTestId('data-tree')
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-loading')).toBe(true)
    expect(view.getAllByTestId('feedback-skeleton')).toHaveLength(5)
    expect(view.queryByRole('tree')).toBeNull()
    expect(view.queryAllByRole('treeitem')).toHaveLength(0)
  })

  it('renders the empty state when items is empty, and the empty slot over it', () => {
    const fallback = mount({
      items: [],
      emptyTitle: 'No objects',
      emptyDescription: 'Upload a file.'
    })
    expect(fallback.getByTestId('data-tree').hasAttribute('data-empty')).toBe(true)
    expect(fallback.getByText('No objects')).toBeTruthy()
    expect(fallback.getByText('Upload a file.')).toBeTruthy()
    expect(fallback.queryByRole('tree')).toBeNull()
    fallback.unmount()
    const slotted = mount({ items: [] }, { slots: { empty: () => h('p', 'Nothing here') } })
    expect(slotted.getByText('Nothing here')).toBeTruthy()
    expect(slotted.queryByText('No items')).toBeNull()
  })

  it('has no axe violations in the default, nested, selectable, loading and empty renders', async () => {
    const plain = mount()
    await expectNoA11yViolations(plain.container)
    plain.unmount()
    const nested = mount({ selectable: true, selected: LOGO.id, expanded: ['assets', IMG.id] })
    await expectNoA11yViolations(nested.container)
    nested.unmount()
    const loading = mount({ loading: true })
    await expectNoA11yViolations(loading.container)
    loading.unmount()
    const empty = mount({ items: [] })
    await expectNoA11yViolations(empty.container)
  })
})
