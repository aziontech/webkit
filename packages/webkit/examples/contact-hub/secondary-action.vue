<script setup>
  import ContactHub from '@aziontech/webkit/contact-hub'
</script>

<template>
  <ContactHub
    anchor="contact"
    :lanes="[
      {
        icon: 'pi pi-briefcase',
        title: 'Sales',
        description: 'Discuss your requirements, get custom pricing, or see the platform running.',
        action: { label: 'Talk to sales', href: '/contact/sales', trailing: true },
        secondaryAction: { label: 'See pricing', href: '/pricing' }
      },
      {
        icon: 'pi pi-headphones',
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
        icon: 'pi pi-users',
        title: 'Join the community',
        description: 'Ask other developers and the team. Open to everyone, on any plan.',
        href: 'https://community.example.com/',
        target: '_blank'
      },
      {
        icon: 'pi pi-book',
        title: 'Read the docs',
        description: 'Guides, API reference and troubleshooting for every product.',
        href: 'https://example.com/docs',
        target: '_blank'
      }
    ]"
  />
</template>
