# EditResource (`platform/edit/edit-resource`)

> The settings page of a resource, a page body for ConsoleLayout (the layout's breadcrumb names the resource): a small Settings page heading over stacked `SettingsSection` bands in the form column, each a heading with an anchor-link button and a hint glyph over a flush `Card` of field rows. The commit band is not there at rest: on the first edit a zero-height sticky strip at the bottom of the scroll region slides up a full-bleed band with a top rule, an info glyph, the unsaved-changes label with an optional muted hint, and Discard beside Save (stacked under the label on small screens), and it leaves once Save lands or Discard restores the record. The account settings pages end with the same band. A resource with a tab bar renders it as its Settings tab; a first-level resource with no tabs renders it as its own `/<resource>/:id/settings` page. Variants cover a record changed elsewhere (warning `Alert` with Reload, overwrite confirmation), the Danger zone with a typed-name delete, and the leave guard from `useUnsavedChanges` with the dirty mark on the tab. Built from `PageHeader`, `PageTabs`, `SettingsSection`, `SettingRow`, `SaveBar`, `Tabs`, `Card`, `Item`, `Input`, `Select`, `MultiSelect`, `Switch`, `Textarea`, `Field` choice cards around `RadioButton`, `TableRoot`, `Tag`, `Tooltip`, `Alert`, `ConfirmDialog`, `CopyButton`, `HelperText` and `Button`, with `useUnsavedChanges`.

- Surface: product
- Source: `blocks/platform/edit/edit-resource/edit-resource.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/edit/edit-resource")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [CodeBlock](../../../components/code-block.md), [CodeEditor](../../../components/code-editor.md), [ConfirmDialog](../../../components/confirm-dialog.md), [ConsoleLayout](../../../components/console-layout.md), [CopyButton](../../../components/copy-button.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [DropdownMenu](../../../components/dropdown-menu.md), [Field](../../../components/field.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [MultiSelect](../../../components/multi-select.md), [NumberInput](../../../components/number-input.md), [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PasswordInput](../../../components/password-input.md), [RadioButton](../../../components/radio-button.md), [SaveBar](../../../components/save-bar.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Switch](../../../components/switch.md), `TableRoot`, [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md), `use-unsaved-changes`
- Skills: `webkit-form`, `webkit-errors`, `webkit-layout`, `webkit-ux-heuristics`

## Asked as

settings page; resource settings; settings tab; application settings; workload settings; firewall settings; edit settings; página de configurações; configurações do recurso; aba de configurações; save bar; unsaved changes bar; sticky save bar; discard and save; commit bar; barra de salvar; alterações não salvas; salvar alterações; edit resource; editar recurso; data stream; data stream settings; log streaming; stream destination; sampling; log template; configurações do data stream; envio de logs; streaming de logs; stale record; changed elsewhere; overwrite changes; conflict on save; danger zone; delete resource; type the name to confirm; zona de perigo; excluir recurso; alterado em outro lugar; leave page guard; unsaved changes dialog; cache settings; cache policy; browser cache; edge cache; tiered cache; configurações de cache; protocol settings; https ports; http/3; tls version; mutual authentication; mtls; autenticação mútua

The settings page of one existing resource. The user comes here to change how the resource is named, what it runs with and whether it is active, review the change, and commit it or throw it away. Every field sits in a labeled section of the form column, and one save band appears only once something has changed, so the page reads as the resource's current state until the user edits it. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the resource breadcrumb, the ⌘K palette and the `main`; the save band sticks to the bottom of the layout's scrolling region.

## When to use

- A resource has a Settings tab (or, with no tabs, its own `/<resource>/:id/settings` page) with fields grouped into a few sections.
- Changes are reviewed together and committed in one save, with a way to discard them all.
- Some settings are fixed or paid and must be shown locked, with the reason beside them.

## When not to use

- Creating the resource for the first time: use `platform/create/single-page-create`, which shares this field list.
- Account or organization settings outside one resource: use `platform/settings/settings-form`.
- A resource whose content is code or a document: use `platform/edit/code-editor`.
- Deleting the resource: the Danger zone action opens `platform/delete/delete-with-confirmation`.
- A short list of attached records inside a section: use `platform/detail/attached-resources` as that section's body.

## Building blocks

### A. Resource tabs — `PageTabs`, `Tabs` (optional)

A full-bleed `PageTabs` with one `Tabs.Item` per tab, Settings last, in a `sticky top-0` wrapper on the canvas fill so it stays in view while the layout scrolls. A first-level resource with no tabs drops this bar and renders the page at its own settings route.

### B. Page heading — `PageHeader` (required)

A small `PageHeader` titled Settings with one sentence about what these settings cover. It sits at the top of the form column, inside the scrolling region.

### C. Settings sections — `SettingsSection`, `Card`, `Item`, `SettingRow`, `Input`, `HelperText`, `Switch` (required)

One `form` with a disabled-while-saving `fieldset` and a visually hidden legend. Each `SettingsSection` has a title, a `hint` and an `anchor` for deep links, over a flush `Card :padded="false"` with an `Item.List` of `SettingRow`s. Text values are large `Input`s; an empty Name flags on Save with a required `HelperText` and takes focus; on and off values are `Switch`es in compact rows. Sections run in a fixed order: General first, optional groups in the middle, Status or Danger zone last. See `skills/webkit-form`.

### D. Locked settings — `Tooltip`, `Switch` (optional)

A setting the user cannot change here (a paid module, a module that is always on) keeps its row with a disabled `Switch` inside a `Tooltip` that says why, and a link in the description to where it can be changed, e.g. Contact sales.

### E. Save bar — `SaveBar`, `Button` (required)

Hidden at rest. On the first edit a `SaveBar` slides up at the bottom of the scroll region with the unsaved-changes label, an optional muted hint, and an outlined Discard beside a primary Save, both medium (stacked under the label on small screens). While saving, the fieldset is disabled, Save shows its loading state and Discard is disabled. The bar leaves when Save lands or when Discard restores the record.

### F. Conditional fields — `SettingRow`, `Input`, `HelperText` (optional)

When one choice decides which fields apply (a connector, a scope, a template), the choice (a `Select` or `Field` choice cards around `RadioButton`) comes first and the rows it unlocks follow it inside the same `Card`, entering with `animate-content-enter`. Hidden rows keep no value that Save sends. Credentials are `PasswordInput`s that cannot be read back after Save, and the row says so. In DataStream the workload scope is `Field` choice cards around `RadioButton`; the Sampling band appears only when the stream collects from every workload, and Sampling rate is a `NumberInput` with a `%` suffix.

### G. Template editor — `SettingRow`, `HelperText` (optional)

A setting whose value is a document (a JSON data set) gets a stacked row, under the `Select` that picks the template. A preset is read-only: its document shows in a `CodeBlock` with Copy, and the row says how to edit (choose Custom template). A custom document is a `CodeEditor` (`language="json"`, a fixed `height`), checked on Save (`Write the data set as a JSON object.`); it passes `:loader="loadMonaco"` (the loader from the `code-editor` spec, with the JSON worker) so JSON is validated as you type, and keeps plain line numbers: `pad-line-numbers` is for full-page editors, not a fixed-height field in a form.

### H. Section warnings and server errors — `SettingsSection`, `Button` (optional)

A setting with a side effect beyond this resource carries a warning `Alert` above its section's `Card` while it is on (`Saving a stream with sampling on turns off every other data stream in this account.`). A server rejection scoped to one section follows the form-error rule (`platform/states/form-error`): one danger `Alert` above that section that says what happened and that nothing else was lost, with the recovery action on it (`Send test record`); the field it concerns turns invalid with its own one-line reason and takes the focus. Never a toast, never a summary at the top of the page. Saving a settings page is not a build or deploy, so the async-submit toast with Edit and Redeploy does not apply here.

### I. Leave guard — `Tabs`, `SaveBar` (optional)

`useUnsavedChanges(() => form)` keeps the saved baseline: `isDirty` drives the save bar and the `dirty` mark on the Settings `Tabs.Item` (a dot after the label, "Unsaved changes" for screen readers), `commit()` moves the baseline after a save and `discard()` restores it. Leaving while dirty (another tab, another route through `onBeforeRouteLeave(() => confirmLeave())`, a reload) asks first: the composable warns on `beforeunload` and drives one `ConfirmDialog` bound with `v-bind="dialogProps"`, whose actions are Keep editing, Discard changes and, when `onSave` is given, Save changes, which saves and then leaves. See `skills/webkit-form`.

### J. Changed elsewhere — `Button`, `SaveBar` (optional)

When the record was saved by someone else after the form opened, a warning `Alert` sits between the heading and the first section: a bold "Changed elsewhere." lead, one sentence that says nothing was lost and what Save will do, and a secondary Reload button in its action slot. Save does not overwrite silently: it opens a `ConfirmDialog` (kind `primary`) with Go back and Overwrite and save. Reload swaps the edits for the saved values and the notice becomes an info `Alert` "Edits discarded." with Undo, which brings the edits back. The save bar's hint and Discard label follow the notice ("Saving overwrites the version saved elsewhere.", "Discard and reload"). This is the form-error rule (`platform/states/form-error`) applied to an edit: one message above the form, the recovery action on it.

### K. Danger zone — `SettingsSection`, `Card`, `SettingRow`, `Button`, `Input` (optional)

The last section, titled Danger zone with the hint "Actions that cannot be undone.", holds one compact `SettingRow` per irreversible action with a medium danger `Button` and a trash icon. The action opens a medium `ConfirmDialog`: a warning `Alert` that it cannot be reversed, one paragraph on what goes with it and a docs link, then "To confirm, type" the name in a code chip with a `CopyButton`, and an `Input` labelled by that sentence. The danger confirm button stays disabled until the typed name matches and shows its loading state while the request runs; Enter in the input confirms. See `platform/delete/delete-with-confirmation`.

## Do

- Show the save bar only while the form differs from the saved record.
- Disable the whole fieldset while saving, not each field separately.
- Give every section a short hint that says what it controls, and an anchor so a link can land on it.
- Keep locked settings visible, disabled, with the reason and the way to unlock them.
- Put destructive actions in a Danger zone section at the end, never in the save bar.
- Check every field when Save is pressed and show errors only then; see `skills/webkit-errors`.
- Put the choice that decides other fields first, and show only the fields that choice needs.
- Show a preset document read-only, with Copy, beside the way to make it editable.
- Mark the tab that holds unsaved changes with `dirty`, and ask before leaving it while dirty.
- Offer Save changes in the leave dialog when the form can be saved from there; the user keeps their work without going back.
- Say when the record changed elsewhere as soon as it is known, and ask before Save overwrites it.
- Keep the edits on screen after a reload with an Undo, so a stale form never loses work silently.
- Ask for the resource name before a delete, with a copy button beside the name.

## Don't

- Don't place a permanent Save button at the top or bottom of the page; the save bar appears on demand.
- Don't save on each toggle; changes wait for Save.
- Don't hide fields the user cannot change; lock them and say why.
- Don't use `size="medium"` or larger for the Settings heading; the tab bar or breadcrumb already names the resource.
- Don't add a Cancel button that leaves the page; Discard restores the record in place.
- Don't report a rejected destination or credential in a toast; it belongs above the section it concerns.
- Don't echo a saved secret back into its field.
- Don't rely on the dot alone: the dirty tab also says "Unsaved changes" to screen readers.
- Don't overwrite a record that changed elsewhere without the overwrite confirmation.
- Don't put Delete in the save bar, the page heading or a menu of the form; it lives in the Danger zone.
- Don't enable the delete confirm button before the typed name matches.

## Copy

- **Heading:** "Settings", with one sentence ending in a period, e.g. "Core configuration for this project."
- **Section titles:** short nouns, e.g. "General", "Modules", "Subscription modules", "Status".
- **Row descriptions:** one sentence that says what the setting does, e.g. "When disabled, the project stops serving traffic."
- **Save bar:** state what changed and when it applies, e.g. "Project settings changed." with the hint "Saving publishes them on the next deployment."; buttons "Discard" and "Save".
- **Locked reason:** one sentence with the way out, e.g. "Contact sales to activate this module."
- **Server error on a section:** what happened, then what was kept, e.g. "The endpoint did not answer the test record, so the stream was not saved. Your other changes are still here."; the field reason is one line, e.g. "The endpoint did not answer within 10 seconds."
- **Leave dialog:** "Unsaved changes", "This page has changes you haven't saved. If you leave now, they're discarded." (with Save: "Save them before you leave, or discard them and continue."); buttons "Keep editing", "Discard changes", "Save changes". These are the built-in `unsavedChanges` messages in en, pt-BR and es.
- **Changed elsewhere:** "Changed elsewhere." + "This project was saved by someone else after you opened it. …"; button "Reload"; dialog "Overwrite changes made elsewhere?" with "Go back" and "Overwrite and save"; after a reload "Edits discarded." with "Undo".
- **Danger zone:** section "Danger zone" with "Actions that cannot be undone."; row "Delete this project"; dialog "Delete project", "Once confirmed, this action can't be reversed.", "To confirm, type <name>"; buttons "Cancel" and "Delete project".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The form has an `aria-label` and its `fieldset` a visually hidden `legend` with the same words, e.g. "Main settings".
- Every `Input` and `Switch` has an `aria-label` matching its row title.
- A disabled `Switch` keeps its `Tooltip`, so keyboard and pointer users can still read why it is locked.
- External links open in a new tab with `rel="noopener noreferrer"` and an icon marked `aria-hidden="true"`.
- The save bar enters after the form in reading order and its motion respects reduced motion.
- An invalid field points at its `HelperText` through `aria-describedby`; on Save the first invalid field takes the focus.
- A section `Alert` is announced by `Alert` itself; its recovery `Button` is a real button inside it.
- The `CodeEditor` and the read-only `CodeBlock` are named after their row (`Data set`, `Copy the data set as JSON`).
- The dirty tab mark is `aria-hidden`; a visually hidden "Unsaved changes" joins the tab's accessible name, and under forced colors the dot paints in `CanvasText`.
- The leave dialog is a `ConfirmDialog`: focus moves into it, Escape and the close button count as Keep editing, and focus returns to the control that asked to leave.
- The changed-elsewhere notice sits in a polite live region and takes focus after Reload so the change of values is announced; both its actions are real buttons.
- The delete confirmation `Input` is labelled by the "To confirm, type …" sentence (`aria-labelledby`); the `CopyButton` has its own name ("Copy the project name") and announces Copied.

## States

- ProjectSettings: a project's Settings tab with General, Modules and Subscription modules; the save bar is hidden until an edit.
- DeployableSettings: a deployable resource's Settings tab with General, Domains, collapsed Advanced settings and the Danger zone, whose Delete resource opens the type-to-confirm `ConfirmDialog` of `platform/delete/delete-with-confirmation`.
- PolicySettings: a security policy's Settings tab with General, Modules with one locked on, Debug rules and Status.
- ResourceSettings: a first-level resource with no tabs at its own settings route; Save checks every field before it commits.
- UnsavedChanges: after one edit; the save bar is up with Discard and Save.
- Saving: while the request is in flight; Save is loading and Discard is disabled.
- DataStream: a data stream at its own settings route with General, Source, Sampling, Template and Destination; the destination fields follow the connector, Save sends one test record, and an endpoint that does not answer raises the section `Alert` of the form-error rule.
- StaleRecord: the form holds edits and the record changed elsewhere; the warning notice with Reload is up, Save asks before overwriting, Reload turns the notice into Edits discarded with Undo.
- DangerZone: the settings end with the Danger zone; Delete project opens the typed-name confirmation, enabled only on a match, loading while the delete runs.
- CacheSettings: one cache setting of an application; General, Browser cache, Edge cache and the collapsed Advanced cache key. Rows that only apply under a switch or an override sit one level in (`SettingRow` `level`). An edge TTL under 60 seconds and an empty allowlist or denylist are field errors with their reason, focused on Save. Save deploys and reports through the async-submit toast with Edit and Redeploy.
- Protocols: the protocol settings of a workload; ports per protocol, TLS version and cipher suite, then Mutual authentication. Mutual authentication stays off, with a helper line saying why, until HTTPS is on; once on it shows the mode as `Field` choice cards, the trusted CA picker (search, expiry beside each certificate, Upload certificate in its footer opening a `Drawer`) and the revocation lists. Save checks a port per protocol and a CA, then deploys through the async-submit toast with Edit and Redeploy.
- UnsavedChanges (leave guard): the Settings tab carries the dirty dot, and switching tabs while dirty opens the Unsaved changes dialog.

## Settings that deploy

Some settings only take effect once the resource is deployed (cache settings of an application, protocols of a workload). For those:

- Say so in the save bar hint, e.g. "Saving deploys storefront to Production."
- On Save, validate first (field errors per the form-error rule), then run the deploy on its own: a loading toast while it runs, then the async-submit toast with **Edit** (back to the form, focus on its first field) and **Redeploy**. Never offer View deployments.
- Keep the form usable while it runs; the baseline moves to the saved values only when the deploy succeeds.
- Keep switches that depend on each other consistent in both directions, e.g. HTTP/3 turns HTTPS on and HTTPS off turns HTTP/3 and mutual authentication off.

## Related

- `shells/console` — the `ConsoleLayout` this page body renders in; a crumb that is a control (DeployableSettings' environment) is set by the page with `ConsoleLayout.Breadcrumbs` (the module and the resource as `items`, a `Select` with `kind="transparent"` and `size="small"` in its slot).
- `platform/create/single-page-create` — the create page that shares this field list.
- `platform/detail/attached-resources` — the Domains section body in DeployableSettings.
- `platform/delete/delete-with-confirmation` — the dialog behind the Danger zone action.
- `platform/settings/settings-form` — account settings that end with the same save band.
- `SaveBar` — the unsaved-changes band; see `skills/webkit-form`.
- `platform/states/form-error` — the section-scoped server error DataStream follows.
- `platform/dashboard/analytics-dashboard` (Metrics) — where the records a stream sends are counted.
- `useUnsavedChanges` — the dirty baseline and leave guard behind the save bar, the tab mark and the leave dialog.
- `platform/states/form-error` — the rule the changed-elsewhere notice follows.

## Variants

- `ProjectSettings` — primary (the code below)
- `DeployableSettings` — A deployable resource’s Settings tab, under the environment switcher the page sets as its control crumb with `ConsoleLayout.Breadcrumbs` and the Deploy action in the tab bar: General, the Domains table with the environment, policy and certificate of each domain, the collapsed Advanced settings band holding Deployment Settings, Protocol settings and Mutual authentication, and the Danger zone. The bar sits under the page here, outside the tab’s own scroll region.
- `PolicySettings` — A security policy’s Settings tab, with the Documentation action in the heading: General, Modules with DDoS Protection locked on, Debug rules and Status.
- `ResourceSettings` — The settings page of a first-level resource with no tabs, drawn from the same field list as its create page: here an access list at /access-lists/:id/settings, with its name under General and the type and entries under List settings. The entries field follows the selected type, and Save checks every field before it commits.
- `UnsavedChanges` — The policy Settings tab after Debug rules was switched on: the bar is up and the Settings tab carries the unsaved-changes dot. Discard restores the record and the bar leaves, Save holds its loading state and then leaves. Switching tabs while dirty asks first, through `useUnsavedChanges`: Keep editing, Discard changes, or Save changes and go.
- `Saving` — While the save request is in flight: Save shows its loading state and Discard is disabled.
- `DataStream` — The settings page of a data stream at /data-stream/:id/settings: General, Source (data source and the workloads it collects from), Sampling with its rate and the warning that sampling turns off the account's other streams, Template (a preset shown read-only in a CodeBlock, or a custom data set edited as JSON in a CodeEditor and checked on Save) and Destination, whose fields follow the connector (HTTP POST, Kafka, S3-compatible storage, log analytics). Save sends one test record; when the endpoint does not answer (in this demo, any host under .invalid) a danger Alert opens above Destination with Send test record, the URL turns invalid with its reason and takes the focus, and every other change stays.
- `StaleRecord` — The record was saved by someone else after the form opened, and the form holds edits: a warning `Alert` above the sections says it changed elsewhere, with Reload. Save asks before it overwrites (Go back / Overwrite and save); Reload replaces the edits with the saved values and the notice turns into Edits discarded with Undo.
- `DangerZone` — The settings page ending with the Danger zone band: a flush card row for Delete this project with a danger button. The confirmation dialog warns that it cannot be undone, links to the docs, and enables Delete only when the typed name matches; the name sits in a code chip with a copy button, and Delete holds its loading state while the request runs.
- `CacheSettings` — One cache setting of an application at /applications/:id/cache-settings/:name: General (the name rules pick it by), Browser cache and Edge cache (behavior `Select`, the maximum TTL `NumberInput` only while overriding, stale cache, large file optimization with its fragment size, tiered cache with its topology) and the collapsed Advanced cache key band (HTTP methods in a `MultiSelect`, query string and cookie behavior with their allowlist or denylist). Each dependent row is indented under its switch or behavior. An edge TTL under 60 seconds or an empty list marks the field invalid with its reason; Save deploys the application and reports through the async-submit toast with Edit and Redeploy.
- `Protocols` — The protocol settings of a workload: Protocols (HTTP ports, HTTPS support with its ports, HTTP/3 support with its ports, minimum TLS version and cipher suite) and Mutual authentication (off and explained until HTTPS is on; then the Enforce or Permissive mode as `Field` choice cards, the trusted CA certificate picker, a searchable `Select` with expiry beside each certificate and Upload certificate at its foot, which opens a `Drawer` that validates the name and the PEM and picks the new certificate, and the revocation lists). HTTP/3 turns HTTPS on, turning HTTPS off turns HTTP/3 and mutual authentication off. Save checks that each protocol has a port and that mutual authentication has a CA, then deploys through the async-submit toast with Edit and Redeploy.

Each variant is the same screen in another state: `get_pattern("platform/edit/edit-resource", { variant })`, or the file under `blocks/platform/edit/edit-resource/variants/`.

## Code (`ProjectSettings`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'variables', label: 'Variables' },
    { value: 'caching', label: 'Caching' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'rules', label: 'Rules' },
    { value: 'main-settings', label: 'Settings' }
  ]

  const activeTab = ref('main-settings')

  const defaultModules = [
    {
      key: 'compression',
      title: 'Compression',
      description: 'Compress responses with gzip and Brotli before they are sent.'
    },
    { key: 'caching', title: 'Caching', description: 'Customize advanced cache settings.' },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Expose device variables to build responsive rules.'
    },
    {
      key: 'custom_code',
      title: 'Custom Code',
      description: 'Run your own code on each request, close to the user.'
    },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Resize and convert images on the fly.'
    },
    {
      key: 'load_balancing',
      title: 'Load Balancing',
      description:
        'Balance traffic across your upstreams for reliability and network congestion control.'
    }
  ]

  const subscriptionModules = [
    {
      key: 'web_socket_proxy',
      title: 'WebSocket Proxy',
      description:
        'Enhance real-time data exchange between your project and its backends using the WebSocket protocol.'
    }
  ]

  type ResourceRecord = {
    name: string
    active: boolean
    modules: Record<string, boolean>
  }

  const record: ResourceRecord = {
    name: 'web-app',
    active: true,
    modules: {
      compression: true,
      caching: true,
      device_detection: false,
      custom_code: true,
      image_optimization: false,
      load_balancing: false,
      web_socket_proxy: false
    }
  }

  const form = reactive(structuredClone(record))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)

  const nameError = ref(false)
  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const save = () => {
    if (!form.name.trim()) {
      nameError.value = true
      nextTick(() => document.getElementById('resource-name')?.focus())
      return
    }
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }

  const discard = () => Object.assign(form, JSON.parse(baseline.value) as ResourceRecord)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <div class="relative flex min-h-0 flex-1 flex-col">
      <section class="min-h-0 flex-1">
        <div class="flex min-h-full flex-col">
          <form
            class="flex min-h-full flex-col"
            aria-label="Main settings"
            novalidate
            @submit.prevent="save"
          >
            <div
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
            >
              <PageHeader
                title="Settings"
                description="Core configuration for this project."
                size="small"
              />

              <fieldset
                class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
                :disabled="saving"
              >
                <legend class="sr-only">Main settings</legend>

                <SettingsSection
                  title="General"
                  hint="How this project is identified across the platform, and whether it is serving traffic."
                  anchor="general"
                >
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          title="Name"
                          description="A unique and descriptive name to identify the project."
                        >
                          <div class="flex w-full flex-col gap-(--spacing-xs)">
                            <Input
                              id="resource-name"
                              v-model="form.name"
                              size="large"
                              :disabled="saving"
                              class="w-full"
                              aria-label="Name"
                              :required="nameError"
                              :aria-describedby="nameError ? 'resource-name-message' : undefined"
                            />
                            <HelperText
                              v-if="nameError"
                              id="resource-name-message"
                              kind="required"
                              label="This field is required."
                            />
                          </div>
                        </SettingRow>
                        <SettingRow
                          title="Active"
                          description="When disabled, the project stops serving traffic."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Modules"
                  hint="The capabilities this project runs with, each of which can be toggled here."
                  anchor="modules"
                >
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          v-for="mod in defaultModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          kind="compact"
                        >
                          <Switch
                            v-model="form.modules[mod.key]"
                            :aria-label="mod.title"
                            :disabled="saving"
                          />
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Subscription modules"
                  hint="Paid add-ons that are activated with sales, not from this page."
                  anchor="subscription-modules"
                >
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          v-for="mod in subscriptionModules"
                          :key="mod.key"
                          :title="mod.title"
                          kind="compact"
                        >
                          <template #description>
                            {{ mod.description }}
                            <a
                              href="https://example.com/contact-sales"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                            >
                              Contact sales
                              <i
                                class="pi pi-external-link shrink-0 text-body-sm leading-none"
                                aria-hidden="true"
                              />
                            </a>
                          </template>
                          <Tooltip text="Contact sales to activate this module.">
                            <Switch
                              v-model="form.modules[mod.key]"
                              disabled
                              :aria-label="mod.title"
                            />
                          </Tooltip>
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsSection>
              </fieldset>
            </div>

            <Transition
              enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
              leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
              leave-to-class="translate-y-2 opacity-0"
            >
              <SaveBar v-if="dirty || saving">
                Project settings changed.
                <span class="text-(--text-muted)"
                  >Saving publishes them on the next deployment.</span
                >
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
          </form>
        </div>
      </section>
    </div>
  </div>
</template>
```
