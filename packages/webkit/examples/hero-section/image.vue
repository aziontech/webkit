<script setup>
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import HeroSection from '@aziontech/webkit/hero-section'

  const image = {
    src: placeholderImage,
    alt: 'The Acme team at the office',
    width: 1200,
    height: 800
  }
</script>

<template>
  <HeroSection
    variant="copy-beside-art"
    eyebrow="Careers"
    eyebrow-prefix="</>"
    title="Build the platform developers ship on"
    description="Join a remote-first team that runs code, data and security in every region."
    :primary-action="{ label: 'See open roles', href: '/careers/jobs', trailing: true }"
    :image="image"
  />
</template>
