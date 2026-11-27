import './reflow.css'

import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { defineComponent, h } from 'vue'

import Profile from '../../blocks/account/account-onboarding-form/variants/profile.vue'
import CreateAndDeploy from '../../blocks/create/create-wizard/variants/create-and-deploy.vue'
import EditSchema from '../../blocks/edit/edit-schema/edit-schema.vue'
import RadioGroupCard from '../../examples/radio-group/card.vue'
import AttributeEditorRoot from '../components/input/attribute-editor/attribute-editor.vue'
import { hostable } from './hostable'
import { useToastRegion } from './toast-region'

const AttributeEditor = hostable(AttributeEditorRoot)

useToastRegion()

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const atWidth = async (width: number): Promise<void> => {
  await page.viewport(width, 900)
  await vi.waitFor(() => expect(window.innerWidth).toBe(width))
  await frame()
}

afterEach(async () => {
  await page.viewport(1280, 800)
})

const inside = (inner: DOMRect, outer: DOMRect) =>
  inner.left >= outer.left - 1 && inner.right <= outer.right + 1

const footerOf = (root: globalThis.ParentNode) =>
  root.querySelector<HTMLElement>('[data-testid="wizard__footer"]') as HTMLElement

const buttonsOf = (footer: HTMLElement) => [...footer.querySelectorAll<HTMLElement>('button')]

describe('Wizard footer in the blocks at narrow widths', () => {
  it.each([320, 390])('fits Create Organization in the onboarding card at %i px', async (width) => {
    await atWidth(width)
    const view = render(Profile)
    const create = await view.findByRole('button', { name: 'Create Organization' })
    await frame()
    const footer = footerOf(view.container)
    expect(inside(create.getBoundingClientRect(), footer.getBoundingClientRect())).toBe(true)
    for (const button of buttonsOf(footer)) {
      const rect = button.getBoundingClientRect()
      expect(rect.left).toBeGreaterThanOrEqual(-1)
      expect(rect.right).toBeLessThanOrEqual(width + 1)
    }
  })

  it.each([320, 390])('fits the create wizard footer at %i px', async (width) => {
    await atWidth(width)
    const view = render(CreateAndDeploy)
    await waitFor(() => expect(footerOf(view.container)).toBeTruthy())
    await frame()
    const footer = footerOf(view.container)
    const box = footer.getBoundingClientRect()
    for (const button of buttonsOf(footer)) {
      expect(inside(button.getBoundingClientRect(), box)).toBe(true)
      expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(width + 1)
    }
  })
})

const definition = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'defaultValue', label: 'Default' },
  { key: 'primaryKey', label: 'Primary' }
]

const editorIn = (width: string, reorderable: boolean) =>
  defineComponent({
    setup: () => () =>
      h('div', { style: `width:${width}` }, [
        h(AttributeEditor, {
          items: [
            { name: 'id', type: 'int8', defaultValue: '', primaryKey: 'yes' },
            { name: 'created_at', type: 'timestamptz', defaultValue: '', primaryKey: '' }
          ],
          definition,
          reorderable,
          size: 'large',
          ariaLabel: 'Columns'
        })
      ])
  })

const header = (root: globalThis.ParentNode) =>
  root.querySelector<HTMLElement>('[data-testid="attribute-editor__header"]') as HTMLElement

describe('AttributeEditor rows switch to one line only when every column fits', () => {
  it('stacks four reorderable columns in a 640 px box, each cell at full width', async () => {
    const view = render(editorIn('640px', true))
    await frame()
    expect(view.getByTestId('attribute-editor').dataset['fit']).toBe('3xl')
    expect(getComputedStyle(header(view.container)).display).toBe('none')
    const cell = view.getAllByTestId('attribute-editor__cell')[1]!
    expect(cell.getBoundingClientRect().width).toBeGreaterThan(600)
  })

  it('lays four reorderable columns on one row in a 960 px box, every cell at least 140 px', async () => {
    const view = render(editorIn('960px', true))
    await frame()
    expect(getComputedStyle(header(view.container)).display).toBe('grid')
    const cells = view.getAllByTestId('attribute-editor__cell').slice(0, 4)
    for (const cell of cells) expect(cell.getBoundingClientRect().width).toBeGreaterThanOrEqual(140)
  })

  it('keeps two columns with Remove on one row from md, as before', async () => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h('div', { style: 'width:480px' }, [
            h(AttributeEditor, {
              items: [{ key: 'a', value: 'b' }],
              definition: [
                { key: 'key', label: 'Key' },
                { key: 'value', label: 'Value' }
              ],
              ariaLabel: 'Variables'
            })
          ])
      })
    )
    await frame()
    expect(view.getByTestId('attribute-editor').dataset['fit']).toBe('md')
    expect(getComputedStyle(header(view.container)).display).toBe('grid')
  })
})

describe('edit/edit-schema column Type picker', () => {
  it.each([390, 1280])(
    'gives the Type select at least 140 px and opens a list at least 256 px wide at %i px',
    async (width) => {
      await atWidth(width)
      render(EditSchema)
      const drawer = await waitFor(() => {
        const found = document.querySelector<HTMLElement>('[role="dialog"]')
        expect(found).toBeTruthy()
        return found as HTMLElement
      })
      const columns = drawer.querySelector('[aria-label="Columns"]')!.closest('[data-mode]')!
      const trigger = columns.querySelector<HTMLElement>('[data-testid="select-trigger"]')!
      await vi.waitFor(() =>
        expect(drawer.getBoundingClientRect().right).toBeLessThanOrEqual(width + 1)
      )
      await frame()
      expect(trigger.getBoundingClientRect().width).toBeGreaterThanOrEqual(140)
      await fireEvent.click(trigger)
      const panel = await waitFor(() => {
        const found = document.querySelector<HTMLElement>(
          '[data-testid="select-content"][data-state="open"]'
        )
        expect(found).toBeTruthy()
        return found as HTMLElement
      })
      await frame()
      await frame()
      const rect = panel.getBoundingClientRect()
      expect(rect.width).toBeGreaterThanOrEqual(255)
      expect(rect.left).toBeGreaterThanOrEqual(-1)
      expect(rect.right).toBeLessThanOrEqual(width + 1)
    }
  )
})

describe('RadioGroup card tags', () => {
  it.each([390, 1280])('keep the slotted Tag at its content width at %i px', async (width) => {
    await atWidth(width)
    const { getAllByTestId } = render(RadioGroupCard)
    await frame()
    for (const description of getAllByTestId('radio-group-item__description')) {
      const tag = description.nextElementSibling as HTMLElement
      const column = description.parentElement as HTMLElement
      expect(tag.getBoundingClientRect().width).toBeLessThan(column.getBoundingClientRect().width)
      expect(tag.getBoundingClientRect().width).toBeLessThan(140)
    }
  })
})
