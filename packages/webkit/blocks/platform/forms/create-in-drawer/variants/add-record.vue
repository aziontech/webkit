<script setup>
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import FieldInputGroup from '@aziontech/webkit/field-input-group'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import NumberInput from '@aziontech/webkit/number-input'
  import Label from '@aziontech/webkit/label'
  import Link from '@aziontech/webkit/link'
  import Select from '@aziontech/webkit/select'
  import { computed, reactive, ref, watch } from 'vue'

  const recordTypes = [
    {
      value: 'A',
      label: 'A - IPv4 Address',
      placeholder: '192.0.2.1',
      valueHelper: 'Accepts an IPv4 address.'
    },
    {
      value: 'AAAA',
      label: 'AAAA - IPv6 Address',
      placeholder: '2001:db8::1',
      valueHelper: 'Accepts an IPv6 address.'
    },
    {
      value: 'CNAME',
      label: 'CNAME - Canonical Name',
      placeholder: 'example.com',
      valueHelper: 'Accepts a single hostname.'
    },
    {
      value: 'MX',
      label: 'MX - Mail Exchange',
      placeholder: '10 mail.example.com',
      valueHelper: 'Accepts a priority and a mail server, e.g. 10 mail.example.com.'
    },
    {
      value: 'TXT',
      label: 'TXT - Text',
      placeholder: 'v=spf1 include:example.com ~all',
      valueHelper: 'Accepts free-form text.'
    },
    {
      value: 'NS',
      label: 'NS - Nameserver',
      placeholder: 'ns1.example.com',
      valueHelper: 'Accepts a nameserver hostname.'
    }
  ]

  const policyTypes = [
    { value: 'simple', label: 'Simple' },
    { value: 'weighted', label: 'Weighted' }
  ]

  const blankForm = () => ({
    name: '',
    type: 'A',
    ttl: 3600,
    value: '',
    description: '',
    policy: 'simple',
    weight: 100
  })

  const open = ref(false)
  const form = reactive(blankForm())
  const errors = reactive({ name: '', value: '' })
  const submitting = ref(false)

  const selectedType = computed(
    () => recordTypes.find((type) => type.value === form.type) ?? recordTypes[0]
  )
  const isWeighted = computed(() => form.policy === 'weighted')

  const typeLabel = (value) => recordTypes.find((type) => type.value === value)?.label ?? ''
  const policyLabelOf = (value) => policyTypes.find((policy) => policy.value === value)?.label ?? ''

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(form, blankForm())
    errors.name = ''
    errors.value = ''
  })

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.value = form.value.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.value
  }

  const submit = () => {
    if (submitting.value) return
    if (!validate()) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
    }, 800)
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerTrigger>
      <div class="w-full md:w-fit">
        <Button
          label="Add Record"
          icon="pi pi-plus"
          kind="outlined"
          size="medium"
          class="w-full"
        />
      </div>
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add Record"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Add Record</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                A new record in example.com, and how the zone should answer requests for it.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Add Record</legend>
              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Settings</span>
                    </h2>
                    <Hint
                      text="Which addresses are associated with the domain and how the zone should handle requests."
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
                      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                        <FieldInputGroup
                          v-model="form.name"
                          label="Name"
                          input-id="record-name"
                          placeholder="subdomain"
                          :disabled="submitting"
                          :required="!!errors.name"
                          :helper-text="
                            errors.name || 'Use @ to create a record for the root domain.'
                          "
                          @update:model-value="errors.name = ''"
                        >
                          <template #right>.example.com</template>
                        </FieldInputGroup>

                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                          <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                            <Label for="record-type">Record type</Label>
                          </div>
                          <Select
                            v-model="form.type"
                            size="large"
                            class="w-full"
                            :disabled="submitting"
                            :display-value="typeLabel"
                          >
                            <Select.Trigger
                              id="record-type"
                              aria-label="Record type"
                            />
                            <Select.Content>
                              <Select.Option
                                v-for="type in recordTypes"
                                :key="type.value"
                                :value="type.value"
                              >
                                {{ type.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                          <HelperText
                            id="record-type-helper"
                            kind="helper"
                          >
                            <Link
                              label="Read more about record types"
                              size="medium"
                              href="https://example.com/docs/dns-records"
                              target="_blank"
                            />
                          </HelperText>
                        </div>

                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                          <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                            <Label for="record-ttl">TTL (seconds)</Label>
                          </div>
                          <NumberInput
                            id="record-ttl"
                            v-model="form.ttl"
                            size="large"
                            class="w-full"
                            :min="0"
                            :disabled="submitting"
                            aria-label="TTL in seconds"
                          />
                          <HelperText
                            id="record-ttl-helper"
                            kind="helper"
                            >Time-to-live a response can be cached for on a resolver
                            server.</HelperText
                          >
                        </div>

                        <FieldTextarea
                          v-model="form.value"
                          label="Value"
                          input-id="record-value"
                          :placeholder="selectedType.placeholder"
                          :disabled="submitting"
                          :required="!!errors.value"
                          :helper-text="errors.value || selectedType.valueHelper"
                          @update:model-value="errors.value = ''"
                        />

                        <FieldText
                          v-model="form.description"
                          label="Description"
                          input-id="record-description"
                          size="large"
                          placeholder="Optional description"
                          :disabled="submitting"
                          helper-text="An optional note to help identify this record."
                        />
                      </div>
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
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Policy</span>
                    </h2>
                    <Hint
                      text="How the zone should deal with requests answered by this record."
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
                      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                          <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                            <Label for="record-policy">Policy type</Label>
                          </div>
                          <Select
                            v-model="form.policy"
                            size="large"
                            class="w-full"
                            :disabled="submitting"
                            :display-value="policyLabelOf"
                          >
                            <Select.Trigger
                              id="record-policy"
                              aria-label="Policy type"
                            />
                            <Select.Content>
                              <Select.Option
                                v-for="policy in policyTypes"
                                :key="policy.value"
                                :value="policy.value"
                              >
                                {{ policy.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                          <HelperText
                            id="record-policy-helper"
                            kind="helper"
                            >Simple is standard resolution. Weighted distributes answers across
                            records by weight.</HelperText
                          >
                        </div>

                        <div
                          v-if="isWeighted"
                          class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                        >
                          <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                            <Label for="record-weight">Weight</Label>
                          </div>
                          <NumberInput
                            id="record-weight"
                            v-model="form.weight"
                            size="large"
                            class="w-full"
                            :min="0"
                            :max="255"
                            :disabled="submitting"
                            aria-label="Weight"
                          />
                          <HelperText
                            id="record-weight-helper"
                            kind="helper"
                            >Relative weight (0–255) for this record within the weighted
                            set.</HelperText
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
              <Button
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
                type="submit"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
