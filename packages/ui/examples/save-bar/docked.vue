<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar variant="docked">
    Project settings changed.
    <span class="text-(--text-muted)">Saving publishes them on the next deployment.</span>
    <template #actions>
      <Button
        type="button"
        label="Discard"
        variant="outline"
        size="medium"
      />
      <Button
        label="Save"
        variant="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
