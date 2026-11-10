<script setup>
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocFrame
      src="/media/create-application-step-3-loop.webm"
      alt="Landing on step 3 of Create application"
      autoplay
      caption="Autoplay: muted, inline, looping, no controls"
    />
    <DocFrame caption="The same rule reaches a clip written by hand">
      <video
        autoplay
        src="/media/create-application-step-3-loop.webm"
        class="block h-auto w-full rounded-(--shape-elements)"
      ></video>
    </DocFrame>
  </div>
</template>
