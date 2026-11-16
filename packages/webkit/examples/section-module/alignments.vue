<script setup>
  import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <div>
    <SectionModule
      :divided="false"
      align="start"
      eyebrow="Platform"
      title="Left"
    >
      <p class="m-0 text-body-md text-(--text-muted)">The header sits at the start edge.</p>
    </SectionModule>
    <SectionModule
      align="center"
      eyebrow="Platform"
      title="Centered"
    >
      <p class="m-0 text-body-md text-(--text-muted)">The header is centered.</p>
    </SectionModule>
    <SectionModule
      align="split"
      eyebrow="Platform"
      title="Horizontal"
      description="The description takes its own column."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        The headline and its description share a row.
      </p>
    </SectionModule>
  </div>
</template>
