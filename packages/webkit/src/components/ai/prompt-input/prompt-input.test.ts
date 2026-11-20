import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent as keys } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import DefaultExample from '../../../../examples/prompt-input/default.vue'
import ShortcutMenus from '../../../../examples/prompt-input/shortcut-menus.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import PromptInputCompound from './index'
import PromptInput from './prompt-input.vue'

function harness(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const submitted: string[] = []
  const submitEvents: Event[] = []
  const stops: Event[] = []
  const value = ref((props.initial as string) ?? '')
  const Host = defineComponent({
    setup: () => () =>
      h(
        PromptInput,
        {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => (value.value = next),
          onSubmit: (event: Event, payload: { value: string }) => {
            submitEvents.push(event)
            submitted.push(payload.value)
          },
          onStop: (event: Event) => stops.push(event)
        },
        slots
      )
  })
  return { ...render(Host), value, submitted, submitEvents, stops }
}

describe('PromptInput', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(PromptInput).getByTestId('prompt-input')).toBeTruthy()
    expect(
      render(PromptInput, { attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('names the text area and shows the placeholder from the catalog', () => {
    const { getByRole } = render(PromptInput)
    const textarea = getByRole('textbox', { name: 'Prompt' })
    expect(textarea).toHaveAttribute('placeholder', 'Ask a question')
    expect(textarea).toHaveAttribute('enterkeyhint', 'send')
  })

  it('submits the trimmed prompt on Enter and adds a line on Shift+Enter', async () => {
    const { getByRole, value, submitted, submitEvents } = harness()
    const textarea = getByRole('textbox')
    await userEvent.click(textarea)
    await userEvent.keyboard('  first line{Shift>}{Enter}{/Shift}second  ')
    expect(value.value).toBe('  first line\nsecond  ')
    expect(submitted).toEqual([])
    await userEvent.keyboard('{Enter}')
    expect(submitted).toEqual(['first line\nsecond'])
    expect(submitEvents[0]).toBeInstanceOf(KeyboardEvent)
  })

  it('submits from the Submit button, which stays disabled while empty', async () => {
    const { getByRole, submitted, submitEvents } = harness()
    const submit = getByRole('button', { name: 'Submit' })
    expect(submit).toBeDisabled()
    await userEvent.type(getByRole('textbox'), 'Purge one URL')
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)
    expect(submitted).toEqual(['Purge one URL'])
    expect(submitEvents[0]).toBeInstanceOf(MouseEvent)
  })

  it('does not submit during an IME composition', async () => {
    const { getByRole, submitted } = harness({ initial: 'かな' })
    const textarea = getByRole('textbox')
    textarea.dispatchEvent(new CompositionEvent('compositionstart'))
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(submitted).toEqual([])
    textarea.dispatchEvent(new CompositionEvent('compositionend'))
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(submitted).toEqual(['かな'])
  })

  it.each(['pending', 'streaming'] as const)(
    'swaps Submit for Stop while %s and blocks Enter',
    async (status) => {
      const { getByRole, queryByRole, submitted, stops, container } = harness({
        initial: 'next prompt',
        status
      })
      expect(container.querySelector('[data-status]')).toHaveAttribute('data-status', status)
      expect(queryByRole('button', { name: 'Submit' })).toBeNull()
      const textarea = getByRole('textbox')
      expect(textarea).not.toBeDisabled()
      await userEvent.click(textarea)
      await userEvent.keyboard('{Enter}')
      expect(submitted).toEqual([])
      await userEvent.click(getByRole('button', { name: 'Stop generating' }))
      expect(stops).toHaveLength(1)
      expect(stops[0]).toBeInstanceOf(MouseEvent)
    }
  )

  it.each(['pending', 'streaming'] as const)(
    'keeps Stop and submits beside it while %s with queueable',
    async (status) => {
      const { getByRole, queryByRole, submitted, stops, value } = harness({
        initial: 'next prompt',
        status,
        queueable: true
      })
      const stop = getByRole('button', { name: 'Stop generating' })
      const send = getByRole('button', { name: 'Submit' })
      expect(stop.compareDocumentPosition(send) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      await userEvent.click(getByRole('textbox'))
      await userEvent.keyboard('{Enter}')
      expect(submitted).toEqual(['next prompt'])
      await userEvent.click(send)
      expect(submitted).toEqual(['next prompt', 'next prompt'])
      value.value = ''
      await nextTick()
      expect(queryByRole('button', { name: 'Submit' })).toBeNull()
      await userEvent.click(stop)
      expect(stops).toHaveLength(1)
    }
  )

  it('counts characters and blocks submit over the limit', async () => {
    const { getByRole, getByTestId, submitted } = harness({ initial: 'abcdef', maxLength: 4 })
    const textarea = getByRole('textbox')
    expect(getByTestId('prompt-input__counter')).toHaveTextContent('6/4')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea.getAttribute('aria-describedby')).toContain(
      getByTestId('prompt-input__counter').id
    )
    expect(getByTestId('prompt-input__limit')).toHaveTextContent('2 characters over the limit')
    expect(getByRole('button', { name: 'Submit' })).toBeDisabled()
    await userEvent.click(textarea)
    await userEvent.keyboard('{Enter}')
    expect(submitted).toEqual([])
  })

  it('disables the text area, submit and the actions slot', () => {
    const { getByRole } = harness(
      { initial: 'x', disabled: true },
      { actions: () => h('button', { type: 'button' }, 'Attach') }
    )
    expect(getByRole('textbox')).toBeDisabled()
    expect(getByRole('button', { name: 'Submit' })).toBeDisabled()
    expect(getByRole('button', { name: 'Attach' })).toBeDisabled()
  })

  it('describes the text area with the hint and renders attachments', () => {
    const { getByRole, getByTestId } = harness(
      {},
      { hint: () => 'The AI assistant can make mistakes.', attachments: () => h('span', 'log.txt') }
    )
    const hint = getByTestId('prompt-input__hint')
    expect(getByRole('textbox').getAttribute('aria-describedby')).toContain(hint.id)
    expect(getByTestId('prompt-input__attachments')).toHaveTextContent('log.txt')
  })

  it('grows with the text up to maxRows', async () => {
    const { getByRole } = harness({ maxRows: 3 })
    const textarea = getByRole('textbox') as HTMLTextAreaElement
    const one = textarea.getBoundingClientRect().height
    await userEvent.click(textarea)
    await userEvent.keyboard('a{Shift>}{Enter}{/Shift}b')
    const two = textarea.getBoundingClientRect().height
    expect(two).toBeGreaterThan(one)
    await userEvent.keyboard(
      '{Shift>}{Enter}{/Shift}c{Shift>}{Enter}{/Shift}d{Shift>}{Enter}{/Shift}e'
    )
    const capped = textarea.getBoundingClientRect().height
    expect(textarea.style.overflowY).toBe('auto')
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}f')
    expect(textarea.getBoundingClientRect().height).toBe(capped)
  })

  it('reads its strings from the provider locale', () => {
    const { getByRole } = render(
      defineComponent({
        setup: () => () =>
          h(ConfigProvider, { locale: 'es', catalogs: LOCALES }, { default: () => h(PromptInput) })
      })
    )
    expect(getByRole('textbox')).toHaveAttribute('placeholder', 'Haz una pregunta')
    expect(getByRole('button', { name: 'Enviar' })).toBeTruthy()
  })

  it('focuses the text area from a click anywhere in the box, but not on its controls', async () => {
    const { container } = harness({}, { actions: () => h('button', { type: 'button' }, 'Tools') })
    const box = container.querySelector('[data-testid="prompt-input__box"]') as HTMLElement
    const textarea = screen.getByRole('textbox')
    textarea.blur()
    await userEvent.click(box)
    expect(document.activeElement).toBe(textarea)
    textarea.blur()
    await userEvent.click(screen.getByRole('button', { name: 'Tools' }))
    expect(document.activeElement).not.toBe(textarea)
  })

  it('has no axe violations', async () => {
    const { container } = harness({ initial: 'abc', maxLength: 10 }, { hint: () => 'Disclaimer.' })
    await expectNoA11yViolations(container)
  })

  describe('shortcut menus', () => {
    const textbox = () => document.querySelector<HTMLTextAreaElement>('textarea')!
    const settle = async () => {
      await nextTick()
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    }
    const typeInto = async (input: HTMLTextAreaElement, text: string) => {
      input.focus()
      await keys.keyboard(text)
      await settle()
    }
    const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]')

    it('opens on a trigger at a word start, filters, and is driven from the text area', async () => {
      render(ShortcutMenus)
      const input = textbox()
      expect(input).toHaveAttribute('aria-keyshortcuts', '/ @')
      await typeInto(input, 'Check @im')
      expect(listbox()).toHaveAccessibleName('Resources')
      const options = [...listbox()!.querySelectorAll('[role="option"]')]
      expect(options.map((option) => option.textContent?.trim())).toEqual(['image-resizeFunction'])
      expect(input.getAttribute('aria-controls')).toBe(listbox()!.id)
      expect(input.getAttribute('aria-activedescendant')).toBe(options[0]!.id)
      expect(document.body.textContent).toContain('1 suggestion')
      await expectNoA11yViolations(document.body.firstElementChild as HTMLElement)
    })

    it('opens the menu below the box when there is no room above it, above otherwise', async () => {
      render(ShortcutMenus)
      await typeInto(textbox(), '/')
      expect(listbox()?.dataset['side']).toBe('bottom')
      await keys.keyboard('{Escape}')
      await settle()
      const spacer = document.createElement('div')
      spacer.style.height = `${window.innerHeight - 160}px`
      document.body.prepend(spacer)
      await typeInto(textbox(), ' /')
      expect(listbox()?.dataset['side']).toBe('top')
      spacer.remove()
    })

    it('inserts the choice, adds a reference chip and submits it with the text', async () => {
      const view = render(ShortcutMenus)
      const input = textbox()
      await typeInto(input, 'Why does @')
      await keys.keyboard('{ArrowDown}{Enter}')
      await settle()
      expect(input.value).toBe('Why does @image-resize ')
      expect(listbox()).toBeNull()
      const refs = await view.findByRole('list', { name: 'References' })
      expect(refs.textContent).toContain('@image-resize')
      await typeInto(input, 'fail')
      await keys.keyboard('{Enter}')
      await settle()
      expect(view.getByText(/Sent “Why does @image-resize fail” with @image-resize/)).toBeTruthy()
    })

    it('does not open mid-word, closes on Escape, and Enter submits once closed', async () => {
      const view = render(ShortcutMenus)
      const input = textbox()
      await typeInto(input, 'a/b')
      expect(listbox()).toBeNull()
      await typeInto(input, ' /ex')
      expect(listbox()).toHaveAccessibleName('Commands')
      await keys.keyboard('{Escape}')
      await settle()
      expect(listbox()).toBeNull()
      await keys.keyboard('{Enter}')
      await settle()
      expect(view.getByText(/Sent “a\/b \/ex” with no references/)).toBeTruthy()
    })

    it('removing a reference chip removes its text', async () => {
      const view = render(ShortcutMenus)
      const input = textbox()
      await typeInto(input, '/sum')
      await keys.keyboard('{Tab}')
      await settle()
      expect(input.value).toBe('/summarize ')
      await keys.click(await view.findByRole('button', { name: /Remove/ }))
      await settle()
      expect(input.value).toBe('')
      expect(view.queryByRole('list', { name: 'References' })).toBeNull()
    })
  })

  describe('slot presence', () => {
    it('follows a v-if slot that appears and disappears after mount', async () => {
      const shown = ref(false)
      const { queryByTestId, container } = render({
        components: { PromptInput },
        setup: () => ({ shown }),
        template: `<PromptInput aria-label="Message"><template v-if="shown" #hint><span data-testid="probe">Slotted</span></template></PromptInput>`
      })
      expect(
        (container.querySelector('textarea')?.getAttribute('aria-describedby') ?? '').includes(
          queryByTestId('prompt-input__hint')?.id ?? 'none'
        )
      ).toBe(false)

      shown.value = true
      await nextTick()
      expect(
        (container.querySelector('textarea')?.getAttribute('aria-describedby') ?? '').includes(
          queryByTestId('prompt-input__hint')?.id ?? 'none'
        )
      ).toBe(true)
      expect(queryByTestId('probe')).not.toBeNull()

      shown.value = false
      await nextTick()
      expect(
        (container.querySelector('textarea')?.getAttribute('aria-describedby') ?? '').includes(
          queryByTestId('prompt-input__hint')?.id ?? 'none'
        )
      ).toBe(false)
      expect(queryByTestId('probe')).toBeNull()
    })
  })

  describe('composition', () => {
    const P = PromptInputCompound
    type Scope = Record<string, ReturnType<typeof ref<unknown>>>
    type Slots = Record<string, () => unknown>

    const sample = (name: string, type = 'text/plain', size = 10) =>
      new File(['x'.repeat(size)], name, { type })

    function composer(
      state: Record<string, unknown>,
      build: (
        scope: Scope,
        record: (name: string, ...args: unknown[]) => void
      ) => {
        props?: Record<string, unknown>
        slots?: Slots
      }
    ) {
      const events: { name: string; args: unknown[] }[] = []
      const record = (name: string, ...args: unknown[]) => events.push({ name, args })
      const scope = Object.fromEntries(
        Object.entries(state).map(([key, value]) => [key, ref<unknown>(value)])
      ) as Scope
      const Host = defineComponent({
        setup: () => () => {
          const { props = {}, slots = {} } = build(scope, record)
          return h(P, props, slots)
        }
      })
      return { ...render(Host), events, scope }
    }

    const bind = (scope: Scope, key: string, model = 'modelValue') => ({
      [model]: scope[key]!.value,
      [`onUpdate:${model}`]: (next: unknown) => (scope[key]!.value = next)
    })
    const names = (value: unknown) => (value as { file: File }[]).map((item) => item.file.name)

    function drop(target: Element, files: File[], type: 'dragenter' | 'drop' = 'drop') {
      const transfer = new DataTransfer()
      for (const file of files) transfer.items.add(file)
      target.dispatchEvent(
        new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: transfer })
      )
    }

    it('attaches every part to the compound root', () => {
      expect(PromptInputCompound).toBe(PromptInput)
      for (const part of ['AttachButton', 'DictateButton', 'ModelPicker', 'ContextPicker', 'Tools'])
        expect(PromptInputCompound).toHaveProperty(part)
    })

    it('throws when a part is rendered outside a PromptInput', () => {
      expect(() => render(P.AttachButton)).toThrow(/within a PromptInput/)
    })

    it('picks files with the attach button and submits them with the text', async () => {
      const { getByRole, getByTestId, findByTestId, events, scope } = composer(
        { files: [] },
        (scope, record) => ({
          props: {
            ...bind(scope, 'files', 'files'),
            onSubmit: (event: Event, payload: unknown) => record('submit', event, payload)
          },
          slots: { actions: () => h(P.AttachButton) }
        })
      )
      expect(getByRole('button', { name: 'Attach files' })).toBeTruthy()
      const input = getByTestId('prompt-input-attach-button__input') as HTMLInputElement
      expect(input).toHaveAttribute('multiple')
      const transfer = new DataTransfer()
      transfer.items.add(sample('notes.txt'))
      input.files = transfer.files
      input.dispatchEvent(new Event('change', { bubbles: true }))
      await nextTick()
      expect(names(scope.files!.value)).toEqual(['notes.txt'])
      expect(await findByTestId('prompt-input__files')).toBeTruthy()
      await userEvent.click(getByRole('button', { name: 'Submit' }))
      const submit = events.find((event) => event.name === 'submit')
      expect(names((submit?.args[1] as { files: unknown }).files)).toEqual(['notes.txt'])
    })

    it('takes dropped and pasted files only with an attach button', async () => {
      const without = composer({ files: [] }, (scope) => ({
        props: bind(scope, 'files', 'files')
      }))
      drop(without.getByTestId('prompt-input__box'), [sample('a.txt')])
      await nextTick()
      expect(without.scope.files!.value).toEqual([])
      without.unmount()

      const { getByTestId, queryByTestId, getByRole, scope } = composer({ files: [] }, (scope) => ({
        props: bind(scope, 'files', 'files'),
        slots: { actions: () => h(P.AttachButton) }
      }))
      const box = getByTestId('prompt-input__box')
      drop(box, [sample('a.txt')], 'dragenter')
      await nextTick()
      expect(box).toHaveAttribute('data-dragging')
      expect(getByTestId('prompt-input__drop')).toHaveTextContent('Drop files to attach')
      drop(box, [sample('a.txt')])
      await nextTick()
      expect(box).not.toHaveAttribute('data-dragging')
      expect(queryByTestId('prompt-input__drop')).toBeNull()

      const transfer = new DataTransfer()
      transfer.items.add(sample('shot.png', 'image/png'))
      getByRole('textbox').dispatchEvent(
        new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: transfer })
      )
      await nextTick()
      expect(names(scope.files!.value)).toEqual(['a.txt', 'shot.png'])
    })

    it('rejects files past accept, maxFileSize and maxFiles, and says why', async () => {
      const { getByTestId, events, scope } = composer({ files: [] }, (scope, record) => ({
        props: {
          ...bind(scope, 'files', 'files'),
          accept: '.txt',
          maxFileSize: 100,
          maxFiles: 2,
          onReject: (event: Event, payload: unknown) => record('reject', event, payload)
        },
        slots: { actions: () => h(P.AttachButton) }
      }))
      drop(getByTestId('prompt-input__box'), [
        sample('a.txt'),
        sample('b.png', 'image/png'),
        sample('big.txt', 'text/plain', 500),
        sample('c.txt'),
        sample('d.txt')
      ])
      await nextTick()
      expect(names(scope.files!.value)).toEqual(['a.txt', 'c.txt'])
      expect(events.every((event) => event.args[0] instanceof DragEvent)).toBe(true)
      expect(
        events.map((event) => {
          const payload = event.args[1] as { reason: string; files: File[] }
          return [payload.reason, payload.files.map((file) => file.name)]
        })
      ).toEqual([
        ['accept', ['b.png']],
        ['max-file-size', ['big.txt']],
        ['max-files', ['d.txt']]
      ])
      const line = getByTestId('prompt-input__rejected')
      expect(line).toHaveAttribute('aria-live', 'polite')
      expect(line).toHaveTextContent('1 file not added: not an accepted type')
      expect(line).toHaveTextContent('1 file not added: larger than 100')
      expect(line).toHaveTextContent('1 file not added: up to 2 files')
    })

    it('blocks submit while a file is uploading or failed, and allows files without text', async () => {
      const { getByRole, scope } = composer(
        { files: [{ file: { name: 'a.txt' }, loading: true }] },
        (scope) => ({ props: bind(scope, 'files', 'files') })
      )
      expect(getByRole('button', { name: 'Submit' })).toBeDisabled()
      scope.files!.value = [{ file: { name: 'a.txt' }, error: 'Failed' }]
      await nextTick()
      expect(getByRole('button', { name: 'Submit' })).toBeDisabled()
      scope.files!.value = [{ file: { name: 'a.txt' } }]
      await nextTick()
      expect(getByRole('button', { name: 'Submit' })).toBeEnabled()
    })

    it('shows the voice control while there is nothing to send, then Submit', async () => {
      const { getByRole, queryByRole, events, scope } = composer({ text: '' }, (scope, record) => ({
        props: {
          ...bind(scope, 'text'),
          voice: true,
          'onVoice-start': (event: Event) => record('voice', event)
        }
      }))
      await userEvent.click(getByRole('button', { name: 'Start voice conversation' }))
      expect(events.map((event) => event.name)).toEqual(['voice'])
      expect(events[0]!.args[0]).toBeInstanceOf(MouseEvent)
      expect(queryByRole('button', { name: 'Submit' })).toBeNull()
      scope.text!.value = 'Hello'
      await nextTick()
      expect(queryByRole('button', { name: 'Start voice conversation' })).toBeNull()
      expect(getByRole('button', { name: 'Submit' })).toBeEnabled()
    })

    it('moves focus to the text area when the focused control swaps', async () => {
      const { getByRole, scope } = composer({ text: 'Hello' }, (scope) => ({
        props: { ...bind(scope, 'text'), voice: true, onSubmit: () => (scope.text!.value = '') }
      }))
      await userEvent.click(getByRole('button', { name: 'Submit' }))
      await nextTick()
      await nextTick()
      expect(scope.text!.value).toBe('')
      expect(getByRole('button', { name: 'Start voice conversation' })).toBeTruthy()
      expect(document.activeElement).toBe(getByRole('textbox'))
    })

    it('renders the end and footer slots and disables them with the composer', () => {
      const { getByTestId, getByRole } = composer({}, () => ({
        props: { disabled: true },
        slots: {
          end: () => h('button', { type: 'button' }, 'End'),
          footer: () => h('button', { type: 'button' }, 'Footer')
        }
      }))
      expect(getByTestId('prompt-input__footer')).toHaveAttribute('disabled')
      expect(getByRole('button', { name: 'Footer' })).toBeDisabled()
      expect(getByRole('button', { name: 'End' })).toBeDisabled()
    })

    it('picks a model and a mode from the model picker', async () => {
      const { findByTestId, scope } = composer({ model: 'sol', mode: 'low' }, (scope) => ({
        slots: {
          end: () =>
            h(P.ModelPicker, {
              ...bind(scope, 'model'),
              ...bind(scope, 'mode', 'mode'),
              modeLabel: 'Effort',
              models: [
                { value: 'sol', label: 'Sol 6.1', description: 'Everyday' },
                { value: 'terra', label: 'Terra 6.1' }
              ],
              modes: [
                { value: 'low', label: 'Low' },
                { value: 'high', label: 'High' }
              ]
            })
        }
      }))
      const trigger = await findByTestId('prompt-input-model-picker')
      expect(trigger).toHaveTextContent('Sol 6.1')
      expect(trigger).toHaveTextContent('Low')
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
      await userEvent.click(trigger)
      await userEvent.click(await screen.findByRole('menuitemradio', { name: /Terra 6\.1/ }))
      await userEvent.click(screen.getByRole('menuitemradio', { name: 'High' }))
      expect(scope.model!.value).toBe('terra')
      expect(scope.mode!.value).toBe('high')
      await keys.keyboard('{Escape}')
    })

    it('chooses and removes a context from the context picker', async () => {
      const { findByTestId, scope } = composer({ project: '' }, (scope) => ({
        slots: {
          footer: () =>
            h(P.ContextPicker, {
              ...bind(scope, 'project'),
              placeholder: 'Choose project',
              options: [{ value: 'acme-store', label: 'acme-store' }]
            })
        }
      }))
      const trigger = await findByTestId('prompt-input-context-picker')
      expect(trigger).toHaveTextContent('Choose project')
      await userEvent.click(trigger)
      await userEvent.click(await screen.findByRole('menuitem', { name: /acme-store/ }))
      expect(scope.project!.value).toBe('acme-store')
      await nextTick()
      expect(trigger).toHaveTextContent('acme-store')
      await userEvent.click(trigger)
      await userEvent.click(await screen.findByRole('menuitem', { name: 'Remove context' }))
      expect(scope.project!.value).toBe('')
    })

    it('turns tools on from the menu and off from their chips', async () => {
      const { getByRole, findByRole, scope } = composer({ tools: [] }, (scope) => ({
        slots: {
          footer: () =>
            h(P.Tools, {
              ...bind(scope, 'tools'),
              label: 'Plugins',
              tools: [
                { value: 'search', label: 'Web search' },
                { value: 'research', label: 'Deep research' }
              ]
            })
        }
      }))
      await userEvent.click(await findByRole('button', { name: 'Plugins' }))
      await userEvent.click(await screen.findByRole('menuitemcheckbox', { name: /Deep research/ }))
      await userEvent.click(screen.getByRole('menuitemcheckbox', { name: /Web search/ }))
      expect(scope.tools!.value).toEqual(['search', 'research'])
      await keys.keyboard('{Escape}')
      expect(getByRole('list', { name: 'Enabled tools' })).toHaveTextContent('Web search')
      await userEvent.click(getByRole('button', { name: /Remove Web search/ }))
      expect(scope.tools!.value).toEqual(['research'])
    })

    it('toggles listening with an app transcriber and announces it', async () => {
      const { getByRole, getByTestId, scope } = composer({ on: false }, (scope) => ({
        slots: {
          end: () => h(P.DictateButton, { ...bind(scope, 'on', 'listening'), transcriber: 'app' })
        }
      }))
      await userEvent.click(getByRole('button', { name: 'Dictate' }))
      expect(scope.on!.value).toBe(true)
      expect(getByTestId('prompt-input-dictate-button__status')).toHaveTextContent('Listening')
      await userEvent.click(getByRole('button', { name: 'Stop dictation' }))
      expect(scope.on!.value).toBe(false)
      expect(getByTestId('prompt-input-dictate-button__status')).toHaveTextContent(
        'Dictation stopped'
      )
    })

    it('writes the browser transcript into the prompt, and hides without speech recognition', async () => {
      const scope = window as unknown as Record<string, unknown>
      const saved = [scope.SpeechRecognition, scope.webkitSpeechRecognition]
      scope.SpeechRecognition = undefined
      scope.webkitSpeechRecognition = undefined
      const hidden = composer({}, () => ({ slots: { end: () => h(P.DictateButton) } }))
      await nextTick()
      expect(hidden.queryByTestId('prompt-input-dictate-button')).toBeNull()
      hidden.unmount()

      const created: {
        onresult: ((event: unknown) => void) | null
        onend: (() => void) | null
        lang: string
      }[] = []
      scope.SpeechRecognition = class {
        lang = ''
        continuous = false
        interimResults = false
        onresult: ((event: unknown) => void) | null = null
        onerror = null
        onend: (() => void) | null = null
        constructor() {
          created.push(this)
        }
        start() {}
        stop() {
          this.onend?.()
        }
        abort() {}
      }
      const {
        getByRole,
        getByTestId,
        scope: state
      } = composer({ text: 'Hello' }, (scope) => ({
        props: bind(scope, 'text'),
        slots: { end: () => h(P.DictateButton, { lang: 'en-US' }) }
      }))
      await nextTick()
      await userEvent.click(getByRole('button', { name: 'Dictate' }))
      expect(created[0]!.lang).toBe('en-US')
      const result = (transcript: string, isFinal: boolean) =>
        Object.assign([{ transcript }], { isFinal })
      created[0]!.onresult!({ resultIndex: 0, results: [result('world', false)] })
      await nextTick()
      expect(state.text!.value).toBe('Hello world')
      created[0]!.onresult!({ resultIndex: 0, results: [result('world again', true)] })
      await userEvent.click(getByRole('button', { name: 'Stop dictation' }))
      expect(state.text!.value).toBe('Hello world again')
      expect(getByTestId('prompt-input-dictate-button__status')).toHaveTextContent(
        'Dictation stopped'
      )
      scope.SpeechRecognition = saved[0]
      scope.webkitSpeechRecognition = saved[1]
    })

    it('renders the full composer example with no axe violations', async () => {
      const { container, getByRole, findByRole } = render(DefaultExample)
      expect(getByRole('button', { name: 'Start voice conversation' })).toBeTruthy()
      expect(getByRole('button', { name: 'Attach files' })).toBeTruthy()
      expect(await findByRole('button', { name: /Choose project/ })).toBeTruthy()
      expect(await findByRole('button', { name: /Sol 6\.1/ })).toBeTruthy()
      await expectNoA11yViolations(container)
    })
  })
})
