<script setup lang="ts">
  import Select from '@aziontech/webkit/select'

  import type { UserProfileOption } from '../user-profile-model'

  export interface ProfileSelectProps {
    /** Choices of the select. */
    options: UserProfileOption[]
    /** Accessible name of the trigger. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ProfileSelectProps>(), { ariaLabel: '' })

  const model = defineModel<string>({ required: true })

  const labelOf = (value: string) =>
    props.options.find((option) => option.value === value)?.label ?? value
</script>

<template>
  <Select
    v-model="model"
    size="large"
    class="w-full"
    :display-value="labelOf"
  >
    <Select.Trigger :aria-label="ariaLabel || undefined" />
    <Select.Content>
      <Select.Item
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </Select.Item>
    </Select.Content>
  </Select>
</template>
