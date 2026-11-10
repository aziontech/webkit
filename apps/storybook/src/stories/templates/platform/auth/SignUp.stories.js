import { ref } from 'vue'

import { indent } from '../../../_shared/markup'
import { toSfc } from '../../../_shared/story-source'
import { components, footer, providerButtons, SHELL_IMPORTS, signupFlow } from '../_auth-markup'

const SIGN_UP_IMPORTS = [
  ...SHELL_IMPORTS,
  "import Divider from '@aziontech/webkit/divider'",
  "import FieldPassword from '@aziontech/webkit/field-password'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import { ref } from 'vue'",
  '',
  "const email = ref('')",
  "const password = ref('')",
  'const submitted = ref(false)'
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

        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
          <legend class="sr-only">Account credentials</legend>

          <FieldText
            v-model="email"
            label="Work Email"
            input-id="signup-email"
            name="email"
            type="email"
            autocomplete="email"
            size="large"
            placeholder="myemail@azion.com"
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

const SIGN_UP_TEMPLATE = signupFlow(SIGN_UP_PAGE)

const meta = {
  title: 'Templates/Platform/Auth/SignUp',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The /signup screen of the console, frame included: a full-height page with the signed-out `GlobalHeader` over a centred column that holds one `CardBox` and the sign-in prompt and terms under it. The email and password fields show their required state and helper only after the primary action is pressed on an empty field. Every outcome is shown in the card — there is no toast.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SignUp = {
  render: () => ({
    components,
    setup: () => ({ email: ref(''), password: ref(''), submitted: ref(false) }),
    template: SIGN_UP_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Work email and password with its requirements, the Sign up action, the Google and GitHub buttons under an “or” divider, and the sign-in prompt and terms under the card.'
      },
      source: { code: toSfc(SIGN_UP_IMPORTS, SIGN_UP_TEMPLATE) }
    }
  }
}
