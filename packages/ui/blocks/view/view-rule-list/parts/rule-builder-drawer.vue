<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed, reactive, ref } from 'vue'

  import { useBehaviorDrag } from '../composables/use-behavior-drag'
  import { useRuleBehaviors } from '../composables/use-rule-behaviors'
  import { useRuleBuilderForm } from '../composables/use-rule-builder-form'
  import {
    BUILDER_PHASES,
    type RuleForm,
    ruleFormFactory,
    type RuleSeed,
    variablesFor
  } from '../lib/rule-builder'
  import type { RuleListPhase } from '../view-rule-list.vue'
  import RuleBehaviorsCard from './rule-behaviors-card.vue'
  import RuleCriteriaEditor from './rule-criteria-editor.vue'

  export interface RuleBuilderDrawerProps {
    /** The rule being edited, or nothing for a new one. */
    seed?: RuleSeed | null
    /** The phase a new rule starts in. */
    newPhase?: RuleListPhase
  }

  const props = withDefaults(defineProps<RuleBuilderDrawerProps>(), {
    seed: null,
    newPhase: 'request'
  })

  const emit = defineEmits<{
    apply: [form: RuleForm]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const { newCondition, newBehavior, blankForm, formFor } = ruleFormFactory()
  const form = reactive(blankForm())
  const formEl = ref<HTMLElement | null>(null)
  const editing = computed(() => Boolean(props.seed))

  const { submitting, nameError, criteriaErrors, argumentMissing, submit } = useRuleBuilderForm(
    form,
    { open, seed: () => props.seed, newPhase: () => props.newPhase, formFor },
    formEl,
    () => emit('apply', form)
  )
  const behaviorList = useRuleBehaviors(form, newBehavior)
  const drag = useBehaviorDrag(form)
  const variablesForPhase = computed(() => variablesFor(form.phase))
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="editing ? 'Edit rule' : 'Add rule'"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ editing ? 'Edit rule' : 'Add rule' }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Handle the conditional execution of behaviors through logical operators.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">{{ editing ? 'Edit rule' : 'Add rule' }}</legend>
            <SettingsGroup
              label="General"
              hint="Names the rule in the list and in the deployment log."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <Field
                  :disabled="submitting"
                  required
                  :invalid="nameError"
                >
                  <Field.Label for="rule-name">Name</Field.Label>
                  <Input
                    id="rule-name"
                    v-model="form.name"
                    size="large"
                    placeholder="My rule"
                  />
                  <Field.Description v-if="nameError">Name is required.</Field.Description>
                </Field>

                <Field :disabled="submitting">
                  <Field.Label for="rule-description">Description</Field.Label>
                  <Input
                    id="rule-description"
                    v-model="form.description"
                    size="large"
                    placeholder="Optional"
                  />
                  <Field.Description
                    >For whoever reads this rule next. It never affects what the rule
                    does.</Field.Description
                  >
                </Field>
              </div>
            </SettingsGroup>

            <SettingsGroup
              label="Phase"
              hint="When the rule runs. Request rules act on what arrives at the service; response rules act on what leaves it. The two are separate programs and never interleave."
            >
              <Card :padded="false">
                <template #default>
                  <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <RadioGroup
                        v-model="form.phase"
                        variant="card"
                        name="rule-phase"
                        aria-label="Phase"
                        :disabled="submitting || editing"
                      >
                        <RadioGroup.Item
                          v-for="phase in BUILDER_PHASES"
                          :key="phase.value"
                          :value="phase.value"
                          :description="phase.description"
                          >{{ phase.label }}</RadioGroup.Item
                        >
                      </RadioGroup>
                      <FieldDescription v-if="editing"
                        >A rule’s phase is set when it is created. Create a rule in the other phase
                        to run these behaviors there.</FieldDescription
                      >
                    </div>
                  </div>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              label="Criteria"
              hint="The conditions that decide whether the rule runs. Every condition in a group must match, and any one group is enough."
            >
              <RuleCriteriaEditor
                v-model:groups="form.criteria"
                :new-condition="newCondition"
                :errors="criteriaErrors"
                :variables="variablesForPhase"
                :submitting="submitting"
              />
            </SettingsGroup>

            <SettingsGroup
              label="Behaviors"
              hint="What the rule does when its criteria are met, run top to bottom in this order."
            >
              <RuleBehaviorsCard
                :form="form"
                :submitting="submitting"
                :argument-missing="argumentMissing"
                :list="behaviorList"
                :drag="drag"
              />
            </SettingsGroup>

            <SettingsGroup
              label="Status"
              hint="An inactive rule stays in the list and in its place in the order, but is skipped at runtime."
            >
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Active"
                      description="Turn the rule on right after it is created."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.active"
                        aria-label="Active"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </SettingsGroup>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
            <Button
              label="Save"
              variant="primary"
              size="medium"
              :loading="submitting"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
