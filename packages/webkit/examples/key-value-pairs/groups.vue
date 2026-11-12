<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
  import Hint from '@aziontech/webkit/hint'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <KeyValuePairs
    :columns="3"
    aria-label="Workload details"
  >
    <KeyValuePairs.Group title="General">
      <KeyValuePairs.Item label="Workload ID">
        <span>1752167890</span>
        <CopyButton
          value="1752167890"
          aria-label="Copy workload ID"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Status">
        <StatusIndicator
          severity="success"
          label="Active"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
    </KeyValuePairs.Group>
    <KeyValuePairs.Group title="Networking">
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Region">
        <template #info>
          <Hint text="Where the workload was first provisioned." />
        </template>
        South America (São Paulo)
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Custom certificate" />
    </KeyValuePairs.Group>
    <KeyValuePairs.Group title="Source">
      <KeyValuePairs.Item label="Repository">acme/storefront</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Branch">main</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Framework">Next.js</KeyValuePairs.Item>
    </KeyValuePairs.Group>
  </KeyValuePairs>
</template>
