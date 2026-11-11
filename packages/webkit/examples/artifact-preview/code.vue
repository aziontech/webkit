<script setup>
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'
  import CodeBlock from '@aziontech/webkit/code-block'
  import { ref } from 'vue'

  const opened = ref(false)
  const rules = JSON.stringify(
    {
      cache_by_query_string: 'allowlist',
      query_string_fields: ['page', 'lang'],
      browser_cache_ttl: 3600,
      edge_cache_ttl: 86400
    },
    null,
    2
  )
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <ArtifactPreview
      title="cache-rules.json"
      description="Cache settings for storefront"
      meta="1 KB · JSON"
      icon="pi pi-code"
      :copy-value="rules"
      openable
      @open="opened = true"
    >
      <CodeBlock
        :tabs="[{ label: 'JSON', value: 'json', code: rules, language: 'json' }]"
        :show-line-numbers="false"
        :copyable="false"
        :bordered="false"
      />
    </ArtifactPreview>
    <p
      v-if="opened"
      class="text-body-sm text-(--text-muted)"
    >
      The full file opens in a side panel here.
    </p>
  </div>
</template>
