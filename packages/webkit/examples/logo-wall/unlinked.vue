<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import netshoesLogo from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import nznLogo from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
</script>

<template>
  <FrameBox>
    <LogoWall
      aria-label="Clients running on Azion"
      :items="[
        { src: magaluLogo, alt: 'Magalu' },
        { src: ifoodLogo, alt: 'iFood', shape: 'compact' },
        { src: stoneLogo, alt: 'Stone' },
        { src: netshoesLogo, alt: 'Netshoes' },
        { src: nznLogo, alt: 'NZN' },
        { src: itauLogo, alt: 'Itaú', shape: 'compact' }
      ]"
    />
  </FrameBox>
</template>
