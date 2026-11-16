<script setup>
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import netshoesLogo from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import nznLogo from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import Logo from '@aziontech/webkit/logo'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import Quote from '@aziontech/webkit/quote'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <RegistrationFrame>
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
          variant="signed"
          text="Moving to the edge cut our infrastructure costs, made every page faster and freed more than 200 engineering hours a month for product work."
          name="Priya Patel"
          job-title="CTO at Acme Inc."
        >
          <template #mark>
            <Logo
              name="Acme Inc."
              size="large"
            />
          </template>
        </Quote>
      </template>
    </LogoWall>
  </RegistrationFrame>
</template>
