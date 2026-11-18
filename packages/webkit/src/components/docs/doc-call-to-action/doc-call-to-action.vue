<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import Button from '../../action/button/button.vue'
  import Brand from '../../content/brand/brand.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'

  defineOptions({ name: 'DocCallToAction', inheritAttrs: false })

  export type { ModuleHeaderAction }

  export interface DocCallToActionProps {
    /** The offer's headline; names the complementary landmark. */
    title?: string
    /** Fallback copy when the default slot is empty. */
    label?: string
    /** The primary action, label and href; unset or an empty label renders none. */
    primaryAction?: ModuleHeaderAction
    /** The outlined secondary action, label and href; unset renders none. */
    secondaryAction?: ModuleHeaderAction
  }

  withDefaults(defineProps<DocCallToActionProps>(), {
    title: '',
    label: '',
    primaryAction: undefined,
    secondaryAction: undefined
  })

  const slots = defineSlots<{
    /** The offer's copy, set as the headline's subtitle. */
    default?(): unknown
  }>()

  const attrs = useAttrs()
  const titleId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'doc-call-to-action'
  )
</script>

<template>
  <RegistrationFrame
    v-bind="$attrs"
    :data-testid="testId"
    role="complementary"
    :aria-labelledby="title ? titleId : undefined"
    class="w-full"
  >
    <div class="flex flex-col bg-(--bg-surface) px-(--spacing-lg) py-(--spacing-md)">
      <Brand
        variant="default"
        size="small"
        class="mb-(--spacing-md)"
      />

      <p
        v-if="title"
        :id="titleId"
        class="m-0 text-heading-2xs text-(--text-default)"
      >
        {{ title }}
      </p>

      <p
        v-if="slots.default || label"
        class="m-0 mt-(--spacing-2xs) text-body-xs text-(--text-muted)"
      >
        <slot>{{ label }}</slot>
      </p>

      <div
        v-if="primaryAction?.label || secondaryAction?.label"
        class="mt-(--spacing-md) flex flex-col gap-(--spacing-xs)"
      >
        <Button
          v-if="primaryAction?.label"
          :label="primaryAction.label"
          :href="primaryAction.href"
          size="medium"
          class="w-full"
        />
        <Button
          v-if="secondaryAction?.label"
          key="secondary"
          :label="secondaryAction.label"
          :href="secondaryAction.href"
          variant="outline"
          size="medium"
          class="w-full"
        />
      </div>
    </div>
  </RegistrationFrame>
</template>
