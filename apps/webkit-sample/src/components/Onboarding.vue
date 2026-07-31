<script setup>
  // Onboarding — the last step of signup (route /signup/onboarding), where the
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
  // address — comes straight here. It is the whole of onboarding; there is no
  // separate personalization screen.
  //
  // Three decisions, and nothing else:
  //   · WHO the user is — their full name, its own field. The console greets them
  //     by it and the rail shows it;
  //   · the organization's NAME — a separate question, because a company is not
  //     called what its first user is called, and echoing one into the other reads
  //     as a bug the first time they diverge;
  //   · its MARK — the generated marble avatar, whose accent the user picks (the
  //     same three accents every organization in the console wears, so the mark
  //     chosen here is the one the header shows on every page).
  //
  // Plus its ADDITIONAL DATA — the generic key–value model (one field per key from
  // `additionalDataKeys`, each with its accepted values), optional.
  //
  // What is NOT asked, because none of it is a decision at this point:
  //   · the first WORKSPACE. Every organization is created with one, named
  //     "My Workspace" by the store, and it is renamed in the console later. It
  //     still appears in the preview's header, because the console really does
  //     open scoped to it and that is how the user learns they have one.
  //   · the OWNER and the STATUS. The creator is the organization's owner and its
  //     first Organization User, and a new organization is `active`;
  //     `createOrganization` sets all three. Stating them here as read-only chips
  //     only taught vocabulary the user has no decision to make about, on the one
  //     screen where nothing should compete with the questions.
  //
  // Layout: the form on the left, the console drawn as a WIRE on the right
  // (OnboardingWire), with the parts this form owns rendered live. The form is
  // Fields-separated (the `/form` skill, Approach B): stacked Label + field-*
  // triads, validated on submit only — empty required is the amber `required`
  // prompt riding the field as its own HelperText, never a toast or a summary
  // block. One `submitting` flag locks the whole scope (the `/usability` Pattern
  // 1): Create shows :loading, every control is :disabled off it, the handler is
  // guarded against re-entrancy and released in `finally`.
  //
  // DISABLED YES, HELPER NO — the same rule Sign Up and Create Organization follow.
  // The lock is carried by ONE `<fieldset :disabled>` and nothing else: while it is
  // on, every guidance line goes away (the FieldTexts take an empty `helper-text`,
  // the mark picker's HelperText unmounts) and `aria-describedby` goes with it, so
  // no line describes a field that takes no input and no input points outside the
  // DOM. The selects deliberately do NOT take `:disabled` — see the note on them:
  // the field-* wrappers answer a `disabled` prop with a locked helper line of their
  // own ("This field is locked.", lock icon), which reads as permanent when the wait
  // is 900ms. The button's :loading is the message that a wait exists.
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import {
    additionalDataKeys,
    createOrganization,
    DEFAULT_WORKSPACE_NAME,
    orgAccents
  } from '../organizations.js'
  import AuthShell from './ui/AuthShell.vue'
  import OnboardingWire from './ui/OnboardingWire.vue'
  import OrgMarkPicker from './ui/OrgMarkPicker.vue'

  const route = useRoute()
  const router = useRouter()

  // The address comes from Sign Up (or the provider). Everything else is asked
  // here.
  const email = computed(() => route.query.email || 'myemail@azion.com')

  const form = reactive({
    // Two different names, asked separately: the person, and the organization.
    // The user's name is not a default for the company's — a name typed into one
    // and echoed in the other reads as a bug the first time they diverge.
    fullName: '',
    name: '',
    accent: orgAccents[0].value,
    // One entry per key of the generic additional_data model.
    additionalData: Object.fromEntries(additionalDataKeys.map(({ key }) => [key, undefined]))
  })

  // "" = valid; populated only by validate() on submit.
  const errors = reactive({ fullName: '', name: '' })
  const submitting = ref(false)

  // Both are required-only (no format rule), so an empty value is the amber
  // `required` prompt and neither field ever enters the red :invalid state.
  const validate = () => {
    errors.fullName = form.fullName.trim() ? '' : 'This field is required.'
    errors.name = form.name.trim() ? '' : 'This field is required.'
    return !errors.fullName && !errors.name
  }

  // What the wire shows while a field is still empty. The preview has to stay
  // legible from first paint — an empty header pill reads as a broken console,
  // not as an unanswered question — so each live value falls back to the word the
  // field is asking for, and typing replaces it. The greeting falls back to the
  // address's local part, the same fallback the console's own rail uses.
  const previewName = computed(() => form.name.trim() || 'Your organization')
  const ownerName = computed(() => form.fullName.trim() || String(email.value).split('@')[0])

  // Only the keys the user actually answered are stored: an unanswered key is
  // absent from additional_data, not present-and-empty.
  const answeredAdditionalData = () =>
    Object.fromEntries(Object.entries(form.additionalData).filter(([, value]) => Boolean(value)))

  // ── Entrance ──
  // The two halves of the screen arrive from opposite sides and settle together:
  // the console comes in along -X (it starts to the right of where it lands) and
  // the form along +X, so the page assembles itself around the middle instead of
  // fading in as one flat block.
  //
  // slow-01 + expressive-entrance, and both are the point: a console-sized object
  // crossing real distance reads as confident at 400ms and as a twitch at 150,
  // and the expressive curve carries most of the travel early and then eases long,
  // which is what makes the landing feel fluid rather than abrupt. The console is
  // held back one fast-01 so the form leads and the console follows it in —
  // simultaneous arrival reads as a slide transition, a stagger reads as
  // choreography.
  //
  // Timing rides on `style` because Tailwind cannot emit per-state duration /
  // easing from theme tokens (the same reason AppLayout does it — DESIGN.md
  // § Motion); the movement and opacity states stay on data-attribute variants.
  //
  // The animated property is `translate`, NOT `transform`: Tailwind v4 compiles
  // `translate-x-*` to the standalone `translate` property, so a transition
  // declared on `transform` animates nothing and the movement snaps. `transform`
  // is listed too, harmlessly, so a utility that does use it still eases.
  const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const ENTER_TIMING = `${duration['slow-01']} ${curve['expressive-entrance']}`
  const reduced = prefersReducedMotion()
  const formEnterStyle = reduced
    ? { transition: 'none' }
    : {
        transition: `opacity ${ENTER_TIMING}, translate ${ENTER_TIMING}, transform ${ENTER_TIMING}`
      }
  const wireEnterStyle = reduced
    ? { transition: 'none' }
    : { ...formEnterStyle, transitionDelay: duration['fast-01'] }

  // Two frames, not one: a single requestAnimationFrame can land in the same
  // frame the browser is already painting, so it renders the final state and
  // there is no change left to transition. The second frame guarantees the offset
  // state was painted first.
  const entered = ref(false)
  onMounted(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        entered.value = true
      })
    })
  })

  // Mock persistence. Reject models a request-level failure (network / 5xx).
  const persistOrganization = () => new Promise((resolve) => setTimeout(resolve, 900))

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock
    if (!validate()) return // errors now drive the amber :required inline
    submitting.value = true
    try {
      await persistOrganization()
      // Creating it also ENTERS it: the store makes the new organization current,
      // so the console the user lands on is already scoped to what they just
      // named, with the mark they picked in the header.
      // No `workspace` argument: the store's default is "My Workspace", and this
      // screen does not ask for it (see the note above the form).
      const organization = createOrganization({
        name: form.name.trim(),
        accent: form.accent,
        additionalData: answeredAdditionalData(),
        owner: { name: ownerName.value, email: email.value }
      })
      toast.success(`${organization.name} is ready.`, {
        description: `You're the owner. ${organization.workspaces[0].name} is set up for your first deploy.`
      })
      router.push({ name: 'home', query: { email: email.value } })
    } catch (error) {
      toast.error("Couldn't create your organization.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <AuthShell>
    <!-- `items-center` centres the two columns against each other, so the form
         and the console sit on one optical middle instead of both hanging from the
         top of the page. -->
    <div
      class="mx-auto grid w-full max-w-[var(--container-7xl)] flex-1 grid-cols-1 items-center gap-[var(--spacing-xxl)] px-[var(--spacing-xl)] py-[var(--spacing-xl)] lg:grid-cols-2"
    >
      <!-- Left column: the organization form, capped and centred in its half —
           the questions stay one readable measure wide however wide the window
           gets, and the column's own centre lines up with the mock beside it.
           Enters along +X, against the console's -X. -->
      <div
        :data-entered="entered || null"
        :style="formEnterStyle"
        class="mx-auto flex w-full max-w-[var(--container-xl)] -translate-x-6 flex-col opacity-0 data-[entered]:translate-x-0 data-[entered]:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
      >
        <CardBox
          padded
          class="w-full"
        >
          <template #content>
            <form
              class="flex flex-col gap-[var(--spacing-lg)]"
              aria-labelledby="onboarding-title"
              novalidate
              @submit.prevent="submit"
            >
              <!-- Hidden native submit so Enter submits (webkit Button is type=button). -->
              <button
                type="submit"
                class="sr-only"
                aria-hidden="true"
                tabindex="-1"
              />

              <!-- Inside the card and left-aligned, exactly like every other
                   signed-out screen (Welcome Back, Sign Up for a Free Account):
                   heading-sm over body-sm muted, reading down the same edge the
                   fields below it start from. It titles the form, so
                   `aria-labelledby` points at it rather than repeating the label
                   in an aria-label. -->
              <header class="flex flex-col gap-[var(--spacing-xs)]">
                <h1
                  id="onboarding-title"
                  class="text-heading-sm text-[var(--text-default)]"
                >
                  Create your organization
                </h1>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Everything you deploy on Azion lives inside an organization. Yours is created
                  once, here, and you can invite people into it afterwards.
                </p>
              </header>

              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Organization</legend>

                <!-- Who the user is — its own field, independent of the
                     organization's name below it. The console greets them by it
                     and the rail shows it; the company is named separately. -->
                <div class="flex flex-col gap-[var(--spacing-xs)]">
                  <Label
                    for="onboarding-full-name"
                    required
                    >Your full name</Label
                  >
                  <!-- The helper goes empty while the scope is locked (see the
                       DISABLED YES, HELPER NO note in the script): FieldText omits
                       the row for an empty `helper-text` and drops its
                       `aria-describedby` with it. Passing `:disabled` here as well
                       would make it mint "This field is locked." instead — a
                       permanent-lock claim for a 900ms wait. -->
                  <FieldText
                    v-model="form.fullName"
                    input-id="onboarding-full-name"
                    name="fullName"
                    size="large"
                    placeholder="Jane Doe"
                    autocomplete="name"
                    :required="!!errors.fullName"
                    :helper-text="
                      submitting ? '' : errors.fullName || 'How the console will greet you.'
                    "
                    @update:model-value="errors.fullName = ''"
                  />
                </div>

                <!-- Name — Label rendered here so its Required tag is PERSISTENT,
                     decoupled from the field's amber state: :required on the
                     wrapper is bound to the post-submit empty state, so the amber
                     is only revealed by a failed submit, not from first render. -->
                <div class="flex flex-col gap-[var(--spacing-xs)]">
                  <Label
                    for="onboarding-org-name"
                    required
                    >Organization name</Label
                  >
                  <FieldText
                    v-model="form.name"
                    input-id="onboarding-org-name"
                    name="organizationName"
                    size="large"
                    placeholder="Acme Inc."
                    :required="!!errors.name"
                    :helper-text="
                      submitting
                        ? ''
                        : errors.name || 'Usually your company. Everyone you invite will see it.'
                    "
                    @update:model-value="errors.name = ''"
                  />
                </div>

                <!-- The mark. Generated art rather than an upload: two
                     organizations whose names share their first letters produce
                     the same initials, which is the very case the mark exists to
                     prevent. The user picks the colour it is painted in; the
                     shape comes from the name itself, so each option previews the
                     real mark. -->
                <div class="flex flex-col gap-[var(--spacing-xs)]">
                  <Label>Organization mark</Label>
                  <OrgMarkPicker
                    v-model="form.accent"
                    :disabled="submitting"
                  />
                  <HelperText
                    v-if="!submitting"
                    label="Generated from the organization's name. Pick its colour."
                  />
                </div>

                <Divider />

                <!-- additional_data: the generic key–value model, one field per
                     key, each offering only that key's accepted values. Optional
                     — an unanswered key is simply absent. -->
                <div class="flex flex-col gap-[var(--spacing-md)]">
                  <!-- One step BELOW the card's own title (heading-xxs under
                       heading-sm, body-xs under body-sm): this is a subsection of
                       the form, and at heading-xs it read as a second title
                       competing with the one at the top of the card. -->
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xxs text-[var(--text-default)]">About your company</h2>
                    <p class="text-body-xs text-[var(--text-muted)]">
                      Optional. Stored with the organization, and used to shape what we recommend
                      you next.
                    </p>
                  </div>

                  <!-- No :disabled here, deliberately — the enclosing
                       `<fieldset :disabled>` already blocks these triggers (each is
                       a native button, so an ancestor disabled fieldset covers it),
                       exactly as it covers the text fields above. Passing the prop
                       as well would make FieldSelect mint its own helper line — a
                       lock icon over "This field is locked." — under all four
                       selects for the 900ms of the request: layout shift, plus a
                       claim of a permanent lock for a transient wait the button's
                       :loading already states. -->
                  <FieldSelect
                    v-for="entry in additionalDataKeys"
                    :key="entry.key"
                    v-model="form.additionalData[entry.key]"
                    :label="entry.label"
                    :options="entry.values"
                    :input-id="`onboarding-${entry.key}`"
                    placeholder="Select an option"
                    size="large"
                  />
                </div>
              </fieldset>

              <Button
                label="Get Started"
                kind="primary"
                size="large"
                class="w-full"
                :loading="submitting"
                @click="submit"
              />
            </form>
          </template>
        </CardBox>
      </div>

      <!-- Right column: the console itself, at full scale, running off the page
           and dissolving. It carries no caption — a console with the user's own
           organization in its header does not need to be labelled a preview, and
           a title over it would frame it as a figure instead of a screen the
           page happens to open onto. The negative margin gives up the page's
           right inset so the mock reaches the layout's edge before it fades.
           Enters along -X — it slides in from beyond the edge it will keep
           running past — a beat behind the form. -->
      <div
        :data-entered="entered || null"
        :style="wireEnterStyle"
        class="translate-x-12 opacity-0 data-[entered]:translate-x-0 data-[entered]:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:sticky lg:top-[var(--spacing-xl)] lg:-mr-[var(--spacing-xl)]"
      >
        <!-- The workspace link stays in the mock's header even though the form
             does not ask for it: the console really does open scoped to a
             workspace, and seeing "My Workspace" there is how the user learns
             they got one — and that it is a thing they can rename later. It is
             the store's default, not an answer. -->
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
