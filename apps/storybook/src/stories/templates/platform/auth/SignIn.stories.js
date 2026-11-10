import { computed, ref } from 'vue'

import { indent } from '../../../_shared/markup'
import { toSfc } from '../../../_shared/story-source'
import {
  AUTH_COMPONENTS,
  AUTH_PARAMETERS,
  authColumn,
  authMessage,
  footer,
  providerButtons,
  SHELL_IMPORTS
} from './_auth-markup'

const INVALID_CREDENTIALS = {
  severity: 'danger',
  label: 'The email or password is incorrect.'
}

const signInScript = ({ step = 'email', email = '', authError = 'null' } = {}) => [
  ...SHELL_IMPORTS,
  "import Divider from '@aziontech/webkit/divider'",
  "import FieldPassword from '@aziontech/webkit/field-password'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Message from '@aziontech/webkit/message'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { computed, ref } from 'vue'",
  '',
  `const step = ref('${step}')`,
  "const returnStep = ref('email')",
  'const submitted = ref(false)',
  `const email = ref('${email}')`,
  "const password = ref('')",
  "const resetEmail = ref('')",
  "const newPassword = ref('')",
  "const confirmPassword = ref('')",
  '// Every server outcome (401, 5xx, timeout) lands here, never in a toast.',
  `const authError = ref(${authError})`,
  '',
  'const heading = computed(() => {',
  "  if (step.value === 'reset') {",
  '    return {',
  "      title: 'Reset your password',",
  '      description: "Enter the email for your account and we\'ll send you a link to set a new one."',
  '    }',
  '  }',
  "  if (step.value === 'new-password') return { title: 'Reset password', description: '' }",
  "  if (step.value === 'sent') {",
  '    return {',
  "      title: 'Check your inbox',",
  '      description: `We sent a reset link to ${resetEmail.value}. Check your inbox or spam folder and follow the instructions.`',
  '    }',
  '  }',
  "  return { title: 'Welcome back', description: 'Sign in to your account.' }",
  '})',
  '',
  'const primaryAction = computed(() => {',
  "  if (step.value === 'password') return { label: 'Sign in', kind: 'primary' }",
  "  if (step.value === 'reset') return { label: 'Send reset link', kind: 'primary' }",
  "  if (step.value === 'new-password') return { label: 'Reset password', kind: 'primary' }",
  "  if (step.value === 'sent') return { label: 'Return to sign in', kind: 'secondary' }",
  "  return { label: 'Continue with email', kind: 'primary' }",
  '})',
  '',
  'const go = (next) => {',
  '  submitted.value = false',
  '  authError.value = null',
  '  step.value = next',
  '}',
  '',
  'const backToEmail = () => {',
  "  password.value = ''",
  "  go('email')",
  '}',
  '',
  'const forgotPassword = () => {',
  "  returnStep.value = step.value === 'password' ? 'password' : 'email'",
  '  resetEmail.value = email.value',
  "  go('reset')",
  '}',
  '',
  'const openResetLink = () => {',
  "  newPassword.value = ''",
  "  confirmPassword.value = ''",
  "  go('new-password')",
  '}',
  '',
  'const handlePrimary = () => {',
  '  submitted.value = true',
  "  if (step.value === 'email' && email.value.trim()) go('password')",
  "  else if (step.value === 'reset' && resetEmail.value.trim()) go('sent')",
  "  else if (step.value === 'new-password' && newPassword.value && confirmPassword.value) {",
  '    email.value = resetEmail.value',
  "    password.value = ''",
  "    returnStep.value = 'password'",
  "    go('password')",
  "  } else if (step.value === 'sent') go(returnStep.value)",
  '}'
]

