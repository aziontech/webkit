<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'

  const breadcrumb = [{ label: 'Databases', href: '/databases' }, { label: 'Create Database' }]

  const blank = () => ({ name: '', active: true })
  const form = reactive(blank())
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const errors = reactive({ name: '', nameKind: 'required' })
  const advancedOpen = ref(false)
  const submitting = ref(false)
  const nameInput = ref(null)

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
    nameInput.value?.$el?.querySelector?.('input')?.focus()
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
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Databases"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

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
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Name"
                        description="Identifies the database wherever it is queried from. It cannot be changed later. Between 6 and 50 characters: letters, numbers and hyphens."
                      >
                        <Input
                          ref="nameInput"
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
                        <HelperText
                          v-if="errors.name"
                          id="create-database-name-message"
                          :kind="errors.nameKind"
                          :label="errors.name"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                v-model:open="advancedOpen"
                title="Advanced"
                icon="pi pi-cog"
                collapsible
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Active"
                        description="An inactive database keeps its data and refuses connections."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>

          <SaveBar kind="centered">
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
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="cancel"
              />
              <Button
                label="Create Database"
                kind="primary"
                size="medium"
                type="submit"
                :loading="submitting"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
    <Toaster position="bottom-right" />
  </div>
</template>
