<script setup>
  import ifoodLogo from '@aziontech/ui/assets/ifood-extended-color.svg'
  import ifoodLogoDark from '@aziontech/ui/assets/ifood-extended-reversed.svg'
  import itauLogo from '@aziontech/ui/assets/itau-extended-color.svg'
  import itauLogoDark from '@aziontech/ui/assets/itau-extended-reversed.webp'
  import magaluLogo from '@aziontech/ui/assets/magalu-extended-color.svg'
  import magaluLogoDark from '@aziontech/ui/assets/magalu-extended-reversed.svg'
  import netshoesLogo from '@aziontech/ui/assets/netshoes-extended-color.svg'
  import netshoesLogoDark from '@aziontech/ui/assets/netshoes-extended-reversed.svg'
  import stoneLogo from '@aziontech/ui/assets/stone-extended-color.svg'
  import zoopLogo from '@aziontech/ui/assets/zoop-extended-color.svg'
  import LogoWall from '@aziontech/ui/logo-wall'
  import RegistrationFrame from '@aziontech/ui/registration-frame'
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
