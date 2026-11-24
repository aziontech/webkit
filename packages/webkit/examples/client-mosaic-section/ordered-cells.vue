<script setup>
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
  import ClientMosaicSection from '@aziontech/webkit/client-mosaic-section'

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
      href: 'https://www.azion.com/en/success-case/dafiti/',
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
      href: 'https://www.azion.com/en/success-case/nzn/',
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
