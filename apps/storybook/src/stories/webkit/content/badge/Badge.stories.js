import Badge from '@aziontech/webkit/content/badge'

const IMPORT = "import Badge from '@aziontech/webkit/content/badge'"

/** Indent a `<template>` body and wrap it in a runnable `<script setup>` SFC. */
const indent = (code) =>
  code
    .trim()
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')

const sfc = (body) => ['<script setup>', IMPORT, '</script>', '', '<template>', indent(body), '</template>'].join('\n')

const meta = {
  title: 'Webkit/Content/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Compact, non-interactive indicator that surfaces a numeric count or short status value with severity-based color coding. Commonly overlaid on icons, avatars, or buttons.'
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true,
        // Composite stories supply their own full-SFC `source.code` (Storybook's
        // dynamic source can't introspect a multi-element render template); pass
        // those through untouched. For arg-driven stories Storybook emits bare
        // markup (sometimes already wrapped in <template>) — unwrap once, then
        // wrap in a runnable SFC so "Show code" matches the canvas exactly.
        transform: (code) => {
          let src = String(code).trim()
          if (/<script[\s>]/.test(src)) return src
          const wrapped = src.match(/^<template>\s*([\s\S]*?)\s*<\/template>$/)
          if (wrapped) src = wrapped[1].trim()
          return sfc(src)
        }
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: 'undefined' } }
    },
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'default'],
      description: 'Color style for the badge surface and label.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'" },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: 'Size token; small is 20px tall, medium is 24px, large is 30px.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'medium' }
      }
    }
  },
  args: {
    value: '99',
    severity: 'primary',
    size: 'medium'
  }
}

export default meta

const Template = (args) => ({
  components: { Badge },
  setup() {
    return { props: args }
  },
  template: '<Badge v-bind="props" />'
})

export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'A single badge driven by the controls.' } }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Badge value="99" severity="primary" />
  <Badge value="99" severity="secondary" />
  <Badge value="99" severity="success" />
  <Badge value="99" severity="warning" />
  <Badge value="99" severity="danger" />
  <Badge value="99" severity="default" />
</div>`

export const Types = {
  render: () => ({
    components: { Badge },
    template: TYPES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All severities side by side.' },
      source: { code: sfc(TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Badge value="99" size="small" />
  <Badge value="99" size="medium" />
  <Badge value="99" size="large" />
</div>`

export const Sizes = {
  render: () => ({
    components: { Badge },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All sizes side by side.' },
      source: { code: sfc(SIZES_TEMPLATE) }
    }
  }
}
