# CreateDrawer (`create/create-drawer`)

> The right-side form drawer every item created or edited inside a resource opens, such as a domain, a record, an environment, a variable or a rule: a panel header with the title, a muted one-line description and the close button; a disabled-while-saving fieldset of `SettingsGroup` bands, each a heading with a hint glyph over its stacked `Field` components; and one submit button in the footer; required fields carry the Required marker from the start, an empty submit marks them invalid with a `Field.Error` under each, the button shows its loading state while the save is in flight, a successful save closes the drawer with a toast naming the item, and a failed save keeps the values with a danger Alert and Retry above the footer. Its state resets each time it opens, so the content stays in place while it closes. Add Domain opens from under Domains on the resource’s Settings tab, from a domain row menu to edit it, and from Add Environment in the resource environment menu. The Environment select lists every environment, says when choosing one connects it to the resource, and ends in a Create Environment option. Choosing Bring my own domain drops the free-domain addon and reveals the Certificate select, preselecting a certificate that already covers the address. Built from `SettingsGroup`, `Drawer` and its parts, `PanelHeader`, `PanelBody`, `PanelFooter`, `Field` (with `InputGroup`), `RadioGroup` (`variant="card"`), `Field` with `Field.Description` and `Field.Error` around `Select`, `NumberInput`, `Input`, `Textarea`, `Link`, `Alert` and `Button`. The same drawer comes in three more shapes, each a variant: ItemRows, an Origins page inside a resource whose Add Origin drawer groups `Item` rows under section-titled flush `Card`s; NestedDrawer, an Add Rule drawer on a resource's Rules Engine whose Origin select creates the missing origin of that same resource in a second, medium drawer stacked above it and selects it back; and DeploymentSettings, the drawer that creates a Deployment Setting from a Build and deployment settings panel. CreateEnvironment is the Create Environment drawer, on its own or stacked above Add Domain; FunctionInstance adds or edits a function instance whose arguments are a `SchemaForm` with a Fields or JSON (`CodeEditor`) `ToggleGroup`. The variants add `PageHeader`, `SettingsRow`, `Card`, `Item`, `Switch`, `Textarea`, `SchemaForm`, `CodeEditor` and `ToggleGroup`.

- Surface: app
- Source: `blocks/create/create-drawer/create-drawer.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-drawer")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [CodeEditor](../../components/code-editor.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, `DrawerTrigger`, `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuRoot`, `DropdownMenuTrigger`, [Field](../../components/field.md), `FieldDescription`, `FieldError`, [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [InputGroup](../../components/input-group.md), [Item](../../components/item.md), [KeyValueList](../../components/key-value-list.md), [Link](../../components/link.md), [NumberInput](../../components/number-input.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [RadioGroup](../../components/radio-group.md), [SchemaForm](../../components/schema-form.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [StatusIndicator](../../components/status-indicator.md), [Switch](../../components/switch.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-locale`
- Skills: `webkit-create-surface`, `webkit-navigation`, `webkit-form`, `webkit-errors`

## Asked as

create domain; add domain; create domain form; add domain drawer; edit domain; new domain; create drawer; custom domain; criar domínio; adicionar domínio; novo domínio; create in drawer; add record; add environment; criar em gaveta; form drawer; side drawer form; add item drawer; edit drawer; dns record form; nested resource form; gaveta de formulário; adicionar registro; formulário lateral; add origin drawer; form in drawer; formulário em gaveta; nested drawer; stacked drawers; drawer on drawer; create related item; create option in select; child form; gaveta aninhada; gavetas empilhadas; criar item relacionado; add rule; create origin in drawer; build and deployment; build deployment settings; deployment settings; deployment defaults; deploy configuration; workload deployment defaults; build settings; configurações de build; configurações de deploy; implantação; create deployment settings; deployment settings drawer; criar configuração de deploy; certificate; upload certificate; tls certificate; pem; certificate expiry; certificado; importar certificado; certificado tls; create environment; environment form; ip allowlist; branch tracking; function instance; function arguments; schema form in drawer; criar ambiente; instância de função

