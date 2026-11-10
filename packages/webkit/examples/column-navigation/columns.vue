<script setup>
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'
  import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ColumnNavigation
      aria-label="Platform, two columns"
      :columns="2"
    >
      <ColumnNavigationColumn title="Compute">
        <ColumnNavigationItem
          icon="ai ai-edge-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
        />
        <ColumnNavigationItem
          icon="ai ai-load-balancer"
          title="Load Balancer"
          description="Distribute traffic for performance and availability"
          href="/load-balancer"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Data">
        <ColumnNavigationItem
          icon="ai ai-edge-sql"
          title="SQL Database"
          description="Relational database built for distributed applications"
          href="/sql-database"
        />
        <ColumnNavigationItem
          icon="ai ai-tiered-cache"
          title="Cache"
          description="Accelerate content delivery and reduce origin load"
          href="/cache"
        />
      </ColumnNavigationColumn>
    </ColumnNavigation>

    <ColumnNavigation
      aria-label="Platform, three columns"
      :columns="3"
    >
      <ColumnNavigationColumn title="Compute">
        <ColumnNavigationItem
          icon="ai ai-edge-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Data">
        <ColumnNavigationItem
          icon="ai ai-edge-sql"
          title="SQL Database"
          description="Relational database built for distributed applications"
          href="/sql-database"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Security">
        <ColumnNavigationItem
          icon="ai ai-waf-rules"
          title="WAF"
          description="Block application attacks at the edge"
          href="/waf"
        />
      </ColumnNavigationColumn>
    </ColumnNavigation>

    <ColumnNavigation
      aria-label="Platform, four columns"
      :columns="4"
    >
      <ColumnNavigationColumn title="Compute">
        <ColumnNavigationItem
          icon="ai ai-edge-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Data">
        <ColumnNavigationItem
          icon="ai ai-edge-sql"
          title="SQL Database"
          description="Relational database built for distributed applications"
          href="/sql-database"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Security">
        <ColumnNavigationItem
          icon="ai ai-waf-rules"
          title="WAF"
          description="Block application attacks at the edge"
          href="/waf"
        />
      </ColumnNavigationColumn>
      <ColumnNavigationColumn title="Observe">
        <ColumnNavigationItem
          icon="ai ai-real-time-metrics"
          title="Real-Time Metrics"
          description="Watch traffic and errors as they happen"
          href="/real-time-metrics"
        />
      </ColumnNavigationColumn>
    </ColumnNavigation>
  </div>
</template>
