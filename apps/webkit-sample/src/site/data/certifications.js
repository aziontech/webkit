import ccpaBadge from '@aziontech/webkit/assets/ccpa-symbol-color.svg'
import gdprBadge from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
import lgpdBadge from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
import pciDssBadge from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
import socBadge from '@aziontech/webkit/assets/soc-symbol-color.svg'

export const CERTIFICATIONS = [
  { label: 'SOC 2 & 3', badge: socBadge, alt: 'AICPA SOC 2 Type 2 and SOC 3 badge' },
  { label: 'PCI DSS', badge: pciDssBadge, alt: 'PCI DSS badge' },
  { label: 'LGPD', badge: lgpdBadge, alt: 'LGPD badge' },
  { label: 'GDPR', badge: gdprBadge, alt: 'GDPR badge' },
  { label: 'CCPA', badge: ccpaBadge, alt: 'CCPA badge' }
]
