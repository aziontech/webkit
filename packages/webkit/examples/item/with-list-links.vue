<script setup>
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
        <Item href="#">
          <Item.Media type="icon">
            <i
              class="az az-applications text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>storefront-prod</Item.Title>
            <Item.Description>Deployed from main</Item.Description>
          </Item.Content>
          <i
            class="az az-arrow-right text-(--text-muted)"
            aria-hidden="true"
          />
        </Item>
        <Item href="#">
          <Item.Media type="icon">
            <i
              class="az az-applications text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>docs-site</Item.Title>
            <Item.Description>Deployed yesterday</Item.Description>
          </Item.Content>
          <i
            class="az az-arrow-right text-(--text-muted)"
            aria-hidden="true"
          />
        </Item>
        <Item href="#">
          <Item.Media type="icon">
            <i
              class="az az-applications text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>acme-store</Item.Title>
            <Item.Description>Paused by Jane Doe</Item.Description>
          </Item.Content>
          <i
            class="az az-arrow-right text-(--text-muted)"
            aria-hidden="true"
          />
        </Item>
      </Item.List>
    </template>
  </Card>
</template>
