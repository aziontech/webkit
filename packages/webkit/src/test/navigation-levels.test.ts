import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { collectNavigation, navigationFindings } from '../cli/navigation-levels.js'
import ConsoleLayout, {
  type ConsoleLayoutNavGroup
} from '../components/layout/console-layout/console-layout.vue'
import Menu from '../components/navigation/menu/menu.vue'

const ACCESS_RULES = '/policies/acme/private-access/access-rules'

const navigation = (withAccessRules: boolean): ConsoleLayoutNavGroup[] => [
  {
    items: [
      { id: 'overview', label: 'Overview', href: '/' },
      { id: 'policies', label: 'Policies', href: '/policies' },
      ...(withAccessRules
        ? [{ id: 'access-rules', label: 'Access rules', href: ACCESS_RULES }]
        : [])
    ]
  },
  {
    label: 'More',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        kind: 'drill',
        groups: [
          {
            label: 'Settings',
            items: [
              { id: 'settings-users', label: 'Users management', href: '/settings/users' },
              { id: 'settings-rules', label: 'Rules', href: ACCESS_RULES }
            ]
          }
        ]
      }
    ]
  }
]

const pageGroups = [
  {
    label: 'Private access',
    items: [
      {
        id: 'app-segments',
        label: 'App segments',
        href: '/policies/acme/private-access/app-segments'
      },
      { id: 'access-rules', label: 'Access rules', href: ACCESS_RULES }
    ]
  }
]

const mount = (withAccessRules: boolean) =>
  render(
    defineComponent({
      render: () =>
        h('div', { style: { width: '1200px' } }, [
          h(
            ConsoleLayout,
            {
              navigation: navigation(withAccessRules),
              activeId: withAccessRules ? 'access-rules' : 'policies',
              breadcrumbs: [{ label: 'Policies', href: '/policies' }, { label: 'acme-default' }]
            },
            {
              default: () =>
                h(Menu, {
                  groups: pageGroups,
                  activeId: 'access-rules',
                  'aria-label': 'Private access'
                })
            }
          )
        ])
    })
  )

describe('navigation levels collector', () => {
  it('reports a route the rail and an in-page Menu both offer, naming both controls', async () => {
    mount(true)
    await waitFor(() => expect(document.querySelectorAll('a[aria-current="page"]').length).toBe(2))
    const findings = navigationFindings(collectNavigation())
    expect(findings).toHaveLength(1)
    expect(findings[0]?.rule).toBe('webkit-navigation-levels/duplicate-route')
    expect(findings[0]?.route).toBe(ACCESS_RULES)
    expect(findings[0]?.controls).toContain('Private access')
    expect(findings[0]?.controls).toHaveLength(2)
  })

  it('passes once the rail row is gone, ignoring the breadcrumb and closed drill levels', async () => {
    mount(false)
    await waitFor(() => expect(document.querySelectorAll('a[aria-current="page"]').length).toBe(2))
    const snapshot = collectNavigation()
    expect(snapshot.controls.map((c: { name: string }) => c.name)).toContain('Private access')
    expect(navigationFindings(snapshot)).toEqual([])
  })
})
