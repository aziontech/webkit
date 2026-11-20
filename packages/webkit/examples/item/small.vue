<script setup>
  import Button from '@aziontech/webkit/button'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item
    variant="outline"
    size="small"
  >
    <Item.Content>
      <Item.Title>Basic Item</Item.Title>
      <Item.Description>A simple item with title and description.</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Action"
        variant="outline"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
