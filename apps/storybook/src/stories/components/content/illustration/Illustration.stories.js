import Illustration from '@aziontech/webkit/illustration'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Illustration from '@aziontech/webkit/illustration'"

// The registered scene names — the values `name` accepts. Keep in step with
// packages/webkit/src/assets/illustrations/registry.ts.
const ASSETS = [
  'ai-applications',
  'automate-threat-mitigation',
  'azion-to-vercel',
  'build-applications',
  'deploy-secure-mcp-server',
  'distributed-apis',
  'dns-protection',
  'fastest-path-to-live-website',
  'implement-api-gateway-security',
  'infrastructure-as-code',
  'live-debugging',
  'modern-frontends',
  'preview',
  'programmable-security',
  'protect-financial-applications',
  'quick-start-with-templates',
  'retail-application-modernization',
  'runtime',
  'saas-platforms'
]

/** @type {import('@storybook/vue3').Meta<typeof Illustration>} */
const meta = {
  title: 'Components/Content/Illustration',
  component: Illustration,
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
          'An official product illustration. `name` selects a scene from a closed registry of SVGs exported from the Assets library in Figma and shipped with the package, so a page can only render artwork design has signed off and the same concept is the same drawing everywhere. There is no way to assemble a scene out of markup: a drawing that does not exist yet has to be drawn in Figma and exported first.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    name: {
      control: 'select',
      // The empty option is the placeholder: every other value resolves to a scene, so
      // it is the only way to reach the fallback from the Controls panel.
      options: ['', ...ASSETS],
      description: 'Name of an official scene in the illustration asset library.',
      table: { defaultValue: { summary: "''" }, type: { summary: 'string' } }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name; empty keeps the illustration decorative and hidden from assistive tech.',
      table: { defaultValue: { summary: "''" }, type: { summary: 'string' } }
    }
  },
  args: {
    name: 'modern-frontends',
    ariaLabel: ''
  }
}

export default meta

const Template = (args) => ({
  components: { Illustration },
  setup: () => ({ props: args }),
  template: '<Illustration v-bind="props" />'
})

const DEFAULT_MARKUP = '<Illustration name="modern-frontends" />'

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'A scene selected by name, decorative by default.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const ASSETS_TEMPLATE = `<div class="grid grid-cols-2 gap-(--spacing-lg)">
${ASSETS.map((n) => `  <Illustration name="${n}" />`).join('\n')}
</div>`

export const Assets = {
  render: () => ({
    components: { Illustration },
    setup: () => ({ assets: ASSETS }),
    template: `<div class="grid grid-cols-2 gap-(--spacing-lg)">
      <Illustration v-for="asset in assets" :key="asset" :name="asset" />
    </div>`
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Every registered scene. These are the only values `name` accepts — a drawing that is not here has to be exported from Figma first.'
      },
      source: { code: toSfc(IMPORT, ASSETS_TEMPLATE) }
    }
  }
}

const PLACEHOLDER_MARKUP = '<Illustration />'

export const Placeholder = {
  render: Template,
  args: { name: '', ariaLabel: '' },
  parameters: {
    docs: {
      description: {
        story:
          'A `name` that resolves to no scene — empty, or not in the registry — renders the placeholder frame instead of collapsing the layout, so a screen missing its artwork says so. An unregistered name also warns in development. The placeholder is always decorative: it draws no scene, so an `ariaLabel` written for the missing artwork is not announced.'
      },
      source: { code: toSfc(IMPORT, PLACEHOLDER_MARKUP) }
    }
  }
}

const LABELED_MARKUP =
  '<Illustration\n  name="deploy-secure-mcp-server"\n  aria-label="An MCP server deployed behind the edge firewall"\n/>'

export const Labeled = {
  render: Template,
  args: {
    name: 'deploy-secure-mcp-server',
    ariaLabel: 'An MCP server deployed behind the edge firewall'
  },
  parameters: {
    docs: {
      description: {
        story:
          'With an `ariaLabel` the scene is announced instead of skipped — for the rare case where the artwork carries meaning the surrounding copy does not.'
      },
      source: { code: toSfc(IMPORT, LABELED_MARKUP) }
    }
  }
}
