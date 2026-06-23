import SignUpCard from '@aziontech/webkit/templates/sign-up-card'

export default {
  title: 'Templates/SignUpCard',
  component: SignUpCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        component:
          'Sign-up card template composed from Webkit Button, theme tokens, and Divider. Matches the Webkit Figma templates example (node 3665:6630).'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card heading'
    },
    subtitle: {
      control: 'text',
      description: 'Supporting copy below the heading'
    },
    githubLabel: {
      control: 'text',
      description: 'Label for the GitHub sign-up action'
    },
    googleLabel: {
      control: 'text',
      description: 'Label for the Google sign-up action'
    },
    emailLabel: {
      control: 'text',
      description: 'Label for the primary email sign-up action'
    },
    signInPrompt: {
      control: 'text',
      description: 'Footer prompt before the sign-in link'
    },
    signInLabel: {
      control: 'text',
      description: 'Sign-in link label'
    },
    termsHref: {
      control: 'text',
      description: 'Terms of Service link URL'
    },
    privacyHref: {
      control: 'text',
      description: 'Privacy Policy link URL'
    },
    signInHref: {
      control: 'text',
      description: 'Sign-in link URL'
    },
    showGithub: {
      control: 'boolean',
      description: 'Whether the GitHub button is shown'
    },
    showGoogle: {
      control: 'boolean',
      description: 'Whether the Google button is shown'
    }
  }
}

const renderSignUpCard = (args) => ({
  components: { SignUpCard },
  setup() {
    return { args }
  },
  template: `
    <SignUpCard v-bind="args" />
  `
})

export const Default = {
  args: {
    title: 'Sign Up for a Free Account',
    subtitle: 'US$ 300 credit to use over 12 months, no credit card is required.',
    githubLabel: 'Continue with Github',
    googleLabel: 'Continue with Google',
    emailLabel: 'Sign Up with Work Email',
    signInPrompt: 'Already have an account?',
    signInLabel: 'Sign in',
    showGithub: true,
    showGoogle: true
  },
  render: renderSignUpCard
}

export const EmailOnly = {
  args: {
    ...Default.args,
    showGithub: false,
    showGoogle: false
  },
  render: renderSignUpCard
}

export const WithActions = {
  args: Default.args,
  render: (args) => ({
    components: { SignUpCard },
    setup() {
      const log = (name) => () => window.alert(`${name} clicked`)

      return {
        args,
        onGithubClick: log('GitHub'),
        onGoogleClick: log('Google'),
        onEmailClick: log('Email'),
        onSignInClick: log('Sign in')
      }
    },
    template: `
      <SignUpCard
        v-bind="args"
        @github-click="onGithubClick"
        @google-click="onGoogleClick"
        @email-click="onEmailClick"
        @sign-in-click="onSignInClick"
      />
    `
  })
}
