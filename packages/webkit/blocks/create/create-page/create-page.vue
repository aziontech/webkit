<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { reactive, ref, watch } from 'vue'

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
  }

  export interface CreatePageProps {
    /** The values the form starts from; each field falls back to empty, DNSSEC off and Active on. */
    defaultValues?: Partial<CreatePageValues>
    /** The create request is in flight; the form locks and Save spins. */
    loading?: boolean
    /** Why the create request failed, shown in an error toast with Retry. */
    error?: string
  }

  interface FormErrors {
    name: string
    nameKind: 'helper' | 'invalid' | 'required'
    domain: string
    domainKind: 'helper' | 'invalid' | 'required'
  }

  const props = withDefaults(defineProps<CreatePageProps>(), {
    defaultValues: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: CreatePageValues]
    cancel: [event: MouseEvent]
  }>()

  const breadcrumb = [{ label: 'Domains', href: '/domains' }, { label: 'Create Domain' }]

  const form = reactive<CreatePageValues>({
    name: '',
    domain: '',
    dnssec: false,
    active: true,
    ...props.defaultValues
  })
  const errors = reactive<FormErrors>({
    name: '',
    nameKind: 'required',
    domain: '',
    domainKind: 'required'
  })
  const advancedOpen = ref(false)

  const NAME_MAX = 50
  const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (name.length > NAME_MAX) {
      errors.nameKind = 'invalid'
      errors.name = 'Use at most ' + NAME_MAX + ' characters.'
    } else {
      errors.name = ''
    }

    const domain = form.domain.trim()
    if (!domain) {
      errors.domainKind = 'required'
      errors.domain = 'This field is required.'
    } else if (!DOMAIN_PATTERN.test(domain)) {
      errors.domainKind = 'invalid'
      errors.domain = 'Enter a valid domain name. Example: example.com.'
    } else {
      errors.domain = ''
    }

    return !errors.name && !errors.domain
  }

  const values = (): CreatePageValues => ({
    ...form,
    name: form.name.trim(),
    domain: form.domain.trim()
  })

  const guard = useUnsavedChanges(() => form, {
    enabled: () => !props.loading
  })
  const discardDialog = guard.dialogProps
  const discardLabels = guard.labels

  const onCancel = async (event: MouseEvent) => {
    if (await guard.confirmLeave()) emit('cancel', event)
  }

  const submit = (event: Event) => {
    if (props.loading || !validate()) return
    emit('submit', event, values())
  }

  watch(
    () => props.error,
    (message) => {
      if (!message) return
      toast.error('Could not create the domain.', {
        description: message,
        action: { label: 'Retry', onClick: (event: MouseEvent) => submit(event) }
      })
    },
    { immediate: true }
  )
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
                        stackable
                        title="Name"
                        description="Identifies the domain in this list. It is not the hostname."
                      >
                        <Input
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
                        description="Signs this domain's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider."
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
                label="Save"
                variant="primary"
                size="medium"
                type="submit"
                :loading="loading"
              />
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
