<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
  import Spacer from '@aziontech/webkit/spacer'
</script>

<template>
  <div>
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section above</div>
    </RegistrationFrame>
    <Spacer
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
