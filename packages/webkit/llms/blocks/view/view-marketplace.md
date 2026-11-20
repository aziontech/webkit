# ViewMarketplace (`view/view-marketplace`)

> The marketplace page: a medium page heading with the outlined Documentation action over the integration catalog, the integrations installed into an existing application (templates live in `view/view-template-browser`): a Featured row of three `featured` `IntegrationCard`s (centred, raised, the context badge in the corner) while no filter is set, then All integrations: one `PropertyFilter` (free text over name, publisher and description; Publisher, Category, Context and Status as properties, all in the URL through `useCollection`) over a grid of `IntegrationCard` tiles with the logo, the name, by the publisher, two lines of description, the category badge, the Installed tag and an Install or Configure action. A tile opens the integration in a large right `Drawer`: name and publisher in the header, the description, `KeyValueList` (publisher, category, context, version, last update, the applications it runs on), an Overview in `DocProse`, the permissions it needs, and the install form, a required Application `Field` with a `Select` of the applications it is not on yet. Install is an async run (`state/state-async-submit`): the button shows `loading`, a progress toast follows the user, and the outcome lands as a toast and an inline `Alert` in the drawer; success carries Configure and Open application, failure is permanent and carries Edit and Reinstall. A search that matches nothing shows No matching integrations with Clear filters; while the catalog loads the tiles are skeletons. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/view/view-marketplace/view-marketplace.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-marketplace")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [DataTable](../../components/data-table.md), [DocProse](../../components/doc-prose.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [Input](../../components/input.md), [IntegrationCard](../../components/integration-card.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [KeyValueList](../../components/key-value-list.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../components/property-filter.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Skeleton](../../components/skeleton.md), [Switch](../../components/switch.md), `TableCellStatus`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), `use-collection`
- Skills: `webkit-lists`, `webkit-form`, `webkit-errors`, `webkit-ui-states`

## Asked as

marketplace; integration catalog; integrations marketplace; install an integration; browse integrations; extensions catalog; plugin catalog; app store page; integration detail; installed integrations; configure integration; marketplace de integrações; catálogo de integrações; instalar integração; loja de extensões

The page where people find something made by Azion or a partner and add it to what they run. It lists integrations, installed into an existing application; templates, which start a new project, live in `view/view-template-browser`. People browse by need ("block bots", "split traffic"), compare by publisher and context, read what an integration does and what it may touch, then install it on one application and keep working while it installs. One `useCollection` call holds the search and the filters; one drawer holds the detail and the install; the install reports by toast wherever the person is.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use marketplace for installable integrations into an existing resource; templates live in view-template-browser.
- A catalog of installable add-ons (integrations, extensions, plugins) with a publisher, a category and an installed state per account.
- Installing means choosing a target (an application) and waiting for an asynchronous run.

## When not to use

- The catalog of templates a project starts from: use `view/view-template-browser`.
- Deploying a chosen template: use `create/create-deploy-template`.
- The resources the account already created: use `view/view-card` or `view/view-table`.
- Changing the settings of an installed integration on one application: use `edit/edit-resource` from Configure.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size: "Marketplace" and one sentence of purpose. The actions slot holds only the outlined medium Documentation `Button`, which opens the docs in a new tab.

### B. Featured — `IntegrationCard` (required)

While no filter is set (`filtersActive` is false), a "Featured" `h2` over three `IntegrationCard featured` tiles in a row (one a row on a phone): the mark, the name, the publisher and the description centred on a raised surface with a primary glow at the top, and the context as a primary badge in the corner. They carry no action, so the row reads as a recommendation; the tile opens the drawer. Searching hides the row, so the results start at the top.

### C. Search and filter — `PropertyFilter` (required)

Under the "All integrations" `h2`, one `PropertyFilter` bound with `v-bind="propertyFilterProps"`. Free text searches the name, the publisher and the description; Publisher and Category list the values in the catalog, Context is Application or Firewall, and Status is Installed or Available. Every token lives in the URL (`url: true`).

### D. Integration tiles — `IntegrationCard`, `Button` (required)

A `ul` grid, one to three tiles a row by width, of `IntegrationCard`: the logo, the name (the stretched target that emits `select`), "by" the publisher, two lines of description, the category as a secondary badge, the Installed tag from `installed`, and in the `action` slot an outlined small `Button`, Install for an available integration and Configure for an installed one, named with the integration (`Install Rate Guard`). Both the tile and its action open the drawer.

### E. No matching integrations — `EmptyState`, `Button` (required)

When `status` is `no-match`, the grid gives way to a medium `EmptyState` with the filter-slash glyph, "No matching integrations", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`.

### F. Integration drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter` (required)

