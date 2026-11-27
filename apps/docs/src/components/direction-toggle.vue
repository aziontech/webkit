<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Tooltip from '@aziontech/ui/tooltip'

  import { messages } from '../lib/i18n'
  import { settings } from '../lib/settings'

  const t = messages

  function toggleDirection() {
    settings.dir = settings.dir === 'rtl' ? 'ltr' : 'rtl'
  }
</script>

<template>
  <Tooltip :content="t.rightToLeft">
    <Button
      label="RTL"
      variant="outline"
      size="medium"
      :aria-label="`RTL, ${t.rightToLeft}`"
      :aria-pressed="settings.dir === 'rtl'"
      class="shrink-0 aria-pressed:bg-(--bg-selected)"
      data-docs-direction
      @click="toggleDirection"
    />
  </Tooltip>
</template>
