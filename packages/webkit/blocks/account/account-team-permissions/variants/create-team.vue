<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { onMounted, reactive, ref } from 'vue'

  import { validateTeam } from '../lib/team-form'
  import TeamFormHeader from '../parts/team-form-header.vue'
  import TeamPermissionsField from '../parts/team-permissions-field.vue'

  const form = reactive({ name: '', description: '', active: true })
  const selected = ref<string[]>(['applications.view', 'domains.view', 'metrics.view'])
  const errors = reactive({ name: '', permissions: '' })
  const submitting = ref(false)

  const submit = () => {
    if (submitting.value) return
    if (!validateTeam(form.name, selected.value, errors)) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      toast.success(`Team "${form.name.trim()}" created with ${selected.value.length} permissions.`)
    }, 700)
  }

  const formEl = ref<HTMLFormElement | null>(null)
  const nameEl = ref<InstanceType<typeof Input> | null>(null)

  onMounted(() => nameEl.value?.focus())

  useShortcuts({
    keys: 'meta+enter',
    label: 'Create team',
    group: 'Page',
    element: formEl,
    when: () => !submitting.value,
    handler: () => formEl.value?.requestSubmit()
  })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <TeamFormHeader page="Create Team" />

    <main
      class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col overflow-auto"
    >
      <form
        ref="formEl"
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
                          ref="nameEl"
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
              </SettingsGroup>

              <TeamPermissionsField
                v-model="selected"
                v-model:error="errors.permissions"
              />

              <SettingsGroup
                label="Status"
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
              </SettingsGroup>
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
                variant="primary"
                size="medium"
                type="submit"
                :loading="submitting"
                :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
              >
                Create
                <Kbd
                  meta
                  key-name="enter"
                  size="small"
                  aria-hidden="true"
                />
              </Button>
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
  </div>
</template>
