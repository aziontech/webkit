<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  export interface StepBackProps {
    /** The name of the back control, also its tooltip. */
    label: string
    /** The text beside the control. */
    text: string
    /** The text is the account email: keep it in the form as the username password managers pair. */
    username?: boolean
  }

  withDefaults(defineProps<StepBackProps>(), { username: false })

  const emit = defineEmits<{
    back: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex items-center gap-(--spacing-sm)">
    <Tooltip :content="label">
      <IconButton
        icon="az az-chevron-left"
        :aria-label="label"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('back', event)"
      />
    </Tooltip>
    <span class="truncate text-label-sm text-(--text-default)">{{ text }}</span>
    <input
      v-if="username"
      type="email"
      name="email"
      class="sr-only"
      autocomplete="username"
      :value="text"
      readonly
      tabindex="-1"
      aria-hidden="true"
    />
  </div>
</template>
