<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import KeyValueList from '@aziontech/ui/key-value-list'
  import PageHeader from '@aziontech/ui/page-header'
  import StatusIndicator from '@aziontech/ui/status-indicator'

  defineProps<{ open: boolean }>()

  const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <div class="layout-section-start flex flex-col gap-(--layout-section-gap)">
      <PageHeader
        title="storefront"
        description="Workload · Production"
      >
        <template #actions>
          <Button
            label="Agent"
            variant="outline"
            size="medium"
            icon="az az-ask-azion"
            :aria-expanded="open ? 'true' : 'false'"
            @click="emit('open')"
          />
        </template>
      </PageHeader>
      <Card>
        <template #default>
          <div class="p-(--spacing-md)">
            <KeyValueList
              :columns="3"
              aria-label="Workload details"
            >
              <KeyValueList.Item label="Status">
                <StatusIndicator
                  severity="danger"
                  label="Errors above 30%"
                />
              </KeyValueList.Item>
              <KeyValueList.Item label="Domains"
                >www.example.com, shop.example.com</KeyValueList.Item
              >
              <KeyValueList.Item label="Origin">api.example.com</KeyValueList.Item>
              <KeyValueList.Item label="Cache hit ratio">91%</KeyValueList.Item>
              <KeyValueList.Item label="Last deployment">Today, 13:58</KeyValueList.Item>
              <KeyValueList.Item label="Region">US East (Washington)</KeyValueList.Item>
            </KeyValueList>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
