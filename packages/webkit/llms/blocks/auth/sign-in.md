# SignIn (`auth/sign-in`)

> The signed-out screens of a platform app, frame included: a full-height page with the signed-out `GlobalHeader` (the product mark and a Documentation button) over a centred column that holds one `Card` and the prompt and terms under it. It serves /login, /signup and /signup/verify, and the signed-in hand-offs that share the frame: the OAuth authorize screen (scopes, Allow / Deny) and device or CLI authorization (compare the code, Confirm). The Google and GitHub buttons lead the card, over an “or” `Separator`. The card opens on a `PageHeader` and signs in in two steps: email, then password. Each field is a `Field` whose `Field.Label` sits over an `Input`, or over a `PasswordInput` with `PasswordRequirements`; a `HelperText` (email) or `Field.Error` (password) appears only after the primary action. While a request is in flight the primary `Button` shows its loading state and the step's fieldset is disabled. The rest is `Button`, `IconButton` in a `Tooltip`, a `Tag` and an `Alert`. Errors follow one rule: auth never toasts. Each error story is the primary flow with one endpoint response: the same two-step card on its password step, and the outcome in the same small `Alert` under the heading. What changes is the severity and what it carries: nothing after a 401, because the fields under it are the recovery; Retry when nobody can fix it (503, 500, timeout); the Sign in and reset-your-password links when the address is already registered (409). In-page actions (Forgot your password?, Resend email, Set a new password) are `Button` with `kind="link"`, never an anchor to `#`. Built from `PageHeader`, `GlobalHeader`, `Tag`, `Card`, `Alert`, `Input`, `Field`, `PasswordInput`, `PasswordRequirements`, `HelperText` and `Button`. The card column slides in from the inline start with a fade on mount (`starting:` styles, `duration-slow-01`, `ease-expressive-entrance`, none under reduced motion), and the card height eases between steps. A full page routed outside ConsoleLayout.

- Surface: app
- Source: `blocks/auth/sign-in/sign-in.vue` in `@aziontech/webkit`
- MCP: `get_block("auth/sign-in")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Button](../../components/button.md), [Card](../../components/card.md), [CopyButton](../../components/copy-button.md), [Field](../../components/field.md), [GlobalHeader](../../components/global-header.md), [HelperText](../../components/helper-text.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [KeyValuePairs](../../components/key-value-pairs.md), [OtpInput](../../components/otp-input.md), [PageHeader](../../components/page-header.md), [PasswordInput](../../components/password-input.md), [PasswordRequirements](../../components/password-requirements.md), [QrCode](../../components/qr-code.md), [Separator](../../components/separator.md), [Skeleton](../../components/skeleton.md), [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-form`, `webkit-errors`, `webkit-microcopy`

## Asked as

login; log in; sign in; signin; login page; authentication; auth; forgot password; reset password; new password; entrar; tela de login; acessar conta; esqueci a senha; redefinir senha; signup; sign up; register; registration; create account; new account; free account; cadastro; cadastrar; criar conta; tela de cadastro; registrar; check inbox; check your email; verify email; email verification; confirm email; verification sent; resend email; verificar e-mail; confirmar e-mail; confira seu e-mail; session expired; auth errors; sessão expirada; erro de login; mfa; authenticator app; one-time code; verification code; totp; recovery code; autenticação em dois fatores; código de verificação; código de autenticação; loading sign-in providers; providers loading; carregando provedores de login; oauth consent; authorize app; authorize application; app authorization; consent screen; allow access; grant access; scopes; permissions requested; third-party app access; device authorization; device code; cli login; connect cli; device flow; autorizar aplicativo; tela de consentimento; conceder acesso; autorizar dispositivo; login pela cli

The signed-out screens of a platform app: sign in, sign up, reset password and check your inbox, frame included. The user has one job here, to get into their account, and one object on the page to do it with: a single card under the signed-out bar. Every step of the flow (`email`, `password`, `reset`, `sent`, `new-password`) swaps the contents of that card in place, and every answer the server gives, success included, lands in one `Alert` inside it. Auth never toasts. It is a full page with its own focused header: the app routes it outside `ConsoleLayout`, never into the layout's default slot.

## When to use

