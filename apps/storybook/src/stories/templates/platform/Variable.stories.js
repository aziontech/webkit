import Button from '@aziontech/webkit/button'
import Checkbox from '@aziontech/webkit/checkbox'
import CopyButton from '@aziontech/webkit/copy-button'
import Dialog from '@aziontech/webkit/dialog'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogDescription from '@aziontech/webkit/dialog-description'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import Dropdown from '@aziontech/webkit/dropdown'
import EmptyState from '@aziontech/webkit/empty-state'
import HelperText from '@aziontech/webkit/helper-text'
import IconButton from '@aziontech/webkit/icon-button'
import InputGroup from '@aziontech/webkit/input-group'
import InputText from '@aziontech/webkit/input-text'
import Message from '@aziontech/webkit/message'
import MultiSelect from '@aziontech/webkit/multi-select'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Switch from '@aziontech/webkit/switch'
import TabView from '@aziontech/webkit/tab-view'
import Table from '@aziontech/webkit/table'
import Tag from '@aziontech/webkit/tag'
import Textarea from '@aziontech/webkit/textarea'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref, useId, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare as declareLiteral } from './_forms-markup'

const declare = (name, value, wrap) =>
  declareLiteral(name, value, wrap).replace(/\[\n\s*\n\s*\]/g, '[]')

const importLine = (name, path) => `import ${name} from '@aziontech/webkit/${path}'`

const SECRET_HINT =
  'Secret values are hidden and write-only after saving. Once saved as a secret, this behavior cannot be changed.'

const SECRET_MASK = '••••••••'

const ready = { label: 'Ready', severity: 'success', icon: 'pi pi-circle-fill' }
const current = { label: 'Current', severity: 'success', icon: 'pi pi-circle-fill' }
const archived = { label: 'Archived', severity: 'secondary', icon: '' }

const GLOBAL_SCOPE = [{ label: 'Global', name: '' }]

const VARIABLES = [
  {
    id: 'v-001',
    key: 'API_BASE_URL',
    value: 'https://api.example.com',
    secret: false,
    lastVersion: { id: '1200481337', ...ready },
    scope: GLOBAL_SCOPE,
    lastEditor: 'Robson Junior',
    lastModified: 'September 02, 2026, 10:14:08 AM'
  },
  {
    id: 'v-002',
    key: 'STRIPE_SECRET_KEY',
    value: SECRET_MASK,
    secret: true,
    lastVersion: { id: '1200481344', ...ready },
    scope: [{ label: 'Environment', name: 'Production' }],
    lastEditor: 'Isaque Böck',
    lastModified: 'August 17, 2026, 04:32:51 PM'
  },
  {
    id: 'v-003',
    key: 'FEATURE_FLAGS',
    value: 'checkout_v2,dark_mode',
    secret: false,
    lastVersion: { id: '1200481351', ...ready },
    scope: [{ label: 'Application', name: 'my-app-vue' }],
    lastEditor: 'Rafael Garbinatto',
    lastModified: 'August 04, 2026, 09:05:17 AM'
  },
  {
    id: 'v-004',
    key: 'DATABASE_PASSWORD',
    value: SECRET_MASK,
    secret: true,
    lastVersion: { id: '1200481358', ...ready },
    scope: [{ label: 'Firewall', name: 'edgeflow-production' }],
    lastEditor: 'Herbert Júlio',
    lastModified: 'July 23, 2026, 11:47:39 AM'
  },
  {
    id: 'v-005',
    key: 'MAX_UPLOAD_MB',
    value: '25',
    secret: false,
    lastVersion: { id: '1200481365', ...ready },
    scope: GLOBAL_SCOPE,
    lastEditor: 'Rafael Umman',
    lastModified: 'June 27, 2026, 02:21:03 PM'
  }
]

