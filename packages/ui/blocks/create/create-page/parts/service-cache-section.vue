<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
  import NumberInput from '@aziontech/ui/number-input'
  import RadioGroup from '@aziontech/ui/radio-group'
  import SettingsRow from '@aziontech/ui/settings-row'

  import {
    browserCacheOptions,
    cacheOptions,
    MAXIMUM_TTL_DESCRIPTION
  } from '../lib/service-options'

  const browserCache = defineModel<string>('browserCache', { required: true })
  const browserMaxTtl = defineModel<number>('browserMaxTtl', { required: true })
  const cache = defineModel<string>('cache', { required: true })
  const cacheMaxTtl = defineModel<number>('cacheMaxTtl', { required: true })
</script>

<template>
  <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
    <h2 class="text-title-sm text-(--text-default)">Cache expiration policies</h2>
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            variant="stacked"
            title="Browser cache settings"
          >
            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
              <RadioGroup
                v-model="browserCache"
                variant="card"
                class="w-full"
                name="browserCache"
                aria-label="Browser cache settings"
              >
                <RadioGroup.Item
                  v-for="option in browserCacheOptions"
                  :key="option.value"
                  :value="option.value"
                  :description="option.description"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </div>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Maximum TTL"
            description="In seconds."
          >
            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
              <NumberInput
                v-model="browserMaxTtl"
                size="large"
                class="w-full"
                :min="0"
                aria-label="Browser maximum TTL in seconds"
              />
            </div>
          </SettingsRow>
          <SettingsRow
            variant="stacked"
            title="Cache Settings"
          >
            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
              <RadioGroup
                v-model="cache"
                variant="card"
                class="w-full"
                name="cache"
                aria-label="Cache Settings"
              >
                <RadioGroup.Item
                  v-for="option in cacheOptions"
                  :key="option.value"
                  :value="option.value"
                  :description="option.description"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </div>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Maximum TTL"
            :description="MAXIMUM_TTL_DESCRIPTION"
          >
            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
              <NumberInput
                v-model="cacheMaxTtl"
                size="large"
                class="w-full"
                :min="0"
                aria-label="Cache maximum TTL in seconds"
              />
            </div>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </section>
</template>
