import BrowserFrame from '@aziontech/webkit/browser-frame'
import Button from '@aziontech/webkit/button'
import CallToAction from '@aziontech/webkit/call-to-action'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import Topic from '@aziontech/webkit/topic'
import { ref, watch } from 'vue'

import { indent } from '../../../_shared/markup'
import { toSfc } from '../../../_shared/story-source'

const IMPORTS = [
  "import BrowserFrame from '@aziontech/webkit/browser-frame'",
  "import Button from '@aziontech/webkit/button'",
  "import CallToAction from '@aziontech/webkit/call-to-action'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import SectionContainer from '@aziontech/webkit/section-container'",
  "import SectionGap from '@aziontech/webkit/section-gap'",
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import Topic from '@aziontech/webkit/topic'"
]

const components = {
  BrowserFrame,
  Button,
  CallToAction,
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  Topic
}

const SCREEN = `<SectionContainer max-width="site">
  <SectionGap size="small" hatch />
  <SectionModule :divided="false" :padded="false">
    <template #header>
      <SectionTitle
        kind="horizontal"
        eyebrow="Platform"
        title="Build, secure and deliver from one platform"
        description="Run your applications, protect them and cache their responses on the same distributed network."
      >
        <template #actions>
          <Button kind="outlined" label="See all products" />
        </template>
      </SectionTitle>
    </template>
    <FrameBox flush borders="y" marks="all">
      <CardGrid flush kind="frame" :columns="3" :mobile-columns="1">
        <CardGrid.Cell kind="canvas">
          <Topic
            :heading-level="3"
            icon="ai ai-edge-application"
            title="Applications"
            description="Deploy web apps and APIs close to every user, with no servers to provision."
          />
        </CardGrid.Cell>
        <CardGrid.Cell kind="canvas">
          <Topic
            :heading-level="3"
            icon="ai ai-edge-firewall"
            title="Firewall"
            description="Stop DDoS, bots and injection attacks before a request reaches your origin."
          />
        </CardGrid.Cell>
        <CardGrid.Cell kind="canvas">
          <Topic
            :heading-level="3"
            icon="ai ai-tiered-cache"
            title="Tiered Cache"
            description="Answer repeat requests from the nearest location and offload your origin."
          />
        </CardGrid.Cell>
      </CardGrid>
    </FrameBox>
  </SectionModule>
  <SectionGap size="small" hatch />
  <SectionModule :divided="false" :padded="false">
    <CallToAction
      framed
      kind="split"
      eyebrow="Get started"
      title="Deploy your first application."
      title-muted="Run it everywhere."
      description="Start on the free plan and move to production when you are ready. No credit card required."
    >
      <template #actions>
        <Button kind="secondary" label="Start for free" />
      </template>
      <template #aside>
        <Button kind="outlined" label="Talk to a specialist" />
      </template>
    </CallToAction>
  </SectionModule>
  <SectionGap size="small" hatch />
</SectionContainer>`

