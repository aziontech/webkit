<script setup>
  import Button from '@aziontech/webkit/button'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item>
    <Item.Content>
      <Item.Title>storefront-prod</Item.Title>
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
