---
name: webkit-form
description: Accessible forms on @aziontech/webkit — one Form Layout spacing reference (xs inside a field, lg between fields/rows) shared by five form types (Drawer, nested Drawer, Dialog, ItemGroup settings, Card with independent saves) that differ only in container + save model, with two internal layouts (Cards + ItemGroups / Fields separated) composing inside each. Every field carries a real label (never a placeholder-as-label), errors are tied to the control via aria-describedby, and related fields group in a real <fieldset>/<legend>; validated only on submit with the field's own required/invalid state as the feedback — no custom error-summary block, no Alert callout for field validation. The a11y companion to /webkit-ux-heuristics (states) and /webkit-ui-states (locking + toast).
status: active
last_updated: 2026-11-12
scope: general
enforced_by: [webkit-accessibility, webkit-component-states, ui-verify]
---

# Skill: webkit-form

## Purpose

Forms are where a product is most keyboard- and screen-reader-tested and most often fails: a label
that is really a placeholder, a select whose `<label for>` points at nothing, a validation error shown
only in colour, a field that never says it was required. This skill fixes the accessibility of a form
built on `@aziontech/webkit` so it is operable by keyboard, understandable by a screen reader, and
recoverable when it rejects input. It is the a11y companion to `/webkit-ux-heuristics`
(which establishes the states) and `/webkit-ui-states` (which locks the scope and
toasts request errors) — this skill owns **layout, labels, grouping, validation semantics, and submit**.

There are **two ways to lay out a form**, and both are first-class:

- **Approach A — Cards + ItemGroups.** Sections are a `SettingsSection` over a flush `Card` wrapping
  an `Item.List`; every field is one `SettingRow` (name/guidance on the left, control on the right). This is the default for
  **grouped, settings-style, or list-like** forms — an account settings page, a resource's config or
  create page, a create drawer.
- **Approach B — Fields separated.** Standalone `Field` triads (label, control, description) stacked in a column. This is for
  **short, focused, single-purpose** forms — a sign-in flow, a rename or delete-confirmation dialog, a
  short create drawer, a single step in a wizard.

Pick one per form; don't mix row-fields and stacked-fields in the same section.

## How to use

- `/webkit-form`
  Apply the layout + patterns below to any form you build in this conversation.
