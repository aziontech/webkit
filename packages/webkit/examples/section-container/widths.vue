<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionContainer from '@aziontech/webkit/section-container'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <SectionContainer max-width="4xl">
      <FrameBox borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          4xl
        </div></FrameBox
      >
    </SectionContainer>
    <SectionContainer max-width="6xl">
      <FrameBox borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          6xl
        </div></FrameBox
      >
    </SectionContainer>
    <SectionContainer max-width="site">
      <FrameBox borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          site
        </div></FrameBox
      >
    </SectionContainer>
  </div>
</template>
