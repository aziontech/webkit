import Brand from '@aziontech/webkit/brand'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Divider from '@aziontech/webkit/divider'
import FieldPassword from '@aziontech/webkit/field-password'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Label from '@aziontech/webkit/label'
import Message from '@aziontech/webkit/message'
import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const SHELL_IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import GlobalHeader from '@aziontech/webkit/global-header'"
]

const FIELD_IMPORTS = [
  "import Divider from '@aziontech/webkit/divider'",
  "import FieldPassword from '@aziontech/webkit/field-password'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Label from '@aziontech/webkit/label'",
  "import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'"
]

const VALIDATION_SOURCE = String.raw`const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailError = (value) =>
  !value.trim()
    ? 'This field is required.'
    : emailPattern.test(value.trim())
      ? ''
      : 'Enter a valid email address.'

const newPasswordError = (value) =>
  !value
    ? 'This field is required.'
    : DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(value))
      ? ''
      : 'Password does not meet requirements.'`

const SIGN_UP_SCRIPT = String.raw`
const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '' })

${VALIDATION_SOURCE}

const signUp = () => {
  errors.email = emailError(email.value)
  errors.password = newPasswordError(password.value)
}`

const SIGN_UP_IMPORTS = [
  ...SHELL_IMPORTS,
  ...FIELD_IMPORTS,
  "import { reactive, ref } from 'vue'",
  ...SIGN_UP_SCRIPT.split('\n')
]

const loginScript = (expired) => String.raw`
const expiredEmail = '${expired}'

const step = ref(expiredEmail ? 'password' : 'email')
const returnStep = ref('email')
const expiredNotice = ref(Boolean(expiredEmail))
const email = ref(expiredEmail)
const password = ref('')
const resetEmail = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errors = reactive({
  email: '',
  password: '',
  resetEmail: '',
  newPassword: '',
  confirmPassword: ''
})

${VALIDATION_SOURCE}

const heading = computed(() => {
  if (step.value === 'reset') {
    return {
      title: 'Reset your password',
      description: "Enter the email for your account and we'll send you a link to set a new one."
    }
  }
  if (step.value === 'new-password') return { title: 'Reset password', description: '' }
  if (step.value === 'sent') {
    return {
      title: 'Check your inbox',
      description: ${'`'}We sent a reset link to ${'$'}{resetEmail.value}. Check your inbox or spam folder and follow the instructions.${'`'}
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

const backToEmail = () => {
  step.value = 'email'
  password.value = ''
  errors.password = ''
}

const forgotPassword = () => {
  expiredNotice.value = false
  returnStep.value = step.value === 'password' ? 'password' : 'email'
  resetEmail.value = email.value
  errors.resetEmail = ''
  step.value = 'reset'
}

const backToSignIn = () => {
  step.value = returnStep.value
}

const openResetLink = () => {
  newPassword.value = ''
  confirmPassword.value = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
  step.value = 'new-password'
}

const handlePrimary = () => {
  expiredNotice.value = false
  if (step.value === 'email') {
    errors.email = emailError(email.value)
    if (!errors.email) step.value = 'password'
  } else if (step.value === 'password') {
    errors.password = password.value ? '' : 'This field is required.'
  } else if (step.value === 'reset') {
    errors.resetEmail = emailError(resetEmail.value)
    if (!errors.resetEmail) step.value = 'sent'
  } else if (step.value === 'new-password') {
    errors.newPassword = newPasswordError(newPassword.value)
    errors.confirmPassword = !confirmPassword.value
      ? 'This field is required.'
      : confirmPassword.value === newPassword.value
        ? ''
        : "Passwords don't match."
    if (!errors.newPassword && !errors.confirmPassword) {
      email.value = resetEmail.value
      password.value = ''
      returnStep.value = 'password'
      step.value = 'password'
    }
  } else backToSignIn()
}`

const loginImports = (expired = '') => [
  ...SHELL_IMPORTS,
  ...FIELD_IMPORTS,
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Message from '@aziontech/webkit/message'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { computed, reactive, ref } from 'vue'",
  ...loginScript(expired).split('\n')
]

const CHECK_INBOX_IMPORTS = SHELL_IMPORTS

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailError = (value) =>
  !value.trim()
    ? 'This field is required.'
    : emailPattern.test(value.trim())
      ? ''
      : 'Enter a valid email address.'

const newPasswordError = (value) =>
  !value
    ? 'This field is required.'
    : DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(value))
      ? ''
      : 'Password does not meet requirements.'

