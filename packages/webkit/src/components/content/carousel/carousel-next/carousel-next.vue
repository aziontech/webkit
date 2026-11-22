<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { useCarouselContext } from '../composables/use-carousel-context'

  defineOptions({
    name: 'CarouselNext',
    inheritAttrs: false
  })

  export interface CarouselNextProps {
    /** Accessible name for the control that steps the track forward. Empty uses the locale catalog (`Next slide`). */
    ariaLabel?: string
  }

  withDefaults(defineProps<CarouselNextProps>(), {
    ariaLabel: ''
  })

  const context = useCarouselContext()
  const attrs = useAttrs()
  const { t } = useTranslate({ carousel: en.carousel })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'carousel-next')
</script>

<template>
  <IconButton
    v-bind="$attrs"
    variant="outline"
    icon="az az-chevron-right"
    :data-testid="testId"
    :aria-label="ariaLabel || t('carousel.next')"
    :disabled="!context.canScrollNext.value"
    @click="context.scrollNext()"
  />
</template>
