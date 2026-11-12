# SinglePageCreate (`platform/create/single-page-create`)

> The page a first-level resource is created on in one screen: its own creation header with no sidebar, a centred form column opening with a small page heading, then stacked sections, each a heading with a Hint over a flush Card of field rows, and a fixed bar under the scrolling form, the same bar Version Detail uses, carrying an optional leading slot plus Cancel and the submit Button. The same page covers a resource with a General section and a collapsed Advanced section, and an action whose submit label follows what it does (Save, Purge, Create). A long create such as Create Service groups `Item` rows under small headings and ends in a full-bleed sticky footer. Fields flag required or invalid only after the submit Button is pressed, and each error clears as soon as its field is edited. Built from `PageHeader`, `SettingsSection`, `SettingRow`, `SaveBar`, `GlobalHeader`, `IconButton`, `Breadcrumb`, `Avatar`, `Card`, `Item`, `Input`, `HelperText`, `Switch`, `Field` choice cards with `RadioButton`, `Textarea`, `Alert`, `MultiSelect`, `NumberInput` and `Button`. ImportFromGit is the same job inside the platform shell with standalone `Field` stacks under plain headings instead of `Item` rows: the Git scope and repository side by side, Template settings, Deployment, Build and Runtime, Notifications and Alerts and Delivery features, ending with an acknowledgement checkbox and a single Deploy button at the end of the column, with no sticky footer; ImportFromGitSubmitted is that form after Deploy on the untouched fields.

