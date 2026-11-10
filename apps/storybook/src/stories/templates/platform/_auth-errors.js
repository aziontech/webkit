import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
import { reactive, ref } from 'vue'

import { AUTH_HEADER_MARKUP } from '../../_shared/headers'
import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { TERMS_COPY } from './_auth-terms'
import { patternComponents, patternImports, vueImport } from './_form-patterns'
import { literal } from './_forms-markup'

const CASES = {
  badCredentials: {
    failure: 'bad-credentials',
    screen: 'signin',
    notice: {
      severity: 'danger',
      label: 'Incorrect email or password. Check both and try again.'
    }
  },
  serviceUnavailable: {
    failure: 'service-unavailable',
    screen: 'signin',
    notice: {
      severity: 'warning',
      label: 'Sign-in is unavailable right now. Your credentials are fine.'
    },
    retry: 'signIn'
  },
  serverError: {
    failure: 'server-error',
    screen: 'signin',
    notice: {
      severity: 'danger',
      label: 'Sign-in failed on our side. You are still signed out. Error 500.'
    },
    retry: 'signIn'
  },
  timeout: {
    failure: 'timeout',
    screen: 'signin',
    notice: {
      severity: 'warning',
      label: 'The server did not answer in time. Your session may already be open.'
    },
    retry: 'signIn'
  },
  emailTaken: {
    failure: 'email-taken',
    screen: 'signup',
    notice: { severity: 'danger', label: 'This email is already registered.', exits: true }
  }
}

const NAMES = [
  'Brand',
  'Button',
  'CardBox',
  'FieldPassword',
  'GlobalHeader',
  'HelperText',
  'InputText',
  'Label',
  'Message'
]

const NOTICE = `<Transition
  enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
  enter-from-class="translate-y-2 opacity-0"
  enter-to-class="translate-y-0 opacity-100"
  leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
  leave-from-class="translate-y-0 opacity-100"
  leave-to-class="-translate-y-2 opacity-0"
>
  <div v-if="cardNotice">
    <Message
      :severity="cardNotice.severity"
      size="small"
    >
      {{ cardNotice.label }}
      <template v-if="cardNotice.exits">
        <a
          href="#"
          @click.prevent="goToSignIn"
          >Sign in</a
        >
        or
        <a
          href="#"
          @click.prevent
          >reset your password</a
        >.
      </template>

      <template
        v-if="cardNotice.retry"
        #action
      >
        <Button
          label="Retry"
          kind="secondary"
          size="small"
          :loading="verifying"
          @click="cardNotice.retry()"
        />
      </template>
    </Message>
  </div>
</Transition>`

const emailField = ({
  id,
  label,
  model,
  error,
  input
}) => `<div class="flex flex-col gap-(--spacing-xs)">
  <Label
    for="${id}"
    label="${label}"
    :required="!!${error} && !${model}.trim()"
  />
  <InputText
    id="${id}"
    v-model="${model}"
    type="email"
    size="large"
    name="email"
    autocomplete="email"
    class="w-full"
    placeholder="name@example.com"
    :disabled="verifying"
    :required="!!${error} && !${model}.trim()"
    :invalid="!!${error} && !!${model}.trim()"
    :aria-describedby="
      ${error} && !verifying ? '${id}-error' : undefined
    "
    @update:model-value="${input}"
  />
  <HelperText
    v-if="${error} && !verifying"
    id="${id}-error"
    :kind="${model}.trim() ? 'invalid' : 'required'"
    :label="${error}"
  />
</div>`

const passwordField = ({
  id,
  name,
  autocomplete,
  placeholder,
  model,
  error,
  requirements
}) => `<FieldPassword
  v-model="${model}"
  input-id="${id}"
  name="${name}"
  label="Password"
  autocomplete="${autocomplete}"
  placeholder="${placeholder}"${requirements ? '\n  requirements' : ''}
  :disabled="verifying"
  :required="!!${error} && !${model}"
  :invalid="!!${error} && !!${model}"
  :helper-text="verifying ? '' : ${error}"
  @update:model-value="${error} = ''"
/>`

