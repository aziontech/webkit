<script setup>
  import Marquee from '@aziontech/webkit/marquee'
</script>

<template>
  <Marquee
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
