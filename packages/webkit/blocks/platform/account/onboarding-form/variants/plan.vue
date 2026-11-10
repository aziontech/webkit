<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FieldCheckbox from '@aziontech/webkit/field-checkbox'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Link from '@aziontech/webkit/link'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import { computed, reactive, ref, watch } from 'vue'

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
      ariaLabel: "I'm running production at scale. Enterprise plan, From $2.000/mo.",
      name: 'Enterprise',
      severity: 'primary',
      price: 'From $2.000/mo'
    }
  ]
  const upgrades = {
    pro: {
      name: 'Pro',
      features: [
        { title: '100 Resources', detail: 'then $0.10 per resource per month' },
        { title: '10M Requests', detail: 'then as low as $0.90 per 1M' },
        { title: '50 hours Compute time', detail: 'then $0.18 per hour' },
        { title: '10 GB Event log storage', detail: 'then $0.10 per GB-month' },
        {
          title: '100 GB File storage',
          detail: 'then as low as $0.021 per GB-month'
        },
        { title: '1 GB Database storage', detail: 'then $0.75 per GB-month' },
        {
          title: '100M Security rule evaluations',
          detail: 'then as low as $0.30 per 1M'
        },
        { title: 'DDoS Protection included' },
        { title: 'PCI DSS 4.0.1 Level 1' },
        { title: 'SOC 2 Type 2 / SOC 3' },
        { title: 'Data migration assistance' }
      ],
      charge: {
        monthly: {
          rows: [
            { label: 'Next Charge Value', value: '$ 200' },
            { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' }
          ],
          total: { value: '$ 3.000', suffix: 'per year' }
        },
        yearly: {
          rows: [
            { label: 'Next Charge Value', value: '$ 200' },
            { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' },
            { label: 'Yearly Discount', value: '$ 2.200', suffix: 'per month' }
          ],
          total: { value: '$ 2.200', suffix: 'per year' }
        }
      }
    },
    enterprise: {
      name: 'Enterprise',
      features: [
        { title: 'Unlimited Resources' },
        { title: '1B Requests', detail: 'then as low as $0.60 per 1M' },
        { title: '500 hours Compute time', detail: 'then $0.12 per hour' },
        { title: '1 TB Event log storage', detail: 'then $0.08 per GB-month' },
        {
          title: '10 TB File storage',
          detail: 'then as low as $0.015 per GB-month'
        },
        { title: '100 GB Database storage', detail: 'then $0.50 per GB-month' },
        {
          title: '1B Security rule evaluations',
          detail: 'then as low as $0.20 per 1M'
        },
        { title: 'DDoS Protection included' },
        { title: 'PCI DSS 4.0.1 Level 1' },
        { title: 'SOC 2 Type 2 / SOC 3' },
        { title: 'Data migration assistance' },
        { title: '99.99% uptime SLA' },
        { title: 'Named account team' }
      ],
      charge: {
        monthly: {
          rows: [
            { label: 'Next Charge Value', value: '$ 2.000' },
            { label: 'Subtotal', value: '$ 24.000', suffix: 'per month' }
          ],
          total: { value: '$ 24.000', suffix: 'per year' }
        },
        yearly: {
          rows: [
            { label: 'Next Charge Value', value: '$ 2.000' },
            { label: 'Subtotal', value: '$ 24.000', suffix: 'per month' },
            { label: 'Yearly Discount', value: '$ 4.800', suffix: 'per month' }
          ],
          total: { value: '$ 19.200', suffix: 'per year' }
        }
      }
    }
  }
  const pricingLinks = [
    {
      label: 'Learn more about Pricing',
      href: 'https://example.com/pricing'
    },
    {
      label: 'Compare Plans',
      href: 'https://example.com/pricing#comparison'
    }
  ]
  const periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]
  const countryOptions = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'United States', label: 'United States' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' }
  ]
  const stateOptions = [
    { value: 'São Paulo', label: 'São Paulo' },
    { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
    { value: 'Minas Gerais', label: 'Minas Gerais' },
    { value: 'Rio Grande do Sul', label: 'Rio Grande do Sul' }
  ]
  const cityOptions = [
    { value: 'São Paulo', label: 'São Paulo' },
    { value: 'Campinas', label: 'Campinas' },
    { value: 'Santos', label: 'Santos' }
  ]
  const accountAddress = {
    country: 'Brazil',
    postalCode: '01310-100',
    state: 'São Paulo',
    city: 'São Paulo',
    line2: ''
  }
  const blankAddress = {
    country: undefined,
    postalCode: '',
    state: undefined,
    city: undefined,
    line2: ''
  }
  const blankCard = { holder: '', country: 'Brazil', number: '', expiry: '', code: '' }

  const plan = ref()
  const pendingPlanId = ref('')
  const upgradeOpen = ref(false)
  const submitted = ref(false)
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
          <CardBox
            :padded="false"
            class="w-full"
          >
            <template #content>
              <ProgressBar
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
                  @submit.prevent="submitted = true"
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
                        <BoxGridSelection
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
                        </BoxGridSelection>

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
                                        <Divider />
                                        <div
                                          v-for="link in pricingLinks"
                                          :key="link.label"
                                          class="ml-(--spacing-xs) w-fit"
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
                                      <CardBox :padded="false">
                                        <template #header>
                                          <p class="text-label-lg text-(--text-default)">Charged</p>
                                          <SegmentedButton
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

                                            <Divider />

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
                                      </CardBox>

                                      <CardBox
                                        title="Payment Method"
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
                                              <span
                                                class="flex h-7 w-10 shrink-0 items-center justify-center overflow-clip rounded-(--shape-elements) border border-(--border-default) bg-[#2548a0]"
                                                aria-hidden="true"
                                              >
                                                <svg
                                                  width="22"
                                                  height="7"
                                                  viewBox="0 0 22 7"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  class="block"
                                                  focusable="false"
                                                >
                                                  <g clip-path="url(#card-brand-visa-clip)">
                                                    <path
                                                      d="M11.3779 2.22887C11.3653 3.2001 12.2598 3.74205 12.9337 4.0643C13.626 4.3949 13.8585 4.60693 13.8558 4.90261C13.8506 5.35508 13.3036 5.5548 12.7916 5.56255C11.8985 5.57613 11.3792 5.3259 10.9663 5.13665L10.6446 6.61416C11.0588 6.80147 11.8258 6.96483 12.6211 6.972C14.4881 6.972 15.7095 6.06757 15.7162 4.66529C15.7235 2.8856 13.2078 2.7871 13.225 1.99163C13.2309 1.75042 13.4655 1.49302 13.9794 1.42758C14.2337 1.39452 14.9359 1.36922 15.7321 1.729L16.0445 0.299482C15.6164 0.146494 15.0661 0 14.381 0C12.6238 0 11.3878 0.916747 11.3779 2.22887ZM19.047 0.123132C18.7061 0.123132 18.4188 0.318289 18.2906 0.617771L15.6237 6.867H17.4893L17.8606 5.8601H20.1403L20.3557 6.867H22L20.5651 0.123132H19.047ZM19.308 1.9449L19.8464 4.4773H18.3719L19.308 1.9449ZM9.11591 0.123217L7.64534 6.86692H9.42313L10.893 0.123048L9.11591 0.123217ZM6.48596 0.123217L4.63555 4.71328L3.88704 0.810398C3.79921 0.374711 3.45237 0.123132 3.0672 0.123132H0.0423672L0 0.318964C0.620984 0.451204 1.32653 0.664494 1.75398 0.892711C2.01558 1.03212 2.09017 1.15399 2.17611 1.48526L3.59382 6.867H5.4725L8.35278 0.123132L6.48596 0.123217Z"
                                                      fill="white"
                                                    />
                                                  </g>
                                                  <defs>
                                                    <clipPath id="card-brand-visa-clip">
                                                      <rect
                                                        width="22"
                                                        height="7"
                                                        fill="white"
                                                      />
                                                    </clipPath>
                                                  </defs>
                                                </svg>
                                              </span>
                                              <p
                                                class="min-w-0 flex-1 text-label-md text-(--text-default)"
                                              >
                                                Ended with {{ card.last4 }}
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
                                                <legend class="sr-only">Payment Method</legend>

                                                <FieldText
                                                  v-model="card.holder"
                                                  label="Cardholder's full name"
                                                  input-id="payment-holder"
                                                  name="cardholderName"
                                                  size="large"
                                                  placeholder="Jane A. Doe"
                                                  autocomplete="cc-name"
                                                />

                                                <FieldSelect
                                                  v-model="card.country"
                                                  label="Country/Region"
                                                  :options="countryOptions"
                                                  input-id="payment-country"
                                                  size="large"
                                                />

                                                <FieldText
                                                  v-model="card.number"
                                                  label="Credit card number"
                                                  input-id="payment-number"
                                                  name="cardNumber"
                                                  size="large"
                                                  placeholder="1234 5678 9012 3456"
                                                  autocomplete="cc-number"
                                                  inputmode="numeric"
                                                />

                                                <div
                                                  class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2"
                                                >
                                                  <FieldText
                                                    v-model="card.expiry"
                                                    label="Expiration Date (MM/YY)"
                                                    input-id="payment-expiry"
                                                    name="cardExpiry"
                                                    size="large"
                                                    placeholder="08 / 26"
                                                    autocomplete="cc-exp"
                                                    inputmode="numeric"
                                                  />
                                                  <FieldText
                                                    v-model="card.code"
                                                    label="Security Code (CVC/CVV)"
                                                    input-id="payment-code"
                                                    name="cardSecurityCode"
                                                    size="large"
                                                    placeholder="999"
                                                    autocomplete="cc-csc"
                                                    inputmode="numeric"
                                                  />
                                                </div>

                                                <Message
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
                                      </CardBox>

                                      <CardBox
                                        title="Address information"
                                        :padded="false"
                                      >
                                        <template #content>
                                          <fieldset
                                            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)"
                                          >
                                            <legend class="sr-only">Address information</legend>

                                            <FieldCheckbox
                                              v-model="address.useAccountInformation"
                                              label="Use the same information as my account"
                                              description="Uncheck to bill this organization at a different address."
                                              input-id="upgrade-same-address"
                                              name="useAccountInformation"
                                            />

                                            <div
                                              class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2"
                                            >
                                              <FieldSelect
                                                v-model="address.country"
                                                label="Country"
                                                :options="countryOptions"
                                                input-id="upgrade-country"
                                                placeholder="Select an option"
                                                size="large"
                                              />
                                              <FieldText
                                                v-model="address.postalCode"
                                                label="Postal Code"
                                                input-id="upgrade-postal-code"
                                                name="postalCode"
                                                size="large"
                                                placeholder="00000-000"
                                                autocomplete="postal-code"
                                              />
                                              <FieldSelect
                                                v-model="address.state"
                                                label="State/Region"
                                                :options="stateOptions"
                                                input-id="upgrade-state"
                                                placeholder="Select an option"
                                                size="large"
                                              />
                                              <FieldSelect
                                                v-model="address.city"
                                                label="City"
                                                :options="cityOptions"
                                                input-id="upgrade-city"
                                                placeholder="Select an option"
                                                size="large"
                                              />
                                            </div>

                                            <FieldText
                                              v-model="address.line2"
                                              label="Apartment, floor, etc."
                                              input-id="upgrade-address-line-2"
                                              name="addressLine2"
                                              size="large"
                                              placeholder="Optional"
                                              autocomplete="address-line2"
                                            />
                                          </fieldset>
                                        </template>
                                      </CardBox>
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
          </CardBox>
        </div>

        <div class="lg:sticky lg:top-(--spacing-xl) lg:my-auto lg:-mr-(--spacing-xl)">
          <div
            class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden mask-r-from-72% mask-b-from-80% lg:block"
          >
            <figure
              class="pointer-events-none absolute inset-y-0 left-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) select-none"
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

                <span class="ml-auto flex shrink-0 items-center gap-(--spacing-sm)">
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
                  class="flex w-(--size-60) shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-r-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
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
