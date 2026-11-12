<script setup>
  import herosparkLogo from '@aziontech/webkit/assets/herospark-extended-color.svg'
  import ifoodLogo from '@aziontech/webkit/assets/ifood-extended-color.svg'
  import itauLogo from '@aziontech/webkit/assets/itau-extended-color.svg'
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import stoneLogo from '@aziontech/webkit/assets/stone-extended-color.svg'
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import QuoteTabs from '@aziontech/webkit/quote-tabs'
</script>

<template>
  <FrameBox>
    <QuoteTabs
      aria-label="Client stories"
      :items="[
        {
          logo: magaluLogo,
          clientName: 'Magalu',
          text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
          name: 'Allan Monteiro',
          jobTitle: 'CISO & Head of Technology at Magalu'
        },
        {
          logo: ifoodLogo,
          clientName: 'iFood',
          shape: 'compact',
          text: 'iFood serves every order screen from the edge, so a lunch-hour peak reaches millions of customers without a capacity plan.',
          name: 'iFood',
          jobTitle: 'Food delivery'
        },
        {
          logo: herosparkLogo,
          clientName: 'HeroSpark',
          text: 'HeroSpark serves course pages and checkouts from the edge, so a launch day reaches every student without a capacity plan.',
          name: 'HeroSpark',
          jobTitle: 'Education technology'
        },
        {
          mark: 'fourbank',
          text: 'Fourbank runs its digital banking on Azion, keeping every account screen fast and protected from the first login.',
          name: 'Fourbank',
          jobTitle: 'Financial services'
        },
        {
          logo: stoneLogo,
          clientName: 'Stone',
          text: 'Stone keeps its payment flows answering in milliseconds for merchants across Brazil, peak day or not.',
          name: 'Stone',
          jobTitle: 'Payments'
        },
        {
          logo: itauLogo,
          clientName: 'Itaú',
          shape: 'compact',
          text: 'Itaú protects its digital banking channels at the edge, before a request ever reaches its origin.',
          name: 'Itaú',
          jobTitle: 'Financial services'
        }
      ]"
    >
      <template #actions>
        <Button
          label="See success stories"
          kind="secondary"
          size="large"
          href="https://www.azion.com/en/success-case/"
          target="_blank"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </QuoteTabs>
  </FrameBox>
</template>
