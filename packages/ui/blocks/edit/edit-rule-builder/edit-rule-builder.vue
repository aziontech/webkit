<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import DrawerTrigger from '@aziontech/ui/drawer-trigger'
  import Field from '@aziontech/ui/field'
  import FieldDescription from '@aziontech/ui/field-description'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import RadioGroup from '@aziontech/ui/radio-group'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { PHASES } from './lib/rule-behavior-data'
  import { behaviorAllowedIn, behaviorArgument, behaviorOptions } from './lib/rule-catalog'
  import { createIds, criteriaErrorsOf, isValid, valuesOf } from './lib/rule-form'
  import RuleBehaviors from './parts/rule-behaviors.vue'
  import RuleCriteria from './parts/rule-criteria.vue'

  /** One condition: a variable compared with an argument. */
  export interface RuleBuilderCondition {
    /** The variable to compare, such as the request URI. */
    variable: string
    /** The comparison, such as is-equal or matches. */
    operator: string
    /** The value compared with; empty for exists and does-not-exist. */
    argument: string
  }

  /** One behavior: its type and the argument fields that type takes. */
  export interface RuleBuilderBehavior {
    /** The behavior, such as rewrite-request or set-cache-policy. */
    type: string
    /** The argument fields, such as target or cacheId. */
    [field: string]: string
  }

  /** A rule as the drawer opens on it, and the values Save sends. */
  export interface RuleBuilderRule {
    /** Names the rule in the list. */
    name: string
    /** A note for whoever reads the rule next. */
    description: string
    /** request or response. */
    phase: string
    /** Groups of conditions: every condition in a group must match, any one group is enough. */
    criteria: RuleBuilderCondition[][]
    /** What the rule does, top to bottom. */
    behaviors: RuleBuilderBehavior[]
    /** Whether the rule runs. */
    active: boolean
  }

  export interface RuleBuilderProps {
    /** The rule to edit: the drawer becomes Edit rule with the phase locked. Left out, it adds a new rule. */
    rule?: RuleBuilderRule | null
    /** The save is in flight: the form locks and Save spins; when it ends with no error the drawer closes. */
    loading?: boolean
    /** Why the save failed, shown in the danger alert at the top of the drawer; the form is kept. */
    error?: string
    /** The drawer starts open. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<RuleBuilderProps>(), {
    rule: null,
    loading: false,
    error: '',
    defaultOpen: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: RuleBuilderRule]
  }>()

  const open = ref(props.defaultOpen)
  const editing = computed(() => props.rule !== null)

  const { newCondition, newBehavior, blankForm, formFor } = createIds()

  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = computed(() => props.loading)
  const pending = ref(false)
  const saveError = ref('')
  const nameError = computed(() => submitted.value && !form.name.trim())
  const criteriaErrors = computed(() => (submitted.value ? criteriaErrorsOf(form) : []))

  watch(
    open,
    (isOpen) => {
      if (!isOpen) return
      Object.assign(form, formFor(props.rule))
      submitted.value = false
      pending.value = false
      saveError.value = ''
    },
    { immediate: true }
  )

  const title = computed(() => (editing.value ? 'Edit rule' : 'Add rule'))
  const lockedPhase = computed(() => PHASES.find((phase) => phase.value === form.phase))

  watch(
    () => form.phase,
    (phase) => {
      form.behaviors.forEach((behavior, index) => {
        if (!behaviorAllowedIn(behavior.type, phase)) {
          form.behaviors[index] = { type: 'deliver', id: behavior.id }
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
  const formEl = ref<HTMLFormElement | null>(null)

  watch(
    () => props.error,
    (message) => {
      if (open.value) saveError.value = message
    }
  )

  watch(
    () => props.loading,
    (now, was) => {
      if (!was || now || !pending.value) return
      pending.value = false
      if (props.error) {
        saveError.value = props.error
        return
      }
      open.value = false
    }
  )
  const submit = async (event: Event) => {
    submitted.value = true
    if (submitting.value) return
    if (!isValid(form)) {
      nextTick(() =>
        formEl.value
          ?.querySelector<HTMLElement>(
            ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'
          )
          ?.focus()
      )
      return
    }
    saveError.value = ''
    emit('submit', event, valuesOf(form))
    await nextTick()
    if (props.loading) {
      pending.value = true
      return
    }
    if (props.error) {
      saveError.value = props.error
      return
    }
    open.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerTrigger>
      <Button
        v-if="editing"
        label="Edit rule"
        icon="az az-pencil"
        variant="outline"
        size="medium"
      />
      <div
        v-else
        class="w-full md:w-fit"
      >
        <Button
          label="Add rule"
          icon="az az-plus"
          variant="outline"
          size="medium"
          class="w-full"
        />
      </div>
    </DrawerTrigger>
    <DrawerContent>
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Handle the conditional execution of behaviors through logical operators.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <div
            v-if="saveError"
            class="mb-(--spacing-md)"
          >
            <Alert
              severity="danger"
              :label="saveError"
              data-testid="rule-builder-save-error"
            />
          </div>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">{{ title }}</legend>
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
                  <Field.Error v-if="nameError">Name is required.</Field.Error>
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
                      <Item
                        v-if="editing"
                        data-testid="edit-rule-builder__phase"
                      >
                        <Item.Content>
                          <Item.Title>{{ lockedPhase?.label }}</Item.Title>
                          <Item.Description>{{ lockedPhase?.description }}</Item.Description>
                        </Item.Content>
                      </Item>
                      <RadioGroup
                        v-else
                        v-model="form.phase"
                        variant="card"
                        name="rule-phase"
                        aria-label="Phase"
                        :disabled="submitting"
                      >
                        <RadioGroup.Item
                          v-for="phase in PHASES"
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

            <RuleCriteria
              v-model:criteria="form.criteria"
              :phase="form.phase"
              :disabled="submitting"
              :errors="criteriaErrors"
              :new-item="newCondition"
            />

            <RuleBehaviors
              v-model:behaviors="form.behaviors"
              :phase="form.phase"
              :disabled="submitting"
              :submitted="submitted"
              :new-item="newBehavior"
            />

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
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
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
