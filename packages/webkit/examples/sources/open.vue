<script setup>
  import Sources from '@aziontech/webkit/sources'

  const items = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Cache'
    },
    {
      title: 'Cache settings',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Applications'
    },
    {
      title: 'Purge by wildcard',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Cache'
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
