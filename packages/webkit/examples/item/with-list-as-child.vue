<script setup>
  import Item from '@aziontech/webkit/item'
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    :padded="false"
    class="w-full"
  >
    <template #content>
      <Item.List>
        <Item as-child>
          <a
            href="#"
            class="no-underline text-inherit"
          >
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
          </a>
        </Item>
        <Item as-child>
          <a
            href="#"
            class="no-underline text-inherit"
          >
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
          </a>
        </Item>
        <Item as-child>
          <a
            href="#"
            class="no-underline text-inherit"
          >
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
          </a>
        </Item>
      </Item.List>
    </template>
  </Card>
</template>
