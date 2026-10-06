<script setup lang="ts">
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { computed, useId } from 'vue'

  import {
    CACHE_POLICY_TEMPLATES,
    connectorTypeFields,
    resetScratchOption
  } from '../../lib/data/application-scratch'
  import { connectorTypeOptions } from '../../lib/data/connectors'
  import FieldStack from '../form/FieldStack.vue'

  interface Props {
    errors?: Record<string, unknown>
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    errors: () => ({}),
    disabled: false
  })

  const config = defineModel({ type: Object, required: true })

  const emit = defineEmits<{
    clear: [value: unknown]
  }>()

  const cache = computed(() => config.value.cache)
  const connector = computed(() => config.value.connector)

  const connectorFields = computed(() => connectorTypeFields(connector.value.type))

  const policyOf = (template) => cache.value.policies[template.value]
  const policyPrefix = (template) => `cache.${template.value}`
  const policyKey = (template, field) => `${policyPrefix(template)}.${field.name}`

  const typeLabelId = useId()
  const typeHelpId = useId()

  const optionLabel = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const chooseType = (next) => {
    if (connector.value.type === next) return
    connector.value.type = next
    resetScratchOption(connector.value, connectorTypeFields(next))
    emit('clear', 'connector.')
  }

  const write = (part, prefix, name, value) => {
    part.values[name] = value
    emit('clear', `${prefix}.${name}`)
  }

  const toggle = (part, prefix, next) => {
    part.enabled = next
    if (!next) emit('clear', `${prefix}.`)
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <CardBox
      title="Cache Settings"
      :padded="false"
    >
      <template #content>
        <Item.List>
          <Item
            v-for="template in CACHE_POLICY_TEMPLATES"
            :key="template.value"
            size="small"
            class="flex-col items-stretch gap-0"
          >
            <div class="flex w-full items-center gap-(--spacing-md)">
              <Item.Content>
                <Item.Title>{{ template.label }}</Item.Title>
                <Item.Description>{{ template.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  :model-value="policyOf(template).enabled"
                  :aria-label="template.label"
                  :disabled="disabled"
                  @update:model-value="toggle(policyOf(template), policyPrefix(template), $event)"
                />
              </Item.Actions>
            </div>

            <div
              v-if="template.fields.length"
              :data-open="policyOf(template).enabled || null"
              class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
            >
              <div
                class="min-w-0 overflow-hidden"
                :inert="!policyOf(template).enabled"
              >
                <div class="flex flex-col gap-(--spacing-lg) pt-(--spacing-md)">
                  <FieldStack
                    v-for="field in template.fields"
                    :key="field.name"
                    :label="field.label"
                    :required="!!field.required"
                    :description="field.description"
                    :message="errors[policyKey(template, field)]"
                    message-kind="required"
                  >
                    <template #default="{ controlId, describedBy }">
                      <InputText
                        :id="controlId"
                        :model-value="policyOf(template).values[field.name] ?? ''"
                        size="large"
                        class="w-full"
                        :placeholder="field.placeholder"
                        :disabled="disabled"
                        :required="!!errors[policyKey(template, field)]"
                        :aria-describedby="describedBy"
                        @update:model-value="
                          write(policyOf(template), policyPrefix(template), field.name, $event)
                        "
                      />
                    </template>
                  </FieldStack>
                </div>
              </div>
            </div>
          </Item>
        </Item.List>
      </template>
    </CardBox>

    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item size="small">
            <Item.Content>
              <Item.Title>Add a connector</Item.Title>
              <Item.Description>
                Where the application fetches from when the cache does not already hold the answer.
                Add one now, or bind one later.
              </Item.Description>
            </Item.Content>
            <Item.Actions class="justify-end">
              <Switch
                :model-value="connector.enabled"
                aria-label="Add a connector"
                :disabled="disabled"
                @update:model-value="toggle(connector, 'connector', $event)"
              />
            </Item.Actions>
          </Item>
        </Item.List>

        <div
          :data-open="connector.enabled || null"
          class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
        >
          <div
            class="min-w-0 overflow-hidden"
            :inert="!connector.enabled"
          >
            <div
              class="flex flex-col gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-md)"
            >
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <p
                  :id="typeLabelId"
                  class="text-label-sm text-(--text-default)"
                >
                  Type
                </p>
                <BoxGridSelection
                  :model-value="connector.type"
                  :items="connectorTypeOptions"
                  :disabled="disabled"
                  :aria-labelledby="typeLabelId"
                  :aria-describedby="typeHelpId"
                  class="[&>*]:grow [&>*]:basis-(--container-3xs)"
                  @update:model-value="chooseType"
                />
                <HelperText
                  :id="typeHelpId"
                  kind="helper"
                  label="Decides what the connector is addressed by: a host, a bucket, or a region."
                />
              </div>

              <FieldStack
                v-for="field in connectorFields"
                :key="field.name"
                :label="field.label"
                :required="!!field.required"
                :description="field.description"
                :message="errors[`connector.${field.name}`]"
                message-kind="required"
              >
                <template #default="{ controlId, describedBy }">
                  <Select
                    v-if="field.kind === 'select'"
                    :model-value="connector.values[field.name] ?? ''"
                    size="large"
                    class="w-full"
                    :disabled="disabled"
                    :display-value="optionLabel(field.options)"
                    :required="!!errors[`connector.${field.name}`]"
                    :placeholder="`Select a ${field.label.toLowerCase()}`"
                    @update:model-value="write(connector, 'connector', field.name, $event)"
                  >
                    <Select.Trigger
                      :id="controlId"
                      :aria-label="field.label"
                      :aria-describedby="describedBy"
                    />
                    <Select.Content>
                      <Select.Option
                        v-for="option in field.options"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>

                  <InputText
                    v-else
                    :id="controlId"
                    :model-value="connector.values[field.name] ?? ''"
                    size="large"
                    class="w-full"
                    :placeholder="field.placeholder"
                    :disabled="disabled"
                    :required="!!errors[`connector.${field.name}`]"
                    :aria-describedby="describedBy"
                    @update:model-value="write(connector, 'connector', field.name, $event)"
                  />
                </template>
              </FieldStack>
            </div>
          </div>
        </div>
      </template>
    </CardBox>
  </div>
</template>
