<script setup>
  import Carousel from '@aziontech/webkit/carousel'
  import CarouselItem from '@aziontech/webkit/carousel-item'
  import CarouselNext from '@aziontech/webkit/carousel-next'
  import CarouselPrevious from '@aziontech/webkit/carousel-previous'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Carousel aria-label="Customer testimonials">
    <template #controls>
      <CarouselPrevious />
      <CarouselNext />
    </template>
    <CarouselItem class="w-[85vw] max-w-120 sm:w-120">
      <Quote
        text="With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market."
        name="Fabio Ramos"
        job-title="CEO, Axur"
      />
    </CarouselItem>
    <CarouselItem class="w-[85vw] max-w-120 sm:w-120">
      <Quote
        text="Filing season triples our traffic in a week. Azion absorbs it without a capacity conversation, and we ship changes to the edge in minutes."
        name="Vitor Torres"
        job-title="CEO, Contabilizei"
      />
    </CarouselItem>
    <CarouselItem class="w-[85vw] max-w-120 sm:w-120">
      <Quote
        text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
        name="Allan Monteiro"
        job-title="CISO & Head of Technology, Magalu"
      />
    </CarouselItem>
    <CarouselItem class="w-[85vw] max-w-120 sm:w-120">
      <Quote
        text="One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers."
        name="Julian H"
        job-title="IT OPS, SRE & SEC Manager, Dafiti"
      />
    </CarouselItem>
    <CarouselItem class="w-[85vw] max-w-120 sm:w-120">
      <Quote
        text="We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five."
        name="Renata Alves"
        job-title="Head of Information Security, Netshoes"
      />
    </CarouselItem>
  </Carousel>
</template>
