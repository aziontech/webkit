<script setup>
  import HeroFormSection from '@aziontech/webkit/hero-form-section'

  const items = [
    {
      icon: 'az az-ai-inference',
      title: 'Build AI applications',
      description: 'Run AI agents and inference close to your users.'
    },
    {
      icon: 'az az-build-pillar',
      title: 'Modernize applications',
      description: 'Go from commit to a live URL in minutes.'
    },
    {
      icon: 'az az-secure-pillar',
      title: 'Protect applications and APIs',
      description: 'Block DDoS attacks, malicious bots, and API abuse.'
    },
    {
      icon: 'az az-application-accelerator',
      title: 'Speed up every workload',
      description: '100+ data centers, with a 30 ms median latency.'
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
      label: 'Work email',
      placeholder: 'm@example.com',
      required: true
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      placeholder: 'Select your role',
      half: true,
      required: true,
      options: [
        'Administrator',
        'Advisor',
        'Analyst',
        'Architect',
        'Assistant',
        'Auditor',
        'Buyer',
        'CDO - Chief Data Officer',
        'CDO - Chief Digital Officer',
        'CEO – Chief Executive Officer',
        'CFO – Chief Financial Officer',
        'CHRO – Chief Human Resources Officer',
        'CIO - Chief Information Officer',
        'CISO - Chief Information Security Officer',
        'CMO – Chief Marketing Officer',
        'Consultant',
        'Controller',
        'COO – Chief Operating Officer',
        'Coordinator',
        'CPO - Chief Product Owner',
        'CRO - Chief Revenue Officer',
        'CTO - Chief Technology Officer',
        'CXO - Chief Experience officer',
        'Dean',
        'Designer',
        'Developer',
        'Director',
        'Engineer',
        'Expert',
        'Founder',
        'Head',
        'Manager',
        'Owner',
        'Partner',
        'President',
        'Secretary',
        'Specialist',
        'Superintendent',
        'Supervisor',
        'Vice President'
      ]
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
      name: 'mobilephone',
      type: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'How can we help?',
      placeholder:
        'Tell us about your current stack, your use case, and what you want to run on Azion.',
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

  const onSubmit = (_event, _values) => {}
</script>

<template>
  <HeroFormSection
    eyebrow="Sales"
    title-highlight=""
    title="Talk to our sales team"
    description="Get a custom demo, plan your migration, and explore plans and pricing built for your company."
    :items="items"
    form-aria-label="Contact sales"
    :fields="fields"
    submit-label="Contact sales"
    :messages="messages"
    marquee-label="Trusted by teams running critical workloads"
    :marquee-marks="marqueeMarks"
    :submitted="true"
    @submit="onSubmit"
  />
</template>
