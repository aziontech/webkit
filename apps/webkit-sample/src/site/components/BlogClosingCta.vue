<script setup>
  // The blog's closing band: the Site's split CallToAction carrying the source's newsletter
  // ask. The lead cell holds the eyebrow, headline and the subscribe form as its action; the
  // aside holds the supporting line. The result confirms through the toast; nothing is sent.
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import FieldText from '@aziontech/webkit/field-text'
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'

  import { BLOG_NEWSLETTER } from '../data/blog.js'

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const email = ref('')
  const error = ref('')
  const sending = ref(false)

  async function subscribe() {
    if (sending.value) return
    const value = email.value.trim()
    if (!value) return (error.value = 'Enter your email address.')
    if (!EMAIL.test(value)) return (error.value = 'Enter an email address like name@example.com.')
    error.value = ''
    sending.value = true
    await new Promise((resolve) => setTimeout(resolve, 600))
    sending.value = false
    email.value = ''
    toast.success(BLOG_NEWSLETTER.success)
  }
</script>

<template>
  <CallToAction
    framed
    kind="split"
    :eyebrow="BLOG_NEWSLETTER.eyebrow"
    :title="BLOG_NEWSLETTER.title"
    :description="BLOG_NEWSLETTER.description"
  >
    <template #actions>
      <!-- The CTA fits its action's width from md up; the wrapper takes that, the form inside
           keeps the field a readable width. -->
      <div>
        <form
          novalidate
          class="flex w-full flex-col gap-(--spacing-sm) sm:w-(--container-md) sm:max-w-full sm:flex-row sm:items-start"
          @submit.prevent="subscribe"
        >
          <FieldText
            v-model="email"
            label="Email"
            size="large"
            type="email"
            autocomplete="email"
            :placeholder="BLOG_NEWSLETTER.placeholder"
            :invalid="Boolean(error)"
            :helper-text="error"
            :disabled="sending"
            class="min-w-0 flex-1"
            @update:model-value="error = ''"
          />
          <Button
            :label="BLOG_NEWSLETTER.submit"
            kind="secondary"
            size="large"
            :loading="sending"
            class="sm:mt-(--spacing-lg)"
            @click="subscribe"
          />
        </form>
      </div>
    </template>
  </CallToAction>
</template>
