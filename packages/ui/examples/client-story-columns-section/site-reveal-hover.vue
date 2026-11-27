<script setup>
  import agibankExtendedReversed from '@aziontech/ui/assets/agibank-extended-reversed.svg'
  import dafitiExtendedReversed from '@aziontech/ui/assets/dafiti-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/ui/assets/madeiramadeira-extended-reversed.svg'
  import ClientStoryColumnsSection from '@aziontech/ui/client-story-columns-section'
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'

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
  <Container max-width="site">
    <Spacer hatch />

    <ClientStoryColumnsSection
      reveal="hover"
      :cells="cells"
    />

    <Spacer hatch />
  </Container>
</template>
