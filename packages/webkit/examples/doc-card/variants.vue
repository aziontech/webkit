<script setup>
  import DocCard from '@aziontech/webkit/doc-card'
</script>

<template>
  <div class="grid gap-(--spacing-md) sm:grid-cols-2">
    <DocCard
      title="Edge Application"
      icon="pi pi-server"
      href="/docs/edge-application"
      link="Read the guide"
    >
      The plain shape: a glyph, a title, copy and a call to action.
    </DocCard>
    <DocCard
      overline="Azion CLI"
      title="Deploy from your terminal"
      icon="pi pi-desktop"
      href="/docs/cli"
    >
      An overline says who or when, for a title that does not carry it.
    </DocCard>
    <DocCard
      title="Community templates"
      href="https://github.com/aziontech"
      target="_blank"
      link="Browse on GitHub"
    >
      A card that leaves the documentation trades the chevron for a diagonal arrow.
    </DocCard>
    <DocCard title="Not a destination">
      With no href the root is a plain block, so it is neither focusable nor announced as a link.
    </DocCard>
  </div>
</template>
