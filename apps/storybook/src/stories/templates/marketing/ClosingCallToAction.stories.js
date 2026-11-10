import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ClosingCallToAction from '@aziontech/webkit/sections/closing-call-to-action'
import ClosingCallToActionAgents from '@aziontech/webkit/sections/closing-call-to-action-agents'
import ClosingCallToActionNewsletter from '@aziontech/webkit/sections/closing-call-to-action-newsletter'

import { COLUMN_IMPORTS, indent } from '../../_shared/markup'
import { sectionMarkup, SUBMIT_STATE_BINDINGS, submitWiring } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { PANEL_SECTION, PRIMARY_SECTION, SPLIT_SECTION } from './_sections/closing-call-to-action'
import { SITE_SECTION as AGENTS_SECTION } from './_sections/closing-call-to-action-agents'
import { SITE_SECTION as NEWSLETTER_SECTION } from './_sections/closing-call-to-action-newsletter'

const IMPORT = "import ClosingCallToAction from '@aziontech/webkit/sections/closing-call-to-action'"

const AGENTS_IMPORT =
  "import ClosingCallToActionAgents from '@aziontech/webkit/sections/closing-call-to-action-agents'"

const NEWSLETTER_IMPORTS = [
  "import ClosingCallToActionNewsletter from '@aziontech/webkit/sections/closing-call-to-action-newsletter'",
  "import { ref } from 'vue'"
]

const closingColumn = (markup) =>
  `<SectionContainer max-width="site">\n  <SectionGap hatch />\n\n${indent(markup)}\n</SectionContainer>`

const source = (tag, section, imports) => {
  const { body, script } = sectionMarkup(tag, section.props)
  return toSfc([...COLUMN_IMPORTS, ...imports, '', ...script], closingColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Closing CTAs/ClosingCallToAction',
  component: ClosingCallToAction,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const Template = (args) => ({
  components: { SectionContainer, SectionGap, ClosingCallToAction },
  setup() {
    return { args }
  },
  template: closingColumn('<ClosingCallToAction v-bind="args" />')
})

const NewsletterTemplate = (args) => ({
  components: { SectionContainer, SectionGap, ClosingCallToActionNewsletter },
  setup() {
    return { args }
  },
  template: closingColumn('<ClosingCallToActionNewsletter v-bind="args" />')
})

export const Split = {
  render: Template,
  args: SPLIT_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The solution pages close: the headline and `Start for free` in the raised lead cell, the sentence and `Talk to a specialist` in the aside cell, then a tall closing frame.'
      },
      source: { code: source('ClosingCallToAction', SPLIT_SECTION, [IMPORT]) }
    }
  }
}

export const SplitJson = {
  tags: ['!dev'],
  ...siteJsonStory(SPLIT_SECTION)
}

export const Panel = {
  render: Template,
  args: PANEL_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Careers close: a panel with one action to the job listing, then a short closing frame.'
      },
      source: { code: source('ClosingCallToAction', PANEL_SECTION, [IMPORT]) }
    }
  }
}

export const PanelJson = {
  tags: ['!dev'],
  ...siteJsonStory(PANEL_SECTION)
}

const NEWSLETTER_MARKUP = sectionMarkup(
  'ClosingCallToActionNewsletter',
  NEWSLETTER_SECTION.props,
  SUBMIT_STATE_BINDINGS
)

const NEWSLETTER_REQUEST = [
  "const response = await fetch('/api/newsletter', {",
  "  method: 'POST',",
  "  headers: { 'Content-Type': 'application/json' },",
  '  body: JSON.stringify(values)',
  '})'
]

const NEWSLETTER_SOURCE = toSfc(
  [
    ...COLUMN_IMPORTS,
    ...NEWSLETTER_IMPORTS,
    '',
    ...NEWSLETTER_MARKUP.script,
    '',
    ...submitWiring(NEWSLETTER_REQUEST)
  ],
  closingColumn(NEWSLETTER_MARKUP.body)
)

const STATE_ARG_TYPES = {
  loading: { control: 'boolean', description: 'Set by the site while it sends the address.' },
  submitted: { control: 'boolean', description: 'Set by the site once the address is sent.' },
  error: { control: 'boolean', description: 'Set by the site when the address could not be sent.' },
  onSubmit: { action: 'submit', table: { category: 'events' } }
}

export const Newsletter = {
  render: NewsletterTemplate,
  args: { ...NEWSLETTER_SECTION.props, loading: false, submitted: false, error: false },
  argTypes: STATE_ARG_TYPES,
  parameters: {
    docs: {
      description: {
        story:
          'The ask beside a subscribe form, over a strip lit by the pixelated primary wave. The headline sits large on the lead side and the ask labels the email field. The Blog and Resource Hub pages close with it. An empty field and a malformed address each show their message under the field; a valid address fires the `submit` action and sends nothing. Toggle `loading`, `submitted` and `error` to see what the site sets back.'
      },
      source: { code: NEWSLETTER_SOURCE }
    }
  }
}

export const NewsletterJson = {
  tags: ['!dev'],
  ...siteJsonStory(NEWSLETTER_SECTION)
}

export const Primary = {
  render: Template,
  args: PRIMARY_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The loud close: one centred ask on the canvas, under a pixelated texture whose two waves keep travelling across it, then the tall closing frame.'
      },
      source: { code: source('ClosingCallToAction', PRIMARY_SECTION, [IMPORT]) }
    }
  }
}

export const PrimaryJson = {
  tags: ['!dev'],
  ...siteJsonStory(PRIMARY_SECTION)
}

const AgentsTemplate = (args) => ({
  components: { SectionContainer, SectionGap, ClosingCallToActionAgents },
  setup() {
    return { args }
  },
  template: closingColumn('<ClosingCallToActionAgents v-bind="args" />')
})

export const Agents = {
  render: AgentsTemplate,
  args: AGENTS_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The close for a reader who may be a person or an agent: the `primary` register with a switch under the title. For humans opens on two actions; For agents swaps in a copyable prompt and the agent docs. The typed word loops under both.'
      },
      source: { code: source('ClosingCallToActionAgents', AGENTS_SECTION, [AGENTS_IMPORT]) }
    }
  }
}

export const AgentsJson = {
  tags: ['!dev'],
  ...siteJsonStory(AGENTS_SECTION)
}
