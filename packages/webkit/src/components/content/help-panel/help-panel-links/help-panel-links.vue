<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import Separator from '../../../layout/separator/separator.vue'

  defineOptions({
    name: 'HelpPanelLinks',
    inheritAttrs: false
  })

  interface Props {
    /** The heading over the links. Absent uses the locale catalog (`Learn more`); an empty string renders no heading. */
    title?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: undefined
  })

  defineSlots<{
    /** Link items, one per destination. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ helpPanel: en.helpPanel })
  const heading = computed(() => props.title ?? t('helpPanel.learnMore'))
  const headingId = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-help-panel-links'
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-labelledby="heading ? headingId : undefined"
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-lg)"
  >
    <Separator />
    <div class="flex w-full flex-col gap-(--spacing-xs)">
      <h3
        v-if="heading"
        :id="headingId"
        class="text-heading-xxs text-(--text-default)"
      >
        {{ heading }}
      </h3>
      <div class="flex flex-col items-start gap-(--spacing-xxs)">
        <slot />
      </div>
    </div>
  </section>
</template>
