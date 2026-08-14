<script setup lang="ts">
  import { computed, provide, useAttrs, useId } from 'vue'

  import { CommandMenuGroupIdKey, useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandMenuGroup',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const props = withDefaults(
    defineProps<{
      /** Section label rendered above the items. Omit for an unlabeled group. */
      heading?: string
    }>(),
    {
      heading: ''
    }
  )

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()

  const uid = useId()
  const headingId = `${uid}-heading`
  const groupId = uid

  provide(CommandMenuGroupIdKey, groupId)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__group`
  )

  const hasHeading = computed(() => props.heading.length > 0)
</script>

<template>
  <div
    v-show="ctx.groupHasVisibleItems(groupId)"
    v-bind="attrs"
    role="group"
    :aria-labelledby="hasHeading ? headingId : undefined"
    :data-testid="testId"
    class="flex flex-col [:not([role=separator])+&]:mt-(--spacing-sm)"
  >
    <!--
      Groups never sit flush. The rhythm is `--spacing-sm` above every group that
      follows another group, and it deliberately does NOT apply after a
      `<CommandMenu.Separator>` — the separator owns the space around itself, so
      the two rules are mutually exclusive and cannot stack.
    -->
    <div
      v-if="hasHeading"
      :id="headingId"
      :data-testid="`${testId}__heading`"
      class="px-(--spacing-sm) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
    >
      {{ heading }}
    </div>
    <slot />
  </div>
</template>
