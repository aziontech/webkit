# CreateInDrawer (`platform/create/create-in-drawer`)

> The right-side form drawer every item created or edited inside a resource opens, such as a domain, a record, an environment, a variable or a rule: a panel header with the title, a muted one-line description and the close button; a disabled-while-saving fieldset of `SettingsSection` bands, each a heading with a hint glyph over its stacked `Field` components; and one submit button in the footer that flags empty required fields only after it is pressed and shows its loading state while the save is in flight. Its state resets each time it opens, so the content stays in place while it closes. Add Domain opens from under Domains on the resource’s Settings tab, from a domain row menu to edit it, and from Add Environment in the resource environment menu. The Environment select lists every environment, says when choosing one connects it to the resource, and ends in a Create Environment option. Choosing Bring my own domain drops the free-domain addon and reveals the Certificate select, preselecting a certificate that already covers the address. Built from `SettingsSection`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field` (with `InputGroup` and `RadioButton` choice cards), `Field` and `HelperText` around `Select`, `NumberInput`, `Input`, `Textarea`, `Link`, `Alert` and `Button`. The same drawer comes in three more shapes, each a variant: ItemRows, an Origins page inside a resource whose Add Origin drawer groups `Item` rows under section-titled flush `Card`s; NestedDrawer, an Add Rule drawer on a resource's Rules Engine whose Origin select creates the missing origin of that same resource in a second, medium drawer stacked above it and selects it back; and DeploymentSettings, the drawer that creates a Deployment Setting from a Build and deployment settings panel. The variants add `PageHeader`, `SettingRow`, the platform shell, `Card`, `Item` and `Switch`.

- Surface: product
- Source: `blocks/platform/create/create-in-drawer/create-in-drawer.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/create-in-drawer")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [ButtonHighlight](../../../components/button-highlight.md), [Card](../../../components/card.md), [Command](../../../components/command.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DrawerTrigger`, [DropdownMenu](../../../components/dropdown-menu.md), `DropdownMenuGroup`, `DropdownMenuOption`, `DropdownMenuRoot`, `DropdownMenuTrigger`, [Field](../../../components/field.md), [GlobalHeader](../../../components/global-header.md), [HelperText](../../../components/helper-text.md), [Hint](../../../components/hint.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [InputGroup](../../../components/input-group.md), [Item](../../../components/item.md), [KeyValuePairs](../../../components/key-value-pairs.md), [Link](../../../components/link.md), [Menu](../../../components/menu.md), [NumberInput](../../../components/number-input.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [RadioButton](../../../components/radio-button.md), [SearchTrigger](../../../components/search-trigger.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Sidebar](../../../components/sidebar.md), [StatusIndicator](../../../components/status-indicator.md), [Switch](../../../components/switch.md), [Textarea](../../../components/textarea.md), [ThemeSwitcher](../../../components/theme-switcher.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-errors`

## Asked as

create domain; add domain; create domain form; add domain drawer; edit domain; new domain; create drawer; custom domain; criar domínio; adicionar domínio; novo domínio; create in drawer; add record; add environment; criar em gaveta; form drawer; side drawer form; add item drawer; edit drawer; dns record form; nested resource form; gaveta de formulário; adicionar registro; formulário lateral; add origin drawer; form in drawer; formulário em gaveta; nested drawer; stacked drawers; drawer on drawer; create related item; create option in select; child form; gaveta aninhada; gavetas empilhadas; criar item relacionado; add rule; create origin in drawer; build and deployment; build deployment settings; deployment settings; deployment defaults; deploy configuration; workload deployment defaults; build settings; configurações de build; configurações de deploy; implantação; create deployment settings; deployment settings drawer; criar configuração de deploy; certificate; upload certificate; tls certificate; pem; certificate expiry; certificado; importar certificado; certificado tls

The right-side drawer that adds or edits something that only exists inside another resource: a domain, a DNS record, an environment, a variable, a rule. The user is working on the resource behind it and must keep it in view, so the form slides over the page instead of replacing it. They fill a few sections, press the one commit button and land back where they were, with the new item in the list.

## When to use

