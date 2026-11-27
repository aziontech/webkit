import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import {
  matchActiveId,
  navPaletteGroups,
  toMenuGroups,
  useAppNavigation,
  type UseAppNavigationReturn
} from './index'

type ProbeWindow = typeof globalThis & { __appNavigationProbe?: number }
const probeWindow = globalThis as ProbeWindow
const PROBE = 'javascript:globalThis.__appNavigationProbe=1'

const settle = () => new Promise((resolve) => setTimeout(resolve, 100))

afterEach(() => {
  delete probeWindow.__appNavigationProbe
})

const fakeRouter = (path = '/') => ({ push: vi.fn(), currentRoute: ref({ path }) })

function setup(router?: ReturnType<typeof fakeRouter>): UseAppNavigationReturn {
  let api: UseAppNavigationReturn | undefined
  render(
    defineComponent({
      setup() {
        api = useAppNavigation()
        return () => h('div')
      }
    }),
    router ? { global: { config: { globalProperties: { $router: router } } } } : {}
  )
  return api!
}

describe('useAppNavigation', () => {
  it('runs a javascript: URL handed to location.assign, so the probe below can see one', async () => {
    globalThis.location.assign(PROBE)
    await settle()
    expect(probeWindow.__appNavigationProbe).toBe(1)
  })

  it('keeps in-app paths and web links', () => {
    const { hrefOf } = setup()
    expect(hrefOf({ href: '/workloads' })).toBe('/workloads')
    expect(hrefOf({ href: 'https://example.com/docs' })).toBe('https://example.com/docs')
    expect(hrefOf({ href: 'mailto:jane.doe@example.com' })).toBe('mailto:jane.doe@example.com')
    expect(hrefOf({})).toBeUndefined()
    expect(hrefOf({ href: '' })).toBeUndefined()
  })

  it.each([
    PROBE,
    ' JavaScript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '//example.org/phish'
  ])('drops the unsafe href %j', (href) => {
    const { hrefOf } = setup()
    expect(hrefOf({ href })).toBeUndefined()
  })

  it.each(['click', 'keydown'])(
    'does not follow a javascript: href on a %s with no router',
    async (type) => {
      const { follow } = setup()
      const event =
        type === 'click'
          ? new MouseEvent('click', { cancelable: true })
          : new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
      follow(event, { href: PROBE })
      await settle()
      expect(probeWindow.__appNavigationProbe).toBeUndefined()
      expect(event.defaultPrevented).toBe(false)
    }
  )

  it('does not hand an unsafe href to the router', async () => {
    const router = fakeRouter()
    const { follow } = setup(router)
    follow(new KeyboardEvent('keydown', { key: 'Enter' }), { href: PROBE })
    await settle()
    expect(router.push).not.toHaveBeenCalled()
    expect(probeWindow.__appNavigationProbe).toBeUndefined()
  })

  it('follows an in-app path with the router', () => {
    const router = fakeRouter()
    const { follow } = setup(router)
    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
    follow(event, { href: '/workloads' })
    expect(router.push).toHaveBeenCalledWith('/workloads')
    expect(event.defaultPrevented).toBe(true)
  })

  it('renders no href for an unsafe row in the menu tree', () => {
    const { hrefOf } = setup()
    const [group] = toMenuGroups(
      [
        {
          items: [
            { id: 'home', label: 'Home', href: '/' },
            { id: 'bad', label: 'Bad', href: PROBE }
          ]
        }
      ],
      hrefOf
    )
    expect(group!.items[0]!.href).toBe('/')
    expect(group!.items[1]!.href).toBeUndefined()
  })

  it('never matches an unsafe row as the active one', () => {
    const { hrefOf } = setup()
    expect(
      matchActiveId([{ items: [{ id: 'bad', label: 'Bad', href: PROBE }] }], '/', hrefOf)
    ).toBe('')
  })

  it('lists only enabled rows with a destination in the palette', () => {
    const blocks = navPaletteGroups([
      {
        label: 'Main',
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'off', label: 'Off', href: '/off', disabled: true },
          { id: 'none', label: 'None' }
        ]
      }
    ])
    expect(blocks.flatMap((block) => block.items.map((item) => item.id))).toEqual(['home'])
  })
})
