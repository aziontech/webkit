<script setup>
  // Onboarding — the last stretch of signup (route /signup/onboarding), where the
  // user's ORGANIZATION comes into existence and, with it, their first access to
  // the console.
  //
  // Why the FIRST organization is created here rather than left to the console: a
  // user cannot be nowhere. Every user belongs to an organization, so one is
  // created with the account, from the name they gave — otherwise the console
  // would open on an empty state whose only action is the thing signup should have
  // done. Further organizations are created deliberately, from inside the console
  // (CreateOrganization.vue); the rest arrive by invitation, which is what makes
  // Switch Account possible.
  //
  // It is reached from both signup paths: the email one lands here from the
  // verification link, and a social provider — which has already vouched for the
  // address — comes straight here.
  //
  // ── THREE STEPS, ONE CARD ──
  //
  // The flow is a wizard of three steps (`onboarding.js` owns the order and the
  // argument for it): the ORGANIZATION, the PLAN, then the PROFILE. It stays ONE
  // card at one width, and only the card's content changes between steps — a
  // wizard that also resizes reads as three unrelated screens, and the console
  // beside it would jump with every Continue.
  //
  // Progress is a ProgressBar across the card's TOP EDGE — `CardBox :padded=false`
  // with the bar as the first child of the content region, so the card's own
  // `overflow-clip` rounds its ends into the corners. `value` is the step the user
  // is on, not the number completed: a bar still at zero on a screen you have
  // already filled in reads as broken. The count and the step's title are stated
  // in words above the questions, because a bar alone says how far but never how
  // much is left.
  //
  // ── VALIDATION ──
  //
  // Per step, on Continue only (the `/form` skill, Approach B): an empty required
  // answer is the amber `required` prompt riding the field it belongs to, never a
  // toast and never a summary block. Nothing is validated while the user types, so
  // the amber is only ever revealed by an action they took. Continue is never
  // disabled — a dead button is a puzzle; a button that answers with the reason is
  // an instruction.
  //
  // Only the first two steps gate: without a name there is no organization, and
  // without a plan there is no contract. The profile step's two questions are
  // required in the same way — they are marked with the required indicator and
  // answered before Create organization — but they change nothing about access,
  // which is why they are last and why abandoning the page there still leaves a
  // working account behind.
  //
  // ── THE SUBMIT LOCK ──
  //
  // One `submitting` flag locks the whole scope (the `/usability` Pattern 1):
  // Create organization shows :loading, one `<fieldset :disabled>` covers every
  // control in the active step, the handler is guarded against re-entrancy and
  // released in `finally`.
  //
  // DISABLED YES, HELPER NO — the same rule Sign Up and Create Organization
  // follow. The lock is carried by that ONE fieldset and nothing else: while it is
  // on, every guidance line goes away and `aria-describedby` goes with it, so no
  // line describes a field that takes no input and no input points outside the
  // DOM. The step components take `:locked` for exactly that, never to disable a
  // control the fieldset already covers.
  //
  // Layout: the card on the left, the console drawn as a WIRE on the right
  // (OnboardingWire), with the parts step 1 owns rendered live. The wire stays put
  // across all three steps — it is the thing being created, not step 1's
  // illustration, and removing it after the name is typed would take away the only
  // confirmation the user has that the name landed.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useAnimatedHeight } from '../lib/animate-height.js'
  import { useAuthEntrance } from '../lib/auth-entrance'
  import { provideOnboardingForm } from '../lib/onboarding-form.js'
  import { onboardingSteps, profileDataKeys } from '../onboarding.js'
  import {
    createOrganization,
    DEFAULT_WORKSPACE_NAME,
    orgAccents
  } from '../organizations.js'
  import { planFor, planNameFor } from '../plans.js'
  import AuthShell from './ui/AuthShell.vue'
  import OnboardingOrganizationStep from './ui/OnboardingOrganizationStep.vue'
  import OnboardingPlanStep from './ui/OnboardingPlanStep.vue'
  import OnboardingProfileStep from './ui/OnboardingProfileStep.vue'
  import OnboardingWire from './ui/OnboardingWire.vue'

  const route = useRoute()
  const router = useRouter()

  // The address comes from Sign Up (or the provider). Everything else is asked
  // here.
  const email = computed(() => route.query.email || 'myemail@azion.com')

  // Every answer of every step, in one object owned here: a wizard's answers
  // outlive the step that collected them, so they cannot live in the step. Going
  // Back therefore costs nothing — the previous step re-renders with what the user
  // already typed.
  const form = reactive({
    // Step 1 — two different names, asked separately: the person, and the
    // organization. The user's name is not a default for the company's — a name
    // typed into one and echoed in the other reads as a bug the first time they
    // diverge.
    fullName: '',
    name: '',
    accent: orgAccents[0].value,
    // Step 2 — no seeded tier: a pre-selected plan is a contract nobody chose.
    plan: undefined,
    // Step 3 — shapes recommendations, nothing else.
    usage: undefined,
    role: undefined,
    session: false
  })

  // "" = valid; populated only by the step's own validate() on Continue.
  const errors = reactive({ fullName: '', name: '', plan: '', usage: '', role: '' })
  const submitting = ref(false)

  const stepIndex = ref(0)
  const step = computed(() => onboardingSteps[stepIndex.value])
  const isLastStep = computed(() => stepIndex.value === onboardingSteps.length - 1)

  // A paid tier was actually paid for, in the upgrade drawer.
  //
  // This is the ONLY thing that commits a paid plan — the plan step deliberately
  // does not write `form.plan` when a paid row is clicked, so a tier the user
  // backed out of never reaches the organization.
  //
  // It advances the wizard rather than navigating: the user is mid-way through
  // creating an organization, and sending them to the console the moment they pay
  // would abandon a half-built organization and throw away the name they already
  // typed. Paying completes the PLAN step, so the flow does what completing any
  // step does — it moves to the next one. Home is still reached exactly once, from
  // Create organization on the last step.
  //
  // `nextTick` before advancing so the drawer's own close runs first: the drawer
  // lives inside the plan step, and unmounting the step out from under an open
  // overlay would tear it down mid-transition.
  const confirmPlan = async (planId) => {
    form.plan = planId
    errors.plan = ''
    const plan = planFor(planId)
    if (plan) {
      toast.success(`${plan.name} plan confirmed.`, {
        description: `Your organization will be created on ${plan.name}.`
      })
    }
    await nextTick()
    if (!isLastStep.value) {
      animateHeight(() => {
        stepIndex.value += 1
      })
    }
    // The drawer had focus, and the row that opened it is gone with the step. Move
    // focus to the new step's heading so a keyboard user lands where they now are
    // instead of on `<body>` at the top of the document. `tabindex="-1"` makes the
    // heading focusable without putting it in the tab order.
    await nextTick()
    document.getElementById('onboarding-title')?.focus()
  }

  // Handed to the steps, which read and write the same objects — the answers are
  // the flow's, not the step's (see lib/onboarding-form.js).
  provideOnboardingForm({ form, errors, locked: submitting, confirmPlan })

  // Every required answer in this flow is required-only (no format rule), so an
  // empty one is the amber `required` prompt and no field ever enters the red
  // :invalid state. One validator per step, keyed by the step's id, so the wizard
  // asks the step it is on rather than carrying a switch.
  const REQUIRED_FIELD = 'This field is required.'
  const validators = {
    organization: () => {
      errors.fullName = form.fullName.trim() ? '' : REQUIRED_FIELD
      errors.name = form.name.trim() ? '' : REQUIRED_FIELD
      return !errors.fullName && !errors.name
    },
    plan: () => {
      errors.plan = form.plan ? '' : 'Select a plan to continue.'
      return !errors.plan
    },
    profile: () => {
      errors.usage = form.usage ? '' : 'Select one to continue.'
      errors.role = form.role ? '' : 'Select one to continue.'
      return !errors.usage && !errors.role
    }
  }

  // What the wire shows while a field is still empty. The preview has to stay
  // legible from first paint — an empty header pill reads as a broken console, not
  // as an unanswered question — so each live value falls back to the word the field
  // is asking for, and typing replaces it. The greeting falls back to the address's
  // local part, the same fallback the console's own rail uses.
  const previewName = computed(() => form.name.trim() || 'Your organization')
  const ownerName = computed(() => form.fullName.trim() || String(email.value).split('@')[0])

  // Only the keys the user actually answered are stored: an unanswered key is
  // absent from additional_data, not present-and-empty. The session switch always
  // has a value, so it is always stored.
  const answeredProfile = () => {
    const entries = [
      [profileDataKeys.usage, form.usage],
      [profileDataKeys.role, form.role],
      [profileDataKeys.session, form.session ? 'yes' : 'no']
    ].filter(([, value]) => Boolean(value))
    return Object.fromEntries(entries)
  }

  // ── Entrance ──
  // The two halves arrive from opposite sides and settle together: the card comes
  // in along +X and the console along -X, a beat behind it, so the page assembles
  // itself around the middle instead of fading in as one flat block. The timing,
  // the stagger and the reduced-motion escape live in `lib/auth-entrance.js` — Sign
  // In and Sign Up enter by the same rules, so moving between the three screens
  // reads as one system. It runs once, on mount: stepping through the wizard is
  // not a page load and must not replay it.
  const { entered, leadStyle: formEnterStyle, followStyle: wireEnterStyle } = useAuthEntrance()

  // Mock persistence. Reject models a request-level failure (network / 5xx).
  const persistOrganization = () => new Promise((resolve) => setTimeout(resolve, 900))

  // ── The card's height across a step change ──
  // Each step asks a different number of questions, so the card is a different
  // height on each one. Left alone it JUMPS to the new size the instant the content
  // swaps, which reads as three separate cards replacing each other rather than one
  // card advancing — and it drags the console beside it, since `items-center` lines
  // the two columns up against each other.
  //
  // So the region below the ProgressBar eases between the two heights, and only for
  // the length of the move: `lib/animate-height.js` pins the height, animates it,
  // and releases it back to `auto`, which is what keeps the card responsive to a
  // window resize and to a validation line appearing afterwards.
  //
  // Only a STEP change goes through it. An amber `required` prompt appearing still
  // resizes the card instantly, and should: it is the answer to a button the user
  // just pressed, and easing it in would delay the one thing they are waiting to
  // read.
  const { region: stepRegion, height: stepRegionHeight, animateHeight } = useAnimatedHeight()

  const back = () => {
    if (submitting.value || stepIndex.value === 0) return
    animateHeight(() => {
      stepIndex.value -= 1
    })
  }

  // One handler for both footer states: it advances while there are steps left and
  // submits on the last one, so Continue and Create organization are the same button with
  // the same guard and there is no path where one validates and the other doesn't.
  const next = async () => {
    if (submitting.value) return // re-entrancy lock
    if (!validators[step.value.id]()) return // errors now drive the amber prompts

    if (!isLastStep.value) {
      animateHeight(() => {
        stepIndex.value += 1
      })
      return
    }

    submitting.value = true
    try {
      await persistOrganization()
      // Creating it also ENTERS it: the store makes the new organization current,
      // so the console the user lands on is already scoped to what they just named,
      // with the mark they picked in the header.
      // No `workspace` argument: the store's default is "My Workspace", and this
      // flow does not ask for it.
      const organization = createOrganization({
        name: form.name.trim(),
        accent: form.accent,
        plan: planNameFor(form.plan),
        additionalData: answeredProfile(),
        owner: { name: ownerName.value, email: email.value }
      })
      toast.success(`${organization.name} created.`, {
        description: `You're the owner, on the ${organization.plan} plan. ${organization.workspaces[0].name} is ready for your first deployment.`
      })
      router.push({ name: 'home', query: { email: email.value } })
    } catch (error) {
      toast.error("Couldn't create your organization.", {
        description: error?.message ?? 'Check your connection and retry.',
        action: { label: 'Retry', onClick: () => next() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <AuthShell>
    <!-- `items-center` centres the two columns against each other, so the card and
         the console sit on one optical middle instead of both hanging from the top
         of the page. -->
    <div
      class="mx-auto grid w-full max-w-[var(--container-7xl)] flex-1 grid-cols-1 items-center gap-[var(--spacing-xxl)] px-[var(--spacing-xl)] py-[var(--spacing-xl)] lg:grid-cols-2"
    >
      <!-- Left column: the wizard, capped and centred in its half — the questions
           stay one readable measure wide however wide the window gets, and the
           column's own centre lines up with the mock beside it. Enters along +X,
           against the console's -X. -->
      <div
        :data-entered="entered || null"
        :style="formEnterStyle"
        class="mx-auto flex w-full max-w-[var(--container-xl)] -translate-x-6 flex-col opacity-0 data-[entered]:translate-x-0 data-[entered]:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
      >
        <!-- :padded=false so the ProgressBar can reach the card's own edges; the
             questions carry the padding themselves, one step in. -->
        <CardBox
          :padded="false"
          class="w-full"
        >
          <template #content>
            <!-- The progress of the FLOW, not of a request: `value` is the step the
                 user is on. `shrink-0` keeps it at its token height as a flex child
                 of the content region. -->
            <ProgressBar
              :value="stepIndex + 1"
              :max="onboardingSteps.length"
              size="small"
              shape="flat"
              class="shrink-0"
              :aria-label="`Step ${stepIndex + 1} of ${onboardingSteps.length}`"
            />

            <!-- The region that resizes between steps. `overflow-hidden` is bound
                 to the move rather than left on: while the height is pinned it
                 stops the taller step spilling out of the card, and at rest it has
                 to be gone or it would clip the focus ring of whichever control
                 sits against the region's edge. -->
            <div
              ref="stepRegion"
              :style="{ height: stepRegionHeight }"
              :data-resizing="stepRegionHeight ? '' : null"
              class="transition-[height] duration-moderate-02 ease-productive-entrance data-[resizing]:overflow-hidden motion-reduce:transition-none"
            >
              <form
                class="flex flex-col gap-[var(--spacing-lg)] p-[var(--spacing-md)]"
                aria-labelledby="onboarding-title"
                novalidate
                @submit.prevent="next"
              >
                <!-- Hidden native submit so Enter advances (webkit Button is
                     type=button). -->
                <button
                  type="submit"
                  class="sr-only"
                  aria-hidden="true"
                  tabindex="-1"
                />

                <!-- Inside the card and left-aligned, exactly like every other
                     signed-out screen (Welcome Back, Sign Up for a Free Account):
                     heading-sm over body-sm muted, reading down the same edge the
                     fields below it start from. The count sits above the title as a
                     muted label — it is what the bar means, said in words. The
                     title changes per step, so `aria-labelledby` points at it and
                     the form is renamed as the user advances. -->
                <header class="flex flex-col gap-[var(--spacing-xs)]">
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <p class="text-label-sm text-[var(--text-muted)]">
                      Step {{ stepIndex + 1 }} of {{ onboardingSteps.length }}
                    </p>
                    <!-- `tabindex="-1"` so the flow can move focus here after the
                         upgrade drawer closes, without putting a heading in the
                         tab order. It is focused programmatically only, so it
                         draws no ring. -->
                    <h1
                      id="onboarding-title"
                      tabindex="-1"
                      class="text-heading-sm text-[var(--text-default)] focus:outline-none"
                    >
                      {{ step.title }}
                    </h1>
                  </div>
                  <p class="text-body-sm text-[var(--text-muted)]">{{ step.description }}</p>
                </header>

                <!-- ONE fieldset for the whole active step: it is the entire submit
                     lock, and every control inside it is covered by it (each is a
                     native input or button, so an ancestor disabled fieldset
                     reaches them all). -->
                <fieldset
                  class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                  :disabled="submitting"
                >
                  <legend class="sr-only">{{ step.title }}</legend>

                  <!-- `v-if` rather than a KeepAlive stack: the answers live in
                       `form` above and reach the steps by inject, so a step that
                       unmounts loses nothing and a step that comes back is drawn
                       from what the user already gave.

                       Each step also fades in as it arrives — `animate-fade-in`
                       from the catalog, 220ms against the region's 240ms — so the
                       questions resolve as the card settles around them. Without
                       it the new step lands at full opacity inside a card still
                       easing to fit it, and the two read as separate events
                       instead of one. `:key` is what restarts the animation on
                       every swap: a re-entered step is the same element, so
                       without it going Back would fade nothing. -->
                  <div
                    :key="step.id"
                    class="animate-fade-in motion-reduce:animate-none"
                  >
                    <OnboardingOrganizationStep v-if="step.id === 'organization'" />
                    <OnboardingPlanStep v-else-if="step.id === 'plan'" />
                    <OnboardingProfileStep v-else />
                  </div>
                </fieldset>

                <!-- Back is outlined and only exists once there is somewhere to go
                     back to; the primary keeps the full width until then, so step 1
                     looks like the single-action screen it is. Neither is ever
                     disabled by an unanswered question — pressing the primary is
                     how the user finds out what is missing.

                     The last step's primary names the action it performs — it
                     creates the organization — rather than the vague "Get
                     Started" it used to say. The earlier steps keep "Continue"
                     deliberately: they commit nothing, so there is no real verb
                     for them to name, and inventing one would promise a save
                     that does not happen until the end. -->
                <div class="flex items-center gap-[var(--spacing-sm)]">
                  <Button
                    v-if="stepIndex > 0"
                    label="Back"
                    kind="outlined"
                    size="large"
                    :disabled="submitting"
                    @click="back"
                  />
                  <Button
                    :label="isLastStep ? 'Create organization' : 'Continue'"
                    kind="primary"
                    size="large"
                    class="flex-1"
                    :loading="submitting"
                    @click="next"
                  />
                </div>
              </form>
            </div>
          </template>
        </CardBox>
      </div>

      <!-- Right column: the console itself, at full scale, running off the page and
           dissolving. It carries no caption — a console with the user's own
           organization in its header does not need to be labelled a preview, and a
           title over it would frame it as a figure instead of a screen the page
           happens to open onto. The negative margin gives up the page's right inset
           so the mock reaches the layout's edge before it fades. Enters along -X —
           it slides in from beyond the edge it will keep running past — a beat
           behind the card. -->
      <div
        :data-entered="entered || null"
        :style="wireEnterStyle"
        class="translate-x-12 opacity-0 data-[entered]:translate-x-0 data-[entered]:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:sticky lg:top-[var(--spacing-xl)] lg:-mr-[var(--spacing-xl)]"
      >
        <!-- The workspace link stays in the mock's header even though the flow does
             not ask for it: the console really does open scoped to a workspace, and
             seeing "My Workspace" there is how the user learns they got one — and
             that it is a thing they can rename later. It is the store's default,
             not an answer. -->
        <OnboardingWire
          :org-name="previewName"
          :accent="form.accent"
          :workspace-name="DEFAULT_WORKSPACE_NAME"
          :owner-name="ownerName"
          :owner-email="email"
        />
      </div>
    </div>
  </AuthShell>
</template>
