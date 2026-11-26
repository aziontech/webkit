<script setup>
  import Avatar from '@aziontech/ui/avatar'

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
        variant="square"
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
        variant="square"
        size="large"
      />
    </div>
  </div>
</template>
