<script setup>
  import claudeSymbol from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import itauExtendedReversed from '@aziontech/webkit/assets/itau-extended-reversed.webp'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import Logo from '@aziontech/webkit/logo'

  const kinds = [
    { kind: 'color', label: 'Color', fill: 'bg-(--bg-canvas)' },
    { kind: 'monochrome', label: 'Monochrome', fill: 'bg-(--bg-canvas)' },
    { kind: 'current', label: 'Current', fill: 'bg-(--bg-canvas) text-(--text-muted)' },
    { kind: 'knockout', label: 'Knockout', fill: 'bg-(--color-base-white)' }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="row in kinds"
      :key="row.kind"
      class="flex flex-wrap items-center gap-(--spacing-xl) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md)"
      :class="row.fill"
    >
      <span class="w-28 text-label-md text-(--text-muted)">{{ row.label }}</span>
      <Logo
        name="Netshoes"
        :src="netshoesExtendedReversed"
        :src-light="netshoesExtendedColor"
        :kind="row.kind"
        class="max-w-32"
      />
      <Logo
        name="Itaú"
        :src="itauExtendedReversed"
        artwork="light"
        :kind="row.kind"
        class="max-w-32"
      />
      <Logo
        name="Claude"
        :src="claudeSymbol"
        :kind="row.kind"
      />
      <Logo
        name="Acme Inc."
        :kind="row.kind"
      />
    </div>
  </div>
</template>
