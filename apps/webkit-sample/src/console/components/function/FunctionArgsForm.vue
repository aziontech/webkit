<script setup>
  // THE FORM BUILDER — `azion_form`, built as a form.
  //
  // A function's arguments have always been writable here as JSON. This is the second
  // way of writing them, and it writes the OTHER document: not the values
  // (`default_args`) but the SCHEMA over them (`azion_form`), which is what makes an
  // instance of this function ask named questions with guidance and validation instead
  // of handing its reader a blank JSON editor.
  //
  // ── BOTH SURFACES AUTHOR. NEITHER OWNS. ──
  //
  // The schema is one document with two renderings, and a reader may work in either:
  //
  //   the FIELD LIST — a row per property: its name, its type, whether it is required,
  //     its default, its constraints. This is the surface for building one.
  //   the SCHEMA JSON — the same document in Monaco, in a pane BESIDE the rows. It is
  //     not a preview and it is not behind a toggle: building a field writes it as the
  //     reader types, and typing in it builds the fields. It is also where a schema gets
  //     pasted in, and where a construct the rows do not draw is reached.
  //
  // Editing either updates the other immediately (../../lib/format/args-schema.js is
  // the translation both go through). Two-way sync between a structured editor and its
  // own text is where these things usually go wrong, so the loop is closed in exactly
  // one way: each watcher remembers the text IT last wrote and ignores that value
  // coming back. Nothing else guards it — no flags racing a `nextTick`, no debounce
  // that makes the two surfaces briefly disagree.
  //
  // ── AND THE VALUES FOLLOW THE FORM ──
  //
  // `default_args` is not a third document to keep in your head: a field's **Default**
  // IS its entry in `default_args`, in both directions. Type `86400` into `max_age`'s
  // Default here and the JSON surface shows `"max_age": 86400`; type it there and this
  // row shows it. Keys the form does not declare are the reader's own and are never
  // touched — adding a form to a function that already had arguments does not delete
  // the arguments it had.
  //
  // ── WHAT IT REFUSES TO DO ──
  //
  // Lose a construct it cannot draw. A property with a `oneOf`, a nested object, a
  // `$ref` — anything richer than a row — is kept whole and rendered as a row that says
  // it is edited in the schema, rather than being silently rewritten into the nearest
  // shape the builder happens to offer. See `args-schema.js` § "What a round trip must
  // not do".
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Message from '@aziontech/webkit/message'
  import ResizablePanel from '@aziontech/webkit/resizable-panel'
  import ResizablePanelHandle from '@aziontech/webkit/resizable-panel-handle'
  import ResizablePanelPane from '@aziontech/webkit/resizable-panel-pane'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, ref, watch } from 'vue'

  import { DRAG_ROW_CLASS, GRIP_CLASS, useDragReorder } from '../../lib/behavior/drag-reorder'
  import { MORPH_COLLAPSE } from '../../lib/behavior/list-morph'
  import {
    applyFormDefaults,
    blankField,
    EMPTY_SCHEMA,
    FIELD_TYPES,
    fieldDefault,
    fieldsFromArgs,
    FORM_JSON_SCHEMA,
    ITEM_TYPES,
    keyError,
    parseSchema,
    serializeSchema
  } from '../../lib/format/args-schema'
  import FieldRow from '../form/FieldRow.vue'
  import MonacoEditor from '../monaco-editor/monaco-editor.vue'

  /** `azion_form`, as text. Empty string = this function has no form. */
  const schema = defineModel('schema', { type: String, default: '' })
  /** `default_args`, as text — the same model the JSON surface edits. */
  const args = defineModel('args', { type: String, default: '{}' })

  const props = defineProps({
    /** Locks the whole surface while the host's save is in flight. */
    disabled: { type: Boolean, default: false },
    /** Test id prefix, so the two hosts address their own builders. */
    testId: { type: String, default: 'function-args-form' }
  })

  // ── THE DOCUMENT, AND THE TWO WATCHERS THAT KEEP IT ONE ───────────────────

  const fields = ref([])
  /** Why the schema could not be read into rows. Empty when it could. */
  const schemaError = ref('')
  /**
   * The parts of the schema that are not the rows' to write — a `$schema`, a `title` on the
   * form itself, an `additionalProperties`, a `required` entry naming a property that is
   * being renamed. Read off the document and handed back to `serializeSchema` with every
   * write, so editing one label does not rewrite a pasted schema as the three keywords the
   * builder knows about.
   */
  const kept = ref({ extras: {}, extraRequired: [] })
  /** Which field cards are expanded. A Set, so opening one is not closing another. */
  const expanded = ref(new Set())
  // The schema's own JSON sits BESIDE the rows, not behind a toggle — it is written as
  // the reader builds, so they watch the document appear rather than switching to check
  // on it. These are its movable edge and its way of getting out of the way.
  const schemaWidth = ref(420)
  const schemaCollapsed = ref(false)

  // The text each direction last wrote, so it can ignore its own echo. This is the
  // whole loop guard — see the note at the top.
  let pushedSchema = null
  let pushedArgs = null

  /**
   * The current `default_args` — or **`null`** when the text does not parse to an
   * object, which is the single most important distinction in this component.
   *
   * A reader typing on the JSON surface passes through every unfinished state there is:
   * empty after a select-all, `{`, a trailing comma. Reading those as `{}` would mean
   * the form sees every argument disappear, clears each row's Default to match, and
   * then writes the now-empty `{}` back over the text they are in the middle of typing.
   * `null` means "not a document yet", and both watchers wait rather than act on it.
   */
  const readArgs = () => {
    try {
      // No `|| '{}'` fallback: an EMPTY editor is the most common unfinished state
      // there is (it is what select-all-then-delete leaves behind), and reading it as a
      // valid empty object is exactly the reading that clears every Default.
      const value = JSON.parse(args.value)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  /** A JSON value → the text-shaped thing a row's Default control is bound to. */
  const toRowDefault = (field, value) => {
    if (field.type === 'boolean') return value === true
    if (field.type === 'array') return Array.isArray(value) ? value.map(String) : []
    if (value === undefined || value === null) return ''
    if (typeof value === 'object') return field.default
    return String(value)
  }

  // SCHEMA TEXT → ROWS. An unreadable schema leaves the rows it last had on screen and
  // says why: clearing them would look like the builder had eaten the schema, and the
  // reader is usually one character away from valid.
  watch(
    schema,
    (text) => {
      if (text === pushedSchema) return
      const result = parseSchema(text)
      schemaError.value = result.error
      if (!result.ok) return
      kept.value = { extras: result.extras, extraRequired: result.extraRequired }
      fields.value = result.fields
      // Rows arriving from the schema start collapsed — a pasted schema of twelve
      // properties should read as a list of twelve fields, not as twelve open forms.
      expanded.value = new Set()
    },
    { immediate: true }
  )

  // ROWS → SCHEMA TEXT, and the same edit → `default_args`. Deep, because every control
  // in every card writes into this one structure.
  watch(
    fields,
    () => {
      // NO FORM, NOTHING TO WRITE. Without this, `Remove form` undoes itself: emptying
      // the rows runs this watcher, `serializeSchema([])` is a valid empty schema, and
      // the form the reader just removed is written straight back.
      if (!schema.value.trim()) return

      // AND NOTHING TO WRITE OVER A SCHEMA THAT DOES NOT PARSE. The rows on screen are the
      // last ones read, not the document — the document is the text the reader is in the
      // middle of typing, and serializing the rows over it would replace their half-written
      // JSON with the form's version of an older state. The rows are locked while this is
      // true (`locked`), so the only way in is a change arriving from the host.
      if (schemaError.value) return

      const text = serializeSchema(fields.value, kept.value)
      if (text !== schema.value) {
        pushedSchema = text
        schema.value = text
      }

      // Only when the args are a document. Mid-edit JSON is left exactly as typed —
      // the form has nothing to say about a value that is not finished being written.
      const current = readArgs()
      if (!current) return
      const next = JSON.stringify(applyFormDefaults(current, fields.value), null, 2)
      if (next !== args.value) {
        pushedArgs = next
        args.value = next
      }
    },
    { deep: true }
  )

  // `default_args` TEXT → THE ROWS' DEFAULTS. The other half of "a field's Default IS
  // its entry in default_args": editing the value on the JSON surface moves the row.
  watch(args, (text) => {
    if (text === pushedArgs) return
    const values = readArgs()
    if (!values) return
    for (const field of fields.value) {
      const key = String(field.key ?? '').trim()
      if (!key || field.raw) continue
      const current = fieldDefault(field)
      const incoming = values[key]
      if (JSON.stringify(current ?? null) === JSON.stringify(incoming ?? null)) continue
      field.default = toRowDefault(field, incoming)
    }
  })

  // ── THE LIST ──────────────────────────────────────────────────────────────

  // THE JSON PANE ALWAYS SHOWS A STRUCTURE. A function with no form has an empty
  // `azion_form`, and an empty Monaco is not "the shape of what you are about to build",
  // it is a blank the reader has to guess at. So the pane READS the clean empty schema
  // when there is none, and WRITES straight through the moment anything is typed.
  //
  // The model itself stays `''` until then, which is what keeps the host honest: no
  // `azion_form` is posted for a function that never grew one, and the page is not dirty
  // just for having been looked at.
  const CLEAN_SCHEMA = JSON.stringify(EMPTY_SCHEMA, null, 2)
  const schemaText = computed({
    get: () => schema.value || CLEAN_SCHEMA,
    set: (value) => {
      schema.value = value
    }
  })

  const fieldTypeLabel = (type) =>
    FIELD_TYPES.find((option) => option.value === type)?.label ?? type

  const errors = computed(() =>
    Object.fromEntries(
      fields.value.map((field) => [field.id, keyError(field.key, fields.value, field.id)])
    )
  )

  /** The one thing the host needs from this surface: is the form fit to post. */
  const invalid = computed(() => Object.values(errors.value).some(Boolean))
  defineExpose({ invalid })

  /**
   * The field list is READ-ONLY while the schema does not parse.
   *
   * The rows stay on screen — they are the last ones the schema described, and blanking them
   * mid-keystroke reads as the builder having eaten the schema — but they are not the
   * document while the text disagrees with them, so nothing here may write. The reader's way
   * forward is the schema itself, which stays fully editable.
   */
  const locked = computed(() => props.disabled || !!schemaError.value)

  /**
   * The one place the trouble is reported. It is said HERE, beside the fields it affects, and
   * not under the editor as well: the same sentence twice, once in each pane, reads as two
   * different problems.
   */
  const schemaMessage = computed(() => {
    if (!schemaError.value) return ''
    if (!fields.value.length) return `${schemaError.value} Correct the schema to build the form.`
    return `${schemaError.value} The fields are the last ones read from the schema, and stay locked until it is valid.`
  })

  // ── WHEN THE NAME MESSAGE IS ALLOWED TO SPEAK ─────────────────────────────
  //
  // The console judges nothing while the reader is still typing, and `Add field` puts a
  // blank row on screen — so showing "Give the field a name." the instant it appears is
  // the form telling someone off for not having answered a question it just asked. The
  // two cases are genuinely different and are treated differently:
  //
  //   NOT ANSWERED YET (the name is empty) — silent until the reader has left the field.
  //   CANNOT BE ACCEPTED (a bad character, a duplicate) — said at once. There is real
  //     text on screen that will not work, and waiting for a blur to say so means
  //     letting them build the rest of the row on a name that was never going to hold.
  const touched = ref(new Set())
  const touch = (id) => {
    touched.value = new Set(touched.value).add(id)
  }

  const visibleError = (field) => {
    const error = errors.value[field.id]
    if (!error) return ''
    if (String(field.key ?? '').trim()) return error
    return touched.value.has(field.id) ? error : ''
  }

  const isExpanded = (id) => expanded.value.has(id)

  const toggle = (id) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }

  const open = (id) => {
    expanded.value = new Set(expanded.value).add(id)
  }

  /**
   * Start a form on a function that has none — one blank field, already open.
   *
   * The empty schema is claimed as ours (`pushedSchema`) before it is written, so the
   * schema watcher ignores it. It would otherwise land AFTER `addField` — watchers flush
   * on the tick, not on assignment — and re-seed the rows from a schema with no
   * properties, taking the blank field back out from under the reader's cursor.
   */
  const startForm = () => {
    // START FROM THE ARGUMENTS THE FUNCTION ALREADY HAS. `default_args` predates the
    // form, so most functions reaching this button already declare their arguments —
    // asking the reader to retype them into a blank row would be the builder ignoring
    // what is right there. Only a function with no arguments starts blank.
    //
    // The schema written here is the one those fields SERIALIZE TO, not an empty
    // scaffold to be filled in a second write. Writing `{}` first and the fields after
    // is two states in one tick, and the schema watcher re-seeding from whichever it
    // observed left the rows empty under a correct-looking schema.
    const seeded = fieldsFromArgs(readArgs() ?? {})
    if (seeded.length) {
      const text = serializeSchema(seeded, kept.value)
      pushedSchema = text
      schema.value = text
      fields.value = seeded
      expanded.value = new Set()
      return
    }

    // No arguments to start from: an empty schema and one blank row. This one CANNOT
    // be written as "the schema the fields serialize to" — a nameless field serializes
    // to no property at all, so the row would vanish the moment anything re-parsed it.
    // `pushedSchema` is what keeps the two apart until the reader names it.
    const text = JSON.stringify(EMPTY_SCHEMA, null, 2)
    pushedSchema = text
    schema.value = text
    appendField()
  }

  /**
   * Drop the form. The DEFAULTS STAY: they are `default_args`, which the function keeps
   * either way, and deleting a reader's argument values because they removed the form
   * over them would be the destructive reading of a button that says "Remove form".
   */
  const removeForm = () => {
    // Schema first, rows second: the rows watcher reads `schema` to decide whether there
    // is a form to write at all, so it has to see the removal before it sees the rows go.
    schema.value = ''
    fields.value = []
    schemaError.value = ''
    kept.value = { extras: {}, extraRequired: [] }
  }

  /**
   * Push one blank row and put the cursor in its name.
   *
   * The append itself, with no opinion about whether there is a document to append to —
   * that is `addField`'s question, and asking it here would not work anyway: `schema` is
   * a model, so the seeding write in `startForm` is not readable back on the same tick.
   */
  const appendField = async () => {
    const field = blankField()
    fields.value.push(field)
    open(field.id)
    await nextTick()
    globalThis.document?.getElementById(`${props.testId}-key-${field.id}`)?.focus()
  }

  /**
   * The header's `Add field` — the one that is on screen in every state, including the
   * no-form state where the empty state offers its own.
   *
   * WITH NO DOCUMENT IT HAS TO START ONE. A row appended over an empty schema is never
   * written: the rows watcher refuses to serialize over one (that is what keeps `Remove
   * form` removed), so the field would be named, typed and marked required while
   * `azion_form` stayed empty and the save posted nothing. Two buttons carrying one
   * label, in one state, do one thing.
   */
  const addField = () => (schema.value.trim() ? appendField() : startForm())

  const removeField = (index) => {
    const [removed] = fields.value.splice(index, 1)
    if (!removed) return
    const next = new Set(expanded.value)
    next.delete(removed.id)
    expanded.value = next
  }

  const duplicateField = (index) => {
    const source = fields.value[index]
    if (!source) return
    // A copy is a copy of everything EXCEPT the name, which has to be unique — so the
    // one thing the reader must change is the one thing left blank and focused.
    const copy = { ...blankField(), ...source, id: blankField().id, key: '' }
    fields.value.splice(index + 1, 0, copy)
    open(copy.id)
  }

  /**
   * Changing a row's type clears the constraints the old type owned. Keeping them would
   * mean a Text field's `minLength` riding invisibly on an Integer field and reappearing
   * if the reader switched back — a value in the document that no control on screen shows.
   */
  const onTypeChange = (field) => {
    const blank = blankField()
    for (const constraint of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum']) {
      field[constraint] = blank[constraint]
    }
    if (field.type !== 'select') field.options = []
    if (field.type === 'boolean') field.default = false
    else if (field.type === 'array') field.default = []
    else if (typeof field.default !== 'string') field.default = ''
  }

  // Options and list defaults are edited as ONE PER LINE rather than as a nested
  // repeater of single-value rows: the values are short, the reader usually has them
  // already, and a textarea is the control that lets them paste the lot.
  const linesToList = (text) =>
    String(text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

  const listToLines = (list) => (Array.isArray(list) ? list.join('\n') : '')

  const { canMove, isDragging, isDropTarget, onDragStart, onDragEnter, onDragEnd, drop, move } =
    useDragReorder(() => fields.value, { enabled: () => !locked.value })

  const summary = (field) => {
    if (field.raw) return 'Edited in the schema'
    const parts = [fieldTypeLabel(field.type)]
    if (field.type === 'array') {
      parts[0] = `List of ${ITEM_TYPES.find((item) => item.value === field.itemType)?.label ?? field.itemType}`
    }
    return parts.join(' · ')
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <!-- ONE SURFACE, ALWAYS. There is no separate "no form yet" screen in front of this
         one: a function with no form is a form with no fields, and the right pane's own
         empty state says so without spending the whole surface on saying it. The left
         pane still shows the schema — the clean, empty structure — so the reader can see
         the shape they are about to fill either way. -->
    <div
      class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
    >
      <span class="text-label-sm text-(--text-muted)">
        {{ fields.length }} {{ fields.length === 1 ? 'field' : 'fields' }}
      </span>

      <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
        <Button
          label="Add field"
          kind="outlined"
          size="medium"
          icon="pi pi-plus"
          :disabled="locked"
          :data-testid="`${testId}-add-field`"
          @click="addField"
        />
        <Button
          label="Remove form"
          kind="outlined"
          size="medium"
          icon="pi pi-times"
          :disabled="disabled"
          :data-testid="`${testId}-remove-form`"
          @click="removeForm"
        />
      </div>
    </div>

    <!-- THE TWO SURFACES, SIDE BY SIDE — one group, a movable edge between them.
           Building a field WRITES the JSON on the left as it is typed, so the reader
           sees the document they are producing instead of switching to go and check on
           it. Same document, two views, both live. -->
    <ResizablePanel
      class="min-h-0 flex-1 overflow-hidden"
      aria-label="Argument form"
    >
      <!-- LEFT: the schema itself. Sized rather than flexible, because it is the
             narrower read of the two — you glance at it while your hands are on the
             right. `collapsible` for the reader who wants only the fields. -->
      <ResizablePanelPane
        v-model:basis="schemaWidth"
        v-model:collapsed="schemaCollapsed"
        collapsible
        :min="280"
        :max="720"
        aria-label="Schema"
        class="bg-(--bg-surface)"
      >
        <MonacoEditor
          v-model="schemaText"
          fill
          flush
          pad-line-numbers
          size="small"
          language="json"
          path="function.form.json"
          :json-schema="FORM_JSON_SCHEMA"
          :invalid="!!schemaError"
          :disabled="disabled"
          aria-label="Argument form schema, as JSON"
          :data-testid="`${testId}-schema`"
        />
      </ResizablePanelPane>

      <ResizablePanelHandle aria-label="Resize the schema" />

      <!-- RIGHT: the fields. The flexible pane, so it absorbs whatever the schema
             leaves, and its column is held to the form measure inside that. -->
      <ResizablePanelPane aria-label="Fields">
        <!-- THE EMPTY STATE IS THE PANE, not a block inside its scroll column. Left in
               that column it sized to its own content — 310px inside a 676px pane —
               because the column is `auto` until there is something to scroll, so nothing
               below it had a height to grow into. As a direct flex child of the pane it
               has the pane's height, and it needs no scroller of its own: there is
               nothing here to scroll. -->
        <div
          v-if="fields.length === 0 && !schemaError"
          class="flex min-h-0 flex-1 p-(--spacing-sm)"
        >
          <EmptyState
            bordered
            icon="pi pi-plus-circle"
            title="This form has no fields"
            description="Add the first argument the function reads."
            class="min-h-0 flex-1"
          >
            <template #actions>
              <!-- SECONDARY: the reader is not required to build a form, and a primary
                     button here would read as the page's main business. -->
              <Button
                label="Add field"
                kind="secondary"
                size="medium"
                icon="pi pi-plus"
                :disabled="disabled"
                :data-testid="`${testId}-add-first-field`"
                @click="startForm"
              />
              <Link
                label="Read about function arguments"
                size="medium"
                href="https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/"
                target="_blank"
              />
            </template>
          </EmptyState>
        </div>

        <!-- THE SCROLLER CLEARS THE SAVE BAR. The page's bar floats over the bottom
               of this pane the moment anything is edited, and a scroll region ends at
               its own bottom edge — so without this the last field's controls sit under
               the card with no way to scroll them out from under it, for exactly as long
               as there are unsaved changes. The bar publishes its own footprint
               (../form/SettingsSaveBar.vue); this adds it to the pane's bottom padding,
               and it is `0rem` on a page that raises no bar. -->
        <div
          v-else
          class="min-h-0 flex-1 overflow-auto p-(--spacing-sm) pb-[calc(var(--spacing-sm)+var(--save-bar-inset,0rem))]"
        >
          <div class="layout-column-form mx-auto flex min-w-0 flex-col gap-(--spacing-sm)">
            <!-- SAID ONCE, AND SAID HERE. This is the pane the trouble has consequences in
                   (the fields it describes are locked), so this is where the sentence goes;
                   the editor no longer repeats it under itself, where the same words in a
                   second place read as a second problem. Monaco still marks the spot in the
                   text, which is the one thing this cannot do. -->
            <Message
              v-if="schemaMessage"
              severity="warning"
              :label="schemaMessage"
              :data-testid="`${testId}-schema-message`"
            />

            <!-- THE FIELDS ARE AN ITEMGROUP — one flush `CardBox` whose `Item.List`
                   draws the dividers, one `Item` per argument. This is the console's
                   settings anatomy (/webkit-form Approach A), so a function's arguments
                   read the same way as every other list of configured things.
                   Each `Item` is `flex-col`: the summary row, then the argument's own
                   settings under it. The drag attributes ride on the `Item` itself and
                   NOT on a wrapper — `Item.List` draws its dividers with a DIRECT-child
                   selector (`[&>[data-slot=item]]`), so a `<div>` around each row would
                   silently take every divider away. -->
            <!-- The rows are rendered whether or not the schema parses: while it does not,
                   they are the last ones it described, kept on screen and locked rather than
                   blanked. The reader mid-keystroke needs to see what they had. -->
            <CardBox
              v-if="fields.length"
              :padded="false"
            >
              <template #content>
                <Item.List>
                  <!-- ADDING AND REMOVING A FIELD ARE HEIGHT MOVES. The row eases its
                         own height open and shut (../../lib/behavior/list-morph.js), so a
                         remove reads as that card closing rather than as the list jumping
                         up by however tall it happened to be.
                         The group has to sit INSIDE `Item.List` — the rows still need the
                         context it provides — which puts a wrapper between the list and
                         its rows, so the three divider utilities `Item.List` targets at
                         its direct children are restated here on the element that is now
                         their parent. `relative` is the morph preset's own requirement. -->
                  <TransitionGroup
                    tag="div"
                    v-bind="MORPH_COLLAPSE"
                    class="relative flex w-full flex-col *:data-[slot=item]:rounded-none *:data-[slot=item]:border-b-(--border-muted) [&>[data-slot=item]:last-child]:border-b-transparent"
                  >
                    <!-- `flex-nowrap` is REQUIRED, not decoration: `Item`'s own base
                         class is `flex w-full flex-wrap`, and `flex-col` + `flex-wrap`
                         wraps into COLUMNS — the `w-full` summary row and the settings
                         under it end up side by side, overlapping, and the summary row
                         then swallows every click meant for a control below it. -->
                    <!-- `px-0!` — THE CARD HOLDS NO INLINE PADDING OF ITS OWN, and the
                         two things inside it pad themselves instead. That is what makes
                         the settings dividers reach the card's edges; the note on the
                         settings list below says why the negative margin that used to do
                         it could not. `!` because `Item`'s own padding is a compound
                         variant (`:not([data-kind=inline])` + `[data-size=small]`) and
                         outranks a plain `px-0`. -->
                    <Item
                      v-for="(field, index) in fields"
                      :key="field.id"
                      size="small"
                      data-drag-row
                      :data-dragging="isDragging(index) || null"
                      :data-drop="isDropTarget(index) || null"
                      :class="['flex-col flex-nowrap items-stretch gap-0 px-0!', DRAG_ROW_CLASS]"
                      @dragenter.prevent="onDragEnter(index)"
                      @dragover.prevent
                      @drop="drop(index)"
                    >
                      <!-- THE SUMMARY ROW. The grip, the argument's name and type, and
                           the controls that act on the whole row. Every control here is
                           a sibling of the others — none is nested inside another, which
                           a row-wide disclosure button would have forced. -->
                      <div
                        class="flex w-full min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md)"
                      >
                        <div
                          :class="[GRIP_CLASS, 'size-6']"
                          :draggable="canMove(index) && !locked"
                          :aria-disabled="!canMove(index) || locked || undefined"
                          role="button"
                          tabindex="0"
                          :aria-label="`Reorder ${field.key || 'this field'}`"
                          @dragstart="onDragStart(index, $event)"
                          @dragend="onDragEnd"
                          @keydown.up.prevent="move(index, -1)"
                          @keydown.down.prevent="move(index, 1)"
                        >
                          <i
                            class="pi pi-bars text-label-sm"
                            aria-hidden="true"
                          />
                        </div>

                        <!-- NAME AND TYPE ON ONE LINE. `Item.Content` stacks its title
                             over its description, which is right for a settings row whose
                             description is a sentence. Here the description is two words
                             naming the type, and stacking it turned every collapsed row
                             into two lines of mostly air. -->
                        <Item.Content class="min-w-0 flex-row items-baseline gap-(--spacing-xs)">
                          <Item.Title
                            class="truncate font-code text-label-code-sm"
                            :class="field.key ? '' : 'text-(--text-muted)'"
                          >
                            {{ field.key || 'Unnamed field' }}
                          </Item.Title>
                          <Item.Description class="shrink-0">{{ summary(field) }}</Item.Description>
                        </Item.Content>

                        <!-- `--spacing-xs`, not `xxs`: at 4px the tag and the three
                             icon buttons read as one undifferentiated block, with the
                             buttons' outlines all but touching. -->
                        <Item.Actions class="shrink-0 gap-(--spacing-xs)">
                          <Tag
                            v-if="field.required"
                            key="required"
                            label="Required"
                            severity="info"
                            size="small"
                          />
                          <Tag
                            v-if="visibleError(field)"
                            key="invalid"
                            label="Needs a name"
                            severity="warning"
                            size="small"
                          />
                          <Tooltip text="Duplicate this field">
                            <IconButton
                              icon="pi pi-clone"
                              kind="outlined"
                              size="small"
                              :disabled="locked || !!field.raw"
                              :aria-label="`Duplicate ${field.key || 'this field'}`"
                              @click="duplicateField(index)"
                            />
                          </Tooltip>
                          <Tooltip text="Remove this field">
                            <IconButton
                              icon="pi pi-trash"
                              kind="outlined"
                              size="small"
                              :disabled="locked"
                              :aria-label="`Remove ${field.key || 'this field'}`"
                              :data-testid="`${testId}-remove-${index}`"
                              @click="removeField(index)"
                            />
                          </Tooltip>
                          <IconButton
                            :icon="isExpanded(field.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                            kind="outlined"
                            size="small"
                            :aria-expanded="isExpanded(field.id)"
                            :aria-controls="`${testId}-body-${field.id}`"
                            :aria-label="`${isExpanded(field.id) ? 'Hide' : 'Show'} the settings for ${field.key || 'this field'}`"
                            :data-testid="`${testId}-toggle-${index}`"
                            @click="toggle(field.id)"
                          />
                        </Item.Actions>
                      </div>

                      <!-- THE ARGUMENT'S OWN SETTINGS — a nested `Item.List`, so each
                           setting is the same divided row anatomy as the argument above
                           it: name and guidance on the left (`Item.Title` IS the label,
                           so the control carries an `aria-label`), the control on the
                           right (../form/FieldRow.vue).
                           `grid-template-rows: 0fr → 1fr` is the tokens-only way to
                           transition to a height nobody measured, so the row keeps its
                           natural height at rest. -->
                      <div
                        :id="`${testId}-body-${field.id}`"
                        class="grid transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                        :class="isExpanded(field.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                      >
                        <div class="overflow-hidden">
                          <!-- A property the rows cannot draw. Shown, named, left alone. -->
                          <!-- `mx`, because the card no longer pads: everything in this
                               wrapper is full bleed unless it says otherwise. -->
                          <Message
                            v-if="field.raw"
                            severity="info"
                            class="mx-(--spacing-md) mt-(--spacing-xs)"
                            :label="`\`${field.key}\` uses JSON Schema this builder does not draw as a row. It is kept exactly as written, and edited in the schema.`"
                          />

                          <!-- FULL-BLEED RULES, ALIGNED CONTENT — AND NOT BY A NEGATIVE
                               MARGIN. The settings list has to reach the card's edges so
                               its rules run the full width like every other ItemGroup
                               divider, while each row keeps its OWN padding so its label
                               lands on the summary row's column.
                               It used to do that by pulling itself out of the card's
                               padding with `-mx-(--spacing-md)`, which CANNOT work here:
                               the disclosure above transitions `grid-template-rows`, so
                               it wraps this in an `overflow-hidden` box — which clips
                               back exactly the 16px the list overflows by. Measured: the
                               list laid out at the card's edges (738→1426) inside a
                               wrapper clipping at 754→1410, so every divider was cut 16px
                               short on both sides and the focus ring of the control on
                               the right was sliced off down its outer edge. The fix was
                               invisible to `getBoundingClientRect` and visible on screen
                               as the bug it was meant to fix.
                               So the padding is gone from the CARD instead (`px-0!`
                               above) and the two things inside it pay their own. Nothing
                               overflows the wrapper, so nothing is clipped. -->
                          <Item.List
                            v-else
                            class="mt-(--spacing-xs) border-t border-(--border-muted)"
                          >
                            <FieldRow
                              title="Name"
                              description="The key in the arguments object, and what the function reads."
                              :message="visibleError(field)"
                              message-kind="required"
                            >
                              <template #default="{ messageId }">
                                <InputText
                                  :id="`${testId}-key-${field.id}`"
                                  v-model="field.key"
                                  size="medium"
                                  placeholder="cookie_name"
                                  autocomplete="off"
                                  spellcheck="false"
                                  class="w-full font-code"
                                  aria-label="Name"
                                  :invalid="!!visibleError(field)"
                                  :aria-describedby="messageId"
                                  :disabled="locked"
                                  @blur="touch(field.id)"
                                />
                              </template>
                            </FieldRow>

                            <FieldRow
                              title="Type"
                              description="What the field accepts, and the control the form renders."
                            >
                              <Select
                                v-model="field.type"
                                size="medium"
                                class="w-full"
                                :disabled="locked"
                                :display-value="(value) => fieldTypeLabel(value)"
                                @update:model-value="onTypeChange(field)"
                              >
                                <Select.Trigger aria-label="Type" />
                                <Select.Content>
                                  <Select.Option
                                    v-for="option in FIELD_TYPES"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                            </FieldRow>

                            <FieldRow
                              title="Label"
                              description="How the field is named in the form. Falls back to the key."
                            >
                              <InputText
                                v-model="field.title"
                                size="medium"
                                :placeholder="field.key || 'Max Age (seconds)'"
                                autocomplete="off"
                                class="w-full"
                                aria-label="Label"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              title="Description"
                              description="The guidance under the field."
                            >
                              <InputText
                                v-model="field.description"
                                size="medium"
                                placeholder="What this argument does"
                                autocomplete="off"
                                class="w-full"
                                aria-label="Description"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              title="Required"
                              description="The form refuses to save without it."
                              kind="compact"
                            >
                              <Switch
                                v-model="field.required"
                                aria-label="Required"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              title="Default"
                              description="Seeds default_args, and what an instance starts from."
                              :kind="
                                field.type === 'boolean'
                                  ? 'compact'
                                  : field.type === 'array'
                                    ? 'wide'
                                    : 'field'
                              "
                            >
                              <Switch
                                v-if="field.type === 'boolean'"
                                v-model="field.default"
                                aria-label="Default"
                                :disabled="locked"
                              />
                              <Select
                                v-else-if="field.type === 'select'"
                                v-model="field.default"
                                size="medium"
                                class="w-full"
                                placeholder="No default"
                                :disabled="locked || field.options.length === 0"
                              >
                                <Select.Trigger aria-label="Default" />
                                <Select.Content>
                                  <Select.Option
                                    v-for="option in field.options"
                                    :key="option"
                                    :value="option"
                                  >
                                    {{ option }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                              <Textarea
                                v-else-if="field.type === 'array'"
                                :model-value="listToLines(field.default)"
                                :rows="3"
                                placeholder="One value per line"
                                class="w-full font-code"
                                aria-label="Default"
                                :disabled="locked"
                                @update:model-value="field.default = linesToList($event)"
                              />
                              <!-- A number's default is a TEXT input, not an InputNumber:
                                   `InputNumber` is always numeric and falls back to
                                   `min ?? 0` when cleared, so it cannot express "this
                                   field has no default" — a different document from one
                                   whose default is `0`. -->
                              <InputText
                                v-else
                                v-model="field.default"
                                size="medium"
                                :inputmode="
                                  field.type === 'integer' || field.type === 'number'
                                    ? 'numeric'
                                    : undefined
                                "
                                placeholder="No default"
                                autocomplete="off"
                                class="w-full font-code"
                                aria-label="Default"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <!-- THE CONSTRAINTS. Only the ones this type actually writes
                                 — a constraint on screen that the schema would drop is a
                                 lie. -->
                            <FieldRow
                              v-if="field.type === 'string'"
                              key="min-length"
                              title="Minimum length"
                            >
                              <InputText
                                v-model="field.minLength"
                                size="medium"
                                inputmode="numeric"
                                placeholder="No minimum"
                                class="w-full"
                                aria-label="Minimum length"
                                :disabled="locked"
                              />
                            </FieldRow>
                            <FieldRow
                              v-if="field.type === 'string'"
                              key="max-length"
                              title="Maximum length"
                            >
                              <InputText
                                v-model="field.maxLength"
                                size="medium"
                                inputmode="numeric"
                                placeholder="No maximum"
                                class="w-full"
                                aria-label="Maximum length"
                                :disabled="locked"
                              />
                            </FieldRow>
                            <FieldRow
                              v-if="field.type === 'string'"
                              key="pattern"
                              title="Pattern"
                              description="A regular expression the value has to match."
                              kind="wide"
                            >
                              <InputText
                                v-model="field.pattern"
                                size="medium"
                                placeholder="^[a-z0-9_-]+$"
                                autocomplete="off"
                                spellcheck="false"
                                class="w-full font-code"
                                aria-label="Pattern"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              v-if="field.type === 'integer' || field.type === 'number'"
                              key="minimum"
                              title="Minimum"
                            >
                              <InputText
                                v-model="field.minimum"
                                size="medium"
                                inputmode="numeric"
                                placeholder="No minimum"
                                class="w-full"
                                aria-label="Minimum"
                                :disabled="locked"
                              />
                            </FieldRow>
                            <FieldRow
                              v-if="field.type === 'integer' || field.type === 'number'"
                              key="maximum"
                              title="Maximum"
                            >
                              <InputText
                                v-model="field.maximum"
                                size="medium"
                                inputmode="numeric"
                                placeholder="No maximum"
                                class="w-full"
                                aria-label="Maximum"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              v-if="field.type === 'select'"
                              key="choices"
                              title="Choices"
                              description="One per line. These are the values the form offers."
                              kind="wide"
                            >
                              <Textarea
                                :model-value="listToLines(field.options)"
                                :rows="3"
                                placeholder="webp&#10;avif&#10;jpeg"
                                class="w-full font-code"
                                aria-label="Choices"
                                :disabled="locked"
                                @update:model-value="field.options = linesToList($event)"
                              />
                            </FieldRow>

                            <FieldRow
                              v-if="field.type === 'array'"
                              key="item-type"
                              title="List of"
                              description="The type of every value in the list."
                            >
                              <Select
                                v-model="field.itemType"
                                size="medium"
                                class="w-full"
                                :disabled="locked"
                                :display-value="
                                  (value) =>
                                    ITEM_TYPES.find((item) => item.value === value)?.label ?? value
                                "
                              >
                                <Select.Trigger aria-label="List of" />
                                <Select.Content>
                                  <Select.Option
                                    v-for="option in ITEM_TYPES"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                            </FieldRow>
                          </Item.List>
                        </div>
                      </div>
                    </Item>
                  </TransitionGroup>
                </Item.List>
              </template>
            </CardBox>
          </div>
        </div>
      </ResizablePanelPane>
    </ResizablePanel>
  </div>
</template>
