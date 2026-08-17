<script setup>
  // CreateResource — the create PAGE every first-level module now has.
  //
  // Ten modules could not create anything: their list's primary button raised a toast
  // saying the demo stopped there. This page is the other side of those buttons, and it
  // is ONE page rather than ten because the shape of a create flow is not what varies
  // between resources — only the fields are, and those come from the Azion v4 API
  // (../lib/create-resources.js holds them and argues that sourcing).
  //
  // A first-level create is a PAGE (see ui/CreatePage.vue and docs/surfaces.js for the
  // rule), and this file spends none of its lines on that shell: CreatePage owns the
  // chrome, the measure, the lock and the action bar, so what is left here is the one
  // thing that actually differs per resource — which questions get asked, and when.
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
  import CreatePage from '../../components/page/CreatePage.vue'
  import Section from '../../components/page/Section.vue'
  import { useBaseline } from '../../lib/behavior/forms'
  import {
    createFormSeed,
    createResource,
    isVisible,
    resourceFields,
    resourceSettingsPath
  } from '../../lib/data/create-resources'

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

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue, mounted by CreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(form)

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

  const isEmpty = (value) => value === '' || value === undefined || value === null

  // Validation runs on submit only, and each field gets at most one message: the first
  // rule it breaks, in the order a reader would hit them. `kind` is what separates the
  // amber prompt (you have not answered yet) from the red error (the answer cannot be
  // accepted) — the same split the /webkit-errors skill draws.
  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])

    for (const field of askedFields.value) {
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

    return Object.keys(errors).length === 0
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

  // Where Cancel and Save go back to. `?from=` when the caller sent one — Overview has two
  // pinned addresses for its two versions (/home-empty-state, /home-populated), and
  // returning to the module's own `listPath` from a pinned one would drop the reader on a
  // different version of the page they left. Everything else returns to the module list.
  const returnPath = computed(() => route.query.from || spec.value.listPath)

  const cancel = () => router.push({ path: returnPath.value, query: { email: userEmail.value } })

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

  // The prototype stores none of these ten resources, so the record travels in the URL,
  // the same way a list row hands one over (`?name=`) — only this page knows more than a
  // row does, so it also carries the answers just given, which the settings page seeds
  // itself from field id by field id. Two exclusions: a `code` field, because one of them
  // is a certificate's private key and a key does not belong in a URL, and a hidden field,
  // because it was neither asked nor posted.
  const createdQuery = (name) => {
    const query = { email: userEmail.value, name }
    for (const field of askedFields.value) {
      if (field.kind === 'code' || field.id === 'name') continue
      const value = form[field.id]
      if (typeof value === 'string' && value) query[field.id] = value
    }
    return query
  }

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock
    if (!validate()) return // feedback is now on the fields themselves

    submitting.value = true
    try {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 900))
      const name = createdName()
      const id = `${props.resource}-${Date.now().toString(36)}`
      // Snapshot, not a closure over the live form: by the time the action is clicked this
      // page is unmounted and the reader is on the list, and the URL has to describe the
      // record as it was created.
      const created = { path: openPath(id), query: createdQuery(name) }

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
        path: returnPath.value,
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
  <CreatePage
    :breadcrumb="[{ label: spec.listLabel, href: returnPath }, { label: spec.title }]"
    :back-label="`Back to ${spec.listLabel}`"
    :title="spec.title"
    :description="spec.guidance"
    :title-id="`${resource}-create-title`"
    :submitting="submitting"
    :dirty="dirty"
    @cancel="cancel"
    @submit="submit"
  >
    <!-- One band per section the spec asks for right now, its guidance carried as the
         Hint beside the title rather than as a paragraph the reader has to cross to
         reach the controls. `divided` is off throughout: the cards already draw those
         edges, and a rule above one would be a second line saying the same thing. -->
    <Section
      v-for="section in sections"
      :key="section.id"
      stacked
      :divided="false"
      :title="section.title"
      :hint="section.description"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <SpecFieldRow
              v-for="field in section.shown"
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

    <!-- Last, and collapsed: everything the endpoint does not require and already
         defaults. Section owns the trigger semantics (`aria-expanded`/`aria-controls`),
         the height transition and `inert` while closed, so no hidden field is ever
         tabbable. It carries no hint — the title and its gear already say what it is,
         and a band nobody opens does not earn a sentence. -->
    <Section
      v-if="advancedFields.length"
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <SpecFieldRow
              v-for="field in advancedFields"
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
  </CreatePage>
</template>
