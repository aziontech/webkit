<script setup>
  import ToolApproval from '@aziontech/webkit/tool-approval'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <ToolApproval
      title="Allow `purge_urls`?"
      description="Purges https://www.example.com/styles.css from every data center."
      status="approved"
    />
    <ToolApproval
      title="Approve deployment to production?"
      description="Deploys the current build of storefront to production."
      status="denied"
    />
    <ToolApproval
      title="Allow `delete_cache_rule`?"
      description="Removes the rule that caches images for one day."
      status="expired"
    />
  </div>
</template>