const signUpState = () => {
  const email = ref('')
  const password = ref('')
  const errors = reactive({ email: '', password: '' })

  const signUp = () => {
    errors.email = emailError(email.value)
    errors.password = newPasswordError(password.value)
  }

  return { email, password, errors, signUp }
}

const loginState = (expired = '') => {
  const step = ref(expired ? 'password' : 'email')
  const returnStep = ref('email')
  const expiredNotice = ref(Boolean(expired))
  const email = ref(expired)
  const password = ref('')
  const resetEmail = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const errors = reactive({
    email: '',
    password: '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

  const heading = computed(() => {
    if (step.value === 'reset') {
      return {
        title: 'Reset your password',
        description: "Enter the email for your account and we'll send you a link to set a new one."
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

  const backToEmail = () => {
    step.value = 'email'
    password.value = ''
    errors.password = ''
  }

  const forgotPassword = () => {
    expiredNotice.value = false
    returnStep.value = step.value === 'password' ? 'password' : 'email'
    resetEmail.value = email.value
    errors.resetEmail = ''
    step.value = 'reset'
  }

  const backToSignIn = () => {
    step.value = returnStep.value
  }

  const openResetLink = () => {
    newPassword.value = ''
    confirmPassword.value = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    step.value = 'new-password'
  }

  const handlePrimary = () => {
    expiredNotice.value = false
    if (step.value === 'email') {
      errors.email = emailError(email.value)
      if (!errors.email) step.value = 'password'
    } else if (step.value === 'password') {
      errors.password = password.value ? '' : 'This field is required.'
    } else if (step.value === 'reset') {
      errors.resetEmail = emailError(resetEmail.value)
      if (!errors.resetEmail) step.value = 'sent'
    } else if (step.value === 'new-password') {
      errors.newPassword = newPasswordError(newPassword.value)
      errors.confirmPassword = !confirmPassword.value
        ? 'This field is required.'
        : confirmPassword.value === newPassword.value
          ? ''
          : "Passwords don't match."
      if (!errors.newPassword && !errors.confirmPassword) {
        email.value = resetEmail.value
        password.value = ''
        returnStep.value = 'password'
        step.value = 'password'
      }
    } else backToSignIn()
  }

  return {
    step,
    returnStep,
    expiredNotice,
    email,
    password,
    resetEmail,
    newPassword,
    confirmPassword,
    errors,
    heading,
    primaryAction,
    backToEmail,
    forgotPassword,
    backToSignIn,
    openResetLink,
    handlePrimary
  }
}

const authColumn = (body) => `<div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
  <GlobalHeader aria-label="Azion Console" class="shrink-0">
    <GlobalHeader.Brand>
      <a
        href="/site/home"
        aria-label="Azion home"
        class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
      >
        <Brand kind="default" size="small" />
      </a>
    </GlobalHeader.Brand>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <Button label="Documentation" kind="outlined" size="medium" icon="pi pi-book" href="/site/docs" />
    </GlobalHeader.Right>
  </GlobalHeader>

  <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
    <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
      <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
        <div class="m-auto flex w-full flex-col items-center gap-(--spacing-md)">
${indent(body, 5)}
        </div>
      </div>
    </div>
  </main>
</div>`

const signupFlow = (body) =>
  authColumn(`<div class="flex w-full flex-col items-center">
${indent(body)}
</div>`)

const TERMS_COPY = `By continuing, I agree to Azion's
<a
  class="text-link"
  href="https://www.azion.com/en/documentation/agreements/customer-agreement/"
  target="_blank"
  rel="noopener noreferrer"
>terms of service</a>
and
<a
  class="text-link"
  href="https://www.azion.com/en/documentation/agreements/privacy-policy/"
  target="_blank"
  rel="noopener noreferrer"
>privacy policy</a>.`

const footer = (prompt, action, href, termsCondition = '') => `<div
  class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
>
  <div class="flex items-center justify-center gap-(--spacing-xs)">
    <p class="text-body-xs text-(--text-default)">${prompt}</p>
    <a class="text-link text-body-xs" href="${href}">${action}</a>
  </div>

  <p${termsCondition ? `\n    v-if="${termsCondition}"` : ''}
    class="text-center text-body-xs text-(--text-muted)"
  >
${indent(TERMS_COPY, 2)}
  </p>
</div>`

const PROVIDER_BUTTONS = `<div class="flex flex-col gap-(--spacing-sm)">
  <Button
    type="button"
    label="Continue with Google"
    kind="outlined"
    size="large"
    icon="ai-cor ai-google"
    class="w-full"
  />
  <Button
    type="button"
    label="Continue with GitHub"
    kind="outlined"
    size="large"
    icon="ai ai-github"
    class="w-full"
  />
</div>`

const emailField = (
  id,
  model,
  errorKey,
  label = 'Email',
  name = id
) => `<div class="flex flex-col gap-(--spacing-xs)">
  <Label for="${id}" label="${label}" required />
  <InputText
    id="${id}"
    v-model="${model}"
    type="email"
    name="${name}"
    size="large"
    autocomplete="email"
    class="w-full"
    placeholder="myemail@azion.com"
    :required="!!errors.${errorKey} && !${model}.trim()"
    :invalid="!!errors.${errorKey} && !!${model}.trim()"
    :aria-describedby="errors.${errorKey} ? '${id}-error' : undefined"
    @update:model-value="errors.${errorKey} = ''"
  />
  <HelperText
    v-if="errors.${errorKey}"
    id="${id}-error"
    :kind="${model}.trim() ? 'invalid' : 'required'"
    :label="errors.${errorKey}"
  />
</div>`

const passwordField = ({
  id,
  model,
  errorKey,
  label,
  autocomplete,
  placeholder,
  requirements = false
}) => `<div class="flex flex-col gap-(--spacing-xs)">
  <Label for="${id}" label="${label}" required />
  <FieldPassword
    v-model="${model}"
    input-id="${id}"
    name="${id === 'login-password' || id === 'signup-password' ? 'password' : id}"
    autocomplete="${autocomplete}"
    placeholder="${placeholder}"${requirements ? '\n    requirements' : ''}
    :required="!!errors.${errorKey} && !${model}"
    :invalid="!!errors.${errorKey} && !!${model}"
    :helper-text="errors.${errorKey}"
    @update:model-value="errors.${errorKey} = ''"
  />
</div>`

const SIGN_UP_PAGE = `<div class="flex w-full flex-col items-center gap-(--spacing-md)">
  <CardBox class="w-full max-w-(--container-sm)" :padded="false">
    <template #content>
      <form
        class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
        aria-label="Sign up for a free account"
        novalidate
        @submit.prevent="signUp"
      >
        <header class="flex flex-col gap-(--spacing-xxs)">
          <h1 class="text-heading-sm text-(--text-default)">Sign Up for a Free Account</h1>
        </header>

${indent(PROVIDER_BUTTONS, 4)}

        <Divider label="or" />

        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
          <legend class="sr-only">Account credentials</legend>

${indent(emailField('signup-email', 'email', 'email', 'Work Email', 'email'), 5)}

${indent(
  passwordField({
    id: 'signup-password',
    model: 'password',
    errorKey: 'password',
    label: 'Password',
    autocomplete: 'new-password',
    placeholder: 'Create a password',
    requirements: true
  }),
  5
)}
        </fieldset>

        <Button label="Sign up" kind="primary" size="large" class="w-full" type="submit" />
      </form>
    </template>
  </CardBox>

${indent(footer('Already have an account?', 'Sign in', '/login'))}
</div>`

const IDENTITY_ROW_CLASS =
  'flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none'

const STEP_CLASS = 'motion-reduce:transition-none motion-reduce:transform-none'

const LOGIN_FORM = `<form
  class="flex flex-col gap-(--spacing-lg)"
  aria-label="Sign in to your account"
  novalidate
  @submit.prevent="handlePrimary"
>
  <header class="flex flex-col gap-(--spacing-xxs)">
    <h1 class="text-heading-sm text-(--text-default)">
      {{ heading.title }}
    </h1>
    <p v-if="heading.description" class="text-body-sm text-(--text-muted)">
      {{ heading.description }}
    </p>
  </header>

  <Message
    v-if="expiredNotice"
    severity="info"
    size="small"
    label="Your session expired. Sign in again to pick up where you left off."
  />

  <div class="flex flex-col">
    <div v-if="step === 'email'" class="flex flex-col gap-(--spacing-lg) pb-(--spacing-lg)">
${indent(PROVIDER_BUTTONS, 3)}

      <Divider label="or" />
    </div>

    <div v-if="step === 'email'" class="${STEP_CLASS}">
${indent(emailField('login-email', 'email', 'email', 'Email', 'email'), 3)}
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
        <Label for="login-password" label="Password" required />
        <FieldPassword
          v-model="password"
          input-id="login-password"
          name="password"
          autocomplete="current-password"
          placeholder="Type your password"
          :required="!!errors.password && !password"
          :invalid="!!errors.password && !!password"
          :helper-text="errors.password"
          @update:model-value="errors.password = ''"
        />

        <a
          class="self-start text-body-xs text-(--text-muted) underline underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
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
            @click="backToSignIn"
          />
        </Tooltip>
        <span class="truncate text-label-sm text-(--text-default)">Back to sign in</span>
      </div>

${indent(emailField('reset-email', 'resetEmail', 'resetEmail'), 3)}
    </div>

    <div v-else-if="step === 'new-password'" class="flex flex-col gap-(--spacing-lg) ${STEP_CLASS}">
${indent(
  passwordField({
    id: 'new-password',
    model: 'newPassword',
    errorKey: 'newPassword',
    label: 'New password',
    autocomplete: 'new-password',
    placeholder: 'Enter a new password',
    requirements: true
  }),
  3
)}

${indent(
  passwordField({
    id: 'confirm-password',
    model: 'confirmPassword',
    errorKey: 'confirmPassword',
    label: 'Confirm password',
    autocomplete: 'new-password',
    placeholder: 'Repeat the new password'
  }),
  3
)}
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

  <div class="relative">
    <Button
      :label="primaryAction.label"
      :kind="primaryAction.kind"
      size="large"
      class="w-full"
      type="submit"
    />

    <Tag
      v-if="step === 'email'"
      label="Last used"
      severity="info"
      size="small"
      class="absolute right-(--spacing-sm) top-0 -translate-y-1/2"
    />
  </div>
</form>`

const LOGIN_PAGE = `<CardBox class="w-full max-w-(--container-sm)" :padded="false">
  <template #content>
    <div class="p-(--spacing-lg)">
${indent(LOGIN_FORM, 3)}
    </div>
  </template>
</CardBox>

${footer("Don't have an account?", 'Sign up', '/signup', "step === 'email' || step === 'password'")}`

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

const SIGN_UP_TEMPLATE = signupFlow(SIGN_UP_PAGE)

const LOGIN_TEMPLATE = authColumn(LOGIN_PAGE)

const CHECK_INBOX_TEMPLATE = signupFlow(CHECK_INBOX_PAGE)

const EXPIRED_EMAIL = 'myemail@azion.com'

const components = {
  Brand,
  Button,
  CardBox,
  Divider,
  FieldPassword,
  GlobalHeader,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  HelperText,
  IconButton,
  InputText,
  Label,
  Message,
  Tag,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Account/SignUpCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The signed-out screens of the console, frame included: a full-height page with the signed-out `GlobalHeader` (the `Brand` and a Documentation button) over a centred column that holds one `CardBox` and the prompt and terms under it. The console renders it at /login, /signup and /signup/verify. The Google and GitHub buttons lead the card, over an “or” `Divider`. Each field is a required `Label` over `InputText` or `FieldPassword`; a `HelperText` appears only after the primary action, saying whether the field is empty or malformed. The rest is `Button`, `IconButton` in a `Tooltip`, a `Tag` and a `Message`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SignUp = {
  render: () => ({
    components,
    setup: signUpState,
    template: SIGN_UP_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The /signup screen: the Google and GitHub buttons, then an “or” divider over the work email and the password with its requirements, the Sign up action, and the sign-in prompt and terms under the card. Sign up on an empty or malformed field shows its helper.'
      },
      source: { code: toSfc(SIGN_UP_IMPORTS, SIGN_UP_TEMPLATE) }
    }
  }
}

export const Login = {
  render: () => ({
    components,
    setup: () => loginState(),
    template: LOGIN_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The /login screen with its whole step machine wired: the providers and email with the Last used tag, then password with Forgot your password?, which leads to the reset request, the inbox confirmation and the new-password step.'
      },
      source: { code: toSfc(loginImports(), LOGIN_TEMPLATE) }
    }
  }
}

export const SessionExpired = {
  render: () => ({
    components,
    setup: () => loginState(EXPIRED_EMAIL),
    template: LOGIN_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The /login screen after a session expires: it opens on the password step for the same email, with an info Message that clears on the next action.'
      },
      source: { code: toSfc(loginImports(EXPIRED_EMAIL), LOGIN_TEMPLATE) }
    }
  }
}

export const CheckInbox = {
  render: () => ({ components, template: CHECK_INBOX_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The /signup/verify screen: where the verification link went, the resend and already-opened prompts, and a secondary Return to sign in action.'
      },
      source: { code: toSfc(CHECK_INBOX_IMPORTS, CHECK_INBOX_TEMPLATE) }
    }
  }
}
