<script setup>
  import Button from '@aziontech/ui/button'
  import Item from '@aziontech/ui/item'
</script>

<template>
  <Item variant="muted">
    <Item.Content>
      <Item.Title>acme-store</Item.Title>
      <Item.Description>Paused by Jane Doe</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Resume"
        variant="outline"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