const card = ({ condition, key, label, submit, heading, legend, fields, action }) => `<CardBox
  ${condition}
  key="${key}"
  class="w-full"
  :padded="false"
>
  <template #content>
    <form
      class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
      aria-label="${label}"
      novalidate
      @submit.prevent="${submit}"
    >
      <header class="flex flex-col gap-(--spacing-xxs)">
${indent(heading, 4)}
      </header>

${indent(NOTICE, 3)}

      <fieldset
        class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
        :disabled="verifying"
      >
        <legend class="sr-only">${legend}</legend>

${indent(fields.join('\n\n'), 4)}
      </fieldset>

      <Button
        label="${action}"
        kind="primary"
        size="large"
        class="w-full"
        :loading="verifying"
        type="submit"
      />
    </form>
  </template>
</CardBox>`

const SIGN_IN = card({
  condition: `v-if="screen === 'signin'"`,
  key: 'signin',
  label: 'Sign in to your account',
  submit: 'signIn',
  heading: `<h1 class="text-heading-sm text-(--text-default)">Welcome back</h1>
<p class="text-body-sm text-(--text-muted)">Sign in to your account.</p>`,
  legend: 'Credentials',
  action: 'Sign in',
  fields: [
    emailField({
      id: 'auth-signin-email',
      label: 'Email',
      model: 'signin.email',
      error: 'errors.signinEmail',
      input: "errors.signinEmail = ''"
    }),
    passwordField({
      id: 'auth-signin-password',
      name: 'password',
      autocomplete: 'current-password',
      placeholder: 'Type your password',
      model: 'signin.password',
      error: 'errors.signinPassword'
    })
  ]
})

const SIGN_UP = card({
  condition: 'v-else',
  key: 'signup',
  label: 'Sign up for a free account',
  submit: 'signUp',
  heading: `<h1 class="text-heading-sm text-(--text-default)">
  Sign up for a free account
</h1>`,
  legend: 'Account credentials',
  action: 'Sign up',
  fields: [
    emailField({
      id: 'auth-signup-email',
      label: 'Work email',
      model: 'signup.email',
      error: 'errors.signupEmail',
      input: 'onSignUpEmailInput'
    }),
    passwordField({
      id: 'auth-signup-password',
      name: 'new-password',
      autocomplete: 'new-password',
      placeholder: 'Create a password',
      model: 'signup.password',
      error: 'errors.signupPassword',
      requirements: true
    })
  ]
})

const COLUMN = `<div class="relative w-full max-w-(--container-sm)">
  <Transition
    enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="absolute inset-x-0 top-0 transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
${indent(SIGN_IN, 2)}

${indent(SIGN_UP, 2)}
  </Transition>
</div>

<div
  class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
>
  <div
    v-if="screen === 'signin'"
    class="flex items-center justify-center gap-(--spacing-xs)"
  >
    <p class="text-body-xs text-(--text-default)">Don't have an account?</p>
    <a class="text-link text-body-xs" href="/signup">Sign up</a>
  </div>
  <div
    v-else
    class="flex items-center justify-center gap-(--spacing-xs)"
  >
    <p class="text-body-xs text-(--text-default)">Already have an account?</p>
    <a class="text-link text-body-xs" href="/login">Sign in</a>
  </div>

  <p class="text-center text-body-xs text-(--text-muted)">
${indent(TERMS_COPY, 2)}
  </p>
</div>`

const TEMPLATE = `<div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
${indent(AUTH_HEADER_MARKUP)}

  <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
    <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
      <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
        <div class="m-auto flex w-full flex-col items-center gap-(--spacing-md)">
${indent(COLUMN, 5)}
        </div>
      </div>
    </div>
  </main>
</div>`

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailError = (value) =>
  !value.trim()
    ? 'This field is required.'
    : emailPattern.test(value.trim())
      ? ''
      : 'Enter a valid email address.'

