<script setup>
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
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
          clientName: 'Acme',
          text: 'Acme moved its storefront to the edge and now ships every release to all of its regions at once.',
          name: 'Acme',
          jobTitle: 'E-commerce'
        }
      ]"
    />
  </FrameBox>
</template>
