<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import ClientMosaic from '@aziontech/webkit/client-mosaic'
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
  import exameExtendedMono from '@aziontech/webkit/assets/exame-extended-mono.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import gpaPhoto from '@aziontech/webkit/assets/gpa-photo.jpg'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import netshoesPhoto from '@aziontech/webkit/assets/netshoes-photo.jpg'
  import nznExtendedReversed from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
  import rennerExtendedReversed from '@aziontech/webkit/assets/renner-extended-reversed.svg'

  const stories = [
    {
      logo: netshoesExtendedColor,
      logoAlt: 'Netshoes',
      photo: netshoesPhoto,
      text: 'Netshoes automatically blocks more than 4 million threats in six months',
      href: 'https://www.azion.com/en/success-case/netshoes/',
      fill: 'surface',
      logoTreatment: 'monochrome'
    },
    {
      logo: gpaExtendedReversed,
      logoAlt: 'GPA',
      photo: gpaPhoto,
      text: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
      href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/',
      fill: 'surface',
      logoTreatment: 'monochrome'
    }
  ]

  const logos = [
    {
      logo: dafitiExtendedMono,
      logoAlt: 'Dafiti',
      href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
      fill: 'white',
      logoTreatment: 'knockout'
    },
    {
      logo: agibankExtendedReversed,
      logoAlt: 'Agibank',
      href: 'https://www.azion.com/en/success-case/agibank/',
      fill: 'canvas',
      logoTreatment: 'monochrome'
    },
    {
      logo: rennerExtendedReversed,
      logoAlt: 'Renner',
      href: 'https://www.azion.com/en/success-case/renner/',
      fill: 'canvas',
      logoTreatment: 'monochrome'
    },
    {
      logo: fourbankExtendedReversed,
      logoAlt: 'Fourbank',
      href: 'https://www.azion.com/en/success-case/fourbank/',
      fill: 'primary',
      logoTreatment: 'knockout'
    },
    {
      logo: exameExtendedMono,
      logoAlt: 'Exame',
      href: 'https://www.azion.com/en/success-case/exame/',
      fill: 'canvas',
      logoTreatment: 'monochrome'
    },
    {
      logo: nznExtendedReversed,
      logoAlt: 'NZN',
      href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/',
      fill: 'primary',
      logoTreatment: 'knockout'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ClientMosaic
      aria-label="Client stories"
      link-label="Read the case study"
      :stories="stories"
      :logos="logos"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
