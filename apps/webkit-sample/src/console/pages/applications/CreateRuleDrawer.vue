<script setup lang="ts">
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

  import ComboboxInput from '../../components/form/ComboboxInput.vue'
  import FieldStack from '../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import Section from '../../components/page/Section.vue'
  import { useAnimatedHeight } from '../../lib/behavior/animate-height.js'
  import { MORPH_COLLAPSE } from '../../lib/behavior/list-morph'
  import * as applicationRules from '../../lib/data/rules-engine'

  const open = defineModel('open', { type: Boolean, default: false })

  interface Props {
    rule?: Record<string, unknown>
    draft?: Record<string, unknown>
    vocabulary?: Record<string, unknown>
  }

  const props = withDefaults(defineProps<Props>(), {
    rule: null,
    draft: null,
    vocabulary: () => applicationRules
  })

  const emit = defineEmits<{
    created: [record: unknown]
    updated: [record: unknown]
  }>()

  const editing = computed(() => Boolean(props.rule))

  const PHASES = computed(() => props.vocabulary.PHASES ?? applicationRules.PHASES)
  const phaseHint = computed(() => props.vocabulary.PHASE_HINT ?? applicationRules.PHASE_HINT)
  const OPERATORS = computed(() => props.vocabulary.OPERATORS)
  const operatorLabel = (value) => props.vocabulary.operatorLabel(value)
  const takesArgument = (operator) => props.vocabulary.takesArgument(operator)
  const behaviorsFor = (phase) => props.vocabulary.behaviorsFor(phase)
  const behaviorArgument = (type) => props.vocabulary.behaviorArgument(type)
  const behaviorAllowedIn = (type, phase) => props.vocabulary.behaviorAllowedIn(type, phase)
  const behaviorOptions = (source, phase) => props.vocabulary.behaviorOptions(source, phase)
  const behaviorArgumentNote = (source, phase) =>
    props.vocabulary.behaviorArgumentNote(source, phase)
  const isTerminalBehavior = (type) => props.vocabulary.isTerminalBehavior(type)
  const behaviorLabel = (type) => props.vocabulary.behaviorLabel(type)
  const operatorArgument = (operator) => props.vocabulary.operatorArgument(operator)
  const variablesFor = (phase) => props.vocabulary.variablesFor?.(phase) ?? []

  let nextId = 0
  const uid = () => (nextId += 1)

  const newCondition = (join = null) => ({
    id: uid(),
    join,
    variable: '',
    operator: 'is-equal',
    argument: ''
  })
  const newGroup = () => ({ id: uid(), conditions: [newCondition()] })
  const newBehavior = () => ({ id: uid(), type: 'deliver' })

  const blankForm = () => ({
    name: '',
    description: '',
    phase: PHASES.value[0]?.value ?? 'request',
    criteria: [newGroup()],
    behaviors: [newBehavior()],
    active: true
  })

  const formFor = (rule) =>
    !rule
      ? blankForm()
      : {
          name: rule.name ?? '',
          description: rule.description ?? '',
          phase: rule.phase ?? PHASES.value[0]?.value ?? 'request',
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

  const nameError = computed(() => submitted.value && !form.name.trim())
  const totalConditions = computed(() =>
    form.criteria.reduce((sum, group) => sum + group.conditions.length, 0)
  )

  watch(
    open,
    (isOpen) => {
      Object.assign(form, formFor(isOpen ? (props.rule ?? props.draft) : null))
      submitted.value = false
    },
    { immediate: true }
  )

  const behaviorsForPhase = computed(() =>
    behaviorsFor(form.phase).map(({ value, label }) => ({ value, label }))
  )

  const variablesForPhase = computed(() => variablesFor(form.phase))

  const behaviorQuery = reactive({})

  const behaviorMatches = (id) => {
    const query = (behaviorQuery[id] ?? '').trim().toLowerCase()
    if (!query) return behaviorsForPhase.value
    return behaviorsForPhase.value.filter((option) => option.label.toLowerCase().includes(query))
  }

  const onBehaviorPanel = (id, isOpen) => {
    if (!isOpen) behaviorQuery[id] = ''
  }

  const optionsFor = (source) => behaviorOptions(source, form.phase)
  const optionLabelIn = (source, value) =>
    optionsFor(source).find((option) => option.value === value)?.label ?? ''

  const setBehaviorType = (index, type) => {
    if (form.behaviors[index].type === type) return
    animateBehaviors(() => {
      form.behaviors[index] = { id: form.behaviors[index].id, type }
    })
  }

  const argumentMissing = (behavior, field) =>
    submitted.value && !String(behavior[field] ?? '').trim()

  const canAddBehavior = computed(() => {
    if (form.behaviors.length >= 10) return false
    return !isTerminalBehavior(form.behaviors[form.behaviors.length - 1]?.type)
  })

  const canAddCriteria = computed(() => form.criteria.length < 5)
  const canAddCondition = (group) => group.conditions.length < 10

  const setConditionOperator = (condition, operator) => {
    const before = operatorArgument(condition.operator)
    const after = operatorArgument(operator)
    condition.operator = operator
    if (before.kind !== after.kind || before.source !== after.source) condition.argument = ''
  }

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

  const {
    region: behaviorsRegion,
    height: behaviorsHeight,
    animateHeight: animateBehaviors
  } = useAnimatedHeight()

  const addCondition = (group, join) => group.conditions.push(newCondition(join))
  const addCriteria = () => form.criteria.push(newGroup())

  const moveCriteria = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= form.criteria.length) return
    const [moved] = form.criteria.splice(index, 1)
    form.criteria.splice(target, 0, moved)
  }

  const removeCondition = (groupIndex, condIndex) => {
    if (totalConditions.value <= 1) return
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
    conditions[0].join = null
  }

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

  const dnd = reactive({ scope: null, from: -1, over: -1 })

  const GRIP_CLASS =
    'inline-flex shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) ' +
    'text-(--text-muted) outline-none transition-colors hover:bg-(--bg-hover) hover:text-(--text-default) ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing motion-reduce:transition-none'

  const isDragging = (scope, index) => dnd.scope === scope && dnd.from === index
  const isDropTarget = (scope, index) =>
    dnd.scope === scope && dnd.over === index && dnd.from !== index

  const dragRowClass =
    'relative rounded-(--shape-card) transition-[opacity,transform,outline-color] ' +
    'data-dragging:opacity-70 data-dragging:scale-[0.98] data-dragging:outline-dashed data-dragging:outline-2 data-dragging:outline-(--accent) ' +
    "data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-0 data-drop:before:-top-(--spacing-xxs) data-drop:before:border-t-2 data-drop:before:border-(--accent) data-drop:before:content-['']"

  const onDragStart = (scope, index, event) => {
    dnd.scope = scope
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
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
    <Section
      stacked
      :divided="false"
      title="General"
      hint="Names the rule in the list and in the deployment log."
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

        <FieldStack
          label="Description"
          description="For whoever reads this rule next. It never affects what the rule does."
        >
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

    <Section
      v-if="PHASES.length > 1"
      stacked
      :divided="false"
      title="Phase"
      :hint="phaseHint"
    >
      <CardBox :padded="false">
        <template #content>
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
            <div class="flex flex-col gap-(--spacing-xs)">
              <FieldRadioBlock
                v-for="phase in PHASES"
                :key="phase.value"
                v-model="form.phase"
                :value="phase.value"
                name="rule-phase"
                :input-id="`rule-phase-${phase.value}`"
                :label="phase.label"
                :description="phase.description"
                :disabled="submitting || editing"
              />
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

    <Section
      stacked
      :divided="false"
      title="Criteria"
      hint="The conditions that decide whether the rule runs."
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
                  <div class="flex min-h-8 items-center gap-(--spacing-xs)">
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
                          <ComboboxInput
                            v-model="cond.variable"
                            size="large"
                            class="font-code"
                            aria-label="Variable"
                            placeholder="${uri}"
                            :options="variablesForPhase"
                            :disabled="submitting"
                            :required="submitted && !cond.variable.trim()"
                            empty-text="No variable matches — type the one you need."
                          />

                          <Select
                            :model-value="cond.operator"
                            size="large"
                            class="w-full"
                            :disabled="submitting"
                            :display-value="operatorLabel"
                            @update:model-value="setConditionOperator(cond, $event)"
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

                          <Select
                            v-if="
                              takesArgument(cond.operator) &&
                              operatorArgument(cond.operator).kind === 'select'
                            "
                            v-model="cond.argument"
                            size="large"
                            class="w-full"
                            :disabled="submitting"
                            :placeholder="`Select a ${operatorArgument(cond.operator).label.toLowerCase()}`"
                            :display-value="
                              (value) =>
                                optionLabelIn(operatorArgument(cond.operator).source, value)
                            "
                          >
                            <Select.Trigger :aria-label="operatorArgument(cond.operator).label" />
                            <Select.Content>
                              <Select.Option
                                v-for="option in optionsFor(operatorArgument(cond.operator).source)"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                          <InputText
                            v-else-if="takesArgument(cond.operator)"
                            v-model="cond.argument"
                            size="large"
                            class="w-full"
                            aria-label="Argument"
                            :disabled="submitting"
                          />
                          <span v-else />

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

    <Section
      stacked
      :divided="false"
      title="Behaviors"
      hint="What the rule does when its criteria are met, run top to bottom in this order."
    >
      <CardBox :padded="false">
        <template #content>
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
                    @update:open="onBehaviorPanel(behavior.id, $event)"
                  >
                    <Select.Trigger aria-label="Behavior" />
                    <Select.Content>
                      <template #search>
                        <InputText
                          v-model="behaviorQuery[behavior.id]"
                          size="medium"
                          class="w-full"
                          placeholder="Search behaviors"
                          aria-label="Search behaviors"
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
                        v-for="option in behaviorMatches(behavior.id)"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                      <p
                        v-if="!behaviorMatches(behavior.id).length"
                        class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                      >
                        No behavior matches “{{ behaviorQuery[behavior.id] }}”.
                      </p>
                    </Select.Content>
                  </Select>

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
