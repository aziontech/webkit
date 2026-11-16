<script setup>
  import Logo from '@aziontech/webkit/logo'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Quote
    text="Acme keeps hundreds of storefront applications available through every launch week and holiday sale, with no capacity planning."
    name="Priya Patel"
    job-title="CTO at Acme Inc."
  >
    <template #mark>
      <Logo
        name="Acme Inc."
        size="large"
      />
    </template>
  </Quote>
</template>
