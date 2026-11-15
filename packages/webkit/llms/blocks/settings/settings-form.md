# SettingsForm (`settings/settings-form`)

> A settings form and its save strategy, one variant per strategy. SaveAll, the default (a form that is one logical unit has one save): account-level settings as `Item` rows saved as one unit, a page body for ConsoleLayout (the layout owns the shell and the main landmark): the form column opening with a small page heading, topic sections each a `SectionHeader` (an h2) over a flush `Card` of rows, and one full-bleed sticky footer with Discard and Save, both disabled until the form differs from what was saved (dirty tracking through `useUnsavedChanges`); a successful save confirms with a `Profile saved.` toast and a rejected one shows an error toast with Retry, the entries kept (SaveError); Profile is the example, with General (Full name, Email), Preferences (Timezone, Language) and Notifications (Product updates), and Full name and Email flag only after Save is pressed. SavePerGroup splits the page into topic groups whose `Card` footers each carry a secondary Save for that group only. SavePerCard splits a long configuration page into titled cards, each with an info `Alert`, its stacked fields and its own Save beside an optional docs `Link`. Profile is the full profile page of a signed-in account, and the layout every account settings page follows: seven `SettingsSection`s of flush `Card`s of rows with the unsaved-changes `SaveBar`, MFA linked to `account/mfa-settings`, and Delete account behind a type-to-confirm `ConfirmDialog`; ProfileLoading and ProfileError are its first load and its load failure. Saving one group or card disables just its own fieldset; the others stay editable, and each save confirms with a toast. Built from `PageHeader`, `SectionHeader`, `SettingsSection`, `SettingRow`, `SaveBar`, `Card`, `Item`, `Alert`, `Field`, `Input`, `Textarea`, `Select`, `Switch`, `Tag`, `Link`, `HelperText`, `ConfirmDialog`, `Skeleton` and `Button`.

- Surface: app
- Source: `blocks/settings/settings-form/settings-form.vue` in `@aziontech/webkit`
- MCP: `get_block("settings/settings-form")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [ConfirmDialog](../../components/confirm-dialog.md), [Field](../../components/field.md), [HelperText](../../components/helper-text.md), [Input](../../components/input.md), [Item](../../components/item.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), [SaveBar](../../components/save-bar.md), [SectionHeader](../../components/section-header.md), [Select](../../components/select.md), [SettingRow](../../components/setting-row.md), [SettingsSection](../../components/settings-section.md), [Skeleton](../../components/skeleton.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), `use-unsaved-changes`
- Skills: `webkit-form`, `webkit-errors`, `webkit-ux-heuristics`

## Asked as

account settings form; organization or account settings; save all; single save for the page; sticky footer save; save as one unit; cancel and save footer; salvar tudo; rodapé fixo com salvar; formulário de conta; save per group; save per section; preferences page; grouped settings save; section save button; independent groups; salvar por grupo; preferências; salvar por seção; save per card; card with its own save; project settings; configuration cards; independent saves; long settings page; salvar por card; configurações do projeto; salvar cada seção; account settings; account profile; profile page; user profile; my profile; my account; organization settings; company information; login settings; danger zone; configurações da conta; perfil; página de perfil; minha conta; configuración de la cuenta

The place the user goes to change how an account or a project behaves. They scan a few topics, change one or two values, and commit them knowing exactly what the save covers. The block is one layout with three save strategies: one save for a form that is one logical unit, one save per group, or one save per card on a long configuration page. The Profile variant is the full account profile page, the layout every account settings page (billing details, credentials, users, teams) follows. The save model follows how the page is partitioned, not the container. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header, the breadcrumbs, the ⌘K palette and the `<main>`.

## When to use

- Use settings-form for account or organization settings (profile, preferences, notifications), choosing SaveAll, SavePerGroup or SavePerCard.
- Account-level settings read as rows of a label, a description and a control (Profile, Preferences, Notifications): SaveAll.
- Topics on one page that the user commits independently, such as General and Notifications: SavePerGroup.
- A long configuration page where each topic needs an explanation and its own commit, such as Preview Toolbar and Deployment Protection: SavePerCard.
- The signed-in account's full profile page, with its sections, MFA link, source control and Delete account: Profile.

## When not to use

- The settings tab or settings page of one resource, with anchored sections and an unsaved-changes bar: use `edit/edit-resource`.
- Changing the plan: use `account/change-plan-drawer`.
- Creating a resource: use `create/create-page` or `create/create-drawer`.
- Walking every submit outcome (invalid fields, server rejection): use `state/form-validation`.
- Deleting the account or a resource from a settings page: open `edit/delete-dialog` (its SettingsRow variant) from an outlined row.

## Building blocks

### A. Page heading — `PageHeader` (required)

A `PageHeader` at `size="small"` opens the form column (`layout-column-form`) with the page name and one sentence of purpose. Its `title-id` names the `form` through `aria-labelledby`. No actions in the heading: saving lives at the bottom.

### B. Topic sections — `SectionHeader`, `Card`, `Item` (required)

Each topic is a section with a `SectionHeader` at `size="small"` (so every topic is an `h2` under the page `h1`) over a flush `Card :padded="false"` whose content is an `Item.List`. Sections stack at the section step; the heading and its card sit at the group gap. In SaveAll the sections share one `fieldset` with a visually hidden `legend`; in SavePerGroup and SavePerCard each card holds its own `fieldset`.

### C. Setting rows — `SettingRow`, `Input`, `HelperText`, `Select`, `Switch` (required)

One `SettingRow` per setting, with a `title` and a one-sentence `description`. Text and choices take a large full-width `Input` or `Select`; a yes-or-no setting is a `Switch` in a `kind="compact"` row. Each control has an `aria-label` matching the row title. Required fields flag only after Save is pressed: the control turns `required` or `invalid` and a `HelperText` with an id tied through `aria-describedby` says what to fix. SavePerCard uses stacked `Field`s (a `Field.Label` over its control) under an info `Alert` instead of rows.

### D. Save — `SaveBar`, `Button` (required)

SaveAll ends with one full-bleed sticky `SaveBar kind="plain"` holding an outlined Discard and the primary Save, both medium. While saving, the `fieldset` and Discard are disabled and Save takes `:loading`. Discard and Save stay disabled until the form differs from what was saved (`useUnsavedChanges` tracks the baseline and `commit()` moves it on a successful save). Discard puts back the last saved values and clears the errors. A successful save shows a `Profile saved.` success toast; a rejected one shows an error toast (`The profile wasn't saved.`, the changes kept) with Retry, and leaves the form dirty. In SavePerGroup and SavePerCard there is no `SaveBar`: each `Card` footer carries a secondary Save for that card only, confirmed by a toast naming the card, and SavePerCard puts an optional docs `Link` on the footer's start.

