<script setup>
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocFrame
      src="/docs/create-application-step-3.png"
      alt="Step 3 of Create application: the imported repository, the name, build and deploy commands, and the firewall toggle"
    >
      <template #caption>Console, <strong>Create application</strong> — step 3</template>
    </DocFrame>
    <DocFrame
      src="/media/create-application-flow.webm"
      alt="Creating an application from a Git repository, start to step 3"
      caption="The same flow, from the method to the deploy"
    />
  </div>
</template>
