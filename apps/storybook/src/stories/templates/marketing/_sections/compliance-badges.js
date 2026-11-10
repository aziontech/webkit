export const SITE_SECTION = {
  _id: 'compliance-badges',
  props: {
    eyebrow: 'Compliance',
    title: 'Meet your compliance requirements',
    description:
      "Azion's certifications help customers and global partners meet a wide range of compliance requirements.",
    ariaLabel: 'Compliance certifications',
    certifications: [
      {
        label: 'SOC 2 & 3',
        badge: '/marketing-components/badges/soc.svg',
        alt: 'AICPA SOC 2 Type 2 and SOC 3 badge'
      },
      { label: 'PCI DSS', badge: '/marketing-components/badges/pci-dss.svg', alt: 'PCI DSS badge' },
      { label: 'LGPD', badge: '/marketing-components/badges/lgpd.svg', alt: 'LGPD badge' },
      { label: 'GDPR', badge: '/marketing-components/badges/gdpr.svg', alt: 'GDPR badge' },
      { label: 'CCPA', badge: '/marketing-components/badges/ccpa.svg', alt: 'CCPA badge' }
    ],
    primaryAction: { label: 'See more', href: '/compliance' }
  }
}
