<script setup>
  import LinkDirectoryColumn from '@aziontech/webkit/link-directory-column'
  import LinkDirectoryItem from '@aziontech/webkit/link-directory-item'
  import LinkDirectoryRoot from '@aziontech/webkit/link-directory-root'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <LinkDirectoryRoot
      aria-label="Platform, two columns"
      :columns="2"
    >
      <LinkDirectoryColumn title="Compute">
        <LinkDirectoryItem
          icon="az az-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
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
    </LinkDirectoryRoot>

    <LinkDirectoryRoot
      aria-label="Platform, three columns"
      :columns="3"
    >
      <LinkDirectoryColumn title="Compute">
        <LinkDirectoryItem
          icon="az az-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
        />
      </LinkDirectoryColumn>
      <LinkDirectoryColumn title="Data">
        <LinkDirectoryItem
          icon="az az-sql-database"
          title="SQL Database"
          description="Relational database built for distributed applications"
          href="/sql-database"
        />
      </LinkDirectoryColumn>
      <LinkDirectoryColumn title="Security">
        <LinkDirectoryItem
          icon="az az-waf"
          title="WAF"
          description="Block application attacks at the edge"
          href="/waf"
        />
      </LinkDirectoryColumn>
    </LinkDirectoryRoot>

    <LinkDirectoryRoot
      aria-label="Platform, four columns"
      :columns="4"
    >
      <LinkDirectoryColumn title="Compute">
        <LinkDirectoryItem
          icon="az az-functions"
          title="Functions"
          description="Run serverless code closer to users"
          href="/functions"
        />
      </LinkDirectoryColumn>
      <LinkDirectoryColumn title="Data">
        <LinkDirectoryItem
          icon="az az-sql-database"
          title="SQL Database"
          description="Relational database built for distributed applications"
          href="/sql-database"
        />
      </LinkDirectoryColumn>
      <LinkDirectoryColumn title="Security">
        <LinkDirectoryItem
          icon="az az-waf"
          title="WAF"
          description="Block application attacks at the edge"
          href="/waf"
        />
      </LinkDirectoryColumn>
      <LinkDirectoryColumn title="Observe">
        <LinkDirectoryItem
          icon="az az-real-time-metrics"
          title="Real-Time Metrics"
          description="Watch traffic and errors as they happen"
          href="/real-time-metrics"
        />
      </LinkDirectoryColumn>
    </LinkDirectoryRoot>
  </div>
</template>
