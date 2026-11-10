<script setup>
  import QuoteCarousel from '@aziontech/webkit/quote-carousel'
  import SectionTitle from '@aziontech/webkit/section-title'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl) py-(--spacing-xxl)">
    <SectionTitle
      kind="left"
      :framed="false"
      title="Battle-Tested by the World's Largest Banks and E-commerce Companies"
    />
    <QuoteCarousel
      aria-label="Customer testimonials"
      :items="[
        {
          text: 'With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market.',
          name: 'Fabio Ramos',
          jobTitle: 'CEO',
          mark: 'axur'
        },
        {
          text: 'Filing season triples our traffic in a week. Azion absorbs it without a capacity conversation, and we ship changes to the edge in minutes.',
          name: 'Vitor Torres',
          jobTitle: 'CEO',
          mark: 'contabilizei'
        },
        {
          text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
          name: 'Allan Monteiro',
          jobTitle: 'CISO & Head of Technology',
          mark: 'magalu'
        },
        {
          text: 'One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers.',
          name: 'Julian H',
          jobTitle: 'IT OPS, SRE & SEC Manager',
          mark: 'dafiti'
        },
        {
          text: 'We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five.',
          name: 'Renata Alves',
          jobTitle: 'Head of Information Security',
          mark: 'netshoes'
        }
      ]"
    />
  </div>
</template>