const meta = {
  title: 'Components/Content/BrowserFrame',
  component: BrowserFrame,
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
          'A browser window that renders live webkit components inside a viewport of its own, so a page or story can show a real screen at a real device size — desktop, tablet or mobile — and resize it by hand. The default slot is teleported into an internal iframe, which gives the content a true width × height viewport: CSS breakpoints fire against the frame’s simulated width, viewport units resolve against its simulated height, and content taller than the viewport scrolls inside it like a page. When the simulated width is wider than the space available, the frame scales the whole viewport down to fit instead of clamping it. The chrome’s window dots, address and size readout are decoration; its one control is a copy button inside the address bar, and the frame’s other controls are the resize handles on its right edge, bottom edge and bottom-right corner.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    address: {
      control: 'text',
      description:
        'Read-only URL shown in the chrome’s address bar; the address bar is not rendered when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    minWidth: {
      control: 'number',
      description: 'Smallest viewport width the resize handles can reach, in pixels.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '320' } }
    },
    maxWidth: {
      control: 'number',
      description:
        'Largest viewport width the resize handles can reach, in pixels; widths wider than the container are scaled down to fit.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '1920' } }
    },
    minHeight: {
      control: 'number',
      description: 'Smallest viewport height the resize handles can reach, in pixels.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '320' } }
    },
    maxHeight: {
      control: 'number',
      description: 'Largest viewport height the resize handles can reach, in pixels.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '1440' } }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name of the viewport; when empty it falls back to `address`, then to `Preview`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    copyAriaLabel: {
      control: 'text',
      description: 'Accessible name of the address bar’s copy button.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Copy address'" }
      }
    },
    widthHandleAriaLabel: {
      control: 'text',
      description: 'Accessible name of the right-edge width handle.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Resize preview width'" }
      }
    },
    heightHandleAriaLabel: {
      control: 'text',
      description: 'Accessible name of the bottom-edge height handle.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Resize preview height'" }
      }
    },
    width: {
      control: 'number',
      description:
        'Simulated viewport width in pixels, a number bound with `v-model:width`. Undefined fills the container; the width and corner handles write a value clamped to `minWidth`…`maxWidth`.',
      table: {
        category: 'props',
        type: { summary: 'v-model:width' },
        defaultValue: { summary: 'undefined' }
      }
    },
    height: {
      control: 'number',
      description:
        'Simulated viewport height in pixels, a number bound with `v-model:height`. The height and corner handles write a value clamped to `minHeight`…`maxHeight`.',
      table: {
        category: 'props',
        type: { summary: 'v-model:height' },
        defaultValue: { summary: '800' }
      }
    },
    'onUpdate:width': {
      action: 'update:width',
      description: 'Emitted on every width resize step, pointer move or key press (v-model:width).',
      table: { category: 'events', type: { summary: 'number' } }
    },
    'onUpdate:height': {
      action: 'update:height',
      description: 'Emitted on every height resize step, pointer move or key press (v-model:height).',
      table: { category: 'events', type: { summary: 'number' } }
    },
    default: {
      control: false,
      description:
        'The live content, teleported into the frame’s viewport iframe once it is ready. Renders client-side only.',
      table: { category: 'slots' }
    }
  },
  args: {
    address: 'https://www.azion.com',
    minWidth: 320,
    maxWidth: 1920,
    minHeight: 320,
    maxHeight: 1440,
    height: 800,
    ariaLabel: 'Azion platform page',
    copyAriaLabel: 'Copy address',
    widthHandleAriaLabel: 'Resize preview width',
    heightHandleAriaLabel: 'Resize preview height'
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    const width = ref(args.width)
    watch(
      () => args.width,
      (next) => {
        width.value = next
      }
    )
    const height = ref(args.height)
    watch(
      () => args.height,
      (next) => {
        height.value = next
      }
    )
    const onUpdateWidth = (next) => {
      width.value = next
      args['onUpdate:width']?.(next)
    }
    const onUpdateHeight = (next) => {
      height.value = next
      args['onUpdate:height']?.(next)
    }
    return { args, width, height, onUpdateWidth, onUpdateHeight }
  },
  template: `<BrowserFrame
  v-bind="args"
  :width="width"
  :height="height"
  @update:width="onUpdateWidth"
  @update:height="onUpdateHeight"
>
${indent(SCREEN)}
</BrowserFrame>`
})

const DEFAULT_MARKUP = `<BrowserFrame address="https://www.azion.com" aria-label="Azion platform page">
${indent(SCREEN)}
</BrowserFrame>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A composed platform screen filling the container at the default 800-pixel height. Drag the right edge to change the width, the bottom edge to change the height, or the corner to change both, and watch the grid, the header and the closing band reflow.'
      },
      source: { code: toSfc(IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const BREAKPOINTS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <div class="flex flex-wrap items-start gap-(--spacing-xl)">
    <div class="min-w-0 grow basis-(--container-xs)">
      <BrowserFrame
        :width="375"
        :height="812"
        address="https://www.azion.com"
        aria-label="Azion platform page at mobile size, 375 by 812 pixels"
      >
${indent(SCREEN, 4)}
      </BrowserFrame>
    </div>
    <div class="min-w-0 grow-2 basis-(--container-xl)">
      <BrowserFrame
        :width="768"
        :height="1024"
        address="https://www.azion.com"
        aria-label="Azion platform page at tablet size, 768 by 1024 pixels"
      >
${indent(SCREEN, 4)}
      </BrowserFrame>
    </div>
  </div>
  <BrowserFrame
    :width="1280"
    :height="800"
    address="https://www.azion.com"
    aria-label="Azion platform page at desktop size, 1280 by 800 pixels"
  >
${indent(SCREEN, 2)}
  </BrowserFrame>
</div>`

export const Breakpoints = {
  render: () => ({ components, template: BREAKPOINTS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same screen pinned to mobile (375 × 812), tablet (768 × 1024) and desktop (1280 × 800). Mobile and tablet sit side by side on wide canvases and wrap below on narrow ones; the desktop frame takes its own row. Each viewport resolves its own breakpoints and scrolls its content inside, and a frame wider than its column is scaled down to fit instead of clamped.'
      },
      source: { code: toSfc(IMPORTS, BREAKPOINTS_TEMPLATE) }
    }
  }
}

const LONG_ADDRESS_TEMPLATE = `<div class="mx-auto w-full max-w-(--container-md)">
  <BrowserFrame
    address="https://www.azion.com/en/documentation/products/build/applications/cache-settings/tiered-cache-configuration/"
    aria-label="Cache settings documentation in a narrow column"
  >
${indent(SCREEN, 2)}
  </BrowserFrame>
</div>`

export const LongAddress = {
  render: () => ({ components, template: LONG_ADDRESS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A long address in a narrow column. The leading part ellipsizes and the last 12 characters always stay visible.'
      },
      source: { code: toSfc(IMPORTS, LONG_ADDRESS_TEMPLATE) }
    }
  }
}
