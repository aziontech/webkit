<script setup>
  // Payment Method — the card inside the upgrade drawer, in its two states.
  //
  // Figma node 1144:15242 ships this as ONE component with a `property1`
  // variant, Default and Filled, and that is exactly how it behaves here:
  //
  //   · DEFAULT — the card on file, as a single row: the brand mark, "Ended with
  //     8888", and a Change control. This is the resting state, because a user
  //     who already has a card should not be shown a form they do not need to
  //     touch.
  //   · FILLED — the same card region replaced by the entry form, with its own
  //     Cancel and Update. The form REPLACES the row rather than appearing under
  //     it: they are two answers to one question, and showing both invites the
  //     user to wonder which one will be charged.
  //
  // The form takes Cancel/Update of its own because it is a nested commit — the
  // drawer's own footer commits the upgrade, and a single footer cannot mean both
  // "save this card" and "buy this plan". Cancelling the form returns to the row
  // with the original card untouched.
  //
  // No card data is validated, stored, or sent anywhere: this is a sample, and
  // the Message states the arrangement the design specifies — a PCI-compliant
  // partner handles the real thing.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import Message from '@aziontech/webkit/message'
  import { reactive, ref } from 'vue'

  import CardBrandMark from './CardBrandMark.vue'

  defineProps({
    // Locks every control while the drawer's own submit is in flight.
    disabled: { type: Boolean, default: false }
  })

  // The card on file. Only the last four digits are ever held — the rest belongs
  // to the payment partner.
  const card = reactive({ last4: '8888' })

  // Which of the two states the card region is in.
  const editing = ref(false)

  // Value === label, deliberately. `FieldSelect` does not forward `Select`'s
  // `displayValue` formatter, so its trigger renders whatever the model holds:
  // a pre-seeded country code shows as "BR" instead of "Brazil" until the user
  // opens the list. Storing the display name keeps the field honest without
  // dropping to the `Select` compound for one formatter. There is no backend
  // here for an ISO code to be correct for.
  const countryOptions = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'United States', label: 'United States' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' }
  ]

  const blankForm = () => ({
    holder: '',
    country: 'Brazil',
    number: '',
    expiry: '',
    code: ''
  })

  const form = reactive(blankForm())

  const startEditing = () => {
    Object.assign(form, blankForm())
    editing.value = true
  }

  const cancelEditing = () => {
    editing.value = false
  }

  // Takes the last four digits of whatever was typed and returns to the row. A
  // real implementation hands the number to the payment partner and stores only
  // what comes back; this keeps the same shape so the row is honest about which
  // card it is describing.
  const update = () => {
    const digits = form.number.replace(/\D/g, '')
    if (digits.length >= 4) card.last4 = digits.slice(-4)
    editing.value = false
  }
</script>

<template>
  <CardBox
    title="Payment Method"
    :padded="false"
  >
    <template #content>
      <div
        class="flex flex-col gap-[var(--spacing-lg)] px-[var(--spacing-lg)] py-[var(--spacing-lg)]"
      >
        <!-- DEFAULT — the card on file. A bordered row rather than an Item from
             the DS, because the row carries a fixed-size brand plate and a
             trailing control, and Item's own paddings would fight the card's. -->
        <div
          v-if="!editing"
          class="flex min-h-14 flex-wrap items-center gap-[var(--spacing-md)] rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
        >
          <CardBrandMark />
          <p class="min-w-0 flex-1 text-label-md text-[var(--text-default)]">
            Ended with {{ card.last4 }}
          </p>
          <Button
            label="Change"
            kind="outlined"
            size="small"
            :disabled="disabled"
            @click="startEditing"
          />
        </div>

        <!-- FILLED — the entry form. Two columns on the wider drawer, one when it
             narrows, so the expiry and security code stay side by side only while
             there is room for both. -->
        <template v-else>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
            :disabled="disabled"
          >
            <legend class="sr-only">Payment Method</legend>

            <FieldText
              v-model="form.holder"
              label="Cardholder's full name"
              input-id="payment-holder"
              name="cardholderName"
              size="large"
              placeholder="Jane A. Doe"
              autocomplete="cc-name"
            />

            <FieldSelect
              v-model="form.country"
              label="Country/Region"
              :options="countryOptions"
              input-id="payment-country"
              size="large"
            />

            <FieldText
              v-model="form.number"
              label="Credit card number"
              input-id="payment-number"
              name="cardNumber"
              size="large"
              placeholder="1234 5678 9012 3456"
              autocomplete="cc-number"
              inputmode="numeric"
            />

            <div class="grid grid-cols-1 gap-[var(--spacing-lg)] sm:grid-cols-2">
              <FieldText
                v-model="form.expiry"
                label="Expiration Date (MM/YY)"
                input-id="payment-expiry"
                name="cardExpiry"
                size="large"
                placeholder="08 / 26"
                autocomplete="cc-exp"
                inputmode="numeric"
              />
              <FieldText
                v-model="form.code"
                label="Security Code (CVC/CVV)"
                input-id="payment-code"
                name="cardSecurityCode"
                size="large"
                placeholder="999"
                autocomplete="cc-csc"
                inputmode="numeric"
              />
            </div>

            <!-- Why the fields above are safe to fill in. It states the
                 arrangement rather than reassuring the reader, which is what the
                 design asks for and what an infrastructure product owes them. -->
            <Message
              severity="info"
              size="small"
              label="Sensitive data is handled by a PCI-compliant payment partner."
            />
          </fieldset>

          <!-- The form's own commit, separate from the drawer's. -->
          <div class="flex flex-col gap-[var(--spacing-sm)] sm:flex-row sm:justify-end">
            <Button
              class="w-full sm:w-auto"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="disabled"
              @click="cancelEditing"
            />
            <Button
              class="w-full sm:w-auto"
              label="Update"
              kind="primary"
              size="medium"
              :disabled="disabled"
              @click="update"
            />
          </div>
        </template>
      </div>
    </template>
  </CardBox>
</template>
