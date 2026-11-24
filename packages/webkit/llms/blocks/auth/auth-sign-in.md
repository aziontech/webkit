# AuthSignIn (`auth/auth-sign-in`)

> The signed-out screens of a platform app, frame included: a full-height page with the signed-out `AppHeader` (the product mark and a Documentation button) over a centred column that holds one `Card` and the prompt and terms under it. It serves /login, /signup and /signup/verify, and the signed-in hand-offs that share the frame: the OAuth authorize screen (scopes, Allow / Deny) and device or CLI authorization (compare the code, Confirm). An app that signs in with an Azion personal token instead of an account uses the PersonalToken variant (`token-sign-in.vue`): one masked `PasswordInput` for the token, a link to where tokens are created, a Remember for this tab option, and a `sign-in` event that hands the token to the app, which answers with `loading` and `error`. The Google and GitHub buttons lead the card, over an “or” `Separator`. The card opens on a `PageHeader` and signs in in two steps: email, then password. Each field is a `Field` whose `Field.Label` sits over an `Input`, or over a `PasswordInput` with `PasswordRequirements`; a `FieldError` (email) or `Field.Error` (password) appears only after the primary action. While a request is in flight the primary `Button` shows its loading state and the step's fieldset is disabled. The rest is `Button`, `IconButton` in a `Tooltip`, a `Tag` and an `Alert`. Errors follow one rule: auth never toasts. Each error story is the primary flow with one endpoint response: the same two-step card on its password step, and the outcome in the same small `Alert` under the heading. What changes is the severity and what it carries: nothing after a 401, because the fields under it are the recovery; Retry when nobody can fix it (503, 500, timeout); and on sign-up a 409 (address already registered) answers exactly like a new address, so the screen never reveals which addresses have an account. In-page actions (Forgot your password?, Resend email, Set a new password) are `Button` with `variant="link"`, never an anchor to `#`. Built from `PageHeader`, `AppHeader`, `Tag`, `Card`, `Alert`, `Input`, `Field`, `PasswordInput`, `PasswordRequirements`, `FieldError` and `Button`. The card column slides in from the inline start with a fade on mount (`starting:` styles, `duration-slow-01`, `ease-expressive-entrance`, none under reduced motion), and the card height eases between steps. A full page routed outside ConsoleLayout. The sign-in card's copy ships in English, Portuguese (Brazil) and Spanish and follows the app's WebKit locale (`useLocale`), so the screen translates with WebKit's own strings.

- Surface: app
- Source: `blocks/auth/auth-sign-in/auth-sign-in.vue` in `@aziontech/webkit`
- MCP: `get_block("auth/auth-sign-in")`
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), [CopyButton](../../components/copy-button.md), [Field](../../components/field.md), `FieldError`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [KeyValueList](../../components/key-value-list.md), [Link](../../components/link.md), [OtpInput](../../components/otp-input.md), [PageHeader](../../components/page-header.md), [PasswordInput](../../components/password-input.md), [PasswordRequirements](../../components/password-requirements.md), [PasswordRequirements](../../components/password-requirements.md), [QrCode](../../components/qr-code.md), [Separator](../../components/separator.md), [Skeleton](../../components/skeleton.md), [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md), `use-locale`
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

### D. The card — `Card`, `Link` (required)

