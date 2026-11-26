<script setup>
  import SparkChart from '@aziontech/webkit/spark-chart'
</script>

<template>
  <div class="w-full max-w-(--container-3xs)">
    <SparkChart :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]" />
  </div>
</template>