- `/login`, `/signup` and `/signup/verify`, and the reset-password link the user follows from their inbox.
- Re-entering after a session expired: the same card opens on the password step with the address already filled.
- Any signed-out step that asks for credentials (sign in, MFA, set a new password).
- The OAuth authorize screen (`OauthConsent`): a third-party app asks to act on the signed-in account, and the person allows or denies the scopes it lists.
- Device and CLI sign-in (`DeviceAuthorization`): a terminal or a device without a browser printed a code, and the person confirms it here.

## When not to use

- First-run steps after the account exists (profile, plan, organization): use `account/onboarding-form`.
- Changing the password or email of a signed-in user: use `settings/settings-form` (Profile).
- Signing out an expired session over a console page: the shell wire is `state/page-skeleton` (Session); this block is where it lands.
- Any signed-in form: use `state/form-validation` for the submit states and `settings/settings-form` for settings.
- Listing or revoking the apps a person already authorized: that is a settings table, not this card.

## Building blocks

### A. Signed-out bar — `GlobalHeader` (required)

The bar above the card, labelled `aria-label="Console"`. Brand on the start side, one Documentation button on the end side, the middle empty. It is the same bar on every step so the user knows they are still in the same flow. Shared anatomy with `top-bar/auth-bar`.

### B. Product mark — `Brand` (required)

`kind="default"`, `size="small"`, inside a link to the home route with `aria-label="Azion home"`. The link owns the focus ring.

### C. Actions — `Button` (required)

Three roles, never more on one step:

- **Documentation** in the bar: `kind="outlined"`, `size="medium"`, the only way out that needs no account.
- **Continue with Google / GitHub** on the email step: `kind="outlined"`, `size="large"`, full width, `type="button"` so they never submit the form.
- **The primary action** at the foot of the card, `type="submit"`, full width, `size="large"`. Its label follows the step: `Continue with email`, `Sign in`, `Send reset link`, `Reset password`. On the `sent` step it drops to `kind="secondary"` with `Return to sign in`, because nothing is left to submit.

### D. The card — `Card` (required)

