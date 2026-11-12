<script setup>
  import Button from '@aziontech/webkit/button'
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div class="rounded-(--shape-card) border border-(--border-default)">
      <TopologyDiagram />
    </div>
    <div class="rounded-(--shape-card) border border-(--border-default)">
      <TopologyDiagram aria-label="web-app topology">
        <template #empty>
          <div class="flex flex-col items-start gap-(--spacing-sm)">
            <p>web-app serves no resources yet. Deploy it to build its topology.</p>
            <Button
              label="Deploy"
              kind="outlined"
              size="small"
            />
          </div>
        </template>
      </TopologyDiagram>
    </div>
  </div>
</template>
