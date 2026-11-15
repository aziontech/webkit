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
      <template #leading>
        <i class="ai ai-globe" />
      </template>
    </Input>
    <Input
      v-model="trailing"
      placeholder="Trailing icon"
    >
      <template #trailing>
        <i class="ai ai-search" />
      </template>
    </Input>
    <Input
      v-model="both"
      placeholder="Both icons"
    >
      <template #leading>
        <i class="ai ai-globe" />
      </template>
      <template #trailing>
        <i class="ai ai-search" />
      </template>
    </Input>
  </div>
</template>