A large right `Drawer` controlled by `v-model:open`. Its content is a `form` named `Install <name>` with `novalidate`. `PanelHeader` holds the logo, the name as `DrawerTitle`, "by" the publisher and the drawer's own close button. `PanelBody` scrolls; `PanelFooter` holds, at the end, Configure (outlined, a link to the integration's settings) when it is installed somewhere, and the primary submit Install while an application is left.

### G. Install outcome — `Alert` (required)

The inline half of the state-async-submit outcome, at the top of the drawer: a success `Alert` naming the application ("Rate Guard is installed on storefront. It runs from the next request."), or a danger `Alert` with the server's reason and a Reinstall action. Nothing shows while idle or running; the button and the toast carry the running state.

### H. Integration facts — `KeyValueList` (required)

A two-column `KeyValueList` named "Integration details": Publisher (in `bdi`), Category, Context, Version, Updated and Installed on (the applications, or "Not installed").

### I. Overview — `DocProse` (required)

An "Overview" `h3` over the publisher's text in `DocProse`, ending on what installing adds to the application. Then a "Permissions" `h3` with the list of what the integration may read or add, each line led by a check glyph.

### J. Install form — `Field`, `Select` (required)

An "Install" `h3` ("Install on another application" once installed somewhere) over a required `Field` labelled Application with a `Select` of the applications it is not installed on yet. Submitting without a choice marks the `Field` invalid and shows `Field.Error` ("Select the application to install Rate Guard on."); otherwise `Field.Description` says where it runs. While the run lasts the `Field` is disabled. When no application is left, the field gives way to one sentence and the footer drops Install.

### K. Solution page — `Card`, `Select`, `Field`, `KeyValueList`, `DocProse` (optional)

The drawer's content as a page, for the integration's own URL (the variant adds `Tabs`, `Link`, `Table` and `Tag`). A `Link` back to Marketplace, the `PageHeader`, then `Tabs` for Overview (`DocProse`), Usage (how to set it up, with the setting names in code), Changelog (an ordered version history, newest first, `Latest` as an info `Tag`) and Applications (a `Table` of the applications running it with their version, `TableCellStatus` Up to date or Update available, and an `Update to <version>` button). Beside it, an install card: a required Application `Select` whose options carry an `Installed` or `Update available` `Tag` (installed and current ones are disabled) and a submit that reads Install or Update; under it the facts in `KeyValueList`. Install and Update are async runs with the same toast as the drawer (Configure, Open application).

### L. Configure screen — `Field`, `Select`, `Alert`, `Button` (optional)

The settings of one installed integration on one application (the variant adds `SettingsGroup`, `Item`, `SettingsRow`, `Switch`, `Input` and `SaveBar`). `SettingsGroup`s group them; an on/off setting is a compact `SettingsRow` in an `Item.List`, the rest are `Field`s. Errors follow `state/state-form-validation` (SectionRejected): nothing is red before Save; after it a danger `Alert` above and a `Field.Error` per field, focus on the first. Changes raise a `SaveBar` with Discard and Save. Saving settings is not a deploy, so the toast has no Edit or Redeploy.

### M. Loading catalog — `Card`, `Skeleton` (required)

While `loading` is set, the Featured row and the heading of All integrations give way to one band that is `aria-busy` and named Loading integrations: the disabled `PropertyFilter` over six `Card`s holding `Skeleton` shapes (mark, name, two lines, the badge and the action), in the grid of the tiles.

### Install toast — through `toast`

Raised through `toast` with one id for the install, so progress turns into the outcome in place. Progress is `toast.loading` ("Installing Rate Guard on storefront…", "It keeps running if you close this panel."). Success is `toast.success`, closable, with Configure and Open application. Failure is `toast.error` with `duration: 0`, closable, with Edit (reopens the drawer with the same choice) and Reinstall. Leaving the page dismisses it. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its records through props and emits every action; it fetches nothing and runs no install itself. `MarketplaceIntegration`, `MarketplaceInstall` and `MarketplaceProps` are exported from `view-marketplace.vue`, and `sample.ts` holds the sample catalog and applications the block renders when `integrations` and `applications` are left out (the catalog never while `loading` is set).

| Prop                   | Type                       | What it does                                                                                                 |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `integrations`         | `MarketplaceIntegration[]` | The catalog; the search, the properties, Featured and the tiles run on it in the browser.                    |
| `applications`         | `string[]`                 | The applications an integration can be installed on; the drawer's `Select` lists the ones it is not on yet.  |
| `loading`              | `boolean`                  | The catalog is loading: the search disables and six skeleton tiles hold the grid.                            |
| `installing`           | `boolean`                  | The install request is in flight: Install spins, the field locks and the progress toast shows.               |
| `error`                | `string`                   | Why the last install failed: the danger `Alert` with Reinstall and the permanent failure toast.              |
| `installedApplication` | `string`                   | The application the last install succeeded on: the success `Alert`, the Installed tag and the success toast. |
| `defaultText`          | `string`                   | Search text the filter starts with.                                                                          |
| `defaultIntegration`   | `string`                   | Id of the integration whose drawer starts open.                                                              |
| `defaultApplication`   | `string`                   | Application the install field starts with.                                                                   |

