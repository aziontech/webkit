<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item kind="outlined">
    <Item.Media>
      <Avatar
        alt="Sam Lee"
        label="SL"
        size="medium"
      />
    </Item.Media>
    <Item.Content>
      <Item.Title>Sam Lee</Item.Title>
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
