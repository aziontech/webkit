import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

import { describe, expect, it } from 'vitest'

const require = createRequire(`${process.cwd()}/`)
const azion = require('./azion.config.cjs')

describe('deploy cache policy', () => {
  const app = azion.applications[0]
  const policy = (name: string) => app.cache.find((entry: { name: string }) => entry.name === name)

  it('emits every script under /assets/ with a content hash', () => {
    const vite = readFileSync(`${process.cwd()}/vite.config.js`, 'utf8')
    expect(vite).toMatch(/entryFileNames: 'assets\/\[name\]\.\[hash\]\.js'/)
    expect(vite).toMatch(/chunkFileNames: 'assets\/\[name\]\.\[hash\]\.js'/)
  })

  it('caches the hashed /assets/ files for a year, before any other rule', () => {
    const [first] = app.rules.request
    expect(first.criteria[0][0].argument).toBe('^/assets/')
    const name = first.behaviors.find((b: { type: string }) => b.type === 'set_cache_policy')
      .attributes.value
    expect(policy(name).browser.maxAgeSeconds).toBe(31536000)
  })

  it('keeps the HTML and unhashed files on a short cache', () => {
    for (const rule of app.rules.request.slice(1)) {
      const name = rule.behaviors.find((b: { type: string }) => b.type === 'set_cache_policy')
        .attributes.value
      expect(policy(name).browser.maxAgeSeconds).toBeLessThanOrEqual(300)
    }
  })
})
