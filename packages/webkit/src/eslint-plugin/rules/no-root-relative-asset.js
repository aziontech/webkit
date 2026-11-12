import { readFileSync } from 'node:fs'

import { templateBodyVisitorFactory } from '../util.js'

const DEFAULT_PREFIXES = ['/marketing-components/', '/media/']

let siteAssets = null

function knownAssets() {
  if (siteAssets) return siteAssets
  try {
    siteAssets = JSON.parse(
      readFileSync(new URL('../../assets/site-assets.json', import.meta.url), 'utf8')
    )
  } catch {
    siteAssets = {}
  }
  return siteAssets
}

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function matcher(prefixes) {
  const alternatives = prefixes.map(escape).join('|')
  return new RegExp(`(?:^|url\\(\\s*['"]?)((?:${alternatives})[^\\s'")]*)`)
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow root-relative URLs to media that only azion.com and the WebKit docs site serve; import the file from @aziontech/webkit/assets or pass your own.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          prefixes: { type: 'array', items: { type: 'string', minLength: 2 }, minItems: 1 }
        },
        additionalProperties: false
      }
    ],
    messages: {
      known:
        "'{{url}}' exists only on azion.com and the WebKit docs site, so a copy renders a broken image. Import the file instead: `import {{binding}} from '{{specifier}}'` and pass `{{binding}}`.",
      unknown:
        '\'{{url}}\' exists only on azion.com and the WebKit docs site, so a copy renders a broken image. WebKit ships logos, badges and illustrations as `@aziontech/webkit/assets/<file>` (catalog.json lists them as imports of kind "asset"): import that URL. For a photo, cover or clip, pass one your app serves, or `@aziontech/webkit/assets/placeholder-image.svg` / `placeholder-clip.webm` until you have it.'
    }
  },
  create(context) {
    const prefixes = context.options[0]?.prefixes ?? DEFAULT_PREFIXES
    const pattern = matcher(prefixes)

    function scan(node, text) {
      if (typeof text !== 'string' || !text) return
      const url = pattern.exec(text)?.[1]
      if (!url) return
      const specifier = knownAssets()[url]
      if (specifier) {
        const binding = specifier
          .split('/')
          .pop()
          .replace(/\.[a-z0-9]+$/i, '')
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        context.report({ node, messageId: 'known', data: { url, specifier, binding } })
      } else {
        context.report({ node, messageId: 'unknown', data: { url } })
      }
    }

    const visitor = {
      Literal(node) {
        if (typeof node.value === 'string') scan(node, node.value)
      },
      TemplateElement(node) {
        const text = node.value?.cooked ?? node.value?.raw
        const leading = node.parent?.type !== 'TemplateLiteral' || node.parent.quasis[0] === node
        scan(node, leading ? text : ` ${text}`)
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return visitor

    return factory(
      {
        ...visitor,
        VLiteral(node) {
          scan(node, node.value)
        }
      },
      visitor
    )
  }
}
