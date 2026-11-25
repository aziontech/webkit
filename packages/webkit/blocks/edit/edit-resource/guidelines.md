# Edit resource

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
