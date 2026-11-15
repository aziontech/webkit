<script setup lang="ts">
  import { computed, inject, provide, useAttrs, useId } from 'vue'

  import { DropdownMenuGroupInjectionKey, useDropdownContext } from '../injection-key'

  defineOptions({
    name: 'DropdownMenuGroup',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    top(): unknown
    bottom(): unknown
  }>()

  interface Props {
    /** Section label rendered above the options. Omit for an unlabeled group. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: ''
  })

  const attrs = useAttrs()
  const ctx = useDropdownContext()

  const uid = useId()
  const labelId = `${uid}-label`

  const inPanel = inject(DropdownMenuGroupInjectionKey, false)

  provide(DropdownMenuGroupInjectionKey, true)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__group`
  )

  const hasLabel = computed(() => props.label.length > 0)
</script>

<template>
  <Teleport
    v-if="inPanel || ctx.panelBodyEl.value"
    :to="ctx.panelBodyEl.value ?? 'body'"
    :disabled="inPanel"
  >
    <div
      v-bind="attrs"
      role="group"
      :aria-labelledby="hasLabel ? labelId : undefined"
      :data-testid="testId"
      class="flex flex-col [&:not(:first-child)]:mt-(--spacing-sm) [&:not(:first-child)]:border-t [&:not(:first-child)]:border-(--border-default) [&:not(:first-child)]:pt-(--spacing-xs)"
    >
      <div class="flex flex-col px-(--spacing-xxs)">
        <div
          v-if="hasLabel"
          :id="labelId"
          :data-testid="`${testId}__label`"
          class="px-(--spacing-sm) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
        >
          {{ label }}
        </div>

        <div
          v-if="$slots['top']"
          :data-testid="`${testId}__top`"
          class="px-(--spacing-sm) py-(--spacing-xxs)"
        >
          <slot name="top" />
        </div>

        <slot />

        <div
          v-if="$slots['bottom']"
          :data-testid="`${testId}__bottom`"
          class="px-(--spacing-sm) py-(--spacing-xxs)"
        >
          <slot name="bottom" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
