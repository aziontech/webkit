import Divider from '@aziontech/webkit/divider'

const IMPORT = "import Divider from '@aziontech/webkit/divider'"

/** Wrap a `<template>` body in a runnable `<script setup>` SFC for "Show code". */
const sfc = (body) =>
  [
    '<script setup>',
    IMPORT,
    '</script>',
    '',
    '<template>',
    body
      .trim()
      .split('\n')
      .map((line) => (line ? `  ${line}` : line))
      .join('\n'),
    '</template>'
  ].join('\n')

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
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
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

// One reactive render for every story. It binds BOTH props (`:orientation` +
// `:label`) and the wrapper gives the divider a definite width AND height, so a
// horizontal line fills the width and a vertical line fills the height — every
// control works on every story (proven Storybook 8 vue3 pattern: return { args }
// and reference args.* in the template).
const Template = (args) => ({
  components: { Divider },
  setup() {
    return { args }
  },
  template: `
    <div class="flex items-center justify-center w-full max-w-[360px] h-[80px]">
      <Divider :orientation="args.orientation" :label="args.label" />
    </div>
  `
})

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Reactive playground — switch `orientation` and type a `label` to see it update live.' },
      source: { code: sfc('<Divider orientation="horizontal" />') }
    }
  }
}

export const WithLabel = {
  render: Template,
  args: { orientation: 'horizontal', label: 'OR' },
  parameters: {
    docs: {
      description: { story: 'Horizontal divider with a centered label ("OR") in the middle. Both `orientation` and `label` controls are live.' },
      source: { code: sfc('<Divider orientation="horizontal" label="OR" />') }
    }
  }
}

export const Vertical = {
  render: Template,
  args: { orientation: 'vertical', label: 'OR' },
  parameters: {
    docs: {
      description: { story: 'Vertical divider with a centered label ("OR") in the middle; the parent provides the height. Both controls are live.' },
      source: { code: sfc('<Divider orientation="vertical" label="OR" />') }
    }
  }
}
