<script setup>
  import Button from '@aziontech/ui/button'
  import Item from '@aziontech/ui/item'
</script>

<template>
  <Item
    variant="outline"
    size="small"
  >
    <Item.Content>
      <Item.Title>site-assets</Item.Title>
      <Item.Description>Deployed from main</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Open"
        variant="outline"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
