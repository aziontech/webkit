<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Combobox from '@aziontech/webkit/combobox'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { computed, nextTick, ref } from 'vue'

  import type { CreateTicketContact } from '../create-ticket.vue'
  import TicketPersonOption from './ticket-person-option.vue'

  export interface TicketRequesterFieldProps {
    /** The contacts the search offers. */
    contacts: CreateTicketContact[]
    /** The contacts are still arriving. */
    loading?: boolean
    /** Locks every control while the request runs. */
    disabled?: boolean
    /** Why the picked requester is missing; empty when valid. */
    requesterError?: string
    /** Why the new contact's name is missing; empty when valid. */
    nameError?: string
    /** Why the new contact's email is missing or wrong; empty when valid. */
    emailError?: string
  }

  const props = withDefaults(defineProps<TicketRequesterFieldProps>(), {
    loading: false,
    disabled: false,
    requesterError: '',
    nameError: '',
    emailError: ''
  })

  const requesterEmail = defineModel<string>('requesterEmail', { default: '' })
  const contactName = defineModel<string>('contactName', { default: '' })
  const contactEmail = defineModel<string>('contactEmail', { default: '' })
  const newContact = defineModel<boolean>('newContact', { default: false })

  const nameEl = ref<InstanceType<typeof Input> | null>(null)

  const focusSearch = () =>
    document.getElementById('create-ticket-requester')?.focus({ preventScroll: true })

  const addContact = async () => {
    newContact.value = true
    await nextTick()
    nameEl.value?.focus()
  }

  const searchContacts = async () => {
    newContact.value = false
    await nextTick()
    focusSearch()
  }

  const options = computed(() =>
    props.contacts.map((contact) => ({
      value: contact.email,
      label: contact.name,
      description: contact.email
    }))
  )

  defineExpose({
    /** Moves focus to the first requester control. */
    focus: () => (newContact.value ? nameEl.value?.focus() : focusSearch())
  })
</script>

<template>
  <SettingsRow
    v-if="!newContact"
    required
    stackable
    title="Requester"
    description="The customer who asked. Search by name or email address."
  >
    <div class="flex w-full flex-col gap-(--spacing-xs)">
      <Combobox
        id="create-ticket-requester"
        v-model="requesterEmail"
        :options="options"
        :allow-custom="false"
        :loading="loading"
        :disabled="disabled"
        :invalid="Boolean(requesterError)"
        :aria-describedby="requesterError ? 'create-ticket-requester-message' : undefined"
        size="large"
        placeholder="Search contacts"
        aria-label="Requester"
        empty-title="No contact matches. Add a new contact instead."
        required
        clearable
      >
        <template #option="{ option }">
          <TicketPersonOption
            :name="option.label ?? option.value"
            :detail="option.value"
          />
        </template>
      </Combobox>
      <FieldError
        v-if="requesterError"
        id="create-ticket-requester-message"
        >{{ requesterError }}</FieldError
      >
      <Button
        type="button"
        label="Add new contact"
        icon="az az-user-plus"
        variant="ghost"
        size="small"
        class="self-start"
        :disabled="disabled"
        @click="addContact"
      />
    </div>
  </SettingsRow>
  <template v-else>
    <SettingsRow
      required
      stackable
      title="Contact name"
      description="A new contact, saved with the ticket. They get its emails."
    >
      <div class="flex w-full flex-col gap-(--spacing-xs)">
        <Input
          ref="nameEl"
          v-model="contactName"
          size="large"
          class="w-full"
          aria-label="Contact name"
          autocomplete="off"
          required
          :disabled="disabled"
          :invalid="Boolean(nameError)"
          :aria-describedby="nameError ? 'create-ticket-contact-name-message' : undefined"
        />
        <FieldError
          v-if="nameError"
          id="create-ticket-contact-name-message"
          >{{ nameError }}</FieldError
        >
      </div>
    </SettingsRow>
    <SettingsRow
      required
      stackable
      title="Contact email"
      description="Where the customer gets replies to this ticket."
    >
      <div class="flex w-full flex-col gap-(--spacing-xs)">
        <Input
          v-model="contactEmail"
          type="email"
          size="large"
          class="w-full"
          aria-label="Contact email"
          autocomplete="off"
          required
          :disabled="disabled"
          :invalid="Boolean(emailError)"
          :aria-describedby="emailError ? 'create-ticket-contact-email-message' : undefined"
        />
        <FieldError
          v-if="emailError"
          id="create-ticket-contact-email-message"
          >{{ emailError }}</FieldError
        >
        <Button
          type="button"
          label="Search contacts"
          icon="az az-search"
          variant="ghost"
          size="small"
          class="self-start"
          :disabled="disabled"
          @click="searchContacts"
        />
      </div>
    </SettingsRow>
  </template>
</template>