const signInState =
  ({
    step: initialStep = 'email',
    email: initialEmail = '',
    authError: initialError = null
  } = {}) =>
  () => {
    const step = ref(initialStep)
    const returnStep = ref('email')
    const submitted = ref(false)
    const email = ref(initialEmail)
    const password = ref('')
    const resetEmail = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')
    const authError = ref(initialError)

    const heading = computed(() => {
      if (step.value === 'reset') {
        return {
          title: 'Reset your password',
          description:
            "Enter the email for your account and we'll send you a link to set a new one."
        }
      }
      if (step.value === 'new-password') return { title: 'Reset password', description: '' }
      if (step.value === 'sent') {
        return {
          title: 'Check your inbox',
          description: `We sent a reset link to ${resetEmail.value}. Check your inbox or spam folder and follow the instructions.`
        }
      }
      return { title: 'Welcome back', description: 'Sign in to your account.' }
    })

    const primaryAction = computed(() => {
      if (step.value === 'password') return { label: 'Sign in', kind: 'primary' }
      if (step.value === 'reset') return { label: 'Send reset link', kind: 'primary' }
      if (step.value === 'new-password') return { label: 'Reset password', kind: 'primary' }
      if (step.value === 'sent') return { label: 'Return to sign in', kind: 'secondary' }
      return { label: 'Continue with email', kind: 'primary' }
    })

    const go = (next) => {
      submitted.value = false
      authError.value = null
      step.value = next
    }

    const backToEmail = () => {
      password.value = ''
      go('email')
    }

    const forgotPassword = () => {
      returnStep.value = step.value === 'password' ? 'password' : 'email'
      resetEmail.value = email.value
      go('reset')
    }

    const openResetLink = () => {
      newPassword.value = ''
      confirmPassword.value = ''
      go('new-password')
    }

    const handlePrimary = () => {
      submitted.value = true
      if (step.value === 'email' && email.value.trim()) go('password')
      else if (step.value === 'reset' && resetEmail.value.trim()) go('sent')
      else if (step.value === 'new-password' && newPassword.value && confirmPassword.value) {
        email.value = resetEmail.value
        password.value = ''
        returnStep.value = 'password'
        go('password')
      } else if (step.value === 'sent') go(returnStep.value)
    }

    return {
      step,
      returnStep,
      submitted,
      email,
      password,
      resetEmail,
      newPassword,
      confirmPassword,
      authError,
      heading,
      primaryAction,
      go,
      backToEmail,
      forgotPassword,
      openResetLink,
      handlePrimary
    }
  }

const IDENTITY_ROW_CLASS =
  'flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none'

const STEP_CLASS = 'motion-reduce:transition-none motion-reduce:transform-none'

const SIGN_IN_FORM = `<form
  class="flex flex-col gap-(--spacing-lg)"
  aria-label="Sign in to your account"
  novalidate
  @submit.prevent="handlePrimary"
>
  <button type="submit" class="sr-only" aria-hidden="true" tabindex="-1" />

  <div class="relative">
    <header class="flex flex-col gap-(--spacing-xxs) motion-reduce:transition-none">
      <h1 class="text-heading-sm text-(--text-default)">
        {{ heading.title }}
      </h1>
      <p v-if="heading.description" class="text-body-sm text-(--text-muted)">
        {{ heading.description }}
      </p>
    </header>
  </div>

${indent(authMessage('authError', 'authError'))}

  <div class="relative">
    <div v-if="step === 'email'" class="flex flex-col gap-(--spacing-xs) ${STEP_CLASS}">
      <FieldText
        v-model="email"
        label="Email"
        type="email"
        autocomplete="username"
        :spellcheck="false"
        input-id="login-email"
        name="email"
        size="large"
        placeholder="myemail@example.com"
        :required="submitted && !email.trim()"
        :helper-text="submitted && !email.trim() ? 'This field is required.' : ''"
      />
    </div>

    <div v-else-if="step === 'password'" class="flex flex-col gap-(--spacing-lg) ${STEP_CLASS}">
      <div class="${IDENTITY_ROW_CLASS}">
        <Tooltip text="Change email">
          <IconButton
            icon="pi pi-chevron-left"
            aria-label="Change email"
            kind="outlined"
            size="small"
            @click="backToEmail"
          />
        </Tooltip>
        <span class="truncate text-label-sm text-(--text-default)">{{ email }}</span>
      </div>

      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldPassword
          v-model="password"
          label="Password"
          input-id="login-password"
          name="password"
          autocomplete="current-password"
          placeholder="Type your password"
          :required="submitted && !password"
          :helper-text="submitted && !password ? 'This field is required.' : ''"
        />

        <a
          class="self-start text-body-xs text-(--text-muted) underline underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) aria-disabled:pointer-events-none aria-disabled:opacity-60 motion-reduce:transition-none"
          href="#"
          @click.prevent="forgotPassword"
        >Forgot your password?</a>
      </div>
    </div>

    <div v-else-if="step === 'reset'" class="flex flex-col gap-(--spacing-lg) ${STEP_CLASS}">
      <div class="${IDENTITY_ROW_CLASS}">
        <Tooltip text="Back to sign in">
          <IconButton
            icon="pi pi-chevron-left"
            aria-label="Back to sign in"
            kind="outlined"
            size="small"
            @click="go(returnStep)"
          />
        </Tooltip>
        <span class="truncate text-label-sm text-(--text-default)">Back to sign in</span>
      </div>

      <FieldText
        v-model="resetEmail"
        label="Email"
        type="email"
        autocomplete="username"
        :spellcheck="false"
        input-id="reset-email"
        name="reset-email"
        size="large"
        placeholder="myemail@example.com"
        :required="submitted && !resetEmail.trim()"
        :helper-text="submitted && !resetEmail.trim() ? 'This field is required.' : ''"
      />
    </div>

    <div v-else-if="step === 'new-password'" class="flex flex-col gap-(--spacing-lg) ${STEP_CLASS}">
      <FieldPassword
        v-model="newPassword"
        label="New password"
        input-id="new-password"
        name="new-password"
        autocomplete="new-password"
        placeholder="Enter a new password"
        requirements
        :required="submitted && !newPassword"
        :helper-text="submitted && !newPassword ? 'This field is required.' : ''"
      />

      <FieldPassword
        v-model="confirmPassword"
        label="Confirm password"
        input-id="confirm-password"
        name="confirm-password"
        autocomplete="new-password"
        placeholder="Repeat the new password"
        :required="submitted && !confirmPassword"
        :helper-text="submitted && !confirmPassword ? 'This field is required.' : ''"
      />
    </div>

    <div v-else class="flex flex-col gap-(--spacing-xs) ${STEP_CLASS}">
      <div class="flex items-center gap-(--spacing-xs)">
        <p class="text-body-sm text-(--text-default)">Didn't receive the email?</p>
        <a class="text-link text-body-sm" href="#" @click.prevent>Resend Email</a>
      </div>
      <div class="flex items-center gap-(--spacing-xs)">
        <p class="text-body-sm text-(--text-default)">Already opened it?</p>
        <a class="text-link text-body-sm" href="#" @click.prevent="openResetLink">Set a new password</a>
      </div>
    </div>
  </div>

  <div class="flex flex-col">
    <div class="relative">
      <div class="motion-reduce:transition-none">
        <Button
          :label="primaryAction.label"
          :kind="primaryAction.kind"
          size="large"
          class="w-full"
          @click="handlePrimary"
        />
      </div>

      <span
        v-if="step === 'email'"
        class="absolute right-(--spacing-sm) top-0 -translate-y-1/2 motion-reduce:transition-none"
      >
        <Tag label="Last used" severity="info" size="small" />
      </span>
    </div>

    <div class="relative">
      <div
        v-if="step === 'email'"
        class="flex flex-col gap-(--spacing-lg) pt-(--spacing-lg) motion-reduce:transition-none"
      >
        <Divider label="or" />

        <div class="relative">
${indent(providerButtons('flex flex-col gap-(--spacing-sm) motion-reduce:transition-none'), 5)}
        </div>
      </div>
    </div>
  </div>
</form>`

