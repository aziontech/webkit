import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FileDropzone from '@aziontech/webkit/file-dropzone'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FileDropzone from '@aziontech/webkit/file-dropzone'"
const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"
const CARD_BOX_IMPORT = "import CardBox from '@aziontech/webkit/card-box'"

const BROWSE_SCRIPT = [
  "import { ref } from 'vue'",
  '',
  BUTTON_IMPORT,
  IMPORT,
  '',
  'const input = ref(null)',
  'const browse = () => input.value?.click()'
]

const DEFAULT_MARKUP = `<div class="w-full max-w-(--container-md)">
  <FileDropzone description="Or browse for files on your computer.">
    <Button label="Browse files" kind="secondary" size="medium" @click="browse" />
  </FileDropzone>
  <input ref="input" type="file" multiple class="hidden" />
</div>`

const DISABLED_MARKUP = `<div class="w-full max-w-(--container-md)">
  <FileDropzone description="Or browse for files on your computer." disabled>
    <Button label="Browse files" kind="secondary" size="medium" disabled @click="browse" />
  </FileDropzone>
  <input ref="input" type="file" multiple class="hidden" />
</div>`

const OVERLAY_MARKUP = `<div class="relative w-full max-w-(--container-md)">
  <CardBox title="Project files">
    <template #content>
      <div class="flex min-h-48 flex-col gap-(--spacing-xs)">
        <p class="text-body-sm text-(--text-muted)">Drag a file from your computer over this window. The drop target covers this card until you drop the file, leave the window or press Escape.</p>
      </div>
    </template>
  </CardBox>
  <FileDropzone kind="overlay" />
</div>`

const ACCEPT_TEMPLATE = `<div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-md)">
  <FileDropzone accept="image/*" description="Images only. Other file types are rejected." @drop="onDrop" @reject="onReject" />
  <div class="flex flex-col gap-(--spacing-xxs) text-body-sm">
    <p class="text-(--text-default)">Accepted: {{ accepted.length ? accepted.join(', ') : 'none yet' }}</p>
    <p class="text-(--text-muted)">Rejected: {{ rejected.length ? rejected.join(', ') : 'none yet' }}</p>
  </div>
</div>`

const ACCEPT_SCRIPT = [
  "import { ref } from 'vue'",
  '',
  IMPORT,
  '',
  'const accepted = ref([])',
  'const rejected = ref([])',
  'const onDrop = (event, files) => {',
  '  accepted.value = [...accepted.value, ...files.map((file) => file.name)]',
  '}',
  'const onReject = (event, files) => {',
  '  rejected.value = [...rejected.value, ...files.map((file) => file.name)]',
  '}'
]

/** @type {import('@storybook/vue3').Meta<typeof FileDropzone>} */
const meta = {
  title: 'Components/Primitives/Inputs/FileDropzone',
  component: FileDropzone,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
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
          'The target a user drags files from the operating system onto. It owns the drag lifecycle (only drags carrying files count), the `accept` / `multiple` filtering and the idle/active look, and hands the result back as two events: `drop` with the accepted files and `reject` with the files it filtered out. It holds no value and renders no file list. `inline` is an always-visible dashed region with a slot for a "Browse files" action; `overlay` stays hidden until files are dragged over the window, then covers its nearest positioned ancestor. The drop target is pointer-only, so the keyboard path is a real button the consumer provides.'
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['inline', 'overlay'],
      description:
        'Placement. Inline is an always-visible dashed region; overlay stays hidden until files are dragged over the window, then covers its nearest positioned ancestor.',
      table: {
        category: 'props',
        type: { summary: "'inline' | 'overlay'" },
        defaultValue: { summary: "'inline'" }
      }
    },
    title: {
      control: 'text',
      description: 'Instruction shown under the icon.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Drop files to upload'" }
      }
    },
    description: {
      control: 'text',
      description:
        'Secondary line under the title, typically the accepted types and limits. Not rendered when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    accept: {
      control: 'text',
      description:
        'Comma-separated file filter using the native input accept syntax (extensions, MIME types, type wildcards). Files that do not match are rejected. Empty accepts every file.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    multiple: {
      control: 'boolean',
      description:
        'When false, only the first accepted file of a drop is accepted and the rest are rejected.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Ignores drags and drops: no active state, no events.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description:
        'Paints the inline region with the danger border so a wrapping field can show a validation error. Drops still work.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the glyph above the title.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'pi pi-cloud-upload'" }
      }
    },
    onDrop: {
      action: 'drop',
      description:
        'Fires when files are dropped and at least one passes accept / multiple. files holds only the accepted files and is never empty.',
      table: { category: 'events', type: { summary: '(event: DragEvent, files: File[])' } }
    },
    onReject: {
      action: 'reject',
      description:
        'Fires on the same drop when one or more files were filtered out. files holds only the rejected files and is never empty.',
      table: { category: 'events', type: { summary: '(event: DragEvent, files: File[])' } }
    },
    default: {
      control: false,
      description:
        'Actions or extra content under the description, typically a "Browse files" Button. Rendered only in kind="inline".',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    kind: 'inline',
    title: 'Drop files to upload',
    description: 'Or browse for files on your computer.',
    accept: '',
    multiple: true,
    disabled: false,
    invalid: false,
    icon: 'pi pi-cloud-upload'
  }
}

