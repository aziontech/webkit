<script setup lang="ts">
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'

  interface Props {
    action?: boolean
  }

  withDefaults(defineProps<Props>(), {
    action: false
  })
</script>

<template>
  <Item
    kind="outline"
    size="small"
    aria-hidden="true"
  >
    <Item.Media>
      <Skeleton
        kind="shape"
        width="var(--size-7)"
        height="var(--size-7)"
      />
    </Item.Media>
    <Item.Content>
      <span class="flex h-5 items-center">
        <Skeleton
          height="var(--size-3)"
          width="40%"
        />
      </span>
      <span
        data-slot="item-description"
        class="flex items-center text-body-sm"
      >
        &#8203;<Skeleton
          height="var(--size-3)"
          width="60%"
        />
      </span>
    </Item.Content>
    <Item.Actions v-if="action">
      <Skeleton
        kind="shape"
        width="var(--size-20)"
        height="var(--size-7)"
      />
    </Item.Actions>
  </Item>
</template>
