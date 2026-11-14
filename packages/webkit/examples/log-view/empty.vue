<script setup>
  import LogView from '@aziontech/webkit/log-view'
</script>

<template>
  <div class="h-[320px]">
    <LogView
      :lines="[]"
      class="h-full"
    >
      <LogView.Header />
      <LogView.Content />
    </LogView>
  </div>
</template>
