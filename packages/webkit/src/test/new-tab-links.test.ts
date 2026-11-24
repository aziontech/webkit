import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import type { Component } from 'vue'

const modules = import.meta.glob<{ default: Component }>([
  '../../blocks/account/*/*.vue',
  '../../blocks/account/*/variants/*.vue',
  '../../blocks/ai/*/*.vue',
  '../../blocks/ai/*/variants/*.vue',
  '../../blocks/auth/*/*.vue',
  '../../blocks/auth/*/variants/*.vue',
  '../../blocks/detail/*/*.vue',
  '../../blocks/detail/*/variants/*.vue',
  '../../blocks/shell/*/*.vue',
  '../../blocks/shell/*/variants/*.vue',
  '../../blocks/top-bar/*/*.vue',
  '../../blocks/top-bar/*/variants/*.vue',
  '../../examples/article-body-section/*.vue',
  '../../examples/contact-hub-section/*.vue',
  '../../examples/faq-section/*.vue'
])

afterEach(() => cleanup())

describe('account, ai, auth, detail, shell and top-bar blocks and the article, contact and FAQ sections say when a link opens a new tab', () => {
  it.each(Object.keys(modules).map((file) => [file.replace('../../', '')]))('%s', async (file) => {
    const page = (await modules[`../../${file}`]!()).default
    render(page)
    const links = [...document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')]
    for (const link of links)
      expect(link, link.outerHTML.slice(0, 160)).toHaveAccessibleName(/new tab/)
  })
})
