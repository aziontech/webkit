<script setup>
  import Citation from '@aziontech/webkit/citation'
</script>

<template>
  <p class="max-w-(--container-md) text-body-md text-(--text-default)">
    A purge reaches every edge location in a few seconds
    <Citation
      :index="1"
      title="Real-Time Purge"
      href="https://www.azion.com/en/documentation/"
    />, and cached objects are fetched again from the origin on the next request
    <Citation
      :index="2"
      title="Cache settings"
      href="#cache-answer-source-2"
    />.
  </p>
</template>
