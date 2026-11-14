<script setup>
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import dafitiExtendedReversed from '@aziontech/webkit/assets/dafiti-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import CustomerSpotlight from '@aziontech/webkit/customer-spotlight'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const items = [
    {
      name: 'Agibank',
      logo: agibankExtendedReversed,
      href: 'https://www.azion.com/en/success-case/agibank/',
      description: 'Agibank moved its digital bank to a platform that scales with every campaign.'
    },
    {
      name: 'Dafiti',
      logo: dafitiExtendedReversed,
      href: 'https://www.azion.com/en/success-case/dafiti/',
      description:
        'Dafiti serves its storefronts to millions of shoppers with no capacity planning.'
    },
    {
      name: 'MadeiraMadeira',
      logo: madeiramadeiraExtendedReversed,
      href: 'https://www.azion.com/en/success-case/madeiramadeira/',
      description: 'MadeiraMadeira absorbs campaign peaks without touching its origin.'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <CustomerSpotlight :items="items" />

    <SectionGap hatch />
  </SectionContainer>
</template>
