<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <Ticker
    label="Your Stack, Your Way"
    aria-label="Frameworks and clouds Azion runs"
    :marks="[
      'nextjs',
      'astro',
      'react',
      'vue',
      'angular',
      'nuxt',
      'gatsby',
      'hugo',
      'preact',
      'remix',
      'qwik',
      'vite',
      'aws',
      'gcp',
      'azure',
      'terraform',
      'github',
      'openai',
      'anthropic',
      'sqlite'
    ]"
  />
</template>
