<script setup>
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import InputGroup from '@aziontech/webkit/input-group'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import NumberInput from '@aziontech/webkit/number-input'
  import Link from '@aziontech/webkit/link'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, ref, watch } from 'vue'

  const recordTypes = [
    {
      value: 'A',
      label: 'A - IPv4 address',
      placeholder: '192.0.2.1',
      valueHelper: 'Accepts an IPv4 address.'
    },
    {
      value: 'AAAA',
      label: 'AAAA - IPv6 address',
      placeholder: '2001:db8::1',
      valueHelper: 'Accepts an IPv6 address.'
    },
    {
      value: 'CNAME',
      label: 'CNAME - Canonical name',
      placeholder: 'example.com',
      valueHelper: 'Accepts a single hostname.'
    },
    {
      value: 'MX',
      label: 'MX - Mail exchange',
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
              <SettingsSection
                title="Settings"
                hint="Which addresses are associated with the domain and how the zone should handle requests."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <Field
                    :disabled="submitting"
                    :required="!!errors.name"
                  >
                    <Field.Label>Name</Field.Label>
                    <InputGroup>
                      <InputGroup.Input
                        v-model="form.name"
                        placeholder="subdomain"
                        @update:model-value="errors.name = ''"
                      />
                      <InputGroup.Addon>.example.com</InputGroup.Addon>
                    </InputGroup>
                    <Field.Description>
                      {{ errors.name || 'Use @ to create a record for the root domain.' }}
                    </Field.Description>
                  </Field>

                  <Field>
                    <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                      <Field.Label for="record-type">Record type</Field.Label>
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
                  </Field>

                  <Field>
                    <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                      <Field.Label for="record-ttl">TTL in seconds</Field.Label>
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
                      >Time-to-live a response can be cached for on a resolver server.</HelperText
                    >
                  </Field>

                  <Field
                    :disabled="submitting"
                    :required="!!errors.value"
                  >
                    <Field.Label>Value</Field.Label>
                    <Textarea
                      v-model="form.value"
                      :placeholder="selectedType.placeholder"
                      @update:model-value="errors.value = ''"
                    />
                    <Field.Description v-if="errors.value || selectedType.valueHelper">
                      {{ errors.value || selectedType.valueHelper }}
                    </Field.Description>
                  </Field>

                  <Field :disabled="submitting">
                    <Field.Label>Description</Field.Label>
                    <Input
                      v-model="form.description"
                      size="large"
                      placeholder="Optional description"
                    />
                    <Field.Description
                      >An optional note to help identify this record.</Field.Description
                    >
                  </Field>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Policy"
                hint="How the zone should deal with requests answered by this record."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <Field>
                    <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                      <Field.Label for="record-policy">Policy type</Field.Label>
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
                      >Simple is standard resolution. Weighted distributes answers across records by
                      weight.</HelperText
                    >
                  </Field>

                  <Field v-if="isWeighted">
                    <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                      <Field.Label for="record-weight">Weight</Field.Label>
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
                      >Relative weight for this record within the weighted set, from 0 to
                      255.</HelperText
                    >
                  </Field>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
              <Button
                label="Add Record"
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