- Surface: product
- Source: `blocks/platform/create/single-page-create/single-page-create.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/single-page-create")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [ButtonHighlight](../../../components/button-highlight.md), [Card](../../../components/card.md), [Checkbox](../../../components/checkbox.md), [Command](../../../components/command.md), [Drawer](../../../components/drawer.md), `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, [DropdownMenu](../../../components/dropdown-menu.md), [Field](../../../components/field.md), [GlobalHeader](../../../components/global-header.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [InputGroup](../../../components/input-group.md), [Item](../../../components/item.md), [Label](../../../components/label.md), [Menu](../../../components/menu.md), [MultiSelect](../../../components/multi-select.md), [NumberInput](../../../components/number-input.md), [PageHeader](../../../components/page-header.md), [PasswordInput](../../../components/password-input.md), [PhoneInput](../../../components/phone-input.md), [RadioButton](../../../components/radio-button.md), [SaveBar](../../../components/save-bar.md), [SearchTrigger](../../../components/search-trigger.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Sidebar](../../../components/sidebar.md), [StatusIndicator](../../../components/status-indicator.md), [Switch](../../../components/switch.md), [Textarea](../../../components/textarea.md), [ThemeSwitcher](../../../components/theme-switcher.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-errors`, `webkit-layout`

## Asked as

create page; create resource page; create zone; full page create form; top-level create page; new resource form; creation page; página de criação; criar recurso; formulário de criação; single page create; create purge; create service page; criação em uma página; sectioned form; single column form; import from git form; form with sections; deploy form; acknowledgement checkbox; formulário em seções; formulário de uma coluna; importar do git

The page a first-level resource is created on when everything it needs fits on one screen. The user arrives from the module's `Create <Object>` button, answers the required fields at the top, leaves the defaulted ones folded under Advanced, and commits from a bar that never scrolls away. The page has its own URL, its own creation header and no sidebar, so it survives a reload and the back button, and leaving it returns to the list.

## When to use

- The resource is one the sidebar routes to (a domain, a service, a purge) and the user came only to create it (`skills/webkit-create-surface`).
- Its fields fit in a few sections without depending on each other's answers step by step.
- An action that takes a form and runs once, whose submit names what it does (Save, Purge, Deploy).
- The settings page of the same resource: it reuses these sections in the same order.

## When not to use

- The fields split into steps that unlock in order, or one answer adds a step: use `platform/create/multipage-create`.
- The resource binds another one and then deploys: use `platform/create/provision-wizard` or `platform/create/source-wizard`.
- The thing is created inside another resource (a record in a zone, a rule in an application): use `platform/create/create-in-drawer`.
- Editing an existing resource where the commit bar should mount only after a change: use `platform/settings/settings-form`.
- Never put a create form in a dialog.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

`GlobalHeader` with no sidebar: a small outlined `IconButton` back to the module ("Back to Domains"), the `Brand` linking home, a `Breadcrumb` of the module and the page title, and the account `Avatar` on the right. The breadcrumb's last item repeats the create button's label exactly.

### B. Page heading — `PageHeader` (required)

`PageHeader size="small"` at the top of the centred form column (`layout-column-form`), titled with the create label and described in one sentence of what the resource is. Its `title-id` labels the `form`. One section gap separates it from the first band.

### C. Sections — `SettingsSection`, `Card`, `Item` (required)

Each band is a `SettingsSection` with a title and a `hint` (the glyph that reveals guidance on hover or focus) over a flush `Card :padded="false"` whose content is an `Item.List` of rows. Required fields go in the first band, General. The last band is Advanced: `collapsible`, `icon="pi pi-cog"`, closed by default (`v-model:open`), holding only fields the endpoint does not require, that already carry its default and that are not the point of the form.

### D. Field rows — `SettingRow`, `Input`, `HelperText` (required)

A `SettingRow` per field: its title names the field and its description carries the guidance, so the control takes an `aria-label` instead of a separate label. A large `Input` sits right at the fixed cell width. On submit, an empty required field gets `:required` and a `HelperText kind="required"`; a value the endpoint rejects gets `:invalid` and `kind="invalid"`, never both. Editing the field clears its own message. A wide control (textarea, radio choice cards) uses `kind="stacked"` so it takes the full measure below the name.

### E. Switch rows — `Switch` (optional)

On/off settings use `SettingRow kind="compact"` with a `Switch` hard right at its natural size, named by an `aria-label` that matches the row title, e.g. "Enable DNSSEC".

### F. Commit bar — `SaveBar`, `Button` (required)

`SaveBar kind="plain"`, fixed under the scrolling region on the form's measure. Its `#leading` slot holds what sits at the start, when there is something: an outlined Import `Button` and one muted line on the domain form, nothing on the others. Its `#actions` slot holds outlined Cancel and the primary submit, both medium `Button`s. The submit is the form's only `type="submit"`. A long create uses the same bar as a full-bleed sticky footer; the Import from Git form instead ends with one Deploy `Button` at the end of the column.

## Do

- Put every required field in the first band; never inside Advanced, so a failed submit always points at something on screen.
- Validate on submit only, then clear each message as soon as its field is edited.
- Give every control an `aria-label` that repeats its row title.
- Keep Cancel and the submit in the same bar, submit last, and name the submit after what it does (Save, Purge, Deploy).
- Lock the whole `fieldset` and every control with one `submitting` flag while the request is in flight, and put `:loading` on the submit.
- On success, show a toast that names the resource and opens it (`skills/webkit-errors`).

## Don't

- Don't show the sidebar on this page, or open it as a modal over the list.
- Don't print the band's guidance as a paragraph under its title; use the `hint`.
- Don't mark fields required or invalid before the first submit, or show both states on one field.
- Don't make Save deploy, publish or charge as a side effect; creating is not deploying.
- Don't add a validation summary at the top; each message sits at its field.
- Don't squeeze a textarea or radio group into the right-hand cell; stack the row.

## Copy

- **Title and breadcrumb:** the create label, verb first with the entity's capitalization, e.g. "Create Domain". Identical to the button that opened the page.
- **Description:** one sentence on what the resource is, e.g. "A domain holds the DNS records that answer authoritatively for a hostname."
- **Section titles:** the domain, not the widget, e.g. "General", "Target", "Delivery settings", "Advanced".
- **Row descriptions:** a full sentence with a period, saying what the value does, e.g. "Identifies the domain in this list. It is not the hostname."
- **Submit:** one verb, e.g. "Save", "Purge", "Deploy". Cancel is always exactly "Cancel".
- **Required message:** "This field is required."
- **Invalid message:** what to enter, with an example, e.g. "Enter a valid domain name. Example: example.com."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no parentheses in labels, no "please".

## Accessibility

- One `main` landmark holding one `form`, labelled by the `PageHeader` title through `aria-labelledby`, with `novalidate` so the page's own messages replace the browser's.
- A `fieldset` with a visually hidden `legend` groups the sections.
- Each message is tied to its control with `aria-describedby` and appears only on submit; required and invalid are announced through the control's own state.
- The collapsed Advanced region is `inert` while closed, so keyboard focus never lands in hidden fields.
- The back `IconButton` and the account trigger have `aria-label`s; decorative icons carry `aria-hidden="true"`.
- Focus order follows reading order: header, heading, General, Advanced toggle, then the bar's Import, Cancel and Save.

## States

- Default: the Create Domain page at rest; General holds Name and Domain name, Advanced is collapsed, the bar shows Import, Cancel and Save.
- CreatePurge: a Target band of radio choice cards for Layer and Purge type, an Arguments textarea that follows the type, a warning alert and a bar with Cancel and Purge.
- CreateService: a long create in five groups of rows over a full-bleed sticky `SaveBar` with Cancel and Save.
- RequiredFields: Create Service after Save on the empty form; Name and Address show "This field is required." until edited.
- ImportFromGit: the same job inside the platform shell with standalone field stacks under plain headings, an acknowledgement checkbox and one Deploy button at the end of the column.
- ImportFromGitSubmitted: Import from Git after Deploy on the untouched form; every required field shows its required state and message.

## Related

- `platform/create/multipage-create` — the same job split into steps.
- `platform/create/create-in-drawer` — create inside a resource without leaving it.
- `platform/settings/settings-form` — the edit page that reuses these sections.
- `platform/states/form-validation` — required and invalid states on submit.
- `platform/view/table-view` — the list whose `Create <Object>` button opens this page.
- `SettingRow` — the field row every section is built from; see `skills/webkit-form`.

## Variants

- `Default` — primary (the code below)
- `CreatePurge` — Create Purge: a Target section of wide rows choosing the Layer and the Purge type with RadioButton choice cards, an Arguments section whose code-font Textarea follows the chosen type, a warning Alert, and a bar with only Cancel and Purge. Choosing Tiered Cache leaves Cache Key as the only allowed type.
- `CreateService` — A long create, Create Service, in five groups of Item rows (General, Delivery settings, Origins, Cache expiration policies and Debug rules) over a full-bleed sticky footer with Cancel and Save: Name and Address empty, HTTP port 80 preselected, HTTPS ports disabled until a protocol with HTTPS is chosen, and the host header prefilled with ${host}.
- `RequiredFields` — Create Service after Save on the empty form: Name and Address carry the required state with This field is required. under them, and typing into either clears its own error.
- `ImportFromGit` — Standalone field stacks in one column: the platform shell with an unpadded scroll region, a page heading, then the Git scope and repository side by side and sections of field stacks under plain headings, ending with an acknowledgement checkbox and a single Deploy button at the end of the column, with no sticky footer. Import from Git is the example: Template settings, Deployment, Build and Runtime, Notifications and Alerts, Delivery features. Every required field flags only after Deploy is pressed, through the field’s own required state and helper text. Built from `PageHeader`, the platform shell, `Label`, `Select`, `Field` (with its `FieldLabel`, `FieldDescription`, `FieldContent` and `FieldTitle` parts and choice cards), `Input`, `InputGroup`, `RadioButton`, `MultiSelect`, `PasswordInput`, `Textarea`, `PhoneInput`, `Switch`, `Checkbox`, `HelperText` and `Button`.
- `ImportFromGitSubmitted` — After Deploy on the untouched form: the access token, deployment type, build command, deploy key, on-call number and the acknowledgement each show their required state and message.

Each variant is the same screen in another state: `get_pattern("platform/create/single-page-create", { variant })`, or the file under `blocks/platform/create/single-page-create/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { reactive, ref } from 'vue'

  const breadcrumb = [{ label: 'Domains', href: '/domains' }, { label: 'Create Domain' }]

  const form = reactive({ name: '', domain: '', dnssec: false, active: true })
  const errors = reactive({ name: '', nameKind: 'required', domain: '', domainKind: 'required' })
  const advancedOpen = ref(false)
  const fileRef = ref(null)

  const NAME_MAX = 50
  const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (name.length > NAME_MAX) {
      errors.nameKind = 'invalid'
      errors.name = 'Use at most ' + NAME_MAX + ' characters.'
    } else {
      errors.name = ''
    }

    const domain = form.domain.trim()
    if (!domain) {
      errors.domainKind = 'required'
      errors.domain = 'This field is required.'
    } else if (!DOMAIN_PATTERN.test(domain)) {
      errors.domainKind = 'invalid'
      errors.domain = 'Enter a valid domain name. Example: example.com.'
    } else {
      errors.domain = ''
    }

    return !errors.name && !errors.domain
  }

  const submit = () => validate()
  const openImport = () => fileRef.value?.click()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Domains"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-domain-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="min-h-0 flex-1 overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Domain"
              description="A domain holds the DNS records that answer authoritatively for a hostname."
              size="small"
              title-id="create-domain-title"
            />

            <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Create Domain</legend>

              <SettingsSection
                title="General"
                hint="The two fields this endpoint requires: what the domain is called here, and the hostname it answers for."
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Name"
                        description="Identifies the domain in this list. It is not the hostname."
                      >
                        <Input
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="My domain"
                          autocomplete="off"
                          :required="!!errors.name && errors.nameKind === 'required'"
                          :invalid="!!errors.name && errors.nameKind === 'invalid'"
                          :aria-describedby="errors.name ? 'create-domain-name-message' : undefined"
                          @update:model-value="errors.name = ''"
                        />
                        <HelperText
                          v-if="errors.name"
                          id="create-domain-name-message"
                          :kind="errors.nameKind"
                          :label="errors.name"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Domain name"
                        description="The root hostname this domain answers for, without a subdomain. Pasting a zone file here imports its records instead."
                      >
                        <Input
                          v-model="form.domain"
                          size="large"
                          class="w-full"
                          aria-label="Domain name"
                          placeholder="example.com"
                          autocomplete="off"
                          :required="!!errors.domain && errors.domainKind === 'required'"
                          :invalid="!!errors.domain && errors.domainKind === 'invalid'"
                          :aria-describedby="
                            errors.domain ? 'create-domain-domain-message' : undefined
                          "
                          @update:model-value="errors.domain = ''"
                        />
                        <HelperText
                          v-if="errors.domain"
                          id="create-domain-domain-message"
                          :kind="errors.domainKind"
                          :label="errors.domain"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Advanced"
                v-model:open="advancedOpen"
                icon="pi pi-cog"
                collapsible
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="DNSSEC"
                        description="Signs this domain's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.dnssec"
                          aria-label="Enable DNSSEC"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Active"
                        description="When active, the domain answers authoritative DNS queries for its hostname."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>
        </div>

        <SaveBar kind="plain">
          <template #leading>
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <Button
                type="button"
                label="Import"
                kind="outlined"
                size="medium"
                icon="pi pi-upload"
                @click="openImport"
              />
              <p class="min-w-0 text-body-sm text-(--text-muted)">
                or paste zone file contents in Domain name
              </p>
              <input
                ref="fileRef"
                type="file"
                accept=".zone,.txt,.db,text/plain"
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
              />
            </div>
          </template>
          <template #actions>
            <Button
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
            />
            <Button
              label="Save"
              kind="primary"
              size="medium"
              type="submit"
            />
          </template>
        </SaveBar>
      </form>
    </main>
  </div>
</template>
```