One `Card` with `:padded="false"`, capped at `max-w-(--container-sm)` and centred in the column. It holds the `<form novalidate>`, its heading (`PageHeader`, `size="small"`: the `h1` plus a muted lead), the notice slot, the step body inside one `fieldset` and the primary action. Prompts that are not part of the form (Don't have an account? Sign up, the terms line) sit under the card, outside it; their links are `Link inline`, so they take the size of the sentence and keep the underline.

### E. Card notice — `Alert` (conditional)

The one place every outcome lands. It sits under the card heading and above **both** fields, always `size="small"`, always in the same slot:

- **Session expired** (primary, `SessionExpired`): `severity="info"`, clears on the next action. Only for a person who had a session that ended: a 401 to a request that carried their token, or a server that reports the session cookie it received as ended. A first visit, or a cold load with no credential, opens the card with no notice.
- **401** (`IncorrectCredentials`): `danger`, no action. The fields under it are the recovery. The password is cleared and takes focus.
- **503** (`ServiceUnavailable`) and **no response** (`Timeout`): `warning`, with **Retry** in the `#actions` slot. Severity follows certainty: a timeout is an unknown.
- **500** (`ServerError`): `danger`, with **Retry**. Tied to no field, so where the console would toast, the card keeps it.
- **409** (`EmailAlreadyRegistered`): no error on screen. The card answers with the same `success` Check your inbox notice as a new sign-up, so the form never tells anyone which addresses have an account (account enumeration); the server emails the owner how to sign in or reset the password.
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
- Don't show the session-expired notice to someone who never signed in. A route guard that finds no session can't tell a first visit from an ended session by itself: send `reason=expired` only when the 401 came on a request that carried a credential, or when the server says the session it received has ended (an HttpOnly cookie is invisible to the page, so the server has to say it).
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
- **503 notice:** says what is down and what is not lost, never a claim the server did not check (it never read the credentials): `Sign-in is unavailable right now. What you entered is kept; retry in a few minutes.`
- **500 notice:** says what failed and what state the user is in, code last: `Sign-in failed on our side. You are still signed out. Error 500.`
- **Timeout notice:** names the unknown, never a failure: `The server did not answer in time. Your session may already be open.`
- **409 on sign-up:** never said on screen, because it tells anyone which addresses have an account. The card answers exactly as for a new address, and the email sent to the owner explains how to sign in: `Check your inbox at jane.doe@example.com to finish. If this address already has an account, the email explains how to sign in instead.`
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
- EmailAlreadyRegistered: 409 on Sign up; the same Check your inbox notice as a new address, so the screen reveals nothing.
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
- `EmailAlreadyRegistered` — 409 on Sign up (the address already has an account): the card answers exactly as for a new address, Check your inbox, so nobody can test which addresses are registered; the email to the owner explains how to sign in.
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
  import Alert from '@aziontech/webkit/alert'
  import Button, { type ButtonVariant } from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import PageHeader from '@aziontech/webkit/page-header'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { useCardHeight } from './composables/use-card-height'
  import { fillEmail, resolveSignInCopy, type SignInCopy } from './lib/sign-in-copy'
  import { type CardNotice, emailError, newPasswordError, noticeFor } from './lib/sign-in-rules'
  import EmailField from './parts/email-field.vue'
  import LastUsedTag from './parts/last-used-tag.vue'
  import PasswordField from './parts/password-field.vue'
  import SentStep from './parts/sent-step.vue'
  import SignInFooter from './parts/sign-in-footer.vue'
  import SignInFrame from './parts/sign-in-frame.vue'
  import SignInProviders from './parts/sign-in-providers.vue'
  import StepBack from './parts/step-back.vue'

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
    /** Focus the step's field when the screen mounts; turn off when the screen is embedded in a longer page. */
    autofocus?: boolean
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
    privacyHref: 'https://example.com/privacy',
    autofocus: true
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

  const { locale } = useLocale()
  const copy = computed<SignInCopy>(() => resolveSignInCopy(locale.value))

  const noticeFromProps = () => noticeFor(props.error, props.notice, copy.value)

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
  const { height: cardHeight, resizing, onTransitionend } = useCardHeight(cardContentEl)

  const heading = computed(() => {
    if (step.value === 'reset') {
      return { title: copy.value.resetTitle, description: copy.value.resetDescription }
    }
    if (step.value === 'new-password')
      return { title: copy.value.newPasswordTitle, description: '' }
    if (step.value === 'sent') {
      return {
        title: copy.value.sentTitle,
        description: fillEmail(copy.value.sentDescription, resetEmail.value)
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

  onMounted(() => {
    if (!props.autofocus) return
    if (step.value === 'email' || step.value === 'password') focusField(`login-${step.value}`)
  })

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
      label: fillEmail(copy.value.resent, resetEmail.value)
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

  const submitEmail = (event: Event) => {
    errors.email = emailError(email.value, copy.value)
    if (errors.email) focusField('login-email')
    else {
      emit('continue', event, email.value.trim())
      step.value = 'password'
      focusField('login-password')
    }
  }

  const submitReset = (event: Event) => {
    errors.resetEmail = emailError(resetEmail.value, copy.value)
    if (errors.resetEmail) focusField('reset-email')
    else {
      emit('reset-request', event, resetEmail.value.trim())
      step.value = 'sent'
    }
  }

  const submitNewPassword = (event: Event) => {
    errors.newPassword = newPasswordError(newPassword.value, copy.value)
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
  }

  const stepActions: Record<SignInStep, (event: Event) => void> = {
    email: submitEmail,
    password: signIn,
    reset: submitReset,
    'new-password': submitNewPassword,
    sent: backToSignIn
  }

  const onPrimary = (event: Event) => {
    if (verifying.value) return
    cardNotice.value = null
    stepActions[step.value](event)
  }
</script>

<template>
  <SignInFrame
    :home-href="homeHref"
    :docs-href="docsHref"
    :labels="copy"
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
            @transitionend.self="onTransitionend"
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
                <SignInProviders
                  v-if="step === 'email'"
                  :copy="copy"
                  :loading="providersLoading"
                  :last-used="lastUsed"
                  @provider-click="(event, provider) => emit('provider-click', event, provider)"
                />

                <div v-if="step === 'email'">
                  <EmailField
                    id="login-email"
                    v-model="email"
                    name="email"
                    :label="copy.email"
                    autocomplete="username"
                    :error="errors.email"
                    @update:model-value="errors.email = ''"
                  />
                </div>

                <div
                  v-else-if="step === 'password'"
                  class="flex flex-col gap-(--spacing-lg)"
                >
                  <StepBack
                    :label="copy.changeEmail"
                    :text="email"
                    username
                    @back="backToEmail"
                  />

                  <div class="flex flex-col items-start gap-(--spacing-xs)">
                    <PasswordField
                      id="login-password"
                      v-model="password"
                      class="w-full"
                      name="password"
                      :label="copy.password"
                      autocomplete="current-password"
                      :placeholder="copy.passwordPlaceholder"
                      :error="errors.password"
                      @update:model-value="errors.password = ''"
                    />

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
                  <StepBack
                    :label="copy.backToSignIn"
                    :text="copy.backToSignIn"
                    @back="backToSignIn"
                  />

                  <EmailField
                    id="reset-email"
                    v-model="resetEmail"
                    name="reset-email"
                    :label="copy.email"
                    autocomplete="email"
                    :error="errors.resetEmail"
                    @update:model-value="errors.resetEmail = ''"
                  />
                </div>

                <div
                  v-else-if="step === 'new-password'"
                  class="flex flex-col gap-(--spacing-lg)"
                >
                  <PasswordField
                    id="new-password"
                    v-model="newPassword"
                    name="new-password"
                    :label="copy.newPassword"
                    autocomplete="new-password"
                    :placeholder="copy.newPasswordPlaceholder"
                    :error="errors.newPassword"
                    show-requirements
                    @update:model-value="errors.newPassword = ''"
                  />

                  <PasswordField
                    id="confirm-password"
                    v-model="confirmPassword"
                    name="confirm-password"
                    :label="copy.confirmPassword"
                    autocomplete="new-password"
                    :placeholder="copy.confirmPasswordPlaceholder"
                    :error="errors.confirmPassword"
                    @update:model-value="errors.confirmPassword = ''"
                  />
                </div>

                <SentStep
                  v-else
                  :copy="copy"
                  @resend="resendEmail"
                  @open-reset="openResetLink"
                />
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

                <LastUsedTag
                  v-if="step === 'email' && lastUsed === 'email'"
                  :label="copy.lastUsed"
                />
              </div>
            </form>
          </div>
        </div>
      </template>
    </Card>

    <SignInFooter
      :prompt="copy.noAccount"
      :link-label="copy.signUp"
      :link-href="signUpHref"
      :show-terms="step === 'email' || step === 'password'"
      :terms="copy"
      :terms-href="termsHref"
      :privacy-href="privacyHref"
    />
  </SignInFrame>
</template>
```

## `sample.ts`

```ts
import type { AuthScope } from './parts/scope-list.vue'

export const signedInAccount = { name: 'Jane Doe', initials: 'JD', email: 'jane.doe@example.com' }

export const oauthClient = {
  name: 'Acme Deploy',
  initials: 'AD',
  publisher: 'Acme Inc.',
  site: 'deploy.example.com',
  redirect: 'https://deploy.example.com/oauth/callback'
}

export const oauthScopes: AuthScope[] = [
  {
    id: 'profile',
    icon: 'az az-user',
    title: 'Read your profile',
    description: 'Your name, email address and avatar.'
  },
  {
    id: 'workloads:read',
    icon: 'az az-globe',
    title: 'Read your workloads',
    description: 'Names, domains and status. Not their settings or secrets.'
  },
  {
    id: 'applications:deploy',
    icon: 'az az-upload',
    title: 'Deploy your applications',
    description: 'Create and publish new versions of the applications in this account.'
  }
]

export const deviceRequest = {
  code: 'WDJBMJHT',
  client: 'Acme CLI',
  device: 'build-runner-01',
  address: '203.0.113.24',
  requested: 'Nov 14, 2026, 10:42 UTC',
  expires: '15 minutes'
}

export const deviceScopes: AuthScope[] = [
  {
    id: 'workloads:read',
    icon: 'az az-globe',
    title: 'Read your workloads',
    description: 'Names, domains and status.'
  },
  {
    id: 'applications:deploy',
    icon: 'az az-upload',
    title: 'Deploy your applications',
    description: 'Create and publish new versions from the terminal.'
  }
]

export const mfaAccount = 'jane.doe@example.com'

export const mfaSetupKey = 'JBSW Y3DP EHPK 3PXP'

export const recoveryCodes = [
  'K7QM2XPA',
  'R4TD9WLN',
  'B8VJ3HQE',
  'N2CY6FMT',
  'H5LP8KRW',
  'W9EX4GDB',
  'T3NA7ZQC',
  'F6RU2MJV'
]
```

## `token-sign-in.vue`

```ts
<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { computed, nextTick, onMounted, ref, watch } from 'vue'

  import SignInFrame from './parts/sign-in-frame.vue'

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

  onMounted(focusToken)

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
</script>

<template>
  <SignInFrame
    :home-href="homeHref"
    :docs-href="docsHref"
  >
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
                  <Link
                    inline
                    :href="TOKEN_DOCS"
                    target="_blank"
                    >How to create a personal token</Link
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
      Use a token with only the permissions this app needs, and revoke it in Personal tokens when
      you are done.
    </p>
  </SignInFrame>
</template>
```

## `lib/sign-in-copy.ts`

```ts
export const SIGN_IN_COPY = {
  en: {
    console: 'Console',
    home: 'Azion home',
    documentation: 'Documentation',
    badCredentials: 'Incorrect email or password. Check both and try again.',
    serviceUnavailable:
      'Sign-in is unavailable right now. What you entered is kept; retry in a few minutes.',
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
    serviceUnavailable:
      'O login está indisponível no momento. O que você digitou foi mantido; tente de novo em alguns minutos.',
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
      'El inicio de sesión no está disponible ahora. Lo que escribiste se conserva; vuelve a intentarlo en unos minutos.',
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

export type SignInCopy = (typeof SIGN_IN_COPY)['en']

export const resolveSignInCopy = (tag: string): SignInCopy => {
  const language = tag.split('-')[0]
  return (
    SIGN_IN_COPY[tag as keyof typeof SIGN_IN_COPY] ??
    SIGN_IN_COPY[language as keyof typeof SIGN_IN_COPY] ??
    SIGN_IN_COPY.en
  )
}

export const fillEmail = (template: string, email: string) => template.replace('{email}', email)
```

## `lib/sign-in-rules.ts`

```ts
import type { AlertSeverity } from '@aziontech/webkit/alert'
import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'

import type { SignInFailure, SignInNoticeKind } from '../auth-sign-in.vue'
import type { SignInCopy } from './sign-in-copy'

/** What the card notice shows. */
export interface CardNotice {
  /** The colour of the notice. */
  severity: AlertSeverity
  /** What the notice says. */
  label: string
  /** The notice offers Retry. */
  retry?: boolean
}

type FieldCopy = Pick<SignInCopy, 'required' | 'invalidEmail' | 'weakPassword'>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emailError = (value: string, copy: FieldCopy) =>
  !value.trim() ? copy.required : EMAIL_PATTERN.test(value.trim()) ? '' : copy.invalidEmail

export const newPasswordError = (value: string, copy: FieldCopy) =>
  !value
    ? copy.required
    : DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(value))
      ? ''
      : copy.weakPassword

const failureNotices = (copy: SignInCopy): Record<SignInFailure, CardNotice> => ({
  'bad-credentials': { severity: 'danger', label: copy.badCredentials },
  'service-unavailable': { severity: 'warning', label: copy.serviceUnavailable, retry: true },
  'server-error': { severity: 'danger', label: copy.serverError, retry: true },
  timeout: { severity: 'warning', label: copy.timeout, retry: true }
})

const outcomeNotices = (copy: SignInCopy): Record<SignInNoticeKind, CardNotice> => ({
  'session-expired': { severity: 'info', label: copy.sessionExpired },
  'signed-in': { severity: 'success', label: copy.signedIn },
  'password-updated': { severity: 'success', label: copy.passwordUpdated }
})

export const noticeFor = (error: string, notice: string, copy: SignInCopy): CardNotice | null => {
  if (error) {
    return (
      failureNotices(copy)[error as SignInFailure] ?? {
        severity: 'danger',
        label: error,
        retry: true
      }
    )
  }
  if (notice) {
    return outcomeNotices(copy)[notice as SignInNoticeKind] ?? { severity: 'info', label: notice }
  }
  return null
}
```

## `composables/use-card-height.ts`

```ts
import { onMounted, onScopeDispose, readonly, type Ref, ref } from 'vue'

export interface UseCardHeightReturn {
  /** The measured height in pixels; 0 before the first measure. */
  height: Readonly<Ref<number>>
  /** The height is easing to a new value. */
  resizing: Readonly<Ref<boolean>>
  /** Ends the resize when the height transition ends. */
  onTransitionend: () => void
}

export function useCardHeight(contentEl: Ref<HTMLElement | null>): UseCardHeightReturn {
  const height = ref(0)
  const resizing = ref(false)
  let resizeObserver: ResizeObserver | null = null

  const onResize = ([entry]: ResizeObserverEntry[]) => {
    const next = Math.round(entry.contentRect.height)
    if (height.value && next !== height.value) resizing.value = true
    height.value = next
  }

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined' || !contentEl.value) return
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(contentEl.value)
  })

  onScopeDispose(() => {
    resizeObserver?.disconnect()
  })

  const onTransitionend = () => {
    resizing.value = false
  }

  return { height: readonly(height), resizing: readonly(resizing), onTransitionend }
}
```

## `composables/use-code-check.ts`

```ts
import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue } from 'vue'

export interface CodeCheckMessages {
  /** The message when nothing was entered. */
  empty: string
  /** The message when the code is shorter than its length. */
  short: string
  /** The message when the server rejects the code. */
  rejected: string
}

export interface UseCodeCheckOptions {
  /** The code the person types, bound to the input. */
  code: Ref<string>
  /** How many characters a full code has. */
  length: MaybeRefOrGetter<number>
  /** The messages of the field. */
  messages: MaybeRefOrGetter<CodeCheckMessages>
  /** Moves focus back to the code input. */
  focus: () => void
  /** Runs when the server accepts the code. */
  onAccepted: (code: string) => void
  /** True while another request of the screen is in flight: the check does not start. */
  blocked?: () => boolean
}

export interface UseCodeCheckReturn {
  /** The validation or rejection message; empty shows none. */
  error: Readonly<Ref<string>>
  /** The code is being checked. */
  checking: Readonly<Ref<boolean>>
  /** The check could not reach the server. */
  unreachable: Readonly<Ref<boolean>>
  /** Checks the code: all zeros is rejected and all nines cannot be reached, as a sample server. */
  check: () => void
  /** Clears the message, as the person types. */
  clearError: () => void
  /** Clears the code, the message and the unreachable notice. */
  reset: () => void
}

export function useCodeCheck(options: UseCodeCheckOptions): UseCodeCheckReturn {
  const { code, focus, onAccepted, blocked = () => false } = options
  const error = ref('')
  const checking = ref(false)
  const unreachable = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(timer))

  const answer = (rejected: string) => {
    checking.value = false
    if (/^0+$/.test(code.value)) {
      error.value = rejected
      code.value = ''
      focus()
      return
    }
    if (/^9+$/.test(code.value)) {
      unreachable.value = true
      return
    }
    onAccepted(code.value)
  }

  const check = () => {
    if (checking.value || blocked()) return
    unreachable.value = false
    const messages = toValue(options.messages)
    if (code.value.length < toValue(options.length)) {
      error.value = code.value ? messages.short : messages.empty
      focus()
      return
    }
    error.value = ''
    checking.value = true
    timer = setTimeout(() => answer(messages.rejected), 600)
  }

  const clearError = () => {
    error.value = ''
  }

  const reset = () => {
    code.value = ''
    error.value = ''
    unreachable.value = false
  }

  return {
    error: readonly(error),
    checking: readonly(checking),
    unreachable: readonly(unreachable),
    check,
    clearError,
    reset
  }
}
```

## `parts/sign-in-frame.vue`

```ts
<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'

  export interface SignInFrameProps {
    /** Where the product mark leads. */
    homeHref?: string
    /** Where the Documentation button leads. */
    docsHref?: string
    /** The words of the signed-out bar in the app's language. */
    labels?: { console: string; home: string; documentation: string }
  }

  withDefaults(defineProps<SignInFrameProps>(), {
    homeHref: '/home',
    docsHref: '/docs',
    labels: () => ({ console: 'Console', home: 'Azion home', documentation: 'Documentation' })
  })

  defineSlots<{
    /** The card and what sits under it, in the centred column. */
    default(): unknown
  }>()

  const FORM_COLUMN_CLASS =
    'm-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance ' +
    'starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none'
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      :aria-label="labels.console"
      class="shrink-0"
    >
      <AppHeader.Brand
        :href="homeHref"
        :aria-label="labels.home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          :label="labels.documentation"
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
            <slot />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
```

## `parts/auth-card.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'

  defineSlots<{
    /** What the card holds, padding included. */
    default(): unknown
  }>()
</script>

<template>
  <div class="flex w-full flex-col items-center">
    <Card
      class="w-full max-w-(--container-sm)"
      :padded="false"
    >
      <template #default>
        <slot />
      </template>
    </Card>
  </div>
</template>
```

## `parts/email-field.vue`

```ts
<script setup lang="ts">
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'

  export interface EmailFieldProps {
    /** The id of the input, also the stem of its error id. */
    id: string
    /** The form name of the input. */
    name: string
    /** The field label. */
    label: string
    /** The autocomplete hint. */
    autocomplete: string
    /** The validation message; empty shows none. */
    error?: string
  }

  withDefaults(defineProps<EmailFieldProps>(), { error: '' })

  const email = defineModel<string>({ default: '' })
</script>

<template>
  <Field
    required
    :invalid="!!error"
  >
    <Field.Label :for="id">{{ label }}</Field.Label>
    <Input
      :id="id"
      v-model="email"
      type="email"
      :name="name"
      size="large"
      :autocomplete="autocomplete"
      class="w-full"
      placeholder="m@example.com"
      required
      :invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
    />
    <FieldError
      v-if="error"
      :id="`${id}-error`"
      >{{ error }}</FieldError
    >
  </Field>
</template>
```

## `parts/password-field.vue`

```ts
<script setup lang="ts">
  import Field from '@aziontech/webkit/field'
  import PasswordInput, { type PasswordInputAutocomplete } from '@aziontech/webkit/password-input'
  import PasswordRequirements from '@aziontech/webkit/password-requirements-root'

  export interface PasswordFieldProps {
    /** The id of the input. */
    id: string
    /** The form name of the input. */
    name: string
    /** The field label. */
    label: string
    /** The autocomplete hint. */
    autocomplete: PasswordInputAutocomplete
    /** The input placeholder. */
    placeholder: string
    /** The validation message; empty shows none. */
    error?: string
    /** Lists the password requirements under the input. */
    showRequirements?: boolean
  }

  withDefaults(defineProps<PasswordFieldProps>(), { error: '', showRequirements: false })

  const password = defineModel<string>({ default: '' })
</script>

<template>
  <Field
    required
    :invalid="!!error"
  >
    <Field.Label :for="id">{{ label }}</Field.Label>
    <PasswordInput
      :id="id"
      v-model="password"
      :name="name"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
    />
    <Field.Error v-if="error">{{ error }}</Field.Error>
    <PasswordRequirements
      v-if="showRequirements"
      :value="password"
    />
  </Field>
</template>
```

## `parts/last-used-tag.vue`

```ts
<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'

  export interface LastUsedTagProps {
    /** What the tag says. */
    label: string
  }

  defineProps<LastUsedTagProps>()
</script>

<template>
  <div class="absolute end-(--spacing-sm) top-0 -translate-y-1/2">
    <Tag
      :label="label"
      severity="info"
      size="small"
    />
  </div>
</template>
```

## `parts/sign-in-providers.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Separator from '@aziontech/webkit/separator'
  import Skeleton from '@aziontech/webkit/skeleton'

  import type { SignInMethod, SignInProvider } from '../auth-sign-in.vue'
  import type { SignInCopy } from '../lib/sign-in-copy'
  import LastUsedTag from './last-used-tag.vue'

  export interface SignInProvidersProps {
    /** The card copy in the app's language. */
    copy: SignInCopy
    /** Skeleton bars hold the place of the providers. */
    loading?: boolean
    /** The method that carries the Last used tag. */
    lastUsed?: SignInMethod | ''
  }

  withDefaults(defineProps<SignInProvidersProps>(), { loading: false, lastUsed: '' })

  const emit = defineEmits<{
    'provider-click': [event: MouseEvent, provider: SignInProvider]
  }>()

  const providers: { id: SignInProvider; icon: string; label: keyof SignInCopy }[] = [
    { id: 'google', icon: 'az-color az-google', label: 'continueWithGoogle' },
    { id: 'github', icon: 'az az-github', label: 'continueWithGithub' }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg) pb-(--spacing-lg)">
    <div
      v-if="loading"
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
      <div
        v-for="provider in providers"
        :key="provider.id"
        class="relative"
      >
        <Button
          type="button"
          :label="copy[provider.label]"
          variant="outline"
          size="large"
          :icon="provider.icon"
          class="w-full"
          @click="(event: MouseEvent) => emit('provider-click', event, provider.id)"
        />
        <LastUsedTag
          v-if="lastUsed === provider.id"
          :label="copy.lastUsed"
        />
      </div>
    </div>

    <Separator :label="copy.or" />
  </div>
</template>
```

## `parts/step-back.vue`

```ts
<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tooltip from '@aziontech/webkit/tooltip'

  export interface StepBackProps {
    /** The name of the back control, also its tooltip. */
    label: string
    /** The text beside the control. */
    text: string
    /** The text is the account email: keep it in the form as the username password managers pair. */
    username?: boolean
  }

  withDefaults(defineProps<StepBackProps>(), { username: false })

  const emit = defineEmits<{
    back: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex items-center gap-(--spacing-sm)">
    <Tooltip :content="label">
      <IconButton
        icon="az az-chevron-left"
        :aria-label="label"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('back', event)"
      />
    </Tooltip>
    <span class="truncate text-label-sm text-(--text-default)">{{ text }}</span>
    <div
      v-if="username"
      class="sr-only"
      aria-hidden="true"
    >
      <Input
        type="email"
        name="email"
        autocomplete="username"
        :model-value="text"
        readonly
        tabindex="-1"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
```

## `parts/sent-step.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import type { SignInCopy } from '../lib/sign-in-copy'

  export interface SentStepProps {
    /** The card copy in the app's language. */
    copy: SignInCopy
  }

  defineProps<SentStepProps>()

  const emit = defineEmits<{
    resend: [event: MouseEvent]
    'open-reset': [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xs)">
    <div class="flex items-center gap-(--spacing-xs)">
      <p class="text-body-sm text-(--text-default)">
        {{ copy.didNotReceive }}
      </p>
      <Button
        type="button"
        :label="copy.resendEmail"
        variant="link"
        @click="(event: MouseEvent) => emit('resend', event)"
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
        @click="(event: MouseEvent) => emit('open-reset', event)"
      />
    </div>
  </div>
</template>
```

## `parts/sign-in-footer.vue`

```ts
<script setup lang="ts">
  import Link from '@aziontech/webkit/link'

  export interface SignInFooterProps {
    /** The question before the link. */
    prompt: string
    /** The text of the link. */
    linkLabel: string
    /** Where the link leads. */
    linkHref: string
    /** Shows the terms line. */
    showTerms?: boolean
    /** The words of the terms line. */
    terms?: { agreeStart: string; terms: string; and: string; privacy: string }
    /** The terms of service page. */
    termsHref?: string
    /** The privacy policy page. */
    privacyHref?: string
  }

  withDefaults(defineProps<SignInFooterProps>(), {
    showTerms: true,
    terms: () => ({
      agreeStart: 'By continuing, I agree to the',
      terms: 'terms of service',
      and: 'and',
      privacy: 'privacy policy'
    }),
    termsHref: 'https://example.com/terms',
    privacyHref: 'https://example.com/privacy'
  })
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)">
    <div class="flex items-center justify-center gap-(--spacing-xs)">
      <p class="text-body-xs text-(--text-default)">{{ prompt }}</p>
      <span class="text-body-xs">
        <Link
          inline
          :href="linkHref"
          >{{ linkLabel }}</Link
        >
      </span>
    </div>

    <p
      v-if="showTerms"
      class="text-center text-body-xs text-(--text-muted)"
    >
      {{ terms.agreeStart }}
      <Link
        inline
        :href="termsHref"
        target="_blank"
        >{{ terms.terms }}</Link
      >
      {{ terms.and }}
      <Link
        inline
        :href="privacyHref"
        target="_blank"
        >{{ terms.privacy }}</Link
      >.
    </p>
  </div>
</template>
```

## `parts/signed-in-as.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Item from '@aziontech/webkit/item'

  export interface SignedInAsProps {
    /** The account that is signed in. */
    account: { name: string; initials: string; email: string }
    /** Switch account is not available, while an answer is in flight or after it. */
    disabled?: boolean
  }

  withDefaults(defineProps<SignedInAsProps>(), { disabled: false })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xs)">
    <h2 class="text-label-md text-(--text-muted)">Signed in as</h2>
    <Item
      variant="outline"
      size="small"
    >
      <Item.Media>
        <Avatar
          :label="account.initials"
          size="medium"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title class="max-w-full">
          <span
            class="min-w-0 truncate"
            :title="account.name"
            >{{ account.name }}</span
          >
        </Item.Title>
        <Item.Description>
          <span
            class="block truncate"
            :title="account.email"
            >{{ account.email }}</span
          >
        </Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button
          label="Switch account"
          variant="outline"
          size="small"
          href="/login?prompt=select_account"
          :disabled="disabled"
        />
      </Item.Actions>
    </Item>
  </div>
</template>
```

## `parts/scope-list.vue`

```ts
<script setup lang="ts">
  import Item from '@aziontech/webkit/item'

  /** One permission the app asks for. */
  export interface AuthScope {
    /** The scope id. */
    id: string
    /** The icon class of the scope. */
    icon: string
    /** What the scope allows. */
    title: string
    /** The detail of what the scope allows. */
    description: string
  }

  export interface ScopeListProps {
    /** The id of the list heading. */
    headingId: string
    /** The name of the app that asks. */
    client: string
    /** The permissions the app asks for. */
    scopes: AuthScope[]
  }

  defineProps<ScopeListProps>()
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xs)">
    <h2
      :id="headingId"
      class="text-label-md text-(--text-muted)"
    >
      {{ client }} will be able to
    </h2>
    <Item.List :aria-labelledby="headingId">
      <Item
        v-for="scope in scopes"
        :key="scope.id"
        size="small"
        role="listitem"
      >
        <Item.Media type="icon">
          <i
            :class="scope.icon"
            aria-hidden="true"
          />
        </Item.Media>
        <Item.Content>
          <Item.Title>{{ scope.title }}</Item.Title>
          <Item.Description>{{ scope.description }}</Item.Description>
        </Item.Content>
      </Item>
    </Item.List>
  </div>
</template>
```

## `parts/sign-up-card.vue`

```ts
<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import PageHeader from '@aziontech/webkit/page-header'
  import Separator from '@aziontech/webkit/separator'
  import { nextTick, onScopeDispose, reactive, ref } from 'vue'

  import type { SignInProvider } from '../auth-sign-in.vue'
  import { SIGN_IN_COPY } from '../lib/sign-in-copy'
  import { emailError, newPasswordError } from '../lib/sign-in-rules'
  import EmailField from './email-field.vue'
  import PasswordField from './password-field.vue'

  /** A sign-up the server refused; the card answers it like a new address. */
  export type SignUpFailure = 'email-taken'

  export interface SignUpCardProps {
    /** The email the form opens on, such as the address a failed sign-up kept. */
    defaultEmail?: string
    /** The address is already registered: the card answers exactly as for a new one, so nobody can test which addresses have an account. */
    error?: SignUpFailure | ''
  }

  interface SignUpNotice {
    severity: AlertSeverity
    label: string
  }

  const props = withDefaults(defineProps<SignUpCardProps>(), {
    defaultEmail: '',
    error: ''
  })

  const emit = defineEmits<{
    'provider-click': [event: MouseEvent, provider: SignInProvider]
  }>()

  const email = ref(props.defaultEmail)
  const password = ref('')
  const errors = reactive({ email: '', password: '' })
  const sentNotice = (address: string): SignUpNotice => ({
    severity: 'success',
    label:
      `Check your inbox at ${address} to finish. ` +
      'If this address already has an account, the email explains how to sign in instead.'
  })

  const cardNotice = ref<SignUpNotice | null>(
    props.error === 'email-taken' ? sentNotice(props.defaultEmail) : null
  )
  const verifying = ref(false)
  let requestTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(requestTimer))

  const onEmailInput = () => {
    errors.email = ''
    cardNotice.value = null
  }

  const answer = () => {
    verifying.value = false
    cardNotice.value = sentNotice(email.value.trim())
  }

  const signUp = () => {
    if (verifying.value) return
    errors.email = emailError(email.value, SIGN_IN_COPY.en)
    errors.password = newPasswordError(password.value, SIGN_IN_COPY.en)
    cardNotice.value = null
    if (errors.email || errors.password) {
      const id = errors.email ? 'signup-email' : 'signup-password'
      nextTick(() => document.getElementById(id)?.focus())
      return
    }
    verifying.value = true
    clearTimeout(requestTimer)
    requestTimer = setTimeout(answer, 600)
  }

  const providers: { id: SignInProvider; label: string; icon: string }[] = [
    { id: 'google', label: 'Continue with Google', icon: 'az-color az-google' },
    { id: 'github', label: 'Continue with GitHub', icon: 'az az-github' }
  ]
