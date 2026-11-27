<script setup lang="ts">
  import Texture from '../../content/texture/texture.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'

  defineOptions({ name: 'SectionHatch' })
</script>

<template>
  <RegistrationFrame
    borders="none"
    marks="all"
    data-hatch="true"
    class="h-[calc(var(--spacing-2xl)*2)]"
  >
    <Texture variant="lines" />
  </RegistrationFrame>
</template>
