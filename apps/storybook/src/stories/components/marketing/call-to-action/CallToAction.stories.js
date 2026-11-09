import Button from '@aziontech/webkit/button'
import CallToAction from '@aziontech/webkit/call-to-action'
import TextureMaterial from '@aziontech/webkit/texture-material'
import Ticker from '@aziontech/webkit/ticker'

import { toSfc } from '../../../_shared/story-source'

const IMPORTS = [
  "import CallToAction from '@aziontech/webkit/call-to-action'",
  "import Button from '@aziontech/webkit/button'"
]

const PRIMARY_IMPORTS = [
  ...IMPORTS,
  "import TextureMaterial from '@aziontech/webkit/texture-material'",
  "import Ticker from '@aziontech/webkit/ticker'"
]

/** @type {import('@storybook/vue3').Meta<typeof CallToAction>} */
const meta = {
  title: 'Components/Marketing/CallToAction',
  component: CallToAction,
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
          'The closing ask of a marketing page: a headline, a supporting sentence and the actions that follow from them, set apart from the surrounding copy by its own surface. It is a panel, not a section header — `section-title` opens a section, `call-to-action` closes one. Four registers: `panel` sets the copy and its controls on one surface, `split` divides the band into a raised lead cell and an aside that each floor their own control, `lead` is that lead cell standing alone with every control in one row, and `primary` is the loud close, on the canvas lit by the brand.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Headline of the panel, rendered as its `h2`. Keep it to one line and one ask.',
      table: {
        category: 'props',
        type: { summary: 'string' }
      }
    },
    titleMuted: {
      control: 'text',
      description:
        'Second line of the headline, set in muted ink and rendered as a second span of the same `h2` — one sentence in two tones, announced as one heading.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    kind: {
      control: 'inline-radio',
      options: ['panel', 'split', 'lead', 'primary'],
      description:
        'Layout of the band: `panel` sets the copy and its controls on one surface, `split` divides it into a raised lead cell and an aside that each floor their own control, `lead` is that lead cell standing alone with every control in it, `primary` is a centred ask on the canvas lit by a pixelated, waving primary texture, with a floor.',
      table: {
        category: 'props',
        type: { summary: "'panel' | 'split' | 'lead' | 'primary'" },
        defaultValue: { summary: "'panel'" }
      }
    },
    framed: {
      control: 'boolean',
      description:
        "Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    description: {
      control: 'text',
      description:
        'Supporting sentence — under the headline in `panel` and `lead`, in the aside cell in `split`; overridden by the default slot when one is provided.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description:
        'Short uppercase overline rendered above the headline; use it only when the panel needs naming out of context.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    default: {
      control: false,
      description: 'Description body; replaces the `description` prop when provided.',
      table: { category: 'slots' }
    },
    actions: {
      control: false,
      description:
        "The controls the band exists to offer; in `split`, the lead cell's primary control.",
      table: { category: 'slots' }
    },
    aside: {
      control: false,
      description:
        "The aside cell's control in `split`; ignored in `panel`, `lead` and `primary`, where every control belongs in `actions`.",
      table: { category: 'slots' }
    },
    background: {
      control: false,
      description: 'Decoration drawn behind the copy in `primary`, such as a texture.',
      table: { category: 'slots' }
    },
    bottom: {
      control: false,
      description:
        'The strip that floors the band in `primary`, such as a ticker, under a hairline.',
      table: { category: 'slots' }
    }
  }
}

export default meta

const DEFAULT_MARKUP = `<CallToAction
  title="Run your first application at the edge today."
  description="Deploy once and it runs in every location on the network — no servers to size, no credit card to start."
>
  <template #actions>
    <Button label="Start for free" />
    <Button
      kind="outlined"
      label="Talk to a specialist"
    />
  </template>
</CallToAction>`

