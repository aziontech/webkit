<script setup lang="ts">
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputText from '@aziontech/webkit/input-text'
  import Link from '@aziontech/webkit/link'
  import Select from '@aziontech/webkit/select'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import FieldStack from '../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import Section from '../../components/page/Section.vue'
  import { POLICY_TYPES, RECORD_TYPES, recordType } from '../../lib/data/edge-dns'

  const open = defineModel('open', { type: Boolean, default: false })
  interface Props {
    domain?: string
  }

  withDefaults(defineProps<Props>(), {
    domain: ''
  })
  const emit = defineEmits<{
    created: [value: unknown]
  }>()

  const blankForm = () => ({
    name: '',
    type: 'A',
    ttl: 3600,
    value: '',
    description: '',
    policy: 'simple',
    weight: 100
  })

  const form = reactive(blankForm())
  const errors = reactive({ name: '', value: '' })
  const submitting = ref(false)

  const selectedType = computed(() => recordType(form.type))
  const isWeighted = computed(() => form.policy === 'weighted')

  const typeLabel = (value) => recordType(value).label
  const policyLabelOf = (value) =>
    POLICY_TYPES.find((policy) => policy.value === value)?.label ?? ''

  watch(open, (isOpen) => {
    if (isOpen) return
    Object.assign(form, blankForm())
    errors.name = ''
    errors.value = ''
  })

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.value = form.value.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.value
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const name = form.name.trim()
      emit('created', {
        id: String(Math.floor(100000 + Math.random() * 900000)),
        name,
        type: form.type,
        value: form.value.trim(),
        ttl: form.ttl,
        description: form.description.trim(),
        policy: form.policy,
        weight: isWeighted.value ? form.weight : null
      })
      toast.success(`Record "${name}" created.`)
      open.value = false
    } catch (error) {
      toast.error('Could not create the record.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    size="large"
    title="Add Record"
    :description="
      domain
        ? `A new record in ${domain}, and how Edge DNS should answer requests for it.`
        : 'Add a DNS record and choose how Edge DNS should answer requests for it.'
    "
    save-label="Save"
    :submitting="submitting"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="Settings"
      hint="Which IPs are associated with the domain and how Edge DNS should handle requests."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          label="Name"
          description="Use @ to create a record for the root domain."
          :message="errors.name"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputGroupRoot
              :disabled="submitting"
              :required="!!errors.name"
            >
              <InputText
                :id="controlId"
                v-model="form.name"
                size="large"
                class="flex-1"
                placeholder="subdomain"
                autocomplete="off"
                :disabled="submitting"
                :required="!!errors.name"
                :aria-describedby="describedBy"
                @update:model-value="errors.name = ''"
              />
              <InputGroupAddon v-if="domain">.{{ domain }}</InputGroupAddon>
            </InputGroupRoot>
          </template>
        </FieldStack>

        <FieldStack label="Record type">
          <template #description>
            <Link
              label="Read more about record types"
              size="medium"
              href="https://www.azion.com/en/documentation/products/secure/edge-dns/"
              target="_blank"
            />
          </template>
          <template #default="{ controlId }">
            <Select
              v-model="form.type"
              size="large"
              class="w-full"
              :disabled="submitting"
              :display-value="typeLabel"
            >
              <Select.Trigger
                :id="controlId"
                aria-label="Record type"
              />
              <Select.Content>
                <Select.Option
                  v-for="type in RECORD_TYPES"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </template>
        </FieldStack>

        <FieldStack
          label="TTL (seconds)"
          description="Time-to-live a response can be cached for on a resolver server."
        >
          <template #default="{ controlId }">
            <InputNumber
              :id="controlId"
              v-model="form.ttl"
              size="large"
              class="w-full"
              :min="0"
              :disabled="submitting"
              aria-label="TTL in seconds"
            />
          </template>
        </FieldStack>

        <FieldStack
          label="Value"
          :description="selectedType.valueHelper"
          :message="errors.value"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <Textarea
              :id="controlId"
              v-model="form.value"
              class="w-full"
              :placeholder="selectedType.placeholder"
              aria-label="Value"
              :disabled="submitting"
              :required="!!errors.value"
              :aria-describedby="describedBy"
              @update:model-value="errors.value = ''"
            />
          </template>
        </FieldStack>

        <FieldStack
          label="Description"
          description="An optional note to help identify this record."
        >
          <template #default="{ controlId }">
            <InputText
              :id="controlId"
              v-model="form.description"
              size="large"
              class="w-full"
              placeholder="Optional description"
              autocomplete="off"
              :disabled="submitting"
            />
          </template>
        </FieldStack>
      </div>
    </Section>

    <Section
      stacked
      :divided="false"
      title="Policy"
      hint="How Edge DNS should deal with requests answered by this record."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          label="Policy type"
          description="Simple is standard resolution. Weighted distributes answers across records by weight."
        >
          <template #default="{ controlId }">
            <Select
              v-model="form.policy"
              size="large"
              class="w-full"
              :disabled="submitting"
              :display-value="policyLabelOf"
            >
              <Select.Trigger
                :id="controlId"
                aria-label="Policy type"
              />
              <Select.Content>
                <Select.Option
                  v-for="policy in POLICY_TYPES"
                  :key="policy.value"
                  :value="policy.value"
                >
                  {{ policy.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </template>
        </FieldStack>

        <FieldStack
          v-if="isWeighted"
          label="Weight"
          description="Relative weight (0–255) for this record within the weighted set."
        >
          <template #default="{ controlId }">
            <InputNumber
              :id="controlId"
              v-model="form.weight"
              size="large"
              class="w-full"
              :min="0"
              :max="255"
              :disabled="submitting"
              aria-label="Weight"
            />
          </template>
        </FieldStack>
      </div>
    </Section>
  </ResourceDrawer>
</template>
