# AuthSignIn (`auth/auth-sign-in`)

> The signed-out screens of a platform app, frame included: a full-height page with the signed-out `AppHeader` (the product mark and a Documentation button) over a centred column that holds one `Card` and the prompt and terms under it. It serves /login, /signup and /signup/verify, and the signed-in hand-offs that share the frame: the OAuth authorize screen (scopes, Allow / Deny) and device or CLI authorization (compare the code, Confirm). An app that signs in with an Azion personal token instead of an account uses the PersonalToken variant (`token-sign-in.vue`): one masked `PasswordInput` for the token, a link to where tokens are created, a Remember for this tab option, and a `sign-in` event that hands the token to the app, which answers with `loading` and `error`. The Google and GitHub buttons lead the card, over an “or” `Separator`. The card opens on a `PageHeader` and signs in in two steps: email, then password. Each field is a `Field` whose `Field.Label` sits over an `Input`, or over a `PasswordInput` with `PasswordRequirements`; a `FieldError` (email) or `Field.Error` (password) appears only after the primary action. While a request is in flight the primary `Button` shows its loading state and the step's fieldset is disabled. The rest is `Button`, `IconButton` in a `Tooltip`, a `Tag` and an `Alert`. Errors follow one rule: auth never toasts. Each error story is the primary flow with one endpoint response: the same two-step card on its password step, and the outcome in the same small `Alert` under the heading. What changes is the severity and what it carries: nothing after a 401, because the fields under it are the recovery; Retry when nobody can fix it (503, 500, timeout); the Sign in and reset-your-password links when the address is already registered (409). In-page actions (Forgot your password?, Resend email, Set a new password) are `Button` with `variant="link"`, never an anchor to `#`. Built from `PageHeader`, `AppHeader`, `Tag`, `Card`, `Alert`, `Input`, `Field`, `PasswordInput`, `PasswordRequirements`, `FieldError` and `Button`. The card column slides in from the inline start with a fade on mount (`starting:` styles, `duration-slow-01`, `ease-expressive-entrance`, none under reduced motion), and the card height eases between steps. A full page routed outside ConsoleLayout. The sign-in card's copy ships in English, Portuguese (Brazil) and Spanish and follows the app's WebKit locale (`useLocale`), so the screen translates with WebKit's own strings.

- Surface: app
- Source: `blocks/auth/auth-sign-in/auth-sign-in.vue` in `@aziontech/webkit`
- MCP: `get_block("auth/auth-sign-in")`
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), [CopyButton](../../components/copy-button.md), [Field](../../components/field.md), `FieldError`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [KeyValueList](../../components/key-value-list.md), [OtpInput](../../components/otp-input.md), [PageHeader](../../components/page-header.md), [PasswordInput](../../components/password-input.md), [PasswordRequirements](../../components/password-requirements.md), [QrCode](../../components/qr-code.md), [Separator](../../components/separator.md), [Skeleton](../../components/skeleton.md), [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md), `use-locale`
- Skills: `webkit-form`, `webkit-errors`, `webkit-microcopy`

## Asked as

login; log in; sign in; signin; login page; authentication; auth; forgot password; reset password; new password; entrar; tela de login; acessar conta; esqueci a senha; redefinir senha; signup; sign up; register; registration; create account; new account; free account; cadastro; cadastrar; criar conta; tela de cadastro; registrar; check inbox; check your email; verify email; email verification; confirm email; verification sent; resend email; verificar e-mail; confirmar e-mail; confira seu e-mail; session expired; auth errors; sessão expirada; erro de login; mfa; authenticator app; one-time code; verification code; totp; recovery code; autenticação em dois fatores; código de verificação; código de autenticação; loading sign-in providers; providers loading; carregando provedores de login; oauth consent; authorize app; authorize application; app authorization; consent screen; allow access; grant access; scopes; permissions requested; third-party app access; device authorization; device code; cli login; connect cli; device flow; autorizar aplicativo; tela de consentimento; conceder acesso; autorizar dispositivo; login pela cli; token sign in; api token sign in; personal token; personal token sign in; sign in with token; sign in with api key; api key login; paste token; access token login; token login; entrar com token; login com token; token pessoal

