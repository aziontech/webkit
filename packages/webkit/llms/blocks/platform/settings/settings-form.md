# SettingsForm (`platform/settings/settings-form`)

> A settings form and its save strategy, one variant per strategy. SaveAll, the default (a form that is one logical unit has one save): account-level settings as `Item` rows saved as one unit, a page body for ConsoleLayout (the layout owns the shell and the main landmark): the form column opening with a small page heading, topic sections each a small heading over a flush `Card` of rows, and one full-bleed sticky footer with Discard and Save; Profile is the example, with General (Full name, Email), Preferences (Timezone, Language) and Notifications (Product updates), and Full name and Email flag only after Save is pressed. SavePerGroup splits the page into topic groups whose `Card` footers each carry a secondary Save for that group only. SavePerCard splits a long configuration page into titled cards, each with an info `Alert`, its stacked fields and its own Save beside an optional docs `Link`. Saving one group or card disables just its own fieldset; the others stay editable. Built from `PageHeader`, `SettingRow`, `SaveBar`, `Card`, `Item`, `Alert`, `Field`, `Input`, `Select`, `Switch`, `Link`, `HelperText` and `Button`.

- Surface: product
- Source: `blocks/platform/settings/settings-form/settings-form.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/settings/settings-form")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Field](../../../components/field.md), [HelperText](../../../components/helper-text.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Link](../../../components/link.md), [PageHeader](../../../components/page-header.md), [SaveBar](../../../components/save-bar.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [Switch](../../../components/switch.md)
- Skills: `webkit-form`, `webkit-errors`, `webkit-ux-heuristics`

## Asked as

save all; single save for the page; sticky footer save; account settings form; save as one unit; cancel and save footer; salvar tudo; rodapé fixo com salvar; formulário de conta; save per group; save per section; preferences page; grouped settings save; section save button; independent groups; salvar por grupo; preferências; salvar por seção; save per card; card with its own save; project settings; configuration cards; independent saves; long settings page; salvar por card; configurações do projeto; salvar cada seção

The place the user goes to change how an account or a project behaves. They scan a few topics, change one or two values, and commit them knowing exactly what the save covers. The block is one layout with three save strategies: one save for a form that is one logical unit, one save per group, or one save per card on a long configuration page. The save model follows how the page is partitioned, not the container. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header, the breadcrumbs, the ⌘K palette and the `<main>`.

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

### A. Page heading — `PageHeader` (required)

A `PageHeader` at `size="small"` opens the form column (`layout-column-form`) with the page name and one sentence of purpose. Its `title-id` names the `form` through `aria-labelledby`. No actions in the heading: saving lives at the bottom.

### B. Topic sections — `Card`, `Item` (required)

Each topic is a section with a small heading (`text-heading-xxs`) over a flush `Card :padded="false"` whose content is an `Item.List`. Sections stack at the section step; the heading and its card sit at the group gap. In SaveAll the sections share one `fieldset` with a visually hidden `legend`; in SavePerGroup and SavePerCard each card holds its own `fieldset`.

### C. Setting rows — `SettingRow`, `Input`, `HelperText`, `Select`, `Switch` (required)

One `SettingRow` per setting, with a `title` and a one-sentence `description`. Text and choices take a large full-width `Input` or `Select`; a yes-or-no setting is a `Switch` in a `kind="compact"` row. Each control has an `aria-label` matching the row title. Required fields flag only after Save is pressed: the control turns `required` or `invalid` and a `HelperText` with an id tied through `aria-describedby` says what to fix. SavePerCard uses stacked `Field`s (a `Field.Label` over its control) under an info `Alert` instead of rows.

### D. Save — `SaveBar`, `Button` (required)

SaveAll ends with one full-bleed sticky `SaveBar kind="plain"` holding an outlined Discard and the primary Save, both medium. While saving, the `fieldset` and Discard are disabled and Save takes `:loading`. Discard puts back the last saved values and clears the errors. In SavePerGroup and SavePerCard there is no `SaveBar`: each `Card` footer carries a secondary Save for that card only, and SavePerCard puts an optional docs `Link` on the footer's start.

## Do

- Pick the save strategy from how the page is partitioned: one logical unit gets one save.
- Disable only the fieldset being saved; the other groups or cards stay editable.
- Drive Save's `:loading` and the fieldset's `disabled` from one `submitting` flag.
- Validate on submit only, show the error at the field it belongs to, and move focus to the first field in error.
- Keep every control in a row at the same size, and every row title in sentence case.
- Explain a card's effect in an info `Alert` at the top of the card, before its fields.

## Don't

- Don't render a `Sidebar`, `GlobalHeader`, `Command` palette or `<main>` in the page; `ConsoleLayout` owns them.
- Don't mix a page-level `SaveBar` with per-card Save buttons on the same page.
- Don't put Save in the page heading or float it beside a single field.
- Don't flag empty required fields before the user presses Save.
- Don't add an error summary block or an `Alert` for field validation; the field's own state is the feedback.
- Don't put a consequence or a constraint in the row title; it goes in the description or the `Alert`.

## Copy

- **Page title:** the page's name, e.g. "Profile"; description: one sentence with a period, e.g. "Define and manage personal account preferences."
- **Breadcrumb** (the route meta `ConsoleLayout` reads): the parent, then the page title exactly, e.g. "Account settings" › "Profile".
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

## Variants

- `SaveAll` — primary (the code below)
- `Saving` — While the save is in flight: the whole fieldset is disabled, Discard is disabled and Save shows its loading state.
- `SavePerGroup` — A settings page split into topic groups that each save on their own: a page heading, then one section per topic, each a small heading over a flush `Card` of `Item` rows whose footer carries a secondary Save for that group only. Saving one group disables just its own fieldset; the other stays editable. Preferences is the example, with General (Full name, Language) and Notifications (Product updates, Security alerts). Built from `PageHeader`, `SettingRow`, `Card`, `Item`, `Input`, `Select`, `Switch` and `Button`.
- `SavingOneGroup` — General is saving: its Save shows the loading state and its rows are disabled, while Notifications stays editable and can be saved on its own.
- `SavePerCard` — A long configuration page split into titled cards that each own their save: a page heading, then one `Card` per topic with an info `Alert`, stacked label-and-control fields inside a fieldset, and a footer whose secondary Save commits that card alone, beside an optional docs `Link`. Project settings is the example, with Preview Toolbar and Deployment Protection. Built from `PageHeader`, `Card`, `Alert`, `Field`, `Select`, `Switch`, `Link` and `Button`.
- `SavingOneCard` — Preview Toolbar is saving: its Save shows the loading state and its selects are disabled, while Deployment Protection stays editable.

Each variant is the same screen in another state: `get_pattern("platform/settings/settings-form", { variant })`, or the file under `blocks/platform/settings/settings-form/variants/`.

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
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed, nextTick, reactive, ref } from 'vue'

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

  const saved = ref({
    fullName: 'Alex Morgan',
    email: '',
    timezone: 'utc',
    language: 'en',
    productUpdates: true
  })
  const form = reactive({ ...saved.value })
  const submitted = ref(false)
  const submitting = ref(false)

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
    setTimeout(() => {
      saved.value = { ...form }
      submitted.value = false
      submitting.value = false
    }, 900)
  }

  const discard = () => {
    Object.assign(form, saved.value)
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
          <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
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
          <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Preferences</p>
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
          <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Notifications</p>
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
          :disabled="submitting"
          @click="discard"
        />
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="submitting"
          @click="submit"
        />
      </template>
    </SaveBar>
  </form>
</template>
```