| Event     | Payload                                 | When                                                          |
| --------- | --------------------------------------- | ------------------------------------------------------------- |
| `select`  | `(event, integration)`                  | A tile, or its Install or Configure button, opens the drawer. |
| `install` | `(event, { integration, application })` | Install (or Reinstall) with an application chosen.            |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import ViewMarketplace, { type MarketplaceInstall } from './view-marketplace.vue'

  const { data, pending } = useIntegrations()
  const { data: applications } = useApplications()
  const installing = ref(false)
  const installError = ref('')
  const installedOn = ref('')

  const install = async (event: Event, { integration, application }: MarketplaceInstall) => {
    installing.value = true
    installError.value = ''
    installedOn.value = ''
    try {
      await installIntegration(integration.id, application)
      installedOn.value = application
    } catch (failure) {
      installError.value = reasonOf(failure)
    } finally {
      installing.value = false
    }
  }
</script>

<template>
  <ViewMarketplace
    :integrations="data ?? []"
    :applications="applications ?? []"
    :loading="pending"
    :installing="installing"
    :error="installError"
    :installed-application="installedOn"
    @install="install"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Run the catalog on one `useCollection` call with `filtering`, `propertyFiltering` and `url: true`; derive the Status property from where each integration is installed.
- Use `IntegrationCard` for every integration tile, with the installed state as the `installed` prop and one action in the `actions` slot.
- Hide the Featured row while any filter is set.
- Keep templates out of this page: a template starts a project, so it lives in `view/view-template-browser`.
- Open the detail in a drawer so the catalog, the filter and the scroll stay put.
- Show the permissions before the install form, and the target as a required field.
- Treat install as an async run: `loading` on Install, a progress toast, then the outcome as a toast and an inline `Alert`, with actions that fit an integration (Configure, Open application; Edit, Reinstall).
- Keep the failure toast until the person closes it.

## Don't

- Don't install from the tile in one click; the person must pick the application and see the permissions.
- Don't point the outcome at a list of runs ("View installs", "View deployments"); the toast carries Configure or Edit and Reinstall.
- Don't use "Retry" or "Try again" for a failed install; the action is Reinstall.
- Don't show Install for an application that already runs the integration; filter it out of the `Select`.
- Don't badge every tile with more than one tag beside Installed; the publisher and the category are enough to compare.
- Don't add a Templates tab or template tiles; link to `view/view-template-browser` instead.
- Don't use `featured` for every integration tile; it marks the short Featured row only.

## Copy

- **Title:** "Marketplace". Description: "Find integrations that run on your applications."
- **Sections:** "Featured", "All integrations".
- **Filter:** placeholder and `aria-label` "Search integrations".
- **Tile action:** "Install" or "Configure"; its `aria-label` adds the name.
- **Drawer:** the name, "by <publisher>", "Overview", "Permissions", "Install" or "Install on another application", the field "Application" with "Select an application".
- **Validation:** "Select the application to install <name> on."
- **Progress toast:** "Installing <name> on <application>…" / "It keeps running if you close this panel."
- **Success:** toast "<name> is installed on <application>." / "It runs from the next request to the application.", actions "Configure" and "Open application"; the inline `Alert` says the same in one line.
- **Failure:** toast "<name> wasn't installed on <application>." with the reason as a full sentence, actions "Edit" and "Reinstall"; the inline `Alert` carries the reason and "Reinstall".
- **No match:** "No matching integrations", "No integration matches this search. Remove a filter to widen the results.", "Clear filters".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The layout owns the one `main` landmark; the `PageHeader` title is the only `h1`, each section heading an `h2`, each tile name an `h3`.
- Each tile's target is a real button named by the integration; the action button sits above it and is named with the integration, so "Install" is never ambiguous in a list.
- The Installed state is text in a `Tag`, never colour alone.
- `/` focuses the integrations search from anywhere on the page, except while typing in a field.
- The drawer traps focus, is named by `DrawerTitle`, closes on Escape and returns focus to what opened it; its form has an accessible name.
- The Application field is required and labelled; its error is tied to the `Select` through the `Field`, and focus stays on Install so the person can correct and resubmit.
- Toasts never take focus and are announced politely, the failure toast assertively; the failure toast stays until closed and its actions are reachable by keyboard.
- In Configure, `⌘ S` (`Ctrl S` off Apple) saves the settings while the `SaveBar` shows unsaved changes, the same as Save; with no changes it does nothing. Save carries `aria-keyshortcuts` and a `Kbd` keycap.

