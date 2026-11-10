<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Hint from '@aziontech/webkit/hint'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, ref } from 'vue'

  const form = reactive({
    accountName: 'Acme',
    clientId: '9757a',
    companyName: '',
    companyId: '',
    billingEmails: 'name@example.com',
    postalCode: '00000-000',
    country: 'br',
    state: 'rs',
    city: 'poa',
    address: 'n',
    apartment: '',
    allowSocialLogin: true,
    enforceMfa: false
  })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const save = () => {
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }
  const discard = () => Object.assign(form, JSON.parse(baseline.value))

  const places = [
    {
      key: 'country',
      label: 'Country',
      options: [
        { label: 'Brazil', value: 'br' },
        { label: 'United States', value: 'us' },
        { label: 'Portugal', value: 'pt' }
      ]
    },
    {
      key: 'state',
      label: 'State/Region',
      options: [
        { label: 'Rio Grande do Sul', value: 'rs' },
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' }
      ]
    },
    {
      key: 'city',
      label: 'City',
      options: [
        { label: 'Porto Alegre', value: 'poa' },
        { label: 'São Paulo', value: 'sao' },
        { label: 'Rio de Janeiro', value: 'rio' }
      ]
    }
  ]
  const sourceControls = [
    {
      key: 'github',
      name: 'Github',
      icon: 'ai ai-github',
      connected: true,
      tag: 'Active',
      description:
        'Connected as rafael.umman: to repositories in organizations: acme, rafael-personal.',
      action: 'Manage'
    },
    {
      key: 'gitlab',
      name: 'Gitlab',
      icon: 'ai-cor ai-gitlab',
      connected: false,
      tag: '',
      description: 'Connect GitLab to build and deploy from its repositories.',
      action: 'Connect'
    },
    {
      key: 'bitbucket',
      name: 'Bitbucket',
      icon: 'ai-cor ai-bitbucket',
      connected: false,
      tag: '',
      description: 'Connect Bitbucket to build and deploy from its repositories.',
      action: 'Connect'
    }
  ]
  const fonts = [
    { value: 'rubik', label: 'Rubik (Default)' },
    { value: 'rubik', label: 'Rubik' },
    { value: 'inter', label: 'Inter' },
    { value: 'ibm-plex-sans', label: 'IBM Plex Sans' },
    { value: 'geist', label: 'Geist' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'work-sans', label: 'Work Sans' },
    { value: 'instrument-sans', label: 'Instrument Sans' },
    { value: 'hedvig-letters-sans', label: 'Hedvig Letters Sans' }
  ]
  const appearances = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]
  const font = ref('rubik')
  const theme = ref('system')
</script>

