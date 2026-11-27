<script setup>
  import Kbd from '@aziontech/ui/kbd'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm) text-body-sm text-(--text-default)">
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Kbd :keys="['meta', 'shift', 'p']" />
      <Kbd
        :keys="['meta', 'shift', 'p']"
        variant="separate"
      />
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Kbd
        :keys="['arrow-up', 'arrow-down']"
        variant="separate"
        size="small"
      />
      <span>to navigate</span>
      <Kbd
        key-name="return"
        size="small"
      />
      <span>to select</span>
      <Kbd
        key-name="escape"
        size="small"
      />
      <span>to close</span>
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Kbd
        :keys="['arrow-left', 'arrow-right']"
        variant="separate"
      />
      <span>to switch tabs</span>
    </div>
  </div>
</template>
