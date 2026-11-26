<script setup lang="ts">
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import InputGroupAddon from '@aziontech/ui/input-group-addon'
  import InputGroupRoot from '@aziontech/ui/input-group-root'
  import MultiSelect from '@aziontech/ui/multi-select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Switch from '@aziontech/ui/switch'

  import { useVariablesFormContext } from '../composables/use-variables-form'
  import {
    SCOPE_HINT,
    scopeDisplay,
    setScopeEnabled,
    visibleScopeOptions
  } from '../lib/variables-scope'

  const { formId, scopes, scopeError } = useVariablesFormContext()
</script>

<template>
  <SettingsGroup
    label="Scope"
    :hint="SCOPE_HINT"
  >
    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
      <div
        v-for="scope in scopes"
        :key="scope.type"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <InputGroupRoot
          size="large"
          :required="scope.enabled && scope.type !== 'global'"
          :invalid="scopeError(scope)"
        >
          <InputGroupAddon>
            <span class="w-20">{{ scope.label }}</span>
          </InputGroupAddon>
          <span
            v-if="scope.type === 'global'"
            class="flex h-full min-w-0 flex-1 items-center bg-(--bg-canvas) px-(--spacing-md) text-label-sm text-(--text-default)"
          >
            The entire account. Turns off by itself when another scope is on
          </span>
          <div
            v-else
            class="h-full min-w-0 flex-1"
          >
            <MultiSelect
              v-model="scope.ids"
              size="large"
              :placeholder="scope.placeholder"
              :display-value="scopeDisplay(scope)"
              :disabled="!scope.enabled"
              :required="scope.enabled && scope.type !== 'global'"
              :invalid="scopeError(scope)"
            >
              <MultiSelect.Trigger
                :aria-label="scope.placeholder"
                :aria-describedby="scopeError(scope) ? formId + '-scope-' + scope.type : undefined"
              />
              <MultiSelect.Content>
                <template #search>
                  <Input
                    v-model="scope.query"
                    size="small"
                    placeholder="Search"
                    aria-label="Search"
                  >
                    <template #leading>
                      <i
                        class="az az-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </template>
                <MultiSelect.Item
                  v-for="option in visibleScopeOptions(scope)"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
          </div>
          <InputGroupAddon>
            <Switch
              :model-value="scope.enabled"
              :disabled="scope.type === 'global'"
              :aria-label="'Enable ' + scope.label + ' scope'"
              @update:model-value="(value) => setScopeEnabled(scopes, scope, value)"
            />
          </InputGroupAddon>
        </InputGroupRoot>
        <FieldError
          v-if="scopeError(scope)"
          :id="formId + '-scope-' + scope.type"
          >Select at least one resource for this scope.</FieldError
        >
      </div>
    </div>
  </SettingsGroup>
</template>
