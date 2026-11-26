<script setup>
  import Container from '@aziontech/ui/container'
  import RegistrationFrame from '@aziontech/ui/registration-frame'
</script>

<template>
  <Container :bordered="false">
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">
        A column inside another frame draws no sides
      </div>
    </RegistrationFrame>
  </Container>
</template>
