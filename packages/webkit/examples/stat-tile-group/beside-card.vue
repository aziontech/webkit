<script setup>
  import Card from '@aziontech/webkit/card'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
</script>

<template>
  <div class="@container w-full">
    <div class="grid gap-(--layout-group-gap) @3xl:grid-cols-[2fr_1fr]">
      <StatTileGroup aria-label="Usage">
        <StatTile
          label="Data transferred"
          :value="842"
          unit="GB"
          :delta="12.4"
        />
        <StatTile
          label="Requests / second"
          :value="1240"
          unit="/s"
          :delta="3.8"
        />
        <StatTile
          label="Bandwidth saving"
          :value="588"
          unit="GB"
          :delta="6.2"
        />
        <StatTile
          label="Data offload"
          :value="70"
          unit="%"
          :delta="-1.5"
          inverse
        />
      </StatTileGroup>
      <Card title="Next steps">
        <template #content>
          <ul
            class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm text-(--text-muted)"
          >
            <li>Add a custom domain to the workload.</li>
            <li>Turn on the web application firewall.</li>
            <li>Invite a teammate to the account.</li>
            <li>Set a usage alert for data transferred.</li>
            <li>Connect a repository to deploy on push.</li>
            <li>Review the cache settings of the application.</li>
          </ul>
        </template>
      </Card>
    </div>
  </div>
</template>
