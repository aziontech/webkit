<script setup>
  import Carousel from '@aziontech/webkit/carousel'
  import FeatureItem from '@aziontech/webkit/feature-item'
  import SectionTitle from '@aziontech/webkit/section-title'
</script>

<template>
  <Carousel
    variant="cards"
    aria-label="Ways to use Image Processor"
  >
    <template #header>
      <SectionTitle
        variant="start"
        size="small"
        :framed="false"
        title="See how to use"
      />
    </template>
    <template #controls>
      <Carousel.Previous />
      <Carousel.Next />
    </template>
    <Carousel.Item>
      <FeatureItem
        title="E-commerce product image optimization"
        description="Serve product images at the right size and format for each device, so pages load faster and convert better."
        :heading-level="3"
      />
    </Carousel.Item>
    <Carousel.Item>
      <FeatureItem
        title="News and media site responsive images"
        description="Deliver article images that load instantly on any device, with the format chosen for each browser."
        :heading-level="3"
      />
    </Carousel.Item>
    <Carousel.Item>
      <FeatureItem
        title="User-generated content optimization"
        description="Resize and compress uploaded images on the fly from your storage, with no preprocessing step."
        :heading-level="3"
      />
    </Carousel.Item>
    <Carousel.Item>
      <FeatureItem
        title="Marketplace listing thumbnails"
        description="Crop every seller's photo to the same frame and quality, whatever size it was uploaded at."
        :heading-level="3"
      />
    </Carousel.Item>
  </Carousel>
</template>
