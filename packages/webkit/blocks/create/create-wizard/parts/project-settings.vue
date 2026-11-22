<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed } from 'vue'

  import { labelFor, type ServiceWizardScratch } from '../lib/service-wizard'
  import { cachePolicies, originFieldsByType, originTypes } from '../sample'

  export interface ProjectSettingsProps {
    /** Use an existing project or create one. */
    projectMode: string
    /** The messages of the fields Next flagged, keyed by field path. */
    errors: Record<string, string>
  }

  defineProps<ProjectSettingsProps>()

  /** The cache and origin settings of a new project. */
  const scratch = defineModel<ServiceWizardScratch>('scratch', { required: true })

  const originFields = computed(() => originFieldsByType[scratch.value.origin.type])
</script>

<template>
  <div
    v-if="projectMode === 'new'"
    class="flex min-w-0 flex-col gap-(--layout-section-gap)"
  >
    <Card
      title="Cache Settings"
      :padded="false"
    >
      <template #default>
        <Item.List>
          <Item
            v-for="policy in cachePolicies"
            :key="policy.value"
            size="small"
          >
            <div class="flex w-full flex-col items-stretch">
              <div class="flex w-full items-center gap-(--spacing-md)">
                <Item.Content>
                  <Item.Title>{{ policy.label }}</Item.Title>
                  <Item.Description>{{ policy.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <Switch
                    v-model="scratch.cache[policy.value].enabled"
                    :aria-label="policy.label"
                  />
                </Item.Actions>
              </div>

              <div
                v-if="policy.fields.length"
                :data-state="scratch.cache[policy.value].enabled ? 'open' : 'closed'"
                class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
              >
                <div
                  class="min-w-0 overflow-hidden"
                  :inert="!scratch.cache[policy.value].enabled"
                >
                  <div class="flex flex-col gap-(--spacing-lg) pt-(--spacing-md)">
                    <template
                      v-for="field in policy.fields"
                      :key="field.name"
                    >
                      <Field
                        required
                        :invalid="!!errors['cache.' + policy.value + '.' + field.name]"
                      >
                        <Field.Label>{{ field.label }}</Field.Label>
                        <Input
                          v-model="scratch.cache[policy.value].values[field.name]"
                          size="large"
                          :placeholder="field.placeholder"
                        />
                        <Field.Description
                          v-if="
                            errors['cache.' + policy.value + '.' + field.name] || field.description
                          "
                          >{{
                            errors['cache.' + policy.value + '.' + field.name] || field.description
                          }}</Field.Description
                        >
                      </Field>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </Item>
        </Item.List>
      </template>
    </Card>

    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Add an origin"
            description="Where the project fetches from when the cache does not already hold the answer. Add one now, or bind one later."
            variant="compact"
          >
            <Switch
              v-model="scratch.origin.enabled"
              aria-label="Add an origin"
            />
          </SettingsRow>
        </Item.List>

        <div
          :data-state="scratch.origin.enabled ? 'open' : 'closed'"
          class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
        >
          <div
            class="min-w-0 overflow-hidden"
            :inert="!scratch.origin.enabled"
          >
            <div
              class="flex flex-col gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-md)"
            >
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <p
                  id="origin-type-label"
                  class="text-label-sm text-(--text-default)"
                >
                  Type
                </p>
                <RadioGroup
                  v-model="scratch.origin.type"
                  variant="card"
                  orientation="horizontal"
                  :options="originTypes"
                  aria-labelledby="origin-type-label"
                  aria-describedby="origin-type-help"
                />
                <FieldDescription id="origin-type-help"
                  >Decides what the origin is addressed by: a host, a storage location, or a
                  region.</FieldDescription
                >
              </div>

              <template
                v-for="field in originFields"
                :key="field.name"
              >
                <Field
                  key="field-1"
                  v-if="field.kind === 'select'"
                  :data-field-invalid="!!errors['origin.' + field.name] || null"
                  required
                  :invalid="!!errors['origin.' + field.name]"
                >
                  <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                    <Field.Label :for="'origin-' + field.name">{{ field.label }}</Field.Label>
                  </div>
                  <Select
                    v-model="scratch.origin.values[field.name]"
                    size="large"
                    class="w-full"
                    :display-value="labelFor(field.options)"
                    required
                    :invalid="!!errors['origin.' + field.name]"
                    :placeholder="'Select a ' + field.label.toLowerCase()"
                  >
                    <Select.Trigger
                      :id="'origin-' + field.name"
                      :aria-label="field.label"
                      :aria-describedby="'origin-' + field.name + '-helper'"
                    />
                    <Select.Content>
                      <Select.Item
                        v-for="option in field.options"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                  <FieldError :id="'origin-' + field.name + '-helper'">
                    {{ errors['origin.' + field.name] || field.description }}
                  </FieldError>
                </Field>
                <Field
                  key="field-2"
                  v-else
                  required
                  :invalid="!!errors['origin.' + field.name]"
                >
                  <Field.Label>{{ field.label }}</Field.Label>
                  <Input
                    v-model="scratch.origin.values[field.name]"
                    size="large"
                    :placeholder="field.placeholder"
                  />
                  <Field.Description v-if="errors['origin.' + field.name] || field.description">{{
                    errors['origin.' + field.name] || field.description
                  }}</Field.Description>
                </Field>
              </template>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
