<script setup>
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import DocFrame from '@aziontech/webkit/doc-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocFrame
      :src="placeholderImage"
      alt="Step 3 of Create application: the imported repository, the name, build and deploy commands, and the firewall toggle"
      hint="Everything below starts from one screen:"
    >
      <template #caption>Console, <strong>Create application</strong> — step 3</template>
    </DocFrame>
    <DocFrame
      :src="placeholderImage"
      alt="Step 3 of Create application: the imported repository, the name, build and deploy commands, and the firewall toggle"
    >
      <template #caption>
        The application is live once <strong>Create and deploy</strong> finishes — see the
        <a href="https://azion.com/documentation">CLI reference</a> or run
        <code>azion deploy</code>.
      </template>
    </DocFrame>
  </div>
</template>
