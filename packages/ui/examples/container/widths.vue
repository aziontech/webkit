<script setup>
  import Container from '@aziontech/ui/container'
  import RegistrationFrame from '@aziontech/ui/registration-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <Container max-width="4xl">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          4xl
        </div></RegistrationFrame
      >
    </Container>
    <Container max-width="6xl">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          6xl
        </div></RegistrationFrame
      >
    </Container>
    <Container max-width="site">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          site
        </div></RegistrationFrame
      >
    </Container>
  </div>
</template>
