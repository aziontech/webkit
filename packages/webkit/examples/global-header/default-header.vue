<script setup>
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Default from '@aziontech/webkit/svg/azion/default'
</script>

<template>
  <GlobalHeader aria-label="Global header">
    <GlobalHeader.Left>
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
        >
          <Default />
        </a>
      </GlobalHeader.Brand>
    </GlobalHeader.Left>
    <GlobalHeader.Middle />
    <GlobalHeader.Right />
  </GlobalHeader>
</template>
