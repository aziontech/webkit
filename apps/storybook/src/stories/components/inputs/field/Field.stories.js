import Field from '@aziontech/webkit/field'

import Example0 from '../../../../../../../packages/webkit/examples/field/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/field/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/field/description-and-error.vue'
import source1 from '../../../../../../../packages/webkit/examples/field/description-and-error.vue?raw'
import Example2 from '../../../../../../../packages/webkit/examples/field/horizontal.vue'
import source2 from '../../../../../../../packages/webkit/examples/field/horizontal.vue?raw'
import Example3 from '../../../../../../../packages/webkit/examples/field/choice-card.vue'
import source3 from '../../../../../../../packages/webkit/examples/field/choice-card.vue?raw'
import Example4 from '../../../../../../../packages/webkit/examples/field/fieldset.vue'
import source4 from '../../../../../../../packages/webkit/examples/field/fieldset.vue?raw'
import Example5 from '../../../../../../../packages/webkit/examples/field/input-group.vue'
import source5 from '../../../../../../../packages/webkit/examples/field/input-group.vue?raw'

/** @type {import('@storybook/vue3').Meta<typeof Field>} */
const meta = {
  title: 'Components/Primitives/Inputs/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'One composable form field. `Field` owns the state (`invalid`, `disabled`, `required`) and the ids; `Field.Label`, `Field.Description` and `Field.Error` and the wrapped control (`Input`, `Textarea`, `Select`, `MultiSelect`, `Checkbox`, `Switch`, `RadioButton`, `Slider`, `NumberInput`, `PasswordInput`, `PhoneInput`, `InputGroup.Input`) read them through provide/inject. `Field.Set`, `Field.Legend`, `Field.Group`, `Field.Content`, `Field.Title` and `Field.Separator` compose fieldsets, settings rows and choice cards.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components: { Example: Example0 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          '`Field` + `Field.Label` + `Input` + `Field.Description`. The label targets the input and the input is described by the description \u2014 no ids to wire.'
      },
      source: { code: source0 }
    }
  }
}

export const DescriptionAndError = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          "State lives on the `Field`: `required` shows the label's Required marker and sets `required` on the input; `invalid` sets `aria-invalid`. `Field.Error` is announced through `aria-describedby` next to the description."
      },
      source: { code: source1 }
    }
  }
}

export const Horizontal = {
  render: () => ({ components: { Example: Example2 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          '`orientation="horizontal"` puts a `Checkbox` or `Switch` beside a `Field.Content` that stacks its label and description.'
      },
      source: { code: source2 }
    }
  }
}

export const ChoiceCard = {
  render: () => ({ components: { Example: Example3 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'A `Field.Label` wrapping a horizontal `Field` becomes a selectable card: the whole card toggles the control and takes the selected tokens while it is checked. Replaces the v5 `field-checkbox-block`, `field-radio-block` and `field-switch-block`.'
      },
      source: { code: source3 }
    }
  }
}

export const Fieldset = {
  render: () => ({ components: { Example: Example4 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          '`Field.Set` + `Field.Legend` group related fields; a nested set with `kind="label"` groups a radio choice. `Field.Group` stacks the fields and `Field.Separator` divides them.'
      },
      source: { code: source4 }
    }
  }
}

export const InputGroup = {
  render: () => ({ components: { Example: Example5 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          "An `InputGroup` inside a `Field`: `InputGroup.Input` picks up the field's id, description and state like any other control."
      },
      source: { code: source5 }
    }
  }
}
