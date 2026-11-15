<script setup>
  import CopyCommand from '@aziontech/webkit/copy-command'
  import HeroSection from '@aziontech/webkit/hero-section'
</script>

<template>
  <div class="flex flex-col">
    <HeroSection
      variant="center"
      title-highlight="Build and run applications"
      title="globally, with no ops"
      description="Run code, AI, data, and security on 100+ data centers worldwide."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
      marquee-label="Trusted by teams running critical workloads"
      :marquee-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
    />
    <HeroSection
      variant="title-band"
      size="large"
      eyebrow="Cache"
      title="Deliver content fast, worldwide"
      description="Serve cached content close to users."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    />
    <HeroSection
      variant="pixel-floor"
      eyebrow="AI Inference"
      title="Build and deploy AI agents and applications in seconds"
      description="Run AI inference close to users on Azion’s distributed infrastructure."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Talk to a specialist', href: '/contact' }"
      marquee-label="Trusted by teams running critical workloads"
      :marquee-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
    />
    <HeroSection
      variant="copy-beside-art"
      eyebrow="AWS Alternative Comparison"
      title="AWS sells services. Your team becomes the integrator."
      description="Azion delivers one platform, distributed by default."
      :primary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
      illustration="global-network"
      illustration-aria-label="A global network of Azion data centers"
      marquee-label="Trusted by teams running critical workloads"
      :marquee-marks="['agibank', 'radware', 'america-movil', 'gpa', 'fourbank']"
    />
    <HeroSection
      variant="copy-on-top-art"
      eyebrow="Workloads"
      title="Put your application close to users in seconds"
      description="Create a workload and it is live in every data center."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
    >
      <template #bottom>
        <CopyCommand value="npm create azion@latest" />
      </template>
    </HeroSection>
  </div>
</template>
