<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'
  import ToolCall from '@aziontech/webkit/tool-call'

  const input = JSON.stringify({ workload: 'storefront' }, null, 2)
  const output = JSON.stringify({ cache_by_query_string: 'all', ttl: 3600 }, null, 2)
  const failure = JSON.stringify({ error: 'metrics_unavailable', retry_after: 30 }, null, 2)
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <ToolCall
      name="get_cache_settings"
      title="Reading the cache settings of storefront"
      state="success"
    >
      <template #input>
        <CodeBlock
          :tabs="[{ label: 'JSON', value: 'input', code: input, language: 'json' }]"
          :show-line-numbers="false"
        />
      </template>
      <template #output>
        <CodeBlock
          :tabs="[{ label: 'JSON', value: 'output', code: output, language: 'json' }]"
          :show-line-numbers="false"
        />
      </template>
    </ToolCall>
    <ToolCall
      name="get_metrics"
      title="Reading the error rate"
      state="error"
      default-open
    >
      <template #output>
        <CodeBlock
          :tabs="[{ label: 'JSON', value: 'error', code: failure, language: 'json' }]"
          :show-line-numbers="false"
        />
      </template>
    </ToolCall>
  </div>
</template>
