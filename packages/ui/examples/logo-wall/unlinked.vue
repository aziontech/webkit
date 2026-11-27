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
