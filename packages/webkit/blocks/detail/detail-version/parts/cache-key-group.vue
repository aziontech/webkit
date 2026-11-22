<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'

  import {
    type CacheSettingForm,
    deviceBehaviors,
    deviceGroupOptions,
    deviceGroupsLabel,
    labelOf,
    methods,
    methodsLabel,
    varyBehaviors
  } from '../detail-version-cache'

  const form = defineModel<CacheSettingForm>('form', { required: true })
</script>

<template>
  <SettingsGroup
    label="Advanced cache key"
    hint="Which parts of a request make two requests two different cached objects."
    collapsible
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
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
              v-model="form.queryStringFields"
              size="large"
              class="w-full"
              aria-label="Query string fields"
              placeholder="page, sort, lang"
              autocomplete="off"
            />
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
              v-model="form.cookieNames"
              size="large"
              class="w-full"
              aria-label="Cookie names"
              placeholder="session_id, ab_*"
              autocomplete="off"
            />
          </SettingsRow>
          <SettingsRow
            key="deviceBehavior"
            title="Adaptive delivery"
            description="Vary the cached object by the device group a request belongs to, so a phone and a desktop get different content from the same URL."
          >
            <Select
              v-model="form.deviceBehavior"
              size="large"
              class="w-full"
              :display-value="labelOf(deviceBehaviors)"
            >
              <Select.Trigger aria-label="Adaptive delivery" />
              <Select.Content>
                <Select.Item
                  v-for="option in deviceBehaviors"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            v-if="form.deviceBehavior === 'allowlist'"
            key="deviceGroups"
            title="Device groups"
            description="Groups defined on this version's Device Groups tab."
            :depth="1"
          >
            <MultiSelect
              v-model="form.deviceGroups"
              size="large"
              class="w-full"
              placeholder="Select device groups"
              :display-value="deviceGroupsLabel"
            >
              <MultiSelect.Trigger aria-label="Device groups" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="option in deviceGroupOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
