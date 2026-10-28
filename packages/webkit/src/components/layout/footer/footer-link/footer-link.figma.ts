// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5467-1717
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/layout/footer/footer-link/footer-link.vue
// component=FooterLink
import figma from 'figma'

const instance = figma.selectedInstance

const labelLayer = instance.findText('Link')
const label = labelLayer.type === 'TEXT' ? labelLayer.textContent : ''

export default {
  example: figma.code`<Footer.Link href="#">${label}</Footer.Link>`,
  imports: ["import Footer from '@aziontech/webkit/footer'"],
  id: 'footer-link',
  metadata: { nestable: true }
}
