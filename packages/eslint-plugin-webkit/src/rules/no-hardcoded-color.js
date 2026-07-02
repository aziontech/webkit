// Flags hardcoded colors / raw palette / raw typography in class & style strings, in
// both <script> string literals and the SFC <template> (via vue-eslint-parser). The
// token-rule set is read from the installed webkit catalog (`tokenRules`), so it stays
// version-synced with what the design system itself enforces. Fail-open: no catalog →
// no rules → no-op. CSS/SCSS `<style>` blocks are owned by @aziontech/stylelint-config-webkit.

import { loadCatalog } from '../catalog.js'
import { ctxCwd, templateBodyVisitorFactory } from '../util.js'

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow hardcoded colors / raw palette / raw typography; use design tokens.' },
    schema: [],
    messages: {
      token: '{{message}} Found: {{sample}}'
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    const rules = catalog.tokenRules
    if (!rules.length) return {}

    function scan(node, text) {
      if (typeof text !== 'string' || !text) return
      for (const rule of rules) {
        const m = text.match(rule.re)
        if (m) {
          context.report({ node, messageId: 'token', data: { message: rule.message, sample: m[0] } })
          break
        }
      }
    }

    const scriptVisitor = {
      Literal(node) {
        if (typeof node.value === 'string') scan(node, node.value)
      },
      TemplateElement(node) {
        scan(node, node.value?.raw)
      }
    }

    const defineTemplateBodyVisitor = templateBodyVisitorFactory(context)
    if (!defineTemplateBodyVisitor) return scriptVisitor

    const templateVisitor = {
      // Static attribute value: class="text-[#fff]"
      VLiteral(node) {
        scan(node, node.value)
      },
      // Bound expression string: :class="'text-[#fff]'"
      Literal(node) {
        if (typeof node.value === 'string') scan(node, node.value)
      },
      TemplateElement(node) {
        scan(node, node.value?.raw)
      }
    }

    return defineTemplateBodyVisitor(templateVisitor, scriptVisitor)
  }
}
