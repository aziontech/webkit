<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useConsoleMockupShellContext } from '../composables/use-console-mockup-shell-context'

  defineOptions({ name: 'ConsoleMockupShellItem', inheritAttrs: false })

  interface Props {
    /** Beat this part arrives on; each beat lands one beat after the one before it. */
    order?: number
  }

  const props = withDefaults(defineProps<Props>(), { order: 0 })

  defineSlots<{
    /** The part's content. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { entered, beatStyle } = useConsoleMockupShellContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-console-mockup-shell-item'
  )

  const style = computed(() => beatStyle(props.order))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-entered="entered || null"
    :style="style"
    class="translate-y-4 opacity-0 transition-[opacity,translate] [transition-duration:var(--console-mockup-shell-item-duration)] [transition-delay:var(--console-mockup-shell-item-delay)] ease-expressive-entrance data-entered:translate-y-0 data-entered:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
  >
    <slot />
  </div>
</template>
