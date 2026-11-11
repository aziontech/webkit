<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { reactive, ref } from 'vue'

  const breadcrumb = [{ label: 'Domains', href: '/domains' }, { label: 'Create Domain' }]

  const form = reactive({ name: '', domain: '', dnssec: false, active: true })
  const errors = reactive({ name: '', nameKind: 'required', domain: '', domainKind: 'required' })
  const advancedOpen = ref(false)
  const fileRef = ref(null)

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

  const submit = () => validate()
  const openImport = () => fileRef.value?.click()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Domains"
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
        aria-labelledby="create-domain-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="min-h-0 flex-1 overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Domain"
              description="A domain holds the DNS records that answer authoritatively for a hostname."
              size="small"
              title-id="create-domain-title"
            />

            <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Create Domain</legend>

              <SettingsSection
                title="General"
                hint="The two fields this endpoint requires: what the domain is called here, and the hostname it answers for."
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
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
                          :required="!!errors.name && errors.nameKind === 'required'"
                          :invalid="!!errors.name && errors.nameKind === 'invalid'"
                          :aria-describedby="errors.name ? 'create-domain-name-message' : undefined"
                          @update:model-value="errors.name = ''"
                        />
                        <HelperText
                          v-if="errors.name"
                          id="create-domain-name-message"
                          :kind="errors.nameKind"
                          :label="errors.name"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Domain Name"
                        description="The root hostname this domain answers for, without a subdomain. Pasting a zone file here imports its records instead."
                      >
                        <Input
                          v-model="form.domain"
                          size="large"
                          class="w-full"
                          aria-label="Domain Name"
                          placeholder="example.com"
                          autocomplete="off"
                          :required="!!errors.domain && errors.domainKind === 'required'"
                          :invalid="!!errors.domain && errors.domainKind === 'invalid'"
                          :aria-describedby="
                            errors.domain ? 'create-domain-domain-message' : undefined
                          "
                          @update:model-value="errors.domain = ''"
                        />
                        <HelperText
                          v-if="errors.domain"
                          id="create-domain-domain-message"
                          :kind="errors.domainKind"
                          :label="errors.domain"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Advanced"
                v-model:open="advancedOpen"
                icon="pi pi-cog"
                collapsible
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="DNSSEC"
                        description="Signs this domain's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.dnssec"
                          aria-label="Enable DNSSEC"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Active"
                        description="When active, the domain answers authoritative DNS queries for its hostname."
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
        </div>

        <footer
          class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
        >
          <div
            class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
          >
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <Button
                type="button"
                label="Import"
                kind="outlined"
                size="medium"
                icon="pi pi-upload"
                @click="openImport"
              />
              <p class="min-w-0 text-body-sm text-(--text-muted)">
                or paste zone file contents in Domain Name
              </p>
              <input
                ref="fileRef"
                type="file"
                accept=".zone,.txt,.db,text/plain"
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
              />
            </div>
            <div class="ms-auto flex shrink-0 items-center gap-(--spacing-sm)">
              <Button
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
              />
              <Button
                label="Save"
                kind="primary"
                size="medium"
                type="submit"
              />
            </div>
          </div>
        </footer>
      </form>
    </main>
  </div>
</template>
