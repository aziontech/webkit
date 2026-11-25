<script setup lang="ts">
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import { useHead } from '@unhead/vue'
  import { computed, defineAsyncComponent } from 'vue'

  import { messages } from '../lib/i18n'

  const IconsView = defineAsyncComponent(() => import('../components/icons-view.vue'))

  const t = messages

  useHead({
    title: 'Icons — WebKit',
    meta: [{ name: 'description', content: computed(() => t.value.iconsLead) }]
  })
</script>

<template>
  <div
    class="flex w-full flex-col gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <DocPageHeader
      :title="t.icons"
      :description="t.iconsLead"
      :breadcrumbs="[{ label: t.assets, href: '/assets' }, { label: t.icons }]"
    />
    <IconsView />
  </div>
</template>
