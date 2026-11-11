<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import { useWizardContext } from '../composables/use-wizard-context'

  defineOptions({
    name: 'WizardStep',
    inheritAttrs: false
  })

  interface Props {
    /** What this step decides, in the reader's words; shown in the rail and as the step heading. */
    title?: string
    /** One line under the heading saying what the step is for; omitted when empty. */
    description?: string
    /** Marks the step as skippable: shows Optional beside the title in the rail and in the header. */
    optional?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    optional: false
  })

  defineSlots<{
    /** The step's content (fields, review summary). */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useLocale({ wizard: en.wizard })
  const context = useWizardContext()

  const id = Symbol('WizardStep')
  const { index, active } = context.register(id, {
    title: () => props.title,
    optional: () => props.optional
  })

  const root = ref<globalThis.HTMLElement | null>(null)
  const heading = ref<globalThis.HTMLElement | null>(null)
  const headingId = useId()
  const counterId = useId()
  let settled = false

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-wizard-step'
  )

  watch(
    active,
    (now) => {
      if (now && settled) heading.value?.focus()
    },
    { flush: 'post' }
  )

  onMounted(() => {
    context.attach(id, root.value)
    void nextTick(() => {
      settled = true
    })
  })

  onBeforeUnmount(() => context.unregister(id))
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    role="group"
    :aria-labelledby="active ? headingId : undefined"
    :hidden="!active"
    :data-testid="testId"
    :data-active="active || null"
    :data-optional="optional || null"
  >
    <template v-if="active">
      <div class="flex flex-col gap-(--spacing-xxs)">
        <p
          :id="counterId"
          class="text-overline-xs text-(--text-muted) @max-2xl/wizard:hidden"
        >
          {{ t('wizard.stepOf', { step: index + 1, total: context.total.value }) }}
        </p>
        <div class="flex items-baseline gap-(--spacing-xs)">
          <h2
            :id="headingId"
            ref="heading"
            tabindex="-1"
            :aria-describedby="counterId"
            class="text-heading-sm text-(--text-default) outline-none"
          >
            {{ title }}
          </h2>
          <span
            v-if="optional"
            class="text-body-sm text-(--text-muted)"
            >{{ t('wizard.optional') }}</span
          >
        </div>
        <p
          v-if="description"
          class="text-body-sm text-(--text-muted)"
        >
          {{ description }}
        </p>
      </div>
      <Transition
        appear
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      >
        <div class="pt-(--spacing-lg)">
          <slot />
        </div>
      </Transition>
    </template>
  </div>
</template>
