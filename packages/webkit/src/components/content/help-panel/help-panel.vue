<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'

  defineOptions({
    name: 'HelpPanel',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the complementary landmark the panel renders. Empty uses the locale catalog (`Help`). */
    ariaLabel?: string
    /** Renders skeleton lines in place of the content while the help topic loads; sets aria-busy. */
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    loading: false
  })

  defineSlots<{
    /** The panel's parts in reading order; not rendered while loading. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ helpPanel: en.helpPanel })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-help-panel'
  )
</script>

<template>
  <aside
    v-bind="$attrs"
    :aria-label="ariaLabel || t('helpPanel.label')"
    :aria-busy="loading ? 'true' : undefined"
    :data-testid="testId"
    :data-loading="loading || null"
    class="@container/help-panel flex w-full flex-col gap-(--spacing-lg) p-(--spacing-md)"
  >
    <div
      v-if="loading"
      :data-testid="`${testId}__loading`"
      aria-hidden="true"
      class="flex w-full flex-col gap-(--spacing-xs)"
    >
      <Skeleton
        kind="shape"
        width="60%"
        height="1.25rem"
      />
      <div class="flex w-full flex-col gap-(--spacing-sm)">
        <Skeleton
          kind="shape"
          width="100%"
          height="0.875rem"
        />
        <Skeleton
          kind="shape"
          width="100%"
          height="0.875rem"
        />
        <Skeleton
          kind="shape"
          width="75%"
          height="0.875rem"
        />
      </div>
    </div>
    <slot v-else />
  </aside>
</template>