The right-side drawer that adds or edits something that only exists inside another resource: a domain, a DNS record, an environment, a variable, a rule. The user is working on the resource behind it and must keep it in view, so the form slides over the page instead of replacing it. They fill a few sections, press the one commit button and land back where they were, with the new item in the list. The drawer opens over a console page: ItemRows and NestedDrawer draw that page as a page body for `ConsoleLayout` (the layout owns the rail, the header and the `main`).

## When to use

- The item belongs to a resource that is already open (a domain on a workload, a record in a zone, a rule or an origin on a resource), per the surface rule in `skills/webkit-create-surface`.
- Editing that same item from its row menu; the drawer opens on its values and saves them.
- A first-level tuple normally created in bulk, such as variables, the one exception the surface rule allows.
- A select needs another item of the same resource that may not exist yet, such as the origin a new rule sends requests to: the NestedDrawer shape creates it in a second drawer and selects it back.
- A form needs a resource that does not exist yet, first-level ones included, such as the digital certificate of a workload being created: offer `Create certificate` in the field, and the drawer holds that resource's own create form (`large` over a page, `medium` over a drawer) and selects it back. The reader never leaves the form to create it.

## When not to use

- A resource the sidebar routes to: create it on a page with `create/create-page`, or `create/create-wizard` when it needs several pages.
- A blocking yes or no question, or a destructive guard: use `edit/edit-delete-dialog`.
- Deploying what exists: use `create/create-deploy-drawer`, which commits a deployment rather than a record.
- Binding a whole resource that may be reused or created in a create flow: use `create/create-resource-picker`.
- A missing resource whose creation takes several steps, such as a project imported from a repository: open its create page in a new tab and give the field a `Refresh` option.
- Editing the settings of the resource itself: use `edit/edit-resource`.

## Building blocks

### A. Trigger — `Button` (required)

An outlined medium `Button` where the list lives: under the section on the resource's Settings tab, a heading action, or a row menu entry for edit. Its label is the drawer's title and the footer button, word for word.

### B. Drawer frame — `Drawer`, `DrawerContent` (required)

`Drawer` at `size="large"`, the standard drawer, for every shape; only the nested child steps down to `medium`. It portals over the page with an overlay and holds one `form` with an `aria-label` equal to the title. State resets each time the drawer opens, never on close, so the content stays in place while it slides out.

### C. Panel header — `PanelHeader`, `DrawerTitle` (required)

`DrawerTitle` with the action and object, a muted one-line description under it, and the drawer's own close button on the right. The close button, the overlay and Escape are the dismissal; there is no Cancel.

### D. Sections — `PanelBody`, `SettingsGroup` (required)

`PanelBody` holds one `fieldset` disabled while saving, and inside it one `SettingsGroup` per topic, each a title with a `hint` glyph rather than a paragraph. Order them by what the user decides first: here Environment, then Domain.

### E. Environment select — `Field`, `Select` (required)

A large `Select` in a required `Field` with its `Field.Label` and a `Field.Description` that the `Field` ties to the trigger by `aria-describedby`; after a failed submit a `Field.Error` takes its place and the `Field` turns `invalid`. The options are every environment, and the panel ends with a Create Environment option. The helper text says where the item answers, and changes to say when picking an environment the resource does not publish to yet connects it.

### F. Domain source — `Field`, `RadioGroup` (required)

Choice cards: a `RadioGroup` with `variant="card"`, one item per option with a title and a description, grouped in a `fieldset` under a `type="label"` `Field.Legend`. Use cards when each option needs a sentence; a plain radio list when it does not.

### G. Domain name — `Field`, `InputGroup` (required)

A `Field` with its label and an `InputGroup` whose addon shows the free platform suffix while the free option is chosen. The field is `required` from the start (the Required marker shows on the label); after an empty submit the `Field` turns `invalid` and a `Field.Error` (`role="alert"`) says so. Every variant renders field errors the same way: `Field.Error` under the control, never a `Field.Description` swapped to an error.

### H. Certificate — `Field`, `Select`, `FieldDescription` (optional)

Shown only for Bring my own domain. The `Select` preselects a certificate that already covers the address and the `FieldDescription` says so; once the user picks one, it stops following the address.

### I. Context alert — `Alert` (optional)

One info `Alert` at the end of the last section for a fact that governs the whole form, such as the address the resource always keeps. It explains; it never repeats a field's helper.