const VARIABLE_COLUMNS = [
  { accessorKey: 'key', header: 'Key', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'value', header: 'Value', enableSorting: true, grow: 2 },
  { accessorKey: 'lastVersion', header: 'Last Version', minWidth: 80 },
  { accessorKey: 'scope', header: 'Scope', minWidth: 80 },
  { accessorKey: 'lastEditor', header: 'Last Editor', enableSorting: true, minWidth: 80 },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const VERSIONS = [
  {
    id: '1200481337',
    isCurrent: true,
    status: current,
    lastEditor: 'Robson Junior',
    lastModified: 'September 02, 2026, 10:14:08 AM'
  },
  {
    id: '1200481330',
    isCurrent: false,
    status: archived,
    lastEditor: 'Isaque Böck',
    lastModified: 'August 11, 2026, 04:32:51 PM'
  },
  {
    id: '1200481323',
    isCurrent: false,
    status: archived,
    lastEditor: 'Rafael Garbinatto',
    lastModified: 'July 14, 2026, 09:05:17 AM'
  }
]

const VERSION_COLUMNS = [
  { accessorKey: 'id', header: 'Version', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'status', header: 'Status', minWidth: 104 },
  { accessorKey: 'lastEditor', header: 'Last Editor', enableSorting: true, minWidth: 80 },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const ENVIRONMENTS = [
  { value: 'env-production', label: 'Production' },
  { value: 'env-stage', label: 'Stage' },
  { value: 'env-preview', label: 'Preview' }
]

const scopeOption = (type, label, plural, options, ids = []) => ({
  type,
  label,
  placeholder: `Select ${plural}`,
  plural,
  enabled: ids.length > 0,
  ids,
  query: '',
  options
})

const createScopes = ({ global = true, environments = [] } = {}) => [
  { ...scopeOption('global', 'Global', '', []), placeholder: '', enabled: global },
  scopeOption('environment', 'Environment', 'environments', ENVIRONMENTS, environments),
  scopeOption('deployment', 'Deployment', 'deployments', [
    { value: '1020655', label: 'workload_01' },
    { value: '1020828', label: 'workload_02' },
    { value: '1021001', label: 'workload_03' }
  ]),
  scopeOption('application', 'Application', 'applications', [
    { value: '1784552864', label: 'my-app-vue' },
    { value: '2041778390', label: 'hello-edge' },
    { value: '3344556677', label: 'edgeflow-site' }
  ]),
  scopeOption('firewall', 'Firewall', 'firewalls', [
    { value: '5540117', label: 'edgeflow-production' },
    { value: '5540118', label: 'edgeflow-staging' },
    { value: '5540119', label: 'api-hardening' }
  ])
]

const editScopes = (variable) =>
  createScopes(
    variable.secret ? { global: false, environments: ['env-production'] } : { global: true }
  ).map((scope) => Object.fromEntries(Object.entries(scope).filter(([key]) => key !== 'query')))

const EDIT_VARIABLE = {
  id: 'v-001',
  key: 'API_BASE_URL',
  value: 'https://api.example.com',
  secret: false
}

const EDIT_SECRET_VARIABLE = {
  id: 'v-002',
  key: 'STRIPE_SECRET_KEY',
  value: '',
  secret: true
}

const TABS = [
  { value: 'configuration', label: 'Settings' },
  { value: 'version-history', label: 'Version history' }
]

const components = {
  Button,
  Checkbox,
  CopyButton,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
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
  EmptyState,
  HelperText,
  IconButton,
  InputGroup,
  'InputGroup.Addon': InputGroup.Addon,
  InputText,
  Message,
  MultiSelect,
  'MultiSelect.Trigger': MultiSelect.Trigger,
  'MultiSelect.Content': MultiSelect.Content,
  'MultiSelect.Option': MultiSelect.Option,
  PanelContent,
  PanelFooter,
  PanelHeader,
  SegmentedButton,
  Switch,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  Table,
  'Table.Search': Table.Search,
  'Table.RefreshButton': Table.RefreshButton,
  'Table.Export': Table.Export,
  'Table.ColumnSelector': Table.ColumnSelector,
  Tag,
  Textarea,
  Tooltip
}

const INPUT_CLASS =
  'h-full min-w-0 flex-1 border-0 bg-transparent px-(--spacing-md) text-(--text-default) outline-none placeholder:text-(--text-muted) focus:ring-0 disabled:cursor-not-allowed disabled:text-(--text-disabled)'

const PAGE_PADDING =
  'px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-md) md:px-(--spacing-xxl) md:pt-(--spacing-md) md:pb-(--spacing-xxl)'

const heading = (
  title,
  description,
  actions = ''
) => `<header class="flex w-full flex-col items-center gap-(--spacing-md) md:min-h-16 md:flex-row md:justify-between">
  <div class="flex w-full flex-col md:w-auto">
${indent(title, 2)}
    <p class="text-body-sm text-(--text-muted)">${description}</p>
  </div>${
    actions
      ? `\n  <div class="flex w-full shrink-0 items-center justify-end gap-(--spacing-sm) md:w-auto">\n${indent(actions, 2)}\n  </div>`
      : ''
  }
</header>`

const formSection = (
  title,
  description,
  body
) => `<section class="flex w-full min-w-0 flex-wrap gap-(--spacing-xxl) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xxl) lg:flex-nowrap">
  <div class="flex w-full min-w-0 flex-1 flex-col gap-(--spacing-xs) md:min-w-(--container-3xs)">
    <h2 class="text-heading-sm text-(--text-default)">${title}</h2>
    <p class="text-pretty text-body-sm text-(--text-muted)">${description}</p>
  </div>
  <div class="flex w-full max-w-(--container-2xl) flex-col gap-(--spacing-xxl) max-md:gap-(--spacing-xl)">
${indent(body, 2)}
  </div>
</section>`

const actionBar = (
  saveDisabled = ''
) => `<footer class="flex h-16 w-full shrink-0 items-center border-t border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) md:px-(--spacing-xxl)">
  <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
    <Button label="Cancel" kind="outlined" size="large" />
    <div class="grid max-md:flex-1">
      <Button label="Save" kind="primary" size="large"${saveDisabled} @click="submit" />
    </div>
  </div>
</footer>`

const keyGroup = ({ editable }) => `<InputGroup size="large" :required="keyMissing(item)">
  <InputGroup.Addon>
    <label :for="formId + '-key-' + item.id" class="w-20">Key</label>
  </InputGroup.Addon>
  <input
    :id="formId + '-key-' + item.id"
    v-model="item.key"
    placeholder="MY_VARIABLE"
    autocomplete="off"
    spellcheck="false"
    :aria-required="keyMissing(item) || undefined"
    :aria-describedby="keyMissing(item) ? formId + '-key-' + item.id + '-message' : undefined"
    class="${INPUT_CLASS} text-label-code-sm"${
      editable ? '\n    @paste="pasteKey($event, index)"' : ''
    }
  />${
    editable
      ? '\n  <IconButton v-if="canRemove(item)" icon="pi pi-trash" kind="outlined" size="large" aria-label="Remove variable" @click="removeEntry(index)" />'
      : ''
  }
</InputGroup>`

const valueGroup = ({ lockable }) => `<InputGroup size="large" :required="valueMissing(item)">
  <InputGroup.Addon>
    <label :for="formId + '-value-' + item.id" class="w-20">Value</label>
  </InputGroup.Addon>
  <span class="flex h-full min-w-0 flex-1 items-center gap-(--spacing-xxs) pr-(--spacing-xxs)">
    <input
      :id="formId + '-value-' + item.id"
      v-model="item.value"
      :type="item.secret && !item.visible ? 'password' : 'text'"
      ${lockable ? `:placeholder="locked(item) ? '${SECRET_MASK}' : 'my-variable-value'"` : 'placeholder="my-variable-value"'}
      autocomplete="off"
      :aria-required="valueMissing(item) || undefined"
      :aria-describedby="valueMissing(item) ? formId + '-value-' + item.id + '-message' : undefined"
      class="${INPUT_CLASS} text-label-sm"
    />
    <IconButton
      v-if="item.secret"
      :icon="item.visible ? 'pi pi-eye-slash' : 'pi pi-eye'"
      kind="transparent"
      size="small"
      :aria-label="item.visible ? 'Hide value' : 'Show value'"
      @click="item.visible = !item.visible"
    />
  </span>
  <InputGroup.Addon>
    <Tooltip :text="secretTooltip(item)">
      <span class="flex items-center gap-(--spacing-xs)">
        Secret
        <Checkbox
          v-model="item.secret"
          binary
          :input-id="formId + '-secret-' + item.id"${lockable ? '\n          :disabled="locked(item)"' : ''}
          :aria-label="secretLabel(item)"
        />
      </span>
    </Tooltip>
  </InputGroup.Addon>
</InputGroup>`

const entryRows = ({ editable, lockable }) => `<div class="flex flex-col gap-(--spacing-sm)">
  <div v-for="(item, index) in entries" :key="item.id" class="flex w-full flex-col gap-(--spacing-xs)">
    <div class="flex flex-col gap-(--spacing-xxs)">
${indent(keyGroup({ editable }), 3)}
${indent(valueGroup({ lockable }), 3)}
    </div>
    <HelperText
      v-if="keyMissing(item)"
      :id="formId + '-key-' + item.id + '-message'"
      kind="required"
      label="Key is required."
    />
    <HelperText
      v-if="valueMissing(item)"
      :id="formId + '-value-' + item.id + '-message'"
      kind="required"
      label="Value is required."
    />
  </div>
</div>`

const EDITOR_TOOLBAR = `<div class="flex items-center gap-(--spacing-xs) self-end">
  <Button label="Upload" icon="pi pi-upload" kind="outlined" size="medium" @click="fileInput?.click()" />
  <input ref="fileInput" type="file" class="hidden" tabindex="-1" aria-hidden="true" @change="upload" />
  <SegmentedButton v-model="view" :options="viewOptions" aria-label="Variables view" size="medium" />
</div>`

const ADD_EDITOR = `<div class="flex w-full flex-col gap-(--spacing-sm)">
${indent(EDITOR_TOOLBAR)}
  <div v-if="view === 'Form'" class="flex flex-col gap-(--spacing-sm)">
${indent(entryRows({ editable: true, lockable: false }), 2)}
    <div>
      <Button label="Add variable" icon="pi pi-plus" kind="outlined" size="medium" :disabled="!canAdd" @click="addEntry" />
    </div>
  </div>
  <Textarea v-else v-model="jsonText" aria-label="Variables JSON" class="min-h-(--container-3xs) font-code" />
  <HelperText v-if="view === 'JSON'">
    Use a JSON object format, for example:
    <code class="text-label-code-sm">{"API_URL":"https://example.com"}</code>
  </HelperText>
  <HelperText v-else label="Paste JSON or .env contents into an empty key field to create one row per variable." />
  <HelperText label="${SECRET_HINT}" />
  <HelperText v-if="noVariables" kind="required" label="Add at least one variable." />
</div>`

const EDIT_EDITOR = `<div class="flex w-full flex-col gap-(--spacing-sm) sm:max-w-(--container-lg)">
  <Message
    v-if="renamed"
    severity="warning"
    :label="'Functions that read ' + variable.key + ' stop finding it once you save. Update them to the new key.'"
  />
${indent(entryRows({ editable: false, lockable: true }))}
  <HelperText label="${SECRET_HINT}" />
  <HelperText v-if="noVariables" kind="required" label="Add a key and a value." />
</div>`

const scopeRows = ({
  editable
}) => `<div v-for="scope in scopes" :key="scope.type" class="flex w-full flex-col gap-(--spacing-xxs)">
  <InputGroup size="large"${editable ? ' :required="scopeMissing(scope)"' : ' disabled'}>
    <InputGroup.Addon>
      <span class="w-20">{{ scope.label }}</span>
    </InputGroup.Addon>
    <span
      v-if="scope.type === 'global'"
      class="flex h-full min-w-0 flex-1 items-center bg-(--bg-canvas) px-(--spacing-md) text-label-sm text-(--text-default)"
    >
      The entire account
    </span>
    <MultiSelect
      v-else
      v-model="scope.ids"
      size="large"
      :placeholder="scope.placeholder"
      :display-value="scopeLabel(scope)"${
        editable
          ? '\n      :disabled="!scope.enabled"\n      :required="scopeMissing(scope)"'
          : '\n      disabled'
      }
    >
      <MultiSelect.Trigger :aria-label="scope.placeholder" />
      <MultiSelect.Content>${
        editable
          ? `
        <template #search>
          <InputText v-model="scope.query" size="small" placeholder="Search" aria-label="Search" @keydown.stop>
            <template #iconLeft>
              <i class="pi pi-search" aria-hidden="true" />
            </template>
          </InputText>
        </template>
        <MultiSelect.Option v-for="option in visibleOptions(scope)" :key="option.value" :value="option.value">
          {{ option.label }}
        </MultiSelect.Option>`
          : `
        <MultiSelect.Option v-for="option in scope.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </MultiSelect.Option>`
      }
      </MultiSelect.Content>
    </MultiSelect>
    <InputGroup.Addon>
      <Switch${
        editable
          ? `
        :model-value="scope.enabled"
        :disabled="scope.type === 'global'"
        :aria-label="'Enable ' + scope.label + ' scope'"
        @update:model-value="(value) => setScope(scope, value)"`
          : `
        :model-value="scope.enabled"
        disabled
        :aria-label="'Enable ' + scope.label + ' scope'"`
      }
      />
    </InputGroup.Addon>
  </InputGroup>${
    editable
      ? `
  <HelperText v-if="scopeMissing(scope)" kind="required" label="Select at least one resource for this scope." />`
      : ''
  }
</div>`

const CREATE_SCOPE = `<div class="flex w-full flex-col gap-(--spacing-sm) sm:max-w-(--container-lg)">
${indent(scopeRows({ editable: true }))}
</div>`

const EDIT_SCOPE = `<div class="flex w-full sm:max-w-(--container-lg)">
  <Message severity="info" label="Scope is set when the variable is created and cannot be changed." />
</div>
<div class="flex w-full flex-col gap-(--spacing-sm) sm:max-w-(--container-lg)">
${indent(scopeRows({ editable: false }))}
</div>`

const CREATE_TEMPLATE = `<div class="flex h-screen min-h-0 flex-col bg-(--bg-canvas)">
  <div class="flex min-h-0 flex-1 flex-col overflow-auto">
    <section class="flex w-full flex-1 flex-col ${PAGE_PADDING}">
${indent(
  heading(
    '<h1 class="text-heading-sm text-(--text-default)">Create variable</h1>',
    'Create one or more variables and define where they are available. Each selected scope gets its own variable.'
  ),
  3
)}
      <form class="mt-(--spacing-md) flex w-full grow flex-col gap-(--spacing-xxl) max-md:gap-(--spacing-xl)" aria-label="Create variable" novalidate @submit.prevent>
${indent(
  formSection(
    'Variables',
    'Store values your Functions read at runtime. Add one row per variable, or import a .env file.',
    `<div class="flex w-full sm:max-w-(--container-lg)">\n${indent(ADD_EDITOR)}\n</div>`
  ),
  4
)}
${indent(
  formSection(
    'Scope',
    'Define where these variables are available. Global covers the entire account and turns off when you enable a specific scope. Each scope starts with every resource selected. Open the selector to narrow it down. Scope cannot be changed after the variable is created.',
    CREATE_SCOPE
  ),
  4
)}
      </form>
    </section>
  </div>
${indent(actionBar())}
</div>`

const VERSION_TABLE = `<Table :data="versions" :columns="versionColumns" row-key="id" border enable-sorting paginated :page-size="10">
  <template #toolbar>
    <Table.Search />
    <Table.RefreshButton />
    <Table.ColumnSelector />
  </template>
  <template #cell-id="{ value }">
    <span class="whitespace-nowrap text-label-code-sm text-(--text-default)">{{ value }}</span>
  </template>
  <template #cell-status="{ value }">
    <Tag :label="value.label" :severity="value.severity" :icon="value.icon" size="small" />
  </template>
  <template #cell-actions="{ row }">
    <Dropdown placement="bottom-end" @select="(event, action) => runVersionAction(action, row)">
      <Dropdown.Trigger>
        <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Row actions" />
      </Dropdown.Trigger>
      <Dropdown.Group>
        <Dropdown.Option v-if="!row.isCurrent" value="revert" label="Revert to this version">
          <template #left><i class="pi pi-history" aria-hidden="true" /></template>
        </Dropdown.Option>
        <Dropdown.Option value="copy" label="Copy version ID">
          <template #left><i class="pi pi-copy" aria-hidden="true" /></template>
        </Dropdown.Option>
      </Dropdown.Group>
    </Dropdown>
  </template>
</Table>
<Dialog v-model:open="revertOpen" size="medium">
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader>
        <DialogTitle>Revert variable</DialogTitle>
      </PanelHeader>
      <PanelContent>
        <DialogDescription>{{ revertDescription }}</DialogDescription>
      </PanelContent>
      <PanelFooter>
        <div class="grid w-full gap-(--spacing-sm) md:flex md:justify-end">
          <Button label="Cancel" kind="outlined" size="medium" @click="revertOpen = false" />
          <Button label="Revert" kind="primary" size="medium" @click="revertOpen = false" />
        </div>
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

const EDIT_TITLE = `<div class="flex flex-wrap items-center gap-(--spacing-xs)">
  <h1 class="text-heading-sm text-(--text-default)">{{ variable.key }}</h1>
  <Tag v-if="variable.secret" label="Secret" severity="secondary" icon="pi pi-lock" size="medium" />
</div>`

const EDIT_TEMPLATE = `<div class="flex h-screen min-h-0 flex-col bg-(--bg-canvas)">
  <div class="flex min-h-0 flex-1 flex-col overflow-auto">
    <section class="flex w-full flex-1 flex-col ${PAGE_PADDING}">
${indent(heading(EDIT_TITLE, 'Update the key, value, and secret behavior.'), 3)}
      <div class="mt-(--spacing-md) flex w-full flex-1 flex-col gap-(--spacing-md)">
        <TabView v-model:value="activeTab">
          <TabView.List>
            <TabView.Item v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label" />
          </TabView.List>
        </TabView>
        <form
          v-if="activeTab === 'configuration'"
          class="flex w-full grow flex-col gap-(--spacing-xxl) max-md:gap-(--spacing-xl)"
          aria-label="Edit variable"
          novalidate
          @submit.prevent
        >
${indent(formSection('Variable', 'Store a value your Functions read at runtime.', EDIT_EDITOR), 5)}
${indent(formSection('Scope', 'Define where this variable is available.', EDIT_SCOPE), 5)}
        </form>
        <div v-else class="flex w-full flex-col">
${indent(VERSION_TABLE, 5)}
        </div>
      </div>
    </section>
  </div>
${indent(`<div v-if="activeTab === 'configuration'" class="flex shrink-0">\n${indent(actionBar(' :disabled="unchanged"'))}\n</div>`)}
</div>`

const LIST_TABLE = `<Table
  v-if="rows.length"
  :data="rows"
  :columns="columns"
  row-key="id"
  border
  enable-sorting
  paginated
  :page-size="10"
>
  <template #toolbar>
    <Table.Search />
    <Table.RefreshButton />
    <Table.Export filename="Variables" />
    <Table.ColumnSelector />
  </template>
  <template #cell-value="{ row }">
    <span v-if="row.secret" class="truncate text-body-sm text-(--text-default)">{{ row.value }}</span>
    <div v-else class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
      <span class="min-w-0 flex-1 truncate text-body-sm text-(--text-default)">{{ row.value }}</span>
      <CopyButton kind="outlined" :value="row.value" aria-label="Copy value" />
    </div>
  </template>
  <template #cell-lastVersion="{ value }">
    <div class="flex items-center gap-(--spacing-sm) whitespace-nowrap">
      <a href="#" class="text-label-code-sm text-(--text-default) underline underline-offset-2" @click.prevent.stop>{{ value.id }}</a>
      <Tag :label="value.label" :severity="value.severity" :icon="value.icon" size="small" />
    </div>
  </template>
  <template #cell-scope="{ value }">
    <div class="flex flex-col gap-(--spacing-xxs)">
      <span v-for="item in value" :key="item.label + item.name" class="whitespace-nowrap text-body-sm text-(--text-default)">
        {{ item.label }}
        <a v-if="item.name" href="#" class="text-(--text-default) underline underline-offset-2" @click.prevent.stop>{{ item.name }}</a>
      </span>
    </div>
  </template>
  <template #cell-actions>
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger>
        <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Row actions" />
      </Dropdown.Trigger>
      <Dropdown.Group>
        <Dropdown.Option value="delete" label="Delete">
          <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
        </Dropdown.Option>
      </Dropdown.Group>
    </Dropdown>
  </template>
</Table>
<EmptyState
  v-else
  title="No Variables yet"
  description="Create your first variable to define reusable configuration values for platform resources."
  bordered
>
  <template #actions>
    <Button label="Variable" icon="pi pi-plus" kind="outlined" size="large" />
  </template>
</EmptyState>`

const LIST_TEMPLATE = `<div class="flex h-screen min-h-0 flex-col overflow-auto bg-(--bg-canvas)">
  <section class="flex w-full flex-1 flex-col ${PAGE_PADDING}">
${indent(
  heading(
    '<h1 class="text-heading-sm text-(--text-default)">Variables</h1>',
    "Define and manage variables that store configuration values across Azion's products.",
    `<Button label="Get Help" kind="text" size="large" />\n<Button label="Variable" icon="pi pi-plus" kind="outlined" size="large" />`
  ),
  2
)}
    <div class="mt-(--spacing-md) flex w-full flex-1 flex-col">
${indent(LIST_TABLE, 3)}
    </div>
  </section>
</div>`

const DRAWER_TEMPLATE = `<Drawer v-model:open="open" side="right" size="medium">
  <DrawerTrigger>
    <Button label="Variable" icon="pi pi-plus" kind="outlined" size="medium" />
  </DrawerTrigger>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <form class="flex min-h-0 flex-1 flex-col" aria-label="Create variable" novalidate @submit.prevent>
        <PanelHeader>
          <DrawerTitle>Create variable</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <div class="flex w-full flex-col gap-(--spacing-xxl)">
            <Message severity="info" :label="'Variables created here are scoped to the Application ' + scopeName + '.'" />
${indent(ADD_EDITOR, 6)}
          </div>
        </PanelContent>
        <PanelFooter>
          <div class="ml-auto flex items-center gap-(--spacing-sm)">
            <Button label="Cancel" kind="outlined" size="medium" @click="open = false" />
            <Button label="Save" kind="primary" size="medium" @click="submit" />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const SECRET_HELPERS = String.raw`const secretTooltip = (item) => (item.secret ? 'The value is hidden and write-only.' : 'Mark as secret')
const secretLabel = (item) => (item.secret ? 'Unmark as secret' : 'Mark as secret')`

const ENTRY_LINES = String.raw`const formId = useId()
let nextId = 0
const createEntry = (key = '', value = '', secret = false) => ({
  id: (nextId += 1),
  key,
  value,
  secret,
  visible: false
})
const submitted = ref(false)
const isEmpty = (item) => !item.key.trim() && !item.value.trim()
const keyMissing = (item) => submitted.value && !isEmpty(item) && !item.key.trim()
const noVariables = computed(() => submitted.value && entries.value.every(isEmpty))`

const EDITOR_LINES = String.raw`${ENTRY_LINES}
const entries = ref([createEntry()])
const view = ref('Form')
const viewOptions = [
  { label: 'Form', value: 'Form' },
  { label: 'JSON', value: 'JSON' }
]
const jsonText = ref('{}')
const fileInput = ref(null)
const valueMissing = (item) => submitted.value && !isEmpty(item) && !item.value.trim()
const canRemove = (item) => entries.value.length > 1 || !isEmpty(item)
const canAdd = computed(() => {
  const last = entries.value.at(-1)
  return Boolean(last.key.trim() && last.value.trim())
})
${SECRET_HELPERS}

const addEntry = () => entries.value.push(createEntry())
const removeEntry = (index) => {
  entries.value.splice(index, 1)
  if (!entries.value.length) entries.value.push(createEntry())
}

const parseEnv = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.trim().replace(/^(['"])(.*)\1$/, '$2')])
const parseVariables = (text) => {
  try {
    const parsed = JSON.parse(text)
    const isObject = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    return isObject ? Object.entries(parsed).map(([key, value]) => [key, String(value)]) : []
  } catch {
    return parseEnv(text)
  }
}
const toEntries = (pairs, secrets = new Set()) =>
  pairs.map(([key, value]) => createEntry(key, value, secrets.has(key)))

const pasteKey = (event, index) => {
  const pairs = parseVariables(event.clipboardData?.getData('text/plain') ?? '')
  if (!pairs.length || entries.value[index].key.trim()) return
  event.preventDefault()
  entries.value.splice(index, 1, ...toEntries(pairs))
}
const upload = async (event) => {
  const [file] = event.target.files ?? []
  event.target.value = ''
  if (!file) return
  const pairs = parseVariables(await file.text())
  if (!pairs.length) return
  entries.value = [...entries.value.filter((item) => !isEmpty(item)), ...toEntries(pairs)]
}

watch(view, (next) => {
  const filled = entries.value.filter((item) => !isEmpty(item))
  if (next === 'JSON') {
    jsonText.value = JSON.stringify(Object.fromEntries(filled.map((item) => [item.key, item.value])), null, 2)
    return
  }
  const pairs = parseVariables(jsonText.value)
  const secrets = new Set(filled.filter((item) => item.secret).map((item) => item.key))
  if (pairs.length) entries.value = toEntries(pairs, secrets)
})`

const SCOPE_LABEL_LINES = String.raw`const scopeLabel = (scope) => (ids) => {
  if (!ids.length) return ''
  if (ids.length > 1) return 'Selected ' + ids.length + ' ' + scope.plural
  return scope.options.find((option) => option.value === ids[0])?.label ?? ids[0]
}`

const CREATE_SCOPE_LINES = String.raw`${SCOPE_LABEL_LINES}
const scopeMissing = (scope) => submitted.value && scope.enabled && scope.type !== 'global' && !scope.ids.length
const visibleOptions = (scope) =>
  scope.options.filter((option) => option.label.toLowerCase().includes(scope.query.trim().toLowerCase()))
const setScope = (scope, enabled) => {
  scope.enabled = enabled
  scope.ids = enabled ? scope.options.map((option) => option.value) : []
  scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
}

const submit = () => {
  submitted.value = true
}`

const editorImports = [
  importLine('Button', 'button'),
  importLine('Checkbox', 'checkbox'),
  importLine('HelperText', 'helper-text'),
  importLine('IconButton', 'icon-button'),
  importLine('InputGroup', 'input-group'),
  importLine('SegmentedButton', 'segmented-button'),
  importLine('Textarea', 'textarea'),
  importLine('Tooltip', 'tooltip')
]

const CREATE_SCRIPT = [
  ...editorImports,
  importLine('InputText', 'input-text'),
  importLine('MultiSelect', 'multi-select'),
  importLine('Switch', 'switch'),
  "import { computed, reactive, ref, useId, watch } from 'vue'",
  '',
  declare('scopes', createScopes(), 'reactive'),
  '',
  EDITOR_LINES,
  '',
  CREATE_SCOPE_LINES
]

const DRAWER_SCRIPT = [
  importLine('Drawer', 'drawer'),
  importLine('DrawerClose', 'drawer-close'),
  importLine('DrawerContent', 'drawer-content'),
  importLine('DrawerOverlay', 'drawer-overlay'),
  importLine('DrawerPortal', 'drawer-portal'),
  importLine('DrawerTitle', 'drawer-title'),
  importLine('DrawerTrigger', 'drawer-trigger'),
  ...editorImports,
  importLine('Message', 'message'),
  importLine('PanelContent', 'panel-content'),
  importLine('PanelFooter', 'panel-footer'),
  importLine('PanelHeader', 'panel-header'),
  "import { computed, ref, useId, watch } from 'vue'",
  '',
  'const open = ref(false)',
  "const scopeName = 'my-app-vue'",
  '',
  EDITOR_LINES,
  '',
  String.raw`const submit = () => {
  submitted.value = true
  const filled = entries.value.filter((item) => !isEmpty(item))
  if (filled.length && filled.every((item) => item.key.trim() && item.value.trim())) open.value = false
}

watch(open, (value) => {
  if (!value) return
  submitted.value = false
  view.value = 'Form'
  entries.value = [createEntry()]
})`
]

const editScript = (variable, initialTab) => [
  importLine('Button', 'button'),
  importLine('Checkbox', 'checkbox'),
  importLine('Dialog', 'dialog'),
  importLine('DialogContent', 'dialog-content'),
  importLine('DialogDescription', 'dialog-description'),
  importLine('DialogOverlay', 'dialog-overlay'),
  importLine('DialogPortal', 'dialog-portal'),
  importLine('DialogTitle', 'dialog-title'),
  importLine('Dropdown', 'dropdown'),
  importLine('HelperText', 'helper-text'),
  importLine('IconButton', 'icon-button'),
  importLine('InputGroup', 'input-group'),
  importLine('Message', 'message'),
  importLine('MultiSelect', 'multi-select'),
  importLine('PanelContent', 'panel-content'),
  importLine('PanelFooter', 'panel-footer'),
  importLine('PanelHeader', 'panel-header'),
  importLine('Switch', 'switch'),
  importLine('TabView', 'tab-view'),
  importLine('Table', 'table'),
  importLine('Tag', 'tag'),
  importLine('Tooltip', 'tooltip'),
  "import { computed, ref, useId } from 'vue'",
  '',
  declare('variable', variable),
  declare('scopes', editScopes(variable)),
  declare('tabs', TABS),
  `const activeTab = ref('${initialTab}')`,
  '',
  declare('versions', VERSIONS),
  declare('versionColumns', VERSION_COLUMNS),
  '',
  ENTRY_LINES,
  String.raw`const entries = ref([createEntry(variable.key, variable.value, variable.secret)])
const locked = (item) => variable.secret && item.key.trim() === variable.key
const valueMissing = (item) => submitted.value && !isEmpty(item) && !item.value.trim() && !locked(item)
const secretTooltip = (item) => {
  if (locked(item)) return 'Saved as a secret. Delete the variable to change this.'
  return item.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
}
const secretLabel = (item) => {
  if (locked(item)) return 'Secret locked'
  return item.secret ? 'Unmark as secret' : 'Mark as secret'
}
const renamed = computed(() => {
  const key = entries.value[0].key.trim()
  return Boolean(key) && key !== variable.key
})
const unchanged = computed(() => {
  const [item] = entries.value
  const valueKept = item.value === variable.value || (item.secret && !item.value)
  return item.key.trim() === variable.key && item.secret === variable.secret && valueKept
})
${SCOPE_LABEL_LINES}

const submit = () => {
  submitted.value = true
}

const revertOpen = ref(false)
const selectedVersion = ref(null)
const revertDescription = computed(
  () =>
    'This creates a new current version of ' +
    variable.key +
    ' using the values from ' +
    (selectedVersion.value?.id ?? 'the selected version') +
    '. The current version is preserved in history and the scope stays unchanged.'
)
const runVersionAction = (action, version) => {
  if (action === 'copy') {
    navigator.clipboard?.writeText(version.id)
    return
  }
  selectedVersion.value = version
  revertOpen.value = true
}`
]

const LIST_SCRIPT = (rows) => [
  importLine('Button', 'button'),
  importLine('CopyButton', 'copy-button'),
  importLine('Dropdown', 'dropdown'),
  importLine('EmptyState', 'empty-state'),
  importLine('IconButton', 'icon-button'),
  importLine('Table', 'table'),
  importLine('Tag', 'tag'),
  '',
  declare('columns', VARIABLE_COLUMNS),
  '',
  declare('rows', rows)
]

const useEditorBasics = (entries) => {
  const formId = useId()
  const submitted = ref(false)
  const isEmpty = (item) => !item.key.trim() && !item.value.trim()
  const keyMissing = (item) => submitted.value && !isEmpty(item) && !item.key.trim()
  const noVariables = computed(() => submitted.value && entries.value.every(isEmpty))
  return { formId, submitted, isEmpty, keyMissing, noVariables }
}

const entryFactory = () => {
  let nextId = 0
  return (key = '', value = '', secret = false) => ({
    id: (nextId += 1),
    key,
    value,
    secret,
    visible: false
  })
}

const scopeLabel = (scope) => (ids) => {
  if (!ids.length) return ''
  if (ids.length > 1) return `Selected ${ids.length} ${scope.plural}`
  return scope.options.find((option) => option.value === ids[0])?.label ?? ids[0]
}

const parseEnv = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.trim().replace(/^(['"])(.*)\1$/, '$2')])

const parseVariables = (text) => {
  try {
    const parsed = JSON.parse(text)
    const isObject = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    return isObject ? Object.entries(parsed).map(([key, value]) => [key, String(value)]) : []
  } catch {
    return parseEnv(text)
  }
}

const useAddEditor = () => {
  const createEntry = entryFactory()
  const entries = ref([createEntry()])
  const view = ref('Form')
  const viewOptions = [
    { label: 'Form', value: 'Form' },
    { label: 'JSON', value: 'JSON' }
  ]
  const jsonText = ref('{}')
  const fileInput = ref(null)
  const basics = useEditorBasics(entries)
  const { submitted, isEmpty } = basics
  const valueMissing = (item) => submitted.value && !isEmpty(item) && !item.value.trim()
  const canRemove = (item) => entries.value.length > 1 || !isEmpty(item)
  const canAdd = computed(() => {
    const last = entries.value.at(-1)
    return Boolean(last.key.trim() && last.value.trim())
  })
  const secretTooltip = (item) =>
    item.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
  const secretLabel = (item) => (item.secret ? 'Unmark as secret' : 'Mark as secret')
  const addEntry = () => entries.value.push(createEntry())
  const removeEntry = (index) => {
    entries.value.splice(index, 1)
    if (!entries.value.length) entries.value.push(createEntry())
  }
  const toEntries = (pairs, secrets = new Set()) =>
    pairs.map(([key, value]) => createEntry(key, value, secrets.has(key)))
  const pasteKey = (event, index) => {
    const pairs = parseVariables(event.clipboardData?.getData('text/plain') ?? '')
    if (!pairs.length || entries.value[index].key.trim()) return
    event.preventDefault()
    entries.value.splice(index, 1, ...toEntries(pairs))
  }
  const upload = async (event) => {
    const [file] = event.target.files ?? []
    event.target.value = ''
    if (!file) return
    const pairs = parseVariables(await file.text())
    if (!pairs.length) return
    entries.value = [...entries.value.filter((item) => !isEmpty(item)), ...toEntries(pairs)]
  }
  watch(view, (next) => {
    const filled = entries.value.filter((item) => !isEmpty(item))
    if (next === 'JSON') {
      jsonText.value = JSON.stringify(
        Object.fromEntries(filled.map((item) => [item.key, item.value])),
        null,
        2
      )
      return
    }
    const pairs = parseVariables(jsonText.value)
    const secrets = new Set(filled.filter((item) => item.secret).map((item) => item.key))
    if (pairs.length) entries.value = toEntries(pairs, secrets)
  })
  return {
    ...basics,
    createEntry,
    entries,
    view,
    viewOptions,
    jsonText,
    fileInput,
    valueMissing,
    canRemove,
    canAdd,
    secretTooltip,
    secretLabel,
    addEntry,
    removeEntry,
    pasteKey,
    upload
  }
}

const createSetup = () => {
  const editor = useAddEditor()
  const scopes = reactive(createScopes())
  const scopeMissing = (scope) =>
    editor.submitted.value && scope.enabled && scope.type !== 'global' && !scope.ids.length
  const visibleOptions = (scope) =>
    scope.options.filter((option) =>
      option.label.toLowerCase().includes(scope.query.trim().toLowerCase())
    )
  const setScope = (scope, enabled) => {
    scope.enabled = enabled
    scope.ids = enabled ? scope.options.map((option) => option.value) : []
    scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
  }
  const submit = () => {
    editor.submitted.value = true
  }
  return { ...editor, scopes, scopeLabel, scopeMissing, visibleOptions, setScope, submit }
}

const drawerSetup = () => {
  const editor = useAddEditor()
  const open = ref(false)
  const submit = () => {
    editor.submitted.value = true
    const filled = editor.entries.value.filter((item) => !editor.isEmpty(item))
    if (filled.length && filled.every((item) => item.key.trim() && item.value.trim())) {
      open.value = false
    }
  }
  watch(open, (value) => {
    if (!value) return
    editor.submitted.value = false
    editor.view.value = 'Form'
    editor.entries.value = [editor.createEntry()]
  })
  return { ...editor, open, scopeName: 'my-app-vue', submit }
}

const editSetup = (variable, initialTab) => () => {
  const createEntry = entryFactory()
  const entries = ref([createEntry(variable.key, variable.value, variable.secret)])
  const basics = useEditorBasics(entries)
  const { submitted, isEmpty } = basics
  const locked = (item) => variable.secret && item.key.trim() === variable.key
  const valueMissing = (item) =>
    submitted.value && !isEmpty(item) && !item.value.trim() && !locked(item)
  const secretTooltip = (item) => {
    if (locked(item)) return 'Saved as a secret. Delete the variable to change this.'
    return item.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
  }
  const secretLabel = (item) => {
    if (locked(item)) return 'Secret locked'
    return item.secret ? 'Unmark as secret' : 'Mark as secret'
  }
  const renamed = computed(() => {
    const key = entries.value[0].key.trim()
    return Boolean(key) && key !== variable.key
  })
  const unchanged = computed(() => {
    const [item] = entries.value
    const valueKept = item.value === variable.value || (item.secret && !item.value)
    return item.key.trim() === variable.key && item.secret === variable.secret && valueKept
  })
  const submit = () => {
    submitted.value = true
  }
  const revertOpen = ref(false)
  const selectedVersion = ref(null)
  const revertDescription = computed(
    () =>
      `This creates a new current version of ${variable.key} using the values from ${
        selectedVersion.value?.id ?? 'the selected version'
      }. The current version is preserved in history and the scope stays unchanged.`
  )
  const runVersionAction = (action, version) => {
    if (action === 'copy') {
      navigator.clipboard?.writeText(version.id)
      return
    }
    selectedVersion.value = version
    revertOpen.value = true
  }
  return {
    ...basics,
    variable,
    scopes: editScopes(variable),
    tabs: TABS,
    activeTab: ref(initialTab),
    versions: VERSIONS,
    versionColumns: VERSION_COLUMNS,
    entries,
    locked,
    valueMissing,
    secretTooltip,
    secretLabel,
    renamed,
    unchanged,
    scopeLabel,
    submit,
    revertOpen,
    revertDescription,
    runVersionAction
  }
}

const meta = {
  title: 'Templates/Platform/Forms/Variable',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The v6 Variables screens of the console: the list, the create page, the edit page with its Settings and Version history tabs, and the scoped create drawer an Application or Firewall opens from its own Variables tab. Each variable is entered as a pair of `InputGroup` rows, a Key row with a Remove button and a Value row with a Secret checkbox, and every scope is an `InputGroup` joining its label, a `MultiSelect` of resources and an enable `Switch`. Built from `InputGroup`, `Checkbox`, `IconButton`, `SegmentedButton`, `MultiSelect`, `Switch`, `HelperText`, `Message`, `Tooltip`, `TabView`, `Table`, `Tag`, `CopyButton`, `Dropdown`, `EmptyState`, `Dialog`, `Drawer` and `Button`; the JSON view uses a webkit `Textarea` in place of the console code editor.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const List = {
  render: () => ({
    components,
    setup: () => ({ rows: VARIABLES, columns: VARIABLE_COLUMNS }),
    template: LIST_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Variables index: five variables in a bordered Table with search, reload, export and columns in its toolbar, secret values masked and plain values copyable.'
      },
      source: { code: toSfc(LIST_SCRIPT(VARIABLES), LIST_TEMPLATE) }
    }
  }
}

export const ListEmpty = {
  render: () => ({
    components,
    setup: () => ({ rows: [], columns: VARIABLE_COLUMNS }),
    template: LIST_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story: 'No variables yet: the table gives way to the EmptyState with its create action.'
      },
      source: { code: toSfc(LIST_SCRIPT([]), LIST_TEMPLATE) }
    }
  }
}

export const Create = {
  render: () => ({
    components,
    setup: createSetup,
    template: CREATE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The create page: Key and Value input groups with add and remove, the Form and JSON views, Upload, the Secret checkbox, and the five scope rows; Save flags only the fields still empty.'
      },
      source: { code: toSfc(CREATE_SCRIPT, CREATE_TEMPLATE) }
    }
  }
}

export const Edit = {
  render: () => ({
    components,
    setup: editSetup(EDIT_VARIABLE, 'configuration'),
    template: EDIT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Editing a plain variable on the Settings tab: one Key and Value pair, the rename warning once the key changes, the read-only scope, and Save enabled only after a change.'
      },
      source: { code: toSfc(editScript(EDIT_VARIABLE, 'configuration'), EDIT_TEMPLATE) }
    }
  }
}

export const EditSecret = {
  render: () => ({
    components,
    setup: editSetup(EDIT_SECRET_VARIABLE, 'configuration'),
    template: EDIT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Editing a stored secret: the Secret tag beside the key, a masked placeholder in place of the value, and the Secret checkbox locked.'
      },
      source: { code: toSfc(editScript(EDIT_SECRET_VARIABLE, 'configuration'), EDIT_TEMPLATE) }
    }
  }
}

export const VersionHistory = {
  render: () => ({
    components,
    setup: editSetup(EDIT_VARIABLE, 'version-history'),
    template: EDIT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Version history tab: each version with its state, and a row menu whose Revert to this version opens the closed-by-default revert dialog.'
      },
      source: { code: toSfc(editScript(EDIT_VARIABLE, 'version-history'), EDIT_TEMPLATE) }
    }
  }
}

export const ScopedDrawer = {
  render: () => ({
    components,
    setup: drawerSetup,
    template: DRAWER_TEMPLATE
  }),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Closed until the Variable button opens it: the scoped create drawer an Application renders from its Variables tab, with the scope notice above the same variables editor.'
      },
      source: { code: toSfc(DRAWER_SCRIPT, DRAWER_TEMPLATE) }
    }
  }
}