</script>

<template>
  <Card
    class="w-full max-w-(--container-sm)"
    :padded="false"
  >
    <template #default>
      <form
        class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
        aria-label="Sign up for a free account"
        :aria-busy="verifying || undefined"
        novalidate
        @submit.prevent="signUp"
      >
        <PageHeader
          title="Sign up for a free account"
          size="small"
        />

        <Alert
          v-if="cardNotice"
          :key="cardNotice.label"
          :severity="cardNotice.severity"
          size="small"
        >
          {{ cardNotice.label }}
        </Alert>

        <div class="flex flex-col gap-(--spacing-sm)">
          <Button
            v-for="provider in providers"
            :key="provider.id"
            type="button"
            :label="provider.label"
            variant="outline"
            size="large"
            :icon="provider.icon"
            class="w-full"
            :disabled="verifying"
            @click="(event: MouseEvent) => emit('provider-click', event, provider.id)"
          />
        </div>

        <Separator label="or" />

        <fieldset
          class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
          :disabled="verifying"
        >
          <legend class="sr-only">Account credentials</legend>

          <EmailField
            id="signup-email"
            v-model="email"
            name="email"
            label="Work email"
            autocomplete="email"
            :error="errors.email"
            @update:model-value="onEmailInput"
          />

          <PasswordField
            id="signup-password"
            v-model="password"
            name="password"
            label="Password"
            autocomplete="new-password"
            placeholder="Create a password"
            :error="errors.password"
            show-requirements
            @update:model-value="errors.password = ''"
          />
        </fieldset>

        <Button
          label="Sign up"
          variant="primary"
          size="large"
          class="w-full"
          type="submit"
          :loading="verifying"
        />
      </form>
    </template>
  </Card>
