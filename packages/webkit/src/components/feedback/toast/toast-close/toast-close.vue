<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'

  defineOptions({
    name: 'ToastClose',
    inheritAttrs: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const { t } = useLocale({ toast: en.toast })
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast__close'
  )

  const handleClick = (event: MouseEvent) => emit('click', event)
</script>

<template>
  <IconButton
    v-bind="$attrs"
    icon="pi pi-times"
    kind="transparent"
    size="small"
    :ariaLabel="t('toast.close')"
    :data-testid="testId"
    @click="handleClick"
  />
</template>
