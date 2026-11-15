<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <div>
      <RegistrationFrame>
        <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          Stacked — first frame
        </div>
      </RegistrationFrame>
      <RegistrationFrame
        flush
        marks="bottom"
      >
        <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          flush — shares the rule above
        </div>
      </RegistrationFrame>
    </div>

    <div class="flex">
      <RegistrationFrame class="flex-1">
        <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          Row — first frame
        </div>
      </RegistrationFrame>
      <RegistrationFrame
        flush="left"
        marks="right"
        class="flex-1"
      >
        <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          flush="left" — shares the rule beside
        </div>
      </RegistrationFrame>
    </div>
  </div>
</template>
