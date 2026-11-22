<script setup>
  import Sources from '@aziontech/webkit/sources'

  const items = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/products/cache/real-time-purge/',
      description: 'Azion documentation · Cache'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      icon: 'az az-github'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/'
    }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <Sources
      :items="items"
      anchor="purge-answer"
      default-open
    />
  </div>
</template>
