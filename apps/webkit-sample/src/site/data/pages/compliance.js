import { COMPLIANCE_PRIVACY_LINKS } from '../compliance.js'

export const COMPLIANCE_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    title: 'Certifications and Compliance',
    description:
      'Azion adheres to rigorous security, availability, and privacy standards so customers can adopt our services with confidence.',
    actions: [
      {
        label: 'Contact',
        href: '/site/contact',
        kind: 'secondary'
      },
      {
        label: 'View Responsibility Matrix',
        href: 'https://www.azion.com/en/documentation/shared-responsibility/',
        kind: 'outlined',
        trailing: true,
        external: true
      }
    ]
  },
  {
    section: 'ComplianceBadges',
    eyebrow: '',
    title: 'Security and Compliance are shared responsibilities between Azion and the customer.',
    description:
      "This shared model can help relieve the customer's operational burden as Azion operates, manages and controls the components from the operating system and virtualization layer, including updates and security patches, down to the physical security of the facilities in which the service operates.",
    more: null,
    ariaLabel: 'Compliance certifications'
  },
  {
    section: 'ResourceGrid',
    eyebrow: 'Data privacy',
    title: 'Data Protection Regulations',
    description:
      "Azion understands that the privacy of our customers' and end-users' data is essential. We are committed to data protection, and our controls are based on robust practices aligned with key international legislation, such as the General Data Protection Law (LGPD) and the European Union's General Data Protection Regulation (GDPR). We do not sell personal data and use it exclusively for maintaining and delivering our services. We offer users of our products the ability to access, correct, and delete their personal information, adhering to the principle that our customers and end-users should have full control over the data they own that transits through our network. We invite you to explore our Data Privacy FAQs or consult our detailed privacy policy.",
    items: COMPLIANCE_PRIVACY_LINKS.map((link) => ({
      title: link.label,
      description: '',
      href: link.href
    })),
    actions: []
  },
  { section: 'ClosingCallToAction', kind: 'frame' }
]
