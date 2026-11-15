<script setup>
  import Button from '@aziontech/webkit/button'
  import CardList from '@aziontech/webkit/card-list'
  import EmptyState from '@aziontech/webkit/empty-state'
</script>

<template>
  <CardList :items="[]">
    <template #empty>
      <EmptyState
        size="small"
        icon="pi pi-th-large"
        title="No applications yet"
        description="Create an application to serve your site from the edge."
      >
        <template #actions>
          <Button
            label="Create application"
            size="small"
            icon="pi pi-plus"
          />
        </template>
      </EmptyState>
    </template>
  </CardList>
</template>
