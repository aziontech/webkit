import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Checkbox from '@aziontech/webkit/checkbox'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import Switch from '@aziontech/webkit/switch'
import Textarea from '@aziontech/webkit/textarea'
import { computed, reactive, ref } from 'vue'

import { toSfc } from '../../_shared/story-source'
import {
  compactRow,
  compound,
  CREATE_PAGE_IMPORTS,
  createPage,
  declare,
  fieldRow,
  flushCard,
  section,
  VUE_IMPORT,
  webkitImport,
  webkitImports,
  wideRow
} from './_account-markup'

const PERMISSION_GROUPS = [
  {
    label: 'Content Delivery',
    resources: [
      { key: 'content-delivery', label: 'Content Delivery Settings', actions: ['view', 'edit'] },
      { key: 'applications', label: 'Applications', actions: ['view', 'edit'] },
      { key: 'workloads', label: 'Workloads', actions: ['view', 'edit'] },
      { key: 'connectors', label: 'Connectors', actions: ['view', 'edit'] },
      { key: 'custom-pages', label: 'Custom Pages', actions: ['view', 'edit'] },
      { key: 'dns', label: 'DNS', actions: ['view', 'edit'] }
    ]
  },
  {
    label: 'Security',
    resources: [
      { key: 'security', label: 'Security Settings', actions: ['view', 'edit'] },
      { key: 'firewall', label: 'Firewall', actions: ['view', 'edit'] },
      { key: 'network-lists', label: 'Network Lists', actions: ['view', 'edit'] },
      { key: 'policies', label: 'Policies', actions: ['view', 'edit'] }
    ]
  },
  {
    label: 'Edge Functions',
    resources: [{ key: 'functions', label: 'Functions', actions: ['view', 'edit'] }]
  },
  {
    label: 'Storage',
    resources: [
      { key: 'storage-bucket', label: 'Storage Bucket', actions: ['view', 'edit'] },
      { key: 'storage-object', label: 'Storage Object', actions: ['view', 'edit'] }
    ]
  },
  {
    label: 'Observability',
    resources: [
      { key: 'data-stream', label: 'Data Stream', actions: ['view', 'edit'] },
      { key: 'analytics', label: 'View analytics', single: true },
      { key: 'events', label: 'View Events', single: true }
    ]
  },
  {
    label: 'Deploy & Automation',
    resources: [
      { key: 'orchestrator-nodes', label: 'Orchestrator Nodes', actions: ['view', 'edit'] },
      { key: 'orchestrator-services', label: 'Orchestrator Services', actions: ['view', 'edit'] },
      {
        key: 'vcs-continuous-deployment',
        label: 'VCS Continuous Deployment',
        actions: ['view', 'edit']
      },
      { key: 'vcs-integrations', label: 'VCS Integrations', actions: ['view', 'edit'] }
    ]
  },
  {
    label: 'Billing',
    resources: [
      { key: 'subscriptions', label: 'Subscriptions', actions: ['view', 'edit'] },
      { key: 'payment-methods', label: 'Payment Methods', actions: ['view', 'edit'] },
      { key: 'bills', label: 'View Bills', single: true }
    ]
  },
  {
    label: 'Account & Users',
    resources: [
      { key: 'users', label: 'Users', actions: ['view', 'edit'] },
      { key: 'marketplace-publisher', label: 'Marketplace Publisher', actions: ['view', 'edit'] },
      { key: 'mfa', label: 'Edit Multi-Factor Authentication', single: true },
      { key: 'scim', label: 'SCIM Integration', single: true }
    ]
  },
  {
    label: 'Tools',
    resources: [
      { key: 'real-time-purge', label: 'Real-Time Purge', single: true },
      { key: 'wildcard-purge', label: 'Wildcard Purge', single: true }
    ]
  }
]

const BILLING_ADMINS = {
  name: 'Billing Admins',
  description: 'Manage subscriptions, payment methods, and invoices.',
  active: false,
  permissions: [
    'subscriptions.view',
    'subscriptions.edit',
    'payment-methods.view',
    'payment-methods.edit',
    'bills'
  ]
}

const breadcrumbFor = (last) => [
  { label: 'Settings', href: '/account' },
  { label: 'Teams and permissions', href: '/account/teams' },
  { label: last }
]

const resourcePermissions = (resource) => {
  if (resource.single) return [{ id: resource.key, label: resource.label, action: 'single' }]
  return resource.actions.map((action) => ({
    id: `${resource.key}.${action}`,
    action,
    label: `${action === 'view' ? 'View' : 'Edit'} ${resource.label}`
  }))
}

