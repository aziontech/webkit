<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { computed, ref } from 'vue'

  import type { CreateTicketContact } from '../create-ticket.vue'
  import TicketRequesterField from './ticket-requester-field.vue'

  export interface TicketRequesterBandProps {
    /** The contacts the requester search offers. */
    contacts: CreateTicketContact[]
    /** Locks every control while the request runs. */
    disabled?: boolean
    /** The messages a submit found, empty for a valid field. */
    errors: { requester: string; contactName: string; contactEmail: string; cc: string }
  }

  const props = withDefaults(defineProps<TicketRequesterBandProps>(), {
    disabled: false
  })

  const requesterEmail = defineModel<string>('requesterEmail', { default: '' })
  const contactName = defineModel<string>('contactName', { default: '' })
  const contactEmail = defineModel<string>('contactEmail', { default: '' })
  const newContact = defineModel<boolean>('newContact', { default: false })
  const cc = defineModel<string[]>('cc', { default: () => [] })

  const typed = ref<string[]>([])
  const ccChoices = computed(() => [
    ...new Set([...props.contacts.map((contact) => contact.email), ...cc.value, ...typed.value])
  ])

  const addAddress = (_event: MouseEvent | KeyboardEvent, address: string) => {
    typed.value = [...typed.value, address]
    cc.value = [...cc.value, address]
  }

  const requesterEl = ref<InstanceType<typeof TicketRequesterField> | null>(null)

  defineExpose({
    /** Moves focus to the first requester control. */
    focus: () => requesterEl.value?.focus()
  })
</script>

<template>
  <SettingsGroup
    label="Requester"
    hint="Who asked, and who else gets the replies."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TicketRequesterField
            ref="requesterEl"
            v-model:requester-email="requesterEmail"
            v-model:contact-name="contactName"
            v-model:contact-email="contactEmail"
            v-model:new-contact="newContact"
            :contacts="contacts"
            :disabled="disabled"
            :requester-error="errors.requester"
            :name-error="errors.contactName"
            :email-error="errors.contactEmail"
          />
          <SettingsRow
            stackable
            title="CC"
            description="Email addresses copied on every reply. Type an address and press Enter."
          >
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <MultiSelect
                v-model="cc"
                variant="chips"
                size="large"
                searchable
                allow-custom
                placeholder="Add email addresses"
                aria-label="CC"
                :disabled="disabled"
                :invalid="Boolean(errors.cc)"
                :aria-describedby="errors.cc ? 'create-ticket-cc-message' : undefined"
                @create="addAddress"
              >
                <MultiSelect.Trigger />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="address in ccChoices"
                    :key="address"
                    :value="address"
                    >{{ address }}</MultiSelect.Item
                  >
                </MultiSelect.Content>
              </MultiSelect>
              <FieldError
                v-if="errors.cc"
                id="create-ticket-cc-message"
                >{{ errors.cc }}</FieldError
              >
            </div>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