</template>
```

## `parts/mfa-code-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, nextTick, onMounted, ref } from 'vue'

  import { useCodeCheck } from '../composables/use-code-check'
  import { mfaAccount as account } from '../sample'
  import AuthCard from './auth-card.vue'

  const recovery = ref(false)
  const code = ref('')
  const signedIn = ref(false)

  const codeField = computed(() =>
    recovery.value
      ? {
          label: 'Recovery code',
          length: 8,
          description:
            'One of the 8-character codes you saved when you set up multi-factor authentication. Each works once.',
          empty: 'Enter one of your recovery codes.',
          short: 'Enter all 8 characters of the recovery code.',
          rejected: 'That recovery code is not valid or was already used. Try another one.'
        }
      : {
          label: 'Authentication code',
          length: 6,
          description: `The 6-digit code your authenticator app shows for ${account}.`,
          empty: 'Enter the 6-digit code from the app.',
          short: 'Enter all 6 digits of the code.',
          rejected:
            'That code is not valid. Enter the current code; the app changes it every 30 seconds.'
        }
  )

  const focusCode = () => nextTick(() => document.getElementById('mfa-code')?.focus())
  onMounted(focusCode)

  const codeCheck = useCodeCheck({
    code,
    length: () => codeField.value.length,
    messages: codeField,
    focus: focusCode,
    onAccepted: () => {
      signedIn.value = true
    }
  })
  const { error: codeError, checking: verifying, unreachable, check: verify } = codeCheck

  const switchMethod = () => {
    recovery.value = !recovery.value
    codeCheck.reset()
    focusCode()
  }
