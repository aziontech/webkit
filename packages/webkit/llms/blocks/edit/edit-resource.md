# EditResource (`edit/edit-resource`)

> The settings page of a resource, a page body for ConsoleLayout (the layout's breadcrumb names the resource): a small Settings page heading over stacked `SettingsGroup` bands in the form column, each a heading with an anchor-link button and a hint glyph over a flush `Card` of field rows. The commit band is not there at rest: on the first edit a zero-height sticky strip at the bottom of the scroll region slides up a full-bleed band with a top rule, an info glyph, the unsaved-changes label with an optional muted hint, and Discard beside Save (stacked under the label on small screens), and it leaves once Save lands or Discard restores the record. The account settings pages end with the same band. A resource with a tab bar renders it as its Settings tab; a first-level resource with no tabs renders it as its own `/<resource>/:id/settings` page. Variants cover a record changed elsewhere (warning `Alert` with Reload, overwrite confirmation), the Danger zone with a typed-name delete, and the leave guard from `useUnsavedChanges` with the dirty mark on the tab. Built from `PageHeader`, `PageTabs`, `SettingsGroup`, `SettingsRow`, `SaveBar`, `Tabs`, `Card`, `Item`, `Input`, `Select`, `MultiSelect`, `Switch`, `Textarea`, `RadioGroup` choice cards (`variant="card"`), `DataTable`, `Tag`, `Tooltip`, `Alert`, `ConfirmDialog`, `FieldDescription` and `Button`, with `useUnsavedChanges`.

- Surface: app
- Source: `blocks/edit/edit-resource/edit-resource.vue` in `@aziontech/webkit`
- MCP: `get_block("edit/edit-resource")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [CodeBlock](../../components/code-block.md), [CodeEditor](../../components/code-editor.md), [ConfirmDialog](../../components/confirm-dialog.md), [ConsoleLayout](../../components/console-layout.md), [DataTable](../../components/data-table.md), `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [Field](../../components/field.md), `FieldDescription`, `FieldError`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [Link](../../components/link.md), [MultiSelect](../../components/multi-select.md), [NumberInput](../../components/number-input.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PasswordInput](../../components/password-input.md), [RadioGroup](../../components/radio-group.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Switch](../../components/switch.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-unsaved-changes`
- Skills: `webkit-form`, `webkit-errors`, `webkit-layout`, `webkit-ux-heuristics`

## Asked as

settings page; resource settings; settings of one resource; resource settings page; settings tab; application settings; workload settings; firewall settings; edit settings; página de configurações; configurações do recurso; aba de configurações; save bar; unsaved changes bar; sticky save bar; discard and save; commit bar; barra de salvar; alterações não salvas; salvar alterações; edit resource; editar recurso; data stream; data stream settings; log streaming; stream destination; sampling; log template; configurações do data stream; envio de logs; streaming de logs; stale record; changed elsewhere; overwrite changes; conflict on save; danger zone; delete resource; type the name to confirm; zona de perigo; excluir recurso; alterado em outro lugar; leave page guard; unsaved changes dialog; cache settings; cache policy; browser cache; edge cache; tiered cache; configurações de cache; protocol settings; https ports; http/3; tls version; mutual authentication; mtls; autenticação mútua; waf settings; waf rule set; threat sensitivity; configurações do waf

The settings page of one existing resource. The user comes here to change how the resource is named, what it runs with and whether it is active, review the change, and commit it or throw it away. Every field sits in a labeled section of the form column, and one save band appears only once something has changed, so the page reads as the resource's current state until the user edits it. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the resource breadcrumb, the ⌘K palette and the `main`; the save band sticks to the bottom of the layout's scrolling region.

## When to use

- Use edit-resource for the Settings tab or settings page of one resource, with anchored sections and a save bar that appears after the first edit.
- A resource has a Settings tab (or, with no tabs, its own `/<resource>/:id/settings` page) with fields grouped into a few sections.
- Changes are reviewed together and committed in one save, with a way to discard them all.
- Some settings are fixed or paid and must be shown locked, with the reason beside them.

## When not to use

- Creating the resource for the first time: use `create/create-page`, which shares this field list.
- Account or organization settings outside one resource (profile, preferences, notifications): use `settings/settings-form`.
- A resource whose content is code or a document: use `edit/edit-function`.
- Deleting the resource: the Danger zone action opens `edit/edit-delete-dialog`.
- A short list of attached records inside a section: use `detail/detail-domains-card` as that section's body.

## Building blocks

### A. Resource tabs — `PageTabs`, `Tabs` (optional)

A full-bleed `PageTabs` with one `Tabs.Trigger` per tab, Settings last, in a `sticky top-0` wrapper on the canvas fill so it stays in view while the layout scrolls. A first-level resource with no tabs drops this bar and renders the page at its own settings route.

### B. Page heading — `PageHeader` (required)

A small `PageHeader` titled Settings with one sentence about what these settings cover. It sits at the top of the form column, inside the scrolling region.

### C. Settings sections — `SettingsGroup`, `Card`, `Item`, `SettingsRow`, `Input`, `FieldError`, `Switch` (required)

One `form` with a disabled-while-saving `fieldset` and a visually hidden legend. Each `SettingsGroup` has a title, a `hint` and an `anchor` for deep links, over a flush `Card :padded="false"` with an `Item.List` of `SettingsRow`s. Text values are large `Input`s; an empty Name flags on Save with a required `FieldError` and takes focus; on and off values are `Switch`es in compact rows. Sections run in a fixed order: General first, optional groups in the middle, Status or Danger zone last. See `skills/webkit-form`.

### D. Locked settings — `Tooltip`, `Switch`, `Link` (optional)

A setting the user cannot change here (a paid module, a module that is always on) keeps its row with a disabled `Switch` inside a `Tooltip` that says why, and a small `Link` beside the switch, in the control cell, to where it can be changed, e.g. Contact sales, opening in a new tab and named for the module ("Contact sales about WebSocket Proxy"). Keep the way out out of the description: `SettingsRow` clamps its description to two lines, so on a phone a link at the end of the sentence is cut off and the disabled switch is left with no way to turn it on.

### E. Save bar — `SaveBar`, `Button` (required)

Hidden at rest. On the first edit a `SaveBar` slides up at the bottom of the scroll region with the unsaved-changes label, an optional muted hint, and an outlined Discard beside a primary Save, both medium (stacked under the label on small screens). While saving, the fieldset is disabled, Save shows its loading state and Discard is disabled. The bar leaves when Save lands or when Discard restores the record. In ProjectSettings a failed save (`error`) keeps the edits and raises a `toast` error, "The project settings weren't saved.", with Retry.

### F. Conditional fields — `SettingsRow`, `Input`, `FieldError` (optional)

When one choice decides which fields apply (a connector, a scope, a template), the choice (a `Select` or `RadioGroup` choice cards (`variant="card"`)) comes first and the rows it unlocks follow it inside the same `Card`, entering with `animate-content-enter`. Hidden rows keep no value that Save sends. Credentials are `PasswordInput`s that cannot be read back after Save, and the row says so. In DataStream the workload scope is `RadioGroup` choice cards (`variant="card"`); the Sampling band appears only when the stream collects from every workload, and Sampling rate is a `NumberInput` with a `%` suffix.

### G. Template editor — `SettingsRow`, `FieldError` (optional)

A setting whose value is a document (a JSON data set) gets a stacked row, under the `Select` that picks the template. A preset is read-only: its document shows in a `CodeBlock` with Copy, and the row says how to edit (choose Custom template). A custom document is a `CodeEditor` (`language="json"`, a fixed `height`), checked on Save (`Write the data set as a JSON object.`); it passes `:loader="loadMonaco"` (the loader from the `code-editor` spec, with the JSON worker) so JSON is validated as you type, and keeps plain line numbers: `pad-line-numbers` is for full-page editors, not a fixed-height field in a form.

### H. Section warnings and server errors — `SettingsGroup`, `Button` (optional)

A setting with a side effect beyond this resource carries a warning `Alert` above its section's `Card` while it is on (`Saving a stream with sampling on turns off every other data stream in this account.`). A server rejection scoped to one section follows the state-form-validation rule (`state/state-form-validation`, SectionRejected): one danger `Alert` above that section that says what happened and that nothing else was lost, with the recovery action on it (`Send test record`); the field it concerns turns invalid with its own one-line reason and takes the focus. Never a toast, never a summary at the top of the page. Saving a settings page is not a build or deploy, so the state-async-submit toast with Edit and Redeploy does not apply here.

### I. Leave guard — `Tabs`, `SaveBar` (optional)

`useUnsavedChanges(() => form)` keeps the saved baseline: `isDirty` drives the save bar and the `dirty` mark on the Settings `Tabs.Trigger` (a dot after the label, "Unsaved changes" for screen readers), `commit()` moves the baseline after a save and `discard()` restores it. Leaving while dirty (another tab, another route through `onBeforeRouteLeave(() => confirmLeave())`, a reload) asks first: the composable warns on `beforeunload` and drives one `ConfirmDialog` bound with `v-bind="dialogProps"`, whose actions are Keep editing, Discard changes and, when `onSave` is given, Save changes, which saves and then leaves. See `skills/webkit-form`.

### J. Changed elsewhere — `Alert`, `ConfirmDialog`, `Button`, `SaveBar` (optional)

When the record was saved by someone else after the form opened, a warning `Alert` sits between the heading and the first section: a bold "Changed elsewhere." lead, one sentence that says nothing was lost and what Save will do, and a secondary Reload button in its action slot. Save does not overwrite silently: it opens a `ConfirmDialog` (kind `primary`) with Go back and Overwrite and save. Reload swaps the edits for the saved values and the notice becomes an info `Alert` "Edits discarded." with Undo, which brings the edits back. The save bar's hint and Discard label follow the notice ("Saving overwrites the version saved elsewhere.", "Discard and reload"). This is the state-form-validation rule (`state/state-form-validation`, SectionRejected) applied to an edit: one message above the form, the recovery action on it.

### K. Danger zone — `SettingsGroup`, `Card`, `SettingsRow`, `Button`, `Input` (optional)

The last section, titled Danger zone with the hint "Actions that cannot be undone.", holds one compact `SettingsRow` per irreversible action with a medium danger `Button` and a trash icon. The action opens a medium `ConfirmDialog`: a warning `Alert` that it cannot be reversed, one paragraph on what goes with it and a docs link (a plain anchor with the `text-link` class, since it sits inside the sentence), then the typed confirmation `ConfirmDialog` draws from `confirmation-phrase`: "Type `name` to confirm." over an `Input` labelled by it. The danger confirm button stays disabled until the typed name matches exactly (case-sensitive) and shows its loading state while the request runs; Enter in the input confirms. See `edit/edit-delete-dialog`.

### L. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

ProjectSettings takes the saved settings through props and emits the values on Save; it fetches nothing and saves nothing. `EditResourceProject` and `EditResourceProps` are exported from `edit-resource.vue`, and `sample.ts` holds the sample project the block renders when `resource` is left out. StaleRecord passes `defaultDraft` and `stale`, and DangerZone fills the `sections` slot; the other states are separate screens with their own fields.

| Prop           | Type                           | What it does                                                                                                                           |
| -------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `resource`     | `EditResourceProject`          | The saved settings; the form opens on them and Discard returns to them. A new value resets the form.                                   |
| `defaultDraft` | `Partial<EditResourceProject>` | Unsaved edits the form opens with on top of `resource`, so the save bar is up.                                                         |
| `stale`        | `EditResourceProject`          | The version saved elsewhere after the form opened: the Changed elsewhere notice, Reload with Undo, and the overwrite question on Save. |
| `loading`      | `boolean`                      | The save is in flight: the fieldset and Discard disable and Save spins. When it turns off with no `error`, the bar leaves.             |
| `error`        | `string`                       | Why the save failed, the description of the error toast with Retry; the edits stay.                                                    |
| `v-model:tab`  | `string`                       | The active page tab, `main-settings` by default; bind it to the route.                                                                 |

| Event     | Payload           | When                                                    |
| --------- | ----------------- | ------------------------------------------------------- |
| `submit`  | `(event, values)` | Save with a valid Name; `values` is the whole settings. |
| `discard` | `(event)`         | Discard; the form is already back on the saved values.  |

| Slot       | What it holds                                                                  |
| ---------- | ------------------------------------------------------------------------------ |
| `sections` | Sections after Subscription modules, inside the form, such as the Danger zone. |

To go live, render the block from a page that owns the request:

```vue
<script setup lang="ts">
  import EditResource, { type EditResourceProject } from './edit-resource.vue'

  const { data } = useProject()
  const { pending, error, run } = useSaveProject()
  const save = (_event: Event, values: EditResourceProject) => run(values)
</script>

<template>
  <EditResource
    v-if="data"
    :resource="data"
    :loading="pending"
    :error="error ? 'Check your connection and save again.' : ''"
    @submit="save"
  />
</template>
```

Then delete `sample.ts` and its import.

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
- Ask for the resource name before a delete, through `ConfirmDialog` `confirmation-phrase`.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

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
- **Danger zone:** section "Danger zone" with "Actions that cannot be undone."; row "Delete this project"; dialog "Delete project", "Once confirmed, this action can't be reversed.", "Type <name> to confirm."; buttons "Cancel" and "Delete project".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The form has an `aria-label` and its `fieldset` a visually hidden `legend` with the same words, e.g. "Main settings".
- Every `Input` and `Switch` has an `aria-label` matching its row title.
- A disabled `Switch` keeps its `Tooltip`, so keyboard and pointer users can still read why it is locked.
- External links open in a new tab with `rel="noopener noreferrer"` and an icon marked `aria-hidden="true"`.
- The save bar enters after the form in reading order and its motion respects reduced motion.
- An invalid field points at its `FieldError` through `aria-describedby`; on Save the first invalid field takes the focus.
- A section `Alert` is announced by `Alert` itself; its recovery `Button` is a real button inside it.
- The `CodeEditor` and the read-only `CodeBlock` are named after their row (`Data set`, `Copy the data set as JSON`).
- The dirty tab mark is `aria-hidden`; a visually hidden "Unsaved changes" joins the tab's accessible name, and under forced colors the dot paints in `CanvasText`.
- The leave dialog is a `ConfirmDialog`: focus moves into it, Escape and the close button count as Keep editing, and focus returns to the control that asked to leave.
- The changed-elsewhere notice sits in a polite live region and takes focus after Reload so the change of values is announced; both its actions are real buttons.
- The delete confirmation `Input` is labelled by the "Type … to confirm." sentence (`aria-labelledby`) and takes focus when the dialog opens.
- `⌘ S` (`Ctrl S` off Apple) saves while the `SaveBar` shows unsaved changes, the same as Save, and stops the browser's own save; with no changes it does nothing. Save carries `aria-keyshortcuts` and a `Kbd` keycap. Every variant with a `SaveBar` answers it the same way.

## States

- ProjectSettings: a project's Settings tab with General, Modules and Subscription modules from `resource` (the sample when left out); the save bar is hidden until an edit. Save emits `submit`; `loading` locks the fieldset and spins Save, and `error` set when it ends raises the error toast with Retry.
- DeployableSettings: a deployable resource's Settings tab with General, Domains, collapsed Advanced settings and the Danger zone, whose Delete resource opens the type-to-confirm `ConfirmDialog` of `edit/edit-delete-dialog`.
- PolicySettings: a security policy's Settings tab with General, Modules with one locked on, Debug rules and Status.
- WafSettings: a WAF rule set's Main Settings tab with General, Status (Active and the Blocking or Learning Mode `Select`) and Threats, one row per threat family with a Sensitivity `Select` beside its `Switch`; the Sensitivity is disabled while its threat is off, and Save confirms in a toast.
- ResourceSettings: a first-level resource with no tabs at its own settings route; Save checks every field before it commits.
- UnsavedChanges: after one edit; the save bar is up with Discard and Save.
- Saving: while the request is in flight; the fieldset is disabled, so no field can change under the save, Save is loading and Discard is disabled.
- DataStream: a data stream at its own settings route with General, Source, Sampling, Template and Destination; the destination fields follow the connector, Save sends one test record, and an endpoint that does not answer raises the section `Alert` of the state-form-validation rule.
- StaleRecord: the form holds edits and the record changed elsewhere; the warning notice with Reload is up, Save asks before overwriting, Reload turns the notice into Edits discarded with Undo.
- DangerZone: the settings end with the Danger zone; Delete project opens the typed-name confirmation, enabled only on a match, loading while the delete runs.
- CacheSettings: one cache setting of an application; General, Browser cache, Edge cache and the collapsed Advanced cache key. Rows that only apply under a switch or an override sit one level in (`SettingsRow` `level`). An edge TTL under 60 seconds and an empty allowlist or denylist are field errors with their reason, focused on Save. Save deploys and reports through the state-async-submit toast with Edit and Redeploy.
- Protocols: the protocol settings of a workload; ports per protocol, TLS version and cipher suite, then Mutual authentication. Mutual authentication stays off, with a helper line saying why, until HTTPS is on; once on it shows the mode as `Field` choice cards, the trusted CA picker (search, expiry beside each certificate, Upload certificate in its footer opening a `Drawer`) and the revocation lists. Save checks a port per protocol and a CA, then deploys through the state-async-submit toast with Edit and Redeploy.
- UnsavedChanges (leave guard): the Settings tab carries the dirty dot, and switching tabs while dirty opens the Unsaved changes dialog.

## Settings that deploy

Some settings only take effect once the resource is deployed (cache settings of an application, protocols of a workload). For those:

- Say so in the save bar hint, e.g. "Saving deploys storefront to Production."
- On Save, validate first (field errors per the state-form-validation rule), then run the deploy on its own: a loading toast while it runs, then the state-async-submit toast with **Edit** (back to the form, focus on its first field) and **Redeploy**. Never offer View deployments.
- Keep the form usable while it runs; the baseline moves to the saved values only when the deploy succeeds.
- Keep switches that depend on each other consistent in both directions, e.g. HTTP/3 turns HTTPS on and HTTPS off turns HTTP/3 and mutual authentication off.

## Related

- `shell/shell-console` — the `ConsoleLayout` this page body renders in; a crumb that is a control (DeployableSettings' environment) is set by the page with `ConsoleLayout.Breadcrumb` (the module and the resource as `items`, a `Select` with `variant="ghost"` and `size="small"` in its slot).
- `create/create-page` — the create page that shares this field list.
- `detail/detail-domains-card` — the Domains section body in DeployableSettings.
- `edit/edit-delete-dialog` — the dialog behind the Danger zone action.
- `settings/settings-form` — account settings that end with the same save band.
- `SaveBar` — the unsaved-changes band; see `skills/webkit-form`.
- `state/state-form-validation` (SectionRejected) — the section-scoped server error DataStream and the changed-elsewhere notice follow.
- `dashboard/dashboard-analytics` (Metrics) — where the records a stream sends are counted.
- `useUnsavedChanges` — the dirty baseline and leave guard behind the save bar, the tab mark and the leave dialog.

## Variants

- `ProjectSettings` — primary (the code below)
- `DeployableSettings` — A deployable resource’s Settings tab, under the environment switcher the page sets as its control crumb with `ConsoleLayout.Breadcrumb` and the Deploy action in the tab bar: General, the Domains table with the environment, policy and certificate of each domain, the collapsed Advanced settings band holding Deployment Settings, Protocol settings and Mutual authentication, and the Danger zone. The bar sits under the page here, outside the tab’s own scroll region.
- `PolicySettings` — A security policy’s Settings tab, with the Documentation action in the heading: General, Modules with DDoS Protection locked on, Debug rules and Status.
- `WafSettings` — A WAF rule set's Main Settings tab: General with the Name, Status with Active and a Mode Select (Blocking or Learning), and a Threats section with one row per threat family, each a Sensitivity Select beside a Switch; turning a threat off disables its Sensitivity. Any change raises the SaveBar, and Save confirms in a toast.
- `ResourceSettings` — The settings page of a first-level resource with no tabs, drawn from the same field list as its create page: here an access list at /access-lists/:id/settings, with its name under General and the type and entries under List settings. The entries field follows the selected type, and Save checks every field before it commits.
- `UnsavedChanges` — The policy Settings tab after Debug rules was switched on: the bar is up and the Settings tab carries the unsaved-changes dot. Discard restores the record and the bar leaves, Save holds its loading state and then leaves. Switching tabs while dirty asks first, through `useUnsavedChanges`: Keep editing, Discard changes, or Save changes and go.
- `Saving` — While the save request is in flight: Save shows its loading state and Discard is disabled.
- `DataStream` — The settings page of a data stream at /data-stream/:id/settings: General, Source (data source and the workloads it collects from), Sampling with its rate and the warning that sampling turns off the account's other streams, Template (a preset shown read-only in a CodeBlock, or a custom data set edited as JSON in a CodeEditor and checked on Save) and Destination, whose fields follow the connector (HTTP POST, Kafka, S3-compatible storage, log analytics). Save sends one test record; when the endpoint does not answer (in this demo, any host under .invalid) a danger Alert opens above Destination with Send test record, the URL turns invalid with its reason and takes the focus, and every other change stays.
- `StaleRecord` — The record was saved by someone else after the form opened, and the form holds edits: a warning `Alert` above the sections says it changed elsewhere, with Reload. Save asks before it overwrites (Go back / Overwrite and save); Reload replaces the edits with the saved values and the notice turns into Edits discarded with Undo.
- `DangerZone` — The settings page ending with the Danger zone band: a flush card row for Delete this project with a danger button. The confirmation dialog warns that it cannot be undone, links to the docs, and enables Delete only when the typed name matches exactly (`ConfirmDialog` `confirmation-phrase`), and Delete holds its loading state while the request runs.
- `CacheSettings` — One cache setting of an application at /applications/:id/cache-settings/:name: General (the name rules pick it by), Browser cache and Edge cache (behavior `Select`, the maximum TTL `NumberInput` only while overriding, stale cache, large file optimization with its fragment size, tiered cache with its topology) and the collapsed Advanced cache key band (HTTP methods in a `MultiSelect`, query string and cookie behavior with their allowlist or denylist). Each dependent row is indented under its switch or behavior. An edge TTL under 60 seconds or an empty list marks the field invalid with its reason; Save deploys the application and reports through the state-async-submit toast with Edit and Redeploy.
- `Protocols` — The protocol settings of a workload: Protocols (HTTP ports, HTTPS support with its ports, HTTP/3 support with its ports, minimum TLS version and cipher suite) and Mutual authentication (off and explained until HTTPS is on; then the Enforce or Permissive mode as `Field` choice cards, the trusted CA certificate picker, a searchable `Select` with expiry beside each certificate and Upload certificate at its foot, which opens a `Drawer` that validates the name and the PEM and picks the new certificate, and the revocation lists). HTTP/3 turns HTTPS on, turning HTTPS off turns HTTP/3 and mutual authentication off. Save checks that each protocol has a port and that mutual authentication has a CA, then deploys through the state-async-submit toast with Edit and Redeploy.

Each variant is the same screen in another state: `get_block("edit/edit-resource", { variant })`, or the file under `blocks/edit/edit-resource/variants/`.

## Code (`ProjectSettings`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import SettingsSaveBar from './parts/settings-save-bar.vue'
  import { sampleProject } from './sample'

  /** The saved project settings, and the values a save sends. */
  export interface EditResourceProject {
    /** The project name. */
    name: string
    /** Whether the project serves traffic. */
    active: boolean
    /** Which modules are on, by module key. */
    modules: Record<string, boolean>
  }

  export interface EditResourceProps {
    /** The saved settings; the form opens on them and Discard returns to them. Left out, the sample renders. */
    resource?: EditResourceProject
    /** Unsaved edits the form opens with on top of the resource, so it starts dirty. */
    defaultDraft?: Partial<EditResourceProject>
    /** The version saved elsewhere after the form opened: a notice offers Reload, and Save asks before it overwrites. */
    stale?: EditResourceProject
    /** The save is in flight: the fieldset and Discard lock and Save spins. */
    loading?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<EditResourceProps>(), {
    resource: undefined,
    defaultDraft: () => ({}),
    stale: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: EditResourceProject]
    discard: [event: MouseEvent]
  }>()

  const activeTab = defineModel<string>('tab', { default: 'main-settings' })

  defineSlots<{
    /** Sections after Subscription modules, inside the form, such as the Danger zone. */
    sections(): unknown
  }>()

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

  const copyOf = (project: EditResourceProject) =>
    JSON.parse(JSON.stringify(project)) as EditResourceProject
  const record = computed<EditResourceProject>(() => props.resource ?? sampleProject)
  const form = reactive<EditResourceProject>(copyOf(record.value))
  const saving = computed(() => props.loading)
  const baseline = ref(JSON.stringify(record.value))
  Object.assign(form, copyOf({ ...record.value, ...props.defaultDraft }))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const SAVE_TOAST = 'resource-save'

  const freshness = ref<'conflict' | 'reloaded' | null>(props.stale ? 'conflict' : null)
  const overwriteOpen = ref(false)
  const noticeEl = ref<{ $el?: HTMLElement } | null>(null)
  let editsBeforeReload: EditResourceProject | null = null

  watch(
    () => props.stale,
    (next) => {
      freshness.value = next ? 'conflict' : null
      editsBeforeReload = null
    }
  )

  const reload = () => {
    if (!props.stale) return
    editsBeforeReload = copyOf(form)
    baseline.value = JSON.stringify(props.stale)
    Object.assign(form, copyOf(props.stale))
    freshness.value = 'reloaded'
    nextTick(() => noticeEl.value?.$el?.focus?.())
  }

  const undoReload = () => {
    if (editsBeforeReload) Object.assign(form, editsBeforeReload)
    editsBeforeReload = null
    freshness.value = 'conflict'
  }

  watch(
    () => JSON.stringify(record.value),
    (next) => {
      Object.assign(form, copyOf(record.value))
      baseline.value = next
    }
  )

  const nameError = ref(false)
  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const save = async (event: Event) => {
    if (saving.value) return
    if (!form.name.trim()) {
      nameError.value = true
      nextTick(() => document.getElementById('resource-name')?.focus())
      return
    }
    if (freshness.value === 'conflict') {
      overwriteOpen.value = true
      return
    }
    submit(event)
  }

  const submit = async (event: Event) => {
    toast.dismiss(SAVE_TOAST)
    emit('submit', event, copyOf(form))
    await nextTick()
    if (props.loading || props.error) return
    baseline.value = JSON.stringify(form)
    freshness.value = null
  }

  const overwrite = (event: MouseEvent) => {
    overwriteOpen.value = false
    submit(event)
  }

  const showFailure = () => {
    toast.error("The project settings weren't saved.", {
      id: SAVE_TOAST,
      description: props.error,
      action: { label: 'Retry', onClick: (event: MouseEvent) => save(event) }
    })
  }

  onMounted(() => {
    if (props.error) showFailure()
  })

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now) return
      if (props.error) {
        showFailure()
        return
      }
      baseline.value = JSON.stringify(form)
      freshness.value = null
    }
  )

  const discard = (event: MouseEvent) => {
    if (freshness.value === 'conflict') {
      reload()
      return
    }
    Object.assign(form, JSON.parse(baseline.value) as EditResourceProject)
    freshness.value = null
    emit('discard', event)
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
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

              <div
                v-if="stale"
                class="mt-(--layout-section-gap)"
                aria-live="polite"
              >
                <Alert
                  v-if="freshness === 'conflict'"
                  key="conflict"
                  ref="noticeEl"
                  severity="warning"
                  data-testid="stale-record-notice"
                >
                  <strong class="font-medium">Changed elsewhere.</strong>
                  This project was saved by someone else after you opened it. Reload to see their
                  values, or keep editing and confirm the overwrite when you save.
                  <template #actions>
                    <Button
                      type="button"
                      label="Reload"
                      variant="secondary"
                      size="medium"
                      icon="az az-refresh"
                      :disabled="saving"
                      @click="reload"
                    />
                  </template>
                </Alert>
                <Alert
                  v-else-if="freshness === 'reloaded'"
                  key="reloaded"
                  ref="noticeEl"
                  severity="info"
                  data-testid="stale-record-reloaded"
                >
                  <strong class="font-medium">Edits discarded.</strong>
                  The form now shows the values saved elsewhere. Undo brings your edits back.
                  <template #actions>
                    <Button
                      type="button"
                      label="Undo"
                      variant="secondary"
                      size="medium"
                      @click="undoReload"
                    />
                  </template>
                </Alert>
              </div>

              <fieldset
                :data-stale="stale ? '' : null"
                class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0 data-[stale]:mt-(--spacing-lg)"
                :disabled="saving"
              >
                <legend class="sr-only">Main settings</legend>

                <SettingsGroup
                  label="General"
                  hint="How this project is identified across the platform, and whether it is serving traffic."
                  anchor="general"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
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
                              required
                              :invalid="nameError"
                              :aria-describedby="nameError ? 'resource-name-message' : undefined"
                            />
                            <FieldError
                              v-if="nameError"
                              id="resource-name-message"
                              >This field is required.</FieldError
                            >
                          </div>
                        </SettingsRow>
                        <SettingsRow
                          title="Active"
                          description="When disabled, the project stops serving traffic."
                          variant="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Modules"
                  hint="The capabilities this project runs with, each of which can be toggled here."
                  anchor="modules"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          v-for="mod in defaultModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          variant="compact"
                        >
                          <Switch
                            v-model="form.modules[mod.key]"
                            :aria-label="mod.title"
                            :disabled="saving"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Subscription modules"
                  hint="Paid add-ons that are activated with sales, not from this page."
                  anchor="subscription-modules"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          v-for="mod in subscriptionModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          variant="compact"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Link
                              label="Contact sales"
                              href="https://example.com/contact-sales"
                              target="_blank"
                              size="small"
                              :aria-label="`Contact sales about ${mod.title}`"
                            />
                            <Tooltip content="Contact sales to activate this module.">
                              <Switch
                                v-model="form.modules[mod.key]"
                                disabled
                                :aria-label="mod.title"
                              />
                            </Tooltip>
                          </div>
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <slot name="sections" />
              </fieldset>
            </div>

            <SettingsSaveBar
              :visible="dirty || saving"
              :saving="saving"
              :discard-label="freshness === 'conflict' ? 'Discard and reload' : 'Discard'"
              @save="save"
              @discard="discard"
            >
              Project settings changed.
              <span
                v-if="freshness === 'conflict'"
                class="text-(--text-muted)"
                >Saving overwrites the version saved elsewhere.</span
              >
              <span
                v-else
                class="text-(--text-muted)"
                >Saving publishes them on the next deployment.</span
              >
            </SettingsSaveBar>
          </form>

          <ConfirmDialog
            v-model:open="overwriteOpen"
            title="Overwrite changes made elsewhere?"
            description="This project was saved elsewhere after you opened it. Saving replaces that change with your edits, and it can't be recovered afterwards."
            confirm-label="Overwrite and save"
            cancel-label="Go back"
            variant="primary"
            size="small"
            @confirm="overwrite"
          />
        </div>
      </section>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { EditResourceProject } from './edit-resource.vue'
import type { PolicyModuleField, PolicySettingsRecord } from './parts/policy-groups.vue'

export const sampleProject: EditResourceProject = {
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

export const sampleProjectDraft: Partial<EditResourceProject> = {
  modules: { ...sampleProject.modules, device_detection: true }
}

export const sampleStaleProject: EditResourceProject = {
  ...sampleProject,
  modules: { ...sampleProject.modules, image_optimization: true }
}

export const samplePolicyTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'rules', label: 'Rules' },
  { value: 'main-settings', label: 'Settings' }
]

export const samplePolicyModules: PolicyModuleField[] = [
  {
    key: 'ddos',
    title: 'DDoS Protection',
    description: 'Absorbs volumetric attacks at the network layer.',
    locked: true
  },
  {
    key: 'request-inspection',
    title: 'Request Inspection',
    description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
  },
  {
    key: 'ip-blocking',
    title: 'IP Blocking',
    description: 'Blocks traffic by country, ASN or IP range using access lists.'
  },
  {
    key: 'bot-protection',
    title: 'Bot Protection',
    description: 'Scores automated traffic and challenges the requests that fail.'
  },
  {
    key: 'custom-code',
    title: 'Custom Code',
    description: 'Runs your own code inside the policy, before the request is served.'
  }
]

export const samplePolicy: PolicySettingsRecord = {
  name: 'production-policy',
  active: true,
  debugRules: false,
  modules: ['ddos', 'request-inspection', 'ip-blocking', 'bot-protection']
}
```

## `use-settings-draft.ts`

```ts
import { computed, type ComputedRef, onScopeDispose, reactive, readonly, type Ref, ref } from 'vue'

export interface UseSettingsDraftOptions<T> {
  /** Unsaved edits the form opens with on top of the record, so it starts dirty. */
  draft?: Partial<T>
  /** Opens with the save already in flight. */
  saving?: boolean
  /** How long the sample save takes, in milliseconds. */
  delay?: number
  /** Checks the form before a save; false stops it. */
  validate?: () => boolean
  /** Runs when the save request starts. */
  onStart?: () => void
  /** Runs once the save landed and the form is the new baseline. */
  onSaved?: () => void
}

export interface UseSettingsDraftReturn<T> {
  /** The editable copy of the record. */
  form: T
  /** The save is in flight. */
  saving: Readonly<Ref<boolean>>
  /** The form differs from the last saved record. */
  dirty: ComputedRef<boolean>
  /** Validates, then saves. */
  save: () => void
  /** Saves again without validating, as a Retry or Redeploy action does. */
  commit: () => void
  /** Puts the last saved record back. */
  discard: () => void
}

export function useSettingsDraft<T extends object>(
  record: T,
  options: UseSettingsDraftOptions<T> = {}
): UseSettingsDraftReturn<T> {
  const form = reactive(structuredClone(record)) as T
  const baseline = ref(JSON.stringify(record))
  Object.assign(form, options.draft)
  const saving = ref(options.saving ?? false)
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  let timer: ReturnType<typeof setTimeout> | undefined

  const commit = () => {
    options.onStart?.()
    clearTimeout(timer)
    timer = setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
      options.onSaved?.()
    }, options.delay ?? 900)
  }

  const save = () => {
    if (options.validate && !options.validate()) return
    saving.value = true
    commit()
  }

  const discard = () => Object.assign(form, JSON.parse(baseline.value) as T)

  onScopeDispose(() => clearTimeout(timer))

  return { form, saving: readonly(saving), dirty, save, commit, discard }
}
```

## `use-deploy-on-save.ts`

```ts
import { toast } from '@aziontech/webkit/toast'
import { type ComputedRef, nextTick, onScopeDispose, reactive, type Ref } from 'vue'

import { useSettingsDraft } from './use-settings-draft'

/** What is wrong with one field, shown under it. */
export interface FieldProblem {
  /** Whether the value is missing, malformed, or only needs a hint. */
  type: 'helper' | 'invalid' | 'required'
  /** The sentence under the field. */
  message: string
}

/** The problems of a form, by field key. */
export type FieldProblems = Record<string, FieldProblem | undefined>

/** The title and description of a toast. */
export interface DeployToastText {
  /** The toast title. */
  title: string
  /** The sentence under the title. */
  description: string
}

export interface UseDeployOnSaveOptions {
  /** The id of the toast that follows the deployment. */
  toastId: string
  /** Prefix of the field ids: a field is `<prefix>-<key>`. */
  fieldPrefix: string
  /** The field keys in reading order; the first invalid one takes focus, and Edit returns to the first. */
  fieldOrder: string[]
  /** Records every problem of the form in the given map. */
  check: (problems: FieldProblems) => void
  /** The toast while the deployment runs. */
  loading: () => DeployToastText
  /** The toast once the deployment is live. */
  success: () => DeployToastText
}

export interface UseDeployOnSaveReturn<T> {
  /** The editable copy of the record. */
  form: T
  /** The deployment is in flight. */
  saving: Readonly<Ref<boolean>>
  /** The form differs from the deployed record. */
  dirty: ComputedRef<boolean>
  /** The problems the last save found, by field key. */
  errors: FieldProblems
  /** Drops the problem of one field once it is edited. */
  clear: (key: string) => void
  /** Validates, then deploys. */
  save: () => void
  /** Puts the deployed record back and drops every problem. */
  discard: () => void
}

export function useDeployOnSave<T extends object>(
  record: T,
  options: UseDeployOnSaveOptions
): UseDeployOnSaveReturn<T> {
  const errors = reactive<FieldProblems>({})
  const focusField = (key: string) =>
    nextTick(() => document.getElementById(`${options.fieldPrefix}-${key}`)?.focus())

  const clear = (key: string) => {
    delete errors[key]
  }
  const clearAll = () => Object.keys(errors).forEach(clear)

  const validate = () => {
    clearAll()
    options.check(errors)
    const first = options.fieldOrder.find((key) => errors[key])
    if (first) focusField(first)
    return Object.keys(errors).length === 0
  }

  const editAgain = () => {
    toast.dismiss(options.toastId)
    focusField(options.fieldOrder[0])
  }

  const draft = useSettingsDraft(record, {
    delay: 1200,
    validate,
    onStart: () => {
      const { title, description } = options.loading()
      toast.loading(title, { id: options.toastId, description })
    },
    onSaved: () => {
      const { title, description } = options.success()
      toast.success(title, {
        id: options.toastId,
        description,
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: editAgain },
          { label: 'Redeploy', onClick: draft.commit }
        ]
      })
    }
  })

  const discard = () => {
    draft.discard()
    clearAll()
  }

  onScopeDispose(() => toast.dismiss(options.toastId))

  return {
    form: draft.form,
    saving: draft.saving,
    dirty: draft.dirty,
    errors,
    clear,
    save: draft.save,
    discard
  }
}
```

## `parts/settings-save-bar.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'

  export interface SettingsSaveBarProps {
    /** Whether the bar is up: the form holds edits or a save is in flight. */
    visible?: boolean
    /** The save is in flight: Discard locks and Save spins. */
    saving?: boolean
    /** Label of the Discard button. */
    discardLabel?: string
  }

  const props = withDefaults(defineProps<SettingsSaveBarProps>(), {
    visible: false,
    saving: false,
    discardLabel: 'Discard'
  })

  const emit = defineEmits<{
    save: [event: Event]
    discard: [event: MouseEvent]
  }>()

  defineSlots<{
    /** The status sentence, such as You have unsaved changes. */
    default(): unknown
  }>()

  const onShortcut = (event: KeyboardEvent) => {
    if (!props.saving) emit('save', event)
  }
</script>

<template>
  <Transition
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="translate-y-2 opacity-0"
  >
    <SaveBar
      v-if="visible"
      @save="onShortcut"
    >
      <slot />
      <template #actions>
        <Button
          type="button"
          :label="discardLabel"
          variant="outline"
          size="medium"
          :disabled="saving"
          @click="(event: MouseEvent) => emit('discard', event)"
        />
        <Button
          variant="primary"
          size="medium"
          :loading="saving"
          @click="(event: MouseEvent) => emit('save', event)"
          aria-keyshortcuts="Meta+S Control+S"
        >
          Save
          <Kbd
            meta
            size="small"
            aria-hidden="true"
            >S</Kbd
          >
        </Button>
      </template>
    </SaveBar>
  </Transition>
</template>
```

## `parts/settings-tab-page.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'

  import SettingsSaveBar from './settings-save-bar.vue'

  export interface SettingsTabPageProps {
    /** The tabs of the resource; the settings page is one of them. */
    tabs: { value: string; label: string }[]
    /** The page heading. */
    title: string
    /** The sentence under the heading. */
    description: string
    /** Where the Documentation button leads. */
    docsHref: string
    /** The form holds edits. */
    dirty?: boolean
    /** The save is in flight. */
    saving?: boolean
    /** The tab that carries the unsaved-changes dot while the form holds edits. */
    dirtyTab?: string
  }

  withDefaults(defineProps<SettingsTabPageProps>(), {
    dirty: false,
    saving: false,
    dirtyTab: ''
  })

  const emit = defineEmits<{
    save: [event: Event]
    discard: [event: MouseEvent]
  }>()

  const activeTab = defineModel<string>('tab', { default: 'main-settings' })

  defineSlots<{
    /** The settings groups. */
    default(): unknown
    /** The sentence of the save bar. */
    message(): unknown
    /** Dialogs the page opens, after the save bar. */
    dialogs(): unknown
  }>()
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
          :dirty="dirty && tab.value === dirtyTab"
        />
      </PageTabs>
    </div>

    <section class="min-h-0 flex-1">
      <div class="flex min-h-full flex-col">
        <div class="flex min-w-0 flex-1 flex-col">
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col pb-0">
            <PageHeader
              :title="title"
              :description="description"
              size="small"
            >
              <template #actions>
                <Button
                  label="Documentation"
                  icon="az az-book"
                  variant="outline"
                  :href="docsHref"
                  target="_blank"
                  size="medium"
                />
              </template>
            </PageHeader>

            <section
              class="layout-section-start flex min-w-0 flex-1 flex-col pb-(--layout-boundary-end)"
            >
              <slot />
            </section>
          </div>

          <SettingsSaveBar
            :visible="dirty || saving"
            :saving="saving"
            @save="(event) => emit('save', event)"
            @discard="(event) => emit('discard', event)"
          >
            <slot name="message" />
          </SettingsSaveBar>

          <slot name="dialogs" />
        </div>
      </div>
    </section>
  </div>
</template>
```

## `parts/policy-groups.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** The saved settings of a security policy. */
  export interface PolicySettingsRecord {
    /** The policy name. */
    name: string
    /** Whether the policy evaluates rules. */
    active: boolean
    /** Whether the rules that ran are logged for each request. */
    debugRules: boolean
    /** The keys of the modules that are on, in module order. */
    modules: string[]
  }

  /** One module row of the policy. */
  export interface PolicyModuleField {
    /** The key in the record's modules. */
    key: string
    /** The row title. */
    title: string
    /** The sentence under the title. */
    description: string
    /** Always on: the switch is locked and explains why. */
    locked?: boolean
  }

  export interface PolicyGroupsProps {
    /** The module rows. */
    modules: PolicyModuleField[]
    /** The name failed validation: the field is marked and the message shows. */
    nameInvalid?: boolean
    /** Locks the name field while a save is in flight. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<PolicyGroupsProps>(), {
    nameInvalid: false,
    disabled: false
  })

  const name = defineModel<string>('name', { required: true })
  const active = defineModel<boolean>('active', { required: true })
  const debugRules = defineModel<boolean>('debugRules', { required: true })
  const selectedKeys = defineModel<string[]>('selectedKeys', { required: true })

  const setModule = (key: string, on: boolean) => {
    selectedKeys.value = props.modules
      .map((field) => field.key)
      .filter((fieldKey) => (fieldKey === key ? on : selectedKeys.value.includes(fieldKey)))
  }
</script>

<template>
  <SettingsGroup label="General">
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Name"
            description="Give a unique and descriptive name to identify this policy."
          >
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Input
                id="resource-name"
                v-model="name"
                size="large"
                :disabled="disabled"
                class="w-full"
                aria-label="Name"
                autocomplete="off"
                required
                :invalid="nameInvalid"
                :aria-describedby="nameInvalid ? 'resource-name-message' : undefined"
              />
              <FieldError
                v-if="nameInvalid"
                id="resource-name-message"
                >This field is required.</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow
            title="Project"
            description="The project this policy runs in front of."
            variant="compact"
          >
            <span class="text-body-md text-(--text-default)">web-app</span>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>

  <SettingsGroup
    label="Modules"
    hint="A module is what makes a rule act: a rule can only apply a capability that is switched on here."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            v-for="field in modules"
            :key="field.key"
            :title="field.title"
            :description="field.description"
            variant="compact"
          >
            <Tooltip
              v-if="field.locked"
              content="DDoS Protection is always on, on every policy."
            >
              <span class="flex">
                <Switch
                  :model-value="true"
                  :aria-label="field.title"
                  disabled
                />
              </span>
            </Tooltip>
            <Switch
              v-else
              :model-value="selectedKeys.includes(field.key)"
              @update:model-value="(on) => setModule(field.key, on)"
              :aria-label="field.title"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>

  <SettingsGroup
    label="Debug rules"
    hint="Query the logged executions from the event log or the logs API."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Active"
            description="Logs which rules ran for a request, under the trace field of each logged event."
            variant="compact"
          >
            <Switch
              v-model="debugRules"
              aria-label="Debug rules"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>

  <SettingsGroup label="Status">
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Active"
            description="An inactive policy stops evaluating rules."
            variant="compact"
          >
            <Switch
              v-model="active"
              aria-label="Active"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/policy-settings-page.vue`

```ts
<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue'

  import { samplePolicy, samplePolicyModules, samplePolicyTabs } from '../sample'
  import { useSettingsDraft } from '../use-settings-draft'
  import PolicyGroups, { type PolicySettingsRecord } from './policy-groups.vue'
  import SettingsTabPage from './settings-tab-page.vue'

  export interface PolicySettingsPageProps {
    /** Unsaved edits the form opens with, so the save bar is up. */
    defaultDraft?: Partial<PolicySettingsRecord>
    /** Opens with the save in flight: the fieldset and Discard lock and Save spins. */
    defaultSaving?: boolean
  }

  const props = withDefaults(defineProps<PolicySettingsPageProps>(), {
    defaultDraft: () => ({}),
    defaultSaving: false
  })

  const activeTab = ref('main-settings')
  const nameError = ref(false)

  const validate = () => {
    if (form.name.trim()) return true
    nameError.value = true
    nextTick(() => document.getElementById('resource-name')?.focus())
    return false
  }

  const { form, saving, dirty, save, discard } = useSettingsDraft(samplePolicy, {
    draft: props.defaultDraft,
    saving: props.defaultSaving,
    validate
  })

  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )
</script>

<template>
  <SettingsTabPage
    v-model:tab="activeTab"
    :tabs="samplePolicyTabs"
    title="Settings"
    description="Core configuration for this policy."
    docs-href="https://example.com/docs/security-policies"
    :dirty="dirty"
    :saving="saving"
    @save="save"
    @discard="discard"
  >
    <fieldset
      v-if="defaultSaving"
      class="m-0 flex min-w-0 flex-col border-0 p-0"
      :disabled="saving"
    >
      <legend class="sr-only">Settings</legend>
      <PolicyGroups
        v-model:name="form.name"
        v-model:active="form.active"
        v-model:debug-rules="form.debugRules"
        v-model:selected-keys="form.modules"
        :modules="samplePolicyModules"
        :name-invalid="nameError"
        :disabled="saving"
      />
    </fieldset>
    <PolicyGroups
      v-else
      v-model:name="form.name"
      v-model:active="form.active"
      v-model:debug-rules="form.debugRules"
      v-model:selected-keys="form.modules"
      :modules="samplePolicyModules"
      :name-invalid="nameError"
    />
    <template #message> You have unsaved changes. </template>
  </SettingsTabPage>
</template>
```
