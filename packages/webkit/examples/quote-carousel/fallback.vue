<script setup>
  import QuoteCarousel from '@aziontech/webkit/quote-carousel'
</script>

<template>
  <QuoteCarousel
    aria-label="Customer testimonials"
    :items="[
      {
        text: 'Orders peak in the same forty minutes every night. Azion holds the edge steady through it, so our release window is no longer the riskiest hour of the day.',
        name: 'Jane Doe',
        jobTitle: 'VP of Engineering',
        mark: 'iFood'
      },
      {
        text: 'Payments cannot wait on an origin round trip. Running the checks at the edge cut our approval latency in half and took a whole tier out of the stack.',
        name: 'John Smith',
        jobTitle: 'CTO',
        mark: 'Zoop'
      },
      {
        text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
        name: 'Allan Monteiro',
        jobTitle: 'CISO & Head of Technology',
        mark: 'magalu'
      }
    ]"
  />
</template>
