<script setup lang="ts">
  import DocPage from './doc-page.vue'
  import DocSidebar from './doc-sidebar.vue'

  /**
   * The whole documentation surface: the navigation rail beside a `DocPage`.
   * This is the frame docs.azion.com renders — one MDX file dropped into a
   * shell that already knows where the reader is and where they can go next.
   */
  defineOptions({ name: 'DocShell' })

  interface Props {
    /** The page's MDX source. */
    source?: string
    /** The sidebar's section tree. */
    nav?: Array<{ label: string; items: Array<{ label: string; href?: string; active?: boolean }> }>
    /** Ancestor trail, current page last. */
    breadcrumb?: Array<{ label: string; href?: string }>
    /** The page before this one. */
    previous?: { title: string; href: string } | null
    /** The page after this one. */
    next?: { title: string; href: string } | null
  }

  withDefaults(defineProps<Props>(), {
    source: '',
    nav: () => [],
    breadcrumb: () => [],
    previous: null,
    next: null
  })
</script>

<template>
  <div
    data-testid="doc-shell"
    class="flex h-screen max-h-screen w-full overflow-hidden bg-(--bg-canvas)"
  >
    <div class="hidden h-full shrink-0 md:block">
      <DocSidebar :groups="nav" />
    </div>
    <div class="flex h-full min-h-0 min-w-0 flex-1 overflow-hidden">
      <DocPage
        :source="source"
        :breadcrumb="breadcrumb"
        :previous="previous"
        :next="next"
      />
    </div>
  </div>
</template>
