<script setup>
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Default from '@aziontech/webkit/svg/azion/default'
</script>

<template>
  <GlobalHeader aria-label="Global header">
    <GlobalHeader.Start>
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
        >
          <Default />
        </a>
      </GlobalHeader.Brand>
    </GlobalHeader.Start>
    <GlobalHeader.Center />
    <GlobalHeader.End />
  </GlobalHeader>
</template>
