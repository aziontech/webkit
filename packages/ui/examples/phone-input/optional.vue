<script setup>
  import Button from '@aziontech/ui/button'
  import Field from '@aziontech/ui/field'
  import PhoneInput from '@aziontech/ui/phone-input'
  import { computed, ref } from 'vue'

  const digits = ref('')
  const country = ref('US')
  const phone = ref(null)
  const submitted = ref(false)

  const invalid = computed(
    () => submitted.value && Boolean(phone.value?.digits) && !phone.value?.complete
  )
</script>

<template>
  <form
    class="flex max-w-(--container-xs) flex-col items-start gap-(--spacing-md)"
    novalidate
    @submit.prevent="submitted = true"
  >
    <Field
      :invalid="invalid"
      class="w-full"
    >
      <Field.Label>Phone</Field.Label>
      <PhoneInput
        v-model="digits"
        v-model:country="country"
        name="phone"
        @phone-change="phone = $event"
      />
      <Field.Error v-if="invalid">Enter the full number, or leave the field empty.</Field.Error>
    </Field>
    <Button
      type="submit"
      variant="secondary"
      >Save</Button
    >
  </form>
</template>
