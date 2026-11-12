<script setup>
  import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <div>
    <SectionModule
      :divided="false"
      title="First module"
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Its top edge belongs to the hero above it, so it draws none.
      </p>
    </SectionModule>
    <SectionModule title="Second module">
      <p class="m-0 text-body-md text-(--text-muted)">
        This one draws the rule that divides the two.
      </p>
    </SectionModule>
  </div>
</template>
