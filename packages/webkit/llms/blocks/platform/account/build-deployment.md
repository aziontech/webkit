# Build and deployment (`platform/account/build-deployment`)

> The account's Build and deployment settings. A `PageHeader` with Documentation and the primary Create Deployment Setting, a closable info `Alert` that explains what a Deployment Setting is, then three `SettingsSection`s. New service defaults: a flush `Card` of `SettingRow`s in an `Item.List` with a binding policy `Select`, a deployment policy `Select` and an Apply to existing `Switch`, saved through a `SaveBar` that appears only with unsaved changes (Discard, Save). All services: a collapsible `Accordion` whose trigger counts the services and tags how many share a setting; inside, a search `Input` (a small `EmptyState` with Clear search when nothing matches) and, ten services per page with `Pagination`, one row per environment with environment and policy `Tag`s, a `Select` that rebinds it to a matching Deployment Setting (inactive ones disabled), and Linked automatically and Shared `Tag`s; a rebind ends in a toast that warns when the setting now reaches several services. Deployment Settings: the table-view controls row (`PropertyFilter`, Refresh and Download CSV as `IconButton`s with a `Tooltip`, `CollectionPreferences`) over a `Table` on one `useCollection` (Name with a System `Tag` for Default, Services with a Shared `Tag` and the service names on a `Tooltip`, Type hidden by default, Binding policy, Deployment policy, `Table.CellStatus`, `Table.CellTime` for Last modified, `Table.CellActions` with Edit, Clone and Delete behind a `ConfirmDialog`). Create and Edit open a large `Drawer` form (Name, Description, Active `Switch`, binding and deployment policy `RadioGroup`s). Loading draws `Skeleton`s; no services draws an `EmptyState`. Its toasts go through `toast` into the app's one toast region. A page body for ConsoleLayout, rendered in its default slot.

