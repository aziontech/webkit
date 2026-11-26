<script setup>
  import Module from '@aziontech/ui/module'
</script>

<template>
  <div>
    <Module
      :divided="false"
      align="start"
      eyebrow="Platform"
      title="Left"
    >
      <p class="m-0 text-body-md text-(--text-muted)">The header sits at the start edge.</p>
    </Module>
    <Module
      align="center"
      eyebrow="Platform"
      title="Centered"
    >
      <p class="m-0 text-body-md text-(--text-muted)">The header is centered.</p>
    </Module>
    <Module
      align="split"
      eyebrow="Platform"
      title="Horizontal"
      description="The description takes its own column."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        The headline and its description share a row.
      </p>
    </Module>
  </div>
</template>
