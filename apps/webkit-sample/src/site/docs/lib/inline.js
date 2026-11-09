// Inline markdown, rendered as vnodes.
//
// The MDX parser turns a sentence into tokens — text, code spans, links, bold,
// italic, and the inline components that sit mid-prose — and this is the half
// that turns those tokens into elements. It lives here rather than inside
// `doc-markdown.vue` because a component's PROP can be prose too: a frame's
// caption is a sentence with a link in it, not a plain string, so it has to
// reach the same renderer the page's paragraphs reach.
//
// Nothing here carries a class. The elements come out plain — `a`, `code`,
// `strong`, `em` — and `DocProse` styles them from the page, so a link in a
// caption and a link in a paragraph are the same link.

import { h } from 'vue'

import { parseInline } from './mdx'

/**
 * Render already-tokenized inline content as vnodes.
 *
 * Kept separate from `renderInline` because an inline component's children are
 * tokens, not raw text — a glossed term keeps its own emphasis and code spans.
 *
 * @param {object[]} tokens - inline tokens from `parseInline`.
 * @param {Record<string, unknown>} [components] - tag -> component for the
 *   inline components this caller supports. A caller that supports none (a
 *   caption) passes nothing, and an unknown tag renders as literal text rather
 *   than disappearing.
 * @returns {unknown[]} the child vnodes.
 */
export function renderInlineTokens(tokens, components = {}) {
  return tokens.map((token) => {
    if (token.type === 'code') return h('code', token.value)
    if (token.type === 'strong') return h('strong', token.value)
    if (token.type === 'em') return h('em', token.value)
    if (token.type === 'link') {
      const external = /^https?:\/\//.test(token.href)
      return h(
        'a',
        {
          href: token.href,
          title: token.title,
          target: external ? '_blank' : undefined,
          rel: external ? 'noreferrer' : undefined
        },
        token.value
      )
    }
    if (token.type === 'component') {
      const component = components[token.name]
      if (!component) return null
      const children = renderInlineTokens(token.children ?? [], components)
      return h(
        component,
        { ...token.props },
        children.length ? { default: () => children } : undefined
      )
    }
    return token.value
  })
}

/**
 * Render inline markdown (code, links, bold, italic) and inline components.
 *
 * @param {string} text - raw inline markdown.
 * @param {Record<string, unknown>} [components] - tag -> component map, as above.
 * @returns {unknown[]} the child vnodes.
 */
export function renderInline(text, components = {}) {
  return renderInlineTokens(parseInline(text), components)
}
