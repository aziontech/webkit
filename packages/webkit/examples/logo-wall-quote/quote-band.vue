<script setup>
  import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'
</script>

<template>
  <div class="flex flex-col">
    <LogoWallQuote
      kind="quote"
      :quote="{
        text: 'We stopped planning capacity for campaigns. Traffic peaks just work now.',
        name: 'Ana Souza',
        jobTitle: 'Head of Platform, Agibank',
        logo: '/marketing-components/logos/agibank-extended-color.svg',
        logoAlt: 'Agibank'
      }"
      :primary-action="{ label: 'Read the story', href: '/customers/agibank', trailing: true }"
    />
    <LogoWallQuote
      kind="quote"
      quote-kind="highlight"
      :quote="{
        text: 'Our checkout got faster in every country on the first deploy.',
        name: 'Rafael Lima',
        jobTitle: 'CTO, Netshoes',
        logo: '/marketing-components/logos/netshoes-extended-color.svg',
        logoAlt: 'Netshoes'
      }"
    />
  </div>
</template>
