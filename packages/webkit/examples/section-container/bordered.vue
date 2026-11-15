<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
  import SectionContainer from '@aziontech/webkit/section-container'
</script>

<template>
  <SectionContainer :bordered="false">
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">
        A column inside another frame draws no sides
      </div>
    </RegistrationFrame>
  </SectionContainer>
</template>
