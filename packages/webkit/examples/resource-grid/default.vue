<script setup>
  import ResourceGrid from '@aziontech/webkit/resource-grid'
</script>

<template>
  <ResourceGrid
    eyebrow="Go Deeper"
    title="Guides and Resources"
    description="Documentation, articles, and customer stories on building secure, compliant financial applications on a distributed architecture."
    :items="[
      {
        title: 'New to Azion? Start here',
        description: 'A guide to your first steps with Azion.',
        href: '/docs'
      },
      {
        title: 'Learning Center',
        description: 'Practical knowledge to speed up, secure, and scale applications.',
        href: '/learning'
      },
      {
        title: 'How Technology Can Help You Comply with Regulations for Fintech',
        description:
          'Distributed infrastructure brings security, compliance, and monitoring together for reliable, scalable operations.',
        href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
      },
      {
        title: 'How Justa is evolving its technology to meet modern digital demands',
        description:
          'See how Justa uses the Azion Web Platform to improve security and performance in PIX and QR Code transactions.',
        href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
      }
    ]"
    :primary-action="{
      label: 'See all guides',
      href: 'https://www.azion.com/en/documentation/products/guides/',
      trailing: true,
      target: '_blank'
    }"
  />
</template>
