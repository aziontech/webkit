<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'

  import type { UsersTeam, UsersUser } from '../account-users.vue'
  import { displayName, roleSeverity, roleVariant, teamsLabelOf } from '../account-users-format'

  defineProps<{ pending: UsersUser | null; teamOptions: UsersTeam[] }>()

  const emit = defineEmits<{ 'edit-role': [user: UsersUser] }>()

  const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 items-center gap-(--spacing-sm)">
          <Avatar
            :label="pending ? displayName(pending) : ''"
            size="medium"
            variant="square"
          />
          <DialogTitle>{{ pending ? displayName(pending) : '' }}</DialogTitle>
        </div>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <DialogDescription>
            What this person can do comes from their role and their teams.
          </DialogDescription>
          <KeyValueList
            v-if="pending"
            :columns="2"
            aria-label="Profile"
          >
            <KeyValueList.Item label="Email">
              <span dir="ltr">{{ pending.email }}</span>
            </KeyValueList.Item>
            <KeyValueList.Item label="Role">
              <Tag
                :label="pending.role"
                :variant="roleVariant(pending.role)"
                :severity="roleSeverity(pending.role)"
                size="small"
              />
            </KeyValueList.Item>
            <KeyValueList.Item label="Teams">{{
              teamsLabelOf(teamOptions, pending.teams)
            }}</KeyValueList.Item>
            <KeyValueList.Item label="Status">{{ pending.status }}</KeyValueList.Item>
            <KeyValueList.Item label="Last active">
              <TableCellTime
                v-if="pending.lastActive"
                :value="pending.lastActive"
              />
              <span v-else>Not signed in yet</span>
            </KeyValueList.Item>
          </KeyValueList>
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Close"
            variant="outline"
            size="medium"
            @click="open = false"
          />
          <Button
            v-if="pending && !pending.owner"
            label="Edit role"
            variant="primary"
            size="medium"
            @click="emit('edit-role', pending)"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
