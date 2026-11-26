<script setup lang="ts">
  import DetailCustomer from '../detail-customer.vue'
  import { sampleNewCustomer, sampleNewCustomerActivity, sampleNow } from '../sample'
</script>

<template>
  <DetailCustomer
    :customer="sampleNewCustomer"
    :satisfaction="{ average: 0, surveys: 0 }"
    :tickets="[]"
    :activity="sampleNewCustomerActivity"
    :notes="[]"
    :now="sampleNow"
  />
</template>
