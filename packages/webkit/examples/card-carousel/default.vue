<script setup>
  import CardCarousel from '@aziontech/webkit/card-carousel'

  const items = [
    {
      eyebrow: 'E-commerce',
      title: 'E-commerce product image optimization',
      description:
        'Optimize product images for faster page loads and better conversion rates. Automatically deliver responsive images at the right size and format for each device.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'Media',
      title: 'News and media site responsive images',
      description:
        'Deliver optimized images for news articles and media content that load instantly on any device. Automatic format conversion ensures the best experience.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'UGC',
      title: 'User-generated content optimization',
      description:
        'Optimize user-uploaded images on-the-fly from your storage. Apply consistent sizing, quality, and format standards without preprocessing.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'Marketplace',
      title: 'Marketplace listing thumbnails',
      description:
        'Crop and compress every seller photo to the same frame and quality, whatever size it was uploaded at.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'SaaS',
      title: 'Avatars and workspace logos',
      description:
        'Resize profile pictures and logos for every place your product shows them, from one original in your bucket.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    },
    {
      eyebrow: 'Travel',
      title: 'Destination galleries',
      description:
        'Serve large hotel and destination photos as WebP or AVIF, so galleries stay sharp without slowing the booking flow.',
      href: '/docs/products/build/applications/image-processor',
      linkLabel: 'See example'
    }
  ]
</script>

<template>
  <CardCarousel
    title="See how to use"
    :items="items"
  />
</template>
