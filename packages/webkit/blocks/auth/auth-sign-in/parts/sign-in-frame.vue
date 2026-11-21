<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'

  export interface SignInFrameProps {
    /** Where the product mark leads. */
    homeHref?: string
    /** Where the Documentation button leads. */
    docsHref?: string
  }

  withDefaults(defineProps<SignInFrameProps>(), {
    homeHref: '/home',
    docsHref: '/docs'
  })

  defineSlots<{
    /** The signed-out bar; left out, the English bar with the product mark and Documentation renders. */
    header(): unknown
    /** The card and what sits under it, in the centred column. */
    default(): unknown
  }>()

  const FORM_COLUMN_CLASS =
    'm-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance ' +
    'starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none'
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <slot name="header">
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
          />
        </AppHeader.End>
      </AppHeader>
    </slot>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
        <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
          <div :class="FORM_COLUMN_CLASS">
            <slot />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
