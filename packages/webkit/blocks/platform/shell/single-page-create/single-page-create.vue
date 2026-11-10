<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
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
            <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
              <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <h1
                    id="create-domain-title"
                    data-size="small"
                    class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
                  >
                    Create Domain
                  </h1>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">
                  A domain holds the DNS records that answer authoritatively for a hostname.
                </p>
              </div>
            </header>

            <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Create Domain</legend>

              <section
                class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)"> General </span>
                    </h2>
                    <Hint
                      text="The two fields this endpoint requires: what the domain is called here, and the hostname it answers for."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small">
                          <Item.Content>
                            <Item.Title>Name</Item.Title>
                            <Item.Description
                              >Identifies the domain in this list. It is not the
                              hostname.</Item.Description
                            >
                          </Item.Content>
                          <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                            <Item.Actions class="w-full">
                              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                <InputText
                                  v-model="form.name"
                                  size="large"
                                  class="w-full"
                                  aria-label="Name"
                                  placeholder="My domain"
                                  autocomplete="off"
                                  :required="!!errors.name && errors.nameKind === 'required'"
                                  :invalid="!!errors.name && errors.nameKind === 'invalid'"
                                  :aria-describedby="
                                    errors.name ? 'create-domain-name-message' : undefined
                                  "
                                  @update:model-value="errors.name = ''"
                                />
                                <HelperText
                                  v-if="errors.name"
                                  id="create-domain-name-message"
                                  :kind="errors.nameKind"
                                  :label="errors.name"
                                />
                              </div>
                            </Item.Actions>
                          </div>
                        </Item>
                        <Item size="small">
                          <Item.Content>
                            <Item.Title>Domain Name</Item.Title>
                            <Item.Description
                              >The root hostname this domain answers for, without a subdomain.
                              Pasting a zone file here imports its records
                              instead.</Item.Description
                            >
                          </Item.Content>
                          <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                            <Item.Actions class="w-full">
                              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                <InputText
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
                              </div>
                            </Item.Actions>
                          </div>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </div>
              </section>

              <section
                class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <button
                        type="button"
                        :aria-expanded="advancedOpen"
                        aria-controls="create-domain-advanced"
                        :data-state="advancedOpen ? 'open' : 'closed'"
                        class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                        @click="advancedOpen = !advancedOpen"
                      >
                        <i
                          class="pi pi-cog shrink-0 text-body-sm leading-none text-(--text-muted)"
                          aria-hidden="true"
                        />
                        Advanced
                        <i
                          class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </button>
                    </h2>
                  </div>
                </div>
                <div
                  id="create-domain-advanced"
                  :data-open="advancedOpen || null"
                  :inert="!advancedOpen || undefined"
                  :aria-hidden="!advancedOpen || undefined"
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 overflow-hidden">
                    <div
                      :data-open="advancedOpen || null"
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <CardBox :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>DNSSEC</Item.Title>
                                <Item.Description
                                  >Signs this domain's answers so a resolver can detect cache
                                  poisoning and spoofing. Completing the setup also means adding the
                                  Key Tag and Digest at your domain provider.</Item.Description
                                >
                              </Item.Content>
                              <Item.Actions>
                                <Switch
                                  v-model="form.dnssec"
                                  aria-label="Enable DNSSEC"
                                />
                              </Item.Actions>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Active</Item.Title>
                                <Item.Description
                                  >When active, the domain answers authoritative DNS queries for its
                                  hostname.</Item.Description
                                >
                              </Item.Content>
                              <Item.Actions>
                                <Switch
                                  v-model="form.active"
                                  aria-label="Active"
                                />
                              </Item.Actions>
                            </Item>
                          </Item.List>
                        </template>
                      </CardBox>
                    </div>
                  </div>
                </div>
              </section>
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
            <div class="ml-auto flex shrink-0 items-center gap-(--spacing-sm)">
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
