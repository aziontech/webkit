<script setup>
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
</script>

<template>
  <Card
    :padded="false"
    class="w-full"
  >
    <template #default>
      <Item.List>
        <Item>
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
          <Item.Actions>
            <Button
              label="Open"
              variant="outline"
              size="small"
            />
          </Item.Actions>
        </Item>
        <Item>
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
          <Item.Actions>
            <Button
              label="Open"
              variant="outline"
              size="small"
            />
          </Item.Actions>
        </Item>
        <Item>
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
          <Item.Actions>
            <Button
              label="Open"
              variant="outline"
              size="small"
            />
          </Item.Actions>
        </Item>
      </Item.List>
    </template>
  </Card>
</template>
