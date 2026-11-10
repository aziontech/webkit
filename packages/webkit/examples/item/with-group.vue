<script setup>
  import Item from '@aziontech/webkit/item'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Item.Group>
    <Item>
      <Item.Media>
        <Avatar
          src="https://github.com/shadcn.png"
          alt="shadcn"
          label="S"
          size="medium"
        />
      </Item.Media>
      <Item.Content class="gap-(--spacing-1)">
        <Item.Title>shadcn</Item.Title>
        <Item.Description>shadcn@vercel.com</Item.Description>
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
          src="https://github.com/maxleiter.png"
          alt="maxleiter"
          label="M"
          size="medium"
        />
      </Item.Media>
      <Item.Content class="gap-(--spacing-1)">
        <Item.Title>maxleiter</Item.Title>
        <Item.Description>maxleiter@vercel.com</Item.Description>
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
          src="https://github.com/evilrabbit.png"
          alt="evilrabbit"
          label="E"
          size="medium"
        />
      </Item.Media>
      <Item.Content class="gap-(--spacing-1)">
        <Item.Title>evilrabbit</Item.Title>
        <Item.Description>evilrabbit@vercel.com</Item.Description>
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
