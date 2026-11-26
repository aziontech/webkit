<script setup>
  import Container from '@aziontech/ui/container'
  import RegistrationFrame from '@aziontech/ui/registration-frame'
</script>

<template>
  <Container max-width="7xl">
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">First band</div>
    </RegistrationFrame>
    <RegistrationFrame
      flush
      borders="y"
      marks="bottom"
    >
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Second band</div>
    </RegistrationFrame>
  </Container>
</template>
