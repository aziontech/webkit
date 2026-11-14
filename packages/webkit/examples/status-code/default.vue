<script setup>
  import StatusCode from '@aziontech/webkit/status-code'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <StatusCode
      :code="101"
      method="GET"
    />
    <StatusCode
      :code="200"
      method="GET"
    />
    <StatusCode
      :code="301"
      method="GET"
    />
    <StatusCode
      :code="404"
      method="POST"
    />
    <StatusCode
      :code="503"
      method="PUT"
    />
    <StatusCode :code="201" />
    <StatusCode code="n/a" />
  </div>
</template>
