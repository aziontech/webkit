<script setup>
  import CardGridRoot from '@aziontech/webkit/card-grid-root'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTile from '@aziontech/webkit/media-tile'
</script>

<template>
  <div class="flex flex-col gap-8">
    <CardGridRoot
      kind="gap"
      :columns="2"
    >
      <MediaTile
        kind="frame"
        title="Framed."
        description="The frame wraps the media alone, and the caption sits under it on the page column."
      >
        <template #media>
          <Illustration name="ai-applications" />
        </template>
      </MediaTile>
      <MediaTile
        kind="frame"
        title="One frame per tile."
        description="The gutters of the gap register keep every frame its own, marks included."
      >
        <template #media>
          <Illustration name="distributed-apis" />
        </template>
      </MediaTile>
    </CardGridRoot>
    <CardGridRoot
      kind="divider"
      :columns="2"
    >
      <MediaTile
        kind="plain"
        title="Plain."
        description="No rules of its own: the tile is the cell, filled and inset, and the grid draws the seam."
      >
        <template #media>
          <Illustration name="modern-frontends" />
        </template>
      </MediaTile>
      <MediaTile
        kind="plain"
        title="One rule per seam."
        description="The divider register rules every column, so a frame here would double each line."
      >
        <template #media>
          <Illustration name="runtime" />
        </template>
      </MediaTile>
    </CardGridRoot>
  </div>
</template>
