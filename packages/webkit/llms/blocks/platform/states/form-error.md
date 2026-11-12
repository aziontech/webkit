# FormError (`platform/states/form-error`)

> The form-error pattern from the design sample (`/forms/error-validation`): a server rejection scoped to one section of a long create form. A Create Service page whose linked origin is deleted by another user while the form is open; Save sends it, the API answers with a field-scoped error, and the page scrolls to the Origin section, where one danger `Alert` opens under the section heading saying what happened and that nothing else was lost, with the recovery action on it (Reload origins). The Origin select turns invalid with its own one-line reason under it and takes the focus. Never a toast, never a validation summary. Reloading swaps the select for a `Skeleton` and disables Save; Reloaded closes the Alert, clears the select and flags it required. A dashed simulation panel above the form plays the other user. Same page anatomy as Templates/Platform/Create/SinglePageCreate: the creation header, section headings over flush `Card` groups of `Item` rows, and a sticky footer raised with `z-10`. Built from `SectionHeader`, `SettingRow`, `SaveBar`, `GlobalHeader`, `IconButton`, `Breadcrumb`, `Avatar`, `Tag`, `Card`, `Item`, `Input`, `MultiSelect`, `Select`, `Field` with `RadioButton` choice cards, `Switch`, `NumberInput`, `Skeleton`, `Alert`, `HelperText` and `Button`. A focused create page with its own creation header and no rail: render it outside ConsoleLayout.

