import Button from '@aziontech/webkit/button'
import InputText from '@aziontech/webkit/input-text'
import ShellMockup from '@aziontech/webkit/shell-mockup'
import Table from '@aziontech/webkit/table'
import Tag from '@aziontech/webkit/tag'

import { toSfc } from '../../../_shared/story-source'

const components = {
  ShellMockup,
  Button,
  InputText,
  Table,
  Tag,
  'ShellMockup.Part': ShellMockup.Part,
  'Table.Header': Table.Header,
  'Table.Body': Table.Body,
  'Table.Row': Table.Row,
  'Table.HeadCell': Table.HeadCell,
  'Table.Cell': Table.Cell
}

const IMPORT = [
  "import ShellMockup from '@aziontech/webkit/shell-mockup'",
  "import Button from '@aziontech/webkit/button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Table from '@aziontech/webkit/table'",
  "import Tag from '@aziontech/webkit/tag'"
]

const DURATIONS = ['fast-01', 'fast-02', 'moderate-01', 'moderate-02', 'slow-01', 'slow-02']

/** @type {import('@storybook/vue3').Meta<typeof ShellMockup>} */
const meta = {
  title: 'Components/Content/ShellMockup',
  component: ShellMockup,
  subcomponents: { 'ShellMockup.Part': ShellMockup.Part },
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
          'A scaled, inert picture of an Azion Console screen, for marketing bands that show the product. The consumer composes the body from real webkit components at a fixed design width; the frame draws the console shell around it and scales the whole drawing to fit its host. Each `ShellMockup.Part` travels in on its own beat once the mockup scrolls into view, so the screen assembles itself instead of appearing all at once.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['window', 'bare'],
      description:
        "How the mockup is plated: a bordered console window, or bare parts floating on the host's surface.",
      table: {
        category: 'props',
        type: { summary: "'window' | 'bare'" },
        defaultValue: { summary: "'window'" }
      }
    },
    shell: {
      control: 'select',
      options: ['console', 'legacy'],
      description:
        'Console generation the shell draws: the current one, or the previous one with its top bar.',
      table: {
        category: 'props',
        type: { summary: "'console' | 'legacy'" },
        defaultValue: { summary: "'console'" }
      }
    },
    width: {
      control: 'number',
      description: 'Design width of the frame from `md` up; the frame scales to fit its host.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '860' }
      }
    },
    mobileWidth: {
      control: 'number',
      description: 'Design width of the frame below `md`.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '390' }
      }
    },
    fade: {
      control: 'select',
      options: ['none', 'bottom', 'top', 'left', 'right', 'y'],
      description: 'Edge the mockup fades out along; `y` fades top and bottom.',
      table: {
        category: 'props',
        type: { summary: "'none' | 'bottom' | 'top' | 'left' | 'right' | 'y'" },
        defaultValue: { summary: "'none'" }
      }
    },
    chrome: {
      control: 'boolean',
      description: 'Draws the console bar over the body.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    title: {
      control: 'text',
      description: 'Module label on the console bar; with a rail, `›` splits it into breadcrumbs.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    rail: {
      control: 'text',
      description: "Active entry of the console's side rail; empty renders no rail.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    texture: {
      control: 'select',
      options: ['dots', 'grid', 'lines', 'dither', 'pixelate', 'none'],
      description: 'Texture the frame is grounded with, behind the body.',
      table: {
        category: 'props',
        type: { summary: "'dots' | 'grid' | 'lines' | 'dither' | 'pixelate' | 'none'" },
        defaultValue: { summary: "'none'" }
      }
    },
    textureFade: {
      control: 'select',
      options: ['none', 'top', 'bottom', 'left', 'right', 'edges', 'vignette'],
      description: "How the frame's texture fades out before its edges.",
      table: {
        category: 'props',
        type: { summary: "'none' | 'top' | 'bottom' | 'left' | 'right' | 'edges' | 'vignette'" },
        defaultValue: { summary: "'vignette'" }
      }
    },
    travel: {
      control: 'select',
      options: DURATIONS,
      description: "Duration token of each part's travel.",
      table: {
        category: 'props',
        type: {
          summary: "'fast-01' | 'fast-02' | 'moderate-01' | 'moderate-02' | 'slow-01' | 'slow-02'"
        },
        defaultValue: { summary: "'slow-01'" }
      }
    },
    beat: {
      control: 'select',
      options: DURATIONS,
      description: "Duration token of the gap between one part's beat and the next.",
      table: {
        category: 'props',
        type: {
          summary: "'fast-01' | 'fast-02' | 'moderate-01' | 'moderate-02' | 'slow-01' | 'slow-02'"
        },
        defaultValue: { summary: "'fast-01'" }
      }
    },
    active: {
      control: 'boolean',
      description:
        'Whether this mockup is the one showing; parts replay their entrance each time it becomes active.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    interactive: {
      control: 'boolean',
      description:
        'Lets the viewer operate the controls inside instead of drawing them as an inert picture.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    still: {
      control: 'boolean',
      description: 'Draws every part in place from the start, with no entrance and no replay.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    default: {
      control: false,
      description: "The mockup's body, composed of `ShellMockup.Part` beats.",
      table: { category: 'slots' }
    },
    overlay: {
      control: false,
      description: 'A layer over the whole frame, bar and rail included, such as a drawer.',
      table: { category: 'slots' }
    }
  },
  args: {
    kind: 'window',
    shell: 'console',
    width: 860,
    mobileWidth: 390,
    fade: 'bottom',
    chrome: true,
    title: 'Workloads › my-workload',
    rail: 'workloads',
    texture: 'none',
    textureFade: 'vignette',
    travel: 'slow-01',
    beat: 'fast-01',
    active: true,
    interactive: false,
    still: false
  }
}

