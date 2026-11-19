# Settings form

The place the user goes to change how an account or a project behaves. They scan a few topics, change one or two values, and commit them knowing exactly what the save covers. The block is one layout with three save strategies: one save for a form that is one logical unit, one save per group, or one save per card on a long configuration page. The Profile variant is the full account profile page, the layout every account settings page (billing details, credentials, users, teams) follows. The save model follows how the page is partitioned, not the container. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header, the breadcrumbs, the ⌘K palette and the `<main>`.

## When to use

- Use settings-form for account or organization settings (profile, preferences, notifications), choosing SaveAll, SavePerGroup or SavePerCard.
- Account-level settings read as rows of a label, a description and a control (Profile, Preferences, Notifications): SaveAll.
- Topics on one page that the user commits independently, such as General and Notifications: SavePerGroup.
- A long configuration page where each topic needs an explanation and its own commit, such as Preview Toolbar and Deployment Protection: SavePerCard.
- The signed-in account's full profile page, with its sections, MFA link, source control and Delete account: Profile.

## When not to use

- The settings tab or settings page of one resource, with anchored sections and an unsaved-changes bar: use `edit/edit-resource`.
- Changing the plan: use `account/account-change-plan-drawer`.
- Creating a resource: use `create/create-page` or `create/create-drawer`.
- Walking every submit outcome (invalid fields, server rejection): use `state/state-form-validation`.
- Deleting the account or a resource from a settings page: open `edit/edit-delete-dialog` (its SettingsRow variant) from an outlined row.

## Building blocks

### A. Page heading — `PageHeader` (required)

A `PageHeader` at `size="small"` opens the form column (`layout-column-form`) with the page name and one sentence of purpose. Its `title-id` names the `form` through `aria-labelledby`. No actions in the heading: saving lives at the bottom.

### B. FeatureItem sections — `Subheader`, `Card`, `Item` (required)

Each topic is a section with a `Subheader` at `size="small"` (so every topic is an `h2` under the page `h1`) over a flush `Card :padded="false"` whose content is an `Item.List`. Sections stack at the section step; the heading and its card sit at the group gap. In SaveAll the sections share one `fieldset` with a visually hidden `legend`; in SavePerGroup and SavePerCard each card holds its own `fieldset`.

### C. Setting rows — `SettingsRow`, `Input`, `FieldError`, `Select`, `Switch` (required)

One `SettingsRow` per setting, with a `title` and a one-sentence `description`. Text and choices take a large full-width `Input` or `Select`; a yes-or-no setting is a `Switch` in a `variant="compact"` row. Each control has an `aria-label` matching the row title. Required controls take `required` from the start; a failed Save turns the control `invalid` and a `FieldError` with an id tied through `aria-describedby` says what to fix. SavePerCard uses stacked `Field`s (a `Field.Label` over its control) under an info `Alert` instead of rows.

### D. Save — `SaveBar`, `Button` (required)

SaveAll ends with one full-bleed sticky `SaveBar variant="plain"` holding an outlined Discard and the primary Save, both medium. While saving, the `fieldset` and Discard are disabled and Save takes `:loading`. Discard and Save stay disabled until the form differs from what was saved (`useUnsavedChanges` tracks the baseline and `commit()` moves it on a successful save). Discard puts back the last saved values and clears the errors. A successful save shows a `Profile saved.` success toast; a rejected one shows an error toast (`The profile wasn't saved.`, the changes kept) with Retry, and leaves the form dirty. In SavePerGroup and SavePerCard there is no `SaveBar`: each `Card` footer carries a secondary Save for that card only, confirmed by a toast naming the card, and SavePerCard puts an optional docs `Link` on the footer's start.

### E. Profile sections — `SettingsRow`, `Card`, `Item`, `Input`, `Select`, `Switch`, `Button` (Profile only)

The Profile variant adds `SettingsGroup`, `Textarea`, `Tag`, `ConfirmDialog`, `Skeleton` and `Alert` to these parts.

