<script setup>
  import ToolCall from '@aziontech/webkit/tool-call'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <ToolCall
      name="purge_urls"
      title="Purging one URL"
      state="pending"
    />
    <ToolCall
      name="list_workloads"
      title="Listing your workloads"
      state="running"
    />
    <ToolCall
      name="get_cache_settings"
      title="Reading the cache settings of storefront"
      state="success"
    />
    <ToolCall
      name="get_metrics"
      title="Reading the error rate"
      state="error"
    />
    <ToolCall
      name="delete_domain"
      title="Deleting www.example.com"
      state="denied"
    />
  </div>
</template>