- The item belongs to a resource that is already open (a domain on a workload, a record in a zone, a rule or an origin on a resource), per the surface rule in `skills/webkit-create-surface`.
- Editing that same item from its row menu; the drawer opens on its values and saves them.
- A first-level tuple normally created in bulk, such as variables, the one exception the surface rule allows.
- A select needs another item of the same resource that may not exist yet, such as the origin a new rule sends requests to: the NestedDrawer shape creates it in a second drawer and selects it back.

## When not to use

- A resource the sidebar routes to: create it on a page with `platform/create/single-page-create`, or `platform/create/multipage-create` when it needs several pages.
- A blocking yes or no question, or a destructive guard: use `platform/delete/delete-with-confirmation`.
- Deploying what exists: use `platform/create/deploy-drawer`, which commits a deployment rather than a record.
- Binding a whole resource that may be reused or created in a create flow: use `platform/create/resource-picker`.
- A select that needs a missing first-level resource, such as a service or a function: the stacked drawer would create on the wrong surface. Link to that resource's create page, or bind it with `platform/create/resource-picker`.
- Editing the settings of the resource itself: use `platform/edit/edit-resource`.

## Building blocks

### A. Trigger — `Button` (required)

An outlined medium `Button` where the list lives: under the section on the resource's Settings tab, a heading action, or a row menu entry for edit. Its label is the drawer's title and the footer button, word for word.

### B. Drawer frame — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

`Drawer` at `size="medium"` for a form of two or three sections; large for the ItemRows shape. It portals over the page with an overlay and holds one `form` with an `aria-label` equal to the title. State resets each time the drawer opens, never on close, so the content stays in place while it slides out.

### C. Panel header — `PanelHeader`, `DrawerTitle`, `DrawerClose` (required)

`DrawerTitle` with the action and object, a muted one-line description under it, and `DrawerClose` on the right. The close button, the overlay and Escape are the dismissal; there is no Cancel.

### D. Sections — `PanelContent`, `SettingsSection` (required)

`PanelContent` holds one `fieldset` disabled while saving, and inside it one `SettingsSection` per topic, each a title with a `hint` glyph rather than a paragraph. Order them by what the user decides first: here Environment, then Domain.

### E. Environment select — `Field`, `Select`, `HelperText` (required)

A large `Select` in a `Field` with its `Field.Label` and a `HelperText` tied to the trigger by `aria-describedby`. The options are every environment, and the panel ends with a Create Environment option. The helper text says where the item answers, and changes to say when picking an environment the resource does not publish to yet connects it.

### F. Domain source — `Field`, `RadioButton` (required)

Choice cards: one horizontal `Field` per option with a `RadioButton`, a title and a description, grouped in a `fieldset` under a `kind="label"` `Field.Legend`. Use cards when each option needs a sentence; a plain radio list when it does not.

### G. Domain name — `Field`, `InputGroup` (required)

A `Field` with its label and an `InputGroup` whose addon shows the free platform suffix while the free option is chosen. The required message appears in the field description only after submit.

### H. Certificate — `Field`, `Select`, `HelperText` (optional)

Shown only for Bring my own domain. The `Select` preselects a certificate that already covers the address and the `HelperText` says so; once the user picks one, it stops following the address.

### I. Context alert — `Alert` (optional)

One info `Alert` at the end of the last section for a fact that governs the whole form, such as the address the resource always keeps. It explains; it never repeats a field's helper.

### J. Footer — `PanelFooter`, `Button` (required)

`PanelFooter` with one primary medium `Button`, alone on the right, labeled like the trigger, with `:loading` while the save is in flight.

### K. Certificate import — `SettingsSection`, `Field`, `Button`, `PanelFooter` (optional)

In the Certificate state the drawer imports a TLS certificate. A `ToggleGroup` picks Server certificate (certificate and private key) or Trusted CA (certificate only), and the section hint follows it. The certificate is a required `Field` with a code-font `Textarea` for the PEM text and an outlined Upload file `Button` beside its label that reads a .pem, .crt or .cer file into the same field and announces the file it loaded. As soon as the text holds a certificate, a details panel reads it in the browser: Issued to, Issued by, Valid from and Expires in a two-column `KeyValuePairs`, the expiry carrying a `StatusIndicator` (success with the days left, warning within 30 days with a line saying to renew it, danger once expired), and a note when intermediate certificates follow. Text that is not a PEM certificate, an expired certificate and a missing or malformed private key are errors under their fields, shown only after Save, with focus on the first. The private key's description says it is stored encrypted and never shown again. Save closes the drawer and raises a success toast with the expiry date.

