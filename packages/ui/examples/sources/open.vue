<script setup>
  import Sources from '@aziontech/ui/sources'

  const items = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/products/cache/real-time-purge/',
      description: 'Removes a cached object from every data center in a few seconds.',
      site: 'Azion',
      icon: 'az az-azion',
      publisher: 'Azion Technologies',
      publishedAt: '2026-03-02'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      description: 'Purge URLs, wildcards and cache keys from a terminal.',
      site: 'GitHub',
      icon: 'az az-github',
      publisher: 'aziontech'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.',
      publisher: 'World Wide Web Consortium',
      publishedAt: '2022-06-01'
    },
    {
      title: 'Cache-Control',
      href: 'https://www.npmjs.com/package/cache-control',
      description: 'A package that writes Cache-Control headers.',
      cited: false
    }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <Sources
      :items="items"
      default-open
    />
  </div>
</template>
