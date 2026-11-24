<script setup>
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import ifoodLogoDark from '@aziontech/webkit/assets/ifood-extended-reversed.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import itauLogoDark from '@aziontech/webkit/assets/itau-extended-reversed.webp'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import magaluLogoDark from '@aziontech/webkit/assets/magalu-extended-reversed.svg'
  import netshoesLogo from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import netshoesLogoDark from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import zoopLogo from '@aziontech/webkit/assets/zoop-extended-color.svg'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <RegistrationFrame>
    <LogoWall
      aria-label="Clients running on Azion"
      :items="[
        {
          src: magaluLogo,
          srcDark: magaluLogoDark,
          alt: 'Magalu',
          href: 'https://www.azion.com/en/success-case/magalu/'
        },
        {
          src: ifoodLogo,
          srcDark: ifoodLogoDark,
          alt: 'iFood',
          href: 'https://www.azion.com/en/success-case/ifood/',
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone', href: 'https://www.azion.com/en/success-case/stone/' },
        {
          src: netshoesLogo,
          srcDark: netshoesLogoDark,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        { src: zoopLogo, alt: 'Zoop', href: 'https://www.azion.com/en/success-case/zoop/' },
        {
          src: itauLogo,
          srcDark: itauLogoDark,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        },
        {
          src: magaluLogo,
          srcDark: magaluLogoDark,
          alt: 'Magalu',
          href: 'https://www.azion.com/en/success-case/magalu/'
        },
        {
          src: ifoodLogo,
          srcDark: ifoodLogoDark,
          alt: 'iFood',
          href: 'https://www.azion.com/en/success-case/ifood/',
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone', href: 'https://www.azion.com/en/success-case/stone/' },
        {
          src: netshoesLogo,
          srcDark: netshoesLogoDark,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        { src: zoopLogo, alt: 'Zoop', href: 'https://www.azion.com/en/success-case/zoop/' },
        {
          src: itauLogo,
          srcDark: itauLogoDark,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        }
      ]"
    />
  </RegistrationFrame>
</template>
