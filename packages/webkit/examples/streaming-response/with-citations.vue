<script setup>
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'

  const sources = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/products/cache/real-time-purge/',
      description: 'Azion documentation · Cache'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/'
    }
  ]

  const content =
    'A purge reaches every data center in a few seconds [1]. The next request for that object goes to the origin, and the response is cached again with the TTL from your cache settings [2].'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <StreamingResponse
      :content="content"
      :sources="sources"
      anchor="purge-citations"
    />
    <Sources
      :items="sources"
      anchor="purge-citations"
    />
  </div>
</template>