const columnPermission = (resource, column) => {
  const permissions = resourcePermissions(resource)
  if (resource.single) {
    const only = permissions[0]
    const implied = only.label.startsWith('View') ? 'view' : 'edit'
    return implied === column ? only : null
  }
  return permissions.find((permission) => permission.action === column) ?? null
}

const groupPermissionIds = (group) =>
  group.resources.flatMap((resource) =>
    resourcePermissions(resource).map((permission) => permission.id)
  )

const ALL_PERMISSION_IDS = PERMISSION_GROUPS.flatMap(groupPermissionIds)

const NAME_ROW = fieldRow(
  'Name',
  'Usually the role or the area the team is responsible for. The account list shows it beside every member of this team.',
  `<InputText
  v-model="form.name"
  size="large"
  class="w-full"
  aria-label="Name"
  autocomplete="off"
  :disabled="submitting"
  :required="!!errors.name"
  :aria-describedby="errors.name ? 'team-name-message' : undefined"
  @update:model-value="errors.name = ''"
/>
<HelperText v-if="errors.name" id="team-name-message" kind="required" :label="errors.name" />`
)

const DESCRIPTION_ROW = wideRow(
  'Description',
  'Optional. What this team is responsible for, for whoever assigns it later.',
  '<Textarea v-model="form.description" class="w-full" :rows="3" aria-label="Description" :disabled="submitting" />'
)

const permissionCell = (column) => `<div class="flex w-16 justify-center">
  <Checkbox
    v-if="columnPermission(resource, '${column}')"
    v-model="selected"
    :value="columnPermission(resource, '${column}').id"
    :aria-label="columnPermission(resource, '${column}').label"
  />
</div>`

const PERMISSIONS_CARD = `<CardBox>
  <template #content>
    <div class="flex flex-col gap-(--spacing-md)">
      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
        <InputText
          v-model="filterText"
          size="large"
          placeholder="Filter permissions"
          aria-label="Filter permissions"
          class="min-w-(--container-2xs) flex-1"
        >
          <template #iconLeft>
            <i class="pi pi-search" aria-hidden="true" />
          </template>
        </InputText>
        <Button type="button" label="Select all" kind="outlined" size="large" @click="selectAll" />
        <Button type="button" label="Clear" kind="text" size="large" @click="clearAll" />
      </div>

      <Message v-if="errors.permissions" severity="danger" :label="errors.permissions" />

      <div class="overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted)">
        <div
          v-for="group in visibleGroups"
          :key="group.label"
          class="border-b-(length:--border-width-default) border-(--border-muted) last:border-b-0"
        >
          <div class="flex items-center gap-(--spacing-sm) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-sm)">
            <Checkbox
              binary
              :model-value="groupChecked(group)"
              :indeterminate="groupIndeterminate(group)"
              :aria-label="'Select all ' + group.label + ' permissions'"
              @update:model-value="(checked) => toggleGroup(group, checked)"
            />
            <span class="flex-1 text-label-md text-(--text-default)">{{ group.label }}</span>
            <span class="w-16 text-center text-label-sm text-(--text-muted)">View</span>
            <span class="w-16 text-center text-label-sm text-(--text-muted)">Edit</span>
          </div>

          <div
            v-for="resource in group.resources"
            :key="resource.key"
            class="flex items-center gap-(--spacing-sm) border-t-(length:--border-width-default) border-(--border-muted) px-(--spacing-md) py-(--spacing-sm) hover:bg-(--bg-hover)"
          >
            <span class="flex-1 pl-(--spacing-lg) text-body-sm text-(--text-default)">{{ resource.label }}</span>
            ${permissionCell('view').split('\n').join('\n            ')}
            ${permissionCell('edit').split('\n').join('\n            ')}
          </div>
        </div>

        <p
          v-if="!visibleGroups.length"
          class="px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
        >
          No permissions match "{{ filterText }}".
        </p>
      </div>
    </div>
  </template>
</CardBox>`

const BODY = [
  section({
    title: 'General',
    hint: 'The name is the only field required.',
    anchor: false,
    body: flushCard([NAME_ROW, DESCRIPTION_ROW])
  }),
  section({
    title: 'Permissions',
    hintBinding:
      "'What this team can see and change, with ' + selectedCount + ' of ' + totalCount + ' selected.'",
    anchor: false,
    body: PERMISSIONS_CARD
  }),
  section({
    title: 'Advanced',
    icon: 'pi pi-cog',
    anchor: false,
    collapsible: 'advancedOpen',
    regionId: 'team-advanced',
    body: flushCard([
      compactRow(
        'Active',
        "Inactive teams keep their permissions but can't be assigned.",
        '<Switch v-model="form.active" aria-label="Active" :disabled="submitting" />'
      )
    ])
  })
].join('\n')

