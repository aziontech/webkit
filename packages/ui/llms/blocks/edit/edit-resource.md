# EditResource (`edit/edit-resource`)

> The settings page of a resource, a page body for ConsoleLayout (the layout's breadcrumb names the resource): a small Settings page heading over stacked `SettingsGroup` bands in the form column, each a heading with an anchor-link button and a hint glyph over a flush `Card` of field rows. The commit band is not there at rest: on the first edit a zero-height sticky strip at the bottom of the scroll region slides up a full-bleed band with a top rule, an info glyph, the unsaved-changes label with an optional muted hint, and Discard beside Save (stacked under the label on small screens), and it leaves once Save lands or Discard restores the record. The account settings pages end with the same band. A resource with a tab bar renders it as its Settings tab; a first-level resource with no tabs renders it as its own `/<resource>/:id/settings` page. Variants cover a record changed elsewhere (warning `Alert` with Reload, overwrite confirmation), the Danger zone with a typed-name delete, and the leave guard from `useUnsavedChanges` with the dirty mark on the tab. Built from `PageHeader`, `PageTabs`, `SettingsGroup`, `SettingsRow`, `SaveBar`, `Tabs`, `Card`, `Item`, `Input`, `Select`, `MultiSelect`, `Switch`, `Textarea`, `RadioGroup` choice cards (`variant="card"`), `DataTable`, `Tag`, `Tooltip`, `Alert`, `ConfirmDialog`, `FieldDescription` and `Button`, with `useUnsavedChanges`.

- Surface: app
- Source: `blocks/edit/edit-resource/edit-resource.vue` in `@aziontech/webkit`
- MCP: `get_block("edit/edit-resource")`
- Components: [Alert](../../components/alert.md), [AttributeEditor](../../components/attribute-editor.md), [Button](../../components/button.md), [Card](../../components/card.md), [CodeBlock](../../components/code-block.md), [CodeEditor](../../components/code-editor.md), [ConfirmDialog](../../components/confirm-dialog.md), [ConsoleLayout](../../components/console-layout.md), [DataTable](../../components/data-table.md), `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [Field](../../components/field.md), `FieldDescription`, `FieldError`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [Link](../../components/link.md), [MultiSelect](../../components/multi-select.md), [NumberInput](../../components/number-input.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PasswordInput](../../components/password-input.md), [RadioGroup](../../components/radio-group.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Switch](../../components/switch.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-locale`, `use-unsaved-changes`, `utils/focus-invalid`
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

One `form` with a `fieldset` and a visually hidden legend; while saving, every field turns read-only. Each `SettingsGroup` has a title, a `hint` and an `anchor` for deep links, over a flush `Card :padded="false"` with an `Item.List` of `SettingsRow`s. Text values are large `Input`s; an empty Name flags on Save with a required `FieldError` and takes focus; on and off values are `Switch`es in compact rows. Sections run in a fixed order: General first, optional groups in the middle, Status or Danger zone last. Every state with a save bar runs through it (`useSettingsDraft` builds on `useUnsavedChanges`), and `SettingsSaveBar` renders the leave dialog when it is handed the guard, so no copy hand-rolls its own dirty check. See `skills/webkit-form`.

### D. Locked settings — `Tooltip`, `Switch`, `Link` (optional)

A setting the user cannot change here (a paid module, a module that is always on) keeps its row with a disabled `Switch` inside a `Tooltip` that says why, and a small `Link` beside the switch, in the control cell, to where it can be changed, e.g. Contact sales, opening in a new tab and named for the module ("Contact sales about WebSocket Proxy"). Keep the way out out of the description: `SettingsRow` clamps its description to two lines, so on a phone a link at the end of the sentence is cut off and the disabled switch is left with no way to turn it on.

### E. Save bar — `SaveBar`, `Button` (required)

Hidden at rest. On the first edit a `SaveBar` slides up at the bottom of the scroll region with the unsaved-changes label, an optional muted hint, and an outlined Discard beside a primary Save, both medium (stacked under the label on small screens). While saving, every field is read-only (a control with no read-only state is disabled), Save shows its loading state and Discard is disabled. The bar leaves when Save lands or when Discard restores the record. In ProjectSettings a failed save (`error`) keeps the edits and raises a `toast` error, "The project settings weren't saved.", with Retry.

### F. Conditional fields — `SettingsRow`, `Input`, `FieldError` (optional)

When one choice decides which fields apply (a connector, a scope, a template), the choice (a `Select` or `RadioGroup` choice cards (`variant="card"`)) comes first and the rows it unlocks follow it inside the same `Card`, entering with `animate-content-enter`. Hidden rows keep no value that Save sends. Credentials are `PasswordInput`s that cannot be read back after Save, and the row says so. A free-text field that may carry a credential (Custom headers) never ships one in its sample or default: the sample is a plain header (`X-Stream-Source:acme-edge`), and a copy that needs a token sends it through its own `PasswordInput` row, never through text anyone looking at the screen can read. In DataStream the workload scope is `RadioGroup` choice cards (`variant="card"`); the Sampling band appears only when the stream collects from every workload, and Sampling rate is a `NumberInput` with a `%` suffix.

### G. Template editor — `SettingsRow`, `FieldError` (optional)

A setting whose value is a document (a JSON data set) gets a stacked row, under the `Select` that picks the template. A preset is read-only: its document shows in a `CodeBlock` with Copy, and the row says how to edit (choose Custom template). A custom document is a `CodeEditor` (`language="json"`, a fixed `height`), checked on Save (`Write the data set as a JSON object.`); it passes `:loader="loadMonaco"` (the loader from the `code-editor` spec, with the JSON worker) so JSON is validated as you type, and keeps plain line numbers: `pad-line-numbers` is for full-page editors, not a fixed-height field in a form.

### H. Section warnings and server errors — `SettingsGroup`, `Button` (optional)

A setting with a side effect beyond this resource carries a warning `Alert` above its section's `Card` while it is on (`Saving a stream with sampling on turns off every other data stream in this account.`). A server rejection scoped to one section follows the state-form-validation rule (`state/state-form-validation`, SectionRejected): one danger `Alert` above that section that says what happened and that nothing else was lost, with the recovery action on it (`Send test record`); the field it concerns turns invalid with its own one-line reason and takes the focus. Never a toast, never a summary at the top of the page. Saving a settings page is not a build or deploy, so the state-async-submit toast with Edit and Redeploy does not apply here.

### I. Leave guard — `Tabs`, `SaveBar` (optional)

`useUnsavedChanges(() => form)` keeps the saved baseline: `isDirty` drives the save bar and the `dirty` mark on the Settings `Tabs.Trigger` (a dot after the label, "Unsaved changes" for screen readers), `commit()` moves the baseline after a save and `discard()` restores it. Leaving while dirty (another tab, another route through `onBeforeRouteLeave(() => confirmLeave())`, a reload) asks first: the composable warns on `beforeunload` and drives one `ConfirmDialog` bound with `v-bind="dialogProps"`, whose actions are Keep editing, Discard changes and, when `onSave` is given, Save changes, which saves and then leaves. See `skills/webkit-form`.

### J. Changed elsewhere — `Alert`, `ConfirmDialog`, `Button`, `SaveBar` (optional)

When the record was saved by someone else after the form opened, a warning `Alert` sits between the heading and the first section: a bold "Changed elsewhere." lead, one sentence that says nothing was lost and what Save will do, and a secondary Reload button in its action slot. Save does not overwrite silently: it opens a `ConfirmDialog` (kind `primary`) with Go back and Overwrite and save. Reload swaps the edits for the saved values and the notice becomes an info `Alert` "Edits discarded." with Undo, which brings the edits back. The save bar's hint and Discard label follow the notice ("Saving overwrites the version saved elsewhere.", "Discard and reload"). This is the state-form-validation rule (`state/state-form-validation`, SectionRejected) applied to an edit: one message above the form, the recovery action on it.

### K. Danger zone — `SettingsGroup`, `Card`, `SettingsRow`, `Button`, `Input` (optional)

The last section, titled Danger zone with the hint "Actions that cannot be undone.", holds one compact `SettingsRow` per irreversible action with a medium danger `Button` and a trash icon. The action opens a medium `ConfirmDialog`: a warning `Alert` that it cannot be reversed, one paragraph on what goes with it and a docs link (a `Link inline`, since it sits inside the sentence), then the typed confirmation `ConfirmDialog` draws from `confirmation-phrase`: "Type `name` to confirm." over an `Input` labelled by it. The danger confirm button stays disabled until the typed name matches exactly (case-sensitive) and shows its loading state while the request runs; Enter in the input confirms. See `edit/edit-delete-dialog`.

### L. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

ProjectSettings takes the saved settings through props and emits the values on Save; it fetches nothing and saves nothing. `EditResourceProject` and `EditResourceProps` are exported from `edit-resource.vue`, and `sample.ts` holds the sample project the block renders when `resource` is left out. StaleRecord passes `defaultDraft` and `stale`, and DangerZone fills the `sections` slot; the other states are separate screens with their own fields.

| Prop           | Type                           | What it does                                                                                                                           |
| -------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `resource`     | `EditResourceProject`          | The saved settings; the form opens on them and Discard returns to them. A new value resets the form.                                   |
| `defaultDraft` | `Partial<EditResourceProject>` | Unsaved edits the form opens with on top of `resource`, so the save bar is up.                                                         |
| `stale`        | `EditResourceProject`          | The version saved elsewhere after the form opened: the Changed elsewhere notice, Reload with Undo, and the overwrite question on Save. |
| `loading`      | `boolean`                      | The save is in flight: the fields turn read-only, Discard disables and Save spins. When it turns off with no `error`, the bar leaves.  |
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
- Hold every field read-only while saving, not disabled: the values stay readable at full contrast and no field can change under the save.
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

- ProjectSettings: a project's Settings tab with General, Modules and Subscription modules from `resource` (the sample when left out); the save bar is hidden until an edit. Save emits `submit`; `loading` holds the fields read-only and spins Save, and `error` set when it ends raises the error toast with Retry.
- DeployableSettings: a deployable resource's Settings tab with General, Domains, collapsed Advanced settings and the Danger zone, whose Delete resource opens the type-to-confirm `ConfirmDialog` of `edit/edit-delete-dialog`.
- PolicySettings: a security policy's Settings tab with General, Modules with one locked on, Debug rules and Status.
- WafSettings: a WAF rule set's Main settings tab with General, Status (Active and the Blocking or Learning Mode `Select`) and Threats, one row per threat family with a Sensitivity `Select` beside its `Switch`; the Sensitivity is disabled while its threat is off, and Save confirms in a toast.
- ResourceSettings: a first-level resource with no tabs at its own settings route; Save checks every field before it commits.
- UnsavedChanges: after one edit; the save bar is up with Discard and Save.
- Saving: while the request is in flight; every field is read-only, so none can change under the save, Save is loading and Discard is disabled.
- DataStream: a data stream at its own settings route with General, Source, Sampling, Template and Destination; the destination fields follow the connector, Custom headers are `AttributeEditor` rows of Name and Value (up to 5) whose value turns into a masked `PasswordInput` when the name reads as a credential (Authorization, Cookie, a token, key, secret or password), Save sends one test record, and an endpoint that does not answer raises the section `Alert` of the state-form-validation rule.
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
- `WafSettings` — A WAF rule set's Main settings tab: General with the Name, Status with Active and a Mode Select (Blocking or Learning), and a Threats section with one row per threat family, each a Sensitivity Select beside a Switch; turning a threat off disables its Sensitivity. Any change raises the SaveBar, and Save confirms in a toast.
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
  import {
    sampleProject,
    sampleProjectModules,
    sampleProjectTabs,
    sampleSubscriptionModules
  } from './sample'

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
    /** The save is in flight: the fields turn read-only, Discard locks and Save spins. */
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
          v-for="tab in sampleProjectTabs"
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
                              :readonly="saving"
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
                            :readonly="saving"
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
                          v-for="mod in sampleProjectModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          variant="compact"
                        >
                          <Switch
                            v-model="form.modules[mod.key]"
                            :aria-label="mod.title"
                            :readonly="saving"
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
                          v-for="mod in sampleSubscriptionModules"
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
import type { TableColumn } from '@aziontech/webkit/data-table'

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

export const sampleProjectTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'build', label: 'Build' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'variables', label: 'Variables' },
  { value: 'caching', label: 'Caching' },
  { value: 'integrations', label: 'Integrations' },
  { value: 'rules', label: 'Rules' },
  { value: 'main-settings', label: 'Settings' }
]

export const sampleProjectModules = [
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

export const sampleSubscriptionModules = [
  {
    key: 'web_socket_proxy',
    title: 'WebSocket Proxy',
    description:
      'Enhance real-time data exchange between your project and its backends using the WebSocket protocol.'
  }
]

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

export const sampleCacheBrowserBehaviors = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' },
  { value: 'no-cache', label: 'No cache' }
]

export const sampleCacheEdgeBehaviors = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' }
]

export const sampleCacheTopologies = [
  { value: 'nearest-region', label: 'Nearest region' },
  { value: 'south-america', label: 'South America' },
  { value: 'north-america', label: 'North America' }
]

export const sampleCacheVaryBehaviors = [
  { value: 'ignore', label: 'Ignore all, best cache rate' },
  { value: 'all', label: 'Vary by all' },
  { value: 'allowlist', label: 'Vary by some (allowlist)' },
  { value: 'denylist', label: 'Vary by all except some (denylist)' }
]

export const sampleCacheMethods = [
  { value: 'POST', label: 'POST' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]

export const sampleCacheSetting = {
  name: 'static-assets',
  browserBehavior: 'override',
  browserMaxAge: 604800,
  edgeBehavior: 'override',
  edgeMaxAge: 2592000,
  staleCache: true,
  largeFileCache: false,
  largeFileOffset: 1024,
  tieredCache: true,
  tieredTopology: 'nearest-region',
  varyByMethod: [] as string[],
  queryStringBehavior: 'allowlist',
  queryStringFields: 'v, lang',
  cookieBehavior: 'ignore',
  cookieNames: ''
}

const port = (value: number, label = String(value)) => ({ value, label })

export const sampleHttpPorts = [port(80, '80 (default)'), port(8008), port(8080), port(8880)]

export const sampleHttpsPorts = [port(443, '443 (default)'), port(8443), port(9440), port(9443)]

export const sampleHttp3Ports = [port(443, '443 (default)'), port(8443), port(9443)]

export const sampleTlsVersions = [
  { value: 'tls_1_3', label: 'TLS 1.3 (default)' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_1', label: 'TLS 1.1 (deprecated)' }
]

export const sampleCipherSuites = [
  { value: 'modern-2025', label: 'Modern 2025' },
  { value: 'compatible-2025', label: 'Compatible 2025' },
  { value: 'legacy-2025', label: 'Legacy 2025' }
]

export const sampleMtlsModes = [
  {
    value: 'enforce',
    label: 'Enforce',
    description:
      'Stops the TLS handshake when the client certificate cannot be verified against the trusted CA.'
  },
  {
    value: 'permissive',
    label: 'Permissive',
    description:
      'Tries to verify the client certificate but lets the handshake finish either way. The firewall sees which certificate was presented.'
  }
]

export const sampleTrustedCas = [
  { value: 'partners-ca', label: 'partners-ca', expires: 'Expires Mar 2027' },
  { value: 'devices-ca', label: 'devices-ca', expires: 'Expires Aug 2026' }
]

export const sampleRevocationLists = [
  { value: 'partners-crl', label: 'partners-crl' },
  { value: 'devices-crl', label: 'devices-crl' }
]

export const sampleProtocolSettings = {
  httpPorts: [80],
  useHttps: true,
  httpsPorts: [443],
  useHttp3: false,
  http3Ports: [443],
  minimumTls: 'tls_1_3',
  cipherSuite: 'modern-2025',
  mtls: false,
  mtlsMode: 'enforce',
  trustedCa: '',
  crl: [] as string[]
}

export const sampleDeployableTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'settings', label: 'Settings' }
]

