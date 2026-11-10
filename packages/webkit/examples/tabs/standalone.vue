<script setup>
  import Tabs from '@aziontech/webkit/tabs'
</script>

<template>
  <div class="flex items-center gap-(--spacing-xxs)">
    <Tabs.Item
      label="Selected"
      selected
    />
    <Tabs.Item label="Idle" />
    <Tabs.Item
      label="Disabled"
      disabled
    />
  </div>
</template>
