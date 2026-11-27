<script setup>
  import magaluLogo from '@aziontech/ui/assets/magalu-extended-color.svg'
  import QuoteTabs from '@aziontech/ui/quote-tabs'
  import RegistrationFrame from '@aziontech/ui/registration-frame'
</script>

<template>
  <RegistrationFrame>
    <QuoteTabs
      aria-label="Client stories"
      :items="[
        {
          logo: magaluLogo,
          clientName: 'Magalu',
          text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during its biggest sale campaigns of the year.',
          name: 'Magalu',
          jobTitle: 'Retail'
        },
        {
          clientName: 'Acme',
          text: 'Acme moved its storefront to the edge and now ships every release to all of its regions at once.',
          name: 'Acme',
          jobTitle: 'E-commerce'
        }
      ]"
    />
  </RegistrationFrame>
</template>