One `Card` with `:padded="false"`, capped at `max-w-(--container-sm)` and centred in the column. It holds the `<form novalidate>`, its heading (`PageHeader`, `size="small"`: the `h1` plus a muted lead), the notice slot, the step body inside one `fieldset` and the primary action. Prompts that are not part of the form (Don't have an account? Sign up, the terms line) sit under the card, outside it.

### E. Card notice — `Alert` (conditional)

The one place every outcome lands. It sits under the card heading and above **both** fields, always `size="small"`, always in the same slot:

- **Session expired** (primary, `SessionExpired`): `severity="info"`, clears on the next action.
- **401** (`IncorrectCredentials`): `danger`, no action. The fields under it are the recovery. The password is cleared and takes focus.
- **503** (`ServiceUnavailable`) and **no response** (`Timeout`): `warning`, with **Retry** in the `#actions` slot. Severity follows certainty: a timeout is an unknown.
- **500** (`ServerError`): `danger`, with **Retry**. Tied to no field, so where the console would toast, the card keeps it.
- **409** (`EmailAlreadyRegistered`): `danger`, carrying the two exits as links in the default slot: Sign in or reset your password. The address stays in the field.
- **Success** (signed in, account created, password updated, link resent): `success`, no action. Sign up reads `Account created. We sent a verification link to jane.doe@example.com.`

Put the copy in the default slot when it carries links; animate the entrance on a wrapper, not on the `Alert` itself.

### F. Social divider — `Separator` (email step only)

`<Separator label="or" />` between the social buttons and the email field. Only on the email step; no other separator in the card.

### G. Field label — `Field`, `Field.Label` (required)

A `Field.Label` over each input, inside the input's `Field`: `Email`, `Password`, `New password`, `Confirm password`. Every field on these screens is required; the `Field`'s `required` turns on with the required prompt after the primary action, and the label shows the indicator then.

### H. Email — `Input` (required)

`type="email"`, `size="large"`, full width, with a `name`. Sign in uses `autocomplete="username"` so password managers pair it with the password step; the reset step uses `autocomplete="email"`; sign up uses `autocomplete="email"` too. Empty on submit takes `required`, filled but malformed takes `invalid`, and the error clears as the user types.

### I. Field message — `HelperText` (conditional)

Shows only after the primary action, under the email input, with `kind="required"` when the value is empty and `kind="invalid"` when it is malformed. It is client-side validation (row 1 of `skills/webkit-errors`); it never goes in the `Alert`. Linked from the input with `aria-describedby`.

### J. Step hint — `Tooltip` (password and reset steps)

Names the icon-only back control: `Change email` on the password step, `Back to sign in` on the reset step.

### K. Back control — `IconButton` (password and reset steps)

`ai ai-chevron-left`, `kind="outlined"`, `size="small"`, with an `aria-label` equal to its tooltip. On the password step it sits beside the email being used, so the user can see and change which account they are signing in to; going back clears the password.

### L. Password field — `Field` (password and new-password steps)

Wraps each `PasswordInput` with its `required` / `invalid` state and a `Field.Error` that holds the error. On the new-password step it also wraps the requirements list.

### M. Password — `PasswordInput` (password and new-password steps)

`autocomplete="current-password"` on sign in, `autocomplete="new-password"` on reset and sign up. Placeholders describe the expected value (`Type your password`, `Enter a new password`, `Repeat the new password`). `Forgot your password?` is a `Button` with `kind="link"` under the sign-in password (an in-page action, so never an anchor to `#`); it carries the email into the reset step. `Resend email` and `Set a new password` on the sent step are link buttons too.

### N. Password rules — `PasswordRequirements` (new-password step, sign up)

Live checklist bound to the new password (`:value`), driven by `DEFAULT_PASSWORD_REQUIREMENTS`. The same list validates on submit, so a password that fails it reads `Password does not meet requirements.`

### O. Last used — `Tag` (email step only)

`severity="info"`, `size="small"`, `Last used`, pinned to the top-end corner of the primary action to point at the method the user signed in with last time. Decorative help, never a status.

### P. Card heading — `PageHeader` (required)

`size="small"`, the step's title and its lead (`Welcome back` / `Sign in to your account.`). The same part on every screen of the block, primary and variants, so the card always opens on one `h1`.

## Do

- Keep one card and one notice slot for the whole flow; swap the step body, not the page.
- Validate on submit only, then clear a field's error as the user types in it.
- After a 401, put the message above both fields, clear the password and move focus back to it.
- Keep the credentials after a 503, a 500 or a timeout; Retry re-sends the same request.
- Carry the email between steps (sign in to reset, reset back to sign in) so the user never types it twice.
- While a request is in flight, show the primary `Button` `loading`, disable the step's `fieldset` and mark the form `aria-busy`; release the lock on every outcome so Retry can run again.
- Enter the card column once, on mount: it slides in from the inline start with a fade (`starting:-translate-x-6 starting:opacity-0`, `rtl:starting:translate-x-6`, `transition-[translate,opacity] duration-slow-01 ease-expressive-entrance`). Steps inside the card do not replay it.
- Let the card height follow the step: a `ResizeObserver` on the form sets the wrapper height, which eases with `transition-[height] duration-moderate-02 ease-productive-entrance` and clips only while it moves.
- While the identity providers load, hold their place with two `Skeleton` bars of the buttons' height in a `role="status"` region named `Preparing sign-in providers`; keep email sign-in usable.

- On a code screen, put the code in one `OtpInput` (autofill reads `autocomplete="one-time-code"`), submit on `complete`, and keep a Verify button.
- Give every QR code a typed alternative: the setup key with a copy button.

- On the consent screen, name the app, its publisher and site in the heading block, the account it will act on (with Switch account), and every scope as a row with a glyph, a title that starts with a verb and one sentence of what it covers.
- Say where Allow sends the person (the redirect URL as code text) and where to revoke access later.
- Put Deny and Allow side by side at the foot of the card, Allow on the inline end; lock both while either answer is in flight, and keep both locked once the notice reports the outcome.
- On device authorization, show the code the terminal printed in large mono type, grouped `XXXX-XXXX`, with the request details (application, device, IP address, time) so the person can spot a request they did not start.

## Don't

- Don't toast. Not for errors, not for success, not for the session-expired notice.
- Don't say which half of the pair was wrong after a 401; it confirms the address exists.
- Don't put a Retry button on a 401: the form under the notice is the retry.
- Don't put client-side validation in the `Alert`; it belongs on the field.
- Don't call a timeout a failure (`danger`) or say the account was not created; the request may have landed.
- Don't stack notices: a new outcome replaces the one in the slot.
- Don't hide or disable the email field while the providers load, and don't show a spinner in place of the provider buttons.

- Don't split a one-time code into separate inputs or move focus between them by hand; `OtpInput` is one field.
- Don't toast a rejected code; it is the field's reason, and the field is cleared and focused.

- Don't preselect or let the person untick single scopes on the consent screen; the app asked for a set, and Allow grants that set or Deny grants nothing.
- Don't hide which account will be authorized; Switch account sits beside it before Allow.
- Don't make the device code an input on the confirm step; it is text to compare. Typing it is the fallback, behind the link.

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
- **Providers loading:** the status name says what is happening, no ellipsis: `Preparing sign-in providers`.
- **Action in a notice:** `Retry`, never "Try again" (the console and assistant blocks use the same word).
- **Consent heading:** `Authorize Acme Deploy`; the lead names publisher and site: `Acme Deploy by Acme Inc. (deploy.example.com) wants to access your account.`
- **Scope rows:** title starts with a verb (`Read your workloads`, `Deploy your applications`), the description says what is in and, when it matters, what is not: `Names, domains and status. Not their settings or secrets.`
- **Consent actions:** `Deny` and `Allow`. Outcomes: `Access granted. Returning to Acme Deploy.` / `Access denied. Returning to Acme Deploy with no access to your account.`
- **Device actions:** `Cancel` and `Confirm`. Outcomes: `Device connected. Go back to your terminal; you can close this tab.` / `Request cancelled. The device was not connected.`
- **Device code errors:** `Enter the code your terminal shows.`, `Enter all 8 characters of the code.`, `That code is not valid or has expired. Check your terminal, or start the sign-in again there.`

## Accessibility

- The form has an accessible name (`aria-label="Sign in to your account"`) and `novalidate`, so the browser does not show its own bubbles over the field messages.
- Each input has a visible `Field.Label` tied to it by its `Field`; each error is linked with `aria-describedby` (or through `Field.Error` inside `Field`).
- Use the right `autocomplete` on every field (`username`, `current-password`, `new-password`, `email`) so password managers and autofill work.
- Icon-only back buttons have an `aria-label` equal to their tooltip.
- After a submit with errors, focus the first field that needs attention; after a 401, the password.
- The notice uses the `Alert` role from the component; don't add a second live region for the same message.
- Every transition sets `motion-reduce:transition-none` and `motion-reduce:transform-none`.
- Under reduced motion the column appears in place (no slide, no fade) and the card height jumps.
- The provider placeholder is announced once by its status name; the `Skeleton` bars are decorative.
- Social buttons are `type="button"` so Enter in the email field submits the email, not a provider.

- MFA: the code field is named by its label (`Authentication code`, `Recovery code`) and described by the reason when rejected; the QR code is an image named after the account, and the setup key is real text.
- Consent and device authorization: the card body is a `section` named by its `h1` (`aria-labelledby`); the scope list is an `Item.List` named by its heading (`Acme Deploy will be able to`), each scope a `listitem` with a decorative glyph; the request details are a `KeyValuePairs` named `Request details`.

## States

- Login: the sign-in flow on the email step, with Google and GitHub over the `or` divider; the same file walks through password, reset, sent and new-password.
- SignUp: create an account with a work email (and a password checked by `PasswordRequirements`), Google or GitHub.
- SessionExpired: opens on the password step for the same email, with an info notice that clears on the next action.
- Submitting: Sign in in flight on the password step: the primary `Button` loading, the fieldset disabled, the form `aria-busy`.
- ProvidersLoading: the Login card while the identity providers load; two `Skeleton` bars in a `role="status"` region (`Preparing sign-in providers`) replace Google and GitHub over the `or` divider, and the email step works meanwhile.
- CheckInbox: the `/signup/verify` card: where the link went, the resend prompt and a secondary Return to sign in.
- IncorrectCredentials: 401 on Sign in, on the password step of the same two-step card; a danger notice under the heading, no action, the password cleared.
- ServiceUnavailable: 503 on Sign in; a warning notice with Retry, credentials kept.
- ServerError: 500 on the request; a danger notice with Retry in the card instead of a toast.
- Timeout: no response; the same notice as the 500 in warning, with Retry, because the request may have gone through.
- EmailAlreadyRegistered: 409 on Sign up; a danger notice with Sign in and reset your password as links, the address left in the field.
- MfaSetup: turning on multi-factor authentication: three numbered steps, a `QrCode` of the `otpauth://` URI the API returns (issuer, account and secret) with the setup key and its `CopyButton` for people who cannot scan, then an `OtpInput` in a `Field`. The code submits on `complete` or Verify code; a wrong code (`000000` in the demo) clears it, marks the field invalid with the reason and keeps focus; no answer (`999999`) is a warning notice with Retry; success is a success notice and Continue to Console.
- MfaCode: the sign-in challenge after the password: a 6-digit `OtpInput`, focused when the challenge opens (not with `autofocus`), that submits on `complete`, Use a recovery code (an 8-character alphanumeric `OtpInput` grouped by 4) and Sign in with another account. Same outcomes as MfaSetup: field reason for a rejected code, warning notice with Retry when the check does not answer.
- OauthConsent: the authorize screen. The app (square `Avatar` with its initials, name, publisher, site), the signed-in account in an outlined `Item` with Switch account, the scopes in an `Item.List`, the redirect URL and where to revoke, then Deny / Allow. The pressed answer shows its loading state and locks the other; the outcome lands in the notice slot (`success` for Allow, `info` for Deny) and both stay locked.
- DeviceAuthorization: device or CLI sign-in. The code the terminal printed (`WDJB-MJHT`) in large mono text, the request details in a split `KeyValuePairs`, the account and the two scopes, Cancel / Confirm. `The code does not match? Enter the code from your terminal` swaps to an 8-character alphanumeric `OtpInput` grouped by 4: a rejected code (`00000000` in the demo) is the field's reason, cleared and focused; no answer (`99999999`) is a warning notice with Retry; an accepted code returns to the confirm step showing it. Confirm reports `success`, Cancel `info`.

## Related

- `top-bar/auth-bar` — the signed-out bar this block renders at the top.
- `account/onboarding-form` — where a new account goes after it verifies its email.
- `state/page-skeleton` — the session wire painted while an expired session signs out, before this screen.
- `state/form-validation` — the same field mechanics (required versus invalid, validate on submit) in a signed-in form, where unscoped failures do toast.
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
- `ProvidersLoading` — The /login screen while the identity providers load: two `Skeleton` bars in a `role="status"` region named Preparing sign-in providers take the place of the Google and GitHub buttons; email sign-in works meanwhile.
- `Submitting` — Sign in in flight: the password step with the primary Button loading, the fieldset disabled and the form marked busy until the request answers.
- `CheckInbox` — The /signup/verify screen: where the verification link went, the resend prompt, and a secondary Return to sign in action.
- `IncorrectCredentials` — 401 on Sign in, on the password step of the same two-step card: a danger message under the heading with no action, and the password cleared.
- `ServiceUnavailable` — 503 on Sign in, on the password step: a warning message that keeps the credentials and carries Retry, the only move left.
- `ServerError` — 500 on Sign in, on the password step: tied to no field, so where the console would toast, the card keeps a danger message with Retry.
- `Timeout` — No response to Sign in, on the password step: the same message as the 500 but warning, because the request may still have gone through, with Retry.
- `EmailAlreadyRegistered` — 409 on Sign up: a danger message carrying the two ways out as links, Sign in or reset your password, with the address left in the field.
- `MfaSetup` — Turn on multi-factor authentication: steps, the QR code with a copyable setup key, and a 6-digit OtpInput that verifies on complete; wrong code on the field, no answer as a warning with Retry.
- `MfaCode` — The sign-in MFA challenge: a 6-digit OtpInput, focused when the challenge opens, that submits when full, a recovery-code mode (8 characters, grouped), and Sign in with another account.
- `OauthConsent` — The OAuth authorize screen: the requesting app with its publisher and site, the signed-in account with Switch account, the scopes it asks for as a list, where Allow sends you, and Deny / Allow, each settling in the card's notice.
- `DeviceAuthorization` — Device or CLI authorization: the code the terminal printed, shown large to compare, the request details (application, device, IP address, time), the account and scopes, Cancel / Confirm, and a typed code entry (8 characters, grouped by 4) when the codes do not match.

Each variant is the same screen in another state: `get_block("auth/sign-in", { variant })`, or the file under `blocks/auth/sign-in/variants/`.

## Code (`Login`)

```vue
<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import Brand from '@aziontech/webkit/brand'
  import Button, { type ButtonKind } from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS
  } from '@aziontech/webkit/password-requirements'
  import Separator from '@aziontech/webkit/separator'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onScopeDispose, reactive, ref } from 'vue'

  interface CardNotice {
    severity: AlertSeverity
    label: string
    retry?: boolean
  }

  const failure: string = ''
  const failureNotices: Record<string, CardNotice> = {
    'bad-credentials': {
      severity: 'danger',
      label: 'Incorrect email or password. Check both and try again.'
    },
    'service-unavailable': {
      severity: 'warning',
      label: 'Sign-in is unavailable right now. Your credentials are fine.',
      retry: true
    },
    'server-error': {
      severity: 'danger',
      label: 'Sign-in failed on our side. You are still signed out. Error 500.',
      retry: true
    },
    timeout: {
      severity: 'warning',
      label: 'The server did not answer in time. Your session may already be open.',
      retry: true
    }
  }

  const step = ref('email')
  const returnStep = ref('email')
  const email = ref('')
  const password = ref('')
  const resetEmail = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const cardNotice = ref<CardNotice | null>(null)
  const verifying = ref(false)
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
  let requestTimer: ReturnType<typeof setTimeout> | undefined

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
    clearTimeout(requestTimer)
  })

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const emailError = (value: string) =>
    !value.trim()
      ? 'This field is required.'
      : emailPattern.test(value.trim())
        ? ''
        : 'Enter a valid email address.'

  const newPasswordError = (value: string) =>
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

  const primaryAction = computed<{ label: string; kind: ButtonKind }>(() => {
    if (step.value === 'password') return { label: 'Sign in', kind: 'primary' }
    if (step.value === 'reset') return { label: 'Send reset link', kind: 'primary' }
    if (step.value === 'new-password') return { label: 'Reset password', kind: 'primary' }
    if (step.value === 'sent') return { label: 'Return to sign in', kind: 'secondary' }
    return { label: 'Continue with email', kind: 'primary' }
  })

  const focusField = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const request = (done: () => void) => {
    verifying.value = true
    clearTimeout(requestTimer)
    requestTimer = setTimeout(() => {
      verifying.value = false
      done()
    }, 600)
  }

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

  const resendEmail = () => {
    request(() => {
      cardNotice.value = {
        severity: 'success',
        label: `We sent another link to ${resetEmail.value}.`
      }
    })
  }

  const openResetLink = () => {
    cardNotice.value = null
    newPassword.value = ''
    confirmPassword.value = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    step.value = 'new-password'
  }

  const signIn = () => {
    errors.password = password.value ? '' : 'This field is required.'
    if (errors.password) {
      focusField('login-password')
      return
    }
    request(() => {
      cardNotice.value = failureNotices[failure] ?? { severity: 'success', label: 'Signed in.' }
    })
  }

  const onPrimary = () => {
    if (verifying.value) return
    cardNotice.value = null
    if (step.value === 'email') {
      errors.email = emailError(email.value)
      if (errors.email) focusField('login-email')
      else request(() => (step.value = 'password'))
    } else if (step.value === 'password') signIn()
    else if (step.value === 'reset') {
      errors.resetEmail = emailError(resetEmail.value)
      if (errors.resetEmail) focusField('reset-email')
      else request(() => (step.value = 'sent'))
    } else if (step.value === 'new-password') {
      errors.newPassword = newPasswordError(newPassword.value)
      errors.confirmPassword = !confirmPassword.value
        ? 'This field is required.'
        : confirmPassword.value === newPassword.value
          ? ''
          : "Passwords don't match."
      if (errors.newPassword || errors.confirmPassword)
        focusField(errors.newPassword ? 'new-password' : 'confirm-password')
      else
        request(() => {
          email.value = resetEmail.value
          password.value = ''
          returnStep.value = 'password'
          step.value = 'password'
          cardNotice.value = {
            severity: 'success',
            label: 'Password updated. Sign in with the new one.'
          }
        })
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
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Center />
      <GlobalHeader.End>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="ai ai-book"
          href="/docs"
        />
      </GlobalHeader.End>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
        <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
          <div
            class="m-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none"
          >
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
                      aria-label="Sign in to your account"
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
                            label="Retry"
                            kind="secondary"
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
                          <div class="flex flex-col gap-(--spacing-sm)">
                            <Button
                              type="button"
                              label="Continue with Google"
                              kind="outlined"
                              size="large"
                              icon="ai-color ai-google"
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

                        <div v-if="step === 'email'">
                          <Field :required="!!errors.email && !email.trim()">
                            <Field.Label for="login-email">Email</Field.Label>
                            <Input
                              id="login-email"
                              v-model="email"
                              type="email"
                              name="email"
                              size="large"
                              autocomplete="username"
                              class="w-full"
                              placeholder="m@example.com"
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
                          </Field>
                        </div>

                        <div
                          v-else-if="step === 'password'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Tooltip content="Change email">
                              <IconButton
                                icon="ai ai-chevron-left"
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

                          <div class="flex flex-col items-start gap-(--spacing-xs)">
                            <Field
                              class="w-full"
                              :required="!!errors.password && !password"
                              :invalid="!!errors.password && !!password"
                            >
                              <Field.Label for="login-password">Password</Field.Label>
                              <PasswordInput
                                id="login-password"
                                v-model="password"
                                name="password"
                                autocomplete="current-password"
                                placeholder="Type your password"
                                @update:model-value="errors.password = ''"
                              />
                              <Field.Error v-if="errors.password">{{
                                errors.password
                              }}</Field.Error>
                            </Field>

                            <Button
                              type="button"
                              label="Forgot your password?"
                              kind="link"
                              @click="forgotPassword"
                            />
                          </div>
                        </div>

                        <div
                          v-else-if="step === 'reset'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Tooltip content="Back to sign in">
                              <IconButton
                                icon="ai ai-chevron-left"
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

                          <Field :required="!!errors.resetEmail && !resetEmail.trim()">
                            <Field.Label for="reset-email">Email</Field.Label>
                            <Input
                              id="reset-email"
                              v-model="resetEmail"
                              type="email"
                              name="reset-email"
                              size="large"
                              autocomplete="email"
                              class="w-full"
                              placeholder="m@example.com"
                              :required="!!errors.resetEmail && !resetEmail.trim()"
                              :invalid="!!errors.resetEmail && !!resetEmail.trim()"
                              :aria-describedby="
                                errors.resetEmail ? 'reset-email-error' : undefined
                              "
                              @update:model-value="errors.resetEmail = ''"
                            />
                            <HelperText
                              v-if="errors.resetEmail"
                              id="reset-email-error"
                              :kind="resetEmail.trim() ? 'invalid' : 'required'"
                              :label="errors.resetEmail"
                            />
                          </Field>
                        </div>

                        <div
                          v-else-if="step === 'new-password'"
                          class="flex flex-col gap-(--spacing-lg)"
                        >
                          <Field
                            :required="!!errors.newPassword && !newPassword"
                            :invalid="!!errors.newPassword && !!newPassword"
                          >
                            <Field.Label for="new-password">New password</Field.Label>
                            <PasswordInput
                              id="new-password"
                              v-model="newPassword"
                              name="new-password"
                              autocomplete="new-password"
                              placeholder="Enter a new password"
                              @update:model-value="errors.newPassword = ''"
                            />
                            <Field.Error v-if="errors.newPassword">{{
                              errors.newPassword
                            }}</Field.Error>
                            <PasswordRequirements :value="newPassword" />
                          </Field>

                          <Field
                            :required="!!errors.confirmPassword && !confirmPassword"
                            :invalid="!!errors.confirmPassword && !!confirmPassword"
                          >
                            <Field.Label for="confirm-password">Confirm password</Field.Label>
                            <PasswordInput
                              id="confirm-password"
                              v-model="confirmPassword"
                              name="confirm-password"
                              autocomplete="new-password"
                              placeholder="Repeat the new password"
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
                              Didn't receive the email?
                            </p>
                            <Button
                              type="button"
                              label="Resend email"
                              kind="link"
                              @click="resendEmail"
                            />
                          </div>
                          <div class="flex items-center gap-(--spacing-xs)">
                            <p class="text-body-sm text-(--text-default)">Already opened it?</p>
                            <Button
                              type="button"
                              label="Set a new password"
                              kind="link"
                              @click="openResetLink"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <div class="relative">
                        <Button
                          :label="primaryAction.label"
                          :kind="primaryAction.kind"
                          size="large"
                          class="w-full"
                          type="submit"
                          :loading="verifying"
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

              <template v-if="step === 'email' || step === 'password'">
                <p class="text-center text-body-xs text-(--text-muted)">
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
              </template>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
```
