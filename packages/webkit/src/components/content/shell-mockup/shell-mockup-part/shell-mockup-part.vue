<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useShellMockupContext } from '../composables/use-shell-mockup-context'

  defineOptions({ name: 'ShellMockupPart', inheritAttrs: false })

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
  const { entered, beatStyle } = useShellMockupContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-shell-mockup-part'
  )

  const style = computed(() => beatStyle(props.order))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-entered="entered || null"
    :style="style"
    class="translate-y-4 opacity-0 data-entered:translate-y-0 data-entered:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
  >
    <slot />
  </div>
</template>
