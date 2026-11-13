<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item.Group>
    <Item>
      <Item.Media>
        <Avatar
          alt="Jane Doe"
          label="JD"
          size="medium"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>Jane Doe</Item.Title>
        <Item.Description>jane.doe@example.com</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button
          label="Add"
          kind="transparent"
          size="small"
          icon="pi pi-plus"
        />
      </Item.Actions>
    </Item>
    <Item>
      <Item.Media>
        <Avatar
          alt="John Smith"
          label="JS"
          size="medium"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>John Smith</Item.Title>
        <Item.Description>john.smith@example.com</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button
          label="Add"
          kind="transparent"
          size="small"
          icon="pi pi-plus"
        />
      </Item.Actions>
    </Item>
    <Item>
      <Item.Media>
        <Avatar
          alt="Priya Patel"
          label="PP"
          size="medium"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>Priya Patel</Item.Title>
        <Item.Description>priya.patel@example.com</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button
          label="Add"
          kind="transparent"
          size="small"
          icon="pi pi-plus"
        />
      </Item.Actions>
    </Item>
  </Item.Group>
</template>
