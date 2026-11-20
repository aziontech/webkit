<script setup>
  import DocItem from '@aziontech/webkit/doc-item'
  import ItemList from '@aziontech/webkit/item-list'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <RegistrationFrame class="w-full bg-(--bg-surface)">
    <ItemList>
      <DocItem
        title="Community templates"
        icon="az az-github"
        href="https://github.com/aziontech"
        target="_blank"
      >
        A row that leaves the documentation trades the chevron for a diagonal arrow.
      </DocItem>
      <DocItem
        title="Rule"
        icon="az az-filter"
      >
        With no href the row is inert — no hover, no anchor, no trailing arrow.
      </DocItem>
      <DocItem title="Binding">
        The glyph is optional too: a named connection from a function to the resource it reads.
      </DocItem>
    </ItemList>
  </RegistrationFrame>
</template>
