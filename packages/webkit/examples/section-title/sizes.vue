<script setup>
  import SectionTitle from '@aziontech/webkit/section-title'
</script>

<template>
  <div>
    <SectionTitle
      size="small"
      align="start"
      eyebrow="Small"
      title="A subsection inside a band"
      description="The headline drops a step so it opens a part of a section without competing with the section's own header."
    />
    <SectionTitle
      size="medium"
      align="start"
      eyebrow="Medium"
      title="An ordinary section opener"
      description="The default step, and the one nearly every section header wants."
    />
    <SectionTitle
      size="large"
      align="start"
      eyebrow="Large"
      title="The headline is the statement"
      description="For a band that carries one claim and little else — the copy under it stays at reading size."
    />
  </div>
</template>
