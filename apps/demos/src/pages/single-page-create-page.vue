<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import AppHeader from '@aziontech/webkit/app-header'
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
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { createResource } from '../lib/store'

  const router = useRouter()
  const breadcrumb = [{ label: 'Resources', href: '/resources' }, { label: 'Create Resource' }]

  const form = reactive({ name: '', domain: '', dnssec: false, active: true })
  const errors = reactive({ name: '', nameKind: 'required', domain: '', domainKind: 'required' })
  const advancedOpen = ref(false)
  const fileEl = ref(null)

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

  const submit = () => {
    if (!validate()) return
    const resource = createResource({
      name: form.name.trim(),
      domain: form.domain.trim(),
      dnssec: form.dnssec
    })
    toast.success(`${resource.name} was created.`, { closable: true })
    router.push(`/resources/${resource.id}`)
  }
  const openImport = () => fileEl.value?.click()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="ai ai-chevron-left"
          aria-label="Back to Resources"
          variant="outline"
          size="small"
          @click="router.push('/resources')"
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
        aria-labelledby="create-domain-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Resource"
              description="A resource serves your application on the hostname you give it."
              size="small"
              title-id="create-domain-title"
            />

            <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Create Resource</legend>

              <SettingsSection
                title="General"
                hint="The two fields a resource requires: what it is called here, and the hostname it answers for."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Name"
                        description="Identifies the resource in the list. It is not the hostname."
                      >
                        <Input
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="my-resource"
                          autocomplete="off"
                          :required="!!errors.name && errors.nameKind === 'required'"
                          :invalid="!!errors.name && errors.nameKind === 'invalid'"
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
                        title="Domain name"
                        description="The hostname this resource answers for."
                      >
                        <Input
                          v-model="form.domain"
                          size="large"
                          class="w-full"
                          aria-label="Domain name"
                          placeholder="example.com"
                          autocomplete="off"
                          :required="!!errors.domain && errors.domainKind === 'required'"
                          :invalid="!!errors.domain && errors.domainKind === 'invalid'"
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
              </SettingsSection>

              <SettingsSection
                title="Advanced"
                v-model:open="advancedOpen"
                icon="ai ai-settings"
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
                        description="When active, the resource answers requests for its hostname."
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
            <template #leading>
              <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                <Button
                  type="button"
                  label="Import"
                  variant="outline"
                  size="medium"
                  icon="ai ai-upload"
                  @click="openImport"
                />
                <p class="min-w-0 text-body-sm text-(--text-muted)">
                  or paste zone file contents in Domain name
                </p>
                <input
                  ref="fileEl"
                  type="file"
                  accept=".zone,.txt,.db,text/plain"
                  class="sr-only"
                  tabindex="-1"
                  aria-hidden="true"
                />
              </div>
            </template>
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                @click="router.push('/resources')"
              />
              <Button
                label="Save"
                variant="primary"
                size="medium"
                type="submit"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
  </div>
</template>
