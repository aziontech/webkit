import { h, type VNodeChild } from 'vue'

import Link from '../../../navigation/link/link.vue'
import HoverCard from '../../../overlay/hover-card/hover-card.vue'
import HoverCardContent from '../../../overlay/hover-card/hover-card-content/hover-card-content.vue'
import HoverCardTrigger from '../../../overlay/hover-card/hover-card-trigger/hover-card-trigger.vue'
import {
  type DocMarkdownAttributes,
  type DocMarkdownInline,
  parseDocInline
} from '../parse-doc-markdown'
import type { DocMarkdownRenderContext as Ctx } from './render-doc-markdown'

const TOOLTIP_TERM_CLASS =
  'm-0 cursor-help rounded-(--shape-flat) border-0 bg-transparent p-0 text-start text-(--text-default) underline decoration-dotted decoration-(--border-strong) underline-offset-4 ' +
  'transition-colors duration-150 ease-out hover:decoration-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) ' +
  'motion-reduce:transition-none'

export const EXTERNAL = /^https?:/i

export const text = (value: unknown): string => (typeof value === 'string' ? value : '')

function renderTooltip(ctx: Ctx, attributes: DocMarkdownAttributes, children: VNodeChild[]) {
  const title = text(attributes['title'])
  const tip = text(attributes['tip'])
  const href = text(attributes['href'])
  const linkLabel = text(attributes['linkLabel'])
  return h(HoverCard, { 'data-testid': `${ctx.testId}__tooltip`, openDelay: 150 }, () => [
    h(HoverCardTrigger, null, () =>
      h('button', { type: 'button', 'data-doc-chrome': '', class: TOOLTIP_TERM_CLASS }, children)
    ),
    h(HoverCardContent, { 'data-doc-chrome': '', class: 'gap-(--spacing-2xs)' }, () => [
      title ? h('span', { class: 'text-body-sm text-(--text-default)' }, title) : null,
      tip ? h('span', { class: 'text-pretty text-body-sm text-(--text-muted)' }, tip) : null,
      href && linkLabel
        ? h(Link, {
            label: linkLabel,
            href,
            size: 'small',
            icon: 'az az-chevron-right',
            class: 'self-start'
          })
        : null
    ])
  ])
}

function renderLink(ctx: Ctx, href: string, children: VNodeChild[]): VNodeChild {
  const external = EXTERNAL.test(href)
  return h(
    'a',
    {
      href,
      target: external ? '_blank' : undefined,
      rel: external ? 'noreferrer' : undefined,
      onClick: external ? undefined : (event: globalThis.MouseEvent) => ctx.follow(event, { href })
    },
    external ? [...children, h('span', { class: 'sr-only' }, ` ${ctx.newTab}`)] : children
  )
}

export function renderTokens(ctx: Ctx, tokens: DocMarkdownInline[]): VNodeChild[] {
  return tokens.map((token): VNodeChild => {
    switch (token.type) {
      case 'text':
        return token.value
      case 'break':
        return ' '
      case 'code':
        return h('code', token.value)
      case 'strong':
        return h('strong', renderTokens(ctx, token.children))
      case 'em':
        return h('em', renderTokens(ctx, token.children))
      case 'link':
        return renderLink(ctx, token.href, renderTokens(ctx, token.children))
      case 'citation':
        return `[${token.index}]`
      case 'component':
        if (token.name !== 'Tooltip') return null
        return renderTooltip(ctx, token.props, renderTokens(ctx, token.children))
    }
  })
}

export const inline = (ctx: Ctx, source: string) => renderTokens(ctx, parseDocInline(source))
