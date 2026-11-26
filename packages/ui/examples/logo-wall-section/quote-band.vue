<script setup>
  import agibankExtendedColor from '@aziontech/ui/assets/agibank-extended-color.svg'
  import netshoesExtendedColor from '@aziontech/ui/assets/netshoes-extended-color.svg'
  import LogoWallSection from '@aziontech/ui/logo-wall-section'
</script>

<template>
  <div class="flex flex-col">
    <LogoWallSection
      variant="quote"
      :quote="{
        text: 'We stopped planning capacity for campaigns. Traffic peaks just work now.',
        name: 'Jane Doe',
        jobTitle: 'Head of Platform, Agibank',
        logo: agibankExtendedColor,
        logoAlt: 'Agibank'
      }"
      :primary-action="{ label: 'Read the story', href: '/customers/agibank', trailing: true }"
    />
    <LogoWallSection
      variant="quote"
      quote-variant="highlight"
      :quote="{
        text: 'Our checkout got faster in every country on the first deploy.',
        name: 'John Smith',
        jobTitle: 'CTO, Netshoes',
        logo: netshoesExtendedColor,
        logoAlt: 'Netshoes'
      }"
    />
  </div>
</template>
