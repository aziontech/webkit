<script setup>
  import JobPosting from '@aziontech/webkit/job-posting'
  import { nextTick, ref } from 'vue'

  const facets = [
    {
      label: 'Engineering',
      icon: 'pi pi-sitemap'
    },
    {
      label: 'San Francisco, California',
      icon: 'pi pi-map-marker'
    },
    {
      label: 'Hybrid',
      icon: 'pi pi-building'
    },
    {
      label: 'Full-time',
      icon: 'pi pi-clock'
    }
  ]

  const sections = [
    {
      title: 'About Acme',
      blocks: [
        {
          kind: 'text',
          text: 'Acme builds the platform teams use to ship and run their applications worldwide. We are a small team with a big footprint, and we care about tools that get out of the way.'
        }
      ]
    },
    {
      title: 'About the role',
      blocks: [
        {
          kind: 'text',
          text: 'As a Senior Platform Engineer you will turn quality into a built-in capability of our engineering platform: automation, internal tools and standards that remove manual steps from the delivery cycle.'
        },
        {
          kind: 'text',
          text: 'You will work with the development, platform and infrastructure teams on self-service tools, standard pipelines and automated release checks.'
        }
      ]
    },
    {
      title: 'What you will do',
      blocks: [
        {
          kind: 'list',
          items: [
            'Build and evolve standard CI/CD pipelines for tests, checks and releases.',
            'Write internal frameworks and tools for test automation.',
            'Automate functional, integration and end-to-end tests.',
            'Guide engineers in testing and automation practices.'
          ]
        }
      ]
    },
    {
      title: 'What you bring',
      blocks: [
        {
          kind: 'list',
          items: [
            'Experience with test automation and quality engineering.',
            'Solid experience with CI/CD and pipeline automation.',
            'Tooling written in TypeScript, Python or Go.',
            'Working knowledge of Linux and containers.'
          ]
        }
      ]
    }
  ]

  const form = {
    anchor: 'apply',
    title: 'Do you want to build with us?',
    description: 'Fill in the form to apply for this position.',
    submitLabel: 'Submit application',
    fields: [
      {
        name: 'name',
        kind: 'text',
        label: 'Name',
        required: true,
        autocomplete: 'name'
      },
      {
        name: 'email',
        kind: 'email',
        label: 'Email address',
        required: true,
        helper: 'We answer every application at this address.'
      },
      {
        name: 'phone',
        kind: 'phone',
        label: 'Contact number',
        required: true
      },
      {
        name: 'linkedin',
        kind: 'url',
        label: 'LinkedIn profile URL',
        helper: 'Optional.'
      },
      {
        name: 'resume',
        kind: 'file',
        label: 'Resume',
        required: true,
        accept: 'application/pdf,.docx,.doc',
        helper: '.pdf, .docx or .doc, up to 5 MB'
      }
    ]
  }

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter an email address like name@example.com.',
    invalidUrl: 'Enter the full URL, starting with https://.',
    error: 'We could not send your application. Try again in a few minutes.',
    successTitle: 'Application sent',
    successDescription:
      'Thank you for applying. We read every application and will reply by email.',
    done: 'Done',
    browse: 'Browse files'
  }

  const submitted = ref(false)

  const send = async () => {
    submitted.value = false
    await nextTick()
    submitted.value = true
  }
</script>

<template>
  <JobPosting
    area="Engineering"
    title="Senior Platform Engineer"
    apply-label="Apply for this position"
    :facets="facets"
    :sections="sections"
    :form="form"
    :messages="messages"
    :secondary-action="{ label: 'See open positions', href: '/careers' }"
    :submitted="submitted"
    @submit="send"
  />
</template>
