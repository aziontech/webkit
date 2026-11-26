<script setup>
  import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocFrame
      :src="placeholderImage"
      alt="Step 3 of Create application: the imported repository, the name, build and deploy commands, and the firewall toggle"
    >
      <template #caption>Console, <strong>Create application</strong> — step 3</template>
    </DocFrame>
    <DocFrame
      :src="placeholderClip"
      alt="Creating an application from a Git repository, start to step 3"
      caption="The same flow, from the method to the deploy"
    />
  </div>
</template>
