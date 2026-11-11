<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'
  import SectionCommand from '@aziontech/webkit/section-command'
</script>

<template>
  <div class="flex flex-col">
    <HeroBand
      kind="centered-band"
      eyebrow="Pricing"
      title="Pay for what runs, not for what waits"
      description="Start free and grow without changing plans."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
    />
    <HeroBand
      kind="compact-band"
      eyebrow="Changelog"
      title="What shipped this month across the platform, the console and the CLI"
      title-length="long"
      description="New features and fixes, newest first."
    />
    <HeroBand
      kind="centered"
      plain
      title="Ship from your terminal"
      description="One command creates, builds and deploys a project."
    >
      <template #bottom>
        <SectionCommand value="npm create azion@latest" />
      </template>
    </HeroBand>
  </div>
</template>
