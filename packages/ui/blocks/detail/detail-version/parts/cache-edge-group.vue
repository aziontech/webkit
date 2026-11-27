<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
  import NumberInput from '@aziontech/ui/number-input'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'

  import {
    type CacheSettingForm,
    edgeBehaviors,
    labelOf,
    topologies
  } from '../detail-version-cache'

  const form = defineModel<CacheSettingForm>('form', { required: true })
</script>

<template>
  <SettingsGroup
    label="Edge cache"
    hint="How long the edge may serve a stored response before it asks the origin again."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            key="edgeBehavior"
            title="Behavior"
            description="Overriding sets the time the edge keeps each object, from 60 seconds up."
          >
            <Select
              v-model="form.edgeBehavior"
              size="large"
              class="w-full"
              :display-value="labelOf(edgeBehaviors)"
            >
              <Select.Trigger aria-label="Edge cache behavior" />
              <Select.Content>
                <Select.Item
                  v-for="option in edgeBehaviors"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            v-if="form.edgeBehavior === 'override'"
            key="edgeMaxAge"
            title="Maximum TTL in seconds"
            description="From 60 to 31536000 seconds."
            :depth="1"
          >
            <NumberInput
              v-model="form.edgeMaxAge"
              size="large"
              class="w-full"
              :min="60"
              :max="31536000"
              aria-label="Edge maximum TTL in seconds"
            />
          </SettingsRow>
          <SettingsRow
            key="staleCache"
            title="Stale cache"
            description="Keep serving the expired object while the origin is unreachable, instead of answering with an error."
            variant="compact"
          >
            <Switch
              v-model="form.staleCache"
              aria-label="Stale cache"
            />
          </SettingsRow>
          <SettingsRow
            key="largeFileCache"
            title="Large file optimization"
            description="Fetch and cache large objects in fragments, so a partial request does not wait for the whole file."
            variant="compact"
          >
            <Switch
              v-model="form.largeFileCache"
              aria-label="Large file optimization"
            />
          </SettingsRow>
          <SettingsRow
            v-if="form.largeFileCache"
            key="largeFileOffset"
            title="Fragment size in kB"
            description="Each fragment requested from the origin. 1024 kB is the default."
            :depth="1"
          >
            <NumberInput
              v-model="form.largeFileOffset"
              size="large"
              class="w-full"
              :min="1"
              aria-label="Fragment size in kilobytes"
            />
          </SettingsRow>
          <SettingsRow
            key="tieredCache"
            title="Tiered cache"
            description="Add a second cache layer between the edge and your origin, so an edge miss can still be answered without reaching it."
            variant="compact"
          >
            <Switch
              v-model="form.tieredCache"
              aria-label="Tiered cache"
            />
          </SettingsRow>
          <SettingsRow
            v-if="form.tieredCache"
            key="tieredTopology"
            title="Topology"
            description="Where the second layer sits. Pin a region only when the origin is fixed to one."
            :depth="1"
          >
            <Select
              v-model="form.tieredTopology"
              size="large"
              class="w-full"
              :display-value="labelOf(topologies)"
            >
              <Select.Trigger aria-label="Tiered cache topology" />
              <Select.Content>
                <Select.Item
                  v-for="option in topologies"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
