import Chip from '@aziontech/webkit/chips'

const IMPORT = "import Chip from '@aziontech/webkit/chips'"

/** Indent a `<template>` body and wrap it in a runnable `<script setup>` SFC. */
const indent = (code) =>
  code
    .trim()
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')

const sfc = (body) => ['<script setup>', IMPORT, '</script>', '', '<template>', indent(body), '</template>'].join('\n')

const meta = {
  title: 'Components/Inputs/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A compact, dismissible token that labels a user-applied value, such as a removable filter on a data view. When `removable` is set, it renders a trailing button that emits the `remove` event.'
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true,
        // Composite stories supply their own full-SFC `source.code` (Storybook's
        // dynamic source can't introspect a multi-element render template); pass
        // those through untouched. Arg-driven stories get bare markup (sometimes
        // already wrapped in <template>) — unwrap once, then wrap in a runnable SFC.
        transform: (code) => {
          let src = String(code).trim()
          if (/<script[\s>]/i.test(src)) return src
          const wrapped = src.match(/^<template>\s*([\s\S]*?)\s*<\/template>$/)
          if (wrapped) src = wrapped[1].trim()
          return sfc(src)
        }
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: 'undefined' } }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
      description: 'Size token; medium is 24px tall, small is 20px.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: 'medium' }
      }
    },
    removable: {
      control: 'boolean',
      description: 'When true, renders a trailing remove button that emits remove.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  },
  args: { label: 'Label', size: 'medium', removable: false }
}

export default meta

const Template = (args) => ({
  components: { Chip },
  setup() {
    return { props: args }
  },
  template: '<Chip v-bind="props" />'
})

export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'The baseline Chip rendering its `label`.' } }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Chip label="Small" size="small" />
  <Chip label="Medium" size="medium" />
</div>`

export const Sizes = {
  render: () => ({
    components: { Chip },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Both sizes side by side.' },
      source: { code: sfc(SIZES_TEMPLATE) }
    }
  }
}

export const Removable = {
  args: { removable: true },
  render: Template,
  argTypes: { onRemove: { action: 'remove' } },
  parameters: {
    docs: { description: { story: 'Removable chip; the × button emits `remove`.' } }
  }
}