const DESCRIPTION =
  'A team is a named set of permissions. Assign accounts to it and they inherit exactly what it grants. Nothing is granted per person.'

const CREATE_TEMPLATE = createPage({
  backLabel: 'Back to Teams Permissions',
  title: 'Create Team',
  description: DESCRIPTION,
  titleId: 'team-title',
  body: BODY,
  saveLabel: 'Create'
})

const EDIT_TEMPLATE = createPage({
  backLabel: 'Back to Teams Permissions',
  title: 'Edit Team',
  description: DESCRIPTION,
  titleId: 'team-title',
  body: BODY,
  start:
    '<Button type="button" label="Delete team" kind="danger" size="medium" icon="pi pi-trash" :disabled="submitting" />',
  saveLabel: 'Save changes'
})

const scriptFor = (team, crumb) => [
  ...webkitImports([
    ...CREATE_PAGE_IMPORTS,
    webkitImport('CardBox', 'card-box'),
    webkitImport('Checkbox', 'checkbox'),
    webkitImport('HelperText', 'helper-text'),
    webkitImport('Hint', 'hint'),
    webkitImport('InputText', 'input-text'),
    webkitImport('Item', 'item'),
    webkitImport('Message', 'message'),
    webkitImport('Switch', 'switch'),
    webkitImport('Textarea', 'textarea')
  ]),
  VUE_IMPORT(['computed', 'reactive', 'ref']),
  '',
  declare('breadcrumb', breadcrumbFor(crumb)),
  declare('permissionGroups', PERMISSION_GROUPS),
  '',
  `const resourcePermissions = ${resourcePermissions}`,
  '',
  `const columnPermission = ${columnPermission}`,
  '',
  `const groupPermissionIds = ${groupPermissionIds}`,
  '',
  'const allPermissionIds = permissionGroups.flatMap(groupPermissionIds)',
  '',
  `const form = reactive({ name: '${team.name}', description: '${team.description}', active: ${team.active} })`,
  declare('selected', team.permissions, 'ref'),
  "const errors = reactive({ name: '', permissions: '' })",
  'const submitting = ref(false)',
  'const advancedOpen = ref(false)',
  "const filterText = ref('')",
  '',
  'const groupChecked = (group) => groupPermissionIds(group).every((id) => selected.value.includes(id))',
  'const groupIndeterminate = (group) => {',
  '  const ids = groupPermissionIds(group)',
  '  const count = ids.filter((id) => selected.value.includes(id)).length',
  '  return count > 0 && count < ids.length',
  '}',
  'const toggleGroup = (group, checked) => {',
  '  const ids = new Set(groupPermissionIds(group))',
  '  selected.value = checked',
  '    ? [...new Set([...selected.value, ...ids])]',
  '    : selected.value.filter((id) => !ids.has(id))',
  "  errors.permissions = ''",
  '}',
  'const selectAll = () => {',
  '  selected.value = [...allPermissionIds]',
  "  errors.permissions = ''",
  '}',
  'const clearAll = () => {',
  '  selected.value = []',
  '}',
  '',
  'const matches = (resource, group) => {',
  '  const query = filterText.value.trim().toLowerCase()',
  '  if (!query) return true',
  '  if (group.label.toLowerCase().includes(query)) return true',
  '  return resourcePermissions(resource).some((permission) =>',
  '    permission.label.toLowerCase().includes(query)',
  '  )',
  '}',
  'const visibleGroups = computed(() =>',
  '  permissionGroups',
  '    .map((group) => ({',
  '      ...group,',
  '      resources: group.resources.filter((resource) => matches(resource, group))',
  '    }))',
  '    .filter((group) => group.resources.length > 0)',
  ')',
  'const selectedCount = computed(() => selected.value.length)',
  'const totalCount = allPermissionIds.length',
  '',
  'const submit = () => {',
  '  if (submitting.value) return',
  "  errors.name = form.name.trim() ? '' : 'This field is required.'",
  "  errors.permissions = selected.value.length ? '' : 'Select at least one permission.'",
  '  if (errors.name || errors.permissions) return',
  '  submitting.value = true',
  '  setTimeout(() => {',
  '    submitting.value = false',
  '  }, 700)',
  '}'
]

