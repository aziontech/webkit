<script setup>
  import Button from '@aziontech/ui/button'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import PhoneInput from '@aziontech/ui/phone-input'
  import { computed, reactive, ref } from 'vue'

  const form = reactive({ name: '', email: '', digits: '', country: 'US' })
  const phone = ref(null)
  const submitted = ref(false)

  const errors = computed(() => {
    if (!submitted.value) return {}
    return {
      name: form.name.trim() ? '' : 'Enter a name.',
      email: /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter a valid email.',
      phone: !phone.value?.digits || phone.value.complete ? '' : 'Enter the full number.'
    }
  })
</script>

<template>
  <form
    class="flex max-w-(--container-xs) flex-col items-start gap-(--spacing-lg)"
    novalidate
    @submit.prevent="submitted = true"
  >
    <Field.Group>
      <Field
        required
        :invalid="!!errors.name"
      >
        <Field.Label>Name</Field.Label>
        <Input
          v-model="form.name"
          name="name"
          autocomplete="name"
        />
        <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
      </Field>
      <Field
        required
        :invalid="!!errors.email"
      >
        <Field.Label>Work email</Field.Label>
        <Input
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
        />
        <Field.Error v-if="errors.email">{{ errors.email }}</Field.Error>
      </Field>
      <Field :invalid="!!errors.phone">
        <Field.Label>Phone</Field.Label>
        <PhoneInput
          v-model="form.digits"
          v-model:country="form.country"
          name="phone"
          @phone-change="phone = $event"
        />
        <Field.Error v-if="errors.phone">{{ errors.phone }}</Field.Error>
      </Field>
    </Field.Group>
    <Button type="submit">Save</Button>
  </form>
</template>
