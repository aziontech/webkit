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
        { src: magaluLogo, srcDark: magaluLogoDark, alt: 'Magalu' },
        { src: ifoodLogo, srcDark: ifoodLogoDark, alt: 'iFood', shape: 'compact' },
        { src: stoneLogo, alt: 'Stone' },
        { src: netshoesLogo, srcDark: netshoesLogoDark, alt: 'Netshoes' },
        { src: zoopLogo, alt: 'Zoop' },
        { src: itauLogo, srcDark: itauLogoDark, alt: 'Itaú', shape: 'compact' }
      ]"
    />
  </RegistrationFrame>
</template>
