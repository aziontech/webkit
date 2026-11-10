<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Stepper from '@aziontech/webkit/stepper'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, ref } from 'vue'

  const breadcrumb = [
    { label: 'Access Lists', href: '/access-lists' },
    { label: 'Create Access List' }
  ]
  const policies = [
    { value: 'acme-production', label: 'acme-production', description: 'acme-site', ready: true },
    { value: 'acme-staging', label: 'acme-staging', description: 'acme-site', ready: false },
    { value: 'api-hardening', label: 'api-hardening', description: 'legacy-api', ready: false },
    {
      value: 'checkout-shield',
      label: 'checkout-shield',
      description: 'ecommerce-v2',
      ready: false
    },
    { value: 'dev-sandbox', label: 'dev-sandbox', description: 'internal', ready: false },
    {
      value: 'marketing-site',
      label: 'marketing-site',
      description: 'marketing-site',
      ready: false
    },
    { value: 'payments-api', label: 'payments-api', description: 'ecommerce-v2', ready: false },
    { value: 'partner-gateway', label: 'partner-gateway', description: 'legacy-api', ready: true },
    { value: 'admin-allowlist', label: 'admin-allowlist', description: 'status-page', ready: true },
    {
      value: 'media-delivery',
      label: 'media-delivery',
      description: 'blog-platform',
      ready: false
    },
    { value: 'acme-canary', label: 'acme-canary', description: 'acme-docs', ready: false },
    {
      value: 'search-api-shield',
      label: 'search-api-shield',
      description: 'ecommerce-storefront',
      ready: false
    },
    {
      value: 'legacy-storefront',
      label: 'legacy-storefront',
      description: 'ecommerce-storefront',
      ready: false
    },
    { value: 'qa-sandbox', label: 'qa-sandbox', description: 'internal', ready: false }
  ]
  const types = [
    {
      value: 'asn',
      label: 'ASN',
      description: 'Identify networks by Autonomous System Number. Suited to grouping traffic.'
    },
    {
      value: 'ip_cidr',
      label: 'IP/CIDR',
      description:
        'Specific IP addresses or ranges in CIDR notation, for precise traffic segmentation.'
    },
    {
      value: 'countries',
      label: 'Countries',
      description: 'Group traffic by country, for location-based rules.'
    }
  ]
  const listFields = {
    asn: {
      label: 'List',
      placeholder: '13335\n53331',
      helper:
        'One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed.'
    },
    ip_cidr: {
      label: 'List',
      placeholder: '185.241.208.232\n194.26.192.64\n171.25.193.25 #comment',
      helper:
        'One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed.'
    },
    countries: {
      label: 'Countries',
      placeholder: 'BR\nUS',
      helper: 'One or more countries, one two-letter ISO 3166-1 code per line, such as BR.'
    }
  }

  const VISIBLE = 6

  const current = ref('settings')
  const direction = ref(null)
  const choice = ref('acme-production')
  const enableModule = ref(false)
  const query = ref('')
  const form = reactive({ name: 'office-ranges', type: 'asn', items: '' })
  const errors = reactive({})
  const unlocked = ref(['where-it-runs', 'general', 'settings'])

  const moduleMissing = computed(
    () => !!choice.value && !policies.find((option) => option.value === choice.value)?.ready
  )

  const definitions = computed(() => [
    {
      value: 'where-it-runs',
      title: 'Where it runs',
      description: 'Select the policy whose rules match it. It needs IP filtering on.',
      heading: false,
      fields: []
    },
    ...(moduleMissing.value
      ? [
          {
            value: 'module',
            title: 'IP filtering',
            description: 'Off on ' + choice.value + '.',
            fields: []
          }
        ]
      : []),
    {
      value: 'general',
      title: 'General',
      description:
        'Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in policy rules.',
      fields: ['name']
    },
    {
      value: 'settings',
      title: 'List settings',
      description:
        'The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it.',
      fields: ['type', 'items']
    }
  ])

  const index = computed(() =>
    Math.max(
      0,
      definitions.value.findIndex((entry) => entry.value === current.value)
    )
  )
  const step = computed(() => definitions.value[index.value])
  const isFirst = computed(() => index.value === 0)
  const isLast = computed(() => index.value === definitions.value.length - 1)

  const steps = computed(() =>
    definitions.value.map((entry, position) => ({
      value: entry.value,
      title: entry.title,
      description: entry.description,
      state: entry.fields.some((field) => errors[field])
        ? 'error'
        : position < index.value
          ? 'complete'
          : 'upcoming',
      disabled: !unlocked.value.includes(entry.value)
    }))
  )

  const listField = computed(() => listFields[form.type])

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return policies
    return policies.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!choice.value || head.some((option) => option.value === choice.value)) return head
    const picked = matches.value.find((option) => option.value === choice.value)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const validate = (fields) => {
    for (const field of fields) delete errors[field]
    if (fields.includes('name') && !form.name.trim()) {
      errors.name = { kind: 'required', message: 'This field is required.' }
    }
    if (fields.includes('items') && !form.items.trim()) {
      errors.items = { kind: 'required', message: 'This field is required.' }
    }
    return fields.every((field) => !errors[field])
  }

  const goNext = () => {
    if (!validate(step.value.fields)) return
    const next = definitions.value[index.value + 1]
    if (!next) return
    if (!unlocked.value.includes(next.value)) unlocked.value.push(next.value)
    direction.value = 'forward'
    current.value = next.value
  }

  const goBack = () => {
    const previous = definitions.value[index.value - 1]
    if (!previous) return
    direction.value = 'back'
    current.value = previous.value
  }

  const choose = (option) => {
    choice.value = option.value
    enableModule.value = false
    goNext()
  }

  const skip = () => {
    choice.value = ''
    enableModule.value = false
    goNext()
  }

  const onSearchEnter = () => {
    if (matches.value.length) choose(matches.value[0])
  }

  const commit = () => {
    if (!isLast.value) {
      goNext()
      return
    }
    validate(['name', 'type', 'items'])
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Access Lists"
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

    <div class="flex min-h-0 flex-1">
      <aside
        class="hidden h-full w-64 shrink-0 overflow-auto border-r border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block"
      >
        <div class="flex h-full">
          <Stepper
            v-model="current"
            aria-label="Create Access List"
            class="w-full"
          >
            <Stepper.Step
              v-for="entry in steps"
              :key="entry.value"
              :value="entry.value"
              :title="entry.title"
              :description="entry.value === current ? entry.description : ''"
              :state="entry.state"
              :disabled="entry.disabled"
            />
          </Stepper>
        </div>
      </aside>

      <form
        class="flex min-w-0 flex-1 flex-col"
        :aria-label="step.title"
        novalidate
        @submit.prevent="commit"
      >
        <main
          :data-direction="direction"
          class="group/main data-[direction=forward]:[--page-enter-distance:calc(var(--layout-boundary-inline)*-1)] animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
        >
          <div class="flex min-h-full flex-col">
            <div
              class="layout-form-create layout-boundary-inline flex flex-1 flex-col pt-(--layout-section-gap) pb-(--layout-section-gap)"
            >
              <p class="pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden">
                Step {{ index + 1 }} of {{ steps.length }}
              </p>

              <header
                v-if="step.heading !== false"
                class="flex flex-wrap items-start justify-between gap-(--spacing-md)"
              >
                <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <h1
                      data-size="small"
                      class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
                    >
                      {{ step.title }}
                    </h1>
                  </div>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    {{ step.description }}
                  </p>
                </div>
              </header>

              <fieldset
                class="mx-0 flex min-w-0 flex-1 flex-col border-0 p-0 data-headed:mt-(--layout-section-gap)"
                :data-headed="step.heading !== false || null"
              >
                <legend class="sr-only">{{ step.title }}</legend>
                <section
                  v-if="current === 'where-it-runs'"
                  data-wide
                  class="mx-auto flex w-full max-w-(--container-2xs) flex-col items-center gap-(--spacing-lg) data-wide:max-w-(--container-md)"
                  aria-labelledby="create-access-list-host-title"
                >
                  <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
                    <span
                      class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <i
                        class="pi pi-list text-body-lg leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </span>
                    <h1
                      id="create-access-list-host-title"
                      class="text-heading-xs text-(--text-default)"
                    >
                      Create Access List
                    </h1>
                    <p class="text-body-sm text-(--text-muted)">Choose a policy to continue</p>
                  </header>

                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                    <InputText
                      v-model="query"
                      size="large"
                      class="w-full"
                      placeholder="Find policy…"
                      aria-label="Find policy"
                      autocomplete="off"
                      @keydown.enter.prevent="onSearchEnter"
                    />

                    <div class="flex flex-col">
                      <button
                        v-for="option in visible"
                        :key="option.value"
                        type="button"
                        :aria-pressed="choice === option.value"
                        :data-selected="choice === option.value || null"
                        class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none data-selected:bg-(--bg-selected) motion-reduce:transition-none"
                        @click="choose(option)"
                      >
                        <i
                          class="pi pi-shield shrink-0 text-body-md leading-none text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
                          {{ option.label }}
                        </span>
                        <Tag
                          v-if="!option.ready"
                          label="IP filtering off"
                          severity="warning"
                          size="small"
                        />
                        <i
                          v-if="choice === option.value"
                          class="pi pi-check shrink-0 text-body-sm leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </button>

                      <p
                        v-if="hidden"
                        class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                      >
                        {{ hidden }} more — type to narrow.
                      </p>
                      <p
                        v-else-if="!matches.length"
                        class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                      >
                        No policy matches “{{ query.trim() }}”.
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-col items-center gap-(--spacing-xxs)">
                    <Button
                      type="button"
                      label="Create a policy"
                      kind="text"
                      size="small"
                    />
                    <Button
                      type="button"
                      label="Continue without a policy"
                      kind="text"
                      size="small"
                      @click="skip"
                    />
                  </div>
                </section>

                <CardBox
                  v-else-if="current === 'module'"
                  :padded="false"
                >
                  <template #content>
                    <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                      <Message
                        severity="warning"
                        size="small"
                        :label="
                          'An access list is only read by policy rules, and ' +
                          choice +
                          ' has IP filtering off — so nothing reads this one until the module is on.'
                        "
                      />

                      <FieldSwitchBlock
                        v-model="enableModule"
                        label="Turn on IP filtering"
                        :description="
                          'Sets modules.ip_filtering on the policy ' +
                          choice +
                          ' when this access list is created.'
                        "
                      />

                      <p class="text-body-sm text-(--text-muted)">
                        Leaving it off still creates the access list — it simply is not read until
                        someone turns IP filtering on.
                      </p>
                    </div>
                  </template>
                </CardBox>

                <section
                  v-else-if="current === 'general'"
                  class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                    <CardBox :padded="false">
                      <template #content>
                        <Item.List>
                          <Item size="small">
                            <Item.Content>
                              <Item.Title>Name</Item.Title>
                              <Item.Description
                                >Give a unique and descriptive name to identify the access
                                list.</Item.Description
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
                                    placeholder="office-ranges"
                                    autocomplete="off"
                                    :required="errors.name?.kind === 'required'"
                                    :aria-describedby="
                                      errors.name ? 'create-access-list-name-message' : undefined
                                    "
                                    @update:model-value="delete errors.name"
                                  />
                                  <HelperText
                                    v-if="errors.name"
                                    id="create-access-list-name-message"
                                    :kind="errors.name.kind"
                                    :label="errors.name.message"
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
                  v-else
                  class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                    <CardBox :padded="false">
                      <template #content>
                        <Item.List>
                          <Item size="small">
                            <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                              <Item.Content>
                                <Item.Title>Type</Item.Title>
                              </Item.Content>
                              <Item.Actions class="w-full">
                                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                  <fieldset
                                    class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0"
                                  >
                                    <legend class="sr-only">Type</legend>
                                    <FieldRadioBlock
                                      v-for="option in types"
                                      :key="option.value"
                                      v-model="form.type"
                                      :value="option.value"
                                      name="access-lists-type"
                                      :label="option.label"
                                      :description="option.description"
                                    />
                                  </fieldset>
                                </div>
                              </Item.Actions>
                            </div>
                          </Item>
                          <Item size="small">
                            <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                              <Item.Content>
                                <Item.Title>{{ listField.label }}</Item.Title>
                                <Item.Description>{{ listField.helper }}</Item.Description>
                              </Item.Content>
                              <Item.Actions class="w-full">
                                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                  <Textarea
                                    v-model="form.items"
                                    class="w-full"
                                    :rows="5"
                                    :aria-label="listField.label"
                                    :placeholder="listField.placeholder"
                                    :required="errors.items?.kind === 'required'"
                                    :aria-describedby="
                                      errors.items ? 'create-access-list-items-message' : undefined
                                    "
                                    @update:model-value="delete errors.items"
                                  />
                                  <HelperText
                                    v-if="errors.items"
                                    id="create-access-list-items-message"
                                    :kind="errors.items.kind"
                                    :label="errors.items.message"
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
              </fieldset>
            </div>
          </div>
        </main>

        <footer class="shrink-0 border-t border-(--border-default) bg-(--bg-surface)">
          <div
            class="layout-form-create layout-boundary-inline flex items-center justify-between gap-(--spacing-sm) py-(--spacing-md)"
          >
            <Button
              type="button"
              label="Cancel"
              kind="text"
              size="medium"
            />
            <div class="flex shrink-0 items-center gap-(--spacing-sm)">
              <Button
                v-if="!isFirst"
                type="button"
                label="Back"
                kind="outlined"
                size="medium"
                @click="goBack"
              />
              <Button
                :label="isLast ? 'Create access list' : 'Next'"
                kind="primary"
                size="medium"
                type="submit"
              />
            </div>
          </div>
        </footer>
      </form>
    </div>
  </div>
</template>
