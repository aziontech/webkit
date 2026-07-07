import Button from '@aziontech/webkit/button'
import FieldInputGroup from '@aziontech/webkit/field-input-group'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldInputGroup from '@aziontech/webkit/field-input-group'"

/** @type {import('@storybook/vue3').Meta<typeof FieldInputGroup>} */
const meta = {
  title: 'Components/Inputs/FieldInputGroup',
  component: FieldInputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Form field wrapper around `InputGroup` that composes `Label`, `InputGroup` (with its own middle `<input>` rendered internally), and `HelperText` into a single vertical stack. Mirrors `FieldText`'s API — same `label` / `helperText` / `disabled` / `invalid` / `required` behavior — with the added `#left` and `#right` slots forwarded to `InputGroup`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Two-way bound value of the internal `<input>`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder forwarded to the internal `<input>`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted (except when `disabled` — fallback copy is shown).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input and the `InputGroup` chrome; switches helper to `kind="disabled"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the internal input read-only; value is visible but not editable.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description:
        'Adds the Required tag to Label, propagates `required` to InputGroup and native input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description:
        'Sets `invalid` on InputGroup and switches helper to `kind="invalid"`. Also sets `aria-invalid` on the internal input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description: 'id for the internal input; auto-generated via `useId()` when empty.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    name: {
      control: 'text',
      description: 'HTML name for the internal input (form + vee-validate integration).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    left: { control: false, table: { category: 'slots', type: { summary: 'slot' } } },
    right: { control: false, table: { category: 'slots', type: { summary: 'slot' } } },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Re-emitted from the internal `<input>` on every input event.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: '',
    label: 'Website',
    placeholder: 'mysite',
    helperText: 'Enter the domain without the scheme.',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  }
}

export default meta

const Template = (args) => ({
  components: { FieldInputGroup },
  setup() {
    return { args }
  },
  template: '<div class="w-[360px]"><FieldInputGroup v-bind="args" /></div>'
})

const DEFAULT_MARKUP = `<FieldInputGroup
  v-model="value"
  label="Website"
  placeholder="mysite"
  helper-text="Enter the domain without the scheme."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldInputGroup>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Label + internal input + helper text, no side slots filled.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const WITH_SLOTS_MARKUP = `<FieldInputGroup
  v-model="value"
  label="Website"
  placeholder="mysite"
  helper-text="Enter the domain without the scheme."
>
  <template #left>https://</template>
  <template #right>.com</template>
</FieldInputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldInputGroup>} */
export const WithSlots = {
  render: () => ({
    components: { FieldInputGroup },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="w-[360px]">
        <FieldInputGroup
          v-model="value"
          label="Website"
          placeholder="mysite"
          helper-text="Enter the domain without the scheme."
        >
          <template #left>https://</template>
          <template #right>.com</template>
        </FieldInputGroup>
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: '`#left` and `#right` slots forwarded to the underlying `InputGroup`.' },
      source: { code: toSfc(IMPORT, WITH_SLOTS_MARKUP) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof FieldInputGroup>} */
export const Required = {
  render: () => ({
    components: { FieldInputGroup, Button },
    setup() {
      const value = ref('')
      const missing = ref(false)
      const loading = ref(false)

      const onSubmit = () => {
        if (loading.value) return
        missing.value = false
        loading.value = true
        setTimeout(() => {
          loading.value = false
          missing.value = !value.value
        }, 1200)
      }

      const onUpdate = (next) => {
        value.value = next
        if (next) missing.value = false
      }

      return { value, missing, loading, onSubmit, onUpdate }
    },
    template: `
      <div class="flex flex-col gap-4 w-[360px]">
        <FieldInputGroup
          label="Website"
          placeholder="mysite"
          :model-value="value"
          @update:model-value="onUpdate"
          :required="missing"
          :disabled="loading"
          :helper-text="missing ? 'This field is required.' : 'Enter the domain without the scheme.'"
        >
          <template #left>https://</template>
          <template #right>.com</template>
        </FieldInputGroup>
        <Button label="Submit" size="medium" :loading="loading" @click="onSubmit" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Click **Submit** with the field empty: the button shows the loading spinner for ~1.2s and the field locks. When loading finishes, the required check fires — the `Label` gets the Required tag, the InputGroup border turns warning, and the helper switches to the warning "This field is required." copy. Typing any value clears the error.'
      }
    }
  }
}

const INVALID_MARKUP = `<FieldInputGroup
  v-model="value"
  label="Website"
  model-value="not a domain"
  helper-text="Enter a valid domain (letters, digits, hyphens)."
  invalid
>
  <template #left>https://</template>
  <template #right>.com</template>
</FieldInputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldInputGroup>} */
export const Invalid = {
  args: {
    invalid: true,
    modelValue: 'not a domain',
    helperText: 'Enter a valid domain (letters, digits, hyphens).'
  },
  render: (args) => ({
    components: { FieldInputGroup },
    setup() {
      return { args }
    },
    template: `
      <div class="w-[360px]">
        <FieldInputGroup v-bind="args">
          <template #left>https://</template>
          <template #right>.com</template>
        </FieldInputGroup>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Invalid state — helper switches to `kind="invalid"` (danger tokens) and the InputGroup border turns danger.'
      },
      source: { code: toSfc(IMPORT, INVALID_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = `<FieldInputGroup
  v-model="value"
  label="Website"
  model-value="mysite"
  disabled
>
  <template #left>https://</template>
  <template #right>.com</template>
</FieldInputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldInputGroup>} */
export const Disabled = {
  args: {
    disabled: true,
    modelValue: 'mysite',
    helperText: ''
  },
  render: (args) => ({
    components: { FieldInputGroup },
    setup() {
      return { args }
    },
    template: `
      <div class="w-[360px]">
        <FieldInputGroup v-bind="args">
          <template #left>https://</template>
          <template #right>.com</template>
        </FieldInputGroup>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — helper falls back to "This field is locked." with the lock icon (`kind="disabled"`), the InputGroup surface goes muted, and cursor becomes `not-allowed`.'
      },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}

const ICONS_MARKUP = `<FieldInputGroup
  v-model="value"
  label="Website"
  placeholder="mysite"
  helper-text="Icons in the side slots parallel FieldText's icon story vocabulary."
>
  <template #left><i class="pi pi-globe" aria-hidden="true" /></template>
  <template #right><i class="pi pi-times" aria-hidden="true" /></template>
</FieldInputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldInputGroup>} */
export const Icons = {
  render: () => ({
    components: { FieldInputGroup },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="w-[360px]">
        <FieldInputGroup
          v-model="value"
          label="Website"
          placeholder="mysite"
          helper-text="Icons in the side slots parallel FieldText's icon story vocabulary."
        >
          <template #left><i class="pi pi-globe" aria-hidden="true" /></template>
          <template #right><i class="pi pi-times" aria-hidden="true" /></template>
        </FieldInputGroup>
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'PrimeIcons flanking the internal input inside `InputGroup`\'s side slots. Same vocabulary as `FieldText`\'s Icons story.'
      },
      source: { code: toSfc(IMPORT, ICONS_MARKUP) }
    }
  }
}