## Do

- Open on a blank form every time, or on the edited item's values, and clear every error on open.
- Lock the `fieldset` and pass `:disabled` to every control from the same flag while saving; release it on success and on failure.
- Validate on submit only: an empty required field gets the amber required prompt after Save is pressed.
- Close the drawer on success and show the new item in the list behind it, with a toast that names it.
- Stack a second, medium drawer for a missing item of the same resource, such as an origin for a rule, and select the new one back into the parent.

## Don't

- Don't create in a dialog, or open a page for an item that lives inside a resource.
- Don't add Cancel next to the commit button.
- Don't flag fields while the user is still typing, or show required and invalid on one field at once.
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
- Every select trigger points at its `HelperText` with `aria-describedby`, so the consequence is read with the value.
- The choice cards are a radio group named by the Domain source label; each card's title and description are the radio's name and description.
- The loading button keeps its label and announces the busy state; the disabled `fieldset` keeps keyboard users out of the form while saving.
- Escape, the close button and the overlay all dismiss; none of them submit.

## States

- Default: Add Domain opened from the resource's Settings tab, blank, on the free domain option.
- AddEnvironment: the same form opened from the environment menu, titled and saved as Add Environment.
- EditDomain: opened from a domain row menu on www.example.com, with the Certificate select showing the covering wildcard.
- AddRecord: the DNS zone record form; Name and Value are flagged as required only after an empty Add Record.
- ItemRows: Add Origin on the Origins page of the storefront resource, a large drawer whose sections are `Item` rows in flush cards, saved together by one Add Origin.
- NestedDrawer: Add Rule on the storefront resource's Rules Engine, with an Origin select whose Create Origin option opens a second, medium drawer and selects the new origin back.
- DeploymentSettings: the drawer that creates a Deployment Setting, with General and Routing and policy sections.
- Certificate: Create Certificate opened with shop.example.com pasted as a server certificate: the details panel reads Issued to shop.example.com, Issued by Example Test CA and the expiry with the days left; the private key is empty, so Save flags it.

## Related

- `platform/view/table-view` — the list a create drawer usually opens over.
- `platform/detail/details-page` — where Add actions on a resource's tabs open this drawer.
- `platform/create/single-page-create` — the page a first-level resource creates on instead.
- `platform/create/deploy-drawer` — the drawer that deploys rather than creates.
- `platform/states/form-validation` — the submit-time validation this drawer follows.
- `SettingsSection` — the band each section is built from; see `skills/webkit-form` for fields and validation.

## Variants

