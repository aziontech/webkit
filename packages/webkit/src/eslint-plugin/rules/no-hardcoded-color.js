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

    // A short 3-4 digit hex (#dad, #face, #bad) is ambiguous: it is a color in a style
    // string but also a perfectly valid DOM id / anchor / route (href="#dad"). Enforce
    // the hex-color rule on a short hex ONLY when the string actually looks like a class
    // or style value. A 6/8-digit hex (#ffffff) is almost never anything but a color.
    const STYLE_SIGNAL =
      /[:;{}]|--|\[#|\b(?:bg|text|border|ring|outline|fill|stroke|divide|placeholder|caret|accent|from|via|to|shadow|decoration)-|\b(?:rgba?|hsla?|var|color|background)\b/
    const FULL_HEX = /#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b/
    // A URL fragment can be a hex run without being a color: the first group of a UUID
    // (`api.azion.com/#75d2b32f-fb8a-…`) is 8 hex digits and passes FULL_HEX. Blank out
    // UUID-shaped runs and any `/#hex` fragment before the hex-color check sees the text;
    // a real color never sits in either position.
    const URL_HEX_FRAGMENT =
      /#?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b|\/#[0-9a-fA-F]{3,8}\b/g

    function scan(node, text) {
      if (typeof text !== 'string' || !text) return
      for (const rule of rules) {
        let subject = text
        if (rule.id === 'hex-color') {
          subject = text.replace(URL_HEX_FRAGMENT, '')
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
