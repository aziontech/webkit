<script setup lang="ts">
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import Tag from '@aziontech/webkit/tag'

  interface EnvironmentOption {
    name: string
    description?: string
    tag?: string
    tagSeverity?: string
    disabled?: boolean
  }

  interface Props {
    options?: EnvironmentOption[]
    name?: string
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    options: () => [],
    name: 'deploy-environment',
    disabled: false
  })

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Environment"
    class="flex min-w-0 flex-col gap-(--spacing-xs)"
  >
    <div
      v-for="entry in options"
      :key="entry.name"
      class="relative min-w-0"
    >
      <FieldRadioBlock
        v-model="model"
        :name="name"
        :value="entry.name"
        :label="entry.name"
        :description="entry.description"
        :disabled="disabled || entry.disabled"
      />
      <Tag
        v-if="entry.tag"
        :label="entry.tag"
        :severity="entry.tagSeverity || 'info'"
        size="small"
        class="pointer-events-none absolute right-(--spacing-sm) top-(--spacing-sm)"
      />
    </div>
  </div>
</template>
