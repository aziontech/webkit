<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
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
  const { t } = useTranslate({ toast: en.toast })
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast__close'
  )

  const onClick = (event: MouseEvent) => emit('click', event)
</script>

<template>
  <IconButton
    v-bind="$attrs"
    icon="ai ai-times"
    kind="transparent"
    size="small"
    :ariaLabel="t('toast.close')"
    :data-testid="testId"
    @click="onClick"
  />
</template>
