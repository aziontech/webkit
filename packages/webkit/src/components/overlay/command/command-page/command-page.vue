<script setup lang="ts">
  import { computed, onBeforeUnmount, provide, toRef, useAttrs } from 'vue'

  import { CommandPageInjectionKey, useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandPage',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Identifier an item opens with its `page` prop. */
      name: string
      /** Page title shown in the back control. Empty falls back to `name`. */
      title?: string
    }>(),
    {
      title: ''
    }
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()

  provide(CommandPageInjectionKey, props.name)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__page`
  )

  const isActive = computed(() => ctx.page.value === props.name)

  const unregister = ctx.registerPage(props.name, toRef(props, 'title'))

  onBeforeUnmount(() => unregister())
</script>

<template>
  <div
    v-if="isActive"
    v-bind="attrs"
    :data-testid="testId"
    :data-page="name"
    class="contents"
  >
    <slot />
  </div>
</template>
