<script setup>
  import Item from '@aziontech/webkit/item'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Item kind="outline">
    <Item.Content>
      <Item.Title>Basic Item</Item.Title>
      <Item.Description>A simple item with title and description.</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Action"
        kind="outlined"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
