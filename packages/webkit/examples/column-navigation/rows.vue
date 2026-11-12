<script setup>
  import ColumnNavigationRoot from '@aziontech/webkit/column-navigation-root'
  import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'
  import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'
</script>

<template>
  <ColumnNavigationRoot
    aria-label="Row states"
    :columns="2"
  >
    <ColumnNavigationColumn title="Available now">
      <ColumnNavigationItem
        icon="ai ai-edge-functions"
        title="Functions"
        description="Run serverless code closer to users"
        href="/functions"
      />
      <ColumnNavigationItem
        icon="ai ai-edge-sql"
        title="SQL Database"
        href="/sql-database"
      />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="On the way">
      <ColumnNavigationItem
        icon="ai ai-edge-ai"
        title="AI Inference"
        description="Run AI models closer to users"
      />
      <ColumnNavigationItem
        icon="ai ai-gateway"
        title="AI Gateway"
        description="Secure, manage, and optimize AI traffic"
      />
    </ColumnNavigationColumn>
  </ColumnNavigationRoot>
</template>
