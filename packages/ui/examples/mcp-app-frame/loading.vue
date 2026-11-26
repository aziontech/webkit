<script setup>
  import McpAppFrame from '@aziontech/ui/mcp-app-frame'

  const resource = {
    uri: 'ui://analytics/traffic-map',
    mimeType: 'text/html;profile=mcp-app'
  }

  const resolveUrl = () => new Promise(() => {})
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <McpAppFrame
      :resource="resource"
      :resolve-url="resolveUrl"
      title="Traffic map from the analytics tool"
    />
  </div>
</template>
