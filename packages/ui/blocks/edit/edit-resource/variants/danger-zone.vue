<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import Item from '@aziontech/ui/item'
  import Link from '@aziontech/ui/link'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import { onBeforeUnmount, ref } from 'vue'

  import EditResource from '../edit-resource.vue'
  import { sampleProject } from '../sample'

  const saving = ref(false)
  const deleteOpen = ref(false)
  const deleting = ref(false)
  let saveTimer: ReturnType<typeof setTimeout> | undefined
  let deleteTimer: ReturnType<typeof setTimeout> | undefined

  const onSubmit = () => {
    saving.value = true
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saving.value = false
    }, 900)
  }

  const confirmDelete = () => {
    if (deleting.value) return
    deleting.value = true
    deleteTimer = setTimeout(() => {
      deleting.value = false
      deleteOpen.value = false
    }, 900)
  }

  onBeforeUnmount(() => {
    clearTimeout(saveTimer)
    clearTimeout(deleteTimer)
  })
</script>

<template>
  <EditResource
    :loading="saving"
    @submit="onSubmit"
  >
    <template #sections>
      <SettingsGroup
        label="Danger zone"
        hint="Actions that cannot be undone."
        anchor="danger-zone"
      >
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                title="Delete this project"
                description="Once deleted, the project, its domains and its deployments cannot be recovered."
                variant="compact"
              >
                <Button
                  type="button"
                  label="Delete project"
                  variant="danger"
                  size="medium"
                  icon="az az-trash"
                  data-testid="danger-zone-delete"
                  @click="deleteOpen = true"
                />
              </SettingsRow>
            </Item.List>
          </template>
        </Card>
      </SettingsGroup>

      <ConfirmDialog
        v-model:open="deleteOpen"
        title="Delete project"
        size="medium"
        confirm-label="Delete project"
        :confirmation-phrase="sampleProject.name"
        :loading="deleting"
        @confirm="confirmDelete"
      >
        <div class="flex flex-col gap-(--spacing-md)">
          <Alert
            severity="warning"
            label="Once confirmed, this action can't be reversed."
          />
          <p class="m-0 text-body-sm text-(--text-muted)">
            The project will be deleted, along with its domains and every deployment it has
            published. Traffic to its domains stops. Check the
            <Link
              href="https://example.com/docs/projects/delete"
              inline
              >Help Center</Link
            >
            for more details.
          </p>
        </div>
      </ConfirmDialog>
    </template>
  </EditResource>
</template>
