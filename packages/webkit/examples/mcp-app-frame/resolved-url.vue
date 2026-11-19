<script setup>
  import McpAppFrame from '@aziontech/webkit/mcp-app-frame'

  const trusted = {
    uri: 'ui://status/overview',
    mimeType: 'text/uri-list',
    text: 'https://example.com/'
  }

  const untrusted = {
    uri: 'ui://unknown/report',
    mimeType: 'text/uri-list',
    text: 'http://example.org/report'
  }

  const trustedServers = ['ui://status/']

  const resolveUrl = (resource) =>
    trustedServers.some((prefix) => resource.uri.startsWith(prefix)) ? (resource.text ?? '') : ''
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-md)">
    <McpAppFrame
      :resource="trusted"
      :resolve-url="resolveUrl"
      title="Status overview from the status tool"
    />
    <McpAppFrame
      :resource="untrusted"
      :resolve-url="resolveUrl"
      title="Report from an unknown tool"
    />
  </div>
</template>
