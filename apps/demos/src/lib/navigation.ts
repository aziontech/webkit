import type { ConsoleLayoutNavGroup } from '@aziontech/ui/console-layout-root'
import { reactive } from 'vue'

export const navigation: ConsoleLayoutNavGroup[] = [
  {
    items: [{ id: 'copilot', label: 'Agent', icon: 'az az-ask-azion', href: '/assistant' }]
  },
  {
    label: 'Build',
    items: [{ id: 'resources', label: 'Resources', icon: 'az az-box', href: '/resources' }]
  },
  {
    label: 'Secure',
    items: [
      {
        id: 'network-lists',
        label: 'Network Lists',
        icon: 'az az-network-lists',
        href: '/network-lists'
      }
    ]
  },
  {
    label: 'Support',
    items: [
      { id: 'support-tickets', label: 'Tickets', icon: 'az az-ticket', href: '/support' },
      {
        id: 'support-canned-responses',
        label: 'Canned responses',
        icon: 'az az-reply',
        href: '/support/settings/canned-responses'
      }
    ]
  },
  {
    label: 'More',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: 'az az-settings',
        type: 'drill',
        groups: [
          {
            label: 'Settings',
            items: [
              { id: 'settings-general', label: 'Profile', href: '/settings' },
              { id: 'settings-api-keys', label: 'Integration keys', href: '/settings/api-keys' }
            ]
          }
        ]
      }
    ]
  }
]

export const account = reactive({ name: 'Amy Chen', email: 'amy.chen@example.com' })
