import { loadCatalog } from '../lib/catalog.js'
import { ctxCwd, templateBodyVisitorFactory } from '../lib/rule-utils.js'

const ARBITRARY_TIMING = /\b(?:duration|delay|ease|animate)-\[[^\]]*\]/
const STYLE_SIGNAL = /[:;]/
const STYLE_LITERAL_TIMING = /\b(?:transition|animation)\s*:[^;]*?\b\d+(?:\.\d+)?m?s\b/
const STYLE_CUBIC_BEZIER = /cubic-bezier\s*\(/
const STYLE_TRANSITION_ALL = /\btransition\s*:\s*all\b/
const ANIMATE_NAME = /\banimate-([a-z][a-z0-9-]*)/g
const TRANSITION_UTILITY =
  /(?:^|[\s:'"`])transition(?:-(?:all|colors|opacity|shadow|transform))?(?=$|[\s'"`])/
const MOTION_ESCAPE = /motion-reduce:/

function styleTimingHit(text) {
  if (!STYLE_SIGNAL.test(text)) return null
  return (
    text.match(STYLE_LITERAL_TIMING) ||
    text.match(STYLE_TRANSITION_ALL) ||
    text.match(STYLE_CUBIC_BEZIER)
  )
}

function unknownAnimation(text, animationNames) {
  if (!animationNames.size) return null
  for (const m of text.matchAll(ANIMATE_NAME)) {
    const name = m[1]
    if (name !== 'none' && !animationNames.has(name)) return name
  }
  return null
}

function motionFinding(text, animationNames) {
  const arbitrary = text.match(ARBITRARY_TIMING)
  if (arbitrary) return { messageId: 'arbitrary', data: { sample: arbitrary[0] } }
  const styleHit = styleTimingHit(text)
  if (styleHit) return { messageId: 'styleTiming', data: { sample: styleHit[0] } }
  const name = unknownAnimation(text, animationNames)
  return name ? { messageId: 'unknownAnimation', data: { name } } : null
}

function lacksMotionEscape(text) {
  const hasAnimation = /\banimate-(?!none\b)[a-z]/.test(text)
  const hasTransition = TRANSITION_UTILITY.test(text) && !/\btransition-none\b/.test(text)
  return (hasAnimation || hasTransition) && !MOTION_ESCAPE.test(text)
}

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
        '"animate-{{name}}" is not in the Azion UI animation catalog. Pick a catalogued utility (ask the Azion UI MCP: list_tokens category "animations").',
      pairing:
        'Motion class without a reduced-motion escape. Pair it with motion-reduce:transition-none / motion-reduce:animate-none on the same class string.'
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    const animationNames = new Set(catalog?.tokens?.animations || [])

    function scan(node, text) {
      if (typeof text !== 'string' || !text) return
      const finding = motionFinding(text, animationNames)
      if (finding) context.report({ node, ...finding })
    }

    function scanClassPairing(node, text) {
      if (typeof text !== 'string' || !text) return
      if (lacksMotionEscape(text)) context.report({ node, messageId: 'pairing' })
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
