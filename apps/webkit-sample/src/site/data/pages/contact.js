export const CONTACT_PAGE = [
  {
    section: 'HeroForm',
    title: 'Talk to our Specialists',
    description:
      'We are here to help and provide guidance on performance, security, and AI-native workloads. Feel free to give us a call at',
    link: { label: '+1 833-332-9466', href: 'tel:+18333329466' },
    descriptionAfter: ', use our live chat or submit your inquiry on the form.',
    actions: [
      { label: 'Talk to Support', href: '/site/support', kind: 'secondary' },
      {
        label: 'Under CyberAttack?',
        href: 'https://www.azion.com/en/lp/under-attack-mitigation/',
        kind: 'outlined',
        trailing: true,
        external: true
      }
    ]
  },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: 'Build',
    title: 'Build once.',
    titleMuted: 'Run everywhere.',
    description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
    actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '#' }
  }
]
