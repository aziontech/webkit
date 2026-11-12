# Line figures

> The isometric line-art figures that answer the pointer, one per product.

Pass the name to `LineFigure` (`name`); the label is the figure’s own English description.

25 names. These are the only values the components accept. An unknown or empty name draws nothing. The MCP tool `list_assets({ kind: "lineFigures" })` returns the same list (with a `query` to filter), and `catalog.json#assets.lineFigures` points at it as data.

Used by: [LineFigure](../components/line-figure.md).

## Usage

```vue
<script setup>
  import LineFigure from '@aziontech/webkit/line-figure'
</script>

<template>
  <LineFigure name="cache-ttl" />
</template>
```

## Names

| Name | Description |
| --- | --- |
| `ai-versioning` | Five model versions stacked; the newest is live, and the one under the pointer slides out to be rolled back to. |
| `applications-rules` | A stack of five rule slabs, each with a criteria block and a behaviour block; the slab under the pointer lifts as the match and the rules above it step aside. |
| `azion-404` | Page not found: the Azion mark hovers over its empty slot and never lands. |
| `bot-lineup` | A lineup of visitors, round-headed humans and square-headed bots; the one under the pointer steps forward and says which it is. |
| `build-terminal` | A terminal with six lines of code and a prompt; the line under the pointer lifts off the slab. |
| `cache-ttl` | A grid of cache slots; the pointer warms the ones it touches and each cools down again after its time to live. |
| `certificates-chain` | A root, an intermediate and a leaf certificate stacked on thin posts; the pointer walks the verification mark along the chain and the slabs it passes lift in turn. |
| `connectors-link` | An edge block linked to three origins by dashed lines; the origin under the pointer connects and a packet travels to it. |
| `custom-pages-status` | Four upright error pages in a row; the pointer picks one, which tilts forward and lights up while its neighbours lean away. |
| `ddos-flood` | Traffic piles up under the pointer, but every column is capped; what rises above the line is absorbed. |
| `deployments-release` | Five release slabs along a timeline; the pointer lifts one and the live mark travels to it, promoting or rolling back. |
| `dns-lookup` | A name server tree; pointing at a leaf lifts the lookup path from the root down through its zone, one hop after another. |
| `functions-invoke` | A function block at the back of a pad with five request lanes in front; the lane under the pointer sends its request in and the block lifts to run it. |
| `image-variants` | One photo at four sizes; the variant under the pointer lifts off the pad and says its width. |
| `infra-workloads` | A cluster of nodes, each as tall as its load; a workload hops to the node under the pointer and lands. |
| `lb-rotor` | A rotor with four backend outlets; the arm follows the pointer and snaps onto the nearest outlet. |
| `metrics-gauge` | A gauge whose needle follows the pointer across its scale, lighting the ticks it has passed. |
| `network-lists-gate` | A field of address tiles in front of a gate bar; sweeping the pointer across a tile flips it between allowed and denied, and it stays that way. |
| `object-storage-bucket` | An open bucket tray holding six objects of different sizes; the one under the pointer lifts out and its neighbours settle apart. |
| `observe-stream` | A stream of events on a rail, errors standing taller; hovering slows time and the event under the pointer says what it is. |
| `orchestrator-scale` | Eight node slots on a pad; moving the pointer along it sets how many nodes are provisioned, and they rise in order. |
| `platform-edge` | A user on the ground, five edge nodes and a distant origin; the edge nearest the pointer lifts and serves the request. |
| `secure-shield` | A shield over a matrix of requests; blocked ones stand as blocks, allowed ones lie flat, and the one under the pointer says its verdict. |
| `store-replicas` | A primary database and four empty replica slots; the replica under the pointer fills disc by disc until it is in sync. |
| `variables-keys` | A grid of key blocks, each with a flat masked value beside it; the key under the pointer lights and raises its value. |
