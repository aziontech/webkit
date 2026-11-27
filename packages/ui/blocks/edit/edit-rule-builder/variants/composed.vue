<script setup lang="ts">
  import EditRuleBuilder from '../edit-rule-builder.vue'
  import { sampleRule } from '../sample'
</script>

<template>
  <EditRuleBuilder :rule="sampleRule" />
</template>
