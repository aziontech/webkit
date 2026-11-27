<script setup>
  import McpAppFrame from '@aziontech/ui/mcp-app-frame'

  const widgetUrls = {
    'ui://status/overview': 'https://example.com/'
  }

  const known = {
    uri: 'ui://status/overview',
    mimeType: 'text/html;profile=mcp-app'
  }

  const unknown = {
    uri: 'ui://unknown/report',
    mimeType: 'text/uri-list',
    text: 'https://example.org/report'
  }

  const resolveUrl = (resource) => widgetUrls[resource.uri] ?? ''
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-md)">
    <McpAppFrame
      :resource="known"
      :resolve-url="resolveUrl"
      title="Status overview from the status tool"
    />
    <McpAppFrame
      :resource="unknown"
      :resolve-url="resolveUrl"
      title="Report from an unknown tool"
    />
  </div>
</template>
