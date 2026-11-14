<script setup>
  import Avatar from '@aziontech/webkit/avatar'

  const organizations = ['Acme Inc.', 'Acme Labs', 'Acme Store']
  const blue = ['var(--accent)', 'var(--info)', 'var(--success)']
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div class="flex items-center gap-(--spacing-sm)">
      <Avatar
        v-for="name in organizations"
        :key="name"
        :label="name"
        pattern="marble"
        kind="square"
        size="large"
      />
    </div>
    <div class="flex items-center gap-(--spacing-sm)">
      <Avatar
        v-for="name in organizations"
        :key="name"
        :label="name"
        :colors="blue"
        pattern="marble"
        kind="square"
        size="large"
      />
    </div>
  </div>
</template>
