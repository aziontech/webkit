import Footer from './footer.vue'
import FooterColumn from './footer-column/footer-column.vue'
import FooterLink from './footer-link/footer-link.vue'

type CompoundFooter = typeof Footer & {
  Column: typeof FooterColumn
  Link: typeof FooterLink
}

const FooterRoot = Object.assign(Footer, {
  Column: FooterColumn,
  Link: FooterLink
}) as CompoundFooter

export default FooterRoot
export type { FooterSignature, FooterVariant } from './footer.vue'
export type { FooterProps } from './footer.vue'
export type { FooterColumnProps } from './footer-column/footer-column.vue'
export type { FooterLinkProps } from './footer-link/footer-link.vue'
