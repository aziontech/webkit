import Accordion from '@aziontech/webkit/accordion'
import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Divider from '@aziontech/webkit/divider'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import Dropdown from '@aziontech/webkit/dropdown'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import Hint from '@aziontech/webkit/hint'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Popover from '@aziontech/webkit/popover'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Spinner from '@aziontech/webkit/spinner'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare } from './_summary-markup'

const SERVICE_RESOURCES = [
  {
    key: 'service',
    label: 'Service',
    name: 'web-app',
    icon: 'pi pi-server',
    note: '',
    total: 6,
    versions: [
      {
        id: 'AEO25I38',
        name: 'AEO25I38',
        author: 'Rafael Umman',
        createdAgo: '1 day ago',
        active: true
      },
      {
        id: 'AG1VVDJP',
        name: 'AG1VVDJP',
        author: 'Marcus Grando',
        createdAgo: '3 days ago'
      },
      {
        id: 'AHFPL906',
        name: 'AHFPL906',
        author: 'Bruno Germano',
        createdAgo: '3 days ago'
      },
      { id: 'AITJB4GN', name: 'AITJB4GN', author: 'Gab Lisboa', createdAgo: '4 days ago' },
      {
        id: 'AK7D0ZX4',
        name: 'AK7D0ZX4',
        author: 'Robson Junior',
        createdAgo: '6 days ago'
      }
    ],
    owner: true,
    dependencies: [
      {
        key: 'service@AG1VVDJP:module-auth-gateway',
        label: 'Module',
        name: 'auth-gateway',
        icon: 'pi pi-code',
        note: '',
        total: 8,
        versions: [
          {
            id: 'APICRFV0',
            name: 'APICRFV0',
            author: 'Rafael Umman',
            createdAgo: '2 days ago'
          },
          {
            id: 'AQW6HBBH',
            name: 'AQW6HBBH',
            author: 'Marcus Grando',
            createdAgo: '3 days ago'
          },
          {
            id: 'ASA076RY',
            name: 'ASA076RY',
            author: 'Bruno Germano',
            createdAgo: '5 days ago'
          },
          {
            id: 'ATNTX28F',
            name: 'ATNTX28F',
            author: 'Gab Lisboa',
            createdAgo: '5 days ago'
          },
          {
            id: 'AV1NMXOW',
            name: 'AV1NMXOW',
            author: 'Robson Junior',
            createdAgo: '6 days ago'
          }
        ]
      },
      {
        key: 'service@AG1VVDJP:module-geo-redirect',
        label: 'Module',
        name: 'geo-redirect',
        icon: 'pi pi-code',
        note: '',
        total: 11,
        versions: [
          {
            id: 'AK16MQ4R',
            name: 'AK16MQ4R',
            author: 'Herbert Júlio',
            createdAgo: '2 days ago'
          },
          {
            id: 'ALF0CLL8',
            name: 'ALF0CLL8',
            author: 'Rafael Umman',
            createdAgo: '4 days ago'
          },
          {
            id: 'AMSU2H1P',
            name: 'AMSU2H1P',
            author: 'Marcus Grando',
            createdAgo: '4 days ago'
          },
          {
            id: 'AO6NSCI6',
            name: 'AO6NSCI6',
            author: 'Bruno Germano',
            createdAgo: '6 days ago'
          },
          {
            id: 'APKHI7YN',
            name: 'APKHI7YN',
            author: 'Gab Lisboa',
            createdAgo: '6 days ago'
          }
        ]
      },
      {
        key: 'service@AG1VVDJP:integration-payments-api',
        label: 'Integration',
        name: 'payments-api',
        icon: 'pi pi-link',
        note: '',
        total: 11,
        versions: [
          {
            id: 'ASEKWJQF',
            name: 'ASEKWJQF',
            author: 'Gab Lisboa',
            createdAgo: '21 hours ago'
          },
          {
            id: 'ATSEMF6W',
            name: 'ATSEMF6W',
            author: 'Robson Junior',
            createdAgo: '2 days ago'
          },
          {
            id: 'AV68CAND',
            name: 'AV68CAND',
            author: 'Isaque Böck',
            createdAgo: '2 days ago'
          },
          {
            id: 'AWK2263U',
            name: 'AWK2263U',
            author: 'Rafael Garbinatto',
            createdAgo: '3 days ago'
          },
          {
            id: 'AXXVS1KB',
            name: 'AXXVS1KB',
            author: 'Herbert Júlio',
            createdAgo: '5 days ago'
          }
        ]
      }
    ]
  }
]

