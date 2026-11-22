<script setup>
  import Citation from '@aziontech/webkit/citation'
</script>

<template>
  <p class="max-w-(--container-md) text-body-lg text-(--text-default)">
    A purge reaches every data center in a few seconds
    <Citation
      :index="1"
      title="Real-Time Purge"
      site="azion.com"
      href="https://www.azion.com/en/documentation/"
    />, and cached objects are fetched again from the origin on the next request
    <Citation
      :index="2"
      title="HTTP Caching (RFC 9111)"
      site="w3.org"
      href="#cache-answer-source-2"
    />.
  </p>
</template>
