<script setup>
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import dafitiExtendedReversed from '@aziontech/webkit/assets/dafiti-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import ClientStoryColumnsSection from '@aziontech/webkit/client-story-columns-section'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const cells = [
    {
      name: 'Agibank',
      logo: agibankExtendedReversed,
      href: 'https://www.azion.com/en/success-case/agibank/',
      story: 'Agibank moved its digital bank to a platform that scales with every campaign.'
    },
    {
      name: 'Dafiti',
      logo: dafitiExtendedReversed,
      href: 'https://www.azion.com/en/success-case/dafiti/',
      story: 'Dafiti serves its storefronts to millions of shoppers with no capacity planning.'
    },
    {
      name: 'MadeiraMadeira',
      logo: madeiramadeiraExtendedReversed,
      href: 'https://www.azion.com/en/success-case/madeiramadeira/',
      story: 'MadeiraMadeira absorbs campaign peaks without touching its origin.'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ClientStoryColumnsSection
      reveal="hover"
      :cells="cells"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
