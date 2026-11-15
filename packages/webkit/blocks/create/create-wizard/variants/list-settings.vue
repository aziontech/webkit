<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText, { type HelperTextType } from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SectionHeader from '@aziontech/webkit/section-header'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Wizard from '@aziontech/webkit/wizard'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  type ListType = 'asn' | 'ip_cidr' | 'countries'
  type FieldName = 'name' | 'type' | 'items'

  interface PolicyOption {
    value: string
    label: string
    description: string
    ready: boolean
  }

  interface ListField {
    label: string
    placeholder: string
    helper: string
  }

  interface FieldError {
    type: HelperTextType
    message: string
  }

  interface StepDefinition {
    value: string
    title: string
    description: string
    fields: FieldName[]
  }

  const breadcrumb = [
    { label: 'Access Lists', href: '/access-lists' },
    { label: 'Create Access List' }
  ]
  const policies: PolicyOption[] = [
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
  const listFields: Record<ListType, ListField> = {
    asn: {
      label: 'List',
      placeholder: '13335\n53331',
      helper:
        'One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed.'
    },
    ip_cidr: {
      label: 'List',
      placeholder: '192.0.2.10\n198.51.100.24\n203.0.113.7 #comment',
      helper:
        'One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed.'
    },
    countries: {
      label: 'Countries',
      placeholder: 'US\nCA',
      helper: 'One or more countries, one two-letter ISO 3166-1 code per line, such as US.'
    }
  }

  const VISIBLE = 6

  const current = ref('settings')
  const choice = ref('acme-production')
  const enableModule = ref(false)
  const query = ref('')
  const form = reactive<{ name: string; type: ListType; items: string }>({
    name: 'office-ranges',
    type: 'asn',
    items: ''
  })
  const errors = reactive<Partial<Record<FieldName, FieldError>>>({})
  const answered = ref(choice.value !== '')
  const whereMissing = ref(false)

  const moduleMissing = computed(
    () => !!choice.value && !policies.find((option) => option.value === choice.value)?.ready
  )

  const definitions = computed((): StepDefinition[] => [
    {
      value: 'where-it-runs',
      title: 'Where it runs',
      description: 'Select the policy whose rules match it. It needs IP filtering on.',
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
    },
    {
      value: 'review',
      title: 'Review',
      description: 'Check what is created and where it runs. Edit any part, then create the list.',
      fields: []
    }
  ])

  const index = computed(() =>
    Math.max(
      0,
      definitions.value.findIndex((entry) => entry.value === current.value)
    )
  )
  const stepIndex = computed({
    get: () => index.value,
    set: (position: number) => {
      const next = definitions.value[position]
      if (next) current.value = next.value
    }
  })

  const byValue = (value: string) =>
    definitions.value.find((entry) => entry.value === value) ?? definitions.value[0]

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

  const validate = (fields: FieldName[]) => {
    for (const field of fields) delete errors[field]
    if (fields.includes('name') && !form.name.trim()) {
      errors.name = { type: 'required', message: 'This field is required.' }
    }
    if (fields.includes('items') && !form.items.trim()) {
      errors.items = { type: 'required', message: 'This field is required.' }
    }
    return fields.every((field) => !errors[field])
  }

  const answer = (value: string) => {
    choice.value = value
    answered.value = true
    enableModule.value = false
    whereMissing.value = false
    stepIndex.value = 1
  }

  const choose = (option: PolicyOption) => answer(option.value)

  const skip = () => answer('')

  const onSearchEnter = () => {
    if (matches.value.length) choose(matches.value[0])
  }

  const entries = computed(() =>
    Array.from(
      new Set(
        form.items
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      )
    )
  )
  const PREVIEW = 5
  const typeLabel = computed(() => types.find((option) => option.value === form.type)?.label)
  const consumers = [
    {
      by: 'Policy rules',
      path: 'rules[].criteria[].argument',
      as: 'Network list'
    },
    {
      by: 'Rule sets',
      path: 'rule_sets[].match.network_list',
      as: 'Network list'
    }
  ]

  const editStep = (value: string) => {
    current.value = value
  }

  const onNext = (event: MouseEvent, position: number) => {
    const entry = definitions.value[position]
    if (entry?.value === 'where-it-runs' && !answered.value) {
      whereMissing.value = true
      event.preventDefault()
      return
    }
    if (entry && !validate(entry.fields)) event.preventDefault()
  }

  const creating = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const commit = () => {
    if (creating.value) return
    if (!validate(['name', 'type', 'items'])) {
      const failed = definitions.value.find((entry) => entry.fields.some((field) => errors[field]))
      if (failed) editStep(failed.value)
      return
    }
    creating.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      creating.value = false
      toast.success(`${form.name} created.`, {
        description: choice.value
          ? `Rules of ${choice.value} can match on it now.`
          : 'Bind it to a policy to use it in rules.'
      })
    }, 900)
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Start>
        <IconButton
          icon="ai ai-chevron-left"
          aria-label="Back to Access Lists"
          variant="outline"
          size="small"
        />
        <GlobalHeader.Brand>
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
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Start>
      <GlobalHeader.Center />
      <GlobalHeader.End>
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
      </GlobalHeader.End>
    </GlobalHeader>

    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <div
        class="layout-form-create layout-boundary-inline flex flex-col gap-(--layout-section-gap) py-(--layout-section-gap)"
      >
        <PageHeader
          title="Create Access List"
          description="An access list groups IP addresses, countries or ASNs that policy rules match on. Answer each step, review, then create it."
          size="small"
        />

        <Wizard
          v-model="stepIndex"
          aria-label="Create Access List"
          submit-label="Create Access List"
          :loading="creating"
          @next="onNext"
          @submit="commit"
        >
          <Wizard.Step
            title="Where it runs"
            :description="byValue('where-it-runs').description"
          >
            <section class="mx-auto flex w-full max-w-(--container-md) flex-col gap-(--spacing-lg)">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Input
                  v-model="query"
                  size="large"
                  class="w-full"
                  placeholder="Search policies"
                  aria-label="Search policies"
                  autocomplete="off"
                  @keydown.enter.prevent="onSearchEnter"
                />

                <div class="flex flex-col">
                  <Item
                    v-for="option in visible"
                    :key="option.value"
                    size="small"
                    clickable
                    :aria-pressed="choice === option.value"
                    @click="choose(option)"
                  >
                    <Item.Media>
                      <i
                        class="ai ai-shield text-body-md leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </Item.Media>
                    <Item.Content>
                      <Item.Title>{{ option.label }}</Item.Title>
                    </Item.Content>
                    <Item.Actions>
                      <Tag
                        v-if="!option.ready"
                        label="IP filtering off"
                        severity="warning"
                        size="small"
                      />
                      <i
                        v-if="choice === option.value"
                        class="ai ai-check text-body-sm leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </Item.Actions>
                  </Item>

                  <p
                    v-if="hidden"
                    class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                  >
                    {{ hidden }} more. Type to narrow the list.
                  </p>
                  <p
                    v-else-if="!matches.length"
                    class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                  >
                    No policy matches “{{ query.trim() }}”.
                  </p>
                </div>
                <HelperText
                  v-if="whereMissing"
                  type="required"
                  label="Select a policy, or continue without one."
                />
              </div>

              <div class="flex flex-col items-center gap-(--spacing-2xs)">
                <Button
                  type="button"
                  label="Create a policy"
                  variant="ghost"
                  size="small"
                />
                <Button
                  type="button"
                  label="Continue without a policy"
                  variant="ghost"
                  size="small"
                  @click="skip"
                />
              </div>
            </section>
          </Wizard.Step>
          <Wizard.Step
            v-if="moduleMissing"
            title="IP filtering"
            :description="'Off on ' + choice + '.'"
          >
            <Card :padded="false">
              <template #default>
                <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                  <Alert
                    severity="warning"
                    size="small"
                    :label="
                      'An access list is only read by policy rules, and ' +
                      choice +
                      ' has IP filtering off, so nothing reads this one until the module is on.'
                    "
                  />

                  <Field.Label>
                    <Field orientation="horizontal">
                      <Switch v-model="enableModule" />
                      <Field.Content>
                        <Field.Title> Turn on IP filtering </Field.Title>
                        <Field.Description>
                          {{
                            'Sets modules.ip_filtering on the policy ' +
                            choice +
                            ' when this access list is created.'
                          }}
                        </Field.Description>
                      </Field.Content>
                    </Field>
                  </Field.Label>

                  <p class="text-body-sm text-(--text-muted)">
                    Leaving it off still creates the access list. It is not read until someone turns
                    IP filtering on.
                  </p>
                </div>
              </template>
            </Card>
          </Wizard.Step>
          <Wizard.Step
            title="General"
            :description="byValue('general').description"
          >
            <section
              class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingRow
                        title="Name"
                        description="Give a unique and descriptive name to identify the access list."
                      >
                        <Input
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="office-ranges"
                          autocomplete="off"
                          :required="errors.name?.type === 'required'"
                          :aria-describedby="
                            errors.name ? 'create-access-list-name-message' : undefined
                          "
                          @update:model-value="delete errors.name"
                        />
                        <HelperText
                          v-if="errors.name"
                          id="create-access-list-name-message"
                          :type="errors.name.type"
                          :label="errors.name.message"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </div>
            </section>
          </Wizard.Step>
          <Wizard.Step
            title="List settings"
            :description="byValue('settings').description"
          >
            <section
              class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingRow
                        title="Type"
                        variant="stacked"
                      >
                        <RadioGroup
                          v-model="form.type"
                          variant="card"
                          class="w-full"
                          name="access-lists-type"
                          aria-label="Type"
                        >
                          <RadioGroup.Item
                            v-for="option in types"
                            :key="option.value"
                            :value="option.value"
                            :description="option.description"
                            >{{ option.label }}</RadioGroup.Item
                          >
                        </RadioGroup>
                      </SettingRow>
                      <SettingRow
                        :title="listField.label"
                        :description="listField.helper"
                        variant="stacked"
                      >
                        <Textarea
                          v-model="form.items"
                          class="w-full"
                          :rows="5"
                          :aria-label="listField.label"
                          :placeholder="listField.placeholder"
                          :required="errors.items?.type === 'required'"
                          :aria-describedby="
                            errors.items ? 'create-access-list-items-message' : undefined
                          "
                          @update:model-value="delete errors.items"
                        />
                        <HelperText
                          v-if="errors.items"
                          id="create-access-list-items-message"
                          :type="errors.items.type"
                          :label="errors.items.message"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </div>
            </section>
          </Wizard.Step>
          <Wizard.Step
            title="Review"
            :description="byValue('review').description"
          >
            <section class="flex min-w-0 flex-col gap-(--layout-section-gap)">
              <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <SectionHeader
                  title="Where it runs"
                  size="small"
                >
                  <template #actions>
                    <Button
                      type="button"
                      label="Edit"
                      variant="outline"
                      size="small"
                      aria-label="Edit where it runs"
                      @click="editStep('where-it-runs')"
                    />
                  </template>
                </SectionHeader>
                <Alert
                  key="alert-1"
                  v-if="!choice"
                  severity="warning"
                >
                  Bound to no policy. The list is created, but no rule can match on it until a
                  policy uses it.
                </Alert>
                <Alert
                  key="alert-2"
                  v-else-if="moduleMissing && !enableModule"
                  severity="warning"
                >
                  IP filtering is off on {{ choice }}, so no rule reads this list until it is on.
                </Alert>
                <Alert
                  key="alert-3"
                  severity="success"
                >
                  Runs on {{ choice }}.
                </Alert>
              </section>

              <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <SectionHeader
                  title="What gets created"
                  description="Each value is sent as the property named under it."
                  size="small"
                >
                  <template #actions>
                    <Button
                      type="button"
                      label="Edit"
                      variant="outline"
                      size="small"
                      aria-label="Edit list settings"
                      @click="editStep('settings')"
                    />
                  </template>
                </SectionHeader>
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <Item>
                        <Item.Content>
                          <Item.Title>Name</Item.Title>
                          <Item.Description>name</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <span class="max-w-80 truncate text-label-sm text-(--text-default)">{{
                            form.name
                          }}</span>
                          <Button
                            type="button"
                            label="Edit"
                            variant="ghost"
                            size="small"
                            aria-label="Edit name"
                            @click="editStep('general')"
                          />
                        </Item.Actions>
                      </Item>
                      <Item>
                        <Item.Content>
                          <Item.Title>Type</Item.Title>
                          <Item.Description>type</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <span class="text-label-sm text-(--text-default)">{{ typeLabel }}</span>
                        </Item.Actions>
                      </Item>
                      <Item>
                        <Item.Content>
                          <Item.Title>{{ listField.label }}</Item.Title>
                          <Item.Description>items</Item.Description>
                          <ul
                            class="m-0 mt-(--spacing-xs) flex list-none flex-wrap gap-(--spacing-2xs) p-0"
                            :aria-label="`${entries.length} entries`"
                          >
                            <li
                              v-for="entry in entries.slice(0, PREVIEW)"
                              :key="entry"
                            >
                              <Tag
                                :label="entry"
                                severity="neutral"
                                size="small"
                              />
                            </li>
                            <li
                              v-if="entries.length > PREVIEW"
                              class="text-label-sm text-(--text-muted)"
                            >
                              and {{ entries.length - PREVIEW }} more
                            </li>
                          </ul>
                        </Item.Content>
                        <Item.Actions>
                          <span class="text-label-sm text-(--text-default)"
                            >{{ entries.length }}
                            {{ entries.length === 1 ? 'entry' : 'entries' }}</span
                          >
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </Card>
              </section>

              <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <SectionHeader
                  title="What can reference it"
                  description="Everything that can point at this list once it exists, and the field that carries the reference."
                  size="small"
                />
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <Item
                        v-for="row in consumers"
                        :key="row.by"
                      >
                        <Item.Content>
                          <Item.Title>{{ row.by }}</Item.Title>
                          <Item.Description>{{ row.path }}</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <Tag
                            :label="row.as"
                            severity="neutral"
                            size="small"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </Card>
              </section>
            </section>
          </Wizard.Step>
        </Wizard>
      </div>
    </main>
  </div>
</template>