const PROJECT_GROUPS = [
  {
    key: 'serving',
    label: 'Serving web-app',
    projects: [
      {
        id: '1020655',
        name: 'project-01',
        detail: '2 environments',
        domains: [
          {
            environment: 'Production',
            total: 8,
            summary: '8 domains',
            domains: [
              'project-1.example.com',
              'project-1-alias-1.example.com',
              'project-1-alias-2.example.com',
              'project-1-alias-3.example.com',
              'project-1-alias-4.example.com',
              'project-1-alias-5.example.com',
              'project-1-alias-6.example.com',
              'project-1-alias-7.example.com'
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'flexible',
    label: 'Flexible',
    projects: [
      {
        id: '1031410004',
        name: 'campaign-landing',
        detail: 'Serves black-friday-2025',
        domains: [
          {
            environment: 'Production',
            total: 1,
            summary: '1 domains',
            domains: ['campaign.example.com']
          }
        ]
      },
      {
        id: '1031410005',
        name: 'docs-site',
        detail: 'Serves docs-web · Preview only',
        domains: [
          {
            environment: 'Preview',
            total: 1,
            summary: '1 domains',
            domains: ['*-preview.docs.example.com']
          }
        ]
      },
      {
        id: '1021001',
        name: 'project-03',
        detail: 'Serves analytics-pro',
        domains: [
          {
            environment: 'Production',
            total: 22,
            summary: '10 of 22 domains',
            domains: [
              'project-3.example.com',
              'project-3-alias-1.example.com',
              'project-3-alias-2.example.com',
              'project-3-alias-3.example.com',
              'project-3-alias-4.example.com',
              'project-3-alias-5.example.com',
              'project-3-alias-6.example.com',
              'project-3-alias-7.example.com',
              'project-3-alias-8.example.com',
              'project-3-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1021866',
        name: 'project-08',
        detail: 'Serves ecommerce-v2',
        domains: [
          {
            environment: 'Production',
            total: 57,
            summary: '10 of 57 domains',
            domains: [
              'project-8.example.com',
              'project-8-alias-1.example.com',
              'project-8-alias-2.example.com',
              'project-8-alias-3.example.com',
              'project-8-alias-4.example.com',
              'project-8-alias-5.example.com',
              'project-8-alias-6.example.com',
              'project-8-alias-7.example.com',
              'project-8-alias-8.example.com',
              'project-8-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1022731',
        name: 'project-13',
        detail: 'Serves mobile-app',
        domains: [
          {
            environment: 'Production',
            total: 92,
            summary: '10 of 92 domains',
            domains: [
              'project-13.example.com',
              'project-13-alias-1.example.com',
              'project-13-alias-2.example.com',
              'project-13-alias-3.example.com',
              'project-13-alias-4.example.com',
              'project-13-alias-5.example.com',
              'project-13-alias-6.example.com',
              'project-13-alias-7.example.com',
              'project-13-alias-8.example.com',
              'project-13-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1023596',
        name: 'project-18',
        detail: 'Serves react-dashboard',
        domains: [
          {
            environment: 'Production',
            total: 28,
            summary: '10 of 28 domains',
            domains: [
              'project-18.example.com',
              'project-18-alias-1.example.com',
              'project-18-alias-2.example.com',
              'project-18-alias-3.example.com',
              'project-18-alias-4.example.com',
              'project-18-alias-5.example.com',
              'project-18-alias-6.example.com',
              'project-18-alias-7.example.com',
              'project-18-alias-8.example.com',
              'project-18-alias-9.example.com'
            ]
          }
        ]
      }
    ]
  }
]

const SERVICE_ENVIRONMENTS = [
  {
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.',
    tag: 'Last used'
  },
  {
    name: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
    tag: ''
  }
]

const IMPACTED_PROJECTS = [
  {
    environment: 'Production',
    projects: [
      {
        id: '1020655',
        name: 'project-01',
        selected: true,
        domains: [
          {
            environment: 'Production',
            total: 8,
            summary: '8 domains',
            domains: [
              'project-1.example.com',
              'project-1-alias-1.example.com',
              'project-1-alias-2.example.com',
              'project-1-alias-3.example.com',
              'project-1-alias-4.example.com',
              'project-1-alias-5.example.com',
              'project-1-alias-6.example.com',
              'project-1-alias-7.example.com'
            ]
          }
        ]
      },
      {
        id: '1021347',
        name: 'project-05',
        domains: [
          {
            environment: 'Production',
            total: 36,
            summary: '10 of 36 domains',
            domains: [
              'project-5.example.com',
              'project-5-alias-1.example.com',
              'project-5-alias-2.example.com',
              'project-5-alias-3.example.com',
              'project-5-alias-4.example.com',
              'project-5-alias-5.example.com',
              'project-5-alias-6.example.com',
              'project-5-alias-7.example.com',
              'project-5-alias-8.example.com',
              'project-5-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1022039',
        name: 'project-09',
        domains: [
          {
            environment: 'Production',
            total: 64,
            summary: '10 of 64 domains',
            domains: [
              'project-9.example.com',
              'project-9-alias-1.example.com',
              'project-9-alias-2.example.com',
              'project-9-alias-3.example.com',
              'project-9-alias-4.example.com',
              'project-9-alias-5.example.com',
              'project-9-alias-6.example.com',
              'project-9-alias-7.example.com',
              'project-9-alias-8.example.com',
              'project-9-alias-9.example.com'
            ]
          }
        ]
      }
    ]
  }
]

const SERVING_PROJECTS = [
  {
    id: '1020655',
    name: 'project-01',
    domain: 'project-1.example.com',
    environment: 'Production'
  }
]

const PROJECT_FIRST_ENVIRONMENTS = [
  {
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.',
    tag: 'Last used'
  },
  {
    name: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
    tag: ''
  },
  {
    name: 'Stage',
    description: 'A rehearsal before Production. Each version keeps its own URL.',
    tag: ''
  }
]

const PROJECT_RESOURCES = [
  {
    key: 'service',
    label: 'Service',
    name: 'project-01-web',
    icon: 'pi pi-server',
    note: '',
    total: 12,
    versions: [
      {
        id: 'AWPT11GA',
        name: 'AWPT11GA',
        author: 'Rafael Garbinatto',
        createdAgo: '21 hours ago',
        active: true
      },
      {
        id: 'AY3MQWWR',
        name: 'AY3MQWWR',
        author: 'Herbert Júlio',
        createdAgo: '2 days ago'
      },
      {
        id: 'AZHGGSD8',
        name: 'AZHGGSD8',
        author: 'Rafael Umman',
        createdAgo: '4 days ago'
      },
      {
        id: 'A1VA6NTP',
        name: 'A1VA6NTP',
        author: 'Marcus Grando',
        createdAgo: '4 days ago'
      },
      {
        id: 'A393WJA6',
        name: 'A393WJA6',
        author: 'Bruno Germano',
        createdAgo: '6 days ago'
      }
    ],
    owner: true,
    dependencies: [
      {
        key: 'service@AWPT11GA:module-image-optimizer',
        label: 'Module',
        name: 'image-optimizer',
        icon: 'pi pi-code',
        note: '',
        total: 6,
        versions: [
          {
            id: 'ATNSEE8Y',
            name: 'ATNSEE8Y',
            author: 'Rafael Garbinatto',
            createdAgo: '2 days ago'
          },
          {
            id: 'AV1M49PF',
            name: 'AV1M49PF',
            author: 'Herbert Júlio',
            createdAgo: '3 days ago'
          },
          {
            id: 'AWFFU55W',
            name: 'AWFFU55W',
            author: 'Rafael Umman',
            createdAgo: '4 days ago'
          },
          {
            id: 'AXT9K0MD',
            name: 'AXT9K0MD',
            author: 'Marcus Grando',
            createdAgo: '6 days ago'
          },
          {
            id: 'AZ739W2U',
            name: 'AZ739W2U',
            author: 'Bruno Germano',
            createdAgo: '6 days ago'
          }
        ]
      },
      {
        key: 'service@AWPT11GA:integration-search-index',
        label: 'Integration',
        name: 'search-index',
        icon: 'pi pi-link',
        note: '',
        total: 3,
        versions: [
          {
            id: 'AHMVCHSJ',
            name: 'AHMVCHSJ',
            author: 'Herbert Júlio',
            createdAgo: '2 days ago'
          },
          {
            id: 'AJ0P2D90',
            name: 'AJ0P2D90',
            author: 'Rafael Umman',
            createdAgo: '4 days ago'
          },
          {
            id: 'AKEIS8PH',
            name: 'AKEIS8PH',
            author: 'Marcus Grando',
            createdAgo: '4 days ago'
          }
        ]
      }
    ]
  },
  {
    key: 'storage',
    label: 'Storage',
    name: 'project-01-storage',
    icon: 'pi pi-database',
    note: 'Not versioned',
    total: 0,
    versions: [],
    owner: false,
    dependencies: []
  }
]

const PROJECT_ENVIRONMENTS = [
  {
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.',
    tag: 'Last used',
    setting: { name: 'shared-storefront', shared: true, projects: ['project-05', 'project-09'] }
  },
  {
    name: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
    tag: '',
    setting: { name: 'project-01-preview', shared: false, projects: [] }
  }
]

const SERVICE_NAME = 'web-app'

const PINNED_VERSION = 'AG1VVDJP'

const PENDING_VERSION = 'A77SA473'

const PROJECT_ID = '1020655'

const PROJECT_NAME = 'project-01'

const NEW_PROJECT = { name: SERVICE_NAME, domain: `${SERVICE_NAME}.example.com` }

const PROJECT_MODES = [
  { value: 'existing', label: 'Use existing' },
  { value: 'new', label: 'Create new' }
]

const SERVICE_HINTS = {
  resources:
    'The service version this deployment publishes, and the version of every module and integration it references.',
  project: 'The project whose domains serve the service. Create one to publish it on a new domain.',
  environment:
    'Where the deployment goes live, from the environments this project serves. Each one publishes with the Deployment Settings set on the project.',
  projects:
    'This environment publishes with shared Deployment Settings, so the deployment reaches every project below, in every environment they are linked to, and the domains they serve.',
  flatEnvironment:
    'Where the deployment goes live. Each environment publishes with its own Deployment Settings.'
}

const PROJECT_HINTS = {
  resources:
    'Everything this project serves, at the version this deployment publishes, with the version of every dependency they reference.',
  environment:
    'Where the deployment goes live. Each environment publishes with its own Deployment Settings.'
}

const SECTION_CLASS =
  'grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]'

const PENDING_CLASS =
  'transition-opacity duration-moderate-01 ease-productive-entrance data-pending:opacity-32 motion-reduce:transition-none'

const section = ({ title, hint, body, pending = false, fades = false }) => `<section
  data-stacked="true"${pending ? '\n  inert\n  data-pending="true"' : ''}
  class="${SECTION_CLASS}${pending || fades ? ` ${PENDING_CLASS}` : ''}"
>
  <div
    data-stacked="true"
    class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
  >
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
        <span class="flex items-center gap-(--spacing-xs)">${title}</span>
      </h2>
      <Hint text="${hint}" class="shrink-0" />
    </div>
  </div>

  <div
    data-open="true"
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 data-collapsible:overflow-hidden">
      <div
        data-open="true"
        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
      >
${indent(body, 4)}
      </div>
    </div>
  </div>
</section>`

const drawer = ({
  title,
  description = '',
  body,
  disabled = false
}) => `<Drawer v-model:open="open" size="medium" side="right">
  <DrawerTrigger>
    <Button label="Deploy" kind="outlined" size="medium" icon="pi pi-cloud-upload" />
  </DrawerTrigger>

  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="${title}"
        novalidate
        @submit.prevent="open = false"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>${title}</DrawerTitle>${
              description
                ? `\n            <p class="text-body-sm text-(--text-muted)">\n              ${description}\n            </p>`
                : ''
            }
          </div>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
            <legend class="sr-only">${title}</legend>
${indent(body, 6)}
          </fieldset>
        </PanelContent>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
            <Button label="Deploy" kind="primary" size="medium"${disabled ? ' disabled' : ''} type="submit" />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const versionPicker = (
  v
) => `<Popover v-model:open="versionOpen[${v}.key]" placement="bottom-end" width="small">
  <Popover.Trigger>
    <Button
      label="Change Version"
      kind="outlined"
      size="small"
      icon="pi pi-chevron-down"
      icon-position="trailing"
      :disabled="!${v}.versions.length"
    />
  </Popover.Trigger>
  <Popover.Content>
    <div
      class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
    >
      <p class="text-label-sm text-(--text-muted)">{{ versionSummary(${v}) }}</p>
      <InputText
        v-if="${v}.total > ${v}.versions.length"
        size="medium"
        placeholder="Search versions"
        aria-label="Search versions"
      >
        <template #iconLeft>
          <i class="pi pi-search" aria-hidden="true" />
        </template>
      </InputText>
    </div>

    <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
      <button
        v-for="entry in ${v}.versions"
        :key="entry.id"
        type="button"
        :aria-current="entry.id === versionOf(${v}).id || undefined"
        class="flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
        @click="pickVersion(${v}, entry.id)"
      >
        <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-default)">
              {{ entry.name }}
            </span>
            <Tag v-if="entry.active" label="Active" severity="success" size="small" class="shrink-0" />
          </span>
          <span class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)">
            <Avatar :alt="entry.author" :label="entry.author" size="small" kind="square" class="shrink-0" />
            <span class="truncate">{{ entry.author }} · {{ entry.createdAgo }}</span>
          </span>
        </span>
        <i
          v-if="entry.id === versionOf(${v}).id"
          class="pi pi-check shrink-0 text-body-xs text-(--text-default)"
          aria-hidden="true"
        />
      </button>
    </div>

    <div v-if="${v}.total > ${v}.versions.length" class="border-t border-(--border-default) p-(--spacing-xxs)">
      <Button
        :label="\`Load \${Math.min(${v}.versions.length, ${v}.total - ${v}.versions.length)} more\`"
        kind="text"
        size="small"
        class="w-full"
      />
    </div>

    <span class="sr-only" role="status">{{ versionSummary(${v}) }}</span>
  </Popover.Content>
</Popover>`

const resourceMedia = (v, nested) =>
  nested
    ? `<span class="flex size-5 items-center justify-center">
  <i :class="${v}.icon" class="text-body-xs text-(--text-muted)" aria-hidden="true" />
</span>`
    : `<span
  class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
>
  <i :class="${v}.icon" class="text-body-xs text-(--text-default)" aria-hidden="true" />
</span>`

const resourceRow = (v, { loop = '', nested = false } = {}) => `<Item${loop ? `\n  ${loop}` : ''}
  kind="inline"
  size="small"
>
  <Item.Media>
${indent(resourceMedia(v, nested), 2)}
  </Item.Media>
  <Item.Content>
    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
      <span class="shrink-0 text-body-sm text-(--text-muted)">
        {{ ${v}.label }}
      </span>
      <Item.Title>{{ ${v}.name }}</Item.Title>
      <Tag
        v-if="!${v}.note"
        :label="${v}.versions.length ? 'Ready' : 'No ready version'"
        :severity="${v}.versions.length ? 'success' : 'warning'"
        size="small"
        class="shrink-0"
      />
    </span>
    <Item.Description>
      {{ ${v}.note || versionOf(${v}).name }}
    </Item.Description>
  </Item.Content>
  <Item.Actions v-if="!${v}.note">
${indent(versionPicker(v), 2)}
  </Item.Actions>
</Item>`

const RESOURCES = `<CardBox :padded="false">
  <template #content>
    <template v-for="(row, index) in resources" :key="row.key">
      <Divider v-if="index" />
${indent(resourceRow('row'), 3)}
      <template v-if="row.owner">
        <Divider />
        <Accordion type="single" collapsible size="small">
          <Accordion.Item value="dependencies">
            <Accordion.Trigger>
              <span class="text-label-sm text-(--text-default)">Dependencies</span>
            </Accordion.Trigger>
            <Accordion.Content>
              <div class="min-w-0 px-(--spacing-md) py-(--spacing-md)">
                <p v-if="!row.dependencies.length" class="text-body-sm text-(--text-muted)">
                  {{ row.name }} references no other resources.
                </p>
                <Item.Group v-else>
                  <div class="flex flex-col gap-(--spacing-sm)">
  ${indent(resourceRow('dependency', { loop: 'v-for="dependency in row.dependencies" :key="dependency.key"', nested: true }), 9)}
                  </div>
                </Item.Group>
                <span class="sr-only" role="status" />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </template>
    </template>
  </template>
</CardBox>`

const domainList = (
  source,
  extra = ''
) => `<ul${extra} class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xxs) p-0">
  <li
    v-for="domainGroup in ${source}"
    :key="domainGroup.environment"
    class="flex min-w-0 items-center gap-(--spacing-xs)"
  >
    <Tag :label="domainGroup.environment" severity="secondary" size="small" class="shrink-0" />
    <div class="flex min-w-0">
      <Tooltip :text="\`Open \${domainGroup.domains[0]} in a new tab\`" class="w-full">
        <a
          :href="\`https://\${domainGroup.domains[0]}\`"
          target="_blank"
          rel="noopener noreferrer"
          data-link="true"
          class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
        >
          <span class="truncate underline-offset-2 group-hover/link:underline">
            {{ domainGroup.domains[0] }}
          </span>
          <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
          <i class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />
        </a>
      </Tooltip>
    </div>
    <Popover v-if="domainGroup.total > 1" placement="bottom-start" width="small">
      <Popover.Trigger>
        <div class="shrink-0 cursor-pointer">
          <Tag
            :label="\`+\${domainGroup.total - 1}\`"
            severity="secondary"
            size="small"
          />
        </div>
      </Popover.Trigger>
      <Popover.Content>
        <div
          class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
        >
          <p class="text-label-sm text-(--text-muted)">
            {{ domainGroup.summary }}
          </p>
          <InputText
            v-if="domainGroup.total > 10"
            size="medium"
            placeholder="Search domains"
            aria-label="Search domains"
          >
            <template #iconLeft>
              <i class="pi pi-search" aria-hidden="true" />
            </template>
          </InputText>
        </div>

        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
          <a
            v-for="domain in domainGroup.domains"
            :key="domain"
            :href="\`https://\${domain}\`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
          >
            <span class="truncate">{{ domain }}</span>
            <i class="pi pi-external-link ml-auto shrink-0 text-body-xs leading-none" aria-hidden="true" />
          </a>
        </div>

        <div
          v-if="domainGroup.total > domainGroup.domains.length"
          class="border-t border-(--border-default) p-(--spacing-xxs)"
        >
          <Button
            :label="\`Load \${Math.min(10, domainGroup.total - domainGroup.domains.length)} more\`"
            kind="text"
            size="small"
            class="w-full"
          />
        </div>

        <span class="sr-only" role="status">
          {{ domainGroup.summary }}
        </span>
      </Popover.Content>
    </Popover>
  </li>
</ul>`

const PROJECT_MEDIA = `<Item.Media>
  <span
    class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
  >
    <i class="pi pi-box text-body-xs text-(--text-default)" aria-hidden="true" />
  </span>
</Item.Media>`

const MODE_SWITCH = `<template #header>
  <SegmentedButton
    v-model="projectMode"
    :options="projectModes"
    size="medium"
    fluid
    aria-label="Project"
    class="w-full"
  />
</template>`

const PROJECT_FIELD = `<CardBox :padded="false">
${indent(MODE_SWITCH)}
  <template #content>
    <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
      <Item kind="outline" size="small">
${indent(PROJECT_MEDIA, 4)}
        <Item.Content>
          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Item.Title>{{ project.name }}</Item.Title>
            <Tag v-if="projectMode === 'new'" label="New" severity="success" size="small" class="shrink-0" />
          </span>
          <Item.Description v-if="projectMode === 'new'">
            Gets its domains on the first deploy.
          </Item.Description>
${indent(domainList('project.domains', ' v-else'), 5)}
        </Item.Content>
        <Item.Actions v-if="projectMode === 'existing'">
          <Dropdown placement="bottom-end" @select="(event, id) => (projectId = String(id))">
            <Dropdown.Trigger>
              <Button
                label="Change"
                kind="outlined"
                size="small"
                icon="pi pi-chevron-down"
                icon-position="trailing"
              />
            </Dropdown.Trigger>
            <Dropdown.Group v-for="group in projectGroups" :key="group.key" :label="group.label">
              <Dropdown.Option
                v-for="entry in group.projects"
                :key="entry.id"
                :value="entry.id"
                :label="entry.name"
                :selected="entry.id === project.id"
              >
                <template #right>
                  <span class="truncate text-body-xs text-(--text-muted)">
                    {{ entry.detail }}
                  </span>
                </template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </Item.Actions>
      </Item>
    </div>
  </template>
</CardBox>`

const environmentField = (
  name
) => `<div role="radiogroup" aria-label="Environment" class="flex min-w-0 flex-col gap-(--spacing-xs)">
  <div v-for="entry in environmentChoices" :key="entry.name" class="relative min-w-0">
    <FieldRadioBlock
      v-model="environment"
      name="${name}"
      :value="entry.name"
      :label="entry.name"
      :description="entry.description"
    />
    <div v-if="entry.tag" class="pointer-events-none absolute right-(--spacing-sm) top-(--spacing-sm)">
      <Tag
        :label="entry.tag"
        severity="info"
        size="small"
      />
    </div>
  </div>
</div>`

const IMPACTED = `<div class="flex min-w-0 flex-col gap-(--spacing-md)">
  <div
    v-for="group in impacted"
    :key="group.environment"
    class="flex min-w-0 flex-col gap-(--spacing-xs)"
  >
    <ul
      class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xs) p-0"
      :aria-label="\`Projects impacted in \${group.environment} (\${group.projects.length})\`"
    >
      <li v-for="target in group.projects" :key="target.id" class="min-w-0">
        <Item kind="outline" size="small">
${indent(PROJECT_MEDIA, 5)}
          <Item.Content>
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <Item.Title>{{ target.name }}</Item.Title>
              <Tag
                v-if="target.selected"
                label="Selected"
                severity="secondary"
                size="small"
                class="shrink-0"
              />
            </span>
${indent(domainList('target.domains'), 6)}
          </Item.Content>
        </Item>
      </li>
    </ul>
  </div>
</div>`

const BUILD_ROW = `<Item kind="outline" size="small" aria-live="polite">
  <Item.Media>
    <span
      class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
    >
      <i class="pi pi-server text-body-xs text-(--text-default)" aria-hidden="true" />
    </span>
  </Item.Media>
  <Item.Content>
    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
      <Item.Title>${SERVICE_NAME}</Item.Title>
      <Tag label="${PENDING_VERSION}" severity="secondary" size="small" class="shrink-0" />
    </span>
    <Item.Description>Building…</Item.Description>
  </Item.Content>
  <Item.Actions>
    <span class="font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)">
      {{ elapsed }} s
    </span>
    <div class="contents text-(--text-default)">
      <Spinner class="shrink-0" />
    </div>
  </Item.Actions>
</Item>`

const environmentFirstTemplate = (building) =>
  drawer({
    title: building ? 'Build and Deployment' : 'Deploy',
    disabled: building,
    body: [
      section({
        title: 'Resources',
        hint: SERVICE_HINTS.resources,
        body: building ? BUILD_ROW : RESOURCES
      }),
      section({
        title: 'Project',
        hint: SERVICE_HINTS.project,
        body: PROJECT_FIELD,
        pending: building,
        fades: true
      }),
      section({
        title: 'Environment',
        hint: SERVICE_HINTS.environment,
        body: environmentField('service-deploy-environment'),
        pending: building,
        fades: true
      }),
      section({
        title: 'Projects Impacted',
        hint: SERVICE_HINTS.projects,
        body: IMPACTED,
        pending: building,
        fades: true
      }),
      '<span class="sr-only" role="status" />'
    ].join('\n\n')
  })

const PROJECT_FIRST_CARD = `<CardBox :padded="false">
${indent(MODE_SWITCH)}
  <template #content>
    <div class="p-(--spacing-lg)">
      <Item kind="outline" size="small">
${indent(PROJECT_MEDIA, 4)}
        <Item.Content>
          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Item.Title>{{ project.name }}</Item.Title>
            <Tag v-if="isLastUsed" label="Last used" severity="info" size="small" class="shrink-0" />
          </span>
          <Item.Description>{{ project.domain }}</Item.Description>
        </Item.Content>
        <Item.Actions v-if="projectMode === 'existing'">
          <Popover v-model:open="projectOpen" placement="bottom-end" width="small">
            <Popover.Trigger>
              <Button
                label="Change"
                kind="outlined"
                size="small"
                icon="pi pi-chevron-down"
                icon-position="trailing"
              />
            </Popover.Trigger>
            <Popover.Content>
              <div class="flex min-w-0 flex-col p-(--spacing-xxs)">
                <p class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)">
                  Projects serving ${SERVICE_NAME}
                </p>
                <div class="max-h-72 overflow-y-auto overscroll-contain">
                  <button
                    v-for="(entry, index) in boundProjects"
                    :key="entry.id"
                    type="button"
                    :aria-current="entry.id === project.id || undefined"
                    class="flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                    @click="pickProject(entry.id)"
                  >
                    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span class="truncate text-body-sm text-(--text-default)">
                          {{ entry.name }}
                        </span>
                        <Tag
                          v-if="index === 0 && entry.environment"
                          label="Last used"
                          severity="info"
                          size="small"
                          class="shrink-0"
                        />
                      </span>
                      <span v-if="entry.environment" class="truncate text-body-xs text-(--text-muted)">
                        {{ entry.environment }}
                      </span>
                    </span>
                    <i
                      v-if="entry.id === project.id"
                      class="pi pi-check shrink-0 text-body-xs text-(--text-default)"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </Popover.Content>
          </Popover>
        </Item.Actions>
      </Item>
    </div>
  </template>
</CardBox>`

const PROJECT_FIRST_TEMPLATE = drawer({
  title: 'Deploy',
  body: [
    section({ title: 'Resources', hint: SERVICE_HINTS.resources, body: RESOURCES }),
    section({
      title: 'Project',
      hint: SERVICE_HINTS.project,
      body: PROJECT_FIRST_CARD,
      fades: true
    }),
    section({
      title: 'Environment',
      hint: SERVICE_HINTS.flatEnvironment,
      body: environmentField('service-deploy-environment'),
      fades: true
    })
  ].join('\n\n')
})

const PROJECT_ENVIRONMENT_FIELD = `${environmentField('project-deploy-environment')}

<Message
  v-if="sharedWith.length"
  severity="warning"
  size="small"
  :label="\`Deploying with \${setting.name} also publishes to \${sharedWith.join(', ')}.\`"
/>`

const PROJECT_TEMPLATE = drawer({
  title: 'Deploy',
  description: `Publish ${PROJECT_NAME}. Review what this release carries and where it lands.`,
  body: [
    section({ title: 'Resources', hint: PROJECT_HINTS.resources, body: RESOURCES }),
    section({
      title: 'Environment',
      hint: PROJECT_HINTS.environment,
      body: PROJECT_ENVIRONMENT_FIELD
    })
  ].join('\n\n')
})

const IMPORTS = {
  Accordion: "import Accordion from '@aziontech/webkit/accordion'",
  Avatar: "import Avatar from '@aziontech/webkit/avatar'",
  Button: "import Button from '@aziontech/webkit/button'",
  CardBox: "import CardBox from '@aziontech/webkit/card-box'",
  Divider: "import Divider from '@aziontech/webkit/divider'",
  Drawer: "import Drawer from '@aziontech/webkit/drawer'",
  DrawerClose: "import DrawerClose from '@aziontech/webkit/drawer-close'",
  DrawerContent: "import DrawerContent from '@aziontech/webkit/drawer-content'",
  DrawerOverlay: "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  DrawerPortal: "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  DrawerTitle: "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  DrawerTrigger: "import DrawerTrigger from '@aziontech/webkit/drawer-trigger'",
  Dropdown: "import Dropdown from '@aziontech/webkit/dropdown'",
  FieldRadioBlock: "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  Hint: "import Hint from '@aziontech/webkit/hint'",
  InputText: "import InputText from '@aziontech/webkit/input-text'",
  Item: "import Item from '@aziontech/webkit/item'",
  Message: "import Message from '@aziontech/webkit/message'",
  PanelContent: "import PanelContent from '@aziontech/webkit/panel-content'",
  PanelFooter: "import PanelFooter from '@aziontech/webkit/panel-footer'",
  PanelHeader: "import PanelHeader from '@aziontech/webkit/panel-header'",
  Popover: "import Popover from '@aziontech/webkit/popover'",
  SegmentedButton: "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  Spinner: "import Spinner from '@aziontech/webkit/spinner'",
  Tag: "import Tag from '@aziontech/webkit/tag'",
  Tooltip: "import Tooltip from '@aziontech/webkit/tooltip'"
}

const DRAWER_PARTS = [
  'Button',
  'Drawer',
  'DrawerClose',
  'DrawerContent',
  'DrawerOverlay',
  'DrawerPortal',
  'DrawerTitle',
  'DrawerTrigger',
  'Hint',
  'Item',
  'PanelContent',
  'PanelFooter',
  'PanelHeader',
  'Tag'
]

const RESOURCE_PARTS = ['Accordion', 'Avatar', 'CardBox', 'Divider', 'InputText', 'Popover']

const importLines = (parts, vue) => [
  ...[...new Set([...DRAWER_PARTS, ...parts])].sort().map((name) => IMPORTS[name]),
  `import { ${vue.join(', ')} } from 'vue'`
]

const RESOURCE_SCRIPT = [
  'const versionOf = (row) =>',
  '  row.versions.find((entry) => entry.id === picks[row.key]) ?? row.versions[0]',
  '',
  'const versionSummary = (row) =>',
  '  row.total > row.versions.length',
  '    ? `${row.versions.length} of ${row.total} Ready versions`',
  '    : `${row.total} Ready versions`',
  '',
  'const pickVersion = (row, id) => {',
  '  picks[row.key] = id',
  '  versionOpen[row.key] = false',
  '}'
]

const resetPicks = (pinned) => [
  '  Object.keys(picks).forEach((key) => delete picks[key])',
  ...(pinned ? [`  picks.service = '${pinned}'`] : []),
  '  Object.keys(versionOpen).forEach((key) => delete versionOpen[key])'
]

const resourceState = (resources, pinned) => {
  const picks = reactive(pinned ? { service: pinned } : {})
  const versionOpen = reactive({})
  return {
    resources,
    picks,
    versionOpen,
    versionOf: (row) =>
      row.versions.find((entry) => entry.id === picks[row.key]) ?? row.versions[0],
    versionSummary: (row) =>
      row.total > row.versions.length
        ? `${row.versions.length} of ${row.total} Ready versions`
        : `${row.total} Ready versions`,
    pickVersion: (row, id) => {
      picks[row.key] = id
      versionOpen[row.key] = false
    },
    clearPicks: () => {
      Object.keys(picks).forEach((key) => delete picks[key])
      if (pinned) picks.service = pinned
      Object.keys(versionOpen).forEach((key) => delete versionOpen[key])
    }
  }
}

const environmentFirstSetup = (building) => () => {
  const open = ref(false)
  const projectMode = ref('existing')
  const projectId = ref(PROJECT_ID)
  const environment = ref('Production')
  const { clearPicks, ...resources } = resourceState(SERVICE_RESOURCES, PINNED_VERSION)
  const project = computed(() =>
    projectMode.value === 'new'
      ? NEW_PROJECT
      : PROJECT_GROUPS.flatMap((group) => group.projects).find(
          (entry) => entry.id === projectId.value
        )
  )
  watch(open, (isOpen) => {
    if (!isOpen) return
    clearPicks()
    projectMode.value = 'existing'
    projectId.value = PROJECT_ID
    environment.value = 'Production'
  })
  return {
    open,
    ...(building ? { elapsed: ref(2) } : resources),
    projectModes: PROJECT_MODES,
    projectGroups: PROJECT_GROUPS,
    environmentChoices: SERVICE_ENVIRONMENTS,
    impacted: IMPACTED_PROJECTS,
    projectMode,
    projectId,
    environment,
    project
  }
}

const environmentFirstScript = (building) => [
  ...importLines(
    [
      'CardBox',
      'Dropdown',
      'FieldRadioBlock',
      'InputText',
      'Popover',
      'SegmentedButton',
      'Tooltip',
      ...(building ? ['Spinner'] : RESOURCE_PARTS)
    ],
    building ? ['computed', 'ref', 'watch'] : ['computed', 'reactive', 'ref', 'watch']
  ),
  '',
  ...(building ? [] : [declare('resources', SERVICE_RESOURCES), '']),
  declare('projectModes', PROJECT_MODES),
  '',
  declare('newProject', NEW_PROJECT),
  '',
  declare('projectGroups', PROJECT_GROUPS),
  '',
  declare('environmentChoices', SERVICE_ENVIRONMENTS),
  '',
  declare('impacted', IMPACTED_PROJECTS),
  '',
  'const open = ref(false)',
  ...(building
    ? ['const elapsed = ref(2)']
    : [
        `const picks = reactive({ service: '${PINNED_VERSION}' })`,
        'const versionOpen = reactive({})'
      ]),
  "const projectMode = ref('existing')",
  `const projectId = ref('${PROJECT_ID}')`,
  "const environment = ref('Production')",
  '',
  'const project = computed(() =>',
  "  projectMode.value === 'new'",
  '    ? newProject',
  '    : projectGroups',
  '        .flatMap((group) => group.projects)',
  '        .find((entry) => entry.id === projectId.value)',
  ')',
  ...(building ? [] : ['', ...RESOURCE_SCRIPT]),
  '',
  'watch(open, (isOpen) => {',
  '  if (!isOpen) return',
  ...(building ? [] : resetPicks(PINNED_VERSION)),
  "  projectMode.value = 'existing'",
  `  projectId.value = '${PROJECT_ID}'`,
  "  environment.value = 'Production'",
  '})'
]

const PROJECT_FIRST_SCRIPT = [
  ...importLines(
    ['CardBox', 'FieldRadioBlock', 'SegmentedButton', ...RESOURCE_PARTS],
    ['computed', 'reactive', 'ref', 'watch']
  ),
  '',
  declare('resources', SERVICE_RESOURCES),
  '',
  declare('projectModes', PROJECT_MODES),
  '',
  declare('newProject', NEW_PROJECT),
  '',
  declare('boundProjects', SERVING_PROJECTS),
  '',
  declare('environmentChoices', PROJECT_FIRST_ENVIRONMENTS),
  '',
  'const open = ref(false)',
  'const picks = reactive({})',
  'const versionOpen = reactive({})',
  "const projectMode = ref('existing')",
  'const projectId = ref(boundProjects[0].id)',
  'const projectOpen = ref(false)',
  "const environment = ref('Production')",
  '',
  'const project = computed(() =>',
  "  projectMode.value === 'new'",
  '    ? newProject',
  '    : boundProjects.find((entry) => entry.id === projectId.value)',
  ')',
  '',
  'const isLastUsed = computed(',
  "  () => projectMode.value === 'existing' && project.value.id === boundProjects[0].id",
  ')',
  '',
  'const pickProject = (id) => {',
  '  projectId.value = id',
  '  projectOpen.value = false',
  '}',
  '',
  ...RESOURCE_SCRIPT,
  '',
  'watch(open, (isOpen) => {',
  '  if (!isOpen) return',
  ...resetPicks(''),
  "  projectMode.value = 'existing'",
  '  projectId.value = boundProjects[0].id',
  '  projectOpen.value = false',
  "  environment.value = 'Production'",
  '})'
]

const projectFirstSetup = () => {
  const open = ref(false)
  const projectMode = ref('existing')
  const projectId = ref(SERVING_PROJECTS[0].id)
  const projectOpen = ref(false)
  const environment = ref('Production')
  const { clearPicks, ...resources } = resourceState(SERVICE_RESOURCES, '')
  const project = computed(() =>
    projectMode.value === 'new'
      ? NEW_PROJECT
      : SERVING_PROJECTS.find((entry) => entry.id === projectId.value)
  )
  const isLastUsed = computed(
    () => projectMode.value === 'existing' && project.value.id === SERVING_PROJECTS[0].id
  )
  const pickProject = (id) => {
    projectId.value = id
    projectOpen.value = false
  }
  watch(open, (isOpen) => {
    if (!isOpen) return
    clearPicks()
    projectMode.value = 'existing'
    projectId.value = SERVING_PROJECTS[0].id
    projectOpen.value = false
    environment.value = 'Production'
  })
  return {
    open,
    ...resources,
    projectModes: PROJECT_MODES,
    boundProjects: SERVING_PROJECTS,
    environmentChoices: PROJECT_FIRST_ENVIRONMENTS,
    projectMode,
    projectOpen,
    environment,
    project,
    isLastUsed,
    pickProject
  }
}

const PROJECT_SCRIPT = [
  ...importLines(
    ['CardBox', 'FieldRadioBlock', 'Message', ...RESOURCE_PARTS],
    ['computed', 'reactive', 'ref', 'watch']
  ),
  '',
  declare('resources', PROJECT_RESOURCES),
  '',
  declare('environmentChoices', PROJECT_ENVIRONMENTS),
  '',
  'const open = ref(false)',
  'const picks = reactive({})',
  'const versionOpen = reactive({})',
  "const environment = ref('Production')",
  '',
  'const setting = computed(',
  '  () => environmentChoices.find((entry) => entry.name === environment.value).setting',
  ')',
  '',
  'const sharedWith = computed(() => (setting.value.shared ? setting.value.projects : []))',
  '',
  ...RESOURCE_SCRIPT,
  '',
  'watch(open, (isOpen) => {',
  '  if (!isOpen) return',
  ...resetPicks(''),
  "  environment.value = 'Production'",
  '})'
]

const projectSetup = () => {
  const open = ref(false)
  const environment = ref('Production')
  const { clearPicks, ...resources } = resourceState(PROJECT_RESOURCES, '')
  const setting = computed(
    () => PROJECT_ENVIRONMENTS.find((entry) => entry.name === environment.value).setting
  )
  const sharedWith = computed(() => (setting.value.shared ? setting.value.projects : []))
  watch(open, (isOpen) => {
    if (!isOpen) return
    clearPicks()
    environment.value = 'Production'
  })
  return {
    open,
    ...resources,
    environmentChoices: PROJECT_ENVIRONMENTS,
    environment,
    setting,
    sharedWith
  }
}

const components = {
  Accordion,
  'Accordion.Item': Accordion.Item,
  'Accordion.Trigger': Accordion.Trigger,
  'Accordion.Content': Accordion.Content,
  Avatar,
  Button,
  CardBox,
  Divider,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  Dropdown,
  'Dropdown.Trigger': Dropdown.Trigger,
  'Dropdown.Group': Dropdown.Group,
  'Dropdown.Option': Dropdown.Option,
  FieldRadioBlock,
  Hint,
  InputText,
  Item,
  'Item.Group': Item.Group,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Message,
  PanelContent,
  PanelFooter,
  PanelHeader,
  Popover,
  'Popover.Trigger': Popover.Trigger,
  'Popover.Content': Popover.Content,
  SegmentedButton,
  Spinner,
  Tag,
  Tooltip
}

const story = ({ template, script, setup, description }) => ({
  render: () => ({ components, setup, template }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(script, template) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Overlays/DeployDrawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The drawer a platform deploys from, opened by the outlined Deploy button on a service or a project. Every variant shares one Resources card: a row per resource with its Ready tag, the picked version and a Change Version popover, and a Dependencies disclosure with the modules and integrations the service references. On a service the default flow is environment first: the Project card uses an existing project or creates one, the environments come as radio blocks, and Projects Impacted lists every project the environment’s shared Deployment Settings publish to. A deploy started without a pinned version first builds one, so the drawer opens as Build and Deployment with a Building row and the other sections faded. A service can also deploy project first, picking the project before the environment. On a project, the drawer carries every resource it serves and warns when its Deployment Settings also publish elsewhere. Built from `Drawer`, the `Panel` parts, `CardBox`, `Item`, `Accordion`, `Divider`, `Popover`, `Dropdown`, `SegmentedButton`, `FieldRadioBlock`, `InputText`, `Avatar`, `Tag`, `Hint`, `Spinner`, `Message`, `Tooltip` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'deploy drawer',
        'deploy panel',
        'deploy service',
        'choose versions to deploy',
        'dependencies before deploy',
        'release drawer',
        'gaveta de deploy',
        'implantar serviço',
        'escolher versão'
      ],
      skills: ['webkit-create-surface', 'webkit-form', 'webkit-ui-states']
    }
  }
}

export default meta

export const Service = story({
  template: environmentFirstTemplate(false),
  script: environmentFirstScript(false),
  setup: environmentFirstSetup(false),
  description:
    'Deploy on a Ready version of web-app: the pinned version in the Resources card with its three dependencies, project-01 with its Production domains and a Change menu that groups the projects serving the service apart from the Flexible ones, Production last used, and the three projects shared-storefront publishes to.'
})

export const Building = story({
  template: environmentFirstTemplate(true),
  script: environmentFirstScript(true),
  setup: environmentFirstSetup(true),
  description:
    'Deploy without a pinned version: the drawer opens as Build and Deployment, a Building row with the new version and its elapsed seconds stands in for the Resources card, and the Project, Environment and Projects Impacted sections stay faded and inert, with Deploy disabled, until the build lands.'
})

export const ServiceProjectFirst = story({
  template: PROJECT_FIRST_TEMPLATE,
  script: PROJECT_FIRST_SCRIPT,
  setup: projectFirstSetup,
  description:
    'The project-first flow: the same Resources card, a Project card with the last used project, its domain and a Change popover of the projects serving the service, then every environment as a radio block.'
})

export const Project = story({
  template: PROJECT_TEMPLATE,
  script: PROJECT_SCRIPT,
  setup: projectSetup,
  description:
    'Deploy on a project: the Resources card with the service it serves and its dependencies, then its storage, which is not versioned; Production and Preview below, with a warning that shared-storefront also publishes to project-05 and project-09.'
})
