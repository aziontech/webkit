# Auth

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

### A. Signed-out bar — `AppHeader` (required)

The bar above the card, labelled `aria-label="Console"`. Brand on the start side, one Documentation button on the end side, the middle empty. It is the same bar on every step so the user knows they are still in the same flow. Shared anatomy with `top-bar/auth-bar`.

### B. Product mark — `Brand` (required)

`variant="default"`, `size="small"`, inside a link to the home route with `aria-label="Azion home"`. The link owns the focus ring.

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

A `Field.Label` over each input, inside the input's `Field`: `Email`, `Password`, `New password`, `Confirm password`. Every field on these screens is required; the `Field`'s `required` turns on with the required prompt after the primary action, and the label shows the indicator then.

### H. Email — `Input` (required)

`type="email"`, `size="large"`, full width, with a `name`. Sign in uses `autocomplete="username"` so password managers pair it with the password step; the reset step uses `autocomplete="email"`; sign up uses `autocomplete="email"` too. Empty on submit takes `required`, filled but malformed takes `invalid`, and the error clears as the user types.

### I. Field message — `FieldError` (conditional)

Shows only after the primary action, under the email input, with `type="required"` when the value is empty and `type="invalid"` when it is malformed. It is client-side validation (row 1 of `skills/webkit-errors`); it never goes in the `Alert`. Linked from the input with `aria-describedby`.

### J. Step hint — `Tooltip` (password and reset steps)

Names the icon-only back control: `Change email` on the password step, `Back to sign in` on the reset step.

### K. Back control — `IconButton` (password and reset steps)

`ai ai-chevron-left`, `variant="outline"`, `size="small"`, with an `aria-label` equal to its tooltip. On the password step it sits beside the email being used, so the user can see and change which account they are signing in to; going back clears the password.

### L. Password field — `Field` (password and new-password steps)

Wraps each `PasswordInput` with its `required` / `invalid` state and a `Field.Error` that holds the error. On the new-password step it also wraps the requirements list.

### M. Password — `PasswordInput` (password and new-password steps)

`autocomplete="current-password"` on sign in, `autocomplete="new-password"` on reset and sign up. Placeholders describe the expected value (`Type your password`, `Enter a new password`, `Repeat the new password`). `Forgot your password?` is a `Button` with `variant="link"` under the sign-in password (an in-page action, so never an anchor to `#`); it carries the email into the reset step. `Resend email` and `Set a new password` on the sent step are link buttons too.

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
- Consent and device authorization: the card body is a `section` named by its `h1` (`aria-labelledby`); the scope list is an `Item.List` named by its heading (`Acme Deploy will be able to`), each scope a `listitem` with a decorative glyph; the request details are a `KeyValueList` named `Request details`.

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
- DeviceAuthorization: device or CLI sign-in. The code the terminal printed (`WDJB-MJHT`) in large mono text, the request details in a split `KeyValueList`, the account and the two scopes, Cancel / Confirm. `The code does not match? Enter the code from your terminal` swaps to an 8-character alphanumeric `OtpInput` grouped by 4: a rejected code (`00000000` in the demo) is the field's reason, cleared and focused; no answer (`99999999`) is a warning notice with Retry; an accepted code returns to the confirm step showing it. Confirm reports `success`, Cancel `info`.

## Related

- `top-bar/auth-bar` — the signed-out bar this block renders at the top.
- `account/onboarding-form` — where a new account goes after it verifies its email.
- `state/page-skeleton` — the session wire painted while an expired session signs out, before this screen.
- `state/form-validation` — the same field mechanics (required versus invalid, validate on submit) in a signed-in form, where unscoped failures do toast.
- `PasswordRequirements` — the live password checklist used on sign up and reset.