const SIGN_IN_PAGE = `<CardBox class="w-full max-w-(--container-sm)" :padded="false">
  <template #content>
    <div class="p-(--spacing-lg)">
      <div
        class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
      >
${indent(SIGN_IN_FORM, 4)}
      </div>
    </div>
  </template>
</CardBox>

${footer("Don't have an account?", 'Sign up', '/signup', "step === 'email' || step === 'password'")}`

const SIGN_IN_TEMPLATE = authColumn(SIGN_IN_PAGE)

const meta = {
  title: 'Templates/Platform/Auth/SignIn',
  tags: ['autodocs'],
  parameters: {
    ...AUTH_PARAMETERS,
    docs: {
      description: {
        component:
          'The /login screen of the console, frame included: the signed-out `GlobalHeader` over a centred `CardBox` with the whole step machine — email (with the Last used `Tag` and the Google and GitHub buttons under an “or” `Divider`), password with Forgot your password?, the reset request, the inbox confirmation and the new-password step. Fields are `FieldText` (`type="email"`, `autocomplete="username"`) and `FieldPassword` (`current-password` / `new-password`); required states appear only after the primary action. Every server outcome goes to one small `Message` inside the card, above the fields — auth never toasts.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'login',
        'log in',
        'sign in',
        'signin',
        'login page',
        'authentication',
        'auth',
        'forgot password',
        'reset password',
        'new password',
        'entrar',
        'tela de login',
        'acessar conta',
        'esqueci a senha',
        'redefinir senha'
      ],
      skills: ['webkit-form', 'webkit-errors', 'webkit-microcopy'],
      steps: ['email', 'password', 'reset', 'sent', 'new-password']
    }
  }
}

export default meta

export const SignIn = {
  render: () => ({
    components: AUTH_COMPONENTS,
    setup: signInState(),
    template: SIGN_IN_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The /login screen with its whole step machine wired: email with the Last used tag, then password with Forgot your password?, which leads to the reset request, the inbox confirmation and the new-password step.'
      },
      source: { code: toSfc(signInScript(), SIGN_IN_TEMPLATE) }
    }
  }
}

export const InvalidCredentials = {
  render: () => ({
    components: AUTH_COMPONENTS,
    setup: signInState({
      step: 'password',
      email: 'myemail@example.com',
      authError: INVALID_CREDENTIALS
    }),
    template: SIGN_IN_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A rejected sign-in (401): one danger `Message` above both fields, never a toast, and never “wrong password” — that would confirm the address exists. The password is cleared for the retry.'
      },
      source: {
        code: toSfc(
          signInScript({
            step: 'password',
            email: 'myemail@example.com',
            authError: `{ severity: 'danger', label: '${INVALID_CREDENTIALS.label}' }`
          }),
          SIGN_IN_TEMPLATE
        )
      }
    }
  }
}
