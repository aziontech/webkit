<script setup>
  import DocItem from '@aziontech/webkit/doc-item'
  import ItemList from '@aziontech/webkit/item-list'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <RegistrationFrame class="w-full bg-(--bg-surface)">
    <ItemList>
      <DocItem
        title="Functions"
        icon="az az-code"
        href="#edge-functions"
      >
        Build serverless applications on Azion's global network. Workloads integrate with functions
        natively, through a binding.
      </DocItem>
      <DocItem
        title="SQL Database"
        icon="az az-database"
        href="#edge-sql"
      >
        Store relational data across the network. A workload reads it from the location that served
        the request.
      </DocItem>
      <DocItem
        title="Cache"
        icon="az az-bolt"
        href="#edge-cache"
      >
        Decide what is cached, for how long, and by which key.
      </DocItem>
    </ItemList>
  </RegistrationFrame>
</template>
