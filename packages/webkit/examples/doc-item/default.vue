<script setup>
  import DocItem from '@aziontech/webkit/doc-item'
  import FrameBox from '@aziontech/webkit/frame-box'
  import ItemList from '@aziontech/webkit/item-list'
</script>

<template>
  <FrameBox class="w-full bg-(--bg-surface)">
    <ItemList>
      <DocItem
        title="Edge Functions"
        icon="pi pi-code"
        href="#edge-functions"
      >
        Build serverless applications on Azion's global network. Workloads integrate with functions
        natively, through a binding.
      </DocItem>
      <DocItem
        title="Edge SQL"
        icon="pi pi-database"
        href="#edge-sql"
      >
        Store relational data across the network. A workload reads it from the location that served
        the request.
      </DocItem>
      <DocItem
        title="Edge Cache"
        icon="pi pi-bolt"
        href="#edge-cache"
      >
        Decide what is cached, for how long, and by which key.
      </DocItem>
    </ItemList>
  </FrameBox>
</template>
