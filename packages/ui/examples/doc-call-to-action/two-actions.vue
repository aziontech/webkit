<script setup>
  import DocCallToAction from '@aziontech/ui/doc-call-to-action'
</script>

<template>
  <div class="max-w-56">
    <DocCallToAction
      title="Running at scale?"
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Talk to sales', href: '/contact' }"
    >
      Plans with support and volume pricing.
    </DocCallToAction>
  </div>
</template>
