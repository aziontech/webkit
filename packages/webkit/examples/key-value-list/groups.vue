<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
  import Hint from '@aziontech/webkit/hint'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <KeyValueList
    :columns="3"
    aria-label="Workload details"
  >
    <KeyValueList.Group label="General">
      <KeyValueList.Item label="Workload ID">
        <span>1752167890</span>
        <CopyButton
          value="1752167890"
          aria-label="Copy workload ID"
          size="small"
        />
      </KeyValueList.Item>
      <KeyValueList.Item label="Status">
        <StatusIndicator
          severity="success"
          label="Active"
        />
      </KeyValueList.Item>
      <KeyValueList.Item label="Created">Nov 10, 2026, 2:32 PM</KeyValueList.Item>
    </KeyValueList.Group>
    <KeyValueList.Group label="Networking">
      <KeyValueList.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          inline
        />
      </KeyValueList.Item>
      <KeyValueList.Item label="Region">
        <template #info>
          <Hint content="Where the workload was first provisioned." />
        </template>
        US East (Virginia)
      </KeyValueList.Item>
      <KeyValueList.Item label="Custom certificate" />
    </KeyValueList.Group>
    <KeyValueList.Group label="Source">
      <KeyValueList.Item label="Repository">acme/storefront</KeyValueList.Item>
      <KeyValueList.Item label="Branch">main</KeyValueList.Item>
      <KeyValueList.Item label="Framework">Next.js</KeyValueList.Item>
    </KeyValueList.Group>
  </KeyValueList>
</template>
