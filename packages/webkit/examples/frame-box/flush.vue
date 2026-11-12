<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <div>
      <FrameBox>
        <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          Stacked — first frame
        </div>
      </FrameBox>
      <FrameBox
        flush
        marks="bottom"
      >
        <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          flush — shares the rule above
        </div>
      </FrameBox>
    </div>

    <div class="flex">
      <FrameBox class="flex-1">
        <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          Row — first frame
        </div>
      </FrameBox>
      <FrameBox
        flush="left"
        marks="right"
        class="flex-1"
      >
        <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          flush="left" — shares the rule beside
        </div>
      </FrameBox>
    </div>
  </div>
</template>
