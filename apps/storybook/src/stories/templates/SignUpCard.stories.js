import Button from '@aziontech/webkit/button'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import Button from '@aziontech/webkit/button'"

const LINK_CLASS =
  'rounded-(--shape-button) text-(--text-link) transition-colors hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--ring-color) motion-reduce:transition-none'

const SOCIAL_BLOCK = `      <div class="flex w-full shrink-0 flex-col items-start gap-(--spacing-sm)">
        <Button label="Continue with Github" kind="outlined" size="large" icon="pi pi-github" class="w-full" />
        <Button label="Continue with Google" kind="outlined" size="large" icon="ai-cor ai-google" class="w-full" />
      </div>
      <hr class="m-0 w-full shrink-0 border-0 border-t border-t-(--border-default)" />
`

// One template builder for both stories so the canvas and "Show code" never drift.
const signUpTemplate = ({ social }) => `<div class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-xs)">
  <article class="flex w-full shrink-0 flex-col items-start overflow-clip rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)">
    <div class="flex w-full shrink-0 flex-col items-start gap-(--spacing-xl) px-(--spacing-xl) py-(--spacing-xl)">
      <header class="flex w-full max-w-(--container-sm) shrink-0 flex-col items-start gap-(--spacing-xs) [word-break:break-word]">
        <h2 class="w-full text-heading-sm text-(--text-default)">Sign Up for a Free Account</h2>
        <p class="w-full text-body-sm text-(--text-muted)">US$ 300 credit to use over 12 months, no credit card is required.</p>
      </header>

      <div class="flex w-full shrink-0 flex-col items-start gap-(--spacing-xl)">
${social ? SOCIAL_BLOCK : ''}      <Button label="Sign Up with Work Email" kind="primary" size="large" class="w-full" />
      </div>

      <p class="w-full shrink-0 text-center text-body-sm text-(--text-muted) [word-break:break-word]">
        By signing up, you agree to the
        <a href="#" class="${LINK_CLASS}">Terms of Service</a>
        and
        <a href="#" class="${LINK_CLASS}">Privacy Policy</a>
      </p>
    </div>
  </article>

  <div class="flex w-full shrink-0 items-center justify-center gap-(--spacing-xs)">
    <p class="shrink-0 whitespace-nowrap text-center text-body-sm text-(--text-muted)">Already have an account?</p>
    <a href="#" class="inline-flex h-10 shrink-0 items-center text-body-sm ${LINK_CLASS}">Sign in</a>
  </div>
</div>`

const components = { Button }

/** @type {import('@storybook/vue3').Meta<typeof Button>} */
const meta = {
  title: 'Templates/SignUpCard',
  component: Button,
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
          'Sign-up card for a product onboarding flow, composed from `Button` and plain token-styled markup: optional social sign-up actions (GitHub, Google), a primary email sign-up button, legal links, and a sign-in footer prompt.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

const DEFAULT_TEMPLATE = signUpTemplate({ social: true })

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Default = {
  render: () => ({ components, template: DEFAULT_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Sign-up card with both social actions, the primary email action, legal links, and the sign-in footer prompt.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_TEMPLATE) }
    }
  }
}

const EMAIL_ONLY_TEMPLATE = signUpTemplate({ social: false })

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const EmailOnly = {
  render: () => ({ components, template: EMAIL_ONLY_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Social actions and their divider left out, leaving only the primary email sign-up action, legal links, and sign-in footer.'
      },
      source: { code: toSfc(IMPORT, EMAIL_ONLY_TEMPLATE) }
    }
  }
}