- Surface: product
- Source: `blocks/platform/account/build-deployment/build-deployment.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/build-deployment")`
- Components: [Accordion](../../../components/accordion.md), [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [CollectionPreferences](../../../components/collection-preferences.md), [ConfirmDialog](../../../components/confirm-dialog.md), [DataTable](../../../components/data-table.md), `DrawerContent`, [Drawer](../../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [PageHeader](../../../components/page-header.md), [Pagination](../../../components/pagination.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../../components/property-filter.md), [RadioGroup](../../../components/radio-group.md), [SaveBar](../../../components/save-bar.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Skeleton](../../../components/skeleton.md), [Switch](../../../components/switch.md), [Table](../../../components/table.md), [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md), `use-collection`
- Skills: `webkit-form`, `webkit-tables`, `webkit-lists`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

build and deployment; deployment settings; deployment defaults; binding policy; deployment policy; environment bindings; rebind environment; shared deployment setting; build e deploy; configurações de deploy; padrões de deploy; política de deploy; vincular ambiente

How every deploy in the account routes. A Deployment Setting holds a binding policy (whether a version locks the resource IDs it shipped with) and a deployment policy (one live version, or a URL per version); every environment of every service publishes with exactly one, linked automatically to a setting that matches its own deployment policy. On this page an admin sets the defaults the next service starts with, sees which environment publishes with which setting, points two environments at the same setting so one deploy reaches both, and manages the settings themselves. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Account-wide defaults for how new resources deploy, saved together.
- An overview of which environment uses which shared configuration, with a way to rebind each one in place.
- Managing a list of reusable deployment or routing configurations.

## When not to use

- The deployment settings of one service: use `platform/edit/edit-resource#DeployableSettings`.
- Only the create form: use `platform/create/create-in-drawer#DeploymentSettings`.
- Running a deploy: use `platform/create/deploy-drawer`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Build and deployment` and one sentence that says every environment is linked automatically. Actions: Documentation and the primary `Create Deployment Setting` at `size="large"`, which opens the drawer (G).

### B. What a Deployment Setting is — `Alert` (required)

A small info `Alert`, closable, that explains the binding policy, the deployment policy, the automatic link and what sharing a setting does. It closes for the session.

### C. New service defaults — `SettingsSection`, `Card`, `Item`, `SettingRow`, `Select`, `Switch`, `SaveBar` (required)

A `SettingsSection` with an anchor around a flush `Card` and an `Item.List` of `SettingRow`s: Binding policy and Deployment policy as large `Select`s whose value reads the policy label, then `Apply to existing Deployment Settings` as a compact `Switch`. Changing any of them raises a `SaveBar` (entering and leaving with a short translate and fade, none under reduced motion) that says `You have unsaved changes.` with Discard and Save. Save spins, keeps the values, turns Apply off again and toasts what changed: with Apply on, how many settings now use the binding policy (Default is never changed).

### D. All services — `Accordion`, `Input`, `Tag`, `Select`, `Pagination` (required)

A `SettingsSection` around a flush `Card` with one collapsible `Accordion` item, closed at first, its trigger a level 3 heading: `All services`, the count and a warning `Tag` with how many services use a shared setting. Inside: a search `Input` over service and setting names (`v-bind="filterProps"` from a `useCollection` over the services), then a list named Services, ten services per page with a `Pagination` under it when more match, so an account with hundreds of services never mounts hundreds of `Select`s, with one entry per service (its name links to the service) and one row per environment: the environment and its deployment policy as small `Tag`s, a `Select` named `Deployment Setting for <service> <environment>` that offers only the settings with the same deployment policy (inactive ones disabled), `Linked automatically` while the link was never changed, and `Shared · N services` when the setting reaches more than one. A rebind applies at once and toasts; when the new setting is shared, the toast is a warning that says how many services a deploy now reaches. A search with no match shows a small `EmptyState` (`No matching services`) with Clear search, inside a polite status region.

### E. Deployment Settings controls — `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

The table-view controls row (`platform/view/table-view`): a `PropertyFilter` over name, reach (Shared, Dedicated, Unused), binding policy and status, Refresh and Download CSV as outlined `IconButton`s with a `Tooltip` each (Download CSV writes every match through the table's `exportCsv`, disabled with no match), and `CollectionPreferences` for page size and visible columns.

### F. Deployment Settings table — `DataTable`, `Table`, `Card`, `Tag`, `DropdownMenu`, `ConfirmDialog`, `EmptyState`, `useCollection` (required)

`DataTable` with `v-bind="tableProps"` in a flush `Card`, newest change first. Name, with a `System` `Tag` on Default; Services, the count with a `Shared` `Tag` when more than one service uses it and the service names on a `Tooltip`; Type (System or Custom, hidden by default); Binding policy; Deployment policy; Status as `Table.CellStatus`; Last modified as `Table.CellTime` with the author. `Table.CellActions` named after the setting, absent on Default: Edit, Clone (a copy named `<name>-copy` with no environment), then Delete in its own group, which asks in a `ConfirmDialog` that says how many services fall back to Default. `No matching Deployment Settings` with Clear filters sits in the table's `#empty` slot.

### G. Create and edit drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field`, `Textarea`, `RadioGroup` (required)

This page owns the Deployment Setting form, in a large right `Drawer` (`platform/create/create-in-drawer#DeploymentSettings` should match it field for field): General (Name, required and unique; Description; Active `Switch`) and Routing and policy (binding policy and deployment policy as `RadioGroup`s with a description each, starting from the saved defaults). Edit opens the same form filled, titled `Edit Deployment Setting`, with the deployment policy locked because it cannot change after creation. Cancel and the primary `Create Deployment Setting` or `Save changes`, which spins; the drawer cannot be dismissed while it saves. A missing or taken name shows on the field after submit and focus moves to it.

### H. Loading and no services — `Skeleton` (conditional)

On the first load, `Skeleton`s take the place of the two default `Select`s and of the services card, and the table shows its loading rows. An account with no service shows a small `EmptyState` in All services that says each new environment is linked automatically.

### Outcomes — through `toast`

Saving defaults, rebinding, creating, editing, cloning and deleting end in a toast; a rebind onto a shared setting is a warning. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Offer only settings whose deployment policy matches the environment's; an environment cannot publish with any other.
- Say when a setting is shared, in the table and on every environment row, and warn when a rebind makes a deploy reach more services.
- Keep the defaults behind one SaveBar, and say that Default is never changed when Apply to existing is on.
- Say how many services fall back to Default before a setting is deleted.

## Don't

- Don't offer Edit, Clone or Delete on Default; every environment falls back to it.
- Don't apply the defaults to existing settings without the explicit switch.
- Don't let the deployment policy change on an existing setting; the environments bound to it depend on it.

## Copy

- **Title:** `Build and deployment`. **Action:** `Create Deployment Setting`; the drawer titles `Create Deployment Setting` and `Edit Deployment Setting`, the submits `Create Deployment Setting` and `Save changes`. The label does not change on the way in.
- **No match:** `No matching services`, `No service or setting matches “…”.`, `Clear search`.
- **Sections:** `New service defaults`, `All services`, `Deployment Settings`.
- **Policies:** `Strict`, `Flexible`; `Single`, `Versioned`.
- **Tags:** `System`, `Shared`, `Linked automatically`, `Shared · 2 services`, `1 on a shared setting`.
- **Toasts:** `Deployment defaults saved.`, `checkout-api · Production now publishes with storefront-production.`, `preview-versioned created.`, `legacy-rollout deleted.`
- **Errors:** `This field is required.`, `A Deployment Setting with this name already exists.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- Each section title is an h2 with an anchor; the services accordion trigger is an h3 under it.
- Every environment `Select` is named `Deployment Setting for <service> <environment>`; the default `Select`s and the Switch take their row's title as their name.
- The services search is named, and a search with no match is announced as a status.
- The filter is named Filter Deployment Settings; Refresh and Download CSV are icon buttons with an accessible name and a tooltip; the row menu is named `Actions for <setting>`.
- The Services cell is focusable so its tooltip with the service names is reachable by keyboard.
- The SaveBar motion has a `motion-reduce` fallback.

## States

- Default: four services and five settings (Default, one shared by two services, one versioned, one dedicated, one inactive) with defaults, rebinding, the property filter, Refresh, Download CSV, preferences, create, edit, clone and delete wired.
- UnsavedChanges: the binding policy default changed; the SaveBar with Discard and Save.
- Empty: no service yet; All services shows an EmptyState and the table holds only Default.
- Loading: the first load; Skeletons and the table's loading rows.

## Related

- `platform/create/create-in-drawer#DeploymentSettings` — the create form this page opens.
- `platform/edit/edit-resource#DeployableSettings` — the deployment settings of one service.
- `platform/view/table-view` — the list pattern of the Deployment Settings table.
- `platform/edit/edit-resource#UnsavedChanges` — the SaveBar pattern of the defaults.

## Variants

- `Default` — primary (the code below)
- `UnsavedChanges` — The binding policy default changed from Strict to Flexible: the SaveBar says You have unsaved changes. with Discard and Save; Save confirms with a toast and Discard puts the saved value back.
- `Empty` — An account with no service yet: All services shows a small EmptyState and the Deployment Settings table holds only Default.
- `Loading` — The first load: Skeletons in place of the default Selects and the services, and the table's loading rows.

Each variant is the same screen in another state: `get_pattern("platform/account/build-deployment", { variant })`, or the file under `blocks/platform/account/build-deployment/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Pagination from '@aziontech/webkit/pagination-root'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Table, { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, reactive, ref } from 'vue'

  type BindingPolicy = 'STRICT' | 'FLEXIBLE'
  type DeploymentPolicy = 'single_version' | 'versioned_urls'
  type SettingStatus = 'Active' | 'Inactive'
  type Reach = 'Shared' | 'Dedicated' | 'Unused'

  interface DeploymentSetting {
    id: string
    name: string
    description: string
    system: boolean
    bindingPolicy: BindingPolicy
    deploymentPolicy: DeploymentPolicy
    status: SettingStatus
    updatedAt: Date
    updatedBy: string
  }

  interface Environment {
    name: string
    deploymentPolicy: DeploymentPolicy
    settingId: string
    auto: boolean
  }

  interface Service {
    id: string
    name: string
    environments: Environment[]
  }

  type SettingRowData = DeploymentSetting & {
    type: string
    reach: Reach
    services: string[]
  }

  const BINDING_POLICIES: { value: BindingPolicy; label: string; description: string }[] = [
    {
      value: 'STRICT',
      label: 'Strict',
      description: 'Lock resource IDs to each version. Promoted versions stay Strict.'
    },
    {
      value: 'FLEXIBLE',
      label: 'Flexible',
      description: 'Allow resource IDs to change across versions.'
    }
  ]
  const DEPLOYMENT_POLICIES: { value: DeploymentPolicy; label: string; description: string }[] = [
    {
      value: 'single_version',
      label: 'Single',
      description: 'One version serves the environment. Deploying replaces what is live.'
    },
    {
      value: 'versioned_urls',
      label: 'Versioned',
      description: 'Each version keeps its own URL, so several are reachable at once.'
    }
  ]
  const bindingLabel = (value: unknown): string =>
    BINDING_POLICIES.find((policy) => policy.value === value)?.label ?? String(value ?? '')
  const deploymentLabel = (value: unknown): string =>
    DEPLOYMENT_POLICIES.find((policy) => policy.value === value)?.label ?? String(value ?? '')

  const DAY = 86_400_000
  const REFERENCE = Date.UTC(2026, 10, 10, 12)
  const ago = (days: number) => new Date(REFERENCE - days * DAY)
  const DEFAULT_ID = 'ds-default'

  const seedSettings: DeploymentSetting[] = [
    {
      id: DEFAULT_ID,
      name: 'Default',
      description: 'Used by every environment that has no setting of its own.',
      system: true,
      bindingPolicy: 'STRICT',
      deploymentPolicy: 'single_version',
      status: 'Active',
      updatedAt: ago(180),
      updatedBy: 'system'
    },
    {
      id: 'ds-storefront',
      name: 'storefront-production',
      description: 'Storefront and checkout publish together.',
      system: false,
      bindingPolicy: 'STRICT',
      deploymentPolicy: 'single_version',
      status: 'Active',
      updatedAt: ago(2),
      updatedBy: 'jane.doe@example.com'
    },
    {
      id: 'ds-preview',
      name: 'preview-versioned',
      description: 'Every staging version keeps its own URL.',
      system: false,
      bindingPolicy: 'FLEXIBLE',
      deploymentPolicy: 'versioned_urls',
      status: 'Active',
      updatedAt: ago(9),
      updatedBy: 'alex.morgan@example.com'
    },
    {
      id: 'ds-docs',
      name: 'docs-site',
      description: '',
      system: false,
      bindingPolicy: 'FLEXIBLE',
      deploymentPolicy: 'single_version',
      status: 'Active',
      updatedAt: ago(21),
      updatedBy: 'sam.lee@example.com'
    },
    {
      id: 'ds-legacy',
      name: 'legacy-rollout',
      description: 'Kept for the old release pipeline.',
      system: false,
      bindingPolicy: 'FLEXIBLE',
      deploymentPolicy: 'single_version',
      status: 'Inactive',
      updatedAt: ago(64),
      updatedBy: 'jane.doe@example.com'
    }
  ]

  const seedServices: Service[] = [
    {
      id: 'svc-storefront',
      name: 'storefront',
      environments: [
        {
          name: 'Production',
          deploymentPolicy: 'single_version',
          settingId: 'ds-storefront',
          auto: false
        },
        {
          name: 'Staging',
          deploymentPolicy: 'versioned_urls',
          settingId: 'ds-preview',
          auto: true
        }
      ]
    },
    {
      id: 'svc-checkout',
      name: 'checkout-api',
      environments: [
        {
          name: 'Production',
          deploymentPolicy: 'single_version',
          settingId: 'ds-storefront',
          auto: false
        }
      ]
    },
    {
      id: 'svc-docs',
      name: 'docs-site',
      environments: [
        {
          name: 'Production',
          deploymentPolicy: 'single_version',
          settingId: 'ds-docs',
          auto: true
        },
        {
          name: 'Staging',
          deploymentPolicy: 'single_version',
          settingId: DEFAULT_ID,
          auto: true
        }
      ]
    },
    {
      id: 'svc-status',
      name: 'status-page',
      environments: [
        {
          name: 'Production',
          deploymentPolicy: 'single_version',
          settingId: DEFAULT_ID,
          auto: true
        }
      ]
    }
  ]

  const savedDefaults = {
    bindingPolicy: 'STRICT' as BindingPolicy,
    deploymentPolicy: 'single_version' as DeploymentPolicy,
    applyToExisting: false
  }

  const SERVICES_PAGE_SIZE = 10
  const settings = ref<DeploymentSetting[]>(seedSettings)
  const services = ref<Service[]>(seedServices)
  const loading = ref(false)
  const infoOpen = ref(true)

  const saved = reactive({ ...savedDefaults })
  const form = reactive({ ...savedDefaults })
  const saving = ref(false)
  const dirty = computed(
    () =>
      form.bindingPolicy !== saved.bindingPolicy ||
      form.deploymentPolicy !== saved.deploymentPolicy ||
      form.applyToExisting !== saved.applyToExisting
  )
  const discard = () => Object.assign(form, saved)
  const save = () => {
    if (saving.value) return
    saving.value = true
    setTimeout(() => {
      const apply = form.applyToExisting
      if (apply) {
        settings.value = settings.value.map((setting) =>
          setting.system
            ? setting
            : {
                ...setting,
                bindingPolicy: form.bindingPolicy,
                updatedAt: new Date(REFERENCE),
                updatedBy: 'jane.doe@example.com'
              }
        )
      }
      Object.assign(saved, { ...form, applyToExisting: false })
      form.applyToExisting = false
      saving.value = false
      toast.success('Deployment defaults saved.', {
        description: apply
          ? `${settings.value.filter((setting) => !setting.system).length} settings now use the ${bindingLabel(form.bindingPolicy)} binding policy. Default is never changed.`
          : 'The next service is created with them. Existing settings keep theirs.'
      })
    }, 800)
  }

  const settingById = (id: string) => settings.value.find((setting) => setting.id === id)
  const settingName = (id: unknown): string => settingById(String(id))?.name ?? ''
  const boundTo = (id: string) =>
    services.value.filter((service) =>
      service.environments.some((environment) => environment.settingId === id)
    )
  const reachLabel = (count: number) =>
    count === 0 ? 'No services' : count === 1 ? '1 service' : `${count} services`

  const serviceRows = computed(() =>
    services.value.map((service) => ({
      ...service,
      settings: service.environments
        .map((environment) => settingName(environment.settingId))
        .join(' ')
    }))
  )
  const {
    items: pagedServices,
    totalCount: matchingServiceCount,
    filterProps: serviceFilterProps,
    paginationProps: servicePaginationProps,
    clearFilters: clearServiceSearch
  } = useCollection({
    items: serviceRows,
    columns: [{ accessorKey: 'name' }, { accessorKey: 'settings' }],
    filtering: { fields: ['name', 'settings'] },
    pagination: { pageSize: SERVICES_PAGE_SIZE, pageSizeOptions: [SERVICES_PAGE_SIZE] }
  })
  const sharedCount = computed(
    () =>
      services.value.filter((service) =>
        service.environments.some((environment) => boundTo(environment.settingId).length > 1)
      ).length
  )
  const optionsFor = (environment: Environment) =>
    settings.value.filter(
      (setting) =>
        setting.deploymentPolicy === environment.deploymentPolicy ||
        setting.id === environment.settingId
    )

  const rebind = (service: Service, environment: Environment, value: unknown) => {
    const id = String(value)
    if (!id || id === environment.settingId) return
    services.value = services.value.map((item) =>
      item.id !== service.id
        ? item
        : {
            ...item,
            environments: item.environments.map((env) =>
              env.name === environment.name ? { ...env, settingId: id, auto: false } : env
            )
          }
    )
    const reach = boundTo(id).length
    const title = `${service.name} · ${environment.name} now publishes with ${settingName(id)}.`
    if (reach > 1) {
      toast.warning(title, {
        description: `A deploy into ${settingName(id)} reaches ${reachLabel(reach)}.`
      })
      return
    }
    toast.success(title, { description: 'It reaches this service only.' })
  }

  const rows = computed<SettingRowData[]>(() =>
    settings.value.map((setting) => {
      const bound = boundTo(setting.id).map((service) => service.name)
      return {
        ...setting,
        type: setting.system ? 'System' : 'Custom',
        reach: bound.length > 1 ? 'Shared' : bound.length === 1 ? 'Dedicated' : 'Unused',
        services: bound
      }
    })
  )

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'services', header: 'Services', minWidth: 170 },
    { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: 110 },
    { accessorKey: 'bindingPolicy', header: 'Binding policy', enableSorting: true, minWidth: 140 },
    {
      accessorKey: 'deploymentPolicy',
      header: 'Deployment policy',
      enableSorting: true,
      minWidth: 160
    },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 110 },
    { accessorKey: 'updatedAt', header: 'Last modified', enableSorting: true, minWidth: 170 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'reach',
      label: 'Reach',
      options: [{ value: 'Shared' }, { value: 'Dedicated' }, { value: 'Unused' }]
    },
    {
      key: 'bindingPolicy',
      label: 'Binding policy',
      options: BINDING_POLICIES.map((policy) => ({ value: policy.value, label: policy.label }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, matchingItems, clearFilters } =
    useCollection({
      items: rows,
      columns,
      filtering: { fields: ['name', 'description', 'reach', 'status'] },
      propertyFiltering: { properties },
      sorting: { defaultState: [{ id: 'updatedAt', desc: true }] },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: {
        storageKey: 'deployment-settings',
        defaults: { columns: [{ id: 'type', visible: false }] }
      }
    })

  const settingsTable = ref<TableExposed<SettingRowData> | null>(null)
  const exportCsv = () => settingsTable.value?.exportCsv({ filename: 'deployment-settings.csv' })

  const refreshing = ref(false)
  const refresh = () => {
    if (refreshing.value) return
    refreshing.value = true
    setTimeout(() => {
      refreshing.value = false
    }, 700)
  }

  const blankDraft = () => ({
    name: '',
    description: '',
    active: true,
    bindingPolicy: saved.bindingPolicy,
    deploymentPolicy: saved.deploymentPolicy
  })
  const drawerOpen = ref(false)
  const editingId = ref('')
  const draft = reactive(blankDraft())
  const nameError = ref('')
  const submitting = ref(false)
  const formEl = ref<HTMLFormElement | null>(null)
  const drawerTitle = computed(() =>
    editingId.value ? 'Edit Deployment Setting' : 'Create Deployment Setting'
  )

  const openCreate = () => {
    editingId.value = ''
    Object.assign(draft, blankDraft())
    nameError.value = ''
    drawerOpen.value = true
  }
  const openEdit = (setting: DeploymentSetting) => {
    editingId.value = setting.id
    Object.assign(draft, {
      name: setting.name,
      description: setting.description,
      active: setting.status === 'Active',
      bindingPolicy: setting.bindingPolicy,
      deploymentPolicy: setting.deploymentPolicy
    })
    nameError.value = ''
    drawerOpen.value = true
  }

  const submit = () => {
    if (submitting.value) return
    const name = draft.name.trim()
    nameError.value = !name
      ? 'This field is required.'
      : settings.value.some((setting) => setting.name === name && setting.id !== editingId.value)
        ? 'A Deployment Setting with this name already exists.'
        : ''
    if (nameError.value) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>('#deployment-settings-name')?.focus())
      return
    }
    submitting.value = true
    setTimeout(() => {
      const values = {
        name,
        description: draft.description.trim(),
        bindingPolicy: draft.bindingPolicy,
        deploymentPolicy: draft.deploymentPolicy,
        status: (draft.active ? 'Active' : 'Inactive') as SettingStatus,
        updatedAt: new Date(REFERENCE),
        updatedBy: 'jane.doe@example.com'
      }
      if (editingId.value) {
        settings.value = settings.value.map((setting) =>
          setting.id === editingId.value ? { ...setting, ...values } : setting
        )
        toast.success(`${name} saved.`, {
          description: 'Environments that publish with it use the change on their next deploy.'
        })
      } else {
        settings.value = [
          ...settings.value,
          { id: `ds-${settings.value.length + 1}-${name}`, system: false, ...values }
        ]
        toast.success(`${name} created.`, {
          description: 'Point an environment at it under All services to start publishing with it.'
        })
      }
      submitting.value = false
      drawerOpen.value = false
    }, 600)
  }

  const pending = ref<SettingRowData | null>(null)
  const deleteOpen = ref(false)
  const deleteDescription = computed(() => {
    const count = pending.value?.services.length ?? 0
    const name = pending.value?.name ?? ''
    return count === 0
      ? `${name} is deleted. No environment publishes with it.`
      : `${name} is deleted, and ${reachLabel(count)} fall back to Default on their next deploy.`
  })
  const remove = () => {
    const row = pending.value
    if (!row) return
    services.value = services.value.map((service) => ({
      ...service,
      environments: service.environments.map((environment) =>
        environment.settingId === row.id
          ? { ...environment, settingId: DEFAULT_ID, auto: true }
          : environment
      )
    }))
    settings.value = settings.value.filter((setting) => setting.id !== row.id)
    deleteOpen.value = false
    toast.success(`${row.name} deleted.`)
  }

  const onAction = (value: DropdownMenuOptionValue, row: SettingRowData) => {
    if (value === 'edit') {
      openEdit(row)
      return
    }
    if (value === 'clone') {
      const copy: DeploymentSetting = {
        id: `ds-${settings.value.length + 1}-${row.id}-copy`,
        name: `${row.name}-copy`,
        description: row.description,
        system: false,
        bindingPolicy: row.bindingPolicy,
        deploymentPolicy: row.deploymentPolicy,
        status: row.status,
        updatedAt: new Date(REFERENCE),
        updatedBy: 'jane.doe@example.com'
      }
      settings.value = [...settings.value, copy]
      toast.success(`${copy.name} created from ${row.name}.`, {
        description: 'The copy has the same policies and no environment yet.'
      })
      return
    }
    if (value === 'delete') {
      pending.value = row
      deleteOpen.value = true
    }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Build and deployment"
        description="Every environment is linked to a Deployment Setting automatically, matching its deployment policy. Point two environments at the same setting when they should publish together."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/deployment-settings"
            target="_blank"
          />
          <Button
            label="Create Deployment Setting"
            icon="ai ai-plus"
            kind="primary"
            size="large"
            @click="openCreate"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col">
        <Alert
          v-if="infoOpen"
          severity="info"
          size="small"
          closable
          label="A Deployment Setting says how a deploy routes: its binding policy, its deployment policy and its rollout defaults. Every environment is linked to one automatically, matching its own deployment policy, and only a matching setting can be chosen. Point two environments at the same setting and a deploy into it publishes to both."
          @close="infoOpen = false"
        />

        <div class="flex min-w-0 flex-col">
          <SettingsSection
            title="New service defaults"
            anchor="new-service-defaults"
            hint="What the Deployment Setting created with the next service starts with."
          >
            <Card :padded="false">
              <template #content>
                <Item.List>
                  <SettingRow
                    title="Binding policy"
                    description="Whether a version locks the resource IDs it shipped with. Changing it does not touch the settings that already exist."
                  >
                    <Skeleton
                      v-if="loading"
                      height="2.5rem"
                    />
                    <Select
                      v-else
                      v-model="form.bindingPolicy"
                      size="large"
                      class="w-full"
                      :disabled="saving"
                      :display-value="bindingLabel"
                    >
                      <Select.Trigger aria-label="Binding policy" />
                      <Select.Content>
                        <Select.Option
                          v-for="policy in BINDING_POLICIES"
                          :key="policy.value"
                          :value="policy.value"
                        >
                          {{ policy.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    title="Deployment policy"
                    description="Single serves one version and a deploy replaces it; Versioned gives each version its own URL. An environment can only use a setting that matches its own."
                  >
                    <Skeleton
                      v-if="loading"
                      height="2.5rem"
                    />
                    <Select
                      v-else
                      v-model="form.deploymentPolicy"
                      size="large"
                      class="w-full"
                      :disabled="saving"
                      :display-value="deploymentLabel"
                    >
                      <Select.Trigger aria-label="Deployment policy" />
                      <Select.Content>
                        <Select.Option
                          v-for="policy in DEPLOYMENT_POLICIES"
                          :key="policy.value"
                          :value="policy.value"
                        >
                          {{ policy.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    title="Apply to existing Deployment Settings"
                    description="Give every setting this account already holds the binding policy above when you save. Default is never changed."
                    kind="compact"
                  >
                    <Switch
                      v-model="form.applyToExisting"
                      :disabled="saving || loading"
                      aria-label="Apply to existing Deployment Settings"
                    />
                  </SettingRow>
                </Item.List>
              </template>
            </Card>
          </SettingsSection>

          <SettingsSection
            title="All services"
            anchor="all-services"
            hint="Every service, every environment, and the Deployment Setting each one publishes with."
          >
            <Card :padded="false">
              <template #content>
                <div
                  v-if="loading"
                  class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)"
                >
                  <Skeleton
                    width="40%"
                    height="1.25rem"
                  />
                  <Skeleton height="2.5rem" />
                </div>
                <EmptyState
                  v-else-if="!services.length"
                  size="small"
                  icon="ai ai-server"
                  title="No services yet"
                  description="Each environment of a new service is linked to a matching Deployment Setting automatically."
                />
                <Accordion
                  v-else
                  type="single"
                  arrow-position="left"
                  collapsible
                >
                  <Accordion.Item value="all-services">
                    <Accordion.Trigger :level="3">
                      <span class="flex flex-1 flex-wrap items-center gap-(--spacing-sm)">
                        <span class="text-label-md text-(--text-default)">All services</span>
                        <span class="text-body-sm text-(--text-muted)">{{
                          reachLabel(services.length)
                        }}</span>
                        <Tag
                          v-if="sharedCount"
                          :label="`${sharedCount} on a shared setting`"
                          severity="warning"
                          size="small"
                        />
                      </span>
                    </Accordion.Trigger>
                    <Accordion.Content>
                      <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                        <Input
                          v-bind="serviceFilterProps"
                          size="medium"
                          placeholder="Search services or settings"
                          aria-label="Search services or Deployment Settings"
                          class="w-full"
                        >
                          <template #prefix>
                            <i
                              class="ai ai-search"
                              aria-hidden="true"
                            />
                          </template>
                        </Input>
                        <div
                          v-if="!matchingServiceCount"
                          role="status"
                        >
                          <EmptyState
                            size="small"
                            icon="ai ai-search"
                            title="No matching services"
                            :description="`No service or setting matches “${serviceFilterProps.modelValue}”.`"
                          >
                            <template #actions>
                              <Button
                                label="Clear search"
                                kind="outlined"
                                size="small"
                                @click="clearServiceSearch"
                              />
                            </template>
                          </EmptyState>
                        </div>
                        <ul
                          v-else
                          class="m-0 flex list-none flex-col p-0"
                          aria-label="Services"
                        >
                          <li
                            v-for="service in pagedServices"
                            :key="service.id"
                            class="flex min-w-0 flex-col gap-(--spacing-xs) border-b border-(--border-muted) py-(--spacing-sm) last:border-b-0"
                          >
                            <a
                              :href="`/services/${service.id}`"
                              class="truncate text-label-md text-(--text-default) no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                              >{{ service.name }}</a
                            >
                            <div
                              v-for="environment in service.environments"
                              :key="environment.name"
                              class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
                            >
                              <Tag
                                :label="environment.name"
                                severity="neutral"
                                size="small"
                              />
                              <Tag
                                :label="deploymentLabel(environment.deploymentPolicy)"
                                severity="info"
                                size="small"
                              />
                              <Select
                                :model-value="environment.settingId"
                                size="medium"
                                class="min-w-0 grow basis-(--container-2xs)"
                                :display-value="settingName"
                                @update:model-value="(value) => rebind(service, environment, value)"
                              >
                                <Select.Trigger
                                  :aria-label="`Deployment Setting for ${service.name} ${environment.name}`"
                                />
                                <Select.Content>
                                  <Select.Option
                                    v-for="option in optionsFor(environment)"
                                    :key="option.id"
                                    :value="option.id"
                                    :disabled="option.status === 'Inactive'"
                                  >
                                    {{ option.name }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                              <Tag
                                v-if="environment.auto"
                                key="auto"
                                label="Linked automatically"
                                severity="neutral"
                                size="small"
                              />
                              <Tag
                                key="shared"
                                v-if="boundTo(environment.settingId).length > 1"
                                :label="`Shared · ${reachLabel(boundTo(environment.settingId).length)}`"
                                severity="warning"
                                size="small"
                              />
                            </div>
                          </li>
                        </ul>
                        <Pagination
                          v-if="matchingServiceCount > SERVICES_PAGE_SIZE"
                          v-bind="servicePaginationProps"
                          aria-label="Services pages"
                        />
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </template>
            </Card>
          </SettingsSection>

          <SettingsSection
            title="Deployment Settings"
            anchor="deployment-settings"
            hint="Every setting this account holds, and the services each one publishes to."
          >
            <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex flex-wrap items-start gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow basis-(--container-2xs)">
                  <PropertyFilter
                    v-bind="propertyFilterProps"
                    placeholder="Filter Deployment Settings"
                    aria-label="Filter Deployment Settings"
                  />
                </div>
                <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs)">
                  <Tooltip
                    text="Refresh"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="ai ai-refresh"
                      kind="outlined"
                      size="medium"
                      :loading="refreshing"
                      aria-label="Refresh"
                      @click="refresh"
                    />
                  </Tooltip>
                  <Tooltip
                    text="Download CSV"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="ai ai-download"
                      kind="outlined"
                      size="medium"
                      :disabled="!matchingItems.length"
                      aria-label="Download CSV"
                      @click="exportCsv"
                    />
                  </Tooltip>
                  <CollectionPreferences
                    v-bind="preferencesProps"
                    title="Table preferences"
                  />
                </div>
              </header>

              <Card :padded="false">
                <template #content>
                  <DataTable
                    ref="settingsTable"
                    v-bind="tableProps"
                    :loading="loading || refreshing"
                    enable-sorting
                    :bordered="false"
                    aria-label="Deployment Settings"
                  >
                    <template #cell-name="{ row }">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span class="truncate">{{ row.name }}</span>
                        <Tag
                          v-if="row.system"
                          label="System"
                          severity="neutral"
                          size="small"
                          class="shrink-0"
                        />
                      </span>
                    </template>
                    <template #cell-services="{ row }">
                      <Tooltip
                        :text="
                          row.services.length
                            ? row.services.join(' · ')
                            : 'No environment publishes with this setting yet.'
                        "
                      >
                        <span
                          class="flex min-w-0 items-center gap-(--spacing-xs)"
                          tabindex="0"
                        >
                          <Tag
                            v-if="row.reach === 'Shared'"
                            label="Shared"
                            severity="warning"
                            size="small"
                            class="shrink-0"
                          />
                          <span
                            class="truncate"
                            :data-unused="row.reach === 'Unused' || null"
                            >{{ reachLabel(row.services.length) }}</span
                          >
                        </span>
                      </Tooltip>
                    </template>
                    <template #cell-type="{ value }">
                      <Tag
                        :label="value"
                        severity="info"
                        size="small"
                      />
                    </template>
                    <template #cell-bindingPolicy="{ value }">
                      <span class="truncate">{{ bindingLabel(value) }}</span>
                    </template>
                    <template #cell-deploymentPolicy="{ value }">
                      <span class="truncate">{{ deploymentLabel(value) }}</span>
                    </template>
                    <template #cell-status="{ value }">
                      <Table.CellStatus
                        :label="value"
                        :severity="value === 'Active' ? 'success' : 'neutral'"
                      />
                    </template>
                    <template #cell-updatedAt="{ row }">
                      <Table.CellTime
                        :value="row.updatedAt"
                        :author="row.system ? '' : row.updatedBy"
                      />
                    </template>
                    <template #header-actions>
                      <span class="sr-only">Actions</span>
                    </template>
                    <template #cell-actions="{ row }">
                      <Table.CellActions
                        v-if="!row.system"
                        :name="row.name"
                        @select="(_event, value) => onAction(value, row)"
                      >
                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="edit"
                            label="Edit"
                          />
                          <DropdownMenu.Item
                            value="clone"
                            label="Clone"
                          />
                        </DropdownMenu.Group>
                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="delete"
                            label="Delete"
                          />
                        </DropdownMenu.Group>
                      </Table.CellActions>
                    </template>
                    <template #empty>
                      <EmptyState
                        size="small"
                        icon="ai ai-search"
                        title="No matching Deployment Settings"
                        description="No setting matches these filters."
                      >
                        <template #actions>
                          <Button
                            label="Clear filters"
                            kind="outlined"
                            size="small"
                            @click="clearFilters"
                          />
                        </template>
                      </EmptyState>
                    </template>
                  </DataTable>
                </template>
              </Card>
            </div>
          </SettingsSection>
        </div>
      </section>

      <Transition
        enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-to-class="translate-y-2 opacity-0"
      >
        <SaveBar v-if="dirty || saving">
          You have unsaved changes.
          <template #actions>
            <Button
              type="button"
              label="Discard"
              kind="outlined"
              size="medium"
              :disabled="saving"
              @click="discard"
            />
            <Button
              label="Save"
              kind="primary"
              size="medium"
              :loading="saving"
              @click="save"
            />
          </template>
        </SaveBar>
      </Transition>
    </div>

    <Drawer
      v-model:open="drawerOpen"
      size="large"
      side="right"
      :dismissible="!submitting"
      :closable="!submitting"
    >
      <DrawerContent>
        <form
          ref="formEl"
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="drawerTitle"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>{{ drawerTitle }}</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                A Deployment Setting says how a deploy routes: whether versions lock the resource
                IDs they shipped with, and how many of them take traffic. An environment publishes
                with exactly one.
              </p>
            </div>
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">{{ drawerTitle }}</legend>
              <SettingsSection
                title="General"
                hint="How this setting reads in this list and in the field that applies it."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <Field
                    :required="Boolean(nameError) && !draft.name.trim()"
                    :invalid="Boolean(nameError) && Boolean(draft.name.trim())"
                  >
                    <Field.Label for="deployment-settings-name">Name</Field.Label>
                    <Input
                      id="deployment-settings-name"
                      v-model="draft.name"
                      size="large"
                      placeholder="production-hardened"
                      autocomplete="off"
                      @update:model-value="nameError = ''"
                    />
                    <Field.Description>{{
                      nameError || 'Name it after the services or the traffic it serves.'
                    }}</Field.Description>
                  </Field>
                  <Field>
                    <Field.Label for="deployment-settings-description">Description</Field.Label>
                    <Textarea
                      id="deployment-settings-description"
                      v-model="draft.description"
                      :rows="3"
                    />
                    <Field.Description
                      >Optional. Used for internal identification.</Field.Description
                    >
                  </Field>
                  <Field orientation="horizontal">
                    <Switch
                      id="deployment-settings-active"
                      v-model="draft.active"
                    />
                    <Field.Content>
                      <Field.Label for="deployment-settings-active">Active</Field.Label>
                      <Field.Description
                        >When off, the setting stays in the list but no environment can choose
                        it.</Field.Description
                      >
                    </Field.Content>
                  </Field>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Routing and policy"
                hint="How versions bind to the resources they ship with, and how traffic reaches them."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <Field.Legend kind="label">Binding policy</Field.Legend>
                    <RadioGroup
                      v-model="draft.bindingPolicy"
                      name="deployment-settings-binding"
                      aria-label="Binding policy"
                    >
                      <RadioGroup.Item
                        v-for="policy in BINDING_POLICIES"
                        :key="policy.value"
                        :value="policy.value"
                        :description="policy.description"
                        >{{ policy.label }}</RadioGroup.Item
                      >
                    </RadioGroup>
                  </fieldset>
                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <Field.Legend kind="label">Deployment policy</Field.Legend>
                    <RadioGroup
                      v-model="draft.deploymentPolicy"
                      name="deployment-settings-policy"
                      aria-label="Deployment policy"
                      :disabled="Boolean(editingId)"
                    >
                      <RadioGroup.Item
                        v-for="policy in DEPLOYMENT_POLICIES"
                        :key="policy.value"
                        :value="policy.value"
                        :description="policy.description"
                        >{{ policy.label }}</RadioGroup.Item
                      >
                    </RadioGroup>
                    <Field.Description
                      >Cannot be changed after the setting is created.</Field.Description
                    >
                  </fieldset>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="drawerOpen = false"
              />
              <Button
                type="submit"
                :label="editingId ? 'Save changes' : 'Create Deployment Setting'"
                kind="primary"
                size="medium"
                :loading="submitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete Deployment Setting"
      :description="deleteDescription"
      confirm-label="Delete"
      size="small"
      @confirm="remove"
    />
  </div>
</template>
```
