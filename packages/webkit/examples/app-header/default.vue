<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import Default from '@aziontech/webkit/svg/azion/default'
</script>

<template>
  <AppHeader aria-label="Global header">
    <AppHeader.Start>
      <AppHeader.Brand
        href="/"
        aria-label="Azion home"
      >
        <Default />
      </AppHeader.Brand>
    </AppHeader.Start>
    <AppHeader.Center />
    <AppHeader.End />
  </AppHeader>
</template>
