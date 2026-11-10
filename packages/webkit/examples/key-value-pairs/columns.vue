<script setup>
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <KeyValuePairs
      :columns="2"
      aria-label="Workload details in two columns"
    >
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
      <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
    </KeyValuePairs>
    <KeyValuePairs
      :columns="3"
      aria-label="Workload details in three columns"
    >
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
      <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
    </KeyValuePairs>
    <KeyValuePairs
      :columns="4"
      aria-label="Workload details in four columns"
    >
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
      <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
    </KeyValuePairs>
  </div>
</template>
