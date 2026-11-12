<script setup>
  import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'
  import agibankExtendedColor from '@aziontech/webkit/assets/agibank-extended-color.svg'
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import bancoDeLaNacionExtendedMono from '@aziontech/webkit/assets/banco-de-la-nacion-extended-mono.svg'
  import crefisaExtendedReversed from '@aziontech/webkit/assets/crefisa-extended-reversed.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import marisaExtendedColor from '@aziontech/webkit/assets/marisa-extended-color.svg'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
  import zoopExtendedColor from '@aziontech/webkit/assets/zoop-extended-color.svg'
</script>

<template>
  <LogoWallQuote
    eyebrow="Customers"
    title="Trusted by the world's largest banks and e-commerce companies"
    aria-label="Banks and e-commerce companies running on Azion"
    :logos="[
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
        logoTreatment: 'invert-light',
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
        logoTreatment: 'invert-light',
        href: 'https://www.azion.com/en/success-case/fourbank/'
      },
      {
        name: 'Marisa',
        logo: marisaExtendedColor,
        href: 'https://www.azion.com/en/success-case/marisa/'
      }
    ]"
    :quote="{
      text: '&quot;Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.&quot;',
      name: 'Ismael Aguilar',
      jobTitle: 'Information Security Manager at Zoop',
      logo: zoopExtendedColor,
      logoAlt: 'Zoop'
    }"
    :primary-action="{
      label: 'Read the case study',
      href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/',
      trailing: true,
      target: '_blank'
    }"
  />
</template>
