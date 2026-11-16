# CreatePage (`create/create-page`)

> The page a first-level resource is created on in one screen: its own creation header with no sidebar, a centred form column opening with a small page heading, then stacked sections, each a heading with a Hint over a flush Card of field rows, and a raised commit card centred at the bottom that the form scrolls under, carrying an optional leading slot plus Cancel and the submit Button. The same page covers a resource with a General section and a collapsed Advanced section, and an action whose submit label follows what it does (Save, Purge, Create). A long create such as Create Service groups `Item` rows under small headings under the same centred bar. Fields flag required or invalid only after the submit Button is pressed, and each error clears as soon as its field is edited. CreateZone imports a zone file into a Records section with Remove per row and Discard import, and CreateOrganization picks the organization's marble mark color and shows its owner and first workspace. Built from `PageHeader`, `SettingsSection`, `SettingsRow`, `SaveBar`, `AppHeader`, `IconButton`, `Breadcrumb`, `Avatar`, `Card`, `Item`, `Input`, `FieldError`, `Switch`, `RadioGroup` (`variant="card"`), `Textarea`, `Alert`, `MultiSelect`, `NumberInput`, `Select`, `Tag`, `toast` and `Button`.

- Surface: app
- Source: `blocks/create/create-page/create-page.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-page")`
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), `FieldDescription`, `FieldError`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [MultiSelect](../../components/multi-select.md), [NumberInput](../../components/number-input.md), [PageHeader](../../components/page-header.md), [RadioGroup](../../components/radio-group.md), [RadioGroup](../../components/radio-group.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsRow](../../components/settings-row.md), [SettingsSection](../../components/settings-section.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md)
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-errors`, `webkit-layout`

## Asked as

create page; create resource page; create zone; full page create form; top-level create page; new resource form; creation page; página de criação; criar recurso; formulário de criação; single page create; create purge; create service page; criação em uma página; sectioned form; single column form; form with sections; formulário em seções; formulário de uma coluna; import zone file; create dns zone; importar arquivo de zona; create organization; new organization form; organization mark; criar organização; one page create; create form page

The page a first-level resource is created on when everything it needs fits on one screen. The user arrives from the module's `Create <Object>` button, answers the required fields at the top, leaves the defaulted ones folded under Advanced, and commits from a bar that never scrolls away. The page has its own URL, its own creation header and no sidebar, so it survives a reload and the back button, and leaving it returns to the list.

## When to use

- Use create-page only to create a first-level resource on one page; its settings page is edit-resource (`edit/edit-resource`).
- The resource is one the sidebar routes to (a domain, a service, a purge) and the user came only to create it (`skills/webkit-create-surface`).
- Its fields fit in a few sections without depending on each other's answers step by step.
- An action that takes a form and runs once, whose submit names what it does (Save, Purge, Deploy).

## When not to use

- The fields split into steps that unlock in order, or one answer adds a step: use `create/create-wizard`.
- The resource binds another one and then deploys: use `create/create-wizard` (CreateAndDeploy).
- Deploying a repository, a template or an uploaded folder: start at `create/create-hub` and deploy with `create/deploy-template` (ImportFromGit covers a Git import).
- The thing is created inside another resource (a record in a zone, a rule in an application): use `create/create-drawer`.
- The settings page of an existing resource, with the save bar that mounts only after a change: use `edit/edit-resource`.
- Never put a create form in a dialog.

## Building blocks

### A. Creation header — `AppHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

`AppHeader` with no sidebar: a small outlined `IconButton` back to the module ("Back to Domains"), the `Brand` linking home, a `Breadcrumb` of the module and the page title, and the account `Avatar` on the right. The breadcrumb's last item repeats the create button's label exactly.

### B. Page heading — `PageHeader` (required)

`PageHeader size="small"` at the top of the centred form column (`layout-column-form`), titled with the create label and described in one sentence of what the resource is. Its `title-id` labels the `form`. One section gap separates it from the first band.

### C. Sections — `SettingsSection`, `Card`, `Item` (required)

