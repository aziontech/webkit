<script setup>
  import DocFrame from '@aziontech/webkit/doc-frame'
  import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocFrame
      :src="placeholderClip"
      alt="Landing on step 3 of Create application"
      autoplay
      caption="Autoplay: muted, inline, looping, no controls"
    />
    <DocFrame caption="The same rule reaches a clip written by hand">
      <video
        autoplay
        :src="placeholderClip"
        class="block h-auto w-full rounded-(--shape-elements)"
      ></video>
    </DocFrame>
  </div>
</template>
