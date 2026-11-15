<script setup>
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import StatusCode from '@aziontech/webkit/status-code'
  import Timestamp from '@aziontech/webkit/timestamp'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
</script>

<template>
  <WebkitProvider
    :now="NOW"
    time-zone="UTC"
  >
    <KeyValuePairs aria-label="Request details">
      <KeyValuePairs.Item label="Request">
        <StatusCode
          :code="503"
          method="POST"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Path">/api/orders</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Started">
        <Timestamp :value="1794657871204000" />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Received">
        <Timestamp
          value="2026-11-14T12:04:31.204Z"
          format="relative"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Host">app.example.com</KeyValuePairs.Item>
    </KeyValuePairs>
  </WebkitProvider>
</template>