### J. Footer — `PanelFooter`, `Button` (required)

`PanelFooter` with one primary medium `Button`, alone on the right, labeled like the trigger, with `:loading` while the save is in flight.

### K. Certificate import — `SettingsGroup`, `Field`, `Button`, `PanelFooter` (optional)

In the Certificate state the drawer imports a TLS certificate. A `ToggleGroup` picks Server certificate (certificate and private key) or Trusted CA (certificate only), and the section hint follows it. The certificate is a required `Field` with a code-font `Textarea` for the PEM text and an outlined Upload file `Button` beside its label that reads a .pem, .crt or .cer file into the same field and announces the file it loaded. As soon as the text holds a certificate, a details panel reads it in the browser: Issued to, Issued by, Valid from and Expires in a two-column `KeyValueList`, the expiry carrying a `StatusIndicator` (success with the days left, warning within 30 days with a line saying to renew it, danger once expired), and a note when intermediate certificates follow. Text that is not a PEM certificate, an expired certificate and a missing or malformed private key are errors under their fields, shown only after Save, with focus on the first. The private key's description says it is stored encrypted and never shown again. Save closes the drawer and raises a success toast with the expiry date.

## Data

The block takes its option lists, its starting values and the save state through props and emits the values; it fetches and saves nothing. `CreateDrawerProps`, `CreateDrawerValues`, `CreateDrawerEnvironment` and `CreateDrawerCertificate` are exported from `create-drawer.vue`, and `sample.ts` holds the environments and certificates the block renders when those props are left out.

| Prop                    | Type                          | What it does                                                                                   |
| ----------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `environments`          | `CreateDrawerEnvironment[]`   | Every environment of the account, listed in the Environment select.                            |
| `connectedEnvironments` | `string[]`                    | The environments the resource already publishes to; picking another one says it connects it.   |
| `certificates`          | `CreateDrawerCertificate[]`   | The certificates Bring my own domain can pick; the one covering the address is preselected.    |
| `defaultValues`         | `Partial<CreateDrawerValues>` | The values the form opens on (the edited domain); every open resets to them.                   |
| `title`                 | `string`                      | The trigger label, drawer title and form name (`Add Domain`).                                  |
| `description`           | `string`                      | The muted line under the title.                                                                |
| `submitLabel`           | `string`                      | The footer button label; empty uses `title`.                                                   |
| `open` (`v-model:open`) | `boolean`                     | Whether the drawer is open; the page closes it after a successful save.                        |
| `defaultOpen`           | `boolean`                     | Opens the drawer on mount.                                                                     |
| `loading`               | `boolean`                     | The save is in flight: the fieldset locks and the footer button spins.                         |
| `error`                 | `string`                      | Why the save failed, shown in the danger `Alert` with Retry above the footer; the values stay. |

| Event         | Payload           | When                                                                                     |
| ------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `submit`      | `(event, values)` | A valid Add Domain, or Retry in the error alert; `values` adds `host`, the full address. |
| `update:open` | `(open)`          | The trigger, the close button, the overlay or Escape.                                    |

The `trigger` slot replaces the Add button (an environment menu, a row menu) and receives `open` to call.

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'

  import CreateDrawer, { type CreateDrawerSubmission } from './create-drawer.vue'

  const { environments, certificates, connected } = useDomainOptions()
  const { create, pending } = useCreateDomain()
  const open = ref(false)
  const error = ref('')

  const save = async (_event: Event, values: CreateDrawerSubmission) => {
    error.value = ''
    try {
      await create(values)
      open.value = false
      toast.success(`${values.host} added.`)
    } catch {
      error.value = `${values.host} wasn't added. The request timed out; your values are kept.`
    }
  }
</script>

<template>
  <CreateDrawer
    v-model:open="open"
    :environments="environments"
    :connected-environments="connected"
    :certificates="certificates"
    :loading="pending"
    :error="error"
    @submit="save"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Open on a blank form every time, or on the edited item's values, and clear every error on open.
