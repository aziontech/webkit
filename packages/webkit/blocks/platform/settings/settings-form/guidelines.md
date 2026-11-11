# Settings form

The place the user goes to change how an account or a project behaves. They scan a few topics, change one or two values, and commit them knowing exactly what the save covers. The block is one layout with three save strategies: one save for a form that is one logical unit, one save per group, or one save per card on a long configuration page. The save model follows how the page is partitioned, not the container.

## When to use

- Account-level settings read as rows of a label, a description and a control (Profile, Preferences, Notifications): SaveAll.
- Topics on one page that the user commits independently, such as General and Notifications: SavePerGroup.
- A long configuration page where each topic needs an explanation and its own commit, such as Preview Toolbar and Deployment Protection: SavePerCard.

## When not to use

- The settings tab of one resource, with anchored sections and an unsaved-changes bar: use `platform/edit/edit-resource`.
- The signed-in user's full profile page with all its sections: use `platform/account/profile`.
- Creating a resource: use `platform/create/single-page-create` or `platform/create/create-in-drawer`.
- Walking every submit outcome (invalid fields, server rejection): use `platform/states/form-validation`.
- Deleting the account or a resource from a settings page: open `platform/delete/delete-with-confirmation` (its LabelledField variant) from an outlined row.

## Building blocks

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Breadcrumb`, `Kbd`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The platform shell: the resizable, collapsible `Sidebar` with the `Brand`, the `Menu` and the account footer; the `GlobalHeader` with the `Breadcrumb`, the `Command` palette opened from search and its `Kbd` hint, Create and the Agent `ButtonHighlight`; and on a phone the same navigation in a right `Drawer`. The scroll region beside it is unpadded so the save footer can run full bleed.

### B. Page heading — `PageHeader` (required)

A `PageHeader` at `size="small"` opens the form column (`layout-column-form`) with the page name and one sentence of purpose. Its `title-id` names the `form` through `aria-labelledby`. No actions in the heading: saving lives at the bottom.

### C. Topic sections — `Card`, `Item` (required)

Each topic is a section with a small heading (`text-heading-xxs`) over a flush `Card :padded="false"` whose content is an `Item.List`. Sections stack at the section step; the heading and its card sit at the group gap. In SaveAll the sections share one `fieldset` with a visually hidden `legend`; in SavePerGroup and SavePerCard each card holds its own `fieldset`.

### D. Setting rows — `SettingRow`, `Input`, `HelperText`, `Select`, `Switch` (required)

One `SettingRow` per setting, with a `title` and a one-sentence `description`. Text and choices take a large full-width `Input` or `Select`; a yes-or-no setting is a `Switch` in a `kind="compact"` row. Each control has an `aria-label` matching the row title. Required fields flag only after Save is pressed: the control turns `required` or `invalid` and a `HelperText` with an id tied through `aria-describedby` says what to fix. SavePerCard uses stacked `Label` and control fields under an info `Alert` instead of rows.

### E. Save — `SaveBar`, `Button` (required)

SaveAll ends with one full-bleed sticky `SaveBar kind="plain"` holding an outlined Discard and the primary Save, both medium. While saving, the `fieldset` and Discard are disabled and Save takes `:loading`. Discard puts back the last saved values and clears the errors. In SavePerGroup and SavePerCard there is no `SaveBar`: each `Card` footer carries a secondary Save for that card only, and SavePerCard puts an optional docs `Link` on the footer's start.

## Do

- Pick the save strategy from how the page is partitioned: one logical unit gets one save.
- Disable only the fieldset being saved; the other groups or cards stay editable.
- Drive Save's `:loading` and the fieldset's `disabled` from one `submitting` flag.
- Validate on submit only, show the error at the field it belongs to, and move focus to the first field in error.
- Keep every control in a row at the same size, and every row title in sentence case.
- Explain a card's effect in an info `Alert` at the top of the card, before its fields.

## Don't

- Don't mix a page-level `SaveBar` with per-card Save buttons on the same page.
- Don't put Save in the page heading or float it beside a single field.
- Don't flag empty required fields before the user presses Save.
- Don't add an error summary block or an `Alert` for field validation; the field's own state is the feedback.
- Don't put a consequence or a constraint in the row title; it goes in the description or the `Alert`.

## Copy

- **Page title:** the page's name, e.g. "Profile"; description: one sentence with a period, e.g. "Define and manage personal account preferences."
- **Breadcrumb:** the parent, then the page title exactly, e.g. "Account settings" › "Profile".
- **Choices:** sentence case and no parentheses, e.g. "Team default", "Standard protection".
- **Section heading:** a short topic noun, e.g. "General", "Notifications".
- **Row title:** names the setting in one to three words, e.g. "Timezone"; description: one sentence with a period, e.g. "Times across the app are shown in this zone."
- **Save:** exactly "Save" for the footer and every group or card; Discard is exactly "Discard", never "Cancel": it restores the saved values and the reader stays on the page.
- **Errors:** what is wrong plus what to do, e.g. "Enter a valid email address."
- **Docs link:** names the topic, e.g. "Learn more about the Preview Toolbar".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The `form` is named by the `PageHeader` title through `aria-labelledby` and uses `novalidate`; the title is the page's only `h1`.
- Each group is a real `fieldset`; SaveAll gives it a visually hidden `legend` ("Profile settings").
- Every control has an `aria-label` that repeats its row title; errors are linked with `aria-describedby` only while they show.
- Disabling the `fieldset` while saving takes every control out of interaction at once; Save announces its loading state.
- Focus order follows reading order: the rows from top to bottom, then Discard and Save.

## States

- SaveAll: Profile with General, Preferences and Notifications in one fieldset and one sticky Discard and Save footer.
- Saving: the whole fieldset and Discard are disabled and Save shows its loading state.
- SavePerGroup: Preferences split into General and Notifications cards, each with its own secondary Save.
- SavingOneGroup: General is saving with its rows disabled while Notifications stays editable.
- SavePerCard: Project settings with Preview Toolbar and Deployment Protection cards, each with an info `Alert`, its fields and its own Save.
- SavingOneCard: Preview Toolbar is saving with its selects disabled while Deployment Protection stays editable.

## Related

- `platform/edit/edit-resource` — settings of one resource, with anchored sections.
- `platform/account/profile` — the full account profile built on the same layout.
- `platform/states/form-validation` — every outcome of a submit.
- `platform/states/async-submit` — a save that runs long or fails on the server.
- `platform/delete/delete-with-confirmation` — the delete row a settings page can end with.
- `SettingRow` — the row this form is made of; see `skills/webkit-form` for the ItemGroup settings and Card with independent saves types.
