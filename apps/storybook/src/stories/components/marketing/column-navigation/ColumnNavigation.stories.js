import ColumnNavigation from '@aziontech/webkit/column-navigation'
import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'
import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'

import { toSfc } from '../../../_shared/story-source'

const components = { ColumnNavigation, ColumnNavigationColumn, ColumnNavigationItem }

const IMPORT = [
  "import ColumnNavigation from '@aziontech/webkit/column-navigation'",
  "import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'",
  "import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'"
]

/** @type {import('@storybook/vue3').Meta<typeof ColumnNavigation>} */
const meta = {
  title: 'Components/Marketing/ColumnNavigation',
  component: ColumnNavigation,
  subcomponents: { ColumnNavigationColumn, ColumnNavigationItem },
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
          "A directory of destinations laid out in columns on one set of shared hairlines: each column carries an overline heading over a rule, then its rows — a framed glyph, the destination's name, and one line of what it is. It is the page-level navigation band a marketing page closes a section with, so a reader who got that far can leave for anything the platform holds without going back to the bar."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name for the navigation landmark; a page carrying more than one needs each of them named.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    columns: {
      control: 'inline-radio',
      options: [2, 3, 4],
      description: 'How many columns the directory fans out to at the large breakpoint.',
      table: {
        category: 'props',
        type: { summary: '2 | 3 | 4' },
        defaultValue: { summary: '4' }
      }
    },
    mobileColumns: {
      control: 'inline-radio',
      options: [1, 2],
      description: 'How many columns the directory holds below the small breakpoint.',
      table: {
        category: 'props',
        type: { summary: '1 | 2' },
        defaultValue: { summary: '1' }
      }
    },
    default: {
      control: false,
      description: 'The columns, composed as `ColumnNavigationColumn` elements in reading order.',
      table: { category: 'slots' }
    }
  }
}

export default meta

const DEFAULT_TEMPLATE = `<ColumnNavigation aria-label="Platform" :columns="4" :mobile-columns="2">
  <ColumnNavigationColumn title="Compute">
    <ColumnNavigationItem icon="ai ai-edge-functions" title="Functions" description="Run serverless code closer to users" href="/functions" />
    <ColumnNavigationItem icon="ai ai-edge-orchestrator" title="Rules Engine" description="Automate request handling with programmable rules" href="/rules-engine" />
    <ColumnNavigationItem icon="ai ai-load-balancer" title="Load Balancer" description="Distribute traffic for performance and availability" href="/load-balancer" />
  </ColumnNavigationColumn>
  <ColumnNavigationColumn title="Data">
    <ColumnNavigationItem icon="ai ai-edge-storage" title="Object Storage" description="Scalable, durable storage for unstructured data" href="/object-storage" />
    <ColumnNavigationItem icon="ai ai-edge-sql" title="SQL Database" description="Relational database built for distributed applications" href="/sql-database" />
    <ColumnNavigationItem icon="ai ai-tiered-cache" title="Cache" description="Accelerate content delivery and reduce origin load" href="/cache" />
  </ColumnNavigationColumn>
  <ColumnNavigationColumn title="Security">
    <ColumnNavigationItem icon="ai ai-waf-rules" title="WAF" description="Block application attacks at the edge" href="/waf" />
    <ColumnNavigationItem icon="ai ai-network-lists" title="Network Shield" description="Absorb volumetric and protocol attacks" href="/network-shield" />
    <ColumnNavigationItem icon="ai ai-edge-dns" title="Edge DNS" description="Authoritative DNS answered from every location" href="/edge-dns" />
  </ColumnNavigationColumn>
  <ColumnNavigationColumn title="Observe">
    <ColumnNavigationItem icon="ai ai-real-time-metrics" title="Real-Time Metrics" description="Watch traffic and errors as they happen" href="/real-time-metrics" />
    <ColumnNavigationItem icon="ai ai-data-stream" title="Data Stream" description="Ship events to the tools you already run" href="/data-stream" />
    <ColumnNavigationItem icon="ai ai-real-time-events" title="Real-Time Events" description="Query every request without sampling" href="/real-time-events" />
  </ColumnNavigationColumn>
</ColumnNavigation>`

