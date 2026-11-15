<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverClose',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ popover: en.popover })
  const ctx = usePopoverContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__close`
  )

  function onClick() {
    ctx.setOpen(false)
    ctx.focusTrigger()
  }
</script>

<template>
  <IconButton
    v-bind="attrs"
    icon="ai ai-x"
    :ariaLabel="t('popover.close')"
    variant="outline"
    size="small"
    :data-testid="testId"
    @click="onClick"
  />
</template>
