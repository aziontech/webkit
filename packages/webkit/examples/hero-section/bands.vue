<script setup>
  import CopyCommandSection from '@aziontech/webkit/copy-command-section'
  import HeroSection from '@aziontech/webkit/hero-section'
</script>

<template>
  <div class="flex flex-col">
    <HeroSection
      variant="center-band"
      eyebrow="Pricing"
      title="Pay for what runs, not for what waits"
      description="Start free and grow without changing plans."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
    />
    <HeroSection
      variant="compact-band"
      eyebrow="Changelog"
      title="What shipped this month across the platform, the console and the CLI"
      title-length="long"
      description="New features and fixes, newest first."
    />
    <HeroSection
      variant="center-band"
      title="Ship from your terminal"
      description="One command creates, builds and deploys a project."
    >
      <template #bottom>
        <CopyCommandSection value="npm create azion@latest" />
      </template>
    </HeroSection>
  </div>
</template>
