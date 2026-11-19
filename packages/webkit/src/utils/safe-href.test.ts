import { describe, expect, it } from 'vitest'

import { safeHref, safeWebUrl } from './safe-href'

const BLOCKED = [
  'javascript:alert(1)',
  'JavaScript:alert(1)',
  'JAVASCRIPT:alert(1)',
  '  javascript:alert(1)  ',
  'java\tscript:alert(1)',
  'java\nscript:alert(1)',
  '\u0001javascript:alert(1)',
  'java script:alert(1)',
  '&#106;avascript:alert(1)',
  '&#x6A;avascript:alert(1)',
  '&#0000106avascript:alert(1)',
  'javascript&colon;alert(1)',
  'java&Tab;script:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'DATA:text/html;base64,PHNjcmlwdD4=',
  'vbscript:msgbox(1)',
  'VBScript:msgbox(1)',
  'file:///etc/passwd',
  'blob:https://example.com/0a1b',
  '//example.com/asset',
  '/\\example.com',
  '\\\\example.com',
  '',
  '   '
]

const ALLOWED = [
  'https://example.com',
  'HTTP://example.com/path?q=1#top',
  'mailto:jane.doe@example.com',
  'tel:+15550100',
  '/docs/getting-started',
  '#pricing',
  '?page=2',
  'pricing',
  './pricing',
  '../pricing',
  '/search?q=a:b'
]

describe('safeHref', () => {
  it.each(BLOCKED)('blocks %j', (href) => {
    expect(safeHref(href)).toBeNull()
  })

  it.each(ALLOWED)('keeps %j', (href) => {
    expect(safeHref(href)).toBe(href)
  })

  it('trims the kept value', () => {
    expect(safeHref('  https://example.com  ')).toBe('https://example.com')
  })

  it('returns null for a missing value', () => {
    expect(safeHref(undefined)).toBeNull()
    expect(safeHref(null)).toBeNull()
  })
})

describe('safeWebUrl', () => {
  it('keeps an absolute http or https URL', () => {
    expect(safeWebUrl('https://www.example.com/embed/1')).toBe('https://www.example.com/embed/1')
    expect(safeWebUrl('http://example.com')).toBe('http://example.com')
  })

  it.each([...BLOCKED, 'mailto:jane.doe@example.com', 'tel:+15550100', '/embed', 'embed.html'])(
    'blocks %j',
    (url) => {
      expect(safeWebUrl(url)).toBeNull()
    }
  )
})

describe('safeHref for a download', () => {
  it('keeps blob and data URLs for a download', () => {
    expect(safeHref('blob:https://example.com/0a1b', true)).toBe('blob:https://example.com/0a1b')
    expect(safeHref('data:image/png;base64,AAAA', true)).toBe('data:image/png;base64,AAAA')
    expect(safeHref('/files/report.csv', true)).toBe('/files/report.csv')
  })

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'vbscript:msgbox(1)',
    '&#106;avascript:alert(1)'
  ])('blocks %j', (href) => {
    expect(safeHref(href, true)).toBeNull()
  })
})