export const sampleDeployableEnvironments = [
  { name: 'Production', policy: 'Single' },
  { name: 'Preview', policy: 'Versioned' }
]

/** One domain the resource answers on. */
export interface DeployableDomainRow {
  /** The domain id. */
  id: string
  /** The host name. */
  domain: string
  /** The environment the domain answers in. */
  environment: string
  /** The deployment policy of that environment. */
  policy: string
  /** The certificate the domain is served with. */
  certificate: string
  /** The platform generated the domain; it cannot be edited or deleted. */
  generated: boolean
}

export const sampleDeployableDomains: DeployableDomainRow[] = [
  {
    id: 'generated',
    domain: 'resource-01.azion.app',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Platform (free)',
    generated: true
  },
  {
    id: 'd-7731',
    domain: 'www.example.com',
    environment: 'Production',
    policy: 'Single',
    certificate: 'example.com wildcard',
    generated: false
  }
]

export const sampleDeployableDomainColumns: TableColumn[] = [
  { accessorKey: 'domain', header: 'Domain', principal: true, grow: 2 },
  { accessorKey: 'environment', header: 'Environment' },
  { accessorKey: 'policy', header: 'Policy' },
  { accessorKey: 'certificate', header: 'Certificate' },
  { id: 'actions', type: 'action', hideable: false }
]

export const sampleLinkedEnvironments = [
  {
    name: 'Production',
    policy: 'Single',
    settingsId: 's1',
    auto: true,
    options: [
      { value: 'default', label: 'Default' },
      { value: 's1', label: 'storefront-production' },
      { value: 's2', label: 'storefront-legacy' }
    ]
  },
  {
    name: 'Preview',
    policy: 'Versioned',
    settingsId: 's5',
    auto: true,
    options: [
      { value: 's5', label: 'analytics-canary' },
      { value: 's10', label: 'blog-platform-stage' }
    ]
  }
]

export const sampleDeployableHttpPorts = [
  { value: 80, label: '80 (Default)' },
  { value: 8008, label: '8008' },
  { value: 8080, label: '8080' },
  { value: 8880, label: '8880' }
]

export const sampleDeployableHttpsPorts = [
  { value: 443, label: '443 (Default)' },
  { value: 8443, label: '8443' },
  { value: 9440, label: '9440' },
  { value: 9441, label: '9441' },
  { value: 9442, label: '9442' },
  { value: 9443, label: '9443' },
  { value: 7777, label: '7777' },
  { value: 8888, label: '8888' },
  { value: 9553, label: '9553' },
  { value: 9653, label: '9653' },
  { value: 8035, label: '8035' },
  { value: 8090, label: '8090' }
]

export const sampleDeployableHttp3Ports = [
  { value: 443, label: '443 (Default)' },
  { value: 7777, label: '7777' },
  { value: 8035, label: '8035' },
  { value: 8090, label: '8090' },
  { value: 8443, label: '8443' },
  { value: 8888, label: '8888' },
  { value: 9440, label: '9440' },
  { value: 9441, label: '9441' },
  { value: 9442, label: '9442' },
  { value: 9443, label: '9443' },
  { value: 9553, label: '9553' },
  { value: 9653, label: '9653' }
]

export const sampleDeployableTlsVersions = [
  { value: 'tls_1_3', label: 'TLS v1.3 (Default)' },
  { value: 'tls_1_2', label: 'TLS v1.2' },
  { value: 'tls_1_1', label: 'TLS v1.1 (Deprecated)' },
  { value: 'tls_1_0', label: 'TLS v1.0 (Deprecated)' }
]

export const sampleDeployableCipherSuites = [
  { value: 7, label: 'Modern v2025Q1' },
  { value: 6, label: 'Compatible v2025Q1' },
  { value: 5, label: 'Legacy v2025Q1' },
  { value: 4, label: 'Modern v2022Q1 (migration TLS 1.3)' },
  { value: 3, label: 'Modern v2022Q1 - TLS 1.2' },
  { value: 2, label: 'Compatible v2018Q1 - TLS 1.2' },
  { value: 1, label: 'Legacy v2018Q1 - TLS 1.2' }
]

export const sampleDeployableMtlsModes = [
  {
    value: 'enforce',
    label: 'Enforce',
    description:
      'Blocks the client certificate during the TLS handshake when the Trusted CA can’t be validated.'
  },
  {
    value: 'permissive',
    label: 'Permissive',
    description:
      'Attempts to verify the client certificate, but allows the handshake even when the Trusted CA can’t be validated. Check which certificate attempted the request in the request logs.'
  }
]

export const sampleDeployableTrustedCas = [
  { value: 'cert-8804', label: 'legacy origin CA' },
  { value: 'cert-8806', label: 'partner mTLS CA' }
]

export const sampleDeployableRevocationLists = [
  { value: 'cert-8807', label: 'partner revocation list' }
]

export const sampleDeployableResource = {
  name: 'resource-01',
  active: true,
  deploymentSettings: {} as Record<string, string>,
  protocols: {
    httpPorts: [80],
    useHttps: true,
    httpsPorts: [443],
    useHttp3: false,
    http3Ports: [443],
    minimumTlsVersion: 'tls_1_3',
    cipherSuite: 7
  },
  mtls: { enabled: false, mode: 'enforce', certificate: '', crl: [] as string[] }
}

export const sampleDataStreamSources = [
  { value: 'applications', label: 'Applications' },
  { value: 'functions', label: 'Functions' },
  { value: 'firewall', label: 'Firewall' },
  { value: 'activity', label: 'Activity history' }
]

export const sampleDataStreamScopes = [
  {
    value: 'all',
    label: 'All current and future workloads',
    description: 'Collect from every workload, including the ones created later. Unlocks sampling.'
  },
  {
    value: 'filtered',
    label: 'Selected workloads',
    description: 'Collect only from the workloads you list.'
  }
]

export const sampleDataStreamPresets: Record<
  string,
  { label: string; dataSet: Record<string, string> }
> = {
  'http-requests': {
    label: 'HTTP requests',
    dataSet: {
      time: '$time',
      host: '$host',
      request_method: '$request_method',
      request_uri: '$request_uri',
      status: '$status',
      bytes_sent: '$bytes_sent',
      request_time: '$request_time',
      upstream_cache_status: '$upstream_cache_status',
      remote_addr: '$remote_addr',
      geoip_country: '$geoip_country'
    }
  },
  'function-runs': {
    label: 'Function runs',
    dataSet: {
      time: '$time',
      function_id: '$function_id',
      function_name: '$function_name',
      duration_ms: '$duration_ms',
      status: '$status',
      log_level: '$log_level',
      message: '$message'
    }
  },
  'firewall-events': {
    label: 'Firewall events',
    dataSet: {
      time: '$time',
      host: '$host',
      rule_id: '$rule_id',
      rule_action: '$rule_action',
      threat_family: '$threat_family',
      remote_addr: '$remote_addr',
      request_uri: '$request_uri'
    }
  }
}

export const sampleDataStreamTemplates = [
  ...Object.entries(sampleDataStreamPresets).map(([value, template]) => ({
    value,
    label: template.label
  })),
  { value: 'custom', label: 'Custom template' }
]

export const sampleDataStreamConnectors = [
  { value: 'standard', label: 'Standard HTTP/HTTPS POST' },
  { value: 'kafka', label: 'Apache Kafka' },
  { value: 's3', label: 'S3-compatible storage' },
  { value: 'analytics', label: 'Log analytics service' }
]

export const sampleDataStream = {
  name: 'http-to-collector',
  active: true,
  source: 'applications',
  scope: 'all',
  workloads: '',
  sampling: true,
  samplingRate: 25,
  template: 'custom',
  templateName: 'http-compact',
  dataSet: JSON.stringify(
    {
      time: '$time',
      host: '$host',
      status: '$status',
      request_uri: '$request_uri',
      request_time: '$request_time',
      upstream_cache_status: '$upstream_cache_status'
    },
    null,
    2
  ),
  connector: 'standard',
  url: 'https://collector.example.com/ingest',
  payloadFormat: '$dataset',
  lineSeparator: '\\n',
  headers: [
    { name: 'X-Stream-Source', value: 'acme-edge' },
    { name: 'Authorization', value: 'Bearer example-token' }
  ],
  bootstrapServers: '',
  topic: '',
  bucket: '',
  region: '',
  accessKey: '',
  secretKey: '',
  analyticsUrl: '',
  apiKey: ''
}
```

## `use-settings-draft.ts`

```ts
import {
  useUnsavedChanges,
  type UseUnsavedChangesReturn
} from '@aziontech/webkit/use-unsaved-changes'
import { type ComputedRef, onScopeDispose, reactive, readonly, type Ref, ref, watch } from 'vue'

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
  /** The leave guard: warns on reload and drives the leave dialog while the form is dirty. */
  leave: UseUnsavedChangesReturn<T>
}

