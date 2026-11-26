<script setup lang="ts">
  import RadioGroup from '@aziontech/ui/radio-group'
  import Tag from '@aziontech/ui/tag'

  import type { DeployDrawerEnvironment } from '../types'

  export interface EnvironmentChoicesProps {
    /** The environments to go live in. */
    environments: DeployDrawerEnvironment[]
    /** The name of the radio group. */
    name: string
  }

  defineProps<EnvironmentChoicesProps>()

  /** The environment it goes live in. */
  const environment = defineModel<string>({ required: true })
</script>

<template>
  <RadioGroup
    v-model="environment"
    variant="card"
    :name="name"
    aria-label="Environment"
  >
    <RadioGroup.Item
      v-for="entry in environments"
      :key="entry.name"
      :value="entry.name"
      :description="entry.description"
      :disabled="entry.disabled"
    >
      {{ entry.name }}
      <template
        v-if="entry.tag"
        #tag
      >
        <Tag
          :label="entry.tag"
          :severity="entry.tagSeverity ?? 'info'"
          size="small"
        />
      </template>
    </RadioGroup.Item>
  </RadioGroup>
</template>
