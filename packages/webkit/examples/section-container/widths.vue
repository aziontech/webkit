<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
  import SectionContainer from '@aziontech/webkit/section-container'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <SectionContainer max-width="4xl">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          4xl
        </div></RegistrationFrame
      >
    </SectionContainer>
    <SectionContainer max-width="6xl">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          6xl
        </div></RegistrationFrame
      >
    </SectionContainer>
    <SectionContainer max-width="site">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          site
        </div></RegistrationFrame
      >
    </SectionContainer>
  </div>
</template>
