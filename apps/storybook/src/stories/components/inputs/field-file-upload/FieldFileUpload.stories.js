import FieldFileUpload from '@aziontech/webkit/field-file-upload'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldFileUpload from '@aziontech/webkit/field-file-upload'"
const VUE_IMPORT = "import { ref } from 'vue'"

const REPORT_FILE = "new File([new Uint8Array(1468006)], 'report.pdf', { type: 'application/pdf' })"
const COSTS_FILE =
  "new File([new Uint8Array(24576)], 'q3-infrastructure-cost-breakdown-by-region-and-product.csv', { type: 'text/csv' })"

const createReport = () =>
  new File([new Uint8Array(1468006)], 'report.pdf', { type: 'application/pdf' })
const createCosts = () =>
  new File([new Uint8Array(24576)], 'q3-infrastructure-cost-breakdown-by-region-and-product.csv', {
    type: 'text/csv'
  })

/** @type {import('@storybook/vue3').Meta<typeof FieldFileUpload>} */
const meta = {
  title: 'Components/Primitives/Inputs/FieldFileUpload',
  component: FieldFileUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
        component:
          'Form field for picking files. It stacks `Label`, an inline `FileDropzone` holding a "Choose file" secondary `Button` that opens a visually hidden native file input, the single `HelperText` region for constraint or error copy, and a list of the selected files, each row with a remove `IconButton`. It is the file-picking member of the field family and shares the label, helper, `required`, `invalid`, `disabled`, `readonly` and `size` contract of `FieldText`. Its value is a `File[]`, and it checks `accept` and `maxSize` itself, emitting `reject` for files that fail.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: false,
      description:
        'Two-way bound file list. Accepted files are appended when `multiple`, or replace the current file otherwise; a remove button emits the list without that file.',
      table: { category: 'props', type: { summary: 'File[]' }, defaultValue: { summary: '[]' } }
    },
    label: {
      control: 'text',
      description: 'Text rendered inside the `Label`. When empty, the label row is omitted.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    helperText: {
      control: 'text',
      description:
        'Auxiliary text rendered inside `HelperText`, usually the accepted types and size limit; replace it with the error message when `invalid`. When empty, the helper row is omitted, including while `disabled`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    accept: {
      control: 'text',
      description:
        'Comma-separated list of accepted types in the native `accept` syntax: extensions (`.png`), exact MIME types (`image/png`) or MIME wildcards (`image/*`). Forwarded to the native input and checked on every picked or dropped file. Empty accepts any type.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    multiple: {
      control: 'boolean',
      description:
        'Lets the user pick or drop several files; new files are appended to the value. When off, a new file replaces the current one and the trigger reads "Choose file".',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    maxSize: {
      control: 'number',
      description:
        'Largest accepted file size in bytes. Files above it are rejected through the `reject` event. `0` means no limit.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size forwarded to the "Choose file" `Button` and the remove `IconButton`s.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables the picker, the drop region and every remove button, and switches a supplied helper to `kind="disabled"` (lock icon).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description:
        'Shows the selected files without the drop region or the remove buttons. The value can be read but not changed.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description:
        'Adds the `Required` tag to the `Label` and switches a supplied helper to `kind="required"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description:
        'Switches the helper to `kind="invalid"` and applies invalid tokens to the drop region.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description:
        'id for the native file input; consumed by `Label` via `for` and by the `aria-describedby` wiring. Auto-generated when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    name: {
      control: 'text',
      description:
        'HTML name for the native file input, so native form submission and `FormData` carry the selected files.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted with the new file list after files are added or removed.',
      table: { category: 'events', type: { summary: '(value: File[]) => void' } }
    },
    onReject: {
      action: 'reject',
      description:
        'Fired when picked or dropped files fail the `accept` or `maxSize` check, or arrive beyond the first while `multiple` is off. Accepted files from the same batch still reach `v-model`.',
      table: { category: 'events', type: { summary: '(event: Event, files: File[]) => void' } }
    }
  },
  args: {
    label: 'Certificate',
    helperText: 'PEM or CRT, up to 1 MB.',
    accept: '',
    multiple: false,
    maxSize: 0,
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: '',
    name: ''
  }
}

export default meta

const Template = (args) => ({
  components: { FieldFileUpload },
  setup() {
    const files = ref([])
    const onUpdate = (next) => {
      files.value = next
    }
    return { args, files, onUpdate }
  },
  template: `<div class="w-full max-w-(--container-md)">
  <FieldFileUpload v-bind="args" :model-value="files" @update:model-value="onUpdate" />
</div>`
})