- `/webkit-form <file>`
  Review the file's form against the patterns and output, per gap:
  - the exact line / element (quoted),
  - which pattern it breaks (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Building or reviewing any create/edit page, settings panel, drawer form, or multi-field form.
- The user asks "is this form accessible", "wire up the labels", "the screen reader skips this",
  "where do errors go", "which layout for this form".
- After `/webkit-ux-heuristics` establishes the states and before `/webkit-ui-states` locks the async submit.

## Wrap every control in a `Field` — loose inputs are the fallback

webkit ships **one** form-field component, `Field` (`@aziontech/webkit/field`), and wraps **any** control
in it: `Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput`, `PasswordInput`, `PhoneInput`,
`InputGroup` (with `InputGroup.Input`), `Checkbox`, `RadioButton`, `Switch`, `Slider`. **Default to a
`Field`**; leave a control bare only when no label belongs next to it.

- **`Field` (preferred):** `<Field>` + `<Field.Label>` + the control + `<Field.Description>` /
  `<Field.Error>`. State lives on the Field — `<Field :required :invalid :disabled>` — and the control
  reads its `id`, `aria-describedby`, `aria-invalid`, `disabled` and `required` from it; `Field.Label`
  points `for` at the control and shows the Required tag; `Field.Description` takes the helper tone
  (disabled → invalid → required → helper) from the Field. The accessible-name / error-association rules
  below are satisfied **by construction**.
- **Checkbox, radio, switch:** `<Field orientation="horizontal">` with the control first and a
  `<Field.Content>` holding `Field.Label` + `Field.Description`.
- **Choice cards** (a bordered option with a title and description): `<Field.Label>` wrapping a
  horizontal `<Field>` with the control and `<Field.Content>` (`Field.Title` + `Field.Description`).
  Group cards with `<Field.Set>` + `<Field.Legend>`, never inside another `Field`.
- **Loose (the bare control):** only when the label lives elsewhere — a control in an `Item.Actions`
  cell whose `Item.Title` names it, a table cell, a toolbar. Then **you** own the `aria-label` /
  `aria-describedby` per the rules below.
- **Types come from the binding.** `Select` and `MultiSelect` take their value type from the bound
  model (a `string` model gives `@update:model-value` and `display-value` a `string`, so handlers are
  `(value: string)` with no `typeof` guard), and an options list is `SelectOptionItem[]` from
  `@aziontech/webkit/select`. `Input`, `Textarea` and `PasswordInput` expose `focus()`: type the ref
  `ref<InstanceType<typeof Input> | null>(null)` and call `field.value?.focus()`, never `$el.querySelector`.

```vue
<!-- ✅ Preferred — the Field owns label + description + validation wiring -->
<Field required :invalid="!!errors.name">
  <Field.Label>Application name</Field.Label>
  <Input v-model="form.name" name="name" />
  <Field.Description>{{ errors.name || 'Shown in the dashboard.' }}</Field.Description>
</Field>

<!-- ⚠️ Loose — only when no Field fits; now YOU wire the label + aria-describedby -->
<Label for="app-name">Application name</Label>
<Input
  id="app-name"
  v-model="form.name"
  aria-describedby="app-name-help"
  :invalid="!!errors.name"
/>
<HelperText id="app-name-help">{{ errors.name || 'Shown in the dashboard.' }}</HelperText>
```

## Label association — every control names itself (both approaches)

The one non-negotiable both layouts share: every control has a **programmatic accessible name**, its
error is **tied to it**, and related controls are **grouped** — so a screen reader announces the field,
its state, and the group it belongs to. The mechanics differ per approach, the contract does not:

- **A real label, never a placeholder.** Approach B (and a composed `Select`) wires a real `<label for>`
  to the control `id` — a `Field.Label` inside a `Field` does it for you (a `Select` inside a `Field`
  gets the id on its trigger); a hand-rendered `Label` outside a `Field` points `for` at
  `Select.Trigger`'s `id` (labelling the wrapper labels nothing). Approach A (ItemGroup) uses
  `Item.Title` as the field name and gives the control an `aria-label`. A placeholder is **never** the
  label — it disappears on input and is not a reliable accessible name.
- **Errors associated via `aria-describedby`.** The message carries an `id` and the control points
  `aria-describedby` at it, so it is announced when focus lands; `:required` / `:invalid` set
  `aria-required` / `aria-invalid` — don't hand-roll them. Inside a `Field`, `Field.Description` /
  `Field.Error` register themselves and the control is described by them automatically; in an ItemGroup
  you set `aria-describedby` on the control and the `id` on the `<HelperText>` yourself.
- **Groups in `<fieldset>` + `<legend>`.** Each section is a native `<fieldset>` with a `<legend>`
  (`sr-only` when a visible title already names it); a radio/checkbox set is its own `<fieldset>` whose
  `<legend>` is the question.

The sections below show each mechanism in place; this is the contract they satisfy.

## Form Layout — the spacing reference

Every form sits on the same **Form Layout**: the shared spacing spec for field rows and columns — the
gutter between columns, the vertical rhythm between rows, and the label-to-control spacing. **This is the
reference.** The _form types_ below only change the **container** the form lives in and its **save
model**; the two internal layouts (Approach A / B) compose inside any of them. The spacing itself never
changes.

### Field spacing — the macro rule (one rhythm, everywhere)

The same spacing applies in **every** container and **both** approaches. Never hand-pick a one-off gap;
if a form seems to need a different rhythm, it's in the wrong container.

| Between                                         | Token          | px                                   |
| ----------------------------------------------- | -------------- | ------------------------------------ |
| Label → control → HelperText (inside one field) | `--spacing-xs` | 8 — already baked into every `Field` |
| Field → field (and row → row)                   | `--spacing-lg` | 24                                   |
| Section → section                               | `--spacing-lg` | 24                                   |
| Section title → its card (`SettingsSection`)    | `--spacing-md` | 16 — owned by the component          |
| Compact modal body (Dialog / Drawer)            | `--spacing-md` | 16 — the **only** allowed tightening |

### Hierarchy (top → down, never inverted)

form title (`text-heading-*` — `PageHeader` on a page, a `Card` title / `text-heading-sm`
in a contained card, `DialogTitle` in a modal) → form description (`text-body-sm text-(--text-muted)`)
→ section title (`SettingsSection`, `text-heading-xxs`) or sub-heading (`text-heading-xs`) → **field label** (`Label`,
which carries the required tag) → control → **helper** (`HelperText` — guidance, or the required/invalid
feedback). A label is never smaller than its helper; a section title is never smaller than a field label.

## Form types — container and save model

Every form sits on the same **Form Layout** (above); a _type_ only changes the **container** the form
lives in and its **save model**. Approach A / B still applies inside each one. There are **five form
contexts** in Azion products:

- **Drawer form.** In-context creation — the user is working inside a resource and adds an item that
  only exists in it (a rule, an origin, a domain, a record) _without leaving the page they're on_. A
  first-level resource creates on a page, not here (`/webkit-create-surface`; variables are the one
  exception). One scoped save (the drawer's primary action).
  Approach A for grouped/config-heavy creates (one flush ItemGroup, or several `SettingsSection` bands),
  Approach B for short ones.

- **Nested drawer.** A drawer form whose Select points at **another item of the same resource** that may
  not exist yet — the origin a new rule sends requests to, both living inside the storefront resource.
  Rather than sending the user away to create it (losing the parent form's in-progress state), a
  "Create …" quick-add opens a **second, smaller drawer** stacked over the first; on save the new item is
  appended to the Select's options and selected back into the parent. **Each drawer is its own form** —
  its own scoped save, its own `submitting` flag, its own `<fieldset>`; the two never share a lock.
  Approach A inside each. Documented below. **Never a first-level resource** (a Function, a Service, a
  Team — anything the sidebar routes to): it creates on its own page (`/webkit-create-surface`), so the
  Select gets a link to that create page, or the field becomes a `platform/create/resource-picker`.

- **Dialog form.** Small, focused, usually confirmational or destructive — e.g. removing a resource.
  Few (or zero) fields, a single confirm action. A yes-or-no decision is `ConfirmDialog`
  (`@aziontech/webkit/confirm-dialog`); a typed confirmation puts its field in the default slot and
  keeps the confirm `disabled` until it matches. Approach B (stacked fields). A destructive confirm
  typically gates its action on a typed phrase (error prevention) rather than surfacing a required-error.

- **ItemGroup settings.** Account-level configuration surfaces built from `Item` rows (Approach A). The
  rows organize **either as multiple Cards** (grouped by topic — e.g. Billing split into Plan, Payment,
  Invoices; each card titled by a `SettingsSection`, see Approach A § _Section title_) **or as a
  single flush block** (all rows in one container, for shorter or flat settings). Used for Billing,
  Integrations, Account Settings — "define and manage personal account preferences and profile config".
  The read-only cards beside them are components too, never a hand-written `dl` or `ul`: plan
  facts (Plan Price, Billing Period, Next Invoice) are `KeyValuePairs kind="split"`
  (`@aziontech/webkit/key-value-pairs`, label at the start, value at the end of each row), and
  the perks of an upgrade card are `FeatureList` (`@aziontech/webkit/feature-list`, a check per
  included feature, `:columns="2"` in a wide card).

- **Card with independent saves.** Long configuration pages split into multiple `Card` sections
  where **each card owns its own save**, so the user commits changes in parts instead of one giant
  submit. Approach A inside each card.

**Save model follows partitioning, not the container type.** A form that is one logical unit has **one
save** — a Drawer, a Dialog, or an ItemGroup (whether a single flush block **or** several
`SettingsSection` bands, like Account Settings; the sections group the topic, not the save). A form deliberately split
into independently-committed cards — the **Card with independent saves** type — has **one save per
card**, each locking off its own `submitting` flag (the `/webkit-ui-states` contract).

Each form type has its pattern in the `webkit` MCP (`get_pattern`): the Drawer form and the Nested
drawer are `platform/create/create-in-drawer` (variant `NestedDrawer` for the stacked child); the
Dialog form is `platform/delete/delete-with-confirmation` (variant `LabelledField` for the labelled
typed confirmation); ItemGroup settings and Card with independent saves are
`platform/settings/settings-form`, whose primary `SaveAll` is the default one-save model and whose
`SavePerGroup` and `SavePerCard` variants are the split ones. A resource's own settings tab is
`platform/edit/edit-resource`; every submit state is `platform/states/form-validation`; a server
rejection that one section owns is `platform/states/form-error`; a save that starts a long run (build,
deploy) is `platform/states/async-submit`.

### Example — Card with its own save

A self-contained settings card (one of possibly several on the page, each committing independently): the
card's name is the `Card` **`title`** (it renders in the card header), then a short description at the
top of the body, the fields, an optional inline note, and the card's **own save in the footer**.
`Card`'s footer is centered by default, so a full-width `justify-between` child puts a "Learn more"
link on the left and Save on the right. Canonical pattern:

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Label from '@aziontech/webkit/label'
  import Link from '@aziontech/webkit/link'
  import Alert from '@aziontech/webkit/alert'
  import Select from '@aziontech/webkit/select'
  import { reactive, ref } from 'vue'

  const form = reactive({ preprod: 'default', prod: 'default' })
  const options = [
    { label: 'Default (controlled at the team level)', value: 'default' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
  ]
  const displayValue = (v) => options.find((o) => o.value === v)?.label ?? ''
  const submitting = ref(false) // /webkit-ui-states: Save :loading + fields :disabled off one flag
</script>

<template>
  <Card
    title="Azion Toolbar"
    class="w-full"
  >
    <template #content>
      <!-- body rhythm: fields are --spacing-lg apart; each field triad is --spacing-xs -->
      <div class="flex flex-col gap-(--spacing-lg)">
        <p class="text-body-sm text-(--text-muted)">
          Enable the Azion Toolbar on your Deployments.
        </p>

        <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label for="tb-preprod">Pre-Production Deployments</Label>
            <Select
              v-model="form.preprod"
              size="large"
              :display-value="displayValue"
            >
              <Select.Trigger id="tb-preprod" />
              <Select.Content>
                <Select.Option
                  v-for="o in options"
                  :key="o.value"
                  :value="o.value"
                  >{{ o.label }}</Select.Option
                >
              </Select.Content>
            </Select>
          </div>
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label for="tb-prod">Production Deployments</Label>
            <Select
              v-model="form.prod"
              size="large"
              :display-value="displayValue"
            >
              <Select.Trigger id="tb-prod" />
              <Select.Content>
                <Select.Option
                  v-for="o in options"
                  :key="o.value"
                  :value="o.value"
                  >{{ o.label }}</Select.Option
                >
              </Select.Content>
            </Select>
          </div>
        </div>

        <Alert severity="info">
          To use the toolbar in production your team members need the Chrome extension, or
          <a href="/docs/toolbar">enable the toolbar for that domain</a>
          in the toolbar menu.
        </Alert>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
        <Link
          href="#"
          label="Learn more about the Azion Toolbar"
          size="medium"
        />
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="submitting"
        />
      </div>
    </template>
  </Card>
</template>
```

### Example — Dialog form (destructive confirm)

A modal for a short, blocking decision. Compose `Dialog` + `DialogPortal`/`DialogOverlay`/`DialogContent`
with the `Panel*` regions; the body uses the compact `--spacing-md` rhythm. The primary (destructive)
action stays disabled until the user types the exact confirmation phrase — error prevention, not a toast.
Canonical pattern:

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Input from '@aziontech/webkit/input'
  import Alert from '@aziontech/webkit/alert'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { computed, ref } from 'vue'

  const open = ref(false)
  const phrase = 'webkit-docs-dev'
  const confirmation = ref('')
  const canDelete = computed(() => confirmation.value.trim() === phrase)

  const remove = () => {
    if (!canDelete.value) return
    open.value = false
    confirmation.value = ''
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Delete Application</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <!-- compact modal body: --spacing-md between blocks, on your own wrapper -->
        <PanelContent>
          <div class="flex flex-col gap-(--spacing-md)">
            <Alert
              severity="warning"
              label="Once confirmed, this action can't be reversed."
            />
            <p class="m-0 text-body-sm text-(--text-muted)">
              The selected Application will be deleted, along with all associated settings or
              instances.
            </p>
            <label
              for="confirm-delete"
              class="text-body-sm text-(--text-default)"
            >
              To confirm, type "{{ phrase }}" in the box below:
            </label>
            <Input
              id="confirm-delete"
              v-model="confirmation"
              autocomplete="off"
              class="w-full"
            />
          </div>
        </PanelContent>

        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Cancel"
                kind="outlined"
                @click="open = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Delete"
                kind="danger"
                :disabled="!canDelete"
                @click="remove"
              />
            </div>
          </div>
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
```

### Example — Nested drawer (create an item of the same resource inline)

A drawer form whose `Select` points at another item of the **same** resource that the user may not have
created yet. Rather than sending them away to make it — and losing everything they've typed in the parent —
a "Create …" affordance in the `Select`'s footer opens a **second, smaller drawer** on top. The child
creates the item, appends it to the `Select`'s options, selects it back into the parent, and closes; the
parent form is exactly as the user left it. This is the pattern behind _Rules Engine → Add Rule → Origin →
Create Origin_ on a resource (`platform/create/create-in-drawer`, variant `NestedDrawer`): the rule and the
origin both live inside the storefront resource, so both create in a drawer.

**Only for items inside the parent's resource.** When the missing thing is a first-level resource (a
Function, a Service, a Team), the stacked drawer would create it on the wrong surface — a first-level
resource creates on its own page (`/webkit-create-surface`). Give the Select a link to that resource's
create page (opened in a new tab so the drawer keeps its typing), or bind the field with
`platform/create/resource-picker`.

Three decisions make it safe:

- **Independent scopes.** The parent and child are separate `<form>`s, each with its **own** `submitting`
  flag, its own `<fieldset :disabled>`, its own Save `:loading` (the `/webkit-ui-states` Pattern 1 lock, per
  drawer). Submitting the child never locks the parent, and the parent's save never touches the child.
- **A controlled Select + a sentinel value.** The parent `Select` is **controlled** (`:model-value`, not
  `v-model`) so picking the quick-add never commits a real value. The quick-add is a normal
  `Select.Option` in the `#footer` slot carrying a sentinel value; `@update:model-value` intercepts it,
  closes the dropdown, and opens the child instead of assigning `form.*`.
- **Stacking is built in.** The child `Drawer` portals after the parent, so it sits over it at the same
  layer, and a `Select.Content` teleports at `--z-input-overlay` (above every drawer). Add no `z-*`
  overrides to the overlay, the content or the popups.

Canonical pattern:

```vue
<script setup>
  // PARENT large drawer adds a Rule with a Select of the resource's Origins; the CHILD medium drawer creates one.
  const origins = ref([{ value: 'origin-api', label: 'api-backend' }])
  const originLabel = (v) => origins.value.find((o) => o.value === v)?.label ?? ''

  // The PARENT form's own scope.
  const form = reactive({ name: '', originId: '' })
  const errors = reactive({ name: '', originId: '' })
  const submitting = ref(false)

  // A sentinel Select value for the quick-add. The Select is CONTROLLED (:model-value),
  // so picking the sentinel never commits a real value — it opens the child instead.
  const CREATE_ORIGIN = '__create-origin__'
  const originSelectOpen = ref(false) // control the dropdown so we can close it first
  const onOriginModel = (value) => {
    if (value === CREATE_ORIGIN) {
      originSelectOpen.value = false // close the dropdown …
      childOpen.value = true // … then open the child over the parent
      return
    }
    form.originId = value
    errors.originId = ''
  }

  // The CHILD form's own, SEPARATE scope — its own submitting flag.
  const childOpen = ref(false)
  const childForm = reactive({ name: '', address: '' })
  const childSubmitting = ref(false)

  const submitChild = async () => {
    if (childSubmitting.value) return // re-entrancy lock, on the CHILD's flag
    childSubmitting.value = true
    try {
      const value = `origin-${uid()}`
      origins.value = [{ value, label: childForm.name.trim() }, ...origins.value]
      form.originId = value // select the new origin back into the parent
      errors.originId = ''
      toast.success(`Origin "${childForm.name.trim()}" created.`)
      childOpen.value = false
    } catch (error) {
      toast.error('Could not create the origin.', { description: error?.message })
    } finally {
      childSubmitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <!-- PARENT (Add Rule): the Origin Select with a quick-add in its footer slot -->
  <Select
    :model-value="form.originId"
    v-model:open="originSelectOpen"
    :display-value="originLabel"
    :disabled="submitting"
    placeholder="Select an origin"
    :required="!!errors.originId"
    @update:model-value="onOriginModel"
  >
    <Select.Trigger
      id="rule-origin"
      aria-label="Origin"
    />
    <Select.Content>
      <Select.Option
        v-for="origin in origins"
        :key="origin.value"
        :value="origin.value"
        >{{ origin.label }}</Select.Option
      >
      <template #footer>
        <Select.Option
          :value="CREATE_ORIGIN"
          icon="pi pi-plus-circle"
          >Create Origin</Select.Option
        >
      </template>
    </Select.Content>
  </Select>

  <!-- CHILD medium drawer — its own form + submitting flag; portals over the parent -->
  <Drawer
    v-model:open="childOpen"
    size="medium"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Origin"
          novalidate
          @submit.prevent="submitChild"
        >
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="childSubmitting"
          >
            <legend class="sr-only">Create origin</legend>
            <!-- Approach A ItemGroup sections here: Name, Address -->
          </fieldset>
          <!-- PanelFooter: Cancel + Create Origin type="submit" :loading="childSubmitting" -->
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
```

Rules:

- **Parent and child are two independent forms.** Each has its own `submitting` flag, `<fieldset :disabled>`,
  and Save `:loading`; neither save locks the other. Guard each handler and release in `finally`.
- **The parent `Select` is controlled + intercepted.** Use `:model-value` (not `v-model`), a sentinel
  value for the quick-add `Select.Option` (in the `#footer` slot), and an `@update:model-value` that opens
  the child on the sentinel and only otherwise assigns `form.*` and clears the error.
- **Close the dropdown before opening the child.** Control the parent `Select`'s open state
  (`v-model:open`) and set it `false` in the same handler that opens the child, so the popup doesn't linger
  under the new drawer.
- **On the child's save, wire the resource back into the parent** — append it to the `Select`'s options,
  set the parent's model to the new value, clear the parent's error for that field, `toast.success`, close
  the child. The parent form keeps everything else the user had typed.
- **The child creates an item of the parent's resource, never a first-level resource.** A missing
  Function, Service or Team gets a link to its create page or a `platform/create/resource-picker`, not
  a stacked drawer.
- **No `z-*` overrides** — the child drawer portals over the parent and `Select.Content` already sits
  above every drawer.
- Everything else follows the **Drawer form** rules: Approach A ItemGroup sections inside each drawer,
  validation on submit only (`Item.Title` as the label, `HelperText` under the control), Enter submits
  through the Save `Button type="submit"`.

## Approach A — Cards + ItemGroups (grouped / settings forms)

Each section is a `SettingsSection` (`@aziontech/webkit/settings-section`) over a flush `Card`
(`:padded="false"`) whose body is an `Item.List`. `Item.List` draws the dividers between rows, so every
field reads as a divided row inside one box. Each row is a `SettingRow`
(`@aziontech/webkit/setting-row`): the field's name and guidance on the left, the control on the right.
Sections stack at the section gap; the first one takes no top margin.

**In a SettingRow, `title` IS the label.** Do **not** use `<Label>` inside a row — the field name is
`title`, its guidance is `description`, and the control carries an `aria-label` with the same text for
its accessible name. `<Label>` is reserved for **Fields separated** (Approach B) and composed `Select`
fields, where there is a real `<label for>` wired to a control `id`.

**`kind` places the control by what it needs.** `field` (the default) for `Input` and `Select`: a right
cell capped at `--container-3xs`, so every field on the card ends at the same edge. `compact` for a
`Switch` or a `Button`, hard right at its natural width. `stacked` for a `Textarea`, a radio group or an
editor, under the copy at the full measure. A setting that only applies while the row above it is on
renders with `v-if` on that state and `:level="1"` (or `2`), indented under a rule.

**The row keeps two columns on a phone and aligns to the top.** The copy and the control align to the
top of the row (a title stays level with the first of three stacked inputs), and the row does not stack
in a narrow box: the description clamps to two lines and the `field` control keeps its end cell. Set
`stackable` on one row only when its field needs the full measure in a narrow box (a long URL in a side
drawer); never wrap a row in your own flex box to restack or re-centre it.

Canonical pattern:

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
</script>

<template>
  <SettingsSection
    title="General"
    hint="How this application is identified, and whether it is serving traffic."
    anchor="general"
  >
    <Card :padded="false">
      <template #content>
        <Item.List>
          <SettingRow
            title="Name"
            description="A unique, descriptive name for the application."
          >
            <!-- Control + feedback stack in the row's control column: the HelperText
                 renders UNDER the control, only after a failed submit. An empty required
                 field is amber `required` (a prompt, NOT an error); a filled-but-malformed
                 value is red `invalid`. Emptiness picks the state — never both at once. -->
            <Input
              v-model="form.name"
              size="large"
              class="w-full"
              aria-label="Name"
              :required="!!errors.name && !form.name.trim()"
              :invalid="!!errors.name && !!form.name.trim()"
              :aria-describedby="errors.name ? 'name-error' : undefined"
              @update:model-value="errors.name = ''"
            />
            <HelperText
              v-if="errors.name"
              id="name-error"
              :kind="form.name.trim() ? 'invalid' : 'required'"
              :label="errors.name"
            />
          </SettingRow>
          <SettingRow
            title="Active"
            description="When off, the application stops serving traffic."
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
</template>
```

Rules:

- **`SettingsSection` + `Card :padded="false"` + `Item.List`** — one box per band, dividers from the
  list, no box-in-box. The card is header-less (only `#content`); the band's title is the section's.
- **Every row is a `SettingRow`.** Do not hand-write the `Item` / `Item.Content` / `Item.Actions`
  markup of a settings row; the row owns its density (`Item size="small"`) and the control placement.
- **`title` is the label; the control takes an `aria-label`** with the same text. No `<Label>` inside a
  row — validation feedback is the control's own `:required`/`:invalid` on submit.
- **The validation message renders as a `HelperText` under the control**, in the row's default slot
  after the control, shown only after a failed submit and linked to the control via
  `aria-describedby`. This is still the field saying what it needs, on the field — **not** a summary
  block or a `Alert` callout. `description` stays as the always-on guidance on the left.
- **Required is NOT an error — pick the state by what failed.** An empty required field is a _prompt_:
  `<HelperText kind="required">` (amber) + the control's `:required` (amber). A field whose value is
  present but malformed is an _error_: `<HelperText kind="invalid">` (red) + the control's `:invalid`
  (red). Never set both `:required` and `:invalid` at once — that yields an amber border with a red
  helper. When one field can fail both ways, emptiness is the discriminator
  (`:kind="value.trim() ? 'invalid' : 'required'"`). Note `Select`/`MultiSelect` have no amber border,
  so for an empty-required Select the amber `HelperText` (and `:required` for `aria-required`) carries
  the cue — never colour it red.
- **Richer controls that don't fit a one-line row** (a radio group, a block of `Field` choice cards,
  a list editor) use `kind="stacked"`, not a squeezed right column.

### Section title — the SettingsSection heading

When a settings surface is split into topic bands (the Account Settings pattern), **each band is a
`SettingsSection`**: an h2 titled in one or two words, its one-sentence guidance in `hint` (rendered as
a `Hint` glyph beside the title), and `anchor` when people link to it (the h2 takes the id and a
copy-link appears in the gutter on hover or focus). An Advanced band whose defaults suit most people is
`collapsible` with `icon="pi pi-cog"`; it starts closed, and its body is `inert` while folded.

Rules:

- **Do not also set a `Card` `title`** on the card inside a band — the band's title would double it.
- **A band with a description line and its own actions** (Billing's Payment methods with Add payment
  method) is a `SectionHeader` (`@aziontech/webkit/section-header`) over its card, not a
  `SettingsSection`.
- **`SettingsSection` vs `Card` title — pick by role.** A `SettingsSection` titles a _band of a larger
  page_. A **`Card` `title`** (in the card header) names a _self-contained card that is the form_ — the
  "Card with its own save" / Contained form. Never use both on one card.

## Approach B — Fields separated (short focused forms)

A field is a **triad**: a visible label, the control, and a description. Ship it as a
`Field` (`@aziontech/webkit/field`) — it renders the triad and wires the a11y for you: the label's `for`
matches the control `id`, the description is linked via `aria-describedby`, `required` sets
`aria-required`, and `invalid` sets `aria-invalid`. Stack the fields in a single column (`Field.Group`
gives the `--spacing-lg` rhythm).

The `required` tag on the label is **persistent** — it advertises the field is mandatory from first
render, independent of validation. `Field.Label` shows the tag from the Field's own `required`, which
also drives the field's amber state, so for the persistent tag render a `Label` **yourself** (always
`required`, `for` = the control's `id`) instead of `Field.Label`, and bind the Field's `:required` to the
post-submit empty state so only the amber (border + description) is revealed on submit. Canonical pattern:

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Label from '@aziontech/webkit/label'
</script>

<template>
  <Field.Group>
    <!-- Label required ALWAYS (rendered here, not Field.Label). Empty → :required
         (amber), the description flips to the required tone. A malformed value →
         :invalid (red). Never both at once. `errors.name` holds the message
         ("" = valid), so the description falls back to guidance when clear. -->
    <Field
      :required="!!errors.name && !form.name.trim()"
      :invalid="!!errors.name && !!form.name.trim()"
    >
      <Label
        for="app-name"
        required
        >Name</Label
      >
      <Input
        id="app-name"
        v-model="form.name"
        name="name"
        placeholder="my-application"
        @update:model-value="errors.name = ''"
      />
      <Field.Description>{{
        errors.name || 'A unique name for this application.'
      }}</Field.Description>
    </Field>
  </Field.Group>
</template>
```

When the tag does not need to outlive validation (an optional field, or a field that is always
required), `<Field required><Field.Label>Name</Field.Label>…</Field>` is all it takes.

Parts of the `Field` compound (ask the webkit MCP `suggest_component`, or read
`node_modules/@aziontech/webkit/catalog.json` (`imports`)): `Field.Label`, `Field.Description`,
`Field.Error`, `Field.Group`, `Field.Set`, `Field.Legend`, `Field.Content`, `Field.Title`,
`Field.Separator`. Controls: `input`, `textarea`, `select`, `multi-select`, `number-input`,
`password-input` (+ `password-requirements` for the rules row), `phone-input`, `input-group` (+
`InputGroup.Input`), `checkbox`, `radio-button`, `switch`, `slider`.

Rules:

- **Never a bare `Input` / `Textarea` next to a floating `<p>` "label".** Wrap it in a `Field`.
  A placeholder is **not** a label — it vanishes on input and is not a reliable accessible name.
- **The description is the guidance region.** Feed it the field's guidance; on a failed submit swap it
  for the message and flip the Field's state — `:required` (amber) for an empty field, `:invalid` (red)
  for a malformed one. Never pass both `:required` and `:invalid` true together (amber border + red
  helper). It's still the field's own description, not a second error node. Use `Field.Error` when the
  message must sit beside a guidance description that stays visible.
- **A `Select` in a `Field` is labelled on its trigger automatically**; outside a `Field`, see the next
  pattern.

## Composed Select — label the TRIGGER, not the wrapper

Inside a `Field`, `Field.Label` already targets the trigger. When you render a `Label` yourself next to a
`Select` (the persistent-tag pattern, or no `Field`), the focusable
element is the **trigger** (a `role="combobox"` `<button>`), and `Select`'s `$attrs` land on its outer
wrapper `<div>`, _not_ the button. So the `Label`'s `for` and the `id` must go on **`<Select.Trigger>`**.
Pointing `<label for>` at the `<Select>` wrapper labels nothing. This holds in **both** approaches.

```vue
<!-- Label required ALWAYS; empty-required → :required (amber semantics), not
     :invalid (red). Select has no amber border, so pair with a HelperText. -->
<Label for="app-country" required>Country</Label>
<Select
  v-model="form.country"
  placeholder="Select an option…"
  :required="!!errors.country"
  :display-value="labelOf(countries)"
  @update:model-value="errors.country = ''"
>
  <Select.Trigger id="app-country" />
  <Select.Content>
    <Select.Option v-for="o in countries" :key="o.value" :value="o.value">{{ o.label }}</Select.Option>
  </Select.Content>
</Select>
```

Rules:

- **`Label for` === `Select.Trigger id`.** Same string, and it must be the trigger's.
- **`Select` already sets `aria-required` / `aria-invalid`** on the trigger from its `required` /
  `invalid` props — pass the props, don't hand-roll the aria.

## Grouping — a real `<fieldset>` + `<legend>`

Each section is a **group of related controls**. Give it programmatic grouping with a native
`<fieldset>` and an `sr-only` `<legend>` (the visible section title — the `SettingsSection` title or `Card title`
— already names it, so it isn't drawn twice). A `<fieldset>` also disables its whole subtree in one
attribute, which is how you lock the scope on submit.

```vue
<fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0" :disabled="submitting">
  <legend class="sr-only">Account settings</legend>
  <!-- sections: Card + Item.List (Approach A) OR stacked Fields (Approach B) -->
</fieldset>
```

Rules:

- **`<legend>` is the fieldset's first child**, and `sr-only` when a visible title already shows it.
- **Related radios/checkboxes are their own group** — a set of radios is a `<fieldset>` whose
  `<legend>` is the question; the choice cards are the options. `Field.Set` + `Field.Legend` render that
  native `<fieldset>` + `<legend>` without browser chrome.

## Native input hints — autofill, keyboards, paste

The browser, password managers and mobile keyboards read the `<input>`, so the hints must land
there. `Input` takes `type`, `autocomplete` and `spellcheck` on its `<input>`; `PasswordInput` takes
`autocomplete`.

| Field                               | `type`  | `autocomplete`     | `spellcheck` |
| ----------------------------------- | ------- | ------------------ | ------------ |
| Sign-in e-mail / username           | `email` | `username`         | `false`      |
| Sign-up, contact or newsletter mail | `email` | `email`            | `false`      |
| Current password                    | —       | `current-password` | —            |
| New password (sign-up, reset)       | —       | `new-password`     | —            |
| One-time code                       | `text`  | `one-time-code`    | `false`      |
| Slug, ID, domain, token, code       | `text`  | `off`              | `false`      |
| Search, filter (not a credential)   | `text`  | `off`              | —            |

- Give every control a meaningful `name` next to `autocomplete`; autofill needs both.
- WebKit hides every field **without** `autocomplete` from password managers (`data-1p-ignore` and the
  LastPass, Bitwarden and Dashlane equivalents), so 1Password never offers a sign-in on an account name
  or a search box. A login or contact field **must** set `autocomplete` (or `type="email"`) to stay
  fillable; a read-only field is always hidden.
- **Never block paste** — not in passwords, not in one-time codes, not in confirmation fields.
- Do not block keystrokes in a numeric field: accept the input and validate on submit.
- Trim the value before validating: input methods and autofill add trailing spaces.
- A field that is not a credential never uses a reserved name (`password`, `email`) that makes a
  password manager offer itself.

Validation runs **on submit, once** — not on every keystroke, not on blur. The **feedback is the
field's own state plus an on-field `HelperText`** — there is **no separate error-summary block and no
`Alert` callout** for field validation; the field says what it needs, where it is.

**Required is not an error.** Two failure kinds, two states:

- **Required-but-empty** → the amber `required` state (`:required` on the control, `HelperText
kind="required"`). It is a _prompt to fill_, not a rejection — never the red danger state.
- **Filled-but-malformed** → the red `invalid` state (`:invalid` on the control, `HelperText
kind="invalid"`). The value is present and wrong.

On a failed submit, **move focus to the first field in error** so keyboard and screen-reader users
land on it. Never pre-disable the submit button to stop an incomplete form: let it submit and show
the feedback.

Never set both on one field at once (amber border + red helper is the bug this rule prevents). When a
field can fail both ways, emptiness is the discriminator. Store a real message so the `HelperText` has
something to show.

**Where a field has a `Label`, its required tag is persistent** — it shows from first render, not just
on a failed submit, so the user knows the field is mandatory before touching it. Only the field's amber
state (border + helper) is revealed on submit. Because `Field.Label` couples the tag to the same
`required` that colours the field, render the `Label` yourself (always `required`) instead of
`Field.Label` (see Approach B). An **ItemGroup** has no `Label`, so it has no persistent tag —
its required feedback is the on-submit amber `HelperText` only.

```js
const errors = reactive({ name: '', country: '' }) // "" = valid; populated ONLY by validate()
const fieldRefs = reactive({ name: null, country: null }) // :ref="(el) => (fieldRefs.name = el)" on each control

const validate = () => {
  // Empty → a required prompt; a non-empty bad value → an invalid message.
  errors.name = form.name.trim() ? '' : 'This field is required.'
  errors.country = form.country ? '' : 'This field is required.'
  return !errors.name && !errors.country
}

const submit = async () => {
  if (submitting.value) return // re-entrancy lock
  if (!validate()) {
    // errors now drive :required / :invalid; focus lands on the first field in error, no summary
    const first = Object.keys(errors).find((key) => errors[key])
    await nextTick()
    fieldRefs[first]?.$el?.querySelector('input, textarea, button')?.focus()
    return
  }
  submitting.value = true
  try {
    await save(form)
    toast.success('Saved.')
  } catch (error) {
    toast.error('Could not save.', {
      description: error?.message,
      action: { label: 'Retry', onClick: submit }
    })
  } finally {
    submitting.value = false
  }
}
```

Rules:

- **`<form novalidate @submit.prevent>`** — own the validation; the native bubble UI is inconsistent
  and unstyleable.
- **Validate on submit only.** No live validation while the user types the first time.
- **The feedback is `:required` OR `:invalid` bound to the error** (amber for empty, red for malformed —
  never both), appearing only after a failed submit and clearing as the user edits
  (`@update:model-value="errors.x = ''"`). Colour is never the only signal — the required tag / helper
  text is the non-colour cue.
- **The message lives on the field, as a `HelperText`.** In **Fields separated** it is the Field's
  `Field.Description` (its tone flips to `required` when the Field is `:required`, `invalid` when it is
  `:invalid`) or a `Field.Error`; in an **ItemGroup** it is a `<HelperText>` rendered under the control, its `kind`
  matching the failure (`required` amber / `invalid` red — see Approach A). Either way it is
  `aria-describedby`-linked to the control and appears only after a failed submit.
- **No custom error-summary block** (`role="alert"` list of links) and **no `Alert` callout** for
  field validation. Those were removed on purpose: the field's own state + its `HelperText` is the feedback.
- **Never `toast` a field error.** Missing/invalid input stays on the field. Toast is for
  request/API failures only (see `/webkit-ui-states`).

> **A server rejection scoped to one field is a different case**, and it is the one place a `Alert`
> is right. The value is not malformed — the API rejected it (a referenced object was deleted, a name
> is already taken), so it takes **both** surfaces: a `Alert` inside that field's own section _and_
> the field's red `invalid` state (never the amber `required` prompt — the value is present). On a
> long form, scroll-anchor the erroring section. The full placement table — field, section `Alert`,
> toast, auth card, background-job toast — is **`/webkit-errors`**.

## Submission — native submit, one locked scope, sticky actions

The primary action drives the native submit so **Enter submits**. While the request runs, **one flag
locks the whole scope** — this is `/webkit-ui-states` **Pattern 1**; this skill **references it, does not
re-derive it**. Save shows `:loading`, and **every field the action reads takes `:disabled` off the same
flag**. On a long form, the actions live in a **sticky bar** — `SaveBar`
(`@aziontech/webkit/save-bar`) — so Save/Cancel are always reachable. A create page uses
`kind="centered"` (Cancel and Create in a raised card centred at the bottom of the form, always
shown, at every width — never a hand-built sticky pill); an in-page form saved as one unit uses
`kind="plain"` (always shown, on the form column); a full-page wizard step uses
`kind="fade"` (no border, Back in `#leading`, the step's submit in `#actions`); a settings page
mounts the default `floating` bar only while the form is dirty or saving, with the status sentence
in its default slot.

**Bind `:disabled` on the controls, not only the `<fieldset>`.** A native `<fieldset :disabled>` blocks
_interaction_ for the whole subtree, but webkit controls (`Select`, `Switch`, `Input`, …)
render their **disabled visual** from their own `disabled` prop — a fieldset alone leaves them looking
active mid-submit. Keep the `<fieldset :disabled="submitting">` as the native safety net **and** pass
`:disabled="submitting"` to each `Field` (it disables the control inside) or to each bare control. Multi-save forms
(Card with independent saves) bind each card's controls to _that card's_ flag.

```vue
<SaveBar kind="plain">
  <template #actions>
    <Button type="button" label="Cancel" kind="outlined" size="medium" :disabled="submitting" @click="cancel" />
    <Button type="submit" label="Save" kind="primary" size="medium" :loading="submitting" />
  </template>
</SaveBar>
```

Rules:

- **Enter must submit.** Give the primary `Button` `type="submit"` and handle the save in the form's
  `@submit.prevent` — never also in the Button's `@click`, or it runs twice. Every other `Button`
  keeps the default `type="button"`. `disabled` and `loading` block the submit, Enter included. The
  submit `Button` must sit inside the `<form>`: when the footer lives outside it, move the `<form>` up
  to wrap the footer too. No hidden `sr-only` submit button.
- **Lock off one flag.** `<fieldset :disabled="submitting">` + `:disabled="submitting"` on **every**
  control + Save `:loading="submitting"`; guard the handler and release in `finally` (this IS
  `/webkit-ui-states` Pattern 1 — the fieldset is the native lock, the per-control
  `:disabled` is what makes webkit `Select`/`Switch`/`Input` show the disabled visual).
- **Report the request result where the user is looking** — `toast.success` on the happy path,
  `toast.error` with a Retry on failure. Field errors stay inline.

### Form errors — the server rejects one section (`platform/states/form-error`)

The design sample's `/forms/error-validation` screen is the standard. When the server rejects the save
because of one section (a linked resource another user deleted, a value only that section owns), the
form does four things, and never toasts:

1. **One danger `Alert` above that section**, under its `SectionHeader`, saying what happened, why,
   that nothing else was lost, and what to do, as separate sentences: `Origin "web-origin-prod" no
longer exists. Another user deleted it while you were filling in this form, so the service wasn't
created. Nothing else was lost: reload the origin list and select another one.`
2. **The recovery action on that `Alert`** (`#action` slot, `kind="secondary"`): `Reload origins`,
   with `loading` while it runs; meanwhile the field gives way to a `Skeleton` and Save is disabled.
3. **The field turns `invalid`** with its own one-line reason under it (`This origin no longer
exists.`), wired by `aria-describedby`. After the reload clears the stale value it turns `required`
   (`Select an origin to continue.`) and the `Alert` closes.
4. **The page takes the user there**: after the lock is released, scroll the section to the top of the
   scroll container (instant under `prefers-reduced-motion`) and focus the field with
   `preventScroll`. Every other entry is kept.

Where each error renders, row by row, is `/webkit-errors`.

### Unsaved changes — `useUnsavedChanges` (`platform/edit/edit-resource`)

Every edit form keeps a saved baseline and asks before its edits are lost. Do not hand-roll
`JSON.stringify` baselines or `beforeunload` listeners: use the composable.

```js
import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
import { onBeforeRouteLeave } from 'vue-router'

const guard = useUnsavedChanges(() => form, {
  onDiscard: (baseline) => Object.assign(form, baseline),
  onSave: save
})
onBeforeRouteLeave(() => guard.confirmLeave())
```

- `isDirty` shows the `SaveBar` and the `dirty` mark on the section's `Tabs.Item`; `commit()` after a
  successful save, `discard()` for the bar's Discard (a ref source is restored in place, a getter
  source goes through `onDiscard`).
- `confirmLeave()` resolves `true` at once while clean; while dirty it opens the dialog and resolves
  with the user's choice. Use it in `onBeforeRouteLeave` and in the setter of a tab bar's `v-model`.
- Render one `ConfirmDialog v-bind="guard.dialogProps"` with the `#actions` slot holding Keep editing
  (`guard.keepEditing`), Discard changes (`guard.discardAndLeave`) and, when `onSave` is set, Save
  changes (`guard.saveAndLeave`, `:loading="guard.dialogProps.loading"`); labels come from
  `guard.labels` (built in for en, pt-BR and es).
- The browser's own reload / close prompt runs while dirty; turn the guards off with
  `enabled: false` while a successful save navigates away.
- When the record was saved elsewhere after the form opened, follow `edit-resource#StaleRecord`: a
  warning `Alert` above the form with Reload, and an overwrite `ConfirmDialog` before Save.

## Read-only vs disabled — a value the user cannot change

A value the user can see but must never edit — a client ID, an account ID, a generated key, a
creation date, an e-mail that only support can change — is **read-only**, not disabled:

```vue
<Field>
  <Field.Label>Client ID</Field.Label>
  <Input v-model="clientId" readonly monospace :spellcheck="false" />
  <Field.Description>Can't be changed. Quote it when opening a support ticket.</Field.Description>
</Field>
```

- `readonly` keeps the value in `var(--text-default)`, focusable and copyable. The `Input` stays the
  **same filled field** (surface, solid border) and only drops the hover border, as the design
  sample draws it; never restyle it (dashed border, transparent fill) to make it look different.
- **A long value takes `Textarea readonly`**, which draws the same filled field as `Input` (a
  certificate, a generated policy, a description only an admin can change; `Textarea` example
  ReadOnly). Never a `<pre>` or a styled block in its place.
- Say **why** in the helper text (who owns the value, and how to change it if that is possible): the
  description, not the chrome, tells the user the value is fixed.
- **Code-like values take `monospace`**: a CLI command, an ID, a token, a hash, a path. A command the
  user copies is `readonly monospace` in an `InputGroupRoot` with a `CopyButton`
  (`Input` example ReadOnly). Prose values (names, e-mails, domains being typed) stay in the sans face.
  The same `monospace` prop is on `PasswordInput` (an API token or client secret, with
  `autocomplete="off"`) and on `Textarea` (a pasted zone file, certificate, JSON or list of IPs). Never
  hand-apply `text-label-code-sm` / `text-body-code-sm` to a field.
- **`disabled` is something else:** a control that is temporarily unavailable (a submit lock, a
  dependency not met). It greys the value out and drops it from the tab order. Never use it for a
  value that is permanently fixed.
- Never fake read-only with a plain `<input>` or text styled to look like a field, and never leave a
  fixed value in an editable field "because the save ignores it".

## Disabled state — the disabled helper is optional context, not submit feedback

A `HelperText` with `kind="disabled"` (it prepends a lock glyph, muted text) is an **optional** element
whose only job is to explain **why a field is disabled** and how to lift the lock. It is **not**
validation feedback and it is **not** required by the submit lock. Two cases:

- **Submit lock — you don't need a helper, and you get none.** The `:disabled="submitting"` applied to
  every control during a save is transient (it clears in `finally`) and the Save button's `:loading`
  already says the form is busy. **Don't add a disabled-reason helper just because fields are locked
  mid-submit.** A `Field` that already has a guidance `Field.Description` keeps showing it (its tone
  flips to `disabled`, so the lock glyph joins it for the ~1s of the request); one with **no**
  description renders **no helper row at all** — the field writes no copy of its own, so nothing appears and
  disappears under the field mid-save. Do **not** invent a lock explanation for a lock that lasts a
  second.

- **Persistent disable — use the disabled helper when the reason isn't obvious.** When a field is
  disabled by a **dependency** (a plan tier, a toggle that must be on first, a mode that doesn't apply),
  the disabled `HelperText` is the right, optional tool — e.g. _"Enable HTTPS support to choose HTTPS
  ports."_ It gives the user the context to understand and lift the lock. In an **ItemGroup** that
  context usually already lives in `Item.Description` (e.g. a disabled "HTTPS Ports" row whose
  description reads _"Applies when the Application serves HTTPS traffic."_), so a separate disabled
  helper is redundant — add one only when it says something the description doesn't.

Rules:

- **The submit lock needs no disabled-reason helper** — it's transient and the Save `:loading` covers it.
- **A disabled helper is optional and explains the dependency**, never validation — it answers only
  "why is this locked and how do I unlock it".
- **Don't fabricate a disabled explanation for a transient lock.** Reserve `kind="disabled"` for a
  persistent, non-obvious dependency.
- **A disabled field is never also `required`/`invalid`.** `disabled` wins the control's state (and the
  `HelperText` `kind`), so a locked field shows neither the amber required nor the red invalid cue.

## Choosing an approach

| Situation                                                            | Approach                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Settings page, resource config, many grouped fields, a Create drawer | **A — Cards + ItemGroups** (`Item.List`, `size="small"`)                              |
| Login, rename, a short 1–3 field dialog, one wizard step             | **B — Fields separated** (`Field` stacked)                                            |
| A section mixes a couple of simple rows with a radio block           | **A**, with the radio block as a full-width child inside its `Item`                   |
| A drawer's Select needs an item of the same resource not created yet | **Nested drawer** — quick-add opens a second drawer; each drawer its own scoped save  |
| A drawer's Select needs a first-level resource that doesn't exist    | Link to its create page, or `platform/create/resource-picker` — never a nested drawer |

The module **create** action for a first-level resource lands on a dedicated **page** (route
`/<module>/new`), not a modal, so it is linkable and back-button-safe, however short the form; a
drawer creates only an item inside a resource (and variables, the one exception in
`/webkit-create-surface`).

## Review output

For `/webkit-form <file>`, list gaps grouped by pattern. Each:

```
✗ SomeForm.vue:NN  <Label for="runtime" /> but no element has id="runtime"
  pattern: composed Select labels its trigger — for points at nothing; the combobox has no accessible name.
  fix: add id="runtime" to <Select.Trigger>, matching the Label's for.

✗ SomeForm.vue:NN  <Item> with no size
  pattern: Cards + ItemGroups — form Items are size="small" for rhythm/hierarchy.
  fix: <Item size="small">.
```

End with: `form is accessible` or `N gaps — fix before polish`.

## References

- `Field` and its parts, `Label`, `HelperText`, `Item`, `Card`, `Select`, `Button` import paths: ask the
  webkit MCP `suggest_component`, or read `node_modules/@aziontech/webkit/catalog.json` (`imports`) —
  every key is a real subpath.
- Companion skills: `/webkit-ux-heuristics` (states + inline error placement), `/webkit-ui-states`
  (lock-the-scope + toast for request errors), and `/webkit-errors` (where every failure goes: the
  field, a section `Alert`, a toast, the auth card — including the signed-out screens, which never
  toast).
- Token catalog (spacing, colour, shape, typography): the `@aziontech/theme` tokens (the `--*` CSS
  variables it ships; the webkit MCP lists them).
- Compose only webkit components and theme tokens — no external UI libraries, no hex/rgb colours, no
  component-local CSS.

## Definition of Done

- [ ] Every labelled control sits in a `Field` (`Field.Label` + control + `Field.Description` /
      `Field.Error`, state on the `Field`); checkboxes/radios/switches use `orientation="horizontal"`,
      choice cards are `Field.Label` wrapping a horizontal `Field`; a bare control is used only when its
      label lives elsewhere, and then the `aria-label` + `aria-describedby` are wired by hand.
- [ ] The form type fits the flow (Drawer / nested Drawer / Dialog / ItemGroup settings / Card with
      independent saves), and the **save model follows partitioning**: one save for a logical unit (Drawer,
      Dialog, or an ItemGroup — single block _or_ multiple `SettingsSection` bands); one save per card only
      for the Card-with-independent-saves type.
- [ ] A **nested drawer** keeps parent and child as independent forms — each its own `submitting` flag,
      `<fieldset :disabled>`, and Save `:loading`; the parent `Select` is controlled with a sentinel
      quick-add; the child creates an item of the parent's resource (never a first-level resource,
      which gets a link to its create page or a `resource-picker`) and wires it back into the parent on
      save; no `z-*` overrides on the drawers or popups.
