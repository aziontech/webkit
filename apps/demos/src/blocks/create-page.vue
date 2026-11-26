<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import AppHeader from '@aziontech/ui/app-header'
  import AppHeaderAccount from '@aziontech/ui/app-header-account'
  import Brand from '@aziontech/ui/brand'
  import Breadcrumb from '@aziontech/ui/breadcrumb-root'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import FieldError from '@aziontech/ui/field-error'
  import IconButton from '@aziontech/ui/icon-button'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import Kbd from '@aziontech/ui/kbd'
  import PageHeader from '@aziontech/ui/page-header'
  import SaveBar from '@aziontech/ui/save-bar'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'
  import TagEditor, { type TagEditorTag } from '@aziontech/ui/tag-editor'
  import { useEscapeToCancel } from '@aziontech/ui/use-escape-to-cancel'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/ui/use-shortcuts'
  import { useUnsavedChanges } from '@aziontech/ui/use-unsaved-changes'
  import { focusFirstInvalid } from '@aziontech/ui/utils/focus-invalid'
  import { nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { type CreatePageDomainErrors, validateDomainForm } from './create-page.domain-validation'

  /** The values of the Create Resource form. */
  export interface CreatePageValues {
    /** What the resource is called in the list. */
    name: string
    /** The domain the resource serves. */
    domain: string
    /** Whether DNSSEC signs the DNS answers for its domain. */
    dnssec: boolean
    /** Whether it serves traffic. */
    active: boolean
    /** Key and value tags of the resource; a tag with an empty key is left out. */
    tags: { key: string; value: string }[]
  }

  export interface CreatePageProps {
    /** The values the form starts from; each field falls back to empty, DNSSEC off and Active on. */
    defaultValues?: Partial<CreatePageValues>
    /** The create request is in flight; the form locks and Save spins. */
    loading?: boolean
    /** Why the create request failed, shown in an inline error with Retry under the page title. */
    error?: string
    /** Name of the signed-in account, shown by the account button. */
    accountName?: string
  }

  const props = withDefaults(defineProps<CreatePageProps>(), {
    defaultValues: () => ({}),
    loading: false,
    error: '',
    accountName: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: CreatePageValues]
    cancel: [event: MouseEvent | KeyboardEvent]
    account: [event: MouseEvent]
  }>()

  const breadcrumb = [{ label: 'Resources', href: '/resources' }, { label: 'Create Resource' }]

  const form = reactive<Omit<CreatePageValues, 'tags'> & { tags: TagEditorTag[] }>({
    name: '',
    domain: '',
    dnssec: false,
    active: true,
    ...props.defaultValues,
    tags: (props.defaultValues.tags ?? []).map((tag) => ({ ...tag }))
  })
  const tagKeySuggestions = ['team', 'environment', 'owner', 'cost-center']
  const tagEditorEl = ref<InstanceType<typeof TagEditor> | null>(null)
  const errors = reactive<CreatePageDomainErrors>({
    name: '',
    nameKind: 'required',
    domain: '',
    domainKind: 'required'
  })
  const advancedOpen = ref(false)

  const validate = () => {
    const fieldsValid = validateDomainForm(form, errors)
    const tagsValid = tagEditorEl.value?.validate() ?? true
    return fieldsValid && tagsValid
  }

  const values = (): CreatePageValues => ({
    ...form,
    name: form.name.trim(),
    domain: form.domain.trim(),
    tags: form.tags
      .filter((tag) => tag.key.trim() && !tag.markedForRemoval)
      .map((tag) => ({ key: tag.key.trim(), value: tag.value.trim() }))
  })

  const guard = useUnsavedChanges(() => form, {
    enabled: () => !props.loading
  })
  const discardDialog = guard.dialogProps
  const discardLabels = guard.labels

  const onCancel = async (event: MouseEvent | KeyboardEvent) => {
    if (await guard.confirmLeave()) emit('cancel', event)
  }

  useEscapeToCancel(onCancel, { enabled: () => !props.loading })

  const formEl = ref<HTMLFormElement | null>(null)
  const nameEl = ref<InstanceType<typeof Input> | null>(null)

  useShortcuts(
    ['meta+enter', 'meta+s'].map((keys) => ({
      keys,
      label: 'Create resource',
      group: 'Page',
      element: formEl,
      when: () => !props.loading,
      handler: () => formEl.value?.requestSubmit()
    }))
  )

  onMounted(() => nameEl.value?.focus())

  const submit = (event: Event) => {
    if (props.loading) return
    if (!validate()) {
      focusFirstInvalid(formEl.value)
      return
    }
    emit('submit', event, values())
  }

  const attempt = ref(0)

  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) attempt.value += 1
    }
  )

  watch([() => props.error, attempt], async ([next]) => {
    if (!next) return
    await nextTick()
    formEl.value?.querySelector('[role="alert"]')?.scrollIntoView({ block: 'nearest' })
  })

  const DNSSEC_DESCRIPTION =
    "Signs the DNS answers for the resource's domain so a resolver can detect spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider."
