<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Card
    :padded="false"
    class="w-full"
  >
    <template #default>
      <Item.List>
        <Item>
          <Item.Media type="icon">
            <i
              class="az az-applications text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>Basic Item</Item.Title>
            <Item.Description>A simple item with title and description.</Item.Description>
          </Item.Content>
          <Item.Actions>
            <Button
              label="Action"
              variant="outline"
              size="small"
            />
          </Item.Actions>
        </Item>
        <Item>
          <Item.Media type="icon">
            <i
              class="az az-applications text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>Basic Item</Item.Title>
            <Item.Description>A simple item with title and description.</Item.Description>
          </Item.Content>
          <Item.Actions>
            <Button
              label="Action"
              variant="outline"
              size="small"
            />
          </Item.Actions>
        </Item>
        <Item>
          <Item.Media type="icon">
            <i
              class="az az-applications text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>Basic Item</Item.Title>
            <Item.Description>A simple item with title and description.</Item.Description>
          </Item.Content>
          <Item.Actions>
            <Button
              label="Action"
              variant="outline"
              size="small"
            />
          </Item.Actions>
        </Item>
      </Item.List>
    </template>
  </Card>
</template>
