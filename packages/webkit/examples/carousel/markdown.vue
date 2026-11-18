<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Customer stories',
    '',
    '<Carousel aria-label="Customer testimonials">',
    '  <CarouselItem size="large">',
    '    <Quote text="We moved checkout to the edge in a single sprint. Pages now answer in under 50 ms in every region." name="Jane Doe" job-title="VP of Engineering, Acme Inc." />',
    '  </CarouselItem>',
    '  <CarouselItem size="large">',
    '    <Quote text="Launch week triples our traffic. The platform absorbs it without a capacity conversation." name="John Smith" job-title="Head of Platform, Acme Inc." />',
    '  </CarouselItem>',
    '  <CarouselItem size="large">',
    '    <Quote text="Easy to set up and easy to integrate, with the speed and low latency that make a real difference." name="Sam Lee" job-title="Site Reliability Lead, Acme Inc." />',
    '  </CarouselItem>',
    '</Carousel>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
