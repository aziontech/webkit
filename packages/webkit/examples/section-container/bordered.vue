<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <SectionContainer :bordered="false">
    <FrameBox borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">
        A column inside another frame draws no sides
      </div>
    </FrameBox>
  </SectionContainer>
</template>