const useCreateTeam = (team, crumb) => {
  const form = reactive({ name: team.name, description: team.description, active: team.active })
  const selected = ref([...team.permissions])
  const errors = reactive({ name: '', permissions: '' })
  const submitting = ref(false)
  const advancedOpen = ref(false)
  const filterText = ref('')
  const groupChecked = (group) =>
    groupPermissionIds(group).every((id) => selected.value.includes(id))
  const groupIndeterminate = (group) => {
    const ids = groupPermissionIds(group)
    const count = ids.filter((id) => selected.value.includes(id)).length
    return count > 0 && count < ids.length
  }
  const toggleGroup = (group, checked) => {
    const ids = new Set(groupPermissionIds(group))
    selected.value = checked
      ? [...new Set([...selected.value, ...ids])]
      : selected.value.filter((id) => !ids.has(id))
    errors.permissions = ''
  }
  const selectAll = () => {
    selected.value = [...ALL_PERMISSION_IDS]
    errors.permissions = ''
  }
  const clearAll = () => {
    selected.value = []
  }
  const matches = (resource, group) => {
    const query = filterText.value.trim().toLowerCase()
    if (!query) return true
    if (group.label.toLowerCase().includes(query)) return true
    return resourcePermissions(resource).some((permission) =>
      permission.label.toLowerCase().includes(query)
    )
  }
  const visibleGroups = computed(() =>
    PERMISSION_GROUPS.map((group) => ({
      ...group,
      resources: group.resources.filter((resource) => matches(resource, group))
    })).filter((group) => group.resources.length > 0)
  )
  const selectedCount = computed(() => selected.value.length)
  const submit = () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.permissions = selected.value.length ? '' : 'Select at least one permission.'
    if (errors.name || errors.permissions) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
    }, 700)
  }
  return {
    breadcrumb: breadcrumbFor(crumb),
    form,
    selected,
    errors,
    submitting,
    advancedOpen,
    filterText,
    columnPermission,
    groupChecked,
    groupIndeterminate,
    toggleGroup,
    selectAll,
    clearAll,
    visibleGroups,
    selectedCount,
    totalCount: ALL_PERMISSION_IDS.length,
    submit
  }
}

const NEW_TEAM = { name: '', description: '', active: true, permissions: [] }

const components = {
  Avatar,
  Brand,
  Breadcrumb,
  Button,
  CardBox,
  Checkbox,
  ...compound('GlobalHeader', GlobalHeader, ['Left', 'Middle', 'Right', 'Brand']),
  HelperText,
  Hint,
  IconButton,
  InputText,
  ...compound('Item', Item, ['List', 'Content', 'Title', 'Description', 'Actions']),
  Message,
  Switch,
  Textarea
}

const meta = {
  title: 'Templates/Platform/Account/CreateTeam',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Create Team page (`/teams/new`), and the same page in edit mode (`/teams/:id`), opened from Teams and permissions: the creation header with a back button and the Settings › Teams and permissions breadcrumb, a small page heading, a General section with Name and Description, a Permissions section whose card holds a filter field, Select all and Clear, and a View and Edit checkbox matrix grouped by product area, a collapsed Advanced section with the Active switch, and the floating bar with Cancel and Create (Save changes and a leading Delete team when editing). Name and the permission count flag only after the submit Button is pressed. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar`, `Hint`, `CardBox`, `Item`, `InputText`, `HelperText`, `Textarea`, `Checkbox`, `Message`, `Switch` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Create = {
  render: () => ({
    components,
    setup: () => useCreateTeam(NEW_TEAM, 'Create'),
    template: CREATE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A new team: empty Name and Description, no permission checked (0 of 51 selected) and Active on; press Create with nothing filled to see the Name and permission errors.'
      },
      source: { code: toSfc(scriptFor(NEW_TEAM, 'Create'), CREATE_TEMPLATE) }
    }
  }
}

export const Edit = {
  render: () => ({
    components,
    setup: () => useCreateTeam(BILLING_ADMINS, 'Edit'),
    template: EDIT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Billing Admins opened from the Teams and permissions list: its five Billing permissions checked, Active off, and the bar carrying Delete team, Cancel and Save changes.'
      },
      source: { code: toSfc(scriptFor(BILLING_ADMINS, 'Edit'), EDIT_TEMPLATE) }
    }
  }
}
