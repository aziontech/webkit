<script setup lang="ts">
  import { computed, provide, useAttrs, useId } from 'vue'

  import { CommandGroupInjectionKey, useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandGroup',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  export interface CommandGroupProps {
    /** Section label rendered above the items. Omit for an unlabeled group. */
    label?: string
  }

  const props = withDefaults(defineProps<CommandGroupProps>(), {
    label: ''
  })

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()

  const uid = useId()
  const labelId = `${uid}-label`
  const groupId = uid

  provide(CommandGroupInjectionKey, groupId)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'command-group')

  const hasLabel = computed(() => props.label.length > 0)
</script>

<template>
  <div
    v-show="ctx.groupHasVisibleItems(groupId)"
    v-bind="attrs"
    role="group"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :data-testid="testId"
    :data-ranked="ctx.ranking.value || undefined"
    :data-leading="ctx.leadingGroupId.value === groupId || undefined"
    :style="ctx.ranking.value ? { order: ctx.groupOrder(groupId) } : undefined"
    class="flex flex-col [:not([role=separator])+&]:mt-(--spacing-sm) [&[data-ranked]]:mt-(--spacing-sm) [&[data-ranked][data-leading]]:mt-0"
  >
    <div
      v-if="hasLabel"
      :id="labelId"
      :data-testid="`${testId}__label`"
      class="px-(--spacing-sm) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
    >
      {{ label }}
    </div>
    <slot />
  </div>
</template>
