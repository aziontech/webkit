// Every SFC an agent copies — the blocks (screens) and the component examples — must run as
// pasted: it mounts, renders, and never reads a name it did not declare. A failure here means
// the catalog would hand out code that breaks in the consumer's app.
import { render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'

const modules = {
  ...import.meta.glob<{ default: Component }>('../../blocks/**/*.vue'),
  ...import.meta.glob<{ default: Component }>('../../examples/**/*.vue')
}

const UNDECLARED = /was accessed during render but is not defined|Failed to resolve component/

describe('copyable SFCs (blocks and examples) run as pasted', () => {
  let warnings: string[] = []
  beforeEach(() => {
    warnings = []
    vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
      warnings.push(args.map(String).join(' '))
    })
  })
  afterEach(() => vi.restoreAllMocks())

  it.each(Object.keys(modules).map((file) => [file.replace('../../', '')]))('%s', async (file) => {
    const mod = await modules[`../../${file}`]()
    expect(() => render(mod.default)).not.toThrow()
    expect(warnings.filter((w) => UNDECLARED.test(w))).toEqual([])
  })
})