const passwordMeetsRequirements = (value) =>
  DEFAULT_PASSWORD_REQUIREMENTS.every((rule) =>
    typeof rule.test === 'function' ? rule.test(value) : rule.test.test(value)
  )

const setupFor = (entry) => () => {
  const failure = ref(entry.failure)
  const screen = ref(entry.screen)
  const signin = reactive({ email: 'name@example.com', password: '' })
  const signup = reactive({ email: 'name@example.com', password: '' })
  const errors = reactive({
    signinEmail: '',
    signinPassword: '',
    signupEmail: '',
    signupPassword: ''
  })
  const cardNotice = ref(null)
  const verifying = ref(false)

  const signIn = () => {
    errors.signinEmail = emailError(signin.email)
    errors.signinPassword = signin.password ? '' : 'This field is required.'
    if (errors.signinEmail || errors.signinPassword) return
    if (failure.value === 'bad-credentials') {
      cardNotice.value = CASES.badCredentials.notice
      signin.password = ''
    } else if (failure.value === 'service-unavailable')
      cardNotice.value = { ...CASES.serviceUnavailable.notice, retry: signIn }
    else if (failure.value === 'server-error')
      cardNotice.value = { ...CASES.serverError.notice, retry: signIn }
    else if (failure.value === 'timeout')
      cardNotice.value = { ...CASES.timeout.notice, retry: signIn }
    else cardNotice.value = { severity: 'success', label: 'Signed in.' }
  }

  const signUp = () => {
    errors.signupEmail = emailError(signup.email)
    errors.signupPassword = !signup.password
      ? 'This field is required.'
      : passwordMeetsRequirements(signup.password)
        ? ''
        : 'Password does not meet requirements.'
    if (errors.signupEmail || errors.signupPassword) return
    if (failure.value === 'email-taken') cardNotice.value = CASES.emailTaken.notice
    else
      cardNotice.value = {
        severity: 'success',
        label: `Account created. We sent a verification link to ${signup.email.trim()}.`
      }
  }

  const onSignUpEmailInput = () => {
    errors.signupEmail = ''
    if (cardNotice.value?.exits) cardNotice.value = null
  }

  const goToSignIn = () => {
    signin.email = signup.email
    failure.value = ''
    cardNotice.value = null
    screen.value = 'signin'
  }

  const retries = { signIn, signUp }
  cardNotice.value = entry.retry ? { ...entry.notice, retry: retries[entry.retry] } : entry.notice

  return {
    screen,
    signin,
    signup,
    errors,
    cardNotice,
    verifying,
    signIn,
    signUp,
    onSignUpEmailInput,
    goToSignIn
  }
}

