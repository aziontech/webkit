import { describe, expect, it } from 'vitest'

import { networkMapMesh } from './network-map-mesh'

const grid = Array.from({ length: 30 }, (_, index) => ({
  x: (index % 6) * 80,
  y: Math.floor(index / 6) * 80
}))

describe('networkMapMesh', () => {
  it('draws nothing for fewer than three points', () => {
    expect(
      networkMapMesh([
        { x: 0, y: 0 },
        { x: 100, y: 0 }
      ])
    ).toEqual([])
  })

  it('links the points the same way on every call', () => {
    const rays = networkMapMesh(grid)
    expect(rays.length).toBeGreaterThan(0)
    expect(networkMapMesh(grid)).toEqual(rays)
    expect(rays.map((ray) => ray.key)).toEqual(rays.map((_, index) => `ray-${index}`))
  })

  it('gives every link a bowed path and a delay within its cycle', () => {
    for (const ray of networkMapMesh(grid)) {
      expect(ray.d).toMatch(/^M\S+ \S+Q\S+ \S+ \S+ \S+$/)
      expect(ray.duration).toBeGreaterThanOrEqual(3400)
      expect(ray.duration).toBeLessThanOrEqual(6200)
      expect(ray.delay).toBeLessThanOrEqual(ray.duration)
    }
  })
})
