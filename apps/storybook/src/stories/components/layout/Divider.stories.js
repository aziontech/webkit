import Divider from '@aziontech/webkit/divider'

const IMPORT = "import Divider from '@aziontech/webkit/divider'"

/** Indent a `<template>` body and wrap it in a runnable `<script setup>` SFC. */
const indent = (code) =>
  code
    .trim()
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')

const sfc = (body) => ['<script setup>', IMPORT, '</script>', '', '<template>', indent(body), '</template>'].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof Divider>} */
const meta = {
  title: 'Components/Layout/Divider',
  component: Divider,
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
          'Thin separator line that visually splits content into groups. Renders as a full-width hairline (`horizontal`) or full-height hairline (`vertical`), and can carry centered content (an "Or"-style label) when the default slot or `label` prop is set.'
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
          if (/<script[\s>]/i.test(src)) return src
          const wrapped = src.match(/^<template>\s*([\s\S]*?)\s*<\/template>$/)
          if (wrapped) src = wrapped[1].trim()
          // Storybook's dynamic snippet lowercases the tag; restore the
          // PascalCase name so the snippet matches the import and runs as-is.
          src = src.replace(/(<\/?)divider(?=[\s/>])/g, '$1Divider')
          return sfc(src)
        }
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Layout axis of the separator line.',
      table: {
        category: 'props',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" }
      }
    },
    label: {
      control: 'text',
      description: 'Fallback centered text shown when the default slot is empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    default: {
      description: 'Centered content; overrides `label` when provided.',
      control: false,
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    }
  },
  args: {
    orientation: 'horizontal',
    label: ''
  }
}

export default meta

const Template = (args) => ({
  components: { Divider },
  setup() {
    return { props: args }
  },
  template: '<Divider v-bind="props" />'
})

export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Horizontal hairline separating stacked content.' } }
  }
}

const ORIENTATIONS_TEMPLATE = `<div class="flex items-stretch gap-[var(--spacing-md)] h-[120px] w-full">
  <div class="flex-1 flex flex-col justify-center gap-[var(--spacing-sm)]">
    <span class="text-body-sm text-[var(--text-default)]">Above</span>
    <Divider orientation="horizontal" />
    <span class="text-body-sm text-[var(--text-default)]">Below</span>
  </div>
  <Divider orientation="vertical" />
  <div class="flex-1 flex items-center justify-center text-body-sm text-[var(--text-default)]">
    Beside the vertical divider
  </div>
</div>`

export const Orientations = {
  render: () => ({
    components: { Divider },
    template: ORIENTATIONS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Horizontal and vertical orientations side by side.' },
      source: { code: sfc(ORIENTATIONS_TEMPLATE) }
    }
  }
}

export const WithLabel = {
  render: Template,
  args: { label: 'Or' },
  parameters: {
    docs: { description: { story: 'Centered label splitting the line; the default slot overrides it when provided.' } }
  }
}