- [ ] Field spacing follows the macro rule: `--spacing-xs` inside a field, `--spacing-lg` between fields
      and sections (`--spacing-md` only in a compact modal body). No one-off gaps.
- [ ] Hierarchy is not inverted: title → description → section title → field label → control → helper.
- [ ] Section titling matches role: a multi-Card ItemGroup titles each band with a `SettingsSection`
      over a header-less flush `Card`; a self-contained card that _is_ the form
      uses the `Card` `title` in its header. Never both on one card.
- [ ] The form uses **one** layout: Cards + ItemGroups (`Item.List` of `SettingRow` rows) or
      Fields separated (`Field` stacked) — not a mix within a section.
- [ ] Field naming matches the type: in an **ItemGroup**, `Item.Title` is the label and the control
      takes an `aria-label` (no `<Label>` inside an `Item`); in **Fields separated**, a real `Label`
      (or `Field.Label` inside a `Field`) with `for`→`id`, and a `Select` labels its trigger. No bare
      control with a floating `<p>` label, no placeholder-as-label.
- [ ] Where a required field has a `Label`, its required tag is **persistent** (always `required`, not
      revealed on submit) — render the `Label` yourself instead of `Field.Label` so the tag
      stays on while only the field's amber state is revealed on submit.
- [ ] Each section is a native `<fieldset>` with an `sr-only` `<legend>`.
- [ ] Validation runs on submit only; feedback is the field's state **and** an on-field `HelperText`
      message (`Field.Description` / `Field.Error` in Fields separated; a `<HelperText>` under the control in an
      ItemGroup), bound to the error and cleared on edit. Required-but-empty uses the amber `required`
      state/`kind` (required is NOT an error); filled-but-malformed uses the red `invalid` state/`kind`;
      never both on one field. No error-summary block, no `Alert` callout for field validation.
- [ ] Native hints on the `<input>`: `type`, `autocomplete` + `name`, `spellcheck="false"` on
      e-mails, slugs and codes; paste is never blocked; a failed submit focuses the first field in
      error; submit is never pre-disabled.
- [ ] A value the user cannot change is `readonly` on its `Input` or `Textarea` (the filled field,
      with a helper saying why), never `disabled` and never an editable field the save ignores.
- [ ] Leaving the page with unsaved edits asks first (or the edits survive the navigation).
- [ ] `<form novalidate @submit.prevent>`; Enter submits; the scope locks off one flag
      (`<fieldset :disabled>` **and** `:disabled` on every control + Save `:loading`, per `/webkit-ui-states`
      Pattern 1); request errors toast, field errors stay inline.
