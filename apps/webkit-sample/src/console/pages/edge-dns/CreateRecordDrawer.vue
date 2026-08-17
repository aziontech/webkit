<script setup>
  // Create Record — the Edge DNS zone "add record" flow, in a MEDIUM right Drawer
  // opened from the zone detail's Records tab.
  //
  // FIELDS ARE SEPARATED (./ui/FieldStack.vue, the Variables shape): a real
  // `<Label for>` over a full-width control, the field's own message under it, and the
  // band's guidance said once in its `Section` hint. Value is the field that settles it
  // — an A record takes one IP and a TXT record takes a paragraph, and a textarea capped
  // at 256px on the right of a description could hold neither well. Two sections:
  // Settings (the record itself) and Policy (how Edge DNS answers with it).
  //
  // The Name field's zone-domain suffix is an InputGroup addon (".edgeflow.com");
  // the Value field's placeholder + guidance switch with the selected Record Type
  // (src/lib/edge-dns.js), and the Weight field only appears for the WEIGHTED
  // policy. Validation runs on submit only — empty required fields reveal the amber
  // `required` state (a prompt, not the red `invalid` error), shown as a HelperText
  // under the control. One `submitting` flag locks the whole scope (fieldset
  // :disabled + every control :disabled + Save :loading, the /usability Pattern 1
  // lock); on success it emits the built record and the parent appends it.
  import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'
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
  defineProps({
    // The zone's root domain, shown as the Name field's InputGroup addon — and named
    // in the drawer's own subtitle, because a record only means anything against the
    // zone it belongs to and the reader opened this from that zone's page.
    domain: { type: String, default: '' }
  })
  const emit = defineEmits(['created'])

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

  // Reset the form each time the drawer closes so the next open starts clean.
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
    if (submitting.value) return // re-entrancy lock
    if (!validate()) return // feedback is now on the fields themselves

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
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    size="large"
    title="Create record"
    :description="
      domain
        ? `A new record in ${domain}, and how Edge DNS should answer requests for it.`
        : 'Add a DNS record and choose how Edge DNS should answer requests for it.'
    "
    save-label="Save"
    :submitting="submitting"
    @submit="submit"
  >
    <!-- Section: Settings -->
    <Section
      stacked
      :divided="false"
      title="Settings"
      hint="Which IPs are associated with the domain and how Edge DNS should handle requests. The accepted value's format varies according to the chosen record type."
    >
      <div class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
        <!-- Name: subdomain + the zone's root domain as an addon. -->
        <FieldStack
          label="Name"
          description="Use @ to create a record for the root domain."
          :message="errors.name"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputGroup
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
            </InputGroup>
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

        <!-- Value: placeholder + guidance switch with the record type. It is the widest
             thing on this form — an A record takes one IP, a TXT record takes a
             paragraph — which is the clearest single reason these fields are separated
             rather than capped at a 256px right-hand column. -->
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

    <!-- Section: Policy -->
    <Section
      stacked
      :divided="false"
      title="Policy"
      hint="How Edge DNS should deal with requests answered by this record. SIMPLE is standard resolution; WEIGHTED distributes answers across records by weight."
    >
      <div class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
        <FieldStack label="Policy type">
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

        <!-- Weight only applies to the WEIGHTED policy. -->
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
