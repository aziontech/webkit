<script setup>
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import netshoesLogo from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import nznLogo from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import FrameBox from '@aziontech/webkit/frame-box'
  import LogoWall from '@aziontech/webkit/logo-wall'
</script>

<template>
  <FrameBox>
    <LogoWall
      aria-label="Clients running on Azion"
      :items="[
        { src: magaluLogo, alt: 'Magalu', href: 'https://www.azion.com/en/success-case/magalu/' },
        {
          src: ifoodLogo,
          alt: 'iFood',
          href: 'https://www.azion.com/en/success-case/ifood/',
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone', href: 'https://www.azion.com/en/success-case/stone/' },
        {
          src: netshoesLogo,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        { src: nznLogo, alt: 'NZN', href: 'https://www.azion.com/en/success-case/nzn/' },
        {
          src: itauLogo,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        },
        { src: magaluLogo, alt: 'Magalu', href: 'https://www.azion.com/en/success-case/magalu/' },
        {
          src: ifoodLogo,
          alt: 'iFood',
          href: 'https://www.azion.com/en/success-case/ifood/',
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone', href: 'https://www.azion.com/en/success-case/stone/' },
        {
          src: netshoesLogo,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        { src: nznLogo, alt: 'NZN', href: 'https://www.azion.com/en/success-case/nzn/' },
        {
          src: itauLogo,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        }
      ]"
    />
  </FrameBox>
</template>
