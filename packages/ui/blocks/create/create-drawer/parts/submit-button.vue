<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Kbd from '@aziontech/ui/kbd'
  import { toAriaKeyshortcuts } from '@aziontech/ui/use-shortcuts'

  export interface SubmitButtonProps {
    /** The save is in flight: the button spins. */
    loading?: boolean
  }

  withDefaults(defineProps<SubmitButtonProps>(), { loading: false })

  defineSlots<{
    /** The button label. */
    default(): unknown
  }>()
</script>

<template>
  <Button
    variant="primary"
    size="medium"
    :loading="loading"
    type="submit"
    :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
  >
    <slot />
    <Kbd
      meta
      key-name="enter"
      size="small"
      aria-hidden="true"
    />
  </Button>
</template>