export function useSettingsDraft<T extends object>(
  record: T,
  options: UseSettingsDraftOptions<T> = {}
): UseSettingsDraftReturn<T> {
  const form = reactive(structuredClone(record)) as T
  const saving = ref(options.saving ?? false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const settled = () =>
    new Promise<void>((resolve) => {
      if (!saving.value) return resolve()
      const stop = watch(saving, (next) => {
        if (next) return
        stop()
        resolve()
      })
    })

  const leave = useUnsavedChanges(() => form as T, {
    onDiscard: (baseline) => Object.assign(form, baseline),
    onSave: () => {
      save()
      return settled()
    }
  })
  leave.commit(structuredClone(record))
  Object.assign(form, options.draft)

  const commit = () => {
    options.onStart?.()
    clearTimeout(timer)
    timer = setTimeout(() => {
      leave.commit()
      saving.value = false
      options.onSaved?.()
    }, options.delay ?? 900)
  }

  function save() {
    if (options.validate && !options.validate()) return
    saving.value = true
    commit()
  }

  const discard = () => {
    leave.discard()
  }

  onScopeDispose(() => clearTimeout(timer))

  return { form, saving: readonly(saving), dirty: leave.isDirty, save, commit, discard, leave }
}
```

## `use-deploy-on-save.ts`

```ts
import { toast } from '@aziontech/webkit/toast'
import { type ComputedRef, nextTick, onScopeDispose, reactive, type Ref } from 'vue'

import { useSettingsDraft, type UseSettingsDraftReturn } from './use-settings-draft'

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
  /** The leave guard of the form. */
  leave: UseSettingsDraftReturn<T>['leave']
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
    discard,
    leave: draft.leave
  }
}
```

## `parts/settings-save-bar.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'

  import SettingsLeaveDialog, { type SettingsLeaveDialogProps } from './settings-leave-dialog.vue'

  export interface SettingsSaveBarProps {
    /** Whether the bar is up: the form holds edits or a save is in flight. */
    visible?: boolean
    /** The save is in flight: Discard locks and Save spins. */
    saving?: boolean
    /** Label of the Discard button. */
    discardLabel?: string
    /** The leave guard; set, the leave dialog renders with the bar. */
    guard?: SettingsLeaveDialogProps['guard']
  }

  const props = withDefaults(defineProps<SettingsSaveBarProps>(), {
    visible: false,
    saving: false,
    discardLabel: 'Discard',
    guard: undefined
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
  <SettingsLeaveDialog
    v-if="guard"
    :guard="guard"
  />
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
      <span
        v-if="saving"
        data-testid="settings-save-bar__saving"
        >Saving changes…</span
      >
      <slot v-else />
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
  import { computed } from 'vue'

  import type { SettingsLeaveDialogProps } from './settings-leave-dialog.vue'
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
    /** The leave guard; set, a tab change while dirty asks first and the leave dialog renders. */
    guard?: SettingsLeaveDialogProps['guard'] & { confirmLeave: () => Promise<boolean> }
  }

  const props = withDefaults(defineProps<SettingsTabPageProps>(), {
    dirty: false,
    saving: false,
    dirtyTab: '',
    guard: undefined
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

  const shownTab = computed({
    get: () => activeTab.value,
    set: async (value: string) => {
      if (!value || value === activeTab.value) return
      if (props.guard && !(await props.guard.confirmLeave())) return
      activeTab.value = value
    }
  })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="shownTab">
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
                  aria-label="Documentation (opens in a new tab)"
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
            :guard="guard"
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
    /** Holds every field read-only while a save is in flight. */
    readonly?: boolean
  }

  const props = withDefaults(defineProps<PolicyGroupsProps>(), {
    nameInvalid: false,
    readonly: false
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
                :readonly="readonly"
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
            :description="
              field.locked ? field.description + ' Always on for every policy.' : field.description
            "
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
                  readonly
                />
              </span>
            </Tooltip>
            <Switch
              v-else
              :model-value="selectedKeys.includes(field.key)"
              @update:model-value="(on) => setModule(field.key, on)"
              :aria-label="field.title"
              :readonly="readonly"
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
              :readonly="readonly"
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
              :readonly="readonly"
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
    /** Opens with the save in flight: the fields turn read-only, Discard locks and Save spins. */
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

  const { form, saving, dirty, save, discard, leave } = useSettingsDraft(samplePolicy, {
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
    :guard="leave"
    @save="save"
    @discard="discard"
  >
    <fieldset
      v-if="defaultSaving"
      class="m-0 flex min-w-0 flex-col border-0 p-0"
    >
      <legend class="sr-only">Settings</legend>
      <PolicyGroups
        v-model:name="form.name"
        v-model:active="form.active"
        v-model:debug-rules="form.debugRules"
        v-model:selected-keys="form.modules"
        :modules="samplePolicyModules"
        :name-invalid="nameError"
        :readonly="saving"
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

## `lib/data-stream-checks.ts`

```ts
import type { sampleDataStream } from '../sample'
import type { FieldProblem, FieldProblems } from '../use-deploy-on-save'

type DataStreamRecord = typeof sampleDataStream
type Need = (id: keyof DataStreamRecord) => boolean
type Check = (form: DataStreamRecord, errors: FieldProblems, need: Need) => void

const URL_PATTERN = /^https?:\/\/[^\s/$.?#][^\s]*$/
const HEADER_NAME_PATTERN = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+$/
const CREDENTIAL_HEADER_PATTERN =
  /^(authorization|proxy-authorization|cookie)$|token|key|secret|password/i

export const isCredentialHeader = (name: string) => CREDENTIAL_HEADER_PATTERN.test(name.trim())

export function headerProblem(header: { name: string; value: string }) {
  const name = HEADER_NAME_PATTERN.test(header.name.trim())
    ? undefined
    : 'Enter a header name of letters, numbers and hyphens.'
  const value = header.value.trim() ? undefined : 'Enter a value.'
  return name || value ? { name, value } : undefined
}
const SERVERS_PATTERN = /^[^\s,]+(,[^\s,]+)*$/
const WORKLOADS_PATTERN = /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/

const invalid = (message: string): FieldProblem => ({ type: 'invalid', message })

const checkSource: Check = (form, errors, need) => {
  if (need('name') && form.name.trim().length > 250)
    errors.name = invalid('Use at most 250 characters.')
  if (
    form.scope === 'filtered' &&
    need('workloads') &&
    !WORKLOADS_PATTERN.test(form.workloads.trim())
  )
    errors.workloads = invalid('Remove the empty lines. Every line holds one workload.')
  if (form.scope === 'all' && form.sampling) {
    const rate = Number(form.samplingRate)
    if (!Number.isFinite(rate) || rate < 1 || rate > 100)
      errors.samplingRate = invalid('Enter a rate from 1 to 100.')
  }
}

const dataSetProblem = (text: string): string => {
  let parsed: unknown = null
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = null
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    return 'Write the data set as a JSON object.'
  if (!Object.keys(parsed).length) return 'Add at least one variable to the data set.'
  return ''
}

const checkTemplate: Check = (form, errors, need) => {
  if (form.template !== 'custom') return
  need('templateName')
  if (!need('dataSet')) return
  const message = dataSetProblem(form.dataSet)
  if (message) errors.dataSet = invalid(message)
}

const checkStandard: Check = (form, errors, need) => {
  if (need('url') && !URL_PATTERN.test(form.url.trim()))
    errors.url = invalid('Enter a valid URL. Example: https://collector.example.com/ingest.')
  need('payloadFormat')
  need('lineSeparator')
  if (form.headers.some(headerProblem))
    errors.headers = invalid('Give every header a name and a value.')
}

const checkKafka: Check = (form, errors, need) => {
  if (need('bootstrapServers') && !SERVERS_PATTERN.test(form.bootstrapServers.trim()))
    errors.bootstrapServers = invalid('Separate the servers with a comma and no space.')
  need('topic')
}

const checkStorage: Check = (_form, _errors, need) => {
  need('bucket')
  need('region')
  need('accessKey')
  need('secretKey')
}

const checkAnalytics: Check = (form, errors, need) => {
  if (need('analyticsUrl') && !URL_PATTERN.test(form.analyticsUrl.trim()))
    errors.analyticsUrl = invalid(
      'Enter a valid URL. Example: https://logs.example.com/api/v2/logs.'
    )
  need('apiKey')
}

const DESTINATION_CHECKS: Record<string, Check> = {
  standard: checkStandard,
  kafka: checkKafka,
  s3: checkStorage,
  analytics: checkAnalytics
}

export function checkDataStream(form: DataStreamRecord, errors: FieldProblems): boolean {
  Object.keys(errors).forEach((key) => delete errors[key])
  const need: Need = (id) => {
    if (String(form[id] ?? '').trim()) return true
    errors[id] = { type: 'required', message: 'This field is required.' }
    return false
  }
  checkSource(form, errors, need)
  checkTemplate(form, errors, need)
  DESTINATION_CHECKS[form.connector]?.(form, errors, need)
  return Object.keys(errors).length === 0
}
```

## `lib/option-label.ts`

```ts
import type { SelectOptionItem } from '@aziontech/webkit/select'

export const optionLabel =
  (options: SelectOptionItem<string | number>[]) => (value: string | number) =>
    options.find((option) => option.value === value)?.label ?? String(value)
```

## `lib/ttl-duration.ts`

```ts
const UNITS: ReadonlyArray<[unit: 'year' | 'day' | 'hour' | 'minute' | 'second', seconds: number]> =
  [
    ['year', 31_536_000],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
    ['second', 1]
  ]

export const ttlDuration = (
  seconds: number | null | undefined,
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
): string => {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds) || seconds <= 0)
    return ''
  const [unit, size] =
    UNITS.find(([, step]) => seconds % step === 0) ??
    UNITS.find(([, step]) => seconds >= step) ??
    UNITS[UNITS.length - 1]!
  return formatNumber(seconds / size, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
    maximumFractionDigits: 1
  })
}
```

## `parts/cache-key-group.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'

  import {
    sampleCacheMethods as methods,
    sampleCacheVaryBehaviors as varyBehaviors
  } from '../sample'
  import { useCacheSettingsContext } from '../use-cache-settings'

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? value
  const methodsLabel = (values: unknown[] | undefined) => (values?.length ? values.join(', ') : '')

  const { form, saving, errors, clear } = useCacheSettingsContext()
</script>

<template>
  <SettingsGroup
    label="Advanced cache key"
    hint="Which parts of a request make two requests two different cached objects."
    anchor="cache-key"
    collapsible
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="varyByMethod"
              title="Cache by HTTP method"
              description="GET and HEAD are always cached. Adding POST or OPTIONS puts the request body in the cache key."
            >
              <MultiSelect
                v-model="form.varyByMethod"
                size="large"
                class="w-full"
                placeholder="GET and HEAD only"
                :display-value="methodsLabel"
                :readonly="saving"
              >
                <MultiSelect.Trigger aria-label="Cache by HTTP method" />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="option in methods"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </MultiSelect.Item>
                </MultiSelect.Content>
              </MultiSelect>
            </SettingsRow>
            <SettingsRow
              key="queryStringBehavior"
              title="Cache by query string"
            >
              <Select
                v-model="form.queryStringBehavior"
                size="large"
                class="w-full"
                :display-value="labelOf(varyBehaviors)"
                :readonly="saving"
              >
                <Select.Trigger aria-label="Cache by query string" />
                <Select.Content>
                  <Select.Item
                    v-for="option in varyBehaviors"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <SettingsRow
              v-if="['allowlist', 'denylist'].includes(form.queryStringBehavior)"
              key="queryStringFields"
              title="Query string fields"
              description="Comma separated and case sensitive: utm_source and UTM_SOURCE are two fields."
              :depth="1"
            >
              <Input
                id="cache-queryStringFields"
                v-model="form.queryStringFields"
                size="large"
                class="w-full"
                aria-label="Query string fields"
                placeholder="page, sort, lang"
                autocomplete="off"
                required
                :invalid="!!errors.queryStringFields"
                :aria-describedby="
                  errors.queryStringFields ? 'cache-queryStringFields-message' : undefined
                "
                :readonly="saving"
                @update:model-value="clear('queryStringFields')"
              />
              <FieldError
                v-if="errors.queryStringFields"
                id="cache-queryStringFields-message"
                >{{ errors.queryStringFields.message }}</FieldError
              >
            </SettingsRow>
            <SettingsRow
              key="cookieBehavior"
              title="Cache by cookies"
            >
              <Select
                v-model="form.cookieBehavior"
                size="large"
                class="w-full"
                :display-value="labelOf(varyBehaviors)"
                :readonly="saving"
              >
                <Select.Trigger aria-label="Cache by cookies" />
                <Select.Content>
                  <Select.Item
                    v-for="option in varyBehaviors"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <SettingsRow
              v-if="['allowlist', 'denylist'].includes(form.cookieBehavior)"
              key="cookieNames"
              title="Cookie names"
              description="Comma separated. A name ending in * matches every cookie that starts with it."
              :depth="1"
            >
              <Input
                id="cache-cookieNames"
                v-model="form.cookieNames"
                size="large"
                class="w-full"
                aria-label="Cookie names"
                placeholder="session_id, ab_*"
                autocomplete="off"
                required
                :invalid="!!errors.cookieNames"
                :aria-describedby="errors.cookieNames ? 'cache-cookieNames-message' : undefined"
                :readonly="saving"
                @update:model-value="clear('cookieNames')"
              />
              <FieldError
                v-if="errors.cookieNames"
                id="cache-cookieNames-message"
                >{{ errors.cookieNames.message }}</FieldError
              >
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/cache-settings-page.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import { ttlDuration } from '../lib/ttl-duration'
  import {
    sampleCacheBrowserBehaviors as browserBehaviors,
    sampleCacheEdgeBehaviors as edgeBehaviors,
    sampleCacheTopologies as topologies
  } from '../sample'
  import { provideCacheSettings } from '../use-cache-settings'
  import CacheKeyGroup from './cache-key-group.vue'
  import SettingsSaveBar from './settings-save-bar.vue'

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? value

  const { form, saving, dirty, errors, clear, save, discard, leave } = provideCacheSettings()

  const { formatNumber } = useLocale()
  const duration = (seconds: number | null | undefined) => ttlDuration(seconds, formatNumber)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <form
      class="flex min-h-0 min-w-0 flex-1 flex-col"
      aria-label="Cache settings"
      novalidate
      @submit.prevent="save"
    >
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeader
          title="Cache settings"
          description="How static-assets is cached at the edge and in browsers. Rules of storefront-app pick it with the Set cache policy behavior."
          size="small"
        />

        <fieldset class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0">
          <legend class="sr-only">Cache settings</legend>

          <SettingsGroup
            label="General"
            hint="Names the cache setting in the rules that reference it."
            anchor="general"
          >
            <Card :padded="false">
              <template #default>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingsRow
                      key="name"
                      title="Name"
                      description="What the Set cache policy behavior of a rule picks from its list."
                    >
                      <Input
                        id="cache-name"
                        v-model="form.name"
                        size="large"
                        class="w-full"
                        aria-label="Name"
                        placeholder="static-assets"
                        autocomplete="off"
                        required
                        :invalid="!!errors.name"
                        :aria-describedby="errors.name ? 'cache-name-message' : undefined"
                        :readonly="saving"
                        @update:model-value="clear('name')"
                      />
                      <FieldError
                        v-if="errors.name"
                        id="cache-name-message"
                        >{{ errors.name.message }}</FieldError
                      >
                    </SettingsRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsGroup>
          <SettingsGroup
            label="Browser cache"
            hint="How long the visitor's browser may reuse a response before asking again."
            anchor="browser-cache"
          >
            <Card :padded="false">
              <template #default>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingsRow
                      key="browserBehavior"
                      title="Behavior"
                      description="Honoring the origin passes its Cache-Control through. Overriding replaces it with the time set here."
                    >
                      <Select
                        v-model="form.browserBehavior"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(browserBehaviors)"
                        :readonly="saving"
                      >
                        <Select.Trigger aria-label="Browser cache behavior" />
                        <Select.Content>
                          <Select.Item
                            v-for="option in browserBehaviors"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.browserBehavior === 'override'"
                      key="browserMaxAge"
                      title="Maximum TTL in seconds"
                      description="Up to 1 year (31,536,000 seconds)."
                      :depth="1"
                    >
                      <NumberInput
                        id="cache-browserMaxAge"
                        v-model="form.browserMaxAge"
                        size="large"
                        class="w-full"
                        :min="0"
                        :max="31536000"
                        aria-label="Browser maximum TTL in seconds"
                        aria-describedby="cache-browserMaxAge-duration"
                        :readonly="saving"
                      />
                      <p
                        id="cache-browserMaxAge-duration"
                        class="text-body-xs text-(--text-muted)"
                        data-testid="cache-settings__browser-duration"
                      >
                        {{ duration(form.browserMaxAge) }}
                      </p>
                    </SettingsRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsGroup>
          <SettingsGroup
            label="Edge cache"
            hint="How long the edge may serve a stored response before it asks the origin again."
            anchor="edge-cache"
          >
            <Card :padded="false">
              <template #default>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingsRow
                      key="edgeBehavior"
                      title="Behavior"
                      description="Overriding sets the time the edge keeps each object, from 60 seconds up."
                    >
                      <Select
                        v-model="form.edgeBehavior"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(edgeBehaviors)"
                        :readonly="saving"
                      >
                        <Select.Trigger aria-label="Edge cache behavior" />
                        <Select.Content>
                          <Select.Item
                            v-for="option in edgeBehaviors"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.edgeBehavior === 'override'"
                      key="edgeMaxAge"
                      title="Maximum TTL in seconds"
                      description="From 1 minute (60 seconds) to 1 year (31,536,000 seconds)."
                      :depth="1"
                    >
                      <NumberInput
                        id="cache-edgeMaxAge"
                        v-model="form.edgeMaxAge"
                        size="large"
                        class="w-full"
                        :min="0"
                        :max="31536000"
                        aria-label="Edge maximum TTL in seconds"
                        :readonly="saving"
                        :invalid="Boolean(errors.edgeMaxAge)"
                        :aria-describedby="
                          errors.edgeMaxAge
                            ? 'cache-edgeMaxAge-duration cache-edgeMaxAge-message'
                            : 'cache-edgeMaxAge-duration'
                        "
                        @update:model-value="clear('edgeMaxAge')"
                      />
                      <p
                        id="cache-edgeMaxAge-duration"
                        class="text-body-xs text-(--text-muted)"
                        data-testid="cache-settings__edge-duration"
                      >
                        {{ duration(form.edgeMaxAge) }}
                      </p>
                      <FieldError
                        v-if="errors.edgeMaxAge"
                        id="cache-edgeMaxAge-message"
                        >{{ errors.edgeMaxAge.message }}</FieldError
                      >
                    </SettingsRow>
                    <SettingsRow
                      key="staleCache"
                      title="Stale cache"
                      description="Keep serving the expired object while the origin is unreachable, instead of answering with an error."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.staleCache"
                        aria-label="Stale cache"
                        :readonly="saving"
                      />
                    </SettingsRow>
                    <SettingsRow
                      key="largeFileCache"
                      title="Large file optimization"
                      description="Fetch and cache large objects in fragments, so a partial request does not wait for the whole file."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.largeFileCache"
                        aria-label="Large file optimization"
                        :readonly="saving"
                      />
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.largeFileCache"
                      key="largeFileOffset"
                      title="Fragment size in kB"
                      description="Each fragment requested from the origin. 1024 kB is the default."
                      :depth="1"
                    >
                      <NumberInput
                        id="cache-largeFileOffset"
                        v-model="form.largeFileOffset"
                        size="large"
                        class="w-full"
                        :min="1"
                        aria-label="Fragment size in kilobytes"
                        :readonly="saving"
                      />
                    </SettingsRow>
                    <SettingsRow
                      key="tieredCache"
                      title="Tiered cache"
                      description="Add a second cache layer between the edge and your origin, so an edge miss can still be answered without reaching it."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.tieredCache"
                        aria-label="Tiered cache"
                        :readonly="saving"
                      />
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.tieredCache"
                      key="tieredTopology"
                      title="Topology"
                      description="Where the second layer sits. Pin a region only when the origin is fixed to one."
                      :depth="1"
                    >
                      <Select
                        v-model="form.tieredTopology"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(topologies)"
                        :readonly="saving"
                      >
                        <Select.Trigger aria-label="Tiered cache topology" />
                        <Select.Content>
                          <Select.Item
                            v-for="option in topologies"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </SettingsRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsGroup>
          <CacheKeyGroup />
        </fieldset>
      </div>

      <SettingsSaveBar
        :visible="dirty || saving"
        :guard="leave"
        :saving="saving"
        @save="save"
        @discard="discard"
      >
        Cache settings changed.
        <span class="text-(--text-muted)">Saving deploys storefront-app to Production.</span>
      </SettingsSaveBar>
    </form>
  </div>
</template>
```

## `parts/data-stream-destination-group.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AttributeEditor, { type AttributeEditorColumn } from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PasswordInput from '@aziontech/webkit/password-input'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed } from 'vue'

  import { headerProblem, isCredentialHeader } from '../lib/data-stream-checks'
  import { sampleDataStreamConnectors as connectorOptions } from '../sample'
  import { useDataStreamContext } from '../use-data-stream'
  import DataStreamInputRow from './data-stream-input-row.vue'

  const { form, errors, saving, destinationError, onDestinationChange, save } =
    useDataStreamContext()

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''
  const connectorLabel = labelOf(connectorOptions)

  const HEADER_COLUMNS: AttributeEditorColumn[] = [
    { key: 'name', label: 'Name', placeholder: 'X-Header-Name' },
    { key: 'value', label: 'Value', placeholder: 'value' }
  ]
  const newHeader = () => ({ name: '', value: '' })
  const headerErrors = computed(() =>
    errors.headers ? form.headers.map((header) => headerProblem(header)) : []
  )
</script>

<template>
  <SettingsGroup
    label="Destination"
    hint="The platform the records are sent to. Every value comes from that platform, and credentials cannot be read back."
    anchor="destination"
  >
    <Transition
      enter-active-class="transition duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="destinationError"
        class="mb-(--spacing-sm)"
      >
        <Alert
          severity="danger"
          :label="destinationError"
        >
          <template #actions>
            <Button
              type="button"
              label="Send test record"
              variant="secondary"
              size="medium"
              :loading="saving"
              @click="save"
            />
          </template>
        </Alert>
      </div>
    </Transition>
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="connector"
              title="Connector"
              description="Each platform asks for different values."
            >
              <Select
                v-model="form.connector"
                size="large"
                class="w-full"
                :display-value="connectorLabel"
                :readonly="saving"
                @update:model-value="onDestinationChange('connector')"
              >
                <Select.Trigger
                  id="data-stream-connector"
                  aria-label="Connector"
                />
                <Select.Content>
                  <Select.Item
                    v-for="option in connectorOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <DataStreamInputRow
              v-if="form.connector === 'standard'"
              key="url"
              field="url"
              title="URL"
              description="The URL that receives the records."
              label="URL"
              placeholder="https://collector.example.com/ingest"
              stackable
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 'standard'"
              key="payloadFormat"
              field="payloadFormat"
              title="Payload format"
              description="The format each payload is sent in. $dataset is replaced by the records, joined by the log line separator."
              label="Payload format"
              placeholder="$dataset"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 'standard'"
              key="lineSeparator"
              field="lineSeparator"
              title="Log line separator"
              description="Written at the end of each record. \n puts one record per line, in NDJSON format."
              label="Log line separator"
              placeholder="\n"
              destination
            />
            <SettingsRow
              v-if="form.connector === 'standard'"
              key="headers"
              title="Custom headers"
              description="Sent with every request, up to 5. A credential such as Authorization or an API key stays masked."
              variant="stacked"
            >
              <AttributeEditor
                id="data-stream-headers"
                v-model:items="form.headers"
                :definition="HEADER_COLUMNS"
                :new-item="newHeader"
                :limit="5"
                :disabled="saving"
                add-button-label="Add header"
                remove-button-label="Remove header"
                aria-label="Custom headers"
                :errors="headerErrors"
                @update:items="onDestinationChange('headers')"
              >
                <template #cell-value="{ item, value, update, invalid }">
                  <PasswordInput
                    v-if="isCredentialHeader(item.name)"
                    :model-value="value"
                    autocomplete="off"
                    monospace
                    :readonly="saving"
                    :invalid="invalid"
                    @update:model-value="update"
                  />
                  <Input
                    v-else
                    :model-value="value"
                    autocomplete="off"
                    :spellcheck="false"
                    :readonly="saving"
                    :invalid="invalid"
                    @update:model-value="update"
                  />
                </template>
              </AttributeEditor>
            </SettingsRow>
            <SettingsRow
              v-if="form.connector === 'kafka'"
              key="bootstrapServers"
              title="Bootstrap servers"
              description="The hosts and ports of the Kafka cluster, separated by a comma and no space."
              variant="stacked"
            >
              <div class="flex w-full">
                <Textarea
                  id="data-stream-bootstrapServers"
                  v-model="form.bootstrapServers"
                  class="w-full"
                  :rows="2"
                  aria-label="Bootstrap servers"
                  placeholder="host1:9092,host2:9092"
                  required
                  :invalid="!!errors.bootstrapServers"
                  :aria-describedby="
                    errors.bootstrapServers ? 'data-stream-bootstrapServers-message' : undefined
                  "
                  :readonly="saving"
                  @update:model-value="onDestinationChange('bootstrapServers')"
                />
              </div>
              <FieldError
                v-if="errors.bootstrapServers"
                id="data-stream-bootstrapServers-message"
                >{{ errors.bootstrapServers.message }}</FieldError
              >
            </SettingsRow>
            <DataStreamInputRow
              v-if="form.connector === 'kafka'"
              key="topic"
              field="topic"
              title="Topic"
              description="The Kafka topic the records are written to."
              label="Topic"
              placeholder="edge-records"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 's3'"
              key="bucket"
              field="bucket"
              title="Bucket"
              description="The bucket the record files are written to."
              label="Bucket"
              placeholder="my-records-bucket"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 's3'"
              key="region"
              field="region"
              title="Region"
              description="The region of the bucket, as the storage provider names it."
              label="Region"
              placeholder="us-east-1"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 's3'"
              key="accessKey"
              field="accessKey"
              title="Access key"
              description="The access key of a user allowed to write to the bucket."
              label="Access key"
              placeholder="AKIAEXAMPLE"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 's3'"
              key="secretKey"
              field="secretKey"
              title="Secret key"
              description="The secret key paired with the access key. It cannot be read back after saving."
              label="Secret key"
              placeholder="Enter the secret key"
              secret
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 'analytics'"
              key="analyticsUrl"
              field="analyticsUrl"
              title="Intake URL"
              description="The intake URL of your log analytics account."
              label="Intake URL"
              placeholder="https://logs.example.com/api/v2/logs"
              stackable
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 'analytics'"
              key="apiKey"
              field="apiKey"
              title="API key"
              description="An API key of your log analytics account. It cannot be read back after saving."
              label="API key"
              placeholder="Enter the API key"
              secret
              destination
            />
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/data-stream-input-row.vue`

```ts
<script setup lang="ts">
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import PasswordInput from '@aziontech/webkit/password-input'
  import SettingsRow from '@aziontech/webkit/settings-row'

  import { type DataStreamRecord, useDataStreamContext } from '../use-data-stream'

  /** A data stream field that holds text. */
  export type DataStreamTextField = {
    [K in keyof DataStreamRecord]: DataStreamRecord[K] extends string ? K : never
  }[keyof DataStreamRecord]

  export interface DataStreamInputRowProps {
    /** The field the row edits. */
    field: DataStreamTextField
    /** The row title. */
    title: string
    /** The sentence under the title. */
    description: string
    /** The accessible name of the input. */
    label: string
    /** The placeholder of the input. */
    placeholder: string
    /** The row stacks its control under the copy on narrow screens. */
    stackable?: boolean
    /** The value is a credential, typed in a password input. */
    secret?: boolean
    /** The field belongs to the destination: editing it also drops the destination error. */
    destination?: boolean
  }

  const props = withDefaults(defineProps<DataStreamInputRowProps>(), {
    stackable: false,
    secret: false,
    destination: false
  })

  const { form, errors, saving, clear, onDestinationChange } = useDataStreamContext()

  const id = `data-stream-${props.field}`
  const onUpdate = () => (props.destination ? onDestinationChange(props.field) : clear(props.field))
</script>

<template>
  <SettingsRow
    :title="title"
    :description="description"
    :stackable="stackable"
  >
    <PasswordInput
      v-if="secret"
      :id="id"
      v-model="form[field]"
      class="w-full"
      :aria-label="label"
      :placeholder="placeholder"
      autocomplete="off"
      required
      :invalid="!!errors[field]"
      :aria-describedby="errors[field] ? `${id}-message` : undefined"
      :readonly="saving"
      @update:model-value="onUpdate"
    />
    <Input
      v-else
      :id="id"
      v-model="form[field]"
      size="large"
      class="w-full"
      :aria-label="label"
      :placeholder="placeholder"
      autocomplete="off"
      required
      :invalid="!!errors[field]"
      :aria-describedby="errors[field] ? `${id}-message` : undefined"
      :readonly="saving"
      @update:model-value="onUpdate"
    />
    <FieldError
      v-if="errors[field]"
      :id="`${id}-message`"
      >{{ errors[field]?.message }}</FieldError
    >
  </SettingsRow>
</template>
```

## `parts/data-stream-page.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'

  import { provideDataStream } from '../use-data-stream'
  import DataStreamDestinationGroup from './data-stream-destination-group.vue'
  import DataStreamInputRow from './data-stream-input-row.vue'
  import DataStreamSamplingGroup from './data-stream-sampling-group.vue'
  import DataStreamSourceGroup from './data-stream-source-group.vue'
  import DataStreamTemplateGroup from './data-stream-template-group.vue'
  import SettingsSaveBar from './settings-save-bar.vue'

  const { form, saving, dirty, save, discard, leave } = provideDataStream()
</script>

<template>
  <form
    class="flex min-h-0 min-w-0 flex-1 flex-col"
    aria-label="Data stream settings"
    novalidate
    @submit.prevent="save"
  >
    <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Ship the records of your workloads to your own observability or storage platform. One stream, one destination."
        size="small"
      />

      <fieldset class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0">
        <legend class="sr-only">Data stream settings</legend>

        <SettingsGroup
          label="General"
          hint="How the stream is identified, and whether it is collecting records."
          anchor="general"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <DataStreamInputRow
                    key="name"
                    field="name"
                    title="Name"
                    description="Give a unique and descriptive name to identify the data stream."
                    label="Name"
                    placeholder="my-data-stream"
                  />
                  <SettingsRow
                    key="active"
                    title="Active"
                    description="When off, the stream stops collecting records and nothing is sent to the destination."
                    variant="compact"
                  >
                    <Switch
                      v-model="form.active"
                      aria-label="Active"
                      :readonly="saving"
                    />
                  </SettingsRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>

        <DataStreamSourceGroup />

        <DataStreamSamplingGroup />

        <DataStreamTemplateGroup />

        <DataStreamDestinationGroup />
      </fieldset>
    </div>

    <SettingsSaveBar
      :visible="dirty || saving"
      :guard="leave"
      :saving="saving"
      @save="save"
      @discard="discard"
    >
      Data stream settings changed.
      <span class="text-(--text-muted)">Saving sends one test record to the destination.</span>
    </SettingsSaveBar>
  </form>
</template>
```

## `parts/data-stream-sampling-group.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import NumberInput from '@aziontech/webkit/number-input'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'

  import { useDataStreamContext } from '../use-data-stream'

  const { form, errors, saving, clear } = useDataStreamContext()
</script>

<template>
  <SettingsGroup
    v-if="form.scope === 'all'"
    label="Sampling"
    hint="Collect a share of the records instead of all of them. Only available when the stream collects from every workload."
    anchor="sampling"
  >
    <div
      v-if="form.sampling"
      class="mb-(--spacing-sm)"
    >
      <Alert
        severity="warning"
        label="Saving a stream with sampling on turns off every other data stream in this account."
      />
    </div>
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="sampling"
              title="Sampling"
              description="Collect a share of the records instead of all of them, to save resources."
              variant="compact"
            >
              <Switch
                v-model="form.sampling"
                aria-label="Sampling"
                :readonly="saving"
              />
            </SettingsRow>
            <SettingsRow
              v-if="form.sampling"
              key="samplingRate"
              title="Sampling rate"
              description="Percentage of records collected, from 1 to 100. The rate is statistical, and when streams differ the lowest one applies."
            >
              <NumberInput
                id="data-stream-samplingRate"
                v-model="form.samplingRate"
                size="large"
                class="w-full"
                :min="1"
                :max="100"
                aria-label="Sampling rate, in percent"
                :invalid="!!errors.samplingRate"
                :aria-describedby="
                  errors.samplingRate ? 'data-stream-samplingRate-message' : undefined
                "
                :readonly="saving"
                @update:model-value="clear('samplingRate')"
              >
                <template #trailing>%</template>
              </NumberInput>
              <FieldError
                v-if="errors.samplingRate"
                id="data-stream-samplingRate-message"
                >{{ errors.samplingRate.message }}</FieldError
              >
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/data-stream-source-group.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'

  import {
    sampleDataStreamScopes as scopeOptions,
    sampleDataStreamSources as sourceOptions
  } from '../sample'
  import { useDataStreamContext } from '../use-data-stream'

  const { form, errors, saving, clear } = useDataStreamContext()

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''
  const sourceLabel = labelOf(sourceOptions)
</script>

<template>
  <SettingsGroup
    label="Source"
    hint="Which records the stream collects, and from which workloads."
    anchor="source"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="source"
              title="Data source"
              description="The product the records are collected from."
            >
              <Select
                v-model="form.source"
                size="large"
                class="w-full"
                :display-value="sourceLabel"
                :readonly="saving"
                @update:model-value="clear('source')"
              >
                <Select.Trigger aria-label="Data source" />
                <Select.Content>
                  <Select.Item
                    v-for="option in sourceOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <SettingsRow
              key="scope"
              title="Workloads"
              variant="stacked"
            >
              <RadioGroup
                v-model="form.scope"
                variant="card"
                name="data-stream-scope"
                aria-label="Workloads"
                :readonly="saving"
              >
                <RadioGroup.Item
                  v-for="option in scopeOptions"
                  :key="option.value"
                  :value="option.value"
                  :description="option.description"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </SettingsRow>
            <SettingsRow
              v-if="form.scope === 'filtered'"
              key="workloads"
              title="Selected workloads"
              description="One workload per line. Only their records are sent to the destination."
              variant="stacked"
            >
              <Textarea
                id="data-stream-workloads"
                v-model="form.workloads"
                class="w-full"
                :rows="4"
                aria-label="Selected workloads"
                placeholder="storefront&#10;checkout-api"
                required
                :invalid="!!errors.workloads"
                :aria-describedby="errors.workloads ? 'data-stream-workloads-message' : undefined"
                :readonly="saving"
                @update:model-value="clear('workloads')"
              />
              <FieldError
                v-if="errors.workloads"
                id="data-stream-workloads-message"
                >{{ errors.workloads.message }}</FieldError
              >
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/data-stream-template-group.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import CodeEditor, { type CodeEditorMonacoModule } from '@aziontech/webkit/code-editor'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { computed } from 'vue'

  import {
    sampleDataStreamPresets as presetTemplates,
    sampleDataStreamTemplates as templateOptions
  } from '../sample'
  import { useDataStreamContext } from '../use-data-stream'
  import DataStreamInputRow from './data-stream-input-row.vue'

  const loadMonaco = async (): Promise<CodeEditorMonacoModule> => {
    const [{ default: EditorWorker }, { default: JsonWorker }, { default: TsWorker }] =
      await Promise.all([
        import('monaco-editor/editor/editor.worker?worker'),
        import('monaco-editor/languages/features/json/json.worker?worker'),
        import('monaco-editor/languages/features/typescript/ts.worker?worker')
      ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => {
        if (label === 'json') return new JsonWorker()
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        return new EditorWorker()
      }
    }
    return await import('monaco-editor')
  }

  const { form, errors, saving, clear } = useDataStreamContext()

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''
  const templateLabel = labelOf(templateOptions)

  const presetDocument = computed(() => {
    const template = presetTemplates[form.template]
    return template ? JSON.stringify(template.dataSet, null, 2) : ''
  })

  const presetTabs = computed(() => [
    {
      label: 'Data set',
      value: 'data-set',
      language: 'json',
      code: presetDocument.value
    }
  ])
</script>

<template>
  <SettingsGroup
    label="Template"
    hint="The structure of each record sent to the destination."
    anchor="template"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="template"
              title="Template"
              description="A preset sends a fixed set of variables for one source. A custom template lets you choose the variables."
            >
              <Select
                v-model="form.template"
                size="large"
                class="w-full"
                :display-value="templateLabel"
                :readonly="saving"
                @update:model-value="clear('template')"
              >
                <Select.Trigger aria-label="Template" />
                <Select.Content>
                  <Select.Item
                    v-for="option in templateOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <DataStreamInputRow
              v-if="form.template === 'custom'"
              key="templateName"
              field="templateName"
              title="Template name"
              description="Give a unique and descriptive name to identify the custom template."
              label="Template name"
              placeholder="my-custom-template"
            />
            <SettingsRow
              v-if="form.template === 'custom'"
              key="dataSet"
              title="Data set"
              description="The variables sent to the destination, as a JSON object. Each value is a variable such as $host or $status."
              variant="stacked"
            >
              <div class="flex w-full flex-col">
                <CodeEditor
                  id="data-stream-dataSet"
                  v-model="form.dataSet"
                  :loader="loadMonaco"
                  language="json"
                  path="data-set.json"
                  height="16rem"
                  aria-label="Data set"
                  :invalid="!!errors.dataSet"
                  :aria-describedby="errors.dataSet ? 'data-stream-dataSet-message' : undefined"
                  :disabled="saving"
                  @update:model-value="clear('dataSet')"
                />
              </div>
              <FieldError
                v-if="errors.dataSet"
                id="data-stream-dataSet-message"
                >{{ errors.dataSet.message }}</FieldError
              >
            </SettingsRow>
            <SettingsRow
              v-else
              key="preset"
              title="Data set"
              description="The variables this template sends. A preset cannot be edited; choose Custom template to pick the variables yourself."
              variant="stacked"
            >
              <div class="w-full min-w-0">
                <CodeBlock
                  :tabs="presetTabs"
                  copy-aria-label="Copy the data set as JSON"
                />
              </div>
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/deployable-advanced-group.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  import { optionLabel } from '../lib/option-label'
  import { sampleLinkedEnvironments as linkedEnvironments } from '../sample'
  import { useDeployableSettingsContext } from '../use-deployable-settings'
  import DeployableMtlsGroup from './deployable-mtls-group.vue'
  import DeployableProtocolGroup from './deployable-protocol-group.vue'

  const { form, saving } = useDeployableSettingsContext()

  const advancedOpen = ref(false)
  const settingName = (value: string) =>
    optionLabel(linkedEnvironments.flatMap((environment) => environment.options))(value)
</script>

<template>
  <SettingsGroup
    label="Advanced settings"
    hint="Deployment Settings, protocols and mutual authentication, which most resources never change."
    anchor="advanced-settings"
    v-model:open="advancedOpen"
    collapsible
  >
    <div class="flex min-w-0 flex-col">
      <SettingsGroup
        label="Deployment Settings"
        hint="Which shared configuration each of this resource’s environments publishes with, linked automatically by deployment policy."
        anchor="deployment-settings"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-md)">
          <Alert
            severity="info"
            size="small"
            action-label="Manage Deployment Settings"
          >
            Deployment Settings centralize the services, policies and error pages that environments
            share. Every environment a domain answers in is linked to one automatically, matching
            that environment’s deployment policy.
          </Alert>

          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  v-for="environment in linkedEnvironments"
                  :key="environment.name"
                  :title="environment.name"
                >
                  <template #description>
                    <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                      <Tag
                        severity="info"
                        size="small"
                        :label="environment.policy"
                      />
                      <Tag
                        v-if="environment.auto && !form.deploymentSettings[environment.name]"
                        severity="neutral"
                        size="small"
                        label="Linked automatically"
                      />
                      <span class="text-body-xs text-(--text-muted)"
                        >Only {{ environment.policy }} Deployment Settings can be linked to this
                        environment.</span
                      >
                    </span>
                  </template>
                  <Select
                    :model-value="
                      form.deploymentSettings[environment.name] ?? environment.settingsId
                    "
                    size="large"
                    class="w-full"
                    placeholder="Select a deployment setting"
                    :readonly="saving"
                    :display-value="settingName"
                    @update:model-value="form.deploymentSettings[environment.name] = $event"
                  >
                    <Select.Trigger
                      class="w-full"
                      :aria-label="`Deployment Settings for ${environment.name}`"
                    />
                    <Select.Content>
                      <Select.Item
                        v-for="option in environment.options"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </div>
      </SettingsGroup>

      <DeployableProtocolGroup />

      <DeployableMtlsGroup />
    </div>
  </SettingsGroup>
</template>
```

## `parts/deployable-domains-group.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import {
    type DeployableDomainRow,
    sampleDeployableDomainColumns as domainColumns
  } from '../sample'
  import { useDeployableSettingsContext } from '../use-deployable-settings'

  const emit = defineEmits<{
    remove: [event: Event, row: DeployableDomainRow]
  }>()

  const { saving, domains } = useDeployableSettingsContext()

  const onDomainAction = (event: Event, value: string | number, row: DeployableDomainRow) => {
    if (value === 'delete') emit('remove', event, row)
  }
</script>

<template>
  <SettingsGroup
    label="Domains"
    hint="The addresses this resource answers on, the environment each one answers in, and the certificate it is served with."
    anchor="domains"
  >
    <Card :padded="false">
      <template #default>
        <div class="flex min-w-0 flex-col">
          <DataTable
            :data="domains"
            :columns="domainColumns"
            row-key="id"
            :bordered="false"
          >
            <template #cell-environment="{ value }">
              <Tag
                v-if="value"
                severity="neutral"
                size="medium"
                icon="az az-layers"
                :label="value"
              />
            </template>
            <template #cell-policy="{ row, value }">
              <template v-if="row.environment">{{ value }}</template>
            </template>
            <template #cell-certificate="{ value }">
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <i
                  class="az az-verified shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="min-w-0 truncate">{{ value }}</span>
              </span>
            </template>
            <template #cell-actions="{ row }">
              <DropdownMenu
                v-if="!row.generated"
                side="bottom"
                align="end"
                @select="(event, value) => onDomainAction(event, value, row)"
              >
                <DropdownMenu.Trigger>
                  <Tooltip content="Row actions">
                    <IconButton
                      icon="az az-ellipsis"
                      variant="outline"
                      size="small"
                      :disabled="saving"
                      :aria-label="`Actions for ${row.domain}`"
                    />
                  </Tooltip>
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="edit"
                    label="Edit"
                  >
                    <template #leading
                      ><i
                        class="az az-pencil"
                        aria-hidden="true"
                    /></template>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="delete"
                    label="Delete"
                    severity="danger"
                  >
                    <template #leading
                      ><i
                        class="az az-trash"
                        aria-hidden="true"
                    /></template>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenu>
            </template>
          </DataTable>

          <div
            class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
          >
            <span class="text-body-xs text-(--text-muted)"
              >{{ domains.length }} {{ domains.length === 1 ? 'domain' : 'domains' }}</span
            >
            <Button
              type="button"
              label="Add domain"
              variant="outline"
              size="medium"
              icon="az az-plus"
              :disabled="saving"
            />
          </div>
        </div>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/deployable-environment-switcher.vue`

```ts
<script setup lang="ts">
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import {
    sampleDeployableEnvironments as environments,
    sampleDeployableResource as record
  } from '../sample'

  const environment = ref('Production')
  const environmentQuery = ref('')
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((option) => option.name.toLowerCase().includes(needle))
  })
</script>

<template>
  <ConsoleLayout.Breadcrumb
    :items="[
      { label: 'Resources', href: '/resources' },
      { label: record.name, href: '/resources/1020655' }
    ]"
  >
    <Select
      :model-value="environment"
      :display-value="(value) => String(value ?? '')"
      variant="ghost"
      size="small"
      @update:model-value="
        (value) => {
          if (value !== '__add-environment__') environment = String(value)
        }
      "
      @update:open="
        (open) => {
          if (!open) environmentQuery = ''
        }
      "
    >
      <Select.Trigger aria-label="Switch environment" />
      <Select.Content>
        <template #search>
          <Input
            v-model="environmentQuery"
            size="small"
            placeholder="Search environments"
            aria-label="Search environments"
          >
            <template #leading>
              <i
                class="az az-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </template>
        <Select.Group label="Environments">
          <Select.Item
            v-for="option in environmentMatches"
            :key="option.name"
            :value="option.name"
          >
            {{ option.name }}
            <template #tag>
              <Tag
                :label="option.policy"
                severity="neutral"
                size="small"
              />
            </template>
          </Select.Item>
          <p
            v-if="!environmentMatches.length"
            class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
          >
            No environments match "{{ environmentQuery }}".
          </p>
        </Select.Group>
        <template #footer>
          <Select.Item
            value="__add-environment__"
            class="w-full"
          >
            <span class="flex items-center gap-(--spacing-xs)">
              <i
                class="az az-circle-plus"
                aria-hidden="true"
              />
              Add Environment
            </span>
          </Select.Item>
        </template>
      </Select.Content>
    </Select>
  </ConsoleLayout.Breadcrumb>
</template>
```

## `parts/deployable-mtls-group.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'

  import { optionLabel } from '../lib/option-label'
  import {
    sampleDeployableMtlsModes as mtlsModeOptions,
    sampleDeployableRevocationLists as revocationListOptions,
    sampleDeployableTrustedCas as trustedCaOptions
  } from '../sample'
  import { useDeployableSettingsContext } from '../use-deployable-settings'

  const { form, saving, armed } = useDeployableSettingsContext()

  const certificateName = (value: string) => (value ? optionLabel(trustedCaOptions)(value) : '')
  const crlLabel = (values: string[]) => values.map(optionLabel(revocationListOptions)).join(', ')
</script>

<template>
  <SettingsGroup
    label="Mutual authentication"
    hint="Require the client to present a certificate the resource can verify, as well as presenting its own."
    anchor="mutual-authentication"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Mutual authentication"
            description="Require the client to present a certificate the resource can verify, as well as presenting its own."
            variant="compact"
          >
            <Switch
              v-model="form.mtls.enabled"
              aria-label="Mutual authentication"
              :readonly="saving"
              :disabled="!form.protocols.useHttps"
            />
          </SettingsRow>
          <SettingsRow
            v-if="armed"
            key="mtls-mode"
            title="Mode"
            description="What happens when the client certificate cannot be validated against the Trusted CA."
            variant="stacked"
          >
            <RadioGroup
              v-model="form.mtls.mode"
              variant="card"
              name="mtls-mode"
              aria-label="Mutual authentication mode"
              :readonly="saving"
            >
              <RadioGroup.Item
                v-for="option in mtlsModeOptions"
                :key="option.value"
                :value="option.value"
                :description="option.description"
                >{{ option.label }}</RadioGroup.Item
              >
            </RadioGroup>
          </SettingsRow>
          <SettingsRow
            v-if="armed"
            key="mtls-certificate"
            title="Trusted CA certificate"
            description="The authority a client certificate is verified against."
          >
            <Select
              v-model="form.mtls.certificate"
              size="large"
              class="w-full"
              placeholder="Select a Trusted CA certificate"
              :readonly="saving"
              :display-value="certificateName"
            >
              <Select.Trigger
                class="w-full"
                aria-label="Trusted CA certificate"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in trustedCaOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
            <FieldError
              v-if="!form.mtls.certificate"
              id="mtls-certificate-message"
              >{{ 'Mutual authentication requires a Trusted CA certificate.' }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            v-if="armed"
            key="mtls-crl"
            title="Certificate revocation list"
            description="Revoked certificates are rejected during the handshake."
          >
            <MultiSelect
              v-model="form.mtls.crl"
              size="large"
              class="w-full"
              placeholder="Select a revocation list"
              :readonly="saving"
              :display-value="crlLabel"
            >
              <MultiSelect.Trigger aria-label="Certificate revocation list" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="option in revocationListOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/deployable-protocol-group.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'

  import { optionLabel } from '../lib/option-label'
  import {
    sampleDeployableCipherSuites as cipherSuiteOptions,
    sampleDeployableHttp3Ports as http3PortOptions,
    sampleDeployableHttpPorts as httpPortOptions,
    sampleDeployableHttpsPorts as httpsPortOptions,
    sampleDeployableTlsVersions as tlsVersionOptions
  } from '../sample'
  import { useDeployableSettingsContext } from '../use-deployable-settings'

  const { form, saving, secure, setHttps, setHttp3 } = useDeployableSettingsContext()

  const portsLabel = (values: number[]) =>
    values.map((value) => optionLabel([...httpPortOptions, ...httpsPortOptions])(value)).join(', ')
  const tlsVersionLabel = optionLabel(tlsVersionOptions)
  const cipherSuiteLabel = optionLabel(cipherSuiteOptions)
</script>

<template>
  <SettingsGroup
    label="Protocol settings"
    hint="Which protocols and ports this resource answers on, and the TLS floor it accepts."
    anchor="protocol-settings"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="HTTP ports"
            description="The ports this resource answers plain HTTP on."
          >
            <MultiSelect
              v-model="form.protocols.httpPorts"
              size="large"
              class="w-full"
              placeholder="Select an HTTP port"
              :readonly="saving"
              :display-value="portsLabel"
            >
              <MultiSelect.Trigger aria-label="HTTP ports" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="option in httpPortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
            <FieldError
              v-if="!form.protocols.httpPorts.length"
              id="http-ports-message"
              >{{ 'Select at least one HTTP port.' }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            title="HTTPS support"
            description="Answer on both HTTP and HTTPS. Required by HTTP/3 and by mutual authentication."
            variant="compact"
          >
            <Switch
              :model-value="form.protocols.useHttps"
              aria-label="HTTPS support"
              :readonly="saving"
              @update:model-value="setHttps"
            />
          </SettingsRow>
          <SettingsRow
            v-if="form.protocols.useHttps"
            key="https-ports"
            title="HTTPS ports"
            description="The ports this resource answers TLS traffic on."
          >
            <MultiSelect
              v-model="form.protocols.httpsPorts"
              size="large"
              class="w-full"
              placeholder="Select an HTTPS port"
              :readonly="saving"
              :display-value="portsLabel"
            >
              <MultiSelect.Trigger aria-label="HTTPS ports" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="option in httpsPortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
            <FieldError
              v-if="!form.protocols.httpsPorts.length"
              id="https-ports-message"
              >{{ 'Select at least one HTTPS port.' }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            title="HTTP/3 support"
            description="Serve over HTTP/3 (QUIC) where the client supports it. Turns HTTPS support on with it."
            variant="compact"
          >
            <Switch
              :model-value="form.protocols.useHttp3"
              aria-label="HTTP/3 support"
              :readonly="saving"
              @update:model-value="setHttp3"
            />
          </SettingsRow>
          <SettingsRow
            v-if="form.protocols.useHttp3"
            key="http3-ports"
            title="HTTP/3 ports"
            description="The ports QUIC is answered on."
          >
            <MultiSelect
              v-model="form.protocols.http3Ports"
              size="large"
              class="w-full"
              placeholder="Select an HTTP/3 port"
              :readonly="saving"
              :display-value="portsLabel"
            >
              <MultiSelect.Trigger aria-label="HTTP/3 ports" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="option in http3PortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
            <FieldError
              v-if="!form.protocols.http3Ports.length"
              id="http3-ports-message"
              >{{ 'Select at least one HTTP/3 port.' }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            v-if="secure"
            key="tls-version"
            title="Minimum TLS version"
            description="The oldest TLS version a client may negotiate with."
          >
            <Select
              v-model="form.protocols.minimumTlsVersion"
              size="large"
              class="w-full"
              :readonly="saving"
              :display-value="tlsVersionLabel"
            >
              <Select.Trigger
                class="w-full"
                aria-label="Minimum TLS version"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in tlsVersionOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            v-if="secure"
            key="cipher-suite"
            title="Cipher suite"
            description="The set of ciphers offered during the handshake."
          >
            <Select
              v-model="form.protocols.cipherSuite"
              size="large"
              class="w-full"
              :readonly="saving"
              :display-value="cipherSuiteLabel"
            >
              <Select.Trigger
                class="w-full"
                aria-label="Cipher suite"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in cipherSuiteOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/deployable-settings-page.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import {
    type DeployableDomainRow,
    sampleDeployableResource as record,
    sampleDeployableTabs as tabs
  } from '../sample'
  import { provideDeployableSettings } from '../use-deployable-settings'
  import DeployableAdvancedGroup from './deployable-advanced-group.vue'
  import DeployableDomainsGroup from './deployable-domains-group.vue'
  import DeployableEnvironmentSwitcher from './deployable-environment-switcher.vue'
  import SettingsSaveBar from './settings-save-bar.vue'

  const activeTab = ref('settings')

  const { form, saving, dirty, save, discard, nameError, removeDomain, leave } =
    provideDeployableSettings()

  const shownTab = computed({
    get: () => activeTab.value,
    set: async (value: string) => {
      if (!value || value === activeTab.value) return
      if (!(await leave.confirmLeave())) return
      activeTab.value = value
    }
  })

  const deleteOpen = ref(false)
  const deleting = ref(false)

  const confirmDelete = () => {
    if (deleting.value) return
    deleting.value = true
    setTimeout(() => {
      deleting.value = false
      deleteOpen.value = false
    }, 900)
  }

  const pendingDomain = ref<DeployableDomainRow | null>(null)
  const domainDeleteOpen = ref(false)

  const onDomainRemove = (_event: Event, row: DeployableDomainRow) => {
    pendingDomain.value = row
    domainDeleteOpen.value = true
  }

  const confirmDomainDelete = () => {
    const removed = pendingDomain.value
    if (!removed) return
    removeDomain(removed.id)
    domainDeleteOpen.value = false
    toast.success(`${removed.domain} deleted.`)
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <DeployableEnvironmentSwitcher />
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="shownTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
        <template #actions>
          <Button
            label="Deploy"
            variant="outline"
            size="medium"
            icon="az az-cloud-upload"
          />
        </template>
      </PageTabs>
    </div>

    <section class="min-h-0 flex-1">
      <div>
        <div
          class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
        >
          <PageHeader
            title="Settings"
            description="Manage this resource’s configuration."
            size="small"
          />

          <form
            class="mt-(--layout-section-gap) flex min-w-0 flex-col"
            aria-label="Resource settings"
            novalidate
            @submit.prevent="save"
          >
            <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Resource settings</legend>

              <SettingsGroup
                label="General"
                hint="How this resource is identified across the platform, and whether it answers at all."
                anchor="general"
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Name"
                        description="A unique and descriptive name to identify the resource."
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            id="resource-name"
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            :readonly="saving"
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
                        description="When disabled, the resource stops answering and traffic to its domains is refused. Its deployments are kept."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                          :readonly="saving"
                        />
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <DeployableDomainsGroup @remove="onDomainRemove" />

              <DeployableAdvancedGroup />

              <SettingsGroup
                label="Danger zone"
                hint="Actions that cannot be undone."
                anchor="danger-zone"
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Delete this resource"
                        description="Once deleted, the resource and its deployments cannot be recovered."
                        variant="compact"
                      >
                        <ConfirmDialog
                          v-model:open="deleteOpen"
                          title="Delete resource"
                          size="medium"
                          confirm-label="Delete resource"
                          :confirmation-phrase="record.name"
                          :loading="deleting"
                          @confirm="confirmDelete"
                        >
                          <template #trigger>
                            <Button
                              type="button"
                              label="Delete resource"
                              variant="danger"
                              size="medium"
                              icon="az az-trash"
                              :disabled="saving"
                            />
                          </template>
                          <div class="flex flex-col gap-(--spacing-md)">
                            <Alert
                              severity="warning"
                              label="Once confirmed, this action can't be reversed."
                            />
                            <p class="m-0 text-body-sm text-(--text-muted)">
                              The resource will be deleted, along with its domains and deployments.
                            </p>
                          </div>
                        </ConfirmDialog>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>
            </fieldset>
          </form>
        </div>
      </div>
    </section>

    <SettingsSaveBar
      :visible="dirty || saving"
      :guard="leave"
      :saving="saving"
      @save="save"
      @discard="discard"
    >
      You have unsaved changes.
    </SettingsSaveBar>
    <ConfirmDialog
      v-model:open="domainDeleteOpen"
      title="Delete domain"
      size="medium"
      confirm-label="Delete domain"
      @confirm="confirmDomainDelete"
    >
      <p class="m-0 text-body-sm text-(--text-muted)">
        {{ pendingDomain?.domain }} is removed from this resource and stops answering for it.
      </p>
    </ConfirmDialog>
  </div>
</template>
```

## `parts/protocols-mtls-group.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed, ref } from 'vue'

  import { sampleMtlsModes as mtlsModes, sampleRevocationLists as revocationLists } from '../sample'
  import { useProtocolsSettingsContext } from '../use-protocols-settings'

  const emit = defineEmits<{
    upload: []
  }>()

  const { form, saving, errors, armed, trustedCas, pickCa: choose } = useProtocolsSettingsContext()

  const caLabel = (value: string) =>
    trustedCas.value.find((option) => option.value === value)?.label ?? String(value)
  const listLabel = (values: unknown[] | undefined) => (values ?? []).join(', ')

  const caQuery = ref('')
  const caMatches = computed(() => {
    const needle = caQuery.value.trim().toLowerCase()
    return needle
      ? trustedCas.value.filter((option) => option.label.includes(needle))
      : trustedCas.value
  })
  const pickCa = (value: string) => {
    if (value === '__upload__') {
      emit('upload')
      return
    }
    choose(value)
  }
</script>

<template>
  <SettingsGroup
    label="Mutual authentication"
    hint="Ask each client for a certificate the workload can verify, as well as presenting its own."
    anchor="mutual-authentication"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="mtls"
              title="Mutual authentication"
              description="Clients without a valid certificate are refused or flagged, depending on the mode."
              variant="compact"
            >
              <Switch
                v-model="form.mtls"
                aria-label="Mutual authentication"
                :readonly="saving"
                :disabled="!form.useHttps"
              />
              <FieldDescription v-if="!form.useHttps"
                >Turn on HTTPS support to use mutual authentication.</FieldDescription
              >
            </SettingsRow>
            <SettingsRow
              v-if="armed"
              key="mtlsMode"
              title="Mode"
              description="What happens when a client certificate cannot be verified."
              variant="stacked"
              :depth="1"
            >
              <RadioGroup
                v-model="form.mtlsMode"
                variant="card"
                name="protocols-mtls-mode"
                aria-label="Mutual authentication mode"
                :readonly="saving"
              >
                <RadioGroup.Item
                  v-for="option in mtlsModes"
                  :key="option.value"
                  :value="option.value"
                  :description="option.description"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </SettingsRow>
            <SettingsRow
              v-if="armed"
              key="trustedCa"
              title="Trusted CA certificate"
              description="The authority client certificates are verified against."
              :depth="1"
            >
              <Select
                :model-value="form.trustedCa"
                size="large"
                class="w-full"
                placeholder="Select a trusted CA certificate"
                :display-value="caLabel"
                :readonly="saving"
                required
                :invalid="errors.trustedCa?.type === 'required'"
                @update:model-value="pickCa"
                @update:open="(open) => !open && (caQuery = '')"
              >
                <Select.Trigger
                  id="protocols-trustedCa"
                  aria-label="Trusted CA certificate"
                  :aria-describedby="errors.trustedCa ? 'protocols-trustedCa-message' : undefined"
                />
                <Select.Content>
                  <template #search>
                    <Input
                      v-model="caQuery"
                      size="small"
                      placeholder="Search certificates"
                      aria-label="Search certificates"
                    >
                      <template #leading>
                        <i
                          class="az az-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </template>
                  <Select.Group label="Trusted CA certificates">
                    <Select.Item
                      v-for="option in caMatches"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                      <template #tag>
                        <span class="text-body-xs text-(--text-muted)">{{ option.expires }}</span>
                      </template>
                    </Select.Item>
                    <p
                      v-if="!caMatches.length"
                      class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
                    >
                      No certificate matches "{{ caQuery }}".
                    </p>
                  </Select.Group>
                  <template #footer>
                    <Select.Item
                      value="__upload__"
                      class="w-full"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">
                        <i
                          class="az az-upload"
                          aria-hidden="true"
                        />
                        Upload certificate
                      </span>
                    </Select.Item>
                  </template>
                </Select.Content>
              </Select>
              <FieldError
                v-if="errors.trustedCa"
                id="protocols-trustedCa-message"
                >{{ errors.trustedCa.message }}</FieldError
              >
            </SettingsRow>
            <SettingsRow
              v-if="armed"
              key="crl"
              title="Certificate revocation lists"
              description="Certificates on these lists are refused during the handshake."
              :depth="1"
            >
              <MultiSelect
                v-model="form.crl"
                size="large"
                class="w-full"
                placeholder="No revocation list"
                :display-value="listLabel"
                :readonly="saving"
              >
                <MultiSelect.Trigger
                  id="protocols-crl"
                  aria-label="Certificate revocation lists"
                />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="option in revocationLists"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </MultiSelect.Item>
                </MultiSelect.Content>
              </MultiSelect>
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/protocols-page.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  import {
    sampleCipherSuites as cipherSuites,
    sampleHttp3Ports as http3Ports,
    sampleHttpPorts as httpPorts,
    sampleHttpsPorts as httpsPorts,
    sampleTlsVersions as tlsVersions
  } from '../sample'
  import { provideProtocolsSettings } from '../use-protocols-settings'
  import ProtocolsMtlsGroup from './protocols-mtls-group.vue'
  import ProtocolsUploadDrawer from './protocols-upload-drawer.vue'
  import SettingsSaveBar from './settings-save-bar.vue'

  type LabeledOption = SelectOptionItem<string | number>

  const labelOf = (options: LabeledOption[]) => (value: string | number) =>
    options.find((option) => option.value === value)?.label ?? String(value)
  const portsLabel = (values: unknown[] | undefined) => (values ?? []).join(', ')

  const { form, saving, dirty, errors, clear, save, discard, setHttps, setHttp3, addCa, leave } =
    provideProtocolsSettings()

  const uploadOpen = ref(false)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <form
      class="flex min-h-0 min-w-0 flex-1 flex-col"
      aria-label="Protocol settings"
      novalidate
      @submit.prevent="save"
    >
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeader
          title="Protocols"
          description="How clients connect to storefront: ports, TLS, and whether they must present a certificate."
          size="small"
        />

        <fieldset class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0">
          <legend class="sr-only">Protocol settings</legend>

          <SettingsGroup
            label="Protocols"
            hint="The ports and TLS settings clients connect to this workload with."
            anchor="protocols"
          >
            <Card :padded="false">
              <template #default>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingsRow
                      key="httpPorts"
                      title="HTTP ports"
                      description="The ports this workload answers plain HTTP on."
                    >
                      <MultiSelect
                        v-model="form.httpPorts"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTP port"
                        :display-value="portsLabel"
                        :readonly="saving"
                        required
                        :invalid="!!errors.httpPorts"
                        :aria-describedby="
                          errors.httpPorts ? 'protocols-httpPorts-message' : undefined
                        "
                        @update:model-value="clear('httpPorts')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-httpPorts"
                          aria-label="HTTP ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Item
                            v-for="option in httpPorts"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Item>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <FieldError
                        v-if="errors.httpPorts"
                        id="protocols-httpPorts-message"
                        >{{ errors.httpPorts.message }}</FieldError
                      >
                    </SettingsRow>
                    <SettingsRow
                      key="useHttps"
                      title="HTTPS support"
                      description="Answer on HTTPS as well as HTTP. HTTP/3 and mutual authentication need it."
                      variant="compact"
                    >
                      <Switch
                        :model-value="form.useHttps"
                        aria-label="HTTPS support"
                        :readonly="saving"
                        @update:model-value="setHttps"
                      />
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.useHttps"
                      key="httpsPorts"
                      title="HTTPS ports"
                      description="The ports this workload answers TLS traffic on."
                      :depth="1"
                    >
                      <MultiSelect
                        v-model="form.httpsPorts"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTPS port"
                        :display-value="portsLabel"
                        :readonly="saving"
                        required
                        :invalid="!!errors.httpsPorts"
                        :aria-describedby="
                          errors.httpsPorts ? 'protocols-httpsPorts-message' : undefined
                        "
                        @update:model-value="clear('httpsPorts')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-httpsPorts"
                          aria-label="HTTPS ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Item
                            v-for="option in httpsPorts"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Item>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <FieldError
                        v-if="errors.httpsPorts"
                        id="protocols-httpsPorts-message"
                        >{{ errors.httpsPorts.message }}</FieldError
                      >
                    </SettingsRow>
                    <SettingsRow
                      key="useHttp3"
                      title="HTTP/3 support"
                      description="Serve over HTTP/3 where the client supports it. Turns HTTPS support on with it."
                      variant="compact"
                    >
                      <Switch
                        :model-value="form.useHttp3"
                        aria-label="HTTP/3 support"
                        :readonly="saving"
                        @update:model-value="setHttp3"
                      />
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.useHttp3"
                      key="http3Ports"
                      title="HTTP/3 ports"
                      description="The ports QUIC is answered on."
                      :depth="1"
                    >
                      <MultiSelect
                        v-model="form.http3Ports"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTP/3 port"
                        :display-value="portsLabel"
                        :readonly="saving"
                        required
                        :invalid="!!errors.http3Ports"
                        :aria-describedby="
                          errors.http3Ports ? 'protocols-http3Ports-message' : undefined
                        "
                        @update:model-value="clear('http3Ports')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-http3Ports"
                          aria-label="HTTP/3 ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Item
                            v-for="option in http3Ports"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Item>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <FieldError
                        v-if="errors.http3Ports"
                        id="protocols-http3Ports-message"
                        >{{ errors.http3Ports.message }}</FieldError
                      >
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.useHttps"
                      key="minimumTls"
                      title="Minimum TLS version"
                      description="The oldest TLS version a client may negotiate."
                    >
                      <Select
                        v-model="form.minimumTls"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(tlsVersions)"
                        :readonly="saving"
                      >
                        <Select.Trigger aria-label="Minimum TLS version" />
                        <Select.Content>
                          <Select.Item
                            v-for="option in tlsVersions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.useHttps"
                      key="cipherSuite"
                      title="Cipher suite"
                      description="The ciphers offered during the handshake."
                    >
                      <Select
                        v-model="form.cipherSuite"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(cipherSuites)"
                        :readonly="saving"
                      >
                        <Select.Trigger aria-label="Cipher suite" />
                        <Select.Content>
                          <Select.Item
                            v-for="option in cipherSuites"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </SettingsRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsGroup>
          <ProtocolsMtlsGroup @upload="uploadOpen = true" />
        </fieldset>
      </div>

      <SettingsSaveBar
        :visible="dirty || saving"
        :guard="leave"
        :saving="saving"
        @save="save"
        @discard="discard"
      >
        Protocol settings changed.
        <span class="text-(--text-muted)">Saving deploys storefront to Production.</span>
      </SettingsSaveBar>
    </form>

    <ProtocolsUploadDrawer
      v-model:open="uploadOpen"
      @added="addCa"
    />
  </div>
</template>
```

## `parts/protocols-upload-drawer.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  import type { FieldProblems } from '../use-deploy-on-save'

  const emit = defineEmits<{
    added: [value: string]
  }>()

  const uploadOpen = defineModel<boolean>('open', { default: false })

  const upload = reactive({ name: '', pem: '' })
  const uploadErrors = reactive<FieldProblems>({})

  const nameProblem = (name: string) =>
    name
      ? { type: 'invalid' as const, message: 'Use lowercase letters, numbers and hyphens only.' }
      : { type: 'required' as const, message: 'Enter a name for the certificate.' }
  const pemProblem = (pem: string) =>
    pem
      ? {
          type: 'invalid' as const,
          message: 'Paste a PEM certificate, starting with BEGIN CERTIFICATE.'
        }
      : { type: 'required' as const, message: 'Paste the CA certificate.' }

  const submitUpload = () => {
    Object.keys(uploadErrors).forEach((key) => delete uploadErrors[key])
    if (!/^[a-z0-9-]+$/.test(upload.name.trim()))
      uploadErrors.name = nameProblem(upload.name.trim())
    if (!upload.pem.includes('BEGIN CERTIFICATE')) uploadErrors.pem = pemProblem(upload.pem.trim())
    if (Object.keys(uploadErrors).length) return
    emit('added', upload.name.trim())
    upload.name = ''
    upload.pem = ''
    uploadOpen.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="uploadOpen"
    side="end"
    size="large"
  >
    <DrawerContent>
      <form
        class="flex h-full min-h-0 flex-col"
        novalidate
        @submit.prevent="submitUpload"
      >
        <PanelHeader class="w-full">
          <DrawerTitle>Upload certificate</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <DrawerDescription>
              A trusted CA certificate in PEM format. It is added to the account and picked for this
              workload.
            </DrawerDescription>
            <Field>
              <Field.Label for="protocols-upload-name">
                <span class="text-label-md">Name</span>
              </Field.Label>
              <Input
                id="protocols-upload-name"
                v-model="upload.name"
                size="large"
                class="w-full"
                placeholder="partners-ca"
                autocomplete="off"
                required
                :invalid="!!uploadErrors.name"
                :aria-describedby="uploadErrors.name ? 'protocols-upload-name-message' : undefined"
              />
              <FieldError
                v-if="uploadErrors.name"
                id="protocols-upload-name-message"
                >{{ uploadErrors.name.message }}</FieldError
              >
            </Field>
            <Field>
              <Field.Label for="protocols-upload-pem">
                <span class="text-label-md">Certificate</span>
              </Field.Label>
              <Textarea
                id="protocols-upload-pem"
                v-model="upload.pem"
                class="w-full"
                :rows="8"
                placeholder="-----BEGIN CERTIFICATE-----"
                required
                :invalid="!!uploadErrors.pem"
                :aria-describedby="uploadErrors.pem ? 'protocols-upload-pem-message' : undefined"
              />
              <FieldError
                v-if="uploadErrors.pem"
                id="protocols-upload-pem-message"
                >{{ uploadErrors.pem.message }}</FieldError
              >
            </Field>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              @click="uploadOpen = false"
            />
            <Button
              type="submit"
              label="Upload"
              variant="primary"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
```

## `parts/resource-settings-page.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  import { useSettingsDraft } from '../use-settings-draft'
  import SettingsSaveBar from './settings-save-bar.vue'

  type FieldProblem = { type: 'helper' | 'invalid' | 'required'; message: string }

  const typeOptions = [
    {
      value: 'asn',
      label: 'ASN',
      description: 'Identify networks by Autonomous System Number. Suited to grouping traffic.'
    },
    {
      value: 'ip_cidr',
      label: 'IP/CIDR',
      description:
        'Specific IP addresses or ranges in CIDR notation, for precise traffic segmentation.'
    },
    {
      value: 'countries',
      label: 'Countries',
      description: 'Group traffic by country, for location-based rules.'
    }
  ]

  const record = {
    name: 'office-ranges',
    type: 'ip_cidr',
    items: '192.0.2.10\n198.51.100.24\n203.0.113.7 #comment'
  }

  const errors = reactive<Record<string, FieldProblem | undefined>>({})

  const LIST_PATTERN = /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/
  const COUNTRY_PATTERN = /^[^\S\n]*[A-Za-z]{2}[^\S\n]*(\n[^\S\n]*[A-Za-z]{2}[^\S\n]*)*$/

  const clear = (id: string) => {
    if (errors[id]) delete errors[id]
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    const name = form.name.trim()
    const items = form.items.trim()
    if (!name) errors.name = { type: 'required', message: 'This field is required.' }
    else if (name.length > 250)
      errors.name = { type: 'invalid', message: 'Use at most 250 characters.' }
    if (!items) errors.items = { type: 'required', message: 'This field is required.' }
    else if (form.type === 'countries' && !COUNTRY_PATTERN.test(items))
      errors.items = {
        type: 'invalid',
        message: 'Enter one two-letter country code per line. Example: BR.'
      }
    else if (form.type !== 'countries' && !LIST_PATTERN.test(items))
      errors.items = {
        type: 'invalid',
        message: 'Remove the empty lines. Every line holds one entry.'
      }
    return Object.keys(errors).length === 0
  }

  const { form, saving, dirty, save, discard, leave } = useSettingsDraft(record, { validate })
</script>

<template>
  <form
    class="flex min-h-0 min-w-0 flex-1 flex-col"
    aria-label="access list settings"
    novalidate
    @submit.prevent="save"
  >
    <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Group networks once and reference them from policy rules, instead of restating a range per rule."
        size="small"
      />

      <fieldset class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0">
        <legend class="sr-only">access list settings</legend>

        <SettingsGroup
          label="General"
          hint="Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in policy rules."
          anchor="general"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingsRow
                    key="name"
                    title="Name"
                    description="Give a unique and descriptive name to identify the access list."
                  >
                    <Input
                      v-model="form.name"
                      size="large"
                      class="w-full"
                      aria-label="Name"
                      placeholder="office-ranges"
                      autocomplete="off"
                      required
                      :invalid="!!errors.name"
                      :aria-describedby="errors.name ? 'access-lists-name-message' : undefined"
                      :readonly="saving"
                      @update:model-value="clear('name')"
                    />
                    <FieldError
                      v-if="errors.name"
                      id="access-lists-name-message"
                      >{{ errors.name.message }}</FieldError
                    >
                  </SettingsRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>

        <SettingsGroup
          label="List settings"
          hint="The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it."
          anchor="list-settings"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingsRow
                    key="type"
                    title="Type"
                    variant="stacked"
                  >
                    <RadioGroup
                      v-model="form.type"
                      variant="card"
                      name="access-lists-type"
                      aria-label="Type"
                      :readonly="saving"
                    >
                      <RadioGroup.Item
                        v-for="option in typeOptions"
                        :key="option.value"
                        :value="option.value"
                        :description="option.description"
                        >{{ option.label }}</RadioGroup.Item
                      >
                    </RadioGroup>
                  </SettingsRow>
                  <SettingsRow
                    v-if="form.type === 'asn'"
                    key="items-asn"
                    title="List"
                    description="One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed."
                    variant="stacked"
                  >
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="List"
                      placeholder="13335&#10;53331"
                      monospace
                      required
                      :invalid="!!errors.items"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :readonly="saving"
                      @update:model-value="clear('items')"
                    />
                    <FieldError
                      v-if="errors.items"
                      id="access-lists-items-message"
                      >{{ errors.items.message }}</FieldError
                    >
                  </SettingsRow>
                  <SettingsRow
                    v-else-if="form.type === 'ip_cidr'"
                    key="items-ip-cidr"
                    title="List"
                    variant="stacked"
                  >
                    <template #description>
                      One address or range per line. Add a comment after
                      <code class="whitespace-nowrap font-(family-name:--font-code)">#</code>, and a
                      date with
                      <code class="whitespace-nowrap font-(family-name:--font-code)">--LT</code>.
                      Duplicate entries are removed.
                    </template>
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="List"
                      placeholder="192.0.2.10&#10;198.51.100.24&#10;203.0.113.7 #comment"
                      monospace
                      required
                      :invalid="!!errors.items"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :readonly="saving"
                      @update:model-value="clear('items')"
                    />
                    <FieldError
                      v-if="errors.items"
                      id="access-lists-items-message"
                      >{{ errors.items.message }}</FieldError
                    >
                  </SettingsRow>
                  <SettingsRow
                    v-else
                    key="items-countries"
                    title="Countries"
                    description="One or more countries, one two-letter ISO 3166-1 code per line, such as BR."
                    variant="stacked"
                  >
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="Countries"
                      placeholder="BR&#10;US"
                      monospace
                      required
                      :invalid="!!errors.items"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :readonly="saving"
                      @update:model-value="clear('items')"
                    />
                    <FieldError
                      v-if="errors.items"
                      id="access-lists-items-message"
                      >{{ errors.items.message }}</FieldError
                    >
                  </SettingsRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>
      </fieldset>
    </div>

    <SettingsSaveBar
      :visible="dirty || saving"
      :guard="leave"
      :saving="saving"
      @save="save"
      @discard="discard"
    >
      You have unsaved changes.
    </SettingsSaveBar>
  </form>
</template>
```

## `parts/waf-settings-page.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'

  import { useSettingsDraft } from '../use-settings-draft'
  import SettingsTabPage from './settings-tab-page.vue'

  type WafMode = 'blocking' | 'learning'
  type Sensitivity = 'highest' | 'high' | 'medium' | 'low' | 'lowest'

  interface Threat {
    id: string
    label: string
    hint: string
    enabled: boolean
    sensitivity: Sensitivity
  }

  interface RuleSet {
    name: string
    active: boolean
    mode: WafMode
    threats: Threat[]
  }

  const tabs = [
    { value: 'main-settings', label: 'Main settings' },
    { value: 'tuning', label: 'Tuning' },
    { value: 'allowed-rules', label: 'Allowed rules' }
  ]
  const activeTab = ref('main-settings')

  const MODES: { value: WafMode; label: string }[] = [
    { value: 'blocking', label: 'Blocking' },
    { value: 'learning', label: 'Learning' }
  ]
  const SENSITIVITIES: { value: Sensitivity; label: string }[] = [
    { value: 'highest', label: 'Highest' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'lowest', label: 'Lowest' }
  ]
  const modeLabel = (value: string) => MODES.find((mode) => mode.value === value)?.label ?? ''
  const sensitivityLabel = (value: string) =>
    SENSITIVITIES.find((level) => level.value === value)?.label ?? ''

  const threat = (
    id: string,
    label: string,
    hint: string,
    enabled: boolean,
    sensitivity: Sensitivity = 'medium'
  ): Threat => ({ id, label, hint, enabled, sensitivity })

  const record: RuleSet = {
    name: 'Core protection',
    active: true,
    mode: 'blocking',
    threats: [
      threat(
        'sql-injection',
        'SQL injection',
        'Detects attempts to inject SQL statements through the request to read or change the database behind it.',
        true,
        'high'
      ),
      threat(
        'remote-file-inclusion',
        'Remote file inclusion',
        'Detects attempts to make the application load and run a file hosted somewhere else.',
        true,
        'high'
      ),
      threat(
        'directory-traversal',
        'Directory traversal',
        'Detects attempts to reach files outside the intended directory by walking the path.',
        true,
        'high'
      ),
      threat(
        'cross-site-scripting',
        'Cross-site scripting',
        'Stops client-side scripts from being injected into the pages visitors see.',
        true,
        'high'
      ),
      threat('file-upload', 'File upload', 'Detects attempts to upload files.', false),
      threat(
        'evading-tricks',
        'Evading tricks',
        'Stops encoding tricks meant to slip past the other checks.',
        false
      ),
      threat(
        'unwanted-access',
        'Unwanted access',
        'Detects requests aimed at administrative pages, vulnerable files or applications that are not meant to be public.',
        false
      ),
      threat(
        'identified-attack',
        'Identified attack',
        'Detects requests that carry the signature of known attacks and exploit kits.',
        true,
        'high'
      )
    ]
  }

  const nameError = ref(false)

  const validate = () => {
    if (form.name.trim()) return true
    nameError.value = true
    nextTick(() => document.getElementById('waf-name')?.focus())
    return false
  }

  const { form, saving, dirty, save, discard, leave } = useSettingsDraft(record, {
    validate,
    onSaved: () =>
      toast.success('Rule set saved.', {
        description: 'The new posture applies to traffic on the next deployment.'
      })
  })
  const enabledCount = computed(() => form.threats.filter((item) => item.enabled).length)

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
    :tabs="tabs"
    title="Main settings"
    description="How this rule set is identified, and what it inspects requests for."
    docs-href="https://example.com/docs/waf-rule-sets"
    :dirty="dirty"
    :saving="saving"
    :guard="leave"
    @save="save"
    @discard="discard"
  >
    <SettingsGroup
      label="General"
      hint="How this rule set is identified across the console."
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              title="Name"
              description="A unique and descriptive name to identify the rule set."
            >
              <div class="flex w-full flex-col gap-(--spacing-xs)">
                <Input
                  id="waf-name"
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  aria-label="Name"
                  autocomplete="off"
                  :readonly="saving"
                  required
                  :invalid="nameError"
                  :aria-describedby="nameError ? 'waf-name-message' : undefined"
                />
                <FieldError
                  v-if="nameError"
                  id="waf-name-message"
                  >This field is required.</FieldError
                >
              </div>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Status"
      hint="Whether the rule set inspects traffic, and what it does with what it matches."
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              title="Active"
              description="When off, the rule set stops inspecting requests entirely."
              variant="compact"
            >
              <Switch
                v-model="form.active"
                aria-label="Active"
                :readonly="saving"
              />
            </SettingsRow>
            <SettingsRow
              title="Mode"
              description="Blocking rejects a matched request. Learning lets it through and records the match on the Tuning tab."
            >
              <Select
                v-model="form.mode"
                size="large"
                class="w-full"
                placeholder="Select a mode"
                :readonly="saving"
                :display-value="modeLabel"
              >
                <Select.Trigger aria-label="Mode" />
                <Select.Content>
                  <Select.Item
                    v-for="mode in MODES"
                    :key="mode.value"
                    :value="mode.value"
                  >
                    {{ mode.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Threats"
      hint="The threat families this rule set inspects for, and how strictly each one is applied. Higher sensitivity catches more attacks and more legitimate requests."
    >
      <Card :padded="false">
        <template #default>
          <Item.List :aria-label="`Threats, ${enabledCount} of ${form.threats.length} on`">
            <SettingsRow
              v-for="item in form.threats"
              :key="item.id"
              :title="item.label"
              :description="item.hint"
              :data-threat="item.id"
            >
              <div class="flex w-full min-w-0 items-center justify-end gap-(--spacing-sm)">
                <Select
                  v-model="item.sensitivity"
                  size="medium"
                  class="w-full max-w-(--container-3xs)"
                  :readonly="saving"
                  :disabled="!item.enabled"
                  :display-value="sensitivityLabel"
                >
                  <Select.Trigger :aria-label="`${item.label} sensitivity`" />
                  <Select.Content>
                    <Select.Item
                      v-for="level in SENSITIVITIES"
                      :key="level.value"
                      :value="level.value"
                    >
                      {{ level.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
                <Switch
                  v-model="item.enabled"
                  :aria-label="item.label"
                  :readonly="saving"
                />
              </div>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>
    <template #message> Rule set changed. Saving applies it on the next deployment. </template>
  </SettingsTabPage>
</template>
```

## `use-cache-settings.ts`

```ts
import { inject, type InjectionKey, provide } from 'vue'

import { sampleCacheSetting } from './sample'
import {
  type DeployToastText,
  type FieldProblems,
  useDeployOnSave,
  type UseDeployOnSaveReturn
} from './use-deploy-on-save'

export type CacheSettingRecord = typeof sampleCacheSetting

export type CacheSettingsContext = UseDeployOnSaveReturn<CacheSettingRecord>

const CacheSettingsInjectionKey: InjectionKey<CacheSettingsContext> = Symbol('CacheSettings')

const varies = (behavior: string) => ['allowlist', 'denylist'].includes(behavior)

function checkCacheSetting(form: CacheSettingRecord, problems: FieldProblems): void {
  if (!form.name.trim()) {
    problems.name = { type: 'required', message: 'Enter a name for this cache setting.' }
  } else if (!/^[a-z0-9-]+$/.test(form.name.trim())) {
    problems.name = {
      type: 'invalid',
      message: 'Use lowercase letters, numbers and hyphens only.'
    }
  }
  if (form.edgeBehavior === 'override' && form.edgeMaxAge < 60) {
    problems.edgeMaxAge = {
      type: 'invalid',
      message: 'The edge keeps an object for at least 60 seconds.'
    }
  }
  if (varies(form.queryStringBehavior) && !form.queryStringFields.trim()) {
    problems.queryStringFields = {
      type: 'required',
      message: 'List at least one query string field.'
    }
  }
  if (varies(form.cookieBehavior) && !form.cookieNames.trim()) {
    problems.cookieNames = { type: 'required', message: 'List at least one cookie name.' }
  }
}

export function provideCacheSettings(): CacheSettingsContext {
  const settings = useDeployOnSave(sampleCacheSetting, {
    toastId: 'cache-settings-deploy',
    fieldPrefix: 'cache',
    fieldOrder: ['name', 'edgeMaxAge', 'queryStringFields', 'cookieNames'],
    check: (problems) => checkCacheSetting(settings.form, problems),
    loading: (): DeployToastText => ({
      title: `Deploying ${settings.form.name}…`,
      description: 'storefront-app keeps serving the current cache rules until it finishes.'
    }),
    success: (): DeployToastText => ({
      title: `${settings.form.name} is live.`,
      description: 'Production caches with the new rules from now on.'
    })
  })
  provide(CacheSettingsInjectionKey, settings)
  return settings
}

export function useCacheSettingsContext(): CacheSettingsContext {
  const context = inject(CacheSettingsInjectionKey, null)
  if (!context) throw new Error('useCacheSettingsContext must be used within CacheSettingsPage.')
  return context
}
```

## `use-data-stream.ts`

```ts
import {
  useUnsavedChanges,
  type UseUnsavedChangesReturn
} from '@aziontech/webkit/use-unsaved-changes'
import { focusFirstInvalid } from '@aziontech/webkit/utils/focus-invalid'
import {
  type ComputedRef,
  inject,
  type InjectionKey,
  nextTick,
  provide,
  reactive,
  readonly,
  type Ref,
  ref,
  watch
} from 'vue'

import { checkDataStream } from './lib/data-stream-checks'
import { sampleDataStream } from './sample'
import type { FieldProblems } from './use-deploy-on-save'

export type DataStreamRecord = typeof sampleDataStream

export interface DataStreamContext {
  /** The editable copy of the stream. */
  form: DataStreamRecord
  /** The save is in flight. */
  saving: Readonly<Ref<boolean>>
  /** The form differs from the saved stream. */
  dirty: ComputedRef<boolean>
  /** The problems the last save found, by field key. */
  errors: FieldProblems
  /** Why the destination refused the test record, shown above the Destination card. */
  destinationError: Readonly<Ref<string>>
  /** Drops the problem of one field once it is edited. */
  clear: (id: string) => void
  /** Drops the problem of one destination field and the destination error. */
  onDestinationChange: (id: string) => void
  /** Validates, then sends one test record and saves. */
  save: () => void
  /** Puts the saved stream back and drops every problem. */
  discard: () => void
  /** The leave guard: warns on reload and drives the leave dialog while the form is dirty. */
  leave: UseUnsavedChangesReturn<DataStreamRecord>
}

const DataStreamInjectionKey: InjectionKey<DataStreamContext> = Symbol('DataStream')

const unreachable = (value: string) => {
  try {
    return new URL(value).hostname.endsWith('.invalid')
  } catch {
    return false
  }
}

const focusFirstError = (errors: FieldProblems) =>
  nextTick(() => {
    const id = Object.keys(errors)[0]
    const field = id ? document.getElementById(`data-stream-${id}`) : null
    if (field?.matches('input, textarea, select, button')) field.focus()
    else void focusFirstInvalid(field)
  })

const settled = (saving: Ref<boolean>) =>
  new Promise<void>((resolve) => {
    if (!saving.value) return resolve()
    const stop = watch(saving, (next) => {
      if (next) return
      stop()
      resolve()
    })
  })

const guardDataStream = (form: DataStreamRecord, saving: Ref<boolean>, save: () => void) =>
  useUnsavedChanges(() => form, {
    onDiscard: (baseline) => Object.assign(form, baseline),
    onSave: () => {
      save()
      return settled(saving)
    }
  })

export function provideDataStream(): DataStreamContext {
  const form = reactive(structuredClone(sampleDataStream))
  const saving = ref(false)
  const leave = guardDataStream(form, saving, () => save())
  const errors = reactive<FieldProblems>({})
  const destinationError = ref('')

  const clear = (id: string) => {
    if (errors[id]) delete errors[id]
  }

  const onDestinationChange = (id: string) => {
    clear(id)
    destinationError.value = ''
  }

  const land = () => {
    saving.value = false
    const target = form.connector === 'analytics' ? 'analyticsUrl' : 'url'
    if (['standard', 'analytics'].includes(form.connector) && unreachable(form[target])) {
      destinationError.value =
        'The endpoint did not answer the test record, so the stream was not saved. Your other changes are still here.'
      errors[target] = {
        type: 'invalid',
        message: 'The endpoint did not answer within 10 seconds.'
      }
      nextTick(() => document.getElementById('destination')?.scrollIntoView({ block: 'start' }))
      focusFirstError(errors)
      return
    }
    leave.commit()
  }

  function save() {
    destinationError.value = ''
    if (!checkDataStream(form, errors)) {
      focusFirstError(errors)
      return
    }
    saving.value = true
    setTimeout(land, 900)
  }

  const discard = () => {
    leave.discard()
    Object.keys(errors).forEach((key) => delete errors[key])
    destinationError.value = ''
  }

  const context: DataStreamContext = {
    form,
    saving: readonly(saving),
    dirty: leave.isDirty,
    errors,
    destinationError: readonly(destinationError),
    clear,
    onDestinationChange,
    save,
    discard,
    leave
  }
  provide(DataStreamInjectionKey, context)
  return context
}

export function useDataStreamContext(): DataStreamContext {
  const context = inject(DataStreamInjectionKey, null)
  if (!context) throw new Error('useDataStreamContext must be used within DataStreamPage.')
  return context
}
```

## `use-deployable-settings.ts`

```ts
import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  nextTick,
  provide,
  readonly,
  type Ref,
  ref,
  watch
} from 'vue'

import {
  type DeployableDomainRow,
  sampleDeployableDomains,
  sampleDeployableResource
} from './sample'
import { useSettingsDraft, type UseSettingsDraftReturn } from './use-settings-draft'

export type DeployableResourceRecord = typeof sampleDeployableResource

export interface DeployableSettingsContext extends UseSettingsDraftReturn<DeployableResourceRecord> {
  /** Save found the Name empty. */
  nameError: Readonly<Ref<boolean>>
  /** HTTPS or HTTP/3 is on. */
  secure: ComputedRef<boolean>
  /** HTTPS is on and mutual authentication is on. */
  armed: ComputedRef<boolean>
  /** The domains the resource answers on. */
  domains: ComputedRef<DeployableDomainRow[]>
  /** Turns HTTPS on or off; off also turns HTTP/3 off. */
  setHttps: (value: boolean) => void
  /** Turns HTTP/3 on or off; on also turns HTTPS on. */
  setHttp3: (value: boolean) => void
  /** Removes one domain from the resource. */
  removeDomain: (id: string) => void
}

const DeployableSettingsInjectionKey: InjectionKey<DeployableSettingsContext> =
  Symbol('DeployableSettings')

export function provideDeployableSettings(): DeployableSettingsContext {
  const nameError = ref(false)
  const validate = () => {
    if (draft.form.name.trim()) return true
    nameError.value = true
    nextTick(() => document.getElementById('resource-name')?.focus())
    return false
  }
  const draft = useSettingsDraft(sampleDeployableResource, { validate })
  const { form } = draft
  const rows = ref<DeployableDomainRow[]>(structuredClone(sampleDeployableDomains))

  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const context: DeployableSettingsContext = {
    ...draft,
    nameError: readonly(nameError),
    secure: computed(() => form.protocols.useHttps || form.protocols.useHttp3),
    armed: computed(() => form.protocols.useHttps && form.mtls.enabled),
    domains: computed(() => rows.value),
    setHttps: (value) => {
      form.protocols.useHttps = value
      if (!value) form.protocols.useHttp3 = false
    },
    setHttp3: (value) => {
      form.protocols.useHttp3 = value
      if (value) form.protocols.useHttps = true
    },
    removeDomain: (id) => {
      rows.value = rows.value.filter((domain) => domain.id !== id)
    }
  }
  provide(DeployableSettingsInjectionKey, context)
  return context
}

export function useDeployableSettingsContext(): DeployableSettingsContext {
  const context = inject(DeployableSettingsInjectionKey, null)
  if (!context) {
    throw new Error('useDeployableSettingsContext must be used within DeployableSettingsPage.')
  }
  return context
}
```

## `use-protocols-settings.ts`

```ts
import { computed, type ComputedRef, inject, type InjectionKey, provide, ref } from 'vue'

import { sampleProtocolSettings, sampleTrustedCas } from './sample'
import {
  type DeployToastText,
  type FieldProblems,
  useDeployOnSave,
  type UseDeployOnSaveReturn
} from './use-deploy-on-save'

export type ProtocolSettingsRecord = typeof sampleProtocolSettings

/** A trusted CA certificate the workload can verify clients against. */
export interface ProtocolsTrustedCa {
  /** The certificate id. */
  value: string
  /** The certificate name. */
  label: string
  /** When the certificate expires. */
  expires: string
}

export interface ProtocolsSettingsContext extends UseDeployOnSaveReturn<ProtocolSettingsRecord> {
  /** HTTPS is on and mutual authentication is on. */
  armed: ComputedRef<boolean>
  /** The trusted CA certificates of the account. */
  trustedCas: ComputedRef<ProtocolsTrustedCa[]>
  /** Turns HTTPS on or off; off also turns HTTP/3 and mutual authentication off. */
  setHttps: (value: boolean) => void
  /** Turns HTTP/3 on or off; on also turns HTTPS on. */
  setHttp3: (value: boolean) => void
  /** Picks a trusted CA certificate. */
  pickCa: (value: string) => void
  /** Adds an uploaded certificate to the account and picks it. */
  addCa: (value: string) => void
}

const ProtocolsSettingsInjectionKey: InjectionKey<ProtocolsSettingsContext> =
  Symbol('ProtocolsSettings')

function checkProtocols(form: ProtocolSettingsRecord, armed: boolean, problems: FieldProblems) {
  if (!form.httpPorts.length) {
    problems.httpPorts = { type: 'required', message: 'Select at least one HTTP port.' }
  }
  if (form.useHttps && !form.httpsPorts.length) {
    problems.httpsPorts = { type: 'required', message: 'Select at least one HTTPS port.' }
  }
  if (form.useHttp3 && !form.http3Ports.length) {
    problems.http3Ports = { type: 'required', message: 'Select at least one HTTP/3 port.' }
  }
  if (armed && !form.trustedCa) {
    problems.trustedCa = {
      type: 'required',
      message: 'Mutual authentication needs a trusted CA certificate.'
    }
  }
}

export function provideProtocolsSettings(): ProtocolsSettingsContext {
  const draft = useDeployOnSave(sampleProtocolSettings, {
    toastId: 'protocols-deploy',
    fieldPrefix: 'protocols',
    fieldOrder: ['httpPorts', 'httpsPorts', 'http3Ports', 'trustedCa'],
    check: (problems) => checkProtocols(draft.form, armed.value, problems),
    loading: (): DeployToastText => ({
      title: 'Deploying storefront…',
      description: 'Clients keep connecting with the current settings until it finishes.'
    }),
    success: (): DeployToastText => ({
      title: 'storefront is live.',
      description: armed.value
        ? 'Production now asks every client for a certificate.'
        : 'Production answers on the new ports and TLS settings.'
    })
  })
  const { form, clear } = draft
  const armed = computed(() => form.useHttps && form.mtls)
  const cas = ref<ProtocolsTrustedCa[]>(structuredClone(sampleTrustedCas))

  const setHttps = (value: boolean) => {
    form.useHttps = value
    if (!value) {
      form.useHttp3 = false
      form.mtls = false
    }
  }
  const setHttp3 = (value: boolean) => {
    form.useHttp3 = value
    if (value) form.useHttps = true
  }
  const pickCa = (value: string) => {
    form.trustedCa = value
    clear('trustedCa')
  }
  const addCa = (value: string) => {
    cas.value = [...cas.value, { value, label: value, expires: 'Added now' }]
    pickCa(value)
  }

  const context: ProtocolsSettingsContext = {
    ...draft,
    armed,
    trustedCas: computed(() => cas.value),
    setHttps,
    setHttp3,
    pickCa,
    addCa
  }
  provide(ProtocolsSettingsInjectionKey, context)
  return context
}

export function useProtocolsSettingsContext(): ProtocolsSettingsContext {
  const context = inject(ProtocolsSettingsInjectionKey, null)
  if (!context) {
    throw new Error('useProtocolsSettingsContext must be used within ProtocolsPage.')
  }
  return context
}
```
