<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { strategyById } from '../../lib/data/deployment-strategies'
  import { deploymentPolicyLabel } from '../../lib/data/environments'
  import { settingsForPolicy } from '../../lib/state/workload-settings'
  import FieldRow from '../form/FieldRow.vue'

  const props = defineProps({
    /** The workload these environments belong to. A DEDICATED setting is offered only to
     *  the workload it was created with, so the picker has to know which one is asking. */
    workloadId: { type: String, default: '' },
    /**
     * The workload's environments, as `environmentsForWorkload` pairs them —
     * `{ name, deploymentPolicy, settingsId, auto }`.
     */
    environments: { type: Array, default: () => [] },
    /** Locks every control while the page's commit is in flight. */
    disabled: { type: Boolean, default: false }
  })

  /** Environment name → the Deployment Setting it will publish with, once saved. */
  const model = defineModel({ type: Object, required: true })

  const emit = defineEmits(['manage'])

  const chosen = (environment) => model.value[environment.name] ?? environment.settingsId ?? ''

  const optionsFor = (environment) =>
    settingsForPolicy(environment.deploymentPolicy, chosen(environment), props.workloadId).map((strategy) => ({
      value: strategy.id,
      label: strategy.name
    }))

  const settingName = (id) => strategyById(id)?.name ?? ''

  const policyNote = (environment) =>
    `Only ${deploymentPolicyLabel(environment.deploymentPolicy)} Deployment Settings can be linked to this environment.`

  const missing = computed(() =>
    props.environments.filter((environment) => !chosen(environment)).map((one) => one.name)
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
    <Message
      severity="info"
      size="small"
      action-label="Manage Deployment Settings"
      @action="emit('manage')"
    >
      Deployment Settings centralize the applications, firewalls and custom pages that
      environments share. Every environment a domain answers in is linked to one
      automatically, matching that environment's deployment policy.
    </Message>

    <Message
      v-if="missing.length"
      severity="warning"
      size="small"
    >
      {{ missing.join(', ') }} has no Deployment Settings linked. Select one for each to
      enable this workload.
    </Message>

    <CardBox
      v-if="environments.length"
      :padded="false"
    >
      <template #content>
        <Item.List>
          <FieldRow
            v-for="environment in environments"
            :key="environment.name"
            :title="environment.name"
            :description="policyNote(environment)"
          >
            <template #description>
              <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                <Tag
                  severity="info"
                  size="small"
                  :label="deploymentPolicyLabel(environment.deploymentPolicy)"
                />
                <Tag
                  v-if="environment.auto && !model[environment.name]"
                  severity="secondary"
                  size="small"
                  label="Linked automatically"
                />
                <span class="text-body-xs text-(--text-muted)">{{ policyNote(environment) }}</span>
              </span>
            </template>

            <Select
              :model-value="chosen(environment)"
              size="large"
              class="w-full"
              placeholder="Select a Deployment Setting"
              :disabled="props.disabled"
              :display-value="settingName"
              @update:model-value="model[environment.name] = $event"
            >
              <Select.Trigger
                class="w-full"
                :aria-label="`Deployment Settings for ${environment.name}`"
              />
              <Select.Content>
                <Select.Option
                  v-for="option in optionsFor(environment)"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </FieldRow>
        </Item.List>
      </template>
    </CardBox>

    <p
      v-else
      class="text-body-sm text-(--text-muted)"
    >
      No domains yet. Add one and its environment is linked to Deployment Settings
      automatically.
    </p>
  </div>
</template>
