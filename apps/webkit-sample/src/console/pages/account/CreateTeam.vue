<script setup>
  // Create / Edit Team — a focused PAGE (routes /teams/new and /teams/:id) for a
  // team and its permission set. Same route serves both: with an :id it hydrates
  // from the shared teams.js store (edit); without, it starts empty (create).
  //
  // Layout follows the console's focused create flow (sidebar hidden, sticky
  // footer): a two-column "General" CardBox (name / description / status), then a
  // full-width "Permissions" CardBox holding the Vercel-style selector — each
  // product area is a table section whose rows are resources and whose right-hand
  // columns are View / Edit checkboxes. A resource that only carries a single
  // action (e.g. Real-Time Purge) shows one checkbox in the column its label
  // implies. A group header row select-all (tri-state) toggles the whole area.
  //
  // Usability: one `submitting` flag locks the scope while the (simulated) save
  // runs; Name is required and the permission set must be non-empty.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Checkbox from '@aziontech/webkit/checkbox'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
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
  // The Teams & Permissions list is its own page under Settings; the focused
  // create/edit flow returns there.
  const goToList = () =>
    router.push({
      path: '/account/teams',
      query: { email: userEmail.value }
    })

  // A crumb href may carry its own query (e.g. /deployments?tab=strategies); split it
  // out and merge so the target is preserved alongside the email.
  const { getTeam, createTeam, updateTeam, removeTeam } = useTeams()

  // Edit when the route carries an :id and the team exists; otherwise create.
  const editing = getTeam(route.params.id)
  if (route.params.id && !editing) goToList()

  const form = reactive({
    name: editing?.name ?? '',
    description: editing?.description ?? '',
    active: editing ? editing.status === 'Active' : true
  })

  // Selected permission ids — array so each Checkbox toggles membership directly.
  const selected = ref(editing ? [...editing.permissions] : [])

  const errors = reactive({ name: '', permissions: '' })
  const submitting = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue, mounted by CreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(form)

  // --- Permission selector helpers ----------------------------------------
  // The permission that belongs in a resource's View / Edit column (or null when
  // the resource has no such capability). For a single-action resource the one
  // permission is routed to the column its label implies.
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

  // Tri-state of a group's select-all: fully / partially / not selected.
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

  // --- Search filter -------------------------------------------------------
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

  // --- Submit --------------------------------------------------------------
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
        // The toast CARRIES THE RESOURCE: submit lands the reader back on the list, so
        // the action is the way into the team they just made — the same page this one is,
        // opened on that record.
        const team = createTeam(payload)
        toast.success(`Team "${payload.name}" created.`, {
          action: {
            label: 'Open team',
            onClick: () =>
              router.push({ path: `/teams/${team.id}`, query: { email: userEmail.value } })
          }
        })
      }
      commit() // the commit landed — the leave guard stands down
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

  // Delete is available only when editing an existing team; it removes the team
  // from the store and returns to the list.
  const deleteTeam = () => {
    if (!editing || submitting.value) return
    removeTeam(editing.id)
    toast.success(`Team "${editing.name}" deleted.`)
    commit() // the team is gone — nothing left to protect
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
    :title="editing ? 'Edit Team' : 'Create team'"
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
      hint="The name is the only field required. It is what the account list shows beside every member of this team."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Usually the role or the area the team is responsible for."
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

    <!-- The point of the form, so it is open and it is not in a 256px cell: the
         matrix needs the whole measure. -->
    <Section
      stacked
      :divided="false"
      title="Permissions"
      :hint="`What this team can see and change. ${selectedCount} of ${totalCount} selected.`"
    >
      <CardBox>
        <template #content>
          <div class="flex flex-col gap-[var(--spacing-md)]">
            <div class="flex flex-wrap items-center gap-[var(--spacing-xs)]">
              <InputText
                v-model="filterText"
                size="large"
                placeholder="Filter permissions"
                aria-label="Filter permissions"
                class="min-w-[var(--container-2xs)] flex-1"
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
              class="overflow-hidden rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-[var(--border-muted)]"
            >
              <div
                v-for="group in visibleGroups"
                :key="group.label"
                class="border-b-[length:var(--border-width-default)] border-[var(--border-muted)] last:border-b-0"
              >
                <!-- Group header: select-all + name on the left, column
               headers on the right. -->
                <div
                  class="flex items-center gap-[var(--spacing-sm)] bg-[var(--bg-surface-raised)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
                >
                  <Checkbox
                    binary
                    :model-value="groupChecked(group)"
                    :indeterminate="groupIndeterminate(group)"
                    :aria-label="`Select all ${group.label} permissions`"
                    @update:model-value="(checked) => toggleGroup(group, checked)"
                  />
                  <span class="flex-1 text-label-md text-[var(--text-default)]">
                    {{ group.label }}
                  </span>
                  <!-- Column headers of the permission matrix: the same
                 `text-label-sm` + --text-muted a webkit table head cell
                 uses, so this grid's head reads like every other table's. -->
                  <span class="w-16 text-center text-label-sm text-[var(--text-muted)]">
                    View
                  </span>
                  <span class="w-16 text-center text-label-sm text-[var(--text-muted)]">
                    Edit
                  </span>
                </div>

                <!-- Resource rows -->
                <div
                  v-for="resource in group.resources"
                  :key="resource.key"
                  class="flex items-center gap-[var(--spacing-sm)] border-t-[length:var(--border-width-default)] border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)] hover:bg-[var(--bg-hover)]"
                >
                  <span
                    class="flex-1 pl-[var(--spacing-lg)] text-body-sm text-[var(--text-default)]"
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
                class="px-[var(--spacing-md)] py-[var(--spacing-lg)] text-center text-body-sm text-[var(--text-muted)]"
              >
                No permissions match "{{ filterText }}".
              </p>
            </div>
          </div>
        </template>
      </CardBox>
    </Section>

    <!-- `active` is optional and defaults on: an inactive team keeps its permissions
         but cannot be assigned, which is rarely what someone creating one wants. -->
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

    <!-- Delete lives opposite the commit, never beside it: it is the one action on
         this page that cannot be undone, and a danger button adjacent to Save is a
         misclick away from destroying the thing being edited. -->
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
