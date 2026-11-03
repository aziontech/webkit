// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5467-1638
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/layout/footer/footer.vue
// component=Footer
import figma from 'figma'

const instance = figma.selectedInstance

const deep = { traverseInstances: true }

const connected = (id) =>
  instance
    .findConnectedInstances((node) => node.codeConnectId() === id, deep)
    .reduce(
      (code, node) =>
        node.type === 'INSTANCE'
          ? figma.code`${code}
    ${node.executeTemplate().example}`
          : code,
      ''
    )

const columns = instance
  .findConnectedInstances((node) => node.codeConnectId() === 'footer-column', deep)
  .reduce(
    (code, node) =>
      node.type === 'INSTANCE'
        ? figma.code`${code}
  ${node.executeTemplate().example}`
        : code,
    ''
  )

const social = connected('icon-button')
const status = connected('status-indicator')
const language = connected('select')
const brand = connected('brand')
const taglineLayer = instance.findLayers((node) => node.type === 'TEXT', {
  traverseInstances: true,
  path: ['Signature']
})[0]
const tagline = taglineLayer && taglineLayer.type === 'TEXT' ? taglineLayer.textContent : ''

export default {
  example: figma.code`<Footer kind="site">${columns}${
    status
      ? figma.code`
  <template #status>${status}
  </template>`
      : ''
  }${
    language
      ? figma.code`
  <template #language>${language}
  </template>`
      : ''
  }${
    brand
      ? figma.code`
  <template #brand>${brand}
  </template>`
      : ''
  }${
    tagline
      ? figma.code`
  <template #tagline>${tagline}</template>`
      : ''
  }${
    social
      ? figma.code`
  <template #social>${social}
  </template>`
      : ''
  }
</Footer>`,
  imports: ["import Footer from '@aziontech/webkit/footer'"],
  id: 'footer',
  metadata: { nestable: false }
}
