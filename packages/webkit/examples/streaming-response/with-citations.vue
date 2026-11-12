<script setup>
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'

  const sources = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Cache'
    },
    {
      title: 'Cache settings',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Applications'
    }
  ]

  const content =
    'A purge reaches every edge location in a few seconds [1]. The next request for that object goes to the origin, and the response is cached again with the TTL from your cache settings [2].'
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
