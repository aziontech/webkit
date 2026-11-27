<script setup lang="ts">
  import AttributeEditor from '@aziontech/ui/attribute-editor'
  import Card from '@aziontech/ui/card'
  import FieldDescription from '@aziontech/ui/field-description'
  import Input from '@aziontech/ui/input'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import { computed, reactive } from 'vue'

  import type { RuleBehavior } from '../lib/rule-behavior-data'
  import {
    behaviorArgument,
    behaviorArgumentNote,
    behaviorLabel,
    behaviorOptions,
    behaviorsFor,
    isTerminalBehavior
  } from '../lib/rule-catalog'
  import { behaviorColumns } from '../lib/rule-form'

  const props = defineProps<{
    phase: string
    disabled: boolean
    submitted: boolean
    newItem: () => RuleBehavior
  }>()

  const behaviors = defineModel<RuleBehavior[]>('behaviors', { required: true })

  const behaviorsForPhase = computed(() =>
    behaviorsFor(props.phase).map(({ value, label }) => ({ value, label }))
  )
  const behaviorQuery = reactive<Record<string, string>>({})
  const behaviorMatches = (id: string) => {
    const query = (behaviorQuery[id] ?? '').trim().toLowerCase()
    if (!query) return behaviorsForPhase.value
    return behaviorsForPhase.value.filter((option) => option.label.toLowerCase().includes(query))
  }
  const onBehaviorPanel = (id: string, isOpen: boolean) => {
    if (!isOpen) behaviorQuery[id] = ''
  }
  const optionsFor = (source: string) => behaviorOptions(source, props.phase)
  const optionLabelIn = (source: string, value: unknown) =>
    optionsFor(source).find((option) => option.value === value)?.label ?? ''
  const setBehaviorType = (index: number, type: string) => {
    if (behaviors.value[index].type === type) return
    behaviors.value[index] = { type, id: behaviors.value[index].id }
  }
  const argumentMissing = (behavior: RuleBehavior, field: string) =>
    props.submitted && !String(behavior[field] ?? '').trim()
  const lastBehaviorEnds = computed(() =>
    isTerminalBehavior(behaviors.value[behaviors.value.length - 1]?.type)
  )
</script>

<template>
  <SettingsGroup
    label="Behaviors"
    hint="What the rule does when its criteria are met, run top to bottom in this order."
  >
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

            <AttributeEditor
              v-model:items="behaviors"
              :definition="behaviorColumns"
              :new-item="newItem"
              :limit="10"
              :min-items="1"
              :add-disabled="lastBehaviorEnds"
              :disabled="disabled"
              reorderable
              size="large"
              add-button-label="Add behavior"
              remove-button-label="Remove behavior"
              aria-label="Behaviors"
            >
              <template #cell-type="{ item, index }">
                <Select
                  :model-value="item.type"
                  size="large"
                  class="w-full"
                  :disabled="disabled"
                  :display-value="behaviorLabel"
                  @update:model-value="setBehaviorType(index, $event)"
                  @update:open="onBehaviorPanel(item.id, $event)"
                >
                  <Select.Trigger />
                  <Select.Content>
                    <template #search>
                      <Input
                        v-model="behaviorQuery[item.id]"
                        size="medium"
                        class="w-full"
                        placeholder="Search behaviors"
                        aria-label="Search behaviors"
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
                      v-for="option in behaviorMatches(item.id)"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                    <p
                      v-if="!behaviorMatches(item.id).length"
                      class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                    >
                      No behavior matches “{{ behaviorQuery[item.id] }}”.
                    </p>
                  </Select.Content>
                </Select>
              </template>
              <template #cell-argument="{ item, index }">
                <template
                  v-for="argument in [behaviorArgument(item.type)]"
                  :key="item.type"
                >
                  <Input
                    key="input-1"
                    v-if="argument?.kind === 'text'"
                    v-model="behaviors[index][argument.field]"
                    size="large"
                    class="w-full"
                    :aria-label="argument.label"
                    :placeholder="argument.placeholder"
                    :disabled="disabled"
                    required
                    :invalid="argumentMissing(item, argument.field)"
                  />
                  <div
                    v-else-if="argument?.kind === 'select'"
                    class="flex w-full flex-col gap-(--spacing-2xs)"
                  >
                    <Select
                      v-model="behaviors[index][argument.field]"
                      size="large"
                      class="w-full"
                      :disabled="disabled"
                      :placeholder="`Select a ${argument.label.toLowerCase()}`"
                      required
                      :invalid="argumentMissing(item, argument.field)"
                      :display-value="(value) => optionLabelIn(argument.source, value)"
                    >
                      <Select.Trigger :aria-label="argument.label" />
                      <Select.Content>
                        <Select.Item
                          v-for="option in optionsFor(argument.source)"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                    <FieldDescription v-if="behaviorArgumentNote(argument.source, phase)">
                      {{ behaviorArgumentNote(argument.source, phase) }}
                    </FieldDescription>
                  </div>
                  <div
                    v-else-if="argument?.kind === 'group'"
                    class="flex w-full flex-col gap-(--spacing-xs)"
                  >
                    <Input
                      v-for="part in argument.fields"
                      :key="part.field"
                      v-model="behaviors[index][part.field]"
                      size="large"
                      class="w-full"
                      :aria-label="part.label"
                      :placeholder="part.placeholder"
                      :disabled="disabled"
                      required
                      :invalid="argumentMissing(item, part.field)"
                    />
                  </div>
                  <Input
                    key="input-2"
                    v-else
                    model-value=""
                    size="large"
                    class="w-full"
                    placeholder="No argument"
                    disabled
                  />
                </template>
              </template>
              <template
                v-if="lastBehaviorEnds"
                #info
              >
                {{ behaviorLabel(behaviors[behaviors.length - 1].type) }} ends the rule. Nothing
                after it runs.
              </template>
            </AttributeEditor>
          </div>
        </div>
      </template>
    </Card>
  </SettingsGroup>
</template>
