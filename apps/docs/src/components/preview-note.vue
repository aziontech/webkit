<script setup lang="ts">
  import Link from '@aziontech/webkit/link'

  import { messages } from '../lib/i18n'

  const LIFECYCLE_URL =
    'https://github.com/aziontech/webkit/blob/main/CONTRIBUTING.md#preview-and-ga'

  const t = messages
</script>

<template>
  <p
    class="m-0 text-body-sm text-(--text-muted)"
    data-docs-preview
  >
    {{ t.previewNote }}
    <Link
      :href="LIFECYCLE_URL"
      :label="t.previewLink"
      target="_blank"
      inline
    />
  </p>
</template>
