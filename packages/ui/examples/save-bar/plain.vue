<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar variant="plain">
    <template #actions>
      <Button
        type="button"
        label="Cancel"
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
