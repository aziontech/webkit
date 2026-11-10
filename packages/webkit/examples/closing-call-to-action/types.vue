<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ClosingCallToAction
      kind="split"
      anchor="contact"
      eyebrow="Build"
      title="Build once."
      title-muted="Run everywhere."
      description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      :primary-action="{
        label: 'Start for free',
        href: 'https://console.azion.com/signup?tck=build_cta'
      }"
      :secondary-action="{
        label: 'Talk to a specialist',
        href: 'https://www.azion.com/en/contact/',
        trailing: true
      }"
    />
    <ClosingCallToAction
      kind="panel"
      title="Ready to join us?"
      description="See our open positions and find the right fit."
      :primary-action="{ label: 'See open roles', href: '/en/careers/jobs/', trailing: true }"
    />
    <ClosingCallToAction
      kind="primary"
      title="Build, run, and protect applications everywhere."
      description="Get faster launches, lower latency, and less infrastructure overhead from day one."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    />
  </div>
</template>
