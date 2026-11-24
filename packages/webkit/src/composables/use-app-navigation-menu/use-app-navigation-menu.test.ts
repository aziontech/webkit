import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { type AppNavGroup, useAppNavigation } from '../use-app-navigation'
import { useAppNavigationMenu, type UseAppNavigationMenuReturn } from './index'

const NAVIGATION: AppNavGroup[] = [
  {
    label: 'Build',
    items: [
      { id: 'home', label: 'Home', href: '/home' },
      {
        id: 'storage',
        label: 'Storage',
        children: [{ id: 'buckets', label: 'Buckets', href: '/storage/buckets' }]
      },
      {
        id: 'secure',
        label: 'Secure',
        type: 'drill',
        children: [{ id: 'firewall', label: 'Firewall', href: '/secure/firewall' }]
      }
    ]
  }
]

function setup(activeId = '') {
  const active = ref(activeId)
  const menuPath = ref<string[]>([])
  const menuExpanded = ref<string[]>([])
  const searchOpen = ref(false)
  const emit = vi.fn()
  let api: UseAppNavigationMenuReturn | undefined
  render(
    defineComponent({
      setup() {
        api = useAppNavigationMenu(useAppNavigation(), {
          navigation: () => NAVIGATION,
          activeId: active,
          menuPath,
          menuExpanded,
          searchOpen,
          valuePrefix: 'probe:nav:',
          emit
        })
        return () => h('div')
      }
    }),
    {
      global: {
        config: {
          globalProperties: { $router: { push: vi.fn(), currentRoute: ref({ path: '/home' }) } }
        }
      }
    }
  )
  return { api: api!, active, menuPath, menuExpanded, searchOpen, emit }
}

describe('useAppNavigationMenu', () => {
  it('matches the active row from the current path when no id is given', () => {
    const { api } = setup()
    expect(api.currentId.value).toBe('home')
    expect([...api.leaves.value.keys()]).toEqual(['home', 'buckets', 'firewall'])
  })

  it('opens the inline ancestors and drills into the drill ancestors of the active row', async () => {
    const { active, menuPath, menuExpanded } = setup('buckets')
    expect(menuExpanded.value).toEqual(['storage'])
    expect(menuPath.value).toEqual([])
    active.value = 'firewall'
    await nextTick()
    expect(menuPath.value).toEqual(['secure'])
    expect(menuExpanded.value).toEqual(['storage'])
  })

  it('routes a palette value with the prefix to navigate and any other value to search-select', () => {
    const { api, emit } = setup()
    const event = new MouseEvent('click', { cancelable: true })
    api.onPaletteSelect(event, 'probe:nav:buckets')
    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('navigate', event, NAVIGATION[0]!.items[1]!.children![0])
    api.onPaletteSelect(event, 'custom')
    expect(emit).toHaveBeenLastCalledWith('search-select', event, 'custom')
  })

  it('keeps the query as text and clears it when the palette opens or closes', async () => {
    const { api, searchOpen } = setup()
    api.onQuery('fire')
    expect(api.query.value).toBe('fire')
    api.onQuery(3)
    expect(api.query.value).toBe('')
    api.onQuery('fire')
    api.openSearch()
    await nextTick()
    expect(searchOpen.value).toBe(true)
    expect(api.query.value).toBe('')
  })
})