/** @type {import('@storybook/vue3').StoryObj<typeof ColumnNavigation>} */
export const Default = {
  render: () => ({ components, template: DEFAULT_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The four-column directory: one column per group, each headed by its overline over a rule, then its destinations. The rules between the columns are the grid's own 1px gaps, so four adjacent columns produce three hairlines instead of six. Below the small breakpoint the block folds to the two columns `mobile-columns` asks for."
      },
      source: { code: toSfc(IMPORT, DEFAULT_TEMPLATE) }
    }
  }
}

const COLUMNS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <ColumnNavigation aria-label="Platform, two columns" :columns="2">
    <ColumnNavigationColumn title="Compute">
      <ColumnNavigationItem icon="ai ai-edge-functions" title="Functions" description="Run serverless code closer to users" href="/functions" />
      <ColumnNavigationItem icon="ai ai-load-balancer" title="Load Balancer" description="Distribute traffic for performance and availability" href="/load-balancer" />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Data">
      <ColumnNavigationItem icon="ai ai-edge-sql" title="SQL Database" description="Relational database built for distributed applications" href="/sql-database" />
      <ColumnNavigationItem icon="ai ai-tiered-cache" title="Cache" description="Accelerate content delivery and reduce origin load" href="/cache" />
    </ColumnNavigationColumn>
  </ColumnNavigation>

  <ColumnNavigation aria-label="Platform, three columns" :columns="3">
    <ColumnNavigationColumn title="Compute">
      <ColumnNavigationItem icon="ai ai-edge-functions" title="Functions" description="Run serverless code closer to users" href="/functions" />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Data">
      <ColumnNavigationItem icon="ai ai-edge-sql" title="SQL Database" description="Relational database built for distributed applications" href="/sql-database" />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Security">
      <ColumnNavigationItem icon="ai ai-waf-rules" title="WAF" description="Block application attacks at the edge" href="/waf" />
    </ColumnNavigationColumn>
  </ColumnNavigation>

  <ColumnNavigation aria-label="Platform, four columns" :columns="4">
    <ColumnNavigationColumn title="Compute">
      <ColumnNavigationItem icon="ai ai-edge-functions" title="Functions" description="Run serverless code closer to users" href="/functions" />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Data">
      <ColumnNavigationItem icon="ai ai-edge-sql" title="SQL Database" description="Relational database built for distributed applications" href="/sql-database" />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Security">
      <ColumnNavigationItem icon="ai ai-waf-rules" title="WAF" description="Block application attacks at the edge" href="/waf" />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Observe">
      <ColumnNavigationItem icon="ai ai-real-time-metrics" title="Real-Time Metrics" description="Watch traffic and errors as they happen" href="/real-time-metrics" />
    </ColumnNavigationColumn>
  </ColumnNavigation>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ColumnNavigation>} */
export const Columns = {
  render: () => ({ components, template: COLUMNS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "`columns` is the block's only variant axis — it declares no `kind` and no `size` — so the fan-out is what a composite `Types` story shows for any other component. Two, three and four tracks, the same rows in each: the columns share one rhythm and the grid keeps drawing one hairline per seam however many there are."
      },
      source: { code: toSfc(IMPORT, COLUMNS_TEMPLATE) }
    }
  }
}

const ROWS_TEMPLATE = `<ColumnNavigation aria-label="Row states" :columns="2">
  <ColumnNavigationColumn title="Available now">
    <ColumnNavigationItem icon="ai ai-edge-functions" title="Functions" description="Run serverless code closer to users" href="/functions" />
    <ColumnNavigationItem icon="ai ai-edge-sql" title="SQL Database" href="/sql-database" />
  </ColumnNavigationColumn>
  <ColumnNavigationColumn title="On the way">
    <ColumnNavigationItem icon="ai ai-edge-ai" title="AI Inference" description="Run AI models closer to users" />
    <ColumnNavigationItem icon="ai ai-gateway" title="AI Gateway" description="Secure, manage, and optimize AI traffic" />
  </ColumnNavigationColumn>
</ColumnNavigation>`

/** @type {import('@storybook/vue3').StoryObj<typeof ColumnNavigation>} */
export const Rows = {
  render: () => ({ components, template: ROWS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The row's two state deltas, neither of which shows on the default block. A row with no `description` is one line and keeps the column's rhythm. A row with no `href` is not a link: it renders, it reads, and it answers neither the pointer nor `Tab` — which is how a destination that does not exist yet is listed without pretending to be clickable."
      },
      source: { code: toSfc(IMPORT, ROWS_TEMPLATE) }
    }
  }
}
