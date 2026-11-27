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
  import Quote from '@aziontech/ui/quote'
  import RegistrationFrame from '@aziontech/ui/registration-frame'
  import ThirdPartyLogo from '@aziontech/ui/third-party-logo'
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
          shape: 'compact'
        },
        { src: stoneLogo, alt: 'Stone' },
        {
          src: netshoesLogo,
          srcDark: netshoesLogoDark,
          alt: 'Netshoes',
          href: 'https://www.azion.com/en/success-case/netshoes/'
        },
        {
          src: zoopLogo,
          alt: 'Zoop',
          href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/'
        },
        {
          src: itauLogo,
          srcDark: itauLogoDark,
          alt: 'Itaú',
          shape: 'compact'
        }
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
