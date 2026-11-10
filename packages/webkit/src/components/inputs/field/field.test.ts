import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import ChoiceCard from '../../../../examples/field/choice-card.vue'
import Default from '../../../../examples/field/default.vue'
import DescriptionAndError from '../../../../examples/field/description-and-error.vue'
import Fieldset from '../../../../examples/field/fieldset.vue'
import Horizontal from '../../../../examples/field/horizontal.vue'
import InputGroupExample from '../../../../examples/field/input-group.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Checkbox from '../checkbox/checkbox.vue'
import Input from '../input/input.vue'
import InputGroup from '../input-group/input-group.vue'
import InputGroupInput from '../input-group/input-group-input/input-group-input.vue'
import Select from '../select/select.vue'
import SelectContent from '../select/select-content/select-content.vue'
import SelectOption from '../select/select-option/select-option.vue'
import SelectTrigger from '../select/select-trigger/select-trigger.vue'
import Switch from '../switch/switch.vue'
import Textarea from '../textarea/textarea.vue'
import Field, {
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle
} from './index'

const components = {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
  FieldTitle,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldSeparator,
  Input,
  Textarea,
  Checkbox,
  Switch,
  InputGroup,
  InputGroupInput,
  Select,
  SelectTrigger,
  SelectContent,
  SelectOption
}

const mount = (template: string, setup: () => Record<string, unknown> = () => ({})) =>
  render(defineComponent({ components, setup, template }))