- Lock the `fieldset` and pass `:disabled` to every control from the same flag while saving; release it on success and on failure.
- Validate on submit only: a required field shows the Required marker from the start, and turns `invalid` with a `Field.Error` only after Save is pressed with it empty.
- Close the drawer on success and show the new item in the list behind it, with a toast that names it (every variant does).
- On a failed save keep the drawer open with the values, release the fieldset and show a danger `Alert` with Retry above the footer (SaveError).
- Stack a second, medium drawer for a missing item of the same resource, such as an origin for a rule, and select the new one back into the parent.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't create in a dialog, or open a page for an item that lives inside a resource.
- Don't add Cancel next to the commit button.
- Don't flag fields while the user is still typing, or colour a required field before a failed submit.
- Don't hide a required field inside a collapsed section.
- Don't reset the form on close; the content would jump while the drawer slides out.
- Don't deploy or publish as a side effect of Save.

## Copy

- **Trigger, title, commit:** one string, `Add <Product Module>` inside a resource, e.g. "Add Domain"; editing keeps the verb the row menu used.
- **Description:** one or two muted sentences with a period under the title, e.g. "A domain is what puts an environment on this resource. Say where it answers, and name the address."
- **Section hints:** one sentence on what the section decides, e.g. "Where the domain answers."
- **Options:** labels name the choice, descriptions one sentence, e.g. "Use your own DNS and point it to this resource."
- **Helper text:** states the consequence of the current value, e.g. "Production publishes with the Deployment Settings set to Single."
- **Required:** "This field is required."
- **Create option:** `Create <Object>` at the foot of the select, e.g. "Create Environment".
- Follow `skills/webkit-microcopy` and `skills/webkit-errors`: sentence case, no em dash, no "please", select rather than pick.

## Accessibility

- The drawer traps focus while open, moves it to the first field on open and returns it to the trigger on close.
- The `form` has an `aria-label` that matches the title; `DrawerTitle` names the dialog.
- Every select trigger is described by its `Field.Description` (or its `Field.Error`) through the `Field`, so the consequence is read with the value.
- Required fields carry the Required marker from the start; an error is a `Field.Error` with `role="alert"` and the control is `aria-invalid`.
- The choice cards are a radio group named by the Domain source label; each card's title and description are the radio's name and description.
- The loading button keeps its label and announces the busy state; the disabled `fieldset` keeps keyboard users out of the form while saving.
- Escape, the close button and the overlay all dismiss; none of them submit.

## States

- Default: Add Domain opened from the resource's Settings tab, blank, on the free domain option; `loading` spins the button while the page saves.
- AddEnvironment: the same form opened from the environment menu (the `trigger` slot), titled and saved as Add Environment (`title`).
- EditDomain: opened from a domain row menu on www.example.com (`defaultValues`, `title`, `submitLabel`), with the Certificate select showing the covering wildcard.
- AddRecord: the DNS zone record form; Name and Value carry the Required marker from the start and turn invalid only after an empty Add Record.
- ItemRows: Add Origin on the Origins page of the storefront resource, a large drawer whose sections are `Item` rows in flush cards, saved together by one Add Origin.
- NestedDrawer: Add Rule on the storefront resource's Rules Engine, with an Origin select whose Create Origin option opens a second, medium drawer and selects the new origin back.
- DeploymentSettings: the drawer that creates a Deployment Setting, with General and Routing and policy sections.
- Certificate: Create Certificate opened with shop.example.com pasted as a server certificate: the details panel reads Issued to shop.example.com, Issued by Example Test CA and the expiry with the days left; the private key is empty, so Save flags it.
- CreateEnvironment: Create Environment with General, Settings, Protection and Branch tracking sections; the IP allowlist and Branch tracking switches each reveal their fields, a duplicate name or an invalid address is flagged only after Create Environment. Opened from Add Domain's Environment select it stacks at medium size above that drawer and selects the new environment back.
- SaveError: Add Domain after a failed save (`error` set, `defaultOpen`, `defaultValues`): the drawer stays open with acme-store and Production kept, the fieldset released, and a danger Alert with Retry above the footer.
- FunctionInstance: Add Function Instance (or Edit from a row) with a Function `Select`, a Name, and the arguments as a `SchemaForm` of the chosen function's schema with a Fields or JSON `ToggleGroup`; the JSON `CodeEditor` marks a parse error, and required arguments are flagged only after submit.

## Related

