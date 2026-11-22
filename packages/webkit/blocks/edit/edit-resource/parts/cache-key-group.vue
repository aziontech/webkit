<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'

  import {
    sampleCacheMethods as methods,
    sampleCacheVaryBehaviors as varyBehaviors
  } from '../sample'
  import { useCacheSettingsContext } from '../use-cache-settings'

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? value
  const methodsLabel = (values: unknown[] | undefined) => (values?.length ? values.join(', ') : '')

  const { form, saving, errors, clear } = useCacheSettingsContext()
</script>

<template>
  <SettingsGroup
    label="Advanced cache key"
    hint="Which parts of a request make two requests two different cached objects."
    anchor="cache-key"
    collapsible
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="varyByMethod"
              title="Cache by HTTP method"
              description="GET and HEAD are always cached. Adding POST or OPTIONS puts the request body in the cache key."
            >
              <MultiSelect
                v-model="form.varyByMethod"
                size="large"
                class="w-full"
                placeholder="GET and HEAD only"
                :display-value="methodsLabel"
                :disabled="saving"
              >
                <MultiSelect.Trigger aria-label="Cache by HTTP method" />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="option in methods"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </MultiSelect.Item>
                </MultiSelect.Content>
              </MultiSelect>
            </SettingsRow>
            <SettingsRow
              key="queryStringBehavior"
              title="Cache by query string"
            >
              <Select
                v-model="form.queryStringBehavior"
                size="large"
                class="w-full"
                :display-value="labelOf(varyBehaviors)"
                :disabled="saving"
              >
                <Select.Trigger aria-label="Cache by query string" />
                <Select.Content>
                  <Select.Item
                    v-for="option in varyBehaviors"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <SettingsRow
              v-if="['allowlist', 'denylist'].includes(form.queryStringBehavior)"
              key="queryStringFields"
              title="Query string fields"
              description="Comma separated and case sensitive: utm_source and UTM_SOURCE are two fields."
              :depth="1"
            >
              <Input
                id="cache-queryStringFields"
                v-model="form.queryStringFields"
                size="large"
                class="w-full"
                aria-label="Query string fields"
                placeholder="page, sort, lang"
                autocomplete="off"
                required
                :invalid="!!errors.queryStringFields"
                :aria-describedby="
                  errors.queryStringFields ? 'cache-queryStringFields-message' : undefined
                "
                :disabled="saving"
                @update:model-value="clear('queryStringFields')"
              />
              <FieldError
                v-if="errors.queryStringFields"
                id="cache-queryStringFields-message"
                >{{ errors.queryStringFields.message }}</FieldError
              >
            </SettingsRow>
            <SettingsRow
              key="cookieBehavior"
              title="Cache by cookies"
            >
              <Select
                v-model="form.cookieBehavior"
                size="large"
                class="w-full"
                :display-value="labelOf(varyBehaviors)"
                :disabled="saving"
              >
                <Select.Trigger aria-label="Cache by cookies" />
                <Select.Content>
                  <Select.Item
                    v-for="option in varyBehaviors"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <SettingsRow
              v-if="['allowlist', 'denylist'].includes(form.cookieBehavior)"
              key="cookieNames"
              title="Cookie names"
              description="Comma separated. A name ending in * matches every cookie that starts with it."
              :depth="1"
            >
              <Input
                id="cache-cookieNames"
                v-model="form.cookieNames"
                size="large"
                class="w-full"
                aria-label="Cookie names"
                placeholder="session_id, ab_*"
                autocomplete="off"
                required
                :invalid="!!errors.cookieNames"
                :aria-describedby="errors.cookieNames ? 'cache-cookieNames-message' : undefined"
                :disabled="saving"
                @update:model-value="clear('cookieNames')"
              />
              <FieldError
                v-if="errors.cookieNames"
                id="cache-cookieNames-message"
                >{{ errors.cookieNames.message }}</FieldError
              >
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
