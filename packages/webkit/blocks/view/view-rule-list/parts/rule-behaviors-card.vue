<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldDescription from '@aziontech/webkit/field-description'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref, watch } from 'vue'

  import type { UseBehaviorDragReturn } from '../composables/use-behavior-drag'
  import type { UseRuleBehaviorsReturn } from '../composables/use-rule-behaviors'
  import {
    type ArgumentField,
    type Behavior,
    BEHAVIOR_ROW_CLASS,
    behaviorArgument,
    behaviorArgumentNote,
    behaviorLabel,
    DRAG_HANDLE_CLASS,
    groupArgument,
    type RuleForm,
    selectArgument,
    textArgument
  } from '../lib/rule-builder'

  export interface RuleBehaviorsCardProps {
    /** The rule form. */
    form: RuleForm
    /** The form is saving. */
    submitting: boolean
    /** A required argument is empty after a submit. */
    argumentMissing: (behavior: Behavior, field: ArgumentField) => boolean
    /** The behaviors list. */
    list: UseRuleBehaviorsReturn
    /** Dragging behaviors into a new order. */
    drag: UseBehaviorDragReturn
  }

  const props = defineProps<RuleBehaviorsCardProps>()

  const {
    behaviorQuery,
    behaviorMatches,
    onBehaviorPanel,
    optionsFor,
    optionLabelIn,
    setBehaviorType,
    canAddBehavior,
    addBehavior,
    removeBehavior,
    moveBehavior
  } = props.list
  const {
    isDragging,
    isDropTarget,
    onDragstart,
    onDragend,
    onListDragenter,
    onListDragover,
    onListDrop
  } = props.drag

  const listEl = ref<HTMLElement | null>(null)
  watch(
    listEl,
    (el, _previous, onCleanup) => {
      if (!el) return
      el.addEventListener('dragenter', onListDragenter)
      el.addEventListener('dragover', onListDragover)
      el.addEventListener('drop', onListDrop)
      onCleanup(() => {
        el.removeEventListener('dragenter', onListDragenter)
        el.removeEventListener('dragover', onListDragover)
        el.removeEventListener('drop', onListDrop)
      })
    },
    { flush: 'sync' }
  )
</script>

