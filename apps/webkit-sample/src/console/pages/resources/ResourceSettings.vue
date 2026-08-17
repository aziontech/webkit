<script setup>
  // ResourceSettings — THE settings page every first-level resource gets, generated from the
  // same descriptor as its create page.
  //
  // ── WHY IT EXISTS ──
  //
  // Ten modules could create a resource and none of them could change one: the row menu's
  // Edit action raised a toast saying the demo stopped there. So a reader could make a
  // function, a connector, a certificate — and then had nowhere to go. This page is the
  // other side of that menu item.
  //
  // ── WHY IT IS ONE PAGE AND NOT TEN ──
  //
  // The same argument as the create page (../lib/create-resources.js § WHY ONE DESCRIPTOR):
  // what differs between resources is which fields the API takes, not the shape of the
  // screen. So the SHAPE lives here once — console shell, bands, submit-time validation,
  // scope lock, one save bar — and the fields come from the descriptor. A create page and
  // the settings page it becomes are then the same object seen twice: same bands, same
  // rows, same order, same guidance. Nothing has to be relearned after the first save.
  //
  // The rows themselves are ui/SpecFieldRow.vue, the one component that turns a field
  // descriptor into a control — shared with the create page, so a control cannot gain an
  // attribute on one page and lack it on the other.
  //
  // ── WHAT DIFFERS FROM CREATE ──
  //
  //   The shell — a create flow is a focused page with its own header (ui/CreatePage.vue);
  //     editing an existing resource happens INSIDE the console, so this is the persistent
  //     shell with the module breadcrumb and the sidebar still on screen.
  //   The commit — Cancel/Save becomes ONE save bar (ui/SettingsSaveBar.vue) that mounts on
  //     the first real edit and offers Discard, which is the console's settings model
  //     everywhere else (an application's Main Settings, a workload's, the account's).
  //   The values — a create page opens on the API's defaults. This one opens on the stored
  //     record, and the prototype has no store for these ten resources, so the row hands
  //     over what it knows in the query string (`?name=`) and the rest falls back to those
  //     same defaults. The seeding is deliberately generic — any field id is a valid query
  //     key — so a list that later carries more of a row can pass it without touching this
  //     file.
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import SettingsSaveBar from '../../components/form/SettingsSaveBar.vue'
  import SpecFieldRow from '../../components/form/SpecFieldRow.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import Section from '../../components/page/Section.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { saveGroup, useBaseline } from '../../lib/behavior/forms'
  import {
    createFormSeed,
    createResource,
    isVisible,
    resourceFields,
    resourceSidebarKey
  } from '../../lib/data/create-resources'

  const props = defineProps({
    /** Which resource this page configures — the `id` of a `createResources` entry. */
    resource: { type: String, required: true }
  })

  const route = useRoute()

  const spec = computed(() => createResource(props.resource))

  // The record being edited. The prototype stores none of these ten resources, so its
  // identity is what the URL carries: the id in the path and the name the row passed.
  const recordId = computed(() => String(route.params.id ?? ''))
  const recordName = computed(() =>
    String(route.query.name || `${spec.value.unit} ${recordId.value}`)
  )

  // Stored values first, API defaults behind them. Only string controls are read from the
  // query, and a select only when the value is one of its own options — the same rule the
  // create page applies to its own seeding, for the same reason (a select holding a value
  // that is in no list prints a raw string in its trigger).
  const seedForm = () => {
    const seed = createFormSeed(spec.value)
    for (const field of resourceFields(spec.value)) {
      const value = route.query[field.id]
      if (typeof value !== 'string' || !value) continue
      if (field.kind === 'select') {
        if (!field.options?.some((option) => option.value === value)) continue
      } else if (!['text', 'textarea', 'code', 'list'].includes(field.kind)) continue
      seed[field.id] = value
    }
    // `name` is the one field every list can hand over, and it arrives as `?name=` rather
    // than under the field's own id because that is what identifies the row.
    if (seed.name !== undefined && route.query.name) seed.name = String(route.query.name)
    return seed
  }

  const form = reactive(seedForm())
  const errors = reactive({})

  // ONE flag, ONE baseline, ONE bar for the page — the console's settings model. `dirty` is
  // what mounts the bar, so it appears on the first real edit and leaves when the save lands
  // or the reader puts the value back.
  const saving = ref(false)
  const { dirty, commit } = useBaseline(form)

  // What Discard restores: the last SAVED state, kept as a JSON snapshot so restoring cannot
  // alias the live object and re-dirty it.
  const snapshot = ref(JSON.parse(JSON.stringify(form)))

  // One route mounts this page for every resource, so navigating between two of them would
  // otherwise keep the previous resource's answers.
  watch([() => props.resource, recordId], () => {
    const seed = seedForm()
    Object.keys(errors).forEach((key) => delete errors[key])
    Object.keys(form).forEach((key) => delete form[key])
    Object.assign(form, seed)
    commit()
    snapshot.value = JSON.parse(JSON.stringify(form))
  })

  // Only the sections and fields this resource is asking for right now — a field guarded by
  // `visible(form)` is neither shown, validated, nor posted.
  const askedSections = computed(() =>
    spec.value.sections
      .filter((section) => isVisible(section, form))
      .map((section) => ({
        ...section,
        shown: section.fields.filter((field) => isVisible(field, form))
      }))
      .filter((section) => section.shown.length > 0)
  )

  const sections = computed(() => askedSections.value.filter((section) => !section.advanced))

  // Everything `advanced`, flattened into ONE collapsed band at the end — same as the create
  // page, and for the same reason: a settings page should show at rest what the reader came
  // to change, not every property the endpoint accepts.
  const advancedFields = computed(() =>
    askedSections.value.filter((section) => section.advanced).flatMap((section) => section.shown)
  )

  const askedFields = computed(() =>
    resourceFields(spec.value).filter(
      (field) => isVisible(field.section, form) && isVisible(field, form)
    )
  )

  const isEmpty = (value) => value === '' || value === undefined || value === null

  // Validation runs on submit only, and each field gets at most one message: the first rule
  // it breaks, in the order a reader would hit them. `kind` separates the amber prompt (you
  // have not answered yet) from the red error (the answer cannot be accepted).
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

  const messageFor = (field) => errors[field.id]?.message ?? ''
  const messageKindFor = (field) => errors[field.id]?.kind ?? 'helper'

  const save = () => {
    if (!validate()) return
    saveGroup(saving, `${form.name || recordName.value} saved.`, () => {
      commit()
      snapshot.value = JSON.parse(JSON.stringify(form))
    })
  }

  const discard = () => {
    Object.assign(form, JSON.parse(JSON.stringify(snapshot.value)))
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  // The breadcrumb is what names the location, so the page carries no title repeating the
  // record's name — the last crumb IS that name.
  const breadcrumb = computed(() => [
    { label: spec.value.label, href: spec.value.listPath },
    { label: recordName.value }
  ])
</script>

<template>
  <AppLayout
    :active="resourceSidebarKey(props.resource)"
    :padded="false"
    :breadcrumb="breadcrumb"
  >
    <!-- ONE form for the page: every band edits the same record, so one submit commits all
         of it. `min-h-full` so the bar lands at the bottom of the screen on a short page
         rather than floating just under the last card. -->
    <form
      class="flex min-h-full min-w-0 flex-col"
      :aria-label="`${spec.unit} settings`"
      novalidate
      @submit.prevent="save"
    >
      <!-- The FORM measure: this page is a stacked column of label-plus-control rows, so
           past ~1200px the extra width would only leave each label a head-turn from the
           field it names. -->
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeading
          title="Settings"
          :description="spec.guidance"
          size="small"
        />

        <!-- Section owns the band step, so the fieldset only stacks them. One flag locks
             every control on the page while the commit is in flight. -->
        <fieldset
          class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="saving"
        >
          <legend class="sr-only">{{ spec.unit }} settings</legend>

          <Section
            v-for="section in sections"
            :key="section.id"
            stacked
            anchor
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
                    :disabled="saving"
                    :name-prefix="props.resource"
                    @update:model-value="clear(field.id)"
                  />
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <!-- Last, and collapsed: everything the endpoint does not require and already
               defaults. Section owns the trigger semantics and `inert` while closed, so no
               hidden field is ever tabbable. -->
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
                    :disabled="saving"
                    :name-prefix="props.resource"
                    @update:model-value="clear(field.id)"
                  />
                </Item.List>
              </template>
            </CardBox>
          </Section>
        </fieldset>
      </div>

      <SettingsSaveBar
        :dirty="dirty"
        :saving="saving"
        @save="save"
        @discard="discard"
      />
    </form>
  </AppLayout>
</template>
