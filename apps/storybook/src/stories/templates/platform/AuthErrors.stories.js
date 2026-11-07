import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
import { computed, reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { patternComponents, patternImports, vueImport } from './_form-patterns'
import { declare, literal } from './_forms-markup'

const SCENARIOS = [
  {
    id: 'none',
    label: 'No failure',
    status: '200',
    screen: '',
    tone: 'success',
    carries: 'Card message',
    where:
      'The request succeeds. Even this reports itself on the card, because the user has not left it and nothing has to be said anywhere else.'
  },
  {
    id: 'bad-credentials',
    label: 'Incorrect credentials',
    status: '401',
    screen: 'signin',
    tone: 'danger',
    carries: 'Card message',
    where:
      'The pair is wrong, and which half is wrong is not ours to say, so it cannot ride one field. A danger message above both, and no action: the fields under it are the recovery. The password is cleared and focused.'
  },
  {
    id: 'service-unavailable',
    label: 'Service unavailable',
    status: '503',
    screen: 'signin',
    tone: 'warning',
    carries: 'Card message + Retry',
    where:
      'Nothing the user typed is wrong and nothing they type will fix it. A warning message that stays put, carrying the only move left: Retry.'
  },
  {
    id: 'server-error',
    label: 'Server error on POST',
    status: '500',
    screen: '',
    tone: 'danger',
    carries: 'Card message + Retry',
    where:
      'The POST failed and it is tied to no field. Inside the console this would be a toast. Here it is not: there is one card on the page and the user cannot leave it, so the notice stays on it and keeps Retry within reach.'
  },
  {
    id: 'timeout',
    label: 'Timeout on POST',
    status: 'no response',
    screen: '',
    tone: 'warning',
    carries: 'Card message + Retry',
    where:
      'The same message as the 500, deliberately warning and not danger. No answer came back, so the request may still have gone through, and the copy may not claim it failed.'
  },
  {
    id: 'email-taken',
    label: 'Email already registered',
    status: '409',
    screen: 'signup',
    tone: 'danger',
    carries: 'Card message + two exits',
    where:
      'Rejected, and the user can act on it, but not only here. So it takes the same message as everything else and carries the two ways out as links: sign in, or reset the password. The address stays in the field, ready to be changed.'
  }
]

const CASES = {
  badCredentials: {
    scenario: 'bad-credentials',
    screen: 'signin',
    notice: {
      severity: 'danger',
      label: 'Incorrect email or password. Check both and try again.'
    }
  },
  serviceUnavailable: {
    scenario: 'service-unavailable',
    screen: 'signin',
    notice: {
      severity: 'warning',
      label: 'Sign-in is unavailable right now. Your credentials are fine.'
    },
    retry: 'signIn'
  },
  serverError: {
    scenario: 'server-error',
    screen: 'signin',
    notice: {
      severity: 'danger',
      label: 'Sign-in failed on our side. You are still signed out. Error 500.'
    },
    retry: 'signIn'
  },
  timeout: {
    scenario: 'timeout',
    screen: 'signin',
    notice: {
      severity: 'warning',
      label: 'The server did not answer in time. Your session may already be open.'
    },
    retry: 'signIn'
  },
  emailTaken: {
    scenario: 'email-taken',
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
  'Message',
  'SegmentedButton',
  'Select',
  'Tag'
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
    placeholder="myemail@azion.com"
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

const SIMULATION = `<aside
  aria-label="Failure simulation"
  class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-md)"
>
  <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
    <p class="m-0 text-overline-sm text-(--text-muted)">Simulation: the endpoint</p>
    <Tag
      :label="\`\${activeScenario.status} · \${activeScenario.carries}\`"
      :severity="activeScenario.tone"
      size="medium"
    />
  </div>

  <SegmentedButton
    v-model="screen"
    :options="screenOptions"
    aria-label="Screen"
  />

  <Select
    v-model="scenario"
    size="large"
    class="w-full"
    :display-value="scenarioLabel"
    :disabled="verifying"
  >
    <Select.Trigger
      id="auth-scenario"
      aria-label="What the endpoint returns"
    />
    <Select.Content>
      <Select.Option
        v-for="entry in SCENARIOS"
        :key="entry.id"
        :value="entry.id"
      >
        {{ entry.label }}
      </Select.Option>
    </Select.Content>
  </Select>

  <p class="m-0 text-body-xs text-(--text-muted)">{{ activeScenario.where }}</p>
</aside>`

const COLUMN = `${SIMULATION}

<div class="relative w-full max-w-(--container-sm)">
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
  class="flex w-full max-w-(--container-sm) items-center justify-center gap-(--spacing-xs)"
>
  <p class="text-body-sm text-(--text-default)">Pattern demo.</p>
  <a
    class="text-link text-body-sm"
    href="/forms"
    >Back to Forms</a
  >
</div>`

const TEMPLATE = `<div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
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
  const scenario = ref(entry.scenario)
  const screen = ref(entry.screen)
  const activeScenario = computed(
    () => SCENARIOS.find((item) => item.id === scenario.value) ?? SCENARIOS[0]
  )
  const scenarioLabel = (id) => SCENARIOS.find((item) => item.id === id)?.label ?? ''
  const signin = reactive({ email: 'myemail@azion.com', password: '' })
  const signup = reactive({ email: 'myemail@azion.com', password: '' })
  const errors = reactive({
    signinEmail: '',
    signinPassword: '',
    signupEmail: '',
    signupPassword: ''
  })
  const cardNotice = ref(null)
  const verifying = ref(false)
  const screenOptions = computed(() => [
    { label: 'Sign in', value: 'signin', disabled: verifying.value },
    { label: 'Sign up', value: 'signup', disabled: verifying.value }
  ])

  const resetSurfaces = () => {
    cardNotice.value = null
    errors.signinEmail = ''
    errors.signinPassword = ''
    errors.signupEmail = ''
    errors.signupPassword = ''
  }

  watch(scenario, () => {
    resetSurfaces()
    const pinned = activeScenario.value.screen
    if (pinned) screen.value = pinned
  })

  watch(screen, (next) => {
    resetSurfaces()
    const pinned = activeScenario.value.screen
    if (pinned && pinned !== next) scenario.value = 'none'
  })

  const armedFor = (target) => {
    const active = activeScenario.value
    if (active.id === 'none') return ''
    if (active.screen && active.screen !== target) return ''
    return active.id
  }

  const signIn = () => {
    errors.signinEmail = emailError(signin.email)
    errors.signinPassword = signin.password ? '' : 'This field is required.'
    if (errors.signinEmail || errors.signinPassword) return
    const failure = armedFor('signin')
    if (!failure) cardNotice.value = { severity: 'success', label: 'Signed in.' }
    else if (failure === 'bad-credentials') {
      cardNotice.value = CASES.badCredentials.notice
      signin.password = ''
    } else if (failure === 'service-unavailable')
      cardNotice.value = { ...CASES.serviceUnavailable.notice, retry: signIn }
    else if (failure === 'timeout') cardNotice.value = { ...CASES.timeout.notice, retry: signIn }
    else cardNotice.value = { ...CASES.serverError.notice, retry: signIn }
  }

  const signUp = () => {
    errors.signupEmail = emailError(signup.email)
    errors.signupPassword = !signup.password
      ? 'This field is required.'
      : passwordMeetsRequirements(signup.password)
        ? ''
        : 'Password does not meet requirements.'
    if (errors.signupEmail || errors.signupPassword) return
    const failure = armedFor('signup')
    if (!failure)
      cardNotice.value = {
        severity: 'success',
        label: `Account created. We sent a verification link to ${signup.email.trim()}.`
      }
    else if (failure === 'email-taken') cardNotice.value = CASES.emailTaken.notice
    else if (failure === 'timeout')
      cardNotice.value = {
        severity: 'warning',
        label:
          'The server did not answer in time. The account may already exist, so check your inbox first.',
        retry: signUp
      }
    else
      cardNotice.value = {
        severity: 'danger',
        label: 'Sign-up failed on our side. No account was created. Error 500.',
        retry: signUp
      }
  }

  const onSignUpEmailInput = () => {
    errors.signupEmail = ''
    if (cardNotice.value?.exits) cardNotice.value = null
  }

  const goToSignIn = () => {
    signin.email = signup.email
    scenario.value = 'none'
    screen.value = 'signin'
  }

  const retries = { signIn, signUp }
  cardNotice.value = entry.retry ? { ...entry.notice, retry: retries[entry.retry] } : entry.notice

  return {
    SCENARIOS,
    scenario,
    screen,
    activeScenario,
    scenarioLabel,
    signin,
    signup,
    errors,
    cardNotice,
    verifying,
    screenOptions,
    signIn,
    signUp,
    onSignUpEmailInput,
    goToSignIn
  }
}

const LOGIC = `const activeScenario = computed(
  () => SCENARIOS.find((entry) => entry.id === scenario.value) ?? SCENARIOS[0]
)
const scenarioLabel = (id) => SCENARIOS.find((entry) => entry.id === id)?.label ?? ''

const signin = reactive({ email: 'myemail@azion.com', password: '' })
const signup = reactive({ email: 'myemail@azion.com', password: '' })

const errors = reactive({
  signinEmail: '',
  signinPassword: '',
  signupEmail: '',
  signupPassword: ''
})

const cardNotice = ref(null)
const verifying = ref(false)

const screenOptions = computed(() => [
  { label: 'Sign in', value: 'signin', disabled: verifying.value },
  { label: 'Sign up', value: 'signup', disabled: verifying.value }
])

const resetSurfaces = () => {
  cardNotice.value = null
  errors.signinEmail = ''
  errors.signinPassword = ''
  errors.signupEmail = ''
  errors.signupPassword = ''
}

watch(scenario, () => {
  resetSurfaces()
  const pinned = activeScenario.value.screen
  if (pinned) screen.value = pinned
})

watch(screen, (next) => {
  resetSurfaces()
  const pinned = activeScenario.value.screen
  if (pinned && pinned !== next) scenario.value = 'none'
})

const armedFor = (target) => {
  const entry = activeScenario.value
  if (entry.id === 'none') return ''
  if (entry.screen && entry.screen !== target) return ''
  return entry.id
}

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
  const failure = armedFor('signin')
  if (!failure) cardNotice.value = { severity: 'success', label: 'Signed in.' }
  else if (failure === 'bad-credentials') {
    cardNotice.value = {
      severity: 'danger',
      label: 'Incorrect email or password. Check both and try again.'
    }
    signin.password = ''
  } else if (failure === 'service-unavailable')
    cardNotice.value = {
      severity: 'warning',
      label: 'Sign-in is unavailable right now. Your credentials are fine.',
      retry: signIn
    }
  else if (failure === 'timeout')
    cardNotice.value = {
      severity: 'warning',
      label: 'The server did not answer in time. Your session may already be open.',
      retry: signIn
    }
  else
    cardNotice.value = {
      severity: 'danger',
      label: 'Sign-in failed on our side. You are still signed out. Error 500.',
      retry: signIn
    }
}

const signUp = () => {
  errors.signupEmail = emailError(signup.email)
  errors.signupPassword = !signup.password
    ? 'This field is required.'
    : passwordMeetsRequirements(signup.password)
      ? ''
      : 'Password does not meet requirements.'
  if (errors.signupEmail || errors.signupPassword) return
  const failure = armedFor('signup')
  if (!failure)
    cardNotice.value = {
      severity: 'success',
      label: \`Account created. We sent a verification link to \${signup.email.trim()}.\`
    }
  else if (failure === 'email-taken')
    cardNotice.value = { severity: 'danger', label: 'This email is already registered.', exits: true }
  else if (failure === 'timeout')
    cardNotice.value = {
      severity: 'warning',
      label:
        'The server did not answer in time. The account may already exist, so check your inbox first.',
      retry: signUp
    }
  else
    cardNotice.value = {
      severity: 'danger',
      label: 'Sign-up failed on our side. No account was created. Error 500.',
      retry: signUp
    }
}

const onSignUpEmailInput = () => {
  errors.signupEmail = ''
  if (cardNotice.value?.exits) cardNotice.value = null
}

const goToSignIn = () => {
  signin.email = signup.email
  scenario.value = 'none'
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
  vueImport(['computed', 'reactive', 'ref', 'watch']),
  '',
  declare('SCENARIOS', SCENARIOS),
  '',
  `const scenario = ref('${entry.scenario}')`,
  `const screen = ref('${entry.screen}')`,
  '',
  ...LOGIC,
  '',
  noticeLine(entry)
]

const components = patternComponents(NAMES)

const meta = {
  title: 'Templates/Platform/Forms/AuthErrors',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Where an error goes on the signed-out screens, from the forms lab (Auth error states, `/forms/auth-errors`), answered by one rule: auth never toasts. Inside the auth shell, a dashed simulation panel picks the screen (Sign in or Sign up) and arms the endpoint, and every outcome lands in the same small `Message` at the top of the card, above the fields. What changes is the severity and what it carries: nothing after a 401, because the fields under it are the recovery; Retry when nobody can fix it (503, 500, timeout); the Sign in and reset-your-password links when the address is already registered (409). Built from `GlobalHeader`, `Brand`, `Tag`, `SegmentedButton`, `Select`, `CardBox`, `Message`, `Label`, `InputText`, `FieldPassword`, `HelperText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const IncorrectCredentials = {
  render: () => ({ components, setup: setupFor(CASES.badCredentials), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          '401 on Sign in: a danger message above both fields with no action, the password cleared, and the simulation tag reading 401 · Card message.'
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
