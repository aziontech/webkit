<script setup>
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item kind="outline">
    <Item.Media kind="image">
      <img
        src="https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?w=64&h=64&fit=crop"
        alt="Midnight City Lights"
        class="object-cover size-10 grayscale rounded-(--shape-card)"
      />
    </Item.Media>
    <Item.Content>
      <Item.Title>Midnight City Lights</Item.Title>
      <Item.Description>Neon Dreams · Electric Nights</Item.Description>
    </Item.Content>
    <Item.Content class="flex-none text-center">
      <Item.Description>3:45</Item.Description>
    </Item.Content>
  </Item>
</template>
