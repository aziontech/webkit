<script setup>
  // Add Environment Variable — the Variables module's create flow, in a MEDIUM right
  // Drawer. Unlike the module's card-based drawers (Create Table / Create Rule), this
  // one is a FLAT form: the fields sit directly on the panel surface and a single
  // full-bleed Divider splits the two halves of the task — WHAT the variables are (the
  // repeated Key / Value / Note triad) from HOW they are stored and scoped (Sensitive,
  // Environments, Link to Projects). No section titles, no CardBox: with one repeated
  // group and three settings there is nothing for a title to disambiguate, and the
  // divider already reads as the boundary.
  //
  // A variable is rarely added alone, so the triad is a REPEATER: "Add Another" appends
  // an empty one (and focuses its Key), and each row past the first can be removed. A
  // TransitionGroup morphs the list on both, timed off the animate tokens — never
  // hardcoded. Rhythm: a triad's own fields sit at the MD step so the three read as one
  // variable, and everything above/below the divider — triad → triad, the repeater
  // button, each setting — sits at the section step.
  //
  // The two bulk paths run the same parse (src/lib/dotenv.js): the footer's Import reads
  // a picked `.env`, and pasting a file's contents into ANY Key input expands into one
  // row per pair instead of dumping the whole file into one key — which is exactly what
  // the footer's hint promises.
  //
  // Accessibility follows the module's form conventions, FIELDS SEPARATED: each field is
  // a triad — a real `<Label for>`, the control, and (only after a failed submit) its own
  // message wired through `aria-describedby`. The labels carry no Required tag and no
  // guidance row at rest, because the resting state is bare fields; on a failed submit
  // the field reveals amber `required` for an empty value (required is NOT an error) and
  // red `invalid` for a malformed or duplicate key, never both. The errors are DERIVED,
  // so they clear as the user types with nothing to reset. The scope is one native
  // `<form novalidate @submit.prevent>` (Enter submits via the sr-only submit), and one
  // `submitting` flag locks it (fieldset :disabled + Save :loading). Only a request-level
  // failure toasts, with Retry — never silent.
  //
  // There is no Cancel: the panel's own X, the overlay and Escape all close it, and a
  // second dismissal in the footer would only compete with Save for the eye.
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import Divider from '@aziontech/webkit/divider'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputPassword from '@aziontech/webkit/input-password'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  import { APPLICATIONS } from '../lib/applications'
  import { parseDotenv } from '../lib/dotenv'
  import { presetIcon, presetLabel } from '../lib/presets'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    // The keys already in the list, so a collision is caught here instead of creating a
    // second row the module would then show twice.
    existingKeys: { type: Array, default: () => [] }
  })

  const emit = defineEmits(['created'])

  // ── Form state ────────────────────────────────────────────────────────────
  // Stable keys for the repeater rows, so the morph tracks a row through an insert
  // above it instead of re-rendering the list by index.
  let nextId = 0
  const uid = () => (nextId += 1)

  // `flagged` is what makes a row show its messages: a submit flags the rows that were
  // in the form at the time, so a row added AFTER a failed submit opens clean instead of
  // inheriting red for a field nobody has typed in yet.
  const newEntry = (key = '', value = '', note = '') => ({
    id: uid(),
    key,
    value,
    note,
    flagged: false
  })

  // The three deploy contexts a variable can be scoped to. Order is the promotion
  // order, which is also how the trigger reads them back ("Production and Preview").
  const ENVIRONMENTS = [
    { value: 'production', label: 'Production' },
    { value: 'preview', label: 'Preview' },
    { value: 'development', label: 'Development' }
  ]

  const SENSITIVE_HINT =
    'A sensitive value is stored encrypted and masked in the list. It can be replaced but never read back.'

  // Sensitive defaults ON and the scope defaults to Production and Preview: the safe
  // default for a value a developer is pasting out of a password manager.
  const blankForm = () => ({
    entries: [newEntry()],
    sensitive: true,
    environments: ['production', 'preview'],
    projects: []
  })

  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)

  // One id namespace per drawer instance, so every `for` ↔ control pair stays unique
  // even if a second instance is ever mounted.
  const scope = useId()
  const keyId = (entry) => `${scope}-key-${entry.id}`
  const valueId = (entry) => `${scope}-value-${entry.id}`
  const noteId = (entry) => `${scope}-note-${entry.id}`
  const sensitiveId = `${scope}-sensitive`
  const environmentsId = `${scope}-environments`
  const projectsId = `${scope}-projects`

  // ── Validation (derived, surfaced only after a failed submit) ─────────────
  // An environment variable name: letters, digits and underscore, never leading with a
  // digit. Case is NOT forced — an imported `.env` legitimately carries mixed-case keys,
  // and silently upper-casing what the user pasted is worse than accepting it as typed.
  const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

  // `required` (amber) is the empty field; `invalid` (red) is a filled field whose value
  // cannot be used. The two are never both on for one field.
  const keyError = (entry, index) => {
    const key = entry.key.trim()
    if (!key) return { kind: 'required', message: 'Key is required.' }
    if (!KEY_PATTERN.test(key))
      return {
        kind: 'invalid',
        message: 'Use letters, numbers and underscore. It cannot start with a number.'
      }
    if (form.entries.some((other, position) => position < index && other.key.trim() === key))
      return { kind: 'invalid', message: `“${key}” is repeated in this form.` }
    if (props.existingKeys.includes(key))
      return { kind: 'invalid', message: `“${key}” already exists in this list.` }
    return null
  }

  const errors = computed(() =>
    form.entries.map((entry, index) => ({
      key: keyError(entry, index),
      value: entry.value.trim() ? null : { kind: 'required', message: 'Value is required.' }
    }))
  )

  const environmentsError = computed(() => form.environments.length === 0)

  const isValid = computed(
    () => !environmentsError.value && errors.value.every((entry) => !entry.key && !entry.value)
  )

  // ── The repeater ──────────────────────────────────────────────────────────
  // Morph the rows on add / remove (the same tokens as the module's other repeaters —
  // timing comes from the animate tokens, never hardcoded).
  const morphStyle = {
    '--tg-move-duration': duration['slow-01'],
    '--tg-move-ease': curve['expressive-entrance'],
    '--tg-enter-duration': duration['moderate-01'],
    '--tg-enter-ease': curve['productive-entrance'],
    '--tg-leave-duration': duration['slow-01'],
    '--tg-leave-ease': curve['productive-exit']
  }
  const morphTransition = {
    moveClass:
      'transition-transform duration-[var(--tg-move-duration)] ease-[var(--tg-move-ease)] motion-reduce:transition-none',
    enterActiveClass:
      'transition-all duration-[var(--tg-enter-duration)] ease-[var(--tg-enter-ease)] motion-reduce:transition-none',
    enterFromClass: '-translate-y-[var(--spacing-xxs)] opacity-0',
    leaveActiveClass:
      'transition-opacity duration-[var(--tg-leave-duration)] ease-[var(--tg-leave-ease)] motion-reduce:transition-none',
    leaveToClass: 'opacity-0'
  }

  // webkit's InputText exposes no imperative `focus()` (its root owns the chrome and the
  // inner `<input>` carries the id), so the new row is focused through the id the Label
  // already points at — no template-ref map to keep in sync with the array.
  const focusKey = async (entry) => {
    await nextTick()
    document.getElementById(keyId(entry))?.focus()
  }

  const addEntry = () => {
    const entry = newEntry()
    form.entries.push(entry)
    focusKey(entry)
  }

  const removeEntry = (index) => {
    if (form.entries.length <= 1) return // the form always holds at least one row
    form.entries.splice(index, 1)
  }

  // ── Bulk input: paste and Import ──────────────────────────────────────────
  // Pasting `.env` contents into a Key input fills THIS row from the first pair and
  // inserts the rest below it, so the pasted file keeps its order.
  const expandInto = (index, pairs) => {
    const [first, ...rest] = pairs
    const target = form.entries[index]
    target.key = first.key
    target.value = first.value
    form.entries.splice(index + 1, 0, ...rest.map((pair) => newEntry(pair.key, pair.value)))
  }

  const onKeyPaste = (event, index) => {
    const pairs = parseDotenv(event.clipboardData?.getData('text/plain') ?? '')
    // Nothing parsed → a plain key was pasted; let the browser handle it.
    if (pairs.length === 0) return

    event.preventDefault()
    expandInto(index, pairs)
    toast.success(
      pairs.length === 1
        ? `Read ${pairs[0].key} from the pasted .env.`
        : `Read ${pairs.length} variables from the pasted .env.`
    )
  }

  // Import appends to what is already typed, after dropping the rows still blank — so
  // importing into an untouched form replaces its one empty row.
  const fileRef = ref(null)

  const openImport = () => fileRef.value?.click()

  const onFilePicked = async (event) => {
    const [file] = event.target.files ?? []
    // Clear the input so picking the same file twice still fires `change`.
    event.target.value = ''
    if (!file) return

    const pairs = parseDotenv(await file.text())
    if (pairs.length === 0) {
      toast.error(`No variables found in “${file.name}”.`, {
        description: 'Expected lines in the KEY=value form.'
      })
      return
    }

    const typed = form.entries.filter((entry) => entry.key.trim() || entry.value.trim())
    form.entries = [...typed, ...pairs.map((pair) => newEntry(pair.key, pair.value))]
    toast.success(
      pairs.length === 1
        ? `Imported ${pairs[0].key} from “${file.name}”.`
        : `Imported ${pairs.length} variables from “${file.name}”.`
    )
  }

  // ── Environments / Projects selectors ─────────────────────────────────────
  // The trigger reads the scope back as a sentence: two of three is "Production and
  // Preview", all three is "All Environments".
  const environmentsDisplay = (value) => {
    const picked = ENVIRONMENTS.filter((option) => value?.includes(option.value))
    if (picked.length === 0) return ''
    if (picked.length === ENVIRONMENTS.length) return 'All Environments'
    const labels = picked.map((option) => option.label)
    if (labels.length === 1) return labels[0]
    return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
  }

  // The projects a variable can be linked to are the account's applications, read from
  // the same seed the Applications list renders (src/lib/applications.js) — so the picker
  // can never offer a project that does not exist.
  const projectOptions = APPLICATIONS.map((application) => ({
    value: application.id,
    label: application.name,
    preset: application.preset
  }))

  // The roster is long enough that scanning it beats reading it: the panel gets its own
  // search field (Select.Content's `#search` slot). Cleared on close so it never reopens
  // pre-filtered.
  const projectQuery = ref('')
  const projectsOpen = ref(false)
  watch(projectsOpen, (isOpen) => {
    if (!isOpen) projectQuery.value = ''
  })

  const visibleProjects = computed(() => {
    const query = projectQuery.value.trim().toLowerCase()
    if (!query) return projectOptions
    return projectOptions.filter((option) => option.label.toLowerCase().includes(query))
  })

  // Two names fit the trigger; past that the count carries the rest.
  const projectsDisplay = (value) => {
    const names = projectOptions
      .filter((option) => value?.includes(option.value))
      .map((option) => option.label)
    if (names.length === 0) return ''
    if (names.length <= 2) return names.join(', ')
    return `${names.slice(0, 2).join(', ')} +${names.length - 2}`
  }

  // Reset the whole scope whenever the drawer closes (X, overlay, Escape, or a
  // successful create) so the next open is pristine — including the projects panel,
  // whose open state outlives the unmounted panel.
  watch(open, (isOpen) => {
    if (isOpen) return
    Object.assign(form, blankForm())
    submitted.value = false
    submitting.value = false
    projectsOpen.value = false
    projectQuery.value = ''
  })

  // ── Submit ────────────────────────────────────────────────────────────────
  const submit = async () => {
    submitted.value = true
    for (const entry of form.entries) entry.flagged = true
    if (submitting.value) return // re-entrancy lock
    if (!isValid.value) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const created = form.entries.map((entry) => ({
        key: entry.key.trim(),
        value: entry.value,
        note: entry.note.trim(),
        secret: form.sensitive,
        environments: [...form.environments],
        projects: [...form.projects]
      }))
      emit('created', created)
      toast.success(
        created.length === 1
          ? `Variable “${created[0].key}” created.`
          : `${created.length} variables created.`
      )
      open.value = false // watch() resets the form
    } catch (error) {
      // Request-level failure → toast with a way to recover. Never silent.
      toast.error('Could not create the variables.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <!-- One native form owns the scope: Enter submits (via the sr-only submit
             control, since the styled Button can't be type=submit), and the fieldset
             locks every field while the request is in flight. -->
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add Environment Variable"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <DrawerTitle>Add Environment Variable</DrawerTitle>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--layout-section-gap)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Add environment variable</legend>

              <!-- The variables themselves. Inside a triad the fields sit at the MD step
                   so the three read as one variable; triad → triad takes the section
                   step, like every other block in the panel. -->
              <TransitionGroup
                tag="div"
                class="flex min-w-0 flex-col gap-[var(--layout-section-gap)]"
                v-bind="morphTransition"
                :style="morphStyle"
              >
                <div
                  v-for="(entry, index) in form.entries"
                  :key="entry.id"
                  class="flex min-w-0 flex-col gap-[var(--spacing-md)]"
                >
                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <!-- Remove rides the Key label row: it belongs to the whole triad,
                         and only exists once there is more than one to remove — so at rest
                         the three labels sit at exactly the same step above their field. -->
                    <div class="flex items-center justify-between gap-[var(--spacing-xs)]">
                      <Label :for="keyId(entry)">Key</Label>
                      <Tooltip
                        v-if="form.entries.length > 1"
                        text="Remove variable"
                      >
                        <IconButton
                          icon="pi pi-times"
                          kind="outlined"
                          size="small"
                          aria-label="Remove variable"
                          @click="removeEntry(index)"
                        />
                      </Tooltip>
                    </div>
                    <InputText
                      :id="keyId(entry)"
                      v-model="entry.key"
                      name="key"
                      size="large"
                      class="w-full"
                      autocomplete="off"
                      spellcheck="false"
                      :required="entry.flagged && errors[index].key?.kind === 'required'"
                      :invalid="entry.flagged && errors[index].key?.kind === 'invalid'"
                      :aria-describedby="
                        entry.flagged && errors[index].key ? `${keyId(entry)}-message` : undefined
                      "
                      @paste="onKeyPaste($event, index)"
                    />
                    <HelperText
                      v-if="entry.flagged && errors[index].key"
                      :id="`${keyId(entry)}-message`"
                      :kind="errors[index].key.kind"
                      :label="errors[index].key.message"
                    />
                  </div>

                  <!-- The value is masked while typing and revealed on demand, whether or
                       not it is stored sensitive — a value pasted on a shared screen is
                       the common case. -->
                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Label :for="valueId(entry)">Value</Label>
                    <InputPassword
                      :id="valueId(entry)"
                      v-model="entry.value"
                      name="value"
                      class="w-full"
                      autocomplete="off"
                      :required="entry.flagged && Boolean(errors[index].value)"
                      :aria-describedby="
                        entry.flagged && errors[index].value
                          ? `${valueId(entry)}-message`
                          : undefined
                      "
                    />
                    <HelperText
                      v-if="entry.flagged && errors[index].value"
                      :id="`${valueId(entry)}-message`"
                      kind="required"
                      :label="errors[index].value.message"
                    />
                  </div>

                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Label :for="noteId(entry)">Note (Optional)</Label>
                    <InputText
                      :id="noteId(entry)"
                      v-model="entry.note"
                      name="note"
                      size="large"
                      class="w-full"
                      placeholder="Where to rotate, or who to contact"
                    />
                  </div>
                </div>
              </TransitionGroup>

              <Button
                class="self-start"
                label="Add Another"
                kind="outlined"
                size="medium"
                icon="pi pi-plus"
                @click="addEntry"
              />

              <!-- Full-bleed boundary: WHAT the variables are, above; HOW they are stored
                   and scoped, below. The wrapper carries the negative inset so the
                   Divider itself stays untouched (a `w-full` flex item with negative
                   margins would shift rather than stretch). -->
              <div class="-mx-[var(--spacing-lg)]">
                <Divider />
              </div>

              <!-- A switch labels itself: the Label points at the control, so the word
                   toggles it too. The hint hangs off a real focusable control, so it is
                   reachable by keyboard and named for a screen reader. -->
              <div class="flex items-center gap-[var(--spacing-sm)]">
                <Switch
                  :id="sensitiveId"
                  v-model="form.sensitive"
                />
                <Label :for="sensitiveId">Sensitive</Label>
                <Tooltip :text="SENSITIVE_HINT">
                  <button
                    type="button"
                    :aria-label="SENSITIVE_HINT"
                    class="inline-flex size-5 items-center justify-center rounded-[var(--shape-button)] text-[var(--text-muted)] transition-colors duration-150 ease-out hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
                  >
                    <i
                      class="pi pi-info-circle text-body-xs"
                      aria-hidden="true"
                    />
                  </button>
                </Tooltip>
              </div>

              <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                <Label
                  :id="`${environmentsId}-label`"
                  :for="environmentsId"
                  >Environments</Label
                >
                <Select
                  v-model="form.environments"
                  multiple
                  size="large"
                  placeholder="Select environments"
                  :required="submitted && environmentsError"
                  :display-value="environmentsDisplay"
                >
                  <!-- The glyph is a full-height island on the leading edge — the
                       InputGroup addon's anatomy, expressed inside the trigger's own
                       `#iconLeft` because a real InputGroup pins its Select child to its
                       content width, and here the Select must fill the field. -->
                  <Select.Trigger
                    :id="environmentsId"
                    class="pl-0"
                    :aria-labelledby="`${environmentsId}-label`"
                    :aria-describedby="
                      submitted && environmentsError ? `${environmentsId}-message` : undefined
                    "
                  >
                    <template #iconLeft>
                      <span
                        class="flex shrink-0 items-center self-stretch border-r border-[var(--border-default)] bg-[color:var(--bg-canvas)] px-[var(--spacing-md)] text-[var(--text-muted)]"
                        aria-hidden="true"
                      >
                        <i class="ai ai-layers" />
                      </span>
                    </template>
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Option
                      v-for="option in ENVIRONMENTS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
                <HelperText
                  v-if="submitted && environmentsError"
                  :id="`${environmentsId}-message`"
                  kind="required"
                  label="Pick at least one environment."
                />
              </div>

              <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                <Label
                  :id="`${projectsId}-label`"
                  :for="projectsId"
                  >Link to Projects (optional)</Label
                >
                <Select
                  v-model="form.projects"
                  v-model:open="projectsOpen"
                  multiple
                  size="large"
                  placeholder="Search projects..."
                  :display-value="projectsDisplay"
                >
                  <Select.Trigger
                    :id="projectsId"
                    :aria-labelledby="`${projectsId}-label`"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search shrink-0 text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                    </template>
                  </Select.Trigger>
                  <Select.Content>
                    <!-- `#search` renders above the scrolling list, so the field stays put
                         while the options move. `@keydown.stop` keeps the panel's
                         Arrow/Home/End handler from pulling focus onto an option while the
                         user is still typing. -->
                    <template #search>
                      <InputText
                        v-model="projectQuery"
                        size="large"
                        class="w-full"
                        placeholder="Search projects..."
                        aria-label="Search projects"
                        @keydown.stop
                      >
                        <template #iconLeft>
                          <i
                            class="pi pi-search"
                            aria-hidden="true"
                          />
                        </template>
                      </InputText>
                    </template>
                    <Select.Option
                      v-for="option in visibleProjects"
                      :key="option.value"
                      :value="option.value"
                    >
                      <template #left>
                        <i
                          :class="`ai-cor ${presetIcon(option.preset)}`"
                          class="shrink-0 text-[1.15em]"
                          :title="presetLabel(option.preset)"
                          aria-hidden="true"
                        />
                      </template>
                      {{ option.label }}
                    </Select.Option>
                    <!-- A search that matches nothing must say so; an empty panel reads as
                         a broken filter. -->
                    <p
                      v-if="!visibleProjects.length"
                      class="px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
                    >
                      No project matches “{{ projectQuery }}”.
                    </p>
                  </Select.Content>
                </Select>
              </div>
            </fieldset>
          </PanelContent>

          <!-- The footer carries the bulk path beside the hint that names the other one,
               and Save alone on the right (the panel's X, the overlay and Escape are the
               cancel). --bg-canvas sets it a shade back from the form it submits, so the
               two read as different planes. -->
          <PanelFooter class="flex-wrap justify-between bg-[color:var(--bg-canvas)]">
            <div class="flex min-w-0 items-center gap-[var(--spacing-sm)]">
              <Button
                label="Import"
                kind="outlined"
                size="medium"
                icon="pi pi-upload"
                :disabled="submitting"
                @click="openImport"
              />
              <p class="min-w-0 text-body-sm text-[var(--text-muted)]">
                or paste .env contents in Key input
              </p>
              <input
                ref="fileRef"
                type="file"
                accept=".env,.txt,text/plain"
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
                @change="onFilePicked"
              />
            </div>
            <Button
              label="Save"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Save
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