<template>
  <main class="flex h-screen flex-col bg-(--bg-canvas)">
    <div class="flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Profile"
        novalidate
        @submit.prevent="save"
      >
        <div class="min-h-0 flex-1 overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
              <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <h1
                    data-size="small"
                    class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
                  >
                    Profile
                  </h1>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">
                  Manage your identity, company details, address, and sign-in preferences.
                </p>
              </div>
            </header>
            <fieldset
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">Profile</legend>
              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <button
                      type="button"
                      aria-label="Copy link to the General section"
                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                    >
                      <i
                        class="pi pi-link text-body-xs"
                        aria-hidden="true"
                      />
                    </button>
                    <h2
                      id="general"
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">General</span>
                    </h2>
                    <Hint
                      text="How this account is identified on the platform."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div
                  data-open
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Account Name</Item.Title>
                                <Item.Description
                                  >What this account is called across the console.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Input
                                      v-model="form.accountName"
                                      size="large"
                                      class="w-full"
                                      aria-label="Account Name"
                                      :disabled="saving"
                                    />
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Client ID</Item.Title>
                                <Item.Description
                                  >Can't be changed. Quote it when opening a support ticket about
                                  this account.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Input
                                      v-model="form.clientId"
                                      size="large"
                                      class="w-full"
                                      aria-label="Client ID"
                                      readonly
                                      :disabled="saving"
                                    />
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                          </Item.List>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <button
                      type="button"
                      aria-label="Copy link to the Company information section"
                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                    >
                      <i
                        class="pi pi-link text-body-xs"
                        aria-hidden="true"
                      />
                    </button>
                    <h2
                      id="company-information"
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Company information</span>
                    </h2>
                    <Hint
                      text="The company that owns the account, as it appears on every invoice."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div
                  data-open
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Company Name</Item.Title>
                                <Item.Description
                                  >The legal entity that owns this account.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Input
                                      v-model="form.companyName"
                                      size="large"
                                      class="w-full"
                                      aria-label="Company Name"
                                      placeholder="Company S.A."
                                      :disabled="saving"
                                    />
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Company ID</Item.Title>
                                <Item.Description
                                  >Personal or company ID number that identifies account
                                  ownership.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Input
                                      v-model="form.companyId"
                                      size="large"
                                      class="w-full"
                                      aria-label="Company ID"
                                      placeholder="00.000.000/0001-00"
                                      :disabled="saving"
                                    />
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                            <Item size="small">
                              <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                                <Item.Content>
                                  <Item.Title>Billing emails</Item.Title>
                                  <Item.Description
                                    >Billing is forwarded to every address listed here. Separate
                                    each one with a semicolon ( ; ).</Item.Description
                                  >
                                </Item.Content>
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Textarea
                                      v-model="form.billingEmails"
                                      class="w-full"
                                      :rows="3"
                                      aria-label="Billing emails"
                                      :disabled="saving"
                                    />
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                          </Item.List>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <button
                      type="button"
                      aria-label="Copy link to the Address information section"
                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                    >
                      <i
                        class="pi pi-link text-body-xs"
                        aria-hidden="true"
                      />
                    </button>
                    <h2
                      id="address-information"
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Address information</span>
                    </h2>
                    <Hint
                      text="Where the account owner is registered, for invoices and tax purposes."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div
                  data-open
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Postal Code</Item.Title>
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Input
                                      v-model="form.postalCode"
                                      size="large"
                                      class="w-full"
                                      aria-label="Postal Code"
                                      :disabled="saving"
                                    />
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                            <Item
                              v-for="place in places"
                              :key="place.key"
                              size="small"
                            >
                              <Item.Content>
                                <Item.Title>{{ place.label }}</Item.Title>
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Select
                                      v-model="form[place.key]"
                                      size="large"
                                      :display-value="
                                        (value) =>
                                          place.options.find((option) => option.value === value)
                                            ?.label ?? ''
                                      "
                                    >
                                      <Select.Trigger
                                        class="w-full"
                                        :aria-label="place.label"
                                      />
                                      <Select.Content>
                                        <Select.Option
                                          v-for="option in place.options"
                                          :key="option.value"
                                          :value="option.value"
                                        >
                                          {{ option.label }}
                                        </Select.Option>
                                      </Select.Content>
                                    </Select>
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Address</Item.Title>
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Input
                                      v-model="form.address"
                                      size="large"
                                      class="w-full"
                                      aria-label="Address"
                                      :disabled="saving"
                                    />
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Apartment, floor, etc.</Item.Title>
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Input
                                      v-model="form.apartment"
                                      size="large"
                                      class="w-full"
                                      aria-label="Apartment, floor, etc."
                                      placeholder="1st floor"
                                      :disabled="saving"
                                    />
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                          </Item.List>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <button
                      type="button"
                      aria-label="Copy link to the Login Settings section"
                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                    >
                      <i
                        class="pi pi-link text-body-xs"
                        aria-hidden="true"
                      />
                    </button>
                    <h2
                      id="login-settings"
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Login Settings</span>
                    </h2>
                    <Hint
                      text="How the users linked to this account sign in."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div
                  data-open
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Allow social login</Item.Title>
                                <Item.Description
                                  >Users linked to the account can log in with their social network
                                  credentials.</Item.Description
                                >
                              </Item.Content>
                              <Item.Actions>
                                <Switch
                                  v-model="form.allowSocialLogin"
                                  aria-label="Allow social login"
                                  :disabled="saving"
                                />
                              </Item.Actions>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Enforce multi-factor authentication</Item.Title>
                                <Item.Description
                                  >MFA is required on login for every user linked to this
                                  account.</Item.Description
                                >
                              </Item.Content>
                              <Item.Actions>
                                <Switch
                                  v-model="form.enforceMfa"
                                  aria-label="Enforce multi-factor authentication"
                                  :disabled="saving"
                                />
                              </Item.Actions>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Authenticator devices</Item.Title>
                                <Item.Description
                                  >Manage the devices and recovery codes registered for this
                                  account.</Item.Description
                                >
                              </Item.Content>
                              <Item.Actions>
                                <Button
                                  type="button"
                                  label="Manage"
                                  kind="outlined"
                                  size="medium"
                                />
                              </Item.Actions>
                            </Item>
                          </Item.List>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <button
                      type="button"
                      aria-label="Copy link to the Source control section"
                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                    >
                      <i
                        class="pi pi-link text-body-xs"
                        aria-hidden="true"
                      />
                    </button>
                    <h2
                      id="source-control"
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Source control</span>
                    </h2>
                    <Hint
                      text="The Git providers this account builds applications from, connected at the provider and outside Save."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div
                  data-open
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <Item
                              v-for="provider in sourceControls"
                              :key="provider.key"
                              size="small"
                            >
                              <Item.Media>
                                <span
                                  class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                                >
                                  <i
                                    :class="[
                                      provider.icon,
                                      'text-body-lg leading-none text-(--text-default)'
                                    ]"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Item.Media>
                              <Item.Content>
                                <Item.Title>
                                  {{ provider.name }}
                                  <Tag
                                    v-if="provider.tag"
                                    :label="provider.tag"
                                    severity="success"
                                    size="small"
                                  />
                                </Item.Title>
                                <Item.Description>{{ provider.description }}</Item.Description>
                              </Item.Content>
                              <Item.Actions>
                                <Button
                                  type="button"
                                  :label="provider.action"
                                  kind="outlined"
                                  size="medium"
                                  :icon="provider.connected ? undefined : 'pi pi-external-link'"
                                />
                              </Item.Actions>
                            </Item>
                          </Item.List>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <button
                      type="button"
                      aria-label="Copy link to the Appearance section"
                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                    >
                      <i
                        class="pi pi-link text-body-xs"
                        aria-hidden="true"
                      />
                    </button>
                    <h2
                      id="appearance"
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Appearance</span>
                    </h2>
                    <Hint
                      text="Preferences for this browser, applied the moment you change them and not part of Save."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div
                  data-open
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Font family</Item.Title>
                                <Item.Description
                                  >The primary sans typeface across the console.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Select
                                      v-model="font"
                                      size="large"
                                      :display-value="
                                        (value) =>
                                          fonts.find((option) => option.value === value)?.label ??
                                          ''
                                      "
                                    >
                                      <Select.Trigger
                                        class="w-full"
                                        aria-label="Font family"
                                      />
                                      <Select.Content>
                                        <Select.Option
                                          v-for="option in fonts"
                                          :key="option.value"
                                          :value="option.value"
                                        >
                                          {{ option.label }}
                                        </Select.Option>
                                      </Select.Content>
                                    </Select>
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>System appearance</Item.Title>
                                <Item.Description
                                  >Follow the operating system, or force a light or dark
                                  theme.</Item.Description
                                >
                              </Item.Content>
                              <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                <Item.Actions class="w-full">
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <Select
                                      v-model="theme"
                                      size="large"
                                      :display-value="
                                        (value) =>
                                          appearances.find((option) => option.value === value)
                                            ?.label ?? ''
                                      "
                                    >
                                      <Select.Trigger
                                        class="w-full"
                                        aria-label="System appearance"
                                      />
                                      <Select.Content>
                                        <Select.Option
                                          v-for="option in appearances"
                                          :key="option.value"
                                          :value="option.value"
                                        >
                                          {{ option.label }}
                                        </Select.Option>
                                      </Select.Content>
                                    </Select>
                                  </div>
                                </Item.Actions>
                              </div>
                            </Item>
                          </Item.List>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <button
                      type="button"
                      aria-label="Copy link to the Danger Zone section"
                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                    >
                      <i
                        class="pi pi-link text-body-xs"
                        aria-hidden="true"
                      />
                    </button>
                    <h2
                      id="danger-zone"
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Danger Zone</span>
                    </h2>
                    <Hint
                      text="Actions that cannot be undone."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div
                  data-open
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Content>
                                <Item.Title>Remove personal account</Item.Title>
                                <Item.Description
                                  >Permanently deletes this Personal Account and all associated data
                                  from the platform. It cannot be undone.</Item.Description
                                >
                              </Item.Content>
                              <Item.Actions>
                                <Button
                                  type="button"
                                  label="Delete account"
                                  kind="danger"
                                  size="medium"
                                  icon="pi pi-trash"
                                />
                              </Item.Actions>
                            </Item>
                          </Item.List>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
            </fieldset>
          </div>
        </div>
        <Transition
          enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="translate-y-2 opacity-0"
          leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="translate-y-2 opacity-0"
        >
          <footer
            v-if="dirty || saving"
            class="sticky bottom-0 z-10 h-0 shrink-0"
          >
            <div
              class="absolute inset-x-0 bottom-0 border-t border-(--border-default) bg-(--bg-canvas) lg:h-14"
            >
              <div
                class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0"
              >
                <div class="flex min-w-0 items-start gap-(--spacing-xs)">
                  <i
                    class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <p class="min-w-0 text-body-sm text-(--text-default)">
                    You have unsaved changes.
                  </p>
                </div>
                <div
                  class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)"
                >
                  <Button
                    type="button"
                    label="Discard"
                    kind="outlined"
                    size="medium"
                    :disabled="saving"
                    @click="discard"
                  />
                  <Button
                    label="Save"
                    kind="primary"
                    size="medium"
                    :loading="saving"
                    @click="save"
                  />
                </div>
              </div>
            </div>
          </footer>
        </Transition>
      </form>
    </div>
  </main>
</template>
