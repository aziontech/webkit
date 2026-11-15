<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'

  const methods = ['github', 'cli', 'scratch']
  const promos = ['catalog', 'agent']
</script>

<template>
  <div
    class="flex flex-col items-start gap-(--spacing-lg)"
    role="status"
    aria-label="Loading resources"
    aria-busy="true"
  >
    <Card
      :padded="false"
      class="w-full"
    >
      <template #content>
        <div
          class="flex flex-col items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-xl)"
        >
          <Skeleton
            width="2.5rem"
            height="2.5rem"
          />
          <Skeleton
            width="14rem"
            height="1.25rem"
          />
          <Skeleton
            width="20rem"
            height="0.875rem"
          />
        </div>

        <div class="border-t border-(--border-muted)">
          <Item.List>
            <Item
              v-for="method in methods"
              :key="method"
            >
              <Item.Media>
                <Skeleton
                  width="2rem"
                  height="2rem"
                />
              </Item.Media>
              <Item.Content>
                <Skeleton
                  width="8rem"
                  height="0.875rem"
                />
                <Skeleton
                  width="16rem"
                  height="0.75rem"
                />
              </Item.Content>
              <Item.Actions>
                <Skeleton
                  width="5rem"
                  height="2rem"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </div>
      </template>
    </Card>

    <div class="grid w-full gap-(--spacing-lg) md:grid-cols-2">
      <Card
        v-for="promo in promos"
        :key="promo"
        class="w-full"
      >
        <template #content>
          <div class="flex flex-col gap-(--spacing-md)">
            <Skeleton
              width="7rem"
              height="2rem"
            />
            <div class="flex flex-col gap-(--spacing-2xs)">
              <Skeleton
                width="12rem"
                height="1rem"
              />
              <Skeleton height="0.875rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
