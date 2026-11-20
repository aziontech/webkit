<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import StatusCode from '@aziontech/webkit/status-code'
  import Timestamp from '@aziontech/webkit/timestamp'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
</script>

<template>
  <ConfigProvider
    :now="NOW"
    time-zone="UTC"
  >
    <KeyValueList aria-label="Request details">
      <KeyValueList.Item label="Request">
        <StatusCode
          :code="503"
          method="POST"
        />
      </KeyValueList.Item>
      <KeyValueList.Item label="Path">/api/orders</KeyValueList.Item>
      <KeyValueList.Item label="Started">
        <Timestamp :value="1794657871204000" />
      </KeyValueList.Item>
      <KeyValueList.Item label="Received">
        <Timestamp
          value="2026-11-14T12:04:31.204Z"
          format="relative"
        />
      </KeyValueList.Item>
      <KeyValueList.Item label="Host">app.example.com</KeyValueList.Item>
    </KeyValueList>
  </ConfigProvider>
</template>
