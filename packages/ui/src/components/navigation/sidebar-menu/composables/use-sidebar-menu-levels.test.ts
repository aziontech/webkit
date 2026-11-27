import { describe, expect, it } from 'vitest'
import { effectScope, ref } from 'vue'

import { useSidebarMenuLevels } from './use-sidebar-menu-levels'

const setup = (initial: string[] = []) => {
  const path = ref(initial)
  const scope = effectScope()
  const levels = scope.run(() => useSidebarMenuLevels(path))!
  return { path, levels, scope }
}

describe('useSidebarMenuLevels', () => {
  it('pushes a level once, with its label, and plays the push motion', () => {
    const { path, levels, scope } = setup()
    levels.push({ id: 'dns', label: 'DNS' }, null)
    levels.push({ id: 'dns', label: 'DNS' }, null)
    expect(path.value).toEqual(['dns'])
    expect(levels.levels.value).toEqual([{ id: 'dns', label: 'DNS' }])
    expect(levels.motion.value).toBe('push')
    expect(levels.isCurrentLevel('dns')).toBe(true)
    scope.stop()
  })

  it('pops back to the trigger and keeps the leaving level mounted', () => {
    const trigger = document.createElement('button')
    const { path, levels, scope } = setup()
    levels.push({ id: 'dns', label: 'DNS' }, trigger)
    levels.pop()
    expect(path.value).toEqual([])
    expect(levels.motion.value).toBe('pop')
    expect(levels.isLevelMounted('dns')).toBe(true)
    expect(levels.isCurrentLevel('dns')).toBe(false)
    scope.stop()
  })

  it('names a registered level and plays the enter motion from the path', () => {
    const { levels, scope } = setup(['zones'])
    levels.registerLevel('zones', 'Zones', null)
    expect(levels.levels.value[0]?.label).toBe('Zones')
    levels.playEnter()
    expect(levels.motion.value).toBe('push')
    scope.stop()
  })
})
