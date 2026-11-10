<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar kind="plain">
    <template #actions>
      <Button
        type="button"
        label="Cancel"
        kind="outlined"
        size="medium"
      />
      <Button
        label="Save"
        kind="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
