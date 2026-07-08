import Default from '@aziontech/webkit/svg/azion/default'
import Full from '@aziontech/webkit/svg/azion/full'
import Min from '@aziontech/webkit/svg/azion/min'
import MoveToTheEdge from '@aziontech/webkit/svg/azion/move-to-the-edge'
import Technologies from '@aziontech/webkit/svg/azion/technologies'

import { toSfc } from '../../../_shared/story-source'

const IMPORT_DEFAULT = "import Default from '@aziontech/webkit/svg/azion/default'"
const IMPORT_FULL = "import Full from '@aziontech/webkit/svg/azion/full'"
const IMPORT_MIN = "import Min from '@aziontech/webkit/svg/azion/min'"
const IMPORT_MOVE_TO_THE_EDGE =
  "import MoveToTheEdge from '@aziontech/webkit/svg/azion/move-to-the-edge'"
const IMPORT_TECHNOLOGIES = "import Technologies from '@aziontech/webkit/svg/azion/technologies'"

/** @type {import('@storybook/vue3').Meta<typeof Default>} */
const meta = {
  title: 'Components/Content/AzionLogo',
  component: Default,
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
          'Azion brand assets shipped as inline SVG components under `@aziontech/webkit/svg/azion/*`: the logo in its default, full, and minimal variants, plus the "Move to the Edge" and "Technologies" brand illustrations. They render at their intrinsic size and take no props.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const DEFAULT_TEMPLATE = '<Default />'

/** @type {import('@storybook/vue3').StoryObj<typeof Default>} */
export const DefaultLogo = {
  name: 'Default',
  render: () => ({ components: { Default }, template: DEFAULT_TEMPLATE }),
  parameters: {
    docs: {
      description: { story: 'The default horizontal Azion logo.' },
      source: { code: toSfc(IMPORT_DEFAULT, DEFAULT_TEMPLATE) }
    }
  }
}

const VARIANTS_TEMPLATE = `<div class="flex flex-wrap items-center gap-8">
  <Default />
  <Full />
  <Min />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Default>} */
export const Variants = {
  render: () => ({ components: { Default, Full, Min }, template: VARIANTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All logo variants side by side: default, full, and minimal.' },
      source: { code: toSfc([IMPORT_DEFAULT, IMPORT_FULL, IMPORT_MIN], VARIANTS_TEMPLATE) }
    }
  }
}

const ILLUSTRATIONS_TEMPLATE = `<div class="flex flex-wrap items-center gap-8">
  <MoveToTheEdge />
  <Technologies />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Default>} */
export const Illustrations = {
  render: () => ({
    components: { MoveToTheEdge, Technologies },
    template: ILLUSTRATIONS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'The "Move to the Edge" and "Technologies" brand illustrations.'
      },
      source: {
        code: toSfc([IMPORT_MOVE_TO_THE_EDGE, IMPORT_TECHNOLOGIES], ILLUSTRATIONS_TEMPLATE)
      }
    }
  }
}
