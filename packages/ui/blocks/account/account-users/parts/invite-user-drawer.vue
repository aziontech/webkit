<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerDescription from '@aziontech/ui/drawer-description'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import MultiSelect from '@aziontech/ui/multi-select'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Select from '@aziontech/ui/select'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import type { UsersInvitation, UsersRole, UsersTeam } from '../account-users.vue'
  import { teamsLabelOf, USERS_ROLES } from '../account-users-format'

  const props = defineProps<{ teamOptions: UsersTeam[]; emails: string[] }>()

  const emit = defineEmits<{ send: [event: Event, invitation: UsersInvitation] }>()

  const open = defineModel<boolean>('open', { required: true })

  const invite = reactive<{ email: string; role: Exclude<UsersRole, 'Owner'>; teams: string[] }>({
    email: '',
    role: 'Developer',
    teams: ['developers']
  })
  const roleHint = computed(
    () => USERS_ROLES.find((role) => role.value === invite.role)?.hint ?? ''
  )
  const submitted = ref(false)
  const formEl = ref<HTMLFormElement | null>(null)
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const errors = computed<{ email?: string; teams?: string }>(() => {
    if (!submitted.value) return {}
    const email = invite.email.trim().toLowerCase()
    const out: { email?: string; teams?: string } = {}
    if (!email) out.email = 'Enter the email address to invite.'
    else if (!EMAIL.test(email)) out.email = 'Enter an email address like name@example.com.'
    else if (props.emails.includes(email)) out.email = 'This person is already in the account.'
    if (!invite.teams.length) out.teams = 'Choose at least one team, or they get no access.'
    return out
  })

  watch(open, (now) => {
    if (!now) return
    invite.email = ''
    invite.role = 'Developer'
    invite.teams = ['developers']
    submitted.value = false
  })

  const sendInvite = (event: Event) => {
    submitted.value = true
    if (Object.keys(errors.value).length) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    emit('send', event, {
      email: invite.email.trim().toLowerCase(),
      role: invite.role,
      teams: [...invite.teams]
    })
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    side="end"
    size="large"
  >
    <DrawerContent>
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Invite User"
        novalidate
        @submit.prevent="sendInvite"
      >
        <PanelHeader class="w-full">
          <DrawerTitle>Invite User</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
            <legend class="sr-only">Invite User</legend>
            <DrawerDescription>
              They get an email with a link to join this account. Their role decides what they can
              do on the account; their teams decide which resources they reach.
            </DrawerDescription>
            <Field
              required
              :invalid="Boolean(errors.email)"
            >
              <Field.Label for="invite-email">Email</Field.Label>
              <Input
                id="invite-email"
                v-model="invite.email"
                type="email"
                size="large"
                autocomplete="off"
                placeholder="name@example.com"
              />
              <Field.Error v-if="errors.email">{{ errors.email }}</Field.Error>
            </Field>
            <Field required>
              <Field.Label for="invite-role">Role</Field.Label>
              <Select
                v-model="invite.role"
                size="large"
                class="w-full"
              >
                <Select.Trigger id="invite-role" />
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
            <Field
              required
              :invalid="Boolean(errors.teams)"
            >
              <Field.Label for="invite-teams">Teams</Field.Label>
              <MultiSelect
                v-model="invite.teams"
                size="large"
                class="w-full"
                placeholder="Choose teams"
                :display-value="() => teamsLabelOf(teamOptions, invite.teams)"
              >
                <MultiSelect.Trigger
                  id="invite-teams"
                  aria-label="Teams"
                />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="team in teamOptions"
                    :key="team.value"
                    :value="team.value"
                  >
                    {{ team.label }}
                  </MultiSelect.Item>
                </MultiSelect.Content>
              </MultiSelect>
              <Field.Description v-if="!errors.teams"
                >Permissions add up across teams. Change them later from the
                list.</Field.Description
              >
              <Field.Error v-else>{{ errors.teams }}</Field.Error>
            </Field>
          </fieldset>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              @click="open = false"
            />
            <Button
              type="submit"
              label="Send invitation"
              variant="primary"
              icon="az az-send"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