</script>

<template>
  <AuthCard>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
      <PageHeader
        title="Verify it's you"
        :description="
          recovery
            ? 'Enter a recovery code to sign in without your authenticator app.'
            : 'Open your authenticator app and enter the code it shows.'
        "
      />

      <Alert
        key="alert-1"
        v-if="signedIn"
        severity="success"
        size="small"
        label="Signed in."
      />
      <Alert
        key="alert-2"
        v-else-if="unreachable"
        severity="warning"
        size="small"
      >
        We could not check the code. Your entry is kept; try again in a moment.
        <template #actions>
          <Button
            label="Retry"
            variant="secondary"
            size="small"
            :loading="verifying"
            @click="verify"
          />
        </template>
      </Alert>

      <form
        class="flex flex-col gap-(--spacing-lg)"
        novalidate
        @submit.prevent="verify"
      >
        <Field :invalid="!!codeError">
          <Field.Label for="mfa-code">{{ codeField.label }}</Field.Label>
          <OtpInput
            id="mfa-code"
            :key="recovery ? 'recovery' : 'app'"
            v-model="code"
            name="code"
            :length="codeField.length"
            :mode="recovery ? 'alphanumeric' : 'numeric'"
            :group="recovery ? 4 : 0"
            :disabled="verifying || signedIn"
            @update:model-value="codeCheck.clearError"
            @complete="verify"
          />
          <Field.Description>{{ codeError || codeField.description }}</Field.Description>
        </Field>

        <Button
          type="submit"
          label="Verify"
          variant="primary"
          size="large"
          class="w-full"
          :loading="verifying"
          :disabled="signedIn"
        />
      </form>

      <div class="flex flex-col items-start gap-(--spacing-xs)">
        <Button
          type="button"
          :label="recovery ? 'Use your authenticator app' : 'Use a recovery code'"
          variant="link"
          @click="switchMethod"
        />
        <span class="text-body-sm">
          <Link
            inline
            href="/login"
            >Sign in with another account</Link
          >
        </span>
      </div>
    </div>
  </AuthCard>
