<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'

  import {
    sampleDataStreamScopes as scopeOptions,
    sampleDataStreamSources as sourceOptions
  } from '../sample'
  import { useDataStreamContext } from '../use-data-stream'

  const { form, errors, saving, clear } = useDataStreamContext()

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''
  const sourceLabel = labelOf(sourceOptions)
</script>

<template>
  <SettingsGroup
    label="Source"
    hint="Which records the stream collects, and from which workloads."
    anchor="source"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="source"
              title="Data source"
              description="The product the records are collected from."
            >
              <Select
                v-model="form.source"
                size="large"
                class="w-full"
                :display-value="sourceLabel"
                :readonly="saving"
                @update:model-value="clear('source')"
              >
                <Select.Trigger aria-label="Data source" />
                <Select.Content>
                  <Select.Item
                    v-for="option in sourceOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <SettingsRow
              key="scope"
              title="Workloads"
              variant="stacked"
            >
              <RadioGroup
                v-model="form.scope"
                variant="card"
                name="data-stream-scope"
                aria-label="Workloads"
                :readonly="saving"
              >
                <RadioGroup.Item
                  v-for="option in scopeOptions"
                  :key="option.value"
                  :value="option.value"
                  :description="option.description"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </SettingsRow>
            <SettingsRow
              v-if="form.scope === 'filtered'"
              key="workloads"
              title="Selected workloads"
              description="One workload per line. Only their records are sent to the destination."
              variant="stacked"
            >
              <Textarea
                id="data-stream-workloads"
                v-model="form.workloads"
                class="w-full"
                :rows="4"
                aria-label="Selected workloads"
                placeholder="storefront&#10;checkout-api"
                required
                :invalid="!!errors.workloads"
                :aria-describedby="errors.workloads ? 'data-stream-workloads-message' : undefined"
                :readonly="saving"
                @update:model-value="clear('workloads')"
              />
              <FieldError
                v-if="errors.workloads"
                id="data-stream-workloads-message"
                >{{ errors.workloads.message }}</FieldError
              >
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
