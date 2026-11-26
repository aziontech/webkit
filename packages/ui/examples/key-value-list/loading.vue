<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <KeyValueList
    loading
    aria-label="Workload details"
  >
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
    <KeyValueList.Item label="Region">US East (Virginia)</KeyValueList.Item>
    <KeyValueList.Item label="Domain">
      <Link
        label="shop.example.com"
        href="https://shop.example.com"
        inline
      />
    </KeyValueList.Item>
  </KeyValueList>
</template>
