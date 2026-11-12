<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Combobox from '@aziontech/webkit/combobox'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'

  const groups = [
    {
      label: 'Applications',
      resources: [
        { key: 'applications', label: 'Applications' },
        { key: 'domains', label: 'Domains' }
      ]
    },
    {
      label: 'Security',
      resources: [
        { key: 'firewall', label: 'Firewall' },
        { key: 'certificates', label: 'Certificates' }
      ]
    },
    { label: 'Storage', resources: [{ key: 'storage', label: 'Storage' }] },
    {
      label: 'Observability',
      resources: [
        { key: 'metrics', label: 'Metrics', only: 'view' },
        { key: 'logs', label: 'Logs', only: 'view' }
      ]
    },
    { label: 'Billing', resources: [{ key: 'billing', label: 'Billing' }] },
    {
      label: 'Account',
      resources: [
        { key: 'users', label: 'Users' },
        { key: 'tokens', label: 'Personal tokens', only: 'edit' }
      ]
    }
  ]

  const ACTIONS = ['view', 'edit']
  const permissionsOf = (resource) =>
    ACTIONS.filter((action) => !resource.only || resource.only === action).map(
      (action) => `${resource.key}.${action}`
    )
  const groupIds = (group) => group.resources.flatMap(permissionsOf)
  const allIds = groups.flatMap(groupIds)

  const accountUsers = [
    { email: 'ana.ribeiro@example.com', name: 'Ana Ribeiro' },
    { email: 'bruno.costa@example.com', name: 'Bruno Costa' },
    { email: 'carla.mendes@example.com', name: 'Carla Mendes' },
    { email: 'diego.alves@example.com', name: 'Diego Alves' },
    { email: 'elisa.prado@example.com', name: 'Elisa Prado' },
    { email: 'felipe.souza@example.com', name: 'Felipe Souza' }
  ]
  const userByEmail = (email) => accountUsers.find((user) => user.email === email)
  const initials = (name) =>
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
    members: ['ana.ribeiro@example.com', 'bruno.costa@example.com', 'carla.mendes@example.com']
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
  const removeMember = (email) => {
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

  const has = (resource, action) => permissionsOf(resource).includes(`${resource.key}.${action}`)

  const isChecked = (id) => selected.value.includes(id)
  const setChecked = (id, checked) => {
    const next = new Set(selected.value)
    if (checked) next.add(id)
    else next.delete(id)
    const [key, action] = id.split('.')
    if (checked && action === 'edit') next.add(`${key}.view`)
    if (!checked && action === 'view') next.delete(`${key}.edit`)
    selected.value = allIds.filter((item) => next.has(item))
    errors.permissions = ''
  }

  const groupState = (group) => {
    const ids = groupIds(group)
    const count = ids.filter(isChecked).length
    return { all: count === ids.length, some: count > 0 && count < ids.length }
  }
  const toggleGroup = (group, checked) => {
    const ids = new Set(groupIds(group))
    selected.value = checked
      ? allIds.filter((id) => ids.has(id) || isChecked(id))
      : selected.value.filter((id) => !ids.has(id))
    errors.permissions = ''
  }

  const query = ref('')
  const visibleGroups = computed(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return groups
    return groups
      .map((group) => ({
        ...group,
        resources: group.label.toLowerCase().includes(needle)
          ? group.resources
          : group.resources.filter((resource) => resource.label.toLowerCase().includes(needle))
      }))
      .filter((group) => group.resources.length)
  })

  const selectAll = () => {
    selected.value = [...allIds]
    errors.permissions = ''
  }
  const clearAll = () => {
    selected.value = []
  }

  const focusById = (id) => nextTick(() => document.getElementById(id)?.focus())

  const submit = () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.permissions = selected.value.length ? '' : 'Select at least one permission.'
    if (errors.name) {
      focusById('team-name')
      return
    }
    if (errors.permissions) {
      focusById('team-permissions-filter')
      return
    }
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      form.name = form.name.trim()
      baseline.value = snapshot()
      toast.success(`Team "${form.name}" updated.`)
    }, 700)
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
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 flex-col">
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

              <SettingsSection
                title="General"
                hint="The name is the only required field."
              >
                <Card>
                  <template #content>
                    <div class="flex flex-col gap-(--spacing-lg)">
                      <Field :required="!!errors.name">
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
              </SettingsSection>

              <SettingsSection
                title="Members"
                :hint="`People in this team get its permissions. ${members.length} ${members.length === 1 ? 'member' : 'members'}.`"
              >
                <Card>
                  <template #content>
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
                              empty-text="Everyone in this account is already a member."
                              @update:model-value="errors.member = ''"
                            />
                          </div>
                          <Button
                            type="button"
                            label="Add"
                            kind="outlined"
                            size="medium"
                            icon="pi pi-plus"
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
                        class="m-0 flex list-none flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-muted) p-0"
                      >
                        <li
                          v-for="email in members"
                          :key="email"
                          class="flex items-center gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-xs) first:border-t-0"
                        >
                          <Avatar
                            :label="initials(userByEmail(email)?.name ?? email)"
                            size="small"
                            kind="square"
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
                            icon="pi pi-times"
                            kind="transparent"
                            size="small"
                            :aria-label="`Remove ${userByEmail(email)?.name ?? email}`"
                            @click="removeMember(email)"
                          />
                        </li>
                      </ul>
                      <p
                        v-else
                        class="m-0 rounded-(--shape-elements) border border-dashed border-(--border-muted) px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                      >
                        No members. The team grants nothing until someone joins it.
                      </p>
                    </div>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Permissions"
                :hint="`What this team can see and change. ${selected.length} of ${allIds.length} selected.`"
              >
                <Card>
                  <template #content>
                    <div class="flex flex-col gap-(--spacing-md)">
                      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                        <div class="min-w-0 grow basis-(--container-3xs)">
                          <Input
                            id="team-permissions-filter"
                            v-model="query"
                            placeholder="Filter permissions"
                            aria-label="Filter permissions"
                            class="w-full"
                          >
                            <template #iconLeft>
                              <i
                                class="pi pi-search"
                                aria-hidden="true"
                              />
                            </template>
                          </Input>
                        </div>
                        <Button
                          type="button"
                          label="Select all"
                          kind="outlined"
                          size="medium"
                          @click="selectAll"
                        />
                        <Button
                          type="button"
                          label="Clear"
                          kind="text"
                          size="medium"
                          @click="clearAll"
                        />
                      </div>

                      <Alert
                        v-if="errors.permissions"
                        severity="danger"
                        size="small"
                        :label="errors.permissions"
                      />

                      <div
                        class="overflow-x-auto rounded-(--shape-elements) border border-(--border-muted)"
                      >
                        <table class="w-full border-collapse text-start">
                          <caption class="sr-only">
                            Permissions granted by this team
                          </caption>
                          <thead>
                            <tr class="bg-(--bg-surface-raised)">
                              <th
                                scope="col"
                                class="px-(--spacing-md) py-(--spacing-xs) text-start text-label-sm text-(--text-muted)"
                              >
                                Resource
                              </th>
                              <th
                                scope="col"
                                class="w-20 px-(--spacing-xs) py-(--spacing-xs) text-center text-label-sm text-(--text-muted)"
                              >
                                View
                              </th>
                              <th
                                scope="col"
                                class="w-20 px-(--spacing-xs) py-(--spacing-xs) text-center text-label-sm text-(--text-muted)"
                              >
                                Edit
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            v-for="group in visibleGroups"
                            :key="group.label"
                          >
                            <tr class="border-t border-(--border-muted)">
                              <th
                                scope="rowgroup"
                                colspan="3"
                                class="px-(--spacing-md) py-(--spacing-xs) text-start"
                              >
                                <Field orientation="horizontal">
                                  <Checkbox
                                    binary
                                    :model-value="groupState(group).all"
                                    :indeterminate="groupState(group).some"
                                    @update:model-value="(checked) => toggleGroup(group, checked)"
                                  />
                                  <Field.Label>
                                    <span class="text-label-md">{{ group.label }}</span>
                                  </Field.Label>
                                </Field>
                              </th>
                            </tr>
                            <tr
                              v-for="resource in group.resources"
                              :key="resource.key"
                              class="border-t border-(--border-muted)"
                            >
                              <th
                                scope="row"
                                class="ps-(--spacing-xxl) pe-(--spacing-md) py-(--spacing-xs) text-start text-body-sm font-normal text-(--text-default)"
                              >
                                {{ resource.label }}
                              </th>
                              <td
                                v-for="action in ACTIONS"
                                :key="action"
                                class="px-(--spacing-xs) py-(--spacing-xs) text-center"
                              >
                                <Checkbox
                                  v-if="has(resource, action)"
                                  binary
                                  :model-value="isChecked(`${resource.key}.${action}`)"
                                  :aria-label="`${action === 'view' ? 'View' : 'Edit'} ${resource.label}`"
                                  @update:model-value="
                                    (checked) => setChecked(`${resource.key}.${action}`, checked)
                                  "
                                />
                                <span
                                  v-else
                                  class="text-body-sm text-(--text-muted)"
                                  >–<span class="sr-only">Not available</span></span
                                >
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p
                          v-if="!visibleGroups.length"
                          class="px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                        >
                          No permission matches “{{ query }}”.
                        </p>
                      </div>
                      <p class="text-body-xs text-(--text-muted)">
                        Edit includes View: checking Edit checks View, and clearing View clears
                        Edit.
                      </p>
                    </div>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Status"
                hint="Inactive teams keep their permissions but grant nothing to their members."
              >
                <Card>
                  <template #content>
                    <Field orientation="horizontal">
                      <Field.Label>
                        <span class="text-label-md">Active</span>
                      </Field.Label>
                      <Switch v-model="form.active" />
                    </Field>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Delete team"
                hint="Members lose the permissions this team grants. Their user accounts stay."
              >
                <Card>
                  <template #content>
                    <div class="flex flex-wrap items-center justify-between gap-(--spacing-md)">
                      <p class="m-0 text-body-sm text-(--text-default)">
                        Deleting cannot be undone.
                      </p>
                      <Button
                        type="button"
                        label="Delete team"
                        kind="danger"
                        size="medium"
                        icon="pi pi-trash"
                        @click="deleteOpen = true"
                      />
                    </div>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>
        </div>

        <SaveBar kind="plain">
          <template v-if="dirty">You have unsaved changes.</template>
          <template #actions>
            <Button
              key="discard"
              v-if="dirty"
              type="button"
              label="Discard"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="discard"
            />
            <Button
              key="back"
              v-else
              type="button"
              label="Back to teams"
              kind="outlined"
              size="medium"
              href="/account/teams"
            />
            <Button
              label="Save changes"
              kind="primary"
              size="medium"
              type="submit"
              :disabled="!dirty"
              :loading="submitting"
            />
          </template>
        </SaveBar>
      </form>
    </div>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete team"
      :description="`Delete ${saved.name}? Its ${saved.members.length} members lose the permissions it grants. Their user accounts stay.`"
      confirm-label="Delete team"
      :loading="deleting"
      @confirm="deleteTeam"
    />

    <Toaster position="bottom-right" />
  </div>
</template>
