<script setup>
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item.Group>
    <Item
      kind="inline"
      size="small"
    >
      <Item.Media kind="icon">
        <i
          class="ai ai-domains text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>Customize Domain</Item.Title>
        <Item.Description>Link custom domains and subdomains to Azion.</Item.Description>
      </Item.Content>
      <i
        class="pi pi-arrow-right text-(--text-muted)"
        aria-hidden="true"
      />
    </Item>
    <Item
      kind="inline"
      size="small"
    >
      <Item.Media kind="icon">
        <i
          class="ai ai-network-lists text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>Point Traffic</Item.Title>
        <Item.Description>Redirect domain traffic to Azion.</Item.Description>
      </Item.Content>
      <i
        class="pi pi-arrow-right text-(--text-muted)"
        aria-hidden="true"
      />
    </Item>
    <Item
      kind="inline"
      size="small"
    >
      <Item.Media kind="icon">
        <i
          class="ai ai-real-time-metrics text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>View Analytics</Item.Title>
        <Item.Description>Monitor performance, availability, and security.</Item.Description>
      </Item.Content>
      <i
        class="pi pi-arrow-right text-(--text-muted)"
        aria-hidden="true"
      />
    </Item>
  </Item.Group>
</template>