/** @type {import('@storybook/vue3').StoryObj<typeof CallToAction>} */
export const Default = {
  render: () => ({ components: { CallToAction, Button }, template: DEFAULT_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The panel a page closes with: one headline, one supporting sentence, and the two controls the reader is meant to choose between. The primary action leads and the secondary one is `outlined`, so the panel has a single obvious target. From `md` up the controls sit beside the copy; below it they stack and stretch full width.'
      },
      source: { code: toSfc(IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const WITH_EYEBROW_MARKUP = `<CallToAction
  eyebrow="Get started"
  title="Run your first application at the edge today."
  description="Deploy once and it runs in every location on the network — no servers to size, no credit card to start."
>
  <template #actions>
    <Button label="Start for free" />
    <Button
      kind="outlined"
      label="Talk to a specialist"
    />
  </template>
</CallToAction>`

/** @type {import('@storybook/vue3').StoryObj<typeof CallToAction>} */
export const WithEyebrow = {
  render: () => ({ components: { CallToAction, Button }, template: WITH_EYEBROW_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same panel with an `eyebrow` above the headline. The overline names the panel when it sits mid-page and the headline alone would not say what it belongs to. It adds a line to the copy stack, so the panel grows taller while the actions stay on the headline row from `md` up.'
      },
      source: { code: toSfc(IMPORTS, WITH_EYEBROW_MARKUP) }
    }
  }
}

const TYPES_MARKUP = `<div class="flex flex-col gap-(--spacing-xxl)">
  <CallToAction
    eyebrow="Get started"
    title="Run your first application at the edge today."
    description="Deploy once and it runs in every location on the network."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        kind="outlined"
        label="Talk to a specialist"
      />
    </template>
  </CallToAction>

  <CallToAction
    kind="split"
    eyebrow="Build"
    title="Build once."
    title-muted="Run anywhere."
    description="Get a faster path to launch, less latency, and less infrastructure overhead."
  >
    <template #actions>
      <Button
        kind="secondary"
        label="Start for free"
      />
    </template>
    <template #aside>
      <Button
        kind="outlined"
        label="Talk to our team"
      />
    </template>
  </CallToAction>

  <CallToAction
    kind="lead"
    eyebrow="Build"
    title="Built by you,"
    title-muted="or your agents."
    description="Same CLI, same docs over MCP, same deploy — whether you run it or your agent does."
  >
    <template #actions>
      <Button
        kind="secondary"
        label="Deploy now"
      />
      <Button
        kind="outlined"
        label="Docs"
      />
    </template>
  </CallToAction>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof CallToAction>} */
export const Types = {
  render: () => ({ components: { CallToAction, Button }, template: TYPES_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The three registers. `panel` keeps the copy and both controls on one surface and reads as a row from `md` up. `split` divides the band at 7fr/3fr: the raised lead cell carries the two-tone headline and the primary action, the aside carries the supporting line and the secondary one, and each cell pushes its control to the band floor so the two share a baseline whatever the copy does. `lead` is that lead cell with no aside — the supporting line moves under the headline and every control sits in one row on the floor, which is the register for a close whose actions are peers.'
      },
      source: { code: toSfc(IMPORTS, TYPES_MARKUP) }
    }
  }
}

const PRIMARY_MARKUP = `<CallToAction
  kind="primary"
  title="Build once. Run everywhere."
  description="Get a faster path to launch, lower latency, and less infrastructure overhead."
>
  <template #background>
    <TextureMaterial kind="pixelate" size="small" fade="bottom" />
  </template>
  <template #actions>
    <Button label="Start for free" kind="secondary" size="large" />
    <Button
      label="Docs"
      kind="outlined"
      size="large"
      icon="pi pi-chevron-right"
      icon-position="trailing"
      animated
    />
  </template>
  <template #bottom>
    <Ticker
      aria-label="Why teams choose Azion"
      :items="[
            { icon: 'ai ai-edge-nodes', label: 'Distributed to 100+ locations automatically' },
            { icon: 'ai ai-edge-functions', label: 'No regions to pick, no servers to manage' },
            { icon: 'ai ai-origin-shield', label: 'Stop attacks before they reach your origin' },
            { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation with no surprise charges' },
            { icon: 'pi pi-dollar', label: 'Usage-based pricing with no hidden fees' },
            { icon: 'pi pi-gift', label: 'Start with $300 in free credits' },
            { icon: 'ai ai-azion-cli', label: 'Deploy from the CLI, the Console or an agent' },
            { icon: 'ai ai-real-time-metrics', label: 'Real-time events and metrics for every request' },
            { icon: 'ai ai-real-time-purge', label: 'Purge the cache everywhere in real time' },
            { icon: 'pi pi-code', label: 'Works with Vue, React, Next.js, Astro and more' }
          ]"
    />
  </template>
</CallToAction>`

/** @type {import('@storybook/vue3').StoryObj<typeof CallToAction>} */
export const Primary = {
  render: () => ({
    components: { CallToAction, Button, TextureMaterial, Ticker },
    template: PRIMARY_MARKUP
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The loud close. The band keeps the canvas ground and owns the light: it moves the resting pools of the composed pixelate out of frame and runs its two waves at triple gain and double pace, so bright and dark bands of the primary colour keep travelling across the headline instead of a still glow. What is drawn is composed in: a pixelated `TextureMaterial` through `background`, and a benefits `Ticker` through `bottom`. The waves stand still under reduced motion.'
      },
      source: { code: toSfc(PRIMARY_IMPORTS, PRIMARY_MARKUP) }
    }
  }
}
