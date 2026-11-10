<script setup>
  import Item from '@aziontech/webkit/item'
  import CardBox from '@aziontech/webkit/card-box'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <CardBox
    :padded="false"
    class="w-full"
  >
    <template #content>
      <Item.List>
        <Item>
          <Item.Media kind="icon">
            <i
              class="ai ai-edge-application text-[length:inherit] leading-none"
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
              kind="outlined"
              size="small"
            />
          </Item.Actions>
        </Item>
        <Item>
          <Item.Media kind="icon">
            <i
              class="ai ai-edge-application text-[length:inherit] leading-none"
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
              kind="outlined"
              size="small"
            />
          </Item.Actions>
        </Item>
        <Item>
          <Item.Media kind="icon">
            <i
              class="ai ai-edge-application text-[length:inherit] leading-none"
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
              kind="outlined"
              size="small"
            />
          </Item.Actions>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</template>
