<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'

  export interface AuthBarProps {
    /** Where the brand goes. */
    homeHref?: string
    /** Where Documentation goes. */
    docsHref?: string
  }

  withDefaults(defineProps<AuthBarProps>(), {
    homeHref: '/home',
    docsHref: '/docs'
  })

  const emit = defineEmits<{
    docs: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand
        :href="homeHref"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="az az-book"
          :href="docsHref"
          @click="(event: MouseEvent) => emit('docs', event)"
        />
      </AppHeader.End>
    </AppHeader>
  </div>
</template>