</template>
```

## `parts/mfa-setup-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import QrCode from '@aziontech/webkit/qr-code'
  import { computed, nextTick, onMounted, ref } from 'vue'

  import { useCodeCheck } from '../composables/use-code-check'
  import { mfaAccount as account, mfaSetupKey as setupKey, recoveryCodes } from '../sample'
  import AuthCard from './auth-card.vue'

  const otpauthUri = `otpauth://totp/Azion:${encodeURIComponent(account)}?secret=${setupKey.replaceAll(' ', '')}&issuer=Azion`

  const recoveryText = recoveryCodes.join('\n')
  const codesSaved = ref(false)
  const continueHint = computed(() =>
    codesSaved.value ? '' : 'Confirm that you saved the recovery codes to continue.'
  )

  const downloadCodes = () => {
    const url = URL.createObjectURL(new Blob([`${recoveryText}\n`], { type: 'text/plain' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'azion-recovery-codes.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const code = ref('')
  const enabled = ref(false)

  const focusCode = () => nextTick(() => document.getElementById('mfa-setup-code')?.focus())

  onMounted(() => {
    if (window.matchMedia('(pointer: fine)').matches) focusCode()
  })

  const codeCheck = useCodeCheck({
    code,
    length: 6,
    messages: {
      empty: 'Enter the 6-digit code from the app.',
      short: 'Enter all 6 digits of the code.',
      rejected:
        'That code is not valid. Enter the current code; the app changes it every 30 seconds.'
    },
    focus: focusCode,
    onAccepted: () => {
      enabled.value = true
    }
  })
  const { error: codeError, checking: verifying, unreachable, check: verify } = codeCheck

  const SETUP_KEY_CLASS =
    'flex items-center justify-between gap-(--spacing-sm) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) ps-(--spacing-sm) pe-(--spacing-2xs) ' +
    'py-(--spacing-2xs)'
</script>

<template>
  <AuthCard>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
      <PageHeader
        title="Set up multi-factor authentication"
        description="Add a second step to sign in: a code from an authenticator app on your phone."
      />

      <Alert
        key="alert-1"
        v-if="enabled"
        severity="success"
        size="small"
        label="Multi-factor authentication is on. Save your recovery codes before you continue."
      />
      <Alert
        key="alert-2"
        v-else-if="unreachable"
        severity="warning"
        size="small"
      >
        We could not check the code, and multi-factor authentication is still off. Try again in a
        moment.
        <template #actions>
          <Button
            label="Retry"
            variant="secondary"
            size="small"
            :loading="verifying"
            @click="verify"
          />
        </template>
      </Alert>

      <template v-if="!enabled">
        <ol
          class="flex list-decimal flex-col gap-(--spacing-xs) ps-(--spacing-lg) text-body-sm text-(--text-default)"
        >
          <li>Install an authenticator app, such as Google Authenticator, on your phone.</li>
          <li>In the app, add an account and choose to scan a QR code.</li>
          <li>
            Scan this code, or open it in the app on this phone, then enter the 6-digit code the app
            shows.
          </li>
        </ol>

        <div class="flex flex-col items-center gap-(--spacing-sm)">
          <QrCode
            :value="otpauthUri"
            :aria-label="`QR code to add ${account} to an authenticator app`"
          />
          <a
            :href="otpauthUri"
            class="text-link inline-flex min-h-10 items-center text-body-sm"
            >Open in authenticator app</a
          >
        </div>

        <div class="flex flex-col gap-(--spacing-2xs)">
          <p class="text-label-sm text-(--text-default)">Can't scan the code?</p>
          <p class="text-body-sm text-(--text-muted)">Enter this setup key in the app instead.</p>
          <div :class="SETUP_KEY_CLASS">
            <code
              class="text-label-code-sm text-(--text-default)"
              dir="ltr"
              >{{ setupKey }}</code
            >
            <CopyButton
              :value="setupKey.replaceAll(' ', '')"
              aria-label="Copy setup key"
              copied-label="Setup key copied"
              size="small"
            />
          </div>
        </div>

        <form
          class="flex flex-col gap-(--spacing-lg)"
          aria-label="Verify the authenticator app"
          novalidate
          @submit.prevent="verify"
        >
          <Field :invalid="!!codeError">
            <Field.Label for="mfa-setup-code">Authentication code</Field.Label>
            <OtpInput
              id="mfa-setup-code"
              v-model="code"
              name="code"
              :disabled="verifying"
              @update:model-value="codeCheck.clearError"
              @complete="verify"
            />
            <Field.Description>{{
              codeError || 'The 6-digit code from the app, after you scan.'
            }}</Field.Description>
          </Field>

          <Button
            type="submit"
            label="Verify code"
            variant="primary"
            size="large"
            class="w-full"
            :loading="verifying"
          />
        </form>
      </template>

      <template v-else>
        <section
          class="flex flex-col gap-(--spacing-sm)"
          aria-labelledby="mfa-setup-recovery-title"
        >
          <div class="flex flex-col gap-(--spacing-2xs)">
            <h2
              id="mfa-setup-recovery-title"
              class="text-label-md text-(--text-default)"
            >
              Save your recovery codes
            </h2>
            <p class="text-body-sm text-(--text-muted)">
              If you lose your phone, sign in with one of these codes. Each code works once. Keep
              them somewhere safe, such as a password manager; they are not shown again.
            </p>
          </div>
          <ul
            class="grid grid-cols-2 gap-x-(--spacing-md) gap-y-(--spacing-2xs) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm)"
            aria-label="Recovery codes"
          >
            <li
              v-for="recoveryCode in recoveryCodes"
              :key="recoveryCode"
              class="text-label-code-sm text-(--text-default)"
              dir="ltr"
            >
              <code>{{ recoveryCode }}</code>
            </li>
          </ul>
          <div class="flex flex-wrap items-center gap-(--spacing-xs)">
            <Button
              label="Download"
              variant="outline"
              size="medium"
              icon="az az-download"
              @click="downloadCodes"
            />
            <CopyButton
              :value="recoveryText"
              aria-label="Copy recovery codes"
              copied-label="Recovery codes copied"
              variant="outline"
              size="medium"
            />
          </div>
        </section>

        <Field orientation="horizontal">
          <Checkbox
            id="mfa-setup-codes-saved"
            v-model="codesSaved"
            name="codesSaved"
          />
          <Field.Content>
            <Field.Label for="mfa-setup-codes-saved">I saved these codes</Field.Label>
          </Field.Content>
        </Field>

        <div class="flex flex-col gap-(--spacing-2xs)">
          <Button
            label="Continue to Console"
            variant="primary"
            size="large"
            class="w-full"
            :disabled="!codesSaved"
            :href="codesSaved ? '/home' : ''"
            aria-describedby="mfa-setup-continue-hint"
          />
          <p
            id="mfa-setup-continue-hint"
            class="text-body-sm text-(--text-muted)"
          >
            {{ continueHint }}
          </p>
        </div>
      </template>
    </div>
  </AuthCard>
</template>
```

## `parts/oauth-consent-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, onScopeDispose, ref } from 'vue'

  import { oauthClient as client, oauthScopes as scopes, signedInAccount } from '../sample'
  import AuthCard from './auth-card.vue'
  import ScopeList from './scope-list.vue'
  import SignedInAs from './signed-in-as.vue'

  const pending = ref<'' | 'allow' | 'deny'>('')
  const outcome = ref<'' | 'allowed' | 'denied'>('')
  let timer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(timer))

  const settled = computed(() => !!outcome.value)

  const respond = (answer: 'allow' | 'deny') => {
    if (pending.value || settled.value) return
    pending.value = answer
    timer = setTimeout(() => {
      pending.value = ''
      outcome.value = answer === 'allow' ? 'allowed' : 'denied'
    }, 600)
  }
</script>

<template>
  <AuthCard>
    <section
      class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
      aria-labelledby="oauth-consent-title"
    >
      <div class="flex flex-col items-start gap-(--spacing-md)">
        <Avatar
          variant="square"
          size="large"
          :label="client.initials"
          :alt="client.name"
        />
        <PageHeader
          class="w-full"
          title-id="oauth-consent-title"
          :title="`Authorize ${client.name}`"
          :description="`${client.name} by ${client.publisher} (${client.site}) wants to access your account.`"
        />
      </div>

      <Alert
        key="alert-1"
        v-if="outcome === 'allowed'"
        severity="success"
        size="small"
        :label="`Access granted. Returning to ${client.name}.`"
      />
      <Alert
        key="alert-2"
        v-else-if="outcome === 'denied'"
        severity="info"
        size="small"
        :label="`Access denied. Returning to ${client.name} with no access to your account.`"
      />

      <SignedInAs
        :account="signedInAccount"
        :disabled="!!pending || settled"
      />

      <ScopeList
        heading-id="oauth-consent-scopes"
        :client="client.name"
        :scopes="scopes"
      />

      <p class="text-body-sm text-(--text-muted)">
        Allowing sends you back to
        <span class="text-body-code-sm break-words text-(--text-default)">{{
          client.redirect
        }}</span
        >. You can revoke access at any time in
        <Link
          inline
          href="/account/authorized-apps"
          >Authorized apps</Link
        >.
      </p>

      <div class="grid grid-cols-2 gap-(--spacing-sm)">
        <Button
          label="Deny"
          variant="secondary"
          size="large"
          class="w-full"
          :loading="pending === 'deny'"
          :disabled="pending === 'allow' || settled"
          @click="respond('deny')"
        />
        <Button
          label="Allow"
          variant="primary"
          size="large"
          class="w-full"
          :loading="pending === 'allow'"
          :disabled="pending === 'deny' || settled"
          @click="respond('allow')"
        />
      </div>
    </section>
  </AuthCard>
</template>
```

## `parts/device-authorization-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, nextTick, onScopeDispose, ref } from 'vue'

  import { useCodeCheck } from '../composables/use-code-check'
  import { deviceRequest as request, deviceScopes as scopes, signedInAccount } from '../sample'
  import AuthCard from './auth-card.vue'
  import ScopeList from './scope-list.vue'
  import SignedInAs from './signed-in-as.vue'

  const CODE_BOX_CLASS =
    'flex flex-col items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-md)'

  const entering = ref(false)
  const code = ref('')
  const shownCode = ref(request.code)
  const pending = ref<'' | 'confirm' | 'cancel'>('')
  const outcome = ref<'' | 'connected' | 'cancelled'>('')
  let timer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(timer))

  const settled = computed(() => !!outcome.value)
  const grouped = computed(() => `${shownCode.value.slice(0, 4)}-${shownCode.value.slice(4)}`)

  const focusCode = () => nextTick(() => document.getElementById('device-code')?.focus())

  const codeCheck = useCodeCheck({
    code,
    length: 8,
    messages: {
      empty: 'Enter the code your terminal shows.',
      short: 'Enter all 8 characters of the code.',
      rejected:
        'That code is not valid or has expired. Check your terminal, or start the sign-in again there.'
    },
    focus: focusCode,
    blocked: () => !!pending.value,
    onAccepted: (accepted) => {
      shownCode.value = accepted
      entering.value = false
    }
  })
  const { error: codeError, checking, unreachable, check } = codeCheck

  const enterCode = () => {
    entering.value = true
    codeCheck.reset()
    focusCode()
  }

  const respond = (answer: 'confirm' | 'cancel') => {
    if (pending.value || checking.value || settled.value) return
    pending.value = answer
    timer = setTimeout(() => {
      pending.value = ''
      outcome.value = answer === 'confirm' ? 'connected' : 'cancelled'
    }, 600)
  }
