<script setup>
  import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocFrame
      :src="placeholderClip"
      alt="Landing on step 3 of Create application"
      autoplay
      caption="Autoplay: muted, inline and looping, with a pause control"
    />
    <DocFrame caption="The same rule reaches a clip written by hand">
      <video
        autoplay
        muted
        :src="placeholderClip"
        aria-label="Opening the Rules engine tab"
        class="block h-auto w-full rounded-(--shape-control)"
      ></video>
    </DocFrame>
  </div>
</template>
