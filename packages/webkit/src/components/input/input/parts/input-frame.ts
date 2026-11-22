import { type FunctionalComponent, h, type Slot } from 'vue'

type InputFrameSize = 'small' | 'medium' | 'large'

interface InputFrameProps {
  /** Height step of the frame: small=28px, medium=32px, large=40px. */
  size: InputFrameSize
  /** Applies the disabled tokens and stops a press on the frame from focusing the field. */
  disabled?: boolean
  /** Drops the hover border and takes a default cursor. */
  readonly?: boolean
  /** Applies the invalid border. */
  invalid?: boolean
  /** Marks the frame of a required field. */
  required?: boolean
}

const FRAME_CLASS =
  'relative inline-flex items-center w-full cursor-text rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface) ' +
  'text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none ' +
  '[&:not(:focus-within):not([data-disabled]):not([data-readonly])]:hover:border-(--border-strong) ' +
  'focus-within:outline-none focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 ' +
  'focus-within:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] ' +
  'data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 ' +
  'data-[invalid]:border-(--danger-border) ' +
  'data-[readonly]:cursor-default ' +
  'data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed ' +
  'data-[disabled]:hover:border-(--border-input) data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0'

const TOUCH_TARGET_CLASS = 'absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block'

const ADORNMENT_CLASS = 'inline-flex shrink-0 items-center justify-center text-(--text-muted)'

const focusOnPress = (event: globalThis.MouseEvent) => {
  const frame = event.currentTarget as globalThis.HTMLElement
  const target = event.target as globalThis.Element
  if (frame.hasAttribute('data-disabled') || target.closest('input, button')) return
  event.preventDefault()
  frame.querySelector('input')?.focus()
}

const adornment = (slot: 'leading' | 'trailing', content: Slot | undefined) =>
  content
    ? h('span', { 'data-slot': slot, class: ADORNMENT_CLASS, 'aria-hidden': 'true' }, content())
    : null

const InputFrame: FunctionalComponent<InputFrameProps> = (props, { slots }) =>
  h(
    'span',
    {
      class: FRAME_CLASS,
      'data-size': props.size,
      'data-disabled': props.disabled || null,
      'data-readonly': props.readonly || null,
      'data-invalid': props.invalid || null,
      'data-required': props.required || null,
      'data-leading': !!slots['leading'] || null,
      'data-trailing': !!slots['trailing'] || null,
      onMousedown: focusOnPress
    },
    [
      h('span', { 'aria-hidden': 'true', 'data-slot': 'touch-target', class: TOUCH_TARGET_CLASS }),
      adornment('leading', slots['leading']),
      slots['default']?.(),
      adornment('trailing', slots['trailing']),
      slots['controls']?.()
    ]
  )

InputFrame.props = ['size', 'disabled', 'readonly', 'invalid', 'required']

export default InputFrame
