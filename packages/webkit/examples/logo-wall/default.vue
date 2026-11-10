<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import Quote from '@aziontech/webkit/quote'
  import herosparkLogo from '@aziontech/webkit/assets/herospark-extended-color.svg'
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
    >
      <template #aside>
        <Quote
          kind="signed"
          :logo="herosparkLogo"
          logo-alt="HeroSpark"
          text="Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development."
          name="Mateus Leonardi"
          job-title="CTO at HeroSpark"
        />
      </template>
    </LogoWall>
  </FrameBox>
</template>
