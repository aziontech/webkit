<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Field from '@aziontech/webkit/field'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import { computed } from 'vue'

  import type { UsersRole, UsersUser } from '../account-users.vue'
  import { displayName, USERS_ROLES } from '../account-users-format'

  defineProps<{ pending: UsersUser | null }>()

  const emit = defineEmits<{ save: [event: Event] }>()

  const open = defineModel<boolean>('open', { required: true })
  const nextRole = defineModel<UsersRole>('role', { required: true })

  const roleHint = computed(
    () => USERS_ROLES.find((role) => role.value === nextRole.value)?.hint ?? ''
  )
</script>

<template>
  <Dialog
    v-model:open="open"
    size="small"
  >
    <DialogContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Edit role"
        novalidate
        @submit.prevent="emit('save', $event)"
      >
        <PanelHeader class="w-full">
          <DialogTitle>Edit role</DialogTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <DialogDescription>
              Choose what {{ pending ? displayName(pending) : '' }} can do on the account. Their
              teams still decide which resources they reach.
            </DialogDescription>
            <Field>
              <Field.Label for="user-role">Role</Field.Label>
              <Select
                v-model="nextRole"
                size="large"
                class="w-full"
              >
                <Select.Trigger id="user-role" />
                <Select.Content>
                  <Select.Item
                    v-for="role in USERS_ROLES"
                    :key="role.value"
                    :value="role.value"
                  >
                    {{ role.value }}
                  </Select.Item>
                </Select.Content>
              </Select>
              <Field.Description>{{ roleHint }}</Field.Description>
            </Field>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              size="medium"
              @click="open = false"
            />
            <Button
              type="submit"
              label="Save role"
              variant="primary"
              size="medium"
            />
          </div>
        </PanelFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
