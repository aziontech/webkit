<script setup>
  import Sources from '@aziontech/ui/sources'
  import StreamingResponse from '@aziontech/ui/streaming-response'

  const sources = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/products/cache/real-time-purge/',
      description: 'Removes a cached object from every data center in a few seconds.',
      site: 'Azion',
      icon: 'az az-azion'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.'
    },
    {
      title: 'Cache settings',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Set the TTL of each path and how query strings build the cache key.',
      site: 'Azion',
      icon: 'az az-azion'
    }
  ]

  const content =
    'A purge reaches every data center in a few seconds [1]. The next request for that object goes to the origin, and the response is cached again with the TTL from your cache settings [2][3].'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <StreamingResponse
      :content="content"
      :sources="sources"
    />
    <Sources :items="sources" />
  </div>
</template>
