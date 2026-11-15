<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'

  defineOptions({
    name: 'ResponseBranches',
    inheritAttrs: false
  })

  interface Props {
    /** How many versions exist. With one or none the pager is not drawn. */
    count: number
    /** Accessible name of the pager group. Empty uses the locale catalog (`Response versions`). */
    ariaLabel?: string
    /** Locks the pager, for example while a new version streams. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    disabled: false
  })

  const model = defineModel<number>({ default: 0 })

  defineSlots<{
    /** The active version. Rendered once; the owner switches its content by `index`. */
    default(scope: { index: number }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ responseBranches: en.responseBranches })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-response-branches'
  )

  const last = computed<number>(() => Math.max(0, Math.floor(props.count) - 1))
  const index = computed<number>(() =>
    Math.min(last.value, Math.max(0, Math.floor(model.value || 0)))
  )

  const go = (step: number): void => {
    if (props.disabled) return
    const next = Math.min(last.value, Math.max(0, index.value + step))
    if (next !== index.value) model.value = next
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-count="count"
    :data-index="index"
    class="flex min-w-0 flex-col gap-(--spacing-xs)"
  >
    <slot :index="index" />
    <div
      v-if="count > 1"
      role="group"
      :aria-label="ariaLabel || t('responseBranches.label')"
      :data-testid="`${testId}__pager`"
      :data-disabled="disabled || null"
      class="group inline-flex items-center gap-(--spacing-xxs) self-start"
    >
      <IconButton
        icon="ai ai-chevron-left"
        :ariaLabel="t('responseBranches.previous')"
        kind="transparent"
        size="small"
        :disabled="disabled || index === 0"
        :data-testid="`${testId}__previous`"
        @click="go(-1)"
      />
      <span
        aria-live="polite"
        dir="auto"
        :data-testid="`${testId}__position`"
        class="min-w-10 text-center text-label-sm text-(--text-muted) tabular-nums group-data-[disabled]:text-(--text-disabled)"
        >{{ t('responseBranches.position', { current: index + 1, total: count }) }}</span
      >
      <IconButton
        icon="ai ai-chevron-right"
        :ariaLabel="t('responseBranches.next')"
        kind="transparent"
        size="small"
        :disabled="disabled || index === last"
        :data-testid="`${testId}__next`"
        @click="go(1)"
      />
    </div>
  </div>
</template>
