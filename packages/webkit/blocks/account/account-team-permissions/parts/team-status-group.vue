<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Switch from '@aziontech/webkit/switch'

  const active = defineModel<boolean>({ required: true })
</script>

<template>
  <SettingsGroup
    label="Status"
    hint="Inactive teams keep their permissions but grant nothing to their members."
  >
    <Card>
      <template #default>
        <Field orientation="horizontal">
          <Field.Label>
            <span class="text-label-md">Active</span>
          </Field.Label>
          <Switch v-model="active" />
        </Field>
      </template>
    </Card>
  </SettingsGroup>
</template>