export default meta

const indent = (text, depth) =>
  text
    .split('\n')
    .map((line) => (line ? `${'  '.repeat(depth)}${line}` : line))
    .join('\n')

const BODY = `<div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
  <ShellMockup.Part :order="0">
    <div class="flex items-center justify-between gap-(--spacing-md)">
      <span class="text-heading-sm text-(--text-default)">Workloads</span>
      <Button label="Create workload" icon="pi pi-plus" size="medium" />
    </div>
  </ShellMockup.Part>
  <ShellMockup.Part :order="1">
    <div class="flex items-center gap-(--spacing-sm)">
      <InputText placeholder="Search workloads" size="small" />
      <Tag label="3 active" severity="success" size="small" />
    </div>
  </ShellMockup.Part>
  <ShellMockup.Part :order="2">
    <Table border>
      <Table.Header>
        <Table.Row>
          <Table.HeadCell principal>Name</Table.HeadCell>
          <Table.HeadCell>Domain</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell principal>my-workload</Table.Cell>
          <Table.Cell>my-workload.azion.app</Table.Cell>
          <Table.Cell><Tag label="Active" severity="success" size="small" /></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell principal>storefront</Table.Cell>
          <Table.Cell>shop.example.com</Table.Cell>
          <Table.Cell><Tag label="Active" severity="success" size="small" /></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell principal>docs-portal</Table.Cell>
          <Table.Cell>docs.example.com</Table.Cell>
          <Table.Cell><Tag label="Deploying" severity="warning" size="small" /></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </ShellMockup.Part>
</div>`

const mockup = (attributes) => `<ShellMockup${attributes ? ` ${attributes}` : ''}>
${indent(BODY, 1)}
</ShellMockup>`

const host = (attributes, size = 'h-96') => `<div class="${size} w-full">
${indent(mockup(attributes), 1)}
</div>`

const Template = (args) => ({
  components,
  setup: () => ({ props: args }),
  template: `<div class="h-96 w-full">
  <ShellMockup v-bind="props">
${indent(BODY, 2)}
  </ShellMockup>
</div>`
})

const DEFAULT_MARKUP = host('title="Workloads › my-workload" rail="workloads" fade="bottom"')

/** @type {import('@storybook/vue3').StoryObj<typeof ShellMockup>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A window mockup with the console rail, a breadcrumb title and three parts on successive beats, fading at the bottom. The host sets the height; the frame scales the 860 design width to fit it.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="grid w-full grid-cols-2 gap-(--spacing-lg)">
${indent(host('kind="window" title="Workloads" fade="bottom"', 'h-80'), 1)}
${indent(host('kind="bare" :chrome="false" fade="bottom"', 'h-80'), 1)}
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ShellMockup>} */
export const Types = {
  render: () => ({ components, template: TYPES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "`window` plates the body in a bordered console window; `bare` with the bar off lets the parts float on the host's own surface."
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SHELLS_TEMPLATE = `<div class="flex w-full flex-col gap-(--spacing-lg)">
${indent(host('shell="console" title="Workloads" fade="bottom"', 'h-80'), 1)}
${indent(host('shell="console" title="Workloads › my-workload" rail="workloads" fade="bottom"', 'h-80'), 1)}
${indent(host('shell="legacy" fade="bottom"', 'h-80'), 1)}
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ShellMockup>} */
export const Shells = {
  render: () => ({ components, template: SHELLS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The current console as a slim bar, the current console with its side rail and breadcrumb bar, and the previous console with its top bar.'
      },
      source: { code: toSfc(IMPORT, SHELLS_TEMPLATE) }
    }
  }
}

const FADES_TEMPLATE = `<div class="flex w-full flex-col gap-(--spacing-lg)">
${indent(host('title="Workloads" fade="bottom"', 'h-80'), 1)}
${indent(host('title="Workloads" fade="right"', 'h-80'), 1)}
${indent(host('title="Workloads" fade="y"', 'h-80'), 1)}
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ShellMockup>} */
export const Fades = {
  render: () => ({ components, template: FADES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The mockup fading along the bottom, the right, and both top and bottom, so it meets the host surface instead of ending on a hard edge.'
      },
      source: { code: toSfc(IMPORT, FADES_TEMPLATE) }
    }
  }
}
