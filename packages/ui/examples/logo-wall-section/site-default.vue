<script setup>
  import agibankExtendedColor from '@aziontech/ui/assets/agibank-extended-color.svg'
  import agibankExtendedReversed from '@aziontech/ui/assets/agibank-extended-reversed.svg'
  import bancoDeLaNacionExtendedMono from '@aziontech/ui/assets/banco-de-la-nacion-extended-mono.svg'
  import crefisaExtendedReversed from '@aziontech/ui/assets/crefisa-extended-reversed.svg'
  import fourbankExtendedReversed from '@aziontech/ui/assets/fourbank-extended-reversed.svg'
  import magaluExtendedColor from '@aziontech/ui/assets/magalu-extended-color.svg'
  import marisaExtendedColor from '@aziontech/ui/assets/marisa-extended-color.svg'
  import netshoesExtendedColor from '@aziontech/ui/assets/netshoes-extended-color.svg'
  import rennerExtendedColor from '@aziontech/ui/assets/renner-extended-color.svg'
  import zoopExtendedColor from '@aziontech/ui/assets/zoop-extended-color.svg'
  import Container from '@aziontech/ui/container'
  import LogoWallSection from '@aziontech/ui/logo-wall-section'
  import Spacer from '@aziontech/ui/spacer'

  const logos = [
    {
      name: 'Magalu',
      logo: magaluExtendedColor,
      href: 'https://www.azion.com/en/success-case/magalu/'
    },
    {
      name: 'Banco de la Nación',
      logo: bancoDeLaNacionExtendedMono,
      logoTreatment: 'monochrome',
      href: 'https://www.azion.com/en/success-case/banco-de-la-nacion-achieves-speed-and-reduces-costs/'
    },
    {
      name: 'Netshoes',
      logo: netshoesExtendedColor,
      href: 'https://www.azion.com/en/success-case/netshoes/'
    },
    {
      name: 'Agibank',
      logo: agibankExtendedReversed,
      logoLight: agibankExtendedColor,
      href: 'https://www.azion.com/en/success-case/agibank/'
    },
    {
      name: 'Zoop',
      logo: zoopExtendedColor,
      href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/'
    },
    {
      name: 'Crefisa',
      logo: crefisaExtendedReversed,
      artwork: 'light',
      href: 'https://www.azion.com/en/success-case/crefisa/'
    },
    {
      name: 'Renner',
      logo: rennerExtendedColor,
      href: 'https://www.azion.com/en/success-case/renner/'
    },
    {
      name: 'Fourbank',
      logo: fourbankExtendedReversed,
      artwork: 'light',
      href: 'https://www.azion.com/en/success-case/fourbank/'
    },
    {
      name: 'Marisa',
      logo: marisaExtendedColor,
      href: 'https://www.azion.com/en/success-case/marisa/'
    }
  ]

  const quote = {
    text: 'Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.',
    name: 'Priya Patel',
    jobTitle: 'Information security manager at Zoop',
    logo: zoopExtendedColor,
    logoAlt: 'Zoop'
  }

  const primaryAction = {
    label: 'Read the case study',
    href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/',
    trailing: true,
    target: '_blank'
  }
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <LogoWallSection
      eyebrow="Customers"
      title="Trusted by the world's largest banks and e-commerce companies"
      aria-label="Banks and e-commerce companies running on Azion"
      :logos="logos"
      :quote="quote"
      :primary-action="primaryAction"
    />

    <Spacer hatch />
  </Container>
</template>
