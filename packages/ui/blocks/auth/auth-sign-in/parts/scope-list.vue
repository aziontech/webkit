<script setup lang="ts">
  import Item from '@aziontech/ui/item'

  /** One permission the app asks for. */
  export interface AuthScope {
    /** The scope id. */
    id: string
    /** The icon class of the scope. */
    icon: string
    /** What the scope allows. */
    title: string
    /** The detail of what the scope allows. */
    description: string
  }

  export interface ScopeListProps {
    /** The id of the list heading. */
    headingId: string
    /** The name of the app that asks. */
    client: string
    /** The permissions the app asks for. */
    scopes: AuthScope[]
  }

  defineProps<ScopeListProps>()
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xs)">
    <h2
      :id="headingId"
      class="text-label-md text-(--text-muted)"
    >
      {{ client }} will be able to
    </h2>
    <Item.List :aria-labelledby="headingId">
      <Item
        v-for="scope in scopes"
        :key="scope.id"
        size="small"
        role="listitem"
      >
        <Item.Media type="icon">
          <i
            :class="scope.icon"
            aria-hidden="true"
          />
        </Item.Media>
        <Item.Content>
          <Item.Title>{{ scope.title }}</Item.Title>
          <Item.Description>{{ scope.description }}</Item.Description>
        </Item.Content>
      </Item>
    </Item.List>
  </div>
</template>
