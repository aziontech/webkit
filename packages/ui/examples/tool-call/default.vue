<script setup>
  import ToolCall from '@aziontech/webkit/tool-call'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <ToolCall
      name="purge_urls"
      title="Purging one URL"
      status="pending"
    />
    <ToolCall
      name="create_cache_rule"
      title="Creating a cache rule for images"
      status="streaming"
    />
    <ToolCall
      name="list_workloads"
      title="Listing your workloads"
      status="running"
    />
    <ToolCall
      name="get_cache_settings"
      title="Reading the cache settings of storefront"
      status="success"
    />
    <ToolCall
      name="get_metrics"
      title="Reading the error rate"
      status="error"
    />
    <ToolCall
      name="list_certificates"
      title="Listing your certificates"
      status="canceled"
    />
    <ToolCall
      name="delete_domain"
      title="Deleting www.example.com"
      status="denied"
    />
  </div>
</template>