### E. Profile sections — `SettingRow`, `Card`, `Item`, `Input`, `Select`, `Switch`, `Button` (Profile only)

The Profile variant adds `SettingsSection`, `Textarea`, `Tag`, `ConfirmDialog`, `Skeleton` and `Alert` to these parts.

The Profile variant stacks one `SettingsSection` per group (General, Company information, Address information, Login settings, Source control, Appearance, Danger zone), each with a `hint` and an `anchor` over a flush `Card` whose `Item.List` holds the rows. Client ID is a `readonly` `Input`; Billing emails is a three-row `Textarea` that starts empty (an editable contact field never carries sample data) and is required; address rows use `postal-code`, `address-line1` and `address-line2` autocomplete. Requiring MFA is not a switch here: `account/mfa-settings` owns it, and the Multi-factor authentication row links there with `Manage MFA`. Source-control providers are `Item`s with `Item.Media`, a success `Tag` (`Active`) when connected, and `Manage` or `Connect` opening the provider in a new tab. The unsaved-changes `SaveBar` rises with a motion-reduced transition once the form differs from the saved copy. The danger Delete account opens a `kind="danger"` `ConfirmDialog` with a warning `Alert` and `Type <account name> to confirm.` over an `Input`; its confirm stays disabled until the typed name matches. ProfileLoading puts three `Card`s of `Skeleton` rows in place of the sections (`aria-busy`); ProfileError puts a danger `Alert` with Retry there; the heading stays in both.

## Do

- Pick the save strategy from how the page is partitioned: one logical unit gets one save.
- Disable only the fieldset being saved; the other groups or cards stay editable.
- Drive Save's `:loading` and the fieldset's `disabled` from one `submitting` flag.
- Validate on submit only, show the error at the field it belongs to, and move focus to the first field in error.
- Keep every control in a row at the same size, and every row title in sentence case.
- Explain a card's effect in an info `Alert` at the top of the card, before its fields.
- In Profile, keep preferences that apply immediately (Appearance) and external connections (Source control) out of Save, and say so in their section hints; put destructive actions in the last section, behind a type-to-confirm `ConfirmDialog`.

## Don't

- Don't render a `Sidebar`, `GlobalHeader`, `Command` palette or `<main>` in the page; `ConsoleLayout` owns them.
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