describe('Field', () => {
  it('attaches every part to the compound', () => {
    expect(Field.Label).toBe(FieldLabel)
    expect(Field.Description).toBe(FieldDescription)
    expect(Field.Error).toBe(FieldError)
    expect(Field.Group).toBe(FieldGroup)
    expect(Field.Set).toBe(FieldSet)
    expect(Field.Legend).toBe(FieldLegend)
    expect(Field.Content).toBe(FieldContent)
    expect(Field.Title).toBe(FieldTitle)
    expect(Field.Separator).toBe(FieldSeparator)
  })

  it('renders a group root with the default testid and orientation', () => {
    const { getByTestId } = mount('<Field><FieldLabel>Name</FieldLabel><Input /></Field>')
    const root = getByTestId('input-field')
    expect(root.getAttribute('role')).toBe('group')
    expect(root.getAttribute('data-orientation')).toBe('vertical')
    expect(root.getAttribute('data-slot')).toBe('field')
  })

  it('honours a consumer data-testid on the root', () => {
    const { getByTestId } = mount('<Field data-testid="email"><Input /></Field>')
    expect(getByTestId('email').getAttribute('data-slot')).toBe('field')
  })

  it('wires the label to the control through a generated id', () => {
    const { getByLabelText, getByTestId } = mount(
      '<Field><FieldLabel>Email</FieldLabel><Input /></Field>'
    )
    const input = getByLabelText('Email') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
    expect(input.id).toBeTruthy()
    expect(getByTestId('input-field-label').getAttribute('for')).toBe(input.id)
  })

  it('keeps an explicit id on the control and for on the label', () => {
    const { getByLabelText } = mount(
      '<Field><FieldLabel for="mail">Email</FieldLabel><Input id="mail" /></Field>'
    )
    expect(getByLabelText('Email').id).toBe('mail')
  })

  it('describes the control by every description and error', async () => {
    const { getByRole, getByTestId } = mount(
      '<Field><FieldLabel>Slug</FieldLabel><Input /><FieldDescription>Lowercase.</FieldDescription><FieldError>Taken.</FieldError></Field>'
    )
    await nextTick()
    const ids = getByRole('textbox').getAttribute('aria-describedby')?.split(' ')
    expect(ids).toEqual([
      getByTestId('input-field-description').id,
      getByTestId('input-field-error').id
    ])
    expect(getByRole('alert').textContent).toContain('Taken.')
  })

  it('drops a description id once the description unmounts', async () => {
    const show = ref(true)
    const { getByRole } = mount(
      '<Field><Input /><FieldDescription v-if="show">Hint</FieldDescription></Field>',
      () => ({ show })
    )
    await nextTick()
    expect(getByRole('textbox').getAttribute('aria-describedby')).toBeTruthy()
    show.value = false
    await nextTick()
    await nextTick()
    expect(getByRole('textbox').getAttribute('aria-describedby')).toBeNull()
  })

  it('passes invalid, required and disabled to the control', () => {
    const { getByRole, getByTestId } = mount(
      '<Field invalid required disabled><FieldLabel>Name</FieldLabel><Input /></Field>'
    )
    const input = getByRole('textbox') as HTMLInputElement
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.required).toBe(true)
    expect(input.disabled).toBe(true)
    expect(getByTestId('input-field-label__required').textContent).toContain('(Required)')
  })

  it('lets a control prop win over a calm Field', () => {
    const { getByRole } = mount('<Field><Textarea invalid /></Field>')
    expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
  })

  it('tones the description from the field state', async () => {
    const state = ref<Record<string, boolean>>({})
    const { getByTestId } = mount(
      '<Field v-bind="state"><Input /><FieldDescription>Note</FieldDescription></Field>',
      () => ({ state })
    )
    const description = () => getByTestId('input-field-description').getAttribute('data-kind')
    expect(description()).toBe('helper')
    state.value = { required: true }
    await nextTick()
    expect(description()).toBe('required')
    state.value = { invalid: true }
    await nextTick()
    expect(description()).toBe('invalid')
    state.value = { disabled: true, invalid: true }
    await nextTick()
    expect(description()).toBe('disabled')
  })

  it('keeps the description neutral when a FieldError carries the invalid message', async () => {
    const { getByTestId } = mount(
      '<Field invalid><Input /><FieldDescription>Note</FieldDescription><FieldError>Bad</FieldError></Field>'
    )
    await nextTick()
    expect(getByTestId('input-field-description').getAttribute('data-kind')).toBe('helper')
    expect(getByTestId('input-field-error').getAttribute('data-kind')).toBe('invalid')
  })

  it('wires the Select trigger as the control and isolates its inner parts', async () => {
    const { getByLabelText } = mount(
      '<Field invalid><FieldLabel>Region</FieldLabel><Select><SelectTrigger /><SelectContent><SelectOption value="a">a</SelectOption></SelectContent></Select><FieldDescription>Pick one</FieldDescription></Field>'
    )
    await nextTick()
    const trigger = getByLabelText('Region')
    expect(trigger.getAttribute('role')).toBe('combobox')
    expect(trigger.getAttribute('aria-invalid')).toBe('true')
    expect(trigger.getAttribute('aria-describedby')).toBeTruthy()
  })

  it('wires InputGroup.Input and styles the group from the field', () => {
    const { getByLabelText, getByTestId } = mount(
      '<Field invalid><FieldLabel>Domain</FieldLabel><InputGroup><InputGroupInput /></InputGroup></Field>'
    )
    expect(getByLabelText('Domain').getAttribute('aria-invalid')).toBe('true')
    expect(getByTestId('input-group').getAttribute('data-invalid')).not.toBeNull()
  })

  it('toggles a checkbox through a horizontal field label', async () => {
    const checked = ref(false)
    const { getByText } = mount(
      '<Field orientation="horizontal"><Checkbox v-model="checked" binary /><FieldContent><FieldLabel>Terms</FieldLabel></FieldContent></Field>',
      () => ({ checked })
    )
    await fireEvent.click(getByText('Terms'))
    expect(checked.value).toBe(true)
  })

  it('turns a FieldLabel wrapping a Field into a choice card that toggles the switch', async () => {
    const on = ref(false)
    const { getByText, getByRole } = mount(
      '<FieldLabel><Field orientation="horizontal"><Switch v-model="on" /><FieldContent><FieldTitle>WAF</FieldTitle><FieldDescription>Blocks attacks</FieldDescription></FieldContent></Field></FieldLabel>',
      () => ({ on })
    )
    await fireEvent.click(getByText('WAF'))
    expect(on.value).toBe(true)
    expect(getByRole('switch').getAttribute('aria-checked')).toBe('true')
  })

  it('renders a fieldset named by its legend', () => {
    const { getByRole } = mount(
      '<FieldSet><FieldLegend kind="label">Plan</FieldLegend><FieldSeparator>Or</FieldSeparator></FieldSet>'
    )
    expect(getByRole('group', { name: 'Plan' }).tagName).toBe('FIELDSET')
    expect(getByRole('separator')).toBeTruthy()
  })

  describe('a11y', () => {
    it.each([
      ['Default', Default],
      ['DescriptionAndError', DescriptionAndError],
      ['Horizontal', Horizontal],
      ['ChoiceCard', ChoiceCard],
      ['Fieldset', Fieldset],
      ['InputGroup', InputGroupExample]
    ])('%s example has no axe violations', async (_, example) => {
      const { container } = render(example)
      await nextTick()
      await expectNoA11yViolations(container)
    })
  })
})
