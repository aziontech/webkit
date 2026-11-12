<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const environment = ref('Production')
  const environments = ['Production', 'Staging', 'Preview']
</script>

<template>
  <Breadcrumb>
    <Breadcrumb.List>
      <li class="inline-flex items-center">
        <Breadcrumb.Item
          label="Workloads"
          href="#"
        />
      </li>
      <Breadcrumb.Separator />
      <li class="inline-flex items-center">
        <Breadcrumb.Item
          label="workload_01"
          href="#"
        />
      </li>
      <Breadcrumb.Separator />
      <li class="inline-flex min-w-0 items-center">
        <Select
          v-model="environment"
          kind="transparent"
          size="small"
        >
          <Select.Trigger aria-label="Switch environment" />
          <Select.Content>
            <Select.Group label="Environments">
              <Select.Option
                v-for="name in environments"
                :key="name"
                :value="name"
                >{{ name }}</Select.Option
              >
            </Select.Group>
          </Select.Content>
        </Select>
      </li>
    </Breadcrumb.List>
  </Breadcrumb>
</template>
