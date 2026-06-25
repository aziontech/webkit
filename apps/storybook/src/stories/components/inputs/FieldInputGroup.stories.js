import FieldInputGroup from '@aziontech/webkit/field-input-group'
import { ref, watch } from 'vue'

const meta = {
  title: 'Components/Inputs/Field Input Group',
  component: FieldInputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component: [
          'Inline text field that attaches prepend and append decoration directly inside the field border — for units, currency symbols, or trailing action elements. Use it over `input-text` when the value needs adjacent fixed content; it carries the same label, helper text, disabled, readonly, and invalid affordances as the other `field-*` inputs.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import FieldInputGroup from '@aziontech/webkit/field-input-group'",
          '</script>',
          '',
          '<template>',
          '  <FieldInputGroup',
          '    v-model="amount"',
          '    label="Amount"',
          '    placeholder="0.00"',
          '    helper-text="Monthly spend in USD"',
          '  >',
          '    <template #prepend>$</template>',
          '    <template #append>USD</template>',
          '  </FieldInputGroup>',
          '</template>',
          '```'
        ].join('\n')
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Text value for v-model.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    label: {
      control: 'text',
      description: 'Label text shown above the field.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    helperText: {
      control: 'text',
      description: 'Helper text shown below the field; muted, or locked when disabled.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the native input.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description: 'Applies danger border and danger helper text.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'v-model; fires on native input.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    prepend: {
      control: false,
      description: 'Decoration attached inside the leading edge of the field.',
      table: { category: 'slots', type: { summary: 'slot' } }
    },
    append: {
      control: false,
      description: 'Decoration attached inside the trailing edge of the field.',
      table: { category: 'slots', type: { summary: 'slot' } }
    }
  },
  args: {
    label: 'Amount',
    helperText: 'Monthly spend in USD',
    placeholder: '0.00',
    disabled: false,
    readonly: false,
    invalid: false
  }
}
export default meta

const Template = (args) => ({
  components: { FieldInputGroup },
  setup() {
    const value = ref(args.modelValue ?? '')
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? ''
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: `
    <div class="w-[280px]">
      <FieldInputGroup v-bind="args" :model-value="value" @update:model-value="onUpdate" />
    </div>
  `
})

export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Labelled field with helper text.' } }
  }
}

export const WithPrependAppend = {
  render: (args) => ({
    components: { FieldInputGroup },
    setup() {
      const value = ref(args.modelValue ?? '')
      watch(
        () => args.modelValue,
        (next) => {
          value.value = next ?? ''
        }
      )
      const onUpdate = (next) => {
        value.value = next
        args['onUpdate:modelValue']?.(next)
      }
      return { args, value, onUpdate }
    },
    template: `
      <div class="w-[280px]">
        <FieldInputGroup v-bind="args" :model-value="value" @update:model-value="onUpdate">
          <template #prepend>$</template>
          <template #append>USD</template>
        </FieldInputGroup>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Prepend and append slots attaching a currency symbol and unit inside the field border.'
      }
    }
  }
}

export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — swaps surface tokens and shows the lock icon before the helper text.'
      }
    }
  }
}

export const Invalid = {
  args: { invalid: true, helperText: 'Enter a valid amount' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Invalid state — danger border and danger helper text.' } }
  }
}
