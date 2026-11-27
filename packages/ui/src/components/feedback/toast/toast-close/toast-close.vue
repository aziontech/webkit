<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'

  defineOptions({
    name: 'ToastClose',
    inheritAttrs: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ toast: en.toast })
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'toast-close')

  const onClick = (event: MouseEvent) => emit('click', event)
</script>

<template>
  <IconButton
    v-bind="$attrs"
    icon="az az-x"
    variant="ghost"
    size="small"
    :ariaLabel="t('toast.close')"
    :data-testid="testId"
    @click="onClick"
  />
</template>
