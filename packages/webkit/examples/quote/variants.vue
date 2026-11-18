<script setup>
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import CompanyLogo from '@aziontech/webkit/company-logo'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <Quote
      variant="inline"
      text="Acme keeps hundreds of storefront applications available through every launch week and holiday sale, with no capacity planning."
      name="Priya Patel"
      job-title="CTO at Acme Inc."
    >
      <template #mark>
        <CompanyLogo
          name="Acme Inc."
          size="medium"
        />
      </template>
    </Quote>
    <Quote
      variant="signed"
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
    <Quote
      variant="highlight"
      text="Acme keeps hundreds of storefront applications available through every launch week and holiday sale, with no capacity planning."
      name="Priya Patel"
      job-title="CTO at Acme Inc."
      :photo="placeholderImage"
    >
      <template #mark>
        <CompanyLogo
          name="Acme Inc."
          size="large"
        />
      </template>
    </Quote>
  </div>
</template>
