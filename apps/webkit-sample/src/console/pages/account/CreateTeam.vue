<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Checkbox from '@aziontech/webkit/checkbox'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import CreatePage from '../../components/page/CreatePage.vue'
  import Section from '../../components/page/Section.vue'
  import { useBaseline } from '../../lib/behavior/forms'
  import {
    allPermissionIds,
    permissionGroups,
    resourcePermissions,
    useTeams
  } from '../../lib/data/teams.js'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')
  const goToList = () =>
    router.push({
      path: '/account/teams',
      query: { email: userEmail.value }
    })

  const { getTeam, createTeam, updateTeam, removeTeam } = useTeams()

  const editing = getTeam(route.params.id)
  if (route.params.id && !editing) goToList()

  const form = reactive({
    name: editing?.name ?? '',
    description: editing?.description ?? '',
    active: editing ? editing.status === 'Active' : true
  })

  const selected = ref(editing ? [...editing.permissions] : [])

  const errors = reactive({ name: '', permissions: '' })
  const submitting = ref(false)

  const { dirty, commit } = useBaseline(form)

  const columnPermission = (resource, column) => {
    const permissions = resourcePermissions(resource)
    if (resource.single) {
      const only = permissions[0]
      const implied = only.label.startsWith('View') ? 'view' : 'edit'
      return implied === column ? only : null
    }
    return permissions.find((permission) => permission.action === column) ?? null
  }

  const groupPermissionIds = (group) =>
    group.resources.flatMap((resource) =>
      resourcePermissions(resource).map((permission) => permission.id)
    )

  const groupChecked = (group) => {
    const ids = groupPermissionIds(group)
    return ids.every((id) => selected.value.includes(id))
  }
  const groupIndeterminate = (group) => {
    const ids = groupPermissionIds(group)
    const count = ids.filter((id) => selected.value.includes(id)).length
    return count > 0 && count < ids.length
  }

  const toggleGroup = (group, checked) => {
    const ids = new Set(groupPermissionIds(group))
    if (checked) {
      selected.value = [...new Set([...selected.value, ...ids])]
    } else {
      selected.value = selected.value.filter((id) => !ids.has(id))
    }
    errors.permissions = ''
  }

  const selectAll = () => {
    selected.value = [...allPermissionIds]
    errors.permissions = ''
  }
  const clearAll = () => {
    selected.value = []
  }

  const filterText = ref('')

  const matches = (resource, group) => {
    const query = filterText.value.trim().toLowerCase()
    if (!query) return true
    if (group.label.toLowerCase().includes(query)) return true
    return resourcePermissions(resource).some((permission) =>
      permission.label.toLowerCase().includes(query)
    )
  }

  const visibleGroups = computed(() =>
    permissionGroups
      .map((group) => ({
        ...group,
        resources: group.resources.filter((resource) => matches(resource, group))
      }))
      .filter((group) => group.resources.length > 0)
  )

  const selectedCount = computed(() => selected.value.length)
  const totalCount = allPermissionIds.length

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.permissions = selected.value.length ? '' : 'Select at least one permission.'
    return !errors.name && !errors.permissions
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.active ? 'Active' : 'Inactive',
        permissions: selected.value
      }
      if (editing) {
        updateTeam(editing.id, payload)
        toast.success(`Team "${payload.name}" updated.`)
      } else {
        const team = createTeam(payload)
        toast.success(`Team "${payload.name}" created.`, {
          action: {
            label: 'Open team',
            onClick: () =>
              router.push({ path: `/teams/${team.id}`, query: { email: userEmail.value } })
          }
        })
      }
      commit()
      goToList()
    } catch (error) {
      toast.error('Could not save the team.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }

  const deleteTeam = () => {
    if (!editing || submitting.value) return
    removeTeam(editing.id)
    toast.success(`Team "${editing.name}" deleted.`)
    commit()
    goToList()
  }

  const breadcrumb = [
    { label: 'Settings', href: '/account' },
    { label: 'Teams and permissions', href: '/account/teams' },
    { label: editing ? 'Edit' : 'Create' }
  ]
</script>

<template>
  <CreatePage
    :breadcrumb="breadcrumb"
    back-label="Back to Teams Permissions"
    :title="editing ? 'Edit Team' : 'Create Team'"
    description="A team is a named set of permissions. Assign accounts to it and they inherit exactly what it grants. Nothing is granted per person."
    title-id="team-title"
    :submitting="submitting"
    :dirty="dirty"
    :save-label="editing ? 'Save changes' : 'Create'"
    @cancel="goToList"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="General"
      hint="The name is the only field required."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Usually the role or the area the team is responsible for. The account list shows it beside every member of this team."
              :message="errors.name"
              message-kind="required"
            >
              <template #default="{ messageId }">
                <InputText
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  aria-label="Name"
                  autocomplete="off"
                  :disabled="submitting"
                  :required="!!errors.name"
                  :aria-describedby="messageId"
                  @update:model-value="errors.name = ''"
                />
              </template>
            </FieldRow>

            <FieldRow
              kind="wide"
              title="Description"
              description="Optional. What this team is responsible for, for whoever assigns it later."
            >
              <Textarea
                v-model="form.description"
                class="w-full"
                :rows="3"
                aria-label="Description"
                :disabled="submitting"
              />
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <Section
      stacked
      :divided="false"
      title="Permissions"
      :hint="`What this team can see and change, with ${selectedCount} of ${totalCount} selected.`"
    >
      <CardBox>
        <template #content>
          <div class="flex flex-col gap-(--spacing-md)">
            <div class="flex flex-wrap items-center gap-(--spacing-xs)">
              <InputText
                v-model="filterText"
                size="large"
                placeholder="Filter permissions"
                aria-label="Filter permissions"
                class="min-w-(--container-2xs) flex-1"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>
              <Button
                type="button"
                label="Select all"
                kind="outlined"
                size="large"
                @click="selectAll"
              />
              <Button
                type="button"
                label="Clear"
                kind="text"
                size="large"
                @click="clearAll"
              />
            </div>

            <Message
              v-if="errors.permissions"
              severity="danger"
              :label="errors.permissions"
            />

            <div
              class="overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted)"
            >
              <div
                v-for="group in visibleGroups"
                :key="group.label"
                class="border-b-(length:--border-width-default) border-(--border-muted) last:border-b-0"
              >
                <div
                  class="flex items-center gap-(--spacing-sm) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-sm)"
                >
                  <Checkbox
                    binary
                    :model-value="groupChecked(group)"
                    :indeterminate="groupIndeterminate(group)"
                    :aria-label="`Select all ${group.label} permissions`"
                    @update:model-value="(checked) => toggleGroup(group, checked)"
                  />
                  <span class="flex-1 text-label-md text-(--text-default)">
                    {{ group.label }}
                  </span>
                  <span class="w-16 text-center text-label-sm text-(--text-muted)">
                    View
                  </span>
                  <span class="w-16 text-center text-label-sm text-(--text-muted)">
                    Edit
                  </span>
                </div>

                <div
                  v-for="resource in group.resources"
                  :key="resource.key"
                  class="flex items-center gap-(--spacing-sm) border-t-(length:--border-width-default) border-(--border-muted) px-(--spacing-md) py-(--spacing-sm) hover:bg-(--bg-hover)"
                >
                  <span
                    class="flex-1 pl-(--spacing-lg) text-body-sm text-(--text-default)"
                  >
                    {{ resource.label }}
                  </span>

                  <div class="flex w-16 justify-center">
                    <Checkbox
                      v-if="columnPermission(resource, 'view')"
                      v-model="selected"
                      :value="columnPermission(resource, 'view').id"
                      :aria-label="columnPermission(resource, 'view').label"
                    />
                  </div>
                  <div class="flex w-16 justify-center">
                    <Checkbox
                      v-if="columnPermission(resource, 'edit')"
                      v-model="selected"
                      :value="columnPermission(resource, 'edit').id"
                      :aria-label="columnPermission(resource, 'edit').label"
                    />
                  </div>
                </div>
              </div>

              <p
                v-if="!visibleGroups.length"
                class="px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
              >
                No permissions match "{{ filterText }}".
              </p>
            </div>
          </div>
        </template>
      </CardBox>
    </Section>

    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              kind="compact"
              title="Active"
              description="Inactive teams keep their permissions but can't be assigned."
            >
              <Switch
                v-model="form.active"
                aria-label="Active"
                :disabled="submitting"
              />
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <template #start>
      <Button
        v-if="editing"
        type="button"
        label="Delete team"
        kind="danger"
        size="medium"
        icon="pi pi-trash"
        :disabled="submitting"
        @click="deleteTeam"
      />
    </template>
  </CreatePage>
</template>
