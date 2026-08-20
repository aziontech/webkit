<script setup>
  // Create Table — the SQL Database "add table" flow, in a LARGE right Drawer.
  //
  // FIELDS ARE SEPARATED, the same shape the Variables drawer uses
  // (./AddVariableDrawer.vue via ./ui/FieldStack.vue): a real `<Label for>` over a
  // full-width control, with the field's own message under it. The band says once, in
  // its `Section` hint, what a per-row `Item.Description` used to repeat — and the name
  // is a label the reader can click instead of text sitting beside an `aria-label`.
  //
  // Only COLUMNS keeps a card, because it is not a set of fields: it is a grid whose
  // header row names its tracks and whose rows are reorderable. Boxing that is what
  // separates it from the fields above; boxing a single text input was not.
  //
  // Columns repeater: add / REMOVE / REORDER. Reordering is native drag-and-drop
  // (no library, per dependencies.md) driven by a grip handle, mirroring
  // CreateRuleDrawer — the grip is the only draggable element so the inputs stay
  // interactive, the row is the drop zone, and arrow keys on a focused grip
  // reorder without a pointer (keyboard a11y). A TransitionGroup FLIPs the rows on
  // every add / remove / move. Validation on submit only; one `submitting` flag
  // locks the whole scope.
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Checkbox from '@aziontech/webkit/checkbox'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import FieldStack from '../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import Section from '../../components/page/Section.vue'
  import { filterTypes, glyphOf, typeLabel } from '../../lib/format/postgres-types'

  const open = defineModel('open', { type: Boolean, default: false })
  const emit = defineEmits(['created'])

  // Searchable Postgres type picker — the Select.Content #search slot filters the
  // shared catalog (src/lib/postgres-types.js).
  const typeQuery = ref('')
  const filteredTypes = computed(() => filterTypes(typeQuery.value))

  // Stable keys for repeater rows (order-independent).
  let nextId = 0
  const uid = () => (nextId += 1)

  const newColumn = (name = '', type = 'text', primaryKey = false, defaultValue = '') => ({
    id: uid(),
    name,
    type,
    primaryKey,
    defaultValue
  })

  const blankForm = () => ({
    name: '',
    columns: [
      newColumn('id', 'int8', true, ''),
      newColumn('created_at', 'timestamptz', false, 'now()')
    ]
  })

  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)

  const nameError = computed(() => submitted.value && !form.name.trim())
  const namedColumns = computed(() => form.columns.filter((column) => column.name.trim()))
  const columnsError = computed(() => submitted.value && namedColumns.value.length === 0)

  watch(open, (isOpen) => {
    if (isOpen) return
    Object.assign(form, blankForm())
    submitted.value = false
  })

  // Morph the repeater lines when they add / remove / reorder (same tokens as
  // CreateRuleDrawer — timing comes from the animate tokens, never hardcoded).
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
      'transition-transform duration-(--tg-move-duration) ease-(--tg-move-ease) motion-reduce:transition-none',
    enterActiveClass:
      'transition-all duration-(--tg-enter-duration) ease-(--tg-enter-ease) motion-reduce:transition-none',
    enterFromClass: '-translate-y-(--spacing-xxs) opacity-0',
    leaveActiveClass:
      'transition-opacity duration-(--tg-leave-duration) ease-(--tg-leave-ease) motion-reduce:transition-none',
    leaveToClass: 'opacity-0'
  }

  // ── Columns repeater: add / remove / reorder ──
  const addColumn = () => form.columns.push(newColumn())
  const removeColumn = (index) => {
    if (form.columns.length <= 1) return // keep at least one column
    form.columns.splice(index, 1)
  }
  const moveColumn = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= form.columns.length) return
    const [moved] = form.columns.splice(index, 1)
    form.columns.splice(target, 0, moved)
  }

  // ── Native drag-and-drop reorder (no library, per dependencies.md) ──
  // Only the grip is draggable, so the row's inputs stay interactive; the row is
  // the drop zone. Reordering splices the array, so the TransitionGroup morph plays.
  const dnd = reactive({ from: -1, over: -1 })

  const GRIP_CLASS =
    'inline-flex shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) ' +
    'text-(--text-muted) outline-none transition-colors hover:bg-(--bg-hover) hover:text-(--text-default) ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing motion-reduce:transition-none'

  const dragRowClass =
    'relative rounded-(--shape-card) transition-[opacity,transform,outline-color] ' +
    'data-dragging:opacity-70 data-dragging:scale-[0.98] data-dragging:outline-dashed data-dragging:outline-2 data-dragging:outline-(--accent) ' +
    "data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-0 data-drop:before:-top-(--spacing-xxs) data-drop:before:border-t-2 data-drop:before:border-(--accent) data-drop:before:content-['']"

  const isDragging = (index) => dnd.from === index
  const isDropTarget = (index) => dnd.over === index && dnd.from !== index

  const onDragStart = (index, event) => {
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      const row = event.currentTarget?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 12, 12)
    }
  }
  const onDragEnter = (index) => {
    dnd.over = index
  }
  const onDragEnd = () => {
    dnd.from = -1
    dnd.over = -1
  }
  const dropOnColumn = (index) => {
    const { from } = dnd
    if (from < 0 || from === index || from >= form.columns.length || index >= form.columns.length) {
      onDragEnd()
      return
    }
    const [moved] = form.columns.splice(from, 1)
    form.columns.splice(index, 0, moved)
    onDragEnd()
  }

  // ── Foreign keys (demo affordance only) ──
  const addForeignKey = () =>
    toast.info('Add foreign key relation', { description: 'Not available in this demo.' })
  const importCsv = () =>
    toast.info('Import data from CSV', { description: 'Not available in this demo.' })

  const isValid = () => !!form.name.trim() && namedColumns.value.length > 0

  const submit = async () => {
    submitted.value = true
    if (submitting.value) return
    if (!isValid()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const name = form.name.trim()
      emit('created', {
        id: `tbl-${uid()}`,
        name,
        columns: namedColumns.value.map((column) => ({
          id: `col-${uid()}`,
          name: column.name.trim(),
          type: column.type,
          primaryKey: column.primaryKey,
          notNull: column.primaryKey
        }))
      })
      toast.success(`Table "${name}" created.`)
      open.value = false
    } catch (error) {
      toast.error('Could not create the table.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }

  // One grid template shared by the columns header row and each column row, so
  // their tracks line up: grip · Name · Type · Default Value · Primary · remove.
  const COLUMN_GRID =
    'grid grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_auto] items-center gap-(--spacing-xs)'
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    size="large"
    title="Create table"
    description="Define the table name and its columns. Drag the grip to reorder columns."
    save-label="Create table"
    :submitting="submitting"
    @submit="submit"
  >
    <!-- Section: General -->
    <Section
      stacked
      :divided="false"
      title="General"
      hint="Names the table inside this database. It is what every query addresses, so it cannot be changed later without rewriting them."
    >
      <FieldStack
        label="Name"
        :message="nameError ? 'Name is required.' : ''"
        message-kind="required"
      >
        <template #default="{ controlId, describedBy }">
          <InputText
            :id="controlId"
            v-model="form.name"
            size="large"
            class="w-full font-code"
            placeholder="users"
            :disabled="submitting"
            :required="nameError"
            :aria-describedby="describedBy"
          />
        </template>
      </FieldStack>
    </Section>

    <!-- Section: Columns (drag-and-drop repeater) -->
    <Section
      stacked
      :divided="false"
      title="Columns"
      hint="The table's schema. Every table needs at least one column, and the order here is the order the columns are created in."
    >
      <template #aside>
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <Button
            type="button"
            label="About data types"
            kind="outlined"
            size="small"
            icon="pi pi-external-link"
            href="https://www.azion.com/en/documentation/products/store/edge-sql/"
            target="_blank"
          />
          <Button
            type="button"
            label="Import data from CSV"
            kind="outlined"
            size="small"
            icon="pi pi-upload"
            :disabled="submitting"
            @click="importCsv"
          />
        </div>
      </template>

      <CardBox :padded="false">
        <template #content>
          <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
            <!-- Column headers aligned to the row grid. -->
            <div :class="[COLUMN_GRID, 'px-(--spacing-xxs)']">
              <span
                class="size-8"
                aria-hidden="true"
              />
              <span class="text-label-sm text-(--text-muted)">Name</span>
              <span class="text-label-sm text-(--text-muted)">Type</span>
              <span class="text-label-sm text-(--text-muted)">Default Value</span>
              <span class="text-label-sm text-(--text-muted)">Primary</span>
              <span
                class="size-8"
                aria-hidden="true"
              />
            </div>

            <TransitionGroup
              tag="div"
              class="relative flex flex-col gap-(--spacing-xs)"
              v-bind="morphTransition"
              :style="morphStyle"
            >
              <div
                v-for="(column, index) in form.columns"
                :key="column.id"
                data-drag-row
                :data-dragging="isDragging(index) || null"
                :data-drop="isDropTarget(index) || null"
                :class="[COLUMN_GRID, 'px-(--spacing-xxs) py-(--spacing-xxs)', dragRowClass]"
                @dragenter.prevent="onDragEnter(index)"
                @dragover.prevent
                @drop="dropOnColumn(index)"
              >
                <!-- Grip: hold to drag the whole row; arrow keys reorder
                               without a pointer (keyboard a11y). -->
                <span
                  role="button"
                  tabindex="0"
                  aria-label="Drag to reorder column, or use arrow keys"
                  :draggable="form.columns.length > 1"
                  :class="[GRIP_CLASS, 'size-8']"
                  @dragstart="onDragStart(index, $event)"
                  @dragend="onDragEnd"
                  @keydown.up.prevent="moveColumn(index, -1)"
                  @keydown.down.prevent="moveColumn(index, 1)"
                >
                  <i
                    class="pi pi-bars"
                    aria-hidden="true"
                  />
                </span>

                <InputText
                  v-model="column.name"
                  size="large"
                  class="w-full min-w-0 font-code"
                  aria-label="Column name"
                  placeholder="column_name"
                  :disabled="submitting"
                />

                <Select
                  v-model="column.type"
                  size="large"
                  class="w-full min-w-0"
                  :disabled="submitting"
                  :display-value="typeLabel"
                >
                  <Select.Trigger aria-label="Column type">
                    <template #iconLeft>
                      <span
                        class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                        aria-hidden="true"
                      >
                        {{ glyphOf(column.type) }}
                      </span>
                    </template>
                  </Select.Trigger>
                  <!-- z workaround: Select.Content teleports to body at
                                 z-50, behind the Drawer panel (z-[1001]). The
                                 trigger is a narrow grid cell, so widen the panel
                                 (min-w overrides the trigger-matched inline width)
                                 to fit the type descriptions, and raise the panel +
                                 inner options-list max-heights (the list ScrollArea
                                 defaults to max-h-60) so more types show at once. -->
                  <Select.Content
                    class="z-[1002]! min-w-(--container-md) max-h-(--container-md)! [&_[data-testid$='__list']]:max-h-(--container-sm)!"
                  >
                    <!-- Searchable, grouped Postgres data types with a
                                   glyph + description per option. -->
                    <template #search>
                      <InputText
                        v-model="typeQuery"
                        size="medium"
                        class="w-full"
                        placeholder="Search types"
                        aria-label="Search types"
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
                    <Select.Group label="Postgres data types">
                      <Select.Option
                        v-for="type in filteredTypes"
                        :key="type.value"
                        :value="type.value"
                      >
                        <template #left>
                          <span
                            class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                            aria-hidden="true"
                          >
                            {{ type.glyph }}
                          </span>
                        </template>
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <span class="font-code text-label-code-sm text-(--text-default)">
                            {{ type.label }}
                          </span>
                          <span class="truncate text-body-xs text-(--text-muted)">
                            {{ type.description }}
                          </span>
                        </span>
                      </Select.Option>
                    </Select.Group>
                  </Select.Content>
                </Select>

                <InputText
                  v-model="column.defaultValue"
                  size="large"
                  class="w-full min-w-0 font-code"
                  aria-label="Default value"
                  placeholder="NULL"
                  :disabled="submitting"
                />

                <div class="flex items-center justify-center">
                  <Checkbox
                    v-model="column.primaryKey"
                    binary
                    :disabled="submitting"
                    aria-label="Primary key"
                  />
                </div>

                <Tooltip text="Remove column">
                  <IconButton
                    icon="pi pi-times"
                    kind="outlined"
                    size="large"
                    aria-label="Remove column"
                    :disabled="submitting || form.columns.length <= 1"
                    @click="removeColumn(index)"
                  />
                </Tooltip>
              </div>
            </TransitionGroup>

            <HelperText
              v-if="columnsError"
              kind="required"
              label="Add at least one named column."
            />

            <div>
              <Button
                type="button"
                label="Add column"
                kind="outlined"
                size="medium"
                icon="pi pi-plus"
                class="w-full"
                :disabled="submitting"
                @click="addColumn"
              />
            </div>
          </div>
        </template>
      </CardBox>
    </Section>

    <!-- Section: Foreign keys (demo affordance) -->
    <Section
      stacked
      :divided="false"
      title="Foreign keys"
    >
      <CardBox :padded="false">
        <template #content>
          <div class="flex justify-center p-(--spacing-md)">
            <Button
              type="button"
              label="Add foreign key relation"
              kind="outlined"
              size="medium"
              icon="pi pi-link"
              :disabled="submitting"
              @click="addForeignKey"
            />
          </div>
        </template>
      </CardBox>
    </Section>
  </ResourceDrawer>
</template>
