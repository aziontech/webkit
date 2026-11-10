<script setup>
  import { ref } from 'vue'
  import FieldText from '@aziontech/webkit/field-text'

  const accountName = ref('Acme')
  const clientId = ref('9757a')
</script>

<template>
  <div class="flex w-[360px] flex-col gap-(--spacing-lg)">
    <FieldText
      v-model="accountName"
      label="Account name"
      helper-text="What this account is called across the console."
    />
    <FieldText
      v-model="clientId"
      label="Client ID"
      readonly
      :spellcheck="false"
      helper-text="Can't be changed. Quote it when opening a support ticket."
    />
  </div>
</template>