Each band is a `SettingsSection` with a title and a `hint` (the glyph that reveals guidance on hover or focus) over a flush `Card :padded="false"` whose content is an `Item.List` of rows. Required fields go in the first band, General. The last band is Advanced: `collapsible`, `icon="ai ai-settings"`, closed by default (`v-model:open`), holding only fields the endpoint does not require, that already carry its default and that are not the point of the form.

### D. Field rows — `SettingsRow`, `Input`, `FieldError` (required)

A `SettingsRow` per field: its title names the field and its description carries the guidance, so the control takes an `aria-label` instead of a separate label. A large `Input` sits right at the fixed cell width; every field row sets `stackable`, so on a phone the control moves under the copy at full width and the description wraps in full. On submit, an empty required field gets `:required` and a `FieldError type="required"`; a value the endpoint rejects gets `:invalid` and `type="invalid"`, never both. Editing the field clears its own message. A wide control (textarea, radio choice cards) uses `variant="stacked"` so it takes the full measure below the name.

### E. Switch rows — `Switch` (optional)

On/off settings use `SettingsRow variant="compact"` with a `Switch` hard right at its natural size, named by an `aria-label` that matches the row title, e.g. "Enable DNSSEC".

### F. Commit bar — `SaveBar`, `Button` (required)

`SaveBar variant="centered"`, a raised card centred at the bottom of the form that stays on screen while the form scrolls under it, at every width. It is the last child of the scrolling region, so the last field always scrolls clear of it. Its `#leading` slot holds what sits at the start, when there is something: an outlined Import `Button` and one muted line on the domain form, nothing on the others. On a phone the muted line hides, so Import keeps its label beside Cancel and Save; the Domain name description already says a paste imports. Its `#actions` slot holds outlined Cancel and the primary submit, both medium `Button`s. The submit is the form's only `type="submit"`. A long create uses the same bar.

## Data

The block keeps the form as a local draft, validates it and emits `submit` with the values; it sends no request. `CreatePageValues` and `CreatePageProps` are exported from `create-page.vue`. The page owns the request: it sets `loading` while it runs, and on failure sets `error`, which the block shows in an error toast with Retry; on success the page shows the toast and opens the new domain.

| Prop            | Type                        | What it does                                                                        |
| --------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| `defaultValues` | `Partial<CreatePageValues>` | The values the form starts from: Name and Domain name empty, DNSSEC off, Active on. |
| `loading`       | `boolean`                   | The create request is in flight; the `fieldset` locks and Save spins.               |
| `error`         | `string`                    | Why the request failed, the description of the error toast with Retry.              |

| Event    | Payload           | When                                                                      |
| -------- | ----------------- | ------------------------------------------------------------------------- |
| `submit` | `(event, values)` | Save on a valid form, and Retry in the error toast; `values` are trimmed. |
| `cancel` | `(event)`         | Cancel in the bar.                                                        |

To go live, render the block from a page that owns the request:

```vue
<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import CreatePage, { type CreatePageValues } from './create-page.vue'

  const { mutate, pending, error } = useCreateDomain()
  const create = async (_event: Event, values: CreatePageValues) => {
    await mutate(values)
    toast.success(`${values.domain} created.`)
  }
</script>

<template>
  <CreatePage
    :loading="pending"
    :error="error ? 'The service did not answer. Check your connection and try again.' : ''"
    @submit="create"
    @cancel="router.back()"
  />
</template>
```

## Do

- Put every required field in the first band; never inside Advanced, so a failed submit always points at something on screen.
- Validate on submit only, then clear each message as soon as its field is edited.
- Give every control an `aria-label` that repeats its row title.
- Keep Cancel and the submit in the same bar, submit last, and name the submit after what it does (Save, Purge, Deploy).
- Lock the whole `fieldset` and every control with one `loading` flag while the request is in flight, and put `:loading` on the submit.
- On success, show a toast that names the resource and opens it; on failure, an error toast with Retry that keeps the values (`skills/webkit-errors`). Every submit in this block models the request: Default, CreateZone, CreatePurge, CreateService and CreateOrganization.