const DEFAULT_MARKUP = `<div class="w-full max-w-(--container-md)">
  <FieldFileUpload v-model="files" label="Certificate" helper-text="PEM or CRT, up to 1 MB." />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldFileUpload>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A single-file field with a label and the constraint copy in the helper. Choosing a file replaces the current one.'
      },
      source: { code: toSfc([VUE_IMPORT, IMPORT, '', 'const files = ref([])'], DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-lg)">
  <FieldFileUpload v-model="small" size="small" label="Certificate (small)" helper-text="PEM or CRT, up to 1 MB." />
  <FieldFileUpload v-model="medium" size="medium" label="Certificate (medium)" helper-text="PEM or CRT, up to 1 MB." />
  <FieldFileUpload v-model="large" size="large" label="Certificate (large)" helper-text="PEM or CRT, up to 1 MB." />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldFileUpload>} */
export const Sizes = {
  render: () => ({
    components: { FieldFileUpload },
    setup() {
      const small = ref([])
      const medium = ref([])
      const large = ref([])
      return { small, medium, large }
    },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'All three sizes. `size` is forwarded to the "Choose file" button and to the remove buttons in the file list.'
      },
      source: {
        code: toSfc(
          [
            VUE_IMPORT,
            IMPORT,
            '',
            'const small = ref([])',
            'const medium = ref([])',
            'const large = ref([])'
          ],
          SIZES_TEMPLATE
        )
      }
    }
  }
}

const MULTIPLE_TEMPLATE = `<div class="w-full max-w-(--container-md)">
  <FieldFileUpload
    v-model="files"
    multiple
    label="Attachments"
    helper-text="Add as many files as you need."
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldFileUpload>} */
export const Multiple = {
  render: () => ({
    components: { FieldFileUpload },
    setup() {
      const files = ref([createReport(), createCosts()])
      return { files }
    },
    template: MULTIPLE_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'With `multiple`, new files are appended to the list and the trigger reads "Choose files". Each row shows the file name, truncated when long, its size in binary units and a remove button.'
      },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', `const files = ref([\n  ${REPORT_FILE},\n  ${COSTS_FILE}\n])`],
          MULTIPLE_TEMPLATE
        )
      }
    }
  }
}

const CONSTRAINTS_TEMPLATE = `<div class="w-full max-w-(--container-md)">
  <FieldFileUpload
    v-model="files"
    label="Logo"
    accept=".png,.jpg,image/png,image/jpeg"
    :max-size="2 * 1024 * 1024"
    :helper-text="helperText"
    :invalid="invalid"
    @reject="onReject"
  />
</div>`

const CONSTRAINTS_SCRIPT = [
  VUE_IMPORT,
  IMPORT,
  '',
  'const files = ref([])',
  'const invalid = ref(false)',
  "const helperText = ref('PNG or JPG, up to 2 MB.')",
  '',
  'function onReject(event, rejected) {',
  '  invalid.value = true',
  '  helperText.value = `${rejected[0].name} is not a PNG or JPG under 2 MB.`',
  '}'
]

/** @type {import('@storybook/vue3').StoryObj<typeof FieldFileUpload>} */
export const Constraints = {
  render: () => ({
    components: { FieldFileUpload },
    setup() {
      const files = ref([])
      const invalid = ref(false)
      const helperText = ref('PNG or JPG, up to 2 MB.')
      function onReject(event, rejected) {
        invalid.value = true
        helperText.value = `${rejected[0].name} is not a PNG or JPG under 2 MB.`
      }
      return { files, invalid, helperText, onReject }
    },
    template: CONSTRAINTS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The field checks `accept` and `maxSize` on every picked or dropped file. Choose a file that is not a PNG or JPG, or one over 2 MB: `reject` fires with the rejected files, and the handler sets `invalid` and swaps the helper copy for the error message.'
      },
      source: { code: toSfc(CONSTRAINTS_SCRIPT, CONSTRAINTS_TEMPLATE) }
    }
  }
}

const INVALID_MARKUP = `<div class="w-full max-w-(--container-md)">
  <FieldFileUpload
    v-model="files"
    label="Certificate"
    helper-text="Upload a certificate to continue."
    invalid
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldFileUpload>} */
export const Invalid = {
  args: {
    invalid: true,
    helperText: 'Upload a certificate to continue.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Invalid state: the helper switches to `kind="invalid"` with the error message and the drop region takes the invalid tokens.'
      },
      source: { code: toSfc([VUE_IMPORT, IMPORT, '', 'const files = ref([])'], INVALID_MARKUP) }
    }
  }
}

const DISABLED_TEMPLATE = `<div class="w-full max-w-(--container-md)">
  <FieldFileUpload
    v-model="files"
    label="Report"
    helper-text="Uploads are paused while the report is reviewed."
    disabled
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldFileUpload>} */
export const Disabled = {
  render: () => ({
    components: { FieldFileUpload },
    setup() {
      const files = ref([createReport()])
      return { files }
    },
    template: DISABLED_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Disabled state: the "Choose file" button, the drop region and every remove button are disabled, and the helper switches to `kind="disabled"` (lock icon).'
      },
      source: {
        code: toSfc(
          [VUE_IMPORT, IMPORT, '', `const files = ref([${REPORT_FILE}])`],
          DISABLED_TEMPLATE
        )
      }
    }
  }
}
