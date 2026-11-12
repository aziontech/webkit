<script setup>
  import HeroForm from '@aziontech/webkit/hero-form'

  const items = [
    {
      icon: 'ai ai-security-team',
      title: 'Help before you become a customer',
      description: 'Emergency mitigation for an attack in progress.'
    },
    {
      icon: 'ai ai-secure-pillar',
      title: '265B attacks blocked',
      description: 'Stopped on the Azion network since 2022.'
    },
    {
      icon: 'ai ai-build-pillar',
      title: '35B functions a month',
      description: 'Edge functions run every month for security controls.'
    },
    {
      icon: 'ai ai-app-accelerator',
      title: '+90% of requests served instantly',
      description: 'Customer requests answered close to your users.'
    }
  ]

  const fields = [
    {
      name: 'firstname',
      kind: 'text',
      label: 'Name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      kind: 'text',
      label: 'Last name',
      half: true,
      required: true
    },
    {
      name: 'email',
      kind: 'email',
      label: 'Business email',
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
      name: 'domain',
      kind: 'text',
      label: 'Website',
      half: true
    },
    {
      name: 'mobilephone',
      kind: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'We will be in touch.',
    error: 'We could not send your message. Try again.'
  }

  const carouselMarks = [
    'global-fashion-group',
    'herospark',
    'itau',
    'nzn',
    'netshoes',
    'caixa',
    'agibank',
    'prime-video',
    'america-movil',
    'gpa',
    'fourbank'
  ]

  const onSubmit = (event, values) => {
    console.log(event.type, values)
  }
</script>

<template>
  <HeroForm
    eyebrow="Under Cyberattack?"
    highlight=""
    title="Mitigating Cyberattacks"
    description="Our digital security team is available to provide immediate assistance."
    :items="items"
    form-aria-label="Request immediate contact"
    :fields="fields"
    submit-label="Request immediate contact"
    :messages="messages"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="carouselMarks"
    @submit="onSubmit"
  />
</template>
