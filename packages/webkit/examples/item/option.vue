<script setup>
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import { computed, ref } from 'vue'

  const workloads = ['workload_01', 'workload_02', 'workload_03', 'workload_04']
  const query = ref('')
  const selected = ref('workload_02')
  const visible = computed(() =>
    workloads.filter((name) => name.includes(query.value.trim().toLowerCase()))
  )
</script>

<template>
  <div class="flex w-full max-w-(--container-2xs) flex-col gap-(--spacing-xs)">
    <Input
      v-model="query"
      size="large"
      placeholder="Find workload…"
      aria-label="Find workload"
      autocomplete="off"
    />
    <div class="flex flex-col">
      <Item
        v-for="name in visible"
        :key="name"
        kind="option"
        as-child
      >
        <button
          type="button"
          class="w-full text-start"
          :aria-pressed="selected === name"
          @click="selected = name"
        >
          <Item.Media>
            <i
              class="ai ai-workloads text-body-md leading-none text-(--text-muted)"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ name }}</Item.Title>
          </Item.Content>
          <Item.Actions v-if="selected === name">
            <i
              class="pi pi-check text-body-sm leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </Item.Actions>
        </button>
      </Item>
    </div>
  </div>
</template>
