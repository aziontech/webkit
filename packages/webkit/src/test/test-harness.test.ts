import { describe, expect, it } from 'vitest'

import { planShards } from '../../scripts/lib/shard-plan.mjs'
import { keepConsoleLog, RESIZE_OBSERVER_LOOP } from './console-noise'
import DURATIONS from './shard-durations.json'

const SUITES = import.meta.glob<string>('./reflow*.test.ts', {
  query: '?raw',
  import: 'default',
  eager: true
})

describe('the ResizeObserver loop notice', () => {
  it('is dropped from the console log, while every other line is kept', () => {
    expect(
      keepConsoleLog('Error: ResizeObserver loop completed with undelivered notifications.')
    ).toBe(false)
    expect(keepConsoleLog('ResizeObserver loop limit exceeded')).toBe(false)
    expect(keepConsoleLog('TypeError: x is undefined')).toBe(true)
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
