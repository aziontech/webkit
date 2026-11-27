import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { type Component, defineComponent, h } from 'vue'

import Checkbox from '../components/input/checkbox/checkbox.vue'
import Combobox from '../components/input/combobox/combobox.vue'
import DatePicker from '../components/input/date-picker/date-picker.vue'
import DateRangePicker from '../components/input/date-range-picker/date-range-picker.vue'
import Field, { FieldLabel } from '../components/input/field/index'
import FileDropzone from '../components/input/file-dropzone/file-dropzone.vue'
import Input from '../components/input/input/input.vue'
import LanguageSelect from '../components/input/language-select/language-select.vue'
import NumberInput from '../components/input/number-input/number-input.vue'
import OtpInput from '../components/input/otp-input/otp-input.vue'
import PasswordInput from '../components/input/password-input/password-input.vue'
import PhoneInput from '../components/input/phone-input/phone-input.vue'
import Switch from '../components/input/switch/switch.vue'
import TagEditor from '../components/input/tag-editor/tag-editor.vue'
import Textarea from '../components/input/textarea/textarea.vue'
import { expectNoA11yViolations } from './axe'

const nativeRequired: Record<string, unknown> = {
  Input,
  Textarea,
  NumberInput,
  PasswordInput,
  PhoneInput,
  OtpInput,
  Combobox,
  Checkbox,
  Switch,
  LanguageSelect
}

const describedRequired: Record<string, unknown> = {
  DatePicker,
  DateRangePicker,
  FileDropzone,
  TagEditor
}

const inField = (control: unknown, required = true) =>
  render(
    defineComponent({
      render: () =>
        h(Field, { required }, () => [h(FieldLabel, null, () => 'Name'), h(control as Component)])
    })
  )

const describedText = (el: Element) =>
  (el.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent?.trim())

describe('Field required reaches every control', () => {
  it.each(Object.entries(nativeRequired))('%s takes required or aria-required', (_, control) => {
    const { container } = inField(control)
    expect(container.querySelector('[required], [aria-required="true"]')).not.toBeNull()
  })

  it.each(Object.entries(describedRequired))(
    '%s is described as Required, since its role cannot take aria-required',
    async (_, control) => {
      const { container } = inField(control)
      const described = [...container.querySelectorAll('[aria-describedby]')]
      expect(described.some((el) => describedText(el).includes('Required'))).toBe(true)
      await expectNoA11yViolations(container as HTMLElement)
    }
  )

  it.each(Object.entries(describedRequired))(
    '%s carries no Required text when optional',
    (_, control) => {
      const { container } = inField(control, false)
      const described = [...container.querySelectorAll('[aria-describedby]')]
      expect(described.some((el) => describedText(el).includes('Required'))).toBe(false)
    }
  )

  it('marks the label with a lone asterisk that screen readers skip', () => {
    const { getByTestId } = inField(Input)
    const marker = getByTestId('field-label__required')
    expect(marker.textContent?.trim()).toBe('*')
    expect(marker.getAttribute('aria-hidden')).toBe('true')
    expect(getByTestId('field-label').innerText).not.toContain('Required')
  })
})
