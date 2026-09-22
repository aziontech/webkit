<script setup>
  // CreateResource — the create PAGE every first-level module now has.
  //
  // Ten modules could not create anything: their list's primary button raised a toast
  // saying the demo stopped there. This page is the other side of those buttons, and it
  // is ONE page rather than ten because the shape of a create flow is not what varies
  // between resources — only the fields are, and those come from the Azion v4 API
  // (../lib/create-resources.js holds them and argues that sourcing).
  //
  // A first-level create is a PAGE (see docs/surfaces.js for the rule), and this file
  // spends none of its lines on that shell: ../../components/page/StepperCreatePage.vue
  // owns the chrome, the step rail, the measure, the lock and the action bar, so what is
  // left here is the one thing that actually differs per resource — which questions get
  // asked, in what order, and what has to be answered before the next step opens.
  //
  // ── WHY THE FIELDS ARE DATA AND THE BANDS ARE MARKUP ──
  //
  // A field is a name, a control, a line of guidance and a validation rule — the same
  // four things every time, differing only in which control and which rule. That is
  // data. A BAND is layout, and it stays markup here: the Section, the card, the row.
  // So this file owns every visual decision and create-resources.js owns none of them.
  //
  // ── WHAT A HIDDEN FIELD MEANS ──
  //
  // Several forms ask a question whose answer decides the rest: a connector's type, a
  // data stream's destination. Those later fields carry a `visible(form)` guard, and a
  // hidden field is neither validated nor read — a required Kafka topic is not missing
  // on a stream that ships to S3. The guard is evaluated against the live form, so the
  // page reshapes as the answer changes.
  //
  // ── WHAT ADVANCED MEANS ──
  //
  // The spec marks a section `advanced` when it is optional to the endpoint, already
  // carries the endpoint's own defaults, and is not what the reader came here to decide.
  // Every such section is merged into ONE collapsed band at the end, so a form asks at
  // rest only what has to be answered, and submitting it untouched sends exactly what
  // the API would have applied on its own. Nothing REQUIRED is ever in there — a failed
  // submit always points at a field already on screen.
  //
  // Accessibility: in an ItemGroup the ROW is the label (Item.Title names the field,
  // Item.Description carries its guidance), so the control takes an `aria-label` rather
  // than a `<Label for>`. Validation runs on submit only: an empty required field gets
  // the amber `required` prompt, a value that breaks the API's own `pattern` or length
  // bound gets the red `invalid` — required is NOT an error, and nothing is judged while
  // the reader is still typing.
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SpecFieldRow from '../../components/form/SpecFieldRow.vue'
  import Section from '../../components/page/Section.vue'
  import StepperCreatePage from '../../components/page/StepperCreatePage.vue'
  import DependencyStep from '../../components/resource/DependencyStep.vue'
  import ModuleStep from '../../components/resource/ModuleStep.vue'
  import ReviewStep from '../../components/resource/ReviewStep.vue'
  import { hostRecord, HOSTS, resolveHostChoice } from '../../lib/behavior/application-binding'
  import { CREATION_CENTER_PATH, useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import { bindingFor, bindingWritesRule } from '../../lib/data/create-bindings'
  import {
    createFormSeed,
    createResource,
    isVisible,
    resourceFields,
    resourceSettingsPath
  } from '../../lib/data/create-resources'
  import {
    hostHasModule,
    matrixBindingFor,
    moduleRequirementFor
  } from '../../lib/data/resource-dependencies'
  import { addCreatedResource, storesCreated } from '../../lib/state/created-resources'

  const props = defineProps({
    /** Which resource this page creates — the `id` of a `createResources` entry. */
    resource: { type: String, required: true }
  })

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder), matching
  // CreationHeader so the identity is consistent across shells.
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const spec = computed(() => createResource(props.resource))

  // ── WHAT THE CALLER ALREADY ASKED ──
  //
  // A create page is often reached from a surface that has already asked one of its
  // questions: Overview's first-use card takes a domain and checks whether it is free,
  // and its Register button opens this page (see HomeEmptyState.vue). Arriving with
  // `?domain=www.mydomain.com` opens the form with that field already answered — asking
  // for it a second time would read as if the first answer had not been heard.
  //
  // Any FIELD ID is a valid query key, rather than a per-resource list of what may be
  // seeded: the page is generated from one spec, and a second list would be a second
  // source to keep in step with it. Only string controls are read — a switch or a number
  // would need coercion rules nothing here asks for, and a select is taken only when the
  // value is one of its own options, since the trigger prints the raw model value and an
  // unknown one would open reading a string that is in no list (`?email=` and `?from=`,
  // which every route in this prototype carries, match no field id and so pass through).
  const seedFromQuery = (resource, seed) => {
    for (const field of resourceFields(resource)) {
      const value = route.query[field.id]
      if (typeof value !== 'string' || !value) continue
      if (field.kind === 'select') {
        if (!field.options?.some((option) => option.value === value)) continue
      } else if (!['text', 'textarea', 'code', 'list'].includes(field.kind)) continue
      seed[field.id] = value
    }
    return seed
  }

  // The form is a flat bag keyed by field id, seeded from the API defaults and then from
  // whatever the caller sent. Flat rather than nested-like-the-payload: the nesting is a
  // fact about the request body, and a field's `api` string already records where it
  // lands, so the form does not have to mirror a shape no control reads.
  const form = reactive(seedFromQuery(spec.value, createFormSeed(spec.value)))
  const errors = reactive({})

  // Both routes mount the same component, so a navigation between two create pages would
  // otherwise keep the previous resource's answers. Reseeding on the prop is cheaper than
  // keying the route and re-running the entrance.
  watch(
    () => props.resource,
    () => {
      const seed = seedFromQuery(spec.value, createFormSeed(spec.value))
      Object.keys(errors).forEach((key) => delete errors[key])
      Object.keys(form).forEach((key) => delete form[key])
      Object.assign(form, seed)
    }
  )

  // One flag locks the whole scope while the create request is in flight.
  const submitting = ref(false)

  // ── WHAT THIS RESOURCE STILL NEEDS TO DO ANYTHING ─────────────────────────
  //
  // A connector is an address nothing fetches from until an application's rule points at
  // it — so its create page asks where it runs and ends on that rule, rather than handing
  // back a record that does nothing (../../lib/data/create-bindings.js holds which
  // resources are in that position, and what their rule is). A resource with no entry
  // there is created exactly as before.
  const applicationBindingSpec = computed(
    () => bindingFor(props.resource) ?? matrixBindingFor(props.resource)
  )
  const hostSpec = computed(() => HOSTS[applicationBindingSpec.value?.host] ?? HOSTS.application)

  const applicationChoice = ref(null)
  const enableModule = ref(false)

  const boundApplicationName = computed(() => applicationChoice.value?.name ?? '')

  const moduleRequirement = computed(() =>
    applicationBindingSpec.value
      ? moduleRequirementFor(props.resource, applicationBindingSpec.value.host)
      : null
  )

  const moduleMissing = computed(() => {
    if (!moduleRequirement.value || !applicationChoice.value) return false
    const record =
      applicationChoice.value.mode === 'existing'
        ? hostRecord(applicationBindingSpec.value.host, applicationChoice.value.name)
        : {}
    return !hostHasModule(record ?? {}, moduleRequirement.value)
  })

  const goToHostCreate = () =>
    router.push({
      path: hostSpec.value.emptyPath ?? CREATION_CENTER_PATH,
      query: { email: userEmail.value }
    })

  // The leave guard's trigger (mounted by StepperCreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(() => ({
    ...form,
    applicationChoice: applicationChoice.value
  }))

  // Only the sections and fields being asked for right now — see the note above.
  const askedSections = computed(() =>
    spec.value.sections
      .filter((section) => isVisible(section, form))
      .map((section) => ({
        ...section,
        shown: section.fields.filter((field) => isVisible(field, form))
      }))
      .filter((section) => section.shown.length > 0)
  )

  // The open bands, in the spec's own order.
  const sections = computed(() => askedSections.value.filter((section) => !section.advanced))

  // Everything `advanced`, flattened into ONE band. One card rather than one card per
  // source section: each row already carries its own name and guidance, so a second
  // level of titles inside a band nobody has opened yet would be structure for its own
  // sake. The source order is kept, so the band reads in the order the spec argues.
  const advancedFields = computed(() =>
    askedSections.value.filter((section) => section.advanced).flatMap((section) => section.shown)
  )

  const askedFields = computed(() =>
    resourceFields(spec.value).filter(
      (field) => isVisible(field.section, form) && isVisible(field, form)
    )
  )

  const DEPENDENCY_STEP = 'where-it-runs'
  const MODULE_STEP = 'module'
  const ADVANCED_STEP = 'advanced'
  const REVIEW_STEP = 'review'

  const stepDefs = computed(() => {
    const list = []

    if (applicationBindingSpec.value) {
      list.push({
        value: DEPENDENCY_STEP,
        title: 'Where it runs',
        description: moduleRequirement.value
          ? `${applicationBindingSpec.value.mechanism} It needs ${moduleRequirement.value.label} on.`
          : applicationBindingSpec.value.mechanism,
        fields: [],
        heading: false
      })

      if (moduleRequirement.value && moduleMissing.value) {
        list.push({
          value: MODULE_STEP,
          title: moduleRequirement.value.label,
          description: `Off on ${boundApplicationName.value}.`,
          fields: []
        })
      }
    }

    for (const section of sections.value) {
      list.push({
        value: section.id,
        title: section.title,
        description: section.description ?? '',
        fields: section.shown
      })
    }

    if (advancedFields.value.length) {
      list.push({
        value: ADVANCED_STEP,
        title: 'Advanced',
        description:
          "Optional settings that already carry the endpoint's own defaults. Submitting them untouched sends what the API would have applied anyway.",
        fields: advancedFields.value
      })
    }

    list.push({
      value: REVIEW_STEP,
      title: 'Review',
      description: `What will be created, and what it can do the moment it exists.`,
      fields: []
    })

    return list
  })

  const currentStep = ref('')
  const unlocked = ref([])

  watch(
    stepDefs,
    (list) => {
      if (list.some((step) => step.value === currentStep.value)) return
      currentStep.value = list[0]?.value ?? ''
      unlocked.value = currentStep.value ? [currentStep.value] : []
    },
    { immediate: true }
  )

  const stepIndex = computed(() =>
    Math.max(
      0,
      stepDefs.value.findIndex((step) => step.value === currentStep.value)
    )
  )

  const currentDef = computed(() => stepDefs.value[stepIndex.value] ?? null)

  const stepState = (step, index) => {
    if (submitting.value && step.value === REVIEW_STEP) return 'loading'
    if (step.fields.some((field) => errors[field.id])) return 'error'
    if (index < stepIndex.value) return 'complete'
    return 'upcoming'
  }

  const railSteps = computed(() =>
    stepDefs.value.map((step, index) => ({
      value: step.value,
      title: step.title,
      description: step.description,
      heading: step.heading !== false,
      state: stepState(step, index),
      disabled: !unlocked.value.includes(step.value)
    }))
  )

  const goNext = () => {
    const step = currentDef.value
    if (!step) return
    if (step.fields.length && !validate(step.fields)) return
    const next = stepDefs.value[stepIndex.value + 1]
    if (!next) return
    if (!unlocked.value.includes(next.value)) unlocked.value.push(next.value)
    currentStep.value = next.value
  }

  const goBack = () => {
    const previous = stepDefs.value[stepIndex.value - 1]
    if (previous) currentStep.value = previous.value
  }

  const isEmpty = (value) => value === '' || value === undefined || value === null

  // Validation runs on submit only, and each field gets at most one message: the first
  // rule it breaks, in the order a reader would hit them. `kind` is what separates the
  // amber prompt (you have not answered yet) from the red error (the answer cannot be
  // accepted) — the same split the /webkit-errors skill draws.
  const validate = (fields = askedFields.value) => {
    for (const field of fields) delete errors[field.id]

    for (const field of fields) {
      const value = form[field.id]
      const text = typeof value === 'string' ? value.trim() : value

      if (field.required && isEmpty(text)) {
        errors[field.id] = { kind: 'required', message: 'This field is required.' }
        continue
      }
      if (isEmpty(text) || typeof text !== 'string') continue

      if (field.minLength && text.length < field.minLength) {
        errors[field.id] = {
          kind: 'invalid',
          message: `Use at least ${field.minLength} characters.`
        }
        continue
      }
      if (field.maxLength && text.length > field.maxLength) {
        errors[field.id] = {
          kind: 'invalid',
          message: `Use at most ${field.maxLength} characters.`
        }
        continue
      }
      if (field.pattern && !field.pattern.test(text)) {
        errors[field.id] = {
          kind: 'invalid',
          message: field.patternHint ?? 'This value is not in the expected format.'
        }
      }
    }

    return fields.every((field) => !errors[field.id])
  }

  // Typing into a field that is carrying a message clears it: the message was about the
  // value at submit time, and the reader has since answered it.
  const clear = (id) => {
    if (errors[id]) delete errors[id]
  }

  // The message under a control is the ERROR only. A field's standing guidance lives in
  // the row's description (ui/SpecFieldRow.vue reads it off the field), where it costs no
  // vertical space — printing it under the control as well would put the same sentence on
  // the page twice and make a resting form look like it were already reporting on itself.
  const messageFor = (field) => errors[field.id]?.message ?? ''
  const messageKindFor = (field) => errors[field.id]?.kind ?? 'helper'

  // Where Cancel and Save go back to, and what the first crumb calls it. `?from=` when the
  // caller sent one — Overview has two pinned addresses for its two versions
  // (/home-empty-state, /home-populated), and the Creation Center sends its own so a create
  // started from that rail returns to the rail rather than to a module list the reader has
  // never seen (../../lib/behavior/create-origin.js). Everything else returns to the
  // module list.
  const { path: originPath, label: originLabel } = useCreateOrigin(
    () => spec.value.listPath,
    () => spec.value.listLabel
  )

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  // The name the toast and the created row carry. Most resources are identified by
  // `name`; a domain is identified by the domain itself, since that is the thing the
  // reader typed and the thing they will look for afterwards.
  const createdName = () => String(form.domain || form.name || spec.value.unit).trim()

  // ── WHERE THE TOAST'S ACTION GOES ─────────────────────────────────────────
  //
  // The RECORD, not the module list. Submit already lands the reader on the list, so an
  // action that opened the list was an action that went nowhere: it offered the page the
  // reader was standing on. What is actually missing after a create is the thing that was
  // created — the list here is a fixture, so the new row is not even in it.
  //
  // A record's own page is the generated settings page every module got
  // (ResourceSettings.vue), except a bucket, whose record is its objects: the list opens
  // one in the file navigator, and the toast has to agree with the list.
  const openPath = (id) =>
    props.resource === 'object-storage'
      ? `/object-storage/${id}`
      : resourceSettingsPath(props.resource, id)

  // A record the store does not keep still travels in the URL, the same way a list row
  // hands one over (`?name=`) — only this page knows more than a row does, so it also
  // carries the answers just given, which the settings page seeds itself from field id by
  // field id. Two exclusions: a `code` field, because one of them is a certificate's
  // private key and a key does not belong in a URL, and a hidden field, because it was
  // neither asked nor posted.
  //
  // For the eight resources the store DOES keep (../../lib/state/created-resources.js) the
  // query is redundant and harmless: the settings page finds the record and opens on it,
  // including the `code` fields a URL cannot carry.
  const createdQuery = (name) => {
    const query = { email: userEmail.value, name }
    for (const field of askedFields.value) {
      if (field.kind === 'code' || field.id === 'name') continue
      const value = form[field.id]
      if (typeof value === 'string' && value) query[field.id] = value
    }
    return query
  }

  // A failed submit must always point at a field already on screen, so the rail moves to
  // the first step that is carrying a message rather than leaving the reader on Review
  // beside an error they cannot see.
  const revealFirstError = () => {
    const failing = stepDefs.value.find((step) => step.fields.some((field) => errors[field.id]))
    if (failing) currentStep.value = failing.value
  }

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock
    if (!validate()) {
      revealFirstError()
      return // feedback is now on the fields themselves
    }

    submitting.value = true
    try {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 900))
      const name = createdName()
      // THE RECORD IS STORED, and the store mints its id — a bucket's id is its name,
      // which is what `/object-storage/:bucket` resolves. A resource with no projection
      // yet (a domain, whose create is a signal to Overview rather than a row in a list)
      // keeps the prototype's own opaque id and travels in the URL alone.
      const stored = storesCreated(props.resource) ? addCreatedResource(props.resource, form) : null
      const id = stored?.id ?? `${props.resource}-${Date.now().toString(36)}`
      // Snapshot, not a closure over the live form: by the time the action is clicked this
      // page is unmounted and the reader is on the list, and the URL has to describe the
      // record as it was created.
      const created = { path: openPath(id), query: createdQuery(name) }

      // BOUND: the record is only half of what the reader asked for. The application
      // is resolved (or provisioned, on the new branch) and the flow ends on its Rules
      // Engine with the rule that names this resource already written — the reader reads
      // it and saves. Nothing about the record changes; what changes is where the create
      // finishes (../applications/panels/RulesEngine.vue reads the two markers).
      const host = resolveHostChoice(applicationBindingSpec.value?.host, applicationChoice.value)

      if (host && applicationBindingSpec.value.destination) {
        const created = { id, name }
        // THE MODULE THE REFERENCE NEEDS, switched on with the create the reader agreed to
        // it in (../../lib/data/resource-dependencies.js reads the matrix that says which).
        const moduleTurnedOn = enableModule.value && moduleMissing.value ? moduleRequirement.value : null
        if (moduleTurnedOn) {
          const record = hostRecord(applicationBindingSpec.value.host, host.name)
          if (Array.isArray(record?.modules) && !record.modules.includes(moduleTurnedOn.key)) {
            record.modules.push(moduleTurnedOn.key)
          }
        }
        // WHAT HAPPENS NEXT, and it is not the same sentence for all of them: three of
        // these land on a rule the reader still has to save, and a firewall lands on its
        // own empty engine because nothing calls a firewall.
        const writesRule = bindingWritesRule(props.resource)
        const bound = host.created
          ? `${host.name} was created for it. Save the rule to start using it.`
          : writesRule
            ? `Save the rule to start using it on ${host.name}.`
            : `It runs in front of ${host.name}.`
        toast.success(`${name} created.`, {
          description: moduleTurnedOn
            ? `${moduleTurnedOn.label} was turned on for ${host.name}. ${bound}`
            : bound
        })
        commit()
        const target = applicationBindingSpec.value.destination({ host, record: created })
        router.push({ path: target.path, query: { email: userEmail.value, ...target.query } })
        return
      }

      // The success toast CARRIES THE RESOURCE: it names what was created and its
      // action opens THE RECORD, which is the whole reason someone reads a success
      // toast. Without it the reader lands on a list and has to find the row they
      // just made — and the toast is the only place that still knows its id.
      toast.success(`${name} created.`, {
        action: {
          label: `Open ${spec.value.unit}`,
          onClick: () => router.push(created)
        }
      })

      // Back to the surface that owns the resource, carrying what was created so that
      // surface can act on it without a round-trip. Overview reads `domain` as the
      // account ceasing to be empty: it turns the sample over to the populated version
      // and lands the reader on the Overview that has Recents and resource cards (see
      // Overview.vue). It is a SIGNAL, not a row — nothing here is seeded, and the
      // query is dropped the moment it is read.
      commit() // the create landed — the leave guard stands down
      router.push({
        path: originPath.value,
        query: {
          email: userEmail.value,
          ...(props.resource === 'domains' ? { domain: name } : {})
        }
      })
    } catch (error) {
      toast.error(`Could not create the ${spec.value.unit}.`, {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <StepperCreatePage
    v-model="currentStep"
    :breadcrumb="[{ label: originLabel, href: originPath }, { label: spec.title }]"
    :back-label="`Back to ${originLabel}`"
    :title="spec.title"
    :steps="railSteps"
    :submitting="submitting"
    :dirty="dirty"
    :save-label="`Create ${spec.unit}`"
    @cancel="cancel"
    @back="goBack"
    @next="goNext"
    @submit="submit"
  >
    <DependencyStep
      v-if="currentStep === DEPENDENCY_STEP && applicationBindingSpec"
      v-model:choice="applicationChoice"
      v-model:enable-module="enableModule"
      :resource="resource"
      :title="spec.title"
      :icon="spec.icon"
      :binding="applicationBindingSpec"
      :host="hostSpec"
      :unit="spec.unit"
      :disabled="submitting"
      @answer="goNext"
      @empty-action="goToHostCreate"
    />

    <ModuleStep
      v-else-if="currentStep === MODULE_STEP && moduleRequirement"
      v-model="enableModule"
      :requirement="moduleRequirement"
      :host-name="boundApplicationName"
      :host-noun="hostSpec.noun"
      :unit="spec.unit"
      :disabled="submitting"
    />

    <ReviewStep
      v-else-if="currentStep === REVIEW_STEP"
      :resource="resource"
      :unit="spec.unit"
      :answers="askedFields.map((field) => ({ field, value: form[field.id] }))"
      :binding="applicationBindingSpec"
      :host="hostSpec"
      :bound-to="boundApplicationName"
      :module-requirement="moduleRequirement"
      :module-missing="moduleMissing"
      :module-enabled="enableModule"
    />

    <!-- One band per step, its guidance carried as the Hint beside the title rather than
         as a paragraph the reader has to cross to reach the controls. `divided` is off:
         the card already draws that edge, and a rule above one would be a second line
         saying the same thing. -->
    <Section
      v-else-if="currentDef"
      stacked
      :divided="false"
      :title="currentDef.title"
      :hint="currentDef.description"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <SpecFieldRow
              v-for="field in currentDef.fields"
              :key="field.id"
              v-model="form[field.id]"
              :field="field"
              :message="messageFor(field)"
              :message-kind="messageKindFor(field)"
              :disabled="submitting"
              :name-prefix="resource"
              @update:model-value="clear(field.id)"
            />
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </StepperCreatePage>
</template>
