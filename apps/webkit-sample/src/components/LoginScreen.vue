<script setup>
  // The sign-in entry — a dedicated PAGE (route /login) on the shared AuthSplit
  // composition: AuthShell's chrome, a full-bleed 50 / 50 split, this card on one
  // half and the network panel on the other. Below lg it collapses to a single
  // column and the panel stacks under the form.
  //
  // The two auth screens were drifting apart — Sign Up a split page, Sign In a lone
  // card centred on the canvas under a header it declared itself. They are one
  // moment in the product, so they share one composition, one entrance and one form
  // discipline; what is left different between them is only what they ask for.
  //
  // Sign In takes AuthSplit directly rather than through a parent route the way the
  // signup flow does: it is a single screen, so it has nothing to stay continuous
  // WITH, and its entrance is exactly right on arrival. Coming from Sign Up, whose
  // card leaves along the same axis, the pair still reads as one horizontal movement
  // between two flows.
  //
  // Fields follow Sign Up's discipline (the `/form` skill, Approach B): stacked
  // Label + field-* triads, validated on SUBMIT only — empty is the amber
  // `required` prompt, a malformed or mismatched value is the red `invalid`
  // state, and the message rides the field as its own HelperText (never a toast,
  // never a summary block). That replaces the disabled-until-non-empty primary
  // button this screen used to carry: the button is always pressable, and
  // pressing it is what says what is missing. A dead button explains nothing.
  //
  // The prototype's step machine is unchanged: 'email' collects the address,
  // 'password' collects the secret, and the recovery branch hangs off the same
  // machine — 'reset' asks which account to recover, 'sent' confirms the link
  // went out, and 'new-password' is the screen that link opens. The whole thing
  // stays in one card that eases between sizes, instead of a route change that
  // throws the user out of the form and back again.
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'
  import FieldPassword from '@aziontech/webkit/field-password'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Message from '@aziontech/webkit/message'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { startSession } from '../lib/session'
  import AuthSplit from './ui/AuthSplit.vue'

  const step = ref('email')
  const email = ref('')
  const password = ref('')
  // The reset-password step's two fields. Kept apart from `password` (the sign-in
  // secret) so walking into the branch and back never carries one into the other.
  const newPassword = ref('')
  const confirmPassword = ref('')
  // The address the reset link goes to. Seeded from `email` on the way into the
  // branch but kept separate: editing it here must not rewrite the address the
  // sign-in form is holding, so backing out lands on exactly the form left behind.
  const resetEmail = ref('')
  // Where the recovery branch returns to — whichever step the user left.
  const returnStep = ref('email')
  // Loading flag — shared by the email lookup, the sign-in submit and the reset request.
  const verifying = ref(false)
  // Resending the reset link is its own lock: it runs from the 'sent' step, where
  // the primary button is a plain navigation and must not read as loading.
  const resending = ref(false)

  // "" = valid. Populated only by the step's validate() on submit, and cleared the
  // moment the field it belongs to is edited.
  const errors = reactive({
    email: '',
    password: '',
    resetEmail: '',
    newPassword: '',
    confirmPassword: ''
  })

  const router = useRouter()
  const route = useRoute()

  // ── Arriving from an expired session ───────────────────────────────────────
  // An expiry lands here with the account it just signed out (`email`) and the
  // page it signed out OF (`redirect`) — see ../lib/session.js.
  //
  // WHY IT IS NOT A TOAST. `/forms/auth-errors` settles this: where a report goes
  // is decided by what the user can do about it. An expired session is answered by
  // the two fields on this card, so it belongs IN the card, above both of them —
  // the same placement a rejected credential gets there. A toast would dismiss
  // itself, point nowhere, and sit in the one corner nobody is looking at on a
  // screen they were just thrown onto. Its severity is `info`, not `danger`: the
  // 401's red says something is wrong with what you typed, and the 503's amber says
  // something is wrong with us. Neither is true here — a token reaching its age is
  // the system working. And it carries no action button, for the same reason the
  // 401 doesn't: the fields under it ARE the recovery.
  //
  // Driving it off the URL (rather than firing on the expiry) is what makes it
  // reload-safe: a Message is the state of the screen, so re-rendering it on a
  // reload of this URL is correct — the toast was the thing that had to fire once.
  const expiredNotice = ref(Boolean(route.query.expired))

  // The account is known, so the form opens on the step that is actually missing:
  // the password, with the address already in its chip. Asking the operator to
  // retype an email the console just used would be the console pretending not to
  // know something it does.
  //
  // Seeded in setup, not onMounted, so the card MEASURES the password step on its
  // first frame instead of easing from the email step's height on arrival.
  const expiredEmail = String(route.query.expired ? route.query.email || '' : '')
  if (expiredEmail) {
    email.value = expiredEmail
    step.value = 'password'
  }

  // Where signing in returns to: the page the session expired on, or Home. The
  // route's own query is kept (a tab, a filter, the `?ttl=` knob that armed the
  // countdown — so the scenario can be replayed) with the address that just
  // signed in overriding whatever `email` was in it. Anything that is not an
  // in-app absolute path is ignored.
  const afterSignIn = () => {
    const target = String(route.query.redirect || '')
    if (!target.startsWith('/') || target.startsWith('//')) {
      return { name: 'home', query: { email: email.value } }
    }
    const [path, search] = target.split('?')
    const query = Object.fromEntries(new URLSearchParams(search || ''))
    return { path, query: { ...query, email: email.value } }
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  // Emptiness is the discriminator between the amber `required` prompt and the red
  // `invalid` message, exactly as on Sign Up. While the scope is locked every
  // helper line is withheld: the fields carry the disabled treatment and the
  // pressed control carries :loading, and that is the whole message — nothing
  // asks the user to fix a field they cannot type in.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const emailError = (value) =>
    !value.trim()
      ? 'This field is required.'
      : emailPattern.test(value.trim())
        ? ''
        : 'Enter a valid email address.'

  // The same array FieldPassword's requirements row scores chip by chip, imported
  // from the DS rather than restated here: the row shows what is still missing and
  // this gate decides what the submit rejects, so the two cannot drift apart.
  const passwordMeetsRequirements = (value) =>
    DEFAULT_PASSWORD_REQUIREMENTS.every((rule) =>
      typeof rule.test === 'function' ? rule.test(value) : rule.test.test(value)
    )

  const validateEmailStep = () => {
    errors.email = emailError(email.value)
    return !errors.email
  }

  // The sign-in secret is checked for presence only — shape is the backend's call,
  // and an existing password is not ours to grade.
  const validatePasswordStep = () => {
    errors.password = password.value ? '' : 'This field is required.'
    return !errors.password
  }

  const validateResetStep = () => {
    errors.resetEmail = emailError(resetEmail.value)
    return !errors.resetEmail
  }

  const validateNewPasswordStep = () => {
    errors.newPassword = !newPassword.value
      ? 'This field is required.'
      : passwordMeetsRequirements(newPassword.value)
        ? ''
        : 'Password does not meet requirements.'
    errors.confirmPassword = !confirmPassword.value
      ? 'This field is required.'
      : confirmPassword.value === newPassword.value
        ? ''
        : "Passwords don't match."
    return !errors.newPassword && !errors.confirmPassword
  }

  // The card's header follows the step. 'email' and 'password' share one key so
  // signing in reads as one screen with a changing field — only the move into the
  // recovery branch (and out of it) cross-fades the title.
  const heading = computed(() => {
    if (step.value === 'reset') {
      return {
        key: 'reset',
        title: 'Reset your password',
        description: "Enter the email for your account and we'll send you a link to set a new one."
      }
    }
    if (step.value === 'new-password') {
      return {
        key: 'new-password',
        title: 'Reset Password',
        // No description on purpose: this step arrives from the email link with one
        // job, and the two field names are the whole brief. The card skips the <p>
        // when it is empty rather than padding the screen with a restatement.
        description: ''
      }
    }
    if (step.value === 'sent') {
      return {
        key: 'sent',
        title: 'Check your inbox',
        description: `We sent a reset link to ${resetEmail.value}. Check your inbox or spam folder and follow the instructions.`
      }
    }
    return {
      key: 'signin',
      title: 'Welcome Back',
      description: 'Sign in to your account.'
    }
  })

  // One button, four jobs — and on every one of them it is pressable, because the
  // validation happens when it is pressed. On 'sent' there is nothing left to
  // submit, so it drops to secondary and becomes the way back: the emphasis
  // belongs to the email.
  const primaryAction = computed(() => {
    if (step.value === 'password') return { label: 'Sign In', kind: 'primary' }
    if (step.value === 'reset') return { label: 'Send Reset Link', kind: 'primary' }
    if (step.value === 'new-password') return { label: 'Reset Password', kind: 'primary' }
    if (step.value === 'sent') return { label: 'Return to Sign In', kind: 'secondary' }
    return { label: 'Continue with Email', kind: 'primary' }
  })

  // Motion tokens — fast-02 (110ms) + productive-entrance curve, read from the
  // theme primitives (never hardcoded). Applied inline because Tailwind cannot
  // emit per-state duration/easing utilities (design.md § Motion — Drawer pattern).
  const stepTransitionStyle = {
    transition: `opacity ${duration['moderate-02']} ${curve['productive-entrance']}, transform ${duration['fast-02']} ${curve['productive-entrance']}`
  }

  // The back control + email chip land a beat AFTER the panel starts resizing
  // (delay = fast-02), so the row reads as arriving into the space the card just
  // made rather than racing the resize. Same curve as the step swap.
  const identityTransitionStyle = {
    transition: `opacity ${duration['moderate-01']} ${curve['productive-entrance']} ${duration['fast-02']}, transform ${duration['moderate-01']} ${curve['productive-entrance']} ${duration['fast-02']}`
  }

  // Plain cross-fade for the blocks that come and go inside the card (the "or" +
  // providers group, and the Skeleton → Button swap). Shorter than the height
  // transition on purpose: the old content is gone before the box finishes moving.
  const fadeTransitionStyle = {
    transition: `opacity ${duration['moderate-01']} ${curve['productive-entrance']}`
  }

  // ── The card's height, animated ────────────────────────────────────────────
  // Every path through this form changes how tall the card is: email → password
  // drops the "or" + providers group and swaps a labelled field for the identity
  // row, and back again restores them. Left alone the box SNAPS between those
  // sizes — the glitch. So the card follows its content instead: a ResizeObserver
  // reads the natural height of the inner (never-sized) element and the wrapper
  // transitions to it, which also covers the Skeleton → Button swap for free.
  //
  // The card's padding lives on a wrapper OUTSIDE the sized element on purpose:
  // the measurement is a content-box read of the form, so padding on the animated
  // box itself would be counted out of the height it travels to and clip the
  // form by twice the step.
  //
  // This is the one place a LAYOUT property is animated: the catalogue's only
  // height utility is `animate-slide-down` (a 0 → auto disclosure), and this is an
  // incremental resize with no catalogued equivalent. Timing still comes from the
  // tokens, and `motion-reduce` drops the transition entirely.
  const cardContent = ref(null)
  const cardHeight = ref(0)

  // Clipping is ON only while the box is moving. Permanent `overflow-hidden` would
  // shave the 4px focus ring (ring-2 + offset-2) off the full-width buttons and the
  // input that sit flush against the content edges; without it, the out-of-flow
  // leaving block would hang below the card as it shrinks. Clipping just for the
  // duration of the resize is the only version that has neither problem.
  const resizing = ref(false)
  const HEIGHT_MS = Number.parseInt(duration['moderate-02'], 10)
  const CLIP_SLACK_MS = Number.parseInt(duration['fast-01'], 10)

  // Social providers are gated on a readiness probe — the OAuth endpoints this
  // screen would ping before offering them. Until it resolves the two buttons are
  // Skeletons in their own shape, so a click can never reach a provider that is
  // not wired up yet (a Skeleton for something coming IN, never a spinner on a
  // control the user could still press).
  const providersReady = ref(false)
  const probeProviders = () => new Promise((resolve) => setTimeout(resolve, 1100))

  let resizeObserver = null
  let clipTimer = null

  // Anything that changes the card's height arms the clip window — the expiry
  // notice included: retiring it shortens the card by a banner's worth.
  watch([step, providersReady, expiredNotice], () => {
    resizing.value = true
    clearTimeout(clipTimer)
    clipTimer = setTimeout(() => {
      resizing.value = false
    }, HEIGHT_MS + CLIP_SLACK_MS)
  })

  onMounted(async () => {
    // The measured element is INSIDE the one being sized and never gets a height
    // of its own, so the wrapper animating to it cannot feed back into the read.
    if ('ResizeObserver' in window && cardContent.value) {
      resizeObserver = new ResizeObserver(([entry]) => {
        cardHeight.value = Math.round(entry.contentRect.height)
      })
      resizeObserver.observe(cardContent.value)
    }

    await probeProviders()
    providersReady.value = true
  })

  onBeforeUnmount(() => {
    clearTimeout(clipTimer)
    clipTimer = null
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  // Mock backend calls. A rejected promise models a request-level failure
  // (network / 5xx) — type "fail" as the password to exercise the error path.
  const lookupEmail = () => new Promise((resolve) => setTimeout(resolve, 900))
  const authenticate = (secret) =>
    new Promise((resolve, reject) =>
      setTimeout(
        () => (secret === 'fail' ? reject(new Error('Invalid email or password.')) : resolve()),
        900
      )
    )

  // `verifying` is the single lock: the primary Button shows :loading and every
  // field is :disabled off it. Each handler guards on the flag (no double-submit),
  // validates its own step, and releases the lock in `finally` so a failure never
  // bricks the form. Request failures surface via toast.error with a Retry action.
  const goToPassword = async () => {
    if (verifying.value) return
    if (!validateEmailStep()) return
    verifying.value = true
    try {
      await lookupEmail()
      step.value = 'password'
    } catch (error) {
      toast.error("Couldn't verify that email.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => goToPassword() }
      })
    } finally {
      verifying.value = false
    }
  }

  const backToEmail = () => {
    step.value = 'email'
    password.value = ''
    errors.password = ''
  }

  const signIn = async () => {
    if (verifying.value) return
    if (!validatePasswordStep()) return
    verifying.value = true
    try {
      await authenticate(password.value)
      // A new token: the session opens here, and re-arms whatever countdown was
      // armed before the expiry, so signing back in can expire again.
      startSession(email.value)
      router.push(afterSignIn())
    } catch (error) {
      toast.error('Sign-in failed.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => signIn() }
      })
    } finally {
      verifying.value = false
    }
  }

  // ── Password recovery ──
  // Same mock-request shape as the rest of the screen: one in-flight lock, a
  // success that advances the step, a failure that surfaces as a toast with Retry.
  const requestReset = () => new Promise((resolve) => setTimeout(resolve, 900))

  // Entering the branch carries whatever address the user already typed, so the
  // common case ("I'm on the password step for this account") is a single click
  // away from the link being sent. It arrives clean of the previous step's
  // messages — nothing carried in is something the user got wrong here.
  const forgotPassword = () => {
    if (verifying.value) return
    // The notice belongs to the sign-in steps; the recovery branch is a different
    // task and arrives clean, like every other message here.
    expiredNotice.value = false
    returnStep.value = step.value === 'password' ? 'password' : 'email'
    resetEmail.value = email.value
    errors.resetEmail = ''
    step.value = 'reset'
  }

  // Leaving the branch — from the back control, or from 'sent' via the primary
  // button — restores the step the user came from.
  const backToSignIn = () => {
    step.value = returnStep.value
  }

  const sendReset = async () => {
    if (verifying.value) return
    if (!validateResetStep()) return
    verifying.value = true
    try {
      await requestReset()
      step.value = 'sent'
    } catch (error) {
      toast.error("Couldn't send the reset link.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => sendReset() }
      })
    } finally {
      verifying.value = false
    }
  }

  // ── Setting the new password ──
  // The emailed link's destination. In the prototype the 'sent' step offers it as a
  // link of its own, so the whole recovery path can be walked without leaving the
  // card — and it always opens on two empty fields, never on whatever a previous
  // pass through the step left behind.
  const openResetLink = () => {
    newPassword.value = ''
    confirmPassword.value = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    step.value = 'new-password'
  }

  const saveNewPassword = () => new Promise((resolve) => setTimeout(resolve, 900))

  // Success lands on the sign-in PASSWORD step with the recovered address already
  // in hand: the one thing left to do with a new password is use it, and the step
  // that asks for it is one screen away rather than back at the top of the flow.
  const resetPassword = async () => {
    if (verifying.value) return
    if (!validateNewPasswordStep()) return
    verifying.value = true
    try {
      await saveNewPassword()
      email.value = resetEmail.value
      password.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      errors.password = ''
      returnStep.value = 'password'
      step.value = 'password'
      toast.success('Password updated.', {
        description: 'Sign in with your new password.'
      })
    } catch (error) {
      toast.error("Couldn't update your password.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => resetPassword() }
      })
    } finally {
      verifying.value = false
    }
  }

  const resendReset = async () => {
    if (resending.value) return
    resending.value = true
    try {
      await requestReset()
      toast.success('Reset link sent.', {
        description: `We sent another email to ${resetEmail.value}.`
      })
    } catch (error) {
      toast.error("Couldn't resend the email.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => resendReset() }
      })
    } finally {
      resending.value = false
    }
  }

  // One primary button per step: advance, submit, send the link, set the new
  // password, or go back. It is also the form's submit handler, so Enter from any
  // field does exactly what pressing it does.
  const handlePrimary = () => {
    // Any attempt retires the expiry notice: it explains how the operator GOT here,
    // and the moment they act on it, whatever comes back (a step change, a rejected
    // password) is the newer report. One notice on the card at a time.
    expiredNotice.value = false
    if (step.value === 'email') goToPassword()
    else if (step.value === 'password') signIn()
    else if (step.value === 'reset') sendReset()
    else if (step.value === 'new-password') resetPassword()
    else backToSignIn()
  }

  const goToSignUp = () => router.push({ name: 'signup' })
