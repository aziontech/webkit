<script setup>
  import HeroFormSection from '@aziontech/webkit/hero-form-section'

  const items = [
    {
      icon: 'az az-security-team',
      title: 'Help before you become a customer',
      description: 'Emergency mitigation for an attack in progress.'
    },
    {
      icon: 'az az-secure-pillar',
      title: '265B attacks blocked',
      description: 'Stopped on the Azion network since 2022.'
    },
    {
      icon: 'az az-build-pillar',
      title: '35B functions a month',
      description: 'Edge functions run every month for security controls.'
    },
    {
      icon: 'az az-application-accelerator',
      title: 'Over 90% of requests served from cache',
      description: 'Customer requests answered close to your users.'
    }
  ]

  const fields = [
    {
      name: 'firstname',
      autocomplete: 'given-name',
      type: 'text',
      label: 'First name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      autocomplete: 'family-name',
      type: 'text',
      label: 'Last name',
      half: true,
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Business email',
      required: true
    },
    {
      name: 'company',
      autocomplete: 'organization',
      type: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'domain',
      autocomplete: 'url',
      type: 'text',
      label: 'Website',
      half: true
    },
    {
      name: 'mobilephone',
      type: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'Thanks, we received your request.',
    successDescription: 'A specialist will reply by email within one business day.',
    error: 'We could not send your message. Try again.'
  }

  const marqueeMarks = [
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
    console.warn(event.type, values)
  }
</script>

<template>
  <HeroFormSection
    eyebrow="Under Cyberattack?"
    title-highlight=""
    title="Mitigate a cyberattack now"
    description="Our digital security team is available to provide immediate assistance."
    :items="items"
    form-aria-label="Request immediate contact"
    :fields="fields"
    submit-label="Request immediate contact"
    :messages="messages"
    marquee-label="Trusted by teams running critical workloads"
    :marquee-marks="marqueeMarks"
    @submit="onSubmit"
  />
</template>
