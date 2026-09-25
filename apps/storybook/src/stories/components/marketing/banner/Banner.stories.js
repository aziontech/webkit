import Banner from '@aziontech/webkit/banner'
import Button from '@aziontech/webkit/button'

import { toSfc } from '../../../_shared/story-source'

const IMPORTS = [
  "import Banner from '@aziontech/webkit/banner'",
  "import Button from '@aziontech/webkit/button'"
]

/** @type {import('@storybook/vue3').Meta<typeof Banner>} */
const meta = {
  title: 'Components/Marketing/Banner',
  component: Banner,
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
          "A split promotional band: the announcement and its actions in the wide leading column, a short supporting note on a raised surface in the narrow trailing one. It is the page's one loud interruption between sections — wider and more assertive than `call-to-action`, which is a single-column closing ask."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: "The announcement, rendered as the band's `h2` in the leading column.",
      table: {
        category: 'props',
        type: { summary: 'string' }
      }
    },
    description: {
      control: 'text',
      description:
        'Supporting note set on the raised trailing column; overridden by the `aside` slot.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Short uppercase overline naming the programme, above the announcement.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    actions: {
      control: false,
      description: 'The controls the band exists to offer, under the announcement.',
      table: { category: 'slots' }
    },
    aside: {
      control: false,
      description: 'Trailing column content; replaces the `description` prop when provided.',
      table: { category: 'slots' }
    }
  }
}

export default meta

const DEFAULT_MARKUP = `<Banner
  eyebrow="Edge Runtime"
  title="WebAssembly now runs in every edge location."
  description="Ship the same binary everywhere — no regions to pick and no cold starts to budget for."
>
  <template #actions>
    <Button label="Read the announcement" />
  </template>
</Banner>`

/** @type {import('@storybook/vue3').StoryObj<typeof Banner>} */
export const Default = {
  render: () => ({ components: { Banner, Button }, template: DEFAULT_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The band as a page uses it mid-scroll: the `eyebrow` names the programme, the `h2` carries the announcement, and one primary action sits under it in the `actions` slot. The `description` fills the raised trailing column with the single piece of context the announcement needs. From `md` up the two columns sit side by side, two-thirds to one; below it they stack announcement first and the action stretches full width.'
      },
      source: { code: toSfc(IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const WITH_ASIDE_MARKUP = `<Banner
  eyebrow="Edge Runtime"
  title="WebAssembly now runs in every edge location."
>
  <template #actions>
    <Button label="Read the announcement" />
  </template>
  <template #aside>
    Rolling out to every account through October —
    <a
      class="text-link"
      href="/changelog/webassembly-rollout"
      >the rollout schedule</a
    >
    lists the date each region switches over.
  </template>
</Banner>`

/** @type {import('@storybook/vue3').StoryObj<typeof Banner>} */
export const WithAside = {
  render: () => ({ components: { Banner, Button }, template: WITH_ASIDE_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same band with the trailing column filled through the `aside` slot instead of the `description` prop. The slot replaces the prop, so it is the only way to put more than a sentence there — here a rollout note carrying an inline link. The column renders as one flow of copy, so slot content stays phrasing-level: text, emphasis and anchors, never a block of its own.'
      },
      source: { code: toSfc(IMPORTS, WITH_ASIDE_MARKUP) }
    }
  }
}