</script>

<template>
  <AuthSplit>
    <CardBox
      class="w-full max-w-[var(--container-sm)]"
      :padded="false"
    >
      <template #content>
        <!-- The card's own padding, rather than CardBox's `padded`, which is a
                 tighter step than this composition wants — and it sits outside the
                 animated box so the height measurement stays honest. -->
        <div class="p-[var(--spacing-lg)]">
          <!-- The sized element: height comes from the measurement below, so the
                   card eases between the steps instead of snapping. Clipped only
                   while it moves (see `resizing`), otherwise focus rings on the
                   flush-edge controls would be shaved. -->
          <div
            :style="cardHeight ? { height: `${cardHeight}px` } : undefined"
            :data-resizing="resizing || null"
            class="transition-[height] duration-moderate-02 ease-productive-entrance data-[resizing]:overflow-hidden motion-reduce:transition-none"
          >
            <form
              ref="cardContent"
              class="flex flex-col gap-[var(--spacing-lg)]"
              aria-label="Sign in to your account"
              novalidate
              @submit.prevent="handlePrimary"
            >
              <!-- Hidden native submit so Enter submits from any field (webkit
                       Button is type=button). `sr-only` is out of flow, so it costs
                       the column no gap. -->
              <button
                type="submit"
                class="sr-only"
                aria-hidden="true"
                tabindex="-1"
              />

              <!-- Section header — cross-fades on the way into and out of the
                       recovery branch (same out-of-flow leave as the field area, so
                       the card has one height to travel to). Sign-in's two steps
                       share a key, so the title holds still between them. -->
              <div class="relative">
                <Transition
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                  leave-active-class="absolute inset-x-0 top-0"
                >
                  <header
                    :key="heading.key"
                    :style="fadeTransitionStyle"
                    class="flex flex-col gap-[var(--spacing-xxs)] motion-reduce:transition-none"
                  >
                    <h1 class="text-heading-sm text-[var(--text-default)]">
                      {{ heading.title }}
                    </h1>
                    <!-- The reset-password step runs on its title alone, so the
                             paragraph is dropped rather than reserved empty. -->
                    <p
                      v-if="heading.description"
                      class="text-body-sm text-[var(--text-muted)]"
                    >
                      {{ heading.description }}
                    </p>
                  </header>
                </Transition>
              </div>

              <!-- Why the session expired, where the answer to it is: above both
                       fields, inside the card (see the note in the script, and
                       `/forms/auth-errors` for the rule). `info`, so it reads as the
                       system's own lifecycle rather than as anything the operator got
                       wrong, and no action button — the fields below ARE the recovery.

                       The transition rides a WRAPPER, not <Message>: the component
                       sets an inline `transition: opacity` on its own root, and an
                       inline style beats a utility class, so a translate on it would
                       jump. There is no `appear`, on purpose — on arrival the notice
                       is part of the card the entrance already carries in; it only
                       animates on the way OUT, when an attempt retires it. -->
              <Transition
                leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="-translate-y-2 opacity-0"
              >
                <div v-if="expiredNotice">
                  <Message
                    severity="info"
                    size="small"
                    label="Your session expired. Sign in again to pick up where you left off."
                  />
                </div>
              </Transition>

              <!-- Field area swaps between steps with a fast-02 / productive-entrance
                       motion. The two steps CROSS-FADE rather than running `out-in`: the
                       leaving step is taken out of flow (`leave-active-class`), so the
                       incoming one owns the layout immediately and the card has a single
                       height to travel to — an `out-in` swap would collapse the field area
                       to nothing in between and the box would dip on the way. -->
              <div class="relative">
                <Transition
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-1"
                  leave-active-class="absolute inset-x-0 top-0"
                >
                  <!-- Email step: email field -->
                  <div
                    v-if="step === 'email'"
                    key="email"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-[var(--spacing-xs)] motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <Label
                      for="login-email"
                      label="Email"
                      required
                    />
                    <InputText
                      id="login-email"
                      v-model="email"
                      type="email"
                      size="large"
                      name="email"
                      autocomplete="email"
                      class="w-full"
                      placeholder="myemail@azion.com"
                      :disabled="verifying"
                      :required="!!errors.email && !email.trim()"
                      :invalid="!!errors.email && !!email.trim()"
                      :aria-describedby="
                        errors.email && !verifying ? 'login-email-error' : undefined
                      "
                      @update:model-value="errors.email = ''"
                    />
                    <HelperText
                      v-if="errors.email && !verifying"
                      id="login-email-error"
                      :kind="email.trim() ? 'invalid' : 'required'"
                      :label="errors.email"
                    />
                  </div>

                  <!-- Password step: email chip + password field -->
                  <div
                    v-else-if="step === 'password'"
                    key="password"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-[var(--spacing-lg)] motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <!-- The back control arrives on its own delayed entrance
                             (`appear`, so it runs on the step's first render) — it is the
                             one NEW affordance of this step, and sliding it in from the
                             left says "this goes back" before the icon is even read. -->
                    <Transition
                      appear
                      appear-from-class="opacity-0 -translate-x-1"
                      appear-to-class="opacity-100 translate-x-0"
                    >
                      <div
                        :style="identityTransitionStyle"
                        class="flex items-center gap-[var(--spacing-sm)] motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <!-- Icon-only control: the Tooltip carries the label, so
                                 what it does is readable on hover/focus and not only
                                 to a screen reader via `aria-label`. -->
                        <Tooltip text="Change email">
                          <IconButton
                            icon="pi pi-chevron-left"
                            aria-label="Change email"
                            kind="outlined"
                            size="small"
                            :disabled="verifying"
                            @click="backToEmail"
                          />
                        </Tooltip>
                        <span class="truncate text-label-sm text-[var(--text-default)]">{{
                          email
                        }}</span>
                      </div>
                    </Transition>

                    <!-- Everything from the input down belongs to FieldPassword:
                             the visibility toggle and the helper line that carries the
                             submit-time message. No requirements row here — this is an
                             existing secret, not one being chosen, and grading it
                             would be both wrong and a hint. -->
                    <div class="flex flex-col gap-[var(--spacing-xs)]">
                      <Label
                        for="login-password"
                        label="Password"
                        required
                      />
                      <FieldPassword
                        v-model="password"
                        input-id="login-password"
                        name="password"
                        autocomplete="current-password"
                        placeholder="Type your password"
                        :disabled="verifying"
                        :required="!!errors.password && !password"
                        :invalid="!!errors.password && !!password"
                        :helper-text="verifying ? '' : errors.password"
                        @update:model-value="errors.password = ''"
                      />
                    </div>
                  </div>

                  <!-- Reset step: back control + the address to recover -->
                  <div
                    v-else-if="step === 'reset'"
                    key="reset"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-[var(--spacing-lg)] motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <!-- Same delayed, from-the-left entrance the password step's
                             back control uses — one gesture means "this goes back",
                             wherever in the flow it appears. -->
                    <Transition
                      appear
                      appear-from-class="opacity-0 -translate-x-1"
                      appear-to-class="opacity-100 translate-x-0"
                    >
                      <div
                        :style="identityTransitionStyle"
                        class="flex items-center gap-[var(--spacing-sm)] motion-reduce:transition-none motion-reduce:transform-none"
                      >
                        <Tooltip text="Back to Sign In">
                          <IconButton
                            icon="pi pi-chevron-left"
                            aria-label="Back to Sign In"
                            kind="outlined"
                            size="small"
                            :disabled="verifying"
                            @click="backToSignIn"
                          />
                        </Tooltip>
                        <span class="truncate text-label-sm text-[var(--text-default)]"
                          >Back to Sign In</span
                        >
                      </div>
                    </Transition>

                    <div class="flex flex-col gap-[var(--spacing-xs)]">
                      <Label
                        for="reset-email"
                        label="Email"
                        required
                      />
                      <InputText
                        id="reset-email"
                        v-model="resetEmail"
                        type="email"
                        size="large"
                        name="reset-email"
                        autocomplete="email"
                        class="w-full"
                        placeholder="myemail@azion.com"
                        :disabled="verifying"
                        :required="!!errors.resetEmail && !resetEmail.trim()"
                        :invalid="!!errors.resetEmail && !!resetEmail.trim()"
                        :aria-describedby="
                          errors.resetEmail && !verifying ? 'reset-email-error' : undefined
                        "
                        @update:model-value="errors.resetEmail = ''"
                      />
                      <HelperText
                        v-if="errors.resetEmail && !verifying"
                        id="reset-email-error"
                        :kind="resetEmail.trim() ? 'invalid' : 'required'"
                        :label="errors.resetEmail"
                      />
                    </div>
                  </div>

                  <!-- Reset-password step: the screen the emailed link opens. One
                           job, two fields, and the whole password interaction belongs
                           to FieldPassword — the visibility toggle, the helper line,
                           and (on the new secret) the requirements row that scores it
                           chip by chip against the DS rule set as it is typed. The row
                           is why this step needs no helper sentence: it says what is
                           still missing while the value is being typed, and the
                           submit-time message only restates it for someone who pressed
                           the button anyway.
                           Both names stay standalone Labels so "* (Required)" reads at
                           rest — the fields' own `required` is webkit's amber
                           failed-check state, which fires on a failed submit and not
                           before. -->
                  <div
                    v-else-if="step === 'new-password'"
                    key="new-password"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-[var(--spacing-lg)] motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <div class="flex flex-col gap-[var(--spacing-xs)]">
                      <Label
                        for="new-password"
                        label="New Password"
                        required
                      />
                      <FieldPassword
                        v-model="newPassword"
                        input-id="new-password"
                        name="new-password"
                        autocomplete="new-password"
                        placeholder="Enter a new password"
                        requirements
                        :disabled="verifying"
                        :required="!!errors.newPassword && !newPassword"
                        :invalid="!!errors.newPassword && !!newPassword"
                        :helper-text="verifying ? '' : errors.newPassword"
                        @update:model-value="errors.newPassword = ''"
                      />
                    </div>

                    <div class="flex flex-col gap-[var(--spacing-xs)]">
                      <Label
                        for="confirm-password"
                        label="Confirm Password"
                        required
                      />
                      <!-- The mismatch is said on SUBMIT, not on blur. Blur is
                               where the trap is: leaving the field to press the button
                               fires `focusout` on the mousedown, the helper line
                               appears, everything below it drops by its height — and
                               the mouseup lands where the button no longer is, so the
                               first click is swallowed. Submitting is what asks the
                               question, so submitting is when it gets answered. -->
                      <FieldPassword
                        v-model="confirmPassword"
                        input-id="confirm-password"
                        name="confirm-password"
                        autocomplete="new-password"
                        placeholder="Repeat the new password"
                        :disabled="verifying"
                        :required="!!errors.confirmPassword && !confirmPassword"
                        :invalid="!!errors.confirmPassword && !!confirmPassword"
                        :helper-text="verifying ? '' : errors.confirmPassword"
                        @update:model-value="errors.confirmPassword = ''"
                      />
                    </div>
                  </div>

                  <!-- Sent step: no field left to fill, just the two ways forward —
                           ask for the email again, or (the prototype's stand-in for
                           opening it) follow the link to the reset-password step.
                           Resending swaps the link for a low-emphasis Spinner rather
                           than loading the primary button, which now only navigates. -->
                  <div
                    v-else
                    key="sent"
                    :style="stepTransitionStyle"
                    class="flex flex-col gap-[var(--spacing-xs)] motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <div class="flex items-center gap-[var(--spacing-xs)]">
                      <p class="text-body-sm text-[var(--text-default)]">
                        Didn't receive the email?
                      </p>
                      <span
                        v-if="resending"
                        class="flex items-center gap-[var(--spacing-xxs)] text-label-sm text-[var(--text-muted)]"
                      >
                        <Spinner class="size-4" />
                        Sending…
                      </span>
                      <a
                        v-else
                        class="text-link text-body-sm"
                        href="#"
                        @click.prevent="resendReset"
                        >Resend Email</a
                      >
                    </div>
                    <div class="flex items-center gap-[var(--spacing-xs)]">
                      <p class="text-body-sm text-[var(--text-default)]">Already opened it?</p>
                      <a
                        class="text-link text-body-sm"
                        href="#"
                        @click.prevent="openResetLink"
                        >Set a new password</a
                      >
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- No `gap` on this column: the providers group carries its own
                       `pt` instead, so when it leaves its wrapper measures zero and the
                       card does not keep a 24px hole under the primary button. -->
              <div class="flex flex-col">
                <!-- Continue with Email + "Last used" tag -->
                <div class="relative">
                  <!-- The label is a PROP, so it would otherwise re-render in
                           place — the one hard cut left in the flow. Keying the
                           wrapper on the label dissolves the whole control instead:
                           the outgoing copy leaves out of flow (and untouchable), so
                           the button never moves and the two labels cross-fade in the
                           same spot. The wrapper carries the opacity so the Button
                           keeps its own colour/ghost-layer transitions intact. -->
                  <Transition
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                    leave-active-class="pointer-events-none absolute inset-x-0 top-0"
                  >
                    <div
                      :key="primaryAction.label"
                      :style="fadeTransitionStyle"
                      class="motion-reduce:transition-none"
                    >
                      <Button
                        :label="primaryAction.label"
                        :kind="primaryAction.kind"
                        size="large"
                        class="w-full"
                        :loading="verifying"
                        @click="handlePrimary"
                      />
                    </div>
                  </Transition>

                  <!-- The tag belongs to the email step only; it fades with the
                           same curve rather than blinking out from under the cursor. -->
                  <Transition
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <Tag
                      v-if="step === 'email'"
                      label="Last used"
                      severity="info"
                      size="small"
                      :style="fadeTransitionStyle"
                      class="absolute right-[var(--spacing-sm)] top-0 -translate-y-1/2 motion-reduce:transition-none"
                    />
                  </Transition>
                </div>

                <!-- "or" + social providers — dropped once the user commits to email
                         sign-in. Out of flow on the way out, same as the step swap. -->
                <div class="relative">
                  <Transition
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                    leave-active-class="absolute inset-x-0 top-0"
                  >
                    <div
                      v-if="step === 'email'"
                      :style="fadeTransitionStyle"
                      class="flex flex-col gap-[var(--spacing-lg)] pt-[var(--spacing-lg)] motion-reduce:transition-none"
                    >
                      <!-- the same labelled Divider Sign Up uses, so both auth
                               screens frame the social alternatives identically. -->
                      <Divider label="or" />

                      <!-- Providers are Skeletons until the readiness probe lands:
                               the placeholders are the exact geometry of the large
                               Buttons they stand in for (h-10 / 2.5rem), so the swap is a
                               pure cross-fade with no height to travel. -->
                      <div class="relative">
                        <Transition
                          enter-from-class="opacity-0"
                          enter-to-class="opacity-100"
                          leave-from-class="opacity-100"
                          leave-to-class="opacity-0"
                          leave-active-class="absolute inset-x-0 top-0"
                        >
                          <div
                            v-if="providersReady"
                            key="providers"
                            :style="fadeTransitionStyle"
                            class="flex flex-col gap-[var(--spacing-sm)] motion-reduce:transition-none"
                          >
                            <Button
                              type="button"
                              label="Continue with Google"
                              kind="outlined"
                              size="large"
                              icon="ai-cor ai-google"
                              class="w-full"
                              :disabled="verifying"
                            />
                            <Button
                              type="button"
                              label="Continue with GitHub"
                              kind="outlined"
                              size="large"
                              icon="pi pi-github"
                              class="w-full"
                              :disabled="verifying"
                            />
                          </div>

                          <div
                            v-else
                            key="preparing"
                            role="status"
                            aria-label="Preparing sign-in providers"
                            :style="fadeTransitionStyle"
                            class="flex flex-col gap-[var(--spacing-sm)] motion-reduce:transition-none"
                          >
                            <Skeleton height="2.5rem" />
                            <Skeleton height="2.5rem" />
                          </div>
                        </Transition>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </form>
          </div>
        </div>
      </template>
    </CardBox>

    <!-- Below the card, on the canvas — the design puts the way OUT of signing
             in outside the box, the same way Sign Up puts "Already have an
             account?" outside its own. The recovery link drops once the user is
             inside the branch: it would only lead back to the screen they are
             already on. -->
    <div
      class="flex w-full max-w-[var(--container-sm)] flex-col items-center gap-[var(--spacing-sm)]"
    >
      <div class="flex items-center justify-center gap-[var(--spacing-xs)]">
        <p class="text-body-sm text-[var(--text-default)]">Don't have an account?</p>
        <a
          class="text-link text-body-sm"
          href="/signup"
          @click.prevent="goToSignUp"
          >Sign up</a
        >
      </div>
      <a
        v-if="step === 'email' || step === 'password'"
        class="text-link text-body-sm"
        href="#"
        @click.prevent="forgotPassword"
        >Forgot your password?</a
      >
    </div>
  </AuthSplit>
</template>
