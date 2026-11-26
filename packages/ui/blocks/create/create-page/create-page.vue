<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import TagEditor, { type TagEditorTag } from '@aziontech/webkit/tag-editor'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { focusFirstInvalid } from '@aziontech/webkit/utils/focus-invalid'
  import { nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { type CreatePageDomainErrors, validateDomainForm } from './domain-validation'

  /** The values of the Create Domain form. */
  export interface CreatePageValues {
    /** What the domain is called in the list. */
    name: string
    /** The root hostname it answers for. */
    domain: string
    /** Whether DNSSEC signs its answers. */
    dnssec: boolean
    /** Whether it answers authoritative DNS queries. */
    active: boolean
    /** Key and value tags of the domain; a tag with an empty key is left out. */
    tags: { key: string; value: string }[]
  }

  export interface CreatePageProps {
    /** The values the form starts from; each field falls back to empty, DNSSEC off and Active on. */
    defaultValues?: Partial<CreatePageValues>
    /** The create request is in flight; the form locks and Save spins. */
    loading?: boolean
    /** Why the create request failed, shown in an inline error with Retry under the page title. */
    error?: string
  }

  const props = withDefaults(defineProps<CreatePageProps>(), {
    defaultValues: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: CreatePageValues]
    cancel: [event: MouseEvent | KeyboardEvent]
  }>()

  const breadcrumb = [{ label: 'Domains', href: '/domains' }, { label: 'Create Domain' }]

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
      label: 'Create domain',
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
    "Signs this domain's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider."
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Domains"
          variant="outline"
          size="small"
          @click="onCancel"
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
      <AppHeader.End>
        <AppHeaderAccount
          name="name@example.com"
          aria-label="Account settings"
        />
      </AppHeader.End>
    </AppHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-domain-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Domain"
              description="A domain holds the DNS records that answer authoritatively for a hostname."
              size="small"
              title-id="create-domain-title"
            />

            <Alert
              v-if="error"
              :key="attempt"
              class="mt-(--layout-section-gap)"
              severity="danger"
              title="Could not create the domain."
              :label="error"
              action-label="Retry"
              @action="submit"
            />
            <fieldset
              :disabled="loading"
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
            >
              <legend class="sr-only">Create Domain</legend>

              <SettingsGroup
                label="General"
                hint="The two fields this endpoint requires: what the domain is called here, and the hostname it answers for."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        required
                        stackable
                        title="Name"
                        description="Identifies the domain in this list. It is not the hostname."
                      >
                        <Input
                          ref="nameEl"
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="My domain"
                          autocomplete="off"
                          required
                          :invalid="!!errors.name"
                          :aria-describedby="errors.name ? 'create-domain-name-message' : undefined"
                          @update:model-value="errors.name = ''"
                        />
                        <FieldError
                          v-if="errors.name"
                          id="create-domain-name-message"
                          >{{ errors.name }}</FieldError
                        >
                      </SettingsRow>
                      <SettingsRow
                        required
                        stackable
                        title="Domain name"
                        description="The root hostname this domain answers for, without a subdomain."
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
                            errors.domain ? 'create-domain-domain-message' : undefined
                          "
                          @update:model-value="errors.domain = ''"
                        />
                        <FieldError
                          v-if="errors.domain"
                          id="create-domain-domain-message"
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
                      aria-label="Domain tags"
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
                        description="When active, the domain answers authoritative DNS queries for its hostname."
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
