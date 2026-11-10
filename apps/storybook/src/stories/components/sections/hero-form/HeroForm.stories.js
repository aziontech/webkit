import HeroForm from '@aziontech/webkit/sections/hero-form'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import {
  CONTACT_SECTION,
  UNDER_ATTACK_SECTION
} from '../../../templates/marketing/_sections/hero-form'

const IMPORT = "import HeroForm from '@aziontech/webkit/sections/hero-form'"

const SUBMIT_SCRIPT = [
  'const onSubmit = (event, values) => {',
  '  console.log(event.type, values)',
  '}'
]

const source = (props) => {
  const { body, script } = sectionMarkup('HeroForm', props, { '@submit': 'onSubmit' })
  return toSfc([IMPORT, '', ...script, '', ...SUBMIT_SCRIPT], body)
}

const FIELD_SUMMARY =
  "{ name: string; kind: 'text' | 'email' | 'select' | 'phone' | 'textarea'; label: string; placeholder?: string; required?: boolean; half?: boolean; options?: string[]; country?: string }"

const text = (description) => ({
  control: 'text',
  description,
  table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
})

const flag = (description) => ({
  control: 'boolean',
  description,
  table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
})

/** @type {import('@storybook/vue3').Meta<typeof HeroForm>} */
const meta = {
  title: 'Components/Sections/HeroForm',
  component: HeroForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The opening band of a lead-capture page, where the form is the reason for the page: the hero copy and a list of highlights on one side, the form on the other, above the fold, with the client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-form', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `topic`, the `field-*` controls, `button` and `message`. The fields are data, so the Contact and Under attack pages are the same block. The block never sends: it validates the fields locally and on a valid submit emits `submit` with the event and the values by field `name`; the site posts them and reports back through `loading`, `submitted` and `error`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    messages: {
      control: 'object',
      description: 'Copy of the form outcomes: `{ missing, invalidEmail, success, error }`.',
      table: {
        category: 'props',
        type: { summary: 'HeroFormMessages' },
        defaultValue: { summary: '—' }
      }
    },
    eyebrow: text('Short overline above the headline.'),
    highlight: text('Opening words of the headline, painted in the brand accent.'),
    title: text('Page headline, rendered as the page `h1`; the band renders nothing when empty.'),
    description: text('Sentence under the headline.'),
    items: {
      control: 'object',
      description:
        'The highlights under the description, in order; each is `{ icon, title, description }`. The list renders only when there are items.',
      table: {
        category: 'props',
        type: {
          summary: 'HeroFormItem[]',
          detail: '{ icon: string; title: string; description: string }'
        },
        defaultValue: { summary: '[]' }
      }
    },
    formAriaLabel: text('Accessible name of the field group, read as its legend.'),
    fields: {
      control: 'object',
      description:
        'The form fields in order; each is `{ name, kind, label, placeholder?, required?, half?, options?, country? }`.',
      table: {
        category: 'props',
        type: { summary: 'HeroFormField[]', detail: FIELD_SUMMARY },
        defaultValue: { summary: '[]' }
      }
    },
    submitLabel: text('Label of the submit button.'),
    carouselLabel: text('Overline above the client strip.'),
    carouselMarks: {
      control: 'object',
      description:
        'Registry names of the client marks, in order; the strip renders only when there are marks.',
      table: { category: 'props', type: { summary: 'string[]' }, defaultValue: { summary: '[]' } }
    },
    loading: flag(
      'The site is sending the values: the button shows its loading state and a submit is ignored.'
    ),
    submitted: flag('The site sent the values: the form gives way to `messages.success`.'),
    error: flag('The site could not send the values: `messages.error` shows under the form.'),
    onSubmit: {
      action: 'submit',
      description:
        'Fired on a valid submit, not while `loading`; `values` holds every field by `name`. The block never sends it.',
      table: {
        category: 'events',
        type: { summary: '(event: SubmitEvent, values: Record<string, string>) => void' }
      }
    }
  },
  args: CONTACT_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { HeroForm },
  setup() {
    return { args }
  },
  template: '<HeroForm v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof HeroForm>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Contact page. Submit with a required field empty or a malformed email to see the field messages; a valid form fires the `submit` action with the values and nothing is sent.'
      },
      source: { code: source(CONTACT_SECTION.props) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof HeroForm>} */
export const UnderAttack = {
  render: Template,
  args: UNDER_ATTACK_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The same block with the incident `fields` and `items`: no role and no message, a website instead.'
      },
      source: { code: source(UNDER_ATTACK_SECTION.props) }
    }
  }
}

const LOADING = { ...CONTACT_SECTION.props, loading: true }

/** @type {import('@storybook/vue3').StoryObj<typeof HeroForm>} */
export const Loading = {
  render: Template,
  args: LOADING,
  parameters: {
    docs: {
      description: {
        story: 'While the site sends the values: the button spins and a submit is ignored.'
      },
      source: { code: source(LOADING) }
    }
  }
}

const SUBMITTED = { ...CONTACT_SECTION.props, submitted: true }

/** @type {import('@storybook/vue3').StoryObj<typeof HeroForm>} */
export const Submitted = {
  render: Template,
  args: SUBMITTED,
  parameters: {
    docs: {
      description: {
        story: 'The site reported the values as sent: the form gives way to `messages.success`.'
      },
      source: { code: source(SUBMITTED) }
    }
  }
}

const FAILED = { ...CONTACT_SECTION.props, error: true }

/** @type {import('@storybook/vue3').StoryObj<typeof HeroForm>} */
export const Failed = {
  render: Template,
  args: FAILED,
  parameters: {
    docs: {
      description: {
        story:
          'The site could not send the values: `messages.error` shows under the button and the form stays editable.'
      },
      source: { code: source(FAILED) }
    }
  }
}
