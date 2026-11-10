import { toSfc } from '../../../_shared/story-source'
import { components, SHELL_IMPORTS, signupFlow } from '../_auth-markup'

const CHECK_INBOX_PAGE = `<CardBox class="w-full max-w-(--container-sm)" :padded="false">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
      <header class="flex flex-col gap-(--spacing-xxs)">
        <h1 class="text-heading-sm text-(--text-default)">Check your inbox</h1>
        <p class="text-body-sm text-(--text-muted)">
          We sent a verification link to myemail@azion.com. Check your inbox or spam folder and follow the instructions.
        </p>
      </header>

      <div class="flex flex-col gap-(--spacing-xs)">
        <div class="flex items-center gap-(--spacing-xs)">
          <p class="text-body-sm text-(--text-default)">Didn't receive the email?</p>
          <a class="text-link text-body-sm" href="#" @click.prevent>Resend Email</a>
        </div>
        <div class="flex items-center gap-(--spacing-xs)">
          <p class="text-body-sm text-(--text-default)">Already opened it?</p>
          <a class="text-link text-body-sm" href="#" @click.prevent>Verify my email</a>
        </div>
      </div>

      <Button label="Return to sign in" kind="secondary" size="large" class="w-full" />
    </div>
  </template>
</CardBox>`

const CHECK_INBOX_TEMPLATE = signupFlow(CHECK_INBOX_PAGE)

const meta = {
  title: 'Templates/Platform/Auth/CheckInbox',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The /signup/verify screen of the console, frame included: a confirmation inside one `CardBox` that says where the verification link went, offers resend and already-opened prompts, and a secondary Return to sign in action. The confirmation lives in the card — there is no toast.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const CheckInbox = {
  render: () => ({ components, template: CHECK_INBOX_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Where the verification link went, the resend and already-opened prompts, and a secondary Return to sign in action.'
      },
      source: { code: toSfc(SHELL_IMPORTS, CHECK_INBOX_TEMPLATE) }
    }
  }
}
