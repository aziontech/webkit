# Profile (`platform/account/profile`)

> The profile page of a signed-in account, and the layout every account settings page follows: a small page heading over seven stacked sections, each a flush `Card` of field rows, in the form column, with the unsaved-changes bar that rises once a saved field changes. Account name and Billing emails come filled from the account and are checked on Save; the Appearance font picker defaults to Rubik. A save that fails with no field to blame raises an error toast with Retry and keeps the changes. Other account pages (billing, credentials, users, teams) keep the same column and swap the sections for their own cards or tables. Built from `PageHeader`, `SettingsSection`, `SettingRow`, `SaveBar`, `Card`, `Item`, `Input`, `Textarea`, `Select`, `Switch`, `Tag`, `HelperText`, `Toaster` and `Button`. A page body for ConsoleLayout, rendered in its default slot.

- Surface: product
- Source: `blocks/platform/account/profile/profile.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/profile")`
- Components: [Button](../../../components/button.md), [Card](../../../components/card.md), [HelperText](../../../components/helper-text.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [PageHeader](../../../components/page-header.md), [SaveBar](../../../components/save-bar.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Switch](../../../components/switch.md), [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md)
- Skills: `webkit-form`, `webkit-errors`, `webkit-layout`

## Asked as

profile; profile page; account profile; user profile; my account; account settings; general account settings; company information; organization settings; login settings; danger zone; account preferences; configurações da conta; dados da empresa; configurações gerais da conta; ajustes da conta; perfil; página de perfil; minha conta

The profile page of a signed-in account, and the layout every account settings page follows. The user comes to check or change how the account is identified, billed and signed into: a small page heading over stacked sections, each a flush card of setting rows in the form column, with a save bar that rises once a saved field changes. Billing, credentials, users and teams keep the same column and swap the sections for their own cards or tables. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Account-level settings pages (profile, billing details, security).
- Any settings page with several independent groups of fields saved together.

## When not to use

- A resource's settings tab: use `platform/settings/settings-form`.
- Editing a resource in a focused flow: use `platform/edit/edit-resource`.
- Changing the plan: use `platform/account/change-plan-drawer`.

## Building blocks

### A. Page heading — `PageHeader` (required)

`size="small"`, title and a one-sentence description of what the page manages.

### B. Section — `SettingsSection` (required)

One per group (General, Company information, Address information, Login settings, Source control, Appearance, Danger zone), each with a `hint` and an `anchor`.

### C. Section body — `Card` (required)

Flush (`:padded="false"`); the rows are its only content.

### D. Row list — `Item` (required)

`Item.List` wraps the rows of a card. In Source control each provider is an `Item` with `Item.Media`, `Item.Content` (title, description) and `Item.Actions`.

### E. Setting — `SettingRow` (required)

Title and description at the start, the control at the end. `kind="stacked"` for a wide control (Textarea), `kind="compact"` for a switch or a button.

### F. Text value — `Input` (required)

Large, with an `aria-label` that matches the row title. Client ID is `readonly`. Address rows use `postal-code`, `address-line1` and `address-line2` autocomplete; Company name uses `organization`.

### G. Long value — `Textarea` (required)

Billing emails, three rows.

### H. Choice — `Select` (required)

Country, state and city; font family and system appearance. The trigger carries the row's name as `aria-label`.

### I. Toggle — `Switch` (required)

Allow social login, Enforce multi-factor authentication.

### J. Actions — `Button` (required)

Row actions (`Manage`, `Connect` with an external-link icon), the `danger` Delete account, and the save bar's Discard and Save (`:loading` while saving).

### K. Connection state — `Tag` (optional)

`Active` with `success` severity next to a connected provider.

### L. Unsaved changes — `SaveBar` (required)

Rises with a motion-reduced transition once the form differs from the saved copy, and stays while saving: `You have unsaved changes.` with Discard and Save.

### M. Field message — `HelperText` (conditional)

Under Account name and Billing emails after Save: `required` when empty, `invalid` when an address is malformed, linked with `aria-describedby`. Save stops and focus moves to the first field in error.

### N. Toasts — `Toaster` (required)

Mounted once with the page. A save no field owns that fails is `toast.error` with Retry and keeps the changes; a successful save toasts `Profile saved.`

## Do

- Disable the whole fieldset while saving and release it when the request ends, on success and on failure.
- Keep preferences that apply immediately (Appearance) and external connections (Source control) out of Save, and say so in their section hints.
- Put destructive actions in the last section, behind a confirmation (`platform/delete/delete-with-confirmation`).

## Don't

- Don't toast a field-level server rejection; it goes to an `Alert` in the owning section with the row's control invalid.
- Don't render the save bar while nothing changed.
- Don't put helper text in the row title; the description holds it.

## Copy

- **Section hints:** one sentence on what the group affects: `The company that owns the account, as it appears on every invoice.`
- **Row titles:** sentence case nouns, product names capitalized: `Billing emails`, `GitHub`.
- **Save bar:** `You have unsaved changes.` with `Discard` and `Save`.
- **Destructive row:** one verb for the title and the button: `Delete personal account` with `Delete account`. Never `Remove` for a permanent delete.
- **Optional fields:** the description says it: `Optional. Apartment, suite or floor.`
- **Field errors:** `This field is required.`, `Enter valid email addresses, separated by semicolons.`
- **Save failure:** unscoped failures go to `toast.error` with Retry: `The profile wasn't saved.`, described by `The request didn't reach the server. Your changes are kept.`
- **Save success:** `Profile saved.`

## Accessibility

- Each control's `aria-label` matches its visible row title.
- Section anchors let the page be deep-linked; headings form a single outline under the page title.
- The save bar is reachable by keyboard right after the last field and does not cover focused content.

## States

- Default: the profile filled from the account, save bar hidden until a saved field changes. Saving with Account name set to `Offline` walks the failure toast; an empty Account name or a malformed billing address walks the field errors.

## Related

- `platform/settings/settings-form` — the same rows for a resource's settings.
- `platform/delete/delete-with-confirmation` — the Delete account confirmation.
- `shells/console` — the shell this page renders in.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_pattern("platform/account/profile", { variant })`, or the file under `blocks/platform/account/profile/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'

  const form = reactive({
    accountName: 'Acme',
    clientId: '9757a',
    companyName: '',
    companyId: '',
    billingEmails: 'name@example.com',
    postalCode: '00000-000',
    country: 'br',
    state: 'rs',
    city: 'poa',
    address: 'n',
    apartment: '',
    allowSocialLogin: true,
    enforceMfa: false
  })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const errors = reactive({ accountName: '', billingEmails: '' })
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const SAVE_TOAST = 'profile-save'

  const validate = () => {
    const emails = form.billingEmails
      .split(';')
      .map((value) => value.trim())
      .filter(Boolean)
    errors.accountName = form.accountName.trim() ? '' : 'This field is required.'
    errors.billingEmails = !emails.length
      ? 'This field is required.'
      : emails.every((value) => emailPattern.test(value))
        ? ''
        : 'Enter valid email addresses, separated by semicolons.'
    const first = ['accountName', 'billingEmails'].find((field) => errors[field])
    if (first) nextTick(() => document.getElementById(`profile-${first}`)?.focus())
    return !first
  }

  const save = () => {
    if (saving.value || !validate()) return
    saving.value = true
    toast.dismiss(SAVE_TOAST)
    setTimeout(() => {
      saving.value = false
      if (form.accountName.trim().toLowerCase() === 'offline') {
        toast.error("The profile wasn't saved.", {
          id: SAVE_TOAST,
          description: "The request didn't reach the server. Your changes are kept.",
          action: { label: 'Retry', onClick: () => save() }
        })
        return
      }
      baseline.value = JSON.stringify(form)
      toast.success('Profile saved.', { id: SAVE_TOAST })
    }, 900)
  }
  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value))
    Object.assign(errors, { accountName: '', billingEmails: '' })
  }

  const places = [
    {
      key: 'country',
      label: 'Country',
      options: [
        { label: 'Brazil', value: 'br' },
        { label: 'United States', value: 'us' },
        { label: 'Portugal', value: 'pt' }
      ]
    },
    {
      key: 'state',
      label: 'State or region',
      options: [
        { label: 'Rio Grande do Sul', value: 'rs' },
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' }
      ]
    },
    {
      key: 'city',
      label: 'City',
      options: [
        { label: 'Porto Alegre', value: 'poa' },
        { label: 'São Paulo', value: 'sao' },
        { label: 'Rio de Janeiro', value: 'rio' }
      ]
    }
  ]
  const sourceControls = [
    {
      key: 'github',
      name: 'GitHub',
      icon: 'ai ai-github',
      connected: true,
      tag: 'Active',
      description:
        'Connected as rafael.umann, with access to the acme and rafael-personal organizations.',
      action: 'Manage'
    },
    {
      key: 'gitlab',
      name: 'GitLab',
      icon: 'ai-cor ai-gitlab',
      connected: false,
      tag: '',
      description: 'Connect GitLab to build and deploy from its repositories.',
      action: 'Connect'
    },
    {
      key: 'bitbucket',
      name: 'Bitbucket',
      icon: 'ai-cor ai-bitbucket',
      connected: false,
      tag: '',
      description: 'Connect Bitbucket to build and deploy from its repositories.',
      action: 'Connect'
    }
  ]
  const fonts = [
    { value: 'rubik', label: 'Rubik' },
    { value: 'inter', label: 'Inter' },
    { value: 'ibm-plex-sans', label: 'IBM Plex Sans' },
    { value: 'geist', label: 'Geist' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'work-sans', label: 'Work Sans' },
    { value: 'instrument-sans', label: 'Instrument Sans' },
    { value: 'hedvig-letters-sans', label: 'Hedvig Letters Sans' }
  ]
  const appearances = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]
  const font = ref('rubik')
  const theme = ref('system')