## States

- Default: `integrations`, or the sample; Featured, All integrations, the filter and the tiles; a tile opens the drawer and Install emits `install`; `installing`, `error` and `installedApplication` show its outcome.
- Detail: `defaultIntegration="request-signer"`; the drawer is open on Request Signer with its details, overview, permissions and the install form.
- Installing: `installing`, with `defaultApplication="storefront"`; Install is running on storefront; the button is `loading`, the field disabled and the progress toast says it keeps running.
- Installed: `installedApplication="storefront"`; Request Signer is installed on storefront; the success Alert, the Installed tag, Configure in the footer and the success toast with Configure and Open application.
- InstallError: `error`, with `defaultApplication="checkout"`; the install on checkout failed; the danger Alert with the reason and Reinstall, and the permanent toast with Edit and Reinstall.
- NoMatch: `defaultText="kubernetes"`; the integration search "kubernetes" matches nothing; the Featured row hides and the empty state offers Clear filters.
- Loading: `loading`; the search is disabled and six `Skeleton` integration tiles hold the grid in a band that is `aria-busy`.
- SolutionPage: Waiting Room as a page, storefront on 1.3.0 (Update available) and checkout on 1.4.0.
- Configure: Waiting Room settings on storefront, with the SaveBar after a change.

## Related

- `view/view-template-browser` — the one template catalog, grouped by category, with a filter and a README preview.
- `create/create-deploy-template` — where a template's Deploy leads.
- `state/state-async-submit` — the toast and inline outcome every install follows.
- `state/state-form-validation` (SectionRejected) — the field, section and toast placement of a form error.
- `IntegrationCard` and `useCollection` — see `skills/webkit-lists`.

## Variants

- `Default` — primary (the code below)
- `Detail` — The detail drawer open on Request Signer: details, overview, permissions and the install form.
- `Installing` — Install is running on storefront: the button shows loading, the field is disabled and the progress toast says it keeps running if the panel closes.
- `Installed` — The install succeeded: the success Alert in the drawer, the Installed tag on the tile, Configure in the footer and the success toast with Configure and Open application.
- `InstallError` — The install failed on checkout: the danger Alert with the reason and Reinstall, and the permanent failure toast with Edit and Reinstall.
- `NoMatch` — The Integrations tab with a search that matches no integration: the Featured row hides, the token stays and a medium EmptyState offers Clear filters.
- `Loading` — The catalog is loading: the integration search is disabled and skeleton integration tiles hold the grid.
- `SolutionPage` — The integration as a full page (Waiting Room): a Back to Marketplace `Link`, the `PageHeader`, `Tabs` for Overview, Usage, Changelog (version history, Latest marked) and Applications (a `Table` of the applications running it, `TableCellStatus` Up to date or Update available and an Update to <version> action), beside an install card whose Application `Select` tags each application Installed or Update available. Install and Update are async runs that end in a toast with Configure and Open application.
- `Configure` — The screen behind Configure: the integration's settings on one application (Queue visitors `Switch`, Capacity and Queue page title fields, Session length `Select`) in `SettingsGroup`s, errors after Save with a summary `Alert`, and a `SaveBar` with Discard and Save; saving is not a deploy, so its toast has no Redeploy.

