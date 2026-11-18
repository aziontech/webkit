<script setup>
  import claudeSymbol from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import itauExtendedReversed from '@aziontech/webkit/assets/itau-extended-reversed.webp'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import CompanyLogo from '@aziontech/webkit/company-logo'

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
      <CompanyLogo
        name="Netshoes"
        :src="netshoesExtendedReversed"
        :src-light="netshoesExtendedColor"
        :variant="row.variant"
        class="max-w-32"
      />
      <CompanyLogo
        name="Itaú"
        :src="itauExtendedReversed"
        artwork="light"
        :variant="row.variant"
        class="max-w-32"
      />
      <CompanyLogo
        name="Claude"
        :src="claudeSymbol"
        :variant="row.variant"
      />
      <CompanyLogo
        name="Acme Inc."
        :variant="row.variant"
      />
    </div>
  </div>
</template>
