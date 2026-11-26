<script setup>
  import Carousel from '@aziontech/ui/carousel'
  import Quote from '@aziontech/ui/quote'
</script>

<template>
  <Carousel aria-label="Customer testimonials">
    <template #controls>
      <Carousel.Previous />
      <Carousel.Next />
    </template>
    <Carousel.Item size="small">
      <Quote
        text="We moved checkout to the edge in a single sprint. Pages now answer in under 50 ms in every region, and nobody on the team manages a server."
        name="Jane Doe"
        job-title="VP of Engineering, Acme Inc."
      />
    </Carousel.Item>
    <Carousel.Item size="small">
      <Quote
        text="Launch week triples our traffic. The platform absorbs it without a capacity conversation, and we ship changes to production in minutes."
        name="John Smith"
        job-title="Head of Platform, Acme Inc."
      />
    </Carousel.Item>
    <Carousel.Item size="small">
      <Quote
        text="Acme keeps hundreds of storefront applications available through every launch week and holiday sale, with no capacity planning."
        name="Priya Patel"
        job-title="CTO, Acme Inc."
      />
    </Carousel.Item>
    <Carousel.Item size="small">
      <Quote
        text="Easy to set up and easy to integrate, with the speed and low latency that make a real difference for our customers."
        name="Sam Lee"
        job-title="Site Reliability Lead, Acme Inc."
      />
    </Carousel.Item>
    <Carousel.Item size="small">
      <Quote
        text="We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five."
        name="Alex Morgan"
        job-title="Head of Information Security, Acme Inc."
      />
    </Carousel.Item>
  </Carousel>
</template>
