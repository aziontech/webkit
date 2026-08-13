import Brand from '@aziontech/webkit/brand'
import Footer from '@aziontech/webkit/footer'
import IconButton from '@aziontech/webkit/icon-button'
import Select from '@aziontech/webkit/select'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Footer from '@aziontech/webkit/footer'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Select from '@aziontech/webkit/select'",
  "import StatusIndicator from '@aziontech/webkit/status-indicator'",
  "import { ref } from 'vue'"
]

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string template: Vue compiles
// `<Footer.Column>` to `resolveComponent("Footer.Column")`, an exact-name
// lookup (a bare `Footer` registration does not satisfy it). In a real SFC
// the dotted tag resolves off the imported `Footer` binding, so consumer
// code needs only `import Footer` — these extra registrations are a
// Storybook-runtime concern.
const components = {
  Footer,
  'Footer.Column': Footer.Column,
  'Footer.Link': Footer.Link,
  Brand,
  IconButton,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  Select,
  StatusIndicator
}

/** @type {import('@storybook/vue3').Meta<typeof Footer>} */
const meta = {
  title: 'Components/Layout/Footer',
  component: Footer,
  subcomponents: {
    'Footer.Column': Footer.Column,
    'Footer.Link': Footer.Link
  },
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
          'Page footer, the bottom-of-page counterpart to GlobalHeader: link columns over a social bar, folding from four columns to the stacked mobile presentation at the md breakpoint. Links, brand, status, and language content come from the consumer.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the contentinfo landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Footer'" },
        category: 'props'
      }
    },
    default: {
      control: false,
      description: 'The Footer.Column items; a 2-column grid that becomes 4 columns at md.',
      table: { type: { summary: '—' }, category: 'slots' }
    },
    'social-start': {
      control: false,
      description: 'Leading cluster of the social bar (brand + social icon buttons).',
      table: { type: { summary: '—' }, category: 'slots' }
    },
    'social-end': {
      control: false,
      description: 'Trailing cluster of the social bar (status indicator + language select).',
      table: { type: { summary: '—' }, category: 'slots' }
    }
  },
  args: {
    ariaLabel: 'Footer'
  }
}

export default meta

// The full anatomy, authored once so the live canvas (Template) and the
// "Show code" snippet (DEFAULT_MARKUP) never drift.
const FOOTER_CONTENT = `  <Footer.Column title="Products">
    <Footer.Link href="/products/edge-application">Edge Application</Footer.Link>
    <Footer.Link href="/products/edge-firewall">Edge Firewall</Footer.Link>
    <Footer.Link href="/products/edge-storage">Edge Storage</Footer.Link>
  </Footer.Column>
  <Footer.Column title="Developers">
    <Footer.Link href="/documentation">Documentation</Footer.Link>
    <Footer.Link href="/blog">Blog</Footer.Link>
    <Footer.Link href="/integrations">Integrations</Footer.Link>
  </Footer.Column>
  <Footer.Column title="Company">
    <Footer.Link href="/about">About us</Footer.Link>
    <Footer.Link href="/careers">Careers</Footer.Link>
    <Footer.Link href="/legal">Legal</Footer.Link>
  </Footer.Column>
  <Footer.Column title="Support">
    <Footer.Link href="/contact">Contact sales</Footer.Link>
    <Footer.Link href="/support">Help center</Footer.Link>
    <Footer.Link href="https://status.azion.com/">System status</Footer.Link>
  </Footer.Column>
  <template #social-start>
    <a href="/" aria-label="Azion home">
      <Brand />
    </a>
    <div class="flex items-center gap-1">
      <IconButton kind="transparent" icon="pi pi-github" aria-label="Azion on GitHub" href="https://github.com/aziontech" target="_blank" />
      <IconButton kind="transparent" icon="pi pi-linkedin" aria-label="Azion on LinkedIn" href="https://www.linkedin.com/company/aziontech" target="_blank" />
      <IconButton kind="transparent" icon="pi pi-youtube" aria-label="Azion on YouTube" href="https://www.youtube.com/aziontech" target="_blank" />
      <IconButton kind="transparent" icon="pi pi-twitter" aria-label="Azion on X" href="https://x.com/aziontech" target="_blank" />
      <IconButton kind="transparent" icon="pi pi-instagram" aria-label="Azion on Instagram" href="https://www.instagram.com/aziontech" target="_blank" />
      <IconButton kind="transparent" icon="pi pi-discord" aria-label="Azion on Discord" href="https://discord.gg/azion" target="_blank" />
      <IconButton kind="transparent" icon="pi pi-reddit" aria-label="Azion on Reddit" href="https://www.reddit.com/r/azion" target="_blank" />
    </div>
  </template>
  <template #social-end>
    <StatusIndicator severity="success" label="All Systems Operational" />
    <div class="w-24">
      <Select v-model="language" placeholder="Language">
        <Select.Trigger aria-label="Language" />
        <Select.Content>
          <Select.Option
            v-for="o in languageOptions"
            :key="o.value"
            :value="o.value"
          >{{ o.label }}</Select.Option>
        </Select.Content>
      </Select>
    </div>
  </template>`

const SETUP_SNIPPET = `const language = ref('en')
const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'pt-br', label: 'PT-BR' },
  { value: 'es', label: 'ES' }
]`

const Template = (args) => ({
  components,
  setup() {
    const language = ref('en')
    const languageOptions = [
      { value: 'en', label: 'EN' },
      { value: 'pt-br', label: 'PT-BR' },
      { value: 'es', label: 'ES' }
    ]
    return { args, language, languageOptions }
  },
  template: `<Footer v-bind="args">
${FOOTER_CONTENT}
</Footer>`
})

const DEFAULT_MARKUP = `<Footer aria-label="Footer">
${FOOTER_CONTENT}
</Footer>`

/** @type {import('@storybook/vue3').StoryObj<typeof Footer>} */
export const DefaultFooter = {
  name: 'Default',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The footer composed with four link columns and the social bar: brand plus social icon buttons at the start, the system status indicator at the end.'
      },
      source: { code: toSfc([...IMPORT, '', SETUP_SNIPPET], DEFAULT_MARKUP) }
    }
  }
}
