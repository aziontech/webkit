<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <FrameBox marks="all">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="all"</div>
    </FrameBox>
    <FrameBox marks="top">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="top" — both top corners
      </div>
    </FrameBox>
    <FrameBox marks="left">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="left" — both left corners
      </div>
    </FrameBox>
    <FrameBox marks="top-right">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="top-right" — one corner
      </div>
    </FrameBox>
    <FrameBox :marks="['top-left', 'bottom-right']">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        :marks="['top-left', 'bottom-right']" — an explicit list
      </div>
    </FrameBox>
    <FrameBox marks="none">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="none"</div>
    </FrameBox>
  </div>
</template>
