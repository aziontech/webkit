<script setup>
  // Create Rule — the Rules Engine create, in a LARGE Drawer.
  //
  // FIELDS ARE SEPARATED, the same shape the Variables drawer uses
  // (./AddVariableDrawer.vue via ./ui/FieldStack.vue): a real `<Label for>` over a
  // full-width control, the field's own message under it, and the band's guidance said
  // ONCE in its `Section` hint instead of repeated under every row. A rule's name and
  // description are typed, not scanned, so a 256px control pinned to the right of a
  // sentence describing it was the settings shape on a create form.
  //
  // The three richer bands keep their cards, because none of them is a set of fields:
  // Phase is a pair of radio blocks that carry their own descriptions, and Criteria and
  // Behaviors are repeaters whose card is what separates them from the fields above.
  //
  // Repeater logic: Criteria conditions (joined And/Or, grouped) and Behaviors are
  // each add / REMOVE / REORDER (move up/down — no drag lib, per dependencies.md).
  // Row controls are size="large" to keep the horizontal rhythm with the large
  // fields. Validation on submit only; one `submitting` flag locks the scope.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import FieldStack from '../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import Section from '../../components/page/Section.vue'
  import { useAnimatedHeight } from '../../lib/behavior/animate-height.js'
  import { MORPH_COLLAPSE } from '../../lib/behavior/list-morph'
  import {
    behaviorAllowedIn,
    behaviorArgument,
    behaviorArgumentNote,
    behaviorLabel,
    behaviorOptions,
    behaviorsFor,
    isTerminalBehavior,
    operatorLabel,
    OPERATORS,
    takesArgument
  } from '../../lib/data/rules-engine'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    // The rule being EDITED, or null to create one. The same drawer does both: a
    // rule's anatomy is the same whether it is being written or corrected, and a
    // second read-only surface for it would be a third place the criteria repeater
    // has to be kept in step with.
    rule: { type: Object, default: null }
  })

  const emit = defineEmits(['created', 'updated'])

  const editing = computed(() => Boolean(props.rule))

  // Stable keys for repeater rows (order-independent).
  let nextId = 0
  const uid = () => (nextId += 1)

  const newCondition = (join = null) => ({
    id: uid(),
    join, // null for the first row of a group; 'and' | 'or' otherwise
    variable: '',
    operator: 'is-equal',
    argument: ''
  })
  const newGroup = () => ({ id: uid(), conditions: [newCondition()] })
  const newBehavior = () => ({ id: uid(), type: 'deliver' })

  const blankForm = () => ({
    name: '',
    description: '',
    phase: 'request',
    criteria: [newGroup()],
    behaviors: [newBehavior()],
    active: true
  })

  /**
   * The form a rule opens as. Deep-copied and re-keyed, never the record itself:
   * the repeaters splice their arrays in place, so editing the seed would rewrite
   * the row behind the drawer while the reader is still deciding — including if
   * they cancel.
   */
  const formFor = (rule) =>
    !rule
      ? blankForm()
      : {
          name: rule.name ?? '',
          description: rule.description ?? '',
          phase: rule.phase ?? 'request',
          criteria: (rule.criteria ?? []).length
            ? rule.criteria.map((group) => ({
                id: uid(),
                conditions: group.conditions.map((condition) => ({ ...condition, id: uid() }))
              }))
            : [newGroup()],
          behaviors: (rule.behaviors ?? []).length
            ? rule.behaviors.map((behavior) => ({ ...behavior, id: uid() }))
            : [newBehavior()],
          active: rule.status ? rule.status === 'Active' : (rule.active ?? true)
        }

  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)

  // Morph the repeater lines when they add / remove / reorder — the shared timing
  // (../lib/list-morph.js), so these repeaters and the Rules Engine table glide the
  // same way rather than each carrying their own copy of it.

  const nameError = computed(() => submitted.value && !form.name.trim())
  const totalConditions = computed(() =>
    form.criteria.reduce((sum, group) => sum + group.conditions.length, 0)
  )

  // Seeded on OPEN and reset on close, so the drawer never shows the previous rule
  // for a frame while the new one loads in.
  watch(open, (isOpen) => {
    Object.assign(form, formFor(isOpen ? props.rule : null))
    submitted.value = false
  })

  // ── The two conditional forms ─────────────────────────────────────────────
  //
  // A rule is `if <criteria> then <behaviors>`, and NEITHER half has a fixed set of
  // fields: the operator decides whether a condition has an argument, and the
  // behavior decides what — if anything — the behavior is given. Both answers come
  // from the vocabulary (../../lib/data/rules-engine.js) rather than from a chain of
  // `v-if`s per behavior name, so adding a behavior is a row in the catalog.
  //
  // THE FIELD IS NOT RENDERED, NOT DISABLED. `exists` reads no value and `Deliver`
  // takes none, so their inputs are gone. A control that accepts an answer nothing
  // reads is worse than no control: it is a promise the save quietly breaks.
  //
  // The behaviors a phase offers differ, so changing the phase re-checks every
  // behavior against the new list (see the watch below) instead of leaving a
  // request-only behavior selected on a response rule.
  const behaviorsForPhase = computed(() =>
    behaviorsFor(form.phase).map(({ value, label }) => ({ value, label }))
  )

  // The record a `select` argument lists — read live from the store that owns those
  // records, so a cache policy created in the tab next door is selectable here.
  const optionsFor = (source) => behaviorOptions(source, form.phase)
  const optionLabelIn = (source, value) =>
    optionsFor(source).find((option) => option.value === value)?.label ?? ''

  /**
   * Selecting a behavior REPLACES its argument rather than merging over it: the
   * previous type's keys are dropped, so a rule that was `Redirect (301) → //legacy`
   * and is now `Run Function` does not carry a stale `target` into the save. The row's
   * `id` survives, so the list morph reads it as the same row changing, not a
   * remove-and-add.
   */
  const setBehaviorType = (index, type) => {
    if (form.behaviors[index].type === type) return
    // Through the height animation: the argument region grows and shrinks with the
    // type (Capture Match Groups is three fields tall, Deliver is none), and that is
    // the same kind of change as an add or a remove.
    animateBehaviors(() => {
      form.behaviors[index] = { id: form.behaviors[index].id, type }
    })
  }

  // A behavior whose argument is still blank on submit — amber (not answered yet),
  // the same state the required name and the condition's variable use.
  const argumentMissing = (behavior, field) =>
    submitted.value && !String(behavior[field] ?? '').trim()

  /**
   * `Add behavior` is spent once the last behavior ENDS the rule (Deliver, Deny, a
   * redirect): nothing after it can execute, so offering to write another line is
   * offering to write dead code. Ten is the ceiling the API enforces.
   */
  const canAddBehavior = computed(() => {
    if (form.behaviors.length >= 10) return false
    return !isTerminalBehavior(form.behaviors[form.behaviors.length - 1]?.type)
  })

  // The two ceilings the API enforces: five criteria groups per rule, ten conditions
  // inside one. Held here rather than discovered on save.
  const canAddCriteria = computed(() => form.criteria.length < 5)
  const canAddCondition = (group) => group.conditions.length < 10

  // Changing the phase changes which behaviors exist. Any behavior the new phase does
  // not offer falls back to Deliver — the one behavior both phases have and the only
  // safe default — and a function chosen for the request phase is cleared when the
  // response phase would not offer it (its runtime is not available there).
  watch(
    () => form.phase,
    (phase) => {
      form.behaviors.forEach((behavior, index) => {
        if (!behaviorAllowedIn(behavior.type, phase)) {
          form.behaviors[index] = { id: behavior.id, type: 'deliver' }
          return
        }
        const argument = behaviorArgument(behavior.type)
        if (argument?.kind !== 'select') return
        const stillOffered = behaviorOptions(argument.source, phase).some(
          (option) => option.value === behavior[argument.field]
        )
        if (!stillOffered) behavior[argument.field] = ''
      })
    }
  )

  // ── The two repeater regions ease their own height ──
  //
  // The rows themselves are handled by MORPH_COLLAPSE: a removed row eases its own height
  // in the first frame and its neighbours FLIP up into the space. That fixes the ROWS,
  // and leaves the REGION — everything under the list (the And/Or buttons, the divider,
  // Add Criteria) still jumped the full height of the removed row, in one frame, while
  // the rows above it were still gliding. Two different answers to one edit, which is
  // the glitch.
  //
  // So the section that CONTAINS the list eases its own height across the same change
  // (../lib/animate-height.js — measure, pin, release back to `auto`), and every add and
  // remove is routed through it. Moves are not: a reorder changes no height, and putting
  // it through the measure would cost a `nextTick` for nothing.
  // Criteria needs none of its own: every height change there IS a row arriving or
  // leaving, and the rows now carry that themselves.
  const {
    region: behaviorsRegion,
    height: behaviorsHeight,
    animateHeight: animateBehaviors
  } = useAnimatedHeight()

  // ── Criteria repeater: add / remove / reorder ──
  // No `animateCriteria` around an add or a remove any more: the ROW owns that height
  // now (MORPH_COLLAPSE), and easing the region as well pins it to a measured value while
  // its contents are still moving inside it — the two ease against each other and the
  // region lands before the row does. The region animation stays for the one change that
  // is NOT a row arriving or leaving: a behavior swapping to a type of a different size.
  const addCondition = (group, join) => group.conditions.push(newCondition(join))
  const addCriteria = () => form.criteria.push(newGroup())

  // Reorder whole criteria groups (move up/down — same no-drag-lib pattern as the
  // conditions/behaviors). The first group always reads "If", the rest "Or", and
  // that label is index-driven, so it stays correct after a move.
  const moveCriteria = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= form.criteria.length) return
    const [moved] = form.criteria.splice(index, 1)
    form.criteria.splice(target, 0, moved)
  }

  const removeCondition = (groupIndex, condIndex) => {
    if (totalConditions.value <= 1) return // keep at least one condition overall
    const group = form.criteria[groupIndex]
    group.conditions.splice(condIndex, 1)
    if (group.conditions.length === 0) form.criteria.splice(groupIndex, 1)
    else if (condIndex === 0) group.conditions[0].join = null
  }

  const moveCondition = (groupIndex, condIndex, direction) => {
    const conditions = form.criteria[groupIndex].conditions
    const target = condIndex + direction
    if (target < 0 || target >= conditions.length) return
    const [moved] = conditions.splice(condIndex, 1)
    conditions.splice(target, 0, moved)
    conditions[0].join = null // the first row is always the base condition
  }

  // ── Behaviors repeater: add / remove / reorder ──
  const addBehavior = () => form.behaviors.push(newBehavior())
  const removeBehavior = (index) => {
    if (form.behaviors.length <= 1) return
    form.behaviors.splice(index, 1)
  }
  const moveBehavior = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= form.behaviors.length) return
    const [moved] = form.behaviors.splice(index, 1)
    form.behaviors.splice(target, 0, moved)
  }

  // ── Native drag-and-drop reorder (no library, per dependencies.md) ──
  // A row/group is draggable only while its grip handle is held (mousedown), so
  // the inputs stay interactive; the element itself is the drop zone. Reordering
  // splices the array, so the same TransitionGroup morph plays. `scope` keeps a
  // drag contained to its own list (a condition can't drop into another group).
  // Pointer DnD is desktop/mouse; the move buttons remain for click/keyboard/touch.
  const dnd = reactive({ scope: null, from: -1, over: -1 })

  // The grip handle IS the drag source (IconButton doesn't forward listeners or
  // `draggable`, so the grip is a plain focusable element we control). Only the
  // grip is draggable, so the row's inputs stay fully interactive; the row itself
  // is the drop zone. Sized to match IconButton large (size-10). Arrow keys on a
  // focused grip reorder without a pointer (keyboard a11y).
  const GRIP_CLASS =
    'inline-flex shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) ' +
    'text-(--text-muted) outline-none transition-colors hover:bg-(--bg-hover) hover:text-(--text-default) ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing motion-reduce:transition-none'

  // Row states, keyed off the drag: `dragging` = the lifted source row;
  // `drop` = the row currently under the pointer (where it will land).
  const isDragging = (scope, index) => dnd.scope === scope && dnd.from === index
  const isDropTarget = (scope, index) =>
    dnd.scope === scope && dnd.over === index && dnd.from !== index

  // Base + state classes shared by every draggable row/group. `dragging` = the
  // moved item: dimmed with a DASHED accent border around the whole element (an
  // outline, so no layout shift). `drop` = where the item can be placed: a solid
  // accent line on TOP (a `before` pseudo, so it never shifts layout).
  const dragRowClass =
    'relative rounded-(--shape-card) transition-[opacity,transform,outline-color] ' +
    'data-dragging:opacity-70 data-dragging:scale-[0.98] data-dragging:outline-dashed data-dragging:outline-2 data-dragging:outline-(--accent) ' +
    "data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-0 data-drop:before:-top-(--spacing-xxs) data-drop:before:border-t-2 data-drop:before:border-(--accent) data-drop:before:content-['']"

  const onDragStart = (scope, index, event) => {
    dnd.scope = scope
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index)) // Firefox needs data
      // Show the whole row as the drag image, not just the grip.
      const row = event.currentTarget?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 12, 12)
    }
  }
  const onDragEnter = (scope, index) => {
    if (dnd.scope === scope) dnd.over = index
  }
  const onDragEnd = () => {
    dnd.scope = null
    dnd.from = -1
    dnd.over = -1
  }

  const reorder = (list, from, to) => {
    if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return
    const [moved] = list.splice(from, 1)
    list.splice(to, 0, moved)
  }
  const dropOnCondition = (groupIndex, index) => {
    if (dnd.scope !== 'cond-' + groupIndex) return
    reorder(form.criteria[groupIndex].conditions, dnd.from, index)
    form.criteria[groupIndex].conditions[0].join = null
    onDragEnd()
  }
  const dropOnBehavior = (index) => {
    if (dnd.scope !== 'behavior') return
    reorder(form.behaviors, dnd.from, index)
    onDragEnd()
  }
  const dropOnCriteria = (index) => {
    if (dnd.scope !== 'criteria') return
    reorder(form.criteria, dnd.from, index)
    onDragEnd()
  }

  // Every field the form RENDERS has to be answered — which is the other half of not
  // rendering the ones that are not read: a condition on `exists` has no argument to
  // require, and `Deliver` has no value to be missing.
  const behaviorFilled = (behavior) => {
    const argument = behaviorArgument(behavior.type)
    if (!argument) return true
    const fields = argument.kind === 'group' ? argument.fields : [argument]
    return fields.every(({ field }) => String(behavior[field] ?? '').trim())
  }

  const isValid = () => {
    const okName = !!form.name.trim()
    const okCriteria = form.criteria.every((group) =>
      group.conditions.every((c) => c.variable.trim())
    )
    return okName && okCriteria && form.behaviors.length > 0 && form.behaviors.every(behaviorFilled)
  }

  const submit = async () => {
    submitted.value = true
    if (submitting.value) return
    if (!isValid()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      // The WHOLE record goes up, not just the four display fields: the row the list
      // keeps IS what reopens this drawer, so a save that dropped the repeaters would
      // hand the next edit the rule as it was before this one.
      const record = {
        id: props.rule?.id ?? `rule-${uid()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        phase: form.phase,
        criteria: form.criteria,
        behaviors: form.behaviors,
        status: form.active ? 'Active' : 'Inactive'
      }
      if (editing.value) {
        emit('updated', record)
        toast.success(`Rule "${record.name}" saved.`)
      } else {
        emit('created', record)
        toast.success(`Rule "${record.name}" created.`)
      }
      open.value = false
    } catch (error) {
      toast.error(editing.value ? 'Could not save the rule.' : 'Could not create the rule.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    size="large"
    :title="editing ? 'Edit Rule' : 'Add Rule'"
    description="Handle the conditional execution of behaviors through logical operators."
    save-label="Save"
    :submitting="submitting"
    @submit="submit"
  >
    <!-- Section: General -->
    <Section
      stacked
      :divided="false"
      title="General"
      hint="Names the rule in the list and in the deployment log. The description is for whoever reads this rule next. It never affects what the rule does."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
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
              class="w-full"
              placeholder="My rule"
              :disabled="submitting"
              :required="nameError"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>

        <FieldStack label="Description">
          <template #default="{ controlId }">
            <InputText
              :id="controlId"
              v-model="form.description"
              size="large"
              class="w-full"
              placeholder="Optional"
              :disabled="submitting"
            />
          </template>
        </FieldStack>
      </div>
    </Section>

    <!-- Section: Phase (ItemGroup with radio blocks) -->
    <Section
      stacked
      :divided="false"
      title="Phase"
      hint="When the rule runs. Request rules act on what arrives at the edge; response rules act on what leaves it. The two are separate programs and never interleave."
    >
      <CardBox :padded="false">
        <template #content>
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
            <!-- THE PHASE IS FIXED ONCE THE RULE EXISTS. It is not a preference the rule
                 carries, it is WHICH PROGRAM the rule belongs to: the two phases offer
                 different behaviors, and the watch that guards that falls every behavior
                 the new phase does not offer back to Deliver. On a rule being written
                 that is a correction the reader is making as they go; on a rule that
                 already runs it would silently empty the thing they opened to edit.
                 So the switch is offered on create and locked afterwards — moving a rule
                 to the other phase is writing the rule that belongs there. -->
            <div class="flex flex-col gap-(--spacing-xs)">
              <FieldRadioBlock
                v-model="form.phase"
                value="request"
                name="rule-phase"
                input-id="rule-phase-request"
                label="Request Phase"
                description="Configure the requests made to the edge."
                :disabled="submitting || editing"
              />
              <FieldRadioBlock
                v-model="form.phase"
                value="response"
                name="rule-phase"
                input-id="rule-phase-response"
                label="Response Phase"
                description="Configure the responses delivered to end-users."
                :disabled="submitting || editing"
              />
              <!-- The disabled state says WHY, and what to do instead — the one case
                   /webkit-form keeps `kind="disabled"` for: a persistent lock whose
                   reason is not obvious from the control. -->
              <HelperText
                v-if="editing"
                kind="disabled"
                label="A rule's phase is set when it is created. Create a rule in the other phase to run these behaviors there."
              />
            </div>
          </div>
        </template>
      </CardBox>
    </Section>

    <!-- Section: Criteria (ItemGroup with condition repeater) -->
    <Section
      stacked
      :divided="false"
      title="Criteria"
      hint="The conditions that decide whether the rule runs. Add a variable, the comparison operator and, if the operator takes one, an argument."
    >
      <CardBox :padded="false">
        <template #content>
          <div>
            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
              <TransitionGroup
                tag="div"
                class="relative flex flex-col gap-(--spacing-lg)"
                v-bind="MORPH_COLLAPSE"
              >
                <div
                  v-for="(group, gIdx) in form.criteria"
                  :key="group.id"
                  data-drag-row
                  :data-dragging="isDragging('criteria', gIdx) || null"
                  :data-drop="isDropTarget('criteria', gIdx) || null"
                  :class="['flex flex-col gap-(--spacing-sm)', dragRowClass]"
                  @dragenter.prevent="onDragEnter('criteria', gIdx)"
                  @dragover.prevent
                  @drop="dropOnCriteria(gIdx)"
                >
                  <div class="flex items-center gap-(--spacing-xs)">
                    <!-- Grip: hold to drag the whole criteria group; the
                               move buttons remain for click / keyboard / touch. -->
                    <span
                      v-if="form.criteria.length > 1"
                      role="button"
                      tabindex="0"
                      aria-label="Drag to reorder criteria, or use arrow keys"
                      draggable="true"
                      :class="[GRIP_CLASS, 'size-8']"
                      @dragstart="onDragStart('criteria', gIdx, $event)"
                      @dragend="onDragEnd"
                      @keydown.up.prevent="moveCriteria(gIdx, -1)"
                      @keydown.down.prevent="moveCriteria(gIdx, 1)"
                    >
                      <i
                        class="pi pi-bars"
                        aria-hidden="true"
                      />
                    </span>
                    <span class="text-overline-sm text-(--text-muted)">
                      {{ gIdx === 0 ? 'If' : 'Or' }}
                    </span>
                    <span class="h-px flex-1 bg-(--border-default)" />
                    <!-- Group-level reorder — surfaced only when there is
                               more than one criteria group to move. -->
                    <div
                      v-if="form.criteria.length > 1"
                      class="flex items-center gap-(--spacing-xxs)"
                    >
                      <Tooltip text="Move criteria up">
                        <IconButton
                          icon="pi pi-chevron-up"
                          kind="outlined"
                          size="small"
                          aria-label="Move criteria up"
                          :disabled="submitting || gIdx === 0"
                          @click="moveCriteria(gIdx, -1)"
                        />
                      </Tooltip>
                      <Tooltip text="Move criteria down">
                        <IconButton
                          icon="pi pi-chevron-down"
                          kind="outlined"
                          size="small"
                          aria-label="Move criteria down"
                          :disabled="submitting || gIdx === form.criteria.length - 1"
                          @click="moveCriteria(gIdx, 1)"
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <!-- Nested conditions: a left border rail + indentation
                             segments the group's conditions from the "If"/"Or"
                             header, marking them as nested inside the group. The
                             rail closes with a bottom segment and a rounded
                             bottom-left corner (`--shape-card`), so it reads as
                             one connected bracket wrapping the group rather than a
                             loose vertical line. Border tokens (`--border-muted`)
                             at the default width keep the adornment theme-aware. -->
                  <div
                    class="ml-(--spacing-xs) flex flex-col gap-(--spacing-sm) rounded-bl-(--shape-card) border-b-(length:--border-width-default) border-l-(length:--border-width-default) border-(--border-muted) pb-(--spacing-md) pl-(--spacing-md)"
                  >
                    <TransitionGroup
                      tag="div"
                      class="relative flex flex-col gap-(--spacing-sm)"
                      v-bind="MORPH_COLLAPSE"
                    >
                      <div
                        v-for="(cond, cIdx) in group.conditions"
                        :key="cond.id"
                        data-drag-row
                        :data-dragging="isDragging('cond-' + gIdx, cIdx) || null"
                        :data-drop="isDropTarget('cond-' + gIdx, cIdx) || null"
                        :class="['flex flex-col gap-(--spacing-xxs)', dragRowClass]"
                        @dragenter.prevent="onDragEnter('cond-' + gIdx, cIdx)"
                        @dragover.prevent
                        @drop="dropOnCondition(gIdx, cIdx)"
                      >
                        <span
                          v-if="cIdx > 0"
                          class="text-label-sm text-(--text-muted)"
                        >
                          {{ cond.join === 'or' ? 'Or' : 'And' }}
                        </span>
                        <div
                          class="grid grid-cols-1 items-start gap-(--spacing-xs) sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                        >
                          <InputText
                            v-model="cond.variable"
                            size="large"
                            class="w-full font-code"
                            aria-label="Variable"
                            placeholder="${uri}"
                            :disabled="submitting"
                            :required="submitted && !cond.variable.trim()"
                          >
                            <template #iconLeft>
                              <i
                                class="pi pi-search"
                                aria-hidden="true"
                              />
                            </template>
                          </InputText>

                          <Select
                            v-model="cond.operator"
                            size="large"
                            class="w-full"
                            :disabled="submitting"
                            :display-value="operatorLabel"
                          >
                            <Select.Trigger aria-label="Operator" />
                            <Select.Content>
                              <Select.Option
                                v-for="op in OPERATORS"
                                :key="op.value"
                                :value="op.value"
                              >
                                {{ op.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>

                          <!-- `exists` / `does not exist` test for PRESENCE: there is
                                 no value to compare against, so the input is not
                                 rendered rather than rendered and ignored. The cell
                                 stays in the grid, so the row's columns do not shift
                                 under the operator that dropped its argument. -->
                          <InputText
                            v-if="takesArgument(cond.operator)"
                            v-model="cond.argument"
                            size="large"
                            class="w-full"
                            aria-label="Argument"
                            :disabled="submitting"
                          />
                          <span v-else />

                          <!-- Row controls at the fields' size (large) to keep the
                                 horizontal rhythm: drag grip + reorder + remove. -->
                          <div class="flex items-center gap-(--spacing-xxs)">
                            <span
                              v-if="group.conditions.length > 1"
                              role="button"
                              tabindex="0"
                              aria-label="Drag to reorder condition, or use arrow keys"
                              draggable="true"
                              :class="[GRIP_CLASS, 'size-10']"
                              @dragstart="onDragStart('cond-' + gIdx, cIdx, $event)"
                              @dragend="onDragEnd"
                              @keydown.up.prevent="moveCondition(gIdx, cIdx, -1)"
                              @keydown.down.prevent="moveCondition(gIdx, cIdx, 1)"
                            >
                              <i
                                class="pi pi-bars"
                                aria-hidden="true"
                              />
                            </span>
                            <Tooltip text="Move condition up">
                              <IconButton
                                icon="pi pi-chevron-up"
                                kind="outlined"
                                size="large"
                                aria-label="Move condition up"
                                :disabled="submitting || cIdx === 0"
                                @click="moveCondition(gIdx, cIdx, -1)"
                              />
                            </Tooltip>
                            <Tooltip text="Move condition down">
                              <IconButton
                                icon="pi pi-chevron-down"
                                kind="outlined"
                                size="large"
                                aria-label="Move condition down"
                                :disabled="submitting || cIdx === group.conditions.length - 1"
                                @click="moveCondition(gIdx, cIdx, 1)"
                              />
                            </Tooltip>
                            <Tooltip text="Remove condition">
                              <IconButton
                                icon="pi pi-trash"
                                kind="outlined"
                                size="large"
                                aria-label="Remove condition"
                                :disabled="submitting || totalConditions <= 1"
                                @click="removeCondition(gIdx, cIdx)"
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </TransitionGroup>

                    <div class="flex items-center gap-(--spacing-xs)">
                      <Button
                        type="button"
                        label="And"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-plus-circle"
                        :disabled="submitting || !canAddCondition(group)"
                        @click="addCondition(group, 'and')"
                      />
                      <Button
                        type="button"
                        label="Or"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-plus-circle"
                        :disabled="submitting || !canAddCondition(group)"
                        @click="addCondition(group, 'or')"
                      />
                      <span
                        v-if="!canAddCondition(group)"
                        class="text-body-sm text-(--text-muted)"
                      >
                        Each criteria holds up to 10 conditions.
                      </span>
                    </div>
                  </div>
                </div>
              </TransitionGroup>

              <Divider />

              <div class="flex flex-wrap items-center gap-(--spacing-sm)">
                <Button
                  type="button"
                  label="Add criteria"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-plus-circle"
                  :disabled="submitting || !canAddCriteria"
                  @click="addCriteria"
                />
                <span
                  v-if="!canAddCriteria"
                  class="text-body-sm text-(--text-muted)"
                >
                  A rule holds up to 5 criteria.
                </span>
              </div>
            </div>
          </div>
        </template>
      </CardBox>
    </Section>

    <!-- Section: Behaviors (ItemGroup with behavior repeater) -->
    <Section
      stacked
      :divided="false"
      title="Behaviors"
      hint="What the rule does when its criteria are met. Behaviors run top to bottom, so their order is part of the rule."
    >
      <CardBox :padded="false">
        <template #content>
          <!-- The rows own their own height now; this region eases only the ONE change
               that is not a row arriving or leaving — a behavior swapping to a type whose
               argument is a different size (Capture Match Groups is three fields tall,
               Deliver is none). -->
          <div
            ref="behaviorsRegion"
            :style="{ height: behaviorsHeight }"
            :data-resizing="behaviorsHeight ? '' : null"
            class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
          >
            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
              <div class="flex items-center gap-(--spacing-xs)">
                <span class="text-overline-sm text-(--text-muted)">Then</span>
                <span class="h-px flex-1 bg-(--border-default)" />
              </div>

              <TransitionGroup
                tag="div"
                class="relative flex flex-col gap-(--spacing-sm)"
                v-bind="MORPH_COLLAPSE"
              >
                <div
                  v-for="(behavior, bIdx) in form.behaviors"
                  :key="behavior.id"
                  data-drag-row
                  :data-dragging="isDragging('behavior', bIdx) || null"
                  :data-drop="isDropTarget('behavior', bIdx) || null"
                  :class="[
                    'grid grid-cols-1 items-start gap-(--spacing-xs) sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]',
                    dragRowClass
                  ]"
                  @dragenter.prevent="onDragEnter('behavior', bIdx)"
                  @dragover.prevent
                  @drop="dropOnBehavior(bIdx)"
                >
                  <Select
                    :model-value="behavior.type"
                    size="large"
                    class="w-full min-w-0"
                    :disabled="submitting"
                    :display-value="behaviorLabel"
                    @update:model-value="setBehaviorType(bIdx, $event)"
                  >
                    <Select.Trigger aria-label="Behavior" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in behaviorsForPhase"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>

                  <!-- WHAT THE BEHAVIOR IS GIVEN — the conditional half of the row.
                       Four shapes, all declared by the catalog: nothing at all
                       (Deliver, Deny), one free-text value with the placeholder that
                       states its format, one record of this application listed from
                       the store that owns it, or a group (Capture Match Groups takes
                       three). The cell holds its place in the grid when the behavior
                       reads nothing, so the behavior Select keeps one width down the
                       column instead of resizing as each row's type is chosen. -->
                  <div class="min-w-0">
                    <template v-if="behaviorArgument(behavior.type)?.kind === 'text'">
                      <InputText
                        v-model="behavior[behaviorArgument(behavior.type).field]"
                        size="large"
                        class="w-full"
                        :aria-label="behaviorArgument(behavior.type).label"
                        :placeholder="behaviorArgument(behavior.type).placeholder"
                        :disabled="submitting"
                        :required="argumentMissing(behavior, behaviorArgument(behavior.type).field)"
                      />
                    </template>

                    <template v-else-if="behaviorArgument(behavior.type)?.kind === 'select'">
                      <div class="flex flex-col gap-(--spacing-xxs)">
                        <Select
                          v-model="behavior[behaviorArgument(behavior.type).field]"
                          size="large"
                          class="w-full"
                          :disabled="submitting"
                          :placeholder="`Select a ${behaviorArgument(behavior.type).label.toLowerCase()}`"
                          :required="
                            argumentMissing(behavior, behaviorArgument(behavior.type).field)
                          "
                          :display-value="
                            (value) => optionLabelIn(behaviorArgument(behavior.type).source, value)
                          "
                        >
                          <Select.Trigger :aria-label="behaviorArgument(behavior.type).label" />
                          <Select.Content>
                            <Select.Option
                              v-for="option in optionsFor(behaviorArgument(behavior.type).source)"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                        <!-- The one thing the reader cannot infer from the list: WHY it
                             is short. Said under the field it narrows, not in the
                             section hint, because it is only true in one phase. -->
                        <HelperText
                          v-if="
                            behaviorArgumentNote(behaviorArgument(behavior.type).source, form.phase)
                          "
                        >
                          {{
                            behaviorArgumentNote(behaviorArgument(behavior.type).source, form.phase)
                          }}
                        </HelperText>
                      </div>
                    </template>

                    <template v-else-if="behaviorArgument(behavior.type)?.kind === 'group'">
                      <div class="flex flex-col gap-(--spacing-xs)">
                        <InputText
                          v-for="part in behaviorArgument(behavior.type).fields"
                          :key="part.field"
                          v-model="behavior[part.field]"
                          size="large"
                          class="w-full"
                          :aria-label="part.label"
                          :placeholder="part.placeholder"
                          :disabled="submitting"
                          :required="argumentMissing(behavior, part.field)"
                        />
                      </div>
                    </template>
                  </div>

                  <div class="flex items-center gap-(--spacing-xxs)">
                    <span
                      v-if="form.behaviors.length > 1"
                      role="button"
                      tabindex="0"
                      aria-label="Drag to reorder behavior, or use arrow keys"
                      draggable="true"
                      :class="[GRIP_CLASS, 'size-10']"
                      @dragstart="onDragStart('behavior', bIdx, $event)"
                      @dragend="onDragEnd"
                      @keydown.up.prevent="moveBehavior(bIdx, -1)"
                      @keydown.down.prevent="moveBehavior(bIdx, 1)"
                    >
                      <i
                        class="pi pi-bars"
                        aria-hidden="true"
                      />
                    </span>
                    <Tooltip text="Move behavior up">
                      <IconButton
                        icon="pi pi-chevron-up"
                        kind="outlined"
                        size="large"
                        aria-label="Move behavior up"
                        :disabled="submitting || bIdx === 0"
                        @click="moveBehavior(bIdx, -1)"
                      />
                    </Tooltip>
                    <Tooltip text="Move behavior down">
                      <IconButton
                        icon="pi pi-chevron-down"
                        kind="outlined"
                        size="large"
                        aria-label="Move behavior down"
                        :disabled="submitting || bIdx === form.behaviors.length - 1"
                        @click="moveBehavior(bIdx, 1)"
                      />
                    </Tooltip>
                    <Tooltip text="Remove behavior">
                      <IconButton
                        icon="pi pi-trash"
                        kind="outlined"
                        size="large"
                        aria-label="Remove behavior"
                        :disabled="submitting || form.behaviors.length <= 1"
                        @click="removeBehavior(bIdx)"
                      />
                    </Tooltip>
                  </div>
                </div>
              </TransitionGroup>

              <!-- Spent once the last behavior ENDS the rule, and it SAYS why: a
                   disabled button with no reason reads as broken, and the reason
                   ("Deliver is the end of the rule") is the thing that teaches the
                   reader how behaviors run. -->
              <div class="flex flex-wrap items-center gap-(--spacing-sm)">
                <Button
                  type="button"
                  label="Add behavior"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-plus-circle"
                  :disabled="submitting || !canAddBehavior"
                  @click="addBehavior"
                />
                <span
                  v-if="!canAddBehavior"
                  class="text-body-sm text-(--text-muted)"
                >
                  {{
                    form.behaviors.length >= 10
                      ? 'A rule holds up to 10 behaviors.'
                      : `${behaviorLabel(form.behaviors[form.behaviors.length - 1].type)} ends the rule. Nothing after it runs.`
                  }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </CardBox>
    </Section>

    <!-- Section: Status (ItemGroup) -->
    <Section
      stacked
      :divided="false"
      title="Status"
      hint="An inactive rule stays in the list and in its place in the order, but is skipped at runtime."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item size="small">
              <Item.Content>
                <Item.Title>Active</Item.Title>
                <Item.Description>Turn the rule on right after it is created.</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.active"
                  aria-label="Active"
                  :disabled="submitting"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </ResourceDrawer>
</template>
