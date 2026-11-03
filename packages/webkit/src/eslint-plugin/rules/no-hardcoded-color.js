import { loadCatalog } from '../catalog.js'
import { ctxCwd, templateBodyVisitorFactory } from '../util.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded colors / raw palette / raw typography; use design tokens.'
    },
    schema: [],
    messages: {
      token: '{{message}} Found: {{sample}}'
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    const rules = catalog.tokenRules
    if (!rules.length) return {}

    const STYLE_SIGNAL =
      /[:;{}]|--|\[#|\b(?:bg|text|border|ring|outline|fill|stroke|divide|placeholder|caret|accent|from|via|to|shadow|decoration)-|\b(?:rgba?|hsla?|var|color|background)\b/
    const FULL_HEX = /#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b/
    const URL_FRAGMENT = /(?<=[\w/.~%?&-])#[\w-]+/g
    const UUID = /#?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g

    function scan(node, text) {
      if (typeof text !== 'string' || !text) return
      for (const rule of rules) {
        let subject = text
        if (rule.id === 'hex-color') {
          subject = text.replace(URL_FRAGMENT, '').replace(UUID, '')
          if (!FULL_HEX.test(subject) && !STYLE_SIGNAL.test(subject)) continue
        }
        const m = subject.match(rule.re)
        if (m) {
          context.report({
            node,
            messageId: 'token',
            data: { message: rule.message, sample: m[0] }
          })
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
      VLiteral(node) {
        scan(node, node.value)
      },
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
