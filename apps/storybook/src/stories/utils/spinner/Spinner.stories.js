import Spinner from '@aziontech/webkit/spinner'

import { toSfc } from '../../_shared/story-source'

const IMPORT = "import Spinner from '@aziontech/webkit/spinner'"

/** @type {import('@storybook/vue3').Meta<typeof Spinner>} */
const meta = {
  title: 'Utils/Spinner',
  component: Spinner,
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
        component:
          'Loading indicator used by Webkit action components. Size comes from the theme `size-*` scale (for example `size-4` for large buttons) and color is inherited from the parent via `currentColor`, both set through the `class` attribute.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const DEFAULT_MARKUP = '<Spinner class="size-4 text-[var(--text-default)]" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Spinner>} */
export const Default = {
  render: () => ({ components: { Spinner }, template: DEFAULT_MARKUP }),
  parameters: {
    docs: {
      description: {
        story: 'Default spinner sized with `size-4` and colored through `currentColor`.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex items-center gap-4 text-[var(--text-default)]">
  <Spinner class="size-3" />
  <Spinner class="size-4" />
  <Spinner class="size-6" />
  <Spinner class="size-8" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Spinner>} */
export const Sizes = {
  render: () => ({ components: { Spinner }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The spinner scales with the theme `size-*` utilities applied through `class`; color inherits from the parent.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}