The Profile variant stacks one `SettingsGroup` per group (General, Company information, Address information, Login settings, Source control, Appearance, Danger zone), each with a `hint` and an `anchor` over a flush `Card` whose `Item.List` holds the rows. Client ID is a `readonly` `Input`; Billing emails is a three-row `Textarea` that starts empty (an editable contact field never carries sample data) and is required; address rows use `postal-code`, `address-line1` and `address-line2` autocomplete. Requiring MFA is not a switch here: `account/account-mfa-settings` owns it, and the Multi-factor authentication row links there with `Manage MFA`. Source-control providers are `Item`s with `Item.Media`, a success `Tag` (`Active`) when connected, and `Manage` or `Connect` opening the provider in a new tab. The unsaved-changes `SaveBar` rises with a motion-reduced transition once the form differs from the saved copy. The danger Delete account opens a `variant="danger"` `ConfirmDialog` with a warning `Alert` and the typed confirmation from `confirmation-phrase` (`Type <account name> to confirm.`); its confirm stays disabled until the typed name matches exactly. ProfileLoading puts three `Card`s of `Skeleton` rows in place of the sections (`aria-busy`); ProfileError puts a danger `Alert` with Retry there; the heading stays in both.

## Data

The SaveAll form takes the saved profile and the save request's state through props and emits the values; it fetches nothing and fakes no save. `SettingsFormProfile` and `SettingsFormProps` are exported from `settings-form.vue`, and `sample.ts` holds the sample profile the form opens on when `profile` is left out. The form keeps its own draft; `profile` is the baseline that Discard returns to, and a new `profile` resets the form to it. The SavePerGroup, SavePerCard and Profile variants are their own screens and still run on their own local data.

| Prop           | Type                           | What it does                                                                                                                                                                          |
| -------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile`      | `SettingsFormProfile`          | The saved values the form opens on and compares against; Save and Discard stay disabled until the draft differs.                                                                      |
| `defaultDraft` | `Partial<SettingsFormProfile>` | Unsaved edits the form opens with on top of `profile`, so it starts dirty (a draft restored from storage).                                                                            |
| `loading`      | `boolean`                      | The save is in flight: the fieldset and Discard disable and Save spins. When it turns off with no `error`, the draft becomes the saved baseline and the `Profile saved.` toast shows. |
| `error`        | `string`                       | Why the save failed, the description of the `The profile wasn't saved.` error toast with Retry; the draft stays dirty.                                                                |

| Event     | Payload           | When                                                                                  |
| --------- | ----------------- | ------------------------------------------------------------------------------------- |
| `submit`  | `(event, values)` | Save (or Retry in the error toast) with a valid draft; `values` is the whole profile. |
| `discard` | `(event)`         | Discard; the draft is already back to `profile`.                                      |

To go live, render the form from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import SettingsForm, { type SettingsFormProfile } from './settings-form.vue'

  const { data: profile, update } = useProfile()
  const saving = ref(false)
  const saveError = ref('')

  const save = async (_event: Event, values: SettingsFormProfile) => {
    saving.value = true
    saveError.value = ''
    try {
      await update(values)
    } catch {
      saveError.value = "The request didn't reach the server. Your changes are kept."
    } finally {
      saving.value = false
    }
  }
</script>

<template>
  <SettingsForm
    v-if="profile"
    :profile="profile"
    :loading="saving"
    :error="saveError"
    @submit="save"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Pick the save strategy from how the page is partitioned: one logical unit gets one save.
- Disable only the fieldset being saved; the other groups or cards stay editable.
- Drive Save's `:loading` and the fieldset's `disabled` from one `submitting` flag.
- Validate on submit only, show the error at the field it belongs to, and move focus to the first field in error.
- Keep every control in a row at the same size, and every row title in sentence case.
- Explain a card's effect in an info `Alert` at the top of the card, before its fields.
- In Profile, keep preferences that apply immediately (Appearance) and external connections (Source control) out of Save, and say so in their section hints; put destructive actions in the last section, behind a type-to-confirm `ConfirmDialog`.

## Don't

