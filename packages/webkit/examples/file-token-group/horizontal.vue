<script setup>
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import { ref } from 'vue'

  const items = ref(
    ['robots.txt', 'favicon.ico', 'sitemap.xml', 'manifest.json', 'og-image.png', 'fonts.css'].map(
      (name, index) => ({ file: { name, size: 1024 * (index + 2) } })
    )
  )

  const remove = (index) => {
    items.value = items.value.filter((_, position) => position !== index)
  }
</script>

<template>
  <div class="w-full max-w-(--container-lg)">
    <FileTokenGroup
      :items="items"
      alignment="horizontal"
      :limit="3"
      @dismiss="(_event, { index }) => remove(index)"
    />
  </div>
</template>
