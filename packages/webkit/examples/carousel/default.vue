<script setup>
  import Carousel from '@aziontech/webkit/carousel'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Carousel aria-label="Customer testimonials">
    <template #controls>
      <Carousel.Previous />
      <Carousel.Next />
    </template>
    <Carousel.Item size="large">
      <Quote
        text="With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market."
        name="Fabio Ramos"
        job-title="CEO, Axur"
      />
    </Carousel.Item>
    <Carousel.Item size="large">
      <Quote
        text="Filing season triples our traffic in a week. Azion absorbs it without a capacity conversation, and we ship changes to the edge in minutes."
        name="Vitor Torres"
        job-title="CEO, Contabilizei"
      />
    </Carousel.Item>
    <Carousel.Item size="large">
      <Quote
        text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
        name="Allan Monteiro"
        job-title="CISO & Head of Technology, Magalu"
      />
    </Carousel.Item>
    <Carousel.Item size="large">
      <Quote
        text="One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers."
        name="Julian H"
        job-title="IT OPS, SRE & SEC Manager, Dafiti"
      />
    </Carousel.Item>
    <Carousel.Item size="large">
      <Quote
        text="We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five."
        name="Jane Doe"
        job-title="Head of Information Security, Netshoes"
      />
    </Carousel.Item>
  </Carousel>
</template>
