<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Combobox from '@aziontech/ui/combobox'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import Field from '@aziontech/ui/field'
  import IconButton from '@aziontech/ui/icon-button'
  import Input from '@aziontech/ui/input'
  import Kbd from '@aziontech/ui/kbd'
  import PageHeader from '@aziontech/ui/page-header'
  import SaveBar from '@aziontech/ui/save-bar'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Textarea from '@aziontech/ui/textarea'
  import { toast } from '@aziontech/ui/toast'
  import { computed, reactive, ref } from 'vue'

  import { useTeamLeaveGuard } from '../composables/use-team-leave-guard'
  import { focusById, validateTeam } from '../lib/team-form'
  import TeamFormHeader from './team-form-header.vue'
  import TeamLeaveDialog from './team-leave-dialog.vue'
  import TeamPermissionsField from './team-permissions-field.vue'
  import TeamStatusGroup from './team-status-group.vue'

  const accountUsers = [
    { email: 'ava.wilson@example.com', name: 'Ava Wilson' },
    { email: 'brian.hughes@example.com', name: 'Brian Hughes' },
    { email: 'chloe.park@example.com', name: 'Chloe Park' },
    { email: 'dylan.ross@example.com', name: 'Dylan Ross' },
    { email: 'ella.grant@example.com', name: 'Ella Grant' },
    { email: 'finn.walsh@example.com', name: 'Finn Walsh' }
  ]
  const userByEmail = (email: string) => accountUsers.find((user) => user.email === email)
  const initials = (name: string): string =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')

  const saved = {
    name: 'Developers',
    description: 'Builds and ships applications and their domains.',
    active: true,
    permissions: [
      'applications.view',
      'applications.edit',
      'domains.view',
      'domains.edit',
      'metrics.view',
      'logs.view'
    ],
    members: ['ava.wilson@example.com', 'brian.hughes@example.com', 'chloe.park@example.com']
  }

  const form = reactive({ name: saved.name, description: saved.description, active: saved.active })
  const selected = ref([...saved.permissions])
  const members = ref([...saved.members])
  const errors = reactive({ name: '', permissions: '', member: '' })
  const submitting = ref(false)
  const baseline = ref(JSON.stringify(saved))
  const snapshot = () =>
    JSON.stringify({
      name: form.name,
      description: form.description,
      active: form.active,
      permissions: selected.value,
      members: members.value
    })
  const dirty = computed(() => snapshot() !== baseline.value)
  const pageEl = ref<HTMLElement | null>(null)
  const guard = useTeamLeaveGuard(
    pageEl,
    () => dirty.value,
    () => !submitting.value
  )

  const candidate = ref('')
  const candidateOptions = computed(() =>
    accountUsers
      .filter((user) => !members.value.includes(user.email))
      .map((user) => ({ value: user.email, label: user.name, description: user.email }))
  )
  const addMember = () => {
    const user = userByEmail(candidate.value)
    if (!user) {
      errors.member = candidate.value.trim()
        ? 'Choose a user of this account from the list.'
        : 'Choose a user to add.'
      focusById('team-add-member')
      return
    }
    members.value = [...members.value, user.email]
    candidate.value = ''
    errors.member = ''
  }
  const removeMember = (email: string) => {
    const index = members.value.indexOf(email)
    members.value = members.value.filter((item) => item !== email)
    const next = members.value[Math.min(index, members.value.length - 1)]
    focusById(next ? `team-member-remove-${next}` : 'team-add-member')
  }

  const deleteOpen = ref(false)
  const deleting = ref(false)
  const deleteTeam = () => {
    deleting.value = true
    setTimeout(() => {
      deleting.value = false
      deleteOpen.value = false
      toast.success(`Team "${saved.name}" deleted. Its members lost the permissions it granted.`)
    }, 700)
  }

  const submit = () => {
    if (submitting.value) return
    if (!validateTeam(form.name, selected.value, errors)) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      form.name = form.name.trim()
      baseline.value = snapshot()
      toast.success(`Team "${form.name}" updated.`)
    }, 700)
  }
  const onSaveShortcut = () => {
    if (!dirty.value || submitting.value) return
    submit()
  }

  const discard = () => {
    const last = JSON.parse(baseline.value)
    Object.assign(form, { name: last.name, description: last.description, active: last.active })
    selected.value = [...last.permissions]
    members.value = [...last.members]
    Object.assign(errors, { name: '', permissions: '', member: '' })
  }
</script>

