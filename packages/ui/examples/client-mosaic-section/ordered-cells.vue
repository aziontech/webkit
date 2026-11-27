<script setup>
  import agibankExtendedReversed from '@aziontech/ui/assets/agibank-extended-reversed.svg'
  import dafitiExtendedMono from '@aziontech/ui/assets/dafiti-extended-mono.svg'
  import exameExtendedMono from '@aziontech/ui/assets/exame-extended-mono.svg'
  import fourbankExtendedReversed from '@aziontech/ui/assets/fourbank-extended-reversed.svg'
  import gpaExtendedReversed from '@aziontech/ui/assets/gpa-extended-reversed.svg'
  import gpaPhoto from '@aziontech/ui/assets/gpa-photo.webp'
  import netshoesExtendedColor from '@aziontech/ui/assets/netshoes-extended-color.svg'
  import netshoesPhoto from '@aziontech/ui/assets/netshoes-photo.webp'
  import nznExtendedReversed from '@aziontech/ui/assets/nzn-extended-reversed.svg'
  import rennerExtendedReversed from '@aziontech/ui/assets/renner-extended-reversed.svg'
  import ClientMosaicSection from '@aziontech/ui/client-mosaic-section'

  const cells = [
    {
      logo: netshoesExtendedColor,
      logoAlt: 'Netshoes',
      photo: netshoesPhoto,
      text: 'Netshoes automatically blocks more than 4 million threats in six months',
      href: 'https://www.azion.com/en/success-case/netshoes/',
      span: '2',
      rows: '2',
      fill: 'surface'
    },
    {
      logo: dafitiExtendedMono,
      logoAlt: 'Dafiti',
      href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
      fill: 'canvas'
    },
    {
      logo: agibankExtendedReversed,
      logoAlt: 'Agibank',
      href: 'https://www.azion.com/en/success-case/agibank/'
    },
    {
      logo: rennerExtendedReversed,
      logoAlt: 'Renner',
      href: 'https://www.azion.com/en/success-case/renner/'
    },
    {
      logo: gpaExtendedReversed,
      logoAlt: 'GPA',
      photo: gpaPhoto,
      text: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
      href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/',
      rows: '2',
      fill: 'surface',
      stacked: true
    },
    {
      logo: fourbankExtendedReversed,
      logoAlt: 'Fourbank',
      href: 'https://www.azion.com/en/success-case/fourbank/',
      fill: 'canvas'
    },
    {
      logo: exameExtendedMono,
      logoAlt: 'Exame',
      href: 'https://www.azion.com/en/success-case/exame/'
    },
    {
      logo: nznExtendedReversed,
      logoAlt: 'NZN',
      href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/',
      fill: 'primary'
    }
  ]
</script>

<template>
  <ClientMosaicSection
    anchor="clients"
    aria-label="Client stories"
    link-label="Read the case study"
    :cells="cells"
  />
</template>
