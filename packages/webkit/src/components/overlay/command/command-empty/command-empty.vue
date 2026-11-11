<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import { useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandEmpty',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useLocale({ command: en.command })
  const ctx = useCommandMenuContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__empty`
  )
</script>

<template>
  <div
    v-show="!ctx.hasVisibleItems.value"
    v-bind="attrs"
    :data-testid="testId"
    class="p-(--spacing-sm) text-label-sm text-(--text-muted)"
  >
    <slot>{{ t('command.empty') }}</slot>
  </div>
</template>
