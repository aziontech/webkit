// Flags motion that bypasses the theme's animation catalog, in class & style strings, in
// both <script> string literals and the SFC <template> (via vue-eslint-parser):
//
//   1. Arbitrary timing utilities — `duration-[180ms]`, `delay-[2s]`, `ease-[cubic-bezier(…)]`,
//      `animate-[…]`: the values live in the theme tokens (`duration-*`, `ease-*`, `animate-*`).
//   2. Literal timing in style strings — `transition: opacity 200ms`, `animation: spin 1.5s`,
//      a raw `cubic-bezier(`, or a bare `transition: all`.
//   3. An `animate-<name>` that does not exist in the installed catalog (typo or invented
//      animation) — the valid names come from the webkit catalog (`tokens.animations`).
//   4. A STATIC class attribute with motion (`animate-*` / `transition*`) and no
//      `motion-reduce:` escape on the same class string. Only the static `class="…"` value is
//      checked (it holds the full class list); bound fragments are skipped to avoid false
//      positives when the escape lives in another fragment.
//
// Fail-open: no catalog → check 3 disables itself; the others are catalog-independent.
// CSS/SCSS `<style>` blocks are owned by @aziontech/webkit/stylelint-config.

import { loadCatalog } from '../catalog.js'
import { ctxCwd, templateBodyVisitorFactory } from '../util.js'

const ARBITRARY_TIMING = /\b(?:duration|delay|ease|animate)-\[[^\]]*\]/
const STYLE_SIGNAL = /[:;]/
const STYLE_LITERAL_TIMING = /\b(?:transition|animation)\s*:[^;]*?\b\d+(?:\.\d+)?m?s\b/
const STYLE_CUBIC_BEZIER = /cubic-bezier\s*\(/
const STYLE_TRANSITION_ALL = /\btransition\s*:\s*all\b/
const ANIMATE_NAME = /\banimate-([a-z][a-z0-9-]*)/g
// Tailwind transition utilities only (not arbitrary class names containing "transition").
const TRANSITION_UTILITY =
  /(?:^|[\s:'"`])transition(?:-(?:all|colors|opacity|shadow|transform))?(?=$|[\s'"`])/
const MOTION_ESCAPE = /motion-reduce:/

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow motion outside the theme animation catalog: hardcoded timing, unknown animate-* names, and motion without a motion-reduce escape.'
    },
    schema: [],
    messages: {
      arbitrary:
        'Hardcoded motion timing "{{sample}}". Timing lives in the theme tokens — use duration-* / ease-* / the catalogued animate-* utilities.',
      styleTiming:
        'Literal motion timing in a style string ("{{sample}}"). Read duration/curve from the theme tokens (var(--…) / the animate-* utilities) instead.',
      unknownAnimation:
        '"animate-{{name}}" is not in the webkit animation catalog. Pick a catalogued utility (ask the webkit MCP: list_tokens category "animations").',
      pairing:
        'Motion class without a reduced-motion escape. Pair it with motion-reduce:transition-none / motion-reduce:animate-none on the same class string.'
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    const animationNames = new Set(catalog?.tokens?.animations || [])

    function scan(node, text) {
      if (typeof text !== 'string' || !text) return

      const arbitrary = text.match(ARBITRARY_TIMING)
      if (arbitrary) {
        context.report({ node, messageId: 'arbitrary', data: { sample: arbitrary[0] } })
        return
      }

      if (STYLE_SIGNAL.test(text)) {
        const styleHit =
          text.match(STYLE_LITERAL_TIMING) ||
          text.match(STYLE_TRANSITION_ALL) ||
          text.match(STYLE_CUBIC_BEZIER)
        if (styleHit) {
          context.report({ node, messageId: 'styleTiming', data: { sample: styleHit[0] } })
          return
        }
      }

      if (animationNames.size) {
        for (const m of text.matchAll(ANIMATE_NAME)) {
          const name = m[1]
          if (name === 'none' || animationNames.has(name)) continue
          context.report({ node, messageId: 'unknownAnimation', data: { name } })
          return
        }
      }
    }

    // The static class attribute holds the FULL class list, so the motion-reduce pairing
    // can be checked reliably there (and only there).
    function scanClassPairing(node, text) {
      if (typeof text !== 'string' || !text) return
      const hasAnimation = /\banimate-(?!none\b)[a-z]/.test(text)
      const hasTransition = TRANSITION_UTILITY.test(text) && !/\btransition-none\b/.test(text)
      if ((hasAnimation || hasTransition) && !MOTION_ESCAPE.test(text)) {
        context.report({ node, messageId: 'pairing' })
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
        if (node.parent?.key?.name === 'class') scanClassPairing(node, node.value)
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
