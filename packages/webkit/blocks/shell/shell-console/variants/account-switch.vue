<script setup lang="ts">
  import AccountSwitchPage, { type AccountSwitchProps } from '../parts/account-switch-page.vue'

  const props = withDefaults(defineProps<AccountSwitchProps>(), {
    error: ''
  })

  const emit = defineEmits<{
    'sign-out': [event: MouseEvent | KeyboardEvent]
    retry: [event: MouseEvent]
  }>()

  const switchOpen = defineModel<boolean>('open', { default: false })
</script>

<template>
  <AccountSwitchPage
    v-bind="props"
    v-model:open="switchOpen"
    @retry="(event) => emit('retry', event)"
    @sign-out="(event) => emit('sign-out', event)"
  />
</template>