- `view/view-table` — the list a create drawer usually opens over.
- `detail/detail-resource` — where Add actions on a resource's tabs open this drawer.
- `create/create-page` — the page a first-level resource creates on instead.
- `create/create-deploy-drawer` — the drawer that deploys rather than creates.
- `state/state-form-validation` — the submit-time validation this drawer follows.
- `SettingsGroup` — the band each section is built from; see `skills/webkit-form` for fields and validation.

## Variants

- `Default` — primary (the code below)
- `AddEnvironment` — The same form opened from Add Environment in the resource environment menu, titled and saved as Add Environment.
- `EditDomain` — Edit from a domain row menu: the drawer opens on www.example.com as a domain of its own, so the Certificate select shows with example.com wildcard and the footer saves the domain.
- `AddRecord` — Closed until Add Record opens it, here as a DNS zone renders it: Name with the zone as an addon, Record type, TTL, Value with the placeholder and helper of the selected type, and Description under Settings; Policy type under Policy, with Weight appearing only for the weighted policy. Save on an empty form flags Name and Value as required.
- `ItemRows` — An in-context add whose body is the settings layout: an Origins page inside the storefront resource whose heading action opens a large right-side drawer, and inside it section-titled groups of `Item` rows, each a small heading over a flush `Card`, saved together by the one Add Origin in the footer. An origin lives inside its resource, so it adds in a drawer; a first-level resource such as a service creates on a page instead. General, Connection and Options are the sections. The drawer clears its fields and errors each time it opens, so its content stays in place while it closes. Name and Protocol flag only after Add Origin is pressed. Built from `PageHeader`, `SettingsRow`, `Button`, `Drawer` and its parts, `PanelHeader`, `PanelBody`, `PanelFooter`, `Card`, `Item`, `Input`, `Select`, `Switch` and `FieldError`. The page is a page body for ConsoleLayout.
- `NestedDrawer` — A create drawer whose select needs another item of the same resource that may not exist yet: the Rules Engine page of the storefront resource opens a large Add Rule drawer, and the Create Origin option pinned to the foot of its Origin select opens a second, medium drawer stacked above it on raised layers. Rule and origin both live inside the resource, so both create in drawers; a first-level resource such as a service is never created this way, it creates on a page. Saving the child adds the new origin and selects it back into the rule. Each drawer is its own scoped save, and each clears its fields and errors when it opens, so its content stays in place while it closes. Built from `PageHeader`, `SettingsRow`, `Button`, `Drawer` and its parts, `PanelHeader`, `PanelBody`, `PanelFooter`, `Card`, `Item`, `Input`, `Select` and `FieldError`. The page is a page body for ConsoleLayout.
- `DeploymentSettings` — The drawer that creates a Deployment Setting, opened from the Create Deployment Settings heading action of a Build and deployment settings panel. A form drawer with the title and its description, a General section with the required Name, an optional Description and the Active switch, and a Routing and policy section with the Strict or Flexible binding policy, the Single or Versioned deployment version policy and the Share across services switch, then a submit footer. The form resets every time the drawer opens, never on close, and Name only reads as required once the form is submitted empty. Built from `SettingsGroup`, `Drawer`, the `Panel` parts, `Field` with `Input`, `Textarea` and `Switch` choice cards, `RadioGroup`, `Field.Legend`, `FieldError`, `Hint` and `Button`.
- `Certificate` — Create Certificate: a Server certificate or Trusted CA `ToggleGroup`, a PEM `Textarea` with Upload file, a details panel read from the pasted certificate (issued to, issued by, valid from, and the expiry with a `StatusIndicator` that warns within 30 days and blocks an expired one) and, for a server certificate, the private key; opened with a sample certificate pasted and the key empty.
- `CreateEnvironment` — Create Environment: Name, Description, a Deployment policy and a Robots policy Select whose helpers say what each choice does, an IP allowlist Switch that reveals a Textarea of IPv4 addresses and CIDR ranges checked on submit, and a Branch tracking Switch that reveals the match Mode and the Branch match. It opens on its own at large size, or stacked at medium size above Add Domain from the Environment select's Create Environment option, and the new environment comes back selected.
- `FunctionInstance` — Add or edit a function instance from a resource's instance list: a Function Select and a Name, then the function's arguments as a `SchemaForm` built from the schema it declares, with a Fields or JSON `ToggleGroup`; the JSON view is a `CodeEditor` whose edits update the fields and whose parse errors show as markers. Required arguments show their messages only after submit, and changing the function clears the arguments.
- `SaveError` — Add Domain after a failed save: the drawer stays open with acme-store and Production kept, the fieldset released, and a danger `Alert` above the footer says the domain was not added, with Retry.

