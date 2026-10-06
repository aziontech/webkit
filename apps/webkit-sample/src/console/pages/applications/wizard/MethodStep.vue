<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'

  import { APPLICATION_METHODS } from '../../../lib/data/application-flows'

  defineEmits<{
    select: [value: unknown]
  }>()
</script>

<template>
  <CardBox
    :padded="false"
    title="How do you want to start?"
  >
    <template #content>
      <Item.List>
        <Item
          v-for="method in APPLICATION_METHODS"
          :key="method.id"
          as-child
          size="small"
        >
          <button
            type="button"
            class="w-full text-left"
            @click="$emit('select', method.id)"
          >
            <Item.Media>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="method.icon"
                  class="text-body-md leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ method.title }}</Item.Title>
              <Item.Description>{{ method.description }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <i
                class="pi pi-chevron-right text-(--text-muted)"
                aria-hidden="true"
              />
            </Item.Actions>
          </button>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</template>
