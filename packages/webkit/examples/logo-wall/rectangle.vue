<script setup>
  import exameLogo from '@aziontech/webkit/assets/exame-extended-color.svg'
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import marisaLogo from '@aziontech/webkit/assets/marisa-extended-color.svg'
  import netshoesLogo from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import rennerLogo from '@aziontech/webkit/assets/renner-extended-color.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import zoopLogo from '@aziontech/webkit/assets/zoop-extended-color.svg'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import Quote from '@aziontech/webkit/quote'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
  import ThirdPartyLogo from '@aziontech/webkit/third-party-logo'
</script>

<template>
  <RegistrationFrame>
    <LogoWall
      variant="rectangle"
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
        { src: exameLogo, alt: 'Exame', href: 'https://www.azion.com/en/success-case/exame/' },
        {
          src: itauLogo,
          alt: 'Itaú',
          href: 'https://www.azion.com/en/success-case/itau/',
          shape: 'compact'
        },
        { src: rennerLogo, alt: 'Renner', href: 'https://www.azion.com/en/success-case/renner/' },
        { src: marisaLogo, alt: 'Marisa', href: 'https://www.azion.com/en/success-case/marisa/' },
        { src: zoopLogo, alt: 'Zoop', href: 'https://www.azion.com/en/success-case/zoop/' }
      ]"
    >
      <template #aside>
        <Quote
          variant="signed"
          text="Moving to the edge cut our infrastructure costs, made every page faster and freed more than 200 engineering hours a month for product work."
          name="Priya Patel"
          job-title="CTO at Acme Inc."
        >
          <template #mark>
            <ThirdPartyLogo
              name="Acme Inc."
              size="large"
            />
          </template>
        </Quote>
      </template>
    </LogoWall>
  </RegistrationFrame>
</template>
