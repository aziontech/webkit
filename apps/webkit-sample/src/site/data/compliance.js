// THE CERTIFICATIONS ROW AND THE PRIVACY LINKS — copy and shape read off the Figma file
// (`Azion.com`, node 13113:6593) via the `figma-design-to-code` MCP flow, which grew the row from
// five badges to seven: CCPA and CPRA (California's two privacy statutes) joined SOC 2/3, PCI,
// LGPD and GDPR. Their marks (`CCPA-logo.svg`, `CPRA-logo.svg`) didn't exist in the shared brand
// registry, so they were downloaded from this node's own Figma assets and added there — the same
// registry the other four badges already draw from. The Figma layer for CPRA's badge text is
// literally "CpRA" (a source typo); the badge renders it uppercase either way, so the label here
// is spelled out correctly as CPRA.

import socBadge from '@aziontech/webkit/assets/clients/SOC-logo.svg'
import pciBadge from '@aziontech/webkit/assets/clients/PCI-logo.svg'
import lgpdBadge from '@aziontech/webkit/assets/clients/LGPD-logo.svg'
import gdprBadge from '@aziontech/webkit/assets/clients/GDPR-logo.svg'
import ccpaBadge from '@aziontech/webkit/assets/clients/CCPA-logo.svg'
import cpraBadge from '@aziontech/webkit/assets/clients/CPRA-logo.svg'

const DOCS = 'https://www.azion.com/pt-br/documentacao'

// THE BADGE LABELS ARE IN ENGLISH IN THE SOURCE DESIGN, verbatim, even though the rest of the
// page is Portuguese — "SOC 2 Type 2", not "SOC 2 Tipo 2". Carried across as shown, not
// translated to match the surrounding copy.

/** The seven trust badges, in the Figma's own order. SOC 2 and SOC 3 share one badge image, same as the design (`imgSlot` reused for both). */
export const COMPLIANCE_CERTIFICATIONS = [
  { label: 'SOC 2 Type 2', badge: socBadge, alt: 'Selo AICPA SOC 2 Type 2' },
  { label: 'SOC 3 Type 2', badge: socBadge, alt: 'Selo AICPA SOC 3 Type 2' },
  { label: 'PCI DSS', badge: pciBadge, alt: 'Selo PCI DSS' },
  { label: 'LGPD', badge: lgpdBadge, alt: 'Selo LGPD' },
  { label: 'GDPR', badge: gdprBadge, alt: 'Selo GDPR' },
  { label: 'CCPA', badge: ccpaBadge, alt: 'Selo CCPA' },
  { label: 'CPRA', badge: cpraBadge, alt: 'Selo CPRA' }
]

/** The privacy section's link rail — three rows, in the Figma's own order. */
export const COMPLIANCE_PRIVACY_LINKS = [
  { label: 'Privacidade de Dados - Clientes', href: `${DOCS}/contratos/faq-clientes-azion/` },
  { label: 'Privacidade de Dados - Usuários Finais', href: `${DOCS}/contratos/faq-usuarios-finais/` },
  { label: 'Política de Privacidade', href: `${DOCS}/contratos/politica-de-privacidade/` }
]
