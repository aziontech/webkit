<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'

  const breadcrumb = [{ label: 'Databases', href: '/databases' }, { label: 'Create Database' }]

  const blank = () => ({ name: '', active: true })
  const form = reactive(blank())
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const errors = reactive<{ name: string; nameKind: 'helper' | 'invalid' | 'required' }>({
    name: '',
    nameKind: 'required'
  })
  const advancedOpen = ref(false)
  const submitting = ref(false)
  const nameInputEl = ref<InstanceType<typeof Input> | null>(null)

  const NAME_PATTERN = /^[A-Za-z0-9-]{6,50}$/
  const TAKEN = ['acme-store', 'feature-flags']

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (!NAME_PATTERN.test(name)) {
      errors.nameKind = 'invalid'
      errors.name = 'Use 6 to 50 characters: letters, numbers and hyphens only.'
    } else {
      errors.name = ''
    }
    return !errors.name
  }

  const focusName = async () => {
    await nextTick()
    nameInputEl.value?.focus()
  }

  const CREATE_TOAST = 'create-database'
  let timer = 0

  const submit = () => {
    if (submitting.value) return
    if (!validate()) {
      focusName()
      return
    }
    const name = form.name.trim()
    submitting.value = true
    toast.dismiss(CREATE_TOAST)
    clearTimeout(timer)
    timer = setTimeout(() => {
      submitting.value = false
      if (TAKEN.includes(name.toLowerCase())) {
        errors.nameKind = 'invalid'
        errors.name = `A database named ${name} already exists. Pick another name.`
        focusName()
        return
      }
      if (name.toLowerCase().startsWith('offline')) {
        toast.error("The database wasn't created.", {
          id: CREATE_TOAST,
          description: "The request didn't reach the server. Your entries are kept.",
          action: { label: 'Retry', onClick: () => submit() }
        })
        return
      }
      baseline.value = JSON.stringify(form)
      toast.success(`Database ${name} created.`, {
        id: CREATE_TOAST,
        description: 'It is empty. Create a table or run a query to add one.',
        actions: [
          { label: 'Open database', onClick: () => {} },
          { label: 'Create Table', onClick: () => {} }
        ]
      })
    }, 900)
  }

  const cancel = () => {
    Object.assign(form, blank())
    Object.assign(errors, { name: '', nameKind: 'required' })
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(CREATE_TOAST)
  })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Databases"
          variant="outline"
          size="small"
        />
        <AppHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              variant="default"
              size="small"
            />
          </a>
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-database-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="min-h-0 flex-1 overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Database"
              description="A SQL database that applications, functions and APIs can query at the edge."
              size="small"
              title-id="create-database-title"
            />

            <fieldset
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Database</legend>

              <SettingsSection
                title="General"
                hint="The only field this endpoint requires."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Name"
                        description="Identifies the database wherever it is queried from. It cannot be changed later. Between 6 and 50 characters: letters, numbers and hyphens."
                      >
                        <Input
                          ref="nameInputEl"
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="my-new-database"
                          autocomplete="off"
                          :required="!!errors.name && errors.nameKind === 'required'"
                          :invalid="!!errors.name && errors.nameKind === 'invalid'"
                          :aria-describedby="
                            errors.name ? 'create-database-name-message' : undefined
                          "
                          @update:model-value="errors.name = ''"
                        />
                        <FieldError
                          v-if="errors.name"
                          id="create-database-name-message"
                          >{{ errors.name }}</FieldError
                        >
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                v-model:open="advancedOpen"
                title="Advanced"
                icon="az az-settings"
                collapsible
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Active"
                        description="An inactive database keeps its data and refuses connections."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                        />
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>

          <SaveBar variant="centered">
            <template
              v-if="dirty"
              #leading
            >
              <p class="min-w-0 text-body-sm text-(--text-muted)">Unsaved changes</p>
            </template>
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="submitting"
                @click="cancel"
              />
              <Button
                label="Create Database"
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
