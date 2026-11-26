<script setup>
  import ArtifactPreview from '@aziontech/ui/artifact-preview'
  import Table from '@aziontech/ui/table'

  const rows = [
    { country: 'United States', requests: '1,204,330', hit: '92%' },
    { country: 'United Kingdom', requests: '884,102', hit: '89%' },
    { country: 'Portugal', requests: '120,448', hit: '95%' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ArtifactPreview
      title="cache-hits-by-country.csv"
      description="Last 7 days"
      meta="48 KB · 212 rows"
      icon="az az-table"
      download-href="data:text/csv;charset=utf-8,country,requests,hit"
    >
      <Table density="compact">
        <Table.Header>
          <Table.Row>
            <Table.HeadCell principal>Country</Table.HeadCell>
            <Table.HeadCell align="end">Requests</Table.HeadCell>
            <Table.HeadCell align="end">Hit ratio</Table.HeadCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row
            v-for="row in rows"
            :key="row.country"
          >
            <Table.Cell principal>{{ row.country }}</Table.Cell>
            <Table.Cell align="end"
              ><span class="tabular-nums">{{ row.requests }}</span></Table.Cell
            >
            <Table.Cell align="end"
              ><span class="tabular-nums">{{ row.hit }}</span></Table.Cell
            >
          </Table.Row>
        </Table.Body>
      </Table>
    </ArtifactPreview>
  </div>
</template>