## Don't

- Don't show the sidebar on this page, or open it as a modal over the list.
- Don't stretch the commit bar across the page or build the centred card by hand; it is `SaveBar variant="centered"`.
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
- Focus order follows reading order: header, heading, General, Advanced toggle, then the bar's Cancel and Save (CreateZone adds Import before them).

## States

- Default: the Create Domain page at rest (no `defaultValues`, not `loading`); General holds Name and Domain name, Advanced is collapsed, the bar shows Cancel and Save. `loading` locks the form and spins Save, and `error` raises the error toast with Retry. Importing a zone file belongs to CreateZone, not to this page.
- CreateZone: Create Zone after a zone file is imported; a Records section lists each imported record (type `Tag`, value, TTL) with a Remove `IconButton` per row and Discard import in the card footer. Import in the bar and a paste into Domain name both read a BIND zone file, skip the SOA and nameserver records, fill an empty Name and Domain name from `$ORIGIN`, and confirm in a toast; a file with no records raises an error toast. The list previews the first 50 records with an "and N more" line, and a re-import skips records already listed.
- CreateOrganization: General with Name and a Mark color chosen from six `RadioGroup` cards (`variant="card"`) (each color built from semantic tokens: primary, warning, danger, success, info and the text grays, never palette primitives), each an `Avatar` with `pattern="marble"` seeded by the name in that color's `colors`, above an In the header preview drawn the same way, an Owner `Item` with Owner and Active `Tag`s, First workspace and a collapsed Advanced of `Select`s; a name already in use is invalid on submit, and the request ends in a success toast or an error toast with Retry.
- CreatePurge: a Target band of radio choice cards for Layer and Purge type, an Arguments textarea that follows the type, a warning alert and a bar with Cancel and Purge.
- CreateService: a long create with a small `PageHeader` (Create Service, breadcrumb Services / Create Service) and five groups of rows, each under an `h2`, under the same centred `SaveBar` with Cancel and Save.
- RequiredFields: Create Service after Save on the empty form; Name and Address show "This field is required." until edited.

## Related

- `create/create-wizard` — the same job split into steps.
- `create/create-drawer` — create inside a resource without leaving it.
- `settings/settings-form` — the edit page that reuses these sections.
- `state/form-validation` — required and invalid states on submit.
- `view/table-view` — the list whose `Create <Object>` button opens this page.
- `SettingsRow` — the field row every section is built from; see `skills/webkit-form`.

## Variants

- `Default` — primary (the code below)
- `CreateZone` — Create Zone after importing a zone file: Import sits in the bar's leading slot (pasting a zone file into Domain name does the same), Name and Domain name take the zone origin, and a Records section lists each imported record with its type Tag, value and TTL, a Remove per row and a Discard import action in the card footer. The SOA and the nameservers are never imported; each import, failure and discard confirms in a toast. The Records section previews the first 50 records with an 'and N more' line, and a re-import skips records already listed.
- `CreateOrganization` — Create Organization: General with Name and a Mark picked from six RadioGroup card colors built from semantic tokens, each a marble Avatar seeded by the name, and an In the header preview that follows the name and the color; an Owner row with the signed-in user's Avatar and Owner and Active Tags; First workspace with its name prefilled; and a collapsed Advanced section of Selects. A name already in use is invalid on submit; Create Organization shows its loading state and confirms in a success toast, and a failed request raises an error toast with Retry.
- `CreatePurge` — Create Purge: a Target section of wide rows choosing the Layer and the Purge type with RadioGroup choice cards, an Arguments section whose monospace Textarea follows the chosen type, a warning Alert, and a bar with only Cancel and Purge, which shows its loading state and confirms in a toast (or an error toast with Retry). Choosing Tiered Cache leaves Cache Key as the only allowed type.
- `CreateService` — A long create, Create Service, under a small PageHeader, in five groups of Item rows (General, Delivery settings, Origins, Cache expiration policies and Debug rules, each under an h2) under the centred commit card with Cancel and Save: Name and Address empty, HTTP port 80 preselected, HTTPS ports disabled until a protocol with HTTPS is chosen, and the host header prefilled with ${host}.
- `RequiredFields` — Create Service after Save on the empty form: Name and Address carry the required state with This field is required. under them, and typing into either clears its own error.

