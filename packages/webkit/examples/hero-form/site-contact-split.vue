<script setup>
  import HeroForm from '@aziontech/webkit/hero-form'
  import { ref } from 'vue'

  const items = [
    {
      icon: 'ai ai-edge-ai',
      title: 'Build AI applications',
      description: 'Run AI agents and inference close to your users.'
    },
    {
      icon: 'ai ai-build-pillar',
      title: 'Modernize applications',
      description: 'Go from commit to a live URL in minutes.'
    },
    {
      icon: 'ai ai-secure-pillar',
      title: 'Protect applications and APIs',
      description: 'Block DDoS attacks, malicious bots, and API abuse.'
    },
    {
      icon: 'ai ai-app-accelerator',
      title: 'Speed up every workload',
      description: '100+ data centers, with a 30 ms median latency.'
    }
  ]

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
      half: true,
      required: true
    },
    {
      name: 'email',
      kind: 'email',
      label: 'Work email',
      placeholder: 'm@example.com',
      required: true
    },
    {
      name: 'role',
      kind: 'select',
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
      kind: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'mobilephone',
      kind: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    },
    {
      name: 'message',
      kind: 'textarea',
      label: 'How can we help?',
      placeholder:
        'Tell us about your current stack, your use case, and what you want to run on Azion.',
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

  const submission = {
    endpoint: 'https://api.example.com/forms/contact',
    pageName: 'Contact',
    hiddenFields: {
      form_action: 'contact_us',
      voce_gostaria_de_receber_novos_conteudos_por_whatsapp_: 'Não'
    }
  }

  const loading = ref(false)
  const submitted = ref(false)
  const error = ref(false)

  const onSubmit = async (event, values) => {
    loading.value = true
    error.value = false
    try {
      const response = await fetch(submission.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: Object.entries({ ...submission.hiddenFields, ...values }).map(
            ([name, value]) => ({
              name,
              value
            })
          ),
          context: { pageName: submission.pageName }
        })
      })
      submitted.value = response.ok
      error.value = !response.ok
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <HeroForm
    eyebrow="Sales"
    highlight=""
    title="Talk to our sales team"
    description="Get a custom demo, plan your migration, and explore plans and pricing built for your company."
    :items="items"
    form-aria-label="Contact sales"
    :fields="fields"
    submit-label="Contact sales"
    :messages="messages"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="carouselMarks"
    :loading="loading"
    :submitted="submitted"
    :error="error"
    @submit="onSubmit"
  />
</template>
