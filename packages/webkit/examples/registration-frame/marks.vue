<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <RegistrationFrame marks="all">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="all"</div>
    </RegistrationFrame>
    <RegistrationFrame marks="top">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="top" — both top corners
      </div>
    </RegistrationFrame>
    <RegistrationFrame marks="left">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="left" — both left corners
      </div>
    </RegistrationFrame>
    <RegistrationFrame marks="top-right">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="top-right" — one corner
      </div>
    </RegistrationFrame>
    <RegistrationFrame :marks="['top-left', 'bottom-right']">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        :marks="['top-left', 'bottom-right']" — an explicit list
      </div>
    </RegistrationFrame>
    <RegistrationFrame marks="none">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="none"</div>
    </RegistrationFrame>
  </div>
</template>