Each variant is the same screen in another state: `get_block("create/create-page", { variant })`, or the file under `blocks/create/create-page/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  /** The values of the Create Domain form. */
  export interface CreatePageValues {
    /** What the domain is called in the list. */
    name: string
    /** The root hostname it answers for. */
    domain: string
    /** Whether DNSSEC signs its answers. */
    dnssec: boolean
    /** Whether it answers authoritative DNS queries. */
    active: boolean
  }

  export interface CreatePageProps {
    /** The values the form starts from; each field falls back to empty, DNSSEC off and Active on. */
    defaultValues?: Partial<CreatePageValues>
    /** The create request is in flight; the form locks and Save spins. */
    loading?: boolean
    /** Why the create request failed, shown in an error toast with Retry. */
    error?: string
  }

  interface FormErrors {
    name: string
    nameKind: 'helper' | 'invalid' | 'required'
    domain: string
    domainKind: 'helper' | 'invalid' | 'required'
  }

  const props = withDefaults(defineProps<CreatePageProps>(), {
    defaultValues: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: CreatePageValues]
    cancel: [event: MouseEvent]
  }>()

  const breadcrumb = [{ label: 'Domains', href: '/domains' }, { label: 'Create Domain' }]

  const form = reactive<CreatePageValues>({
    name: '',
    domain: '',
    dnssec: false,
    active: true,
    ...props.defaultValues
  })
  const errors = reactive<FormErrors>({
    name: '',
    nameKind: 'required',
    domain: '',
    domainKind: 'required'
  })
  const advancedOpen = ref(false)

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

  const values = (): CreatePageValues => ({
    ...form,
    name: form.name.trim(),
    domain: form.domain.trim()
  })

  const submit = (event: Event) => {
    if (props.loading || !validate()) return
    emit('submit', event, values())
  }

  watch(
    () => props.error,
    (message) => {
      if (!message) return
      toast.error('Could not create the domain.', {
        description: message,
        action: { label: 'Retry', onClick: (event: MouseEvent) => submit(event) }
      })
    },
    { immediate: true }
  )
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="ai ai-chevron-left"
          aria-label="Back to Domains"
          variant="outline"
          size="small"
        />
        <AppHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              variant="default"
              size="small"
            />
          </a>
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-domain-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Domain"
              description="A domain holds the DNS records that answer authoritatively for a hostname."
              size="small"
              title-id="create-domain-title"
            />

            <fieldset
              :disabled="loading"
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
            >
              <legend class="sr-only">Create Domain</legend>

              <SettingsSection
                title="General"
                hint="The two fields this endpoint requires: what the domain is called here, and the hostname it answers for."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        stackable
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
                        <FieldError
                          v-if="errors.name"
                          id="create-domain-name-message"
                          >{{ errors.name }}</FieldError
                        >
                      </SettingsRow>
                      <SettingsRow
                        stackable
                        title="Domain name"
                        description="The root hostname this domain answers for, without a subdomain."
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
                        <FieldError
                          v-if="errors.domain"
                          id="create-domain-domain-message"
                          >{{ errors.domain }}</FieldError
                        >
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Advanced"
                v-model:open="advancedOpen"
                icon="ai ai-settings"
                collapsible
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="DNSSEC"
                        description="Signs this domain's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.dnssec"
                          aria-label="Enable DNSSEC"
                        />
                      </SettingsRow>
                      <SettingsRow
                        title="Active"
                        description="When active, the domain answers authoritative DNS queries for its hostname."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                        />
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>
          <SaveBar variant="centered">
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                @click="(event: MouseEvent) => emit('cancel', event)"
              />
              <Button
                label="Save"
                variant="primary"
                size="medium"
                type="submit"
                :loading="loading"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
  </div>
</template>
```
