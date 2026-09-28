import ccpaBadge from '@shared/assets/certifications/ccpa.svg'
import cpraBadge from '@shared/assets/certifications/cpra.svg'
import gdprBadge from '@shared/assets/certifications/gdpr.svg'
import lgpdBadge from '@shared/assets/certifications/lgpd.svg'
import pciDssBadge from '@shared/assets/certifications/pci-dss.svg'
import socBadge from '@shared/assets/certifications/soc.svg'

export const CERTIFICATIONS = [
  { label: 'SOC 2 & 3', badge: socBadge, alt: 'AICPA SOC 2 Type 2 and SOC 3 badge' },
  { label: 'PCI DSS', badge: pciDssBadge, alt: 'PCI DSS badge' },
  { label: 'LGPD', badge: lgpdBadge, alt: 'LGPD badge' },
  { label: 'GDPR', badge: gdprBadge, alt: 'GDPR badge' },
  { label: 'CCPA', badge: ccpaBadge, alt: 'CCPA badge' },
  { label: 'CPRA', badge: cpraBadge, alt: 'CPRA badge' }
]
