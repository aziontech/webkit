// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5467-1706
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/layout/footer/footer-column/footer-column.vue
// component=FooterColumn
import figma from 'figma'

const instance = figma.selectedInstance

const titleLayer = instance.findText('Company')
const title = titleLayer.type === 'TEXT' ? titleLayer.textContent : ''

const links = instance
  .findConnectedInstances((node) => node.codeConnectId() === 'footer-link')
  .reduce(
    (code, node) =>
      node.type === 'INSTANCE'
        ? figma.code`${code}
  ${node.executeTemplate().example}`
        : code,
    ''
  )

export default {
  example: figma.code`<Footer.Column title="${title}">${links}
</Footer.Column>`,
  imports: ["import Footer from '@aziontech/webkit/footer'"],
  id: 'footer-column',
  metadata: { nestable: true }
}