<template>
  <Card :padded="false">
    <template #default>
      <div
        class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
      >
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
          <div class="flex items-center gap-(--spacing-xs)">
            <span class="text-overline-sm text-(--text-muted)">Then</span>
            <span class="h-px flex-1 bg-(--border-default)" />
          </div>

          <div
            ref="listEl"
            class="relative flex flex-col gap-(--spacing-sm)"
          >
            <div
              v-for="(behavior, bIdx) in form.behaviors"
              :key="behavior.id"
              data-drag-row
              :data-index="bIdx"
              :data-dragging="isDragging('behavior', bIdx) || null"
              :data-drop="isDropTarget('behavior', bIdx) || null"
              :class="BEHAVIOR_ROW_CLASS"
            >
              <div class="w-full min-w-0">
                <Select
                  :model-value="behavior.type"
                  size="large"
                  class="w-full"
                  :disabled="submitting"
                  :display-value="behaviorLabel"
                  @update:model-value="setBehaviorType(bIdx, $event)"
                  @update:open="onBehaviorPanel(behavior.id, $event)"
                >
                  <Select.Trigger aria-label="Behavior" />
                  <Select.Content>
                    <template #search>
                      <Input
                        v-model="behaviorQuery[behavior.id]"
                        size="medium"
                        class="w-full"
                        placeholder="Search behaviors"
                        aria-label="Search behaviors"
                        @keydown.stop
                      >
                        <template #leading>
                          <i
                            class="az az-search"
                            aria-hidden="true"
                          />
                        </template>
                      </Input>
                    </template>
                    <Select.Item
                      v-for="option in behaviorMatches(behavior.id)"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                    <p
                      v-if="!behaviorMatches(behavior.id).length"
                      class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                    >
                      No behavior matches “{{ behaviorQuery[behavior.id] }}”.
                    </p>
                  </Select.Content>
                </Select>
              </div>

              <div class="min-w-0">
                <template v-if="behaviorArgument(behavior.type)?.kind === 'text'">
                  <Input
                    v-model="behavior[textArgument(behavior.type).field]"
                    size="large"
                    class="w-full"
                    :aria-label="textArgument(behavior.type).label"
                    :placeholder="textArgument(behavior.type).placeholder"
                    :disabled="submitting"
                    required
                    :invalid="argumentMissing(behavior, textArgument(behavior.type).field)"
                  />
                </template>

                <template v-else-if="behaviorArgument(behavior.type)?.kind === 'select'">
                  <div class="flex flex-col gap-(--spacing-2xs)">
                    <Select
                      v-model="behavior[selectArgument(behavior.type).field]"
                      size="large"
                      class="w-full"
                      :disabled="submitting"
                      :placeholder="`Select a ${selectArgument(behavior.type).label.toLowerCase()}`"
                      required
                      :invalid="argumentMissing(behavior, selectArgument(behavior.type).field)"
                      :display-value="
                        (value) => optionLabelIn(selectArgument(behavior.type).source, value)
                      "
                    >
                      <Select.Trigger :aria-label="selectArgument(behavior.type).label" />
                      <Select.Content>
                        <Select.Item
                          v-for="option in optionsFor(selectArgument(behavior.type).source)"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                    <FieldDescription
                      v-if="behaviorArgumentNote(selectArgument(behavior.type).source, form.phase)"
                    >
                      {{ behaviorArgumentNote(selectArgument(behavior.type).source, form.phase) }}
                    </FieldDescription>
                  </div>
                </template>

                <template v-else-if="behaviorArgument(behavior.type)?.kind === 'group'">
                  <div class="flex flex-col gap-(--spacing-xs)">
                    <Input
                      v-for="part in groupArgument(behavior.type).fields"
                      :key="part.field"
                      v-model="behavior[part.field]"
                      size="large"
                      class="w-full"
                      :aria-label="part.label"
                      :placeholder="part.placeholder"
                      :disabled="submitting"
                      required
                      :invalid="argumentMissing(behavior, part.field)"
                    />
                  </div>
                </template>
              </div>

              <div class="flex items-center gap-(--spacing-2xs)">
                <span
                  v-if="form.behaviors.length > 1"
                  role="button"
                  tabindex="0"
                  aria-label="Drag to reorder behavior, or use arrow keys"
                  draggable="true"
                  :class="DRAG_HANDLE_CLASS"
                  @dragstart="onDragstart('behavior', bIdx, $event)"
                  @dragend="onDragend"
                  @keydown.up.prevent="moveBehavior(bIdx, -1)"
                  @keydown.down.prevent="moveBehavior(bIdx, 1)"
                >
                  <i
                    class="az az-menu"
                    aria-hidden="true"
                  />
                </span>
                <Tooltip content="Move behavior up">
                  <IconButton
                    icon="az az-chevron-up"
                    variant="outline"
                    size="large"
                    aria-label="Move behavior up"
                    :disabled="submitting || bIdx === 0"
                    @click="moveBehavior(bIdx, -1)"
                  />
                </Tooltip>
                <Tooltip content="Move behavior down">
                  <IconButton
                    icon="az az-chevron-down"
                    variant="outline"
                    size="large"
                    aria-label="Move behavior down"
                    :disabled="submitting || bIdx === form.behaviors.length - 1"
                    @click="moveBehavior(bIdx, 1)"
                  />
                </Tooltip>
                <Tooltip content="Remove behavior">
                  <IconButton
                    icon="az az-trash"
                    variant="outline"
                    size="large"
                    aria-label="Remove behavior"
                    :disabled="submitting || form.behaviors.length <= 1"
                    @click="removeBehavior(bIdx)"
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-(--spacing-sm)">
            <Button
              type="button"
              label="Add behavior"
              variant="outline"
              size="medium"
              icon="az az-circle-plus"
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
  </Card>
</template>
