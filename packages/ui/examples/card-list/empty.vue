<script setup>
  import Button from '@aziontech/ui/button'
  import CardList from '@aziontech/ui/card-list'
  import EmptyState from '@aziontech/ui/empty-state'
</script>

<template>
  <CardList :items="[]">
    <template #empty>
      <EmptyState
        size="small"
        icon="az az-layout-grid"
        title="No applications yet"
        description="Create an application to serve your site from the edge."
      >
        <template #actions>
          <Button
            label="Create application"
            size="small"
            icon="az az-plus"
          />
        </template>
      </EmptyState>
    </template>
  </CardList>
</template>