</script>

<template>
  <AuthCard>
    <section
      class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
      aria-labelledby="device-authorization-title"
    >
      <PageHeader
        title-id="device-authorization-title"
        :title="`Connect ${request.client}`"
        :description="
          entering
            ? 'Enter the code your terminal shows to connect it to your account.'
            : 'Check that this code matches the one in your terminal, then confirm.'
        "
      />

      <Alert
        key="alert-1"
        v-if="outcome === 'connected'"
        severity="success"
        size="small"
        label="Device connected. Go back to your terminal; you can close this tab."
      />
      <Alert
        key="alert-2"
        v-else-if="outcome === 'cancelled'"
        severity="info"
        size="small"
        label="Request cancelled. The device was not connected."
      />
      <Alert
        key="alert-3"
        v-else-if="unreachable"
        severity="warning"
        size="small"
      >
        We could not check the code. Your entry is kept; try again in a moment.
        <template #actions>
          <Button
            label="Retry"
            variant="secondary"
            size="small"
            :loading="checking"
            @click="check"
          />
        </template>
      </Alert>

      <form
        v-if="entering"
        class="flex flex-col gap-(--spacing-lg)"
        aria-label="Enter the device code"
        novalidate
        @submit.prevent="check"
      >
        <Field :invalid="!!codeError">
          <Field.Label for="device-code">Device code</Field.Label>
          <OtpInput
            id="device-code"
            v-model="code"
            name="code"
            :length="8"
            mode="alphanumeric"
            :group="4"
            :disabled="checking"
            @update:model-value="codeCheck.clearError"
            @complete="check"
          />
          <Field.Description>{{
            codeError || `Codes expire ${request.expires} after the terminal shows them.`
          }}</Field.Description>
        </Field>
        <Button
          type="submit"
          label="Continue"
          variant="primary"
          size="large"
          class="w-full"
          :loading="checking"
        />
      </form>

      <template v-else>
        <div :class="CODE_BOX_CLASS">
          <span class="text-label-sm text-(--text-muted)">Device code</span>
          <span class="text-label-code-lg text-(--text-default)">{{ grouped }}</span>
        </div>

        <KeyValueList
          variant="split"
          aria-label="Request details"
        >
          <KeyValueList.Item label="Application">{{ request.client }}</KeyValueList.Item>
          <KeyValueList.Item label="Device">{{ request.device }}</KeyValueList.Item>
          <KeyValueList.Item label="IP address">{{ request.address }}</KeyValueList.Item>
          <KeyValueList.Item label="Requested">{{ request.requested }}</KeyValueList.Item>
        </KeyValueList>

        <SignedInAs
          :account="signedInAccount"
          :disabled="!!pending || settled"
        />

        <ScopeList
          heading-id="device-authorization-scopes"
          :client="request.client"
          :scopes="scopes"
        />

        <div class="grid grid-cols-2 gap-(--spacing-sm)">
          <Button
            label="Cancel"
            variant="secondary"
            size="large"
            class="w-full"
            :loading="pending === 'cancel'"
            :disabled="pending === 'confirm' || settled"
            @click="respond('cancel')"
          />
          <Button
            label="Confirm"
            variant="primary"
            size="large"
            class="w-full"
            :loading="pending === 'confirm'"
            :disabled="pending === 'cancel' || settled"
            @click="respond('confirm')"
          />
        </div>

        <Button
          v-if="!settled"
          variant="link"
          label="The code does not match? Enter the code from your terminal"
          class="self-start"
          @click="enterCode"
        />
      </template>
    </section>
  </AuthCard>
</template>
```
