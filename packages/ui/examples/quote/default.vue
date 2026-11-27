<script setup>
  import Quote from '@aziontech/ui/quote'
  import ThirdPartyLogo from '@aziontech/ui/third-party-logo'
</script>

<template>
  <Quote
    text="Acme keeps hundreds of storefront applications available through every launch week and holiday sale, with no capacity planning."
    name="Priya Patel"
    job-title="CTO at Acme Inc."
  >
    <template #mark>
      <ThirdPartyLogo
        name="Acme Inc."
        size="large"
      />
    </template>
  </Quote>
</template>
