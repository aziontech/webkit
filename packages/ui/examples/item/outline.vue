<script setup>
  import Button from '@aziontech/ui/button'
  import Item from '@aziontech/ui/item'
</script>

<template>
  <Item variant="outline">
    <Item.Content>
      <Item.Title>docs-site</Item.Title>
      <Item.Description>Deployed yesterday</Item.Description>
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
