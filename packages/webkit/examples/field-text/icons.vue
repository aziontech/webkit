<script setup>
  import { ref } from 'vue'
  import FieldText from '@aziontech/webkit/field-text'

  const leading = ref('')
  const trailing = ref('')
  const both = ref('')
</script>

<template>
  <div class="flex flex-col gap-6 w-[320px]">
    <FieldText
      v-model="leading"
      label="With leading icon"
      placeholder="example.com"
    >
      <template #iconLeft>
        <i class="pi pi-globe" />
      </template>
    </FieldText>
    <FieldText
      v-model="trailing"
      label="With trailing icon"
      placeholder="example.com"
    >
      <template #iconRight>
        <i class="pi pi-times" />
      </template>
    </FieldText>
    <FieldText
      v-model="both"
      label="With both icons"
      placeholder="example.com"
    >
      <template #iconLeft>
        <i class="pi pi-globe" />
      </template>
      <template #iconRight>
        <i class="pi pi-times" />
      </template>
    </FieldText>
  </div>
</template>
