<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'

  const logos = [
    {
      name: 'Magalu',
      logo: '/marketing-components/logos/magalu-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/magalu/'
    },
    {
      name: 'Banco de la Nación',
      logo: '/marketing-components/logos/banco-de-la-nacion-extended-mono.svg',
      logoTreatment: 'monochrome',
      href: 'https://www.azion.com/en/success-case/banco-de-la-nacion-achieves-speed-and-reduces-costs/'
    },
    {
      name: 'Netshoes',
      logo: '/marketing-components/logos/netshoes-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/netshoes/'
    },
    {
      name: 'Agibank',
      logo: '/marketing-components/logos/agibank-extended-reversed.svg',
      logoLight: '/marketing-components/logos/agibank-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/agibank/'
    },
    {
      name: 'Zoop',
      logo: '/marketing-components/logos/zoop-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/'
    },
    {
      name: 'Crefisa',
      logo: '/marketing-components/logos/crefisa-extended-reversed.svg',
      logoTreatment: 'invert-light',
      href: 'https://www.azion.com/en/success-case/crefisa/'
    },
    {
      name: 'Renner',
      logo: '/marketing-components/logos/renner-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/renner/'
    },
    {
      name: 'Fourbank',
      logo: '/marketing-components/logos/fourbank-extended-reversed.svg',
      logoTreatment: 'invert-light',
      href: 'https://www.azion.com/en/success-case/fourbank/'
    },
    {
      name: 'Marisa',
      logo: '/marketing-components/logos/marisa-extended-color.svg',
      href: 'https://www.azion.com/en/success-case/marisa/'
    }
  ]

  const quote = {
    text: '"Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results."',
    name: 'Ismael Aguilar',
    jobTitle: 'Information Security Manager at Zoop',
    logo: '/marketing-components/logos/zoop-extended-color.svg',
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
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <LogoWallQuote
      eyebrow="Customers"
      title="Trusted by the world's largest banks and e-commerce companies"
      aria-label="Banks and e-commerce companies running on Azion"
      :logos="logos"
      :quote="quote"
      :primary-action="primaryAction"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
