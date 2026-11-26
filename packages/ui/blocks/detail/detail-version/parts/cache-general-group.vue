<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'

  import type { CacheSettingForm } from '../detail-version-cache'

  export interface CacheGeneralGroupProps {
    /** The name error, or an empty string. */
    nameError: string
  }

  defineProps<CacheGeneralGroupProps>()

  const form = defineModel<CacheSettingForm>('form', { required: true })
</script>

<template>
  <SettingsGroup
    label="General"
    hint="Names the cache setting in the rules that reference it."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Name"
            description="What the Set cache policy behavior of a rule picks from its list."
          >
            <Input
              v-model="form.name"
              size="large"
              class="w-full"
              aria-label="Name"
              placeholder="static-assets"
              autocomplete="off"
              required
              :invalid="!!nameError"
              :aria-describedby="nameError ? 'cache-setting-name-message' : undefined"
            />
            <FieldError
              v-if="nameError"
              id="cache-setting-name-message"
              >{{ nameError }}</FieldError
            >
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
