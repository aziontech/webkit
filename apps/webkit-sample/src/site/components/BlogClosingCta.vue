<script setup>
  // The blog's closing band: the Site's newsletter band carrying the source's newsletter ask.
  // The result confirms through the toast; nothing is sent.
  import { BLOG_NEWSLETTER } from '../data/blog.js'
  import NewsletterBand from '../ui/NewsletterBand.vue'

  const FORM = {
    label: 'Email',
    placeholder: BLOG_NEWSLETTER.placeholder,
    submit: BLOG_NEWSLETTER.submit,
    success: BLOG_NEWSLETTER.success,
    required: 'Enter your email address.',
    invalid: 'Enter an email address like name@example.com.'
  }
</script>

<template>
  <NewsletterBand
    :eyebrow="BLOG_NEWSLETTER.eyebrow"
    :title="BLOG_NEWSLETTER.title"
    :description="BLOG_NEWSLETTER.description"
    :form="FORM"
  />
</template>