export default meta

const Template = (args) => ({
  components: { FileDropzone, Button },
  setup() {
    const input = ref(null)
    const browse = () => input.value?.click()
    return { args, input, browse }
  },
  template: `<div class="w-full max-w-(--container-md)">
  <FileDropzone v-bind="args">
    <Button label="Browse files" kind="secondary" size="medium" :disabled="args.disabled" @click="browse" />
  </FileDropzone>
  <input ref="input" type="file" multiple class="hidden" />
</div>`
})

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'An inline drop region with a "Browse files" button wired to a hidden file input, the keyboard path to the same outcome.'
      },
      source: { code: toSfc(BROWSE_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

export const Overlay = {
  render: (args) => ({
    components: { FileDropzone, CardBox },
    setup() {
      return { args }
    },
    template: `<div class="relative w-full max-w-(--container-md)">
  <CardBox title="Project files">
    <template #content>
      <div class="flex min-h-48 flex-col gap-(--spacing-xs)">
        <p class="text-body-sm text-(--text-muted)">Drag a file from your computer over this window. The drop target covers this card until you drop the file, leave the window or press Escape.</p>
      </div>
    </template>
  </CardBox>
  <FileDropzone v-bind="args" />
</div>`
  }),
  args: {
    kind: 'overlay',
    description: ''
  },
  parameters: {
    docs: {
      description: {
        story:
          'Hidden at rest. Drag a file over the window and the overlay fades in over its nearest positioned ancestor, here the wrapper around the card.'
      },
      source: { code: toSfc([CARD_BOX_IMPORT, IMPORT], OVERLAY_MARKUP) }
    }
  }
}

export const Accept = {
  render: (args) => ({
    components: { FileDropzone },
    setup() {
      const accepted = ref([])
      const rejected = ref([])
      const onDrop = (event, files) => {
        accepted.value = [...accepted.value, ...files.map((file) => file.name)]
        args.onDrop?.(event, files)
      }
      const onReject = (event, files) => {
        rejected.value = [...rejected.value, ...files.map((file) => file.name)]
        args.onReject?.(event, files)
      }
      return { accepted, rejected, onDrop, onReject }
    },
    template: ACCEPT_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With `accept="image/*"`, image files arrive in `drop` and every other file arrives in `reject`. Drop a mix of files to see both lists fill.'
      },
      source: { code: toSfc(ACCEPT_SCRIPT, ACCEPT_TEMPLATE) }
    }
  }
}

export const Disabled = {
  render: Template,
  args: {
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'Ignores drags and drops and emits nothing. The slotted button is disabled by the consumer.'
      },
      source: { code: toSfc(BROWSE_SCRIPT, DISABLED_MARKUP) }
    }
  }
}
