<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'

  import SpinningGlobe from './SpinningGlobe.vue'

  defineOptions({ name: 'BrandGlobeScene' })
</script>

<template>
  <div class="@container relative w-full max-w-147">
    <SpinningGlobe />
    <div
      class="absolute left-1/2 top-1/2 flex aspect-square w-[29.4%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[5.5cqw] border-[0.92cqw] border-transparent [background:linear-gradient(var(--illustration-surface),var(--illustration-surface))_padding-box,linear-gradient(45deg,var(--illustration-surface),var(--illustration-primary)_35%,var(--illustration-primary)_65%,var(--illustration-surface))_border-box]"
    >
      <Brand
        kind="reduced"
        size="large"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
