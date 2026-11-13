<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Card
    :padded="false"
    class="w-full"
  >
    <template #content>
      <Item.List>
        <Item href="#">
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
          <i
            class="pi pi-arrow-right text-(--text-muted)"
            aria-hidden="true"
          />
        </Item>
        <Item href="#">
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
          <i
            class="pi pi-arrow-right text-(--text-muted)"
            aria-hidden="true"
          />
        </Item>
        <Item href="#">
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
          <i
            class="pi pi-arrow-right text-(--text-muted)"
            aria-hidden="true"
          />
        </Item>
      </Item.List>
    </template>
  </Card>
</template>
