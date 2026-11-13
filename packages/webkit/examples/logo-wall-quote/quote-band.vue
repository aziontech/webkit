<script setup>
  import agibankExtendedColor from '@aziontech/webkit/assets/agibank-extended-color.svg'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'
</script>

<template>
  <div class="flex flex-col">
    <LogoWallQuote
      kind="quote"
      :quote="{
        text: 'We stopped planning capacity for campaigns. Traffic peaks just work now.',
        name: 'Jane Doe',
        jobTitle: 'Head of Platform, Agibank',
        logo: agibankExtendedColor,
        logoAlt: 'Agibank'
      }"
      :primary-action="{ label: 'Read the story', href: '/customers/agibank', trailing: true }"
    />
    <LogoWallQuote
      kind="quote"
      quote-kind="highlight"
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