const LOGIC = `const signin = reactive({ email: 'name@example.com', password: '' })
const signup = reactive({ email: 'name@example.com', password: '' })

const errors = reactive({
  signinEmail: '',
  signinPassword: '',
  signupEmail: '',
  signupPassword: ''
})

const cardNotice = ref(null)
const verifying = ref(false)

const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/

const emailError = (value) =>
  !value.trim()
    ? 'This field is required.'
    : emailPattern.test(value.trim())
      ? ''
      : 'Enter a valid email address.'

const passwordMeetsRequirements = (value) =>
  DEFAULT_PASSWORD_REQUIREMENTS.every((rule) =>
    typeof rule.test === 'function' ? rule.test(value) : rule.test.test(value)
  )

const signIn = () => {
  errors.signinEmail = emailError(signin.email)
  errors.signinPassword = signin.password ? '' : 'This field is required.'
  if (errors.signinEmail || errors.signinPassword) return
  if (failure.value === 'bad-credentials') {
    cardNotice.value = {
      severity: 'danger',
      label: 'Incorrect email or password. Check both and try again.'
    }
    signin.password = ''
  } else if (failure.value === 'service-unavailable')
    cardNotice.value = {
      severity: 'warning',
      label: 'Sign-in is unavailable right now. Your credentials are fine.',
      retry: signIn
    }
  else if (failure.value === 'server-error')
    cardNotice.value = {
      severity: 'danger',
      label: 'Sign-in failed on our side. You are still signed out. Error 500.',
      retry: signIn
    }
  else if (failure.value === 'timeout')
    cardNotice.value = {
      severity: 'warning',
      label: 'The server did not answer in time. Your session may already be open.',
      retry: signIn
    }
  else cardNotice.value = { severity: 'success', label: 'Signed in.' }
}

const signUp = () => {
  errors.signupEmail = emailError(signup.email)
  errors.signupPassword = !signup.password
    ? 'This field is required.'
    : passwordMeetsRequirements(signup.password)
      ? ''
      : 'Password does not meet requirements.'
  if (errors.signupEmail || errors.signupPassword) return
  if (failure.value === 'email-taken')
    cardNotice.value = { severity: 'danger', label: 'This email is already registered.', exits: true }
  else
    cardNotice.value = {
      severity: 'success',
      label: \`Account created. We sent a verification link to \${signup.email.trim()}.\`
    }
}

const onSignUpEmailInput = () => {
  errors.signupEmail = ''
  if (cardNotice.value?.exits) cardNotice.value = null
}

const goToSignIn = () => {
  signin.email = signup.email
  failure.value = ''
  cardNotice.value = null
  screen.value = 'signin'
}`.split('\n')

const noticeLine = (entry) => {
  const fields = Object.entries(entry.notice).map(([key, value]) => `  ${key}: ${literal(value)}`)
  const all = entry.retry ? [...fields, `  retry: ${entry.retry}`] : fields
  return `cardNotice.value = {\n${all.join(',\n')}\n}`
}

const scriptFor = (entry) => [
  ...patternImports(NAMES),
  "import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'",
  vueImport(['reactive', 'ref']),
  '',
  `const failure = ref('${entry.failure}')`,
  `const screen = ref('${entry.screen}')`,
  '',
  ...LOGIC,
  '',
  noticeLine(entry)
]

const components = patternComponents(NAMES)

export const IncorrectCredentials = {
  render: () => ({ components, setup: setupFor(CASES.badCredentials), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          '401 on Sign in: a danger message above both fields with no action, and the password cleared.'
      },
      source: { code: toSfc(scriptFor(CASES.badCredentials), TEMPLATE) }
    }
  }
}

export const ServiceUnavailable = {
  render: () => ({ components, setup: setupFor(CASES.serviceUnavailable), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          '503 on Sign in: a warning message that keeps the credentials and carries Retry, the only move left.'
      },
      source: { code: toSfc(scriptFor(CASES.serviceUnavailable), TEMPLATE) }
    }
  }
}

export const ServerError = {
  render: () => ({ components, setup: setupFor(CASES.serverError), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          '500 on the POST: tied to no field, so where the console would toast, the card keeps a danger message with Retry.'
      },
      source: { code: toSfc(scriptFor(CASES.serverError), TEMPLATE) }
    }
  }
}

export const Timeout = {
  render: () => ({ components, setup: setupFor(CASES.timeout), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'No response: the same message as the 500 but warning, because the request may still have gone through, with Retry.'
      },
      source: { code: toSfc(scriptFor(CASES.timeout), TEMPLATE) }
    }
  }
}

export const EmailAlreadyRegistered = {
  render: () => ({ components, setup: setupFor(CASES.emailTaken), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          '409 on Sign up: a danger message carrying the two ways out as links, Sign in or reset your password, with the address left in the field.'
      },
      source: { code: toSfc(scriptFor(CASES.emailTaken), TEMPLATE) }
    }
  }
}
