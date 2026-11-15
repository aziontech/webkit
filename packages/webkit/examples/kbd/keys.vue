<script setup>
  import Kbd from '@aziontech/webkit/kbd'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm) text-body-sm text-(--text-default)">
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Kbd :keys="['meta', 'shift', 'p']" />
      <Kbd
        :keys="['meta', 'shift', 'p']"
        kind="separate"
      />
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Kbd
        :keys="['arrow-up', 'arrow-down']"
        kind="separate"
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
        kind="separate"
      />
      <span>to switch tabs</span>
    </div>
  </div>
</template>
