<script setup>
  import SparkChart from '@aziontech/webkit/spark-chart'
</script>

<template>
  <div class="flex flex-wrap items-end gap-(--spacing-lg)">
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        size="small"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        size="medium"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        size="large"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
  </div>
</template>
