<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Field from '@aziontech/ui/field'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Switch from '@aziontech/ui/switch'

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
