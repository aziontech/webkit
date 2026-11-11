# Edit resource

The settings page of one existing resource. The user comes here to change how the resource is named, what it runs with and whether it is active, review the change, and commit it or throw it away. Every field sits in a labeled section of the form column, and one save band appears only once something has changed, so the page reads as the resource's current state until the user edits it.

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

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Breadcrumb`, `Kbd`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The platform shell from `shells/console`: the `Sidebar` with `Brand`, `Command` search, the `Menu` of modules and the account `DropdownMenu`; the `GlobalHeader` with the resource `Breadcrumb` and the Create and Agent actions; and on small screens the same sidebar in a `Drawer`. The breadcrumb names the resource. See `skills/webkit-navigation`.

### B. Resource tabs — `PageTabs`, `Tabs` (optional)

A full-bleed `PageTabs` with one `Tabs.Item` per tab, Settings last. A first-level resource with no tabs drops this bar and renders the page at its own settings route.

### C. Page heading — `PageHeader` (required)

A small `PageHeader` titled Settings with one sentence about what these settings cover. It sits at the top of the form column, inside the scrolling region.

### D. Settings sections — `SettingsSection`, `Card`, `Item`, `SettingRow`, `Input`, `HelperText`, `Switch` (required)

One `form` with a disabled-while-saving `fieldset` and a visually hidden legend. Each `SettingsSection` has a title, a `hint` and an `anchor` for deep links, over a flush `Card :padded="false"` with an `Item.List` of `SettingRow`s. Text values are large `Input`s; an empty Name flags on Save with a required `HelperText` and takes focus; on and off values are `Switch`es in compact rows. Sections run in a fixed order: General first, optional groups in the middle, Status or Danger zone last. See `skills/webkit-form`.

### E. Locked settings — `Tooltip`, `Switch` (optional)

A setting the user cannot change here (a paid module, a module that is always on) keeps its row with a disabled `Switch` inside a `Tooltip` that says why, and a link in the description to where it can be changed, e.g. Contact sales.

### F. Save bar — `SaveBar`, `Button` (required)

Hidden at rest. On the first edit a `SaveBar` slides up at the bottom of the scroll region with the unsaved-changes label, an optional muted hint, and an outlined Discard beside a primary Save, both medium (stacked under the label on small screens). While saving, the fieldset is disabled, Save shows its loading state and Discard is disabled. The bar leaves when Save lands or when Discard restores the record.

### G. Conditional fields — `SettingRow`, `Input`, `HelperText` (optional)

When one choice decides which fields apply (a connector, a scope, a template), the choice (a `Select` or `Field` choice cards around `RadioButton`) comes first and the rows it unlocks follow it inside the same `Card`, entering with `animate-content-enter`. Hidden rows keep no value that Save sends. Credentials are `PasswordInput`s that cannot be read back after Save, and the row says so. In DataStream the workload scope is `Field` choice cards around `RadioButton`; the Sampling band appears only when the stream collects from every workload, and Sampling rate is a `NumberInput` with a `%` suffix.

### H. Template editor — `SettingRow`, `CodeEditor`, `HelperText` (optional)

A setting whose value is a document (a JSON data set) gets a stacked row, under the `Select` that picks the template. A preset is read-only: its document shows in a `CodeBlock` with Copy, and the row says how to edit (choose Custom template). A custom document is a `CodeEditor` (`language="json"`, a fixed `height`), checked on Save (`Write the data set as a JSON object.`); a product passes its Monaco `loader` for JSON validation as you type.

### I. Section warnings and server errors — `SettingsSection`, `Button` (optional)

A setting with a side effect beyond this resource carries a warning `Alert` above its section's `Card` while it is on (`Saving a stream with sampling on turns off every other data stream in this account.`). A server rejection scoped to one section follows the form-error rule (`platform/states/form-error`): one danger `Alert` above that section that says what happened and that nothing else was lost, with the recovery action on it (`Send test record`); the field it concerns turns invalid with its own one-line reason and takes the focus. Never a toast, never a summary at the top of the page. Saving a settings page is not a build or deploy, so the async-submit toast with Edit and Redeploy does not apply here.

### J. Leave guard — `Tabs`, `SaveBar` (optional)

`useUnsavedChanges(() => form)` keeps the saved baseline: `isDirty` drives the save bar and the `dirty` mark on the Settings `Tabs.Item` (a dot after the label, "Unsaved changes" for screen readers), `commit()` moves the baseline after a save and `discard()` restores it. Leaving while dirty (another tab, another route through `onBeforeRouteLeave(() => confirmLeave())`, a reload) asks first: the composable warns on `beforeunload` and drives one `ConfirmDialog` bound with `v-bind="dialogProps"`, whose actions are Keep editing, Discard changes and, when `onSave` is given, Save changes, which saves and then leaves. See `skills/webkit-form`.

### K. Changed elsewhere — `Button`, `SaveBar` (optional)

When the record was saved by someone else after the form opened, a warning `Alert` sits between the heading and the first section: a bold "Changed elsewhere." lead, one sentence that says nothing was lost and what Save will do, and a secondary Reload button in its action slot. Save does not overwrite silently: it opens a `ConfirmDialog` (kind `primary`) with Go back and Overwrite and save. Reload swaps the edits for the saved values and the notice becomes an info `Alert` "Edits discarded." with Undo, which brings the edits back. The save bar's hint and Discard label follow the notice ("Saving overwrites the version saved elsewhere.", "Discard and reload"). This is the form-error rule (`platform/states/form-error`) applied to an edit: one message above the form, the recovery action on it.

### L. Danger zone — `SettingsSection`, `Card`, `SettingRow`, `Button`, `Input` (optional)

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
- UnsavedChanges (leave guard): the Settings tab carries the dirty dot, and switching tabs while dirty opens the Unsaved changes dialog.

## Related

- `shells/console` — the platform shell around this page.
- `platform/create/single-page-create` — the create page that shares this field list.
- `platform/detail/attached-resources` — the Domains section body in DeployableSettings.
- `platform/delete/delete-with-confirmation` — the dialog behind the Danger zone action.
- `platform/settings/settings-form` — account settings that end with the same save band.
- `SaveBar` — the unsaved-changes band; see `skills/webkit-form`.
- `platform/states/form-error` — the section-scoped server error DataStream follows.
- `platform/dashboard/analytics-dashboard` (Metrics) — where the records a stream sends are counted.
- `useUnsavedChanges` — the dirty baseline and leave guard behind the save bar, the tab mark and the leave dialog.
- `platform/states/form-error` — the rule the changed-elsewhere notice follows.
