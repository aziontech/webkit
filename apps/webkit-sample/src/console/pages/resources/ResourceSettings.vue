<script setup lang="ts">
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
  import { bindingRecord, bindingSettingsSeed } from '../../lib/data/create-bindings'
  import {
    createFormSeed,
    createResource,
    isVisible,
    resourceFields,
    resourceSidebarKey
  } from '../../lib/data/create-resources'
  import { createdFormFor, updateCreatedResource } from '../../lib/state/created-resources'

  interface Props {
    resource: string
  }

  const props = defineProps<Props>()

  const route = useRoute()

  const spec = computed(() => createResource(props.resource))

  const recordId = computed(() => String(route.params.id ?? ''))
  const recordName = computed(() =>
    String(
      createdFormFor(props.resource, recordId.value)?.name ||
        route.query.name ||
        `${spec.value.unit} ${recordId.value}`
    )
  )

  const seedForm = () => {
    const seed = createFormSeed(spec.value)

    const stored = createdFormFor(props.resource, recordId.value)
    if (stored) return { ...seed, ...stored }

    for (const field of resourceFields(spec.value)) {
      const value = route.query[field.id]
      if (typeof value !== 'string' || !value) continue
      if (field.kind === 'select') {
        if (!field.options?.some((option) => option.value === value)) continue
      } else if (!['text', 'textarea', 'code', 'list'].includes(field.kind)) continue
      seed[field.id] = value
    }
    if (seed.name !== undefined && route.query.name) seed.name = String(route.query.name)
    return seed
  }

  const form = reactive(seedForm())
  const errors = reactive({})

  const saving = ref(false)
  const { dirty, commit } = useBaseline(form)

  const snapshot = ref(JSON.parse(JSON.stringify(form)))

  const receiveHandoff = () => {
    const resource = String(route.query.bind ?? '')
    const record = bindingRecord(resource, String(route.query.record ?? ''))
    const seed = bindingSettingsSeed(resource, record, props.resource)
    if (seed) Object.assign(form, seed)
  }
  receiveHandoff()

  watch([() => props.resource, recordId], () => {
    const seed = seedForm()
    Object.keys(errors).forEach((key) => delete errors[key])
    Object.keys(form).forEach((key) => delete form[key])
    Object.assign(form, seed)
    commit()
    snapshot.value = JSON.parse(JSON.stringify(form))
  })

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

  const advancedFields = computed(() =>
    askedSections.value.filter((section) => section.advanced).flatMap((section) => section.shown)
  )

  const askedFields = computed(() =>
    resourceFields(spec.value).filter(
      (field) => isVisible(field.section, form) && isVisible(field, form)
    )
  )

  const isEmpty = (value) => value === '' || value === undefined || value === null

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

  const clear = (id) => {
    if (errors[id]) delete errors[id]
  }

  const messageFor = (field) => errors[field.id]?.message ?? ''
  const messageKindFor = (field) => errors[field.id]?.kind ?? 'helper'

  const save = () => {
    if (!validate()) return
    saveGroup(saving, `${form.name || recordName.value} saved.`, () => {
      updateCreatedResource(props.resource, recordId.value, form)
      commit()
      snapshot.value = JSON.parse(JSON.stringify(form))
    })
  }

  const discard = () => {
    Object.assign(form, JSON.parse(JSON.stringify(snapshot.value)))
    Object.keys(errors).forEach((key) => delete errors[key])
  }

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
    <form
      class="flex min-h-full min-w-0 flex-col"
      :aria-label="`${spec.unit} settings`"
      novalidate
      @submit.prevent="save"
    >
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeading
          title="Settings"
          :description="spec.guidance"
          size="small"
        />

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
            :title="section.within ? '' : section.title"
            :hint="section.within ? '' : section.description"
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
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
                  </TransitionGroup>
                </Item.List>
              </template>
            </CardBox>
          </Section>

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
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
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
                  </TransitionGroup>
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
