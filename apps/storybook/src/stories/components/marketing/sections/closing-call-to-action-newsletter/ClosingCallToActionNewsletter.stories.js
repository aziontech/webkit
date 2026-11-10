import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'

import { sectionMarkup } from '../../../../_shared/section-source'
import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/closing-call-to-action-newsletter'

const IMPORTS = [
  "import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'"
]

const SUBMIT_SCRIPT = [
  'const onSubmit = (event, values) => {',
  '  console.log(event.type, values)',
  '}'
]

const source = (props) => {
  const { body, script } = sectionMarkup('ClosingCallToActionNewsletter', props, {
    '@submit': 'onSubmit'
  })
  return toSfc([...IMPORTS, '', ...script, '', ...SUBMIT_SCRIPT], body)
}

/** @type {import('@storybook/vue3').Meta<typeof ClosingCallToActionNewsletter>} */
const meta = {
  title: 'Components/Marketing/Sections/ClosingCallToActionNewsletter',
  component: ClosingCallToActionNewsletter,
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
          "The closing band whose ask is a newsletter sign-up: the overline and a large headline on the lead side, a subscribe form labelled by the ask on the other, over a strip lit by the pixelated primary wave, then the hatched closing frame. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-newsletter', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `overline`, `field-text`, `button` and `texture-material`. The block never sends: it validates the address locally and on a valid submit emits `submit` with the event and `{ email }`; the site posts the address and reports the outcome back through `loading`, `submitted` and `error`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    form: {
      control: 'object',
      description:
        'Copy of the subscribe form: `{ placeholder, submitLabel, successMessage, errorMessage, requiredMessage, invalidMessage }`.',
      table: {
        category: 'props',
        type: { summary: 'ClosingCallToActionNewsletterForm' },
        defaultValue: { summary: '—' }
      }
    },
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Overline on the lead side, closed by the blinking cursor.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description: 'The ask, rendered as the label of the email field; it also names the band.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    description: {
      control: 'text',
      description: "The pitch, rendered as the band's large `h2` on the lead side.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    loading: {
      control: 'boolean',
      description:
        'The site is sending the address: the field is disabled, the button shows its loading state and a submit is ignored.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    submitted: {
      control: 'boolean',
      description: 'The site sent the address: the form gives way to `form.successMessage`.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    error: {
      control: 'boolean',
      description: 'The site could not send the address: `form.errorMessage` shows under the form.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onSubmit: {
      action: 'submit',
      description:
        'Fired on a valid submit, not while `loading`; `values` is `{ email }`. The block never sends it.',
      table: {
        category: 'events',
        type: { summary: '(event: SubmitEvent, values: Record<string, string>) => void' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ClosingCallToActionNewsletter },
  setup() {
    return { args }
  },
  template: '<ClosingCallToActionNewsletter v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof ClosingCallToActionNewsletter>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Blog close. Submit the field empty or with a malformed address to see its message; a valid address fires the `submit` action with `{ email }` and nothing is sent.'
      },
      source: { code: source(SITE_SECTION.props) }
    }
  }
}

const LOADING = { ...SITE_SECTION.props, loading: true }

/** @type {import('@storybook/vue3').StoryObj<typeof ClosingCallToActionNewsletter>} */
export const Loading = {
  render: Template,
  args: LOADING,
  parameters: {
    docs: {
      description: {
        story: 'While the site sends the address: the field is disabled and the button spins.'
      },
      source: { code: source(LOADING) }
    }
  }
}

const SUBMITTED = { ...SITE_SECTION.props, submitted: true }

/** @type {import('@storybook/vue3').StoryObj<typeof ClosingCallToActionNewsletter>} */
export const Submitted = {
  render: Template,
  args: SUBMITTED,
  parameters: {
    docs: {
      description: {
        story: 'The site reported the address as sent: the form gives way to `form.successMessage`.'
      },
      source: { code: source(SUBMITTED) }
    }
  }
}

const ERROR = { ...SITE_SECTION.props, error: true }

/** @type {import('@storybook/vue3').StoryObj<typeof ClosingCallToActionNewsletter>} */
export const Failed = {
  render: Template,
  args: ERROR,
  parameters: {
    docs: {
      description: {
        story:
          'The site could not send the address: `form.errorMessage` shows under the form, which stays editable.'
      },
      source: { code: source(ERROR) }
    }
  }
}
