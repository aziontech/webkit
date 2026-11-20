<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <AppHeader aria-label="Global header">
    <AppHeader.Start>
      <AppHeader.Brand
        href="/"
        aria-label="Azion home"
      >
        <Brand size="small" />
      </AppHeader.Brand>
    </AppHeader.Start>
    <AppHeader.Center />
    <AppHeader.End />
  </AppHeader>
</template>
