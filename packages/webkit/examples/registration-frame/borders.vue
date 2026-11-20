<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <RegistrationFrame borders="all">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="all"</div>
    </RegistrationFrame>
    <RegistrationFrame borders="x">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="x" — left and right
      </div>
    </RegistrationFrame>
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="y" — top and bottom
      </div>
    </RegistrationFrame>
    <RegistrationFrame borders="top">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="top" — one side
      </div>
    </RegistrationFrame>
    <RegistrationFrame :borders="['top', 'left']">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        :borders="['top', 'left']" — an explicit list
      </div>
    </RegistrationFrame>
    <RegistrationFrame borders="none">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="none"
      </div>
    </RegistrationFrame>
  </div>
</template>
