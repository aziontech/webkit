<script setup lang="ts">
  // Drawn rather than traced: the source file embedded a raster, and this mark is pure
  // geometry — a nucleus and three orbits at 60 degrees, so it is exact at any size.
  defineOptions({ name: 'BrandMarkReact', inheritAttrs: false })
</script>

<template>
  <svg
    v-bind="$attrs"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="2.05"
    />
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="1"
    >
      <ellipse
        cx="12"
        cy="12"
        rx="11"
        ry="4.2"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="11"
        ry="4.2"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="11"
        ry="4.2"
        transform="rotate(120 12 12)"
      />
    </g>
  </svg>
</template>
