import { describe, expect, it } from 'vitest'

import { planShards } from '../../scripts/lib/shard-plan.mjs'
import { RESIZE_OBSERVER_LOOP } from './setup'
import DURATIONS from './shard-durations.json'

const SUITES = import.meta.glob<string>('./reflow*.test.ts', {
  query: '?raw',
  import: 'default',
  eager: true
})

describe('the ResizeObserver loop notice', () => {
  it('stops before any later error listener sees it', () => {
    const seen: string[] = []
    const listener = (event: Event) => seen.push((event as ErrorEvent).message)
    EventTarget.prototype.addEventListener.call(window, 'error', listener)
    window.dispatchEvent(
      new ErrorEvent('error', {
        message: 'ResizeObserver loop completed with undelivered notifications.'
      })
    )
    EventTarget.prototype.removeEventListener.call(window, 'error', listener)
    expect(seen).toEqual([])
  })

  it('matches only the loop notice, so every other error still fails the run', () => {
    expect(RESIZE_OBSERVER_LOOP.test('ResizeObserver loop limit exceeded')).toBe(true)
    expect(RESIZE_OBSERVER_LOOP.test('TypeError: x is undefined')).toBe(false)
  })
})

describe('the reflow suites', () => {
  it('run every width in exactly one file', () => {
    const calls = Object.values(SUITES).flatMap((source) =>
      [...source.matchAll(/defineReflowSuites\(\[([^\]]*)\]\)/g)].flatMap((m) =>
        m[1]!.split(',').map((width) => Number(width.trim()))
      )
    )
    expect([...calls].sort((a, b) => a - b)).toEqual([320, 640, 768, 1280, 1920, 2560])
  })
})

describe('the duration shard plan', () => {
  it('keeps the slowest of four shards within a quarter of the mean', () => {
    const files = Object.keys(DURATIONS)
    const shards = planShards(files, DURATIONS, 4)
    const loads = shards.map((shard) => shard.load)
    const mean = loads.reduce((sum, load) => sum + load, 0) / loads.length
    expect(Math.max(...loads)).toBeLessThanOrEqual(mean * 1.25)
    expect(shards.flatMap((shard) => shard.files).sort()).toEqual([...files].sort())
  })
})
