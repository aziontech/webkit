<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { useDropdownContext } from '../injection-key'

  defineOptions({
    name: 'DropdownGroup',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  interface Props {
    /** Uppercase section label rendered above the options. Omit for an unlabeled group. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: ''
  })

  const attrs = useAttrs()
  const ctx = useDropdownContext()

  const uid = useId()
  const labelId = `${uid}-label`

  const groupIndex = ref(ctx.registerGroup())

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__group`
  )

  const hasLabel = computed(() => props.label.length > 0)
</script>

<template>
  <div
    v-bind="attrs"
    role="group"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :data-testid="testId"
    :data-first="groupIndex === 0 || null"
    class="flex flex-col data-[first]:pt-0 [&:not([data-first])]:mt-[var(--spacing-xxs)] [&:not([data-first])]:border-t [&:not([data-first])]:border-[var(--border-default)] [&:not([data-first])]:pt-[var(--spacing-xxs)]"
  >
    <div
      v-if="hasLabel"
      :id="labelId"
      :data-testid="`${testId}__label`"
      class="px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-overline-sm uppercase text-[var(--text-muted)]"
    >
      {{ label }}
    </div>

    <slot />
  </div>
</template>
