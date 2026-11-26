<script setup>
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item.Group>
    <Item
      variant="inline"
      size="small"
    >
      <Item.Media type="icon">
        <i
          class="az az-domains text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>Customize domain</Item.Title>
        <Item.Description>Link custom domains and subdomains to Azion.</Item.Description>
      </Item.Content>
      <i
        class="az az-chevron-right text-(--text-muted)"
        aria-hidden="true"
      />
    </Item>
    <Item
      variant="inline"
      size="small"
    >
      <Item.Media type="icon">
        <i
          class="az az-network-lists text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>Point traffic</Item.Title>
        <Item.Description>Redirect domain traffic to Azion.</Item.Description>
      </Item.Content>
      <i
        class="az az-chevron-right text-(--text-muted)"
        aria-hidden="true"
      />
    </Item>
    <Item
      variant="inline"
      size="small"
    >
      <Item.Media type="icon">
        <i
          class="az az-real-time-metrics text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>View analytics</Item.Title>
        <Item.Description>Monitor performance, availability, and security.</Item.Description>
      </Item.Content>
      <i
        class="az az-chevron-right text-(--text-muted)"
        aria-hidden="true"
      />
    </Item>
  </Item.Group>
</template>
