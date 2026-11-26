<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Table from '@aziontech/webkit/table'
  import { computed, ref } from 'vue'

  import { focusById } from '../lib/team-form'

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

  const selected = defineModel<string[]>({ required: true })
  const error = defineModel<string>('error', { default: '' })

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
    error.value = ''
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
    error.value = ''
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
    error.value = ''
  }
  const clearQuery = () => {
    query.value = ''
    focusById('team-permissions-filter')
  }
  const clearAll = () => {
    selected.value = []
  }
</script>

<template>
  <SettingsGroup
    label="Permissions"
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
            v-if="error"
            severity="danger"
            size="small"
            :label="error"
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
            Edit includes View: checking Edit checks View, and clearing View clears Edit.
          </p>
        </div>
      </template>
    </Card>
  </SettingsGroup>
</template>