Each variant is the same screen in another state: `get_block("create/create-drawer", { variant })`, or the file under `blocks/create/create-drawer/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import InputGroup from '@aziontech/webkit/input-group'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { computed, reactive, ref, watch } from 'vue'

  import { sampleCertificates, sampleConnectedEnvironments, sampleEnvironments } from './sample'

  /** How an environment publishes its deployments. */
  export type CreateDrawerDeploymentPolicy = 'single_version' | 'versioned_urls'

  /** Where the domain comes from: a free platform subdomain or the account's own. */
  export type CreateDrawerDomainKind = 'free' | 'own'

  /** One environment the domain can answer in. */
  export interface CreateDrawerEnvironment {
    /** Stable value, sent in the submitted values. */
    value: string
    /** Display name. */
    label: string
    /** How the environment publishes, named in the helper text. */
    deploymentPolicy: CreateDrawerDeploymentPolicy
  }

  /** One certificate that can serve an own domain. */
  export interface CreateDrawerCertificate {
    /** Certificate id; an empty string is the free platform certificate. */
    value: string
    /** Display name. */
    label: string
    /** The host or wildcard it covers, used to preselect it for the typed address. */
    subject: string
  }

  /** The values of the form. */
  export interface CreateDrawerValues {
    /** Where the domain comes from. */
    kind: CreateDrawerDomainKind
    /** The name as typed, without the free platform suffix. */
    domain: string
    /** The chosen environment value. */
    environment: string
    /** The chosen certificate value, empty for the free platform certificate. */
    certificate: string
  }

  /** What a valid submit sends. */
  export interface CreateDrawerSubmission extends CreateDrawerValues {
    /** The full address, with the free platform suffix when it applies. */
    host: string
  }

  export interface CreateDrawerProps {
    /** Drawer title, trigger label and form name. */
    title?: string
    /** Muted line under the title. */
    description?: string
    /** Footer button label; empty uses the title. */
    submitLabel?: string
    /** Values the form opens on, such as the edited domain. */
    defaultValues?: Partial<CreateDrawerValues>
    /** Opens the drawer on mount. */
    defaultOpen?: boolean
    /** Every environment of the account. Left out, the sample renders. */
    environments?: CreateDrawerEnvironment[]
    /** Environments the resource already publishes to. Left out, the sample renders. */
    connectedEnvironments?: string[]
    /** Certificates that can serve an own domain. Left out, the sample renders. */
    certificates?: CreateDrawerCertificate[]
    /** The save is in flight: the fieldset locks and the button spins. */
    loading?: boolean
    /** Why the save failed, shown in a danger alert with Retry above the footer. */
    error?: string
  }

  const props = withDefaults(defineProps<CreateDrawerProps>(), {
    title: 'Add Domain',
    description:
      'A domain is what puts an environment on this resource. Say where it answers, and name the address.',
    submitLabel: '',
    defaultValues: () => ({}),
    defaultOpen: false,
    environments: undefined,
    connectedEnvironments: undefined,
    certificates: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: CreateDrawerSubmission]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    /** Replaces the Add button; call open to show the drawer. */
    trigger(props: { open: () => void }): unknown
  }>()

  if (props.defaultOpen) open.value = true

  const environmentSelectOpen = ref(false)

  const CREATE_ENVIRONMENT = '__create-environment__'
  const environmentOptions = computed(() => props.environments ?? sampleEnvironments)
  const resourceEnvironments = computed(
    () => props.connectedEnvironments ?? sampleConnectedEnvironments
  )
  const certificateOptions = computed(() => props.certificates ?? sampleCertificates)
  const policyLabels: Record<CreateDrawerDeploymentPolicy, string> = {
    single_version: 'Single',
    versioned_urls: 'Versioned'
  }
  const kindOptions = [
    {
      value: 'free',
      label: 'Use a free platform domain',
      description: 'You can use a free azion.app subdomain.'
    },
    {
      value: 'own',
      label: 'Bring my own domain',
      description: 'Use your own DNS and point it to this resource.'
    }
  ]

  const initialForm = (): CreateDrawerValues => ({
    kind: 'free',
    domain: '',
    environment: '',
    certificate: '',
    ...props.defaultValues
  })
  const form = reactive(initialForm())
  const errors = reactive({ domain: '', environment: '' })
  const certificateTouched = ref(Boolean(form.certificate))

  const openDrawer = () => {
    open.value = true
  }

  const environmentLabel = (value: string) =>
    environmentOptions.value.find((option) => option.value === value)?.label ?? ''
  const certificateLabel = (value: string) =>
    certificateOptions.value.find((option) => option.value === value)?.label ?? ''

  const subjectCovers = (subject: string, host: string) => {
    const pattern = subject.toLowerCase()
    if (!pattern) return false
    if (pattern === host) return true
    if (!pattern.startsWith('*.')) return false
    const parent = pattern.slice(2)
    return (
      host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1
    )
  }

  const certificateForDomain = (host: string) => {
    const name = host.trim().toLowerCase()
    if (!name) return ''
    const candidates = certificateOptions.value.filter((option) =>
      subjectCovers(option.subject, name)
    )
    const exact = candidates.find((option) => option.subject.toLowerCase() === name)
    return (exact ?? candidates[0])?.value ?? ''
  }

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(errors, { domain: '', environment: '' })
    Object.assign(form, initialForm())
    certificateTouched.value = Boolean(form.certificate)
  })

  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? `${name}.azion.app` : name
  })

  watch(
    () => [fullDomain.value, form.kind],
    ([host, kind]) => {
      if (kind === 'free') {
        form.certificate = ''
        return
      }
      if (certificateTouched.value) return
      form.certificate = certificateForDomain(host)
    },
    { immediate: true }
  )

  const onCertificate = (value: string) => {
    certificateTouched.value = true
    form.certificate = value
  }

  const certificateHint = computed(() => {
    if (!form.certificate) {
      return 'Served by the free platform certificate, issued and renewed automatically.'
    }
    const name = certificateLabel(form.certificate)
    return certificateTouched.value
      ? `Served with ${name}.`
      : `${name} already covers this address, so it is selected. Change it if another one should serve it.`
  })

  const chosen = computed(() =>
    environmentOptions.value.find((option) => option.value === form.environment)
  )

  const joinsResource = computed(
    () => Boolean(form.environment) && !resourceEnvironments.value.includes(form.environment)
  )

  const environmentHint = computed(() => {
    if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'
    const policy = policyLabels[chosen.value.deploymentPolicy]
    return joinsResource.value
      ? `This resource doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`
      : `${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`
  })

  const onEnvironmentModel = (value: string) => {
    if (value === CREATE_ENVIRONMENT) {
      environmentSelectOpen.value = false
      return
    }
    form.environment = value
    errors.environment = ''
  }

  const validate = () => {
    errors.domain = form.domain.trim() ? '' : 'This field is required.'
    errors.environment = form.environment ? '' : 'This field is required.'
    return !errors.domain && !errors.environment
  }

  const submit = (event: Event) => {
    if (props.loading) return
    if (!validate()) return
    emit('submit', event, { ...form, host: fullDomain.value })
  }
</script>

<template>
  <slot
    name="trigger"
    :open="openDrawer"
  >
    <Button
      type="button"
      :label="title"
      variant="outline"
      size="medium"
      icon="az az-plus"
      @click="openDrawer"
    />
  </slot>

  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">{{ description }}</p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="loading"
          >
            <legend class="sr-only">{{ title }}</legend>
            <SettingsGroup
              label="Environment"
              hint="Where the domain answers."
            >
              <Field
                required
                :invalid="!!errors.environment"
              >
                <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                  <Field.Label for="domain-environment">Environment</Field.Label>
                </div>
                <Select
                  v-model:open="environmentSelectOpen"
                  :model-value="form.environment"
                  size="large"
                  class="w-full"
                  placeholder="Select an environment"
                  :disabled="loading"
                  :invalid="!!errors.environment"
                  :display-value="environmentLabel"
                  @update:model-value="onEnvironmentModel"
                >
                  <Select.Trigger id="domain-environment" />
                  <Select.Content>
                    <Select.Item
                      v-for="option in environmentOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                    <template #footer>
                      <Select.Item
                        :value="CREATE_ENVIRONMENT"
                        class="w-full"
                      >
                        Create Environment
                      </Select.Item>
                    </template>
                  </Select.Content>
                </Select>
                <Field.Error v-if="errors.environment">{{ errors.environment }}</Field.Error>
                <Field.Description v-else>{{ environmentHint }}</Field.Description>
              </Field>
            </SettingsGroup>

            <SettingsGroup
              label="Domain"
              hint="The address this resource answers on, where it comes from, and the certificate it is served with."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
                  <Field.Legend type="label">Domain source</Field.Legend>
                  <RadioGroup
                    v-model="form.kind"
                    variant="card"
                    name="domain-kind"
                    aria-label="Domain source"
                    :disabled="loading"
                  >
                    <RadioGroup.Item
                      v-for="option in kindOptions"
                      :key="option.value"
                      :value="option.value"
                      :description="option.description"
                      >{{ option.label }}</RadioGroup.Item
                    >
                  </RadioGroup>
                </fieldset>

                <Field
                  :disabled="loading"
                  required
                  :invalid="!!errors.domain"
                >
                  <Field.Label>Domain</Field.Label>
                  <InputGroup>
                    <InputGroup.Input
                      v-model="form.domain"
                      placeholder="my-resource"
                      @update:model-value="errors.domain = ''"
                    />
                    <InputGroup.Addon v-if="form.kind === 'free'">.azion.app</InputGroup.Addon>
                  </InputGroup>
                  <Field.Error v-if="errors.domain">{{ errors.domain }}</Field.Error>
                </Field>

                <template v-if="form.kind === 'own'">
                  <Field>
                    <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                      <Field.Label for="domain-certificate">Certificate</Field.Label>
                    </div>
                    <Select
                      :model-value="form.certificate"
                      size="large"
                      class="w-full"
                      :disabled="loading"
                      :display-value="certificateLabel"
                      @update:model-value="onCertificate"
                    >
                      <Select.Trigger
                        id="domain-certificate"
                        aria-describedby="domain-certificate-helper"
                      />
                      <Select.Content>
                        <Select.Item
                          v-for="option in certificateOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                    <FieldDescription id="domain-certificate-helper">{{
                      certificateHint
                    }}</FieldDescription>
                  </Field>
                </template>

                <Alert
                  severity="info"
                  label="Your resource is always accessible at an azion.app subdomain based on its name. Custom domains allow visitors to reach it at your own domain."
                />
              </div>
            </SettingsGroup>
          </fieldset>
        </PanelBody>

        <div
          v-if="error"
          class="px-(--spacing-md) pb-(--spacing-sm)"
        >
          <Alert
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="submit"
          />
        </div>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              :label="submitLabel || title"
              variant="primary"
              size="medium"
              :loading="loading"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
```

## `sample.ts`

```ts
import type { CreateDrawerCertificate, CreateDrawerEnvironment } from './create-drawer.vue'

export const sampleEnvironments: CreateDrawerEnvironment[] = [
  { value: 'Production', label: 'Production', deploymentPolicy: 'single_version' },
  { value: 'Preview', label: 'Preview', deploymentPolicy: 'versioned_urls' },
  { value: 'Stage', label: 'Stage', deploymentPolicy: 'versioned_urls' }
]

export const sampleConnectedEnvironments: string[] = ['Production', 'Preview']

export const sampleCertificates: CreateDrawerCertificate[] = [
  { value: '', label: 'Free platform certificate', subject: '' },
  { value: 'cert-8801', label: 'example.com wildcard', subject: '*.example.com' },
  { value: 'cert-8803', label: 'api.example.com', subject: 'api.example.com' },
  { value: 'cert-8805', label: 'staging wildcard', subject: '*.staging.example.com' },
  { value: 'cert-8802', label: 'example.org', subject: 'example.org' }
]
```
