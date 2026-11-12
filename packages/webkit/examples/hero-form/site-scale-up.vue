<script setup>
  import HeroForm from '@aziontech/webkit/hero-form'

  const fields = [
    {
      name: 'firstname',
      kind: 'text',
      label: 'First name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      kind: 'text',
      label: 'Last name',
      half: true
    },
    {
      name: 'email',
      kind: 'email',
      label: 'Work email',
      placeholder: 'name@company.com',
      required: true
    },
    {
      name: 'company',
      kind: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'mobilephone',
      kind: 'phone',
      label: 'Phone',
      placeholder: '(999) 999-9999',
      country: 'US',
      visuallyHiddenLabel: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'We will be in touch.',
    error: 'We could not send your message. Try again.'
  }

  const onSubmit = (event, values) => {
    console.log(event.type, values)
  }
</script>

<template>
  <HeroForm
    title="Azion Scale Up Credit Program"
    description="Up to $120,000 in service credits for your company. Azion Scale Up gives startups free credits, onboarding with Azion experts and 24/7 technical support while they build on the platform."
    form-aria-label="Request immediate contact"
    :fields="fields"
    submit-label="Request immediate contact"
    :messages="messages"
    @submit="onSubmit"
  />
</template>
