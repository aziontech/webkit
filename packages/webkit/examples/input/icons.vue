<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const leading = ref('')
  const trailing = ref('')
  const both = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <Input
      v-model="leading"
      placeholder="Leading icon"
    >
      <template #iconLeft>
        <i class="pi pi-globe" />
      </template>
    </Input>
    <Input
      v-model="trailing"
      placeholder="Trailing icon"
    >
      <template #iconRight>
        <i class="pi pi-search" />
      </template>
    </Input>
    <Input
      v-model="both"
      placeholder="Both icons"
    >
      <template #iconLeft>
        <i class="pi pi-globe" />
      </template>
      <template #iconRight>
        <i class="pi pi-search" />
      </template>
    </Input>
  </div>
</template>
