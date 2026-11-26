<script setup>
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-4)">
    <Item
      variant="outline"
      href="#"
    >
      <Item.Content>
        <Item.Title>Visit our documentation</Item.Title>
        <Item.Description>Learn how to get started with our components.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <i
          class="az az-chevron-right text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Actions>
    </Item>
    <Item
      variant="outline"
      size="small"
      href="#"
    >
      <Item.Media type="icon">
        <i
          class="az az-verified text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>Your profile has been verified.</Item.Title>
      </Item.Content>
      <Item.Actions>
        <i
          class="az az-chevron-right text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Actions>
    </Item>
  </div>
</template>
