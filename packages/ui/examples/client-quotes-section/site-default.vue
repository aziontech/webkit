<script setup>
  import axurExtendedReversed from '@aziontech/webkit/assets/axur-extended-reversed.svg'
  import contabilizeiExtendedReversed from '@aziontech/webkit/assets/contabilizei-extended-reversed.svg'
  import dafitiExtendedReversed from '@aziontech/webkit/assets/dafiti-extended-reversed.svg'
  import herosparkExtendedColor from '@aziontech/webkit/assets/herospark-extended-color.svg'
  import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import zoopExtendedColor from '@aziontech/webkit/assets/zoop-extended-color.svg'
  import ClientQuotesSection from '@aziontech/webkit/client-quotes-section'
  import Container from '@aziontech/webkit/container'
  import Spacer from '@aziontech/webkit/spacer'

  const items = [
    {
      logo: dafitiExtendedReversed,
      clientName: 'Dafiti',
      text: "One of the best CDN and WAF solutions I've ever used. Easy to implement and integrate, with speed and low latency that make a real difference for our customers.",
      name: 'Jane Doe',
      jobTitle: 'IT operations manager at Dafiti'
    },
    {
      logo: axurExtendedReversed,
      clientName: 'Axur',
      text: 'With Azion, we scale proprietary AI models without managing infrastructure—inspecting millions of websites daily and automating the market’s fastest threat takedown.',
      name: 'John Smith',
      jobTitle: 'CEO at Axur'
    },
    {
      logo: magaluExtendedColor,
      clientName: 'Magalu',
      text:
        'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce ' +
        'costs, and deliver the best shopping experiences to millions of customers across Latin America.',
      name: 'Alex Morgan',
      jobTitle: 'Head of technology at Magalu'
    },
    {
      logo: herosparkExtendedColor,
      clientName: 'HeroSpark',
      text: 'Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development.',
      name: 'Sam Lee',
      jobTitle: 'CTO at HeroSpark'
    },
    {
      logo: zoopExtendedColor,
      clientName: 'Zoop',
      text: 'Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.',
      name: 'Priya Patel',
      jobTitle: 'Information security manager at Zoop'
    },
    {
      logo: contabilizeiExtendedReversed,
      clientName: 'Contabilizei',
      text: 'With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed.',
      name: 'Chris Taylor',
      jobTitle: 'DevSecOps manager at Contabilizei'
    }
  ]

  const primaryAction = {
    label: 'See customer stories',
    href: '/success-cases',
    trailing: true
  }
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <ClientQuotesSection
      aria-label="Client stories"
      :items="items"
      :primary-action="primaryAction"
    />

    <Spacer hatch />
  </Container>
</template>
