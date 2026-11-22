<script setup>
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import Button from '@aziontech/webkit/button'
  import Table from '@aziontech/webkit/table'
  import { onBeforeUnmount, ref } from 'vue'

  const rows = [
    { country: 'United States', requests: '1,204,330', hit: '92%' },
    { country: 'United Kingdom', requests: '884,102', hit: '89%' },
    { country: 'Portugal', requests: '120,448', hit: '95%' }
  ]
  const streaming = ref(false)
  let timer = 0

  const regenerate = () => {
    streaming.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      streaming.value = false
    }, 1500)
  }
  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-sm)">
    <div
      class="h-(--container-3xs) overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <ArtifactCanvas
        title="cache-hits-by-country.csv"
        meta="Last 7 days · 3 rows"
        type="table"
        :streaming="streaming"
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
      </ArtifactCanvas>
    </div>
    <Button
      class="self-start"
      label="Regenerate"
      variant="outline"
      size="small"
      icon="az az-refresh"
      :loading="streaming"
      @click="regenerate"
    />
  </div>
</template>