</script>

<template>
  <div class="flex h-(--demo-viewport-height) flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Resources"
          variant="outline"
          size="small"
          @click="onCancel"
        />
        <AppHeader.Brand
          href="/resources"
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
      <AppHeader.End>
        <AppHeaderAccount
          :name="accountName || 'name@example.com'"
          aria-label="Account settings"
          @click="(event: MouseEvent) => emit('account', event)"
        />
      </AppHeader.End>
    </AppHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-resource-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Resource"
              description="A resource serves your app on its domains."
              size="small"
              title-id="create-resource-title"
            />

            <Alert
              v-if="error"
              :key="attempt"
              class="mt-(--layout-section-gap)"
              severity="danger"
              title="Could not create the resource."
              :label="error"
              action-label="Retry"
              @action="submit"
            />
            <fieldset
              :disabled="loading"
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
            >
              <legend class="sr-only">Create Resource</legend>

              <SettingsGroup
                label="General"
                hint="The two fields a resource needs: what it is called here, and the domain it serves."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        required
                        stackable
                        title="Name"
                        description="Identifies the resource in this list. It is not the domain."
                      >
                        <Input
                          ref="nameEl"
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="my-resource"
                          autocomplete="off"
                          required
                          :invalid="!!errors.name"
                          :aria-describedby="
                            errors.name ? 'create-resource-name-message' : undefined
                          "
                          @update:model-value="errors.name = ''"
                        />
                        <FieldError
                          v-if="errors.name"
                          id="create-resource-name-message"
                          >{{ errors.name }}</FieldError
                        >
                      </SettingsRow>
                      <SettingsRow
                        required
                        stackable
                        title="Domain name"
                        description="The hostname the resource serves, such as example.com."
                      >
                        <Input
                          v-model="form.domain"
                          size="large"
                          class="w-full"
                          aria-label="Domain name"
                          placeholder="example.com"
                          autocomplete="off"
                          required
                          :invalid="!!errors.domain"
                          :aria-describedby="
                            errors.domain ? 'create-resource-domain-message' : undefined
                          "
                          @update:model-value="errors.domain = ''"
                        />
                        <FieldError
                          v-if="errors.domain"
                          id="create-resource-domain-message"
                          >{{ errors.domain }}</FieldError
                        >
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Tags"
                hint="Labels for ownership, cost and search. The same keys across resources keep them easy to find."
              >
                <Card>
                  <template #default>
                    <TagEditor
                      ref="tagEditorEl"
                      v-model:tags="form.tags"
                      :key-suggestions="tagKeySuggestions"
                      :disabled="loading"
                      aria-label="Resource tags"
                    />
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Advanced"
                v-model:open="advancedOpen"
                icon="az az-settings"
                collapsible
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="DNSSEC"
                        :description="DNSSEC_DESCRIPTION"
                        variant="compact"
                      >
                        <Switch
                          v-model="form.dnssec"
                          aria-label="Enable DNSSEC"
                        />
                      </SettingsRow>
                      <SettingsRow
                        title="Active"
                        description="When active, the resource serves traffic on its domain."
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
                @click="onCancel"
              />
              <Button
                variant="primary"
                size="medium"
                type="submit"
                :loading="loading"
                :aria-keyshortcuts="`${toAriaKeyshortcuts('meta+enter')} ${toAriaKeyshortcuts('meta+s')}`"
              >
                Save
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
    <ConfirmDialog
      v-bind="discardDialog"
      data-testid="unsaved-changes-dialog"
    >
      <template #actions>
        <Button
          :label="discardLabels.keepEditing"
          variant="ghost"
          size="medium"
          data-autofocus
          @click="guard.keepEditing"
        />
        <Button
          :label="discardLabels.discard"
          variant="danger"
          size="medium"
          @click="guard.discardAndLeave"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
