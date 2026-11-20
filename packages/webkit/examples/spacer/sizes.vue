<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
  import Spacer from '@aziontech/webkit/spacer'
</script>

<template>
  <div>
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="small" — one --spacing-2xl below
      </div>
    </RegistrationFrame>
    <Spacer size="small" />
    <RegistrationFrame
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="medium" — two below
      </div>
    </RegistrationFrame>
    <Spacer size="medium" />
    <RegistrationFrame
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="large" — three below
      </div>
    </RegistrationFrame>
    <Spacer size="large" />
    <RegistrationFrame
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">End</div>
    </RegistrationFrame>
  </div>
</template>