<template>
  <div
    ref="pageEl"
    class="flex h-dvh flex-col bg-(--bg-canvas)"
  >
    <TeamFormHeader page="Edit Team" />

    <main
      class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col overflow-auto"
    >
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="edit-team-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex-1">
          <div
            class="layout-column-form layout-boundary-inline flex flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Edit Team"
              description="A team is a named set of permissions. People added to it get exactly what it grants."
              size="small"
              title-id="edit-team-title"
            />

            <fieldset
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Edit Team</legend>

              <SettingsGroup
                label="General"
                hint="The name is the only required field."
              >
                <Card>
                  <template #default>
                    <div class="flex flex-col gap-(--spacing-lg)">
                      <Field
                        required
                        :invalid="!!errors.name"
                      >
                        <Field.Label for="team-name">Name</Field.Label>
                        <Input
                          id="team-name"
                          v-model="form.name"
                          placeholder="Developers"
                          autocomplete="off"
                          @update:model-value="errors.name = ''"
                        />
                        <Field.Description
                          >Usually the role or the area the team is responsible
                          for.</Field.Description
                        >
                        <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
                      </Field>
                      <Field>
                        <Field.Label for="team-description">Description</Field.Label>
                        <Textarea
                          id="team-description"
                          v-model="form.description"
                          :rows="3"
                        />
                      </Field>
                    </div>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Members"
                :hint="`People in this team get its permissions. ${members.length} ${members.length === 1 ? 'member' : 'members'}.`"
              >
                <Card>
                  <template #default>
                    <div class="flex flex-col gap-(--spacing-md)">
                      <Field :invalid="!!errors.member">
                        <Field.Label for="team-add-member">Add member</Field.Label>
                        <div class="flex flex-wrap items-start gap-(--spacing-xs)">
                          <div class="min-w-0 grow basis-(--container-3xs)">
                            <Combobox
                              id="team-add-member"
                              v-model="candidate"
                              :options="candidateOptions"
                              :allow-custom="false"
                              :invalid="!!errors.member"
                              placeholder="Search users of this account"
                              empty-title="Everyone in this account is already a member."
                              @update:model-value="errors.member = ''"
                            />
                          </div>
                          <Button
                            type="button"
                            label="Add"
                            variant="outline"
                            size="medium"
                            icon="az az-plus"
                            @click="addMember"
                          />
                        </div>
                        <Field.Description
                          >Only users of this account can join. Invite new people from
                          Users.</Field.Description
                        >
                        <Field.Error v-if="errors.member">{{ errors.member }}</Field.Error>
                      </Field>

                      <ul
                        v-if="members.length"
                        aria-label="Members"
                        class="m-0 flex list-none flex-col overflow-hidden rounded-(--shape-control) border border-(--border-muted) p-0"
                      >
                        <li
                          v-for="email in members"
                          :key="email"
                          class="flex items-center gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-xs) first:border-t-0"
                        >
                          <Avatar
                            :label="initials(userByEmail(email)?.name ?? email)"
                            size="small"
                            variant="square"
                          />
                          <span class="flex min-w-0 flex-1 flex-col">
                            <span
                              data-member-name
                              class="truncate text-label-sm text-(--text-default)"
                              >{{ userByEmail(email)?.name ?? email }}</span
                            >
                            <span class="truncate text-body-xs text-(--text-muted)">{{
                              email
                            }}</span>
                          </span>
                          <IconButton
                            :id="`team-member-remove-${email}`"
                            icon="az az-x"
                            variant="ghost"
                            size="small"
                            :aria-label="`Remove ${userByEmail(email)?.name ?? email}`"
                            @click="removeMember(email)"
                          />
                        </li>
                      </ul>
                      <p
                        v-else
                        class="m-0 rounded-(--shape-control) border border-dashed border-(--border-muted) px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                      >
                        No members. The team grants nothing until someone joins it.
                      </p>
                    </div>
                  </template>
                </Card>
              </SettingsGroup>

              <TeamPermissionsField
                v-model="selected"
                v-model:error="errors.permissions"
              />

              <TeamStatusGroup v-model="form.active" />

              <SettingsGroup
                label="Delete team"
                hint="Members lose the permissions this team grants. Their user accounts stay."
              >
                <Card>
                  <template #default>
                    <div class="flex flex-wrap items-center justify-between gap-(--spacing-md)">
                      <p class="m-0 text-body-sm text-(--text-default)">
                        Deleting cannot be undone.
                      </p>
                      <Button
                        type="button"
                        label="Delete team"
                        variant="danger"
                        size="medium"
                        icon="az az-trash"
                        @click="deleteOpen = true"
                      />
                    </div>
                  </template>
                </Card>
              </SettingsGroup>
            </fieldset>
          </div>
        </div>

        <SaveBar
          variant="centered"
          @save="onSaveShortcut"
        >
          <template v-if="dirty">You have unsaved changes.</template>
          <template #actions>
            <Button
              key="discard"
              v-if="dirty"
              type="button"
              label="Discard"
              variant="outline"
              size="medium"
              :disabled="submitting"
              @click="discard"
            />
            <Button
              key="back"
              v-else
              type="button"
              label="Back to teams"
              variant="outline"
              size="medium"
              href="/account/teams"
            />
            <Button
              variant="primary"
              size="medium"
              type="submit"
              :disabled="!dirty"
              :loading="submitting"
              aria-keyshortcuts="Meta+S Control+S"
            >
              Save changes
              <Kbd
                meta
                size="small"
                aria-hidden="true"
                >S</Kbd
              >
            </Button>
          </template>
        </SaveBar>
      </form>
    </main>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete team"
      :description="`Delete ${saved.name}? Its ${saved.members.length} members lose the permissions it grants. Their user accounts stay.`"
      confirm-label="Delete team"
      :loading="deleting"
      size="small"
      @confirm="deleteTeam"
    />
    <TeamLeaveDialog :guard="guard" />
  </div>
</template>
