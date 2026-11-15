<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar variant="centered">
    <template #actions>
      <Button
        type="button"
        label="Cancel"
        variant="outline"
        size="medium"
      />
      <Button
        label="Create"
        variant="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
