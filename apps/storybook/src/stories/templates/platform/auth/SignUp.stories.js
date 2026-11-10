import { ref } from 'vue'

import { indent } from '../../../_shared/markup'
import { toSfc } from '../../../_shared/story-source'
import {
  AUTH_COMPONENTS,
  AUTH_PARAMETERS,
  authMessage,
  centeredFlow,
  footer,
  providerButtons,
  SHELL_IMPORTS
} from './_auth-markup'

const signUpScript = ({ email = '', authError = 'null' } = {}) => [
  ...SHELL_IMPORTS,
  "import Divider from '@aziontech/webkit/divider'",
  "import FieldPassword from '@aziontech/webkit/field-password'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import Message from '@aziontech/webkit/message'",
  "import { ref } from 'vue'",
  '',
  `const email = ref('${email}')`,
  "const password = ref('')",
  'const submitted = ref(false)',
  '// Every server outcome (409, 5xx, timeout) lands here, never in a toast.',
  `const authError = ref(${authError})`
]

const SIGN_UP_PAGE = `<div class="flex w-full flex-col items-center gap-(--spacing-md)">
  <CardBox class="w-full max-w-(--container-sm)" :padded="false">
    <template #content>
      <form
        class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
        aria-label="Sign up for a free account"
        novalidate
        @submit.prevent="submitted = true"
      >
        <button type="submit" class="sr-only" aria-hidden="true" tabindex="-1" />
        <header class="flex flex-col gap-(--spacing-xxs)">
          <h1 class="text-heading-sm text-(--text-default)">Sign Up for a Free Account</h1>
          <p class="text-body-sm text-(--text-muted)">
            US$ 300 credit to use over 12 months, no credit card is required.
          </p>
        </header>

${indent(authMessage('authError', 'authError'), 4)}

        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
          <legend class="sr-only">Account credentials</legend>

          <FieldText
            v-model="email"
            label="Work Email"
            type="email"
            autocomplete="email"
            :spellcheck="false"
            input-id="signup-email"
            name="email"
            size="large"
            placeholder="myemail@example.com"
            :required="submitted && !email.trim()"
            :helper-text="submitted && !email.trim() ? 'This field is required.' : ''"
          />

          <FieldPassword
            v-model="password"
            label="Password"
            input-id="signup-password"
            name="password"
            autocomplete="new-password"
            placeholder="Create a password"
            requirements
            :required="submitted && !password"
            :helper-text="submitted && !password ? 'This field is required.' : ''"
          />
        </fieldset>

        <Button label="Sign up" kind="primary" size="large" class="w-full" @click="submitted = true" />

        <Divider label="or" />

        <div class="relative">
${indent(
  providerButtons(
    'flex flex-col gap-(--spacing-sm) transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none'
  ),
  5
)}
        </div>
      </form>
    </template>
  </CardBox>

${indent(footer('Already have an account?', 'Sign in', '/login'))}
</div>`

const SIGN_UP_TEMPLATE = centeredFlow(SIGN_UP_PAGE)

const ALREADY_REGISTERED = {
  severity: 'danger',
  label:
    'This email is already registered. Sign in, or reset your password if you no longer have it.'
}

const meta = {
  title: 'Templates/Platform/Auth/SignUp',
  tags: ['autodocs'],
  parameters: {
    ...AUTH_PARAMETERS,
    docs: {
      description: {
        component:
          'The /signup screen of the console, frame included: the signed-out `GlobalHeader` over a centred `CardBox` with work email (`FieldText`, `type="email"`, `autocomplete="email"`) and password with its requirements (`FieldPassword`, `new-password`), the Sign up `Button`, and the Google and GitHub buttons under an “or” `Divider`; the sign-in prompt and terms sit under the card. Every server outcome goes to one small `Message` inside the card — auth never toasts.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'signup',
        'sign up',
        'register',
        'registration',
        'create account',
        'new account',
        'free account',
        'cadastro',
        'cadastrar',
        'criar conta',
        'tela de cadastro',
        'registrar'
      ],
      skills: ['webkit-form', 'webkit-errors', 'webkit-microcopy']
    }
  }
}

export default meta

export const SignUp = {
  render: () => ({
    components: AUTH_COMPONENTS,
    setup: () => ({
      email: ref(''),
      password: ref(''),
      submitted: ref(false),
      authError: ref(null)
    }),
    template: SIGN_UP_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The /signup screen: work email and password with its requirements, the Sign up action, the Google and GitHub buttons under an “or” divider, and the sign-in prompt and terms under the card.'
      },
      source: { code: toSfc(signUpScript(), SIGN_UP_TEMPLATE) }
    }
  }
}

export const AlreadyRegistered = {
  render: () => ({
    components: AUTH_COMPONENTS,
    setup: () => ({
      email: ref('myemail@example.com'),
      password: ref(''),
      submitted: ref(false),
      authError: ref(ALREADY_REGISTERED)
    }),
    template: SIGN_UP_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The address is already registered (409): one danger `Message` inside the card that names the two exits, sign in or reset the password. No toast.'
      },
      source: {
        code: toSfc(
          signUpScript({
            email: 'myemail@example.com',
            authError: `{ severity: 'danger', label: '${ALREADY_REGISTERED.label}' }`
          }),
          SIGN_UP_TEMPLATE
        )
      }
    }
  }
}
