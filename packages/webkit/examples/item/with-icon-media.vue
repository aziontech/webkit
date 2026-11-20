<script setup>
  import Button from '@aziontech/webkit/button'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item variant="outline">
    <Item.Media type="icon">
      <i
        class="az az-firewall text-[length:inherit] leading-none"
        aria-hidden="true"
      />
    </Item.Media>
    <Item.Content>
      <Item.Title>Security Alert</Item.Title>
      <Item.Description>New login detected from unknown device.</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Review"
        variant="outline"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
