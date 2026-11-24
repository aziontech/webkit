import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import DefaultExample from '../../../../examples/markdown-editor/default.vue'
import DisabledExample from '../../../../examples/markdown-editor/disabled.vue'
import InvalidExample from '../../../../examples/markdown-editor/invalid.vue'
import ReadonlyExample from '../../../../examples/markdown-editor/readonly.vue'
import WithFooterExample from '../../../../examples/markdown-editor/with-footer.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { formatMarkdown } from './lib/markdown-format'
import MarkdownEditor from './markdown-editor.vue'

const PEOPLE = [
  { value: 'jane.doe', label: 'Jane Doe', description: 'jane.doe@example.com' },
  { value: 'john.smith', label: 'John Smith', description: 'john.smith@example.com' },
  { value: 'priya.patel', label: 'Priya Patel' }
]

const apple = /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)
const MOD = apple ? { metaKey: true } : { ctrlKey: true }

function mountEditor(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const value = ref((props['modelValue'] as string | undefined) ?? '')
  const onMention = vi.fn()
  const Host = defineComponent({
    setup: () => () =>
      h(MarkdownEditor, {
        ...props,
        ...attrs,
        modelValue: value.value,
        'onUpdate:modelValue': (next: string) => {
          value.value = next
        },
        'onMention-select': onMention
      })
  })
  const utils = render(Host)
  const field = utils.getByTestId('markdown-editor__field') as HTMLTextAreaElement
  return { ...utils, value, field, onMention }
}

function select(field: HTMLTextAreaElement, start: number, end: number) {
  field.focus()
  field.setSelectionRange(start, end)
}

