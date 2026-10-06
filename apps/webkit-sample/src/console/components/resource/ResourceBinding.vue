<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, ref, watch } from 'vue'

  import FieldStack from '../form/FieldStack.vue'
  import ResourcePicker from './ResourcePicker.vue'

  interface Props {
    title?: string
    hint?: string
    options?: unknown[]
    icon?: string
    noun?: string
    nounPlural?: string
    createHint?: string
    existingHint?: string
    defaultName?: string
    message?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Resource',
    hint: '',
    options: () => [],
    icon: 'pi pi-box',
    noun: 'resource',
    nounPlural: '',
    createHint: '',
    existingHint: '',
    defaultName: '',
    message: '',
    disabled: false
  })

  defineSlots<{
    new (): unknown
  }>()

  const binding = defineModel({ type: Object, required: true })

  const picker = ref(null)

  const modes = computed(() => [
    { label: `Existing ${props.noun}`, value: 'existing' },
    { label: `New ${props.noun}`, value: 'new' }
  ])

  const mode = computed({
    get: () => binding.value.mode ?? 'existing',
    set: (next) => {
      binding.value = { ...binding.value, mode: next }
    }
  })

  const existing = computed({
    get: () => binding.value.existing ?? '',
    set: (next) => {
      binding.value = { ...binding.value, existing: next }
    }
  })

  const name = computed({
    get: () => binding.value.name ?? '',
    set: (next) => {
      binding.value = { ...binding.value, name: next }
    }
  })

  watch(
    mode,
    (which) => {
      if (which === 'new' && !name.value && props.defaultName) name.value = props.defaultName
    },
    { immediate: true }
  )

  watch(mode, () => picker.value?.cancelLoad())

  const canBindExisting = computed(() => props.options.length > 0)
  watch(
    canBindExisting,
    (can) => {
      if (!can && mode.value === 'existing') mode.value = 'new'
    },
    { immediate: true }
  )
</script>

<template>
  <CardBox
    :padded="false"
    :title="title"
  >
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
        <p
          v-if="hint"
          class="text-body-sm text-(--text-muted)"
        >
          {{ hint }}
        </p>
        <SegmentedButton
          v-if="canBindExisting"
          v-model="mode"
          :options="modes"
          size="large"
          fluid
          :aria-label="`Where the ${noun} comes from`"
        />

        <p
          v-if="mode === 'existing' && existingHint"
          class="text-body-sm text-(--text-muted)"
        >
          {{ existingHint }}
        </p>

        <FieldStack
          v-if="mode === 'new'"
          label="Name"
          required
          :hint="createHint"
          description="Lowercase letters, numbers, and hyphens."
          :message="message"
          message-kind="required"
          class="pb-(--spacing-md)"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="name"
              size="large"
              class="w-full"
              :placeholder="`my-${noun}`"
              autocomplete="off"
              :disabled="disabled"
              :required="!!message"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>
      </div>

      <ResourcePicker
        v-if="mode === 'existing'"
        ref="picker"
        v-model="existing"
        :options="options"
        :icon="icon"
        :noun="noun"
        :noun-plural="nounPlural"
        :message="message"
        :disabled="disabled"
        class="pt-(--spacing-md)"
      />

      <slot
        v-if="mode === 'new'"
        name="new"
      />
    </template>
  </CardBox>
</template>
