<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import Progress from '@aziontech/webkit/progress'
  import RadioCards from '@aziontech/webkit/radio-cards'
  import Select from '@aziontech/webkit/select'
  import Separator from '@aziontech/webkit/separator'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const plans = [
    {
      value: 'free',
      label: "I'm working on personal projects",
      description: 'Start free for personal projects and experimentation',
      ariaLabel: "I'm working on personal projects. Free plan, Free.",
      name: 'Free',
      severity: 'contrast',
      price: 'Free'
    },
    {
      value: 'pro',
      label: "I'm working on commercial projects",
      description: 'For growing projects with higher usage demand',
      ariaLabel: "I'm working on commercial projects. Pro plan, From $20/mo.",
      name: 'Pro',
      severity: 'info',
      price: 'From $20/mo'
    },
    {
      value: 'enterprise',
      label: "I'm running production at scale",
      description: 'Optimize costs with usage or spend commitments',
      ariaLabel: "I'm running production at scale. Enterprise plan, From $2,000/mo.",
      name: 'Enterprise',
      severity: 'primary',
      price: 'From $2,000/mo'
    }
  ]
  const upgrades = {
    pro: {
      name: 'Pro',
      features: [
        { title: '100 resources', detail: 'then $0.10 per resource per month' },
        { title: '10M requests', detail: 'then as low as $0.90 per 1M' },
        { title: '50 hours of compute time', detail: 'then $0.18 per hour' },
        { title: '10 GB of event log storage', detail: 'then $0.10 per GB-month' },
        {
          title: '100 GB of file storage',
          detail: 'then as low as $0.021 per GB-month'
        },
        { title: '1 GB of database storage', detail: 'then $0.75 per GB-month' },
        {
          title: '100M security rule evaluations',
          detail: 'then as low as $0.30 per 1M'
        },
        { title: 'DDoS protection included' },
        { title: 'PCI DSS 4.0.1 Level 1' },
        { title: 'SOC 2 Type 2 / SOC 3' },
        { title: 'Data migration assistance' }
      ],
      charge: {
        monthly: {
          rows: [
            { label: 'Next charge', value: '$200' },
            { label: 'Subtotal', value: '$3,000', suffix: 'per month' }
          ],
          total: { value: '$3,000', suffix: 'per year' }
        },
        yearly: {
          rows: [
            { label: 'Next charge', value: '$200' },
            { label: 'Subtotal', value: '$3,000', suffix: 'per month' },
            { label: 'Yearly discount', value: '$2,200', suffix: 'per month' }
          ],
          total: { value: '$2,200', suffix: 'per year' }
        }
      }
    },
    enterprise: {
      name: 'Enterprise',
      features: [
        { title: 'Unlimited resources' },
        { title: '1B requests', detail: 'then as low as $0.60 per 1M' },
        { title: '500 hours of compute time', detail: 'then $0.12 per hour' },
        { title: '1 TB of event log storage', detail: 'then $0.08 per GB-month' },
        {
          title: '10 TB of file storage',
          detail: 'then as low as $0.015 per GB-month'
        },
        { title: '100 GB of database storage', detail: 'then $0.50 per GB-month' },
        {
          title: '1B security rule evaluations',
          detail: 'then as low as $0.20 per 1M'
        },
        { title: 'DDoS protection included' },
        { title: 'PCI DSS 4.0.1 Level 1' },
        { title: 'SOC 2 Type 2 / SOC 3' },
        { title: 'Data migration assistance' },
        { title: '99.99% uptime SLA' },
        { title: 'Named account team' }
      ],
      charge: {
        monthly: {
          rows: [
            { label: 'Next charge', value: '$2,000' },
            { label: 'Subtotal', value: '$24,000', suffix: 'per month' }
          ],
          total: { value: '$24,000', suffix: 'per year' }
        },
        yearly: {
          rows: [
            { label: 'Next charge', value: '$2,000' },
            { label: 'Subtotal', value: '$24,000', suffix: 'per month' },
            { label: 'Yearly discount', value: '$4,800', suffix: 'per month' }
          ],
          total: { value: '$19,200', suffix: 'per year' }
        }
      }
    }
  }
  const pricingLinks = [
    {
      label: 'Learn more about pricing',
      href: 'https://example.com/pricing'
    },
    {
      label: 'Compare plans',
      href: 'https://example.com/pricing#comparison'
    }
  ]
  const periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]
  const countryOptions = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Japan', label: 'Japan' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' }
  ]
  const stateOptions = [
    { value: 'California', label: 'California' },
    { value: 'New York', label: 'New York' },
    { value: 'Texas', label: 'Texas' },
    { value: 'Washington', label: 'Washington' }
  ]
  const cityOptions = [
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'San Diego', label: 'San Diego' },
    { value: 'San Francisco', label: 'San Francisco' }
  ]
  const accountAddress = {
    country: 'United States',
    postalCode: '94105',
    state: 'California',
    city: 'San Francisco',
    line1: '100 Market Street',
    line2: 'Suite 400'
  }
  const blankAddress = {
    country: undefined,
    postalCode: '',
    state: undefined,
    city: undefined,
    line1: '',
    line2: ''
  }
  const blankCard = { holder: '', country: undefined as string | undefined, number: '', expiry: '', code: '' }

  const plan = ref()
  const pendingPlanId = ref('')
  const upgradeOpen = ref(false)
  const submitted = ref(false)
  const router = useRouter()
  const next = () => {
    submitted.value = true
    if (plan.value) router.push('/onboarding/profile')
  }
  const period = ref('yearly')
  const editing = ref(false)
  const card = reactive({ last4: '8888', ...blankCard })
  const address = reactive({ useAccountInformation: true, ...accountAddress })

  const upgrade = computed(() => upgrades[pendingPlanId.value])
  const charge = computed(() => upgrade.value?.charge[period.value] ?? null)

  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? accountAddress : blankAddress)
  )

  const selectPlan = (value) => {
    submitted.value = false
    if (value === 'free') {
      plan.value = value
      return
    }
    pendingPlanId.value = value
    period.value = 'yearly'
    editing.value = false
    Object.assign(address, { useAccountInformation: true, ...accountAddress })
    upgradeOpen.value = true
  }

  const onOpenChange = (isOpen) => {
    upgradeOpen.value = isOpen
    if (!isOpen) pendingPlanId.value = ''
  }

  const confirmUpgrade = () => {
    plan.value = pendingPlanId.value
    onOpenChange(false)
  }

  const startEditing = () => {
    Object.assign(card, blankCard)
    editing.value = true
  }

  const updateCard = () => {
    const digits = card.number.replace(/\D/g, '')
    if (digits.length >= 4) card.last4 = digits.slice(-4)
    editing.value = false
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="https://example.com/docs"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div
        class="mx-auto grid w-full max-w-(--container-7xl) flex-1 grid-cols-1 items-center gap-(--spacing-xxl) px-(--layout-boundary-inline) py-(--spacing-xl) lg:min-h-0 lg:grid-cols-2 lg:items-start lg:overflow-y-auto lg:px-(--spacing-xl)"
      >
        <div class="mx-auto flex w-full max-w-(--container-xl) flex-col lg:my-auto">
          <Card
            :padded="false"
            class="w-full"
          >
            <template #content>
              <Progress
                :value="2"
                :max="3"
                size="small"
                shape="flat"
                class="shrink-0"
                aria-label="Step 2 of 3"
              />

              <div
                class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
              >
                <form
                  class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)"
                  aria-labelledby="onboarding-title"
                  novalidate
                  @submit.prevent="next"
                >
                  <header class="flex flex-col gap-(--spacing-xs)">
                    <div class="flex flex-col gap-(--spacing-xxs)">
                      <p class="text-label-sm text-(--text-muted)">Step 2 of 3</p>
                      <h1
                        id="onboarding-title"
                        tabindex="-1"
                        class="text-heading-sm text-(--text-default) focus:outline-none"
                      >
                        Select your plan
                      </h1>
                    </div>
                    <p class="text-body-sm text-(--text-muted)">
                      What you are building decides the plan. You can change it later from Billing.
                      Nothing here is locked in.
                    </p>
                  </header>

                  <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
                    <legend class="sr-only">Select your plan</legend>

                    <div class="animate-fade-in motion-reduce:animate-none">
                      <div class="flex flex-col gap-(--spacing-xs)">
                        <RadioCards
                          :model-value="pendingPlanId || plan"
                          :items="plans"
                          aria-label="Plan"
                          @update:model-value="selectPlan"
                        >
                          <template #default="{ item }">
                            <div
                              class="flex w-full items-center justify-between gap-(--spacing-sm)"
                            >
                              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                <span class="text-body-sm text-(--text-default)">{{
                                  item.label
                                }}</span>
                                <span class="text-body-xs text-(--text-muted)">{{
                                  item.description
                                }}</span>
                              </div>
                              <div class="flex shrink-0 flex-col items-end gap-(--spacing-xxs)">
                                <Tag
                                  :label="item.name"
                                  :severity="item.severity"
                                  size="small"
                                  rounded
                                />
                                <span class="text-label-sm text-(--text-muted)">
                                  {{ item.price }}
                                </span>
                              </div>
                            </div>
                          </template>
                        </RadioCards>

                        <HelperText
                          v-if="submitted && !plan"
                          kind="required"
                          label="Select a plan to continue."
                        />

                        <Drawer
                          :open="upgradeOpen"
                          size="large"
                          side="right"
                          @update:open="onOpenChange"
                        >
                          <DrawerPortal>
                            <DrawerOverlay />
                            <DrawerContent>
                              <form
                                class="flex min-h-0 flex-1 flex-col"
                                :aria-label="upgrade ? 'Upgrade to ' + upgrade.name : 'Upgrade'"
                                novalidate
                                @submit.prevent="confirmUpgrade"
                              >
                                <PanelHeader class="w-full">
                                  <DrawerTitle>Upgrade to {{ upgrade?.name }}</DrawerTitle>
                                  <DrawerClose />
                                </PanelHeader>

                                <PanelContent>
                                  <div
                                    class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-(--spacing-xl)"
                                  >
                                    <aside
                                      v-if="upgrade"
                                      class="flex flex-col gap-(--spacing-md)"
                                    >
                                      <div class="flex flex-col gap-(--spacing-xs)">
                                        <h3
                                          class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) lg:min-h-[calc(var(--spacing-sm)*2+var(--spacing-10)+1px)] lg:border-t lg:border-t-transparent lg:py-(--spacing-sm)"
                                        >
                                          What's included
                                        </h3>

                                        <ul class="m-0 flex list-none flex-col p-0">
                                          <li
                                            v-for="feature in upgrade.features"
                                            :key="feature.title"
                                            class="flex items-start gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xs) odd:bg-(--bg-mask)"
                                          >
                                            <i
                                              class="pi pi-check mt-0.5 shrink-0 text-body-xs leading-none text-(--success-contrast)"
                                              aria-hidden="true"
                                            />
                                            <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                              <span class="text-label-md text-(--text-default)">{{
                                                feature.title
                                              }}</span>
                                              <span
                                                v-if="feature.detail"
                                                class="text-body-xs text-(--text-muted)"
                                                >{{ feature.detail }}</span
                                              >
                                            </span>
                                          </li>
                                        </ul>
                                      </div>

                                      <div class="flex flex-col gap-(--spacing-xs)">
                                        <Separator />
                                        <div
                                          v-for="link in pricingLinks"
                                          :key="link.label"
                                          class="ms-(--spacing-xs) w-fit"
                                        >
                                          <Link
                                            :label="link.label"
                                            :href="link.href"
                                            target="_blank"
                                            size="small"
                                            class="w-full"
                                          />
                                        </div>
                                      </div>
                                    </aside>

                                    <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                                      <Card :padded="false">
                                        <template #header>
                                          <p class="text-label-lg text-(--text-default)">Charged</p>
                                          <ToggleGroup
                                            v-model="period"
                                            :options="periods"
                                            aria-label="Billing period"
                                          />
                                        </template>

                                        <template #content>
                                          <div
                                            v-if="charge"
                                            class="flex flex-col"
                                          >
                                            <div
                                              class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)"
                                            >
                                              <div
                                                v-for="row in charge.rows"
                                                :key="row.label"
                                                class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
                                              >
                                                <span class="text-body-sm text-(--text-muted)">{{
                                                  row.label
                                                }}</span>
                                                <span
                                                  class="flex items-baseline gap-(--spacing-xs)"
                                                >
                                                  <span
                                                    class="text-label-md text-(--text-default)"
                                                    >{{ row.value }}</span
                                                  >
                                                  <span
                                                    v-if="row.suffix"
                                                    class="text-body-sm text-(--text-muted)"
                                                    >{{ row.suffix }}</span
                                                  >
                                                </span>
                                              </div>
                                            </div>

                                            <Separator />

                                            <div
                                              class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm) px-(--spacing-lg) py-(--spacing-lg)"
                                            >
                                              <span class="text-heading-xs text-(--text-default)"
                                                >Total</span
                                              >
                                              <span class="flex items-baseline gap-(--spacing-xs)">
                                                <span
                                                  class="text-heading-xs text-(--text-default)"
                                                  >{{ charge.total.value }}</span
                                                >
                                                <span class="text-body-sm text-(--text-muted)">{{
                                                  charge.total.suffix
                                                }}</span>
                                              </span>
                                            </div>
                                          </div>
                                        </template>
                                      </Card>

                                      <Card
                                        title="Payment method"
                                        :padded="false"
                                      >
                                        <template #content>
                                          <div
                                            class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)"
                                          >
                                            <div
                                              v-if="!editing"
                                              class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
                                            >
                                              <PaymentBrand brand="visa" />
                                              <p
                                                class="min-w-0 flex-1 text-label-md text-(--text-default)"
                                              >
                                                Ending in {{ card.last4 }}
                                              </p>
                                              <Button
                                                label="Change"
                                                kind="outlined"
                                                size="small"
                                                @click="startEditing"
                                              />
                                            </div>

                                            <template v-else>
                                              <fieldset
                                                class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                                              >
                                                <legend class="sr-only">Payment method</legend>

                                                <Field>
                                                  <Field.Label>Cardholder name</Field.Label>
                                                  <Input
                                                    v-model="card.holder"
                                                    name="cardholderName"
                                                    size="large"
                                                    placeholder="Jane A. Doe"
                                                    autocomplete="cc-name"
                                                  />
                                                </Field>

                                                <Field>
                                                  <Field.Label>Country or region</Field.Label>
                                                  <Select
                                                    v-model="card.country"
                                                    placeholder="Select an option"
                                                    size="large"
                                                  >
                                                    <Select.Trigger />
                                                    <Select.Content>
                                                      <Select.Option
                                                        v-for="option in countryOptions"
                                                        :key="String(option.value)"
                                                        :value="option.value"
                                                        :disabled="option.disabled"
                                                      >
                                                        {{ option.label }}
                                                      </Select.Option>
                                                    </Select.Content>
                                                  </Select>
                                                </Field>

                                                <Field>
                                                  <Field.Label>Card number</Field.Label>
                                                  <Input
                                                    v-model="card.number"
                                                    name="cardNumber"
                                                    size="large"
                                                    placeholder="1234 5678 9012 3456"
                                                    autocomplete="cc-number"
                                                    inputmode="numeric"
                                                  />
                                                </Field>

                                                <div
                                                  class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2"
                                                >
                                                  <Field>
                                                    <Field.Label>Expiration date</Field.Label>
                                                    <Input
                                                      v-model="card.expiry"
                                                      name="cardExpiry"
                                                      size="large"
                                                      placeholder="MM / YY"
                                                      autocomplete="cc-exp"
                                                      inputmode="numeric"
                                                    />
                                                    <Field.Description
                                                      >Month and year, as MM/YY.</Field.Description
                                                    >
                                                  </Field>
                                                  <Field>
                                                    <Field.Label>Security code</Field.Label>
                                                    <Input
                                                      v-model="card.code"
                                                      name="cardSecurityCode"
                                                      size="large"
                                                      placeholder="123"
                                                      autocomplete="cc-csc"
                                                      inputmode="numeric"
                                                    />
                                                    <Field.Description
                                                      >3 or 4 digits on the back.</Field.Description
                                                    >
                                                  </Field>
                                                </div>

                                                <Alert
                                                  severity="info"
                                                  size="small"
                                                  label="Sensitive data is handled by a PCI-compliant payment partner."
                                                />
                                              </fieldset>

                                              <div
                                                class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:justify-end"
                                              >
                                                <div class="w-full sm:w-fit">
                                                  <Button
                                                    class="w-full"
                                                    label="Cancel"
                                                    kind="outlined"
                                                    size="medium"
                                                    @click="editing = false"
                                                  />
                                                </div>
                                                <div class="w-full sm:w-fit">
                                                  <Button
                                                    class="w-full"
                                                    label="Update"
                                                    kind="primary"
                                                    size="medium"
                                                    @click="updateCard"
                                                  />
                                                </div>
                                              </div>
                                            </template>
                                          </div>
                                        </template>
                                      </Card>

                                      <Card
                                        title="Address information"
                                        :padded="false"
                                      >
                                        <template #content>
                                          <fieldset
                                            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)"
                                          >
                                            <legend class="sr-only">Address information</legend>

                                            <Field orientation="horizontal">
                                              <Checkbox
                                                v-model="address.useAccountInformation"
                                                binary
                                                name="useAccountInformation"
                                              />
                                              <Field.Content>
                                                <Field.Label
                                                  >Use the same information as my
                                                  account</Field.Label
                                                >
                                                <Field.Description
                                                  >Uncheck to bill this organization at a different
                                                  address.</Field.Description
                                                >
                                              </Field.Content>
                                            </Field>

                                            <div
                                              class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2"
                                            >
                                              <Field>
                                                <Field.Label>Country</Field.Label>
                                                <Select
                                                  v-model="address.country"
                                                  placeholder="Select an option"
                                                  size="large"
                                                >
                                                  <Select.Trigger />
                                                  <Select.Content>
                                                    <Select.Option
                                                      v-for="option in countryOptions"
                                                      :key="String(option.value)"
                                                      :value="option.value"
                                                      :disabled="option.disabled"
                                                    >
                                                      {{ option.label }}
                                                    </Select.Option>
                                                  </Select.Content>
                                                </Select>
                                              </Field>
                                              <Field>
                                                <Field.Label>Postal code</Field.Label>
                                                <Input
                                                  v-model="address.postalCode"
                                                  name="postalCode"
                                                  size="large"
                                                  autocomplete="postal-code"
                                                />
                                              </Field>
                                              <Field>
                                                <Field.Label>State or region</Field.Label>
                                                <Select
                                                  v-model="address.state"
                                                  placeholder="Select an option"
                                                  size="large"
                                                >
                                                  <Select.Trigger />
                                                  <Select.Content>
                                                    <Select.Option
                                                      v-for="option in stateOptions"
                                                      :key="String(option.value)"
                                                      :value="option.value"
                                                      :disabled="option.disabled"
                                                    >
                                                      {{ option.label }}
                                                    </Select.Option>
                                                  </Select.Content>
                                                </Select>
                                              </Field>
                                              <Field>
                                                <Field.Label>City</Field.Label>
                                                <Select
                                                  v-model="address.city"
                                                  placeholder="Select an option"
                                                  size="large"
                                                >
                                                  <Select.Trigger />
                                                  <Select.Content>
                                                    <Select.Option
                                                      v-for="option in cityOptions"
                                                      :key="String(option.value)"
                                                      :value="option.value"
                                                      :disabled="option.disabled"
                                                    >
                                                      {{ option.label }}
                                                    </Select.Option>
                                                  </Select.Content>
                                                </Select>
                                              </Field>
                                            </div>

                                            <Field>
                                              <Field.Label>Address</Field.Label>
                                              <Input
                                                v-model="address.line1"
                                                name="addressLine1"
                                                size="large"
                                                autocomplete="address-line1"
                                              />
                                            </Field>
                                            <Field>
                                              <Field.Label>Address line 2</Field.Label>
                                              <Input
                                                v-model="address.line2"
                                                name="addressLine2"
                                                size="large"
                                                autocomplete="address-line2"
                                              />
                                              <Field.Description
                                                >Optional. Apartment, suite or
                                                floor.</Field.Description
                                              >
                                            </Field>
                                          </fieldset>
                                        </template>
                                      </Card>
                                    </div>
                                  </div>
                                </PanelContent>

                                <PanelFooter>
                                  <div
                                    class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
                                  >
                                    <div class="w-full md:w-fit">
                                      <Button
                                        class="w-full"
                                        type="button"
                                        label="Cancel"
                                        kind="outlined"
                                        size="medium"
                                        @click="onOpenChange(false)"
                                      />
                                    </div>
                                    <div class="w-full md:w-fit">
                                      <Button
                                        class="w-full"
                                        label="Upgrade"
                                        kind="primary"
                                        size="medium"
                                        type="submit"
                                      />
                                    </div>
                                  </div>
                                </PanelFooter>
                              </form>
                            </DrawerContent>
                          </DrawerPortal>
                        </Drawer>
                      </div>
                    </div>
                  </fieldset>

                  <div class="flex items-center gap-(--spacing-sm)">
                    <Button
                      label="Back"
                      kind="outlined"
                      size="large"
                      @click="router.push('/onboarding')"
                    />
                    <div class="flex flex-1">
                      <Button
                        label="Continue"
                        kind="primary"
                        size="large"
                        class="w-full"
                        type="submit"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </template>
          </Card>
        </div>

        <div class="lg:sticky lg:top-(--spacing-xl) lg:my-auto lg:-me-(--spacing-xl)">
          <div
            class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden mask-r-from-72% mask-b-from-80% lg:block"
          >
            <figure
              class="pointer-events-none absolute inset-y-0 start-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) select-none"
              aria-hidden="true"
            >
              <div
                class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
              >
                <span
                  class="size-(--size-5) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />

                <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%2080%22%20fill%3D%22none%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22blur%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%3CfeGaussianBlur%20stdDeviation%3D%227%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23F8CA3A%22%20%2F%3E%3Cpath%20filter%3D%22url(%23blur)%22%20transform%3D%22translate(0%200)%20rotate(-280%2040%2040)%20scale(1.2)%22%20fill%3D%22%23FFCFB3%22%20d%3D%22M32.414%2059.35L50.376%2070.5H72.5v-71H33.728L26.5%2013.381l19.057%2027.08L32.414%2059.35z%22%20%2F%3E%3Cpath%20filter%3D%22url(%23blur)%22%20transform%3D%22translate(0%200)%20rotate(-240%2040%2040)%20scale(1.2)%22%20fill%3D%22%23B03C02%22%20style%3D%22mix-blend-mode%3A%20overlay%22%20d%3D%22M22.216%2024L0%2046.75l14.108%2038.129L78%2086l-3.081-59.276-22.378%204.005%2012.972%2020.186-23.35%2027.395L22.215%2024z%22%20%2F%3E%3C%2Fsvg%3E"
                    alt="Your organization"
                    size="small"
                    kind="square"
                    class="shrink-0"
                  />
                  <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
                    Your organization
                  </span>
                </span>

                <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    label="MW"
                    size="small"
                    kind="square"
                    class="shrink-0"
                  />
                  <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
                    My Workspace
                  </span>
                </span>

                <span class="ms-auto flex shrink-0 items-center gap-(--spacing-sm)">
                  <span
                    class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
                  />
                  <span class="size-(--size-8) rounded-(--shape-button) bg-(--bg-placeholder)" />
                </span>
              </div>

              <div class="flex min-h-0 flex-1">
                <div
                  class="flex w-(--size-60) shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-e-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
                >
                  <span
                    class="h-(--size-9) w-full shrink-0 rounded-(--shape-button) bg-(--bg-placeholder)"
                  />

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span
                      v-for="width in ['58%', '76%', '48%', '66%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <span class="h-px w-full shrink-0 bg-(--border-muted)" />

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span class="h-1.5 w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)" />
                    <span
                      v-for="width in ['70%', '44%', '80%', '54%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span class="h-1.5 w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)" />
                    <span
                      v-for="width in ['62%', '78%', '50%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <div
                    class="mt-auto flex min-w-0 shrink-0 items-center gap-(--spacing-xs) border-t-(length:--border-width-default) border-(--border-muted) pt-(--spacing-md)"
                  >
                    <Avatar
                      label="MY"
                      size="medium"
                      kind="square"
                    />
                    <span class="flex min-w-0 flex-col">
                      <span class="truncate text-label-sm text-(--text-default)">myemail</span>
                      <span class="truncate text-body-xs text-(--text-muted)"
                        >myemail@example.com</span
                      >
                    </span>
                  </div>
                </div>

                <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
                  <div
                    class="flex min-h-(--container-2xl) flex-col gap-(--spacing-lg) p-(--spacing-lg)"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <p class="truncate text-heading-sm text-(--text-default)">Hello, myemail</p>
                      <p class="truncate text-body-sm text-(--text-muted)">
                        My Workspace · no projects yet
                      </p>
                    </div>

                    <div class="grid grid-cols-4 gap-(--spacing-md)">
                      <span
                        v-for="tile in 4"
                        :key="tile"
                        class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) w-2/3 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-3) w-1/2 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                      </span>
                    </div>

                    <div
                      class="flex flex-1 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
                    >
                      <span
                        class="flex shrink-0 items-center justify-between border-b-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-8) w-(--size-24) rounded-(--shape-button) bg-(--bg-placeholder)"
                        />
                      </span>
                      <span
                        v-for="row in 7"
                        :key="row"
                        class="flex shrink-0 items-center gap-(--spacing-lg) px-(--spacing-md) py-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) flex-1 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-2) w-[18%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-2) w-[10%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
