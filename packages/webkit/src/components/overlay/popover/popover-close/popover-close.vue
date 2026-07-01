<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverClose',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__close`
  )

  function onClick() {
    ctx.setOpen(false)
    ctx.focusTrigger()
  }
</script>

<template>
  <IconButton
    v-bind="attrs"
    icon="pi pi-times"
    ariaLabel="Close"
    kind="outlined"
    size="small"
    :data-testid="testId"
    @click="onClick"
  />
</template>
