<script setup>
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import ColumnNavigationColumn from '@aziontech/webkit/column-navigation-column'
  import ColumnNavigationItem from '@aziontech/webkit/column-navigation-item'
</script>

<template>
  <ColumnNavigation
    aria-label="Platform"
    :columns="4"
  >
    <ColumnNavigationColumn title="Compute">
      <ColumnNavigationItem
        icon="ai ai-edge-functions"
        title="Functions"
        description="Run serverless code closer to users"
        href="/functions"
      />
      <ColumnNavigationItem
        icon="ai ai-edge-orchestrator"
        title="Rules Engine"
        description="Automate request handling with programmable rules"
        href="/rules-engine"
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
        icon="ai ai-edge-storage"
        title="Object Storage"
        description="Scalable, durable storage for unstructured data"
        href="/object-storage"
      />
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
    <ColumnNavigationColumn title="Security">
      <ColumnNavigationItem
        icon="ai ai-waf-rules"
        title="WAF"
        description="Block application attacks at the edge"
        href="/waf"
      />
      <ColumnNavigationItem
        icon="ai ai-network-lists"
        title="Network Shield"
        description="Absorb volumetric and protocol attacks"
        href="/network-shield"
      />
      <ColumnNavigationItem
        icon="ai ai-edge-dns"
        title="Edge DNS"
        description="Authoritative DNS answered from every location"
        href="/edge-dns"
      />
    </ColumnNavigationColumn>
    <ColumnNavigationColumn title="Observe">
      <ColumnNavigationItem
        icon="ai ai-real-time-metrics"
        title="Real-Time Metrics"
        description="Watch traffic and errors as they happen"
        href="/real-time-metrics"
      />
      <ColumnNavigationItem
        icon="ai ai-data-stream"
        title="Data Stream"
        description="Ship events to the tools you already run"
        href="/data-stream"
      />
      <ColumnNavigationItem
        icon="ai ai-real-time-events"
        title="Real-Time Events"
        description="Query every request without sampling"
        href="/real-time-events"
      />
    </ColumnNavigationColumn>
  </ColumnNavigation>
</template>