The signed-out screens of a platform app: sign in, sign up, reset password and check your inbox, frame included. The user has one job here, to get into their account, and one object on the page to do it with: a single card under the signed-out bar. Every step of the flow (`email`, `password`, `reset`, `sent`, `new-password`) swaps the contents of that card in place, and every answer the server gives, success included, lands in one `Alert` inside it. Auth never toasts. It is a full page with its own focused header: the app routes it outside `ConsoleLayout`, never into the layout's default slot.

## When to use

- `/login`, `/signup` and `/signup/verify`, and the reset-password link the user follows from their inbox.
- Re-entering after a session expired: the same card opens on the password step with the address already filled.
- Any signed-out step that asks for credentials (sign in, MFA, set a new password).
- The OAuth authorize screen (`OauthConsent`): a third-party app asks to act on the signed-in account, and the person allows or denies the scopes it lists.
- Device and CLI sign-in (`DeviceAuthorization`): a terminal or a device without a browser printed a code, and the person confirms it here.
- An app with no accounts of its own that calls the Azion API with the person's personal token (PersonalToken): an internal console, a dashboard, a storage browser.

## When not to use

- First-run steps after the account exists (profile, plan, organization): use `account/account-onboarding-form`.
- Changing the password or email of a signed-in user: use `settings/settings-form` (Profile).
- Signing out an expired session over a console page: the shell wire is `state/state-page-skeleton` (Session); this block is where it lands.
- Any signed-in form: use `state/state-form-validation` for the submit states and `settings/settings-form` for settings.
- Listing or revoking the apps a person already authorized: that is a settings table, not this card.

## Building blocks

### A. Signed-out bar — `AppHeader` (required)

The bar above the card, labelled `aria-label="Console"`. Brand on the start side, one Documentation button on the end side, the middle empty. It is the same bar on every step so the user knows they are still in the same flow. Shared anatomy with `top-bar/top-bar-auth`.

### B. Product mark — `Brand` (required)

`variant="default"`, `size="small"`, inside `AppHeader.Brand` with `href` set to the home route and `aria-label="Azion home"`, so the brand renders as the link and owns the focus ring.

### C. Actions — `Button` (required)

Three roles, never more on one step:

- **Documentation** in the bar: `variant="outline"`, `size="medium"`, the only way out that needs no account.
- **Continue with Google / GitHub** on the email step: `variant="outline"`, `size="large"`, full width, `type="button"` so they never submit the form.
- **The primary action** at the foot of the card, `type="submit"`, full width, `size="large"`. Its label follows the step: `Continue with email`, `Sign in`, `Send reset link`, `Reset password`. On the `sent` step it drops to `variant="secondary"` with `Return to sign in`, because nothing is left to submit.

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

A `Field.Label` over each input, inside the input's `Field`: `Email`, `Password`, `New password`, `Confirm password`. Every field on these screens is required; the `Field` is `required` from the first render, so the label shows the Required marker before any submit.

### H. Email — `Input` (required)

`type="email"`, `size="large"`, full width, with a `name`. Sign in uses `autocomplete="username"` so password managers pair it with the password step; the reset step uses `autocomplete="email"`; sign up uses `autocomplete="email"` too. It is `required` from the start; empty or malformed on submit takes `invalid`, and the error clears as the user types.

### I. Field message — `FieldError` (conditional)

Shows only after the primary action, under the email input, with a message that says what to enter: `This field is required.` when the value is empty, `Enter a valid email address.` when it is malformed. It is client-side validation (row 1 of `skills/webkit-errors`); it never goes in the `Alert`. Linked from the input with `aria-describedby`.

### J. Step hint — `Tooltip` (password and reset steps)

Names the icon-only back control: `Change email` on the password step, `Back to sign in` on the reset step.

### K. Back control — `IconButton` (password and reset steps)

`az az-chevron-left`, `variant="outline"`, `size="small"`, with an `aria-label` equal to its tooltip. On the password step it sits beside the email being used, so the user can see and change which account they are signing in to; going back clears the password.

### L. Password field — `Field` (password and new-password steps)

Wraps each `PasswordInput` with its `required` / `invalid` state and a `Field.Error` that holds the error. On the new-password step it also wraps the requirements list.

### M. Password — `PasswordInput` (password and new-password steps)

`autocomplete="current-password"` on sign in, `autocomplete="new-password"` on reset and sign up. Placeholders describe the expected value (`Type your password`, `Enter a new password`, `Repeat the new password`). `Forgot your password?` is a `Button` with `variant="link"` under the sign-in password (an in-page action, so never an anchor to `#`); it carries the email into the reset step. `Resend email` and `Set a new password` on the sent step are link buttons too.

