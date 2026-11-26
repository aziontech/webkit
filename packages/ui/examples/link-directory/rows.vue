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
        icon="az az-functions"
        title="Functions"
        description="Run serverless code closer to users"
        href="/functions"
      />
      <LinkDirectoryItem
        icon="az az-sql-database"
        title="SQL Database"
        href="/sql-database"
      />
    </LinkDirectoryColumn>
    <LinkDirectoryColumn title="On the way">
      <LinkDirectoryItem
        icon="az az-ai-inference"
        title="AI Inference"
        description="Run AI models closer to users"
      />
      <LinkDirectoryItem
        icon="az az-ai-gateway"
        title="AI Gateway"
        description="Secure, manage, and optimize AI traffic"
      />
    </LinkDirectoryColumn>
  </LinkDirectoryRoot>
</template>
