<script setup>
  // The success-case library's closing band, shared with every story article: the Site's split
  // CallToAction with the source's own copy, Start Free leading and Talk to our team aside.
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const goSignup = () => router.push('/signup')
</script>

<template>
  <CallToAction
    framed
    kind="split"
    eyebrow="Build"
    title="Build once."
    title-muted="Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
  >
    <template #actions>
      <Button
        label="Start Free"
        kind="secondary"
        size="large"
        @click="goSignup"
      />
    </template>
    <template #aside>
      <Button
        label="Talk to our team"
        kind="outlined"
        size="large"
        href="/site/contact"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </CallToAction>
</template>
