<script setup>
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item kind="outlined">
    <Item.Media kind="image">
      <img
        :src="placeholderImage"
        alt="Midnight City Lights"
        class="object-cover size-10 grayscale rounded-(--shape-card)"
      />
    </Item.Media>
    <Item.Content>
      <Item.Title>Midnight City Lights</Item.Title>
      <Item.Description>Neon Dreams · Electric Nights</Item.Description>
    </Item.Content>
    <Item.Content>
      <Item.Description>3:45</Item.Description>
    </Item.Content>
  </Item>
</template>
