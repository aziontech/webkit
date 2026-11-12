# Auth (`platform/auth`)

> The signed-out screens of a platform app, frame included: a full-height page with the signed-out `GlobalHeader` (the product mark and a Documentation button) over a centred column that holds one `Card` and the prompt and terms under it. It serves /login, /signup and /signup/verify. The Google and GitHub buttons lead the card, over an “or” `Separator`. Each field is a required `Label` over `Input` or a `Field` with `PasswordInput` and `PasswordRequirements`; a `HelperText` appears only after the primary action, saying whether the field is empty or malformed. The rest is `Button`, `IconButton` in a `Tooltip`, a `Tag` and a `Alert`. Errors follow one rule: auth never toasts. Each error story is one endpoint response, and every outcome lands in the same small `Alert` at the top of the card, above the fields. What changes is the severity and what it carries: nothing after a 401, because the fields under it are the recovery; Retry when nobody can fix it (503, 500, timeout); the Sign in and reset-your-password links when the address is already registered (409). Built from `PageHeader`, `GlobalHeader`, `Tag`, `Card`, `Alert`, `Label`, `Input`, `Field`, `PasswordInput`, `PasswordRequirements`, `HelperText` and `Button`.

- Surface: product
- Source: `blocks/platform/auth/auth.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/auth")`
- Components: [Alert](../../components/alert.md), [Brand](../../components/brand.md), [Button](../../components/button.md), [Card](../../components/card.md), [CopyButton](../../components/copy-button.md), [Field](../../components/field.md), [GlobalHeader](../../components/global-header.md), [HelperText](../../components/helper-text.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Label](../../components/label.md), [OtpInput](../../components/otp-input.md), [PageHeader](../../components/page-header.md), [PasswordInput](../../components/password-input.md), [PasswordRequirements](../../components/password-requirements.md), [QrCode](../../components/qr-code.md), [Separator](../../components/separator.md), [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-form`, `webkit-errors`, `webkit-microcopy`

## Asked as

login; log in; sign in; signin; login page; authentication; auth; forgot password; reset password; new password; entrar; tela de login; acessar conta; esqueci a senha; redefinir senha; signup; sign up; register; registration; create account; new account; free account; cadastro; cadastrar; criar conta; tela de cadastro; registrar; check inbox; check your email; verify email; email verification; confirm email; verification sent; resend email; verificar e-mail; confirmar e-mail; confira seu e-mail; session expired; auth errors; sessão expirada; erro de login; mfa; multi-factor authentication; two-factor authentication; 2fa; authenticator app; one-time code; verification code; totp; recovery code; autenticação em dois fatores; autenticação multifator; código de verificação; código de autenticação

The signed-out screens of a platform app: sign in, sign up, reset password and check your inbox, frame included. The user has one job here, to get into their account, and one object on the page to do it with: a single card under the signed-out bar. Every step of the flow (`email`, `password`, `reset`, `sent`, `new-password`) swaps the contents of that card in place, and every answer the server gives, success included, lands in one `Alert` inside it. Auth never toasts.

## When to use

- `/login`, `/signup` and `/signup/verify`, and the reset-password link the user follows from their inbox.
- Re-entering after a session expired: the same card opens on the password step with the address already filled.
- Any signed-out step that asks for credentials (sign in, MFA, set a new password).

## When not to use

- First-run steps after the account exists (profile, plan, organization): use `platform/account/onboarding-form`.
- Changing the password or email of a signed-in user: use `platform/account/profile`.
- Signing out an expired session over a console page: the shell wire is `platform/states/page-wires` (SessionWire); this block is where it lands.
- Any signed-in form: use `platform/states/form-validation` for the submit states and `platform/settings/settings-form` for settings.

## Building blocks

### A. Signed-out bar — `GlobalHeader` (required)

The bar above the card, labelled `aria-label="Console"`. Brand on the start side, one Documentation button on the end side, the middle empty. It is the same bar on every step so the user knows they are still in the same flow. Shared anatomy with `headers/auth-header`.

### B. Product mark — `Brand` (required)

`kind="default"`, `size="small"`, inside a link to the home route with `aria-label="Azion home"`. The link owns the focus ring.

### C. Actions — `Button` (required)

Three roles, never more on one step:

- **Documentation** in the bar: `kind="outlined"`, `size="medium"`, the only way out that needs no account.
- **Continue with Google / GitHub** on the email step: `kind="outlined"`, `size="large"`, full width, `type="button"` so they never submit the form.
- **The primary action** at the foot of the card, `type="submit"`, full width, `size="large"`. Its label follows the step: `Continue with email`, `Sign in`, `Send reset link`, `Reset password`. On the `sent` step it drops to `kind="secondary"` with `Return to sign in`, because nothing is left to submit.

### D. The card — `Card` (required)

One `Card` with `:padded="false"`, capped at `max-w-(--container-sm)` and centred in the column. It holds the `<form novalidate>`, its heading (`h1` plus a muted lead), the notice slot, the step body and the primary action. Prompts that are not part of the form (Don't have an account? Sign up, the terms line) sit under the card, outside it.

### E. Card notice — `Alert` (conditional)

The one place every outcome lands. It sits under the card heading and above **both** fields, always `size="small"`, always in the same slot:

- **Session expired** (primary, `SessionExpired`): `severity="info"`, clears on the next action.
- **401** (`IncorrectCredentials`): `danger`, no action. The fields under it are the recovery. The password is cleared and takes focus.
- **503** (`ServiceUnavailable`) and **no response** (`Timeout`): `warning`, with **Retry** in the `#action` slot. Severity follows certainty: a timeout is an unknown.
- **500** (`ServerError`): `danger`, with **Retry**. Tied to no field, so where the console would toast, the card keeps it.
- **409** (`EmailAlreadyRegistered`): `danger`, carrying the two exits as links in the default slot: Sign in or reset your password. The address stays in the field.
- **Success** (signed in, account created): `success`, no action. Sign up reads `Account created. We sent a verification link to name@example.com.`

Put the copy in the default slot when it carries links; animate the entrance on a wrapper, not on the `Alert` itself.

### F. Social divider — `Separator` (email step only)

`<Separator label="or" />` between the social buttons and the email field. Only on the email step; no other separator in the card.

### G. Field label — `Label` (required)

A `Label` with `for` and `required` over each input: `Email`, `Password`, `New password`, `Confirm password`. Every field on these screens is required, so every label carries the indicator.

### H. Email — `Input` (required)

`type="email"`, `size="large"`, full width, with a `name`. Sign in uses `autocomplete="username"` so password managers pair it with the password step; the reset step uses `autocomplete="email"`; sign up uses `autocomplete="email"` too. Empty on submit takes `required`, filled but malformed takes `invalid`, and the error clears as the user types.

### I. Field message — `HelperText` (conditional)

Shows only after the primary action, under the email input, with `kind="required"` when the value is empty and `kind="invalid"` when it is malformed. It is client-side validation (row 1 of `skills/webkit-errors`); it never goes in the `Alert`. Linked from the input with `aria-describedby`.

### J. Step hint — `Tooltip` (password and reset steps)

Names the icon-only back control: `Change email` on the password step, `Back to sign in` on the reset step.

### K. Back control — `IconButton` (password and reset steps)

`pi pi-chevron-left`, `kind="outlined"`, `size="small"`, with an `aria-label` equal to its tooltip. On the password step it sits beside the email being used, so the user can see and change which account they are signing in to; going back clears the password.

### L. Password field — `Field` (password and new-password steps)

Wraps each `PasswordInput` with its `required` / `invalid` state and a `Field.Description` that holds the error. On the new-password step it also wraps the requirements list.

### M. Password — `PasswordInput` (password and new-password steps)

`autocomplete="current-password"` on sign in, `autocomplete="new-password"` on reset and sign up. Placeholders describe the expected value (`Type your password`, `Enter a new password`, `Repeat the new password`). `Forgot your password?` is a plain link under the sign-in password; it carries the email into the reset step.

### N. Password rules — `PasswordRequirements` (new-password step, sign up)

Live checklist bound to the new password (`:value`), driven by `DEFAULT_PASSWORD_REQUIREMENTS`. The same list validates on submit, so a password that fails it reads `Password does not meet requirements.`

### O. Last used — `Tag` (email step only)

`severity="info"`, `size="small"`, `Last used`, pinned to the top-end corner of the primary action to point at the method the user signed in with last time. Decorative help, never a status.

## Do

- Keep one card and one notice slot for the whole flow; swap the step body, not the page.
- Validate on submit only, then clear a field's error as the user types in it.
- After a 401, put the message above both fields, clear the password and move focus back to it.
- Keep the credentials after a 503, a 500 or a timeout; Retry re-sends the same request.
- Carry the email between steps (sign in to reset, reset back to sign in) so the user never types it twice.
- Release the in-flight lock on every outcome so Retry can run again.

- On a code screen, put the code in one `OtpInput` (autofill reads `autocomplete="one-time-code"`), submit on `complete`, and keep a Verify button.
- Give every QR code a typed alternative: the setup key with a copy button.

## Don't

- Don't toast. Not for errors, not for success, not for the session-expired notice.
- Don't say which half of the pair was wrong after a 401; it confirms the address exists.
- Don't put a Retry button on a 401: the form under the notice is the retry.
- Don't put client-side validation in the `Alert`; it belongs on the field.
- Don't call a timeout a failure (`danger`) or say the account was not created; the request may have landed.
- Don't stack notices: a new outcome replaces the one in the slot.

- Don't split a one-time code into separate inputs or move focus between them by hand; `OtpInput` is one field.
- Don't toast a rejected code; it is the field's reason, and the field is cleared and focused.

## Copy

- **Card heading:** names the step, sentence case, no punctuation: `Welcome back`, `Reset your password`, `Check your inbox`, `Sign up for a free account`. The lead under it is one full sentence: `Sign in to your account.`
- **Primary action:** a verb for what happens: `Continue with email`, `Sign in`, `Send reset link`, `Reset password`, `Return to sign in`.
- **Field labels:** one to two words, no colon, no parentheses: `Email`, `Work email`, `Password`, `New password`, `Confirm password`.
- **Links:** sentence case: `Forgot your password?`, `Resend email`.
- **Field errors:** what is wrong, with a period: `This field is required.`, `Enter a valid email address.`, `Passwords don't match.`
- **401 notice:** `Incorrect email or password. Check both and try again.`
- **503 notice:** says what is down and what is not lost: `Sign-in is unavailable right now. Your credentials are fine.`
- **500 notice:** says what failed and what state the user is in, code last: `Sign-in failed on our side. You are still signed out. Error 500.`
- **Timeout notice:** names the unknown, never a failure: `The server did not answer in time. Your session may already be open.`
- **409 notice:** the fact plus the two exits as links: `This email is already registered. Sign in or reset your password.`
- **Session expired:** `Your session expired. Sign in again to pick up where you left off.`
- **Action in a notice:** `Retry`, never "Try again".

## Accessibility

- The form has an accessible name (`aria-label="Sign in to your account"`) and `novalidate`, so the browser does not show its own bubbles over the field messages.
- Each input has a visible `Label` with `for`; each error is linked with `aria-describedby` (or through `Field.Description` inside `Field`).
- Use the right `autocomplete` on every field (`username`, `current-password`, `new-password`, `email`) so password managers and autofill work.
- Icon-only back buttons have an `aria-label` equal to their tooltip.
- After a submit with errors, focus the first field that needs attention; after a 401, the password.
- The notice uses the `Alert` role from the component; don't add a second live region for the same message.
- Every transition sets `motion-reduce:transition-none` and `motion-reduce:transform-none`.
- Social buttons are `type="button"` so Enter in the email field submits the email, not a provider.

- MFA: the code field is named by its label (`Authentication code`, `Recovery code`) and described by the reason when rejected; the QR code is an image named after the account, and the setup key is real text.

## States

- Login: the sign-in flow on the email step, with Google and GitHub over the `or` divider; the same file walks through password, reset, sent and new-password.
- SignUp: create an account with a work email (and a password checked by `PasswordRequirements`), Google or GitHub.
- SessionExpired: opens on the password step for the same email, with an info notice that clears on the next action.
- CheckInbox: the `/signup/verify` card: where the link went, the resend prompt and a secondary Return to sign in.
- IncorrectCredentials: 401 on Sign in; a danger notice above both fields, no action, the password cleared and focused.
- ServiceUnavailable: 503 on Sign in; a warning notice with Retry, credentials kept.
- ServerError: 500 on the request; a danger notice with Retry in the card instead of a toast.
- Timeout: no response; the same notice as the 500 in warning, with Retry, because the request may have gone through.
- EmailAlreadyRegistered: 409 on Sign up; a danger notice with Sign in and reset your password as links, the address left in the field.
- MfaSetup: turning on multi-factor authentication: three numbered steps, a `QrCode` of the `otpauth://` URI the API returns (issuer, account and secret) with the setup key and its `CopyButton` for people who cannot scan, then an `OtpInput` in a `Field`. The code submits on `complete` or Verify code; a wrong code (`000000` in the demo) clears it, marks the field invalid with the reason and keeps focus; no answer (`999999`) is a warning notice with Retry; success is a success notice and Continue to Console.
- MfaCode: the sign-in challenge after the password: an autofocused 6-digit `OtpInput` that submits on `complete`, Use a recovery code (an 8-character alphanumeric `OtpInput` grouped by 4) and Sign in with another account. Same outcomes as MfaSetup: field reason for a rejected code, warning notice with Retry when the check does not answer.

## Related

- `headers/auth-header` — the signed-out bar this block renders at the top.
- `platform/account/onboarding-form` — where a new account goes after it verifies its email.
- `platform/states/page-wires` — the session wire painted while an expired session signs out, before this screen.
- `platform/states/form-validation` — the same field mechanics (required versus invalid, validate on submit) in a signed-in form, where unscoped failures do toast.
- `PasswordRequirements` — the live password checklist used on sign up and reset.

## Steps

- email
- password
- reset
- sent
- new-password

## Variants

- `Login` — primary (the code below)
- `SignUp` — The sign-up screen: create an account with a work email, Google or GitHub.
- `SessionExpired` — The /login screen after a session expires: it opens on the password step for the same email, with an info Alert that clears on the next action.
- `CheckInbox` — The /signup/verify screen: where the verification link went, the resend prompt, and a secondary Return to sign in action.
- `IncorrectCredentials` — 401 on Sign in: a danger message above both fields with no action, and the password cleared.
- `ServiceUnavailable` — 503 on Sign in: a warning message that keeps the credentials and carries Retry, the only move left.
- `ServerError` — 500 on the POST: tied to no field, so where the console would toast, the card keeps a danger message with Retry.
- `Timeout` — No response: the same message as the 500 but warning, because the request may still have gone through, with Retry.
- `EmailAlreadyRegistered` — 409 on Sign up: a danger message carrying the two ways out as links, Sign in or reset your password, with the address left in the field.
- `MfaSetup` — Turn on multi-factor authentication: steps, the QR code with a copyable setup key, and a 6-digit OtpInput that verifies on complete; wrong code on the field, no answer as a warning with Retry.
- `MfaCode` — The sign-in MFA challenge: an autofocused 6-digit OtpInput that submits when full, a recovery-code mode (8 characters, grouped), and Sign in with another account.

Each variant is the same screen in another state: `get_pattern("platform/auth", { variant })`, or the file under `blocks/platform/auth/variants/`.

## Code (`Login`)

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Separator from '@aziontech/webkit/separator'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import PasswordInput from '@aziontech/webkit/password-input'
  import Label from '@aziontech/webkit/label'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'
  import IconButton from '@aziontech/webkit/icon-button'
  import Alert from '@aziontech/webkit/alert'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref } from 'vue'

  const expiredEmail = ''

  const step = ref(expiredEmail ? 'password' : 'email')
  const returnStep = ref('email')
  const expiredNotice = ref(Boolean(expiredEmail))
  const email = ref(expiredEmail)
  const password = ref('')
  const resetEmail = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const signedIn = ref(false)
  const errors = reactive({
    email: '',
    password: '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

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
    signedIn.value = false
    step.value = 'email'
    password.value = ''
    errors.password = ''
  }

  const forgotPassword = () => {
    signedIn.value = false
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

  const focusField = (id) => nextTick(() => document.getElementById(id)?.focus())

  const handlePrimary = () => {
    expiredNotice.value = false
    signedIn.value = false
    if (step.value === 'email') {
      errors.email = emailError(email.value)
      if (errors.email) focusField('login-email')
      else step.value = 'password'
    } else if (step.value === 'password') {
      errors.password = password.value ? '' : 'This field is required.'
      if (errors.password) focusField('login-password')
      else signedIn.value = true
    } else if (step.value === 'reset') {
      errors.resetEmail = emailError(resetEmail.value)
      if (errors.resetEmail) focusField('reset-email')
      else step.value = 'sent'
    } else if (step.value === 'new-password') {
      errors.newPassword = newPasswordError(newPassword.value)
      errors.confirmPassword = !confirmPassword.value
        ? 'This field is required.'
        : confirmPassword.value === newPassword.value
          ? ''
          : "Passwords don't match."
      if (errors.newPassword || errors.confirmPassword)
        focusField(errors.newPassword ? 'new-password' : 'confirm-password')
      else {
        email.value = resetEmail.value
        password.value = ''
        returnStep.value = 'password'
        step.value = 'password'
      }
    } else backToSignIn()
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="/docs"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
        <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
          <div class="m-auto flex w-full flex-col items-center gap-(--spacing-md)">
            <Card
              class="w-full max-w-(--container-sm)"
              :padded="false"
            >
              <template #content>
                <div class="p-(--spacing-lg)">
                  <form
                    class="flex flex-col gap-(--spacing-lg)"
                    aria-label="Sign in to your account"
                    novalidate
                    @submit.prevent="handlePrimary"
                  >
                    <header class="flex flex-col gap-(--spacing-xxs)">
                      <h1 class="text-heading-sm text-(--text-default)">
                        {{ heading.title }}
                      </h1>
                      <p
                        v-if="heading.description"
                        class="text-body-sm text-(--text-muted)"
                      >
                        {{ heading.description }}
                      </p>
                    </header>

                    <Alert
                      v-if="expiredNotice"
                      key="expired"
                      severity="info"
                      size="small"
                      label="Your session expired. Sign in again to pick up where you left off."
                    />
                    <Alert
                      v-else-if="signedIn"
                      key="signed-in"
                      severity="success"
                      size="small"
                      label="Signed in."
                    />

                    <div class="flex flex-col">
                      <div
                        v-if="step === 'email'"
                        class="flex flex-col gap-(--spacing-lg) pb-(--spacing-lg)"
                      >
                        <div class="flex flex-col gap-(--spacing-sm)">
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
                        </div>

                        <Separator label="or" />
                      </div>

                      <div
                        v-if="step === 'email'"
                        class="motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="login-email"
                            label="Email"
                            required
                          />
                          <Input
                            id="login-email"
                            v-model="email"
                            type="email"
                            name="email"
                            size="large"
                            autocomplete="username"
                            class="w-full"
                            placeholder="myemail@example.com"
                            :required="!!errors.email && !email.trim()"
                            :invalid="!!errors.email && !!email.trim()"
                            :aria-describedby="errors.email ? 'login-email-error' : undefined"
                            @update:model-value="errors.email = ''"
                          />
                          <HelperText
                            v-if="errors.email"
                            id="login-email-error"
                            :kind="email.trim() ? 'invalid' : 'required'"
                            :label="errors.email"
                          />
                        </div>
                      </div>

                      <div
                        v-else-if="step === 'password'"
                        class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div
                          class="flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none"
                        >
                          <Tooltip text="Change email">
                            <IconButton
                              icon="pi pi-chevron-left"
                              aria-label="Change email"
                              kind="outlined"
                              size="small"
                              @click="backToEmail"
                            />
                          </Tooltip>
                          <span class="truncate text-label-sm text-(--text-default)">{{
                            email
                          }}</span>
                        </div>

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="login-password"
                            label="Password"
                            required
                          />
                          <Field
                            :required="!!errors.password && !password"
                            :invalid="!!errors.password && !!password"
                          >
                            <PasswordInput
                              id="login-password"
                              v-model="password"
                              name="password"
                              autocomplete="current-password"
                              placeholder="Type your password"
                              @update:model-value="errors.password = ''"
                            />
                            <Field.Description v-if="errors.password">{{
                              errors.password
                            }}</Field.Description>
                          </Field>

                          <a
                            class="self-start text-body-xs text-(--text-muted) underline underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
                            href="#"
                            @click.prevent="forgotPassword"
                            >Forgot your password?</a
                          >
                        </div>
                      </div>

                      <div
                        v-else-if="step === 'reset'"
                        class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div
                          class="flex items-center gap-(--spacing-sm) motion-reduce:transition-none motion-reduce:transform-none"
                        >
                          <Tooltip text="Back to sign in">
                            <IconButton
                              icon="pi pi-chevron-left"
                              aria-label="Back to sign in"
                              kind="outlined"
                              size="small"
                              @click="backToSignIn"
                            />
                          </Tooltip>
                          <span class="truncate text-label-sm text-(--text-default)"
                            >Back to sign in</span
                          >
                        </div>

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="reset-email"
                            label="Email"
                            required
                          />
                          <Input
                            id="reset-email"
                            v-model="resetEmail"
                            type="email"
                            name="reset-email"
                            size="large"
                            autocomplete="email"
                            class="w-full"
                            placeholder="myemail@example.com"
                            :required="!!errors.resetEmail && !resetEmail.trim()"
                            :invalid="!!errors.resetEmail && !!resetEmail.trim()"
                            :aria-describedby="errors.resetEmail ? 'reset-email-error' : undefined"
                            @update:model-value="errors.resetEmail = ''"
                          />
                          <HelperText
                            v-if="errors.resetEmail"
                            id="reset-email-error"
                            :kind="resetEmail.trim() ? 'invalid' : 'required'"
                            :label="errors.resetEmail"
                          />
                        </div>
                      </div>

                      <div
                        v-else-if="step === 'new-password'"
                        class="flex flex-col gap-(--spacing-lg) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="new-password"
                            label="New password"
                            required
                          />
                          <Field
                            :required="!!errors.newPassword && !newPassword"
                            :invalid="!!errors.newPassword && !!newPassword"
                          >
                            <PasswordInput
                              id="new-password"
                              v-model="newPassword"
                              name="new-password"
                              autocomplete="new-password"
                              placeholder="Enter a new password"
                              @update:model-value="errors.newPassword = ''"
                            />
                            <Field.Description v-if="errors.newPassword">{{
                              errors.newPassword
                            }}</Field.Description>
                            <PasswordRequirements :value="newPassword" />
                          </Field>
                        </div>

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label
                            for="confirm-password"
                            label="Confirm password"
                            required
                          />
                          <Field
                            :required="!!errors.confirmPassword && !confirmPassword"
                            :invalid="!!errors.confirmPassword && !!confirmPassword"
                          >
                            <PasswordInput
                              id="confirm-password"
                              v-model="confirmPassword"
                              name="confirm-password"
                              autocomplete="new-password"
                              placeholder="Repeat the new password"
                              @update:model-value="errors.confirmPassword = ''"
                            />
                            <Field.Description v-if="errors.confirmPassword">{{
                              errors.confirmPassword
                            }}</Field.Description>
                          </Field>
                        </div>
                      </div>

                      <div
                        v-else
                        class="flex flex-col gap-(--spacing-xs) motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <div class="flex items-center gap-(--spacing-xs)">
                          <p class="text-body-sm text-(--text-default)">
                            Didn't receive the email?
                          </p>
                          <a
                            class="text-link text-body-sm"
                            href="#"
                            @click.prevent
                            >Resend email</a
                          >
                        </div>
                        <div class="flex items-center gap-(--spacing-xs)">
                          <p class="text-body-sm text-(--text-default)">Already opened it?</p>
                          <a
                            class="text-link text-body-sm"
                            href="#"
                            @click.prevent="openResetLink"
                            >Set a new password</a
                          >
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

                      <div
                        v-if="step === 'email'"
                        class="absolute end-(--spacing-sm) top-0 -translate-y-1/2"
                      >
                        <Tag
                          label="Last used"
                          severity="info"
                          size="small"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </template>
            </Card>

            <div
              class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
            >
              <div class="flex items-center justify-center gap-(--spacing-xs)">
                <p class="text-body-xs text-(--text-default)">Don't have an account?</p>
                <a
                  class="text-link text-body-xs"
                  href="/signup"
                  >Sign up</a
                >
              </div>

              <p
                v-if="step === 'email' || step === 'password'"
                class="text-center text-body-xs text-(--text-muted)"
              >
                By continuing, I agree to the
                <a
                  class="text-link"
                  href="https://example.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  >terms of service</a
                >
                and
                <a
                  class="text-link"
                  href="https://example.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  >privacy policy</a
                >.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
```