- SaveAll: Profile with General, Preferences and Notifications in one fieldset and one sticky Discard and Save footer.
- Saving: the whole fieldset and Discard are disabled and Save shows its loading state.
- SaveError: the server rejects the save; an error toast with Retry says the changes are kept, and the form stays dirty with every entry.
- SavePerGroup: Preferences split into General and Notifications cards, each with its own secondary Save.
- SavingOneGroup: General is saving with its rows disabled while Notifications stays editable.
- SavePerCard: Project settings with Preview Toolbar and Deployment Protection cards, each with an info `Alert`, its fields and its own Save.
- SavingOneCard: Preview Toolbar is saving with its selects disabled while Deployment Protection stays editable.
- Profile: the profile filled from the account (Billing emails empty and required), save bar hidden until a saved field changes. Saving with Account name set to `Offline` walks the failure toast; an empty Account name or a malformed billing address walks the field errors. Delete account opens the type-to-confirm dialog.
- ProfileLoading: the first load; `Skeleton` cards in place of the sections.
- ProfileError: the account did not load; a danger Alert with Retry.

## Related

- `edit/edit-resource` — settings of one resource, with anchored sections.
- `account/mfa-settings` — where Profile's Manage MFA row leads.
- `state/form-validation` — every outcome of a submit.
- `state/async-submit` — a save that runs long and reports back later.
- `edit/delete-dialog` — the delete row a settings page can end with.
- `SettingRow` — the row this form is made of; see `skills/webkit-form` for the ItemGroup settings and Card with independent saves types.

## Variants

- `SaveAll` — primary (the code below)
- `Saving` — While the save is in flight: the whole fieldset is disabled, Discard is disabled and Save shows its loading state.
- `SaveError` — The server rejects the save: Save stops loading, an error toast says the profile was not saved and that the changes are kept, with Retry; the form stays dirty with every entry in place.
- `SavePerGroup` — A settings page split into topic groups that each save on their own: a page heading, then one section per topic, each a `SectionHeader` over a flush `Card` of `Item` rows whose footer carries a secondary Save for that group only. Saving one group disables just its own fieldset; the other stays editable. Preferences is the example, with General (Full name, Language) and Notifications (Product updates, Security alerts). Built from `PageHeader`, `SectionHeader`, `SettingRow`, `Card`, `Item`, `Input`, `Select`, `Switch` and `Button`.
- `SavingOneGroup` — General is saving: its Save shows the loading state and its rows are disabled, while Notifications stays editable and can be saved on its own.
- `SavePerCard` — A long configuration page split into titled cards that each own their save: a page heading, then one `Card` per topic with an info `Alert`, stacked label-and-control fields inside a fieldset, and a footer whose secondary Save commits that card alone, beside an optional docs `Link`. Project settings is the example, with Preview Toolbar and Deployment Protection. Built from `PageHeader`, `Card`, `Alert`, `Field`, `Select`, `Switch`, `Link` and `Button`.
- `SavingOneCard` — Preview Toolbar is saving: its Save shows the loading state and its selects are disabled, while Deployment Protection stays editable.
- `Profile` — The profile page of a signed-in account: a small page heading over seven stacked `SettingsSection`s (General, Company information, Address information, Login settings, Source control, Appearance, Danger zone), each a flush `Card` of rows, with the `SaveBar` that rises once a saved field changes. Account name comes filled; Billing emails starts empty and is required; both are checked on Save. Requiring MFA lives in `account/mfa-settings`, linked from the Login settings row; source-control actions open the provider; Delete account asks in a `ConfirmDialog` that takes the account name typed. A save that fails with no field to blame raises an error toast with Retry and keeps the changes.
- `ProfileLoading` — The profile's first load: three cards of Skeleton rows in place of the sections, the heading kept.
- `ProfileError` — The account did not load: a danger Alert with Retry replaces the profile sections; Retry loads them.

Each variant is the same screen in another state: `get_block("settings/settings-form", { variant })`, or the file under `blocks/settings/settings-form/variants/`.

## Code (`SaveAll`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, nextTick, onScopeDispose, reactive, ref } from 'vue'

  const timezones = [
    { label: '(UTC+00:00) UTC', value: 'utc' },
    { label: '(UTC-08:00) Los Angeles', value: 'america-los_angeles' },
    { label: '(UTC-05:00) New York', value: 'america-new_york' },
    { label: '(UTC-03:00) São Paulo', value: 'america-sao_paulo' },
    { label: '(UTC+00:00) London', value: 'europe-london' }
  ]
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Português', value: 'pt' },
    { label: 'Español', value: 'es' }
  ]
  const labelOf = (list: SelectOptionItem[]) => (value: string) =>
    list.find((option) => option.value === value)?.label ?? ''

  const form = reactive({
    fullName: 'Alex Morgan',
    email: '',
    timezone: 'utc',
    language: 'en',
    productUpdates: true
  })
  const failing = false
  const SAVE_TOAST = 'profile-save'
  const submitted = ref(false)
  const submitting = ref(false)
  let saveTimer: ReturnType<typeof setTimeout> | undefined

  const {
    isDirty: dirty,
    commit,
    discard: restore
  } = useUnsavedChanges(() => form, {
    onDiscard: (baseline) => Object.assign(form, baseline)
  })

  onScopeDispose(() => clearTimeout(saveTimer))

  const nameEmpty = computed(() => !form.fullName.trim())
  const emailEmpty = computed(() => !form.email.trim())
  const emailInvalid = computed(() => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
  const isValid = computed(() => !nameEmpty.value && !emailInvalid.value)

  const submit = () => {
    if (submitting.value) return
    submitted.value = true
    if (!isValid.value) {
      nextTick(() => document.getElementById(nameEmpty.value ? 'full-name' : 'email')?.focus())
      return
    }
    submitting.value = true
    toast.dismiss(SAVE_TOAST)
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      submitting.value = false
      if (failing) {
        toast.error("The profile wasn't saved.", {
          id: SAVE_TOAST,
          description: "The request didn't reach the server. Your changes are kept.",
          action: { label: 'Retry', onClick: () => submit() }
        })
        return
      }
      commit()
      submitted.value = false
      toast.success('Profile saved.', { id: SAVE_TOAST })
    }, 900)
  }

  const discard = () => {
    restore()
    submitted.value = false
  }
