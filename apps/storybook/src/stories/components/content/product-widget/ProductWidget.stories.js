import ProductWidget from '@aziontech/webkit/product-widget'
import { ref } from 'vue'

import {
  productWidgetFragments,
  productWidgetScreens
} from '../../../../../../../packages/webkit/src/components/content/product-widget/registry'
import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import ProductWidget from '@aziontech/webkit/product-widget'"

const FRAMED = Object.keys(productWidgetScreens).sort()
const FRAGMENTS = Object.keys(productWidgetFragments).sort()

const NAMES = [...FRAMED, ...FRAGMENTS].sort()

const KINDS = ['window', 'bare']
const FADES = ['none', 'bottom', 'top', 'left', 'right', 'y']
const TEXTURES = ['dots', 'grid', 'lines', 'dither', 'pixelate', 'none']
const TABS = [
  'overview',
  'topology',
  'deploy',
  'main-settings',
  'cache-settings',
  'device-groups',
  'functions',
  'rules-engine'
]

/** @type {import('@storybook/vue3').Meta<typeof ProductWidget>} */
const meta = {
  title: 'Components/Primitives/Content/ProductWidget',
  component: ProductWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "One of the official console widgets: a scaled, inert mock of an Azion Console screen or fragment, drawn with real webkit components inside a ShellMockup frame, for the marketing bands that show the product. `name` selects the widget from a closed registry loaded on demand, so the same screen is the same drawing on every page. The other props pass through to the widget that declares them; unset keeps the widget's own value."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    name: {
      control: 'select',
      options: NAMES,
      description: 'Name of the console widget to draw.',
      table: { category: 'props', type: { summary: 'ProductWidgetName' } }
    },
    active: {
      control: 'boolean',
      description:
        'Whether this widget is the one showing; it replays its entrance each time it becomes active.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    hover: {
      control: 'boolean',
      description: 'Whether the pointer is over the host; a fragment plays its beat while it is.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    kind: {
      control: 'select',
      options: KINDS,
      description: "How a framed widget is plated; unset keeps the widget's own plating.",
      table: {
        category: 'props',
        type: { summary: "'window' | 'bare'" },
        defaultValue: { summary: 'undefined' }
      }
    },
    chrome: {
      control: 'boolean',
      description: "Draws the console bar on a framed widget; unset keeps the widget's own bar.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    width: {
      control: { type: 'number', step: 20 },
      description:
        "Design width of a framed widget from md up; unset keeps the widget's own width.",
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' }
      }
    },
    fade: {
      control: 'select',
      options: FADES,
      description: 'Edge a framed widget fades out along.',
      table: {
        category: 'props',
        type: { summary: "'none' | 'bottom' | 'top' | 'left' | 'right' | 'y'" },
        defaultValue: { summary: "'none'" }
      }
    },
    texture: {
      control: 'select',
      options: TEXTURES,
      description: 'Texture a full-screen widget is grounded with.',
      table: {
        category: 'props',
        type: { summary: "'dots' | 'grid' | 'lines' | 'dither' | 'pixelate' | 'none'" },
        defaultValue: { summary: "'none'" }
      }
    },
    tab: {
      control: 'select',
      options: TABS,
      description:
        'Tab a tabbed widget plays (workload-overview, application-version); other widgets ignore it, and unset plays the first tab.',
      table: {
        category: 'props',
        type: { summary: 'ProductWidgetTab' },
        defaultValue: { summary: 'undefined' }
      }
    },
    interval: {
      control: 'number',
      description:
        'Milliseconds between revealed log lines in the deploy logs widget; unset keeps its own pace.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: {
    name: 'workloads-list',
    active: true,
    hover: false,
    fade: 'none',
    texture: 'none'
  }
}

export default meta

const DEFAULT_MARKUP = `<div class="h-96 w-full">
  <ProductWidget name="workloads-list" />
</div>`

export const Default = {
  render: (args) => ({
    components: { ProductWidget },
    setup: () => ({ props: args }),
    template: '<div class="h-96 w-full"><ProductWidget v-bind="props" /></div>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'A framed widget, the workloads list, filling a panel the host sizes.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="grid w-full grid-cols-1 gap-(--spacing-lg) md:grid-cols-2">
  <div class="h-80 w-full">
    <ProductWidget
      name="workload-topology"
      kind="window"
    />
  </div>
  <div class="h-80 w-full">
    <ProductWidget
      name="workload-topology"
      kind="bare"
    />
  </div>
</div>`

export const Types = {
  render: () => ({ components: { ProductWidget }, template: TYPES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A framed widget plated as a console window, and the same widget bare, floating on the host surface.'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const LIBRARY_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <div
      v-for="name in FRAMED"
      :key="name"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <span class="text-label-sm text-(--text-muted)">{{ name }}</span>
      <div class="aspect-[1.9/1] w-full">
        <ProductWidget
          :name="name"
          fade="bottom"
        />
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="name in FRAGMENTS"
      :key="name"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <span class="text-label-sm text-(--text-muted)">{{ name }}</span>
      <div
        class="h-80 w-full min-w-0 overflow-x-visible overflow-y-clip rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xl) pt-(--spacing-xl) [--mockup-fade-color:var(--bg-surface)]"
        @pointerenter="hovered = name"
        @pointerleave="hovered = ''"
      >
        <ProductWidget
          :name="name"
          :hover="hovered === name"
        />
      </div>
    </div>
  </div>
</div>`

const LIBRARY_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  `const FRAMED = ${JSON.stringify(FRAMED).replaceAll('"', "'")}`,
  `const FRAGMENTS = ${JSON.stringify(FRAGMENTS).replaceAll('"', "'")}`,
  "const hovered = ref('')"
]

export const Library = {
  render: () => ({
    components: { ProductWidget },
    setup: () => ({ FRAMED, FRAGMENTS, hovered: ref('') }),
    template: LIBRARY_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    visual: false,
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Every registered widget in the cell that hosts it on the site: full screens in wide panels, fragments in grid cells that play their beat on hover. These are the only values `name` accepts.'
      },
      source: { code: toSfc(LIBRARY_SCRIPT, LIBRARY_TEMPLATE) }
    }
  }
}
