<script setup>
  import TabView from '@aziontech/webkit/tab-view'
</script>

<template>
  <div class="flex items-center gap-(--spacing-xxs)">
    <TabView.Item
      label="Selected"
      selected
    />
    <TabView.Item label="Idle" />
    <TabView.Item
      label="Disabled"
      disabled
    />
  </div>
</template>