Each variant is the same screen in another state: `get_block("view/view-marketplace", { variant })`, or the file under `blocks/view/view-marketplace/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { toast } from '@aziontech/webkit/toast'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

  import { sampleApplications, sampleIntegrations } from './sample'

  /** Where an integration runs. */
  export type MarketplaceContext = 'application' | 'firewall'

  /** One integration of the catalog. */
  export interface MarketplaceIntegration {
    /** Stable slug, used in the Configure link. */
    id: string
    /** The name on the tile and the drawer title. */
    name: string
    /** Who publishes it. */
    vendor: string
    /** Icon classes of its mark. */
    logo: string
    /** The category badge and filter value. */
    category: string
    /** Where it runs. */
    context: MarketplaceContext
    /** One sentence on the tile and in the drawer. */
    description: string
    /** The current version, as display text. */
    version: string
    /** When it changed last, as display text. */
    updated: string
    /** Listed in the Featured row. */
    featured: boolean
    /** The applications it already runs on. */
    installedOn: string[]
  }

  /** What an install sends. */
  export interface MarketplaceInstall {
    /** The integration to install. */
    integration: MarketplaceIntegration
    /** The application to install it on. */
    application: string
  }

  export interface MarketplaceProps {
    /** The catalog; filtered in the browser. Left out, the sample renders. */
    integrations?: MarketplaceIntegration[]
    /** The applications an integration can be installed on. Left out, the sample renders. */
    applications?: string[]
    /** The catalog is loading: the search disables and skeleton tiles hold the grid. */
    loading?: boolean
    /** The install request is in flight: Install spins, the field locks and the progress toast shows. */
    installing?: boolean
    /** Why the last install failed, shown in the danger alert and the failure toast with Reinstall. */
    error?: string
    /** The application the last install succeeded on; the drawer and a toast confirm it. */
    installedApplication?: string
    /** Search text the filter starts with. */
    defaultText?: string
    /** Id of the integration whose drawer starts open. */
    defaultIntegration?: string
    /** Application the install field starts with. */
    defaultApplication?: string
  }

  const props = withDefaults(defineProps<MarketplaceProps>(), {
    integrations: undefined,
    applications: undefined,
    loading: false,
    installing: false,
    error: '',
    installedApplication: '',
    defaultText: '',
    defaultIntegration: '',
    defaultApplication: ''
  })

  const emit = defineEmits<{
    select: [event: MouseEvent, integration: MarketplaceIntegration]
    install: [event: Event, payload: MarketplaceInstall]
  }>()

  const CONTEXTS: Record<MarketplaceContext, string> = {
    application: 'Application',
    firewall: 'Firewall'
  }

  const source = computed<MarketplaceIntegration[]>(
    () => props.integrations ?? (props.loading ? [] : sampleIntegrations)
  )
  const catalog = ref<MarketplaceIntegration[]>([])
  watch(
    source,
    (next) => {
      catalog.value = next.map((item) => ({ ...item, installedOn: [...item.installedOn] }))
    },
    { immediate: true }
  )
  const applications = computed(() => props.applications ?? sampleApplications)

  const withStatus = (item: MarketplaceIntegration) => ({
    ...item,
    status: item.installedOn.length ? 'installed' : 'available'
  })

  const unique = (key: 'vendor' | 'category') =>
    [...new Set(catalog.value.map((item) => item[key]))].sort()

  const properties = computed(() => [
    { key: 'name', label: 'Name' },
    {
      key: 'vendor',
      label: 'Publisher',
      options: unique('vendor').map((value) => ({ value }))
    },
    {
      key: 'category',
      label: 'Category',
      options: unique('category').map((value) => ({ value }))
    },
    {
      key: 'context',
      label: 'Context',
      options: Object.entries(CONTEXTS).map(([value, label]) => ({ value, label }))
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'installed', label: 'Installed' },
        { value: 'available', label: 'Available' }
      ]
    }
  ])

  const { items, propertyFilterProps, status, filtersActive, clearFilters } = useCollection({
    items: () => catalog.value.map(withStatus),
    filtering: { fields: ['name', 'vendor', 'description'], defaultText: props.defaultText },
    propertyFiltering: { properties },
    url: true
  })

  const featured = computed(() => catalog.value.filter((item) => item.featured))

  const detailOpen = ref(props.defaultIntegration !== '')
  const selectedId = ref(props.defaultIntegration || 'request-signer')
  const selected = computed<MarketplaceIntegration | undefined>(
    () => catalog.value.find((item) => item.id === selectedId.value) ?? catalog.value[0]
  )
  const available = computed(() =>
    applications.value.filter((app) => !selected.value?.installedOn.includes(app))
  )

  const form = reactive({ application: props.defaultApplication })
  const showErrors = ref(false)
  const applicationInvalid = computed(() => showErrors.value && !form.application)

  const run = reactive({ state: 'idle', application: '', reason: '' })
  const INSTALL_TOAST = 'marketplace-install'

  const openDetail = (id: string) => {
    if (selectedId.value !== id) {
      selectedId.value = id
      form.application = ''
      showErrors.value = false
      Object.assign(run, { state: 'idle', application: '', reason: '' })
    }
    detailOpen.value = true
  }

  const onSelect = (event: MouseEvent, item: MarketplaceIntegration) => {
    openDetail(item.id)
    emit('select', event, item)
  }

  const configure = () => {
    toast.dismiss(INSTALL_TOAST)
    openDetail(selectedId.value)
  }

  const install = (event: Event) => {
    showErrors.value = true
    const integration = selected.value
    if (!integration || !form.application || props.installing) return
    emit('install', event, { integration, application: form.application })
  }

  const showRunning = () => {
    const item = selected.value
    if (!item) return
    const application = form.application
    Object.assign(run, { state: 'running', application, reason: '' })
    toast.loading(`Installing ${item.name} on ${application}…`, {
      description: 'It keeps running if you close this panel.',
      id: INSTALL_TOAST
    })
  }

  const showSucceeded = (application: string) => {
    const item = selected.value
    if (!item) return
    if (!item.installedOn.includes(application))
      item.installedOn = [...item.installedOn, application]
    form.application = ''
    showErrors.value = false
    Object.assign(run, { state: 'succeeded', application, reason: '' })
    toast.success(`${item.name} is installed on ${application}.`, {
      description: 'It runs from the next request to the application.',
      id: INSTALL_TOAST,
      closable: true,
      actions: [
        { label: 'Configure', onClick: configure },
        { label: 'Open application', onClick: () => toast.dismiss(INSTALL_TOAST) }
      ]
    })
  }

  const showFailed = (reason: string) => {
    const item = selected.value
    if (!item) return
    const application = run.application || form.application
    form.application = application
    Object.assign(run, { state: 'failed', application, reason })
    toast.error(`${item.name} wasn't installed on ${application}.`, {
      description: reason,
      id: INSTALL_TOAST,
      duration: 0,
      closable: true,
      actions: [
        { label: 'Edit', onClick: configure },
        { label: 'Reinstall', onClick: (event: MouseEvent) => install(event) }
      ]
    })
  }

  const reinstall = (event: MouseEvent) => {
    form.application = run.application
    install(event)
  }

  watch(
    () => props.installing,
    (next) => {
      if (next) showRunning()
      else if (props.error) showFailed(props.error)
    }
  )
  watch(
    () => props.error,
    (next) => {
      if (next) showFailed(next)
    }
  )
  watch(
    () => props.installedApplication,
    (next) => {
      if (next) showSucceeded(next)
    }
  )

  onMounted(() => {
    if (props.installing) showRunning()
    else if (props.error) showFailed(props.error)
    else if (props.installedApplication) showSucceeded(props.installedApplication)
  })

  onBeforeUnmount(() => toast.dismiss(INSTALL_TOAST))
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Marketplace"
        description="Find integrations that run on your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/marketplace"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div class="layout-section-start">
        <section
          v-if="loading"
          class="flex min-w-0 flex-col gap-(--layout-group-gap) pt-(--layout-group-gap)"
          aria-busy="true"
          aria-label="Loading integrations"
        >
          <PropertyFilter
            v-bind="propertyFilterProps"
            placeholder="Search integrations"
            aria-label="Search integrations"
            disabled
          />
          <ul
            class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-2 xl:grid-cols-3"
          >
            <li
              v-for="tile in 6"
              :key="tile"
              class="flex min-w-0"
            >
              <Card class="w-full">
                <template #default>
                  <div class="flex flex-col gap-(--spacing-md)">
                    <div class="flex items-start gap-(--spacing-md)">
                      <Skeleton
                        width="2.5rem"
                        height="2.5rem"
                      />
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                        <Skeleton
                          width="50%"
                          height="1rem"
                        />
                        <Skeleton height="0.875rem" />
                        <Skeleton
                          width="75%"
                          height="0.875rem"
                        />
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <Skeleton
                        width="5rem"
                        height="1.25rem"
                      />
                      <Skeleton
                        width="4.5rem"
                        height="2rem"
                      />
                    </div>
                  </div>
                </template>
              </Card>
            </li>
          </ul>
        </section>
        <div
          v-else
          class="flex min-w-0 flex-col gap-(--layout-section-gap) pt-(--layout-group-gap)"
        >
          <section
            v-if="!filtersActive"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
            aria-labelledby="marketplace-featured"
          >
            <h2
              id="marketplace-featured"
              class="text-heading-2xs text-(--text-default)"
            >
              Featured
            </h2>
            <ul class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 md:grid-cols-3">
              <li
                v-for="item in featured"
                :key="item.id"
                class="flex min-w-0"
              >
                <IntegrationCard
                  class="w-full"
                  featured
                  :title="item.name"
                  :vendor="item.vendor"
                  :logo="item.logo"
                  :description="item.description"
                  :badges="[{ label: CONTEXTS[item.context] }]"
                  :installed="item.installedOn.length > 0"
                  @select="(event: MouseEvent) => onSelect(event, item)"
                />
              </li>
            </ul>
          </section>

          <section
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
            aria-labelledby="marketplace-all"
          >
            <h2
              id="marketplace-all"
              class="text-heading-2xs text-(--text-default)"
            >
              All integrations
            </h2>
            <PropertyFilter
              v-bind="propertyFilterProps"
              placeholder="Search integrations"
              aria-label="Search integrations"
            />

            <EmptyState
              v-if="status === 'no-match'"
              size="medium"
              icon="az az-filter-off"
              title="No matching integrations"
              description="No integration matches this search. Remove a filter to widen the results."
            >
              <template #actions>
                <Button
                  label="Clear filters"
                  variant="outline"
                  size="small"
                  @click="clearFilters"
                />
              </template>
            </EmptyState>

            <ul
              v-else
              class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-2 xl:grid-cols-3"
            >
              <li
                v-for="item in items"
                :key="item.id"
                class="flex min-w-0"
              >
                <IntegrationCard
                  class="w-full"
                  :title="item.name"
                  :vendor="item.vendor"
                  :logo="item.logo"
                  :description="item.description"
                  :badges="[{ label: item.category, severity: 'neutral' }]"
                  :installed="item.status === 'installed'"
                  @select="(event: MouseEvent) => onSelect(event, item)"
                >
                  <template #actions>
                    <Button
                      :label="item.status === 'installed' ? 'Configure' : 'Install'"
                      :aria-label="`${item.status === 'installed' ? 'Configure' : 'Install'} ${item.name}`"
                      variant="outline"
                      size="small"
                      @click="(event: MouseEvent) => onSelect(event, item)"
                    />
                  </template>
                </IntegrationCard>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>

    <Drawer
      v-if="selected"
      v-model:open="detailOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="`Install ${selected.name}`"
          novalidate
          @submit.prevent="install"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="selected.logo"
                  class="text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <div class="flex min-w-0 flex-col">
                <DrawerTitle>{{ selected.name }}</DrawerTitle>
                <span class="text-body-xs text-(--text-muted)"
                  >by <bdi>{{ selected.vendor }}</bdi></span
                >
              </div>
            </div>
          </PanelHeader>

          <PanelBody>
            <div class="flex flex-col gap-(--layout-section-gap)">
              <Alert
                key="alert-1"
                v-if="run.state === 'succeeded'"
                severity="success"
                :label="`${selected.name} is installed on ${run.application}. It runs from the next request.`"
              />
              <Alert
                key="alert-2"
                v-else-if="run.state === 'failed'"
                severity="danger"
                :label="`${selected.name} wasn't installed on ${run.application}. ${run.reason}`"
                action-label="Reinstall"
                @action="reinstall"
              />

              <p class="m-0 text-body-sm text-(--text-muted)">{{ selected.description }}</p>

              <KeyValueList
                :columns="2"
                aria-label="Integration details"
              >
                <KeyValueList.Item label="Publisher"
                  ><bdi>{{ selected.vendor }}</bdi></KeyValueList.Item
                >
                <KeyValueList.Item label="Category">{{ selected.category }}</KeyValueList.Item>
                <KeyValueList.Item label="Context">{{
                  CONTEXTS[selected.context]
                }}</KeyValueList.Item>
                <KeyValueList.Item label="Version">{{ selected.version }}</KeyValueList.Item>
                <KeyValueList.Item label="Updated">{{ selected.updated }}</KeyValueList.Item>
                <KeyValueList.Item label="Installed on">{{
                  selected.installedOn.length ? selected.installedOn.join(', ') : 'Not installed'
                }}</KeyValueList.Item>
              </KeyValueList>

              <section
                class="flex flex-col gap-(--layout-group-gap)"
                aria-labelledby="integration-overview"
              >
                <h3
                  id="integration-overview"
                  class="text-heading-2xs text-(--text-default)"
                >
                  Overview
                </h3>
                <DocProse>
                  <p>{{ selected.description }}</p>
                  <p>
                    Installing adds a function instance to the application you choose and one rule
                    that runs it. Its settings can be changed at any time from Configure.
                  </p>
                </DocProse>
              </section>

              <section
                class="flex flex-col gap-(--layout-group-gap)"
                aria-labelledby="integration-permissions"
              >
                <h3
                  id="integration-permissions"
                  class="text-heading-2xs text-(--text-default)"
                >
                  Permissions
                </h3>
                <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
                  <li
                    v-for="permission in [
                      'Read the application’s rules',
                      'Add a function instance to the application',
                      'Add one rule that runs the function'
                    ]"
                    :key="permission"
                    class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    <i
                      class="az az-check shrink-0 text-(--success-foreground)"
                      aria-hidden="true"
                    />
                    {{ permission }}
                  </li>
                </ul>
              </section>

              <section
                class="flex flex-col gap-(--layout-group-gap)"
                aria-labelledby="integration-install"
              >
                <h3
                  id="integration-install"
                  class="text-heading-2xs text-(--text-default)"
                >
                  {{ selected.installedOn.length ? 'Install on another application' : 'Install' }}
                </h3>
                <Field
                  v-if="available.length"
                  :invalid="applicationInvalid"
                  :disabled="installing"
                  required
                >
                  <Field.Label>Application</Field.Label>
                  <Select
                    v-model="form.application"
                    size="medium"
                    placeholder="Select an application"
                  >
                    <Select.Trigger class="w-full" />
                    <Select.Content>
                      <Select.Item
                        v-for="app in available"
                        :key="app"
                        :value="app"
                        >{{ app }}</Select.Item
                      >
                    </Select.Content>
                  </Select>
                  <Field.Error v-if="applicationInvalid">
                    Select the application to install {{ selected.name }} on.
                  </Field.Error>
                  <Field.Description v-else>
                    The integration runs on every request to this application.
                  </Field.Description>
                </Field>
                <p
                  v-else
                  class="m-0 text-body-sm text-(--text-muted)"
                >
                  {{ selected.name }} is installed on every application.
                </p>
              </section>
            </div>
          </PanelBody>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
              <Button
                v-if="selected.installedOn.length"
                label="Configure"
                icon="az az-settings"
                variant="outline"
                size="medium"
                :href="`/marketplace/${selected.id}/configure`"
              />
              <Button
                key="button-2"
                v-if="available.length"
                label="Install"
                variant="primary"
                size="medium"
                type="submit"
                :loading="installing"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>
  </div>
