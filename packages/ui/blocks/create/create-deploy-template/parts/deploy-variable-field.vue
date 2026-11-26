<script setup lang="ts">
  import Checkbox from '@aziontech/ui/checkbox'
  import Field from '@aziontech/ui/field'
  import IconButton from '@aziontech/ui/icon-button'
  import InputGroupAddon from '@aziontech/ui/input-group-addon'
  import InputGroupInput from '@aziontech/ui/input-group-input'
  import InputGroupRoot from '@aziontech/ui/input-group-root'
  import Tooltip from '@aziontech/ui/tooltip'
  import { ref } from 'vue'

  import type { DeployFormVariable } from '../sample'

  export interface DeployVariableFieldProps {
    /** The variable the template asks for. */
    field: DeployFormVariable
    /** The message under the field once Deploy flags it. */
    error?: string
  }

  withDefaults(defineProps<DeployVariableFieldProps>(), { error: '' })

  const value = defineModel<string>({ default: '' })

  const revealed = ref(false)
</script>

<template>
  <Field
    :required="field.required"
    :invalid="Boolean(error)"
  >
    <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
      <p
        class="flex min-w-0 flex-col gap-(--spacing-2xs) sm:hidden"
        :data-testid="`${field.name}-key-line`"
      >
        <span class="text-label-sm text-(--text-muted)">Key</span>
        <span class="break-all text-body-sm text-(--text-default)">{{ field.variable }}</span>
      </p>
      <div class="sm:hidden">
        <Field.Label>Value</Field.Label>
      </div>
      <div class="max-sm:hidden">
        <InputGroupRoot
          size="large"
          disabled
        >
          <InputGroupAddon>
            <label
              :for="`${field.name}-key`"
              class="w-20"
            >
              Key
            </label>
          </InputGroupAddon>
          <InputGroupInput
            :id="`${field.name}-key`"
            :model-value="field.variable"
            readonly
            disabled
          />
        </InputGroupRoot>
      </div>
      <InputGroupRoot
        size="large"
        :invalid="Boolean(error)"
      >
        <div class="hidden self-stretch sm:flex">
          <InputGroupAddon>
            <span class="w-20">
              <Field.Label>Value</Field.Label>
            </span>
          </InputGroupAddon>
        </div>
        <InputGroupInput
          v-model="value"
          :type="field.secret && !revealed ? 'password' : 'text'"
          :placeholder="field.placeholder"
          autocomplete="off"
          spellcheck="false"
        />
        <Tooltip
          v-if="field.secret"
          :content="revealed ? 'Hide value' : 'Show value'"
        >
          <IconButton
            :icon="revealed ? 'az az-eye-off' : 'az az-eye'"
            variant="outline"
            size="large"
            :aria-label="revealed ? 'Hide value' : 'Show value'"
            :aria-pressed="Boolean(revealed)"
            @click="revealed = !revealed"
          />
        </Tooltip>
        <div class="hidden self-stretch sm:flex">
          <InputGroupAddon>
            <Tooltip
              :content="
                field.secret
                  ? 'The template keeps this value secret.'
                  : 'The template stores this value as plain text.'
              "
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <label :for="`${field.name}-secret`">Secret</label>
                <Checkbox
                  :model-value="field.secret"
                  disabled
                  :id="`${field.name}-secret`"
                />
                <i
                  class="az az-lock text-body-xs"
                  aria-hidden="true"
                />
              </span>
            </Tooltip>
          </InputGroupAddon>
        </div>
      </InputGroupRoot>
      <p class="text-body-xs text-(--text-muted) sm:hidden">
        {{
          field.secret
            ? 'The template keeps this value secret.'
            : 'The template stores this value as plain text.'
        }}
      </p>
    </div>
    <Field.Error v-if="error">{{ error }}</Field.Error>
  </Field>
</template>
