<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { useDropdownContext } from '../injection-key'

  defineOptions({
    name: 'DropdownGroup',
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

  const groupIndex = ref(ctx.registerGroup())

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__group`
  )

  const hasLabel = computed(() => props.label.length > 0)
</script>

<template>
  <Teleport
    v-if="ctx.panelBodyRef.value"
    :to="ctx.panelBodyRef.value"
  >
    <div
      v-bind="attrs"
      role="group"
      :aria-labelledby="hasLabel ? labelId : undefined"
      :data-testid="testId"
      :data-first="groupIndex === 0 || null"
      class="flex flex-col [&:not([data-first])]:mt-(--spacing-sm) [&:not([data-first])]:border-t [&:not([data-first])]:border-(--border-default) [&:not([data-first])]:pt-(--spacing-xs)"
    >
      <!--
        The divider above lives on this root, which spans the panel's full inner
        width (the panel carries only vertical padding) so it reads edge-to-edge
        like the panel's own border. The horizontal inset the rows need therefore
        moves here, onto the content wrapper.
      -->
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
