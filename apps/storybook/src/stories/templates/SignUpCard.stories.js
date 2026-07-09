import SignUpCard from '@aziontech/webkit/sign-up-card'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import SignUpCard from '@aziontech/webkit/sign-up-card'"

/** @type {import('@storybook/vue3').Meta<typeof SignUpCard>} */
const meta = {
  title: 'Templates/SignUpCard',
  component: SignUpCard,
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
          'Sign-up card template for a product onboarding flow: optional social sign-up actions (GitHub, Google), a primary email sign-up button, legal links, and a sign-in footer prompt.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card heading.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Sign Up for a Free Account'" }
      }
    },
    subtitle: {
      control: 'text',
      description: 'Supporting copy below the heading.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: {
          summary: "'US$ 300 credit to use over 12 months, no credit card is required.'"
        }
      }
    },
    githubLabel: {
      control: 'text',
      description: 'Label for the GitHub sign-up action.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Continue with Github'" }
      }
    },
    googleLabel: {
      control: 'text',
      description: 'Label for the Google sign-up action.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Continue with Google'" }
      }
    },
    emailLabel: {
      control: 'text',
      description: 'Label for the primary email sign-up action.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Sign Up with Work Email'" }
      }
    },
    signInPrompt: {
      control: 'text',
      description: 'Footer prompt shown before the sign-in link.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Already have an account?'" }
      }
    },
    signInLabel: {
      control: 'text',
      description: 'Sign-in link label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Sign in'" }
      }
    },
    termsHref: {
      control: 'text',
      description: 'Terms of Service link URL.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'#'" }
      }
    },
    privacyHref: {
      control: 'text',
      description: 'Privacy Policy link URL.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'#'" }
      }
    },
    signInHref: {
      control: 'text',
      description: 'Sign-in link URL.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'#'" }
      }
    },
    showGithub: {
      control: 'boolean',
      description: 'Whether the GitHub sign-up button is shown.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    showGoogle: {
      control: 'boolean',
      description: 'Whether the Google sign-up button is shown.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    onGithubClick: {
      action: 'github-click',
      description: 'Emitted when the GitHub sign-up button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onGoogleClick: {
      action: 'google-click',
      description: 'Emitted when the Google sign-up button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onEmailClick: {
      action: 'email-click',
      description: 'Emitted when the primary email sign-up button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onSignInClick: {
      action: 'sign-in-click',
      description: 'Emitted when the sign-in footer link is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onTermsClick: {
      action: 'terms-click',
      description: 'Emitted when the Terms of Service link is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onPrivacyClick: {
      action: 'privacy-click',
      description: 'Emitted when the Privacy Policy link is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    }
  },
  args: {
    title: 'Sign Up for a Free Account',
    subtitle: 'US$ 300 credit to use over 12 months, no credit card is required.',
    githubLabel: 'Continue with Github',
    googleLabel: 'Continue with Google',
    emailLabel: 'Sign Up with Work Email',
    signInPrompt: 'Already have an account?',
    signInLabel: 'Sign in',
    termsHref: '#',
    privacyHref: '#',
    signInHref: '#',
    showGithub: true,
    showGoogle: true
  }
}

export default meta

const Template = (args) => ({
  components: { SignUpCard },
  setup() {
    return { args }
  },
  template: '<SignUpCard v-bind="args" />'
})

const DEFAULT_MARKUP = '<SignUpCard />'

/** @type {import('@storybook/vue3').StoryObj<typeof SignUpCard>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Default sign-up card with both social actions, the primary email action, legal links, and the sign-in footer prompt.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const EMAIL_ONLY_MARKUP = '<SignUpCard :show-github="false" :show-google="false" />'

/** @type {import('@storybook/vue3').StoryObj<typeof SignUpCard>} */
export const EmailOnly = {
  args: {
    showGithub: false,
    showGoogle: false
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Both social actions hidden, leaving only the primary email sign-up action, legal links, and sign-in footer.'
      },
      source: { code: toSfc(IMPORT, EMAIL_ONLY_MARKUP) }
    }
  }
}
