<script setup lang="ts">
  import DetailResource from '../detail-resource.vue'
  import { neverDeployedResource } from '../sample'
</script>

<template>
  <DetailResource :resource="neverDeployedResource" />
</template>
