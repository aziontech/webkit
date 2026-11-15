<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useStepRegistry } from '../../../composables/use-step-registry'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { StepperInjectionKey } from './injection-key'

  defineOptions({
    name: 'Stepper',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Accessible name for the step rail. Empty uses the locale catalog (`Steps`). */
      ariaLabel?: string
    }>(),
    {
      ariaLabel: ''
    }
  )

  defineSlots<{
    /** The Stepper.Step children, in the order they are numbered. */
    default(): unknown
  }>()

  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const { t } = useTranslate({ stepper: en.stepper })

  const { register, attach, unregister } = useStepRegistry()

  const select = (value: string) => {
    model.value = value
  }

  provide(StepperInjectionKey, {
    active: computed(() => model.value),
    register,
    attach,
    unregister,
    select
  })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-stepper'
  )
</script>

<template>
  <nav
    v-bind="$attrs"
    :aria-label="ariaLabel || t('stepper.label')"
    :data-testid="testId"
    :data-active="model"
    data-orientation="vertical"
    class="w-full"
  >
    <ol class="flex w-full flex-col">
      <slot />
    </ol>
  </nav>
</template>
