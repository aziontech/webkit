<script setup>
  import Module from '@aziontech/webkit/module'
</script>

<template>
  <div>
    <Module
      :divided="false"
      title="Deploy from Git"
      description="Connect a repository and every push builds a preview."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Merges to the main branch go to production; every other branch gets its own preview URL.
      </p>
    </Module>
    <Module
      title="Roll back in one click"
      description="Every deploy stays available, so the previous release is always one step away."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Promote any earlier deploy to production without rebuilding it.
      </p>
    </Module>
  </div>
</template>
