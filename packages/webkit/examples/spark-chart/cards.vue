<script setup>
  import SparkChart from '@aziontech/webkit/spark-chart'
</script>

<template>
  <ul
    class="flex w-full max-w-(--container-md) flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <li
      class="flex items-center gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-label-md text-(--text-default)">Requests</span>
        <span class="truncate text-label-sm text-(--text-muted)">Edge Application</span>
      </div>
      <div class="w-24 shrink-0">
        <SparkChart
          size="small"
          color="success"
          :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
        />
      </div>
      <span class="w-16 shrink-0 text-right text-label-md text-(--text-default) tabular-nums"
        >3.4M</span
      >
      <span class="w-14 shrink-0 text-right text-label-sm text-(--success-contrast) tabular-nums"
        >+8.2%</span
      >
    </li>
    <li
      class="flex items-center gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-label-md text-(--text-default)">Blocked threats</span>
        <span class="truncate text-label-sm text-(--text-muted)">Edge Firewall</span>
      </div>
      <div class="w-24 shrink-0">
        <SparkChart
          size="small"
          color="success"
          :values="[640, 610, 650, 580, 560, 590, 520, 500, 470, 480, 430, 410]"
        />
      </div>
      <span class="w-16 shrink-0 text-right text-label-md text-(--text-default) tabular-nums"
        >48.2K</span
      >
      <span class="w-14 shrink-0 text-right text-label-sm text-(--success-contrast) tabular-nums"
        >-12.4%</span
      >
    </li>
    <li
      class="flex items-center gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-label-md text-(--text-default)">Cache hit ratio</span>
        <span class="truncate text-label-sm text-(--text-muted)">Edge Cache</span>
      </div>
      <div class="w-24 shrink-0">
        <SparkChart
          size="small"
          color="success"
          :values="[91.2, 91.8, 92.4, 92.1, 93.0, 93.6, 94.1, 93.9, 94.8, 95.3, 95.8, 96.2]"
        />
      </div>
      <span class="w-16 shrink-0 text-right text-label-md text-(--text-default) tabular-nums"
        >96.2%</span
      >
      <span class="w-14 shrink-0 text-right text-label-sm text-(--success-contrast) tabular-nums"
        >+1.6%</span
      >
    </li>
    <li class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-sm)">
      <div class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-label-md text-(--text-default)">Origin latency</span>
        <span class="truncate text-label-sm text-(--text-muted)">p95, origin fetch</span>
      </div>
      <div class="w-24 shrink-0">
        <SparkChart
          size="small"
          color="success"
          :values="[182, 176, 190, 171, 168, 160, 164, 152, 149, 141, 138, 132]"
        />
      </div>
      <span class="w-16 shrink-0 text-right text-label-md text-(--text-default) tabular-nums"
        >132 ms</span
      >
      <span class="w-14 shrink-0 text-right text-label-sm text-(--success-contrast) tabular-nums"
        >-4.3%</span
      >
    </li>
  </ul>
</template>