</script>

<template>
  <Toaster position="bottom-right" />
  <div class="flex flex-1 flex-col">
    <div class="flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Profile"
        novalidate
        @submit.prevent="save"
      >
        <div class="flex-1">
          <div
            class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Profile"
              description="Manage your identity, company details, address, and sign-in preferences."
              size="small"
            />
            <fieldset
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">Profile</legend>
              <SettingsSection
                title="General"
                hint="How this account is identified on the platform."
                anchor="general"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Account name"
                        description="What this account is called across the console."
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            id="profile-accountName"
                            v-model="form.accountName"
                            size="large"
                            class="w-full"
                            aria-label="Account name"
                            :required="!!errors.accountName"
                            :aria-describedby="
                              errors.accountName ? 'profile-accountName-error' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="errors.accountName = ''"
                          />
                          <HelperText
                            v-if="errors.accountName"
                            id="profile-accountName-error"
                            kind="required"
                            :label="errors.accountName"
                          />
                        </div>
                      </SettingRow>
                      <SettingRow
                        title="Client ID"
                        description="Can't be changed. Quote it when opening a support ticket about this account."
                      >
                        <Input
                          v-model="form.clientId"
                          size="large"
                          class="w-full"
                          aria-label="Client ID"
                          readonly
                          :disabled="saving"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Company information"
                hint="The company that owns the account, as it appears on every invoice."
                anchor="company-information"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Company name"
                        description="The legal entity that owns this account."
                      >
                        <Input
                          v-model="form.companyName"
                          size="large"
                          class="w-full"
                          aria-label="Company name"
                          autocomplete="organization"
                          placeholder="Company S.A."
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Company ID"
                        description="Personal or company ID number that identifies account ownership."
                      >
                        <Input
                          v-model="form.companyId"
                          size="large"
                          class="w-full"
                          aria-label="Company ID"
                          placeholder="00.000.000/0001-00"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Billing emails"
                        description="Invoices go to every address listed here. Separate addresses with a semicolon."
                        kind="stacked"
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Textarea
                            id="profile-billingEmails"
                            v-model="form.billingEmails"
                            class="w-full"
                            :rows="3"
                            aria-label="Billing emails"
                            :required="!!errors.billingEmails && !form.billingEmails.trim()"
                            :invalid="!!errors.billingEmails && !!form.billingEmails.trim()"
                            :aria-describedby="
                              errors.billingEmails ? 'profile-billingEmails-error' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="errors.billingEmails = ''"
                          />
                          <HelperText
                            v-if="errors.billingEmails"
                            id="profile-billingEmails-error"
                            :kind="form.billingEmails.trim() ? 'invalid' : 'required'"
                            :label="errors.billingEmails"
                          />
                        </div>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Address information"
                hint="Where the account owner is registered, for invoices and tax purposes."
                anchor="address-information"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow title="Postal code">
                        <Input
                          v-model="form.postalCode"
                          size="large"
                          class="w-full"
                          autocomplete="postal-code"
                          aria-label="Postal code"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        v-for="place in places"
                        :key="place.key"
                        :title="place.label"
                      >
                        <Select
                          v-model="form[place.key]"
                          size="large"
                          :display-value="
                            (value) =>
                              place.options.find((option) => option.value === value)?.label ?? ''
                          "
                        >
                          <Select.Trigger
                            class="w-full"
                            :aria-label="place.label"
                          />
                          <Select.Content>
                            <Select.Option
                              v-for="option in place.options"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                      <SettingRow title="Address">
                        <Input
                          v-model="form.address"
                          size="large"
                          class="w-full"
                          autocomplete="address-line1"
                          aria-label="Address"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Address line 2"
                        description="Optional. Apartment, suite or floor."
                      >
                        <Input
                          v-model="form.apartment"
                          size="large"
                          class="w-full"
                          autocomplete="address-line2"
                          aria-label="Address line 2"
                          placeholder="1st floor"
                          :disabled="saving"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Login settings"
                hint="How the users linked to this account sign in."
                anchor="login-settings"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Allow social login"
                        description="Users linked to the account can log in with their social network credentials."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.allowSocialLogin"
                          aria-label="Allow social login"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Enforce multi-factor authentication"
                        description="MFA is required on login for every user linked to this account."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.enforceMfa"
                          aria-label="Enforce multi-factor authentication"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Authenticator devices"
                        description="Manage the devices and recovery codes registered for this account."
                        kind="compact"
                      >
                        <Button
                          type="button"
                          label="Manage"
                          kind="outlined"
                          size="medium"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Source control"
                hint="The Git providers this account builds applications from, connected at the provider and outside Save."
                anchor="source-control"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <Item
                        v-for="provider in sourceControls"
                        :key="provider.key"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              :class="[
                                provider.icon,
                                'text-body-lg leading-none text-(--text-default)'
                              ]"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <Item.Title>
                            {{ provider.name }}
                            <Tag
                              v-if="provider.tag"
                              :label="provider.tag"
                              severity="success"
                              size="small"
                            />
                          </Item.Title>
                          <Item.Description>{{ provider.description }}</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <Button
                            type="button"
                            :label="provider.action"
                            kind="outlined"
                            size="medium"
                            :icon="provider.connected ? undefined : 'pi pi-external-link'"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Appearance"
                hint="Preferences for this browser, applied the moment you change them and not part of Save."
                anchor="appearance"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Font family"
                        description="The primary sans typeface across the console."
                      >
                        <Select
                          v-model="font"
                          size="large"
                          :display-value="
                            (value) => fonts.find((option) => option.value === value)?.label ?? ''
                          "
                        >
                          <Select.Trigger
                            class="w-full"
                            aria-label="Font family"
                          />
                          <Select.Content>
                            <Select.Option
                              v-for="option in fonts"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                      <SettingRow
                        title="System appearance"
                        description="Follow the operating system, or force a light or dark theme."
                      >
                        <Select
                          v-model="theme"
                          size="large"
                          :display-value="
                            (value) =>
                              appearances.find((option) => option.value === value)?.label ?? ''
                          "
                        >
                          <Select.Trigger
                            class="w-full"
                            aria-label="System appearance"
                          />
                          <Select.Content>
                            <Select.Option
                              v-for="option in appearances"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Danger zone"
                hint="Actions that cannot be undone."
                anchor="danger-zone"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Delete personal account"
                        description="Permanently deletes this personal account and all its data. It cannot be undone."
                        kind="compact"
                      >
                        <Button
                          type="button"
                          label="Delete account"
                          kind="danger"
                          size="medium"
                          icon="pi pi-trash"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>
        </div>
        <Transition
          enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="translate-y-2 opacity-0"
          leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="translate-y-2 opacity-0"
        >
          <SaveBar v-if="dirty || saving">
            You have unsaved changes.

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
  </div>
</template>
```
