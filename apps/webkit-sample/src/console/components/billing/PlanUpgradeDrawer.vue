<script setup lang="ts">
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
  import Link from '@aziontech/webkit/link'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, reactive, ref, watch } from 'vue'

  import { chargeFor, planFor } from '../../lib/data/plans.js'
  import PaymentMethodCard from './PaymentMethodCard.vue'

  interface Props {
    planId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    planId: ''
  })

  const open = defineModel('open', { type: Boolean, default: false })

  const emit = defineEmits<{
    confirm: [value: unknown]
  }>()

  const plan = computed(() => planFor(props.planId))

  const period = ref('yearly')
  const charge = computed(() => chargeFor(props.planId, period.value))
  const periods = computed(() => plan.value?.charge?.periods ?? [])

  const accountAddress = {
    country: 'Brazil',
    postalCode: '01310-100',
    state: 'São Paulo',
    city: 'São Paulo',
    line2: ''
  }

  const blankAddress = () => ({
    country: undefined,
    postalCode: '',
    state: undefined,
    city: undefined,
    line2: ''
  })

  const address = reactive({ useAccountInformation: true, ...accountAddress })

  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? accountAddress : blankAddress())
  )

  const submitting = ref(false)

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

  watch(open, (isOpen) => {
    if (!isOpen) return
    period.value = 'yearly'
    address.useAccountInformation = true
    Object.assign(address, accountAddress)
    submitting.value = false
  })

  const settle = () => new Promise((resolve) => setTimeout(resolve, 900))

  const cancel = () => {
    if (submitting.value) return
    open.value = false
  }

  const submit = async () => {
    if (submitting.value) return
    submitting.value = true
    try {
      await settle()
      emit('confirm', { planId: props.planId, period: period.value })
      open.value = false
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="plan ? `Upgrade to ${plan.name}` : 'Upgrade'"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <DrawerTitle>Upgrade to {{ plan?.name }}</DrawerTitle>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <div
              class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-(--spacing-xl)"
            >
              <aside
                v-if="plan?.upgrade"
                class="flex flex-col gap-(--spacing-md)"
              >
                <div class="flex flex-col gap-(--spacing-xs)">
                  <h3
                    class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) lg:min-h-[calc(var(--spacing-sm)*2+var(--spacing-10)+1px)] lg:border-t lg:border-t-transparent lg:py-(--spacing-sm)"
                  >
                    {{ plan.upgrade.featuresTitle }}
                  </h3>

                  <ul class="m-0 flex list-none flex-col p-0">
                    <li
                      v-for="feature in plan.upgrade.features"
                      :key="feature.title"
                      class="flex items-start gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xs) odd:bg-(--bg-mask)"
                    >
                      <i
                        class="pi pi-check mt-0.5 shrink-0 text-body-xs leading-none text-(--success-contrast)"
                        aria-hidden="true"
                      />
                      <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <span class="text-label-md text-(--text-default)">{{ feature.title }}</span>
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
                  <Link
                    v-for="link in plan.upgrade.links"
                    :key="link.label"
                    :label="link.label"
                    :href="link.href"
                    target="_blank"
                    size="small"
                    class="ml-(--spacing-xs) w-fit"
                  />
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
                          <span class="text-body-sm text-(--text-muted)">{{ row.label }}</span>
                          <span class="flex items-baseline gap-(--spacing-xs)">
                            <span class="text-label-md text-(--text-default)">{{ row.value }}</span>
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
                        <span class="text-heading-xs text-(--text-default)">Total</span>
                        <span class="flex items-baseline gap-(--spacing-xs)">
                          <span class="text-heading-xs text-(--text-default)">{{
                            charge.total.value
                          }}</span>
                          <span class="text-body-sm text-(--text-muted)">{{
                            charge.total.suffix
                          }}</span>
                        </span>
                      </div>
                    </div>
                  </template>
                </CardBox>

                <PaymentMethodCard :disabled="submitting" />

                <CardBox
                  title="Address information"
                  :padded="false"
                >
                  <template #content>
                    <fieldset
                      class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)"
                      :disabled="submitting"
                    >
                      <legend class="sr-only">Address information</legend>

                      <FieldCheckbox
                        v-model="address.useAccountInformation"
                        label="Use the same information as my account"
                        description="Uncheck to bill this organization at a different address."
                        input-id="upgrade-same-address"
                        name="useAccountInformation"
                      />

                      <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
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

          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <Button
              class="w-full md:w-auto"
              label="Upgrade"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Upgrade
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
