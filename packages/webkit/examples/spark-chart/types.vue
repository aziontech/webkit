<script setup>
  import SparkChart from '@aziontech/webkit/spark-chart'
</script>

<template>
  <div class="flex flex-wrap gap-(--spacing-lg)">
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        kind="area"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        kind="line"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        kind="bar"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
  </div>
</template>
