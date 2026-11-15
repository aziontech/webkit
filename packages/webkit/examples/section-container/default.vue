<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
  import SectionContainer from '@aziontech/webkit/section-container'
</script>

<template>
  <SectionContainer max-width="7xl">
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
  </SectionContainer>
</template>
