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
