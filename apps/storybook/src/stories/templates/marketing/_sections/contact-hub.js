export const SITE_SECTION = {
  _id: 'contact-hub',
  props: {
    lanes: [
      {
        icon: 'pi pi-briefcase',
        title: 'Sales',
        description:
          'Discuss your requirements, get custom pricing, or see the platform running on your own workload.',
        action: { label: 'Talk to sales', href: '/contact/sales' }
      },
      {
        icon: 'pi pi-headphones',
        title: 'Support',
        description:
          'Log in with your Azion account to open a ticket. Our engineers pick it up 24/7 on paid support plans.',
        action: {
          label: 'Log in to open a ticket',
          href: 'https://console.azion.com/login',
          trailing: true
        },
        statusLink: { label: 'System status', href: 'https://status.azion.com/', target: '_blank' }
      }
    ],
    channels: [
      {
        icon: 'pi pi-shield',
        title: 'Under a cyberattack?',
        description:
          'Get emergency mitigation for an attack in progress, even before you become a customer.',
        href: 'https://www.azion.com/en/lp/under-attack-mitigation/',
        target: '_blank'
      },
      {
        icon: 'pi pi-discord',
        title: 'Join the community',
        description: 'Ask developers and the Azion team on Discord. Open to everyone, on any plan.',
        href: 'https://discord.com/invite/pM8ANzztuB',
        target: '_blank'
      },
      {
        icon: 'pi pi-book',
        title: 'Read the docs',
        description: 'Guides, API reference, and troubleshooting for every Azion product.',
        href: 'https://www.azion.com/en/documentation/',
        target: '_blank'
      }
    ]
  }
}
