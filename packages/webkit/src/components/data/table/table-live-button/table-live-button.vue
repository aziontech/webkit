<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../actions/button/button.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableLiveButton',
    inheritAttrs: false
  })

  export interface TableLiveButtonProps {
    /** Disables the control (in addition to the injected loading state). */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<TableLiveButtonProps>(), {
    disabled: false
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ tableLiveButton: en.tableLiveButton })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__live-button` : 'data-table__live-button')
  )

  const isLive = computed<boolean>(() => ctx?.live?.value ?? false)
  const isDisabled = computed<boolean>(() => props.disabled || (ctx?.loading.value ?? false))
  const onClick = (): void => ctx?.setLive?.(!isLive.value)
</script>

<template>
  <Button
    v-bind="$attrs"
    :data-testid="testId"
    :data-live="isLive || undefined"
    :aria-pressed="isLive ? 'true' : 'false'"
    :label="t('tableLiveButton.label')"
    variant="outline"
    size="medium"
    :disabled="isDisabled"
    @click="onClick"
  >
    <template #leading>
      <span
        aria-hidden="true"
        :data-live="isLive || undefined"
        :data-testid="`${testId}__dot`"
        class="size-2 shrink-0 rounded-full bg-(--text-muted) data-[live]:bg-(--success) data-[live]:animate-pulse motion-reduce:animate-none"
      />
    </template>
  </Button>
</template>
