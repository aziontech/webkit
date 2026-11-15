<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
  import SectionGap from '@aziontech/webkit/section-gap'
</script>

<template>
  <div>
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section above</div>
    </RegistrationFrame>
    <SectionGap
      hatch
      size="large"
    />
    <RegistrationFrame
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section below</div>
    </RegistrationFrame>
  </div>
</template>
