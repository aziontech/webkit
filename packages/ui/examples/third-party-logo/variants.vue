<script setup>
  import claudeSymbol from '@aziontech/ui/assets/claude-symbol-color.svg'
  import itauExtendedReversed from '@aziontech/ui/assets/itau-extended-reversed.webp'
  import netshoesExtendedColor from '@aziontech/ui/assets/netshoes-extended-color.svg'
  import netshoesExtendedReversed from '@aziontech/ui/assets/netshoes-extended-reversed.svg'
  import ThirdPartyLogo from '@aziontech/ui/third-party-logo'

  const variants = [
    { variant: 'color', label: 'Color', fill: 'bg-(--bg-canvas)', ink: 'text-(--text-muted)' },
    {
      variant: 'monochrome',
      label: 'Monochrome',
      fill: 'bg-(--bg-canvas)',
      ink: 'text-(--text-muted)'
    },
    {
      variant: 'current',
      label: 'Current',
      fill: 'bg-(--bg-canvas) text-(--text-muted)',
      ink: 'text-(--text-muted)'
    },
    {
      variant: 'knockout',
      label: 'Knockout',
      fill: 'bg-(--primary)',
      ink: 'text-(--primary-foreground)'
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="row in variants"
      :key="row.variant"
      class="flex flex-wrap items-center gap-(--spacing-xl) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md)"
      :class="row.fill"
    >
      <span
        class="w-28 text-label-md"
        :class="row.ink"
        >{{ row.label }}</span
      >
      <ThirdPartyLogo
        name="Netshoes"
        :src="netshoesExtendedReversed"
        :src-light="netshoesExtendedColor"
        :variant="row.variant"
        class="max-w-32"
      />
      <ThirdPartyLogo
        name="Itaú"
        :src="itauExtendedReversed"
        artwork="light"
        :variant="row.variant"
        class="max-w-32"
      />
      <ThirdPartyLogo
        name="Claude"
        :src="claudeSymbol"
        :variant="row.variant"
      />
      <ThirdPartyLogo
        name="Acme Inc."
        :variant="row.variant"
      />
    </div>
  </div>
</template>
