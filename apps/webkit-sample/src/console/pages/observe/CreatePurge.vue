<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import CreatePage from '../../components/page/CreatePage.vue'
  import Section from '../../components/page/Section.vue'
  import { useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import {
    PURGE_LAYERS,
    PURGE_TYPES,
    PURGES,
    TIERED_CACHE_TYPES,
    purgeLines,
    purgeSummary,
    purgeTypeOf
  } from '../../lib/data/real-time-purge'
  import { addCreatedResource, createdRowsFor } from '../../lib/state/created-resources'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const source = [...createdRowsFor('real-time-purge'), ...PURGES].find(
    (purge) => purge.id === route.query.repurge
  )

  const form = reactive({
    layer: source?.layer ?? 'cache',
    type: source?.type ?? 'url',
    arguments: source?.arguments.join('\n') ?? ''
  })

  const error = reactive({ kind: 'required', message: '' })

  const submitting = ref(false)

  const { dirty, commit } = useBaseline(form)

  const tiered = computed(() => form.layer === 'tiered_cache')

  const typeAllowed = (value) => !tiered.value || TIERED_CACHE_TYPES.includes(value)

  watch(tiered, () => {
    if (!typeAllowed(form.type)) form.type = TIERED_CACHE_TYPES[0]
  })

  watch(
    () => [form.type, form.arguments],
    () => {
      error.message = ''
    }
  )

  const selectedType = computed(() => purgeTypeOf(form.type))

  const entries = computed(() => purgeLines(form.arguments))

  const guidance = computed(() => {
    if (error.message) return error.message
    if (!entries.value.length) return selectedType.value.helper
    return `${purgeSummary(form.type, entries.value.length)} to purge. ${selectedType.value.helper}`
  })

  const lineIssue = (line, index) => {
    const at = entries.value.length > 1 ? `Line ${index + 1}` : 'The argument'
    if (/^https?:\/\//i.test(line)) return `${at} starts with a protocol. Remove it.`
    if (form.type === 'wildcard' && !line.includes('*'))
      return `${at} has no asterisk. Choose URL to purge an exact address.`
    if (form.type === 'url' && line.includes('*'))
      return `${at} contains an asterisk. Choose Wildcard to purge a pattern.`
    return ''
  }

  const validate = () => {
    if (!entries.value.length) {
      error.kind = 'required'
      error.message = 'This field is required.'
      return false
    }
    const issue = entries.value.map(lineIssue).find(Boolean)
    if (issue) {
      error.kind = 'invalid'
      error.message = issue
      return false
    }
    error.message = ''
    return true
  }

  const { path: originPath, label: originLabel } = useCreateOrigin(
    '/real-time-purge',
    'Real-Time Purge'
  )

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const summary = purgeSummary(form.type, entries.value.length)
      addCreatedResource('real-time-purge', {
        type: form.type,
        layer: form.layer,
        arguments: entries.value
      })
      toast.success(`Purge queued for ${summary}.`, {
        description: 'Cached copies are evicted from every edge location within seconds.'
      })
      commit()
      router.push({ path: '/real-time-purge', query: { email: userEmail.value } })
    } catch (failure) {
      toast.error('Could not queue the purge.', {
        description: failure?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <CreatePage
    :breadcrumb="[{ label: originLabel, href: originPath }, { label: 'Create Purge' }]"
    :back-label="`Back to ${originLabel}`"
    title="Create Purge"
    description="Evict cached objects from every edge location. Each one is fetched from your origin again on its next request."
    title-id="create-purge-title"
    save-label="Purge"
    :submitting="submitting"
    :dirty="dirty"
    @cancel="cancel"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="Target"
      hint="Where the objects are evicted from, and how this purge identifies them."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              kind="wide"
              title="Layer"
              description="The cache layer the objects are evicted from."
            >
              <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
                <legend class="sr-only">Layer</legend>
                <FieldRadioBlock
                  v-for="layer in PURGE_LAYERS"
                  :key="layer.value"
                  v-model="form.layer"
                  :value="layer.value"
                  name="purge-layer"
                  :input-id="`purge-layer-${layer.value}`"
                  :label="layer.label"
                  :description="layer.description"
                  :disabled="submitting"
                />
              </fieldset>
            </FieldRow>

            <FieldRow
              kind="wide"
              title="Purge Type"
              description="How the arguments below identify the objects."
            >
              <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
                <legend class="sr-only">Purge Type</legend>
                <FieldRadioBlock
                  v-for="type in PURGE_TYPES"
                  :key="type.value"
                  v-model="form.type"
                  :value="type.value"
                  name="purge-type"
                  :input-id="`purge-type-${type.value}`"
                  :label="type.label"
                  :description="type.description"
                  :helper-text="typeAllowed(type.value) ? '' : 'Tiered Cache purges by cache key only.'"
                  :disabled="submitting || !typeAllowed(type.value)"
                />
              </fieldset>
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <Section
      stacked
      :divided="false"
      title="Arguments"
      :hint="`The ${selectedType.noun}s to purge, one per line.`"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              kind="wide"
              :title="`${selectedType.label} List`"
              :description="selectedType.description"
              :message="guidance"
              :message-kind="error.message ? error.kind : 'helper'"
            >
              <template #default="{ messageId }">
                <Textarea
                  v-model="form.arguments"
                  class="w-full font-(family-name:--font-code) text-body-sm"
                  :rows="6"
                  :aria-label="`${selectedType.label} list`"
                  :placeholder="selectedType.placeholder"
                  :required="!!error.message && error.kind === 'required'"
                  :invalid="!!error.message && error.kind === 'invalid'"
                  :aria-describedby="messageId"
                  :disabled="submitting"
                  spellcheck="false"
                  autocomplete="off"
                />
              </template>
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>

      <Message
        severity="warning"
        size="small"
        label="A purge cannot be undone. A broad one briefly raises the traffic that reaches your origin, while the edge fills its cache again."
      />
    </Section>
  </CreatePage>
</template>
