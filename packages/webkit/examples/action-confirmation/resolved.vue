<script setup>
  import ActionConfirmation from '@aziontech/webkit/action-confirmation'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <ActionConfirmation
      title="Allow `purge_urls`?"
      description="Purges https://www.example.com/styles.css from every edge location."
      state="approved"
    />
    <ActionConfirmation
      title="Approve deployment to production?"
      description="Deploys the current build of storefront to production."
      state="denied"
    />
    <ActionConfirmation
      title="Allow `delete_cache_rule`?"
      description="Removes the rule that caches images for one day."
      state="expired"
    />
  </div>
</template>
