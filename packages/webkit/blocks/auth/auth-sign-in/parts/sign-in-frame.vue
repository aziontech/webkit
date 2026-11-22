<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'

  export interface SignInFrameProps {
    /** Where the product mark leads. */
    homeHref?: string
    /** Where the Documentation button leads. */
    docsHref?: string
    /** The words of the signed-out bar in the app's language. */
    labels?: { console: string; home: string; documentation: string }
  }

  withDefaults(defineProps<SignInFrameProps>(), {
    homeHref: '/home',
    docsHref: '/docs',
    labels: () => ({ console: 'Console', home: 'Azion home', documentation: 'Documentation' })
  })

  defineSlots<{
    /** The card and what sits under it, in the centred column. */
    default(): unknown
  }>()

  const FORM_COLUMN_CLASS =
    'm-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance ' +
    'starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none'
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      :aria-label="labels.console"
      class="shrink-0"
    >
      <AppHeader.Brand
        :href="homeHref"
        :aria-label="labels.home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          :label="labels.documentation"
          variant="outline"
          size="medium"
          icon="az az-book"
          :href="docsHref"
        />
      </AppHeader.End>
    </AppHeader>

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
