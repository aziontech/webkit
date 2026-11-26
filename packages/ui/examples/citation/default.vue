<script setup>
  import Citation from '@aziontech/ui/citation'

  const sources = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Removes a cached object from every data center in a few seconds.',
      site: 'Azion',
      icon: 'az az-azion',
      publisher: 'Azion Technologies',
      publishedAt: '2026-03-02'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.',
      site: 'W3C',
      publisher: 'World Wide Web Consortium',
      publishedAt: '2022-06-01'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      description: 'Purge URLs, wildcards and cache keys from a terminal.',
      site: 'GitHub',
      icon: 'az az-github',
      publisher: 'aziontech'
    }
  ]
</script>

<template>
  <p class="max-w-(--container-md) text-body-lg text-(--text-default)">
    A purge reaches every data center in a few seconds
    <Citation
      :indexes="[1]"
      :sources="sources"
    />, and the next request fetches the object from the origin again
    <Citation
      :indexes="[2, 3]"
      :sources="sources"
    />.
  </p>
</template>
