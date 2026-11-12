<script setup>
  import Button from '@aziontech/webkit/button'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item kind="outlined">
    <Item.Media kind="icon">
      <i
        class="ai ai-edge-firewall text-[length:inherit] leading-none"
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
        kind="outlined"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
