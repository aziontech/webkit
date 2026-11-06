import HeroForm from '@aziontech/webkit/sections/hero-form'

import { sectionMarkup, SUBMIT_STATE_BINDINGS, submitWiring } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { CONTACT_SECTION, UNDER_ATTACK_SECTION } from './_sections/hero-form'

const IMPORTS = [
  "import HeroForm from '@aziontech/webkit/sections/hero-form'",
  "import { ref } from 'vue'"
]

const HUBSPOT_REQUEST = [
  'const response = await fetch(submission.endpoint, {',
  "  method: 'POST',",
  "  headers: { 'Content-Type': 'application/json' },",
  '  body: JSON.stringify({',
  '    fields: Object.entries({ ...submission.hiddenFields, ...values }).map(([name, value]) => ({',
  '      name,',
  '      value',
  '    })),',
  '    context: { pageName: submission.pageName }',
  '  })',
  '})'
]

const SUBMIT_SCRIPT = [
  'const onSubmit = (event, values) => {',
  '  console.log(event.type, values)',
  '}'
]

const siteSource = (section) => {
  const { body, script } = sectionMarkup('HeroForm', section.props, SUBMIT_STATE_BINDINGS)
  const transport = sectionMarkup('HeroForm', { submission: section.submission }).script
  return toSfc(
    [...IMPORTS, '', ...script, '', ...transport, '', ...submitWiring(HUBSPOT_REQUEST)],
    body
  )
}

const eventSource = (section) => {
  const { body, script } = sectionMarkup('HeroForm', section.props, { '@submit': 'onSubmit' })
  return toSfc([IMPORTS[0], '', ...script, '', ...SUBMIT_SCRIPT], body)
}

const STATE_ARG_TYPES = {
  loading: { control: 'boolean', description: 'Set by the site while it sends the values.' },
  submitted: { control: 'boolean', description: 'Set by the site once the values are sent.' },
  error: { control: 'boolean', description: 'Set by the site when the values could not be sent.' },
  onSubmit: { action: 'submit', table: { category: 'events' } }
}

const STATE_ARGS = { loading: false, submitted: false, error: false }

const meta = {
  title: 'Templates/Marketing/Heroes/HeroForm',
  component: HeroForm,
  argTypes: STATE_ARG_TYPES,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const withSiteNavBar = (story) => ({
  components: { story },
  template:
    '<div><div aria-hidden="true" class="h-14 border-b border-(--border-default) bg-(--bg-canvas)" /><story /></div>'
})

const Template = (args) => ({
  components: { HeroForm },
  setup() {
    return { args }
  },
  template: '<HeroForm v-bind="args" />'
})

export const ContactSplit = {
  decorators: [withSiteNavBar],
  render: Template,
  args: { ...CONTACT_SECTION.props, ...STATE_ARGS },
  parameters: {
    docs: {
      description: {
        story:
          'The Contact page. A valid form fires the `submit` action and sends nothing; toggle `loading`, `submitted` and `error` to see what the site sets back.'
      },
      source: { code: siteSource(CONTACT_SECTION) }
    }
  }
}

export const ContactSplitJson = {
  tags: ['!dev'],
  ...siteJsonStory(CONTACT_SECTION)
}

export const UnderAttack = {
  decorators: [withSiteNavBar],
  render: Template,
  args: { ...UNDER_ATTACK_SECTION.props, ...STATE_ARGS },
  parameters: {
    docs: {
      description: {
        story:
          'The incident field set, for a team under attack: the same block with other `fields`, no role and no message, a website instead. The highlights under the description carry the attack figures.'
      },
      source: { code: eventSource(UNDER_ATTACK_SECTION) }
    }
  }
}

export const UnderAttackJson = {
  tags: ['!dev'],
  ...siteJsonStory(UNDER_ATTACK_SECTION)
}