</template>
```

## `sample.ts`

```ts
import type { MarketplaceContext, MarketplaceIntegration } from './view-marketplace.vue'

export const sampleApplications: string[] = ['storefront', 'checkout', 'docs', 'api']

const integration = (
  id: string,
  name: string,
  vendor: string,
  logo: string,
  category: string,
  context: MarketplaceContext,
  description: string,
  extra: Partial<MarketplaceIntegration> = {}
): MarketplaceIntegration => ({
  id,
  name,
  vendor,
  logo,
  category,
  context,
  description,
  version: '1.4.0',
  updated: 'Oct 30, 2026',
  featured: false,
  installedOn: [],
  ...extra
})

export const sampleIntegrations: MarketplaceIntegration[] = [
  integration(
    'request-signer',
    'Request Signer',
    'Acme',
    'az az-key',
    'Access control',
    'firewall',
    'Sign every request with a rotating key, so the origin only answers traffic that passed through.',
    { featured: true }
  ),
  integration(
    'waiting-room',
    'Waiting Room',
    'Acme',
    'az az-hourglass',
    'Traffic management',
    'application',
    'Queue visitors during a traffic surge and let them in as capacity frees up.',
    { featured: true, installedOn: ['storefront'] }
  ),
  integration(
    'bot-score',
    'Bot Score',
    'Acme',
    'az az-shield',
    'Bot management',
    'firewall',
    'Score each request on known bot behaviour and block the ones above your threshold.',
    { featured: true }
  ),
  integration(
    'split-traffic',
    'Split Traffic',
    'Azion',
    'az az-sitemap',
    'Testing',
    'application',
    'Send a share of visitors to a second version of a page and keep each one on theirs.'
  ),
  integration(
    'geo-content',
    'Geo Content',
    'Azion',
    'az az-globe',
    'Personalization',
    'application',
    'Serve a regional version of a page from the visitor’s country, with a fallback.'
  ),
  integration(
    'signed-urls',
    'Signed URLs',
    'Azion',
    'az az-link',
    'Access control',
    'firewall',
    'Issue links that expire, so protected files can only be fetched for a limited time.',
    { installedOn: ['docs', 'api'] }
  ),
  integration(
    'rate-guard',
    'Rate Guard',
    'Acme',
    'az az-sliders-horizontal',
    'Access control',
    'firewall',
    'Limit how many requests one client can make in a window, per path or per key.'
  ),
  integration(
    'payload-limit',
    'Payload Limit',
    'Azion',
    'az az-box',
    'Traffic management',
    'firewall',
    'Refuse request bodies above a size you set, before they reach the origin.'
  ),
  integration(
    'request-id',
    'Request ID',
    'Azion',
    'az az-hash',
    'Observability',
    'application',
    'Add a unique identifier header to every request, to trace it across services.'
  ),
  integration(
    'phone-check',
    'Phone Check',
    'Acme',
    'az az-phone',
    'Fraud prevention',
    'firewall',
    'Validate phone numbers on sign-up forms and flag numbers linked to fraud.'
  ),
  integration(
    'queue-writer',
    'Queue Writer',
    'Azion',
    'az az-inbox',
    'Messaging',
    'application',
    'Write each request to a queue for processing later, and answer the client right away.'
  ),
  integration(
    'schedule-block',
    'Scheduled Block',
    'Azion',
    'az az-calendar-x',
    'Access control',
    'firewall',
    'Close an application to traffic on a schedule, such as outside business hours.'
  )
]
```