- `Default` — primary (the code below)
- `AddEnvironment` — The same form opened from Add Environment in the resource environment menu, titled and saved as Add Environment.
- `EditDomain` — Edit from a domain row menu: the drawer opens on www.example.com as a domain of its own, so the Certificate select shows with example.com wildcard and the footer saves the domain.
- `AddRecord` — Closed until Add Record opens it, here as a DNS zone renders it: Name with the zone as an addon, Record type, TTL, Value with the placeholder and helper of the selected type, and Description under Settings; Policy type under Policy, with Weight appearing only for the weighted policy. Save on an empty form flags Name and Value as required.
- `ItemRows` — An in-context add whose body is the settings layout: an Origins page inside the storefront resource whose heading action opens a large right-side drawer, and inside it section-titled groups of `Item` rows, each a small heading over a flush `Card`, saved together by the one Add Origin in the footer. An origin lives inside its resource, so it adds in a drawer; a first-level resource such as a service creates on a page instead. General, Connection and Options are the sections. The drawer clears its fields and errors each time it opens, so its content stays in place while it closes. Name and Protocol flag only after Add Origin is pressed. Built from `PageHeader`, `SettingRow`, the platform shell, `Button`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Card`, `Item`, `Input`, `Select`, `Switch` and `HelperText`.
- `NestedDrawer` — A create drawer whose select needs another item of the same resource that may not exist yet: the Rules Engine page of the storefront resource opens a large Add Rule drawer, and the Create Origin option pinned to the foot of its Origin select opens a second, medium drawer stacked above it on raised layers. Rule and origin both live inside the resource, so both create in drawers; a first-level resource such as a service is never created this way, it creates on a page. Saving the child adds the new origin and selects it back into the rule. Each drawer is its own scoped save, and each clears its fields and errors when it opens, so its content stays in place while it closes. Built from `PageHeader`, `SettingRow`, the platform shell, `Button`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Card`, `Item`, `Input`, `Select` and `HelperText`.
- `DeploymentSettings` — The drawer that creates a Deployment Setting, opened from the Create Deployment Settings heading action of a Build and deployment settings panel. A form drawer with the title and its description, a General section with the required Name, an optional Description and the Active switch, and a Routing and policy section with the Strict or Flexible binding policy, the Single or Versioned deployment version policy and the Share across services switch, then a submit footer. The form resets every time the drawer opens, never on close, and Name only reads as required once the form is submitted empty. Built from `SettingsSection`, `Drawer`, the `Panel` parts, `Field` with `Input`, `Textarea`, `RadioButton` and `Switch` choice cards, `Field.Legend`, `HelperText`, `Hint` and `Button`.
- `Certificate` — Create Certificate: a Server certificate or Trusted CA `ToggleGroup`, a PEM `Textarea` with Upload file, a details panel read from the pasted certificate (issued to, issued by, valid from, and the expiry with a `StatusIndicator` that warns within 30 days and blocks an expired one) and, for a server certificate, the private key; opened with a sample certificate pasted and the key empty.

