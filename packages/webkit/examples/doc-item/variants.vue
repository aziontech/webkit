<script setup>
  import DocItem from '@aziontech/webkit/doc-item'
  import FrameBox from '@aziontech/webkit/frame-box'
  import ItemList from '@aziontech/webkit/item-list'
</script>

<template>
  <FrameBox class="w-full bg-(--bg-surface)">
    <ItemList>
      <DocItem
        title="Community templates"
        icon="pi pi-github"
        href="https://github.com/aziontech"
        target="_blank"
      >
        A row that leaves the documentation trades the chevron for a diagonal arrow.
      </DocItem>
      <DocItem
        title="Rule"
        icon="pi pi-filter"
      >
        With no href the row is inert — no hover, no anchor, no trailing arrow.
      </DocItem>
      <DocItem title="Binding">
        The glyph is optional too: a named connection from a function to the resource it reads.
      </DocItem>
    </ItemList>
  </FrameBox>
</template>
