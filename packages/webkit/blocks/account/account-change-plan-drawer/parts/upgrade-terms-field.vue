<script setup lang="ts">
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'

  export interface UpgradeTermsFieldProps {
    /** The upgrade request is in flight. */
    submitting: boolean
  }

  defineProps<UpgradeTermsFieldProps>()

  const termsAccepted = defineModel<boolean>('accepted', { required: true })
  const termsError = defineModel<string>('error', { required: true })
</script>

<template>
  <Field
    orientation="horizontal"
    :invalid="!!termsError"
  >
    <Checkbox
      v-model="termsAccepted"
      id="checkout-terms"
      name="terms"
      :disabled="submitting"
      @update:model-value="termsError = ''"
    />
    <Field.Content>
      <Field.Label for="checkout-terms">
        I accept the
        <Link
          href="https://example.com/terms"
          target="_blank"
          inline
          >Terms of Service<span class="sr-only"> (opens in a new tab)</span></Link
        >
        and the
        <Link
          href="https://example.com/privacy"
          target="_blank"
          inline
          >Privacy Policy<span class="sr-only"> (opens in a new tab)</span></Link
        >
      </Field.Label>
      <Field.Description v-if="termsError">{{ termsError }}</Field.Description>
    </Field.Content>
  </Field>
</template>
