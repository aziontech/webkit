<script setup>
  import Button from '@aziontech/webkit/button'
  import JobPosting from '@aziontech/webkit/job-posting'
  import { nextTick, ref } from 'vue'

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

  const confirm = async () => {
    submitted.value = false
    await nextTick()
    submitted.value = true
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div class="flex">
      <Button
        label="Show the confirmation"
        kind="outlined"
        size="medium"
        @click="confirm"
      />
    </div>
    <JobPosting
      area="Engineering"
      title="Senior Platform Engineer"
      apply-label="Apply for this position"
      :facets="[{ label: 'Engineering', icon: 'ai ai-sitemap' }]"
      :sections="[
        {
          title: 'About the role',
          blocks: [{ kind: 'text', text: 'You will build the tools our engineers ship with.' }]
        }
      ]"
      :form="form"
      :messages="messages"
      :secondary-action="{ label: 'See open positions', href: '/careers' }"
      :submitted="submitted"
      error
    />
  </div>
</template>
