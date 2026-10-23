import Brand from '@aziontech/webkit/brand'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Divider from '@aziontech/webkit/divider'
import FieldPassword from '@aziontech/webkit/field-password'
import FieldText from '@aziontech/webkit/field-text'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const SHELL_IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import GlobalHeader from '@aziontech/webkit/global-header'"
]

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

const LOGIN_IMPORTS = [
  ...SHELL_IMPORTS,
  "import Divider from '@aziontech/webkit/divider'",
  "import FieldPassword from '@aziontech/webkit/field-password'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { computed, ref } from 'vue'",
  '',
  "const step = ref('email')",
  "const returnStep = ref('email')",
  'const submitted = ref(false)',
  "const email = ref('')",
  "const password = ref('')",
  "const resetEmail = ref('')",
  "const newPassword = ref('')",
  "const confirmPassword = ref('')",
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

const CHECK_INBOX_IMPORTS = SHELL_IMPORTS

const loginState = () => {
  const step = ref('email')
  const returnStep = ref('email')
  const submitted = ref(false)
  const email = ref('')
  const password = ref('')
  const resetEmail = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')

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

  const go = (next) => {
    submitted.value = false
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
    heading,
    primaryAction,
    go,
    backToEmail,
    forgotPassword,
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
    class="text-center text-body-xs text-(--text-muted)${termsCondition ? ' motion-reduce:transition-none' : ''}"
  >
${indent(TERMS_COPY, 2)}
  </p>
</div>`

const providerButtons = (wrapperClass) => `<div class="${wrapperClass}">
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
    icon="pi pi-github"
    class="w-full"
  />
</div>`

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

const IDENTITY_ROW_CLASS =
  'flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none'

const STEP_CLASS = 'motion-reduce:transition-none motion-reduce:transform-none'

const LOGIN_FORM = `<form
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

  <div class="relative">
    <div v-if="step === 'email'" class="flex flex-col gap-(--spacing-xs) ${STEP_CLASS}">
      <FieldText
        v-model="email"
        label="Email"
        input-id="login-email"
        name="email"
        size="large"
        placeholder="myemail@azion.com"
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
        input-id="reset-email"
        name="reset-email"
        size="large"
        placeholder="myemail@azion.com"
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

      <Tag
        v-if="step === 'email'"
        label="Last used"
        severity="info"
        size="small"
        class="absolute right-(--spacing-sm) top-0 -translate-y-1/2 motion-reduce:transition-none"
      />
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

const LOGIN_PAGE = `<CardBox class="w-full max-w-(--container-sm)" :padded="false">
  <template #content>
    <div class="p-(--spacing-lg)">
      <div
        class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
      >
${indent(LOGIN_FORM, 4)}
      </div>
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

const components = {
  Brand,
  Button,
  CardBox,
  Divider,
  FieldPassword,
  FieldText,
  GlobalHeader,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  IconButton,
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
          'The signed-out screens of the console, frame included: a full-height page with the signed-out `GlobalHeader` (the `Brand` and a Documentation button) over a centred column that holds one `CardBox` and the prompt and terms under it. The console renders it at /login, /signup and /signup/verify. Fields are `FieldText` and `FieldPassword`, whose required state and helper appear only after the primary action is pressed on an empty field; the rest is `Button`, `Divider`, `IconButton` in a `Tooltip` and a `Tag`.'
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
          'The /signup screen: work email and password with its requirements, the Sign up action, the Google and GitHub buttons under an “or” divider, and the sign-in prompt and terms under the card.'
      },
      source: { code: toSfc(SIGN_UP_IMPORTS, SIGN_UP_TEMPLATE) }
    }
  }
}

export const Login = {
  render: () => ({
    components,
    setup: loginState,
    template: LOGIN_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The /login screen with its whole step machine wired: email with the Last used tag, then password with Forgot your password?, which leads to the reset request, the inbox confirmation and the new-password step.'
      },
      source: { code: toSfc(LOGIN_IMPORTS, LOGIN_TEMPLATE) }
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