- Surface: product
- Source: `blocks/platform/states/form-error/form-error.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/states/form-error")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Field](../../../components/field.md), [GlobalHeader](../../../components/global-header.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [MultiSelect](../../../components/multi-select.md), [NumberInput](../../../components/number-input.md), [RadioButton](../../../components/radio-button.md), [SaveBar](../../../components/save-bar.md), [SectionHeader](../../../components/section-header.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [Skeleton](../../../components/skeleton.md), [Switch](../../../components/switch.md), [Tag](../../../components/tag.md)
- Skills: `webkit-errors`, `webkit-form`, `webkit-ui-states`

## Asked as

form error; server validation; server-side error; rejected save; field scoped error; section error; stale reference; linked resource deleted; api error on save; reload options; erro de formulário; validação no servidor; erro da api; salvamento rejeitado; error de formulario; validación en el servidor

The form-error pattern, taken from the design sample (`/forms/error-validation`): what a long create form does when the server rejects the save because of one section. The user's job is to create a service; another user deletes the origin it links to while the form is open, so the save comes back with an error the Origin section owns. The page takes the user to that section, says what happened and that nothing else was lost, offers the one action that recovers (Reload origins), and marks the field with its own reason. This is the standard for every server rejection that a section or a field owns.

This block is a focused create page with its own creation header and no rail: render it outside `ConsoleLayout` (`shells/console`).

## When to use

- A long, sectioned create or edit form whose save can be rejected because of one section: a linked resource deleted or changed by someone else, a value the server refuses for that section only.
- As the reference for where a field-scoped or section-scoped server error renders, and how the user recovers without retyping anything.

## When not to use

- The submit states of a short form (required, invalid, in flight, a conflict on a one-section form, an unscoped failure, success): use `platform/states/form-validation`.
- A long-running action that reports back later (build, deploy): use `platform/states/async-submit`.
- A failure no field or section owns (network, timeout, 500): an error toast with Retry, as in `platform/states/form-validation` ServerError.
- Signed-out screens: use `platform/auth`, where every outcome lands in one card `Alert`.

## Building blocks

### A. Creation header — `GlobalHeader` (required)

The full-width header of a creation page: back, brand and location on the start side, the account on the end side. Same frame as `headers/creation-header`.

### B. Back — `IconButton` (required)

`pi-chevron-left`, `kind="outlined"`, with `aria-label="Back to Forms"`.

### C. Product mark — `Brand` (required)

Inside a link to Home.

### D. Location — `Breadcrumb` (required)

Where the form sits, ending in the page.

### E. Account — `Avatar` (required)

The signed-in user, inside a labelled button.

### F. Simulation — `Tag` (simulation only)

In the dashed `aside` labelled `Scenario simulation`: `Server in sync` (`success`) or `Deleted server-side: web-origin-prod` (`danger`). The panel is a story device that plays the other user; a real page has no such control.

### G. Actions — `Button` (required)

Simulation controls (`User 2 deletes the linked origin`, `Reset scenario`), the recovery action on the section `Alert` (`Reload origins`, `kind="secondary"`, `loading` while it runs), and the footer's `Cancel` and `Save`.

### H. Section heading — `SectionHeader` (required)

Over every group. The Origin heading carries an id so the save can scroll it into view; the section `Alert` opens right under it.

### I. Group surface — `Card` (required)

`:padded="false"` around each section's rows.

### J. Rows — `Item` (required)

`Item.List` inside each `Card`, one row per setting.

### K. Setting row — `SettingRow` (required)

Title and description on the start side, the control on the end side.

### L. Text values — `Input` (required)

Name and Host header, each with an `aria-label` and its error wired by `aria-describedby`.

### M. Ports — `MultiSelect` (required)

HTTP ports, with `MultiSelect.Trigger` carrying the id the error points at.

### N. Linked resource — `Select` (required)

The Origin. It takes `invalid` when the server says the chosen origin no longer exists, and `required` once the list is reloaded without it.

### O. Choice cards — `Field` (required)

Protocol usage, a `fieldset` of `Field`s each wrapping a `RadioButton` with a label and a description.

### P. Choice — `RadioButton` (required)

One per protocol option.

### Q. Toggles — `Switch` (required)

The feature rows.

### R. Numbers — `NumberInput` (required)

The cache TTLs, `min="0"`.

### S. Field reason — `HelperText` (required)

Under the control, one line: `kind="invalid"` for a value the server refused (`This origin no longer exists.`), `kind="required"` for an empty one (`Select an origin to continue.`).

### T. Section notice — `Alert` (rejection only)

One danger `Alert` under the section heading that owns the error, with the recovery action in its `action` slot. It opens with an expand transition (`motion-reduce:transition-none`) and closes once the user recovers or changes the value.

### U. Loading — `Skeleton` (reloading only)

Stands in for the Origin select while the list reloads, with an accessible name (`Loading origins`).

### V. Footer — `SaveBar` (required)

Sticky at the end of the page, raised with `z-10`: `Cancel` and `Save`. Save shows `loading` while the request is in flight and is disabled while the list reloads.

## Do

- Put a section-scoped server rejection in a danger `Alert` under that section's heading, and set the field it names to `invalid` with its own one-line reason. Both surfaces, never one.
- Say in the `Alert`, as separate sentences, what happened, why, that nothing else was lost, and what to do: `Origin "web-origin-prod" no longer exists. Another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.`
- Put the recovery on the `Alert` itself (`Reload origins`), not in the footer and not in a toast.
- Scroll the section into view and move focus to the field, after the lock is released; an instant scroll when `prefers-reduced-motion` is set.
- Keep every entry. Only the field the server refused changes, and only after the user recovers.
- While the recovery runs, show its `loading`, replace the field by a `Skeleton` and disable Save.
- After the recovery, close the `Alert`, clear the stale value and flag the field `required` with what to do next.

## Don't

- Don't toast a rejection a section or field owns: the toast leaves, and it points nowhere.
- Don't show a validation summary at the top of the page.
- Don't clear the form or send the user back to the start.
- Don't use the amber `required` state for a value the server refused; the value is there, so it is `invalid`.
- Don't auto-dismiss the `Alert`; it stays until the user recovers.
- Don't open more than one `Alert` for one rejection.

## Copy

- **Section Alert:** the fact, the cause, what was not lost, what to do: `Origin "web-origin-prod" no longer exists. Another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.`
- **Recovery action:** verb plus the thing reloaded: `Reload origins`.
- **Field reason (refused):** `This origin no longer exists.`
- **Field reason (after reload):** `Select an origin to continue.`
- **Required messages:** `Name is required.`, `Host header is required.`, `Select an origin.`, `Select at least one HTTP port.`
- **Simulation panel:** a colon, never a dash: `Simulation: the other user`.
- **Actions:** `Cancel`, `Save`, `Reload origins`.

## Accessibility

- The `<form>` has an accessible name and `novalidate`; while the request is in flight the fields sit in a disabled `fieldset`.
- The `Alert` sits in reading order before the fields it governs; its action is a real button reachable by keyboard.
- Focus moves to the refused field after the save, with `preventScroll` so the scroll to the section heading is the only movement.
- The field's reason is wired to the control with `aria-describedby`.
- The `Skeleton` has an accessible name while the list reloads.
- The `Alert`'s expand and the page entrance honour `prefers-reduced-motion`.

## States

- InSync: the form filled in and linked to an origin that still exists; the simulation panel reads Server in sync.
- Rejected: User 2 deleted the origin and Save was pressed; the page scrolls to Origin, the danger `Alert` opens under its heading with Reload origins, and focus lands on the Origin select, which reads This origin no longer exists.
- Reloading: Reload origins in flight; its button loads, the select gives way to a `Skeleton`, Save is disabled.
- Reloaded: the list is back without the deleted origin; the `Alert` closes, the select is cleared and flagged required with Select an origin to continue.

## Related

- `platform/states/form-validation` — the submit states of a short form, including a conflict on a one-section form and an unscoped failure.
- `platform/states/async-submit` — the long-running counterpart, where the outcome reports back wherever the user is.
- `platform/create/single-page-create` — the sectioned create page this one is built on.
- `skills/webkit-errors` — where every error renders, row by row.

## Variants

- `InSync` — primary (the code below)
- `Rejected` — User 2 deleted web-origin-prod and Save was pressed: the page scrolls to the Origin section, the danger Alert opens under its heading with Reload origins, and focus lands on the Origin select, which reads This origin no longer exists.
- `Reloading` — Reload origins in flight: its button shows the loading state, the Origin select gives way to a Skeleton, and Save is disabled until the list is back.
- `Reloaded` — The list is reloaded without the deleted origin: the Alert closes, the select is cleared and flagged required with Select an origin to continue.

Each variant is the same screen in another state: `get_pattern("platform/states/form-error", { variant })`, or the file under `blocks/platform/states/form-error/variants/`.

## Code (`InSync`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NumberInput from '@aziontech/webkit/number-input'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { nextTick, reactive, ref } from 'vue'

  const breadcrumb = [{ label: 'Forms', href: '/forms' }, { label: 'Error validation' }]

  const catalog = [
    { value: 'origin-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
    { value: 'origin-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
    { value: 'origin-assets', label: 'assets-storage', kind: 'Storage' }
  ]
  const protocolUsageOptions = [
    {
      value: 'http',
      label: 'HTTP support',
      description: 'Use only the HTTP protocol. Select from the available HTTP ports.'
    },
    {
      value: 'https',
      label: 'HTTP and HTTPS support',
      description:
        'Use both HTTP and HTTPS protocols. Select from the available HTTP and HTTPS ports.'
    },
    {
      value: 'http3',
      label: 'HTTP/3 support',
      description:
        'Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.'
    }
  ]
  const httpPortOptions = [
    { label: '80 (default)', value: '80' },
    { label: '8080', value: '8080' },
    { label: '8008', value: '8008' }
  ]

  const serverOrigins = ref(['origin-web-prod', 'origin-api-prod', 'origin-assets'])
  const origins = ref([
    { value: 'origin-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
    { value: 'origin-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
    { value: 'origin-assets', label: 'assets-storage', kind: 'Storage' }
  ])
  const form = reactive({
    name: 'checkout-web',
    protocolUsage: 'https',
    httpPorts: ['80'],
    compression: true,
    rateLimiting: false,
    imageOptimization: false,
    secondaryCache: false,
    originId: 'origin-web-prod',
    hostHeader: '${host}',
    browserMaxTtl: 0,
    cacheMaxTtl: 60,
    debugRules: false
  })
  const errors = reactive({ name: '', httpPorts: '', originId: '', hostHeader: '' })
  const originError = ref('')
  const submitting = ref(false)
  const reloadingOrigins = ref(false)
  const deletedByOtherUser = ref('')

  const originLabel = (value: string) =>
    origins.value.find((origin) => origin.value === value)?.label ?? ''

  const portsLabel = (values: unknown[]) =>
    (values ?? [])
      .map((value) => httpPortOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  const simulateDelete = () => {
    const target =
      origins.value.find((origin) => origin.value === form.originId) ?? origins.value[0]
    if (!target) return
    serverOrigins.value = serverOrigins.value.filter((value) => value !== target.value)
    deletedByOtherUser.value = target.label
  }

  const resetScenario = () => {
    serverOrigins.value = catalog.map((origin) => origin.value)
    origins.value = [...catalog]
    deletedByOtherUser.value = ''
    form.name = 'checkout-web'
    form.originId = 'origin-web-prod'
    form.hostHeader = '${host}'
    originError.value = ''
    errors.name = ''
    errors.httpPorts = ''
    errors.originId = ''
    errors.hostHeader = ''
  }

  const reloadOrigins = () => {
    if (reloadingOrigins.value) return
    reloadingOrigins.value = true
    setTimeout(() => {
      origins.value = catalog.filter((origin) => serverOrigins.value.includes(origin.value))
      if (!serverOrigins.value.includes(form.originId)) {
        form.originId = ''
        errors.originId = 'Select an origin to continue.'
      }
      originError.value = ''
      reloadingOrigins.value = false
    }, 800)
  }

  const onOriginChange = () => {
    errors.originId = ''
    originError.value = ''
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.originId = form.originId ? '' : 'Select an origin.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'Host header is required.'
    return !errors.name && !errors.httpPorts && !errors.originId && !errors.hostHeader
  }

  const submit = () => {
    if (submitting.value || reloadingOrigins.value) return
    originError.value = ''
    if (!validate()) return
    if (!serverOrigins.value.includes(form.originId)) {
      originError.value = `Origin "${originLabel(form.originId)}" no longer exists. Another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.`
      errors.originId = 'This origin no longer exists.'
      focusOrigin()
    }
  }

  const focusOrigin = async () => {
    await nextTick()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById('ev-origin-heading')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    document.getElementById('ev-origin')?.focus({ preventScroll: true })
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Forms"
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
    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create Service"
        novalidate
        @submit.prevent="submit"
      >
        <div class="layout-column-form layout-boundary flex flex-1 flex-col">
          <aside
            aria-label="Scenario simulation"
            class="flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-lg)"
          >
            <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
              <p class="m-0 text-overline-sm text-(--text-muted)">Simulation: the other user</p>
              <Tag
                :label="
                  deletedByOtherUser
                    ? `Deleted server-side: ${deletedByOtherUser}`
                    : 'Server in sync'
                "
                :severity="deletedByOtherUser ? 'danger' : 'success'"
                size="medium"
              />
            </div>
            <p class="m-0 text-body-sm text-(--text-muted)">
              You are User 1: the service below is filled in and already linked to an origin, four
              sections down. Have User 2 delete that origin through the API. Nothing will tell you,
              your copy of the list goes stale. Then press Save, and watch the form take you to the
              one section that needs you.
            </p>
            <div class="flex flex-wrap items-center gap-(--spacing-sm)">
              <Button
                label="User 2 deletes the linked origin"
                kind="outlined"
                size="medium"
                icon="pi pi-trash"
                :disabled="!!deletedByOtherUser || submitting"
                @click="simulateDelete"
              />
              <Button
                label="Reset scenario"
                kind="transparent"
                size="medium"
                :disabled="submitting"
                @click="resetScenario"
              />
            </div>
          </aside>

          <fieldset
            class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create service</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="General" />
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Name"
                      description="Give a unique and descriptive name to identify the service."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            placeholder="My Service"
                            :required="!!errors.name"
                            :aria-describedby="errors.name ? 'ev-name-error' : undefined"
                            :disabled="submitting"
                            @update:model-value="errors.name = ''"
                          />
                          <HelperText
                            v-if="errors.name"
                            id="ev-name-error"
                            kind="required"
                            :label="errors.name"
                          />
                        </div>
                      </div>
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="Delivery settings" />
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow title="Protocol usage">
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                          <legend class="sr-only">Protocol Usage</legend>
                          <Field.Label
                            v-for="option in protocolUsageOptions"
                            :key="option.value"
                          >
                            <Field
                              orientation="horizontal"
                              :disabled="submitting"
                            >
                              <RadioButton
                                v-model="form.protocolUsage"
                                :value="option.value"
                                name="protocolUsage"
                                :input-id="`ev-protocolUsage-${option.value}`"
                              />
                              <Field.Content>
                                <Field.Title>{{ option.label }}</Field.Title>
                                <Field.Description>{{ option.description }}</Field.Description>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                        </fieldset>
                      </div>
                    </SettingRow>
                    <SettingRow
                      title="HTTP ports"
                      description="The ports the service listens on for HTTP traffic."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <MultiSelect
                            v-model="form.httpPorts"
                            size="large"
                            class="w-full"
                            placeholder="Select ports"
                            :required="!!errors.httpPorts"
                            :display-value="portsLabel"
                            :disabled="submitting"
                            @update:model-value="errors.httpPorts = ''"
                          >
                            <MultiSelect.Trigger
                              id="ev-httpPorts"
                              aria-label="HTTP ports"
                              :aria-describedby="
                                errors.httpPorts ? 'ev-httpPorts-error' : undefined
                              "
                            />
                            <MultiSelect.Content>
                              <MultiSelect.Option
                                v-for="option in httpPortOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </MultiSelect.Option>
                            </MultiSelect.Content>
                          </MultiSelect>
                          <HelperText
                            v-if="errors.httpPorts"
                            id="ev-httpPorts-error"
                            kind="required"
                            :label="errors.httpPorts"
                          />
                        </div>
                      </div>
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="Features" />
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Compression"
                      description="Compress responses with gzip or Brotli before they are sent."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.compression"
                        aria-label="Compression"
                        :disabled="submitting"
                      />
                    </SettingRow>
                    <SettingRow
                      title="Rate limiting"
                      description="Limit how many requests a single client can send per minute."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.rateLimiting"
                        aria-label="Rate limiting"
                        :disabled="submitting"
                      />
                    </SettingRow>
                    <SettingRow
                      title="Image optimization"
                      description="Resize, crop, and convert images on the fly through URL parameters."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.imageOptimization"
                        aria-label="Image optimization"
                        :disabled="submitting"
                      />
                    </SettingRow>
                    <SettingRow
                      title="Secondary cache"
                      description="Add a second caching layer to reduce requests to the origin."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.secondaryCache"
                        aria-label="Secondary cache"
                        :disabled="submitting"
                      />
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <h2
                        id="ev-origin-heading"
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        Origin
                      </h2>
                    </div>
                  </div>
                </div>
                <div
                  class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance has-[>div>div>*]:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 overflow-hidden">
                    <div class="pt-(--spacing-sm)">
                      <Transition
                        enter-active-class="transition duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                        enter-from-class="translate-y-2 opacity-0"
                        enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                        leave-from-class="translate-y-0 opacity-100"
                        leave-to-class="-translate-y-2 opacity-0"
                      >
                        <div v-if="originError">
                          <Alert
                            severity="danger"
                            :label="originError"
                          >
                            <template #action>
                              <Button
                                label="Reload origins"
                                kind="secondary"
                                size="medium"
                                :loading="reloadingOrigins"
                                @click="reloadOrigins"
                              />
                            </template>
                          </Alert>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>
              </header>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Origin"
                      description="The origin that serves this service’s content. Origins are shared across the account, so anyone on it can change one."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Skeleton
                            v-if="reloadingOrigins"
                            kind="shape"
                            width="100%"
                            height="var(--size-10)"
                            aria-label="Loading origins"
                          />
                          <template v-else>
                            <Select
                              v-model="form.originId"
                              size="large"
                              class="w-full"
                              placeholder="Select an origin"
                              :display-value="originLabel"
                              :required="!!errors.originId && !form.originId"
                              :invalid="!!errors.originId && !!form.originId"
                              :disabled="submitting"
                              @update:model-value="onOriginChange"
                            >
                              <Select.Trigger
                                id="ev-origin"
                                aria-label="Origin"
                                :aria-describedby="errors.originId ? 'ev-origin-error' : undefined"
                              />
                              <Select.Content>
                                <Select.Option
                                  v-for="origin in origins"
                                  :key="origin.value"
                                  :value="origin.value"
                                >
                                  {{ origin.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                            <HelperText
                              v-if="errors.originId"
                              id="ev-origin-error"
                              :kind="form.originId ? 'invalid' : 'required'"
                              :label="errors.originId"
                            />
                          </template>
                        </div>
                      </div>
                    </SettingRow>
                    <SettingRow
                      title="Host header"
                      description="Identify a virtualhost sent in the Host header to the origin."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            v-model="form.hostHeader"
                            size="large"
                            class="w-full"
                            aria-label="Host header"
                            :required="!!errors.hostHeader"
                            :aria-describedby="
                              errors.hostHeader ? 'ev-hostHeader-error' : undefined
                            "
                            :disabled="submitting"
                            @update:model-value="errors.hostHeader = ''"
                          />
                          <HelperText
                            v-if="errors.hostHeader"
                            id="ev-hostHeader-error"
                            kind="required"
                            :label="errors.hostHeader"
                          />
                        </div>
                      </div>
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="Cache expiration policies" />
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Browser maximum TTL"
                      description="How long browsers may keep a cached response, in seconds."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <NumberInput
                          v-model="form.browserMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          :disabled="submitting"
                          aria-label="Browser maximum TTL in seconds"
                        />
                      </div>
                    </SettingRow>
                    <SettingRow
                      title="Cache maximum TTL"
                      description="How long the cache may keep a response, in seconds. A secondary cache requires a TTL of at least 3 seconds."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <NumberInput
                          v-model="form.cacheMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          :disabled="submitting"
                          aria-label="Cache maximum TTL in seconds"
                        />
                      </div>
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="Debug rules" />
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Active"
                      description="Rules that were successfully executed will be listed in the request logs and in the trace of each event."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.debugRules"
                        aria-label="Active"
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
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
            />
            <Button
              label="Save"
              kind="primary"
              size="medium"
              :loading="submitting"
              :disabled="reloadingOrigins"
              type="submit"
            />
          </template>
        </SaveBar>
      </form>
    </main>
  </div>
</template>
```
