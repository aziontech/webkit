<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import NumberInput from '@aziontech/webkit/number-input'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'

  import { browserBehaviors, type CacheSettingForm, labelOf } from '../detail-version-cache'

  const form = defineModel<CacheSettingForm>('form', { required: true })
</script>

<template>
  <SettingsGroup
    label="Browser cache"
    hint="How long the visitor's browser may reuse a response before asking again."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            key="browserBehavior"
            title="Behavior"
            description="Honoring the origin passes its Cache-Control through. Overriding replaces it with the time set here."
          >
            <Select
              v-model="form.browserBehavior"
              size="large"
              class="w-full"
              :display-value="labelOf(browserBehaviors)"
            >
              <Select.Trigger aria-label="Browser cache behavior" />
              <Select.Content>
                <Select.Item
                  v-for="option in browserBehaviors"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            v-if="form.browserBehavior === 'override'"
            key="browserMaxAge"
            title="Maximum TTL in seconds"
            description="Up to 31536000 seconds, one year."
            :depth="1"
          >
            <NumberInput
              v-model="form.browserMaxAge"
              size="large"
              class="w-full"
              :min="0"
              :max="31536000"
              aria-label="Browser maximum TTL in seconds"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
