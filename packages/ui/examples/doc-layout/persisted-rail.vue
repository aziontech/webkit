<script setup lang="ts">
  import DocHeading from '@aziontech/ui/doc-heading'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/ui/doc-layout'
  import DocPageHeader from '@aziontech/ui/doc-page-header'
  import DocProse from '@aziontech/ui/doc-prose'
  import { onMounted, ref, watch } from 'vue'

  const STORAGE_KEY = 'acme-docs-rail'

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Fundamentals',
      items: [
        { id: 'overview', label: 'Overview', href: '/docs' },
        { id: 'first-deploy', label: 'First deploy', href: '/docs/first-deploy' },
        { id: 'domains', label: 'Domains', href: '/docs/domains' }
      ]
    }
  ]

  const open = ref(true)
  const width = ref<number | null>(null)

  onMounted(() => {
    try {
      const saved = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (saved) {
        open.value = saved.open !== false
        width.value = typeof saved.width === 'number' ? saved.width : null
      }
    } catch {
      return
    }
  })

  watch([open, width], () => {
    try {
      globalThis.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ open: open.value, width: width.value })
      )
    } catch {
      return
    }
  })
</script>

<template>
  <DocLayout
    v-model:navigation-open="open"
    v-model:navigation-width="width"
    :navigation="navigation"
    active-id="first-deploy"
  >
    <div class="layout-boundary">
      <div class="layout-column-content flex flex-col gap-(--spacing-lg)">
        <DocPageHeader
          title="First deploy"
          description="Drag the rail's edge or collapse it; reload and it keeps its size."
        />
        <DocProse>
          <DocHeading
            anchor="resize-the-rail"
            :level="2"
            >Resize the rail</DocHeading
          >
          <p>
            Drag the edge of the navigation, or focus it and use the arrow keys. Collapse it from
            the button at its foot and bring it back from the edge.
          </p>
        </DocProse>
      </div>
    </div>
  </DocLayout>
</template>
