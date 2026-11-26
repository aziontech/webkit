<script setup>
  import ContactHubSection from '@aziontech/webkit/contact-hub-section'
</script>

<template>
  <ContactHubSection
    anchor="contact"
    :lanes="[
      {
        icon: 'az az-briefcase',
        title: 'Sales',
        description: 'Discuss your requirements, get custom pricing, or see the platform running.',
        action: { label: 'Talk to sales', href: '/contact/sales', trailing: true },
        secondaryAction: { label: 'See pricing', href: '/pricing' }
      },
      {
        icon: 'az az-headphones',
        title: 'Support',
        description: 'Open a ticket from your account. Engineers pick it up 24/7 on paid plans.',
        action: { label: 'Open a ticket', href: '/support', trailing: true },
        statusLink: {
          label: 'System status',
          href: 'https://status.example.com/',
          target: '_blank'
        }
      }
    ]"
    :channels="[
      {
        icon: 'az az-users',
        title: 'Join the community',
        description: 'Ask other developers and the team. Open to everyone, on any plan.',
        href: 'https://community.example.com/',
        target: '_blank'
      },
      {
        icon: 'az az-book',
        title: 'Read the docs',
        description: 'Guides, API reference and troubleshooting for every product.',
        href: 'https://example.com/docs',
        target: '_blank'
      }
    ]"
  />
</template>
