<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button, { type ButtonVariant } from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'
  import Separator from '@aziontech/webkit/separator'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, onMounted, onScopeDispose, reactive, ref, watch } from 'vue'

  /** The step the card shows. */
  export type SignInStep = 'email' | 'password' | 'reset' | 'sent' | 'new-password'

  /** An identity provider offered over the email field. */
  export type SignInProvider = 'google' | 'github'

  /** A way to sign in: the email form or an identity provider. */
  export type SignInMethod = 'email' | SignInProvider

  /** A sign-in failure with its own copy, severity and Retry rule. */
  export type SignInFailure = 'bad-credentials' | 'service-unavailable' | 'server-error' | 'timeout'

  /** A neutral or success outcome with its own copy. */
  export type SignInNoticeKind = 'session-expired' | 'signed-in' | 'password-updated'

  /** The credentials the form sends. */
  export interface SignInValues {
    /** The account email. */
    email: string
    /** The account password. */
    password: string
  }

  export interface SignInProps {
    /** Values the fields open on, such as the email of an expired session. */
    defaultValues?: Partial<SignInValues>
    /** A request is in flight: the step locks, the form is busy and the primary action spins. */
    loading?: boolean
    /** Why the last request failed: a failure kind with its own copy, or a message shown as a danger notice with Retry. */
    error?: SignInFailure | (string & {})
    /** A non-error outcome for the notice: a notice kind with its own copy, or a message shown as info. */
    notice?: SignInNoticeKind | (string & {})
    /** The identity providers are still loading; skeleton bars hold their place. */
    providersLoading?: boolean
    /** The method this browser signed in with last time, which carries the Last used tag; empty shows no tag. */
    lastUsed?: SignInMethod | ''
    /** Where the product mark leads. */
    homeHref?: string
    /** Where the Documentation button leads. */
    docsHref?: string
    /** Where the Sign up link leads. */
    signUpHref?: string
    /** The terms of service page. */
    termsHref?: string
    /** The privacy policy page. */
    privacyHref?: string
  }

  interface CardNotice {
    severity: AlertSeverity
    label: string
    retry?: boolean
  }

  const props = withDefaults(defineProps<SignInProps>(), {
    defaultValues: () => ({}),
    loading: false,
    error: '',
    notice: '',
    providersLoading: false,
    lastUsed: '',
    homeHref: '/home',
    docsHref: '/docs',
    signUpHref: '/signup',
    termsHref: 'https://example.com/terms',
    privacyHref: 'https://example.com/privacy'
  })

  const emit = defineEmits<{
    'provider-click': [event: MouseEvent, provider: SignInProvider]
    continue: [event: Event, email: string]
    submit: [event: Event, values: SignInValues]
    'reset-request': [event: Event, email: string]
    resend: [event: MouseEvent, email: string]
    'password-reset': [event: Event, password: string]
  }>()

  const step = defineModel<SignInStep>('step', { default: 'email' })

  const COPY = {
    en: {
      console: 'Console',
      home: 'Azion home',
      documentation: 'Documentation',
      badCredentials: 'Incorrect email or password. Check both and try again.',
      serviceUnavailable: 'Sign-in is unavailable right now. Your credentials are fine.',
      serverError: 'Sign-in failed on our side. You are still signed out. Error 500.',
      timeout: 'The server did not answer in time. Your session may already be open.',
      sessionExpired: 'Your session expired. Sign in again to pick up where you left off.',
      signedIn: 'Signed in.',
      passwordUpdated: 'Password updated. Sign in with the new one.',
      required: 'This field is required.',
      invalidEmail: 'Enter a valid email address.',
      weakPassword: 'Password does not meet requirements.',
      mismatch: "Passwords don't match.",
      resetTitle: 'Reset your password',
      resetDescription:
        "Enter the email for your account and we'll send you a link to set a new one.",
      newPasswordTitle: 'Reset password',
      sentTitle: 'Check your inbox',
      sentDescription:
        'We sent a reset link to {email}. Check your inbox or spam folder and follow the instructions.',
      title: 'Welcome back',
      description: 'Sign in to your account.',
      signIn: 'Sign in',
      sendResetLink: 'Send reset link',
      resetPassword: 'Reset password',
      returnToSignIn: 'Return to sign in',
      continueWithEmail: 'Continue with email',
      resent: 'We sent another link to {email}.',
      form: 'Sign in to your account',
      retry: 'Retry',
      preparingProviders: 'Preparing sign-in providers',
      continueWithGoogle: 'Continue with Google',
      continueWithGithub: 'Continue with GitHub',
      or: 'or',
      email: 'Email',
      changeEmail: 'Change email',
      password: 'Password',
      passwordPlaceholder: 'Type your password',
      forgotPassword: 'Forgot your password?',
      backToSignIn: 'Back to sign in',
      newPassword: 'New password',
      newPasswordPlaceholder: 'Enter a new password',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Repeat the new password',
      didNotReceive: "Didn't receive the email?",
      resendEmail: 'Resend email',
      alreadyOpened: 'Already opened it?',
      setNewPassword: 'Set a new password',
      lastUsed: 'Last used',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      agreeStart: 'By continuing, I agree to the',
      terms: 'terms of service',
      and: 'and',
      privacy: 'privacy policy'
    },
    'pt-BR': {
      console: 'Console',
      home: 'Página inicial da Azion',
      documentation: 'Documentação',
      badCredentials: 'E-mail ou senha incorretos. Confira os dois e tente de novo.',
      serviceUnavailable: 'O login está indisponível no momento. Suas credenciais estão corretas.',
      serverError: 'O login falhou do nosso lado. Você continua desconectado. Erro 500.',
      timeout: 'O servidor não respondeu a tempo. Sua sessão pode já estar aberta.',
      sessionExpired: 'Sua sessão expirou. Entre de novo para continuar de onde parou.',
      signedIn: 'Login feito.',
      passwordUpdated: 'Senha atualizada. Entre com a nova senha.',
      required: 'Este campo é obrigatório.',
      invalidEmail: 'Digite um endereço de e-mail válido.',
      weakPassword: 'A senha não atende aos requisitos.',
      mismatch: 'As senhas não coincidem.',
      resetTitle: 'Redefina sua senha',
      resetDescription:
        'Digite o e-mail da sua conta e enviaremos um link para você definir uma nova senha.',
      newPasswordTitle: 'Redefinir senha',
      sentTitle: 'Confira sua caixa de entrada',
      sentDescription:
        'Enviamos um link de redefinição para {email}. Confira a caixa de entrada ou o spam e siga as instruções.',
      title: 'Boas-vindas de volta',
      description: 'Entre na sua conta.',
      signIn: 'Entrar',
      sendResetLink: 'Enviar link de redefinição',
      resetPassword: 'Redefinir senha',
      returnToSignIn: 'Voltar para o login',
      continueWithEmail: 'Continuar com e-mail',
      resent: 'Enviamos outro link para {email}.',
      form: 'Entre na sua conta',
      retry: 'Tentar de novo',
      preparingProviders: 'Preparando os provedores de login',
      continueWithGoogle: 'Continuar com Google',
      continueWithGithub: 'Continuar com GitHub',
      or: 'ou',
      email: 'E-mail',
      changeEmail: 'Trocar e-mail',
      password: 'Senha',
      passwordPlaceholder: 'Digite sua senha',
      forgotPassword: 'Esqueceu sua senha?',
      backToSignIn: 'Voltar para o login',
      newPassword: 'Nova senha',
      newPasswordPlaceholder: 'Digite uma nova senha',
      confirmPassword: 'Confirmar senha',
      confirmPasswordPlaceholder: 'Repita a nova senha',
      didNotReceive: 'Não recebeu o e-mail?',
      resendEmail: 'Reenviar e-mail',
      alreadyOpened: 'Já abriu?',
      setNewPassword: 'Definir uma nova senha',
      lastUsed: 'Usado por último',
      noAccount: 'Não tem uma conta?',
      signUp: 'Cadastre-se',
      agreeStart: 'Ao continuar, concordo com os',
      terms: 'termos de serviço',
      and: 'e a',
      privacy: 'política de privacidade'
    },
    es: {
      console: 'Consola',
      home: 'Inicio de Azion',
      documentation: 'Documentación',
      badCredentials: 'Correo o contraseña incorrectos. Revisa ambos y vuelve a intentarlo.',
      serviceUnavailable:
        'El inicio de sesión no está disponible ahora. Tus credenciales son correctas.',
      serverError: 'El inicio de sesión falló de nuestro lado. Sigues sin sesión. Error 500.',
      timeout: 'El servidor no respondió a tiempo. Puede que tu sesión ya esté abierta.',
      sessionExpired: 'Tu sesión caducó. Inicia sesión de nuevo para seguir donde lo dejaste.',
      signedIn: 'Sesión iniciada.',
      passwordUpdated: 'Contraseña actualizada. Inicia sesión con la nueva.',
      required: 'Este campo es obligatorio.',
      invalidEmail: 'Introduce un correo electrónico válido.',
      weakPassword: 'La contraseña no cumple los requisitos.',
      mismatch: 'Las contraseñas no coinciden.',
      resetTitle: 'Restablece tu contraseña',
      resetDescription:
        'Introduce el correo de tu cuenta y te enviaremos un enlace para crear una nueva.',
      newPasswordTitle: 'Restablecer contraseña',
      sentTitle: 'Revisa tu bandeja de entrada',
      sentDescription:
        'Enviamos un enlace de restablecimiento a {email}. Revisa la bandeja de entrada o el spam y sigue las instrucciones.',
      title: 'Te damos la bienvenida de nuevo',
      description: 'Inicia sesión en tu cuenta.',
      signIn: 'Iniciar sesión',
      sendResetLink: 'Enviar enlace',
      resetPassword: 'Restablecer contraseña',
      returnToSignIn: 'Volver a iniciar sesión',
      continueWithEmail: 'Continuar con correo',
      resent: 'Enviamos otro enlace a {email}.',
      form: 'Inicia sesión en tu cuenta',
      retry: 'Reintentar',
      preparingProviders: 'Preparando los proveedores de inicio de sesión',
      continueWithGoogle: 'Continuar con Google',
      continueWithGithub: 'Continuar con GitHub',
      or: 'o',
      email: 'Correo electrónico',
      changeEmail: 'Cambiar correo',
      password: 'Contraseña',
      passwordPlaceholder: 'Escribe tu contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      backToSignIn: 'Volver a iniciar sesión',
      newPassword: 'Nueva contraseña',
      newPasswordPlaceholder: 'Introduce una nueva contraseña',
      confirmPassword: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Repite la nueva contraseña',
      didNotReceive: '¿No recibiste el correo?',
      resendEmail: 'Reenviar correo',
      alreadyOpened: '¿Ya lo abriste?',
      setNewPassword: 'Crear una nueva contraseña',
      lastUsed: 'Último usado',
      noAccount: '¿No tienes una cuenta?',
      signUp: 'Regístrate',
      agreeStart: 'Al continuar, acepto los',
      terms: 'términos del servicio',
      and: 'y la',
      privacy: 'política de privacidad'
    }
  }

  type SignInCopy = (typeof COPY)['en']

  const { locale } = useLocale()
  const copy = computed<SignInCopy>(() => {
    const tag = locale.value
    const language = tag.split('-')[0]
    return COPY[tag as keyof typeof COPY] ?? COPY[language as keyof typeof COPY] ?? COPY.en
  })
  const fill = (template: string, email: string) => template.replace('{email}', email)

  const failureNotices = (): Record<SignInFailure, CardNotice> => ({
    'bad-credentials': { severity: 'danger', label: copy.value.badCredentials },
    'service-unavailable': {
      severity: 'warning',
      label: copy.value.serviceUnavailable,
      retry: true
    },
    'server-error': { severity: 'danger', label: copy.value.serverError, retry: true },
    timeout: { severity: 'warning', label: copy.value.timeout, retry: true }
  })

  const outcomeNotices = (): Record<SignInNoticeKind, CardNotice> => ({
    'session-expired': { severity: 'info', label: copy.value.sessionExpired },
    'signed-in': { severity: 'success', label: copy.value.signedIn },
    'password-updated': { severity: 'success', label: copy.value.passwordUpdated }
  })

  const noticeFromProps = (): CardNotice | null => {
    if (props.error) {
      return (
        failureNotices()[props.error as SignInFailure] ?? {
          severity: 'danger',
          label: props.error,
          retry: true
        }
      )
    }
    if (props.notice) {
      return (
        outcomeNotices()[props.notice as SignInNoticeKind] ?? {
          severity: 'info',
          label: props.notice
        }
      )
    }
    return null
  }

  const returnStep = ref<SignInStep>('email')
  const email = ref(props.defaultValues.email ?? '')
  const password = ref(props.defaultValues.password ?? '')
  const resetEmail = ref(props.defaultValues.email ?? '')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const cardNotice = ref<CardNotice | null>(noticeFromProps())
  const verifying = computed(() => props.loading)
  const errors = reactive({
    email: '',
    password: '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

  const cardContentEl = ref<HTMLElement | null>(null)
  const cardHeight = ref(0)
  const resizing = ref(false)
  let resizeObserver: ResizeObserver | null = null

  const onCardResize = ([entry]: ResizeObserverEntry[]) => {
    const next = Math.round(entry.contentRect.height)
    if (cardHeight.value && next !== cardHeight.value) resizing.value = true
    cardHeight.value = next
  }

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined' || !cardContentEl.value) return
    resizeObserver = new ResizeObserver(onCardResize)
    resizeObserver.observe(cardContentEl.value)
  })

  onScopeDispose(() => {
    resizeObserver?.disconnect()
  })

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const emailError = (value: string) =>
    !value.trim()
      ? copy.value.required
      : emailPattern.test(value.trim())
        ? ''
        : copy.value.invalidEmail

  const newPasswordError = (value: string) =>
    !value
      ? copy.value.required
      : DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(value))
        ? ''
        : copy.value.weakPassword

  const heading = computed(() => {
    if (step.value === 'reset') {
      return { title: copy.value.resetTitle, description: copy.value.resetDescription }
    }
    if (step.value === 'new-password')
      return { title: copy.value.newPasswordTitle, description: '' }
    if (step.value === 'sent') {
      return {
        title: copy.value.sentTitle,
        description: fill(copy.value.sentDescription, resetEmail.value)
      }
    }
    return { title: copy.value.title, description: copy.value.description }
  })

  const primaryAction = computed<{ label: string; variant: ButtonVariant }>(() => {
    if (step.value === 'password') return { label: copy.value.signIn, variant: 'primary' }
    if (step.value === 'reset') return { label: copy.value.sendResetLink, variant: 'primary' }
    if (step.value === 'new-password')
      return { label: copy.value.resetPassword, variant: 'primary' }
    if (step.value === 'sent') return { label: copy.value.returnToSignIn, variant: 'secondary' }
    return { label: copy.value.continueWithEmail, variant: 'primary' }
  })

  const focusField = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const showOutcome = () => {
    cardNotice.value = noticeFromProps()
    if (props.error === 'bad-credentials') {
      password.value = ''
      focusField('login-password')
    }
  }

  watch([() => props.error, () => props.notice], showOutcome)
  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) showOutcome()
    }
  )

  const backToEmail = () => {
    cardNotice.value = null
    step.value = 'email'
    password.value = ''
    errors.password = ''
  }

  const forgotPassword = () => {
    cardNotice.value = null
    returnStep.value = step.value === 'password' ? 'password' : 'email'
    resetEmail.value = email.value
    errors.resetEmail = ''
    step.value = 'reset'
  }

  const backToSignIn = () => {
    cardNotice.value = null
    step.value = returnStep.value
  }

  const resendEmail = (event: MouseEvent) => {
    emit('resend', event, resetEmail.value)
    cardNotice.value = {
      severity: 'success',
      label: fill(copy.value.resent, resetEmail.value)
    }
  }

  const openResetLink = () => {
    cardNotice.value = null
    newPassword.value = ''
    confirmPassword.value = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    step.value = 'new-password'
  }

  const signIn = (event: Event) => {
    errors.password = password.value ? '' : copy.value.required
    if (errors.password) {
      focusField('login-password')
      return
    }
    cardNotice.value = null
    emit('submit', event, { email: email.value.trim(), password: password.value })
  }

  const onPrimary = (event: Event) => {
    if (verifying.value) return
    cardNotice.value = null
    if (step.value === 'email') {
      errors.email = emailError(email.value)
      if (errors.email) focusField('login-email')
      else {
        emit('continue', event, email.value.trim())
        step.value = 'password'
      }
    } else if (step.value === 'password') signIn(event)
    else if (step.value === 'reset') {
      errors.resetEmail = emailError(resetEmail.value)
      if (errors.resetEmail) focusField('reset-email')
      else {
        emit('reset-request', event, resetEmail.value.trim())
        step.value = 'sent'
      }
    } else if (step.value === 'new-password') {
      errors.newPassword = newPasswordError(newPassword.value)
      errors.confirmPassword = !confirmPassword.value
        ? copy.value.required
        : confirmPassword.value === newPassword.value
          ? ''
          : copy.value.mismatch
      if (errors.newPassword || errors.confirmPassword)
        focusField(errors.newPassword ? 'new-password' : 'confirm-password')
      else {
        email.value = resetEmail.value
        password.value = ''
        returnStep.value = 'password'
        emit('password-reset', event, newPassword.value)
      }
    } else backToSignIn()
  }

  const FORM_COLUMN_CLASS =
    'm-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance ' +
    'starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none'
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      :aria-label="copy.console"
      class="shrink-0"
    >
      <AppHeader.Brand
        :href="homeHref"
        :aria-label="copy.home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          :label="copy.documentation"
          variant="outline"
          size="medium"
          icon="az az-book"
          :href="docsHref"
        />
      </AppHeader.End>
    </AppHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
        <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
          <div :class="FORM_COLUMN_CLASS">
            <Card
              class="w-full max-w-(--container-sm)"
              :padded="false"
            >
              <template #default>
                <div class="p-(--spacing-lg)">
                  <div
                    :style="cardHeight ? { height: `${cardHeight}px` } : undefined"
                    :data-resizing="resizing || null"
                    class="transition-[height] duration-moderate-02 ease-productive-entrance motion-safe:data-resizing:overflow-hidden motion-reduce:transition-none"
                    @transitionend.self="resizing = false"
                  >
                    <form
                      ref="cardContentEl"
                      class="flex flex-col gap-(--spacing-lg)"
                      :aria-label="copy.form"
                      :aria-busy="verifying || undefined"
                      novalidate
                      @submit.prevent="onPrimary"
                    >
                      <PageHeader
                        :title="heading.title"
                        :description="heading.description"
                        size="small"
                      />

                      <Alert
                        v-if="cardNotice"
                        :key="cardNotice.label"
                        :severity="cardNotice.severity"
                        size="small"
                        :label="cardNotice.label"
                      >
                        <template
                          v-if="cardNotice.retry"
                          #actions
                        >
                          <Button
                            :label="copy.retry"
                            variant="secondary"
                            size="small"
                            :loading="verifying"
                            @click="signIn"
                          />
                        </template>
                      </Alert>

                      <fieldset
                        class="m-0 flex min-w-0 flex-col border-0 p-0"
                        :disabled="verifying"
                      >
                        <legend class="sr-only">{{ heading.title }}</legend>
                        <div
                          v-if="step === 'email'"
                          class="flex flex-col gap-(--spacing-lg) pb-(--spacing-lg)"
                        >
                          <div
                            v-if="providersLoading"
                            role="status"
                            :aria-label="copy.preparingProviders"
                            class="flex flex-col gap-(--spacing-sm)"
                          >
                            <Skeleton height="2.5rem" />
                            <Skeleton height="2.5rem" />
                          </div>
                          <div
                            v-else
                            class="flex flex-col gap-(--spacing-sm)"
                          >
                            <div class="relative">
                              <Button
                                type="button"
                                :label="copy.continueWithGoogle"
                                variant="outline"
                                size="large"
                                icon="az-color az-google"
                                class="w-full"
                                @click="
                                  (event: MouseEvent) => emit('provider-click', event, 'google')
                                "
                              />
                              <div
                                v-if="lastUsed === 'google'"
                                class="absolute end-(--spacing-sm) top-0 -translate-y-1/2"
                              >
                                <Tag
                                  :label="copy.lastUsed"
                                  severity="info"
                                  size="small"
                                />
                              </div>
                            </div>
                            <div class="relative">
                              <Button
                                type="button"
                                :label="copy.continueWithGithub"
                                variant="outline"
                                size="large"
                                icon="az az-github"
                                class="w-full"
                                @click="
                                  (event: MouseEvent) => emit('provider-click', event, 'github')
                                "
                              />
                              <div
                                v-if="lastUsed === 'github'"
                                class="absolute end-(--spacing-sm) top-0 -translate-y-1/2"
                              >
                                <Tag
                                  :label="copy.lastUsed"
                                  severity="info"
                                  size="small"
                                />
                              </div>
                            </div>
                          </div>

                          <Separator :label="copy.or" />
                        </div>

                        <div v-if="step === 'email'">
                          <Field
                            required
                            :invalid="!!errors.email"
                          >
                            <Field.Label for="login-email">{{ copy.email }}</Field.Label>
                            <Input
                              id="login-email"
                              v-model="email"
                              type="email"
                              name="email"
                              size="large"
                              autocomplete="username"
                              class="w-full"
                              placeholder="m@example.com"
                              required
                              :invalid="!!errors.email"
                              :aria-describedby="errors.email ? 'login-email-error' : undefined"
                              @update:model-value="errors.email = ''"
                            />
                            <FieldError
                              v-if="errors.email"
                              id="login-email-error"
                              >{{ errors.email }}</FieldError
                            >
                          </Field>
                        </div>

                        <div
                          v-else-if="step === 'password'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Tooltip :content="copy.changeEmail">
                              <IconButton
                                icon="az az-chevron-left"
                                :aria-label="copy.changeEmail"
                                variant="outline"
                                size="small"
                                @click="backToEmail"
                              />
                            </Tooltip>
                            <span class="truncate text-label-sm text-(--text-default)">{{
                              email
                            }}</span>
                          </div>

                          <div class="flex flex-col items-start gap-(--spacing-xs)">
                            <Field
                              class="w-full"
                              required
                              :invalid="!!errors.password"
                            >
                              <Field.Label for="login-password">{{ copy.password }}</Field.Label>
                              <PasswordInput
                                id="login-password"
                                v-model="password"
                                name="password"
                                autocomplete="current-password"
                                :placeholder="copy.passwordPlaceholder"
                                @update:model-value="errors.password = ''"
                              />
                              <Field.Error v-if="errors.password">{{
                                errors.password
                              }}</Field.Error>
                            </Field>

                            <Button
                              type="button"
                              :label="copy.forgotPassword"
                              variant="link"
                              @click="forgotPassword"
                            />
                          </div>
                        </div>

                        <div
                          v-else-if="step === 'reset'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Tooltip :content="copy.backToSignIn">
                              <IconButton
                                icon="az az-chevron-left"
                                :aria-label="copy.backToSignIn"
                                variant="outline"
                                size="small"
                                @click="backToSignIn"
                              />
                            </Tooltip>
                            <span class="truncate text-label-sm text-(--text-default)">{{
                              copy.backToSignIn
                            }}</span>
                          </div>

                          <Field
                            required
                            :invalid="!!errors.resetEmail"
                          >
                            <Field.Label for="reset-email">{{ copy.email }}</Field.Label>
                            <Input
                              id="reset-email"
                              v-model="resetEmail"
                              type="email"
                              name="reset-email"
                              size="large"
                              autocomplete="email"
                              class="w-full"
                              placeholder="m@example.com"
                              required
                              :invalid="!!errors.resetEmail"
                              :aria-describedby="
                                errors.resetEmail ? 'reset-email-error' : undefined
                              "
                              @update:model-value="errors.resetEmail = ''"
                            />
                            <FieldError
                              v-if="errors.resetEmail"
                              id="reset-email-error"
                              >{{ errors.resetEmail }}</FieldError
                            >
                          </Field>
                        </div>

                        <div
                          v-else-if="step === 'new-password'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <Field
                            required
                            :invalid="!!errors.newPassword"
                          >
                            <Field.Label for="new-password">{{ copy.newPassword }}</Field.Label>
                            <PasswordInput
                              id="new-password"
                              v-model="newPassword"
                              name="new-password"
                              autocomplete="new-password"
                              :placeholder="copy.newPasswordPlaceholder"
                              @update:model-value="errors.newPassword = ''"
                            />
                            <Field.Error v-if="errors.newPassword">{{
                              errors.newPassword
                            }}</Field.Error>
                            <PasswordRequirements :value="newPassword" />
                          </Field>

                          <Field
                            required
                            :invalid="!!errors.confirmPassword"
                          >
                            <Field.Label for="confirm-password">{{
                              copy.confirmPassword
                            }}</Field.Label>
                            <PasswordInput
                              id="confirm-password"
                              v-model="confirmPassword"
                              name="confirm-password"
                              autocomplete="new-password"
                              :placeholder="copy.confirmPasswordPlaceholder"
                              @update:model-value="errors.confirmPassword = ''"
                            />
                            <Field.Error v-if="errors.confirmPassword">{{
                              errors.confirmPassword
                            }}</Field.Error>
                          </Field>
                        </div>

                        <div
                          v-else
                          class="flex flex-col gap-(--spacing-xs)"
                        >
                          <div class="flex items-center gap-(--spacing-xs)">
                            <p class="text-body-sm text-(--text-default)">
                              {{ copy.didNotReceive }}
                            </p>
                            <Button
                              type="button"
                              :label="copy.resendEmail"
                              variant="link"
                              @click="resendEmail"
                            />
                          </div>
                          <div class="flex items-center gap-(--spacing-xs)">
                            <p class="text-body-sm text-(--text-default)">
                              {{ copy.alreadyOpened }}
                            </p>
                            <Button
                              type="button"
                              :label="copy.setNewPassword"
                              variant="link"
                              @click="openResetLink"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <div class="relative">
                        <Button
                          :label="primaryAction.label"
                          :variant="primaryAction.variant"
                          size="large"
                          class="w-full"
                          type="submit"
                          :loading="verifying"
                        />

                        <div
                          v-if="step === 'email' && lastUsed === 'email'"
                          class="absolute end-(--spacing-sm) top-0 -translate-y-1/2"
                        >
                          <Tag
                            :label="copy.lastUsed"
                            severity="info"
                            size="small"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </template>
            </Card>

            <div
              class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
            >
              <div class="flex items-center justify-center gap-(--spacing-xs)">
                <p class="text-body-xs text-(--text-default)">{{ copy.noAccount }}</p>
                <a
                  class="text-link text-body-xs"
                  :href="signUpHref"
                  >{{ copy.signUp }}</a
                >
              </div>

              <template v-if="step === 'email' || step === 'password'">
                <p class="text-center text-body-xs text-(--text-muted)">
                  {{ copy.agreeStart }}
                  <a
                    class="text-link"
                    :href="termsHref"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ copy.terms }}</a
                  >
                  {{ copy.and }}
                  <a
                    class="text-link"
                    :href="privacyHref"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ copy.privacy }}</a
                  >.
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