Each variant is the same screen in another state: `get_pattern("platform/create/create-in-drawer", { variant })`, or the file under `blocks/platform/create/create-in-drawer/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroup from '@aziontech/webkit/input-group'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { computed, reactive, ref, watch } from 'vue'

  const open = ref(false)
  const submitting = ref(false)
  const environmentSelectOpen = ref(false)
  const certificateTouched = ref(false)

  const CREATE_ENVIRONMENT = '__create-environment__'
  const environmentOptions = [
    { value: 'Production', label: 'Production', deploymentPolicy: 'single_version' },
    { value: 'Preview', label: 'Preview', deploymentPolicy: 'versioned_urls' },
    { value: 'Stage', label: 'Stage', deploymentPolicy: 'versioned_urls' }
  ]
  const policyLabels = { single_version: 'Single', versioned_urls: 'Versioned' }
  const resourceEnvironments = ['Production', 'Preview']
  const certificateOptions = [
    { value: '', label: 'Free platform certificate', subject: '' },
    { value: 'cert-8801', label: 'example.com wildcard', subject: '*.example.com' },
    { value: 'cert-8803', label: 'api.example.com', subject: 'api.example.com' },
    { value: 'cert-8805', label: 'staging wildcard', subject: '*.staging.example.com' },
    { value: 'cert-8802', label: 'example.org', subject: 'example.org' }
  ]
  const kindOptions = [
    {
      value: 'free',
      label: 'Use a free platform domain',
      description: 'You can use a free example.app subdomain.'
    },
    {
      value: 'own',
      label: 'Bring my own domain',
      description: 'Use your own DNS and point it to this resource.'
    }
  ]

  const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })
  const form = reactive(blankForm())
  const errors = reactive({ domain: '', environment: '' })

  const environmentLabel = (value) =>
    environmentOptions.find((option) => option.value === value)?.label ?? ''
  const certificateLabel = (value) =>
    certificateOptions.find((option) => option.value === value)?.label ?? ''

  const subjectCovers = (subject, host) => {
    const pattern = subject.toLowerCase()
    if (!pattern) return false
    if (pattern === host) return true
    if (!pattern.startsWith('*.')) return false
    const parent = pattern.slice(2)
    return (
      host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1
    )
  }

  const certificateForDomain = (host) => {
    const name = host.trim().toLowerCase()
    if (!name) return ''
    const candidates = certificateOptions.filter((option) => subjectCovers(option.subject, name))
    const exact = candidates.find((option) => option.subject.toLowerCase() === name)
    return (exact ?? candidates[0])?.value ?? ''
  }

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(errors, { domain: '', environment: '' })
    submitting.value = false
    Object.assign(form, blankForm())
    certificateTouched.value = false
  })

  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? `${name}.example.app` : name
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

  const onCertificate = (value) => {
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
    environmentOptions.find((option) => option.value === form.environment)
  )

  const joinsResource = computed(
    () => Boolean(form.environment) && !resourceEnvironments.includes(form.environment)
  )

  const environmentHint = computed(() => {
    if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'
    const policy = policyLabels[chosen.value.deploymentPolicy]
    return joinsResource.value
      ? `This resource doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`
      : `${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`
  })

  const onEnvironmentModel = (value) => {
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

  const submit = () => {
    if (submitting.value) return
    if (!validate()) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
    }, 600)
  }
</script>

<template>
  <Button
    type="button"
    label="Add Domain"
    kind="outlined"
    size="medium"
    icon="pi pi-plus"
    @click="open = true"
  />

  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add Domain"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Add Domain</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                A domain is what puts an environment on this resource. Say where it answers, and
                name the address.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Add Domain</legend>
              <SettingsSection
                title="Environment"
                hint="Where the domain answers."
              >
                <Field
                  :data-field-invalid="errors.environment ? true : null"
                  :required="!!errors.environment"
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
                    :disabled="submitting"
                    :invalid="!!errors.environment"
                    :display-value="environmentLabel"
                    @update:model-value="onEnvironmentModel"
                  >
                    <Select.Trigger
                      id="domain-environment"
                      aria-describedby="domain-environment-helper"
                    />
                    <Select.Content>
                      <Select.Option
                        v-for="option in environmentOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                      <template #footer>
                        <Select.Option
                          :value="CREATE_ENVIRONMENT"
                          class="w-full"
                        >
                          Create Environment
                        </Select.Option>
                      </template>
                    </Select.Content>
                  </Select>
                  <HelperText
                    id="domain-environment-helper"
                    :kind="errors.environment ? 'required' : 'helper'"
                  >
                    <template v-if="errors.environment">{{ errors.environment }}</template>
                    <template v-else>{{ environmentHint }}</template>
                  </HelperText>
                </Field>
              </SettingsSection>

              <SettingsSection
                title="Domain"
                hint="The address this resource answers on, where it comes from, and the certificate it is served with."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <Field.Legend kind="label">Domain source</Field.Legend>
                    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                      <Field.Label
                        v-for="option in kindOptions"
                        :key="option.value"
                      >
                        <Field
                          orientation="horizontal"
                          :disabled="submitting"
                        >
                          <RadioButton
                            v-model="form.kind"
                            :value="option.value"
                            name="domain-kind"
                            :input-id="'domain-kind-' + option.value"
                          />
                          <Field.Content>
                            <Field.Title>{{ option.label }}</Field.Title>
                            <Field.Description v-if="option.description">{{
                              option.description
                            }}</Field.Description>
                          </Field.Content>
                        </Field>
                      </Field.Label>
                    </div>
                  </fieldset>

                  <Field
                    :disabled="submitting"
                    :required="!!errors.domain"
                  >
                    <Field.Label>Domain</Field.Label>
                    <InputGroup>
                      <InputGroup.Input
                        v-model="form.domain"
                        placeholder="my-resource"
                        @update:model-value="errors.domain = ''"
                      />
                      <InputGroup.Addon v-if="form.kind === 'free'">.example.app</InputGroup.Addon>
                    </InputGroup>
                    <Field.Description v-if="errors.domain">{{ errors.domain }}</Field.Description>
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
                        :disabled="submitting"
                        :display-value="certificateLabel"
                        @update:model-value="onCertificate"
                      >
                        <Select.Trigger
                          id="domain-certificate"
                          aria-describedby="domain-certificate-helper"
                        />
                        <Select.Content>
                          <Select.Option
                            v-for="option in certificateOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                      <HelperText
                        id="domain-certificate-helper"
                        kind="helper"
                        >{{ certificateHint }}</HelperText
                      >
                    </Field>
                  </template>

                  <Alert
                    severity="info"
                    label="Your resource is always accessible at an example.app subdomain based on its name. Custom domains allow visitors to reach it at your own domain."
                  />
                </div>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
              <Button
                label="Add Domain"
                kind="primary"
                size="medium"
                :loading="submitting"
                type="submit"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
```
