<script setup>
  import Module from '@aziontech/webkit/module'
</script>

<template>
  <div>
    <Module
      :divided="false"
      title="First module"
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Its top edge belongs to the hero above it, so it draws none.
      </p>
    </Module>
    <Module title="Second module">
      <p class="m-0 text-body-md text-(--text-muted)">
        This one draws the rule that divides the two.
      </p>
    </Module>
  </div>
</template>
