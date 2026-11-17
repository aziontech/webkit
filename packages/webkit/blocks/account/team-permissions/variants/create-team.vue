<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'

  type PermissionAction = 'view' | 'edit'

  interface PermissionResource {
    key: string
    label: string
    only?: PermissionAction
  }

  interface PermissionGroup {
    label: string
    resources: PermissionResource[]
  }

  const breadcrumb = [
    { label: 'Teams and permissions', href: '/account/teams' },
    { label: 'Create Team' }
  ]

  const groups: PermissionGroup[] = [
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

  const ACTIONS: PermissionAction[] = ['view', 'edit']
  const permissionsOf = (resource: PermissionResource): string[] =>
    ACTIONS.filter((action) => !resource.only || resource.only === action).map(
      (action) => `${resource.key}.${action}`
    )
  const groupIds = (group: PermissionGroup): string[] => group.resources.flatMap(permissionsOf)
  const allIds = groups.flatMap(groupIds)

  const form = reactive({ name: '', description: '', active: true })
  const selected = ref<string[]>(['applications.view', 'domains.view', 'metrics.view'])
  const errors = reactive({ name: '', permissions: '' })
  const submitting = ref(false)

  const has = (resource: PermissionResource, action: PermissionAction) =>
    permissionsOf(resource).includes(`${resource.key}.${action}`)

  const isChecked = (id: string) => selected.value.includes(id)
  const setChecked = (id: string, checked: boolean) => {
    const next = new Set(selected.value)
    if (checked) next.add(id)
    else next.delete(id)
    const [key, action] = id.split('.')
    if (checked && action === 'edit') next.add(`${key}.view`)
    if (!checked && action === 'view') next.delete(`${key}.edit`)
    selected.value = allIds.filter((item) => next.has(item))
    errors.permissions = ''
  }

  const groupState = (group: PermissionGroup) => {
    const ids = groupIds(group)
    const count = ids.filter(isChecked).length
    return { all: count === ids.length, some: count > 0 && count < ids.length }
  }
  const toggleGroup = (group: PermissionGroup, checked: boolean) => {
    const ids = new Set(groupIds(group))
    selected.value = checked
      ? allIds.filter((id) => ids.has(id) || isChecked(id))
      : selected.value.filter((id) => !ids.has(id))
    errors.permissions = ''
  }

  const query = ref('')
  const visibleGroups = computed<PermissionGroup[]>(() => {
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
  const clearQuery = () => {
    query.value = ''
    focusById('team-permissions-filter')
  }
  const clearAll = () => {
    selected.value = []
  }

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

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
      toast.success(`Team "${form.name.trim()}" created with ${selected.value.length} permissions.`)
    }, 700)
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Teams and permissions"
          variant="outline"
          size="small"
          href="/account/teams"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
    </AppHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col overflow-auto"
    >
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-team-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex-1">
          <div
            class="layout-column-form layout-boundary-inline flex flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Team"
              description="A team is a named set of permissions. People added to it get exactly what it grants."
              size="small"
              title-id="create-team-title"
            />

            <fieldset
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Team</legend>

              <SettingsSection
                title="General"
                hint="The name is the only required field."
              >
                <Card>
                  <template #default>
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
                        <Field.Description>{{
                          errors.name || 'Usually the role or the area the team is responsible for.'
                        }}</Field.Description>
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
                title="Permissions"
                :hint="`What this team can see and change. ${selected.length} of ${allIds.length} selected.`"
              >
                <Card>
                  <template #default>
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
                            <template #leading>
                              <i
                                class="az az-search"
                                aria-hidden="true"
                              />
                            </template>
                          </Input>
                        </div>
                        <Button
                          type="button"
                          label="Select all"
                          variant="outline"
                          size="medium"
                          @click="selectAll"
                        />
                        <Button
                          type="button"
                          label="Clear"
                          variant="ghost"
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

                      <EmptyState
                        v-if="!visibleGroups.length"
                        size="small"
                        icon="az az-search"
                        title="No matching permissions"
                        :description="`No permission matches “${query}”.`"
                      >
                        <template #actions>
                          <Button
                            type="button"
                            label="Clear filter"
                            variant="outline"
                            size="small"
                            @click="clearQuery"
                          />
                        </template>
                      </EmptyState>
                      <Table
                        v-else
                        bordered
                        aria-label="Permissions granted by this team"
                      >
                        <Table.Header>
                          <Table.Row>
                            <Table.HeadCell principal>Resource</Table.HeadCell>
                            <Table.HeadCell align="center">View</Table.HeadCell>
                            <Table.HeadCell align="center">Edit</Table.HeadCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body
                          v-for="group in visibleGroups"
                          :key="group.label"
                        >
                          <Table.Row>
                            <Table.Cell principal>
                              <Field orientation="horizontal">
                                <Checkbox
                                  :model-value="groupState(group).all"
                                  :indeterminate="groupState(group).some"
                                  @update:model-value="(checked) => toggleGroup(group, checked)"
                                />
                                <Field.Label>
                                  <span class="text-label-md">{{ group.label }}</span>
                                </Field.Label>
                              </Field>
                            </Table.Cell>
                            <Table.Cell align="center" />
                            <Table.Cell align="center" />
                          </Table.Row>
                          <Table.Row
                            v-for="resource in group.resources"
                            :key="resource.key"
                          >
                            <Table.Cell principal>
                              <span class="ps-(--spacing-xl) text-body-sm text-(--text-default)">{{
                                resource.label
                              }}</span>
                            </Table.Cell>
                            <Table.Cell
                              v-for="action in ACTIONS"
                              :key="action"
                              align="center"
                            >
                              <Checkbox
                                v-if="has(resource, action)"
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
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
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
                  <template #default>
                    <Field orientation="horizontal">
                      <Field.Label>
                        <span class="text-label-md">Active</span>
                      </Field.Label>
                      <Switch v-model="form.active" />
                    </Field>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>

          <SaveBar variant="centered">
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                href="/account/teams"
              />
              <Button
                label="Create"
                variant="primary"
                size="medium"
                type="submit"
                :loading="submitting"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
  </div>
</template>
