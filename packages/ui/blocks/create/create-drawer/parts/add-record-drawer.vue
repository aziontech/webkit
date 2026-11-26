<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerTrigger from '@aziontech/ui/drawer-trigger'
  import Field from '@aziontech/ui/field'
  import FieldDescription from '@aziontech/ui/field-description'
  import Input from '@aziontech/ui/input'
  import InputGroup from '@aziontech/ui/input-group'
  import Link from '@aziontech/ui/link'
  import NumberInput from '@aziontech/ui/number-input'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Textarea from '@aziontech/ui/textarea'
  import { toast } from '@aziontech/ui/toast'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { useDrawerGuard } from '../composables/use-drawer-guard'
  import FormDrawer from './form-drawer.vue'
  import UnsavedChangesDialog from './unsaved-changes-dialog.vue'

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

  const typeLabel = (value: string) => recordTypes.find((type) => type.value === value)?.label ?? ''
  const policyLabelOf = (value: string) =>
    policyTypes.find((policy) => policy.value === value)?.label ?? ''

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(form, blankForm())
    errors.name = ''
    errors.value = ''
    nextTick(() => guard.commit())
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
      toast.success(`${selectedType.value.value} record ${form.name.trim()} added.`)
    }, 800)
  }

  const { guard, onOpenChange } = useDrawerGuard({
    open,
    busy: () => submitting.value,
    source: () => form,
    onDiscard: (baseline) => Object.assign(form, baseline)
  })
</script>

<template>
  <FormDrawer
    :open="open"
    title="Add Record"
    description="A new record in example.com, and how the zone should answer requests for it."
    shortcut-label="Add record"
    :busy="submitting"
    @update:open="onOpenChange"
    @submit="submit"
  >
    <template #trigger>
      <DrawerTrigger>
        <div class="w-full md:w-fit">
          <Button
            label="Add Record"
            icon="az az-plus"
            variant="outline"
            size="medium"
            class="w-full"
          />
        </div>
      </DrawerTrigger>
    </template>

    <SettingsGroup
      label="Settings"
      hint="Which addresses are associated with the domain and how the zone should handle requests."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <Field
          :disabled="submitting"
          required
          :invalid="!!errors.name"
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
          <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
          <Field.Description v-else>
            Use @ to create a record for the root domain.
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
              <Select.Item
                v-for="type in recordTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </Select.Item>
            </Select.Content>
          </Select>
          <FieldDescription id="record-type-helper">
            <Link
              label="Read more about record types"
              size="medium"
              href="https://example.com/docs/dns-records"
              target="_blank"
            />
          </FieldDescription>
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
          <FieldDescription id="record-ttl-helper"
            >Time-to-live a response can be cached for on a resolver server.</FieldDescription
          >
        </Field>

        <Field
          :disabled="submitting"
          required
          :invalid="!!errors.value"
        >
          <Field.Label>Value</Field.Label>
          <Textarea
            v-model="form.value"
            :placeholder="selectedType.placeholder"
            @update:model-value="errors.value = ''"
          />
          <Field.Error v-if="errors.value">{{ errors.value }}</Field.Error>
          <Field.Description v-else-if="selectedType.valueHelper">
            {{ selectedType.valueHelper }}
          </Field.Description>
        </Field>

        <Field :disabled="submitting">
          <Field.Label>Description</Field.Label>
          <Input
            v-model="form.description"
            size="large"
            placeholder="Optional description"
          />
          <Field.Description>An optional note to help identify this record.</Field.Description>
        </Field>
      </div>
    </SettingsGroup>

    <SettingsGroup
      label="Policy"
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
              <Select.Item
                v-for="policy in policyTypes"
                :key="policy.value"
                :value="policy.value"
              >
                {{ policy.label }}
              </Select.Item>
            </Select.Content>
          </Select>
          <FieldDescription id="record-policy-helper"
            >Simple is standard resolution. Weighted distributes answers across records by
            weight.</FieldDescription
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
          <FieldDescription id="record-weight-helper"
            >Relative weight for this record within the weighted set, from 0 to
            255.</FieldDescription
          >
        </Field>
      </div>
    </SettingsGroup>
  </FormDrawer>

  <UnsavedChangesDialog
    :guard="guard"
    data-testid="unsaved-changes-dialog"
  />
</template>
