<script setup>
  import Item from '@aziontech/webkit/item'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Item kind="outline">
    <Item.Media>
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
        alt="Evil Rabbit"
        label="ER"
        size="medium"
      />
    </Item.Media>
    <Item.Content>
      <Item.Title>Evil Rabbit</Item.Title>
      <Item.Description>Last seen 5 months ago</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Invite"
        kind="outlined"
        size="small"
        icon="pi pi-plus"
      />
    </Item.Actions>
  </Item>
</template>