describe('MarkdownEditor', () => {
  describe('render', () => {
    it('renders the root with its own test id, the Write tab open and an empty field', () => {
      const { getByTestId, field } = mountEditor({ placeholder: 'Write a reply' })
      const root = getByTestId('markdown-editor')
      expect(root).toHaveAttribute('data-tab', 'write')
      expect(root).toHaveAttribute('data-slot', 'markdown-editor')
      expect(root).toHaveAttribute('data-mention-state', 'closed')
      expect(field.tagName).toBe('TEXTAREA')
      expect(field).toHaveAttribute('placeholder', 'Write a reply')
      expect(field).toHaveAttribute('data-auto-resize')
    })

    it('lets a consumer data-testid win and keeps the consumer class on the root', () => {
      const { getByTestId } = render(MarkdownEditor, {
        attrs: { 'data-testid': 'reply', class: 'max-w-(--container-md)' }
      })
      expect(getByTestId('reply')).toHaveClass('max-w-(--container-md)')
      expect(getByTestId('reply__field').tagName).toBe('TEXTAREA')
    })

    it('forwards other attributes to the field', () => {
      const { field } = mountEditor({}, { name: 'reply', maxlength: 500 })
      expect(field).toHaveAttribute('name', 'reply')
      expect(field).toHaveAttribute('maxlength', '500')
    })

    it('renders the footer slot only when it is filled', () => {
      const empty = render(MarkdownEditor)
      expect(empty.queryByTestId('markdown-editor__footer')).toBeNull()
      empty.unmount()
      const { getByTestId, getByRole } = render(WithFooterExample)
      expect(getByTestId('markdown-editor__footer')).toContainElement(
        getByRole('button', { name: 'Send reply' })
      )
    })
  })

  describe('accessible name', () => {
    it('falls back to the built-in Message label', () => {
      const { field } = mountEditor()
      expect(field).toHaveAccessibleName('Message')
    })

    it('takes the ariaLabel prop', () => {
      const { field } = mountEditor({ ariaLabel: 'Internal note' })
      expect(field).toHaveAccessibleName('Internal note')
    })

    it('is named by the wrapping Field label, with no built-in label', () => {
      const { getByRole } = render(DefaultExample)
      const field = getByRole('textbox', { name: 'Reply' })
      expect(field).not.toHaveAttribute('aria-label')
    })
  })

  describe('toolbar', () => {
    it('is a labelled toolbar that controls the field, with one tab stop', () => {
      const { getByRole, field } = mountEditor()
      const toolbar = getByRole('toolbar', { name: 'Formatting' })
      expect(toolbar).toHaveAttribute('aria-controls', field.id)
      const buttons = toolbar.querySelectorAll('button')
      expect(buttons).toHaveLength(7)
      expect([...buttons].filter((button) => button.tabIndex === 0)).toHaveLength(1)
    })

    it('names each button and declares the three shortcuts', () => {
      const { getByRole } = mountEditor()
      for (const name of [
        'Bold',
        'Italic',
        'Link',
        'Bulleted list',
        'Numbered list',
        'Quote',
        'Code'
      ])
        expect(getByRole('button', { name })).toBeInTheDocument()
      expect(getByRole('button', { name: 'Bold' })).toHaveAttribute(
        'aria-keyshortcuts',
        'Meta+B Control+B'
      )
      expect(getByRole('button', { name: 'Quote' })).not.toHaveAttribute('aria-keyshortcuts')
    })

    it('wraps the selection in bold and keeps the text selected', async () => {
      const { getByRole, field, value } = mountEditor({ modelValue: 'ship it now' })
      select(field, 5, 7)
      await userEvent.click(getByRole('button', { name: 'Bold' }))
      expect(value.value).toBe('ship **it** now')
      expect(document.activeElement).toBe(field)
      expect(field.value.slice(field.selectionStart, field.selectionEnd)).toBe('it')
    })

    it('prefixes every selected line for a bulleted list and removes it on a second press', async () => {
      const { getByRole, field, value } = mountEditor({ modelValue: 'one\ntwo' })
      select(field, 0, 7)
      await userEvent.click(getByRole('button', { name: 'Bulleted list' }))
      expect(value.value).toBe('- one\n- two')
      select(field, 0, field.value.length)
      await userEvent.click(getByRole('button', { name: 'Bulleted list' }))
      expect(value.value).toBe('one\ntwo')
    })

    it('moves focus with the arrow keys, Home and End', async () => {
      const { getByRole } = mountEditor()
      const bold = getByRole('button', { name: 'Bold' })
      bold.focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(document.activeElement).toBe(getByRole('button', { name: 'Italic' }))
      await userEvent.keyboard('{End}')
      expect(document.activeElement).toBe(getByRole('button', { name: 'Code' }))
      await userEvent.keyboard('{Home}')
      expect(document.activeElement).toBe(bold)
      await userEvent.keyboard('{ArrowLeft}')
      expect(document.activeElement).toBe(getByRole('button', { name: 'Code' }))
    })

    it('swaps the arrow keys under dir="rtl"', async () => {
      const Host = defineComponent({
        setup: () => () => h('div', { dir: 'rtl' }, [h(MarkdownEditor)])
      })
      const { getByRole } = render(Host)
      getByRole('button', { name: 'Bold' }).focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(document.activeElement).toBe(getByRole('button', { name: 'Italic' }))
    })
  })

  describe('keyboard shortcuts', () => {
    it('applies bold, italic and link from Ctrl or Command with B, I and K', async () => {
      const { field, value } = mountEditor({ modelValue: 'docs' })
      select(field, 0, 4)
      await fireEvent.keyDown(field, { key: 'b', code: 'KeyB', ...MOD })
      expect(value.value).toBe('**docs**')
      select(field, 0, 0)
      await fireEvent.keyDown(field, { key: 'i', code: 'KeyI', ...MOD })
      expect(value.value).toBe('__**docs**')
      field.value = 'docs'
      await fireEvent.input(field)
      select(field, 0, 4)
      await fireEvent.keyDown(field, { key: 'k', code: 'KeyK', ...MOD })
      expect(value.value).toBe('[docs](url)')
      expect(field.value.slice(field.selectionStart, field.selectionEnd)).toBe('url')
    })
  })

  describe('suppression', () => {
    it('disables the field, the toolbar and the tabs when disabled', () => {
      const { getByRole, getByTestId } = render(DisabledExample)
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-disabled')
      expect(getByRole('textbox')).toBeDisabled()
      expect(getByRole('button', { name: 'Bold' })).toBeDisabled()
      expect(getByRole('tab', { name: 'Preview' })).toBeDisabled()
    })

    it('keeps the value unchanged on shortcuts and the menu closed when readonly', async () => {
      const { field, value, getByRole, getByTestId } = mountEditor({
        modelValue: 'hello',
        readonly: true,
        mentions: PEOPLE
      })
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-readonly')
      expect(getByRole('button', { name: 'Bold' })).toBeDisabled()
      select(field, 0, 5)
      await fireEvent.keyDown(field, { key: 'b', code: 'KeyB', ...MOD })
      expect(value.value).toBe('hello')
      field.setSelectionRange(5, 5)
      await fireEvent.click(field)
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-mention-state', 'closed')
    })
  })

  describe('mentions', () => {
    it('opens a filtered listbox after @ and wires the combobox attributes', async () => {
      const { field, findByRole, getByTestId } = mountEditor({ mentions: PEOPLE })
      expect(field).toHaveAttribute('aria-autocomplete', 'list')
      await userEvent.click(field)
      await userEvent.keyboard('Hi @jo')
      const list = await findByRole('listbox', { name: 'People' })
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-mention-state', 'open')
      expect(list.querySelectorAll('[role="option"]')).toHaveLength(1)
      expect(field).toHaveAttribute('aria-controls', list.id)
      expect(field).toHaveAttribute('aria-activedescendant', `${list.id}-0`)
    })

    it('does not open in the middle of a word', async () => {
      const { field, queryByRole } = mountEditor({ mentions: PEOPLE })
      await userEvent.click(field)
      await userEvent.keyboard('jane@exa')
      expect(queryByRole('listbox')).toBeNull()
    })

    it('moves with the arrows and inserts @value on Enter, emitting mention-select', async () => {
      const { field, value, onMention, queryByRole } = mountEditor({ mentions: PEOPLE })
      await userEvent.click(field)
      await userEvent.keyboard('cc @')
      await userEvent.keyboard('{ArrowDown}')
      expect(field.getAttribute('aria-activedescendant')).toMatch(/-1$/)
      await userEvent.keyboard('{Enter}')
      expect(value.value).toBe('cc @john.smith ')
      expect(queryByRole('listbox')).toBeNull()
      expect(onMention).toHaveBeenCalledTimes(1)
      const [event, mention] = onMention.mock.calls[0]!
      expect(event).toBeInstanceOf(KeyboardEvent)
      expect(mention).toEqual(PEOPLE[1])
    })

    it('inserts on Tab and keeps focus in the field', async () => {
      const { field, value } = mountEditor({ mentions: PEOPLE })
      await userEvent.click(field)
      await userEvent.keyboard('@pri{Tab}')
      expect(value.value).toBe('@priya.patel ')
      expect(document.activeElement).toBe(field)
    })

    it('inserts on a click with a MouseEvent payload', async () => {
      const { field, value, getByRole, onMention } = mountEditor({ mentions: PEOPLE })
      await userEvent.click(field)
      await userEvent.keyboard('@ja')
      await userEvent.click(getByRole('option', { name: /Jane Doe/ }))
      expect(value.value).toBe('@jane.doe ')
      expect(onMention.mock.calls[0]![0]).toBeInstanceOf(MouseEvent)
      expect(onMention.mock.calls[0]![1]).toEqual(PEOPLE[0])
    })

    it('closes on Escape without letting the key reach a parent', async () => {
      const onParentKeydown = vi.fn()
      const Host = defineComponent({
        setup: () => () =>
          h('div', { onKeydown: onParentKeydown }, [h(MarkdownEditor, { mentions: PEOPLE })])
      })
      const { getByRole, queryByRole } = render(Host)
      await userEvent.click(getByRole('textbox'))
      await userEvent.keyboard('@')
      expect(getByRole('listbox')).toBeInTheDocument()
      onParentKeydown.mockClear()
      await userEvent.keyboard('{Escape}')
      expect(queryByRole('listbox')).toBeNull()
      expect(onParentKeydown).not.toHaveBeenCalled()
    })

    it('renders the option text with dir="auto"', async () => {
      const { field, getByRole } = mountEditor({ mentions: PEOPLE })
      await userEvent.click(field)
      await userEvent.keyboard('@jane')
      const option = getByRole('option', { name: /Jane Doe/ })
      expect(option.querySelectorAll('[dir="auto"]')).toHaveLength(2)
    })
  })

  describe('preview', () => {
    it('shows the empty text when there is nothing to preview', async () => {
      const { getByRole, getByTestId } = mountEditor()
      await userEvent.click(getByRole('tab', { name: 'Preview' }))
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-tab', 'preview')
      expect(getByTestId('markdown-editor__empty')).toHaveTextContent('Nothing to preview')
      expect(() => getByRole('toolbar')).toThrow()
    })

    it('renders the Markdown with the field typography in a focusable box', async () => {
      const { getByRole, getByTestId } = mountEditor({ modelValue: 'Hi **Jane**' })
      await userEvent.click(getByRole('tab', { name: 'Preview' }))
      const box = getByTestId('markdown-editor__preview-box')
      expect(box).toHaveAttribute('tabindex', '0')
      expect(box).toHaveAttribute('dir', 'auto')
      const rendered = await waitFor(() => getByTestId('markdown-editor__rendered'))
      expect(rendered.querySelector('strong')).toHaveTextContent('Jane')
      expect(rendered).toHaveClass('text-body-xs')
      expect(rendered).not.toHaveClass('text-body-lg')
      await waitFor(() => expect(box).not.toHaveAttribute('aria-busy'))
      expect(getByTestId('markdown-editor__preview-panel')).toHaveAttribute('tabindex', '-1')
    })

    it('marks the invalid state on the preview box', async () => {
      const { getByRole, getByTestId } = render(InvalidExample)
      await userEvent.click(getByRole('tab', { name: 'Preview' }))
      expect(getByTestId('markdown-editor__preview-box')).toHaveAttribute('data-invalid')
    })
  })

  describe('field composition', () => {
    it('takes invalid and required from the wrapping Field', () => {
      const { getByRole, getByTestId } = render(InvalidExample)
      const field = getByRole('textbox', { name: /Reply/ })
      expect(field).toHaveAttribute('aria-invalid', 'true')
      expect(field).toHaveAttribute('aria-required', 'true')
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-invalid')
    })

    it('exposes focus(), which returns to the Write tab', async () => {
      const editor = ref<InstanceType<typeof MarkdownEditor> | null>(null)
      const Host = defineComponent({
        setup: () => () => h(MarkdownEditor, { ref: editor })
      })
      const { getByRole } = render(Host)
      await userEvent.click(getByRole('tab', { name: 'Preview' }))
      editor.value?.focus()
      await nextTick()
      await nextTick()
      expect(document.activeElement).toBe(getByRole('textbox'))
    })
  })

  describe('insert()', () => {
    function mountWithRef(props: Record<string, unknown> = {}) {
      const editor = ref<InstanceType<typeof MarkdownEditor> | null>(null)
      const value = ref((props['modelValue'] as string | undefined) ?? '')
      const Host = defineComponent({
        setup: () => () =>
          h('div', [
            h(MarkdownEditor, {
              ...props,
              ref: editor,
              modelValue: value.value,
              'onUpdate:modelValue': (next: string) => {
                value.value = next
              }
            }),
            h('button', { type: 'button', 'data-testid': 'other' }, 'Other')
          ])
      })
      const utils = render(Host)
      const field = utils.getByTestId('markdown-editor__field') as HTMLTextAreaElement
      return { ...utils, editor, value, field }
    }

    it('inserts at the caret, updates v-model and leaves the caret after the text', async () => {
      const { editor, value, field } = mountWithRef({ modelValue: 'Hi , thanks' })
      select(field, 3, 3)
      await editor.value?.insert('{{requester.name}}')
      expect(value.value).toBe('Hi {{requester.name}}, thanks')
      expect(document.activeElement).toBe(field)
      expect(field.selectionStart).toBe(21)
      expect(field.selectionEnd).toBe(21)
    })

    it('replaces the selected text', async () => {
      const { editor, value, field } = mountWithRef({ modelValue: 'Hello NAME' })
      select(field, 6, 10)
      await editor.value?.insert('Jane')
      expect(value.value).toBe('Hello Jane')
      expect(field.selectionStart).toBe(10)
    })

    it('is undone in one step', async () => {
      const { editor, value, field } = mountWithRef({ modelValue: 'Hello ' })
      select(field, 6, 6)
      await editor.value?.insert('{{ticket.id}}')
      expect(value.value).toBe('Hello {{ticket.id}}')
      document.execCommand('undo')
      await nextTick()
      expect(value.value).toBe('Hello ')
    })

    it('keeps focus in the field when another control takes it in the same task', async () => {
      const { editor, value, field, getByTestId } = mountWithRef({ modelValue: '' })
      const pending = editor.value?.insert('{{agent.name}}')
      getByTestId('other').focus()
      await pending
      expect(value.value).toBe('{{agent.name}}')
      expect(document.activeElement).toBe(field)
    })

    it('switches from Preview back to Write and inserts at the remembered caret', async () => {
      const { editor, value, field, getByRole, getByTestId } = mountWithRef({ modelValue: 'Hi' })
      select(field, 0, 0)
      await userEvent.click(getByRole('tab', { name: 'Preview' }))
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-tab', 'preview')
      await editor.value?.insert('Oh, ')
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-tab', 'write')
      expect(value.value).toBe('Oh, Hi')
      expect(document.activeElement).toBe(getByTestId('markdown-editor__field'))
    })

    it('inserts at the end of the value when the field never had focus', async () => {
      const { editor, value } = mountWithRef({ modelValue: 'Thanks, ' })
      await editor.value?.insert('{{agent.name}}')
      expect(value.value).toBe('Thanks, {{agent.name}}')
    })

    it('never opens the mention menu', async () => {
      const { editor, value, getByTestId } = mountWithRef({ modelValue: '', mentions: PEOPLE })
      await editor.value?.insert('@ja')
      expect(value.value).toBe('@ja')
      expect(getByTestId('markdown-editor')).toHaveAttribute('data-mention-state', 'closed')
    })

    it('does nothing when disabled, readonly or given empty text', async () => {
      for (const props of [{ disabled: true }, { readonly: true }, {}]) {
        const { editor, value, unmount } = mountWithRef({ ...props, modelValue: 'Hi' })
        await editor.value?.insert(Object.keys(props).length ? 'x' : '')
        expect(value.value).toBe('Hi')
        unmount()
      }
    })
  })

  describe('a11y', () => {
    it.each([
      ['default', DefaultExample],
      ['readonly', ReadonlyExample],
      ['invalid', InvalidExample],
      ['with footer', WithFooterExample]
    ])('has no axe violations (%s)', async (_name, example) => {
      const { container } = render(example)
      await expectNoA11yViolations(container)
    })

    it('has no axe violations with the mention menu open and on the Preview tab', async () => {
      const { container, getByRole } = render(DefaultExample)
      await userEvent.click(getByRole('textbox'))
      await userEvent.keyboard('@')
      await expectNoA11yViolations(container)
      await userEvent.keyboard('{Escape}')
      await userEvent.click(getByRole('tab', { name: 'Preview' }))
      await expectNoA11yViolations(container)
    })
  })

  describe('formatMarkdown', () => {
    const at = (value: string, start: number, end = start) => ({ value, start, end })

    it('inserts empty markers with the caret between them', () => {
      expect(formatMarkdown(at('', 0), 'italic', 'url')).toMatchObject({
        text: '__',
        selectStart: 1,
        selectEnd: 1
      })
    })

    it('unwraps a selection already wrapped in the markers', () => {
      expect(formatMarkdown(at('a **b** c', 4, 5), 'bold', 'url')).toMatchObject({
        from: 2,
        to: 7,
        text: 'b'
      })
    })

    it('writes an empty link with the caret inside the brackets', () => {
      expect(formatMarkdown(at('', 0), 'link', 'url')).toMatchObject({
        text: '[](url)',
        selectStart: 1
      })
    })

    it('numbers each line, and strips the numbers when every line has one', () => {
      expect(formatMarkdown(at('a\nb', 0, 3), 'numbered-list', 'url').text).toBe('1. a\n2. b')
      expect(formatMarkdown(at('1. a\n2. b', 0, 9), 'numbered-list', 'url').text).toBe('a\nb')
    })

    it('quotes the whole line around the caret', () => {
      expect(formatMarkdown(at('first\nsecond', 8), 'quote', 'url')).toMatchObject({
        from: 6,
        to: 12,
        text: '> second',
        selectStart: 10
      })
    })

    it('makes inline code for one line and a fenced block for several', () => {
      expect(formatMarkdown(at('run npm i', 4, 9), 'code', 'url').text).toBe('`npm i`')
      expect(formatMarkdown(at('see\na\nb', 4, 7), 'code', 'url').text).toBe('```\na\nb\n```')
      expect(formatMarkdown(at('x a\nb', 2, 5), 'code', 'url').text).toBe('\n```\na\nb\n```')
    })
  })
})
