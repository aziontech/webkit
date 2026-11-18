<script setup>
  import CompanyLogo from '@aziontech/webkit/company-logo'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Quote
    text="Acme keeps hundreds of storefront applications available through every launch week and holiday sale, with no capacity planning."
    name="Priya Patel"
    job-title="CTO at Acme Inc."
  >
    <template #mark>
      <CompanyLogo
        name="Acme Inc."
        size="large"
      />
    </template>
  </Quote>
</template>
