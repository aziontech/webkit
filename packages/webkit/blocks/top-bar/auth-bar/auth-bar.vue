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
      <AppHeader.Brand>
        <a
          :href="homeHref"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            variant="default"
            size="small"
          />
        </a>
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="ai ai-book"
          :href="docsHref"
          @click="(event: MouseEvent) => emit('docs', event)"
        />
      </AppHeader.End>
    </AppHeader>
  </div>
</template>