- Don't render a `Sidebar`, `AppHeader`, `Command` palette or `<main>` in the page; `ConsoleLayout` owns them.
- Don't mix a page-level `SaveBar` with per-card Save buttons on the same page.
- Don't put Save in the page heading or float it beside a single field.
- Don't flag empty required fields before the user presses Save.
- Don't add an error summary block or an `Alert` for field validation; the field's own state is the feedback.
- Don't put a consequence or a constraint in the row title; it goes in the description or the `Alert`.
- Don't toast a field-level server rejection; it goes to an `Alert` in the owning section with the row's control invalid.

## Copy

- **Page title:** the page's name, e.g. "Profile"; description: one sentence with a period, e.g. "Define and manage personal account preferences."
- **Breadcrumb** (the route meta `ConsoleLayout` reads): the parent, then the page title exactly, e.g. "Account settings" › "Profile".
- **Choices:** sentence case and no parentheses, e.g. "Team default", "Standard protection".
- **Section heading:** a short topic noun, e.g. "General", "Notifications".
- **Row title:** names the setting in one to three words, e.g. "Timezone"; description: one sentence with a period, e.g. "Times across the app are shown in this zone."
- **Save:** exactly "Save" for the footer and every group or card; Discard is exactly "Discard", never "Cancel": it restores the saved values and the reader stays on the page.
- **Errors:** what is wrong plus what to do, e.g. "Enter a valid email address."
- **Docs link:** names the topic, e.g. "Learn more about the Preview Toolbar".
- **Profile:** section hints are one sentence on what the group affects ("The company that owns the account, as it appears on every invoice."); optional fields say it in the description ("Optional. Apartment, suite or floor."); the destructive row uses one verb for the title and the button ("Delete personal account" with "Delete account", never "Remove"); the save bar reads "You have unsaved changes."; the load failure reads "The profile could not be loaded. Nothing was changed; try again." with "Retry"; the delete toast reads "Account scheduled for deletion."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The `form` is named by the `PageHeader` title through `aria-labelledby` and uses `novalidate`; the title is the page's only `h1`.
- Each group is a real `fieldset`; SaveAll gives it a visually hidden `legend` ("Profile settings").
- Every control has an `aria-label` that repeats its row title; errors are linked with `aria-describedby` only while they show.
- Disabling the `fieldset` while saving takes every control out of interaction at once; Save announces its loading state.
- Focus order follows reading order: the rows from top to bottom, then Discard and Save.

## States

- SaveAll: the default props (`profile` left out renders the sample); Profile with General, Preferences and Notifications in one fieldset and one sticky Discard and Save footer.
- Saving: `loading` with an edit in `defaultDraft`; the whole fieldset and Discard are disabled and Save shows its loading state.
- SaveError: `error` with an edit in `defaultDraft`; the server rejects the save; an error toast with Retry says the changes are kept, and the form stays dirty with every entry.
- SavePerGroup: Preferences split into General and Notifications cards, each with its own secondary Save.
- SavingOneGroup: General is saving with its rows disabled while Notifications stays editable.
- SavePerCard: Project settings with Preview Toolbar and Deployment Protection cards, each with an info `Alert`, its fields and its own Save.
- SavingOneCard: Preview Toolbar is saving with its selects disabled while Deployment Protection stays editable.
- Profile: the profile filled from the account (Billing emails empty and required), save bar hidden until a saved field changes. Saving with Account name set to `Offline` walks the failure toast; an empty Account name or a malformed billing address walks the field errors. Delete account opens the type-to-confirm dialog.
- ProfileLoading: the first load; `Skeleton` cards in place of the sections.
- ProfileError: the account did not load; a danger Alert with Retry.

## Related

- `edit/edit-resource` — settings of one resource, with anchored sections.
- `account/account-mfa-settings` — where Profile's Manage MFA row leads.
- `state/state-form-validation` — every outcome of a submit.
- `state/state-async-submit` — a save that runs long and reports back later.
- `edit/edit-delete-dialog` — the delete row a settings page can end with.
- `SettingsRow` — the row this form is made of; see `skills/webkit-form` for the ItemGroup settings and Card with independent saves types.
