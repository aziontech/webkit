<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <FrameBox borders="all">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="all"</div>
    </FrameBox>
    <FrameBox borders="x">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="x" — left and right
      </div>
    </FrameBox>
    <FrameBox borders="y">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="y" — top and bottom
      </div>
    </FrameBox>
    <FrameBox borders="top">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="top" — one side
      </div>
    </FrameBox>
    <FrameBox :borders="['top', 'left']">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        :borders="['top', 'left']" — an explicit list
      </div>
    </FrameBox>
    <FrameBox borders="none">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="none"
      </div>
    </FrameBox>
  </div>
</template>
