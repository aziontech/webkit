<script setup>
  import QrCode from '@aziontech/ui/qr-code'
</script>

<template>
  <div class="flex flex-wrap items-end gap-(--spacing-lg)">
    <QrCode
      v-for="size in ['small', 'medium', 'large']"
      :key="size"
      value="https://www.azion.com/en/documentation/"
      :size="size"
      :aria-label="`QR code, ${size}, to the Azion documentation`"
    />
  </div>
</template>
