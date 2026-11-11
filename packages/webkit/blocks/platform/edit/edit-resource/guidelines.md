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

## Do

- Show the save bar only while the form differs from the saved record.
- Disable the whole fieldset while saving, not each field separately.
- Give every section a short hint that says what it controls, and an anchor so a link can land on it.
- Keep locked settings visible, disabled, with the reason and the way to unlock them.
- Put destructive actions in a Danger zone section at the end, never in the save bar.
- Check every field when Save is pressed and show errors only then; see `skills/webkit-errors`.

## Don't

- Don't place a permanent Save button at the top or bottom of the page; the save bar appears on demand.
- Don't save on each toggle; changes wait for Save.
- Don't hide fields the user cannot change; lock them and say why.
- Don't use `size="medium"` or larger for the Settings heading; the tab bar or breadcrumb already names the resource.
- Don't add a Cancel button that leaves the page; Discard restores the record in place.

## Copy

- **Heading:** "Settings", with one sentence ending in a period, e.g. "Core configuration for this project."
- **Section titles:** short nouns, e.g. "General", "Modules", "Subscription modules", "Status".
- **Row descriptions:** one sentence that says what the setting does, e.g. "When disabled, the project stops serving traffic."
- **Save bar:** state what changed and when it applies, e.g. "Project settings changed." with the hint "Saving publishes them on the next deployment."; buttons "Discard" and "Save".
- **Locked reason:** one sentence with the way out, e.g. "Contact sales to activate this module."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The form has an `aria-label` and its `fieldset` a visually hidden `legend` with the same words, e.g. "Main settings".
- Every `Input` and `Switch` has an `aria-label` matching its row title.
- A disabled `Switch` keeps its `Tooltip`, so keyboard and pointer users can still read why it is locked.
- External links open in a new tab with `rel="noopener noreferrer"` and an icon marked `aria-hidden="true"`.
- The save bar enters after the form in reading order and its motion respects reduced motion.

## States

- ProjectSettings: a project's Settings tab with General, Modules and Subscription modules; the save bar is hidden until an edit.
- DeployableSettings: a deployable resource's Settings tab with General, Domains, collapsed Advanced settings and the Danger zone, whose Delete resource opens the type-to-confirm `ConfirmDialog` of `platform/delete/delete-with-confirmation`.
- PolicySettings: a security policy's Settings tab with General, Modules with one locked on, Debug rules and Status.
- ResourceSettings: a first-level resource with no tabs at its own settings route; Save checks every field before it commits.
- UnsavedChanges: after one edit; the save bar is up with Discard and Save.
- Saving: while the request is in flight; Save is loading and Discard is disabled.

## Related

- `shells/console` — the platform shell around this page.
- `platform/create/single-page-create` — the create page that shares this field list.
- `platform/detail/attached-resources` — the Domains section body in DeployableSettings.
- `platform/delete/delete-with-confirmation` — the dialog behind the Danger zone action.
- `platform/settings/settings-form` — account settings that end with the same save band.
- `SaveBar` — the unsaved-changes band; see `skills/webkit-form`.