</script>

<template>
  <form
    class="flex flex-1 flex-col"
    aria-labelledby="profile-title"
    novalidate
    @submit.prevent="submit"
  >
    <div class="layout-column-form layout-boundary flex flex-1 flex-col">
      <PageHeader
        title="Profile"
        description="Define and manage personal account preferences."
        size="small"
        title-id="profile-title"
      />

      <fieldset
        class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="submitting"
      >
        <legend class="sr-only">Profile settings</legend>

        <section class="flex flex-col gap-(--layout-group-gap)">
          <SectionHeader
            title="General"
            size="small"
          />
          <Card :padded="false">
            <template #content>
              <Item.List>
                <SettingRow
                  title="Full name"
                  description="The name shown across your account."
                >
                  <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                      <Input
                        id="full-name"
                        v-model="form.fullName"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Full name"
                        :required="submitted && nameEmpty"
                        :aria-describedby="submitted && nameEmpty ? 'full-name-error' : undefined"
                      />
                      <HelperText
                        v-if="submitted && nameEmpty"
                        id="full-name-error"
                        kind="required"
                        label="This field is required."
                      />
                    </div>
                  </div>
                </SettingRow>
                <SettingRow
                  title="Email"
                  description="Used for sign-in and notifications."
                >
                  <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                      <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Email"
                        :required="submitted && emailEmpty"
                        :invalid="submitted && !emailEmpty && emailInvalid"
                        :aria-describedby="submitted && emailInvalid ? 'email-error' : undefined"
                      />
                      <HelperText
                        v-if="submitted && emailInvalid"
                        id="email-error"
                        :kind="emailEmpty ? 'required' : 'invalid'"
                        :label="
                          emailEmpty ? 'This field is required.' : 'Enter a valid email address.'
                        "
                      />
                    </div>
                  </div>
                </SettingRow>
              </Item.List>
            </template>
          </Card>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <SectionHeader
            title="Preferences"
            size="small"
          />
          <Card :padded="false">
            <template #content>
              <Item.List>
                <SettingRow
                  title="Timezone"
                  description="Times across the app are shown in this zone."
                >
                  <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                    <Select
                      v-model="form.timezone"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      :display-value="labelOf(timezones)"
                    >
                      <Select.Trigger
                        id="profile-timezone"
                        aria-label="Timezone"
                      />
                      <Select.Content>
                        <Select.Option
                          v-for="option in timezones"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </div>
                </SettingRow>
                <SettingRow
                  title="Language"
                  description="The interface language."
                >
                  <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                    <Select
                      v-model="form.language"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      :display-value="labelOf(languages)"
                    >
                      <Select.Trigger
                        id="profile-language"
                        aria-label="Language"
                      />
                      <Select.Content>
                        <Select.Option
                          v-for="option in languages"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </div>
                </SettingRow>
              </Item.List>
            </template>
          </Card>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <SectionHeader
            title="Notifications"
            size="small"
          />
          <Card :padded="false">
            <template #content>
              <Item.List>
                <SettingRow
                  title="Product updates"
                  description="Occasional emails about new features and changes."
                  kind="compact"
                >
                  <Switch
                    v-model="form.productUpdates"
                    aria-label="Product updates"
                    :disabled="submitting"
                  />
                </SettingRow>
              </Item.List>
            </template>
          </Card>
        </section>
      </fieldset>
    </div>

    <SaveBar kind="plain">
      <template #actions>
        <Button
          type="button"
          label="Discard"
          kind="outlined"
          size="medium"
          :disabled="submitting || !dirty"
          @click="discard"
        />
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="submitting"
          :disabled="!dirty"
          @click="submit"
        />
      </template>
    </SaveBar>
  </form>
</template>
```
