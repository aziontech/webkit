<script setup>
  import LinkDirectoryColumn from '@aziontech/webkit/link-directory-column'
  import LinkDirectoryItem from '@aziontech/webkit/link-directory-item'
  import LinkDirectoryRoot from '@aziontech/webkit/link-directory-root'
</script>

<template>
  <LinkDirectoryRoot
    aria-label="Platform"
    :columns="4"
  >
    <LinkDirectoryColumn title="Compute">
      <LinkDirectoryItem
        icon="az az-functions"
        title="Functions"
        description="Run serverless code closer to users"
        href="/functions"
      />
      <LinkDirectoryItem
        icon="az az-edge-orchestrator"
        title="Rules Engine"
        description="Automate request handling with programmable rules"
        href="/rules-engine"
      />
      <LinkDirectoryItem
        icon="az az-load-balancer"
        title="Load Balancer"
        description="Distribute traffic for performance and availability"
        href="/load-balancer"
      />
    </LinkDirectoryColumn>
    <LinkDirectoryColumn title="Data">
      <LinkDirectoryItem
        icon="az az-object-storage"
        title="Object Storage"
        description="Scalable, durable storage for unstructured data"
        href="/object-storage"
      />
      <LinkDirectoryItem
        icon="az az-sql-database"
        title="SQL Database"
        description="Relational database built for distributed applications"
        href="/sql-database"
      />
      <LinkDirectoryItem
        icon="az az-layers"
        title="Cache"
        description="Accelerate content delivery and reduce origin load"
        href="/cache"
      />
    </LinkDirectoryColumn>
    <LinkDirectoryColumn title="Security">
      <LinkDirectoryItem
        icon="az az-waf"
        title="WAF"
        description="Block application attacks at the edge"
        href="/waf"
      />
      <LinkDirectoryItem
        icon="az az-network-lists"
        title="Network Shield"
        description="Absorb volumetric and protocol attacks"
        href="/network-shield"
      />
      <LinkDirectoryItem
        icon="az az-edge-dns"
        title="Edge DNS"
        description="Authoritative DNS answered from every location"
        href="/edge-dns"
      />
    </LinkDirectoryColumn>
    <LinkDirectoryColumn title="Observe">
      <LinkDirectoryItem
        icon="az az-real-time-metrics"
        title="Real-Time Metrics"
        description="Watch traffic and errors as they happen"
        href="/real-time-metrics"
      />
      <LinkDirectoryItem
        icon="az az-data-stream"
        title="Data Stream"
        description="Ship events to the tools you already run"
        href="/data-stream"
      />
      <LinkDirectoryItem
        icon="az az-real-time-events"
        title="Real-Time Events"
        description="Query every request without sampling"
        href="/real-time-events"
      />
    </LinkDirectoryColumn>
  </LinkDirectoryRoot>
</template>
