import { toSfc } from '../../../_shared/story-source'
import { AUTH_COMPONENTS, AUTH_PARAMETERS, centeredFlow, SHELL_IMPORTS } from './_auth-markup'

const CHECK_INBOX_PAGE = `<CardBox class="w-full max-w-(--container-sm)" :padded="false">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
      <header class="flex flex-col gap-(--spacing-xxs)">
        <h1 class="text-heading-sm text-(--text-default)">Check your inbox</h1>
        <p class="text-body-sm text-(--text-muted)">
          We sent a verification link to myemail@example.com. Check your inbox or spam folder and follow the instructions.
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

const CHECK_INBOX_TEMPLATE = centeredFlow(CHECK_INBOX_PAGE)

const meta = {
  title: 'Templates/Platform/Auth/CheckInbox',
  tags: ['autodocs'],
  parameters: {
    ...AUTH_PARAMETERS,
    docs: {
      description: {
        component:
          'The /signup/verify screen of the console, frame included: the signed-out `GlobalHeader` over a centred `CardBox` that says where the verification link went, with the resend and already-opened prompts and a secondary Return to sign in `Button`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'check inbox',
        'check your email',
        'verify email',
        'email verification',
        'confirm email',
        'verification sent',
        'resend email',
        'verificar e-mail',
        'confirmar e-mail',
        'confira seu e-mail'
      ],
      skills: ['webkit-microcopy']
    }
  }
}

export default meta

export const CheckInbox = {
  render: () => ({ components: AUTH_COMPONENTS, template: CHECK_INBOX_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The /signup/verify screen: where the verification link went, the resend and already-opened prompts, and a secondary Return to sign in action.'
      },
      source: { code: toSfc(SHELL_IMPORTS, CHECK_INBOX_TEMPLATE) }
    }
  }
}