### N. Password rules — `PasswordRequirements` (new-password step, sign up)

Live checklist bound to the new password (`:value`), driven by `DEFAULT_PASSWORD_REQUIREMENTS`. The same list validates on submit, so a password that fails it reads `Password does not meet requirements.`

### O. Last used — `Tag` (email step only)

`severity="info"`, `size="small"`, `Last used`, pinned to the top-end corner of the button of the method this browser signed in with last time: the `lastUsed` prop (`email`, `google` or `github`). Empty by default, so a first-time visitor sees no tag; the app sets it only from what it stored at the last sign-in. Decorative help, never a status.

### P. Card heading — `PageHeader` (required)

`size="small"`, the step's title and its lead (`Welcome back` / `Sign in to your account.`). The same part on every screen of the block, primary and variants, so the card always opens on one `h1`.

### Q. Provider placeholder — `Skeleton` (while `providersLoading`)

Two bars of the provider buttons' height (`height="2.5rem"`) in a `role="status"` region named `Preparing sign-in providers`, in place of Google and GitHub over the `or` divider. The email field stays usable.

### R. Personal token — `PasswordInput` (PersonalToken, RejectedToken and NoAccessToken)

For an app that signs in with an Azion personal token instead of an account. The card is its own file, `token-sign-in.vue`, and the three variants render it with props. One `Field` labelled `Personal token` over a `PasswordInput` with `monospace`, `autocomplete="off"`, `spellcheck="false"` and the show and hide toggle it ships, a `Field.Description` that links to how a token is created (a real Azion documentation link, `target="_blank"`), and a `Field.Error` for the client checks: empty (`Paste your personal token.`) and inner spaces (`A token has no spaces. Copy it again from Personal tokens.`). Under it a `Checkbox` `Remember for this tab`, off by default. The card has no Google or GitHub buttons and no steps.

