<script setup>
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-4)">
    <Item
      kind="outlined"
      as-child
    >
      <a
        href="#"
        class="no-underline text-inherit"
      >
        <Item.Content>
          <Item.Title>Visit our documentation</Item.Title>
          <Item.Description>Learn how to get started with our components.</Item.Description>
        </Item.Content>
        <Item.Actions>
          <i
            class="ai ai-angle-right text-[length:inherit] leading-none"
            aria-hidden="true"
          />
        </Item.Actions>
      </a>
    </Item>
    <Item
      kind="outlined"
      size="small"
      as-child
    >
      <a
        href="#"
        class="no-underline text-inherit"
      >
        <Item.Media kind="icon">
          <i
            class="pi pi-verified text-[length:inherit] leading-none"
            aria-hidden="true"
          />
        </Item.Media>
        <Item.Content>
          <Item.Title>Your profile has been verified.</Item.Title>
        </Item.Content>
        <Item.Actions>
          <i
            class="ai ai-angle-right text-[length:inherit] leading-none"
            aria-hidden="true"
          />
        </Item.Actions>
      </a>
    </Item>
  </div>
</template>
