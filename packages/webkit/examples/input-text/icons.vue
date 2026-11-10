<script setup>
  import InputText from '@aziontech/webkit/input-text'
  import { ref } from 'vue'

  const leading = ref('')
  const trailing = ref('')
  const both = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <InputText
      v-model="leading"
      placeholder="Leading icon"
    >
      <template #iconLeft>
        <i class="pi pi-globe" />
      </template>
    </InputText>
    <InputText
      v-model="trailing"
      placeholder="Trailing icon"
    >
      <template #iconRight>
        <i class="pi pi-search" />
      </template>
    </InputText>
    <InputText
      v-model="both"
      placeholder="Both icons"
    >
      <template #iconLeft>
        <i class="pi pi-globe" />
      </template>
      <template #iconRight>
        <i class="pi pi-search" />
      </template>
    </InputText>
  </div>
</template>