The card checks nothing against the API itself: it emits `sign-in` with `(event, token)`, the token trimmed, and the app answers with `loading` and then `error`. It stores nothing: the `remember` model only tells the app where to keep the token (on: `sessionStorage`, which lasts while the tab is open; off: memory, gone on reload; never `localStorage` or a cookie the app's server can read). Attaching it to requests is the app's job; see `skills/webkit-azion-api`. `rejected` (401) and `no-access` (403) are danger notices with no action, the field cleared and focused (RejectedToken, NoAccessToken); `rate-limited` (429) and `unreachable` (no answer) are warning notices with Retry and the entry kept; any other text is a danger notice with Retry.

## Data

The block takes its starting values and the request state through props and emits every action; it fetches nothing and fakes no answer. `SignInProps`, `SignInValues`, `SignInStep`, `SignInMethod`, `SignInFailure` and `SignInNoticeKind` are exported from `auth-sign-in.vue`. The card keeps its own draft (the email, the password, the reset fields) and sends it with `submit`; the outcome comes back as `loading`, then `error` or `notice`. It has no sample records: the variants pass the props of each state. PersonalToken, RejectedToken and NoAccessToken render their own card, `token-sign-in.vue` (listed in `files`), not the primary: it takes no account fields, and its contract is below the primary's.

| Prop                                                             | Type                    | What it does                                                                                                                                                                                                   |
| ---------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `step` (`v-model:step`)                                          | `SignInStep`            | The step the card shows, `email` by default. The card moves itself between email, password, reset, sent and new-password; bind it to move it from the page (after `password-reset`, set it to `password`).     |
| `defaultValues`                                                  | `Partial<SignInValues>` | The email (and, to repeat a request, the password) the fields open on, such as the address of an expired session.                                                                                              |
| `loading`                                                        | `boolean`               | A request is in flight: the step's fieldset disables, the form is `aria-busy` and the primary `Button` (and Retry) spin.                                                                                       |
| `error`                                                          | `string`                | Why the request failed. `bad-credentials` (401), `service-unavailable` (503), `server-error` (500) and `timeout` carry their own copy, severity and Retry; any other text shows as a danger notice with Retry. |
| `notice`                                                         | `string`                | A non-error outcome: `session-expired`, `signed-in` or `password-updated`, or any text as an info notice.                                                                                                      |
| `providersLoading`                                               | `boolean`               | The identity providers are still loading; two `Skeleton` bars hold the place of Google and GitHub.                                                                                                             |
| `lastUsed`                                                       | `SignInMethod \| ''`    | The method this browser signed in with last time (`email`, `google` or `github`); its button carries the `Last used` tag. Empty by default: no tag.                                                            |
| `homeHref`, `docsHref`, `signUpHref`, `termsHref`, `privacyHref` | `string`                | Where the product mark, Documentation, Sign up and the two terms links lead.                                                                                                                                   |

| Event            | Payload                         | When                                                                                                         |
| ---------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `provider-click` | `(event, 'google' \| 'github')` | Continue with Google or Continue with GitHub.                                                                |
| `continue`       | `(event, email)`                | Continue with email passed validation; the card moves to the password step.                                  |
| `submit`         | `(event, { email, password })`  | Sign in passed validation, or Retry in the notice re-sends the same credentials.                             |
| `reset-request`  | `(event, email)`                | Send reset link passed validation; the card moves to Check your inbox.                                       |
| `resend`         | `(event, email)`                | Resend email on the sent step; the card confirms the new link.                                               |
| `password-reset` | `(event, password)`             | Reset password passed validation; set `step` to `password` and `notice` to `password-updated` when it lands. |

The token card, `token-sign-in.vue` (`TokenSignInProps` and `TokenSignInFailure` are exported from it):

| Prop                            | Type      | What it does                                                                                                                                                                              |
| ------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading`                       | `boolean` | The token is being checked: the fieldset disables, the form is `aria-busy` and Sign in spins.                                                                                             |
| `error`                         | `string`  | Why the check failed. `rejected` (401), `no-access` (403), `rate-limited` (429) and `unreachable` carry their own copy, severity and Retry; any other text is a danger notice with Retry. |
| `remember` (`v-model:remember`) | `boolean` | Remember for this tab, `false` by default. The block stores nothing; the app reads it to choose `sessionStorage` over memory.                                                             |
| `homeHref`, `docsHref`          | `string`  | Where the product mark and Documentation lead.                                                                                                                                            |

| Event             | Payload          | When                                                                              |
| ----------------- | ---------------- | --------------------------------------------------------------------------------- |
| `sign-in`         | `(event, token)` | Sign in passed the client checks, or Retry in the notice re-sends the kept token. |
| `update:remember` | `(value)`        | Remember for this tab changed.                                                    |

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import TokenSignIn from './sign-in.token-sign-in.vue'

  const loading = ref(false)
  const error = ref('')
  const remember = ref(false)

  const signIn = async (_event: Event, token: string) => {
    loading.value = true
    error.value = ''
    const response = await fetch('/azion-api/v4/workspace/applications?page_size=1', {
      headers: { Authorization: `Token ${token}` }
    }).catch(() => null)
    loading.value = false
    if (!response) error.value = 'unreachable'
    else if (response.status === 401) error.value = 'rejected'
    else if (response.status === 403) error.value = 'no-access'
    else if (response.status === 429) error.value = 'rate-limited'
    else if (response.ok) session.start(token, remember.value ? sessionStorage : null)
    else error.value = 'Azion answered with an error. Retry in a moment.'
  }
</script>

<template>
  <TokenSignIn
    v-model:remember="remember"
    :loading="loading"
    :error="error"
    @sign-in="signIn"
  />
</template>
```

To go live, render the block from the route that owns the session and pass what the request returns. Clear `error` when a new request starts, so the same failure shows again:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import AuthSignIn, { type SignInValues } from './auth-sign-in.vue'

  const loading = ref(false)
  const error = ref('')

  const signIn = async (_event: Event, values: SignInValues) => {
    loading.value = true
    error.value = ''
    try {
      await session.signIn(values)
      router.push('/')
    } catch (failure) {
      error.value = failure.status === 401 ? 'bad-credentials' : 'server-error'
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <AuthSignIn
    :loading="loading"
    :error="error"
    @submit="signIn"
  />
</template>
```

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
- Don't keep a personal token in `localStorage`, a URL or a log, and don't echo it back on the page after sign-in.
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
- **Personal token:** heading `Sign in with a personal token`; lead `Paste a personal token from your Azion account. It is sent only to the Azion API.`; rejected `Azion did not accept this token. Check that you copied all of it and that it has not expired or been revoked.`; no access `This token is valid but cannot read what this app needs. Create a token with access to the account and paste it here.`; rate limited `Azion is limiting requests from this token. Wait a moment and retry.`; unreachable `We could not reach Azion to check the token. Your entry is kept.`; option `Remember for this tab` / `Closing the tab signs you out.`
- **Device code errors:** `Enter the code your terminal shows.`, `Enter all 8 characters of the code.`, `That code is not valid or has expired. Check your terminal, or start the sign-in again there.`
- **Languages:** the sign-in card (`auth-sign-in.vue`) carries its copy in a `COPY` table keyed by locale (`en`, `pt-BR`, `es`) and reads the active locale with `useLocale`, so a `ConfigProvider` around the page translates the block's copy together with WebKit's own strings (the password show and hide labels, the requirements). An unknown locale falls back to its language, then to English. Add a language by adding one entry to `COPY`; keep the English row as the source and keep the terms sentence split into its link parts.

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
- Consent and device authorization: the card body is a `section` named by its `h1` (`aria-labelledby`); the scope list is an `Item.List` named by its heading (`Acme Deploy will be able to`), each scope a `listitem` with a decorative glyph; the request details are a `KeyValueList` named `Request details`.

## States

- Login: the default props, the sign-in flow on the email step, with Google and GitHub over the `or` divider; the same file walks through password, reset, sent and new-password.
- SignUp: create an account with a work email (and a password checked by `PasswordRequirements`), Google or GitHub.
- SessionExpired: `step="password"`, the email in `defaultValues` and `notice="session-expired"`; opens on the password step for the same email, with an info notice that clears on the next action.
- Submitting: `loading` on the password step; Sign in in flight: the primary `Button` loading, the fieldset disabled, the form `aria-busy`.
- ProvidersLoading: `providersLoading`; the Login card while the identity providers load; two `Skeleton` bars in a `role="status"` region (`Preparing sign-in providers`) replace Google and GitHub over the `or` divider, and the email step works meanwhile.
- CheckInbox: the `/signup/verify` card: where the link went, the resend prompt and a secondary Return to sign in.
- IncorrectCredentials: `error="bad-credentials"`; 401 on Sign in, on the password step of the same two-step card; a danger notice under the heading, no action, the password cleared.
- ServiceUnavailable: `error="service-unavailable"`; 503 on Sign in; a warning notice with Retry, credentials kept.
- ServerError: `error="server-error"`; 500 on the request; a danger notice with Retry in the card instead of a toast.
- Timeout: `error="timeout"`; no response; the same notice as the 500 in warning, with Retry, because the request may have gone through.
- EmailAlreadyRegistered: 409 on Sign up; a danger notice with Sign in and reset your password as links, the address left in the field.
- MfaSetup: turning on multi-factor authentication: three numbered steps, a `QrCode` of the `otpauth://` URI the API returns (issuer, account and secret) with the setup key and its `CopyButton` for people who cannot scan, then an `OtpInput` in a `Field`. The code submits on `complete` or Verify code; a wrong code (`000000` in the demo) clears it, marks the field invalid with the reason and keeps focus; no answer (`999999`) is a warning notice with Retry; success is a success notice, then the recovery codes the API issues once: eight 8-character codes in a monospace list with Download and Copy, and an `I saved these codes` checkbox that Continue to Console waits for, so the recovery path MfaCode offers always has codes behind it.
- MfaCode: the sign-in challenge after the password: a 6-digit `OtpInput`, focused when the challenge opens (not with `autofocus`), that submits on `complete`, Use a recovery code (an 8-character alphanumeric `OtpInput` grouped by 4) and Sign in with another account. Same outcomes as MfaSetup: field reason for a rejected code, warning notice with Retry when the check does not answer.
- OauthConsent: the authorize screen. The app (square `Avatar` with its initials, name, publisher, site), the signed-in account in an outlined `Item` with Switch account, the scopes in an `Item.List`, the redirect URL and where to revoke, then Deny / Allow. The pressed answer shows its loading state and locks the other; the outcome lands in the notice slot (`success` for Allow, `info` for Deny) and both stay locked.
- DeviceAuthorization: device or CLI sign-in. The code the terminal printed (`WDJB-MJHT`) in large mono text, the request details in a split `KeyValueList`, the account and the two scopes, Cancel / Confirm. `The code does not match? Enter the code from your terminal` swaps to an 8-character alphanumeric `OtpInput` grouped by 4: a rejected code (`00000000` in the demo) is the field's reason, cleared and focused; no answer (`99999999`) is a warning notice with Retry; an accepted code returns to the confirm step showing it. Confirm reports `success`, Cancel `info`.

- PersonalToken: sign in with an Azion personal token. One masked, monospace field with show and hide, a link to how tokens are made, required and no-spaces checks, Remember for this tab (off), then `sign-in` `(event, token)`; the app answers with `loading` and `error`.
- RejectedToken: `error="rejected"`, the card after a 401, the danger notice under the heading and the empty field focused.
- NoAccessToken: `error="no-access"`, the card after a 403, a danger notice that asks for a token with access, the empty field focused.

## Related

- `top-bar/top-bar-auth` — the signed-out bar this block renders at the top.
- `account/account-onboarding-form` — where a new account goes after it verifies its email.
- `state/state-page-skeleton` — the session wire painted while an expired session signs out, before this screen.
- `state/state-form-validation` — the same field mechanics (required versus invalid, validate on submit) in a signed-in form, where unscoped failures do toast.
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
- `MfaSetup` — Turn on multi-factor authentication: steps, the QR code with a copyable setup key, and a 6-digit OtpInput that verifies on complete; wrong code on the field, no answer as a warning with Retry; on success, recovery codes to download or copy, confirmed saved before Continue.
- `MfaCode` — The sign-in MFA challenge: a 6-digit OtpInput, focused when the challenge opens, that submits when full, a recovery-code mode (8 characters, grouped), and Sign in with another account.
- `OauthConsent` — The OAuth authorize screen: the requesting app with its publisher and site, the signed-in account with Switch account, the scopes it asks for as a list, where Allow sends you, and Deny / Allow, each settling in the card's notice.
- `DeviceAuthorization` — Device or CLI authorization: the code the terminal printed, shown large to compare, the request details (application, device, IP address, time), the account and scopes, Cancel / Confirm, and a typed code entry (8 characters, grouped by 4) when the codes do not match.
- `PersonalToken` — Sign in with an Azion personal token, for an app with no accounts of its own. The card is `token-sign-in.vue`, driven by props: one masked, monospace `PasswordInput` with show and hide, a link to how tokens are created, required and no-spaces checks on the field, a Remember for this tab `Checkbox` (`v-model:remember`, off by default; the block stores nothing), and a `sign-in` event `(event, token)`. The app checks the token and answers with `loading`, then `error` (`rejected`, `no-access`, `rate-limited`, `unreachable` or a message).
- `RejectedToken` — `error="rejected"` (a 401 on the personal token): the same card with the danger notice under the heading, the field cleared and focused for another paste.
- `NoAccessToken` — `error="no-access"` (a 403: the token is valid but lacks the permissions the app reads): a danger notice that says to create a token with access, the field cleared and focused.

Each variant is the same screen in another state: `get_block("auth/auth-sign-in", { variant })`, or the file under `blocks/auth/auth-sign-in/variants/`.

## Code (`Login`)

```vue
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
```

## `token-sign-in.vue`

```ts
<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { computed, nextTick, onMounted, ref, watch } from 'vue'

  /** Why the API did not let the token in, each with its own copy, severity and Retry rule. */
  export type TokenSignInFailure = 'rejected' | 'no-access' | 'rate-limited' | 'unreachable'

  export interface TokenSignInProps {
    /** The token is being checked against the API: the field locks and Sign in spins. */
    loading?: boolean
    /** Why the last check failed: a failure kind with its own copy, or a message shown as a danger notice with Retry. */
    error?: TokenSignInFailure | (string & {})
    /** Where the product mark leads. */
    homeHref?: string
    /** Where the Documentation button leads. */
    docsHref?: string
  }

  interface CardNotice {
    severity: AlertSeverity
    label: string
    retry: boolean
  }

  const props = withDefaults(defineProps<TokenSignInProps>(), {
    loading: false,
    error: '',
    homeHref: '/home',
    docsHref: '/docs'
  })

  const emit = defineEmits<{ 'sign-in': [event: Event, token: string] }>()

  const remember = defineModel<boolean>('remember', { default: false })

  const TOKEN_DOCS = 'https://www.azion.com/en/documentation/products/accounts/personal-tokens/'

  const failures: Record<TokenSignInFailure, CardNotice> = {
    rejected: {
      severity: 'danger',
      label:
        'Azion did not accept this token. Check that you copied all of it and that it has not expired or been revoked.',
      retry: false
    },
    'no-access': {
      severity: 'danger',
      label:
        'This token is valid but cannot read what this app needs. Create a token with access to the account and paste it here.',
      retry: false
    },
    'rate-limited': {
      severity: 'warning',
      label: 'Azion is limiting requests from this token. Wait a moment and retry.',
      retry: true
    },
    unreachable: {
      severity: 'warning',
      label: 'We could not reach Azion to check the token. Your entry is kept.',
      retry: true
    }
  }

  const token = ref('')
  const tokenError = ref('')

  const notice = computed<CardNotice | null>(() => {
    if (!props.error || props.loading) return null
    return (
      failures[props.error as TokenSignInFailure] ?? {
        severity: 'danger',
        label: props.error,
        retry: true
      }
    )
  })

  const focusToken = () => nextTick(() => document.getElementById('personal-token')?.focus())

  const clearsEntry = (error: string) => error === 'rejected' || error === 'no-access'

  onMounted(() => {
    if (clearsEntry(props.error)) focusToken()
  })

  watch(
    () => [props.error, props.loading] as const,
    ([error, loading]) => {
      if (loading || !clearsEntry(error)) return
      token.value = ''
      focusToken()
    }
  )

  const signIn = (event: Event) => {
    if (props.loading) return
    const candidate = token.value.trim()
    if (!candidate) tokenError.value = 'Paste your personal token.'
    else if (/\s/.test(candidate))
      tokenError.value = 'A token has no spaces. Copy it again from Personal tokens.'
    else tokenError.value = ''
    if (tokenError.value) {
      focusToken()
      return
    }
    emit('sign-in', event, candidate)
  }

  const FORM_COLUMN_CLASS =
    'm-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance ' +
    'starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none'
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand
        :href="homeHref"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
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
                  <form
                    class="flex flex-col gap-(--spacing-lg)"
                    aria-label="Sign in with a personal token"
                    :aria-busy="loading || undefined"
                    novalidate
                    @submit.prevent="signIn"
                  >
                    <PageHeader
                      title="Sign in with a personal token"
                      description="Paste a personal token from your Azion account. It is sent only to the Azion API."
                      size="small"
                    />

                    <Alert
                      v-if="notice"
                      :key="notice.label"
                      :severity="notice.severity"
                      size="small"
                      :label="notice.label"
                    >
                      <template
                        v-if="notice.retry"
                        #actions
                      >
                        <Button
                          label="Retry"
                          variant="secondary"
                          size="small"
                          @click="signIn"
                        />
                      </template>
                    </Alert>

                    <fieldset
                      class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0"
                      :disabled="loading"
                    >
                      <legend class="sr-only">Personal token</legend>
                      <Field
                        required
                        :invalid="!!tokenError"
                      >
                        <Field.Label for="personal-token">Personal token</Field.Label>
                        <PasswordInput
                          id="personal-token"
                          v-model="token"
                          name="token"
                          autocomplete="off"
                          spellcheck="false"
                          monospace
                          placeholder="Paste your token"
                          @update:model-value="tokenError = ''"
                        />
                        <Field.Description>
                          Create one in Account settings, Personal tokens.
                          <a
                            class="text-link"
                            :href="TOKEN_DOCS"
                            target="_blank"
                            rel="noopener noreferrer"
                            >How to create a personal token</a
                          >
                        </Field.Description>
                        <Field.Error v-if="tokenError">{{ tokenError }}</Field.Error>
                      </Field>
                      <Field orientation="horizontal">
                        <Checkbox
                          v-model="remember"
                          name="remember"
                        />
                        <Field.Content>
                          <Field.Label>Remember for this tab</Field.Label>
                          <Field.Description>Closing the tab signs you out.</Field.Description>
                        </Field.Content>
                      </Field>
                    </fieldset>

                    <Button
                      type="submit"
                      label="Sign in"
                      variant="primary"
                      size="large"
                      class="w-full"
                      :loading="loading"
                    />
                  </form>
                </div>
              </template>
            </Card>

            <p class="max-w-(--container-sm) text-center text-body-xs text-(--text-muted)">
              Use a token with only the permissions this app needs, and revoke it in Personal tokens
              when you are done.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
```
