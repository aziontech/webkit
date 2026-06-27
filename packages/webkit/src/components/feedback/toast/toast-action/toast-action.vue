<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../../actions/button/button.vue'

  defineOptions({
    name: 'ToastAction',
    inheritAttrs: false
  })

  defineProps<{
    /** Visible label of the action control. */
    label: string
  }>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast__action'
  )

  const handleClick = (event: MouseEvent) => emit('click', event)
</script>

<template>
  <Button
    v-bind="$attrs"
    kind="text"
    size="small"
    :label="label"
    :data-testid="testId"
    @click="handleClick"
  />
</template>
