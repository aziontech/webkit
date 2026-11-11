import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/input/default.vue'
import Disabled from '../../../../examples/input/disabled.vue'
import Filled from '../../../../examples/input/filled.vue'
import Invalid from '../../../../examples/input/invalid.vue'
import Sizes from '../../../../examples/input/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Input from './input.vue'

describe('Input', () => {
  describe('rendering & attributes', () => {
    it('renders an <input> with the default testid and reflects modelValue', () => {
      const { getByTestId } = render(Input, {
        props: { modelValue: 'hello' }
      })
      const input = getByTestId('input') as HTMLInputElement
      expect(input.tagName).toBe('INPUT')
      expect(input.value).toBe('hello')
    })

    it('defaults type to text and applies the given placeholder', () => {
      const { getByTestId } = render(Input, {
        props: { placeholder: 'Type here' }
      })
      const input = getByTestId('input') as HTMLInputElement
      expect(input.getAttribute('type')).toBe('text')
      expect(input.getAttribute('placeholder')).toBe('Type here')
    })

    it('passes type and maxlength through to the native input', () => {
      const { getByTestId } = render(Input, {
        props: { type: 'email', maxLength: 10 }
      })
      const input = getByTestId('input') as HTMLInputElement
      expect(input.getAttribute('type')).toBe('email')
      expect(input.getAttribute('maxlength')).toBe('10')
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(Input, {
        attrs: { 'data-testid': 'email-field' }
      })
      expect(getByTestId('email-field').tagName).toBe('INPUT')
    })

    it('mirrors size onto the root as data-size', () => {
      const { getByTestId } = render(Input, { props: { size: 'large' } })
      const root = getByTestId('input').closest('[data-size]')
      expect(root?.getAttribute('data-size')).toBe('large')
    })
  })

  describe('v-model (update:modelValue)', () => {
    it('emits update:modelValue with the new value on input', async () => {
      const { getByTestId, emitted } = render(Input, {
        props: { modelValue: '' }
      })
      const input = getByTestId('input') as HTMLInputElement
      await fireEvent.update(input, 'azion')
      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBe('azion')
    })

    it('emits the latest value on successive inputs', async () => {
      const { getByTestId, emitted } = render(Input, {
        props: { modelValue: '' }
      })
      const input = getByTestId('input') as HTMLInputElement
      await fireEvent.update(input, 'a')
      await fireEvent.update(input, 'ab')
      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(2)
      expect(events[1][0]).toBe('ab')
    })
  })

  describe('disabled', () => {
    it('sets the native disabled attribute and data-disabled on the root', () => {
      const { getByTestId } = render(Input, { props: { disabled: true } })
      const input = getByTestId('input') as HTMLInputElement
      expect(input.disabled).toBe(true)
      expect(input.closest('[data-disabled]')).not.toBeNull()
    })
  })

  describe('readonly', () => {
    it('sets the native readonly attribute', () => {
      const { getByTestId } = render(Input, { props: { readonly: true } })
      const input = getByTestId('input') as HTMLInputElement
      expect(input.readOnly).toBe(true)
    })
  })

  describe('required', () => {
    it('sets native required, aria-required, and data-required on the root', () => {
      const { getByTestId } = render(Input, { props: { required: true } })
      const input = getByTestId('input') as HTMLInputElement
      expect(input.required).toBe(true)
      expect(input.getAttribute('aria-required')).toBe('true')
      expect(input.closest('[data-required]')).not.toBeNull()
    })

    it('omits aria-required when not required', () => {
      const { getByTestId } = render(Input)
      const input = getByTestId('input') as HTMLInputElement
      expect(input.getAttribute('aria-required')).toBeNull()
    })
  })

  describe('invalid', () => {
    it('sets aria-invalid on the input and data-invalid on the root', () => {
      const { getByTestId } = render(Input, { props: { invalid: true } })
      const input = getByTestId('input') as HTMLInputElement
      expect(input.getAttribute('aria-invalid')).toBe('true')
      expect(input.closest('[data-invalid]')).not.toBeNull()
    })

    it('omits aria-invalid when valid', () => {
      const { getByTestId } = render(Input)
      const input = getByTestId('input') as HTMLInputElement
      expect(input.getAttribute('aria-invalid')).toBeNull()
    })
  })

  describe('icon slots', () => {
    it('renders iconLeft slot content and flags data-has-icon-left on the root', () => {
      const { getByTestId, getByText } = render(Input, {
        slots: { iconLeft: '<i data-testid="left-icon">L</i>' }
      })
      expect(getByText('L')).toBeTruthy()
      const root = getByTestId('input').closest('[data-has-icon-left]')
      expect(root).not.toBeNull()
    })

    it('renders iconRight slot content and flags data-has-icon-right on the root', () => {
      const { getByTestId, getByText } = render(Input, {
        slots: { iconRight: '<i>R</i>' }
      })
      expect(getByText('R')).toBeTruthy()
      const root = getByTestId('input').closest('[data-has-icon-right]')
      expect(root).not.toBeNull()
    })
  })

  describe('size smoke (floor)', () => {
    it.each(['small', 'medium', 'large'] as const)('renders size=%s', (size) => {
      const { getByTestId } = render(Input, { props: { size } })
      const root = getByTestId('input').closest('[data-size]')
      expect(root?.getAttribute('data-size')).toBe(size)
    })
  })

  describe('clickable area', () => {
    const pressOn = (element: Element) =>
      element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))

    it('focuses the input when the press lands on the wrapper chrome (padding band)', () => {
      const { getByTestId } = render(Input, { props: { size: 'large' } })
      const input = getByTestId('input') as HTMLInputElement
      const wrapper = input.closest('[data-size]') as HTMLElement
      const notPrevented = pressOn(wrapper)
      expect(document.activeElement).toBe(input)
      expect(notPrevented).toBe(false)
    })

    it('focuses the input when the press lands on a decorative icon', () => {
      const { getByTestId, getByText } = render(Input, {
        props: { size: 'large' },
        slots: { iconLeft: '<i>L</i>' }
      })
      const input = getByTestId('input') as HTMLInputElement
      pressOn(getByText('L'))
      expect(document.activeElement).toBe(input)
    })

    it('leaves a press on the input itself untouched so the native caret still lands', () => {
      const { getByTestId } = render(Input, { props: { modelValue: 'azion' } })
      const input = getByTestId('input') as HTMLInputElement
      expect(pressOn(input)).toBe(true)
    })

    it('does not focus from the wrapper chrome when disabled', () => {
      const { getByTestId } = render(Input, { props: { size: 'large', disabled: true } })
      const input = getByTestId('input') as HTMLInputElement
      const wrapper = input.closest('[data-size]') as HTMLElement
      expect(pressOn(wrapper)).toBe(true)
      expect(document.activeElement).not.toBe(input)
    })
  })

  // This component is the FIELD ONLY — its label belongs to the wrapping form-field
  // layer (`field-text` binds one with useId()). A bare field named solely by its
  // placeholder loses that name the moment the user types, so these fixtures supply
  // the accessible name the wrapper would, keeping the render realistic.
  describe('a11y (axe against styled DOM)', () => {
    it('Default has no violations', async () => {
      const { container } = render(Input, {
        props: { placeholder: 'Search' },
        attrs: { 'aria-label': 'Search' }
      })
      await expectNoA11yViolations(container)
    })

    it('Invalid + required has no violations', async () => {
      const { container } = render(Input, {
        props: { invalid: true, required: true, modelValue: 'bad', placeholder: 'Email' },
        attrs: { 'aria-label': 'Email' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('documented example (the story fixtures run in-test)', () => {
    it('Default story mounts an empty input', () => {
      const { getByTestId } = render(Default)
      expect((getByTestId('input') as HTMLInputElement).value).toBe('')
    })

    it('Filled story mounts with a value', () => {
      const { getByTestId } = render(Filled)
      expect((getByTestId('input') as HTMLInputElement).value).toBe('Example value')
    })

    it('Invalid story sets aria-invalid', () => {
      const { getByTestId } = render(Invalid)
      expect(getByTestId('input').getAttribute('aria-invalid')).toBe('true')
    })

    it('Disabled story is disabled', () => {
      const { getByTestId } = render(Disabled)
      expect((getByTestId('input') as HTMLInputElement).disabled).toBe(true)
    })

    it('Sizes story renders three fields', () => {
      const { getAllByTestId } = render(Sizes)
      expect(getAllByTestId('input')).toHaveLength(3)
    })
  })
})

describe('Input — rendered HTML stays stable', () => {
  it('renders the same HTML as before when autocomplete and spellcheck are absent', () => {
    const { container } = render(Input, {
      props: { placeholder: 'Type here' },
      attrs: { id: 'plain' }
    })
    expect(container.innerHTML).toMatchSnapshot()
  })
})

describe('Input — autocomplete and spellcheck', () => {
  it('applies autocomplete and type to the <input>', () => {
    const { getByTestId } = render(Input, { props: { type: 'email', autocomplete: 'email' } })
    const input = getByTestId('input')

    expect(input.getAttribute('type')).toBe('email')
    expect(input.getAttribute('autocomplete')).toBe('email')
  })

  it('renders spellcheck="false" on the <input> when spellcheck is false', () => {
    const { getByTestId } = render(Input, { props: { spellcheck: false } })
    expect(getByTestId('input').getAttribute('spellcheck')).toBe('false')
  })

  it('omits autocomplete and spellcheck when they are not set', () => {
    const { getByTestId } = render(Input)
    const input = getByTestId('input')

    expect(input.hasAttribute('autocomplete')).toBe(false)
    expect(input.hasAttribute('spellcheck')).toBe(false)
  })
})

describe('Input — read-only look', () => {
  it('marks a read-only field with data-readonly and the dashed, transparent look', () => {
    const { getByTestId, container } = render(Input, {
      props: { readonly: true, modelValue: '9757a' }
    })
    const root = container.firstElementChild as HTMLElement
    const input = getByTestId('input') as HTMLInputElement

    expect(input.readOnly).toBe(true)
    expect(root.hasAttribute('data-readonly')).toBe(true)
    expect(root.className).toContain('data-[readonly]:border-dashed')
    expect(root.className).toContain('data-[readonly]:bg-transparent')
    expect(root.className).toContain(':not([data-readonly])]:hover:border-(--border-strong)')
  })

  it('keeps the read-only look apart from the editable and disabled looks', () => {
    const readonly = render(Input, { props: { readonly: true } }).container
      .firstElementChild as HTMLElement
    const disabled = render(Input, { props: { disabled: true } }).container
      .firstElementChild as HTMLElement

    expect(readonly.hasAttribute('data-readonly')).toBe(true)
    expect(readonly.hasAttribute('data-disabled')).toBe(false)
    expect(disabled.hasAttribute('data-readonly')).toBe(false)
    expect(readonly.className).not.toContain('data-[readonly]:bg-(--bg-disabled)')
  })

  it('omits data-readonly on an editable field', () => {
    const { container } = render(Input)
    expect((container.firstElementChild as HTMLElement).hasAttribute('data-readonly')).toBe(false)
  })
})

describe('Input — password managers', () => {
  it('hides a plain field from password managers so no sign-in prompt appears', () => {
    const input = render(Input).getByTestId('input')
    expect(input).toHaveAttribute('data-1p-ignore', 'true')
    expect(input).toHaveAttribute('data-lpignore', 'true')
    expect(input).toHaveAttribute('data-bwignore', 'true')
    expect(input).toHaveAttribute('data-form-type', 'other')
  })

  it('keeps a login field fillable (autocomplete="username", type="email")', () => {
    const username = render(Input, { props: { autocomplete: 'username' } }).getByTestId('input')
    expect(username).not.toHaveAttribute('data-1p-ignore')
    const email = render(Input, { props: { type: 'email' } }).getAllByTestId('input')[1]
    expect(email).not.toHaveAttribute('data-1p-ignore')
  })

  it('hides read-only fields even when they carry an autocomplete token', () => {
    const input = render(Input, {
      props: { readonly: true, autocomplete: 'username' }
    }).getByTestId('input')
    expect(input).toHaveAttribute('data-1p-ignore', 'true')
  })

  it('lets a consumer override the hint through attrs', () => {
    const input = render(Input, { attrs: { 'data-1p-ignore': 'false' } }).getByTestId('input')
    expect(input).toHaveAttribute('data-1p-ignore', 'false')
  })
})

describe('Input — direction of the typed value', () => {
  it('uses dir="auto" so a value in another script keeps its own direction', () => {
    const { getByTestId } = render(Input)
    expect(getByTestId('input').getAttribute('dir')).toBe('auto')
  })

  it('lets a dir attribute override the default', () => {
    const { getByTestId } = render(Input, { attrs: { dir: 'ltr' } })
    expect(getByTestId('input').getAttribute('dir')).toBe('ltr')
  })
})
