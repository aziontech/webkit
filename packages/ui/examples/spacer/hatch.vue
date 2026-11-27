<script setup>
  import RegistrationFrame from '@aziontech/ui/registration-frame'
  import Spacer from '@aziontech/ui/spacer'
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
