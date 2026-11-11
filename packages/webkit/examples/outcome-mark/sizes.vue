<script setup>
  import OutcomeMark from '@aziontech/webkit/outcome-mark'
</script>

<template>
  <ul class="flex flex-col gap-(--spacing-md)">
    <li class="flex items-center gap-(--spacing-xs) text-body-sm text-(--text-default)">
      <OutcomeMark
        size="small"
        aria-label="Done"
      />
      Add a custom domain
    </li>
    <li class="flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)">
      <OutcomeMark aria-label="Deployed" />
      web-app is live in Production
    </li>
    <li class="flex flex-col items-start gap-(--spacing-sm)">
      <OutcomeMark
        size="large"
        aria-label="Deployed"
      />
      <span class="text-heading-sm text-(--text-default)">Service deployed</span>
    </li>
  </ul>
</template>
