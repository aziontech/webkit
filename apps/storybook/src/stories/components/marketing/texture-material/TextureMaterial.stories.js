import TextureMaterial from '@aziontech/webkit/texture-material'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import TextureMaterial from '@aziontech/webkit/texture-material'"

/** @type {import('@storybook/vue3').Meta<typeof TextureMaterial>} */
const meta = {
  title: 'Components/Marketing/TextureMaterial',
  component: TextureMaterial,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'The one decorative surface every band in the system is painted on: a full-bleed, non-interactive layer that tiles a texture behind whatever sits above it. It is a material, not a container — it takes no content and claims no space, so a band composes it into its own backdrop slot and keeps ownership of its layout.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['dots', 'grid', 'lines', 'dither', 'pixelate', 'none'],
      description: 'Which texture to paint; `none` renders the layer with no texture at all.',
      table: {
        category: 'props',
        type: { summary: "'dots' | 'grid' | 'lines' | 'dither' | 'pixelate' | 'none'" },
        defaultValue: { summary: "'dots'" }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: 'Pitch of the tiling — how far apart the cells sit.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    fade: {
      control: 'inline-radio',
      options: ['none', 'top', 'bottom', 'edges', 'vignette'],
      description: 'Fades the layer out along an axis so it meets content without a hard edge.',
      table: {
        category: 'props',
        type: { summary: "'none' | 'top' | 'bottom' | 'edges' | 'vignette'" },
        defaultValue: { summary: "'none'" }
      }
    }
  },
  args: { kind: 'dots', size: 'medium', fade: 'none' }
}

export default meta

const Template = (args) => ({
  components: { TextureMaterial },
  setup() {
    return { args }
  },
  template: `
    <div class="relative h-80 w-full overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial v-bind="args" />
    </div>
  `
})

const DEFAULT_MARKUP = `<div class="relative h-80 w-full overflow-hidden bg-(--bg-canvas)">
  <TextureMaterial kind="dots" size="medium" fade="none" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof TextureMaterial>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The layer fills its nearest positioned ancestor, so the box it sits in is what gives it a size.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial kind="dots" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial kind="grid" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial kind="lines" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial kind="dither" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial kind="pixelate" />
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof TextureMaterial>} */
export const Kinds = {
  render: () => ({ components: { TextureMaterial }, template: KINDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Five materials at their measured geometry. `dots` is the quiet default and `lines` the quietest — fine vertical rules whose transparency is the ink\u2019s own, so each one stays solid edge to edge. `dither` ramps its density along an axis, and `pixelate` lights its grid from underneath with two crossing waves.'
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial size="small" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial size="medium" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial size="large" />
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof TextureMaterial>} */
export const Sizes = {
  render: () => ({ components: { TextureMaterial }, template: SIZES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'One step either side of the measured pitch. A size scales the texture whole, so the cell keeps its proportion to the lattice.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const FADES_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial size="small" fade="bottom" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial size="small" fade="top" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial size="small" fade="edges" />
  </div>
  <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
    <TextureMaterial size="small" fade="vignette" />
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof TextureMaterial>} */
export const Fades = {
  render: () => ({ components: { TextureMaterial }, template: FADES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The layer masks itself so it can meet copy without a hard edge. `--texture-fade-start` is where it still holds full ink and `--texture-fade-end` is where it reaches zero, so a band can steer the fade without re-writing the mask.'
      },
      source: { code: toSfc(IMPORT, FADES_TEMPLATE) }
    }
  }
}
