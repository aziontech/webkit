<script setup>
  import LinkDirectoryColumn from '@aziontech/webkit/link-directory-column'
  import LinkDirectoryItem from '@aziontech/webkit/link-directory-item'
  import LinkDirectoryRoot from '@aziontech/webkit/link-directory-root'
</script>

<template>
  <LinkDirectoryRoot
    aria-label="Row states"
    :columns="2"
  >
    <LinkDirectoryColumn title="Available now">
      <LinkDirectoryItem
        icon="ai ai-edge-functions"
        title="Functions"
        description="Run serverless code closer to users"
        href="/functions"
      />
      <LinkDirectoryItem
        icon="ai ai-edge-sql"
        title="SQL Database"
        href="/sql-database"
      />
    </LinkDirectoryColumn>
    <LinkDirectoryColumn title="On the way">
      <LinkDirectoryItem
        icon="ai ai-edge-ai"
        title="AI Inference"
        description="Run AI models closer to users"
      />
      <LinkDirectoryItem
        icon="ai ai-gateway"
        title="AI Gateway"
        description="Secure, manage, and optimize AI traffic"
      />
    </LinkDirectoryColumn>
  </LinkDirectoryRoot>
</template>
